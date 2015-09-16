/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Page object for width-query directive.
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

var SNAKE_CASE_REGEXP = /[A-Z]/g;

var AngularTestContext = require('angular-test-context');
var directive = require('./directive');

// Private model name.
var MODEL = '_widthQueryPageObject';

//-------------------------------------
// Exports
//-------------------------------------

module.exports = WidthQueryPageObject;

//-------------------------------------
// Page object
//-------------------------------------

/*
 * @constructor
 */
function WidthQueryPageObject(html, scope, config) {

    var m = this[MODEL] = {};

    m.directiveName = 'width-query';
    m.childDirectiveName = 'width-query-class';

    if (config && config.directiveNames) {
        m.directiveName =
            this.snakeCase(config.directiveNames.widthQuery);
        m.childDirectiveName =
            this.snakeCase(config.directiveNames.widthQueryClass);
    }

    // Add directive to module.
    angular.module('testApp', []);
    directive('testApp', config);

    // Create test context.
    m.testContext = new AngularTestContext('testApp');

    // Compile the HTML snippet.
    m.element = m.testContext.compile(html, scope);
    $(document.body).append(m.element);

    m.testContext.digest();

    // Huh ?!!!. By accessing this variable, the CSS transitions
    // are now working in phantomJS.
    m.element[0].offsetWidth; // eslint-disable-line no-unused-expressions

    m.childElement = m.element.find('[' + m.childDirectiveName + ']');
}

var proto = WidthQueryPageObject.prototype;

proto.hasClass = function(className) {
    var m = this[MODEL];
    return m.element.hasClass(className);
};

proto.hasChildClass = function(className) {
    var m = this[MODEL];
    return m.childElement.hasClass(className);
};

proto.setWidth = function(width) {
    var m = this[MODEL];
    m.element.css('width', width + 'px');
    m.testContext.digest();
};

proto.cleanup = function() {
    var m = this[MODEL];
    $('[' + m.directiveName + ']').remove();
};

/*
 * Converts name from camel case to snake case.
 *
 * Modified angular code snippet.
 * @param {string} name
 * @return {string}
 */
proto.snakeCase = function(name) {
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
        return (pos ? '-' : '') + letter.toLowerCase();
    });
};
