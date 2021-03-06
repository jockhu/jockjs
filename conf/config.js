
/**
 * @name app config for Nodejs framework
 * @version undefined
 * @author Jock
 *
 * The main configuration file is some constant,
 * for the basic configuration of the framework.
 *
 *
 * example
 *
 *         node service.js
 *
 */



/**
 * Default config path, rewrite app conf
 * @const
 */
exports.userConfigPath = process.argv[2] || '';

/**
 * Default port
 * @const
 */
exports.port = 8000;

/**
 * Default debug
 * @const
 */
exports.debug = true;

/**
 * Default enable compression
 * @const
 */
exports.enableCompress = false;

/**
 * Default version
 * @const
 */
exports.version = '';

/**
 * Default root path
 * @const
 */
exports.root = 'libs';

/**
 * Default user root path
 * @const
 */
exports.userRoot = '';

/**
 * Default user modules
 * @const
 */
exports.userModules = [];

/**
 * Default component root path
 * @const
 */
exports.componentRoot = '';

/**
 * Default component modules
 * @const
 */
exports.componentModules = [];

/**
 * Default cache path
 * @const
 */
exports.cache = 'cache';

/**
 * Default log path
 * @const
 */
exports.logPath = 'log';

/**
 * Default javascript host
 * @const
 */
exports.jsHost = '';

/**
 * Default pages host
 * @const
 */
exports.pageHost = '';

/**
 * Default javascript path
 * @const
 */
exports.jsPath = '';

/**
 * Default style hosts
 * @const
 */
exports.cssHost = '';

/**
 * Default style path
 * @const
 */
exports.cssPath = '';

/**
 * Default crossOrigin
 * @const
 */
exports.crossOrigin = '*';

/**
 * Default node modules path
 * @const
 */
exports.nodeModulesPath = '/usr/local/lib/node_modules/';

/**
 * Default node uglify file path
 * @const
 */
exports.uglify = 'UglifyJS/uglify-js.js';

/**
 * Default enable access log
 * @const
 */
exports.enableAccessLog = false;

/**
 * Default enable error log
 * @const
 */
exports.enableErrorLog = false;

/**
 * Default mineType
 * @const
 */
exports.mineType = 'text/javascript';

/**
 * Default transfer Encoding
 * @const
 */
exports.transferEncoding = 'UTF-8';

/**
 * Default enable gzip
 * @const
 */
exports.enableGzip = true;

/**
 * Default enable cache
 * @const
 */
exports.enableCache = false;

/**
 * Default expires maxAge 1 years
 * @const
 */
exports.maxAge = 60*60*24*365;

/**
 * Default except -> uglify object property
 * @const
 */
exports.except = ['J','eval'];
