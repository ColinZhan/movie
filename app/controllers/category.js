var Category = require('../models/category');

/* GET category_admin. */
exports.new = function(req, res) {
	res.render('pages/admin/category_admin', {
		title: '新增电影类型',
		category: {}
	});
};

//admin post category
exports.save = function(req, res){
	var _category = req.body.category;

	var category = new Category(_category);

	category.save(function(err, category){
		if(err) console.log(err);

		res.redirect('/admin/category/list');
	});
};

//category list
exports.list = function(req, res){
	var page = parseInt(req.query.p, 10) || 0;  //要查询的页码，数字化，如果req.query.p找不到，则默认为0
	var count = 10;                              //每页数据条数
	var index = page * count;

	Category.find({}).skip(page* count).limit(count).sort({'meta.createAt': -1})
		.exec(function(err, categories){
			if(err) console.log(err);

			if(categories) {
				/* 总页数 (1或取整) */
				var totalPage = 1 || Math.ceil(categories.length / count);
				// var totalPage = 100;

				res.render('pages/admin/category_list', {
					title: '电影类型列表' ,
					currentPage: (page+1),        //当前页码
					totalPage: totalPage,         //总页数
					categories: categories
				});
			}
	});

};

