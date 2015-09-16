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
require('angular-ui-router');

angular.module('app', ['ui.router']);

//-------------------------------------
// Initialize core UI
//-------------------------------------

require('./app.css');
require('angular-width-query')('app');
require('./views/example/view.css');

//-------------------------------------
// Initialize routes
//-------------------------------------

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('example', {
            url: '/',
            controller: require('./views/example/viewController.js'),
            template: require('./views/example/view.html'),
            controllerAs: 'ctrl'
        });
});
