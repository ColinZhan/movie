var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');

/*编译生成Comment模型 */
var Comment = mongoose.model('Comment', CommentSchema);

Comment.statics = {
	/* 编写静态方法 */
};

module.exports = Comment;
