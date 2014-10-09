'use strict';

/**
 * Configure grunt
 */
module.exports = function(grunt) {
	// Load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Paths
	var paths = {
		app: 'application',
		dist: 'templates'
	};

	// Init configuration for grunt
	grunt.initConfig({
		// Paths
		paths: paths,

		// Watch files and live reload
		watch: {
			coffee: {
				files: ['<%= paths.app %>/javascripts/{,**/}*.coffee'],
				tasks: ['newer:coffee:dist', 'notify:coffee']
			},
			styles: {
				files: ['<%= paths.app %>/stylesheets/{,*/}*.css'],
				tasks: ['copy:styles', 'notify:styles']
			},
			less: {
				files: ['<%= paths.app %>/stylesheets/{,**/}*.less'],
				tasks: ['less:server', 'notify:less']
			},
			jade_shared: {
				files: ['<%= paths.app %>/shared/{,**/}*.{jade,yml}'],
				tasks: ['jade:dist', 'notify:jade']
			},
			jade: {
				files: ['<%= paths.app %>/{,*/}*.jade'],
				tasks: ['newer:jade:dist', 'notify:jade']
			},
			livereload: {
				options: {
					livereload: 35729
				},
				files: [
					'<%= paths.app %>/{,*/}*.html',
					'.tmp/{,*/}*.html',
					'.tmp/stylesheets/{,*/}*.css',
					'{.tmp,<%= paths.app %>}/javascripts/{,*/}*.{js,json}',
					'<%= paths.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// Local developement server
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							require('connect-livereload')({ port: 35729 }),
							connect.static(require('path').resolve('.tmp')),
							connect.static(require('path').resolve(paths.app))
						];
					}
				}
			}
		},

		// Open development server in browser
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},

		// Cleaning
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= paths.dist %>/*',
						'!<%= paths.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// LESS
		less: {
			server: {
				options: {
					paths: ['<%= paths.app %>/stylesheets'],
					dumpLineNumbers: 'comments'
				},
				files: {
					'.tmp/stylesheets/main.css': '<%= paths.app %>/stylesheets/main.less'
				}
			},
			distDevelop: {
				options: {
					paths: ['<%= paths.app %>/stylesheets'],
					dumpLineNumbers: 'comments'
				},
				files: {
					'<%= paths.dist %>/stylesheets/main.css': '<%= paths.app %>/stylesheets/main.less'
				}
			},
			distMaster: {
				options: {
					paths: ['<%= paths.app %>/stylesheets'],
					cleancss: true
				},
				files: {
					'<%= paths.dist %>/stylesheets/main.css': '<%= paths.app %>/stylesheets/main.less'
				}
			}
		},

		// Symlinking
		symlink: {
			components: {
				src: '<%= paths.app %>/components',
				dest: '.tmp/components'
			}
		},

		// Jade
		jade: {
			dist: {
				options: {
					pretty: true,
					data: function(dest, src) {
						var path = require('path');
						return grunt.file.readYAML('application/shared/config.yml');
					}
				},
				files: [{
					expand: true,
					cwd: '<%= paths.app %>',
					src: '{,*/}*.jade',
					dest: '.tmp',
					ext: '.html'
				}]
			}
		},

		// CoffeeScript
		coffee: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= paths.app %>/javascripts',
					src: '{,*/}*.coffee',
					dest: '.tmp/javascripts',
					ext: '.js'
				}]
			},
		},

		// RequireJS
		requirejs: {
			compile: {
				options: {
					'name': 'main',
					'baseUrl': '.tmp/javascripts',
					'mainConfigFile': '.tmp/javascripts/main.js',
					'out': '<%= paths.dist %>/javascripts/main.js',
					'optimize': 'uglify2'
				}
			}
		},

		// Imagemin
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= paths.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: '<%= paths.dist %>/images'
				}]
			}
		},

		// SVGmin
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= paths.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= paths.dist %>/images'
				}]
			}
		},

		// HTMLmin
		htmlmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= paths.app %>',
					src: '*.html',
					dest: '<%= paths.dist %>'
				}, {
					expand: true,
					cwd: '.tmp',
					src: '{,*/}*.html',
					dest: '<%= paths.dist %>'
				}]
			}
		},

		// Copy static files
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= paths.app %>',
					dest: '<%= paths.dist %>',
					src: [
						'*.{ico,png,txt}',
						'images/{,*/}*.{webp,gif}',
						'components/requirejs/require.js',
						'fonts/*.{eot,svg,ttf,woff}',
						'components/bootstrap/dist/fonts/*.{eot,svg,ttf,woff}'
					]
				}]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: '<%= paths.app %>/stylesheets',
				dest: '.tmp/stylesheets/',
				src: '{,*/}*.css'
			},
			javascripts: {
				expand: true,
				dot: true,
				cwd: '<%= paths.app %>/javascripts',
				dest: '.tmp/javascripts/',
				src: '{,*/}*.js'
			}
		},

		// Concurrent: Do some task at the same time to save some time
		concurrent: {
			server: [
				'coffee:dist',
				'jade:dist',
				'copy:styles'
			],
			dist: [
				'coffee',
				'copy:styles',
				'imagemin',
				'symlink',
				'svgmin',
				'htmlmin'
			]
		},

		// Notification
		notify: {
			coffee: {
				options: {
					message: 'CoffeeScript updated.'
				}
			},
			jade: {
				options: {
					message: 'Jade updated.'
				}
			},
			styles: {
				options: {
					message: 'Styles copied.'
				}
			},
			less: {
				options: {
					message: 'LESS updated.'
				}
			}
		}
	});

	// Task: server (while development)
	grunt.registerTask('server', function (target) {
		grunt.task.run([
			'clean:server',
			'less:server',
			'concurrent:server',
			'connect:livereload',
			'open',
			'watch'
		]);
	});

	// Task: build (while production)
	grunt.registerTask('build', function (target) {
		var less = ( target === 'production' ) ? 'less:distMaster' : 'less:distDevelop';

		grunt.task.run([
			'clean:server',
			'clean:dist',
			'jade:dist',
			'copy:javascripts',
			less,
			'concurrent:dist',
			'requirejs',
			'copy:dist'
		]);
	});

	// Default task
	grunt.registerTask('default', 'server');
}
