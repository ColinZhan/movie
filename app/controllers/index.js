var Movie = require('../models/movie');
var Category = require('../models/category');
var moment = require('moment');
var request = require('request');
var fs = require('fs');
var path = require('path');


/* GET home page. */
exports.index = function(req, res, next) {
  // 最近热门时间范围
  var end = moment(Date.now());
  var start = moment(Date.now()).subtract(5, 'year');
   // 5条最近5年的热门电影 轮播
  Movie.where('meta.createAt').gte(start).lte(end).limit(5).sort({'pv': 'desc'}).exec( function( err, hotm ) {
      if(err) console.log(err);
      // 12条最新上架
      Movie.find().limit(24).sort({'meta.createAt': 'desc', 'pv': 'desc'}).exec( function( err, newm ) {
        if( hotm && newm ){
          res.render('pages/index', {
            title: 'COLIN电影网',
            hotm: hotm,
            newm: newm,
            route: 'index'
          });
        }
      });
  });
};

/* GET list by cat.Category */
exports.list = function(req, res, next) {
  Category
    .find().limit(12).sort({'meta.updateAt': 'desc'})
    .populate({ path: 'movies', options: { limit: 6 } })
    .exec(function(err, categories){
      if(err) console.log(err);

      if(categories){
        res.render('pages/list', {
          title: '电影',
          categories: categories,
          route: 'list'
        });
      }
    });
};



/* GET douban 250*/
exports.douban = function(req, res, next) {
  var page = req.query.p ? parseInt(req.query.p) : 0;  //要查询的页码，数字化，如果req.query.p找不到，则默认为0
  var count = 9;                              //每页数据条数
  var index = page * count;
  var totalPage = 28;

  // 请求豆瓣的API
  request('https://api.douban.com/v2/movie/top250?start='+ index +'&count='+count, function (err, response, body) {
      if(err) console.log(err);
      // 将响应的数据转换为json对象

      body = JSON.parse(body) || {};
      // console.log(page+','+totalPage)
      res.render('pages/douban', {
        title: '豆瓣TOP250',
        movies: body.subjects,
        route: 'douban',
        currentPage: parseInt(page)+1,    //当前页码
        totalPage: totalPage,             //总页数
        rank: index+1,
      });
  });

};


/* GET about  */
exports.about = function(req, res, next) {

  res.render('pages/about', {
    title: '关于',
    route: 'about'
  });

};




/* GET search. */
exports.search = function(req, res) {
  var catId = req.query.cat;
  var key = req.query.key;
  var page = parseInt(req.query.p, 10) || 0;  //要查询的页码，数字化，如果req.query.p找不到，则默认为0
  var count = 6;                              //每页数据条数
  var index = page * count;

  if(catId){
    /* 查询到类别名称后，分页查询电影 */
    Category.findOne({_id: catId}, function(err, category){
      if(err) console.log(err);

      if(category){
        /* 总页数，取整 */
        var totalPage = Math.ceil(category.movies.length / count);

        Movie.find({category: catId})       //按类型查询电影
          .skip(page*count)                 //跳过的条数
          .limit(count)                     //条数
          .sort({'meta.updateAt': 'desc', 'pv':'desc'})
          .exec(function(err, movies){
            if(err) console.log(err);

            if(movies){
              res.render('pages/results', {
                title: '搜索结果' ,
                keyword: category.name,
                currentPage: (page+1),        //当前页码
                totalPage: totalPage,         //总页数
                query: 'cat='+ catId,
                movies: movies
              });
            }
          });
      }

    });
  }else{
    Movie
      //实例化一个正则，利用正则完成模糊查询
      .find({title: new RegExp(key+ '.*', 'i')})
      .sort({'meta.updateAt': 'desc', 'pv':'desc'})
      .exec(function(err, movies){
        if(err) console.log(err);

        if(movies){
          var results = movies.slice(index, index+count);
          res.render('pages/results',{
            title: '搜索结果',
            keyword: key,
            currentPage: (page+1),
            query: 'key='+ key,
            totalPage: Math.ceil(movies.length / count),
            movies: results
          });
        }
      });
  }

};
/**
 * 上传图片
 */
exports.savePhoto = function(req, res, next) {
  var photo = req.files.photo;

  var filePath = photo.path;
  var originalFilename = photo.originalFilename;


  console.log(req.files);
  if(originalFilename) {
    fs.readFile(filePath, function(err, data){
      console.log(data);
      var timestamp = Date.now();
      var type = photo.type.split('/')[1];

      var pho = timestamp + '.' + type;

      var newpath = path.join(__dirname, '../../', 'public/upload/' + pho);

      fs.writeFile(newpath, data, function(err) {
        req.photo = pho;
        next();
      })

    });
  }
  else {
    next();
  }
}
