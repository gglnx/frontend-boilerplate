/**
 * @package     
 * @link        
 * @author      Dennis Morhardt <info@dennismorhardt.de>
 * @copyright   Copyright 2014, Dennis Morhardt
 */

/**
 * RequireJS configuration
 */
requirejs.config({
	paths: {
		'jquery': '../components/jquery/dist/jquery.min',
		'async': '../components/requirejs-plugins/src/async'
	},
	shim: {

	}
});

/**
 * Load our application
 */
require([
	//'components/foo-bar'
]);
