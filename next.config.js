const withOffline = require('next-offline')

module.exports = withOffline({
	webpack: (config, options) => {
		config.node = {
			// Some libraries import Node modules but don't use them in the browser.
			// Tell Webpack to provide empty mocks for them so importing them works.
			...config.node,
			fs: 'empty',
			child_process: 'empty',
			net: 'empty',
			tls: 'empty'
		}

		return config
	},
	env: {
		sheets_email: process.env.sheets_email,
		sheets_privatekey: process.env.sheets_privatekey
	},
	target: process.env.NEXT_TARGET || 'serverless',
	images: {
		domains: ['gw.alipayobjects.com']
	},
	workboxOpts: {
		swDest: 'static/service-worker.js',
		runtimeCaching: [
			{
				urlPattern: /[.](png|jpg|ico|css)/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'assets-cache',
					cacheableResponse: {
						statuses: [0, 200]
					}
				}
			},
			{
				urlPattern: /^https:\/\/code\.getmdl\.io.*/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'lib-cache'
				}
			},
			{
				urlPattern: /^http.*/,
				handler: 'NetworkFirst',
				options: {
					cacheName: 'http-cache'
				}
			}
		]
	}
})
