/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Controller for example view.
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
    this.isSideBarOpen = false;
    this.toggleSideBar = function() {
        this.isSideBarOpen = !this.isSideBarOpen;
    };
}

