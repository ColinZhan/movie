var express = require('express');
var router = express.Router();
//加载控制器
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

//Index
router.get('/', Index.index);
router.get('/list', Index.list);
router.get('/douban', Index.douban);
router.get('/about', Index.about);
router.get('/results', Index.search);

//User
router.post('/user/signup', Index.savePhoto, User.signup);
router.post('/user/signin', User.signin);
router.post('/user/changeinfo', User.signinRequired, Index.savePhoto, User.changeinfo);
router.post('/user/changepwd', User.signinRequired, User.changepwd);
router.get('/signin', User.showSignin);
router.get('/signup', User.showSignup);
router.get('/logout', User.signinRequired, User.logout);
router.get('/profile', User.signinRequired, User.profile);
router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
router.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del);
router.post('/admin/user/setrole', User.signinRequired, User.adminRequired, User.setrole);

//Movie
router.get('/movie/:id', Movie.detail);
router.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
router.post('/admin/movie/new', User.signinRequired, User.adminRequired, Index.savePhoto, Movie.save);
router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
router.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

//Comment
router.post('/user/comment', User.signinRequired, Comment.save);

// //Category
// router.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
// router.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
// router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

module.exports = router;
