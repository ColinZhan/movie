var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
	name: String,
	/* 属于此类的电影的id */
	movies: [{type: ObjectId, ref: 'Movie'}],
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
CategorySchema.pre('save', function(next){
	if(this.isNew){		//是新添加的数据，否则只更改更新时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

module.exports = CategorySchema;
