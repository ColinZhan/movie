var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
	title: String,
	//导演，演员，语种，国家字段都可以用下面的 双向关联 写法
	//考虑到网站的已维护性及要新建的数据文档之多
	//直接用了数组的写法
	doctor: [String],
	actor: [String],
	language: [String],
	country: [String],

	summary: String,
	flash: String,
	poster: String,
	poster: String,
	photo: String,
	year: Number,
	pv: {type: Number, default: 0},
	category: {type: ObjectId, ref: 'Category'},		//双向关联
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
MovieSchema.pre('save', function(next){
	if(this.isNew){		//是新添加的数据，否则只更改更新时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

module.exports = MovieSchema;
