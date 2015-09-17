/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License.
 *
 * The widthQuery directive updates the element's HTML class based upon
 * the element's width.
 *
 * @example
 *
 * widthQueryDirective('app', {
 *    directiveNames: {
 *        widthQuery: 'widthQuery',
 *        widthQueryClass: 'widthQueryClass'
 *    },
 *    modifiers: [
 *        ['small', 0, 767],
 *        ['medium', 768, 1023],
 *        ['large', 1024, 100000]
 *    ],
 *    pollingInterval: 100
 * });
 *
 * @example
 *
 * <div width-query="container">
 *     <div width-query-class="section">...<div>
 *     <div width-query-class="section">...<div>
 * </div>
 *
 * @example
 *
 * <div width-query="{
 *    class: 'container',
 *    modifiers: [
 *        ['small', 0, 399],
 *        ['medium', 400, 1279],
 *        ['large', 1280, 100000]
 *    ],
 *    pollingInterval: 100,
 *    widthListener: 'ctrl.widthChanged(width)',
 *    widthPollingListener: 'ctrl.widthChanging(width)'
 * }">
 *
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

var widthQueryClassDirective = require('./widthQueryClass/directive');

// Private model name.
var MODEL = '_widthQueryDirective';

//-------------------------------------
// Exports
//-------------------------------------

module.exports = function(moduleName, options) {

    var config = {
        'class': null,
        directiveNames: {
            widthQuery: 'widthQuery',
            widthQueryClass: 'widthQueryClass'
        },
        modifiers: [
            ['small', 0, 767],
            ['medium', 768, 1023],
            ['large', 1024, 100000]
        ],
        pollingInterval: 50,
        maxPollingRetrys: 2,
        widthPollingListener: null,
        widthListener: null
    };

    if (options) {
        angular.merge(config, options);
    }

    var directiveNames = config.directiveNames;

    angular.module(moduleName).directive(directiveNames.widthQuery,
        function() {
            return widthQueryDirective(config);
        });

    widthQueryClassDirective(moduleName, config);
};

//-------------------------------------
// Directive controller
//-------------------------------------

Controller.$inject = ['$scope', '$element', '$attrs', '$window', '$timeout'];

/*
 * @constructor
 */
function Controller($scope, $element, $attrs, $window, $timeout,
    config) {

    var m = this[MODEL] = new ControllerModel($scope, $element,
        $timeout, config);

    // Parse attribute values.
    var values = $attrs[config.directiveNames.widthQuery];
    if (values) {
        if (values[0] === '[') {
            var arr = $scope.$eval(values);
            m.config.class = arr[0];
            m.config.widthListener = arr[1];
        } else if (values[0] === '{') {
            angular.extend(m.config, $scope.$eval(values));
        } else {
            m.config.class = values;
        }
    }

    // Watch for window resizing.
    var window = angular.element($window);
    window.bind('resize', startPolling);

    // Watch for user event.
    $scope.$watch(function() {
        startPolling();
    }, function() {});

    // Clean Up.
    $scope.$on('$destroy', function() {
        m.cancelPendingNotification();
        window.unbind('resize', startPolling);
    });

    function startPolling() {
        m.startPolling();
    }
}

var proto = Controller.prototype;

/*
 * Add a listener to notify of class modifier changes.
 *
 * @return {String} The initial class modifier to use.
 */
proto.addModifierListener = function(listener) {
    var m = this[MODEL];
    m.classModifierListeners.push(listener);
    return m.initialModifier;
};

/*
 * Set the initial class modifier and listen for class modifier changes.
 */
proto.setInitialModifier = function(element) {
    var m = this[MODEL];
    var modifiedClass;
    var className = '';

    // Add class to element.
    if (m.config.class) {
        element.addClass(m.config.class);
        className = m.config.class + '-';
    }

    m.initialModifier = m.calculateModifier(m.element.offsetWidth);

    // Listen for class modifier changes.
    addModifiedClass(this.addModifierListener(addModifiedClass));

    function addModifiedClass(modifier) {
        if (modifiedClass) {
            element.removeClass(modifiedClass);
        }
        modifiedClass = className + modifier;
        element.addClass(modifiedClass);
    }
};

