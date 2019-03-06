var colors = require('colors'); // eslint-disable-line
var util = require('util');
var path = require('path');
var _ = require('lodash');
var utils = require('keystone-utils');
var crypto = require('crypto');
var yeoman = require('yeoman-generator');
require('./includesPolyfill');

var KeystoneGenerator = module.exports = function KeystoneGenerator (args, options, config) {

	// Set utils for use in templates
	this.utils = utils;
	this.auto = args.includes('auto');
	this.skipInstall = args.includes('skipInstall');

	// Initialise default values
	this.cloudinaryURL = false;
	//	Settato a true
	this.mailgunConfigured = true;
	this.mailgunAPI = false;
	this.mailgunDomain = false;

	// Apply the Base Generator
	yeoman.generators.Base.apply(this, arguments);

	// Welcome
	console.log('\nWelcome to KeystoneJS.\n');

	// This callback is fired when the generator has completed,
	// and includes instructions on what to do next.
	var done = _.bind(function done () {
		var cmd = (this.newDirectory ? '"cd ' + utils.slug(this.projectName) + '" then ' : '') + '"' + 'node keystone' + '"';
		console.log(
			'\n------------------------------------------------'
			+ '\n'
			+ '\nConfigurazione completata!'
/*
			+ '\n'
			+ '\nFor help getting started, visit https://keystonejs.com/getting-started/'

			+ ((this.includeEmail && !this.mailgunConfigured)
			? '\n'
			+ '\nWe\'ve included the setup for email in your project. When you'
			+ '\nwant to get this working, just create a mailgun account and put'
			+ '\nyour mailgun details into the .env file.'
			: '')

			+ ((this.usingDemoCloudinaryAccount)
			? '\n'
			+ '\nWe\'ve included a demo Cloudinary Account, which is reset daily.'
			+ '\nPlease configure your own account or use the LocalImage field instead'
			+ '\nbefore sending your site live.'
			: '')
*/
			+ '\n\nPer avviare il progetto, eseguire ' + cmd + '.'

			+ '\n');

	}, this);

	// Install Dependencies when done
	this.on('end', function () {

		this.installDependencies({
			bower: false,
			skipMessage: true,
			skipInstall: options['skip-install'] || this.skipInstall,
			callback: done,
		});

	});

	// Import Package.json
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

};

// Extends the Base Generator
util.inherits(KeystoneGenerator, yeoman.generators.Base);

