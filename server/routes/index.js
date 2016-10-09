var index = function(app, queue) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'uDj'});
  });
  
};

module.exports = index;
