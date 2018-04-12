var User = require('../models/user');

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

/* GET user list. */
exports.list = function(req, res, next) {
	var page = parseInt(req.query.p, 10) || 0;		//要查询的页码，数字化，如果req.query.p找不到，则默认为0
	var count = 10;									//每页数据条数
	var index = page * count;

	User.find({}).skip(page* count).limit(count).sort({'meta.createAt': -1})
		.exec(function(err, users){
			if(err){ console.log(err);}

			if(users){
				var totalPage = 1 || Math.ceil(users.length / count);
				res.render('pages/admin/user_list', {
					title: '用户列表',
					currentPage: (page+1),        //当前页码
					totalPage: totalPage,         //总页数
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

			console.log('查无此用户！不能设置权限。')
		});
	}
};