KeystoneGenerator.prototype.prompts = function prompts () {

	var cb = this.async();

	if (this.auto) {
		this._projectName = 'Keystone Starter';
		this.projectName = 'keystone-starter';
		this.adminLogin = 'user@keystonejs.com';
		this.adminPassword = 'admin';
		this.viewEngine = 'pug';
		this.preprocessor = 'sass';
		this.userModel = 'User';
		this.userModelPath = utils.keyToPath(this.userModel, true);
		this.destinationRoot(utils.slug(this.projectName));
		this.includeEmail = true;
		this.includeBlog = true;
		this.includeGallery = true;
		this.usingDemoCloudinaryAccount = true;
		this.cloudinaryURL = 'cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo';
		this.includeGuideComments = true;
		this.includeEnquiries = true;
		this.newDirectory = true;
		return cb();
	}

	var prompts = {

		project: [
			{
				name: 'projectName',
				message: 'Qual\'è il nome del progetto?',
				default: 'My Site',
			}, /* {
				name: 'viewEngine',
				message: 'Quale template engine vuoi usare? Pug, Nunjucks, Twig or Handlebars ' + (('[pug | nunjucks | twig | hbs]').grey),
				default: 'pug',
			}, {
				name: 'preprocessor',
				message: 'Quale CSS pre-processor vuoi usare? ' + (('[less | sass | stylus]').grey),
				default: 'sass',
			}, {
				type: 'confirm',
				name: 'includeBlog',
				message: 'Vuoi includere un Blog?',
				default: true,
			}, {
				type: 'confirm',
				name: 'includeGallery',
				message: 'Vuoi includere una Image Gallery?',
				default: true,
			}, {
				type: 'confirm',
				name: 'includeEnquiries',
				message: 'Vuoi includere un Contact Form?',
				default: true,
			}, {
				name: 'userModel',
				message: 'Che nome vuoi dare al modello User?',
				default: 'User',
			}, {
				name: 'adminLogin',
				message: 'Inserisci una mail per l\'utente Admin:',
				default: 'idiotest@nsi.it',
			}, {
				name: 'adminPassword',
				message: 'Inserisci una password per l\'utente Admin:'
					+ '\n Please use a temporary password as it will be saved in plain text and change it after the first login.',
				default: 'Idio123-',
			}, */ {
				type: 'confirm',
				name: 'newDirectory',
				message: 'Vuoi creare una nuova directory per il progetto?',
				default: false,
			}, /* {
				type: 'confirm',
				name: 'includeEmail',
				message: '------------------------------------------------'
					+ '\n    Would you like to include Email configuration in your project?'
					+ '\n    We will set you up with an email template for enquiries as well'
					+ '\n    as optional mailgun integration',
				default: true,
			}, */
		],

		config: [],

	};

	this.prompt(prompts.project, function (props) {

		_.assign(this, props);

		// Keep an unescaped version of the project name
		this._projectName = this.projectName;
		// ... then escape it for use in strings (most cases)
		this.projectName = utils.escapeString(this.projectName);
		// Escape other inputs
		// Hardcoded!
		this.adminLogin = 'idiotest@nsi.it';
		this.adminLogin = utils.escapeString(this.adminLogin);
		//	Hardcoded!
		this.adminPassword = 'Idio123-';
		this.adminPassword = utils.escapeString(this.adminPassword);
		/*
                // Clean the viewEngine selection
                if (_.includes(['handlebars', 'hbs', 'h'], this.viewEngine.toLowerCase().trim())) {
                    this.viewEngine = 'hbs';
                } else if (_.includes(['twig', 't'], this.viewEngine.toLowerCase().trim())) {
                    this.viewEngine = 'twig';
                } else if (_.includes(['nunjucks', 'nun', 'n'], this.viewEngine.toLowerCase().trim())) {
                    this.viewEngine = 'nunjucks';
                } else {
                    this.viewEngine = 'pug';
                }
        */
		//	Hardcoded!
		this.viewEngine = 'pug';
		/*
                // Clean the preprocessor
                if (_.includes(['sass', 'sa'], this.preprocessor.toLowerCase().trim())) {
                    this.preprocessor = 'sass';
                } else if (_.includes(['less', 'le'], this.preprocessor.toLowerCase().trim())) {
                    this.preprocessor = 'less';
                } else {
                    this.preprocessor = 'stylus';
                }
        */
		//	Hardcoded!
		this.preprocessor = 'sass';
		// Hardcoded!
		this.userModel = 'User';
		// Clean the userModel name
		this.userModel = utils.camelcase(this.userModel, false);
		this.userModelPath = utils.keyToPath(this.userModel, true);

		// Create the directory if required
		if (this.newDirectory) {
			this.destinationRoot(utils.slug(this.projectName));
		}

		//	Hardcoded!
		this.includeBlog = false;
		this.includeGallery = false;
		this.includeEmail = false;
		this.includeEnquiries = false;

		// Additional prompts may be required, based on selections
		// if (this.includeBlog || this.includeGallery || this.includeEmail) {

			// if (this.includeEmail) {
			// 	prompts.config.push({
			// 		name: 'mailgunAPI',
			// 		message: '------------------------------------------------'
			// 			+ '\n    If you want to set up mailgun now, you can provide'
			// 			+ '\n    your mailgun credentials, otherwise, you will'
			// 			+ '\n    want to add these to your .env later.'
			// 			+ '\n    mailgun API key:',
			// 	});
			// 	prompts.config.push({
			// 		name: 'mailgunDomain',
			// 		message: '------------------------------------------------'
			// 			+ '\n    mailgun domain:',
			// 	});
			// }

			// if (this.includeBlog || this.includeGallery) {
			//
			// 	var blog_gallery = 'blog and gallery templates';
			//
			// 	if (!this.includeBlog) {
			// 		blog_gallery = 'gallery template';
			// 	} else if (!this.includeGallery) {
			// 		blog_gallery = 'blog template';
			// 	}
			//
			// 	prompts.config.push({
			// 		name: 'cloudinaryURL',
			// 		message: '------------------------------------------------'
			// 			+ '\n    KeystoneJS integrates with Cloudinary for image upload, resizing and'
			// 			+ '\n    hosting. See https://keystonejs.com/api/field/cloudinaryimage for more info.'
			// 			+ '\n    '
			// 			+ '\n    CloudinaryImage fields are used by the ' + blog_gallery + '.'
			// 			+ '\n    '
			// 			+ '\n    You can skip this for now (we\'ll include demo account details)'
			// 			+ '\n    '
			// 			+ '\n    Please enter your Cloudinary URL:',
			// 	});
			//
			// }

		// }

		if (!prompts.config.length) {
			return cb();
		}

		this.prompt(prompts.config, function (props) {

			_.each(props, function (val, key) {
				this[key] = val;
			}, this);

			// Hardcoded!
			this.includeEmail = false;

			// if (this.includeEmail && (this.mailgunAPI && this.mailgunDomain)) {
			// 	this.mailgunConfigured = true;
			// }

			// if (!this.cloudinaryURL && (this.includeBlog || this.includeGallery)) {
			// 	this.usingDemoCloudinaryAccount = true;
			// 	this.cloudinaryURL = 'cloudinary://719553377588792:u3lHeoTDWp5xIsNU7W841_aTUV4@nsi-cdn';
			// }

			cb();

		}.bind(this));

	}.bind(this));

};

