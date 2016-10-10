var indexController = require("../controllers/index.js");

module.exports = function(app, queue) {
  /* GET home page. */
  app.get('/', indexController.getIndex);

};
