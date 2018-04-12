var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');              //

/* GET detail. */
exports.detail = function(req, res) {
  var id = req.params.id;

  Movie.update({_id:id}, {$inc: {pv: 1}}, function(err){
    if(err) console.log(err);
  });
  Movie.findOne({_id: id}, function(err, movie){
    if(movie){
      Comment
        .find({movie:id})                           //找到评论过这部电影的评论数据
        .populate('from', 'nick portrait')                   //通过populate方法对每个评论的数据，根据from里userid去用户表里查，将查到的数据填充到name里返回，下同
        .populate('reply.from reply.to', 'nick portrait')
        .exec(function(err, comments){
          if(err) console.log(err);
          res.render('pages/detail', {
            title: "《" + movie.title + "》",
            movie: movie,
            comments: comments
        });
      });
    }
  });
};


/* GET list. */
exports.list = function(req, res, next) {
  var page = parseInt(req.query.p, 10) || 0;    //要查询的页码，数字化，如果req.query.p找不到，则默认为0
  var num = 10;                               //每页数据条数
  var index = page * num;

  Movie.count({}, function(err, count) {
    Movie.find({}).skip(page* num).limit(num).sort({
      'meta.updateAt': -1,
      'pv': -1
    }).exec(function(err, movies){
      if(err){ console.log(err); }

      if(movies){
        // 总页数
        var totalPage = Math.ceil(count / num);

        res.render( 'pages/admin/list' , {
          title: '电影列表',
          currentPage: ( page + 1 ),        //当前页码
          totalPage: totalPage,                 //总页数
          movies: movies,
        });
      }

    });
  });

};


/* GET admin. */
exports.new = function(req, res) {
  Category.find({}, function(err, categories){
    res.render('pages/admin/admin', {
      title: '新增电影',
      categories: categories,
      movie: {}
    });
  });
};



  // doctor: [String],
  // actor: [String],
  // language: [String],
  // country: [String],
//admin post movie
exports.save = function(req, res){
  var movieObj = req.body.movie;

  movieObj.doctor = movieObj.doctor.split(',');
  movieObj.actor = movieObj.actor.split(',');
  movieObj.language = movieObj.language.split(',');
  movieObj.country = movieObj.country.split(',');

  var id = movieObj._id;
  var _movie;


  // 上传图片
  if(req.photo) { movieObj.photo = req.photo; }

  // console.log(movieObj);

  if(id){   //数据库已存在 -> 更新
    Movie.findOne({_id: id}, function(err, movie){
      if(err) console.log(err);

      /* underscore的extend方法：一个对象里新的数据替换老数据 */
      _movie = _.extend(movie, movieObj);

      _movie.save(function(err, movie) {
        if(err) console.log(err);

        res.redirect('/movie/'+ movie._id);
      });
    });
  }
  else{   //数据库不存在 -> 新增
    _movie = new Movie(movieObj);

    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;

    _movie.save(function(err, movie){
      if(err) console.log(err);

      if(categoryId){   //电影类别已存在
        Category.findOne({_id: categoryId}, function(err, category){
          /* 将该条电影的id 压入到所属类型category里的movies数组里 */
          category.movies.push(movie._id);

          /* 保存更新后的类别 */
          category.save(function(err, category){
            if(err) console.log(err);
            /* 保存后跳转 */
            res.redirect('/movie/'+ movie._id);
          });
        });
      }
      else if(categoryName){    //新类别
        /* 初始化一个新类别 */
        var category = new Category({
          name: categoryName,
          movies: [movie._id]
        });

        /* 存储新类别，
         _id为MongoDB自动生成，
         故在更新movie的category后需重新存储movie
        */
        category.save(function(err, category) {
          movie.category = category._id;
          movie.save(function(err, movie){
            res.redirect('/movie/'+ movie._id);
          });
        });
      }
    });
  }
};

//admin update movie
exports.update = function(req, res){
  var id = req.params.id;

  if(id){
    Movie.findOne({_id: id}, function(err, movie){
      if(err) console.log(err);

      Category.find({}, function(err, categories){
        if(err) console.log(err);

        res.render('pages/admin/admin', {
          title:'修改电影信息',
          movie: movie,
          categories: categories
        });
      });
    });
  }
};

//admin delete movie
exports.del = function(req, res){
  var id = req.query.id;

  if(id){
    Movie.findOne({_id: id}, function(err, del_movie){
      if(err) console.log(err);

      /* 存在该条电影数据 */
      if(del_movie){
        var movie_id = del_movie._id;               //被删除的电影的id
        var category_id = del_movie.category;       //所属的类型的id

        /* 移除对应类别的字段movies中的该电影的_id */
        //$pull原子操作，移除数组中对应的一项
        Category.update({_id: category_id},{$pull: {movies: movie_id}}, function(err){
          if(err) console.log(err);

          Movie.remove({_id: id}, function(err){
            if(err){
              console.log(err);
            }
            else{
              res.json({success: 1});
            }
          });

        });
      }
    });
  }

};