KeystoneGenerator.prototype.guideComments = function () {

	var cb = this.async();
	// if (this.auto) {
	// 	return cb();
	// }

	this.includeGuideComments = true;
	return cb();

	// this.prompt([
	// 	{
	// 		type: 'confirm',
	// 		name: 'includeGuideComments',
	// 		message: '------------------------------------------------'
	// 			+ '\n    Finally, would you like to include extra code comments in'
	// 			+ '\n    your project? If you\'re new to Keystone, these may be helpful.',
	// 		default: true,
	// 	},
	// ], function (props) {
	//
	// 	this.includeGuideComments = props.includeGuideComments;
	// 	cb();
	//
	// }.bind(this));

};

KeystoneGenerator.prototype.keys = function keys () {

	this.cookieSecret = crypto.randomBytes(64).toString('hex');

};

KeystoneGenerator.prototype.project = function project () {

	this.template('_package.json', 'package.json');
	this.template('_env', '.env');

	this.template('_eslintrc', '.eslintrc');
	this.template('_eslintignore', '.eslintignore');
	this.template('_keystone.js', 'keystone.js');

	this.copy('editorconfig', '.editorconfig');
	this.copy('gitignore', '.gitignore');
	this.copy('Procfile');

	//	Configurazione
	this.template('config/_developement.js', 'config/developement.js');
	this.template('config/_production.js', 'config/production.js');
	this.template('config/_staging.js', 'config/staging.js');

	//	Certificati
	this.mkdir('cert');
	this.directory('cert');

	this.mkdir('lib');
	this.directory('lib');

	// Readme
	this.copy('_README.md', 'README.md');

};

KeystoneGenerator.prototype.models = function models () {

	var modelFiles = [
		'Impostazioni/Impostazioni',
		'Cookies/Cookies-banner', 'Cookies/Cookies-contents', 'Cookies/Cookies-list',
		'Privacy/Privacy-content', 'Privacy/Privacy-policies',
	];

	this.mkdir('models');

	this.template('models/_User.js', 'models/' + this.userModel + '.js');

	modelFiles.forEach(function (i) {
		this.template('models/' + i + '.js');
	}, this);

};

KeystoneGenerator.prototype.routes = function routes () {

	this.mkdir('routes');
	this.mkdir('routes/views');
	this.mkdir('routes/middlewares/pug');

	this.template('routes/_index.js', 'routes/index.js');
	// disabilitato perchè ho modificato la struttura dei middlewares
	// this.template('routes/_middleware.js', 'routes/middleware.js');

	// if (this.includeEmail) {
	// 	this.template('routes/_emails.js', 'routes/emails.js');
	// }

	this.copy('routes/views/index.js');
	this.directory('routes/middlewares');
	this.directory('routes/policies');

	// if (this.includeBlog) {
	// 	this.copy('routes/views/blog.js');
	// 	this.copy('routes/views/post.js');
	// }

	// if (this.includeGallery) {
	// 	this.copy('routes/views/gallery.js');
	// }

	// if (this.includeEnquiries) {
	// 	this.copy('routes/views/contact.js');
	// }

};

