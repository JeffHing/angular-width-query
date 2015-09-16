/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Karma configurations.
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

var flags = require('minimist')(process.argv.slice(2));
var path = require('path');
var karmaWebpackPlugin = require('karma-webpack');
var webpackConfig = require('./webpack.config');

// Additional functions needed for testing.
var TEST_UTILITIES_DIR = 'src/utilities/test';

/*
 * Creates a karma configuration.
 *
 * @param {string} sourceFile The source file to test
 * @param {array} loaders An array of loaders to apply to the source file.
 */
function createConf(sourceFile, loaders) {

    var allLoaders = [];
    var testFilesPattern = path.join(TEST_UTILITIES_DIR, 'allTests.js');

    if (loaders) {
        allLoaders.concat(loaders);
    }

    // Return a new instance each time.
    var conf = {

        browsers: ['PhantomJS'],

        files: [
            // https://github.com/webpack/style-loader/issues/31
            'node_modules/phantomjs-polyfill/bind-polyfill.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',

            testFilesPattern
        ],

        frameworks: ['jasmine'],

        plugins: [
            karmaWebpackPlugin,
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],

        preprocessors: {},

        reporters: [
            'dots'
        ],

        webpack: {
            module: {
                loaders: allLoaders
            },
            resolve: {
                alias: {},
                fallback: [
                    TEST_UTILITIES_DIR
                ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    };

    // Resolve to the correct file for testing.
    conf.webpack.resolve.alias[webpackConfig.library.projectName] =
        path.join(__dirname, sourceFile);

    conf.preprocessors[testFilesPattern] = ['webpack'];

    return conf;
}

//-------------------------------------
// Exports
//-------------------------------------
if (flags['#kdist']) {
    // Test distribution file.
    module.exports = function(config) {
        config.set(createConf(
            'dist/' + webpackConfig.library.filename
        ));
    };

} else if (flags['#kdistMin']) {
    // Test minimized distribution file.
    module.exports = function(config) {
        config.set(createConf(
            'dist/' + webpackConfig.library.filenameMin
        ));
    };

} else if (flags['#kdev']) {
    // Test source file.
    module.exports = function(config) {
        config.set(createConf(
            webpackConfig.library.sourceFile,
            webpackConfig.library.sourceLoaders
        ));
    };
}
