var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');			//专门为密码存储设计的算法

//user signup
exports.signup = function(req, res){
	//获取输入的user对象 req.param('user')
	//req.param.userid （/user/signup/:userid）也同时取到post和get传递的数据，慎用
	//req.query.userid （/user/singup/111?userid=1112)
	//req.body.userid （ajax, post）
	var _user = req.body.user;

	User.findOne({name: _user.name}, function(err, user){
		if(err) console.log(err);

		if(user){
			//用户已存在，重定向到登录页面
			return res.redirect('/signin');
		}
		else{
			// 上传图片
			if(req.photo) { _user.portrait = req.photo; }

			user = new User(_user);
			// console.log(user);
			user.save(function(err, user){
				if(err) console.log(err);

				res.redirect('/');
			});
		}
	});
};

//user signin
exports.signin = function(req, res){
	var _user = req.body.user;
	var password = _user.password;

	User.findOne({name: _user.name}, function(err, user){
		if(err) console.log(err);
		if(!user) return res.redirect('/signup');

		/* 验证密码 */
		user.comparePassword(password, function(err, isMatch){
			if(err) console.log(err);


			console.log(isMatch);

			if(isMatch){
				req.session.user = user;		//保存用户登录信息
				return res.redirect('/');
			}
			else{
				console.log('password is not match');
				return res.redirect('/signin');
			}
		});
	});
};

//show signup
exports.showSignup = function(req, res){
	res.render('pages/signup', {
		title: '注册'
	});
};

//show signin
exports.showSignin = function(req, res){
	res.render('pages/signin', {
		title: '登录'
	});
};

// 个人信息
exports.profile = function(req, res){
	res.render('pages/profile', {
		title: '个人信息'
	});
};
// 用户更新信息
exports.changeinfo = function(req, res){
	// 登录用的session值
	var _user = req.session.user;
	// 查询数据库
	User.findOne({_id: _user._id}, function(err, user){
		if(err) console.log(err);
		// 存在此用户
		if(user){
			// 上传头像
			if(req.photo) { _user.portrait = req.photo; }
			// 修改昵称
			_user.nick = req.body.user.nick;
			// console.log(user);
			// 更新信息
			User.update({_id: user.id}, {$set: {nick: _user.nick,portrait: _user.portrait}}, function(err){
				if(err) console.log(err);
				// 响应
				return res.redirect('/profile');
			});

		}
		else{ return res.redirect('/signin'); }

	});
};
// 修改密码
exports.changepwd = function(req, res){
	// 登录用的session值
	var _user = req.session.user;
	// 明文密码
	_user.password = req.body.newpassword;

	// console.log(req.body.newpassword);
	// 查询数据库
	User.findOne({_id: _user._id}, function(err, user){
		if(err) console.log(err);
		// 存在此用户
		if(user){
			// 生成一个随机的盐（强度10需要和Schemas里面的定义的值保持一致）
			bcrypt.genSalt( 10, function(err, salt){
				if(err) return next(err);
				// 加密
				bcrypt.hash( _user.password, salt, null, function(err, hash){
					if(err) return next(err);
					// 更新密码
					User.update({_id: user.id}, {$set: {password: hash}}, function(err){

						if(err) console.log(err);
						// 响应
						// console.log();
						else res.json({success: 1});

					});
				});
			});

		}
		// 用户不存在
		else{ return res.redirect('/signin'); }

	});
};



/* GET user list. */
exports.list = function(req, res, next) {
	var page = parseInt(req.query.p, 10) || 0;		//要查询的页码，数字化，如果req.query.p找不到，则默认为0
	var count = 10;									//每页数据条数
	var index = page * count;

	User.find({}).skip(page* count).limit(count).sort({'meta.createAt': 'desc'})
		.exec(function(err, users){
			if(err){ console.log(err);}

			if(users){
				var totalPage = 1 || Math.ceil(users.length / count);
				res.render('pages/admin/user_list', {
					title: '用户列表',
					currentPage: (page+1),        //当前页码
					totalPage: totalPage,         //总页数
					route: 'adminuser',
					users: users
				});
			}
	});

};

/* GET logout */
exports.logout = function(req, res){
	delete req.session.user;		//删除session
	//delete app.locals.user;		//删除本地数据
	res.redirect('/');
};

/* 登录验证
 */
exports.signinRequired = function(req, res, next){
	var user = req.session.user;

	if(!user) return res.redirect('/signin');
	next();
};
/* 权限验证
 */
exports.adminRequired = function(req, res, next){
	var user = req.session.user;

	if(user.role < 10) return res.redirect('/signin');

	next();
};

/* 删除用户
 */
exports.del = function(req, res) {
	var id = req.query.id;

	if(id){
		User.findOne({_id: id}, function(err, del_user){
			if(err) console.log(err);

			/* 存在该用户则删除 */
			if(del_user){
				User.remove({_id: id}, function(err){
					// 删除失败
					if(err){ console.log(err); }
					// 成功删除 返回标识（json）
					else{ res.json({success: 1}); }
				});
			}
		});
	}
};


/* 设置用户权限
 */
exports.setrole = function(req, res) {
	var user = req.body.user;

	if(user.id){
		User.findOne({_id: user.id}, function(err){
			if(err) console.log(err);

			// 更新用户权限值
			User.update({_id: user.id}, {$set: {role: user.role}}, function(err){
				if(err) console.log(err);

				res.redirect('/admin/user/list');
			});

			console.log('查无此用户！不能设置权限。');
		});
	}
};
