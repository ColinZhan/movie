var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');			//专门为密码存储设计的算法
var SALT_WORK_FACTOR = 10;						//加密计算强度（越大，破解越困难）

var UserSchema = new mongoose.Schema({
	//用户名
	name: {
		unique: true,
		type: String
	},
	//昵称
	nick: String,
	//密码
	password: String,
	//0:nomal,
	//1:verified,
	//2:professional
	//>10:admin
	//>50:super admin
	role: {
		type: Number,
		default: 0
	},
	//性别，1：男，0：女，默认男
	sex: {
		type: Number,
		default: 1
	},
	//出生日期
	birthAt:{
		type: Date,
		default: Date.now()
	},
	portrait:String,
	//时间戳
	meta: {
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
UserSchema.pre('save', function(next){
	var user = this;	//当前用户

	if(this.isNew){		//是新添加的数据，否则只更改更新时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}

	/*
	 生成一个随机的yan
	 */
	bcrypt.genSalt( SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);

			user.password = hash;
			next();
		});
	});

	next();
});


UserSchema.methods = {
	comparePassword: function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err) return cb(err);	//将错误包装到回调方法中返回
			else cb(null, isMatch);		//将错误设成null，返回对比结果
		});
	},

	getSex: function(ind) {
		if(ind == 0) return '女';
		else if(ind == 1) return '男';
		else return '你猜';
	}
};

module.exports = UserSchema;
