/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * The widthQueryClass directive adds the widthQuery directive's
 * class modifier to the base HTML class of the element.
 *
 * @example
 *
 * <div width-query="container">
 *     <div width-query-class="section">...<div>
 *     <div width-query-class="section">...<div>
 * </div>
 */
'use strict';

//-------------------------------------
// Exports
//-------------------------------------

module.exports = function(moduleName, config) {
    angular.module(moduleName).directive(
        config.directiveNames.widthQueryClass,
        function() {
            return widthQueryClassDirective(config.directiveNames);
        });
};

//-------------------------------------
// Directive
//-------------------------------------

function widthQueryClassDirective(directiveNames) {
    return {
        link: function(scope, element, attrs, widthQueryCtrl) {
            var className = attrs[directiveNames.widthQueryClass];
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
        require: '^' + directiveNames.widthQuery
    };
}
