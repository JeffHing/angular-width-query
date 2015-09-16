/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Provide convenience functions to manaage the elements style.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = HasStyle;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

// Private model name.
var MODEL = '_hasStyle';

//-------------------------------------
// HasStyle class
//-------------------------------------

/*
 * @constructor
 *
 * @param {object} element
 */
function HasStyle(element) {
    var m = this[MODEL] = {};

    m.element = element;
}

var proto = HasStyle.prototype;

/*
 * Indicates whether the element has the specified element class.
 *
 * @param {string} elementClass
 * @return {boolean}
 */
proto.hasClass = function(elementClass) {
    var m = this[MODEL];
    return m.element.hasClass(elementClass);
};
