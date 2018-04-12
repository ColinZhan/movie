var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * 利用mongoose封装的Populate方法
 * 引用另外一个schema，获取document时通过populate方法让mongoose根据objectid获取
 * 文档、模型、req对象都可使用
 * path 空格分割的引用字段的名称
 * select 填充引用document中的哪些字段
 * match  （可选）指定附加的查询条件
 * model  （可选）指定引用的model
 * options（可选）指定附加的其他查询条件，比如：排序，条数限制
 */
var CommentSchema = new mongoose.Schema({
	movie: {type: ObjectId, ref:'Movie'},	//评论的电影
	from: {type: ObjectId, ref:'User'},		//评论人
	reply: [{								//回复
		from: {type: ObjectId, ref:'User'},
		to: {type: ObjectId, ref: 'User'},		//回复给另一条评论，指向另一个评论人
		content: String
	}],
	content: String,
	meta:{
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//每次执行都会调用，时间更新操作
CommentSchema.pre('save', function(next){
	if(this.isNew){		//是新添加的数据，否则只更改更新时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

module.exports = CommentSchema;
