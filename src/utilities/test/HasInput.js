/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Provides convenience functions to emulate mouse input for a jquery
 * wrapped element.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = HasMouseInput;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

// Private model name.
var MODEL = '_hasMouseInput';

//-------------------------------------
// HasMouseInput class
//-------------------------------------

/*
 * @constructor
 */
function HasMouseInput(element) {
    var m = this[MODEL] = {};

    m.element = element;
}

var proto = HasMouseInput.prototype;

proto.mouseClick = function() {
    var m = this[MODEL];
    m.element.trigger('click');
};

proto.mouseEnter = function() {
    var m = this[MODEL];
    m.element.trigger('mouseenter');
};

proto.mouseLeave = function() {
    var m = this[MODEL];
    m.element.trigger('mouseleave');
};

proto.focus = function() {
    var m = this[MODEL];
    m.element.triggerHandler('focus');
};

proto.keyPress = function(char) {
    var m = this[MODEL];
    m.element.trigger({
        type: 'keypress',
        which: char.charCodeAt(0)
    });
};

proto.keyPressEnter = function() {
    var m = this[MODEL];
    m.element.trigger({
        type: 'keypress',
        which: 13
    });
};
