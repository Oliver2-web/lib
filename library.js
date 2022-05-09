'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware/* , controllers */ } = params;

	/**
	 * We create two routes for every view. One API call, and the actual route itself.
	 * */
	routeHelpers.setupPageRoute(router, '/quickstart', middleware, [(req, res, next) => {
		winston.info(`[plugins/quickstart] In middleware. This argument can be either a single middleware or an array of middlewares`);
		setImmediate(next);
	}], (req, res) => {
		winston.info(`[plugins/quickstart] Navigated to ${nconf.get('relative_path')}/quickstart`);
		res.render('quickstart', { uid: req.uid });
	});

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/quickstart', middleware, [], controllers.renderAdminPage);
};


plugin.addRoutes = async ({ router, middleware, helpers }) => {
	const middlewares = [
		middleware.ensureLoggedIn,			// use this if you want only registered users to call this route
		// middleware.admin.checkPrivileges,	// use this to restrict the route to administrators
	];

	routeHelpers.setupApiRoute(router, 'get', '/quickstart/:param1', middlewares, (req, res) => {
		helpers.formatApiResponse(200, res, {
			foobar: req.params.param1,
		});
	});
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/quickstart',
		icon: 'fa-tint',
		name: 'Quickstart',
	});

	return header;
};

module.exports = plugin;
