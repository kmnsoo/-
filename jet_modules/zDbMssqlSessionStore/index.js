var _ = require('underscore');
// var debug = require('debug')('mssql-session-store');
var util = require('util');
var sql = require('mssql');
let db = require('../zDb');

module.exports = function(session) {
  var Store = session.Store;

  var _extractFirstValue = function(recordset) {
    var value = recordset;
    while(value && _.isArray(value)) {
      value = value[0];
    }
    if (value && _.isObject(value)) {
      for(var key in value) {
        value = value[key];
        return value;    
      }
    }
  };
  let isEmpty = a => Array.isArray(a) && a.every(isEmpty);

  function MssqlStore(options) {
    var self = this;

    var options = options || {};
    Store.call(self, options);

    // if (!_.isUndefined(options.connection) && !(options.connection instanceof sql.Connection)) {
    //   throw new Error('If defined, options.connection must be instance of mssql.Connection.');
    // }
    if (!_.isUndefined(options.ttl) && !_.isNumber(options.ttl)) {
      throw new Error('If defined, options.ttl must be an instance of Number.');
    }
    else if (options.ttl <= 0) {
      throw new Error('If defined, options.ttl must be > 0.'); 
    }
    if (!_.isUndefined(options.reapInterval) && !_.isNumber(options.reapInterval)) {
      throw new Error('If defined, options.reapInterval must be an instance of Number.');
    }
    else if (options.reapInterval === 0 || options.reapInterval < -1) {
      throw new Error('If defined, options.reapInterval must a positive number or -1 to indicate no reaping.'); 
    }
    if (!_.isUndefined(options.reapCallback) && !_.isFunction(options.reapCallback)) {
      throw new Error('If defined, options.reapCallback must be a function.');
    }

    self.options = {
      ttl: options.ttl || 3600,
      reapInterval: options.reapInterval || 3600,
      reapCallback: options.reapCallback || _.noop
    };

    if (self.options.reapInterval !== -1) {
      self.reap();
      setInterval(self.reap.bind(self), self.options.reapInterval * 1000);
    }
  };

  util.inherits(MssqlStore, Store);

  MssqlStore.prototype.reap = function () {
    // debug('reap');
    var self = this;
    // var request = new sql.Request(self.options.connection);
    db.connection().then((pool) => {
        var request = pool.request();
        request.input('ttl', sql.Int, self.options.ttl);
        request.query('delete [Session] where lastTouchedUtc <= dateadd(second, -1 * @ttl, getutcdate());', self.options.reapCallback);
    }).catch(err => {
        console.dir(err);
    });
  };

  MssqlStore.prototype.get = function(sessionId, callback) {
    // debug('get', sessionId);
    var self = this;
    var stmt = 'select sessionData from [Session] where sessionId = @sessionId;';
    // var request = new sql.Request(self.options.connection);
    db.connection().then((pool) => {
        // console.log(`sessionId=[${sessionId}]`);
        var request = pool.request();
        request.input('sessionId', sql.NVarChar(450), sessionId);
        request.query(stmt, function(err, result) {
            if (err) return callback(err);
            // console.log('++++++++++++++++++++1');
            // console.dir(result.recordset);
            var data = _extractFirstValue(result.recordset);
            // if( isEmpty(data) ) data = null;
            // else data = result.recordset[(result.recordset.length-1)].recordset;
            // console.dir(data);
            if (data) {
                var session = null;
                try  {
                    session = JSON.parse(data);
                } catch(err) {
                    return callback(err);
                }
                // self.touch(sessionId, session, function(err) {
                //     callback(err, session);
                // }, self);
                callback(err, session);
            } else {
                callback();
            }
        });
    }).catch(err => {
        console.dir(err);
    });
  }

  MssqlStore.prototype.set = function(sessionId, session, callback) {
    // debug('set', sessionId, session);
    var self = this;
    var stmt = 'if exists(select sessionId from [Session] where sessionId = @sessionId)\
                  begin\
                    update [Session] set sessionData = @sessionData where sessionId = @sessionId;\
                  end\
                  else\
                  begin\
                    insert into [Session] (sessionId, sessionData, lastTouchedUtc) values(@sessionId, @sessionData, getutcdate());\
                  end';
    // var request = new sql.Request(self.options.connection);
    db.connection().then((pool) => {
        var request = pool.request();
        request.input('sessionId', sql.NVarChar(450), sessionId);
        request.input('sessionData', sql.NVarChar(sql.MAX), JSON.stringify(session));
        request.query(stmt, callback);
    }).catch(err => {
        console.dir(err);
    });
  };

  MssqlStore.prototype.destroy = function(sessionId, callback) {
    // debug('destroy', sessionId);
    var stmt = 'delete [Session] where sessionId = @sessionId';
    // var request = new sql.Request(self.options.connection);
    db.connection().then((pool) => {
        var request = pool.request();
        request.input('sessionId', sql.NVarChar(450), sessionId);
        request.query(stmt, callback);
    }).catch(err => {
        console.dir(err);
    });
  };

  MssqlStore.prototype.touch = function(sessionId, session, callback, _self) {
    // debug('touch', sessionId);
    var stmt = 'update [Session] set lastTouchedUtc = getutcdate() where sessionId = @sessionId';
    // var request = new sql.Request(self.options.connection);
    db.connection().then((pool) => {
        var request = pool.request();
        request.input('sessionId', sql.NVarChar(450), sessionId);
        request.query(stmt, callback);
        return this;
    }).catch(err => {
        console.dir(err);
    });
  };

  MssqlStore.prototype.length = function(callback) {
    // debug('length');
    var stmt = 'select count(*) from [Session]';
    // var request = new sql.Request(self.options.connection);
    db.connection().then((pool) => {
        var request = pool.request();
        request.query(stmt, function(err, recordset) {
        if (err) return callback(err);
        var length = _extractFirstValue(recordset) || 0;
        callback(null, length);
        });
    }).catch(err => {
        console.dir(err);
    });
  };

  MssqlStore.prototype.clear = function(callback) {
    // debug('clear');
    var stmt = 'delete [Session]';
    // var request = new sql.Request(self.options.connection);
    db.connection().then((pool) => {
        var request = pool.request();
        request.query(stmt, callback);
    }).catch(err => {
        console.dir(err);
    });
  };

  return MssqlStore;
};