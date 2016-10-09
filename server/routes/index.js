var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'uDj'});
});

router.post('/api', function(req, res, next){
    console.log(req.body);
});


module.exports = router;
