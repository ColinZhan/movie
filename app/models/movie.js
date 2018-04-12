var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');

/*编译生成Movie模型 */
var Movie = mongoose.model('Movie', MovieSchema);


module.exports = Movie;
