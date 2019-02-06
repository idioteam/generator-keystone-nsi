// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

const keystoned = require('keystoned');
keystoned.init({
	config: process.env.NODE_ENV,
	minify_js: true,
	sitemap: true,
});

keystone.init({
	'name': '<%= projectName %>',
	'brand': '<%= projectName %>',
	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '<%= viewEngine %>',

	'emails': 'templates/emails',
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': '<%= userModel %>',
});

//	Applica configurazioni
keystoned.config.init();

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	<% if (includeBlog) { %>posts: ['posts', 'post-categories'],
	<% } if (includeGallery) { %>galleries: 'galleries',
	<% } if (includeEnquiries) { %>enquiries: 'enquiries',
	<% } if (userModelPath.includes('-')) { %>'<%= userModelPath %>'<% } else { %><%= userModelPath %><% } %>: '<%= userModelPath %>',
});

// Start Keystone to connect to your database and initialise the web server
keystone.start({
	onMount: function () {
		if (keystone.get('env') === 'production' && keystoned.minify_js) {
			keystoned.minify_js.minify();
		}
	}
});
