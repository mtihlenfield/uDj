var music = require("../models/music.js");

module.exports = (function() {

    var getIndex = function(req, res, next) {
      res.render('index', { title: 'uDj'});
    };

    return {
        getIndex: getIndex
    };
})();