KeystoneGenerator.prototype.templates = function templates () {

	// if (this.viewEngine === 'hbs') {

		// Copy Handlebars Templates

		// this.mkdir('templates');
		// this.mkdir('templates/views');
		//
		// this.directory('templates/default-hbs/views/layouts', 'templates/views/layouts');
		// this.directory('templates/default-hbs/views/helpers', 'templates/views/helpers');
		// this.directory('templates/default-hbs/views/partials', 'templates/views/partials');
		//
		// this.template('templates/default-hbs/views/index.hbs', 'templates/views/index.hbs');
		//
		// if (this.includeBlog) {
		// 	this.copy('templates/default-hbs/views/blog.hbs', 'templates/views/blog.hbs');
		// 	this.copy('templates/default-hbs/views/post.hbs', 'templates/views/post.hbs');
		// }
		//
		// if (this.includeGallery) {
		// 	this.copy('templates/default-hbs/views/gallery.hbs', 'templates/views/gallery.hbs');
		// }
		//
		// if (this.includeEnquiries) {
		// 	this.copy('templates/default-hbs/views/contact.hbs', 'templates/views/contact.hbs');
		// 	if (this.includeEmail) {
		// 		this.copy('templates/default-hbs/emails/enquiry-notification.hbs', 'templates/emails/enquiry-notification.hbs');
		// 	}
		// }

	// } else if (this.viewEngine === 'nunjucks') {

		// Copy Nunjucks Templates

		// this.mkdir('templates');
		// this.mkdir('templates/views');
		//
		// this.directory('templates/default-' + this.viewEngine + '/views/layouts', 'templates/views/layouts');
		// this.directory('templates/default-' + this.viewEngine + '/views/mixins', 'templates/views/mixins');
		// this.directory('templates/default-' + this.viewEngine + '/views/errors', 'templates/views/errors');
		//
		// this.template('templates/default-' + this.viewEngine + '/views/index.html', 'templates/views/index.html');
		//
		// if (this.includeBlog) {
		// 	this.copy('templates/default-' + this.viewEngine + '/views/blog.html', 'templates/views/blog.html');
		// 	this.copy('templates/default-' + this.viewEngine + '/views/post.html', 'templates/views/post.html');
		// }
		//
		// if (this.includeGallery) {
		// 	this.copy('templates/default-' + this.viewEngine + '/views/gallery.html', 'templates/views/gallery.html');
		// }
		//
		// if (this.includeEnquiries) {
		// 	this.copy('templates/default-' + this.viewEngine + '/views/contact.html', 'templates/views/contact.html');
		// 	if (this.includeEmail) {
		// 		this.directory('templates/default-' + this.viewEngine + '/emails', 'templates/emails');
		// 	}
		// }

	// } else {

		// Copy Pug/Twig Templates

		this.mkdir('templates');
		this.mkdir('templates/views');

		this.directory('templates/default-' + this.viewEngine + '/layouts', 'templates/layouts');
		this.directory('templates/default-' + this.viewEngine + '/mixins', 'templates/mixins');
		this.directory('templates/default-' + this.viewEngine + '/views/errors', 'templates/views/errors');
		this.directory('templates/default-' + this.viewEngine + '/views/policies', 'templates/views/policies');

		this.template('templates/default-' + this.viewEngine + '/views/index.' + this.viewEngine, 'templates/views/index.' + this.viewEngine);

		// if (this.includeBlog) {
		// 	this.copy('templates/default-' + this.viewEngine + '/views/blog.' + this.viewEngine, 'templates/views/blog.' + this.viewEngine);
		// 	this.copy('templates/default-' + this.viewEngine + '/views/post.' + this.viewEngine, 'templates/views/post.' + this.viewEngine);
		// }

		// if (this.includeGallery) {
		// 	this.copy('templates/default-' + this.viewEngine + '/views/gallery.' + this.viewEngine, 'templates/views/gallery.' + this.viewEngine);
		// }

		// if (this.includeEnquiries) {
		// 	this.copy('templates/default-' + this.viewEngine + '/views/contact.' + this.viewEngine, 'templates/views/contact.' + this.viewEngine);
		// 	// if (this.includeEmail) {
		// 	// 	this.copy('templates/default-' + this.viewEngine + '/emails/enquiry-notification.' + this.viewEngine, 'templates/emails/enquiry-notification.' + this.viewEngine);
		// 	// }
		// }
	// }

};

KeystoneGenerator.prototype.updates = function routes () {

	this.directory('updates');

};

KeystoneGenerator.prototype.files = function files () {

	this.directory('public/images');
	this.directory('public/js');
	this.copy('public/favicon.ico');

	// if (this.preprocessor === 'sass') {
		this.directory('public/fonts', 'public/fonts/bootstrap');
		this.directory('public/styles-sass', 'public/styles');
	// } else if (this.preprocessor === 'less') {
	// 	this.directory('public/fonts');
	// 	this.directory('public/styles-less', 'public/styles');
	// } else {
	// 	this.directory('public/fonts');
	// 	this.directory('public/styles-stylus', 'public/styles');
	// }
};
