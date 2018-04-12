module.exports = function(grunt){

	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				option: {
					livereload: true 		//有更改就重新启动
				}
			},
			js: {
				files: [
					'public/js/**',
					'models/**/*.js',
					'schemas/**/*.js',
					'routes/*.js',
					'app.js'
				],
				//tasks: ['jshint'],		//语法检查
				option: {
					livereload: true
				}
			}
		},
		jshint: {
			option: {
				jshintrc: '.jshintrc',
				ignores: ['public/bower_components/**/*.js']
			},
			all: ['test/**/*.js', 'app/**/*.js']
		},
		less: {
			development: {
				option: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'public/build/css/index.css': 'public/less/index.less',
					'public/build/css/datepicker.min.css': 'public/less/datepicker.less',
					'public/build/css/sweetalert.min.css': 'public/less/sweetalert.less'
				}
			}
		},
		uglify: {
			development: {
				files: {
					'public/build/js/admin.min.js': 'public/js/admin.js',
					'public/build/js/detail.min.js': [
						'public/js/detail.js'
					],
					'public/build/js/common.min.js': [
						'public/js/datepicker.js',
						'public/js/sweetalert.js',
						'public/js/i18n/datepicker.ch.js',
						'public/js/i18n/datepicker.en.js'
					]
				}
			}
		},
		nodemon: {
			dev: {
				option: {
					file: 'bin/www',		//当前入口文件
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,		//若有大片文件需要重新编译，不必逐一在每个文件改动时重启，而是在等待一个时间后重启（编译）
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		mochaTest: {
			option: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},
		concurrent: {	//同步进行
			tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
			option: {
				logConcurrentOutput: true
			}
		}
	});

	/*
	 只要有文件添加删除修改，就会重新执行在里面注册好的任务。
	*/
	grunt.loadNpmTasks('grunt-contrib-watch');

	/*
	 用于实时监听入口文件，入口文件出现改动时会自动重启服务
	*/
	grunt.loadNpmTasks('grunt-nodemon');

	/*
	 针对慢任务开发的插件，
	 慢任务：sass、less的编译，优化他们的构建时间，
	 同时可以用来跑多个阻塞的任务（比如watch和nodeman）
	*/
	grunt.loadNpmTasks('grunt-concurrent');

	/*
	 单元测试
	 */
	grunt.loadNpmTasks('grunt-mocha-test');

	/*
	 代码规范
	 */
	grunt.loadNpmTasks('grunt-contrib-jshint');

	/*
	 js压缩
	 */
	grunt.loadNpmTasks('grunt-contrib-uglify');

	/*
	 less编译
	 */
	grunt.loadNpmTasks('grunt-contrib-less');

	/*
	 便于开发时不会因为语法的错误、警告 中断整个grunt服务
	*/
	grunt.option('force', true);

	/*
	 注册任务，（任务名称，[要调用的任务]）
	 */
	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('test', ['mochaTest']);



}
