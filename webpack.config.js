/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Webpack configurations.
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

var flags = require('minimist')(process.argv.slice(2));
var ip = require('ip');
var path = require('path');

// Set to true to expose development server.
var isServerPublic = false;

// Webpack loaders.
var loaders = {

    // Load CSS as javascript.
    css: {
        test: /\.css$/,
        loader: 'style!css!csslint?failOnError=false'
    },

    // Lint javascript.
    eslint: {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    },

    // Load HTML as javascript.
    html: {
        test: /\.html$/,
        loader: 'html'
    }
};

// Library settings.
var library = {

    // GitHub project name.
    projectName: 'angular-width-query',

    // Name of library variable for non-module build environments.
    variable: 'widthQueryDirective',

    // Filename of library.
    filename: 'widthQueryDirective.js',

    // Filename of minimized library.
    filenameMin: 'widthQueryDirective.min.js',

    // Path to library source.
    sourceFile: './src/directives/widthQuery/directive.js',

    // Loaders to load the library source.
    sourceLoaders: [
        loaders.eslint
    ]
};

/*
 * Creates a webpack development configuration.
 */
function createDevConfig() {

    var config = {

        devServer: {
            host: isServerPublic ? ip.address() : undefined,
            contentBase: 'src/',
            noInfo: true,
            inline: true
        },

        entry: './src/app.js',

        eslint: {
            failOnError: false
        },

        module: {
            loaders: [
                loaders.css,
                loaders.eslint,
                loaders.html
            ]
        },

        output: {},

        resolve: {
            alias: {}
        }
    };

    config.resolve.alias[library.projectName] =
        path.join(__dirname, library.sourceFile);

    return config;
}

/*
 * Creates a webpack distribution configuration.
 *
 * @param {string} libraryName
 */
function createDistConfig(libraryName) {

    return {
        entry: library.sourceFile,

        eslint: {
            failOnError: true
        },

        module: {
            loaders: library.sourceLoaders
        },

        output: {
            filename: libraryName,
            library: library.variable,
            libraryTarget: 'umd',
            path: 'dist/'
        }
    };
}

//-------------------------------------
// Exports
//-------------------------------------

if (flags['#wdist']) {
    // Create distribution file.
    module.exports = createDistConfig(library.filename);

} else if (flags['#wdistMin']) {
    // Create minimized distribution file.
    module.exports = createDistConfig(library.filenameMin);

} else if (flags['#wdev']) {
    // Create development bundle.
    module.exports = createDevConfig();

} else {
    // Common settings.
    module.exports = {
        library: library,
        loaders: loaders
    };
}
