const info = require("./info.json");

module.exports = {

  getMessageAsArgs: function (message)
  {
    return message.content.toLowerCase().substring(info.prefix.length).split(" ");
  },

  messageMatchPrefix: function (message)
  {
    return message.content.toLowerCase().substring(0, info.prefix.length).toLowerCase() == info.prefix;
  },

  shuffle: function (a)
  {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }
}
