/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Application entry point.
 */
'use strict';

//-------------------------------------
// Initialize Angular
//-------------------------------------

require('angular');
require('ui-router');

angular.module('app', ['ui.router']);

//-------------------------------------
// Initialize core UI
//-------------------------------------

require('./app.css');
require('width-query-directive')('app');
require('./views/example/view.css');

//-------------------------------------
// Initialize routes
//-------------------------------------

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('example', {
            url: '/',
            template: require('./views/example/view.html')
        });
});
