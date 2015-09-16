<!-- Copyright 2015. Author: Jeffrey Hing. All Rights Reserved. MIT License -->

# AngularWidthQuery

AngularWidthQuery is a set of directives which applies HTML classes to 
one or more elements based upon a container element's width.

It was created to support fluid layouts where the container element's width
changes due to the user opening and closing other panels in the UI.

AngularWidthQuery is a substitue for using CSS media queries which only allow 
CSS rules to be applied based upon the screen width, rather than an 
element's width.


## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Example](#example)
- [Usage](#usage)
    - [Factory Method](#factory-method)
    - [WidthQuery Directive](#widthQuery-directive)
    - [WidtyQueryClass Directive](#widthQueryClass-directive)
   
## Features

* Tiny implementation.
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

The easist way to understand AngularWidthQuery is to walk 
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
The values passed to the directives are the base HTML classes that will
be automatically added to the elements.

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

Of course, the classes, and how they are applied, are fully customizable.
See the Usage section below for the details.

## Usage

### Factory Method

The `widthQueryDirective()` factory method adds the AngularWidthQuery
directives to an Angular module.

To add the directives, call `widthQueryDirective()` with
the name of the Angular module, and the options:

```javascript
widthQueryDirective('app', {
    modifiers: [
        [<string>, <number>, <number>],
        ...
    ],
    pollingInterval: <milliseconds>
    directiveNames: {
        widthQuery: <string>,
        widthQueryClass: <string>
    }
});
```

#### Modifiers Option

An array of HTML class modifiers to add to the base HTML class.

Each element in the array is an array consisting of the HTML class modifier, 
the lower width range, and the upper width range.

AngularWidthQuery searches these ranges in-order to determine which class
modifer to apply to the element's base HTML class.

#### Polling Interval Option

To address the issue of the width changing over time due to CSS animation and
transitions, The widthQuery directive begins polling the container's width when
a window resize or Angular digest event occurrs. When the width stops 
changing, the polling stops. The interval at which the polling occurrs can 
be adjusted using this option.

#### Directive Names Option

The names of the widthQuery and widthQueryClass directive can be changed to
suit your needs.

### Cabinet Directive

The cabinet directive identifies the element as a cabinet which contains
one or more drawer directives. It is responsible for coordinating which
drawers should be opened or closed based upon the open states of the drawers
and the applied options. For applying CSS rules, it adds the 'cabinet' 
class to the element.

```html
<div cabinet>
    ...
    <a drawer-trigger href=""></a>
    <div drawer-contents></div>
    <div drawer-class></div>
    ...
</div>
```

The following options can be passed into the cabinet directive:

```html
<div cabinet="{
    openOnHover: <boolean>,
    oneAlwaysOpen: <boolean>,
    allowMultipleOpen: <boolean>,
    openStates: {
        <string>: <boolean>
    }
}">...</div>
```

The cabinet directive watches for changes in the options, which allows for the
options to be dynamically updated.

#### Option Descriptions

Option            | Description                                       | Default
----------------- | ------------------------------------------------- | -------
openOnHover       | True to open the drawer when the mouse pointer hovers over the drawer trigger. | false
oneAlwaysOpen     | True to ensure one drawer is always open. By default, it opens the first drawer on startup. | false
allowMultipleOpen | True to allow multiple drawers to be open at the same time. | false
openStates        | Allows you to specify which drawers to open or close.  The key of the object is the drawer id, and the value is a boolean indicating the open state of the drawer. | {}

These options will override the options passed into the `cabinetDirective()` 
factory method.

### Drawer Id

A drawer id can be assigned to the drawer directives described below. The drawer 
id can be any string or number. A number is automatically converted to a string.
Directives that are assigned the same drawer id, share and affect the open 
state of the same drawer.

### DrawerTrigger Directive

The drawerTrigger directive toggles the opening and closing of the
drawer. It adds mouse and focus handlers to the element
to know when the directive has been triggered. For applying CSS rules,
it adds a 'drawer-trigger' class to the element, and a
'drawer-trigger-open' class to the element when the drawer is opened.

The drawerTrigger directive is usually applied to an anchor or button element to 
ensure that keyboard navigation works properly, but it can be applied
to any element.

```html
<a drawer-trigger href=""></a>

```

To assign a drawer id to the directive:

```html
<a drawer-trigger="0" href=""></a>
```

If no drawer id is specified, it implictly indicates the start of a new drawer.

Multiple drawerTrigger directives can be assigned to the same drawer.

### DrawerContents Directive

The drawerContents directive contains the contents of the drawer.
For applying CSS rules, it adds a 'drawer-contents' class to the element,
and a 'drawer-contents-open' class to the element when the drawer 
is opened.

```html
<div drawer-contents></div>
```

To assign a drawer id to the directive:

```html
<div drawer-contents="0"></div>
```
If no drawer id is specified, the drawerContents directive assigns itself 
to the drawer of the preceding drawerTrigger directive.

Multiple drawerContents directives can be assigned to the same drawer.

#### Handler

To be notified when the contents of a drawer is shown or hidden, pass in a 
handler function to the drawerContents directive. The handler function will
be passed an open state of either 'open' or 'closed'. 

```html
<div drawer-contents="ctrl.myHandler">...</div>

```

You can prevent the drawer from  being closed by returning the value 
`false` from the handler function.

```javascript
angular.module('app', []).controller('MyController', function() {
    this.myHandler = function(state) {
        if (state === 'closed') {
            ...    
            // I'm not ready to be closed.
            return false;
        }
        ...
    }
});
```

If you need to specify both a drawer id and a handler function, 
use array notation:

```html
<div drawer-contents="[0, ctrl.myHandler]"></div>
```

### DrawerClass Directive

The drawerClass directive assigns a particular class to an element whenever
the open state of the drawer changes.

```html
<div drawer-class="['myOpenClass', 'myClosedClass']"></div>

```
An example of using the drawerClass directive is in the
[accordion](https://github.com/JeffHing/angular-cabinet-ui/tree/master/src/examples/accordionDirective).
It uses the drawerClass directive to change the Font Awesome chevron icon
to point right or down, depending upon the open state of the drawer:

```html
 <i class="fa" accordion-class="[
            'fa-chevron-down',
            'fa-chevron-right']"></i>
```

To assign a drawer id to the directive:

```html
<div drawer-class="[0, 'myOpenClass', 'myClosedClass']"></div>
```

If no drawer id is specified, the drawerClass directive assigns itself 
to the drawer of the preceding drawerTrigger directive.

Multiple drawerClass directives can be assigned to the same drawer.
