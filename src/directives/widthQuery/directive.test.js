/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Unit tests for widthQuery directive.
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

var PageObject = require('./pageObject');

var delay = 50;

//-------------------------------------
// Unit tests
//-------------------------------------

describe('widthQuery directive:', function() {

    describe('Applying class modifier:', function() {
        var html =
            '<div width-query="{' +
            'class: \'parent\',' +
            'modifiers: [' +
            '[\'tiny\', 0, 299],' +
            '[\'big\', 300, 599]' +
            ']' +
            '}">' +
            '</div>';

        var pageObject;

        beforeEach(function() {
            pageObject = new PageObject(html);
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have the tiny class at lower bound', function(done) {
            pageObject.setWidth(0);
            setTimeout(function() {
                expect(pageObject.hasClass('parent')).toBe(true);
                expect(pageObject.hasClass('parent-tiny')).toBe(true);
                expect(pageObject.hasClass('parent-big')).toBe(false);
                done();
            }, delay);
        });

        it('should have the tiny class at upper bound', function(done) {
            pageObject.setWidth(299);
            setTimeout(function() {
                expect(pageObject.hasClass('parent')).toBe(true);
                expect(pageObject.hasClass('parent-tiny')).toBe(true);
                expect(pageObject.hasClass('parent-big')).toBe(false);
                done();
            }, delay);
        });

        it('should have the big class at lower bound', function(done) {
            pageObject.setWidth(300);
            setTimeout(function() {
                expect(pageObject.hasClass('parent')).toBe(true);
                expect(pageObject.hasClass('parent-tiny')).toBe(false);
                expect(pageObject.hasClass('parent-big')).toBe(true);
                done();
            }, delay);
        });

        it('should have the big class at upper bound', function(done) {
            pageObject.setWidth(599);
            setTimeout(function() {
                expect(pageObject.hasClass('parent')).toBe(true);
                expect(pageObject.hasClass('parent-tiny')).toBe(false);
                expect(pageObject.hasClass('parent-big')).toBe(true);
                done();
            }, delay);
        });
    });

    describe('Applying class modifier during animation:', function() {
        var html =
            '<div style="-webkit-transition: width .2s" width-query="{' +
            'class: \'parent\',' +
            'modifiers: [' +
            '[\'tiny\', 0, 299],' +
            '[\'big\', 300, 599]' +
            ']' +
            '}">' +
            '<div width-query-class="child"></div>' +
            '</div>';

        var pageObject;

        beforeEach(function() {
            pageObject = new PageObject(html);
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have the big class at lower bound', function(done) {
            expect(pageObject.hasClass('parent-tiny')).toBe(true);
            pageObject.setWidth(350);
            setTimeout(function() {
                expect(pageObject.hasClass('parent-big')).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Applying class modifier to child:', function() {
        var html =
            '<div width-query="{' +
            'class: \'parent\',' +
            'modifiers: [' +
            '[\'tiny\', 0, 299],' +
            '[\'big\', 300, 599]' +
            ']' +
            '}">' +
            '<div width-query-class="child"></div>' +
            '</div>';

        var pageObject;

        beforeEach(function() {
            pageObject = new PageObject(html);
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have the tiny class at lower bound', function(done) {
            pageObject.setWidth(0);
            setTimeout(function() {
                expect(pageObject.hasChildClass('child')).toBe(true);
                expect(pageObject.hasChildClass('child-tiny')).toBe(true);
                expect(pageObject.hasChildClass('child-big')).toBe(false);
                done();
            }, delay);
        });

        it('should have the tiny class at upper bound', function(done) {
            pageObject.setWidth(299);
            setTimeout(function() {
                expect(pageObject.hasChildClass('child')).toBe(true);
                expect(pageObject.hasChildClass('child-tiny')).toBe(true);
                expect(pageObject.hasChildClass('child-big')).toBe(false);
                done();
            }, delay);
        });

        it('should have the big class at lower bound', function(done) {
            pageObject.setWidth(300);
            setTimeout(function() {
                expect(pageObject.hasChildClass('child')).toBe(true);
                expect(pageObject.hasChildClass('child-tiny')).toBe(false);
                expect(pageObject.hasChildClass('child-big')).toBe(true);
                done();
            }, delay);
        });

        it('should have the big class at upper bound', function(done) {
            pageObject.setWidth(599);
            setTimeout(function() {
                expect(pageObject.hasChildClass('child')).toBe(true);
                expect(pageObject.hasChildClass('child-tiny')).toBe(false);
                expect(pageObject.hasChildClass('child-big')).toBe(true);
                done();
            }, delay);
        });
    });

    describe('Applying class modifier without class name', function() {
        var html =
            '<div width-query="{' +
            'modifiers: [' +
            '[\'tiny\', 0, 299],' +
            '[\'big\', 300, 599]' +
            ']' +
            '}">' +
            '<div width-query-class></div>' +
            '</div>';

        var pageObject;

        beforeEach(function() {
            pageObject = new PageObject(html);
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have the tiny class', function(done) {
            pageObject.setWidth(150);
            setTimeout(function() {
                expect(pageObject.hasClass('tiny')).toBe(true);
                expect(pageObject.hasChildClass('tiny')).toBe(true);
                done();
            }, delay);
        });

        it('should have the big class', function(done) {
            pageObject.setWidth(350);
            setTimeout(function() {
                expect(pageObject.hasClass('big')).toBe(true);
                expect(pageObject.hasChildClass('big')).toBe(true);
                done();
            }, delay);
        });
    });

    describe('Calling width listener:', function() {
        var html =
            '<div width-query="{' +
            'class: \'parent\',' +
            'widthListener: \'ctrl.widthChanged(width)\'' +
            '}">' +
            '</div>';


        var scope, pageObject;

        beforeEach(function() {
            scope = {
                ctrl: {
                    widthChanged: function() {},
                    widthIntervalChanged: function() {
                        console.log('called');
                    }
                }
            };
            pageObject = new PageObject(html, scope);
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have called the widthChanged function', function(done) {
            spyOn(scope.ctrl, 'widthChanged');
            pageObject.setWidth(232);
            setTimeout(function() {
                expect(scope.ctrl.widthChanged).toHaveBeenCalledWith(232);
                done();
            }, 200);
        });
    });

    describe('Calling width polling listener during transition:', function() {
        var html =
            '<div style="-webkit-transition: width .2s" width-query="{' +
            'class: \'parent\',' +
            'widthPollingListener: \'ctrl.widthPollingChanged(width)\'' +
            '}">' +
            '</div>';


        var scope, pageObject;

        beforeEach(function() {
            scope = {
                ctrl: {
                    widthPollingChanged: function() {}
                }
            };
            pageObject = new PageObject(html, scope);
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have called the widthPollingChanged function', function(done) {
            spyOn(scope.ctrl, 'widthPollingChanged');
            pageObject.setWidth(1000);
            setTimeout(function() {
                expect(scope.ctrl.widthPollingChanged.calls.count()).toBeGreaterThan(3);
                expect(scope.ctrl.widthPollingChanged).toHaveBeenCalledWith(1000);
                done();
            }, 300);
        });
    });

    describe('Setting polling interval:', function() {
        var html =
            '<div style="-webkit-transition: width .2s" width-query="{' +
            'class: \'parent\',' +
            'pollingInterval: 100,' +
            'widthPollingListener: \'ctrl.widthPollingChanged(width)\'' +
            '}">' +
            '</div>';


        var scope, pageObject;

        beforeEach(function() {
            scope = {
                ctrl: {
                    widthPollingChanged: function() {}
                }
            };
            pageObject = new PageObject(html, scope);
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have called the widthPollingChanged function', function(done) {
            spyOn(scope.ctrl, 'widthPollingChanged');
            pageObject.setWidth(1000);
            setTimeout(function() {
                expect(scope.ctrl.widthPollingChanged
                    .calls.count()).toBeLessThan(4);
                done();
            }, 300);
        });
    });

    describe('Applying factory config:', function() {
        var html =
            '<div foo-query>' +
            '<div foo-query-class></div>' +
            '</div>';

        var pageObject;

        beforeEach(function() {
            pageObject = new PageObject(html, {}, {
                directiveNames: {
                    widthQuery: 'fooQuery',
                    widthQueryClass: 'fooQueryClass'
                },
                modifiers: [
                    ['tiny', 0, 299],
                    ['big', 300, 599]
                ]
            });
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have the tiny class', function(done) {
            pageObject.setWidth(150);
            setTimeout(function() {
                expect(pageObject.hasClass('tiny')).toBe(true);
                expect(pageObject.hasChildClass('tiny')).toBe(true);
                done();
            }, delay);
        });

        it('should have the big class', function(done) {
            pageObject.setWidth(350);
            setTimeout(function() {
                expect(pageObject.hasClass('big')).toBe(true);
                expect(pageObject.hasChildClass('big')).toBe(true);
                done();
            }, delay);
        });
    });

    describe('Applying factory config plus instance config:', function() {
        var html =
            '<div foo-query="{' +
            'modifiers: [' +
            '[\'tiny\', 0, 149],' +
            '[\'big\', 150, 300]' +
            ']' +
            '}">' +
            '<div foo-query-class></div>' +
            '</div>';

        var pageObject;

        beforeEach(function() {
            pageObject = new PageObject(html, {}, {
                directiveNames: {
                    widthQuery: 'fooQuery',
                    widthQueryClass: 'fooQueryClass'
                },
                modifiers: [
                    ['tiny', 0, 299],
                    ['big', 300, 599]
                ]
            });
        });

        afterEach(function() {
            pageObject.cleanup();
        });

        it('should have the tiny class', function(done) {
            pageObject.setWidth(149);
            setTimeout(function() {
                expect(pageObject.hasClass('tiny')).toBe(true);
                expect(pageObject.hasChildClass('tiny')).toBe(true);
                done();
            }, delay);
        });

        it('should have the big class', function(done) {
            pageObject.setWidth(150);
            setTimeout(function() {
                expect(pageObject.hasClass('big')).toBe(true);
                expect(pageObject.hasChildClass('big')).toBe(true);
                done();
            }, delay);
        });
    });

});