//-------------------------------------
// Directive controller model
//-------------------------------------

/*
 * @constructor
 */
function ControllerModel(scope, element, timeout, config) {
    this.scope = scope;
    this.element = element[0];
    this.timeout = timeout;
    this.classModifierListeners = [];
    this.pendingNotification = null;
    this.width = null;
    this.config = config;
    this.pollingRetry = 0;
}

var modelProto = ControllerModel.prototype;

/*
 * Cancel any pending class notification.
 */
modelProto.cancelPendingNotification = function() {
    if (this.pendingNotification) {
        this.timeout.cancel(this.pendingNotification);
    }
};

/*
 * When the width stops changing, apply the new class name.
 */
modelProto.startPolling = function() {
    var self = this;

    if (self.pendingNotification) {
        return;
    }

    // Update class modifiers while width is changing
    // rather than waiting till the end to give a more
    // fluid appearance.
    var width = self.element.offsetWidth;
    if (width !== self.width) {
        self.notifyModifierListeners(width);
        self.notifyWidthPollingListener(width);
        self.pollingRetry = 0;
        self.width = width;
    }

    self.pendingNotification = self.timeout(function() {
        var newWidth = self.element.offsetWidth;

        self.pendingNotification = null;

        // Width is still changing
        if (newWidth !== self.width) {
            self.startPolling();
        } else {
            if (self.pollingRetry === 0) {
                self.notifyWidthListener(newWidth);
            }

            // Try a couple more times to handle race conditions.
            self.pollingRetry++;
            if (self.pollingRetry <= self.config.maxPollingRetrys) {
                self.startPolling();
            } else {
                self.pollingRetry = 0;
            }
        }

    }, self.config.pollingInterval, false);
};

/*
 * Return the class modifer based upon the width.
 *
 * @return {string} the class modifier
 */
modelProto.calculateModifier = function(width) {
    var modifiers = this.config.modifiers;
    var length = modifiers.length;
    for (var i = 0; i < length; i++) {
        var modifier = modifiers[i];
        if (width >= modifier[1] && width <= modifier[2]) {
            return modifier[0];
        }
    }
    return '';
};

/*
 * Notify listeners to use the calculated class modifier.
 */
modelProto.notifyModifierListeners = function(width) {
    var classModifier = this.calculateModifier(width);

    var listeners = this.classModifierListeners;
    var length = listeners.length;
    for (var i = 0; i < length; i++) {
        listeners[i](classModifier);
    }
};

/*
 * Notify listener that the width has changed.
 */
modelProto.notifyWidthListener = function(width) {
    if (this.config.widthListener) {
        this.scope.$eval(this.config.widthListener, {
            width: width
        });
    }
};

/*
 * Notify listener that the width has changed during the polling period.
 */
modelProto.notifyWidthPollingListener = function(width) {
    if (this.config.widthPollingListener) {
        this.scope.$eval(this.config.widthPollingListener, {
            width: width
        });
    }
};

//-------------------------------------
// Directive
//-------------------------------------

function widthQueryDirective(config) {
    ProxyController.$inject = ['$scope', '$element', '$attrs',
        '$window', '$timeout'
    ];

    function ProxyController($scope, $element, $attrs, $window, $timeout) {
        Controller.call(this, $scope, $element,
            $attrs, $window, $timeout, angular.merge({}, config));
    }
    ProxyController.prototype = Controller.prototype;

    return {
        controller: ProxyController,
        link: {
            pre: function(scope, element, attrs, controller) {
                controller.setInitialModifier(element);
            }
        },
        require: config.directiveNames.widthQuery
    };

}
