var Comment = require('../models/comment');

//comment
exports.save = function(req, res){
  var _comment = req.body.comment;
  var movieId = _comment.movie;

  /* _comment 页面传入的表单数据
      comment 用_id（即传入的_comment.cid）查到的被回复的评论
   */
  if(_comment.cid){

    Comment.findOne({_id: _comment.cid}, function(err, comment){
      if(err) console.log(err);
      /* 调试代码 */
      // console.log(_comment);
      // console.log(comment);

      /* 初始化一个reply对象，并填充传入的表单数据 */
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      };

      /* 将reply数组压入comment */
      comment.reply.push(reply);

      /* 回复已被压入comment的reply数组内，再存储 */
      comment.save(function(err, comment){
        if(err) console.log(err);
        res.redirect('/movie/'+ movieId);
      });
    });
  }
  else{  //不是回复评论
    var comment = new Comment(_comment);

    comment.save(function(err, comment){
      if(err) console.log(err);
      res.redirect('/movie/'+ movieId);
    });
  }

};

