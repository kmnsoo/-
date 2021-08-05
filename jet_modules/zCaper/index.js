module.exports = {
   // db -> user : plain text
   forHtml: function (text) {
      return text && text.toString()
            .replace(/&amp;/g, '&')
            .replace(/``/g, '\"')
            .replace(/`/g, '\'')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
   },
   forPlain: function (text) {
      return text && text.toString()
         .replace(/&amp;/g, '&')
         .replace(/``/g, '\"')
         .replace(/`/g, '\'')
         .replace(/&gt;/g, '>')
         .replace(/&lt;/g, '<')
         .replace(/script/g, '')
         .replace(/img/g, '')
         .replace(/src/g, '')
         .replace(/alert/g, '')
         .replace(/import/g, '')
         .replace(/link/g, '')
         .replace(/rel/g, '')
         .replace(/onerror/g, '')
         .replace(/onclick/g, '')
   },
   // user -> db : plain text
   forSave: function (text) {
      return text && text.toString()
            .replace(/&/g, '&amp;')
            .replace(/"/g, '``')
            .replace(/'/g, '`')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/script/g, '')
            .replace(/img/g, '')
            .replace(/src/g, '')
            .replace(/alert/g, '')
            .replace(/import/g, '')
            .replace(/link/g, '')
            .replace(/rel/g, '')
            .replace(/onerror/g, '')
            .replace(/onclick/g, '')
   }
};

