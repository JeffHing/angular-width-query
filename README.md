<!-- Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License -->

# AngularWidthQuery

AngularWidthQuery is a set of directives which applies HTML classes to 
elements based upon a container element's width.

It was created to support fluid layouts in situations where the container
element's width changes due to the user opening and closing other panels in 
the UI.

AngularWidthQuery is a substitute for CSS media queries which applies
CSS rules based upon the screen width, rather than an element's width.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Example](#example)
- [Usage](#usage)
    - [Factory Method](#factory-method)
    - [WidthQuery Directive](#widthquery-directive)
    - [WidthQueryClass Directive](#widthqueryclass-directive)
   
## Features

* Less than 4K minified.
* CSS transition and animation aware.
* Customizable directive names.
* Compatible with CommonJS, AMD, and non-module build environments.

## Installation

To install the package:

    npm install angular-width-query
    
To require the package:    

```javascript
var widthQueryDirective = require("angular-width-query");
```     

## Example

The easiest way to understand AngularWidthQuery is to walk 
through a quick example of creating a fluid layout consisting of 6 
equally sized sections. At small width, the sections are stacked. 
At medium width, the sections are arranged in two columns. At large width,
the sections are arranged in three columns.

### 1. Add the Directives

First, add the directives from AngularWidthQuery to an Angular module.

```javascript
widthQueryDirective('app');
```    

### 2. Create the HTML Structure

Next, create the HTML structure for the container and the 6 sections.

```html
<div width-query="container">
    <div width-query-class="section">Section 1</div>
    <div width-query-class="section">Section 2</div>
    <div width-query-class="section">Section 3</div>
    <div width-query-class="section">Section 4</div>
    <div width-query-class="section">Section 5</div>
    <div width-query-class="section">Section 6</div>
</div>
```

The values passed to the directives are the base HTML classes that will
be initially added to the elements.

Based upon the current container element width, classes are dynamically 
added to the elements to reflect the current width. For example, 
"container-small" and "section-small" will be added to their respective 
elements when the width of the container element is considered to be small.

The width ranges and class modifiers are fully customizable. See the Usage
section below for details.

### 3. Create the CSS

Lastly, create the CSS rules.

```css
.container {
    font-size: 0;
}

.section {
    border: 1px solid #c0c0c0;
    display: inline-block;
    font-size: 1rem;
    height: 300px;
}

.section-large {
    width: 33.33%;
}

.section-medium {
    width: 50%;
}

.section-small {
    width: 100%;
}
```

That's it. You're done. 

## Usage

### Factory Method

The `widthQueryDirective()` factory method adds the AngularWidthQuery
directives to an Angular module.

To add the directives, call `widthQueryDirective()` with
the name of the Angular module, and any options:

```javascript
widthQueryDirective('app', {
    directiveNames: {
        widthQuery: <string>,
        widthQueryClass: <string>
    },
    modifiers: [
        [<string>, <number>, <number>],
        ...
    ],
    pollingInterval: <milliseconds>
});
```
#### 'directiveNames' option

This option allows the names of the widthQuery and widthQueryClass directives
to be changed to suit your needs.

```javascript
widthQueryDirective('app', {
    directiveNames: {
        widthQuery: 'myWidthQuery',
        widthQueryClass: 'myWidthQueryClass'
    }
});
```

#### 'modifiers' option

This option allows you to specify the class modifiers that can be added to the
base HTML class.

Each item in the array is an array consisting of the class modifier, 
the lower width range, and the upper width range.

```javascript
widthQueryDirective('app', {
    modifiers: [
        ['small', 0, 767],
        ['medium', 768, 1023],
        ['large', 1024, 100000]
    ]
});
```

#### 'pollingInterval' option

This option allows you to specify the interval at which the directive polls
the element's width. The directive begins polling the element's width when
a window resize event or Angular digest event occurs. When the width stops 
changing, the polling stops. 

```javascript
widthQueryDirective('app', {
    pollingInterval: 100
});
```
If you have no animations or transitions, you can set this to 0.

### WidthQuery Directive

The widthQuery directive updates the element's HTML class based upon the 
element's width.

```html
<div width-query="container">
    ...
</div>
```

The widthQuery directive can be passed the base HTML class, or a set of
options. These options override the options passed to the factory method.

```html
<div width-query="{
    class: 'container',
    modifiers: [
        ['small', 0, 399],
        ['medium', 400, 1279],
        ['large', 1280, 100000]
    ],
    pollingInterval: 100,
    widthPollingListener: 'ctrl.widthChanged(width)',
    widthListener: 'ctrl.widthChanged(width)'
}">...</div>
```

#### 'class' option

This option specifies the base HTML class to initially add to the element.

#### 'modifiers' option

This option allows you to specify the class modifiers that can be added to the
base HTML class.

Each item in the array is an array consisting of the class modifier, 
the lower width range, and the upper width range.

```javascript
widthQueryDirective('app', {
    modifiers: [
        ['small', 0, 767],
        ['medium', 768, 1023],
        ['large', 1024, 100000]
    ]
});
```

#### 'pollingInterval' option

This option allows you to specify the interval at which the directive polls
the element's width. The directive begins polling the element's width when
a window resize or Angular digest event occurs. When the width stops 
changing, the polling stops. 

```javascript
widthQueryDirective('app', {
    pollingInterval: 100
});
```
If you have no animations or transitions, you can set this to 0.

#### 'widthListener' option

This option allows you to specify a function to call when the width has
stopped changing. This is useful when you need to update the display of other
elements when an animation or transition has completed.

```javascript
widthQueryDirective('app', {
    widthListener: 'ctrl.widthChanged(width)'
});
```

#### 'widthPollingListener' option

This option allows you to specify a function to call while the width is 
changing. This is useful when you need to update the display of other
elements during an animation or transition.

```javascript
widthQueryDirective('app', {
    widthPollingListener: 'ctrl.widthChanging(width)'
});
```

### WidthQueryClass Directive

The widthQueryClass directive updates the element's HTML class based upon the 
state of the parent widthQuery directive.

In the example below, if the widthQuery directive has applied class 
"container-small" to its element, the widthQueryClass directive will have 
applied class "section-small" to its element.

```html
<div width-query="container">
    <div width-query-class="section">...</div>
    ...
</div>
```

The widthQuery directive is passed the base HTML class to initially add to 
the element.
