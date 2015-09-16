/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Load all tests ending in '.test.js' in a single bundle.
 */
'use strict';

(function() {
    var testsContext = require.context('../..', true, /\.test\.js$/);
    testsContext.keys().forEach(testsContext);

    /* Print out test files
    testsContext.keys().forEach(function(key) {
        console.log(key);
    });
    */
})();
