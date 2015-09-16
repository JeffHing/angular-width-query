/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Application entry point.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = ExampleController;

//-------------------------------------
// Controller
//-------------------------------------

function ExampleController() {
    this.isSideBarOpen = true;
    this.toggleSideBar = function() {
        this.isSideBarOpen = !this.isSideBarOpen;
    };
}
