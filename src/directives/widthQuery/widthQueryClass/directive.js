/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * widthQueryClass directive.
 *
 * @example
 *
 * <div width-query>
 *     <div width-query-class="foobar">...<div>
 *     <div width-query-class="goobar">...<div>
 * </div>
 *
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

//-------------------------------------
// Exports
//-------------------------------------

module.exports = function(moduleName, config) {
    angular.module(moduleName).directive(
        config.directiveNames.widthQueryClass,
        function() {
            return directive(config);
        });
};

//-------------------------------------
// Directive
//-------------------------------------

function directive(config) {
    return {
        link: function(scope, element, attrs, widthQueryCtrl) {
            var className = attrs[config.directiveNames.widthQueryClass];
            var modifiedClass = null;

            // Add className to element.
            if (className) {
                element.addClass(className);
                className += '-';
            } else {
                className = '';
            }

            // Listen for class modifier changes.
            addModifiedClass(widthQueryCtrl.addModifierListener(
                addModifiedClass));

            function addModifiedClass(modifier) {
                if (modifiedClass) {
                    element.removeClass(modifiedClass);
                }
                modifiedClass = className + modifier;
                element.addClass(modifiedClass);
            }
        },
        require: '^' + config.directiveNames.widthQuery
    };
}
