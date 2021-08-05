module.exports = new function () {
   let buffer = [];
   this.in = function (index, string) {
      buffer.splice(index, 0, string);
   };
   this.ap = function (string) {
      buffer.push(string);
   };
   this.apl = function (string) {
      buffer.push(string + "\r\n");
   };
   this.toString = function () {
      return buffer.join('');
   };
   this.clear = function () {
      buffer = [];
   };
   this.isEmpty = function () {
      return (buffer.length == 0);
   }
};
