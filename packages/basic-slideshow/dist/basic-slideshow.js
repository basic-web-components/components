(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _safeAttributes = require('./safeAttributes');

var _safeAttributes2 = _interopRequireDefault(_safeAttributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Memoized maps of attribute to property names and vice versa.
var attributeToPropertyNames = {};
var propertyNamesToAttributes = {};

/* Exported function extends a base class with AttributeMarshalling. */

exports.default = function (base) {

  /**
   * Mixin which marshalls attributes to properties and vice versa.
   *
   * If your component exposes a setter for a property, it's generally a good
   * idea to let devs using your component be able to set that property in HTML
   * via an element attribute. You can code that yourself by writing an
   * `attributeChangedCallback`, or you can use this mixin to get a degree of
   * automatic support.
   *
   * This mixin implements an `attributeChangedCallback` that will attempt to
   * convert a change in an element attribute into a call to the corresponding
   * property setter. Attributes typically follow hyphenated names ("foo-bar"),
   * whereas properties typically use camelCase names ("fooBar"). This mixin
   * respects that convention, automatically mapping the hyphenated attribute
   * name to the corresponding camelCase property name.
   *
   * Example: You define a component using this mixin:
   *
   *     class MyElement extends AttributeMarshallingMixin(HTMLElement) {
   *       get fooBar() { return this._fooBar; }
   *       set fooBar(value) { this._fooBar = value; }
   *     }
   *     customElements.define('my-element', MyElement);
   *
   * If someone then instantiates your component in HTML:
   *
   *     <my-element foo-bar="Hello"></my-element>
   *
   * Then, after the element has been upgraded, the `fooBar` setter will
   * automatically be invoked with the initial value "Hello".
   *
   * For the time being, this mixin only supports string-valued properties.
   * If you'd like to convert string attributes to other types (numbers,
   * booleans), you need to implement `attributeChangedCallback` yourself.
   */
  var AttributeMarshalling = function (_base) {
    _inherits(AttributeMarshalling, _base);

    function AttributeMarshalling() {
      _classCallCheck(this, AttributeMarshalling);

      return _possibleConstructorReturn(this, (AttributeMarshalling.__proto__ || Object.getPrototypeOf(AttributeMarshalling)).apply(this, arguments));
    }

    _createClass(AttributeMarshalling, [{
      key: 'attributeChangedCallback',


      /*
       * Handle a change to the attribute with the given name.
       */
      value: function attributeChangedCallback(attributeName, oldValue, newValue) {
        if (_get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this)) {
          _get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'attributeChangedCallback', this).call(this);
        }
        var propertyName = attributeToPropertyName(attributeName);
        // If the attribute name corresponds to a property name, set the property.
        // Ignore standard HTMLElement properties handled by the DOM.
        if (propertyName in this && !(propertyName in HTMLElement.prototype)) {
          this[propertyName] = newValue;
        }
      }
    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        if (_get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'connectedCallback', this)) {
          _get(AttributeMarshalling.prototype.__proto__ || Object.getPrototypeOf(AttributeMarshalling.prototype), 'connectedCallback', this).call(this);
        }
        _safeAttributes2.default.connected(this);
      }
    }, {
      key: 'reflectAttribute',


      /**
       * Set/unset the attribute with the indicated name.
       *
       * This method exists primarily to handle the case where an element wants to
       * set a default property value that should be reflected as an attribute. An
       * important limitation of custom element consturctors is that they cannot
       * set attributes. A call to `reflectAttribute` during the constructor will
       * be deferred until the element is connected to the document.
       *
       * @param {string} attribute - The name of the *attribute* (not property) to set.
       * @param {object} value - The value to set. If null, the attribute will be removed.
       */
      value: function reflectAttribute(attribute, value) {
        return _safeAttributes2.default.setAttribute(this, attribute, value);
      }

      /**
       * Set/unset the class with the indicated name.
       *
       * This method exists primarily to handle the case where an element wants to
       * set a default property value that should be reflected as as class. An
       * important limitation of custom element consturctors is that they cannot
       * set attributes, including the `class` attribute. A call to
       * `reflectClass` during the constructor will be deferred until the element
       * is connected to the document.
       *
       * @param {string} className - The name of the class to set.
       * @param {object} value - True to set the class, false to remove it.
       */

    }, {
      key: 'reflectClass',
      value: function reflectClass(className, value) {
        return _safeAttributes2.default.toggleClass(this, className, value);
      }
    }], [{
      key: 'observedAttributes',
      get: function get() {
        return attributesForClass(this);
      }
    }]);

    return AttributeMarshalling;
  }(base);

  return AttributeMarshalling;
};

// Convert hyphenated foo-bar attribute name to camel case fooBar property name.


function attributeToPropertyName(attributeName) {
  var propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    var hypenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hypenRegEx, function (match) {
      return match[1].toUpperCase();
    });
    attributeToPropertyNames[attributeName] = propertyName;
  }
  return propertyName;
}

function attributesForClass(classFn) {

  // We treat the element base classes as if they have no attributes, since we
  // don't want to receive attributeChangedCallback for them.
  if (classFn === HTMLElement || classFn === Object) {
    return [];
  }

  // Get attributes for parent class.
  var baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
  var baseAttributes = attributesForClass(baseClass);

  // Get attributes for this class.
  var propertyNames = Object.getOwnPropertyNames(classFn.prototype);
  var setterNames = propertyNames.filter(function (propertyName) {
    return typeof Object.getOwnPropertyDescriptor(classFn.prototype, propertyName).set === 'function';
  });
  var attributes = setterNames.map(function (setterName) {
    return propertyNameToAttribute(setterName);
  });

  // Merge.
  var diff = attributes.filter(function (attribute) {
    return baseAttributes.indexOf(attribute) < 0;
  });
  return baseAttributes.concat(diff);
}

// Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
function propertyNameToAttribute(propertyName) {
  var attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    var uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, '-$1').toLowerCase();
  }
  return attribute;
}

},{"./safeAttributes":15}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with Composable. */
exports.default = function (base) {

  /**
   * Mixin to make a class more easily composable with other mixins.
   *
   * This mixin contributes a `compose` method that applies a set of mixin
   * functions and returns the resulting new class. This sugar can make the
   * application of many mixins at once easier to read.
   */
  var Composable = function (_base) {
    _inherits(Composable, _base);

    function Composable() {
      _classCallCheck(this, Composable);

      return _possibleConstructorReturn(this, (Composable.__proto__ || Object.getPrototypeOf(Composable)).apply(this, arguments));
    }

    _createClass(Composable, null, [{
      key: 'compose',


      /**
       * Apply a set of mixin functions or mixin objects to the present class and
       * return the new class.
       *
       * Instead of writing:
       *
       *     let MyClass = Mixin1(Mixin2(Mixin3(Mixin4(Mixin5(BaseClass)))));
       *
       * You can write:
       *
       *     let MyClass = ComposableMixin(BaseClass).compose(
       *       Mixin1,
       *       Mixin2,
       *       Mixin3,
       *       Mixin4,
       *       Mixin5
       *     );
       *
       * This function can also take mixin objects. A mixin object is just a
       * shorthand for a mixin function that creates a new subclass with the given
       * members. The mixin object's members are *not* copied directly onto the
       * prototype of the base class, as with traditional mixins.
       *
       * In addition to providing syntactic sugar, this mixin can be used to
       * define a class in ES5, which lacks ES6's `class` keyword.
       *
       * @param {...mixins} mixins - A set of mixin functions or objects to apply.
       */
      value: function compose() {
        for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
          mixins[_key] = arguments[_key];
        }

        // We create a new subclass for each mixin in turn. The result becomes
        // the base class extended by any subsequent mixins. It turns out that
        // we can use Array.reduce() to concisely express this, using the current
        // object as the seed for reduce().
        return mixins.reduce(composeClass, this);
      }
    }]);

    return Composable;
  }(base);

  return Composable;
};

// Properties defined by Object that we don't want to mixin.


var NON_MIXABLE_OBJECT_PROPERTIES = ['constructor'];

/*
 * Apply the mixin to the given base class to return a new class.
 * The mixin can either be a function that returns the modified class, or a
 * plain object whose members will be copied to the new class' prototype.
 */
function composeClass(base, mixin) {
  if (typeof mixin === 'function') {
    // Mixin function
    return mixin(base);
  } else {
    // Mixin object
    var Subclass = function (_base2) {
      _inherits(Subclass, _base2);

      function Subclass() {
        _classCallCheck(this, Subclass);

        return _possibleConstructorReturn(this, (Subclass.__proto__ || Object.getPrototypeOf(Subclass)).apply(this, arguments));
      }

      return Subclass;
    }(base);

    copyOwnProperties(mixin, Subclass.prototype, NON_MIXABLE_OBJECT_PROPERTIES);
    return Subclass;
  }
}

/*
 * Copy the given properties/methods to the target.
 * Return the updated target.
 */
function copyOwnProperties(source, target) {
  var ignorePropertyNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  Object.getOwnPropertyNames(source).forEach(function (name) {
    if (ignorePropertyNames.indexOf(name) < 0) {
      var descriptor = Object.getOwnPropertyDescriptor(source, name);
      Object.defineProperty(target, name, descriptor);
    }
  });
  return target;
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _toggleClass = require('./toggleClass');

var _toggleClass2 = _interopRequireDefault(_toggleClass);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var itemsSymbol = (0, _createSymbol2.default)('items');
var itemInitializedSymbol = (0, _createSymbol2.default)('itemInitialized');

/* Exported function extends a base class with ContentItems. */

exports.default = function (base) {

  /**
   * Mixin which maps content semantics (elements) to list item semantics.
   *
   * Items differ from element contents in several ways:
   *
   * * They are often referenced via index.
   * * They may have a selection state.
   * * It's common to do work to initialize the appearance or state of a new
   *   item.
   * * Auxiliary invisible child elements are filtered out and not counted as
   *   items. Auxiliary elements include link, script, style, and template
   *   elements. This filtering ensures that those auxiliary elements can be
   *   used in markup inside of a list without being treated as list items.
   *
   * This mixin expects a component to provide a `content` property returning a
   * raw set of elements. You can provide that yourself, or use
   * [DistributedChildrenContentMixin](DistributedChildrenContentMixin.md).
   *
   * The most commonly referenced property defined by this mixin is the `items`
   * property. To avoid having to do work each time that property is requested,
   * this mixin supports an optimized mode. If you invoke the `contentChanged`
   * method when the set of items changes, the mixin concludes that you'll take
   * care of notifying it of future changes, and turns on the optimization. With
   * that on, the mixin saves a reference to the computed set of items, and will
   * return that immediately on subsequent calls to the `items` property. If you
   * use this mixin in conjunction with
   * [DistributedChildrenContentMixin](DistributedChildrenContentMixin.md), the
   * `contentChanged` method will be invoked for you when the element's children
   * change, turning on the optimization automatically.
   */
  var ContentItems = function (_base) {
    _inherits(ContentItems, _base);

    function ContentItems() {
      _classCallCheck(this, ContentItems);

      return _possibleConstructorReturn(this, (ContentItems.__proto__ || Object.getPrototypeOf(ContentItems)).apply(this, arguments));
    }

    _createClass(ContentItems, [{
      key: _symbols2.default.applySelection,


      /**
       * Apply the selection state to a single item.
       *
       * Invoke this method to signal that the selected state of the indicated item
       * has changed. By default, this applies a `selected` CSS class if the item
       * is selected, and removed it if not selected.
       *
       * @param {HTMLElement} item - The item whose selection state has changed.
       * @param {boolean} selected - True if the item is selected, false if not.
       */
      value: function value(item, selected) {
        if (_get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.applySelection, this)) {
          _get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.applySelection, this).call(this, item, selected);
        }
        (0, _toggleClass2.default)(item, 'selected', selected);
      }
    }, {
      key: 'contentChanged',
      value: function contentChanged() {
        if (_get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), 'contentChanged', this)) {
          _get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), 'contentChanged', this).call(this);
        }

        // Since we got the contentChanged call, we'll assume we'll be notified if
        // the set of items changes later. We turn on memoization of the items
        // property by setting our internal property to null (instead of
        // undefined).
        this[itemsSymbol] = null;

        this.itemsChanged();
      }

      /**
       * This method is invoked whenever a new item is added to the list.
       *
       * The default implementation of this method does nothing. You can override
       * this to perform per-item initialization.
       *
       * @param {HTMLElement} item - The item that was added.
       */

    }, {
      key: _symbols2.default.itemAdded,
      value: function value(item) {
        if (_get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.itemAdded, this)) {
          _get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), _symbols2.default.itemAdded, this).call(this, item);
        }
      }

      /**
       * The current set of items in the list. See the top-level documentation for
       * mixin for a description of how items differ from plain content.
       *
       * @type {HTMLElement[]}
       */

    }, {
      key: 'itemsChanged',


      /**
       * This method is invoked when the underlying contents change. It is also
       * invoked on component initialization – since the items have "changed" from
       * being nothing.
       */
      value: function itemsChanged() {
        var _this2 = this;

        if (_get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), 'itemsChanged', this)) {
          _get(ContentItems.prototype.__proto__ || Object.getPrototypeOf(ContentItems.prototype), 'itemsChanged', this).call(this);
        }

        // Perform per-item initialization.
        this.items.forEach(function (item) {
          if (!item[itemInitializedSymbol]) {
            _this2[_symbols2.default.itemAdded](item);
            item[itemInitializedSymbol] = true;
          }
        });

        this.dispatchEvent(new CustomEvent('items-changed'));
      }

      /**
       * Fires when the items in the list change.
       *
       * @memberof ContentItems
       * @event items-changed
       */

    }, {
      key: 'items',
      get: function get() {
        var items = void 0;
        if (this[itemsSymbol] == null) {
          items = filterAuxiliaryElements(this.content);
          // Note: test for *equality* with null; don't treat undefined as a match.
          if (this[itemsSymbol] === null) {
            // Memoize the set of items.
            this[itemsSymbol] = items;
          }
        } else {
          // Return the memoized items.
          items = this[itemsSymbol];
        }
        return items;
      }
    }]);

    return ContentItems;
  }(base);

  return ContentItems;
};

// Return the given elements, filtering out auxiliary elements that aren't
// typically visible. Items which are not elements are returned as is.


function filterAuxiliaryElements(items) {
  var auxiliaryTags = ['link', 'script', 'style', 'template'];
  return [].filter.call(items, function (item) {
    return !item.localName || auxiliaryTags.indexOf(item.localName) < 0;
  });
}

},{"./createSymbol":13,"./symbols":16,"./toggleClass":17}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _microtask = require('./microtask');

var _microtask2 = _interopRequireDefault(_microtask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with DistributedChildrenContent. */
exports.default = function (base) {

  /**
   * Mixin which defines a component's content as its children, expanding any
   * nodes distributed to the component's slots.
   *
   * This also provides notification of changes to a component's content. It
   * will invoke a `contentChanged` method when the component is first
   * instantiated, and whenever its distributed children change. This is an
   * easy way to satisfy the Gold Standard checklist item for monitoring
   * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
   *
   * Example:
   *
   * ```
   * let base = DistributedChildrenContentMixin(DistributedChildrenMixin(HTMLElement));
   * class CountingElement extends base {
   *
   *   constructor() {
   *     super();
   *     let root = this.attachShadow({ mode: 'open' });
   *     root.innerHTML = `<slot></slot>`;
   *   }
   *
   *   contentChanged() {
   *     // Count the component's children, both initially and when changed.
   *     this.count = this.distributedChildren.length;
   *   }
   *
   * }
   * ```
   *
   * Note that content change detection depends upon the element having at least
   * one `slot` element in its shadow subtree.
   *
   * This mixin is intended for use with the
   * [DistributedChildrenMixin](DistributedChildrenMixin.md). See that mixin for
   * a discussion of how that works. This DistributedChildrenContentMixin
   * provides an easy way of defining the "content" of a component as the
   * component's distributed children. That in turn lets mixins like
   * [ContentItemsMixin](ContentItemsMixin.md) manipulate the children as list
   * items.
   */
  var DistributedChildrenContent = function (_base) {
    _inherits(DistributedChildrenContent, _base);

    function DistributedChildrenContent() {
      _classCallCheck(this, DistributedChildrenContent);

      var _this = _possibleConstructorReturn(this, (DistributedChildrenContent.__proto__ || Object.getPrototypeOf(DistributedChildrenContent)).call(this));

      if (_this.shadowRoot) {
        // Listen to changes on all slots.
        var slots = _this.shadowRoot.querySelectorAll('slot');
        slots.forEach(function (slot) {
          return slot.addEventListener('slotchange', function (event) {
            _this.contentChanged();
          });
        });
      }

      // Make an initial call to contentChanged() so that the component can do
      // initialization that it normally does when content changes.
      //
      // This will invoke contentChanged() handlers in other mixins. In order
      // that those mixins have a chance to complete their own initialization,
      // we add the contentChanged() call to the microtask queue.
      (0, _microtask2.default)(function () {
        return _this.contentChanged();
      });
      return _this;
    }

    /**
     * Invoked when the contents of the component (including distributed
     * children) have changed.
     *
     * This method is also invoked when a component is first instantiated; the
     * contents have essentially "changed" from being nothing. This allows the
     * component to perform initial processing of its children.
     */


    _createClass(DistributedChildrenContent, [{
      key: 'contentChanged',
      value: function contentChanged() {
        if (_get(DistributedChildrenContent.prototype.__proto__ || Object.getPrototypeOf(DistributedChildrenContent.prototype), 'contentChanged', this)) {
          _get(DistributedChildrenContent.prototype.__proto__ || Object.getPrototypeOf(DistributedChildrenContent.prototype), 'contentChanged', this).call(this);
        }
        var event = new CustomEvent('content-changed');
        this.dispatchEvent(event);
      }

      /**
       * The content of this component, defined to be the flattened array of
       * children distributed to the component.
       *
       * @type {HTMLElement[]}
       */

    }, {
      key: 'content',
      get: function get() {
        var distributedChildren = this.distributedChildren;
        if (typeof distributedChildren === 'undefined') {
          console.warn('DistributedChildrenContentMixin expects the component to define a "distributedChildren" property.');
        }
        return distributedChildren;
      },
      set: function set(value) {
        if ('content' in base.prototype) {
          _set(DistributedChildrenContent.prototype.__proto__ || Object.getPrototypeOf(DistributedChildrenContent.prototype), 'content', value, this);
        }
        // TODO: Set the children to the given value (which should be an array of
        // elements)?
      }

      /**
       * This event is raised when the component's contents (including distributed
       * children) have changed.
       *
       * @memberof DistributedChildrenContent
       * @event content-changed
       */

    }]);

    return DistributedChildrenContent;
  }(base);

  return DistributedChildrenContent;
};

},{"./microtask":14}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with DistributedChildren. */
exports.default = function (base) {

  /**
   * Mixin which defines helpers for accessing a component's distributed
   * children as a flattened array or string.
   *
   * The standard DOM API provides several ways of accessing child content:
   * `children`, `childNodes`, and `textContent`. None of these functions are
   * Shadow DOM aware. This mixin defines variations of those functions that
   * *are* Shadow DOM aware.
   *
   * Example: you create a component `<count-children>` that displays a number
   * equal to the number of children placed inside that component. If someone
   * instantiates your component like:
   *
   *     <count-children>
   *       <div></div>
   *       <div></div>
   *       <div></div>
   *     </count-children>
   *
   * Then the component should show "3", because there are three children. To
   * calculate the number of children, the component can just calculate
   * `this.children.length`. However, suppose someone instantiates your
   * component inside one of their own components, and puts a `<slot>` element
   * inside your component:
   *
   *     <count-children>
   *       <slot></slot>
   *     </count-children>
   *
   * If your component only looks at `this.children`, it will always see exactly
   * one child — the `<slot>` element. But the user looking at the page will
   * *see* any nodes distributed to that slot. To match what the user sees, your
   * component should expand any `<slot>` elements it contains.
   *
   * That is the problem this mixin solves. After applying this mixin, your
   * component code has access to `this.distributedChildren`, whose `length`
   * will return the total number of all children distributed to your component
   * in the composed tree.
   *
   * Note: The latest Custom Elements API design calls for a new function,
   * `getAssignedNodes` that takes an optional `deep` parameter, that will solve
   * this problem at the API level.
   */
  var DistributedChildren = function (_base) {
    _inherits(DistributedChildren, _base);

    function DistributedChildren() {
      _classCallCheck(this, DistributedChildren);

      return _possibleConstructorReturn(this, (DistributedChildren.__proto__ || Object.getPrototypeOf(DistributedChildren)).apply(this, arguments));
    }

    _createClass(DistributedChildren, [{
      key: 'distributedChildren',


      /**
       * An in-order collection of distributed children, expanding any slot
       * elements. Like the standard children property, this skips text nodes.
       *
       * @type {HTMLElement[]}
       */
      get: function get() {
        return expandContentElements(this.children, false);
      }

      /**
       * An in-order collection of distributed child nodes, expanding any slot
       * elements. Like the standard childNodes property, this includes text
       * nodes.
       *
       * @type {Node[]}
       */

    }, {
      key: 'distributedChildNodes',
      get: function get() {
        return expandContentElements(this.childNodes, true);
      }

      /**
       * The concatenated text content of all distributed child nodes, expanding
       * any slot elements.
       *
       * @type {string}
       */

    }, {
      key: 'distributedTextContent',
      get: function get() {
        var strings = this.distributedChildNodes.map(function (child) {
          return child.textContent;
        });
        return strings.join('');
      }
    }]);

    return DistributedChildren;
  }(base);

  return DistributedChildren;
};

/*
 * Given a array of nodes, return a new array with any content elements expanded
 * to the nodes distributed to that content element. This rule is applied
 * recursively.
 *
 * If includeTextNodes is true, text nodes will be included, as in the
 * standard childNodes property; by default, this skips text nodes, like the
 * standard children property.
 */


function expandContentElements(nodes, includeTextNodes) {
  var _ref;

  var expanded = Array.prototype.map.call(nodes, function (node) {
    // We want to see if the node is an instanceof HTMLSlotELement, but
    // that class won't exist if the browser that doesn't support native
    // Shadow DOM and if the Shadow DOM polyfill hasn't been loaded. Instead,
    // we do a simplistic check to see if the tag name is "slot".
    var isSlot = typeof HTMLSlotElement !== 'undefined' ? node instanceof HTMLSlotElement : node.localName === 'slot';
    if (isSlot) {
      // Use the nodes assigned to this node instead.
      var assignedNodes = node.assignedNodes({ flatten: true });
      return assignedNodes ? expandContentElements(assignedNodes, includeTextNodes) : [];
    } else if (node instanceof HTMLElement) {
      // Plain element; use as is.
      return [node];
    } else if (node instanceof Text && includeTextNodes) {
      // Text node.
      return [node];
    } else {
      // Comment, processing instruction, etc.; skip.
      return [];
    }
  });
  var flattened = (_ref = []).concat.apply(_ref, _toConsumableArray(expanded));
  return flattened;
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = mixin;

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var selectedFractionSymbol = (0, _createSymbol2.default)('selectedFraction');

/* Exported function extends a base class with FractionalSelection. */
function mixin(base) {

  /**
   * Adds support for fractional selection: treating a selection as a real
   * number that combines an integer portion (an index into a list), and a
   * fraction (indicating how far of the way we are to the next or previous
   * item).
   *
   * This is useful in components that support incremental operations during
   * dragging and swiping. Example: a carousel component has several items, and the
   * currently selected item is item 3. The user begins swiping to the left,
   * moving towards selecting item 4. Halfway through this operation, the
   * fractional selection value is 3.5.
   *
   * This value permits communication between mixins like
   * [SwipeDirectionMixin](./SwipeDirectionMixin.md) and
   * [TrackpadDirectionMixin](./TrackpadDirectionMixin.md), which generate
   * fractional selection values, and mixins like
   * [SelectionAnimationMixin](./SelectionAnimationMixin.md), which can render
   * selection at a fractional value.
   */
  var FractionalSelection = function (_base) {
    _inherits(FractionalSelection, _base);

    function FractionalSelection() {
      _classCallCheck(this, FractionalSelection);

      return _possibleConstructorReturn(this, (FractionalSelection.__proto__ || Object.getPrototypeOf(FractionalSelection)).apply(this, arguments));
    }

    _createClass(FractionalSelection, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        if (_get(FractionalSelection.prototype.__proto__ || Object.getPrototypeOf(FractionalSelection.prototype), 'connectedCallback', this)) {
          _get(FractionalSelection.prototype.__proto__ || Object.getPrototypeOf(FractionalSelection.prototype), 'connectedCallback', this).call(this);
        }
        this.selectedFraction = 0;
      }

      /**
       * A fractional value indicating how far the user has currently advanced to
       * the next/previous item. E.g., a `selectedFraction` of 3.5 indicates the
       * user is halfway between items 3 and 4.
       *
       * @type {number}
       */

    }, {
      key: 'selectedFraction',
      get: function get() {
        return this[selectedFractionSymbol];
      },
      set: function set(value) {
        this[selectedFractionSymbol] = value;
        if ('selectedFraction' in base.prototype) {
          _set(FractionalSelection.prototype.__proto__ || Object.getPrototypeOf(FractionalSelection.prototype), 'selectedFraction', value, this);
        }
        var event = new CustomEvent('selected-fraction-changed');
        this.dispatchEvent(event);
      }
    }]);

    return FractionalSelection;
  }(base);

  return FractionalSelection;
}

mixin.helpers = {

  /*
   * Dampen a selection that goes past the beginning or end of a list. This is
   * generally used to produce a visual effect of tension as the user tries to
   * go further in a direction that has no more items.
   *
   * Example: suppose `itemCount` is 5, indicating a list of 5 items. The index of
   * the last item is 4. If the `selection` parameter is 4.5, the user is trying
   * to go past this last item. When a damping function is applied, the resulting
   * value will be less than 4.5 (the actual value will be 4.25). When this
   * selection state is rendered, the user will see that, each unit distance the
   * drag travels has less and less visible effect. This is perceived as tension.
   *
   * @param {number} selection - A real number indicating a selection position
   * @param {number} itemCount - An integer for the number of items in the list
   * @returns {number} A real number representing the damped selection value.
   */
  dampedSelection: function dampedSelection(selection, itemCount) {
    var bound = itemCount - 1;
    var damped = void 0;
    if (selection < 0) {
      // Trying to go past beginning of list. Apply tension from the left edge.
      damped = -mixin.helpers.damping(-selection);
    } else if (selection >= bound) {
      // Trying to go past end of list. Apply tension from the right edge.
      damped = bound + mixin.helpers.damping(selection - bound);
    } else {
      // No damping required.
      damped = selection;
    }
    return damped;
  },


  /*
   * Calculate damping as a function of the distance past the minimum/maximum
   * values.
   *
   * We want to asymptotically approach an absolute minimum of 1 unit
   * below/above the actual minimum/maximum. This requires calculating a
   * hyperbolic function.
   *
   * See http://www.wolframalpha.com/input/?i=y+%3D+-1%2F%28x%2B1%29+%2B+1
   * for the one we use. The only portion of that function we care about is when
   * x is zero or greater. An important consideration is that the curve be
   * tangent to the diagonal line x=y at (0, 0). This ensures smooth continuity
   * with the normal drag behavior, in which the visible sliding is linear with
   * the distance the touchpoint has been dragged.
   */
  damping: function damping(x) {
    var y = -1 / (x + 1) + 1;
    return y;
  },


  /*
   * Return the current fractional selection value for the given element.
   *
   * This simply adds the element's `selectedIndex` and `selectedFraction`
   * properties.
   *
   * @param {HTMLElement} element - An element that supports selection
   */
  elementSelection: function elementSelection(element) {
    var selectedIndex = element.selectedIndex;
    if (selectedIndex < 0) {
      // No selection
      return;
    }
    var selectedFraction = element.selectedFraction || 0;
    return selectedIndex + selectedFraction;
  },


  /*
   * Breaks a fractional selection into its integer and fractional parts.
   *
   * Example: if passed 3.5, this returns { index: 3, fraction: 5 }.
   *
   * @param {number} selection – A real number representing a selection point
   * @returns {object} - An object with an `index` property holding the
   * selection's integer component, and a `fraction` property holding the
   * selection's fractional component.
   */
  selectionParts: function selectionParts(selection) {
    // Stupid IE doesn't have Math.trunc.
    // const index = Math.trunc(selection);
    var index = selection < 0 ? Math.ceil(selection) : Math.floor(selection);
    var fraction = selection - index;
    return { index: index, fraction: fraction };
  },


  /*
   * Returns a fractional selection point after accounting for wrapping, ensuring
   * that the integer portion of the selection stays between 0 and `itemCount`-1.
   * That is, the integer portion will always be a valid index into the list.
   *
   * Example of wrapping past the end of the list: if `selection` is 5.5 and
   * `itemCount` is 5, this returns 0.5. Example of wrapping past the beginning of
   * the list: if `selection` is 0.5 and `itemCount` is 5, this returns 4.5.
   *
   * @param {number} selection - A real number representing a selection point
   * @param {number} itemCount - The number of items in the list
   * @returns {number} - The result of wrapping the selection point
   */
  wrappedSelection: function wrappedSelection(selection, itemCount) {
    // Handles possibility of negative mod.
    // See http://stackoverflow.com/a/18618250/76472
    return (selection % itemCount + itemCount) % itemCount;
  },


  /*
   * Return the parts of a selection, first wrapping if necessary.
   *
   * @param {number} selection – A real number representing a selection point
   * @param {number} itemCount - The number of items in the list
   * @param {boolean} wrap – True if the selection should wrap to stay within the
   * list
   * @returns {object} – The parts of the selection, using the same format as
   * `selectionParts`.
   */
  wrappedSelectionParts: function wrappedSelectionParts(selection, itemCount, wrap) {
    if (wrap) {
      selection = mixin.helpers.wrappedSelection(selection, itemCount);
    }
    return mixin.helpers.selectionParts(selection);
  }
};

},{"./createSymbol":13}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = mixin;

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _FractionalSelectionMixin = require('./FractionalSelectionMixin');

var _FractionalSelectionMixin2 = _interopRequireDefault(_FractionalSelectionMixin);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var animationSymbol = (0, _createSymbol2.default)('animation');
var draggingSymbol = (0, _createSymbol2.default)('dragging');
var lastAnimationSymbol = (0, _createSymbol2.default)('lastAnimation');
var playingAnimationSymbol = (0, _createSymbol2.default)('animatingSelection');
var previousSelectionSymbol = (0, _createSymbol2.default)('previousSelection');
var selectionAnimationDurationSymbol = (0, _createSymbol2.default)('selectionAnimationDuration');
var selectionAnimationEffectSymbol = (0, _createSymbol2.default)('selectionAnimationEffect');
var selectionAnimationKeyframesSymbol = (0, _createSymbol2.default)('selectionAnimationKeyframes');
var resetAnimationsOnNextRenderSymbol = (0, _createSymbol2.default)('resetAnimationsOnNextRender');

/* Exported function extends a base class with SelectionAnimation. */
function mixin(base) {

  /**
   * Mixin which uses animation to show transitions between selection states.
   *
   * This mixin can be used by components that want to provide visible
   * animations when changing the selection. For example, a carousel component
   * may want to define a sliding animation effect shown when moving between
   * items.
   *
   * The animation is defined by a `selectionAnimationKeyframes` property; see
   * that property for details on how to define these keyframes. This animation
   * will be used in two ways. First, when moving strictly between items, the
   * animation will play smoothly to show the selection changing. Second, the
   * animation can be used to render the selection at a fixed point in the
   * transition between states. E.g., if the user pauses halfway through
   * dragging an element using [SwipeDirectionMixin](SwipeDirectionMixin.md)
   * or [TrackpadDirectionMixin](TrackpadDirectionMixin.md)s, then the selection
   * animation will be shown at the point exactly halfway through.
   *
   * This mixin expects a component to provide an `items` array of all elements
   * in the list, which can be provided via
   * [ContentItemsMixin](ContentItemsMixin.md). This mixin also expects
   * `selectedIndex` and `selectedItem` properties, which can be provided via
   * [SingleSelectionMixin](SingleSelectionMixin.md).
   *
   * This mixin supports a `selectionWraps` property. When true, the user can
   * navigate forward from the last item in the list and wrap around to the
   * first item, or navigate backward from the first item and wrap around to the
   * last item.
   *
   * This mixin uses the Web Animations API. For use on browsers which
   * do not support that API natively, you will need to load the
   * [Web Animations polyfill](https://github.com/web-animations/web-animations-js).
   */
  var SelectionAnimation = function (_base) {
    _inherits(SelectionAnimation, _base);

    function SelectionAnimation() {
      _classCallCheck(this, SelectionAnimation);

      // Set defaults.
      var _this = _possibleConstructorReturn(this, (SelectionAnimation.__proto__ || Object.getPrototypeOf(SelectionAnimation)).call(this));

      if (typeof _this.selectionAnimationDuration === 'undefined') {
        _this.selectionAnimationDuration = _this[_symbols2.default.defaults].selectionAnimationDuration;
      }
      if (typeof _this.selectionAnimationEffect === 'undefined' && _this.selectionAnimationKeyframes == null) {
        _this.selectionAnimationEffect = _this[_symbols2.default.defaults].selectionAnimationEffect;
      }

      _this[_symbols2.default.dragging] = false;
      return _this;
    }

    _createClass(SelectionAnimation, [{
      key: _symbols2.default.itemAdded,
      value: function value(item) {
        // We mark new items in the list as explicitly visible to ARIA. Otherwise,
        // when an item isn't visible on the screen, ARIA will assume the item is
        // of no interest to the user, and leave it out of the accessibility tree.
        // If the list contains 10 items, but only 3 are visible, a screen reader
        // might then announce the list only has 3 items. To ensure that screen
        // readers and other assistive technologies announce the correct total
        // number of items, we explicitly mark all items as not hidden. This will
        // expose them all in the accessibility tree, even the items which are
        // currently not rendered.
        //
        // TODO: Generally speaking, this entire mixin assumes that the user can
        // navigate through all items in a list. But an app could style an item as
        // display:none or visibility:hidden because the user is not allowed to
        // interact with that item at the moment. Support for this scenario should
        // be added. This would entail changing all locations where a mixin
        // function is counting items, iterating over the (visible) items, and
        // showing or hiding items. Among other things, the code below to make
        // items visible to ARIA would need to discriminate between items which
        // are invisible because of animation state, or invisible because the user
        // shouldn't interact with them.
        item.setAttribute('aria-hidden', false);
      }
    }, {
      key: 'itemsChanged',
      value: function itemsChanged() {
        if (_get(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'itemsChanged', this)) {
          _get(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'itemsChanged', this).call(this);
        }

        _resetAnimations(this);

        // TODO: Also reset our notion of the last rendered selection? This comes
        // up when a DOM removal causes the selected item to change position.
        // this[previousSelectionSymbol] = null;

        renderSelection(this);
      }
    }, {
      key: 'resetAnimations',
      value: function resetAnimations() {
        _resetAnimations(this);
      }

      /**
       * A fractional value indicating how far the user has currently advanced to
       * the next/previous item. E.g., a `selectedFraction` of 3.5 indicates the
       * user is halfway between items 3 and 4.
       *
       * For more details, see [FractionalSelectionMixin](FractionalSelectionMixin.md)
       * mixin.
       *
       * @type {number}
       */

    }, {
      key: _symbols2.default.defaults,
      get: function get() {
        var defaults = _get(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), _symbols2.default.defaults, this) || {};
        defaults.selectionAnimationDuration = 250;
        defaults.selectionAnimationEffect = 'slide';
        return defaults;
      }

      /*
       * Provide backing for the dragging property.
       * Also, when a drag begins, reset the animations.
       */

    }, {
      key: _symbols2.default.dragging,
      get: function get() {
        return this[draggingSymbol];
      },
      set: function set(value) {
        var previousValue = this[_symbols2.default.dragging];
        this[draggingSymbol] = value;
        if (_symbols2.default.dragging in base.prototype) {
          _set(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), _symbols2.default.dragging, value, this);
        }
        if (value && !previousValue) {
          // Have begun a drag.
          this[resetAnimationsOnNextRenderSymbol] = true;
        }
      }
    }, {
      key: 'selectedFraction',
      get: function get() {
        return _get(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectedFraction', this) || 0;
      },
      set: function set(value) {
        if ('selectedFraction' in base.prototype) {
          _set(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectedFraction', value, this);
        }
        renderSelection(this, this.selectedIndex, value);
      }
    }, {
      key: 'selectedIndex',
      get: function get() {
        return _get(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectedIndex', this);
      },
      set: function set(index) {
        if ('selectedIndex' in base.prototype) {
          _set(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectedIndex', index, this);
        }
        renderSelection(this, index, 0);
      }

      /**
       * The duration of a selection animation in milliseconds.
       *
       * This measures the amount of time required for a selection animation to
       * complete. This number remains constant, even if the number of items being
       * animated increases.
       *
       * The default value is 250 milliseconds (a quarter a second).
       *
       * @type {number}
       * @default 250
       */

    }, {
      key: 'selectionAnimationDuration',
      get: function get() {
        return this[selectionAnimationDurationSymbol];
      },
      set: function set(value) {
        this[selectionAnimationDurationSymbol] = value;
        if ('selectionAnimationDuration' in base.prototype) {
          _set(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectionAnimationDuration', value, this);
        }
      }

      /**
       * The name of a standard selection animation effect.
       *
       * This is a shorthand for setting the `selectionAnimationKeyframes`
       * property to standard keyframes. Supported string values:
       *
       * * "crossfade"
       * * "reveal"
       * * "revealWithFade"
       * * "showAdjacent"
       * * "slide"
       * * "slideWithGap"
       *
       * @type {string}
       * @default "slide"
       */

    }, {
      key: 'selectionAnimationEffect',
      get: function get() {
        return this[selectionAnimationEffectSymbol];
      },
      set: function set(value) {
        this[selectionAnimationEffectSymbol] = value;
        if ('selectionAnimationEffect' in base.prototype) {
          _set(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectionAnimationEffect', value, this);
        }
        this.selectionAnimationKeyframes = mixin.standardEffectKeyframes[value];
      }

      /**
       * The keyframes that define an animation that plays for an item when moving
       * forward in the sequence.
       *
       * This is an array of CSS rules that will be applied. These are used as
       * [keyframes](http://w3c.github.io/web-animations/#keyframes-section)
       * to animate the item with the
       * [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/animation).
       *
       * The animation represents the state of the next item as it moves from
       * completely unselected (offstage, usually right), to selected (center
       * stage), to completely unselected (offstage, usually left). The center time
       * of the animation should correspond to the item's quiscent selected state,
       * typically in the center of the stage and at the item's largest size.
       *
       * The default forward animation is a smooth slide at full size from right to
       * left.
       *
       * When moving the selection backward, this animation is played in reverse.
       *
       * @type {cssRules[]}
       */

    }, {
      key: 'selectionAnimationKeyframes',
      get: function get() {
        // Standard animation slides left/right, keeps adjacent items out of view.
        return this[selectionAnimationKeyframesSymbol];
      },
      set: function set(value) {
        this[selectionAnimationKeyframesSymbol] = value;
        if ('selectionAnimationKeyframes' in base.prototype) {
          _set(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectionAnimationKeyframes', value, this);
        }
        _resetAnimations(this);
        renderSelection(this);
      }
    }, {
      key: 'selectionWraps',
      get: function get() {
        return _get(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectionWraps', this);
      },
      set: function set(value) {
        if ('selectionWraps' in base.prototype) {
          _set(SelectionAnimation.prototype.__proto__ || Object.getPrototypeOf(SelectionAnimation.prototype), 'selectionWraps', value, this);
        }
        _resetAnimations(this);
        renderSelection(this);
      }
    }]);

    return SelectionAnimation;
  }(base);

  return SelectionAnimation;
}

// We expose helpers on the mixin function that we want to be able to unit test.
// Since these are on the function, not on the class emitted by the function,
// they don't end up getting exposed on actual element instances.
mixin.helpers = {

  /*
   * Calculate the animation fractions for an element's items at the given
   * selection point. This is used when rendering the element's selection state
   * instantaneously.
   *
   * This function considers the selectedIndex parameter, which can be a whole
   * or fractional number, and determines which items will be visible at that
   * index. This function then calculates a corresponding animation fraction: a
   * number between 0 and 1 indicating how far through the selection animation
   * an item should be shown, or null if the item should not be visible at that
   * selection index. These fractions are returned as an array, where the
   * animation fraction at position N corresponds to how item N should be shown.
   */
  animationFractionsForSelection: function animationFractionsForSelection(element, selection) {

    var items = element.items;
    if (!items) {
      return;
    }

    var itemCount = items.length;
    var selectionWraps = element.selectionWraps;

    return items.map(function (item, itemIndex) {
      // How many steps from the selection point to this item?
      var steps = stepsToIndex(itemCount, selectionWraps, selection, itemIndex);
      // To convert steps to animation fraction:
      // steps      animation fraction
      //  1         0     (stage right)
      //  0         0.5   (center stage)
      // -1         1     (stage left)
      var animationFraction = (1 - steps) / 2;
      return animationFraction >= 0 && animationFraction <= 1 ? animationFraction : null; // Outside animation range
    });
  },


  /*
   * Calculate the animation timings that should be used to smoothly animate the
   * element's items from one selection state to another.
   *
   * This returns an array of timings, where the timing at position N should be
   * used to animate item N. If an item's timing is null, then that item should
   * not take place in the animation, and should be hidden instead.
   */
  effectTimingsForSelectionAnimation: function effectTimingsForSelectionAnimation(element, fromSelection, toSelection) {

    var items = element.items;
    if (!items) {
      return;
    }
    var itemCount = items.length;
    var selectionWraps = element.selectionWraps;
    var toIndex = _FractionalSelectionMixin2.default.helpers.wrappedSelectionParts(toSelection, itemCount, selectionWraps).index;
    var totalSteps = stepsToIndex(itemCount, selectionWraps, fromSelection, toSelection);
    var direction = totalSteps >= 0 ? 'normal' : 'reverse';
    var fill = 'both';
    var totalDuration = element.selectionAnimationDuration;
    var stepDuration = totalSteps !== 0 ? totalDuration * 2 / Math.ceil(Math.abs(totalSteps)) : 0; // No steps required, animation will be instantenous.

    var timings = items.map(function (item, itemIndex) {
      var steps = stepsToIndex(itemCount, selectionWraps, itemIndex, toSelection);
      // If we include this item in the staggered sequence of animations we're
      // creating, where would the item appear in the sequence?
      var positionInSequence = totalSteps - steps;
      if (totalSteps < 0) {
        positionInSequence = -positionInSequence;
      }
      // So, is this item really included in the sequence?
      if (Math.ceil(positionInSequence) >= 0 && positionInSequence <= Math.abs(totalSteps)) {
        // Note that delay for first item will be negative. That will cause
        // the animation to start halfway through, which is what we want.
        var delay = stepDuration * (positionInSequence - 1) / 2;
        var endDelay = itemIndex === toIndex ? -stepDuration / 2 : // Stop halfway through.
        0; // Play animation until end.
        return { duration: stepDuration, direction: direction, fill: fill, delay: delay, endDelay: endDelay };
      } else {
        return null;
      }
    });

    return timings;
  }
};

// Keyframes for standard selection animation effects.
mixin.standardEffectKeyframes = {

  // Simple crossfade
  crossfade: [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }],

  // Reveal, as if sliding the top card off a deck of cards
  reveal: [{ transform: 'translateX(0%)', zIndex: 0 }, { transform: 'translateX(0%)', zIndex: 1 }, { transform: 'translateX(-100%)', zIndex: 2 }],

  // Google Photos-style reveal-with-fade animation
  revealWithFade: [{ transform: 'translateX(0%) scale(0.75)', opacity: 0, zIndex: 0 }, { transform: 'translateX(0%) scale(1.0)', opacity: 1, zIndex: 1 }, { transform: 'translateX(-100%) scale(1.0)', opacity: 1, zIndex: 2 }],

  // Carousel variant with a bit of off-stage elements showing
  showAdjacent: [{ transform: 'translateX(78%) scale(0.7)', zIndex: 0 }, { transform: 'translateX(0%) scale(0.82)', zIndex: 1 }, { transform: 'translateX(-78%) scale(0.7)', zIndex: 0 }],

  // Simple slide
  slide: [{ transform: 'translateX(100%)' }, { transform: 'translateX(-100%)' }],

  // Slide, with a gap between
  slideWithGap: [{ transform: 'translateX(110%)' }, { transform: 'translateX(-110%)' }]

};

/*
 * Smoothly animate the selection between the indicated "from" and "to"
 * indices. The former can be a fraction, e.g., when the user releases a finger
 * to complete a touch drag, and the selection will snap to the closest whole
 * index.
 */
function animateSelection(element, fromSelection, toSelection) {

  _resetAnimations(element);

  // Calculate the animation timings.
  var items = element.items;
  var keyframes = element.selectionAnimationKeyframes;
  element[playingAnimationSymbol] = true;
  var timings = mixin.helpers.effectTimingsForSelectionAnimation(element, fromSelection, toSelection);

  // Figure out which item will be the one *after* the one we're selecting.
  var itemCount = items.length;
  var selectionWraps = element.selectionWraps;
  var selectionIndex = _FractionalSelectionMixin2.default.helpers.selectionParts(toSelection, itemCount, selectionWraps).index;
  var totalSteps = stepsToIndex(itemCount, selectionWraps, fromSelection, toSelection);
  var forward = totalSteps >= 0;
  var nextUpIndex = selectionIndex + (forward ? 1 : -1);
  if (selectionWraps) {
    nextUpIndex = _FractionalSelectionMixin2.default.helpers.wrappedSelection(nextUpIndex, itemCount);
  } else if (!isItemIndexInBounds(element, nextUpIndex)) {
    nextUpIndex = null; // At start/end of list; don't have a next item to show.
  }

  // Play the animations using those timings.
  var lastAnimationDetails = void 0;
  timings.forEach(function (timing, index) {
    var item = items[index];
    if (timing) {
      showItem(item, true);
      var animation = item.animate(keyframes, timing);
      element[animationSymbol][index] = animation;
      if (index === nextUpIndex) {
        // This item will be animated, so will already be in the desired state
        // after the animation completes.
        nextUpIndex = null;
      }
      if (timing.endDelay !== 0) {
        // This is the animation for the item that will be left selected.
        // We want to clean up when this animation completes.
        lastAnimationDetails = { animation: animation, index: index, timing: timing, forward: forward };
      }
    } else {
      // This item doesn't participate in the animation.
      showItem(item, false);
    }
  });

  if (lastAnimationDetails != null) {
    // Arrange for clean-up work to be performed.
    lastAnimationDetails.nextUpIndex = nextUpIndex;
    lastAnimationDetails.animation.onfinish = function (event) {
      return selectionAnimationFinished(element, lastAnimationDetails);
    };
    element[lastAnimationSymbol] = lastAnimationDetails.animation;
  } else {
    // Shouldn't happen -- we should always have at least one animation.
    element[playingAnimationSymbol] = false;
  }
}

function getAnimationForItemIndex(element, index) {
  if (element[animationSymbol] == null) {
    // Not ready yet;
    return null;
  }
  var animation = element[animationSymbol][index];
  if (!animation) {
    var item = element.items[index];
    animation = item.animate(element.selectionAnimationKeyframes, {
      duration: element.selectionAnimationDuration,
      fill: 'both'
    });
    animation.pause();
    element[animationSymbol][index] = animation;
  }
  return animation;
}

function isItemIndexInBounds(element, index) {
  return index >= 0 && element.items && index < element.items.length;
}

/*
 * Render the selection state of the element.
 *
 * This can be used to re-render a previous selection state (if the
 * selectedIndex param is omitted), render the selection instantly at a given
 * whole or fractional selection index, or animate to a given selection index.
 *
 * There are several distinct scenarios we need to cover:
 *
 * 1. Initial positioning, or repositioning after changing a property like
 *    selectionAnimationKeyframes that affects rendering.
 * 2. Animate on selectedIndex change. This should override any animation/swipe
 *    already in progress.
 * 3. Instantly render the current position of a drag operation in progress.
 * 4. Complete a drag operation. If the drag wasn't far enough to affect
 *    selection, we'll just be restoring the selectedFraction to 0.
 *
 * If the list does not wrap, any selection position outside the list's bounds
 * will be damped to produce a visual effect of tension.
 */
function renderSelection(element) {
  var selectedIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : element.selectedIndex;
  var selectedFraction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : element.selectedFraction;

  var itemCount = element.items ? element.items.length : 0;
  if (itemCount === 0) {
    // Nothing to render.
    return;
  }
  if (selectedIndex < 0) {
    // TODO: Handle no selection.
    return;
  }
  var selection = selectedIndex + selectedFraction;
  if (element.selectionWraps) {
    // Apply wrapping to ensure consistent representation of selection.
    selection = _FractionalSelectionMixin2.default.helpers.wrappedSelection(selection, itemCount);
  } else {
    // Apply damping if necessary.
    selection = _FractionalSelectionMixin2.default.helpers.dampedSelection(selection, itemCount);
  }
  var previousSelection = element[previousSelectionSymbol];
  // TODO: If an item changes position in the DOM, we end up animating from
  // its old index to its new index, but we really don't want to animate at all.
  if (!element[_symbols2.default.dragging] && previousSelection != null && previousSelection !== selection) {
    // Animate selection from previous state to new state.
    animateSelection(element, previousSelection, selection);
  } else if (selectedFraction === 0 && element[playingAnimationSymbol]) {
    // Already in process of animating to fraction 0. During that process,
    // ignore subsequent attempts to renderSelection to fraction 0.
    return;
  } else {
    // Render current selection state instantly.
    renderSelectionInstantly(element, selection);
  }
  element[previousSelectionSymbol] = selection;
}

/*
 * Instantly render (don't animate) the element's items at the given whole or
 * fractional selection index.
 */
function renderSelectionInstantly(element, toSelection) {
  if (element[resetAnimationsOnNextRenderSymbol]) {
    _resetAnimations(element);
    element[resetAnimationsOnNextRenderSymbol] = false;
  }
  var animationFractions = mixin.helpers.animationFractionsForSelection(element, toSelection);
  animationFractions.map(function (animationFraction, index) {
    var item = element.items[index];
    if (animationFraction != null) {
      showItem(item, true);
      setAnimationFraction(element, index, animationFraction);
    } else {
      showItem(item, false);
    }
  });
}

/*
 * We maintain an array containing an animation per item. This is used for two
 * reasons:
 *
 * * During a drag operation, we want to be able to reuse animations between
 *   drag updates.
 * * When a selection animation completes, we need to be able to leave the
 *   visibile items in a paused state. Later, we'll want to be able to clean up
 *   those animations.
 *
 * Note that this array is sparse: it will only hold up from 0–3 animations at
 * any given point.
 */
function _resetAnimations(element) {
  var animations = element[animationSymbol];
  if (animations) {
    // Cancel existing animations to remove the effects they're applying.
    animations.forEach(function (animation, index) {
      if (animation) {
        animation.cancel();
        animations[index] = null;
      }
    });
  }
  var itemCount = element.items ? element.items.length : 0;
  if (!animations || animations.length !== itemCount) {
    // Haven't animated before with this number of items; (re)create array.
    element[animationSymbol] = new Array(itemCount);
  }
}

/*
 * The last animation in our selection animation has completed. Clean up.
 */
function selectionAnimationFinished(element, details) {

  // When the last animation completes, show the next item in the direction
  // we're going. Waiting to that until this point is a bit of a hack to avoid
  // having a next item that's higher in the natural z-order obscure other items
  // during animation.
  var nextUpIndex = details.nextUpIndex;
  if (nextUpIndex != null) {
    if (element[animationSymbol][nextUpIndex]) {
      // Cancel existing selection animation so we can construct a new one.
      element[animationSymbol][nextUpIndex].cancel();
      element[animationSymbol][nextUpIndex] = null;
    }
    var animationFraction = details.forward ? 0 : 1;
    setAnimationFraction(element, nextUpIndex, animationFraction);
    showItem(element.items[nextUpIndex], true);
  }

  element[lastAnimationSymbol].onfinish = null;
  element[playingAnimationSymbol] = false;
}

/*
 * Pause the indicated animation and have it show the animation at the given
 * fraction (between 0 and 1) of the way through the animation.
 */
function setAnimationFraction(element, itemIndex, fraction) {
  var animation = getAnimationForItemIndex(element, itemIndex);
  if (animation) {
    var duration = element.selectionAnimationDuration;
    if (duration) {
      animation.currentTime = fraction * duration;
    }
  }
}

function showItem(item, flag) {
  item.style.visibility = flag ? 'visible' : 'hidden';
}

/*
 * Figure out how many steps it will take to go from fromSelection to
 * toSelection. To go from item 3 to item 4 is one step.
 *
 * If wrapping is allowed, then going from the last item to the first will take
 * one step (forward), and going from the first item to the last will take one
 * step (backward).
 */
function stepsToIndex(length, allowWrap, fromSelection, toSelection) {
  var steps = toSelection - fromSelection;
  // Wrapping only kicks in when list has more than 1 item.
  if (allowWrap && length > 1) {
    var wrapSteps = length - Math.abs(steps);
    if (wrapSteps <= 1) {
      // Special case
      steps = steps < 0 ? wrapSteps : // Wrap forward from last item to first.
      -wrapSteps; // Wrap backward from first item to last.
    }
  }
  return steps;
}

},{"./FractionalSelectionMixin":6,"./createSymbol":13,"./symbols":16}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Used to assign unique IDs to item elements without IDs.
var idCount = 0;

/* Exported function extends a base class with SelectionAriaActive. */

exports.default = function (base) {

  /**
   * Mixin which treats the selected item in a list as the active item in ARIA
   * accessibility terms.
   *
   * Handling ARIA selection state properly is actually quite complex:
   *
   * * The items in the list need to be indicated as possible items via an ARIA
   *   `role` attribute value such as "option".
   * * The selected item need to be marked as selected by setting the item's
   *   `aria-selected` attribute to true *and* the other items need be marked as
   *   *not* selected by setting `aria-selected` to false.
   * * The outermost element with the keyboard focus needs to have attributes
   *   set on it so that the selection is knowable at the list level via the
   *   `aria-activedescendant` attribute.
   * * Use of `aria-activedescendant` in turn requires that all items in the
   *   list have ID attributes assigned to them.
   *
   * This mixin tries to address all of the above requirements. To that end,
   * this mixin will assign generated IDs to any item that doesn't already have
   * an ID.
   *
   * ARIA relies on elements to provide `role` attributes. This mixin will apply
   * a default role of "listbox" on the outer list if it doesn't already have an
   * explicit role. Similarly, this mixin will apply a default role of "option"
   * to any list item that does not already have a role specified.
   *
   * This mixin expects a set of members that manage the state of the selection:
   * `[symbols.applySelection]`, `itemAdded`, and `selectedIndex`. You can
   * supply these yourself, or do so via
   * [SingleSelectionMixin](SingleSelectionMixin.md).
   */
  var SelectionAriaActive = function (_base) {
    _inherits(SelectionAriaActive, _base);

    function SelectionAriaActive() {
      _classCallCheck(this, SelectionAriaActive);

      return _possibleConstructorReturn(this, (SelectionAriaActive.__proto__ || Object.getPrototypeOf(SelectionAriaActive)).apply(this, arguments));
    }

    _createClass(SelectionAriaActive, [{
      key: _symbols2.default.applySelection,
      value: function value(item, selected) {
        if (_get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), _symbols2.default.applySelection, this)) {
          _get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), _symbols2.default.applySelection, this).call(this, item, selected);
        }
        item.setAttribute('aria-selected', selected);
        var itemId = item.id;
        if (itemId && selected) {
          this.setAttribute('aria-activedescendant', itemId);
        }
      }
    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        if (_get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), 'connectedCallback', this)) {
          _get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), 'connectedCallback', this).call(this);
        }
        // Set default ARIA role.
        if (this.getAttribute('role') == null) {
          this.setAttribute('role', this[_symbols2.default.defaults].role);
        }
      }
    }, {
      key: _symbols2.default.itemAdded,
      value: function value(item) {
        if (_get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), _symbols2.default.itemAdded, this)) {
          _get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), _symbols2.default.itemAdded, this).call(this, item);
        }

        if (!item.getAttribute('role')) {
          // Assign a default ARIA role.
          item.setAttribute('role', 'option');
        }

        // Ensure each item has an ID so we can set aria-activedescendant on the
        // overall list whenever the selection changes.
        //
        // The ID will take the form of a base ID plus a unique integer. The base
        // ID will be incorporate the component's own ID. E.g., if a component has
        // ID "foo", then its items will have IDs that look like "_fooOption1". If
        // the compnent has no ID itself, its items will get IDs that look like
        // "_option1". Item IDs are prefixed with an underscore to differentiate
        // them from manually-assigned IDs, and to minimize the potential for ID
        // conflicts.
        if (!item.id) {
          var baseId = this.id ? "_" + this.id + "Option" : "_option";
          item.id = baseId + idCount++;
        }
      }
    }, {
      key: _symbols2.default.defaults,
      get: function get() {
        var defaults = _get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), _symbols2.default.defaults, this) || {};
        defaults.role = 'listbox';
        return defaults;
      }
    }, {
      key: 'selectedItem',
      get: function get() {
        return _get(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), 'selectedItem', this);
      },
      set: function set(item) {
        if ('selectedItem' in base.prototype) {
          _set(SelectionAriaActive.prototype.__proto__ || Object.getPrototypeOf(SelectionAriaActive.prototype), 'selectedItem', item, this);
        }
        if (item == null) {
          // Selection was removed.
          this.removeAttribute('aria-activedescendant');
        }
      }
    }]);

    return SelectionAriaActive;
  }(base);

  return SelectionAriaActive;
};

},{"./symbols":16}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with ShadowElementReferences. */
exports.default = function (base) {

  /**
   * Mixin to create references to elements in a component's Shadow DOM subtree.
   *
   * This adds a member on the component called `this.$` that can be used to
   * reference shadow elements with IDs. E.g., if component's shadow contains an
   * element `<button id="foo">`, then this mixin will create a member
   * `this.$.foo` that points to that button.
   *
   * Such references simplify a component's access to its own elements. In
   * exchange, this mixin trades off a one-time cost of querying all elements in
   * the shadow tree instead of paying an ongoing cost to query for an element
   * each time the component wants to inspect or manipulate it.
   *
   * This mixin expects the component to define a Shadow DOM subtree. You can
   * create that tree yourself, or make use of
   * [ShadowTemplateMixin](ShadowTemplateMixin.md).
   *
   * This mixin is inspired by Polymer's [automatic
   * node finding](https://www.polymer-project.org/1.0/docs/devguide/local-dom.html#node-finding)
   * feature.
   */
  var ShadowElementReferences = function (_base) {
    _inherits(ShadowElementReferences, _base);

    function ShadowElementReferences() {
      _classCallCheck(this, ShadowElementReferences);

      var _this = _possibleConstructorReturn(this, (ShadowElementReferences.__proto__ || Object.getPrototypeOf(ShadowElementReferences)).call(this));

      if (_this.shadowRoot) {
        // Look for elements in the shadow subtree that have id attributes.
        // An alternatively implementation of this mixin would be to just define
        // a this.$ getter that lazily does this search the first time someone
        // tries to access this.$. That might introduce some complexity – if the
        // the tree changed after it was first populated, the result of
        // searching for a node might be somewhat unpredictable.
        _this.$ = {};
        var nodesWithIds = _this.shadowRoot.querySelectorAll('[id]');
        [].forEach.call(nodesWithIds, function (node) {
          var id = node.getAttribute('id');
          _this.$[id] = node;
        });
      }
      return _this;
    }

    /**
     * The collection of references to the elements with IDs in a component's
     * Shadow DOM subtree.
     *
     * @type {object}
     * @member $
     */


    return ShadowElementReferences;
  }(base);

  return ShadowElementReferences;
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Exported function extends a base class with ShadowTemplate. */
exports.default = function (base) {

  /**
   * Mixin for stamping a template into a Shadow DOM subtree upon component
   * instantiation.
   *
   * To use this mixin, define a `template` property as a string or HTML
   * `<template>` element:
   *
   *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
   *       get template() {
   *         return `Hello, <em>world</em>.`;
   *       }
   *     }
   *
   * When your component class is instantiated, a shadow root will be created on
   * the instance, and the contents of the template will be cloned into the
   * shadow root. If your component does not define a `template` property, this
   * mixin has no effect.
   *
   * For the time being, this extension retains support for Shadow DOM v0. That
   * will eventually be deprecated as browsers (and the Shadow DOM polyfill)
   * implement Shadow DOM v1.
   */
  var ShadowTemplate = function (_base) {
    _inherits(ShadowTemplate, _base);

    /*
     * If the component defines a template, a shadow root will be created on the
     * component instance, and the template stamped into it.
     */
    function ShadowTemplate() {
      _classCallCheck(this, ShadowTemplate);

      var _this = _possibleConstructorReturn(this, (ShadowTemplate.__proto__ || Object.getPrototypeOf(ShadowTemplate)).call(this));

      var template = _this.template;
      // TODO: Save the processed template with the component's class prototype
      // so it doesn't need to be processed with every instantiation.
      if (template) {

        if (typeof template === 'string') {
          // Upgrade plain string to real template.
          template = createTemplateWithInnerHTML(template);
        }

        if (window.ShadowDOMPolyfill) {
          shimTemplateStyles(template, _this.localName);
        }

        var root = _this.attachShadow({ mode: 'open' });
        var clone = document.importNode(template.content, true);
        root.appendChild(clone);
      }
      return _this;
    }

    return ShadowTemplate;
  }(base);

  return ShadowTemplate;
};

// Convert a plain string of HTML into a real template element.


function createTemplateWithInnerHTML(innerHTML) {
  var template = document.createElement('template');
  // REVIEW: Is there an easier way to do this?
  // We'd like to just set innerHTML on the template content, but since it's
  // a DocumentFragment, that doesn't work.
  var div = document.createElement('div');
  div.innerHTML = innerHTML;
  while (div.childNodes.length > 0) {
    template.content.appendChild(div.childNodes[0]);
  }
  return template;
}

// Invoke basic style shimming with ShadowCSS.
function shimTemplateStyles(template, tag) {
  window.WebComponents.ShadowCSS.shimStyling(template.content, tag);
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Symbols for private data members on an element.
var canSelectNextSymbol = (0, _createSymbol2.default)('canSelectNext');
var canSelectPreviousSymbol = (0, _createSymbol2.default)('canSelectPrevious');
var selectionRequiredSymbol = (0, _createSymbol2.default)('selectionRequired');
var selectionWrapsSymbol = (0, _createSymbol2.default)('selectionWraps');

// We want to expose both selectedIndex and selectedItem as independent
// properties but keep them in sync. This allows a component user to reference
// the selection by whatever means is most natural for their situation.
//
// To efficiently keep these properties in sync, we track "external" and
// "internal" references for each property:
//
// The external index or item is the one we report to the outside world when
// asked for selection.  When handling a change to index or item, we update the
// external reference as soon as possible, so that if anyone immediately asks
// for the current selection, they will receive a stable answer.
//
// The internal index or item tracks whichever index or item last received the
// full set of processing. Processing includes raising a change event for the
// new value. Once we've begun that processing, we store the new value as the
// internal value to indicate we've handled it.
//
var externalSelectedIndexSymbol = (0, _createSymbol2.default)('externalSelectedIndex');
var externalSelectedItemSymbol = (0, _createSymbol2.default)('externalSelectedItem');
var internalSelectedIndexSymbol = (0, _createSymbol2.default)('internalSelectedIndex');
var internalSelectedItemSymbol = (0, _createSymbol2.default)('internalSelectedItem');

/* Exported function extends a base class with SingleSelection. */

exports.default = function (base) {

  /**
   * Mixin which manages single-selection semantics for items in a list.
   *
   * This mixin expects a component to provide an `items` Array or NodeList of
   * all elements in the list. A standard way to do that with is the
   * [ContentItemsMixin](ContentItemsMixin.md), which takes a component's
   * content (typically its distributed children) as the set of list items; see
   * that mixin for details.
   *
   * This mixin tracks a single selected item in the list, and provides means to
   * get and set that state by item position (`selectedIndex`) or item identity
   * (`selectedItem`). The selection can be moved in the list via the methods
   * `selectFirst`, `selectLast`, `selectNext`, and `selectPrevious`.
   *
   * This mixin does not produce any user-visible effects to represent
   * selection. Other mixins, such as
   * [SelectionAriaActiveMixin](SelectionAriaActiveMixin.md),
   * [SelectionHighlightMixin](SelectionHighlightMixin.md) and
   * [SelectionInViewMixin](SelectionInViewMixin.md), modify the selected item
   * in common ways to let the user know a given item is selected or not
   * selected.
   */
  var SingleSelection = function (_base) {
    _inherits(SingleSelection, _base);

    function SingleSelection() {
      _classCallCheck(this, SingleSelection);

      // Set defaults.
      var _this = _possibleConstructorReturn(this, (SingleSelection.__proto__ || Object.getPrototypeOf(SingleSelection)).call(this));

      if (typeof _this.selectionRequired === 'undefined') {
        _this.selectionRequired = _this[_symbols2.default.defaults].selectionRequired;
      }
      if (typeof _this.selectionWraps === 'undefined') {
        _this.selectionWraps = _this[_symbols2.default.defaults].selectionWraps;
      }
      return _this;
    }

    /**
     * Apply the indicate selection state to the item.
     *
     * The default implementation of this method does nothing. User-visible
     * effects will typically be handled by other mixins.
     *
     * @param {HTMLElement} item - the item being selected/deselected
     * @param {boolean} selected - true if the item is selected, false if not
     */


    _createClass(SingleSelection, [{
      key: _symbols2.default.applySelection,
      value: function value(item, selected) {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.applySelection, this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.applySelection, this).call(this, item, selected);
        }
      }

      /**
       * True if the selection can be moved to the next item, false if not (the
       * selected item is the last item in the list).
       *
       * @type {boolean}
       */

    }, {
      key: _symbols2.default.itemAdded,


      /**
       * Handle a new item being added to the list.
       *
       * The default implementation of this method simply sets the item's
       * selection state to false.
       *
       * @param {HTMLElement} item - the item being added
       */
      value: function value(item) {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemAdded, this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.itemAdded, this).call(this, item);
        }
        this[_symbols2.default.applySelection](item, item === this.selectedItem);
      }
    }, {
      key: 'itemsChanged',
      value: function itemsChanged() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'itemsChanged', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'itemsChanged', this).call(this);
        }

        // In case selected item changed position or was removed.
        trackSelectedItem(this);

        // In case the change in items affected which navigations are possible.
        updatePossibleNavigations(this);
      }

      /**
       * The index of the item which is currently selected.
       *
       * A `selectedIndex` of -1 indicates there is no selection. Setting this
       * property to -1 will remove any existing selection.
       *
       * @type {number}
       */

    }, {
      key: 'selectFirst',


      /**
       * Select the first item in the list.
       */
      value: function selectFirst() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectFirst', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectFirst', this).call(this);
        }
        return selectIndex(this, 0);
      }

      /**
       * True if the list should always have a selection (if it has items).
       *
       * @type {boolean}
       * @default false
       */

    }, {
      key: 'selectLast',


      /**
       * Select the last item in the list.
       */
      value: function selectLast() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectLast', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectLast', this).call(this);
        }
        return selectIndex(this, this.items.length - 1);
      }

      /**
       * Select the next item in the list.
       */

    }, {
      key: 'selectNext',
      value: function selectNext() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectNext', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectNext', this).call(this);
        }
        return selectIndex(this, this.selectedIndex + 1);
      }

      /**
       * Select the previous item in the list.
       *
       * If the list has no selection, the last item will be selected.
       */

    }, {
      key: 'selectPrevious',
      value: function selectPrevious() {
        if (_get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectPrevious', this)) {
          _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectPrevious', this).call(this);
        }
        var newIndex = this.selectedIndex < 0 ? this.items.length - 1 : // No selection yet; select last item.
        this.selectedIndex - 1;
        return selectIndex(this, newIndex);
      }

      /**
       * Fires when the selectedItem property changes.
       *
       * @memberof SingleSelection
       * @event selected-item-changed
       * @param {HTMLElement} detail.selectedItem The new selected item.
       * @param {HTMLElement} detail.previousItem The previously selected item.
       */

      /**
       * Fires when the selectedIndex property changes.
       *
       * @memberof SingleSelection
       * @event selected-index-changed
       * @param {number} detail.selectedIndex The new selected index.
       */

    }, {
      key: 'canSelectNext',
      get: function get() {
        return this[canSelectNextSymbol];
      },
      set: function set(canSelectNext) {
        var previousCanSelectNext = this[canSelectNextSymbol];
        this[canSelectNextSymbol] = canSelectNext;
        if ('canSelectNext' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'canSelectNext', canSelectNext, this);
        }
        if (canSelectNext !== previousCanSelectNext) {
          this.dispatchEvent(new CustomEvent('can-select-next-changed'));
        }
      }

      /**
       * True if the selection can be moved to the previous item, false if not
       * (the selected item is the first one in the list).
       *
       * @type {boolean}
       */

    }, {
      key: 'canSelectPrevious',
      get: function get() {
        return this[canSelectPreviousSymbol];
      },
      set: function set(canSelectPrevious) {
        var previousCanSelectPrevious = this[canSelectPreviousSymbol];
        this[canSelectPreviousSymbol] = canSelectPrevious;
        if ('canSelectPrevious' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'canSelectPrevious', canSelectPrevious, this);
        }
        if (canSelectPrevious !== previousCanSelectPrevious) {
          this.dispatchEvent(new CustomEvent('can-select-previous-changed'));
        }
      }
    }, {
      key: _symbols2.default.defaults,
      get: function get() {
        var defaults = _get(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), _symbols2.default.defaults, this) || {};
        defaults.selectionRequired = false;
        defaults.selectionWraps = false;
        return defaults;
      }
    }, {
      key: 'selectedIndex',
      get: function get() {
        return this[externalSelectedIndexSymbol] != null ? this[externalSelectedIndexSymbol] : -1;
      },
      set: function set(index) {
        // See notes at top about internal vs. external copies of this property.
        var previousSelectedIndex = this[internalSelectedIndexSymbol];
        var item = void 0;
        if (index !== this[externalSelectedIndexSymbol]) {
          // Store the new index and the corresponding item.
          var items = this.items;
          var hasItems = items && items.length > 0;
          if (!(hasItems && index >= 0 && index < items.length)) {
            index = -1; // No item at that index.
          }
          this[externalSelectedIndexSymbol] = index;
          item = hasItems && index >= 0 ? items[index] : null;
          this[externalSelectedItemSymbol] = item;
        } else {
          item = this[externalSelectedItemSymbol];
        }

        // Now let super do any work.
        if ('selectedIndex' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectedIndex', index, this);
        }

        if (index !== previousSelectedIndex) {
          // The selected index changed.
          this[internalSelectedIndexSymbol] = index;

          var event = new CustomEvent('selected-index-changed', {
            detail: {
              selectedIndex: index,
              value: index // for Polymer binding. TODO: Verify still necessary
            }
          });
          this.dispatchEvent(event);
        }

        if (this[internalSelectedItemSymbol] !== item) {
          // Update selectedItem property so it can have its own effects.
          this.selectedItem = item;
        }
      }

      /**
       * The currently selected item, or null if there is no selection.
       *
       * Setting this property to null deselects any currently-selected item.
       * Setting this property to an object that is not in the list has no effect.
       *
       * TODO: Even if selectionRequired, can still explicitly set selectedItem to null.
       * TODO: If selectionRequired, leave selection alone?
       *
       * @type {object}
       */

    }, {
      key: 'selectedItem',
      get: function get() {
        return this[externalSelectedItemSymbol] || null;
      },
      set: function set(item) {
        // See notes at top about internal vs. external copies of this property.
        var previousSelectedItem = this[internalSelectedItemSymbol];
        var index = void 0;
        if (item !== this[externalSelectedItemSymbol]) {
          // Store item and look up corresponding index.
          var items = this.items;
          var hasItems = items && items.length > 0;
          index = hasItems ? Array.prototype.indexOf.call(items, item) : -1;
          this[externalSelectedIndexSymbol] = index;
          if (index < 0) {
            item = null; // The indicated item isn't actually in `items`.
          }
          this[externalSelectedItemSymbol] = item;
        } else {
          index = this[externalSelectedIndexSymbol];
        }

        // Now let super do any work.
        if ('selectedItem' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectedItem', item, this);
        }

        if (item !== previousSelectedItem) {
          // The selected item changed.
          this[internalSelectedItemSymbol] = item;

          if (previousSelectedItem) {
            // Update selection state of old item.
            this[_symbols2.default.applySelection](previousSelectedItem, false);
          }
          if (item) {
            // Update selection state to new item.
            this[_symbols2.default.applySelection](item, true);
          }

          updatePossibleNavigations(this);

          var event = new CustomEvent('selected-item-changed', {
            detail: {
              selectedItem: item,
              value: item // for Polymer binding
            }
          });
          this.dispatchEvent(event);
        }

        if (this[internalSelectedIndexSymbol] !== index) {
          // Update selectedIndex property so it can have its own effects.
          this.selectedIndex = index;
        }
      }
    }, {
      key: 'selectionRequired',
      get: function get() {
        return this[selectionRequiredSymbol];
      },
      set: function set(selectionRequired) {
        this[selectionRequiredSymbol] = selectionRequired;
        if ('selectionRequired' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectionRequired', selectionRequired, this);
        }
        trackSelectedItem(this);
      }

      /**
       * True if selection navigations wrap from last to first, and vice versa.
       *
       * @type {boolean}
       * @default false
       */

    }, {
      key: 'selectionWraps',
      get: function get() {
        return this[selectionWrapsSymbol];
      },
      set: function set(value) {
        this[selectionWrapsSymbol] = String(value) === 'true';
        if ('selectionWraps' in base.prototype) {
          _set(SingleSelection.prototype.__proto__ || Object.getPrototypeOf(SingleSelection.prototype), 'selectionWraps', value, this);
        }
        updatePossibleNavigations(this);
      }
    }]);

    return SingleSelection;
  }(base);

  return SingleSelection;
};

// Ensure the given index is within bounds, and select it if it's not already
// selected.


function selectIndex(element, index) {
  var count = element.items.length;

  var boundedIndex = element.selectionWraps ?
  // JavaScript mod doesn't handle negative numbers the way we want to wrap.
  // See http://stackoverflow.com/a/18618250/76472
  (index % count + count) % count :

  // Keep index within bounds of array.
  Math.max(Math.min(index, count - 1), 0);

  var previousIndex = element.selectedIndex;
  if (previousIndex !== boundedIndex) {
    element.selectedIndex = boundedIndex;
    return true;
  } else {
    return false;
  }
}

// Following a change in the set of items, or in the value of the
// `selectionRequired` property, reacquire the selected item. If it's moved,
// update `selectedIndex`. If it's been removed, and a selection is required,
// try to select another item.
function trackSelectedItem(element) {

  var items = element.items;
  var itemCount = items ? items.length : 0;

  var previousSelectedItem = element.selectedItem;
  if (!previousSelectedItem) {
    // No item was previously selected.
    if (element.selectionRequired) {
      // Select the first item by default.
      element.selectedIndex = 0;
    }
  } else if (itemCount === 0) {
    // We've lost the selection, and there's nothing left to select.
    element.selectedItem = null;
  } else {
    // Try to find the previously-selected item in the current set of items.
    var indexInCurrentItems = Array.prototype.indexOf.call(items, previousSelectedItem);
    var previousSelectedIndex = element.selectedIndex;
    if (indexInCurrentItems < 0) {
      // Previously-selected item was removed from the items.
      // Select the item at the same index (if it exists) or as close as possible.
      var newSelectedIndex = Math.min(previousSelectedIndex, itemCount - 1);
      // Select by item, since index may be the same, and we want to raise the
      // selected-item-changed event.
      element.selectedItem = items[newSelectedIndex];
    } else if (indexInCurrentItems !== previousSelectedIndex) {
      // Previously-selected item still there, but changed position.
      element.selectedIndex = indexInCurrentItems;
    }
  }
}

// Following a change in selection, report whether it's now possible to
// go next/previous from the given index.
function updatePossibleNavigations(element) {
  var canSelectNext = void 0;
  var canSelectPrevious = void 0;
  var items = element.items;
  if (items == null || items.length === 0) {
    // No items to select.
    canSelectNext = false;
    canSelectPrevious = false;
  }if (element.selectionWraps) {
    // Since there are items, can always go next/previous.
    canSelectNext = true;
    canSelectPrevious = true;
  } else {
    var index = element.selectedIndex;
    if (index < 0 && items.length > 0) {
      // Special case. If there are items but no selection, declare that it's
      // always possible to go next/previous to create a selection.
      canSelectNext = true;
      canSelectPrevious = true;
    } else {
      // Normal case: we have an index in a list that has items.
      canSelectPrevious = index > 0;
      canSelectNext = index < items.length - 1;
    }
  }
  if (element.canSelectNext !== canSelectNext) {
    element.canSelectNext = canSelectNext;
  }
  if (element.canSelectPrevious !== canSelectPrevious) {
    element.canSelectPrevious = canSelectPrevious;
  }
}

},{"./createSymbol":13,"./symbols":16}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var playingSymbol = (0, _createSymbol2.default)('playing');
var selectionTimerDurationSymbol = (0, _createSymbol2.default)('selectionTimerDuration');
var timerTimeoutSymbol = (0, _createSymbol2.default)('timerTimeout');

/* Exported function extends a base class with TimerSelection. */

exports.default = function (base) {

  /**
   * Mixin which provides for automatic timed changes in selection.
   *
   * This mixin is useful for creating slideshow-like elements.
   *
   * This mixin expects the component to define an `items` property, as well as
   * `selectFirst` and `selectNext` methods. You can implement those yourself,
   * or use [ContentItemsMixin](ContentItemsMixin.md) and
   * [SingleSelectionMixin](SingleSelectionMixin.md).
   */
  var TimerSelection = function (_base) {
    _inherits(TimerSelection, _base);

    function TimerSelection() {
      _classCallCheck(this, TimerSelection);

      // Set defaults.
      var _this = _possibleConstructorReturn(this, (TimerSelection.__proto__ || Object.getPrototypeOf(TimerSelection)).call(this));

      if (typeof _this.playing === 'undefined') {
        _this.playing = _this[_symbols2.default.defaults].playing;
      }
      if (typeof _this.selectionTimerDuration === 'undefined') {
        _this.selectionTimerDuration = _this[_symbols2.default.defaults].selectionTimerDuration;
      }
      return _this;
    }

    _createClass(TimerSelection, [{
      key: 'contentChanged',
      value: function contentChanged() {
        if (_get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'contentChanged', this)) {
          _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'contentChanged', this).call(this);
        }
        restartTimer(this);
      }
    }, {
      key: 'play',


      /**
       * Begin automatic progression of the selection.
       */
      value: function play() {
        if (_get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'play', this)) {
          _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'play', this).call(this);
        }
        startTimer(this);
        this[playingSymbol] = true;
      }

      /**
       * Pause automatic progression of the selection.
       */

    }, {
      key: 'pause',
      value: function pause() {
        if (_get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'pause', this)) {
          _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'pause', this).call(this);
        }
        clearTimer(this);
        this[playingSymbol] = false;
      }

      /**
       * True if the selection is being automatically advanced.
       *
       * @type {boolean}
       * @default false
       */

    }, {
      key: _symbols2.default.defaults,
      get: function get() {
        var defaults = _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), _symbols2.default.defaults, this) || {};
        defaults.playing = false;
        defaults.selectionTimerDuration = 1000;
        return defaults;
      }
    }, {
      key: 'playing',
      get: function get() {
        return this[playingSymbol];
      },
      set: function set(playing) {
        var previousPlaying = this[playingSymbol];
        var parsed = String(playing) === 'true'; // Cast to boolean
        if ('playing' in base.prototype) {
          _set(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'playing', playing, this);
        }
        if (parsed !== previousPlaying) {
          if (playing) {
            this.play();
          } else {
            this.pause();
          }
        }
      }

      /*
       * When the selected item changes (because of something this mixin did, or
       * was changed by an outside agent like the user), we wait before advancing
       * to the next item. By triggering the next item this way, we implicitly get
       * a desirable behavior: if the user changes the selection (e.g., in a
       * carousel), we let them see that selection state for a while before
       * advancing the selection ourselves.
       */

    }, {
      key: 'selectedItem',
      get: function get() {
        return _get(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectedItem', this);
      },
      set: function set(item) {
        if ('selectedItem' in base.prototype) {
          _set(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectedItem', item, this);
        }
        restartTimer(this);
      }

      /**
       * The time in milliseconds that will elapse after the selection changes
       * before the selection will be advanced to the next item in the list.
       *
       * @type {number} - Time in milliseconds
       * @default 1000 (1 second)
       */

    }, {
      key: 'selectionTimerDuration',
      get: function get() {
        return this[selectionTimerDurationSymbol];
      },
      set: function set(value) {
        this[selectionTimerDurationSymbol] = parseInt(value);
        if ('selectionTimerDuration' in base.prototype) {
          _set(TimerSelection.prototype.__proto__ || Object.getPrototypeOf(TimerSelection.prototype), 'selectionTimerDuration', value, this);
        }
      }
    }]);

    return TimerSelection;
  }(base);

  return TimerSelection;
};

function clearTimer(element) {
  if (element[timerTimeoutSymbol]) {
    clearTimeout(element[timerTimeoutSymbol]);
    element[timerTimeoutSymbol] = null;
  }
}

function restartTimer(element) {
  clearTimer(element);
  if (element.playing && element.items && element.items.length > 0) {
    startTimer(element);
  }
}

function startTimer(element) {
  // If play() is called more than once, cancel any existing timer.
  clearTimer(element);
  element[timerTimeoutSymbol] = setTimeout(function () {
    selectNextWithWrap(element);
  }, element.selectionTimerDuration);
}

// Select the next item, wrapping to first item if necessary.
function selectNextWithWrap(element) {
  var items = element.items;
  if (items && items.length > 0) {
    if (element.selectedIndex == null || element.selectedIndex === items.length - 1) {
      element.selectFirst();
    } else {
      element.selectNext();
    }
  }
}

},{"./createSymbol":13,"./symbols":16}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSymbol;
/**
 * Helper function to create a symbol that can be used for associating private
 * data with an element.
 *
 * Mixins and component classes often want to associate private data with an
 * element instance, but JavaScript does not have direct support for true
 * private properties. One approach is to use the
 * [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
 * data type to set and retrieve data on an element.
 *
 * Unfortunately, the Symbol type is not available in Internet Explorer 11. The
 * `createSymbol` helper function exists as a workaround for IE 11. Rather than
 * returning a true Symbol, it simply returns an underscore-prefixed string.
 *
 * Usage:
 *
 *     const fooSymbol = createSymbol('foo');
 *
 *     class MyElement extends HTMLElement {
 *       get foo() {
 *         return this[fooSymbol];
 *       }
 *       set foo(value) {
 *         this[fooSymbol] = value;
 *       }
 *     }
 *
 * In IE 11, this sample will "hide" data behind an instance property this._foo.
 * The use of the underscore is meant to reduce (not eliminate) the potential
 * for name conflicts, and discourage (not prevent) external access to this
 * data. In modern browsers, the above code will eliminate the potential of
 * naming conflicts, and better hide the data behind a real Symbol.
 *
 * @function createSymbol
 * @param {string} description - A string to identify the symbol when debugging
 */
function createSymbol(description) {
  return typeof Symbol === 'function' ? Symbol(description) : '_' + description;
}

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = microtask;
/*
 * Microtask helper for IE 11.
 *
 * Executing a function as a microtask is trivial in browsers that support
 * promises, whose then() clauses use microtask timing. IE 11 doesn't support
 * promises, but does support MutationObservers, which are also executed as
 * microtasks. So this helper uses an MutationObserver to achieve microtask
 * timing.
 *
 * See https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
 *
 * Inspired by Polymer's async() function.
 */

// The queue of pending callbacks to be executed as microtasks.
var callbacks = [];

// Create an element that we will modify to force observable mutations.
var element = document.createTextNode('');

// A monotonically-increasing value.
var counter = 0;

/**
 * Add a callback to the microtask queue.
 *
 * This uses a MutationObserver so that it works on IE 11.
 *
 * NOTE: IE 11 may actually use timeout timing with MutationObservers. This
 * needs more investigation.
 *
 * @function microtask
 * @param {function} callback
 */
function microtask(callback) {
  callbacks.push(callback);
  // Force a mutation.
  element.textContent = ++counter;
}

// Execute any pending callbacks.
function executeCallbacks() {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    callback();
  }
}

// Create the observer.
var observer = new MutationObserver(executeCallbacks);
observer.observe(element, {
  characterData: true
});

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

var _toggleClass2 = require('./toggleClass');

var _toggleClass3 = _interopRequireDefault(_toggleClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Symbols for private data members on an element.
var safeToSetAttributesSymbol = (0, _createSymbol2.default)('safeToSetAttributes');
var pendingAttributesSymbol = (0, _createSymbol2.default)('pendingAttributes');
var pendingClassesSymbol = (0, _createSymbol2.default)('pendingClasses');

/**
 * Helper functions for updating attributes, including the `class` attribute.
 */
exports.default = {

  /**
   * Perform any pending updates to attributes and classes.
   *
   * This writes any `setAttribute` or `toggleClass` values that were performed
   * before an element was attached to the document for the first time.
   *
   * This method should be called by mixins/components in their
   * `connectedCallback`. If mulitple mixins/components invoke this during the
   * same `connectedCallback`, only the first call will have any effect. The
   * subsequent calls will be harmless.
   *
   * @param {HTMLElement} element - The element being added to the document.
   */
  connected: function connected(element) {
    element[safeToSetAttributesSymbol] = true;

    // Set any pending attributes.
    if (element[pendingAttributesSymbol]) {
      for (var attribute in element[pendingAttributesSymbol]) {
        var value = element[pendingAttributesSymbol][attribute];
        setAttributeToElement(element, attribute, value);
      }
      element[pendingAttributesSymbol] = null;
    }

    // Set any pending classes.
    if (element[pendingClassesSymbol]) {
      for (var className in element[pendingClassesSymbol]) {
        var _value = element[pendingClassesSymbol][className];
        (0, _toggleClass3.default)(element, className, _value);
      }
      element[pendingClassesSymbol] = null;
    }
  },


  /**
   * Set/unset the attribute with the indicated name.
   *
   * This method exists primarily to handle the case where an element wants to
   * set a default property value that should be reflected as an attribute. An
   * important limitation of custom element consturctors is that they cannot
   * set attributes. A call to `setAttribute` during the constructor will
   * be deferred until the element is connected to the document.
   *
   * @param {string} attribute - The name of the *attribute* (not property) to set.
   * @param {object} value - The value to set. If null, the attribute will be removed.
   */
  setAttribute: function setAttribute(element, attribute, value) {
    if (element[safeToSetAttributesSymbol]) {
      // Safe to set attributes immediately.
      setAttributeToElement(element, attribute, value);
    } else {
      // Defer setting attributes until the first time we're connected.
      if (!element[pendingAttributesSymbol]) {
        element[pendingAttributesSymbol] = {};
      }
      element[pendingAttributesSymbol][attribute] = value;
    }
  },


  /**
   * Set/unset the class with the indicated name.
   *
   * This method exists primarily to handle the case where an element wants to
   * set a default property value that should be reflected as as class. An
   * important limitation of custom element consturctors is that they cannot
   * set attributes, including the `class` attribute. A call to
   * `toggleClass` during the constructor will be deferred until the element
   * is connected to the document.
   *
   * @param {string} className - The name of the class to set.
   * @param {object} value - True to set the class, false to remove it.
   */
  toggleClass: function toggleClass(element, className, value) {
    if (element[safeToSetAttributesSymbol]) {
      // Safe to set class immediately.
      (0, _toggleClass3.default)(element, className, value);
    } else {
      // Defer setting class until the first time we're connected.
      if (!element[pendingClassesSymbol]) {
        element[pendingClassesSymbol] = {};
      }
      element[pendingClassesSymbol][className] = value;
    }
  }
};

// Reflect the attribute to the given element.
// If the value is null, remove the attribute.

function setAttributeToElement(element, attributeName, value) {
  if (value === null || typeof value === 'undefined') {
    element.removeAttribute(attributeName);
  } else {
    var text = String(value);
    // Avoid recursive attributeChangedCallback calls.
    if (element.getAttribute(attributeName) !== text) {
      element.setAttribute(attributeName, value);
    }
  }
}

},{"./createSymbol":13,"./toggleClass":17}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createSymbol = require('./createSymbol');

var _createSymbol2 = _interopRequireDefault(_createSymbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A collection of Symbol objects for standard component properties and methods.
 *
 * These Symbol objects are used to allow mixins and a component to internally
 * communicate, without exposing these properties and methods in the component's
 * public API.
 *
 * To use these Symbol objects in your own component, include this module and
 * then create a property or method whose key is the desired Symbol.
 *
 *     import 'SingleSelectionMixin' from 'basic-component-mixins/src/SingleSelectionMixin';
 *     import 'symbols' from 'basic-component-mixins/src/symbols';
 *
 *     class MyElement extends SingleSelectionMixin(HTMLElement) {
 *       [symbols.applySelection](item, selected) {
 *         // This will be invoked whenever an item is selected/deselected.
 *       }
 *     }
 *
 * @module symbols
 */
var symbols = {

  /**
   * Symbol for the `applySelection` method.
   *
   * This method applies the indicated selection state to an item.
   *
   * @function applySelection
   * @param {HTMLElement} item - the item being selected/deselected
   * @param {boolean} selected - true if the item is selected, false if not
   */
  applySelection: (0, _createSymbol2.default)('applySelection'),

  /**
   * Symbol for the `defaults` property.
   *
   * This property can be used to set or override defaults that will be applied
   * to a new component instance. When implementing this property, take care to
   * first acquire any defaults defined by the superclass. The standard idiom is
   * as follows:
   *
   *     get [symbols.defaults]() {
   *       const defaults = super[symbols.defaults] || {};
   *       // Set or override default values here
   *       defaults.customProperty = false;
   *       return defaults;
   *     }
   *
   * @var {object} defaults
   */
  defaults: (0, _createSymbol2.default)('defaults'),

  /**
   * Symbol for the `dragging` property.
   *
   * Components like carousels often define animated CSS transitions for
   * sliding effects. Such a transition should usually *not* be applied while
   * the user is dragging, because a CSS animation will introduce a lag that
   * makes the swipe feel sluggish. Instead, as long as the user is dragging
   * with their finger down, the transition should be suppressed. When the
   * user releases their finger, the transition can be restored, allowing the
   * animation to show the carousel sliding into its final position.
   *
   * @type {boolean} true if a drag is in progress, false if not.
   */
  dragging: (0, _createSymbol2.default)('dragging'),

  /**
   * Symbol for the `goDown` method.
   *
   * This method is invoked when the user wants to go/navigate down.
   *
   * @function goDown
   */
  goDown: (0, _createSymbol2.default)('goDown'),

  /**
   * Symbol for the `goEnd` method.
   *
   * This method is invoked when the user wants to go/navigate to the end (e.g.,
   * of a list).
   *
   * @function goEnd
   */
  goEnd: (0, _createSymbol2.default)('goEnd'),

  /**
   * Symbol for the `goLeft` method.
   *
   * This method is invoked when the user wants to go/navigate left.
   *
   * @function goLeft
   */
  goLeft: (0, _createSymbol2.default)('goLeft'),

  /**
   * Symbol for the `goRight` method.
   *
   * This method is invoked when the user wants to go/navigate right.
   *
   * @function goRight
   */
  goRight: (0, _createSymbol2.default)('goRight'),

  /**
   * Symbol for the `goStart` method.
   *
   * This method is invoked when the user wants to go/navigate to the start
   * (e.g., of a list).
   *
   * @function goStart
   */
  goStart: (0, _createSymbol2.default)('goStart'),

  /**
   * Symbol for the `goUp` method.
   *
   * This method is invoked when the user wants to go/navigate up.
   *
   * @function goUp
   */
  goUp: (0, _createSymbol2.default)('goUp'),

  /**
   * Symbol for the `itemAdded` method.
   *
   * This method is invoked when a new item is added to a list.
   *
   * @function itemAdded
   * @param {HTMLElement} item - the item being selected/deselected
   */
  itemAdded: (0, _createSymbol2.default)('itemAdded'),

  /**
   * Symbol for the `keydown` method.
   *
   * This method is invoked when an element receives a `keydown` event.
   *
   * @function keydown
   * @param {KeyboardEvent} event - the event being processed
   */
  keydown: (0, _createSymbol2.default)('keydown')
};

exports.default = symbols;

},{"./createSymbol":13}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleClass;
/**
 * Helper function for standard classList.toggle() behavior on old browsers,
 * namely IE 11.
 *
 * The standard
 * [classlist](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
 * object has a `toggle()` function that supports a second Boolean parameter
 * that can be used to succinctly turn a class on or off. This feature is often
 * useful in designing custom elements, which may want to externally reflect
 * component state in a CSS class that can be used for styling purposes.
 *
 * Unfortunately, IE 11 does not support the Boolean parameter to
 * `classList.toggle()`. This helper function behaves like the standard
 * `toggle()`, including support for the Boolean parameter, so that it can be
 * used even on IE 11.
 *
 * @function toggleClass
 * @param {HTMLElement} element - The element to modify
 * @param {string} className - The class to add/remove
 * @param {boolean} [force] - Force the class to be added (if true) or removed
 *                            (if false)
 */
function toggleClass(element, className, force) {
  var classList = element.classList;
  var addClass = typeof force === 'undefined' ? !classList.contains(className) : force;
  if (addClass) {
    classList.add(className);
  } else {
    classList.remove(className);
  }
  return addClass;
}

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AttributeMarshallingMixin = require('../../basic-component-mixins/src/AttributeMarshallingMixin');

var _AttributeMarshallingMixin2 = _interopRequireDefault(_AttributeMarshallingMixin);

var _ComposableMixin = require('../../basic-component-mixins/src/ComposableMixin');

var _ComposableMixin2 = _interopRequireDefault(_ComposableMixin);

var _DistributedChildrenMixin = require('../../basic-component-mixins/src/DistributedChildrenMixin');

var _DistributedChildrenMixin2 = _interopRequireDefault(_DistributedChildrenMixin);

var _ShadowElementReferencesMixin = require('../../basic-component-mixins/src/ShadowElementReferencesMixin');

var _ShadowElementReferencesMixin2 = _interopRequireDefault(_ShadowElementReferencesMixin);

var _ShadowTemplateMixin = require('../../basic-component-mixins/src/ShadowTemplateMixin');

var _ShadowTemplateMixin2 = _interopRequireDefault(_ShadowTemplateMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A sample general-purpose base class for defining custom elements that mixes
 * in some common features: template stamping into a shadow root, shadow element
 * references, marshalling attributes to properties, and retrieving the children
 * distributed to a component.
 *
 * This base class is not special in any way, and is defined only as a
 * convenient shorthand for applying the mixins listed above. You can use this
 * class as a base class for your own elements, or easily create your own base
 * class by applying the same set of mixins.
 *
 * The ElementBase base class does not register itself as a custom element with
 * the browser, and hence cannot be independently instantiated.
 *
 * @mixes AttributeMarshallingMixin
 * @mixes ComposableMixin
 * @mixes DistributedChildrenMixin
 * @mixes ShadowElementReferencesMixin
 * @mixes ShadowTemplateMixin
 */
var ElementBase = function (_ComposableMixin$comp) {
  _inherits(ElementBase, _ComposableMixin$comp);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    return _possibleConstructorReturn(this, (ElementBase.__proto__ || Object.getPrototypeOf(ElementBase)).apply(this, arguments));
  }

  return ElementBase;
}((0, _ComposableMixin2.default)(HTMLElement).compose(_ShadowTemplateMixin2.default, // before node finding, so shadow root is populated
_ShadowElementReferencesMixin2.default, // before marshalling, so properties can use refs
_AttributeMarshallingMixin2.default, _DistributedChildrenMixin2.default));

exports.default = ElementBase;

},{"../../basic-component-mixins/src/AttributeMarshallingMixin":1,"../../basic-component-mixins/src/ComposableMixin":2,"../../basic-component-mixins/src/DistributedChildrenMixin":5,"../../basic-component-mixins/src/ShadowElementReferencesMixin":9,"../../basic-component-mixins/src/ShadowTemplateMixin":10}],19:[function(require,module,exports){
'use strict';

var _Slideshow = require('./src/Slideshow');

var _Slideshow2 = _interopRequireDefault(_Slideshow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Basic = window.Basic || {}; /*
                                    * This file is transpiled to create an ES5-compatible distribution in which
                                    * the package's main feature(s) are available via the window.Basic global.
                                    * If you're already using ES6 yourself, ignore this file, and instead import
                                    * the source file(s) you want from the src folder.
                                    */

window.Basic.Slideshow = _Slideshow2.default;

},{"./src/Slideshow":20}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ElementBase = require('../../basic-element-base/src/ElementBase');

var _ElementBase2 = _interopRequireDefault(_ElementBase);

var _ContentItemsMixin = require('../../basic-component-mixins/src/ContentItemsMixin');

var _ContentItemsMixin2 = _interopRequireDefault(_ContentItemsMixin);

var _DistributedChildrenContentMixin = require('../../basic-component-mixins/src/DistributedChildrenContentMixin');

var _DistributedChildrenContentMixin2 = _interopRequireDefault(_DistributedChildrenContentMixin);

var _FractionalSelectionMixin = require('../../basic-component-mixins/src/FractionalSelectionMixin');

var _FractionalSelectionMixin2 = _interopRequireDefault(_FractionalSelectionMixin);

var _SelectionAnimationMixin = require('../../basic-component-mixins/src/SelectionAnimationMixin');

var _SelectionAnimationMixin2 = _interopRequireDefault(_SelectionAnimationMixin);

var _SelectionAriaActiveMixin = require('../../basic-component-mixins/src/SelectionAriaActiveMixin');

var _SelectionAriaActiveMixin2 = _interopRequireDefault(_SelectionAriaActiveMixin);

var _SingleSelectionMixin = require('../../basic-component-mixins/src/SingleSelectionMixin');

var _SingleSelectionMixin2 = _interopRequireDefault(_SingleSelectionMixin);

var _symbols = require('../../basic-component-mixins/src/symbols');

var _symbols2 = _interopRequireDefault(_symbols);

var _TimerSelectionMixin = require('../../basic-component-mixins/src/TimerSelectionMixin');

var _TimerSelectionMixin2 = _interopRequireDefault(_TimerSelectionMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var base = _ElementBase2.default.compose(_ContentItemsMixin2.default, _DistributedChildrenContentMixin2.default, _FractionalSelectionMixin2.default, _SelectionAnimationMixin2.default, _SelectionAriaActiveMixin2.default, _SingleSelectionMixin2.default, _TimerSelectionMixin2.default);

/**
 * Slideshow with animated transitions.
 *
 * By default the slideshow will immediately begin playing when it is connected
 * to the document, advance every 3000 ms (3 seconds), and use a simple
 * crossfade effect.
 *
 * This component can be used on its own. To incorporate slideshow behavior into
 * a component of your own, apply the
 * [TimerSelectionMixin](../basic-component-mixins/docs/TimerSelectionMixin.md).
 *
 * @extends ElementBase
 * @mixes ContentItemsMixin
 * @mixes DistributedChildrenContentMixin
 * @mixes FractionalSelectionMixin
 * @mixes SelectionAnimationMixin
 * @mixes SelectionAriaActiveMixin
 * @mixes SingleSelectionMixin
 * @mixes TimerSelectionMixin
 */

var Slideshow = function (_base) {
  _inherits(Slideshow, _base);

  function Slideshow() {
    _classCallCheck(this, Slideshow);

    return _possibleConstructorReturn(this, (Slideshow.__proto__ || Object.getPrototypeOf(Slideshow)).apply(this, arguments));
  }

  _createClass(Slideshow, [{
    key: _symbols2.default.defaults,
    get: function get() {
      var defaults = _get(Slideshow.prototype.__proto__ || Object.getPrototypeOf(Slideshow.prototype), _symbols2.default.defaults, this) || {};
      defaults.playing = true;
      defaults.selectionAnimationDuration = 500;
      defaults.selectionAnimationEffect = 'crossfade';
      defaults.selectionRequired = true;
      defaults.selectionTimerDuration = 3000;
      defaults.selectionWraps = true;
      return defaults;
    }
  }, {
    key: 'template',
    get: function get() {
      return '\n      <style>\n      :host {\n        display: -webkit-flex;\n        display: flex;\n        overflow: hidden;\n        position: relative;\n      }\n\n      #container ::slotted(*) {\n        height: 100%;\n        object-fit: contain;\n        position: absolute;\n        width: 100%;\n        will-change: transform;\n      }\n      </style>\n\n      <div id="container" role="none">\n        <slot></slot>\n      </div>\n    ';
    }
  }]);

  return Slideshow;
}(base);

customElements.define('basic-slideshow', Slideshow);
exports.default = Slideshow;

},{"../../basic-component-mixins/src/ContentItemsMixin":3,"../../basic-component-mixins/src/DistributedChildrenContentMixin":4,"../../basic-component-mixins/src/FractionalSelectionMixin":6,"../../basic-component-mixins/src/SelectionAnimationMixin":7,"../../basic-component-mixins/src/SelectionAriaActiveMixin":8,"../../basic-component-mixins/src/SingleSelectionMixin":11,"../../basic-component-mixins/src/TimerSelectionMixin":12,"../../basic-component-mixins/src/symbols":16,"../../basic-element-base/src/ElementBase":18}]},{},[19])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9BdHRyaWJ1dGVNYXJzaGFsbGluZ01peGluLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvQ29tcG9zYWJsZU1peGluLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvQ29udGVudEl0ZW1zTWl4aW4uanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9EaXN0cmlidXRlZENoaWxkcmVuQ29udGVudE1peGluLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvRGlzdHJpYnV0ZWRDaGlsZHJlbk1peGluLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvRnJhY3Rpb25hbFNlbGVjdGlvbk1peGluLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvU2VsZWN0aW9uQW5pbWF0aW9uTWl4aW4uanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TZWxlY3Rpb25BcmlhQWN0aXZlTWl4aW4uanMiLCJwYWNrYWdlcy9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TaGFkb3dFbGVtZW50UmVmZXJlbmNlc01peGluLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvU2hhZG93VGVtcGxhdGVNaXhpbi5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL1NpbmdsZVNlbGVjdGlvbk1peGluLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvVGltZXJTZWxlY3Rpb25NaXhpbi5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL2NyZWF0ZVN5bWJvbC5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL21pY3JvdGFzay5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL3NhZmVBdHRyaWJ1dGVzLmpzIiwicGFja2FnZXMvYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvc3ltYm9scy5qcyIsInBhY2thZ2VzL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL3RvZ2dsZUNsYXNzLmpzIiwicGFja2FnZXMvYmFzaWMtZWxlbWVudC1iYXNlL3NyYy9FbGVtZW50QmFzZS5qcyIsInBhY2thZ2VzL2Jhc2ljLXNsaWRlc2hvdy9nbG9iYWxzLmpzIiwicGFja2FnZXMvYmFzaWMtc2xpZGVzaG93L3NyYy9TbGlkZXNob3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7OztBQUdBO0FBQ0EsSUFBTSwyQkFBMkIsRUFBakM7QUFDQSxJQUFNLDRCQUE0QixFQUFsQzs7QUFHQTs7a0JBQ2UsVUFBQyxJQUFELEVBQVU7O0FBRXZCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZ1QixNQXFDakIsb0JBckNpQjtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOzs7QUF1Q3JCOzs7QUF2Q3FCLCtDQTBDSSxhQTFDSixFQTBDbUIsUUExQ25CLEVBMEM2QixRQTFDN0IsRUEwQ3VDO0FBQzFELHVKQUFvQztBQUFFO0FBQW1DO0FBQ3pFLFlBQU0sZUFBZSx3QkFBd0IsYUFBeEIsQ0FBckI7QUFDQTtBQUNBO0FBQ0EsWUFBSSxnQkFBZ0IsSUFBaEIsSUFBd0IsRUFBRSxnQkFBZ0IsWUFBWSxTQUE5QixDQUE1QixFQUFzRTtBQUNwRSxlQUFLLFlBQUwsSUFBcUIsUUFBckI7QUFDRDtBQUNGO0FBbERvQjtBQUFBO0FBQUEsMENBb0REO0FBQ2xCLGdKQUE2QjtBQUFFO0FBQTRCO0FBQzNELGlDQUFlLFNBQWYsQ0FB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c0JEOzs7O0VBcENxQixJOztBQXlDeEIsZUFBZSxNQUFmLENBQXNCLGlCQUF0QixFQUF5QyxTQUF6QztrQkFDZSxTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBzYWZlQXR0cmlidXRlcyBmcm9tICcuL3NhZmVBdHRyaWJ1dGVzJztcblxuXG4vLyBNZW1vaXplZCBtYXBzIG9mIGF0dHJpYnV0ZSB0byBwcm9wZXJ0eSBuYW1lcyBhbmQgdmljZSB2ZXJzYS5cbmNvbnN0IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lcyA9IHt9O1xuY29uc3QgcHJvcGVydHlOYW1lc1RvQXR0cmlidXRlcyA9IHt9O1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggQXR0cmlidXRlTWFyc2hhbGxpbmcuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBNaXhpbiB3aGljaCBtYXJzaGFsbHMgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzIGFuZCB2aWNlIHZlcnNhLlxuICAgKlxuICAgKiBJZiB5b3VyIGNvbXBvbmVudCBleHBvc2VzIGEgc2V0dGVyIGZvciBhIHByb3BlcnR5LCBpdCdzIGdlbmVyYWxseSBhIGdvb2RcbiAgICogaWRlYSB0byBsZXQgZGV2cyB1c2luZyB5b3VyIGNvbXBvbmVudCBiZSBhYmxlIHRvIHNldCB0aGF0IHByb3BlcnR5IGluIEhUTUxcbiAgICogdmlhIGFuIGVsZW1lbnQgYXR0cmlidXRlLiBZb3UgY2FuIGNvZGUgdGhhdCB5b3Vyc2VsZiBieSB3cml0aW5nIGFuXG4gICAqIGBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tgLCBvciB5b3UgY2FuIHVzZSB0aGlzIG1peGluIHRvIGdldCBhIGRlZ3JlZSBvZlxuICAgKiBhdXRvbWF0aWMgc3VwcG9ydC5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBpbXBsZW1lbnRzIGFuIGBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tgIHRoYXQgd2lsbCBhdHRlbXB0IHRvXG4gICAqIGNvbnZlcnQgYSBjaGFuZ2UgaW4gYW4gZWxlbWVudCBhdHRyaWJ1dGUgaW50byBhIGNhbGwgdG8gdGhlIGNvcnJlc3BvbmRpbmdcbiAgICogcHJvcGVydHkgc2V0dGVyLiBBdHRyaWJ1dGVzIHR5cGljYWxseSBmb2xsb3cgaHlwaGVuYXRlZCBuYW1lcyAoXCJmb28tYmFyXCIpLFxuICAgKiB3aGVyZWFzIHByb3BlcnRpZXMgdHlwaWNhbGx5IHVzZSBjYW1lbENhc2UgbmFtZXMgKFwiZm9vQmFyXCIpLiBUaGlzIG1peGluXG4gICAqIHJlc3BlY3RzIHRoYXQgY29udmVudGlvbiwgYXV0b21hdGljYWxseSBtYXBwaW5nIHRoZSBoeXBoZW5hdGVkIGF0dHJpYnV0ZVxuICAgKiBuYW1lIHRvIHRoZSBjb3JyZXNwb25kaW5nIGNhbWVsQ2FzZSBwcm9wZXJ0eSBuYW1lLlxuICAgKlxuICAgKiBFeGFtcGxlOiBZb3UgZGVmaW5lIGEgY29tcG9uZW50IHVzaW5nIHRoaXMgbWl4aW46XG4gICAqXG4gICAqICAgICBjbGFzcyBNeUVsZW1lbnQgZXh0ZW5kcyBBdHRyaWJ1dGVNYXJzaGFsbGluZ01peGluKEhUTUxFbGVtZW50KSB7XG4gICAqICAgICAgIGdldCBmb29CYXIoKSB7IHJldHVybiB0aGlzLl9mb29CYXI7IH1cbiAgICogICAgICAgc2V0IGZvb0Jhcih2YWx1ZSkgeyB0aGlzLl9mb29CYXIgPSB2YWx1ZTsgfVxuICAgKiAgICAgfVxuICAgKiAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdteS1lbGVtZW50JywgTXlFbGVtZW50KTtcbiAgICpcbiAgICogSWYgc29tZW9uZSB0aGVuIGluc3RhbnRpYXRlcyB5b3VyIGNvbXBvbmVudCBpbiBIVE1MOlxuICAgKlxuICAgKiAgICAgPG15LWVsZW1lbnQgZm9vLWJhcj1cIkhlbGxvXCI+PC9teS1lbGVtZW50PlxuICAgKlxuICAgKiBUaGVuLCBhZnRlciB0aGUgZWxlbWVudCBoYXMgYmVlbiB1cGdyYWRlZCwgdGhlIGBmb29CYXJgIHNldHRlciB3aWxsXG4gICAqIGF1dG9tYXRpY2FsbHkgYmUgaW52b2tlZCB3aXRoIHRoZSBpbml0aWFsIHZhbHVlIFwiSGVsbG9cIi5cbiAgICpcbiAgICogRm9yIHRoZSB0aW1lIGJlaW5nLCB0aGlzIG1peGluIG9ubHkgc3VwcG9ydHMgc3RyaW5nLXZhbHVlZCBwcm9wZXJ0aWVzLlxuICAgKiBJZiB5b3UnZCBsaWtlIHRvIGNvbnZlcnQgc3RyaW5nIGF0dHJpYnV0ZXMgdG8gb3RoZXIgdHlwZXMgKG51bWJlcnMsXG4gICAqIGJvb2xlYW5zKSwgeW91IG5lZWQgdG8gaW1wbGVtZW50IGBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tgIHlvdXJzZWxmLlxuICAgKi9cbiAgY2xhc3MgQXR0cmlidXRlTWFyc2hhbGxpbmcgZXh0ZW5kcyBiYXNlIHtcblxuICAgIC8qXG4gICAgICogSGFuZGxlIGEgY2hhbmdlIHRvIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgICAgKi9cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0cmlidXRlTmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICBpZiAoc3VwZXIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKSB7IHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaygpOyB9XG4gICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVUb1Byb3BlcnR5TmFtZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgbmFtZSBjb3JyZXNwb25kcyB0byBhIHByb3BlcnR5IG5hbWUsIHNldCB0aGUgcHJvcGVydHkuXG4gICAgICAvLyBJZ25vcmUgc3RhbmRhcmQgSFRNTEVsZW1lbnQgcHJvcGVydGllcyBoYW5kbGVkIGJ5IHRoZSBET00uXG4gICAgICBpZiAocHJvcGVydHlOYW1lIGluIHRoaXMgJiYgIShwcm9wZXJ0eU5hbWUgaW4gSFRNTEVsZW1lbnQucHJvdG90eXBlKSkge1xuICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmIChzdXBlci5jb25uZWN0ZWRDYWxsYmFjaykgeyBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpOyB9XG4gICAgICBzYWZlQXR0cmlidXRlcy5jb25uZWN0ZWQodGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICByZXR1cm4gYXR0cmlidXRlc0ZvckNsYXNzKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldC91bnNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGluZGljYXRlZCBuYW1lLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgZXhpc3RzIHByaW1hcmlseSB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgYW4gZWxlbWVudCB3YW50cyB0b1xuICAgICAqIHNldCBhIGRlZmF1bHQgcHJvcGVydHkgdmFsdWUgdGhhdCBzaG91bGQgYmUgcmVmbGVjdGVkIGFzIGFuIGF0dHJpYnV0ZS4gQW5cbiAgICAgKiBpbXBvcnRhbnQgbGltaXRhdGlvbiBvZiBjdXN0b20gZWxlbWVudCBjb25zdHVyY3RvcnMgaXMgdGhhdCB0aGV5IGNhbm5vdFxuICAgICAqIHNldCBhdHRyaWJ1dGVzLiBBIGNhbGwgdG8gYHJlZmxlY3RBdHRyaWJ1dGVgIGR1cmluZyB0aGUgY29uc3RydWN0b3Igd2lsbFxuICAgICAqIGJlIGRlZmVycmVkIHVudGlsIHRoZSBlbGVtZW50IGlzIGNvbm5lY3RlZCB0byB0aGUgZG9jdW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlIC0gVGhlIG5hbWUgb2YgdGhlICphdHRyaWJ1dGUqIChub3QgcHJvcGVydHkpIHRvIHNldC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0LiBJZiBudWxsLCB0aGUgYXR0cmlidXRlIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICByZWZsZWN0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBzYWZlQXR0cmlidXRlcy5zZXRBdHRyaWJ1dGUodGhpcywgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0L3Vuc2V0IHRoZSBjbGFzcyB3aXRoIHRoZSBpbmRpY2F0ZWQgbmFtZS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGV4aXN0cyBwcmltYXJpbHkgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIGFuIGVsZW1lbnQgd2FudHMgdG9cbiAgICAgKiBzZXQgYSBkZWZhdWx0IHByb3BlcnR5IHZhbHVlIHRoYXQgc2hvdWxkIGJlIHJlZmxlY3RlZCBhcyBhcyBjbGFzcy4gQW5cbiAgICAgKiBpbXBvcnRhbnQgbGltaXRhdGlvbiBvZiBjdXN0b20gZWxlbWVudCBjb25zdHVyY3RvcnMgaXMgdGhhdCB0aGV5IGNhbm5vdFxuICAgICAqIHNldCBhdHRyaWJ1dGVzLCBpbmNsdWRpbmcgdGhlIGBjbGFzc2AgYXR0cmlidXRlLiBBIGNhbGwgdG9cbiAgICAgKiBgcmVmbGVjdENsYXNzYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGwgYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnRcbiAgICAgKiBpcyBjb25uZWN0ZWQgdG8gdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBzZXQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlIC0gVHJ1ZSB0byBzZXQgdGhlIGNsYXNzLCBmYWxzZSB0byByZW1vdmUgaXQuXG4gICAgICovXG4gICAgcmVmbGVjdENsYXNzKGNsYXNzTmFtZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBzYWZlQXR0cmlidXRlcy50b2dnbGVDbGFzcyh0aGlzLCBjbGFzc05hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBBdHRyaWJ1dGVNYXJzaGFsbGluZztcbn07XG5cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgYXR0cmlidXRlIG5hbWUgdG8gY2FtZWwgY2FzZSBmb29CYXIgcHJvcGVydHkgbmFtZS5cbmZ1bmN0aW9uIGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKGF0dHJpYnV0ZU5hbWUpIHtcbiAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lc1thdHRyaWJ1dGVOYW1lXTtcbiAgaWYgKCFwcm9wZXJ0eU5hbWUpIHtcbiAgICAvLyBDb252ZXJ0IGFuZCBtZW1vaXplLlxuICAgIGNvbnN0IGh5cGVuUmVnRXggPSAvLShbYS16XSkvZztcbiAgICBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVOYW1lLnJlcGxhY2UoaHlwZW5SZWdFeCxcbiAgICAgICAgbWF0Y2ggPT4gbWF0Y2hbMV0udG9VcHBlckNhc2UoKSk7XG4gICAgYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWVzW2F0dHJpYnV0ZU5hbWVdID0gcHJvcGVydHlOYW1lO1xuICB9XG4gIHJldHVybiBwcm9wZXJ0eU5hbWU7XG59XG5cbmZ1bmN0aW9uIGF0dHJpYnV0ZXNGb3JDbGFzcyhjbGFzc0ZuKSB7XG5cbiAgLy8gV2UgdHJlYXQgdGhlIGVsZW1lbnQgYmFzZSBjbGFzc2VzIGFzIGlmIHRoZXkgaGF2ZSBubyBhdHRyaWJ1dGVzLCBzaW5jZSB3ZVxuICAvLyBkb24ndCB3YW50IHRvIHJlY2VpdmUgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIGZvciB0aGVtLlxuICBpZiAoY2xhc3NGbiA9PT0gSFRNTEVsZW1lbnQgfHwgY2xhc3NGbiA9PT0gT2JqZWN0KSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gR2V0IGF0dHJpYnV0ZXMgZm9yIHBhcmVudCBjbGFzcy5cbiAgY29uc3QgYmFzZUNsYXNzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNsYXNzRm4ucHJvdG90eXBlKS5jb25zdHJ1Y3RvcjtcbiAgY29uc3QgYmFzZUF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzRm9yQ2xhc3MoYmFzZUNsYXNzKTtcblxuICAvLyBHZXQgYXR0cmlidXRlcyBmb3IgdGhpcyBjbGFzcy5cbiAgY29uc3QgcHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNsYXNzRm4ucHJvdG90eXBlKTtcbiAgY29uc3Qgc2V0dGVyTmFtZXMgPSBwcm9wZXJ0eU5hbWVzLmZpbHRlcihwcm9wZXJ0eU5hbWUgPT5cbiAgICB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgY2xhc3NGbi5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSkuc2V0ID09PSAnZnVuY3Rpb24nKTtcbiAgY29uc3QgYXR0cmlidXRlcyA9IHNldHRlck5hbWVzLm1hcChzZXR0ZXJOYW1lID0+XG4gICAgICBwcm9wZXJ0eU5hbWVUb0F0dHJpYnV0ZShzZXR0ZXJOYW1lKSk7XG5cbiAgLy8gTWVyZ2UuXG4gIGNvbnN0IGRpZmYgPSBhdHRyaWJ1dGVzLmZpbHRlcihhdHRyaWJ1dGUgPT5cbiAgICAgIGJhc2VBdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlKSA8IDApO1xuICByZXR1cm4gYmFzZUF0dHJpYnV0ZXMuY29uY2F0KGRpZmYpO1xufVxuXG4vLyBDb252ZXJ0IGEgY2FtZWwgY2FzZSBmb29CYXIgcHJvcGVydHkgbmFtZSB0byBhIGh5cGhlbmF0ZWQgZm9vLWJhciBhdHRyaWJ1dGUuXG5mdW5jdGlvbiBwcm9wZXJ0eU5hbWVUb0F0dHJpYnV0ZShwcm9wZXJ0eU5hbWUpIHtcbiAgbGV0IGF0dHJpYnV0ZSA9IHByb3BlcnR5TmFtZXNUb0F0dHJpYnV0ZXNbcHJvcGVydHlOYW1lXTtcbiAgaWYgKCFhdHRyaWJ1dGUpIHtcbiAgICAvLyBDb252ZXJ0IGFuZCBtZW1vaXplLlxuICAgIGNvbnN0IHVwcGVyY2FzZVJlZ0V4ID0gLyhbQS1aXSkvZztcbiAgICBhdHRyaWJ1dGUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSh1cHBlcmNhc2VSZWdFeCwgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgcmV0dXJuIGF0dHJpYnV0ZTtcbn1cbiIsIi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggQ29tcG9zYWJsZS4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHRvIG1ha2UgYSBjbGFzcyBtb3JlIGVhc2lseSBjb21wb3NhYmxlIHdpdGggb3RoZXIgbWl4aW5zLlxuICAgKlxuICAgKiBUaGlzIG1peGluIGNvbnRyaWJ1dGVzIGEgYGNvbXBvc2VgIG1ldGhvZCB0aGF0IGFwcGxpZXMgYSBzZXQgb2YgbWl4aW5cbiAgICogZnVuY3Rpb25zIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgbmV3IGNsYXNzLiBUaGlzIHN1Z2FyIGNhbiBtYWtlIHRoZVxuICAgKiBhcHBsaWNhdGlvbiBvZiBtYW55IG1peGlucyBhdCBvbmNlIGVhc2llciB0byByZWFkLlxuICAgKi9cbiAgY2xhc3MgQ29tcG9zYWJsZSBleHRlbmRzIGJhc2Uge1xuXG4gICAgLyoqXG4gICAgICogQXBwbHkgYSBzZXQgb2YgbWl4aW4gZnVuY3Rpb25zIG9yIG1peGluIG9iamVjdHMgdG8gdGhlIHByZXNlbnQgY2xhc3MgYW5kXG4gICAgICogcmV0dXJuIHRoZSBuZXcgY2xhc3MuXG4gICAgICpcbiAgICAgKiBJbnN0ZWFkIG9mIHdyaXRpbmc6XG4gICAgICpcbiAgICAgKiAgICAgbGV0IE15Q2xhc3MgPSBNaXhpbjEoTWl4aW4yKE1peGluMyhNaXhpbjQoTWl4aW41KEJhc2VDbGFzcykpKSkpO1xuICAgICAqXG4gICAgICogWW91IGNhbiB3cml0ZTpcbiAgICAgKlxuICAgICAqICAgICBsZXQgTXlDbGFzcyA9IENvbXBvc2FibGVNaXhpbihCYXNlQ2xhc3MpLmNvbXBvc2UoXG4gICAgICogICAgICAgTWl4aW4xLFxuICAgICAqICAgICAgIE1peGluMixcbiAgICAgKiAgICAgICBNaXhpbjMsXG4gICAgICogICAgICAgTWl4aW40LFxuICAgICAqICAgICAgIE1peGluNVxuICAgICAqICAgICApO1xuICAgICAqXG4gICAgICogVGhpcyBmdW5jdGlvbiBjYW4gYWxzbyB0YWtlIG1peGluIG9iamVjdHMuIEEgbWl4aW4gb2JqZWN0IGlzIGp1c3QgYVxuICAgICAqIHNob3J0aGFuZCBmb3IgYSBtaXhpbiBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgc3ViY2xhc3Mgd2l0aCB0aGUgZ2l2ZW5cbiAgICAgKiBtZW1iZXJzLiBUaGUgbWl4aW4gb2JqZWN0J3MgbWVtYmVycyBhcmUgKm5vdCogY29waWVkIGRpcmVjdGx5IG9udG8gdGhlXG4gICAgICogcHJvdG90eXBlIG9mIHRoZSBiYXNlIGNsYXNzLCBhcyB3aXRoIHRyYWRpdGlvbmFsIG1peGlucy5cbiAgICAgKlxuICAgICAqIEluIGFkZGl0aW9uIHRvIHByb3ZpZGluZyBzeW50YWN0aWMgc3VnYXIsIHRoaXMgbWl4aW4gY2FuIGJlIHVzZWQgdG9cbiAgICAgKiBkZWZpbmUgYSBjbGFzcyBpbiBFUzUsIHdoaWNoIGxhY2tzIEVTNidzIGBjbGFzc2Aga2V5d29yZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Li4ubWl4aW5zfSBtaXhpbnMgLSBBIHNldCBvZiBtaXhpbiBmdW5jdGlvbnMgb3Igb2JqZWN0cyB0byBhcHBseS5cbiAgICAgKi9cbiAgICBzdGF0aWMgY29tcG9zZSguLi5taXhpbnMpIHtcbiAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBzdWJjbGFzcyBmb3IgZWFjaCBtaXhpbiBpbiB0dXJuLiBUaGUgcmVzdWx0IGJlY29tZXNcbiAgICAgIC8vIHRoZSBiYXNlIGNsYXNzIGV4dGVuZGVkIGJ5IGFueSBzdWJzZXF1ZW50IG1peGlucy4gSXQgdHVybnMgb3V0IHRoYXRcbiAgICAgIC8vIHdlIGNhbiB1c2UgQXJyYXkucmVkdWNlKCkgdG8gY29uY2lzZWx5IGV4cHJlc3MgdGhpcywgdXNpbmcgdGhlIGN1cnJlbnRcbiAgICAgIC8vIG9iamVjdCBhcyB0aGUgc2VlZCBmb3IgcmVkdWNlKCkuXG4gICAgICByZXR1cm4gbWl4aW5zLnJlZHVjZShjb21wb3NlQ2xhc3MsIHRoaXMpO1xuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIENvbXBvc2FibGU7XG59O1xuXG5cbi8vIFByb3BlcnRpZXMgZGVmaW5lZCBieSBPYmplY3QgdGhhdCB3ZSBkb24ndCB3YW50IHRvIG1peGluLlxuY29uc3QgTk9OX01JWEFCTEVfT0JKRUNUX1BST1BFUlRJRVMgPSBbXG4gICdjb25zdHJ1Y3Rvcidcbl07XG5cbi8qXG4gKiBBcHBseSB0aGUgbWl4aW4gdG8gdGhlIGdpdmVuIGJhc2UgY2xhc3MgdG8gcmV0dXJuIGEgbmV3IGNsYXNzLlxuICogVGhlIG1peGluIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG1vZGlmaWVkIGNsYXNzLCBvciBhXG4gKiBwbGFpbiBvYmplY3Qgd2hvc2UgbWVtYmVycyB3aWxsIGJlIGNvcGllZCB0byB0aGUgbmV3IGNsYXNzJyBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VDbGFzcyhiYXNlLCBtaXhpbikge1xuICBpZiAodHlwZW9mIG1peGluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gTWl4aW4gZnVuY3Rpb25cbiAgICByZXR1cm4gbWl4aW4oYmFzZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTWl4aW4gb2JqZWN0XG4gICAgY2xhc3MgU3ViY2xhc3MgZXh0ZW5kcyBiYXNlIHt9XG4gICAgY29weU93blByb3BlcnRpZXMobWl4aW4sIFN1YmNsYXNzLnByb3RvdHlwZSwgTk9OX01JWEFCTEVfT0JKRUNUX1BST1BFUlRJRVMpO1xuICAgIHJldHVybiBTdWJjbGFzcztcbiAgfVxufVxuXG5cbi8qXG4gKiBDb3B5IHRoZSBnaXZlbiBwcm9wZXJ0aWVzL21ldGhvZHMgdG8gdGhlIHRhcmdldC5cbiAqIFJldHVybiB0aGUgdXBkYXRlZCB0YXJnZXQuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPd25Qcm9wZXJ0aWVzKHNvdXJjZSwgdGFyZ2V0LCBpZ25vcmVQcm9wZXJ0eU5hbWVzID0gW10pIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmIChpZ25vcmVQcm9wZXJ0eU5hbWVzLmluZGV4T2YobmFtZSkgPCAwKSB7XG4gICAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIG5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhcmdldDtcbn1cbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuaW1wb3J0IHRvZ2dsZUNsYXNzIGZyb20gJy4vdG9nZ2xlQ2xhc3MnO1xuaW1wb3J0IHN5bWJvbHMgZnJvbSAnLi9zeW1ib2xzJztcblxuXG4vLyBTeW1ib2xzIGZvciBwcml2YXRlIGRhdGEgbWVtYmVycyBvbiBhbiBlbGVtZW50LlxuY29uc3QgaXRlbXNTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ2l0ZW1zJyk7XG5jb25zdCBpdGVtSW5pdGlhbGl6ZWRTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ2l0ZW1Jbml0aWFsaXplZCcpO1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggQ29udGVudEl0ZW1zLiAqL1xuZXhwb3J0IGRlZmF1bHQgKGJhc2UpID0+IHtcblxuICAvKipcbiAgICogTWl4aW4gd2hpY2ggbWFwcyBjb250ZW50IHNlbWFudGljcyAoZWxlbWVudHMpIHRvIGxpc3QgaXRlbSBzZW1hbnRpY3MuXG4gICAqXG4gICAqIEl0ZW1zIGRpZmZlciBmcm9tIGVsZW1lbnQgY29udGVudHMgaW4gc2V2ZXJhbCB3YXlzOlxuICAgKlxuICAgKiAqIFRoZXkgYXJlIG9mdGVuIHJlZmVyZW5jZWQgdmlhIGluZGV4LlxuICAgKiAqIFRoZXkgbWF5IGhhdmUgYSBzZWxlY3Rpb24gc3RhdGUuXG4gICAqICogSXQncyBjb21tb24gdG8gZG8gd29yayB0byBpbml0aWFsaXplIHRoZSBhcHBlYXJhbmNlIG9yIHN0YXRlIG9mIGEgbmV3XG4gICAqICAgaXRlbS5cbiAgICogKiBBdXhpbGlhcnkgaW52aXNpYmxlIGNoaWxkIGVsZW1lbnRzIGFyZSBmaWx0ZXJlZCBvdXQgYW5kIG5vdCBjb3VudGVkIGFzXG4gICAqICAgaXRlbXMuIEF1eGlsaWFyeSBlbGVtZW50cyBpbmNsdWRlIGxpbmssIHNjcmlwdCwgc3R5bGUsIGFuZCB0ZW1wbGF0ZVxuICAgKiAgIGVsZW1lbnRzLiBUaGlzIGZpbHRlcmluZyBlbnN1cmVzIHRoYXQgdGhvc2UgYXV4aWxpYXJ5IGVsZW1lbnRzIGNhbiBiZVxuICAgKiAgIHVzZWQgaW4gbWFya3VwIGluc2lkZSBvZiBhIGxpc3Qgd2l0aG91dCBiZWluZyB0cmVhdGVkIGFzIGxpc3QgaXRlbXMuXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gZXhwZWN0cyBhIGNvbXBvbmVudCB0byBwcm92aWRlIGEgYGNvbnRlbnRgIHByb3BlcnR5IHJldHVybmluZyBhXG4gICAqIHJhdyBzZXQgb2YgZWxlbWVudHMuIFlvdSBjYW4gcHJvdmlkZSB0aGF0IHlvdXJzZWxmLCBvciB1c2VcbiAgICogW0Rpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW5dKERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW4ubWQpLlxuICAgKlxuICAgKiBUaGUgbW9zdCBjb21tb25seSByZWZlcmVuY2VkIHByb3BlcnR5IGRlZmluZWQgYnkgdGhpcyBtaXhpbiBpcyB0aGUgYGl0ZW1zYFxuICAgKiBwcm9wZXJ0eS4gVG8gYXZvaWQgaGF2aW5nIHRvIGRvIHdvcmsgZWFjaCB0aW1lIHRoYXQgcHJvcGVydHkgaXMgcmVxdWVzdGVkLFxuICAgKiB0aGlzIG1peGluIHN1cHBvcnRzIGFuIG9wdGltaXplZCBtb2RlLiBJZiB5b3UgaW52b2tlIHRoZSBgY29udGVudENoYW5nZWRgXG4gICAqIG1ldGhvZCB3aGVuIHRoZSBzZXQgb2YgaXRlbXMgY2hhbmdlcywgdGhlIG1peGluIGNvbmNsdWRlcyB0aGF0IHlvdSdsbCB0YWtlXG4gICAqIGNhcmUgb2Ygbm90aWZ5aW5nIGl0IG9mIGZ1dHVyZSBjaGFuZ2VzLCBhbmQgdHVybnMgb24gdGhlIG9wdGltaXphdGlvbi4gV2l0aFxuICAgKiB0aGF0IG9uLCB0aGUgbWl4aW4gc2F2ZXMgYSByZWZlcmVuY2UgdG8gdGhlIGNvbXB1dGVkIHNldCBvZiBpdGVtcywgYW5kIHdpbGxcbiAgICogcmV0dXJuIHRoYXQgaW1tZWRpYXRlbHkgb24gc3Vic2VxdWVudCBjYWxscyB0byB0aGUgYGl0ZW1zYCBwcm9wZXJ0eS4gSWYgeW91XG4gICAqIHVzZSB0aGlzIG1peGluIGluIGNvbmp1bmN0aW9uIHdpdGhcbiAgICogW0Rpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW5dKERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW4ubWQpLCB0aGVcbiAgICogYGNvbnRlbnRDaGFuZ2VkYCBtZXRob2Qgd2lsbCBiZSBpbnZva2VkIGZvciB5b3Ugd2hlbiB0aGUgZWxlbWVudCdzIGNoaWxkcmVuXG4gICAqIGNoYW5nZSwgdHVybmluZyBvbiB0aGUgb3B0aW1pemF0aW9uIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBjbGFzcyBDb250ZW50SXRlbXMgZXh0ZW5kcyBiYXNlIHtcblxuICAgIC8qKlxuICAgICAqIEFwcGx5IHRoZSBzZWxlY3Rpb24gc3RhdGUgdG8gYSBzaW5nbGUgaXRlbS5cbiAgICAgKlxuICAgICAqIEludm9rZSB0aGlzIG1ldGhvZCB0byBzaWduYWwgdGhhdCB0aGUgc2VsZWN0ZWQgc3RhdGUgb2YgdGhlIGluZGljYXRlZCBpdGVtXG4gICAgICogaGFzIGNoYW5nZWQuIEJ5IGRlZmF1bHQsIHRoaXMgYXBwbGllcyBhIGBzZWxlY3RlZGAgQ1NTIGNsYXNzIGlmIHRoZSBpdGVtXG4gICAgICogaXMgc2VsZWN0ZWQsIGFuZCByZW1vdmVkIGl0IGlmIG5vdCBzZWxlY3RlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGl0ZW0gLSBUaGUgaXRlbSB3aG9zZSBzZWxlY3Rpb24gc3RhdGUgaGFzIGNoYW5nZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzZWxlY3RlZCAtIFRydWUgaWYgdGhlIGl0ZW0gaXMgc2VsZWN0ZWQsIGZhbHNlIGlmIG5vdC5cbiAgICAgKi9cbiAgICBbc3ltYm9scy5hcHBseVNlbGVjdGlvbl0oaXRlbSwgc2VsZWN0ZWQpIHtcbiAgICAgIGlmIChzdXBlcltzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXSkgeyBzdXBlcltzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXShpdGVtLCBzZWxlY3RlZCk7IH1cbiAgICAgIHRvZ2dsZUNsYXNzKGl0ZW0sICdzZWxlY3RlZCcsIHNlbGVjdGVkKTtcbiAgICB9XG5cbiAgICBjb250ZW50Q2hhbmdlZCgpIHtcbiAgICAgIGlmIChzdXBlci5jb250ZW50Q2hhbmdlZCkgeyBzdXBlci5jb250ZW50Q2hhbmdlZCgpOyB9XG5cbiAgICAgIC8vIFNpbmNlIHdlIGdvdCB0aGUgY29udGVudENoYW5nZWQgY2FsbCwgd2UnbGwgYXNzdW1lIHdlJ2xsIGJlIG5vdGlmaWVkIGlmXG4gICAgICAvLyB0aGUgc2V0IG9mIGl0ZW1zIGNoYW5nZXMgbGF0ZXIuIFdlIHR1cm4gb24gbWVtb2l6YXRpb24gb2YgdGhlIGl0ZW1zXG4gICAgICAvLyBwcm9wZXJ0eSBieSBzZXR0aW5nIG91ciBpbnRlcm5hbCBwcm9wZXJ0eSB0byBudWxsIChpbnN0ZWFkIG9mXG4gICAgICAvLyB1bmRlZmluZWQpLlxuICAgICAgdGhpc1tpdGVtc1N5bWJvbF0gPSBudWxsO1xuXG4gICAgICB0aGlzLml0ZW1zQ2hhbmdlZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGludm9rZWQgd2hlbmV2ZXIgYSBuZXcgaXRlbSBpcyBhZGRlZCB0byB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGRvZXMgbm90aGluZy4gWW91IGNhbiBvdmVycmlkZVxuICAgICAqIHRoaXMgdG8gcGVyZm9ybSBwZXItaXRlbSBpbml0aWFsaXphdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGl0ZW0gLSBUaGUgaXRlbSB0aGF0IHdhcyBhZGRlZC5cbiAgICAgKi9cbiAgICBbc3ltYm9scy5pdGVtQWRkZWRdKGl0ZW0pIHtcbiAgICAgIGlmIChzdXBlcltzeW1ib2xzLml0ZW1BZGRlZF0pIHsgc3VwZXJbc3ltYm9scy5pdGVtQWRkZWRdKGl0ZW0pOyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgc2V0IG9mIGl0ZW1zIGluIHRoZSBsaXN0LiBTZWUgdGhlIHRvcC1sZXZlbCBkb2N1bWVudGF0aW9uIGZvclxuICAgICAqIG1peGluIGZvciBhIGRlc2NyaXB0aW9uIG9mIGhvdyBpdGVtcyBkaWZmZXIgZnJvbSBwbGFpbiBjb250ZW50LlxuICAgICAqXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50W119XG4gICAgICovXG4gICAgZ2V0IGl0ZW1zKCkge1xuICAgICAgbGV0IGl0ZW1zO1xuICAgICAgaWYgKHRoaXNbaXRlbXNTeW1ib2xdID09IG51bGwpIHtcbiAgICAgICAgaXRlbXMgPSBmaWx0ZXJBdXhpbGlhcnlFbGVtZW50cyh0aGlzLmNvbnRlbnQpO1xuICAgICAgICAvLyBOb3RlOiB0ZXN0IGZvciAqZXF1YWxpdHkqIHdpdGggbnVsbDsgZG9uJ3QgdHJlYXQgdW5kZWZpbmVkIGFzIGEgbWF0Y2guXG4gICAgICAgIGlmICh0aGlzW2l0ZW1zU3ltYm9sXSA9PT0gbnVsbCkge1xuICAgICAgICAgIC8vIE1lbW9pemUgdGhlIHNldCBvZiBpdGVtcy5cbiAgICAgICAgICB0aGlzW2l0ZW1zU3ltYm9sXSA9IGl0ZW1zO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZXR1cm4gdGhlIG1lbW9pemVkIGl0ZW1zLlxuICAgICAgICBpdGVtcyA9IHRoaXNbaXRlbXNTeW1ib2xdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGludm9rZWQgd2hlbiB0aGUgdW5kZXJseWluZyBjb250ZW50cyBjaGFuZ2UuIEl0IGlzIGFsc29cbiAgICAgKiBpbnZva2VkIG9uIGNvbXBvbmVudCBpbml0aWFsaXphdGlvbiDigJMgc2luY2UgdGhlIGl0ZW1zIGhhdmUgXCJjaGFuZ2VkXCIgZnJvbVxuICAgICAqIGJlaW5nIG5vdGhpbmcuXG4gICAgICovXG4gICAgaXRlbXNDaGFuZ2VkKCkge1xuICAgICAgaWYgKHN1cGVyLml0ZW1zQ2hhbmdlZCkgeyBzdXBlci5pdGVtc0NoYW5nZWQoKTsgfVxuXG4gICAgICAvLyBQZXJmb3JtIHBlci1pdGVtIGluaXRpYWxpemF0aW9uLlxuICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAoIWl0ZW1baXRlbUluaXRpYWxpemVkU3ltYm9sXSkge1xuICAgICAgICAgIHRoaXNbc3ltYm9scy5pdGVtQWRkZWRdKGl0ZW0pO1xuICAgICAgICAgIGl0ZW1baXRlbUluaXRpYWxpemVkU3ltYm9sXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdpdGVtcy1jaGFuZ2VkJykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gdGhlIGl0ZW1zIGluIHRoZSBsaXN0IGNoYW5nZS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBDb250ZW50SXRlbXNcbiAgICAgKiBAZXZlbnQgaXRlbXMtY2hhbmdlZFxuICAgICAqL1xuICB9XG5cbiAgcmV0dXJuIENvbnRlbnRJdGVtcztcbn07XG5cblxuLy8gUmV0dXJuIHRoZSBnaXZlbiBlbGVtZW50cywgZmlsdGVyaW5nIG91dCBhdXhpbGlhcnkgZWxlbWVudHMgdGhhdCBhcmVuJ3Rcbi8vIHR5cGljYWxseSB2aXNpYmxlLiBJdGVtcyB3aGljaCBhcmUgbm90IGVsZW1lbnRzIGFyZSByZXR1cm5lZCBhcyBpcy5cbmZ1bmN0aW9uIGZpbHRlckF1eGlsaWFyeUVsZW1lbnRzKGl0ZW1zKSB7XG4gIGNvbnN0IGF1eGlsaWFyeVRhZ3MgPSBbXG4gICAgJ2xpbmsnLFxuICAgICdzY3JpcHQnLFxuICAgICdzdHlsZScsXG4gICAgJ3RlbXBsYXRlJ1xuICBdO1xuICByZXR1cm4gW10uZmlsdGVyLmNhbGwoaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gIWl0ZW0ubG9jYWxOYW1lIHx8IGF1eGlsaWFyeVRhZ3MuaW5kZXhPZihpdGVtLmxvY2FsTmFtZSkgPCAwO1xuICB9KTtcbn1cbiIsImltcG9ydCBtaWNyb3Rhc2sgZnJvbSAnLi9taWNyb3Rhc2snO1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggRGlzdHJpYnV0ZWRDaGlsZHJlbkNvbnRlbnQuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBNaXhpbiB3aGljaCBkZWZpbmVzIGEgY29tcG9uZW50J3MgY29udGVudCBhcyBpdHMgY2hpbGRyZW4sIGV4cGFuZGluZyBhbnlcbiAgICogbm9kZXMgZGlzdHJpYnV0ZWQgdG8gdGhlIGNvbXBvbmVudCdzIHNsb3RzLlxuICAgKlxuICAgKiBUaGlzIGFsc28gcHJvdmlkZXMgbm90aWZpY2F0aW9uIG9mIGNoYW5nZXMgdG8gYSBjb21wb25lbnQncyBjb250ZW50LiBJdFxuICAgKiB3aWxsIGludm9rZSBhIGBjb250ZW50Q2hhbmdlZGAgbWV0aG9kIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBmaXJzdFxuICAgKiBpbnN0YW50aWF0ZWQsIGFuZCB3aGVuZXZlciBpdHMgZGlzdHJpYnV0ZWQgY2hpbGRyZW4gY2hhbmdlLiBUaGlzIGlzIGFuXG4gICAqIGVhc3kgd2F5IHRvIHNhdGlzZnkgdGhlIEdvbGQgU3RhbmRhcmQgY2hlY2tsaXN0IGl0ZW0gZm9yIG1vbml0b3JpbmdcbiAgICogW0NvbnRlbnQgQ2hhbmdlc10oaHR0cHM6Ly9naXRodWIuY29tL3dlYmNvbXBvbmVudHMvZ29sZC1zdGFuZGFyZC93aWtpL0NvbnRlbnQtQ2hhbmdlcykuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiBsZXQgYmFzZSA9IERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW4oRGlzdHJpYnV0ZWRDaGlsZHJlbk1peGluKEhUTUxFbGVtZW50KSk7XG4gICAqIGNsYXNzIENvdW50aW5nRWxlbWVudCBleHRlbmRzIGJhc2Uge1xuICAgKlxuICAgKiAgIGNvbnN0cnVjdG9yKCkge1xuICAgKiAgICAgc3VwZXIoKTtcbiAgICogICAgIGxldCByb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAqICAgICByb290LmlubmVySFRNTCA9IGA8c2xvdD48L3Nsb3Q+YDtcbiAgICogICB9XG4gICAqXG4gICAqICAgY29udGVudENoYW5nZWQoKSB7XG4gICAqICAgICAvLyBDb3VudCB0aGUgY29tcG9uZW50J3MgY2hpbGRyZW4sIGJvdGggaW5pdGlhbGx5IGFuZCB3aGVuIGNoYW5nZWQuXG4gICAqICAgICB0aGlzLmNvdW50ID0gdGhpcy5kaXN0cmlidXRlZENoaWxkcmVuLmxlbmd0aDtcbiAgICogICB9XG4gICAqXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIE5vdGUgdGhhdCBjb250ZW50IGNoYW5nZSBkZXRlY3Rpb24gZGVwZW5kcyB1cG9uIHRoZSBlbGVtZW50IGhhdmluZyBhdCBsZWFzdFxuICAgKiBvbmUgYHNsb3RgIGVsZW1lbnQgaW4gaXRzIHNoYWRvdyBzdWJ0cmVlLlxuICAgKlxuICAgKiBUaGlzIG1peGluIGlzIGludGVuZGVkIGZvciB1c2Ugd2l0aCB0aGVcbiAgICogW0Rpc3RyaWJ1dGVkQ2hpbGRyZW5NaXhpbl0oRGlzdHJpYnV0ZWRDaGlsZHJlbk1peGluLm1kKS4gU2VlIHRoYXQgbWl4aW4gZm9yXG4gICAqIGEgZGlzY3Vzc2lvbiBvZiBob3cgdGhhdCB3b3Jrcy4gVGhpcyBEaXN0cmlidXRlZENoaWxkcmVuQ29udGVudE1peGluXG4gICAqIHByb3ZpZGVzIGFuIGVhc3kgd2F5IG9mIGRlZmluaW5nIHRoZSBcImNvbnRlbnRcIiBvZiBhIGNvbXBvbmVudCBhcyB0aGVcbiAgICogY29tcG9uZW50J3MgZGlzdHJpYnV0ZWQgY2hpbGRyZW4uIFRoYXQgaW4gdHVybiBsZXRzIG1peGlucyBsaWtlXG4gICAqIFtDb250ZW50SXRlbXNNaXhpbl0oQ29udGVudEl0ZW1zTWl4aW4ubWQpIG1hbmlwdWxhdGUgdGhlIGNoaWxkcmVuIGFzIGxpc3RcbiAgICogaXRlbXMuXG4gICAqL1xuICBjbGFzcyBEaXN0cmlidXRlZENoaWxkcmVuQ29udGVudCBleHRlbmRzIGJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBpZiAodGhpcy5zaGFkb3dSb290KSB7XG4gICAgICAgIC8vIExpc3RlbiB0byBjaGFuZ2VzIG9uIGFsbCBzbG90cy5cbiAgICAgICAgY29uc3Qgc2xvdHMgPSB0aGlzLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnc2xvdCcpO1xuICAgICAgICBzbG90cy5mb3JFYWNoKHNsb3QgPT4gc2xvdC5hZGRFdmVudExpc3RlbmVyKCdzbG90Y2hhbmdlJywgZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuY29udGVudENoYW5nZWQoKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGFuIGluaXRpYWwgY2FsbCB0byBjb250ZW50Q2hhbmdlZCgpIHNvIHRoYXQgdGhlIGNvbXBvbmVudCBjYW4gZG9cbiAgICAgIC8vIGluaXRpYWxpemF0aW9uIHRoYXQgaXQgbm9ybWFsbHkgZG9lcyB3aGVuIGNvbnRlbnQgY2hhbmdlcy5cbiAgICAgIC8vXG4gICAgICAvLyBUaGlzIHdpbGwgaW52b2tlIGNvbnRlbnRDaGFuZ2VkKCkgaGFuZGxlcnMgaW4gb3RoZXIgbWl4aW5zLiBJbiBvcmRlclxuICAgICAgLy8gdGhhdCB0aG9zZSBtaXhpbnMgaGF2ZSBhIGNoYW5jZSB0byBjb21wbGV0ZSB0aGVpciBvd24gaW5pdGlhbGl6YXRpb24sXG4gICAgICAvLyB3ZSBhZGQgdGhlIGNvbnRlbnRDaGFuZ2VkKCkgY2FsbCB0byB0aGUgbWljcm90YXNrIHF1ZXVlLlxuICAgICAgbWljcm90YXNrKCgpID0+IHRoaXMuY29udGVudENoYW5nZWQoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlZCB3aGVuIHRoZSBjb250ZW50cyBvZiB0aGUgY29tcG9uZW50IChpbmNsdWRpbmcgZGlzdHJpYnV0ZWRcbiAgICAgKiBjaGlsZHJlbikgaGF2ZSBjaGFuZ2VkLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgaXMgYWxzbyBpbnZva2VkIHdoZW4gYSBjb21wb25lbnQgaXMgZmlyc3QgaW5zdGFudGlhdGVkOyB0aGVcbiAgICAgKiBjb250ZW50cyBoYXZlIGVzc2VudGlhbGx5IFwiY2hhbmdlZFwiIGZyb20gYmVpbmcgbm90aGluZy4gVGhpcyBhbGxvd3MgdGhlXG4gICAgICogY29tcG9uZW50IHRvIHBlcmZvcm0gaW5pdGlhbCBwcm9jZXNzaW5nIG9mIGl0cyBjaGlsZHJlbi5cbiAgICAgKi9cbiAgICBjb250ZW50Q2hhbmdlZCgpIHtcbiAgICAgIGlmIChzdXBlci5jb250ZW50Q2hhbmdlZCkgeyBzdXBlci5jb250ZW50Q2hhbmdlZCgpOyB9XG4gICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnY29udGVudC1jaGFuZ2VkJyk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjb250ZW50IG9mIHRoaXMgY29tcG9uZW50LCBkZWZpbmVkIHRvIGJlIHRoZSBmbGF0dGVuZWQgYXJyYXkgb2ZcbiAgICAgKiBjaGlsZHJlbiBkaXN0cmlidXRlZCB0byB0aGUgY29tcG9uZW50LlxuICAgICAqXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50W119XG4gICAgICovXG4gICAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgICBjb25zdCBkaXN0cmlidXRlZENoaWxkcmVuID0gdGhpcy5kaXN0cmlidXRlZENoaWxkcmVuO1xuICAgICAgaWYgKHR5cGVvZiBkaXN0cmlidXRlZENoaWxkcmVuID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLndhcm4oYERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW4gZXhwZWN0cyB0aGUgY29tcG9uZW50IHRvIGRlZmluZSBhIFwiZGlzdHJpYnV0ZWRDaGlsZHJlblwiIHByb3BlcnR5LmApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRpc3RyaWJ1dGVkQ2hpbGRyZW47XG4gICAgfVxuICAgIHNldCBjb250ZW50KHZhbHVlKSB7XG4gICAgICBpZiAoJ2NvbnRlbnQnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLmNvbnRlbnQgPSB2YWx1ZTsgfVxuICAgICAgLy8gVE9ETzogU2V0IHRoZSBjaGlsZHJlbiB0byB0aGUgZ2l2ZW4gdmFsdWUgKHdoaWNoIHNob3VsZCBiZSBhbiBhcnJheSBvZlxuICAgICAgLy8gZWxlbWVudHMpP1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgZXZlbnQgaXMgcmFpc2VkIHdoZW4gdGhlIGNvbXBvbmVudCdzIGNvbnRlbnRzIChpbmNsdWRpbmcgZGlzdHJpYnV0ZWRcbiAgICAgKiBjaGlsZHJlbikgaGF2ZSBjaGFuZ2VkLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50XG4gICAgICogQGV2ZW50IGNvbnRlbnQtY2hhbmdlZFxuICAgICAqL1xuICB9XG5cbiAgcmV0dXJuIERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50O1xufTtcbiIsIi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggRGlzdHJpYnV0ZWRDaGlsZHJlbi4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHdoaWNoIGRlZmluZXMgaGVscGVycyBmb3IgYWNjZXNzaW5nIGEgY29tcG9uZW50J3MgZGlzdHJpYnV0ZWRcbiAgICogY2hpbGRyZW4gYXMgYSBmbGF0dGVuZWQgYXJyYXkgb3Igc3RyaW5nLlxuICAgKlxuICAgKiBUaGUgc3RhbmRhcmQgRE9NIEFQSSBwcm92aWRlcyBzZXZlcmFsIHdheXMgb2YgYWNjZXNzaW5nIGNoaWxkIGNvbnRlbnQ6XG4gICAqIGBjaGlsZHJlbmAsIGBjaGlsZE5vZGVzYCwgYW5kIGB0ZXh0Q29udGVudGAuIE5vbmUgb2YgdGhlc2UgZnVuY3Rpb25zIGFyZVxuICAgKiBTaGFkb3cgRE9NIGF3YXJlLiBUaGlzIG1peGluIGRlZmluZXMgdmFyaWF0aW9ucyBvZiB0aG9zZSBmdW5jdGlvbnMgdGhhdFxuICAgKiAqYXJlKiBTaGFkb3cgRE9NIGF3YXJlLlxuICAgKlxuICAgKiBFeGFtcGxlOiB5b3UgY3JlYXRlIGEgY29tcG9uZW50IGA8Y291bnQtY2hpbGRyZW4+YCB0aGF0IGRpc3BsYXlzIGEgbnVtYmVyXG4gICAqIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gcGxhY2VkIGluc2lkZSB0aGF0IGNvbXBvbmVudC4gSWYgc29tZW9uZVxuICAgKiBpbnN0YW50aWF0ZXMgeW91ciBjb21wb25lbnQgbGlrZTpcbiAgICpcbiAgICogICAgIDxjb3VudC1jaGlsZHJlbj5cbiAgICogICAgICAgPGRpdj48L2Rpdj5cbiAgICogICAgICAgPGRpdj48L2Rpdj5cbiAgICogICAgICAgPGRpdj48L2Rpdj5cbiAgICogICAgIDwvY291bnQtY2hpbGRyZW4+XG4gICAqXG4gICAqIFRoZW4gdGhlIGNvbXBvbmVudCBzaG91bGQgc2hvdyBcIjNcIiwgYmVjYXVzZSB0aGVyZSBhcmUgdGhyZWUgY2hpbGRyZW4uIFRvXG4gICAqIGNhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuLCB0aGUgY29tcG9uZW50IGNhbiBqdXN0IGNhbGN1bGF0ZVxuICAgKiBgdGhpcy5jaGlsZHJlbi5sZW5ndGhgLiBIb3dldmVyLCBzdXBwb3NlIHNvbWVvbmUgaW5zdGFudGlhdGVzIHlvdXJcbiAgICogY29tcG9uZW50IGluc2lkZSBvbmUgb2YgdGhlaXIgb3duIGNvbXBvbmVudHMsIGFuZCBwdXRzIGEgYDxzbG90PmAgZWxlbWVudFxuICAgKiBpbnNpZGUgeW91ciBjb21wb25lbnQ6XG4gICAqXG4gICAqICAgICA8Y291bnQtY2hpbGRyZW4+XG4gICAqICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICogICAgIDwvY291bnQtY2hpbGRyZW4+XG4gICAqXG4gICAqIElmIHlvdXIgY29tcG9uZW50IG9ubHkgbG9va3MgYXQgYHRoaXMuY2hpbGRyZW5gLCBpdCB3aWxsIGFsd2F5cyBzZWUgZXhhY3RseVxuICAgKiBvbmUgY2hpbGQg4oCUwqB0aGUgYDxzbG90PmAgZWxlbWVudC4gQnV0IHRoZSB1c2VyIGxvb2tpbmcgYXQgdGhlIHBhZ2Ugd2lsbFxuICAgKiAqc2VlKiBhbnkgbm9kZXMgZGlzdHJpYnV0ZWQgdG8gdGhhdCBzbG90LiBUbyBtYXRjaCB3aGF0IHRoZSB1c2VyIHNlZXMsIHlvdXJcbiAgICogY29tcG9uZW50IHNob3VsZCBleHBhbmQgYW55IGA8c2xvdD5gIGVsZW1lbnRzIGl0IGNvbnRhaW5zLlxuICAgKlxuICAgKiBUaGF0IGlzIHRoZSBwcm9ibGVtIHRoaXMgbWl4aW4gc29sdmVzLiBBZnRlciBhcHBseWluZyB0aGlzIG1peGluLCB5b3VyXG4gICAqIGNvbXBvbmVudCBjb2RlIGhhcyBhY2Nlc3MgdG8gYHRoaXMuZGlzdHJpYnV0ZWRDaGlsZHJlbmAsIHdob3NlIGBsZW5ndGhgXG4gICAqIHdpbGwgcmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgYWxsIGNoaWxkcmVuIGRpc3RyaWJ1dGVkIHRvIHlvdXIgY29tcG9uZW50XG4gICAqIGluIHRoZSBjb21wb3NlZCB0cmVlLlxuICAgKlxuICAgKiBOb3RlOiBUaGUgbGF0ZXN0IEN1c3RvbSBFbGVtZW50cyBBUEkgZGVzaWduIGNhbGxzIGZvciBhIG5ldyBmdW5jdGlvbixcbiAgICogYGdldEFzc2lnbmVkTm9kZXNgIHRoYXQgdGFrZXMgYW4gb3B0aW9uYWwgYGRlZXBgIHBhcmFtZXRlciwgdGhhdCB3aWxsIHNvbHZlXG4gICAqIHRoaXMgcHJvYmxlbSBhdCB0aGUgQVBJIGxldmVsLlxuICAgKi9cbiAgY2xhc3MgRGlzdHJpYnV0ZWRDaGlsZHJlbiBleHRlbmRzIGJhc2Uge1xuXG4gICAgLyoqXG4gICAgICogQW4gaW4tb3JkZXIgY29sbGVjdGlvbiBvZiBkaXN0cmlidXRlZCBjaGlsZHJlbiwgZXhwYW5kaW5nIGFueSBzbG90XG4gICAgICogZWxlbWVudHMuIExpa2UgdGhlIHN0YW5kYXJkIGNoaWxkcmVuIHByb3BlcnR5LCB0aGlzIHNraXBzIHRleHQgbm9kZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBnZXQgZGlzdHJpYnV0ZWRDaGlsZHJlbigpIHtcbiAgICAgIHJldHVybiBleHBhbmRDb250ZW50RWxlbWVudHModGhpcy5jaGlsZHJlbiwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGluLW9yZGVyIGNvbGxlY3Rpb24gb2YgZGlzdHJpYnV0ZWQgY2hpbGQgbm9kZXMsIGV4cGFuZGluZyBhbnkgc2xvdFxuICAgICAqIGVsZW1lbnRzLiBMaWtlIHRoZSBzdGFuZGFyZCBjaGlsZE5vZGVzIHByb3BlcnR5LCB0aGlzIGluY2x1ZGVzIHRleHRcbiAgICAgKiBub2Rlcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOb2RlW119XG4gICAgICovXG4gICAgZ2V0IGRpc3RyaWJ1dGVkQ2hpbGROb2RlcygpIHtcbiAgICAgIHJldHVybiBleHBhbmRDb250ZW50RWxlbWVudHModGhpcy5jaGlsZE5vZGVzLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29uY2F0ZW5hdGVkIHRleHQgY29udGVudCBvZiBhbGwgZGlzdHJpYnV0ZWQgY2hpbGQgbm9kZXMsIGV4cGFuZGluZ1xuICAgICAqIGFueSBzbG90IGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgZGlzdHJpYnV0ZWRUZXh0Q29udGVudCgpIHtcbiAgICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmRpc3RyaWJ1dGVkQ2hpbGROb2Rlcy5tYXAoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkLnRleHRDb250ZW50O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gc3RyaW5ncy5qb2luKCcnKTtcbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBEaXN0cmlidXRlZENoaWxkcmVuO1xufTtcblxuXG4vKlxuICogR2l2ZW4gYSBhcnJheSBvZiBub2RlcywgcmV0dXJuIGEgbmV3IGFycmF5IHdpdGggYW55IGNvbnRlbnQgZWxlbWVudHMgZXhwYW5kZWRcbiAqIHRvIHRoZSBub2RlcyBkaXN0cmlidXRlZCB0byB0aGF0IGNvbnRlbnQgZWxlbWVudC4gVGhpcyBydWxlIGlzIGFwcGxpZWRcbiAqIHJlY3Vyc2l2ZWx5LlxuICpcbiAqIElmIGluY2x1ZGVUZXh0Tm9kZXMgaXMgdHJ1ZSwgdGV4dCBub2RlcyB3aWxsIGJlIGluY2x1ZGVkLCBhcyBpbiB0aGVcbiAqIHN0YW5kYXJkIGNoaWxkTm9kZXMgcHJvcGVydHk7IGJ5IGRlZmF1bHQsIHRoaXMgc2tpcHMgdGV4dCBub2RlcywgbGlrZSB0aGVcbiAqIHN0YW5kYXJkIGNoaWxkcmVuIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBleHBhbmRDb250ZW50RWxlbWVudHMobm9kZXMsIGluY2x1ZGVUZXh0Tm9kZXMpIHtcbiAgY29uc3QgZXhwYW5kZWQgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwobm9kZXMsIG5vZGUgPT4ge1xuICAgIC8vIFdlIHdhbnQgdG8gc2VlIGlmIHRoZSBub2RlIGlzIGFuIGluc3RhbmNlb2YgSFRNTFNsb3RFTGVtZW50LCBidXRcbiAgICAvLyB0aGF0IGNsYXNzIHdvbid0IGV4aXN0IGlmIHRoZSBicm93c2VyIHRoYXQgZG9lc24ndCBzdXBwb3J0IG5hdGl2ZVxuICAgIC8vIFNoYWRvdyBET00gYW5kIGlmIHRoZSBTaGFkb3cgRE9NIHBvbHlmaWxsIGhhc24ndCBiZWVuIGxvYWRlZC4gSW5zdGVhZCxcbiAgICAvLyB3ZSBkbyBhIHNpbXBsaXN0aWMgY2hlY2sgdG8gc2VlIGlmIHRoZSB0YWcgbmFtZSBpcyBcInNsb3RcIi5cbiAgICBjb25zdCBpc1Nsb3QgPSB0eXBlb2YgSFRNTFNsb3RFbGVtZW50ICE9PSAndW5kZWZpbmVkJyA/XG4gICAgICBub2RlIGluc3RhbmNlb2YgSFRNTFNsb3RFbGVtZW50IDpcbiAgICAgIG5vZGUubG9jYWxOYW1lID09PSAnc2xvdCc7XG4gICAgaWYgKGlzU2xvdCkge1xuICAgICAgLy8gVXNlIHRoZSBub2RlcyBhc3NpZ25lZCB0byB0aGlzIG5vZGUgaW5zdGVhZC5cbiAgICAgIGNvbnN0IGFzc2lnbmVkTm9kZXMgPSBub2RlLmFzc2lnbmVkTm9kZXMoeyBmbGF0dGVuOiB0cnVlIH0pO1xuICAgICAgcmV0dXJuIGFzc2lnbmVkTm9kZXMgP1xuICAgICAgICBleHBhbmRDb250ZW50RWxlbWVudHMoYXNzaWduZWROb2RlcywgaW5jbHVkZVRleHROb2RlcykgOlxuICAgICAgICBbXTtcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgLy8gUGxhaW4gZWxlbWVudDsgdXNlIGFzIGlzLlxuICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBUZXh0ICYmIGluY2x1ZGVUZXh0Tm9kZXMpIHtcbiAgICAgIC8vIFRleHQgbm9kZS5cbiAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENvbW1lbnQsIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24sIGV0Yy47IHNraXAuXG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9KTtcbiAgY29uc3QgZmxhdHRlbmVkID0gW10uY29uY2F0KC4uLmV4cGFuZGVkKTtcbiAgcmV0dXJuIGZsYXR0ZW5lZDtcbn1cbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuXG5cbi8vIFN5bWJvbHMgZm9yIHByaXZhdGUgZGF0YSBtZW1iZXJzIG9uIGFuIGVsZW1lbnQuXG5jb25zdCBzZWxlY3RlZEZyYWN0aW9uU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdzZWxlY3RlZEZyYWN0aW9uJyk7XG5cblxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBGcmFjdGlvbmFsU2VsZWN0aW9uLiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWl4aW4oYmFzZSkge1xuXG4gIC8qKlxuICAgKiBBZGRzIHN1cHBvcnQgZm9yIGZyYWN0aW9uYWwgc2VsZWN0aW9uOiB0cmVhdGluZyBhIHNlbGVjdGlvbiBhcyBhIHJlYWxcbiAgICogbnVtYmVyIHRoYXQgY29tYmluZXMgYW4gaW50ZWdlciBwb3J0aW9uIChhbiBpbmRleCBpbnRvIGEgbGlzdCksIGFuZCBhXG4gICAqIGZyYWN0aW9uIChpbmRpY2F0aW5nIGhvdyBmYXIgb2YgdGhlIHdheSB3ZSBhcmUgdG8gdGhlIG5leHQgb3IgcHJldmlvdXNcbiAgICogaXRlbSkuXG4gICAqXG4gICAqIFRoaXMgaXMgdXNlZnVsIGluIGNvbXBvbmVudHMgdGhhdCBzdXBwb3J0IGluY3JlbWVudGFsIG9wZXJhdGlvbnMgZHVyaW5nXG4gICAqIGRyYWdnaW5nIGFuZCBzd2lwaW5nLiBFeGFtcGxlOiBhIGNhcm91c2VsIGNvbXBvbmVudCBoYXMgc2V2ZXJhbCBpdGVtcywgYW5kIHRoZVxuICAgKiBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbSBpcyBpdGVtIDMuIFRoZSB1c2VyIGJlZ2lucyBzd2lwaW5nIHRvIHRoZSBsZWZ0LFxuICAgKiBtb3ZpbmcgdG93YXJkcyBzZWxlY3RpbmcgaXRlbSA0LiBIYWxmd2F5IHRocm91Z2ggdGhpcyBvcGVyYXRpb24sIHRoZVxuICAgKiBmcmFjdGlvbmFsIHNlbGVjdGlvbiB2YWx1ZSBpcyAzLjUuXG4gICAqXG4gICAqIFRoaXMgdmFsdWUgcGVybWl0cyBjb21tdW5pY2F0aW9uIGJldHdlZW4gbWl4aW5zIGxpa2VcbiAgICogW1N3aXBlRGlyZWN0aW9uTWl4aW5dKC4vU3dpcGVEaXJlY3Rpb25NaXhpbi5tZCkgYW5kXG4gICAqIFtUcmFja3BhZERpcmVjdGlvbk1peGluXSguL1RyYWNrcGFkRGlyZWN0aW9uTWl4aW4ubWQpLCB3aGljaCBnZW5lcmF0ZVxuICAgKiBmcmFjdGlvbmFsIHNlbGVjdGlvbiB2YWx1ZXMsIGFuZCBtaXhpbnMgbGlrZVxuICAgKiBbU2VsZWN0aW9uQW5pbWF0aW9uTWl4aW5dKC4vU2VsZWN0aW9uQW5pbWF0aW9uTWl4aW4ubWQpLCB3aGljaCBjYW4gcmVuZGVyXG4gICAqIHNlbGVjdGlvbiBhdCBhIGZyYWN0aW9uYWwgdmFsdWUuXG4gICAqL1xuICBjbGFzcyBGcmFjdGlvbmFsU2VsZWN0aW9uIGV4dGVuZHMgYmFzZSB7XG5cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgIGlmIChzdXBlci5jb25uZWN0ZWRDYWxsYmFjaykgeyBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpOyB9XG4gICAgICB0aGlzLnNlbGVjdGVkRnJhY3Rpb24gPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZnJhY3Rpb25hbCB2YWx1ZSBpbmRpY2F0aW5nIGhvdyBmYXIgdGhlIHVzZXIgaGFzIGN1cnJlbnRseSBhZHZhbmNlZCB0b1xuICAgICAqIHRoZSBuZXh0L3ByZXZpb3VzIGl0ZW0uIEUuZy4sIGEgYHNlbGVjdGVkRnJhY3Rpb25gIG9mIDMuNSBpbmRpY2F0ZXMgdGhlXG4gICAgICogdXNlciBpcyBoYWxmd2F5IGJldHdlZW4gaXRlbXMgMyBhbmQgNC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGVkRnJhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpc1tzZWxlY3RlZEZyYWN0aW9uU3ltYm9sXTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGVkRnJhY3Rpb24odmFsdWUpIHtcbiAgICAgIHRoaXNbc2VsZWN0ZWRGcmFjdGlvblN5bWJvbF0gPSB2YWx1ZTtcbiAgICAgIGlmICgnc2VsZWN0ZWRGcmFjdGlvbicgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIuc2VsZWN0ZWRGcmFjdGlvbiA9IHZhbHVlOyB9XG4gICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VsZWN0ZWQtZnJhY3Rpb24tY2hhbmdlZCcpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBGcmFjdGlvbmFsU2VsZWN0aW9uO1xufVxuXG5cbm1peGluLmhlbHBlcnMgPSB7XG5cbiAgLypcbiAgICogRGFtcGVuIGEgc2VsZWN0aW9uIHRoYXQgZ29lcyBwYXN0IHRoZSBiZWdpbm5pbmcgb3IgZW5kIG9mIGEgbGlzdC4gVGhpcyBpc1xuICAgKiBnZW5lcmFsbHkgdXNlZCB0byBwcm9kdWNlIGEgdmlzdWFsIGVmZmVjdCBvZiB0ZW5zaW9uIGFzIHRoZSB1c2VyIHRyaWVzIHRvXG4gICAqIGdvIGZ1cnRoZXIgaW4gYSBkaXJlY3Rpb24gdGhhdCBoYXMgbm8gbW9yZSBpdGVtcy5cbiAgICpcbiAgICogRXhhbXBsZTogc3VwcG9zZSBgaXRlbUNvdW50YCBpcyA1LCBpbmRpY2F0aW5nIGEgbGlzdCBvZiA1IGl0ZW1zLiBUaGUgaW5kZXggb2ZcbiAgICogdGhlIGxhc3QgaXRlbSBpcyA0LiBJZiB0aGUgYHNlbGVjdGlvbmAgcGFyYW1ldGVyIGlzIDQuNSwgdGhlIHVzZXIgaXMgdHJ5aW5nXG4gICAqIHRvIGdvIHBhc3QgdGhpcyBsYXN0IGl0ZW0uIFdoZW4gYSBkYW1waW5nIGZ1bmN0aW9uIGlzIGFwcGxpZWQsIHRoZSByZXN1bHRpbmdcbiAgICogdmFsdWUgd2lsbCBiZSBsZXNzIHRoYW4gNC41ICh0aGUgYWN0dWFsIHZhbHVlIHdpbGwgYmUgNC4yNSkuIFdoZW4gdGhpc1xuICAgKiBzZWxlY3Rpb24gc3RhdGUgaXMgcmVuZGVyZWQsIHRoZSB1c2VyIHdpbGwgc2VlIHRoYXQsIGVhY2ggdW5pdCBkaXN0YW5jZSB0aGVcbiAgICogZHJhZyB0cmF2ZWxzIGhhcyBsZXNzIGFuZCBsZXNzIHZpc2libGUgZWZmZWN0LiBUaGlzIGlzIHBlcmNlaXZlZCBhcyB0ZW5zaW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VsZWN0aW9uIC0gQSByZWFsIG51bWJlciBpbmRpY2F0aW5nIGEgc2VsZWN0aW9uIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpdGVtQ291bnQgLSBBbiBpbnRlZ2VyIGZvciB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBsaXN0XG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IEEgcmVhbCBudW1iZXIgcmVwcmVzZW50aW5nIHRoZSBkYW1wZWQgc2VsZWN0aW9uIHZhbHVlLlxuICAgKi9cbiAgZGFtcGVkU2VsZWN0aW9uKHNlbGVjdGlvbiwgaXRlbUNvdW50KSB7XG4gICAgY29uc3QgYm91bmQgPSBpdGVtQ291bnQgLSAxO1xuICAgIGxldCBkYW1wZWQ7XG4gICAgaWYgKHNlbGVjdGlvbiA8IDApIHtcbiAgICAgIC8vIFRyeWluZyB0byBnbyBwYXN0IGJlZ2lubmluZyBvZiBsaXN0LiBBcHBseSB0ZW5zaW9uIGZyb20gdGhlIGxlZnQgZWRnZS5cbiAgICAgIGRhbXBlZCA9IC1taXhpbi5oZWxwZXJzLmRhbXBpbmcoLXNlbGVjdGlvbik7XG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb24gPj0gYm91bmQpIHtcbiAgICAgIC8vIFRyeWluZyB0byBnbyBwYXN0IGVuZCBvZiBsaXN0LiBBcHBseSB0ZW5zaW9uIGZyb20gdGhlIHJpZ2h0IGVkZ2UuXG4gICAgICBkYW1wZWQgPSBib3VuZCArIG1peGluLmhlbHBlcnMuZGFtcGluZyhzZWxlY3Rpb24gLSBib3VuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIGRhbXBpbmcgcmVxdWlyZWQuXG4gICAgICBkYW1wZWQgPSBzZWxlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBkYW1wZWQ7XG4gIH0sXG5cbiAgLypcbiAgICogQ2FsY3VsYXRlIGRhbXBpbmcgYXMgYSBmdW5jdGlvbiBvZiB0aGUgZGlzdGFuY2UgcGFzdCB0aGUgbWluaW11bS9tYXhpbXVtXG4gICAqIHZhbHVlcy5cbiAgICpcbiAgICogV2Ugd2FudCB0byBhc3ltcHRvdGljYWxseSBhcHByb2FjaCBhbiBhYnNvbHV0ZSBtaW5pbXVtIG9mIDEgdW5pdFxuICAgKiBiZWxvdy9hYm92ZSB0aGUgYWN0dWFsIG1pbmltdW0vbWF4aW11bS4gVGhpcyByZXF1aXJlcyBjYWxjdWxhdGluZyBhXG4gICAqIGh5cGVyYm9saWMgZnVuY3Rpb24uXG4gICAqXG4gICAqIFNlZSBodHRwOi8vd3d3LndvbGZyYW1hbHBoYS5jb20vaW5wdXQvP2k9eSslM0QrLTElMkYlMjh4JTJCMSUyOSslMkIrMVxuICAgKiBmb3IgdGhlIG9uZSB3ZSB1c2UuIFRoZSBvbmx5IHBvcnRpb24gb2YgdGhhdCBmdW5jdGlvbiB3ZSBjYXJlIGFib3V0IGlzIHdoZW5cbiAgICogeCBpcyB6ZXJvIG9yIGdyZWF0ZXIuIEFuIGltcG9ydGFudCBjb25zaWRlcmF0aW9uIGlzIHRoYXQgdGhlIGN1cnZlIGJlXG4gICAqIHRhbmdlbnQgdG8gdGhlIGRpYWdvbmFsIGxpbmUgeD15IGF0ICgwLCAwKS4gVGhpcyBlbnN1cmVzIHNtb290aCBjb250aW51aXR5XG4gICAqIHdpdGggdGhlIG5vcm1hbCBkcmFnIGJlaGF2aW9yLCBpbiB3aGljaCB0aGUgdmlzaWJsZSBzbGlkaW5nIGlzIGxpbmVhciB3aXRoXG4gICAqIHRoZSBkaXN0YW5jZSB0aGUgdG91Y2hwb2ludCBoYXMgYmVlbiBkcmFnZ2VkLlxuICAgKi9cbiAgZGFtcGluZyh4KSB7XG4gICAgY29uc3QgeSA9ICgtMSAvICh4ICsgMSkpICsgMTtcbiAgICByZXR1cm4geTtcbiAgfSxcblxuICAvKlxuICAgKiBSZXR1cm4gdGhlIGN1cnJlbnQgZnJhY3Rpb25hbCBzZWxlY3Rpb24gdmFsdWUgZm9yIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBUaGlzIHNpbXBseSBhZGRzIHRoZSBlbGVtZW50J3MgYHNlbGVjdGVkSW5kZXhgIGFuZCBgc2VsZWN0ZWRGcmFjdGlvbmBcbiAgICogcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIEFuIGVsZW1lbnQgdGhhdCBzdXBwb3J0cyBzZWxlY3Rpb25cbiAgICovXG4gIGVsZW1lbnRTZWxlY3Rpb24oZWxlbWVudCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBlbGVtZW50LnNlbGVjdGVkSW5kZXg7XG4gICAgaWYgKHNlbGVjdGVkSW5kZXggPCAwKSB7XG4gICAgICAvLyBObyBzZWxlY3Rpb25cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2VsZWN0ZWRGcmFjdGlvbiA9IGVsZW1lbnQuc2VsZWN0ZWRGcmFjdGlvbiB8fCAwO1xuICAgIHJldHVybiBzZWxlY3RlZEluZGV4ICsgc2VsZWN0ZWRGcmFjdGlvbjtcbiAgfSxcblxuICAvKlxuICAgKiBCcmVha3MgYSBmcmFjdGlvbmFsIHNlbGVjdGlvbiBpbnRvIGl0cyBpbnRlZ2VyIGFuZCBmcmFjdGlvbmFsIHBhcnRzLlxuICAgKlxuICAgKiBFeGFtcGxlOiBpZiBwYXNzZWQgMy41LCB0aGlzIHJldHVybnMgeyBpbmRleDogMywgZnJhY3Rpb246IDUgfS5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlbGVjdGlvbiDigJPCoEEgcmVhbCBudW1iZXIgcmVwcmVzZW50aW5nIGEgc2VsZWN0aW9uIHBvaW50XG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gQW4gb2JqZWN0IHdpdGggYW4gYGluZGV4YCBwcm9wZXJ0eSBob2xkaW5nIHRoZVxuICAgKiBzZWxlY3Rpb24ncyBpbnRlZ2VyIGNvbXBvbmVudCwgYW5kIGEgYGZyYWN0aW9uYCBwcm9wZXJ0eSBob2xkaW5nIHRoZVxuICAgKiBzZWxlY3Rpb24ncyBmcmFjdGlvbmFsIGNvbXBvbmVudC5cbiAgICovXG4gIHNlbGVjdGlvblBhcnRzKHNlbGVjdGlvbikge1xuICAgIC8vIFN0dXBpZCBJRSBkb2Vzbid0IGhhdmUgTWF0aC50cnVuYy5cbiAgICAvLyBjb25zdCBpbmRleCA9IE1hdGgudHJ1bmMoc2VsZWN0aW9uKTtcbiAgICBjb25zdCBpbmRleCA9IHNlbGVjdGlvbiA8IDAgPyBNYXRoLmNlaWwoc2VsZWN0aW9uKSA6IE1hdGguZmxvb3Ioc2VsZWN0aW9uKTtcbiAgICBjb25zdCBmcmFjdGlvbiA9IHNlbGVjdGlvbiAtIGluZGV4O1xuICAgIHJldHVybiB7IGluZGV4LCBmcmFjdGlvbiB9O1xuICB9LFxuXG4gIC8qXG4gICAqIFJldHVybnMgYSBmcmFjdGlvbmFsIHNlbGVjdGlvbiBwb2ludCBhZnRlciBhY2NvdW50aW5nIGZvciB3cmFwcGluZywgZW5zdXJpbmdcbiAgICogdGhhdCB0aGUgaW50ZWdlciBwb3J0aW9uIG9mIHRoZSBzZWxlY3Rpb24gc3RheXMgYmV0d2VlbiAwIGFuZCBgaXRlbUNvdW50YC0xLlxuICAgKiBUaGF0IGlzLCB0aGUgaW50ZWdlciBwb3J0aW9uIHdpbGwgYWx3YXlzIGJlIGEgdmFsaWQgaW5kZXggaW50byB0aGUgbGlzdC5cbiAgICpcbiAgICogRXhhbXBsZSBvZiB3cmFwcGluZyBwYXN0IHRoZSBlbmQgb2YgdGhlIGxpc3Q6IGlmIGBzZWxlY3Rpb25gIGlzIDUuNSBhbmRcbiAgICogYGl0ZW1Db3VudGAgaXMgNSwgdGhpcyByZXR1cm5zIDAuNS4gRXhhbXBsZSBvZiB3cmFwcGluZyBwYXN0IHRoZSBiZWdpbm5pbmcgb2ZcbiAgICogdGhlIGxpc3Q6IGlmIGBzZWxlY3Rpb25gIGlzIDAuNSBhbmQgYGl0ZW1Db3VudGAgaXMgNSwgdGhpcyByZXR1cm5zIDQuNS5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlbGVjdGlvbiAtIEEgcmVhbCBudW1iZXIgcmVwcmVzZW50aW5nIGEgc2VsZWN0aW9uIHBvaW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpdGVtQ291bnQgLSBUaGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBsaXN0XG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHJlc3VsdCBvZiB3cmFwcGluZyB0aGUgc2VsZWN0aW9uIHBvaW50XG4gICAqL1xuICB3cmFwcGVkU2VsZWN0aW9uKHNlbGVjdGlvbiwgaXRlbUNvdW50KSB7XG4gICAgLy8gSGFuZGxlcyBwb3NzaWJpbGl0eSBvZiBuZWdhdGl2ZSBtb2QuXG4gICAgLy8gU2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE4NjE4MjUwLzc2NDcyXG4gICAgcmV0dXJuICgoc2VsZWN0aW9uICUgaXRlbUNvdW50KSArIGl0ZW1Db3VudCkgJSBpdGVtQ291bnQ7XG4gIH0sXG5cbiAgLypcbiAgICogUmV0dXJuIHRoZSBwYXJ0cyBvZiBhIHNlbGVjdGlvbiwgZmlyc3Qgd3JhcHBpbmcgaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gc2VsZWN0aW9uIOKAkyBBIHJlYWwgbnVtYmVyIHJlcHJlc2VudGluZyBhIHNlbGVjdGlvbiBwb2ludFxuICAgKiBAcGFyYW0ge251bWJlcn0gaXRlbUNvdW50IC0gVGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgbGlzdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdyYXAg4oCTIFRydWUgaWYgdGhlIHNlbGVjdGlvbiBzaG91bGQgd3JhcCB0byBzdGF5IHdpdGhpbiB0aGVcbiAgICogbGlzdFxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSDigJMgVGhlIHBhcnRzIG9mIHRoZSBzZWxlY3Rpb24sIHVzaW5nIHRoZSBzYW1lIGZvcm1hdCBhc1xuICAgKiBgc2VsZWN0aW9uUGFydHNgLlxuICAgKi9cbiAgd3JhcHBlZFNlbGVjdGlvblBhcnRzKHNlbGVjdGlvbiwgaXRlbUNvdW50LCB3cmFwKSB7XG4gICAgaWYgKHdyYXApIHtcbiAgICAgIHNlbGVjdGlvbiA9IG1peGluLmhlbHBlcnMud3JhcHBlZFNlbGVjdGlvbihzZWxlY3Rpb24sIGl0ZW1Db3VudCk7XG4gICAgfVxuICAgIHJldHVybiBtaXhpbi5oZWxwZXJzLnNlbGVjdGlvblBhcnRzKHNlbGVjdGlvbik7XG4gIH1cblxufTtcbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuaW1wb3J0IEZyYWN0aW9uYWxTZWxlY3Rpb25NaXhpbiBmcm9tICcuL0ZyYWN0aW9uYWxTZWxlY3Rpb25NaXhpbic7XG5pbXBvcnQgc3ltYm9scyBmcm9tICcuL3N5bWJvbHMnO1xuXG5cbi8vIFN5bWJvbHMgZm9yIHByaXZhdGUgZGF0YSBtZW1iZXJzIG9uIGFuIGVsZW1lbnQuXG5jb25zdCBhbmltYXRpb25TeW1ib2wgPSBjcmVhdGVTeW1ib2woJ2FuaW1hdGlvbicpO1xuY29uc3QgZHJhZ2dpbmdTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ2RyYWdnaW5nJyk7XG5jb25zdCBsYXN0QW5pbWF0aW9uU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdsYXN0QW5pbWF0aW9uJyk7XG5jb25zdCBwbGF5aW5nQW5pbWF0aW9uU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdhbmltYXRpbmdTZWxlY3Rpb24nKTtcbmNvbnN0IHByZXZpb3VzU2VsZWN0aW9uU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdwcmV2aW91c1NlbGVjdGlvbicpO1xuY29uc3Qgc2VsZWN0aW9uQW5pbWF0aW9uRHVyYXRpb25TeW1ib2wgPSBjcmVhdGVTeW1ib2woJ3NlbGVjdGlvbkFuaW1hdGlvbkR1cmF0aW9uJyk7XG5jb25zdCBzZWxlY3Rpb25BbmltYXRpb25FZmZlY3RTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ3NlbGVjdGlvbkFuaW1hdGlvbkVmZmVjdCcpO1xuY29uc3Qgc2VsZWN0aW9uQW5pbWF0aW9uS2V5ZnJhbWVzU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdzZWxlY3Rpb25BbmltYXRpb25LZXlmcmFtZXMnKTtcbmNvbnN0IHJlc2V0QW5pbWF0aW9uc09uTmV4dFJlbmRlclN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgncmVzZXRBbmltYXRpb25zT25OZXh0UmVuZGVyJyk7XG5cblxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBTZWxlY3Rpb25BbmltYXRpb24uICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtaXhpbihiYXNlKSB7XG5cbiAgLyoqXG4gICAqIE1peGluIHdoaWNoIHVzZXMgYW5pbWF0aW9uIHRvIHNob3cgdHJhbnNpdGlvbnMgYmV0d2VlbiBzZWxlY3Rpb24gc3RhdGVzLlxuICAgKlxuICAgKiBUaGlzIG1peGluIGNhbiBiZSB1c2VkIGJ5IGNvbXBvbmVudHMgdGhhdCB3YW50IHRvIHByb3ZpZGUgdmlzaWJsZVxuICAgKiBhbmltYXRpb25zIHdoZW4gY2hhbmdpbmcgdGhlIHNlbGVjdGlvbi4gRm9yIGV4YW1wbGUsIGEgY2Fyb3VzZWwgY29tcG9uZW50XG4gICAqIG1heSB3YW50IHRvIGRlZmluZSBhIHNsaWRpbmcgYW5pbWF0aW9uIGVmZmVjdCBzaG93biB3aGVuIG1vdmluZyBiZXR3ZWVuXG4gICAqIGl0ZW1zLlxuICAgKlxuICAgKiBUaGUgYW5pbWF0aW9uIGlzIGRlZmluZWQgYnkgYSBgc2VsZWN0aW9uQW5pbWF0aW9uS2V5ZnJhbWVzYCBwcm9wZXJ0eTsgc2VlXG4gICAqIHRoYXQgcHJvcGVydHkgZm9yIGRldGFpbHMgb24gaG93IHRvIGRlZmluZSB0aGVzZSBrZXlmcmFtZXMuIFRoaXMgYW5pbWF0aW9uXG4gICAqIHdpbGwgYmUgdXNlZCBpbiB0d28gd2F5cy4gRmlyc3QsIHdoZW4gbW92aW5nIHN0cmljdGx5IGJldHdlZW4gaXRlbXMsIHRoZVxuICAgKiBhbmltYXRpb24gd2lsbCBwbGF5IHNtb290aGx5IHRvIHNob3cgdGhlIHNlbGVjdGlvbiBjaGFuZ2luZy4gU2Vjb25kLCB0aGVcbiAgICogYW5pbWF0aW9uIGNhbiBiZSB1c2VkIHRvIHJlbmRlciB0aGUgc2VsZWN0aW9uIGF0IGEgZml4ZWQgcG9pbnQgaW4gdGhlXG4gICAqIHRyYW5zaXRpb24gYmV0d2VlbiBzdGF0ZXMuIEUuZy4sIGlmIHRoZSB1c2VyIHBhdXNlcyBoYWxmd2F5IHRocm91Z2hcbiAgICogZHJhZ2dpbmcgYW4gZWxlbWVudCB1c2luZyBbU3dpcGVEaXJlY3Rpb25NaXhpbl0oU3dpcGVEaXJlY3Rpb25NaXhpbi5tZClcbiAgICogb3IgW1RyYWNrcGFkRGlyZWN0aW9uTWl4aW5dKFRyYWNrcGFkRGlyZWN0aW9uTWl4aW4ubWQpcywgdGhlbiB0aGUgc2VsZWN0aW9uXG4gICAqIGFuaW1hdGlvbiB3aWxsIGJlIHNob3duIGF0IHRoZSBwb2ludCBleGFjdGx5IGhhbGZ3YXkgdGhyb3VnaC5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBleHBlY3RzIGEgY29tcG9uZW50IHRvIHByb3ZpZGUgYW4gYGl0ZW1zYCBhcnJheSBvZiBhbGwgZWxlbWVudHNcbiAgICogaW4gdGhlIGxpc3QsIHdoaWNoIGNhbiBiZSBwcm92aWRlZCB2aWFcbiAgICogW0NvbnRlbnRJdGVtc01peGluXShDb250ZW50SXRlbXNNaXhpbi5tZCkuIFRoaXMgbWl4aW4gYWxzbyBleHBlY3RzXG4gICAqIGBzZWxlY3RlZEluZGV4YCBhbmQgYHNlbGVjdGVkSXRlbWAgcHJvcGVydGllcywgd2hpY2ggY2FuIGJlIHByb3ZpZGVkIHZpYVxuICAgKiBbU2luZ2xlU2VsZWN0aW9uTWl4aW5dKFNpbmdsZVNlbGVjdGlvbk1peGluLm1kKS5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBzdXBwb3J0cyBhIGBzZWxlY3Rpb25XcmFwc2AgcHJvcGVydHkuIFdoZW4gdHJ1ZSwgdGhlIHVzZXIgY2FuXG4gICAqIG5hdmlnYXRlIGZvcndhcmQgZnJvbSB0aGUgbGFzdCBpdGVtIGluIHRoZSBsaXN0IGFuZCB3cmFwIGFyb3VuZCB0byB0aGVcbiAgICogZmlyc3QgaXRlbSwgb3IgbmF2aWdhdGUgYmFja3dhcmQgZnJvbSB0aGUgZmlyc3QgaXRlbSBhbmQgd3JhcCBhcm91bmQgdG8gdGhlXG4gICAqIGxhc3QgaXRlbS5cbiAgICpcbiAgICogVGhpcyBtaXhpbiB1c2VzIHRoZSBXZWIgQW5pbWF0aW9ucyBBUEkuIEZvciB1c2Ugb24gYnJvd3NlcnMgd2hpY2hcbiAgICogZG8gbm90IHN1cHBvcnQgdGhhdCBBUEkgbmF0aXZlbHksIHlvdSB3aWxsIG5lZWQgdG8gbG9hZCB0aGVcbiAgICogW1dlYiBBbmltYXRpb25zIHBvbHlmaWxsXShodHRwczovL2dpdGh1Yi5jb20vd2ViLWFuaW1hdGlvbnMvd2ViLWFuaW1hdGlvbnMtanMpLlxuICAgKi9cbiAgY2xhc3MgU2VsZWN0aW9uQW5pbWF0aW9uIGV4dGVuZHMgYmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIC8vIFNldCBkZWZhdWx0cy5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3Rpb25BbmltYXRpb25EdXJhdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25BbmltYXRpb25EdXJhdGlvbiA9IHRoaXNbc3ltYm9scy5kZWZhdWx0c10uc2VsZWN0aW9uQW5pbWF0aW9uRHVyYXRpb247XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRoaXMuc2VsZWN0aW9uQW5pbWF0aW9uRWZmZWN0ID09PSAndW5kZWZpbmVkJyAmJiB0aGlzLnNlbGVjdGlvbkFuaW1hdGlvbktleWZyYW1lcyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQW5pbWF0aW9uRWZmZWN0ID0gdGhpc1tzeW1ib2xzLmRlZmF1bHRzXS5zZWxlY3Rpb25BbmltYXRpb25FZmZlY3Q7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbc3ltYm9scy5kcmFnZ2luZ10gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgW3N5bWJvbHMuZGVmYXVsdHNdKCkge1xuICAgICAgY29uc3QgZGVmYXVsdHMgPSBzdXBlcltzeW1ib2xzLmRlZmF1bHRzXSB8fCB7fTtcbiAgICAgIGRlZmF1bHRzLnNlbGVjdGlvbkFuaW1hdGlvbkR1cmF0aW9uID0gMjUwO1xuICAgICAgZGVmYXVsdHMuc2VsZWN0aW9uQW5pbWF0aW9uRWZmZWN0ID0gJ3NsaWRlJztcbiAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFByb3ZpZGUgYmFja2luZyBmb3IgdGhlIGRyYWdnaW5nIHByb3BlcnR5LlxuICAgICAqIEFsc28sIHdoZW4gYSBkcmFnIGJlZ2lucywgcmVzZXQgdGhlIGFuaW1hdGlvbnMuXG4gICAgICovXG4gICAgZ2V0IFtzeW1ib2xzLmRyYWdnaW5nXSgpIHtcbiAgICAgIHJldHVybiB0aGlzW2RyYWdnaW5nU3ltYm9sXTtcbiAgICB9XG4gICAgc2V0IFtzeW1ib2xzLmRyYWdnaW5nXSh2YWx1ZSkge1xuICAgICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHRoaXNbc3ltYm9scy5kcmFnZ2luZ107XG4gICAgICB0aGlzW2RyYWdnaW5nU3ltYm9sXSA9IHZhbHVlO1xuICAgICAgaWYgKHN5bWJvbHMuZHJhZ2dpbmcgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXJbc3ltYm9scy5kcmFnZ2luZ10gPSB2YWx1ZTsgfVxuICAgICAgaWYgKHZhbHVlICYmICFwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgIC8vIEhhdmUgYmVndW4gYSBkcmFnLlxuICAgICAgICB0aGlzW3Jlc2V0QW5pbWF0aW9uc09uTmV4dFJlbmRlclN5bWJvbF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIFtzeW1ib2xzLml0ZW1BZGRlZF0oaXRlbSkge1xuICAgICAgLy8gV2UgbWFyayBuZXcgaXRlbXMgaW4gdGhlIGxpc3QgYXMgZXhwbGljaXRseSB2aXNpYmxlIHRvIEFSSUEuIE90aGVyd2lzZSxcbiAgICAgIC8vIHdoZW4gYW4gaXRlbSBpc24ndCB2aXNpYmxlIG9uIHRoZSBzY3JlZW4sIEFSSUEgd2lsbCBhc3N1bWUgdGhlIGl0ZW0gaXNcbiAgICAgIC8vIG9mIG5vIGludGVyZXN0IHRvIHRoZSB1c2VyLCBhbmQgbGVhdmUgaXQgb3V0IG9mIHRoZSBhY2Nlc3NpYmlsaXR5IHRyZWUuXG4gICAgICAvLyBJZiB0aGUgbGlzdCBjb250YWlucyAxMCBpdGVtcywgYnV0IG9ubHkgMyBhcmUgdmlzaWJsZSwgYSBzY3JlZW4gcmVhZGVyXG4gICAgICAvLyBtaWdodCB0aGVuIGFubm91bmNlIHRoZSBsaXN0IG9ubHkgaGFzIDMgaXRlbXMuIFRvIGVuc3VyZSB0aGF0IHNjcmVlblxuICAgICAgLy8gcmVhZGVycyBhbmQgb3RoZXIgYXNzaXN0aXZlIHRlY2hub2xvZ2llcyBhbm5vdW5jZSB0aGUgY29ycmVjdCB0b3RhbFxuICAgICAgLy8gbnVtYmVyIG9mIGl0ZW1zLCB3ZSBleHBsaWNpdGx5IG1hcmsgYWxsIGl0ZW1zIGFzIG5vdCBoaWRkZW4uIFRoaXMgd2lsbFxuICAgICAgLy8gZXhwb3NlIHRoZW0gYWxsIGluIHRoZSBhY2Nlc3NpYmlsaXR5IHRyZWUsIGV2ZW4gdGhlIGl0ZW1zIHdoaWNoIGFyZVxuICAgICAgLy8gY3VycmVudGx5IG5vdCByZW5kZXJlZC5cbiAgICAgIC8vXG4gICAgICAvLyBUT0RPOiBHZW5lcmFsbHkgc3BlYWtpbmcsIHRoaXMgZW50aXJlIG1peGluIGFzc3VtZXMgdGhhdCB0aGUgdXNlciBjYW5cbiAgICAgIC8vIG5hdmlnYXRlIHRocm91Z2ggYWxsIGl0ZW1zIGluIGEgbGlzdC4gQnV0IGFuIGFwcCBjb3VsZCBzdHlsZSBhbiBpdGVtIGFzXG4gICAgICAvLyBkaXNwbGF5Om5vbmUgb3IgdmlzaWJpbGl0eTpoaWRkZW4gYmVjYXVzZSB0aGUgdXNlciBpcyBub3QgYWxsb3dlZCB0b1xuICAgICAgLy8gaW50ZXJhY3Qgd2l0aCB0aGF0IGl0ZW0gYXQgdGhlIG1vbWVudC4gU3VwcG9ydCBmb3IgdGhpcyBzY2VuYXJpbyBzaG91bGRcbiAgICAgIC8vIGJlIGFkZGVkLiBUaGlzIHdvdWxkIGVudGFpbCBjaGFuZ2luZyBhbGwgbG9jYXRpb25zIHdoZXJlIGEgbWl4aW5cbiAgICAgIC8vIGZ1bmN0aW9uIGlzIGNvdW50aW5nIGl0ZW1zLCBpdGVyYXRpbmcgb3ZlciB0aGUgKHZpc2libGUpIGl0ZW1zLCBhbmRcbiAgICAgIC8vIHNob3dpbmcgb3IgaGlkaW5nIGl0ZW1zLiBBbW9uZyBvdGhlciB0aGluZ3MsIHRoZSBjb2RlIGJlbG93IHRvIG1ha2VcbiAgICAgIC8vIGl0ZW1zIHZpc2libGUgdG8gQVJJQSB3b3VsZCBuZWVkIHRvIGRpc2NyaW1pbmF0ZSBiZXR3ZWVuIGl0ZW1zIHdoaWNoXG4gICAgICAvLyBhcmUgaW52aXNpYmxlIGJlY2F1c2Ugb2YgYW5pbWF0aW9uIHN0YXRlLCBvciBpbnZpc2libGUgYmVjYXVzZSB0aGUgdXNlclxuICAgICAgLy8gc2hvdWxkbid0IGludGVyYWN0IHdpdGggdGhlbS5cbiAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBpdGVtc0NoYW5nZWQoKSB7XG4gICAgICBpZiAoc3VwZXIuaXRlbXNDaGFuZ2VkKSB7IHN1cGVyLml0ZW1zQ2hhbmdlZCgpOyB9XG5cbiAgICAgIHJlc2V0QW5pbWF0aW9ucyh0aGlzKTtcblxuICAgICAgLy8gVE9ETzogQWxzbyByZXNldCBvdXIgbm90aW9uIG9mIHRoZSBsYXN0IHJlbmRlcmVkIHNlbGVjdGlvbj8gVGhpcyBjb21lc1xuICAgICAgLy8gdXAgd2hlbiBhIERPTSByZW1vdmFsIGNhdXNlcyB0aGUgc2VsZWN0ZWQgaXRlbSB0byBjaGFuZ2UgcG9zaXRpb24uXG4gICAgICAvLyB0aGlzW3ByZXZpb3VzU2VsZWN0aW9uU3ltYm9sXSA9IG51bGw7XG5cbiAgICAgIHJlbmRlclNlbGVjdGlvbih0aGlzKTtcbiAgICB9XG5cbiAgICByZXNldEFuaW1hdGlvbnMoKSB7XG4gICAgICByZXNldEFuaW1hdGlvbnModGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBmcmFjdGlvbmFsIHZhbHVlIGluZGljYXRpbmcgaG93IGZhciB0aGUgdXNlciBoYXMgY3VycmVudGx5IGFkdmFuY2VkIHRvXG4gICAgICogdGhlIG5leHQvcHJldmlvdXMgaXRlbS4gRS5nLiwgYSBgc2VsZWN0ZWRGcmFjdGlvbmAgb2YgMy41IGluZGljYXRlcyB0aGVcbiAgICAgKiB1c2VyIGlzIGhhbGZ3YXkgYmV0d2VlbiBpdGVtcyAzIGFuZCA0LlxuICAgICAqXG4gICAgICogRm9yIG1vcmUgZGV0YWlscywgc2VlIFtGcmFjdGlvbmFsU2VsZWN0aW9uTWl4aW5dKEZyYWN0aW9uYWxTZWxlY3Rpb25NaXhpbi5tZClcbiAgICAgKiBtaXhpbi5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGVkRnJhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2VsZWN0ZWRGcmFjdGlvbiB8fCAwO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0ZWRGcmFjdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCdzZWxlY3RlZEZyYWN0aW9uJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3RlZEZyYWN0aW9uID0gdmFsdWU7IH1cbiAgICAgIHJlbmRlclNlbGVjdGlvbih0aGlzLCB0aGlzLnNlbGVjdGVkSW5kZXgsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXQgc2VsZWN0ZWRJbmRleCgpIHtcbiAgICAgIHJldHVybiBzdXBlci5zZWxlY3RlZEluZGV4O1xuICAgIH1cbiAgICBzZXQgc2VsZWN0ZWRJbmRleChpbmRleCkge1xuICAgICAgaWYgKCdzZWxlY3RlZEluZGV4JyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3RlZEluZGV4ID0gaW5kZXg7IH1cbiAgICAgIHJlbmRlclNlbGVjdGlvbih0aGlzLCBpbmRleCwgMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGR1cmF0aW9uIG9mIGEgc2VsZWN0aW9uIGFuaW1hdGlvbiBpbiBtaWxsaXNlY29uZHMuXG4gICAgICpcbiAgICAgKiBUaGlzIG1lYXN1cmVzIHRoZSBhbW91bnQgb2YgdGltZSByZXF1aXJlZCBmb3IgYSBzZWxlY3Rpb24gYW5pbWF0aW9uIHRvXG4gICAgICogY29tcGxldGUuIFRoaXMgbnVtYmVyIHJlbWFpbnMgY29uc3RhbnQsIGV2ZW4gaWYgdGhlIG51bWJlciBvZiBpdGVtcyBiZWluZ1xuICAgICAqIGFuaW1hdGVkIGluY3JlYXNlcy5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDI1MCBtaWxsaXNlY29uZHMgKGEgcXVhcnRlciBhIHNlY29uZCkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDI1MFxuICAgICAqL1xuICAgIGdldCBzZWxlY3Rpb25BbmltYXRpb25EdXJhdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzW3NlbGVjdGlvbkFuaW1hdGlvbkR1cmF0aW9uU3ltYm9sXTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGlvbkFuaW1hdGlvbkR1cmF0aW9uKHZhbHVlKSB7XG4gICAgICB0aGlzW3NlbGVjdGlvbkFuaW1hdGlvbkR1cmF0aW9uU3ltYm9sXSA9IHZhbHVlO1xuICAgICAgaWYgKCdzZWxlY3Rpb25BbmltYXRpb25EdXJhdGlvbicgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIuc2VsZWN0aW9uQW5pbWF0aW9uRHVyYXRpb24gPSB2YWx1ZTsgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIGEgc3RhbmRhcmQgc2VsZWN0aW9uIGFuaW1hdGlvbiBlZmZlY3QuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIGEgc2hvcnRoYW5kIGZvciBzZXR0aW5nIHRoZSBgc2VsZWN0aW9uQW5pbWF0aW9uS2V5ZnJhbWVzYFxuICAgICAqIHByb3BlcnR5IHRvIHN0YW5kYXJkIGtleWZyYW1lcy4gU3VwcG9ydGVkIHN0cmluZyB2YWx1ZXM6XG4gICAgICpcbiAgICAgKiAqIFwiY3Jvc3NmYWRlXCJcbiAgICAgKiAqIFwicmV2ZWFsXCJcbiAgICAgKiAqIFwicmV2ZWFsV2l0aEZhZGVcIlxuICAgICAqICogXCJzaG93QWRqYWNlbnRcIlxuICAgICAqICogXCJzbGlkZVwiXG4gICAgICogKiBcInNsaWRlV2l0aEdhcFwiXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwic2xpZGVcIlxuICAgICAqL1xuICAgIGdldCBzZWxlY3Rpb25BbmltYXRpb25FZmZlY3QoKSB7XG4gICAgICByZXR1cm4gdGhpc1tzZWxlY3Rpb25BbmltYXRpb25FZmZlY3RTeW1ib2xdO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uQW5pbWF0aW9uRWZmZWN0KHZhbHVlKSB7XG4gICAgICB0aGlzW3NlbGVjdGlvbkFuaW1hdGlvbkVmZmVjdFN5bWJvbF0gPSB2YWx1ZTtcbiAgICAgIGlmICgnc2VsZWN0aW9uQW5pbWF0aW9uRWZmZWN0JyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3Rpb25BbmltYXRpb25FZmZlY3QgPSB2YWx1ZTsgfVxuICAgICAgdGhpcy5zZWxlY3Rpb25BbmltYXRpb25LZXlmcmFtZXMgPSBtaXhpbi5zdGFuZGFyZEVmZmVjdEtleWZyYW1lc1t2YWx1ZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGtleWZyYW1lcyB0aGF0IGRlZmluZSBhbiBhbmltYXRpb24gdGhhdCBwbGF5cyBmb3IgYW4gaXRlbSB3aGVuIG1vdmluZ1xuICAgICAqIGZvcndhcmQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAqXG4gICAgICogVGhpcyBpcyBhbiBhcnJheSBvZiBDU1MgcnVsZXMgdGhhdCB3aWxsIGJlIGFwcGxpZWQuIFRoZXNlIGFyZSB1c2VkIGFzXG4gICAgICogW2tleWZyYW1lc10oaHR0cDovL3czYy5naXRodWIuaW8vd2ViLWFuaW1hdGlvbnMvI2tleWZyYW1lcy1zZWN0aW9uKVxuICAgICAqIHRvIGFuaW1hdGUgdGhlIGl0ZW0gd2l0aCB0aGVcbiAgICAgKiBbV2ViIEFuaW1hdGlvbnMgQVBJXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvYW5pbWF0aW9uKS5cbiAgICAgKlxuICAgICAqIFRoZSBhbmltYXRpb24gcmVwcmVzZW50cyB0aGUgc3RhdGUgb2YgdGhlIG5leHQgaXRlbSBhcyBpdCBtb3ZlcyBmcm9tXG4gICAgICogY29tcGxldGVseSB1bnNlbGVjdGVkIChvZmZzdGFnZSwgdXN1YWxseSByaWdodCksIHRvIHNlbGVjdGVkIChjZW50ZXJcbiAgICAgKiBzdGFnZSksIHRvIGNvbXBsZXRlbHkgdW5zZWxlY3RlZCAob2Zmc3RhZ2UsIHVzdWFsbHkgbGVmdCkuIFRoZSBjZW50ZXIgdGltZVxuICAgICAqIG9mIHRoZSBhbmltYXRpb24gc2hvdWxkIGNvcnJlc3BvbmQgdG8gdGhlIGl0ZW0ncyBxdWlzY2VudCBzZWxlY3RlZCBzdGF0ZSxcbiAgICAgKiB0eXBpY2FsbHkgaW4gdGhlIGNlbnRlciBvZiB0aGUgc3RhZ2UgYW5kIGF0IHRoZSBpdGVtJ3MgbGFyZ2VzdCBzaXplLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgZm9yd2FyZCBhbmltYXRpb24gaXMgYSBzbW9vdGggc2xpZGUgYXQgZnVsbCBzaXplIGZyb20gcmlnaHQgdG9cbiAgICAgKiBsZWZ0LlxuICAgICAqXG4gICAgICogV2hlbiBtb3ZpbmcgdGhlIHNlbGVjdGlvbiBiYWNrd2FyZCwgdGhpcyBhbmltYXRpb24gaXMgcGxheWVkIGluIHJldmVyc2UuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Y3NzUnVsZXNbXX1cbiAgICAgKi9cbiAgICBnZXQgc2VsZWN0aW9uQW5pbWF0aW9uS2V5ZnJhbWVzKCkge1xuICAgICAgLy8gU3RhbmRhcmQgYW5pbWF0aW9uIHNsaWRlcyBsZWZ0L3JpZ2h0LCBrZWVwcyBhZGphY2VudCBpdGVtcyBvdXQgb2Ygdmlldy5cbiAgICAgIHJldHVybiB0aGlzW3NlbGVjdGlvbkFuaW1hdGlvbktleWZyYW1lc1N5bWJvbF07XG4gICAgfVxuICAgIHNldCBzZWxlY3Rpb25BbmltYXRpb25LZXlmcmFtZXModmFsdWUpIHtcbiAgICAgIHRoaXNbc2VsZWN0aW9uQW5pbWF0aW9uS2V5ZnJhbWVzU3ltYm9sXSA9IHZhbHVlO1xuICAgICAgaWYgKCdzZWxlY3Rpb25BbmltYXRpb25LZXlmcmFtZXMnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnNlbGVjdGlvbkFuaW1hdGlvbktleWZyYW1lcyA9IHZhbHVlOyB9XG4gICAgICByZXNldEFuaW1hdGlvbnModGhpcyk7XG4gICAgICByZW5kZXJTZWxlY3Rpb24odGhpcyk7XG4gICAgfVxuXG4gICAgZ2V0IHNlbGVjdGlvbldyYXBzKCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnNlbGVjdGlvbldyYXBzO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uV3JhcHModmFsdWUpIHtcbiAgICAgIGlmICgnc2VsZWN0aW9uV3JhcHMnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnNlbGVjdGlvbldyYXBzID0gdmFsdWU7IH1cbiAgICAgIHJlc2V0QW5pbWF0aW9ucyh0aGlzKTtcbiAgICAgIHJlbmRlclNlbGVjdGlvbih0aGlzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gU2VsZWN0aW9uQW5pbWF0aW9uO1xufVxuXG5cbi8vIFdlIGV4cG9zZSBoZWxwZXJzIG9uIHRoZSBtaXhpbiBmdW5jdGlvbiB0aGF0IHdlIHdhbnQgdG8gYmUgYWJsZSB0byB1bml0IHRlc3QuXG4vLyBTaW5jZSB0aGVzZSBhcmUgb24gdGhlIGZ1bmN0aW9uLCBub3Qgb24gdGhlIGNsYXNzIGVtaXR0ZWQgYnkgdGhlIGZ1bmN0aW9uLFxuLy8gdGhleSBkb24ndCBlbmQgdXAgZ2V0dGluZyBleHBvc2VkIG9uIGFjdHVhbCBlbGVtZW50IGluc3RhbmNlcy5cbm1peGluLmhlbHBlcnMgPSB7XG5cbiAgLypcbiAgICogQ2FsY3VsYXRlIHRoZSBhbmltYXRpb24gZnJhY3Rpb25zIGZvciBhbiBlbGVtZW50J3MgaXRlbXMgYXQgdGhlIGdpdmVuXG4gICAqIHNlbGVjdGlvbiBwb2ludC4gVGhpcyBpcyB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBlbGVtZW50J3Mgc2VsZWN0aW9uIHN0YXRlXG4gICAqIGluc3RhbnRhbmVvdXNseS5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBjb25zaWRlcnMgdGhlIHNlbGVjdGVkSW5kZXggcGFyYW1ldGVyLCB3aGljaCBjYW4gYmUgYSB3aG9sZVxuICAgKiBvciBmcmFjdGlvbmFsIG51bWJlciwgYW5kIGRldGVybWluZXMgd2hpY2ggaXRlbXMgd2lsbCBiZSB2aXNpYmxlIGF0IHRoYXRcbiAgICogaW5kZXguIFRoaXMgZnVuY3Rpb24gdGhlbiBjYWxjdWxhdGVzIGEgY29ycmVzcG9uZGluZyBhbmltYXRpb24gZnJhY3Rpb246IGFcbiAgICogbnVtYmVyIGJldHdlZW4gMCBhbmQgMSBpbmRpY2F0aW5nIGhvdyBmYXIgdGhyb3VnaCB0aGUgc2VsZWN0aW9uIGFuaW1hdGlvblxuICAgKiBhbiBpdGVtIHNob3VsZCBiZSBzaG93biwgb3IgbnVsbCBpZiB0aGUgaXRlbSBzaG91bGQgbm90IGJlIHZpc2libGUgYXQgdGhhdFxuICAgKiBzZWxlY3Rpb24gaW5kZXguIFRoZXNlIGZyYWN0aW9ucyBhcmUgcmV0dXJuZWQgYXMgYW4gYXJyYXksIHdoZXJlIHRoZVxuICAgKiBhbmltYXRpb24gZnJhY3Rpb24gYXQgcG9zaXRpb24gTiBjb3JyZXNwb25kcyB0byBob3cgaXRlbSBOIHNob3VsZCBiZSBzaG93bi5cbiAgICovXG4gIGFuaW1hdGlvbkZyYWN0aW9uc0ZvclNlbGVjdGlvbihlbGVtZW50LCBzZWxlY3Rpb24pIHtcblxuICAgIGNvbnN0IGl0ZW1zID0gZWxlbWVudC5pdGVtcztcbiAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbUNvdW50ID0gaXRlbXMubGVuZ3RoO1xuICAgIGNvbnN0IHNlbGVjdGlvbldyYXBzID0gZWxlbWVudC5zZWxlY3Rpb25XcmFwcztcblxuICAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW0sIGl0ZW1JbmRleCkgPT4ge1xuICAgICAgLy8gSG93IG1hbnkgc3RlcHMgZnJvbSB0aGUgc2VsZWN0aW9uIHBvaW50IHRvIHRoaXMgaXRlbT9cbiAgICAgIGNvbnN0IHN0ZXBzID0gc3RlcHNUb0luZGV4KGl0ZW1Db3VudCwgc2VsZWN0aW9uV3JhcHMsIHNlbGVjdGlvbiwgaXRlbUluZGV4KTtcbiAgICAgIC8vIFRvIGNvbnZlcnQgc3RlcHMgdG8gYW5pbWF0aW9uIGZyYWN0aW9uOlxuICAgICAgLy8gc3RlcHMgICAgICBhbmltYXRpb24gZnJhY3Rpb25cbiAgICAgIC8vICAxICAgICAgICAgMCAgICAgKHN0YWdlIHJpZ2h0KVxuICAgICAgLy8gIDAgICAgICAgICAwLjUgICAoY2VudGVyIHN0YWdlKVxuICAgICAgLy8gLTEgICAgICAgICAxICAgICAoc3RhZ2UgbGVmdClcbiAgICAgIGNvbnN0IGFuaW1hdGlvbkZyYWN0aW9uID0gKDEgLSBzdGVwcykgLyAyO1xuICAgICAgcmV0dXJuIChhbmltYXRpb25GcmFjdGlvbiA+PSAwICYmIGFuaW1hdGlvbkZyYWN0aW9uIDw9IDEpID9cbiAgICAgICAgYW5pbWF0aW9uRnJhY3Rpb24gOlxuICAgICAgICBudWxsOyAvLyBPdXRzaWRlIGFuaW1hdGlvbiByYW5nZVxuICAgIH0pO1xuICB9LFxuXG4gIC8qXG4gICAqIENhbGN1bGF0ZSB0aGUgYW5pbWF0aW9uIHRpbWluZ3MgdGhhdCBzaG91bGQgYmUgdXNlZCB0byBzbW9vdGhseSBhbmltYXRlIHRoZVxuICAgKiBlbGVtZW50J3MgaXRlbXMgZnJvbSBvbmUgc2VsZWN0aW9uIHN0YXRlIHRvIGFub3RoZXIuXG4gICAqXG4gICAqIFRoaXMgcmV0dXJucyBhbiBhcnJheSBvZiB0aW1pbmdzLCB3aGVyZSB0aGUgdGltaW5nIGF0IHBvc2l0aW9uIE4gc2hvdWxkIGJlXG4gICAqIHVzZWQgdG8gYW5pbWF0ZSBpdGVtIE4uIElmIGFuIGl0ZW0ncyB0aW1pbmcgaXMgbnVsbCwgdGhlbiB0aGF0IGl0ZW0gc2hvdWxkXG4gICAqIG5vdCB0YWtlIHBsYWNlIGluIHRoZSBhbmltYXRpb24sIGFuZCBzaG91bGQgYmUgaGlkZGVuIGluc3RlYWQuXG4gICAqL1xuICBlZmZlY3RUaW1pbmdzRm9yU2VsZWN0aW9uQW5pbWF0aW9uKGVsZW1lbnQsIGZyb21TZWxlY3Rpb24sIHRvU2VsZWN0aW9uKSB7XG5cbiAgICBjb25zdCBpdGVtcyA9IGVsZW1lbnQuaXRlbXM7XG4gICAgaWYgKCFpdGVtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpdGVtQ291bnQgPSBpdGVtcy5sZW5ndGg7XG4gICAgY29uc3Qgc2VsZWN0aW9uV3JhcHMgPSBlbGVtZW50LnNlbGVjdGlvbldyYXBzO1xuICAgIGNvbnN0IHRvSW5kZXggPSBGcmFjdGlvbmFsU2VsZWN0aW9uTWl4aW4uaGVscGVycy53cmFwcGVkU2VsZWN0aW9uUGFydHModG9TZWxlY3Rpb24sIGl0ZW1Db3VudCwgc2VsZWN0aW9uV3JhcHMpLmluZGV4O1xuICAgIGNvbnN0IHRvdGFsU3RlcHMgPSBzdGVwc1RvSW5kZXgoaXRlbUNvdW50LCBzZWxlY3Rpb25XcmFwcywgZnJvbVNlbGVjdGlvbiwgdG9TZWxlY3Rpb24pO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRvdGFsU3RlcHMgPj0gMCA/ICdub3JtYWwnOiAncmV2ZXJzZSc7XG4gICAgY29uc3QgZmlsbCA9ICdib3RoJztcbiAgICBjb25zdCB0b3RhbER1cmF0aW9uID0gZWxlbWVudC5zZWxlY3Rpb25BbmltYXRpb25EdXJhdGlvbjtcbiAgICBjb25zdCBzdGVwRHVyYXRpb24gPSB0b3RhbFN0ZXBzICE9PSAwID9cbiAgICAgIHRvdGFsRHVyYXRpb24gKiAyIC8gTWF0aC5jZWlsKE1hdGguYWJzKHRvdGFsU3RlcHMpKSA6XG4gICAgICAwOyAgLy8gTm8gc3RlcHMgcmVxdWlyZWQsIGFuaW1hdGlvbiB3aWxsIGJlIGluc3RhbnRlbm91cy5cblxuICAgIGNvbnN0IHRpbWluZ3MgPSBpdGVtcy5tYXAoKGl0ZW0sIGl0ZW1JbmRleCkgPT4ge1xuICAgICAgY29uc3Qgc3RlcHMgPSBzdGVwc1RvSW5kZXgoaXRlbUNvdW50LCBzZWxlY3Rpb25XcmFwcywgaXRlbUluZGV4LCB0b1NlbGVjdGlvbik7XG4gICAgICAvLyBJZiB3ZSBpbmNsdWRlIHRoaXMgaXRlbSBpbiB0aGUgc3RhZ2dlcmVkIHNlcXVlbmNlIG9mIGFuaW1hdGlvbnMgd2UncmVcbiAgICAgIC8vIGNyZWF0aW5nLCB3aGVyZSB3b3VsZCB0aGUgaXRlbSBhcHBlYXIgaW4gdGhlIHNlcXVlbmNlP1xuICAgICAgbGV0IHBvc2l0aW9uSW5TZXF1ZW5jZSA9IHRvdGFsU3RlcHMgLSBzdGVwcztcbiAgICAgIGlmICh0b3RhbFN0ZXBzIDwgMCkge1xuICAgICAgICBwb3NpdGlvbkluU2VxdWVuY2UgPSAtcG9zaXRpb25JblNlcXVlbmNlO1xuICAgICAgfVxuICAgICAgLy8gU28sIGlzIHRoaXMgaXRlbSByZWFsbHkgaW5jbHVkZWQgaW4gdGhlIHNlcXVlbmNlP1xuICAgICAgaWYgKE1hdGguY2VpbChwb3NpdGlvbkluU2VxdWVuY2UpID49IDAgJiYgcG9zaXRpb25JblNlcXVlbmNlIDw9IE1hdGguYWJzKHRvdGFsU3RlcHMpKSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCBkZWxheSBmb3IgZmlyc3QgaXRlbSB3aWxsIGJlIG5lZ2F0aXZlLiBUaGF0IHdpbGwgY2F1c2VcbiAgICAgICAgLy8gdGhlIGFuaW1hdGlvbiB0byBzdGFydCBoYWxmd2F5IHRocm91Z2gsIHdoaWNoIGlzIHdoYXQgd2Ugd2FudC5cbiAgICAgICAgY29uc3QgZGVsYXkgPSBzdGVwRHVyYXRpb24gKiAocG9zaXRpb25JblNlcXVlbmNlIC0gMSkvMjtcbiAgICAgICAgY29uc3QgZW5kRGVsYXkgPSBpdGVtSW5kZXggPT09IHRvSW5kZXggP1xuICAgICAgICAgIC1zdGVwRHVyYXRpb24vMiA6ICAgLy8gU3RvcCBoYWxmd2F5IHRocm91Z2guXG4gICAgICAgICAgMDsgICAgICAgICAgICAgIC8vIFBsYXkgYW5pbWF0aW9uIHVudGlsIGVuZC5cbiAgICAgICAgcmV0dXJuIHsgZHVyYXRpb246IHN0ZXBEdXJhdGlvbiwgZGlyZWN0aW9uLCBmaWxsLCBkZWxheSwgZW5kRGVsYXkgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRpbWluZ3M7XG4gIH1cblxufTtcblxuXG4vLyBLZXlmcmFtZXMgZm9yIHN0YW5kYXJkIHNlbGVjdGlvbiBhbmltYXRpb24gZWZmZWN0cy5cbm1peGluLnN0YW5kYXJkRWZmZWN0S2V5ZnJhbWVzID0ge1xuXG4gIC8vIFNpbXBsZSBjcm9zc2ZhZGVcbiAgY3Jvc3NmYWRlOiBbXG4gICAgeyBvcGFjaXR5OiAwIH0sXG4gICAgeyBvcGFjaXR5OiAxIH0sXG4gICAgeyBvcGFjaXR5OiAwIH1cbiAgXSxcblxuICAvLyBSZXZlYWwsIGFzIGlmIHNsaWRpbmcgdGhlIHRvcCBjYXJkIG9mZiBhIGRlY2sgb2YgY2FyZHNcbiAgcmV2ZWFsOiBbXG4gICAgeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIHpJbmRleDogMCB9LFxuICAgIHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknLCB6SW5kZXg6IDEgfSxcbiAgICB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgekluZGV4OiAyIH1cbiAgXSxcblxuICAvLyBHb29nbGUgUGhvdG9zLXN0eWxlIHJldmVhbC13aXRoLWZhZGUgYW5pbWF0aW9uXG4gIHJldmVhbFdpdGhGYWRlOiBbXG4gICAgeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKSBzY2FsZSgwLjc1KScsIG9wYWNpdHk6IDAsIHpJbmRleDogMCB9LFxuICAgIHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSkgc2NhbGUoMS4wKScsIG9wYWNpdHk6IDEsIHpJbmRleDogMSB9LFxuICAgIHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSkgc2NhbGUoMS4wKScsIG9wYWNpdHk6IDEsIHpJbmRleDogMiB9XG4gIF0sXG5cbiAgLy8gQ2Fyb3VzZWwgdmFyaWFudCB3aXRoIGEgYml0IG9mIG9mZi1zdGFnZSBlbGVtZW50cyBzaG93aW5nXG4gIHNob3dBZGphY2VudDogW1xuICAgIHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg3OCUpIHNjYWxlKDAuNyknLCB6SW5kZXg6IDAgfSxcbiAgICB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpIHNjYWxlKDAuODIpJywgekluZGV4OiAxIH0sXG4gICAgeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC03OCUpIHNjYWxlKDAuNyknLCB6SW5kZXg6IDAgfVxuICBdLFxuXG4gIC8vIFNpbXBsZSBzbGlkZVxuICBzbGlkZTogW1xuICAgIHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgxMDAlKScgfSxcbiAgICB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJyB9XG4gIF0sXG5cbiAgLy8gU2xpZGUsIHdpdGggYSBnYXAgYmV0d2VlblxuICBzbGlkZVdpdGhHYXA6IFtcbiAgICB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMTEwJSknIH0sXG4gICAgeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMTAlKScgfVxuICBdXG5cbn07XG5cblxuLypcbiAqIFNtb290aGx5IGFuaW1hdGUgdGhlIHNlbGVjdGlvbiBiZXR3ZWVuIHRoZSBpbmRpY2F0ZWQgXCJmcm9tXCIgYW5kIFwidG9cIlxuICogaW5kaWNlcy4gVGhlIGZvcm1lciBjYW4gYmUgYSBmcmFjdGlvbiwgZS5nLiwgd2hlbiB0aGUgdXNlciByZWxlYXNlcyBhIGZpbmdlclxuICogdG8gY29tcGxldGUgYSB0b3VjaCBkcmFnLCBhbmQgdGhlIHNlbGVjdGlvbiB3aWxsIHNuYXAgdG8gdGhlIGNsb3Nlc3Qgd2hvbGVcbiAqIGluZGV4LlxuICovXG5mdW5jdGlvbiBhbmltYXRlU2VsZWN0aW9uKGVsZW1lbnQsIGZyb21TZWxlY3Rpb24sIHRvU2VsZWN0aW9uKSB7XG5cbiAgcmVzZXRBbmltYXRpb25zKGVsZW1lbnQpO1xuXG4gIC8vIENhbGN1bGF0ZSB0aGUgYW5pbWF0aW9uIHRpbWluZ3MuXG4gIGNvbnN0IGl0ZW1zID0gZWxlbWVudC5pdGVtcztcbiAgY29uc3Qga2V5ZnJhbWVzID0gZWxlbWVudC5zZWxlY3Rpb25BbmltYXRpb25LZXlmcmFtZXM7XG4gIGVsZW1lbnRbcGxheWluZ0FuaW1hdGlvblN5bWJvbF0gPSB0cnVlO1xuICBjb25zdCB0aW1pbmdzID0gbWl4aW4uaGVscGVycy5lZmZlY3RUaW1pbmdzRm9yU2VsZWN0aW9uQW5pbWF0aW9uKGVsZW1lbnQsIGZyb21TZWxlY3Rpb24sIHRvU2VsZWN0aW9uKTtcblxuICAvLyBGaWd1cmUgb3V0IHdoaWNoIGl0ZW0gd2lsbCBiZSB0aGUgb25lICphZnRlciogdGhlIG9uZSB3ZSdyZSBzZWxlY3RpbmcuXG4gIGNvbnN0IGl0ZW1Db3VudCA9IGl0ZW1zLmxlbmd0aDtcbiAgY29uc3Qgc2VsZWN0aW9uV3JhcHMgPSBlbGVtZW50LnNlbGVjdGlvbldyYXBzO1xuICBjb25zdCBzZWxlY3Rpb25JbmRleCA9IEZyYWN0aW9uYWxTZWxlY3Rpb25NaXhpbi5oZWxwZXJzLnNlbGVjdGlvblBhcnRzKHRvU2VsZWN0aW9uLCBpdGVtQ291bnQsIHNlbGVjdGlvbldyYXBzKS5pbmRleDtcbiAgY29uc3QgdG90YWxTdGVwcyA9IHN0ZXBzVG9JbmRleChpdGVtQ291bnQsIHNlbGVjdGlvbldyYXBzLCBmcm9tU2VsZWN0aW9uLCB0b1NlbGVjdGlvbik7XG4gIGNvbnN0IGZvcndhcmQgPSB0b3RhbFN0ZXBzID49IDA7XG4gIGxldCBuZXh0VXBJbmRleCA9IHNlbGVjdGlvbkluZGV4ICsgKGZvcndhcmQgPyAxIDogLSAxKTtcbiAgaWYgKHNlbGVjdGlvbldyYXBzKSB7XG4gICAgbmV4dFVwSW5kZXggPSBGcmFjdGlvbmFsU2VsZWN0aW9uTWl4aW4uaGVscGVycy53cmFwcGVkU2VsZWN0aW9uKG5leHRVcEluZGV4LCBpdGVtQ291bnQpO1xuICB9IGVsc2UgaWYgKCFpc0l0ZW1JbmRleEluQm91bmRzKGVsZW1lbnQsIG5leHRVcEluZGV4KSkge1xuICAgIG5leHRVcEluZGV4ID0gbnVsbDsgLy8gQXQgc3RhcnQvZW5kIG9mIGxpc3Q7IGRvbid0IGhhdmUgYSBuZXh0IGl0ZW0gdG8gc2hvdy5cbiAgfVxuXG4gIC8vIFBsYXkgdGhlIGFuaW1hdGlvbnMgdXNpbmcgdGhvc2UgdGltaW5ncy5cbiAgbGV0IGxhc3RBbmltYXRpb25EZXRhaWxzO1xuICB0aW1pbmdzLmZvckVhY2goKHRpbWluZywgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpdGVtID0gaXRlbXNbaW5kZXhdO1xuICAgIGlmICh0aW1pbmcpIHtcbiAgICAgIHNob3dJdGVtKGl0ZW0sIHRydWUpO1xuICAgICAgY29uc3QgYW5pbWF0aW9uID0gaXRlbS5hbmltYXRlKGtleWZyYW1lcywgdGltaW5nKTtcbiAgICAgIGVsZW1lbnRbYW5pbWF0aW9uU3ltYm9sXVtpbmRleF0gPSBhbmltYXRpb247XG4gICAgICBpZiAoaW5kZXggPT09IG5leHRVcEluZGV4KSB7XG4gICAgICAgIC8vIFRoaXMgaXRlbSB3aWxsIGJlIGFuaW1hdGVkLCBzbyB3aWxsIGFscmVhZHkgYmUgaW4gdGhlIGRlc2lyZWQgc3RhdGVcbiAgICAgICAgLy8gYWZ0ZXIgdGhlIGFuaW1hdGlvbiBjb21wbGV0ZXMuXG4gICAgICAgIG5leHRVcEluZGV4ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1pbmcuZW5kRGVsYXkgIT09IDApIHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgYW5pbWF0aW9uIGZvciB0aGUgaXRlbSB0aGF0IHdpbGwgYmUgbGVmdCBzZWxlY3RlZC5cbiAgICAgICAgLy8gV2Ugd2FudCB0byBjbGVhbiB1cCB3aGVuIHRoaXMgYW5pbWF0aW9uIGNvbXBsZXRlcy5cbiAgICAgICAgbGFzdEFuaW1hdGlvbkRldGFpbHMgPSB7IGFuaW1hdGlvbiwgaW5kZXgsIHRpbWluZywgZm9yd2FyZCB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGlzIGl0ZW0gZG9lc24ndCBwYXJ0aWNpcGF0ZSBpbiB0aGUgYW5pbWF0aW9uLlxuICAgICAgc2hvd0l0ZW0oaXRlbSwgZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGxhc3RBbmltYXRpb25EZXRhaWxzICE9IG51bGwpIHtcbiAgICAvLyBBcnJhbmdlIGZvciBjbGVhbi11cCB3b3JrIHRvIGJlIHBlcmZvcm1lZC5cbiAgICBsYXN0QW5pbWF0aW9uRGV0YWlscy5uZXh0VXBJbmRleCA9IG5leHRVcEluZGV4O1xuICAgIGxhc3RBbmltYXRpb25EZXRhaWxzLmFuaW1hdGlvbi5vbmZpbmlzaCA9IGV2ZW50ID0+IHNlbGVjdGlvbkFuaW1hdGlvbkZpbmlzaGVkKGVsZW1lbnQsIGxhc3RBbmltYXRpb25EZXRhaWxzKTtcbiAgICBlbGVtZW50W2xhc3RBbmltYXRpb25TeW1ib2xdID0gbGFzdEFuaW1hdGlvbkRldGFpbHMuYW5pbWF0aW9uO1xuICB9IGVsc2Uge1xuICAgIC8vIFNob3VsZG4ndCBoYXBwZW4gLS0gd2Ugc2hvdWxkIGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSBhbmltYXRpb24uXG4gICAgZWxlbWVudFtwbGF5aW5nQW5pbWF0aW9uU3ltYm9sXSA9IGZhbHNlO1xuICB9XG59XG5cblxuZnVuY3Rpb24gZ2V0QW5pbWF0aW9uRm9ySXRlbUluZGV4KGVsZW1lbnQsIGluZGV4KSB7XG4gIGlmIChlbGVtZW50W2FuaW1hdGlvblN5bWJvbF0gPT0gbnVsbCkge1xuICAgIC8vIE5vdCByZWFkeSB5ZXQ7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IGFuaW1hdGlvbiA9IGVsZW1lbnRbYW5pbWF0aW9uU3ltYm9sXVtpbmRleF07XG4gIGlmICghYW5pbWF0aW9uKSB7XG4gICAgY29uc3QgaXRlbSA9IGVsZW1lbnQuaXRlbXNbaW5kZXhdO1xuICAgIGFuaW1hdGlvbiA9IGl0ZW0uYW5pbWF0ZShlbGVtZW50LnNlbGVjdGlvbkFuaW1hdGlvbktleWZyYW1lcywge1xuICAgICAgZHVyYXRpb246IGVsZW1lbnQuc2VsZWN0aW9uQW5pbWF0aW9uRHVyYXRpb24sXG4gICAgICBmaWxsOiAnYm90aCdcbiAgICB9KTtcbiAgICBhbmltYXRpb24ucGF1c2UoKTtcbiAgICBlbGVtZW50W2FuaW1hdGlvblN5bWJvbF1baW5kZXhdID0gYW5pbWF0aW9uO1xuICB9XG4gIHJldHVybiBhbmltYXRpb247XG59XG5cbmZ1bmN0aW9uIGlzSXRlbUluZGV4SW5Cb3VuZHMoZWxlbWVudCwgaW5kZXgpIHtcbiAgcmV0dXJuIGluZGV4ID49IDAgJiYgZWxlbWVudC5pdGVtcyAmJiBpbmRleCA8IGVsZW1lbnQuaXRlbXMubGVuZ3RoO1xufVxuXG4vKlxuICogUmVuZGVyIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIGVsZW1lbnQuXG4gKlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byByZS1yZW5kZXIgYSBwcmV2aW91cyBzZWxlY3Rpb24gc3RhdGUgKGlmIHRoZVxuICogc2VsZWN0ZWRJbmRleCBwYXJhbSBpcyBvbWl0dGVkKSwgcmVuZGVyIHRoZSBzZWxlY3Rpb24gaW5zdGFudGx5IGF0IGEgZ2l2ZW5cbiAqIHdob2xlIG9yIGZyYWN0aW9uYWwgc2VsZWN0aW9uIGluZGV4LCBvciBhbmltYXRlIHRvIGEgZ2l2ZW4gc2VsZWN0aW9uIGluZGV4LlxuICpcbiAqIFRoZXJlIGFyZSBzZXZlcmFsIGRpc3RpbmN0IHNjZW5hcmlvcyB3ZSBuZWVkIHRvIGNvdmVyOlxuICpcbiAqIDEuIEluaXRpYWwgcG9zaXRpb25pbmcsIG9yIHJlcG9zaXRpb25pbmcgYWZ0ZXIgY2hhbmdpbmcgYSBwcm9wZXJ0eSBsaWtlXG4gKiAgICBzZWxlY3Rpb25BbmltYXRpb25LZXlmcmFtZXMgdGhhdCBhZmZlY3RzIHJlbmRlcmluZy5cbiAqIDIuIEFuaW1hdGUgb24gc2VsZWN0ZWRJbmRleCBjaGFuZ2UuIFRoaXMgc2hvdWxkIG92ZXJyaWRlIGFueSBhbmltYXRpb24vc3dpcGVcbiAqICAgIGFscmVhZHkgaW4gcHJvZ3Jlc3MuXG4gKiAzLiBJbnN0YW50bHkgcmVuZGVyIHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIGEgZHJhZyBvcGVyYXRpb24gaW4gcHJvZ3Jlc3MuXG4gKiA0LiBDb21wbGV0ZSBhIGRyYWcgb3BlcmF0aW9uLiBJZiB0aGUgZHJhZyB3YXNuJ3QgZmFyIGVub3VnaCB0byBhZmZlY3RcbiAqICAgIHNlbGVjdGlvbiwgd2UnbGwganVzdCBiZSByZXN0b3JpbmcgdGhlIHNlbGVjdGVkRnJhY3Rpb24gdG8gMC5cbiAqXG4gKiBJZiB0aGUgbGlzdCBkb2VzIG5vdCB3cmFwLCBhbnkgc2VsZWN0aW9uIHBvc2l0aW9uIG91dHNpZGUgdGhlIGxpc3QncyBib3VuZHNcbiAqIHdpbGwgYmUgZGFtcGVkIHRvIHByb2R1Y2UgYSB2aXN1YWwgZWZmZWN0IG9mIHRlbnNpb24uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlclNlbGVjdGlvbihlbGVtZW50LCBzZWxlY3RlZEluZGV4PWVsZW1lbnQuc2VsZWN0ZWRJbmRleCwgc2VsZWN0ZWRGcmFjdGlvbj1lbGVtZW50LnNlbGVjdGVkRnJhY3Rpb24pIHtcbiAgY29uc3QgaXRlbUNvdW50ID0gZWxlbWVudC5pdGVtcyA/IGVsZW1lbnQuaXRlbXMubGVuZ3RoIDogMDtcbiAgaWYgKGl0ZW1Db3VudCA9PT0gMCkge1xuICAgIC8vIE5vdGhpbmcgdG8gcmVuZGVyLlxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoc2VsZWN0ZWRJbmRleCA8IDApIHtcbiAgICAvLyBUT0RPOiBIYW5kbGUgbm8gc2VsZWN0aW9uLlxuICAgIHJldHVybjtcbiAgfVxuICBsZXQgc2VsZWN0aW9uID0gc2VsZWN0ZWRJbmRleCArIHNlbGVjdGVkRnJhY3Rpb247XG4gIGlmIChlbGVtZW50LnNlbGVjdGlvbldyYXBzKSB7XG4gICAgLy8gQXBwbHkgd3JhcHBpbmcgdG8gZW5zdXJlIGNvbnNpc3RlbnQgcmVwcmVzZW50YXRpb24gb2Ygc2VsZWN0aW9uLlxuICAgIHNlbGVjdGlvbiA9IEZyYWN0aW9uYWxTZWxlY3Rpb25NaXhpbi5oZWxwZXJzLndyYXBwZWRTZWxlY3Rpb24oc2VsZWN0aW9uLCBpdGVtQ291bnQpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFwcGx5IGRhbXBpbmcgaWYgbmVjZXNzYXJ5LlxuICAgIHNlbGVjdGlvbiA9IEZyYWN0aW9uYWxTZWxlY3Rpb25NaXhpbi5oZWxwZXJzLmRhbXBlZFNlbGVjdGlvbihzZWxlY3Rpb24sIGl0ZW1Db3VudCk7XG4gIH1cbiAgY29uc3QgcHJldmlvdXNTZWxlY3Rpb24gPSBlbGVtZW50W3ByZXZpb3VzU2VsZWN0aW9uU3ltYm9sXTtcbiAgLy8gVE9ETzogSWYgYW4gaXRlbSBjaGFuZ2VzIHBvc2l0aW9uIGluIHRoZSBET00sIHdlIGVuZCB1cCBhbmltYXRpbmcgZnJvbVxuICAvLyBpdHMgb2xkIGluZGV4IHRvIGl0cyBuZXcgaW5kZXgsIGJ1dCB3ZSByZWFsbHkgZG9uJ3Qgd2FudCB0byBhbmltYXRlIGF0IGFsbC5cbiAgaWYgKCFlbGVtZW50W3N5bWJvbHMuZHJhZ2dpbmddICYmIHByZXZpb3VzU2VsZWN0aW9uICE9IG51bGwgJiZcbiAgICAgIHByZXZpb3VzU2VsZWN0aW9uICE9PSBzZWxlY3Rpb24pIHtcbiAgICAvLyBBbmltYXRlIHNlbGVjdGlvbiBmcm9tIHByZXZpb3VzIHN0YXRlIHRvIG5ldyBzdGF0ZS5cbiAgICBhbmltYXRlU2VsZWN0aW9uKGVsZW1lbnQsIHByZXZpb3VzU2VsZWN0aW9uLCBzZWxlY3Rpb24pO1xuICB9IGVsc2UgaWYgKHNlbGVjdGVkRnJhY3Rpb24gPT09IDAgJiYgZWxlbWVudFtwbGF5aW5nQW5pbWF0aW9uU3ltYm9sXSkge1xuICAgIC8vIEFscmVhZHkgaW4gcHJvY2VzcyBvZiBhbmltYXRpbmcgdG8gZnJhY3Rpb24gMC4gRHVyaW5nIHRoYXQgcHJvY2VzcyxcbiAgICAvLyBpZ25vcmUgc3Vic2VxdWVudCBhdHRlbXB0cyB0byByZW5kZXJTZWxlY3Rpb24gdG8gZnJhY3Rpb24gMC5cbiAgICByZXR1cm47XG4gIH0gZWxzZSB7XG4gICAgLy8gUmVuZGVyIGN1cnJlbnQgc2VsZWN0aW9uIHN0YXRlIGluc3RhbnRseS5cbiAgICByZW5kZXJTZWxlY3Rpb25JbnN0YW50bHkoZWxlbWVudCwgc2VsZWN0aW9uKTtcbiAgfVxuICBlbGVtZW50W3ByZXZpb3VzU2VsZWN0aW9uU3ltYm9sXSA9IHNlbGVjdGlvbjtcbn1cblxuLypcbiAqIEluc3RhbnRseSByZW5kZXIgKGRvbid0IGFuaW1hdGUpIHRoZSBlbGVtZW50J3MgaXRlbXMgYXQgdGhlIGdpdmVuIHdob2xlIG9yXG4gKiBmcmFjdGlvbmFsIHNlbGVjdGlvbiBpbmRleC5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyU2VsZWN0aW9uSW5zdGFudGx5KGVsZW1lbnQsIHRvU2VsZWN0aW9uKSB7XG4gIGlmIChlbGVtZW50W3Jlc2V0QW5pbWF0aW9uc09uTmV4dFJlbmRlclN5bWJvbF0pIHtcbiAgICByZXNldEFuaW1hdGlvbnMoZWxlbWVudCk7XG4gICAgZWxlbWVudFtyZXNldEFuaW1hdGlvbnNPbk5leHRSZW5kZXJTeW1ib2xdID0gZmFsc2U7XG4gIH1cbiAgY29uc3QgYW5pbWF0aW9uRnJhY3Rpb25zID0gbWl4aW4uaGVscGVycy5hbmltYXRpb25GcmFjdGlvbnNGb3JTZWxlY3Rpb24oZWxlbWVudCwgdG9TZWxlY3Rpb24pO1xuICBhbmltYXRpb25GcmFjdGlvbnMubWFwKChhbmltYXRpb25GcmFjdGlvbiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpdGVtID0gZWxlbWVudC5pdGVtc1tpbmRleF07XG4gICAgaWYgKGFuaW1hdGlvbkZyYWN0aW9uICE9IG51bGwpIHtcbiAgICAgIHNob3dJdGVtKGl0ZW0sIHRydWUpO1xuICAgICAgc2V0QW5pbWF0aW9uRnJhY3Rpb24oZWxlbWVudCwgaW5kZXgsIGFuaW1hdGlvbkZyYWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd0l0ZW0oaXRlbSwgZmFsc2UpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qXG4gKiBXZSBtYWludGFpbiBhbiBhcnJheSBjb250YWluaW5nIGFuIGFuaW1hdGlvbiBwZXIgaXRlbS4gVGhpcyBpcyB1c2VkIGZvciB0d29cbiAqIHJlYXNvbnM6XG4gKlxuICogKiBEdXJpbmcgYSBkcmFnIG9wZXJhdGlvbiwgd2Ugd2FudCB0byBiZSBhYmxlIHRvIHJldXNlIGFuaW1hdGlvbnMgYmV0d2VlblxuICogICBkcmFnIHVwZGF0ZXMuXG4gKiAqIFdoZW4gYSBzZWxlY3Rpb24gYW5pbWF0aW9uIGNvbXBsZXRlcywgd2UgbmVlZCB0byBiZSBhYmxlIHRvIGxlYXZlIHRoZVxuICogICB2aXNpYmlsZSBpdGVtcyBpbiBhIHBhdXNlZCBzdGF0ZS4gTGF0ZXIsIHdlJ2xsIHdhbnQgdG8gYmUgYWJsZSB0byBjbGVhbiB1cFxuICogICB0aG9zZSBhbmltYXRpb25zLlxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIGFycmF5IGlzIHNwYXJzZTogaXQgd2lsbCBvbmx5IGhvbGQgdXAgZnJvbSAw4oCTMyBhbmltYXRpb25zIGF0XG4gKiBhbnkgZ2l2ZW4gcG9pbnQuXG4gKi9cbmZ1bmN0aW9uIHJlc2V0QW5pbWF0aW9ucyhlbGVtZW50KSB7XG4gIGNvbnN0IGFuaW1hdGlvbnMgPSBlbGVtZW50W2FuaW1hdGlvblN5bWJvbF07XG4gIGlmIChhbmltYXRpb25zKSB7XG4gICAgLy8gQ2FuY2VsIGV4aXN0aW5nIGFuaW1hdGlvbnMgdG8gcmVtb3ZlIHRoZSBlZmZlY3RzIHRoZXkncmUgYXBwbHlpbmcuXG4gICAgYW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24sIGluZGV4KSA9PiB7XG4gICAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGFuaW1hdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgYW5pbWF0aW9uc1tpbmRleF0gPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGl0ZW1Db3VudCA9IGVsZW1lbnQuaXRlbXMgPyBlbGVtZW50Lml0ZW1zLmxlbmd0aCA6IDA7XG4gIGlmICghYW5pbWF0aW9ucyB8fCBhbmltYXRpb25zLmxlbmd0aCAhPT0gaXRlbUNvdW50KSB7XG4gICAgLy8gSGF2ZW4ndCBhbmltYXRlZCBiZWZvcmUgd2l0aCB0aGlzIG51bWJlciBvZiBpdGVtczsgKHJlKWNyZWF0ZSBhcnJheS5cbiAgICBlbGVtZW50W2FuaW1hdGlvblN5bWJvbF0gPSBuZXcgQXJyYXkoaXRlbUNvdW50KTtcbiAgfVxufVxuXG4vKlxuICogVGhlIGxhc3QgYW5pbWF0aW9uIGluIG91ciBzZWxlY3Rpb24gYW5pbWF0aW9uIGhhcyBjb21wbGV0ZWQuIENsZWFuIHVwLlxuICovXG5mdW5jdGlvbiBzZWxlY3Rpb25BbmltYXRpb25GaW5pc2hlZChlbGVtZW50LCBkZXRhaWxzKSB7XG5cbiAgLy8gV2hlbiB0aGUgbGFzdCBhbmltYXRpb24gY29tcGxldGVzLCBzaG93IHRoZSBuZXh0IGl0ZW0gaW4gdGhlIGRpcmVjdGlvblxuICAvLyB3ZSdyZSBnb2luZy4gV2FpdGluZyB0byB0aGF0IHVudGlsIHRoaXMgcG9pbnQgaXMgYSBiaXQgb2YgYSBoYWNrIHRvIGF2b2lkXG4gIC8vIGhhdmluZyBhIG5leHQgaXRlbSB0aGF0J3MgaGlnaGVyIGluIHRoZSBuYXR1cmFsIHotb3JkZXIgb2JzY3VyZSBvdGhlciBpdGVtc1xuICAvLyBkdXJpbmcgYW5pbWF0aW9uLlxuICBjb25zdCBuZXh0VXBJbmRleCA9IGRldGFpbHMubmV4dFVwSW5kZXg7XG4gIGlmIChuZXh0VXBJbmRleCAhPSBudWxsKSB7XG4gICAgaWYgKGVsZW1lbnRbYW5pbWF0aW9uU3ltYm9sXVtuZXh0VXBJbmRleF0pIHtcbiAgICAgIC8vIENhbmNlbCBleGlzdGluZyBzZWxlY3Rpb24gYW5pbWF0aW9uIHNvIHdlIGNhbiBjb25zdHJ1Y3QgYSBuZXcgb25lLlxuICAgICAgZWxlbWVudFthbmltYXRpb25TeW1ib2xdW25leHRVcEluZGV4XS5jYW5jZWwoKTtcbiAgICAgIGVsZW1lbnRbYW5pbWF0aW9uU3ltYm9sXVtuZXh0VXBJbmRleF0gPSBudWxsO1xuICAgIH1cbiAgICBjb25zdCBhbmltYXRpb25GcmFjdGlvbiA9IGRldGFpbHMuZm9yd2FyZCA/IDAgOiAxO1xuICAgIHNldEFuaW1hdGlvbkZyYWN0aW9uKGVsZW1lbnQsIG5leHRVcEluZGV4LCBhbmltYXRpb25GcmFjdGlvbik7XG4gICAgc2hvd0l0ZW0oZWxlbWVudC5pdGVtc1tuZXh0VXBJbmRleF0sIHRydWUpO1xuICB9XG5cbiAgZWxlbWVudFtsYXN0QW5pbWF0aW9uU3ltYm9sXS5vbmZpbmlzaCA9IG51bGw7XG4gIGVsZW1lbnRbcGxheWluZ0FuaW1hdGlvblN5bWJvbF0gPSBmYWxzZTtcbn1cblxuLypcbiAqIFBhdXNlIHRoZSBpbmRpY2F0ZWQgYW5pbWF0aW9uIGFuZCBoYXZlIGl0IHNob3cgdGhlIGFuaW1hdGlvbiBhdCB0aGUgZ2l2ZW5cbiAqIGZyYWN0aW9uIChiZXR3ZWVuIDAgYW5kIDEpIG9mIHRoZSB3YXkgdGhyb3VnaCB0aGUgYW5pbWF0aW9uLlxuICovXG5mdW5jdGlvbiBzZXRBbmltYXRpb25GcmFjdGlvbihlbGVtZW50LCBpdGVtSW5kZXgsIGZyYWN0aW9uKSB7XG4gIGNvbnN0IGFuaW1hdGlvbiA9IGdldEFuaW1hdGlvbkZvckl0ZW1JbmRleChlbGVtZW50LCBpdGVtSW5kZXgpO1xuICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgY29uc3QgZHVyYXRpb24gPSBlbGVtZW50LnNlbGVjdGlvbkFuaW1hdGlvbkR1cmF0aW9uO1xuICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgYW5pbWF0aW9uLmN1cnJlbnRUaW1lID0gZnJhY3Rpb24gKiBkdXJhdGlvbjtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2hvd0l0ZW0oaXRlbSwgZmxhZykge1xuICBpdGVtLnN0eWxlLnZpc2liaWxpdHkgPSBmbGFnID8gJ3Zpc2libGUnIDogJ2hpZGRlbic7XG59XG5cbi8qXG4gKiBGaWd1cmUgb3V0IGhvdyBtYW55IHN0ZXBzIGl0IHdpbGwgdGFrZSB0byBnbyBmcm9tIGZyb21TZWxlY3Rpb24gdG9cbiAqIHRvU2VsZWN0aW9uLiBUbyBnbyBmcm9tIGl0ZW0gMyB0byBpdGVtIDQgaXMgb25lIHN0ZXAuXG4gKlxuICogSWYgd3JhcHBpbmcgaXMgYWxsb3dlZCwgdGhlbiBnb2luZyBmcm9tIHRoZSBsYXN0IGl0ZW0gdG8gdGhlIGZpcnN0IHdpbGwgdGFrZVxuICogb25lIHN0ZXAgKGZvcndhcmQpLCBhbmQgZ29pbmcgZnJvbSB0aGUgZmlyc3QgaXRlbSB0byB0aGUgbGFzdCB3aWxsIHRha2Ugb25lXG4gKiBzdGVwIChiYWNrd2FyZCkuXG4gKi9cbmZ1bmN0aW9uIHN0ZXBzVG9JbmRleChsZW5ndGgsIGFsbG93V3JhcCwgZnJvbVNlbGVjdGlvbiwgdG9TZWxlY3Rpb24pIHtcbiAgbGV0IHN0ZXBzID0gdG9TZWxlY3Rpb24gLSBmcm9tU2VsZWN0aW9uO1xuICAvLyBXcmFwcGluZyBvbmx5IGtpY2tzIGluIHdoZW4gbGlzdCBoYXMgbW9yZSB0aGFuIDEgaXRlbS5cbiAgaWYgKGFsbG93V3JhcCAmJiBsZW5ndGggPiAxKSB7XG4gICAgY29uc3Qgd3JhcFN0ZXBzID0gbGVuZ3RoIC0gTWF0aC5hYnMoc3RlcHMpO1xuICAgIGlmICh3cmFwU3RlcHMgPD0gMSkge1xuICAgICAgLy8gU3BlY2lhbCBjYXNlXG4gICAgICBzdGVwcyA9IHN0ZXBzIDwgMCA/XG4gICAgICAgIHdyYXBTdGVwcyA6ICAgLy8gV3JhcCBmb3J3YXJkIGZyb20gbGFzdCBpdGVtIHRvIGZpcnN0LlxuICAgICAgICAtd3JhcFN0ZXBzOyAgIC8vIFdyYXAgYmFja3dhcmQgZnJvbSBmaXJzdCBpdGVtIHRvIGxhc3QuXG4gICAgfVxuICB9XG4gIHJldHVybiBzdGVwcztcbn1cbiIsImltcG9ydCBzeW1ib2xzIGZyb20gJy4vc3ltYm9scyc7XG5cblxuLy8gVXNlZCB0byBhc3NpZ24gdW5pcXVlIElEcyB0byBpdGVtIGVsZW1lbnRzIHdpdGhvdXQgSURzLlxubGV0IGlkQ291bnQgPSAwO1xuXG5cbi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggU2VsZWN0aW9uQXJpYUFjdGl2ZS4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHdoaWNoIHRyZWF0cyB0aGUgc2VsZWN0ZWQgaXRlbSBpbiBhIGxpc3QgYXMgdGhlIGFjdGl2ZSBpdGVtIGluIEFSSUFcbiAgICogYWNjZXNzaWJpbGl0eSB0ZXJtcy5cbiAgICpcbiAgICogSGFuZGxpbmcgQVJJQSBzZWxlY3Rpb24gc3RhdGUgcHJvcGVybHkgaXMgYWN0dWFsbHkgcXVpdGUgY29tcGxleDpcbiAgICpcbiAgICogKiBUaGUgaXRlbXMgaW4gdGhlIGxpc3QgbmVlZCB0byBiZSBpbmRpY2F0ZWQgYXMgcG9zc2libGUgaXRlbXMgdmlhIGFuIEFSSUFcbiAgICogICBgcm9sZWAgYXR0cmlidXRlIHZhbHVlIHN1Y2ggYXMgXCJvcHRpb25cIi5cbiAgICogKiBUaGUgc2VsZWN0ZWQgaXRlbSBuZWVkIHRvIGJlIG1hcmtlZCBhcyBzZWxlY3RlZCBieSBzZXR0aW5nIHRoZSBpdGVtJ3NcbiAgICogICBgYXJpYS1zZWxlY3RlZGAgYXR0cmlidXRlIHRvIHRydWUgKmFuZCogdGhlIG90aGVyIGl0ZW1zIG5lZWQgYmUgbWFya2VkIGFzXG4gICAqICAgKm5vdCogc2VsZWN0ZWQgYnkgc2V0dGluZyBgYXJpYS1zZWxlY3RlZGAgdG8gZmFsc2UuXG4gICAqICogVGhlIG91dGVybW9zdCBlbGVtZW50IHdpdGggdGhlIGtleWJvYXJkIGZvY3VzIG5lZWRzIHRvIGhhdmUgYXR0cmlidXRlc1xuICAgKiAgIHNldCBvbiBpdCBzbyB0aGF0IHRoZSBzZWxlY3Rpb24gaXMga25vd2FibGUgYXQgdGhlIGxpc3QgbGV2ZWwgdmlhIHRoZVxuICAgKiAgIGBhcmlhLWFjdGl2ZWRlc2NlbmRhbnRgIGF0dHJpYnV0ZS5cbiAgICogKiBVc2Ugb2YgYGFyaWEtYWN0aXZlZGVzY2VuZGFudGAgaW4gdHVybiByZXF1aXJlcyB0aGF0IGFsbCBpdGVtcyBpbiB0aGVcbiAgICogICBsaXN0IGhhdmUgSUQgYXR0cmlidXRlcyBhc3NpZ25lZCB0byB0aGVtLlxuICAgKlxuICAgKiBUaGlzIG1peGluIHRyaWVzIHRvIGFkZHJlc3MgYWxsIG9mIHRoZSBhYm92ZSByZXF1aXJlbWVudHMuIFRvIHRoYXQgZW5kLFxuICAgKiB0aGlzIG1peGluIHdpbGwgYXNzaWduIGdlbmVyYXRlZCBJRHMgdG8gYW55IGl0ZW0gdGhhdCBkb2Vzbid0IGFscmVhZHkgaGF2ZVxuICAgKiBhbiBJRC5cbiAgICpcbiAgICogQVJJQSByZWxpZXMgb24gZWxlbWVudHMgdG8gcHJvdmlkZSBgcm9sZWAgYXR0cmlidXRlcy4gVGhpcyBtaXhpbiB3aWxsIGFwcGx5XG4gICAqIGEgZGVmYXVsdCByb2xlIG9mIFwibGlzdGJveFwiIG9uIHRoZSBvdXRlciBsaXN0IGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBoYXZlIGFuXG4gICAqIGV4cGxpY2l0IHJvbGUuIFNpbWlsYXJseSwgdGhpcyBtaXhpbiB3aWxsIGFwcGx5IGEgZGVmYXVsdCByb2xlIG9mIFwib3B0aW9uXCJcbiAgICogdG8gYW55IGxpc3QgaXRlbSB0aGF0IGRvZXMgbm90IGFscmVhZHkgaGF2ZSBhIHJvbGUgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBUaGlzIG1peGluIGV4cGVjdHMgYSBzZXQgb2YgbWVtYmVycyB0aGF0IG1hbmFnZSB0aGUgc3RhdGUgb2YgdGhlIHNlbGVjdGlvbjpcbiAgICogYFtzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXWAsIGBpdGVtQWRkZWRgLCBhbmQgYHNlbGVjdGVkSW5kZXhgLiBZb3UgY2FuXG4gICAqIHN1cHBseSB0aGVzZSB5b3Vyc2VsZiwgb3IgZG8gc28gdmlhXG4gICAqIFtTaW5nbGVTZWxlY3Rpb25NaXhpbl0oU2luZ2xlU2VsZWN0aW9uTWl4aW4ubWQpLlxuICAgKi9cbiAgY2xhc3MgU2VsZWN0aW9uQXJpYUFjdGl2ZSBleHRlbmRzIGJhc2Uge1xuXG4gICAgW3N5bWJvbHMuYXBwbHlTZWxlY3Rpb25dKGl0ZW0sIHNlbGVjdGVkKSB7XG4gICAgICBpZiAoc3VwZXJbc3ltYm9scy5hcHBseVNlbGVjdGlvbl0pIHsgc3VwZXJbc3ltYm9scy5hcHBseVNlbGVjdGlvbl0oaXRlbSwgc2VsZWN0ZWQpOyB9XG4gICAgICBpdGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHNlbGVjdGVkKTtcbiAgICAgIGNvbnN0IGl0ZW1JZCA9IGl0ZW0uaWQ7XG4gICAgICBpZiAoaXRlbUlkICYmIHNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBpdGVtSWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgaWYgKHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKSB7IHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7IH1cbiAgICAgIC8vIFNldCBkZWZhdWx0IEFSSUEgcm9sZS5cbiAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZSgncm9sZScpID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCB0aGlzW3N5bWJvbHMuZGVmYXVsdHNdLnJvbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBbc3ltYm9scy5kZWZhdWx0c10oKSB7XG4gICAgICBjb25zdCBkZWZhdWx0cyA9IHN1cGVyW3N5bWJvbHMuZGVmYXVsdHNdIHx8IHt9O1xuICAgICAgZGVmYXVsdHMucm9sZSA9ICdsaXN0Ym94JztcbiAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICB9XG5cbiAgICBbc3ltYm9scy5pdGVtQWRkZWRdKGl0ZW0pIHtcbiAgICAgIGlmIChzdXBlcltzeW1ib2xzLml0ZW1BZGRlZF0pIHsgc3VwZXJbc3ltYm9scy5pdGVtQWRkZWRdKGl0ZW0pOyB9XG5cbiAgICAgIGlmICghaXRlbS5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSkge1xuICAgICAgICAvLyBBc3NpZ24gYSBkZWZhdWx0IEFSSUEgcm9sZS5cbiAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSBlYWNoIGl0ZW0gaGFzIGFuIElEIHNvIHdlIGNhbiBzZXQgYXJpYS1hY3RpdmVkZXNjZW5kYW50IG9uIHRoZVxuICAgICAgLy8gb3ZlcmFsbCBsaXN0IHdoZW5ldmVyIHRoZSBzZWxlY3Rpb24gY2hhbmdlcy5cbiAgICAgIC8vXG4gICAgICAvLyBUaGUgSUQgd2lsbCB0YWtlIHRoZSBmb3JtIG9mIGEgYmFzZSBJRCBwbHVzIGEgdW5pcXVlIGludGVnZXIuIFRoZSBiYXNlXG4gICAgICAvLyBJRCB3aWxsIGJlIGluY29ycG9yYXRlIHRoZSBjb21wb25lbnQncyBvd24gSUQuIEUuZy4sIGlmIGEgY29tcG9uZW50IGhhc1xuICAgICAgLy8gSUQgXCJmb29cIiwgdGhlbiBpdHMgaXRlbXMgd2lsbCBoYXZlIElEcyB0aGF0IGxvb2sgbGlrZSBcIl9mb29PcHRpb24xXCIuIElmXG4gICAgICAvLyB0aGUgY29tcG5lbnQgaGFzIG5vIElEIGl0c2VsZiwgaXRzIGl0ZW1zIHdpbGwgZ2V0IElEcyB0aGF0IGxvb2sgbGlrZVxuICAgICAgLy8gXCJfb3B0aW9uMVwiLiBJdGVtIElEcyBhcmUgcHJlZml4ZWQgd2l0aCBhbiB1bmRlcnNjb3JlIHRvIGRpZmZlcmVudGlhdGVcbiAgICAgIC8vIHRoZW0gZnJvbSBtYW51YWxseS1hc3NpZ25lZCBJRHMsIGFuZCB0byBtaW5pbWl6ZSB0aGUgcG90ZW50aWFsIGZvciBJRFxuICAgICAgLy8gY29uZmxpY3RzLlxuICAgICAgaWYgKCFpdGVtLmlkKSB7XG4gICAgICAgIGNvbnN0IGJhc2VJZCA9IHRoaXMuaWQgP1xuICAgICAgICAgICAgXCJfXCIgKyB0aGlzLmlkICsgXCJPcHRpb25cIiA6XG4gICAgICAgICAgICBcIl9vcHRpb25cIjtcbiAgICAgICAgaXRlbS5pZCA9IGJhc2VJZCArIGlkQ291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgc2VsZWN0ZWRJdGVtKCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnNlbGVjdGVkSXRlbTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGVkSXRlbShpdGVtKSB7XG4gICAgICBpZiAoJ3NlbGVjdGVkSXRlbScgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIuc2VsZWN0ZWRJdGVtID0gaXRlbTsgfVxuICAgICAgaWYgKGl0ZW0gPT0gbnVsbCkge1xuICAgICAgICAvLyBTZWxlY3Rpb24gd2FzIHJlbW92ZWQuXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBTZWxlY3Rpb25BcmlhQWN0aXZlO1xufTtcbiIsIi8qIEV4cG9ydGVkIGZ1bmN0aW9uIGV4dGVuZHMgYSBiYXNlIGNsYXNzIHdpdGggU2hhZG93RWxlbWVudFJlZmVyZW5jZXMuICovXG5leHBvcnQgZGVmYXVsdCAoYmFzZSkgPT4ge1xuXG4gIC8qKlxuICAgKiBNaXhpbiB0byBjcmVhdGUgcmVmZXJlbmNlcyB0byBlbGVtZW50cyBpbiBhIGNvbXBvbmVudCdzIFNoYWRvdyBET00gc3VidHJlZS5cbiAgICpcbiAgICogVGhpcyBhZGRzIGEgbWVtYmVyIG9uIHRoZSBjb21wb25lbnQgY2FsbGVkIGB0aGlzLiRgIHRoYXQgY2FuIGJlIHVzZWQgdG9cbiAgICogcmVmZXJlbmNlIHNoYWRvdyBlbGVtZW50cyB3aXRoIElEcy4gRS5nLiwgaWYgY29tcG9uZW50J3Mgc2hhZG93IGNvbnRhaW5zIGFuXG4gICAqIGVsZW1lbnQgYDxidXR0b24gaWQ9XCJmb29cIj5gLCB0aGVuIHRoaXMgbWl4aW4gd2lsbCBjcmVhdGUgYSBtZW1iZXJcbiAgICogYHRoaXMuJC5mb29gIHRoYXQgcG9pbnRzIHRvIHRoYXQgYnV0dG9uLlxuICAgKlxuICAgKiBTdWNoIHJlZmVyZW5jZXMgc2ltcGxpZnkgYSBjb21wb25lbnQncyBhY2Nlc3MgdG8gaXRzIG93biBlbGVtZW50cy4gSW5cbiAgICogZXhjaGFuZ2UsIHRoaXMgbWl4aW4gdHJhZGVzIG9mZiBhIG9uZS10aW1lIGNvc3Qgb2YgcXVlcnlpbmcgYWxsIGVsZW1lbnRzIGluXG4gICAqIHRoZSBzaGFkb3cgdHJlZSBpbnN0ZWFkIG9mIHBheWluZyBhbiBvbmdvaW5nIGNvc3QgdG8gcXVlcnkgZm9yIGFuIGVsZW1lbnRcbiAgICogZWFjaCB0aW1lIHRoZSBjb21wb25lbnQgd2FudHMgdG8gaW5zcGVjdCBvciBtYW5pcHVsYXRlIGl0LlxuICAgKlxuICAgKiBUaGlzIG1peGluIGV4cGVjdHMgdGhlIGNvbXBvbmVudCB0byBkZWZpbmUgYSBTaGFkb3cgRE9NIHN1YnRyZWUuIFlvdSBjYW5cbiAgICogY3JlYXRlIHRoYXQgdHJlZSB5b3Vyc2VsZiwgb3IgbWFrZSB1c2Ugb2ZcbiAgICogW1NoYWRvd1RlbXBsYXRlTWl4aW5dKFNoYWRvd1RlbXBsYXRlTWl4aW4ubWQpLlxuICAgKlxuICAgKiBUaGlzIG1peGluIGlzIGluc3BpcmVkIGJ5IFBvbHltZXIncyBbYXV0b21hdGljXG4gICAqIG5vZGUgZmluZGluZ10oaHR0cHM6Ly93d3cucG9seW1lci1wcm9qZWN0Lm9yZy8xLjAvZG9jcy9kZXZndWlkZS9sb2NhbC1kb20uaHRtbCNub2RlLWZpbmRpbmcpXG4gICAqIGZlYXR1cmUuXG4gICAqL1xuICBjbGFzcyBTaGFkb3dFbGVtZW50UmVmZXJlbmNlcyBleHRlbmRzIGJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgaWYgKHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgICAvLyBMb29rIGZvciBlbGVtZW50cyBpbiB0aGUgc2hhZG93IHN1YnRyZWUgdGhhdCBoYXZlIGlkIGF0dHJpYnV0ZXMuXG4gICAgICAgIC8vIEFuIGFsdGVybmF0aXZlbHkgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtaXhpbiB3b3VsZCBiZSB0byBqdXN0IGRlZmluZVxuICAgICAgICAvLyBhIHRoaXMuJCBnZXR0ZXIgdGhhdCBsYXppbHkgZG9lcyB0aGlzIHNlYXJjaCB0aGUgZmlyc3QgdGltZSBzb21lb25lXG4gICAgICAgIC8vIHRyaWVzIHRvIGFjY2VzcyB0aGlzLiQuIFRoYXQgbWlnaHQgaW50cm9kdWNlIHNvbWUgY29tcGxleGl0eSDigJMgaWYgdGhlXG4gICAgICAgIC8vIHRoZSB0cmVlIGNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGZpcnN0IHBvcHVsYXRlZCwgdGhlIHJlc3VsdCBvZlxuICAgICAgICAvLyBzZWFyY2hpbmcgZm9yIGEgbm9kZSBtaWdodCBiZSBzb21ld2hhdCB1bnByZWRpY3RhYmxlLlxuICAgICAgICB0aGlzLiQgPSB7fTtcbiAgICAgICAgY29uc3Qgbm9kZXNXaXRoSWRzID0gdGhpcy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzV2l0aElkcywgbm9kZSA9PiB7XG4gICAgICAgICAgY29uc3QgaWQgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgICB0aGlzLiRbaWRdID0gbm9kZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbGxlY3Rpb24gb2YgcmVmZXJlbmNlcyB0byB0aGUgZWxlbWVudHMgd2l0aCBJRHMgaW4gYSBjb21wb25lbnQnc1xuICAgICAqIFNoYWRvdyBET00gc3VidHJlZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQG1lbWJlciAkXG4gICAgICovXG4gIH1cblxuICByZXR1cm4gU2hhZG93RWxlbWVudFJlZmVyZW5jZXM7XG59O1xuIiwiLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBTaGFkb3dUZW1wbGF0ZS4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIGZvciBzdGFtcGluZyBhIHRlbXBsYXRlIGludG8gYSBTaGFkb3cgRE9NIHN1YnRyZWUgdXBvbiBjb21wb25lbnRcbiAgICogaW5zdGFudGlhdGlvbi5cbiAgICpcbiAgICogVG8gdXNlIHRoaXMgbWl4aW4sIGRlZmluZSBhIGB0ZW1wbGF0ZWAgcHJvcGVydHkgYXMgYSBzdHJpbmcgb3IgSFRNTFxuICAgKiBgPHRlbXBsYXRlPmAgZWxlbWVudDpcbiAgICpcbiAgICogICAgIGNsYXNzIE15RWxlbWVudCBleHRlbmRzIFNoYWRvd1RlbXBsYXRlTWl4aW4oSFRNTEVsZW1lbnQpIHtcbiAgICogICAgICAgZ2V0IHRlbXBsYXRlKCkge1xuICAgKiAgICAgICAgIHJldHVybiBgSGVsbG8sIDxlbT53b3JsZDwvZW0+LmA7XG4gICAqICAgICAgIH1cbiAgICogICAgIH1cbiAgICpcbiAgICogV2hlbiB5b3VyIGNvbXBvbmVudCBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGEgc2hhZG93IHJvb3Qgd2lsbCBiZSBjcmVhdGVkIG9uXG4gICAqIHRoZSBpbnN0YW5jZSwgYW5kIHRoZSBjb250ZW50cyBvZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBjbG9uZWQgaW50byB0aGVcbiAgICogc2hhZG93IHJvb3QuIElmIHlvdXIgY29tcG9uZW50IGRvZXMgbm90IGRlZmluZSBhIGB0ZW1wbGF0ZWAgcHJvcGVydHksIHRoaXNcbiAgICogbWl4aW4gaGFzIG5vIGVmZmVjdC5cbiAgICpcbiAgICogRm9yIHRoZSB0aW1lIGJlaW5nLCB0aGlzIGV4dGVuc2lvbiByZXRhaW5zIHN1cHBvcnQgZm9yIFNoYWRvdyBET00gdjAuIFRoYXRcbiAgICogd2lsbCBldmVudHVhbGx5IGJlIGRlcHJlY2F0ZWQgYXMgYnJvd3NlcnMgKGFuZCB0aGUgU2hhZG93IERPTSBwb2x5ZmlsbClcbiAgICogaW1wbGVtZW50IFNoYWRvdyBET00gdjEuXG4gICAqL1xuICBjbGFzcyBTaGFkb3dUZW1wbGF0ZSBleHRlbmRzIGJhc2Uge1xuXG4gICAgLypcbiAgICAgKiBJZiB0aGUgY29tcG9uZW50IGRlZmluZXMgYSB0ZW1wbGF0ZSwgYSBzaGFkb3cgcm9vdCB3aWxsIGJlIGNyZWF0ZWQgb24gdGhlXG4gICAgICogY29tcG9uZW50IGluc3RhbmNlLCBhbmQgdGhlIHRlbXBsYXRlIHN0YW1wZWQgaW50byBpdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgICAgLy8gVE9ETzogU2F2ZSB0aGUgcHJvY2Vzc2VkIHRlbXBsYXRlIHdpdGggdGhlIGNvbXBvbmVudCdzIGNsYXNzIHByb3RvdHlwZVxuICAgICAgLy8gc28gaXQgZG9lc24ndCBuZWVkIHRvIGJlIHByb2Nlc3NlZCB3aXRoIGV2ZXJ5IGluc3RhbnRpYXRpb24uXG4gICAgICBpZiAodGVtcGxhdGUpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgICAgICAgdGVtcGxhdGUgPSBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwodGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCkge1xuICAgICAgICAgIHNoaW1UZW1wbGF0ZVN0eWxlcyh0ZW1wbGF0ZSwgdGhpcy5sb2NhbE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICBjb25zdCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIFNoYWRvd1RlbXBsYXRlO1xufTtcblxuXG4vLyBDb252ZXJ0IGEgcGxhaW4gc3RyaW5nIG9mIEhUTUwgaW50byBhIHJlYWwgdGVtcGxhdGUgZWxlbWVudC5cbmZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlV2l0aElubmVySFRNTChpbm5lckhUTUwpIHtcbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgdGVtcGxhdGUuY29udGVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gIH1cbiAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG4vLyBJbnZva2UgYmFzaWMgc3R5bGUgc2hpbW1pbmcgd2l0aCBTaGFkb3dDU1MuXG5mdW5jdGlvbiBzaGltVGVtcGxhdGVTdHlsZXModGVtcGxhdGUsIHRhZykge1xuICB3aW5kb3cuV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc2hpbVN0eWxpbmcodGVtcGxhdGUuY29udGVudCwgdGFnKTtcbn1cbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuaW1wb3J0IHN5bWJvbHMgZnJvbSAnLi9zeW1ib2xzJztcblxuXG4vLyBTeW1ib2xzIGZvciBwcml2YXRlIGRhdGEgbWVtYmVycyBvbiBhbiBlbGVtZW50LlxuY29uc3QgY2FuU2VsZWN0TmV4dFN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnY2FuU2VsZWN0TmV4dCcpO1xuY29uc3QgY2FuU2VsZWN0UHJldmlvdXNTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ2NhblNlbGVjdFByZXZpb3VzJyk7XG5jb25zdCBzZWxlY3Rpb25SZXF1aXJlZFN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnc2VsZWN0aW9uUmVxdWlyZWQnKTtcbmNvbnN0IHNlbGVjdGlvbldyYXBzU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdzZWxlY3Rpb25XcmFwcycpO1xuXG4vLyBXZSB3YW50IHRvIGV4cG9zZSBib3RoIHNlbGVjdGVkSW5kZXggYW5kIHNlbGVjdGVkSXRlbSBhcyBpbmRlcGVuZGVudFxuLy8gcHJvcGVydGllcyBidXQga2VlcCB0aGVtIGluIHN5bmMuIFRoaXMgYWxsb3dzIGEgY29tcG9uZW50IHVzZXIgdG8gcmVmZXJlbmNlXG4vLyB0aGUgc2VsZWN0aW9uIGJ5IHdoYXRldmVyIG1lYW5zIGlzIG1vc3QgbmF0dXJhbCBmb3IgdGhlaXIgc2l0dWF0aW9uLlxuLy9cbi8vIFRvIGVmZmljaWVudGx5IGtlZXAgdGhlc2UgcHJvcGVydGllcyBpbiBzeW5jLCB3ZSB0cmFjayBcImV4dGVybmFsXCIgYW5kXG4vLyBcImludGVybmFsXCIgcmVmZXJlbmNlcyBmb3IgZWFjaCBwcm9wZXJ0eTpcbi8vXG4vLyBUaGUgZXh0ZXJuYWwgaW5kZXggb3IgaXRlbSBpcyB0aGUgb25lIHdlIHJlcG9ydCB0byB0aGUgb3V0c2lkZSB3b3JsZCB3aGVuXG4vLyBhc2tlZCBmb3Igc2VsZWN0aW9uLiAgV2hlbiBoYW5kbGluZyBhIGNoYW5nZSB0byBpbmRleCBvciBpdGVtLCB3ZSB1cGRhdGUgdGhlXG4vLyBleHRlcm5hbCByZWZlcmVuY2UgYXMgc29vbiBhcyBwb3NzaWJsZSwgc28gdGhhdCBpZiBhbnlvbmUgaW1tZWRpYXRlbHkgYXNrc1xuLy8gZm9yIHRoZSBjdXJyZW50IHNlbGVjdGlvbiwgdGhleSB3aWxsIHJlY2VpdmUgYSBzdGFibGUgYW5zd2VyLlxuLy9cbi8vIFRoZSBpbnRlcm5hbCBpbmRleCBvciBpdGVtIHRyYWNrcyB3aGljaGV2ZXIgaW5kZXggb3IgaXRlbSBsYXN0IHJlY2VpdmVkIHRoZVxuLy8gZnVsbCBzZXQgb2YgcHJvY2Vzc2luZy4gUHJvY2Vzc2luZyBpbmNsdWRlcyByYWlzaW5nIGEgY2hhbmdlIGV2ZW50IGZvciB0aGVcbi8vIG5ldyB2YWx1ZS4gT25jZSB3ZSd2ZSBiZWd1biB0aGF0IHByb2Nlc3NpbmcsIHdlIHN0b3JlIHRoZSBuZXcgdmFsdWUgYXMgdGhlXG4vLyBpbnRlcm5hbCB2YWx1ZSB0byBpbmRpY2F0ZSB3ZSd2ZSBoYW5kbGVkIGl0LlxuLy9cbmNvbnN0IGV4dGVybmFsU2VsZWN0ZWRJbmRleFN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnZXh0ZXJuYWxTZWxlY3RlZEluZGV4Jyk7XG5jb25zdCBleHRlcm5hbFNlbGVjdGVkSXRlbVN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnZXh0ZXJuYWxTZWxlY3RlZEl0ZW0nKTtcbmNvbnN0IGludGVybmFsU2VsZWN0ZWRJbmRleFN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnaW50ZXJuYWxTZWxlY3RlZEluZGV4Jyk7XG5jb25zdCBpbnRlcm5hbFNlbGVjdGVkSXRlbVN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnaW50ZXJuYWxTZWxlY3RlZEl0ZW0nKTtcblxuXG4vKiBFeHBvcnRlZCBmdW5jdGlvbiBleHRlbmRzIGEgYmFzZSBjbGFzcyB3aXRoIFNpbmdsZVNlbGVjdGlvbi4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHdoaWNoIG1hbmFnZXMgc2luZ2xlLXNlbGVjdGlvbiBzZW1hbnRpY3MgZm9yIGl0ZW1zIGluIGEgbGlzdC5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBleHBlY3RzIGEgY29tcG9uZW50IHRvIHByb3ZpZGUgYW4gYGl0ZW1zYCBBcnJheSBvciBOb2RlTGlzdCBvZlxuICAgKiBhbGwgZWxlbWVudHMgaW4gdGhlIGxpc3QuIEEgc3RhbmRhcmQgd2F5IHRvIGRvIHRoYXQgd2l0aCBpcyB0aGVcbiAgICogW0NvbnRlbnRJdGVtc01peGluXShDb250ZW50SXRlbXNNaXhpbi5tZCksIHdoaWNoIHRha2VzIGEgY29tcG9uZW50J3NcbiAgICogY29udGVudCAodHlwaWNhbGx5IGl0cyBkaXN0cmlidXRlZCBjaGlsZHJlbikgYXMgdGhlIHNldCBvZiBsaXN0IGl0ZW1zOyBzZWVcbiAgICogdGhhdCBtaXhpbiBmb3IgZGV0YWlscy5cbiAgICpcbiAgICogVGhpcyBtaXhpbiB0cmFja3MgYSBzaW5nbGUgc2VsZWN0ZWQgaXRlbSBpbiB0aGUgbGlzdCwgYW5kIHByb3ZpZGVzIG1lYW5zIHRvXG4gICAqIGdldCBhbmQgc2V0IHRoYXQgc3RhdGUgYnkgaXRlbSBwb3NpdGlvbiAoYHNlbGVjdGVkSW5kZXhgKSBvciBpdGVtIGlkZW50aXR5XG4gICAqIChgc2VsZWN0ZWRJdGVtYCkuIFRoZSBzZWxlY3Rpb24gY2FuIGJlIG1vdmVkIGluIHRoZSBsaXN0IHZpYSB0aGUgbWV0aG9kc1xuICAgKiBgc2VsZWN0Rmlyc3RgLCBgc2VsZWN0TGFzdGAsIGBzZWxlY3ROZXh0YCwgYW5kIGBzZWxlY3RQcmV2aW91c2AuXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gZG9lcyBub3QgcHJvZHVjZSBhbnkgdXNlci12aXNpYmxlIGVmZmVjdHMgdG8gcmVwcmVzZW50XG4gICAqIHNlbGVjdGlvbi4gT3RoZXIgbWl4aW5zLCBzdWNoIGFzXG4gICAqIFtTZWxlY3Rpb25BcmlhQWN0aXZlTWl4aW5dKFNlbGVjdGlvbkFyaWFBY3RpdmVNaXhpbi5tZCksXG4gICAqIFtTZWxlY3Rpb25IaWdobGlnaHRNaXhpbl0oU2VsZWN0aW9uSGlnaGxpZ2h0TWl4aW4ubWQpIGFuZFxuICAgKiBbU2VsZWN0aW9uSW5WaWV3TWl4aW5dKFNlbGVjdGlvbkluVmlld01peGluLm1kKSwgbW9kaWZ5IHRoZSBzZWxlY3RlZCBpdGVtXG4gICAqIGluIGNvbW1vbiB3YXlzIHRvIGxldCB0aGUgdXNlciBrbm93IGEgZ2l2ZW4gaXRlbSBpcyBzZWxlY3RlZCBvciBub3RcbiAgICogc2VsZWN0ZWQuXG4gICAqL1xuICBjbGFzcyBTaW5nbGVTZWxlY3Rpb24gZXh0ZW5kcyBiYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIC8vIFNldCBkZWZhdWx0cy5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3Rpb25SZXF1aXJlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SZXF1aXJlZCA9IHRoaXNbc3ltYm9scy5kZWZhdWx0c10uc2VsZWN0aW9uUmVxdWlyZWQ7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRoaXMuc2VsZWN0aW9uV3JhcHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uV3JhcHMgPSB0aGlzW3N5bWJvbHMuZGVmYXVsdHNdLnNlbGVjdGlvbldyYXBzO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGx5IHRoZSBpbmRpY2F0ZSBzZWxlY3Rpb24gc3RhdGUgdG8gdGhlIGl0ZW0uXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcuIFVzZXItdmlzaWJsZVxuICAgICAqIGVmZmVjdHMgd2lsbCB0eXBpY2FsbHkgYmUgaGFuZGxlZCBieSBvdGhlciBtaXhpbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpdGVtIC0gdGhlIGl0ZW0gYmVpbmcgc2VsZWN0ZWQvZGVzZWxlY3RlZFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2VsZWN0ZWQgLSB0cnVlIGlmIHRoZSBpdGVtIGlzIHNlbGVjdGVkLCBmYWxzZSBpZiBub3RcbiAgICAgKi9cbiAgICBbc3ltYm9scy5hcHBseVNlbGVjdGlvbl0oaXRlbSwgc2VsZWN0ZWQpIHtcbiAgICAgIGlmIChzdXBlcltzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXSkgeyBzdXBlcltzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXShpdGVtLCBzZWxlY3RlZCk7IH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcnVlIGlmIHRoZSBzZWxlY3Rpb24gY2FuIGJlIG1vdmVkIHRvIHRoZSBuZXh0IGl0ZW0sIGZhbHNlIGlmIG5vdCAodGhlXG4gICAgICogc2VsZWN0ZWQgaXRlbSBpcyB0aGUgbGFzdCBpdGVtIGluIHRoZSBsaXN0KS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBjYW5TZWxlY3ROZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXNbY2FuU2VsZWN0TmV4dFN5bWJvbF07XG4gICAgfVxuICAgIHNldCBjYW5TZWxlY3ROZXh0KGNhblNlbGVjdE5leHQpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzQ2FuU2VsZWN0TmV4dCA9IHRoaXNbY2FuU2VsZWN0TmV4dFN5bWJvbF07XG4gICAgICB0aGlzW2NhblNlbGVjdE5leHRTeW1ib2xdID0gY2FuU2VsZWN0TmV4dDtcbiAgICAgIGlmICgnY2FuU2VsZWN0TmV4dCcgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIuY2FuU2VsZWN0TmV4dCA9IGNhblNlbGVjdE5leHQ7IH1cbiAgICAgIGlmIChjYW5TZWxlY3ROZXh0ICE9PSBwcmV2aW91c0NhblNlbGVjdE5leHQpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2FuLXNlbGVjdC1uZXh0LWNoYW5nZWQnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJ1ZSBpZiB0aGUgc2VsZWN0aW9uIGNhbiBiZSBtb3ZlZCB0byB0aGUgcHJldmlvdXMgaXRlbSwgZmFsc2UgaWYgbm90XG4gICAgICogKHRoZSBzZWxlY3RlZCBpdGVtIGlzIHRoZSBmaXJzdCBvbmUgaW4gdGhlIGxpc3QpLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGNhblNlbGVjdFByZXZpb3VzKCkge1xuICAgICAgcmV0dXJuIHRoaXNbY2FuU2VsZWN0UHJldmlvdXNTeW1ib2xdO1xuICAgIH1cbiAgICBzZXQgY2FuU2VsZWN0UHJldmlvdXMoY2FuU2VsZWN0UHJldmlvdXMpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzQ2FuU2VsZWN0UHJldmlvdXMgPSB0aGlzW2NhblNlbGVjdFByZXZpb3VzU3ltYm9sXTtcbiAgICAgIHRoaXNbY2FuU2VsZWN0UHJldmlvdXNTeW1ib2xdID0gY2FuU2VsZWN0UHJldmlvdXM7XG4gICAgICBpZiAoJ2NhblNlbGVjdFByZXZpb3VzJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5jYW5TZWxlY3RQcmV2aW91cyA9IGNhblNlbGVjdFByZXZpb3VzOyB9XG4gICAgICBpZiAoY2FuU2VsZWN0UHJldmlvdXMgIT09IHByZXZpb3VzQ2FuU2VsZWN0UHJldmlvdXMpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2FuLXNlbGVjdC1wcmV2aW91cy1jaGFuZ2VkJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBbc3ltYm9scy5kZWZhdWx0c10oKSB7XG4gICAgICBjb25zdCBkZWZhdWx0cyA9IHN1cGVyW3N5bWJvbHMuZGVmYXVsdHNdIHx8IHt9O1xuICAgICAgZGVmYXVsdHMuc2VsZWN0aW9uUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgIGRlZmF1bHRzLnNlbGVjdGlvbldyYXBzID0gZmFsc2U7XG4gICAgICByZXR1cm4gZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGEgbmV3IGl0ZW0gYmVpbmcgYWRkZWQgdG8gdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBzaW1wbHkgc2V0cyB0aGUgaXRlbSdzXG4gICAgICogc2VsZWN0aW9uIHN0YXRlIHRvIGZhbHNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaXRlbSAtIHRoZSBpdGVtIGJlaW5nIGFkZGVkXG4gICAgICovXG4gICAgW3N5bWJvbHMuaXRlbUFkZGVkXShpdGVtKSB7XG4gICAgICBpZiAoc3VwZXJbc3ltYm9scy5pdGVtQWRkZWRdKSB7IHN1cGVyW3N5bWJvbHMuaXRlbUFkZGVkXShpdGVtKTsgfVxuICAgICAgdGhpc1tzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXShpdGVtLCBpdGVtID09PSB0aGlzLnNlbGVjdGVkSXRlbSk7XG4gICAgfVxuXG4gICAgaXRlbXNDaGFuZ2VkKCkge1xuICAgICAgaWYgKHN1cGVyLml0ZW1zQ2hhbmdlZCkgeyBzdXBlci5pdGVtc0NoYW5nZWQoKTsgfVxuXG4gICAgICAvLyBJbiBjYXNlIHNlbGVjdGVkIGl0ZW0gY2hhbmdlZCBwb3NpdGlvbiBvciB3YXMgcmVtb3ZlZC5cbiAgICAgIHRyYWNrU2VsZWN0ZWRJdGVtKHRoaXMpO1xuXG4gICAgICAvLyBJbiBjYXNlIHRoZSBjaGFuZ2UgaW4gaXRlbXMgYWZmZWN0ZWQgd2hpY2ggbmF2aWdhdGlvbnMgYXJlIHBvc3NpYmxlLlxuICAgICAgdXBkYXRlUG9zc2libGVOYXZpZ2F0aW9ucyh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW5kZXggb2YgdGhlIGl0ZW0gd2hpY2ggaXMgY3VycmVudGx5IHNlbGVjdGVkLlxuICAgICAqXG4gICAgICogQSBgc2VsZWN0ZWRJbmRleGAgb2YgLTEgaW5kaWNhdGVzIHRoZXJlIGlzIG5vIHNlbGVjdGlvbi4gU2V0dGluZyB0aGlzXG4gICAgICogcHJvcGVydHkgdG8gLTEgd2lsbCByZW1vdmUgYW55IGV4aXN0aW5nIHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGVkSW5kZXgoKSB7XG4gICAgICByZXR1cm4gdGhpc1tleHRlcm5hbFNlbGVjdGVkSW5kZXhTeW1ib2xdICE9IG51bGwgP1xuICAgICAgICB0aGlzW2V4dGVybmFsU2VsZWN0ZWRJbmRleFN5bWJvbF0gOlxuICAgICAgICAtMTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGVkSW5kZXgoaW5kZXgpIHtcbiAgICAgIC8vIFNlZSBub3RlcyBhdCB0b3AgYWJvdXQgaW50ZXJuYWwgdnMuIGV4dGVybmFsIGNvcGllcyBvZiB0aGlzIHByb3BlcnR5LlxuICAgICAgY29uc3QgcHJldmlvdXNTZWxlY3RlZEluZGV4ID0gdGhpc1tpbnRlcm5hbFNlbGVjdGVkSW5kZXhTeW1ib2xdO1xuICAgICAgbGV0IGl0ZW07XG4gICAgICBpZiAoaW5kZXggIT09IHRoaXNbZXh0ZXJuYWxTZWxlY3RlZEluZGV4U3ltYm9sXSkge1xuICAgICAgICAvLyBTdG9yZSB0aGUgbmV3IGluZGV4IGFuZCB0aGUgY29ycmVzcG9uZGluZyBpdGVtLlxuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgIGNvbnN0IGhhc0l0ZW1zID0gaXRlbXMgJiYgaXRlbXMubGVuZ3RoID4gMDtcbiAgICAgICAgaWYgKCEoaGFzSXRlbXMgJiYgaW5kZXggPj0gMCAmJiBpbmRleCA8IGl0ZW1zLmxlbmd0aCkpIHtcbiAgICAgICAgICBpbmRleCA9IC0xOyAvLyBObyBpdGVtIGF0IHRoYXQgaW5kZXguXG4gICAgICAgIH1cbiAgICAgICAgdGhpc1tleHRlcm5hbFNlbGVjdGVkSW5kZXhTeW1ib2xdID0gaW5kZXg7XG4gICAgICAgIGl0ZW0gPSBoYXNJdGVtcyAmJiBpbmRleCA+PSAwID8gaXRlbXNbaW5kZXhdIDogbnVsbDtcbiAgICAgICAgdGhpc1tleHRlcm5hbFNlbGVjdGVkSXRlbVN5bWJvbF0gPSBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbSA9IHRoaXNbZXh0ZXJuYWxTZWxlY3RlZEl0ZW1TeW1ib2xdO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3cgbGV0IHN1cGVyIGRvIGFueSB3b3JrLlxuICAgICAgaWYgKCdzZWxlY3RlZEluZGV4JyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3RlZEluZGV4ID0gaW5kZXg7IH1cblxuICAgICAgaWYgKGluZGV4ICE9PSBwcmV2aW91c1NlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgLy8gVGhlIHNlbGVjdGVkIGluZGV4IGNoYW5nZWQuXG4gICAgICAgIHRoaXNbaW50ZXJuYWxTZWxlY3RlZEluZGV4U3ltYm9sXSA9IGluZGV4O1xuXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzZWxlY3RlZC1pbmRleC1jaGFuZ2VkJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgc2VsZWN0ZWRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICB2YWx1ZTogaW5kZXggLy8gZm9yIFBvbHltZXIgYmluZGluZy4gVE9ETzogVmVyaWZ5IHN0aWxsIG5lY2Vzc2FyeVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzW2ludGVybmFsU2VsZWN0ZWRJdGVtU3ltYm9sXSAhPT0gaXRlbSkge1xuICAgICAgICAvLyBVcGRhdGUgc2VsZWN0ZWRJdGVtIHByb3BlcnR5IHNvIGl0IGNhbiBoYXZlIGl0cyBvd24gZWZmZWN0cy5cbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbSwgb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgdG8gbnVsbCBkZXNlbGVjdHMgYW55IGN1cnJlbnRseS1zZWxlY3RlZCBpdGVtLlxuICAgICAqIFNldHRpbmcgdGhpcyBwcm9wZXJ0eSB0byBhbiBvYmplY3QgdGhhdCBpcyBub3QgaW4gdGhlIGxpc3QgaGFzIG5vIGVmZmVjdC5cbiAgICAgKlxuICAgICAqIFRPRE86IEV2ZW4gaWYgc2VsZWN0aW9uUmVxdWlyZWQsIGNhbiBzdGlsbCBleHBsaWNpdGx5IHNldCBzZWxlY3RlZEl0ZW0gdG8gbnVsbC5cbiAgICAgKiBUT0RPOiBJZiBzZWxlY3Rpb25SZXF1aXJlZCwgbGVhdmUgc2VsZWN0aW9uIGFsb25lP1xuICAgICAqXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXQgc2VsZWN0ZWRJdGVtKCkge1xuICAgICAgcmV0dXJuIHRoaXNbZXh0ZXJuYWxTZWxlY3RlZEl0ZW1TeW1ib2xdIHx8IG51bGw7XG4gICAgfVxuICAgIHNldCBzZWxlY3RlZEl0ZW0oaXRlbSkge1xuICAgICAgLy8gU2VlIG5vdGVzIGF0IHRvcCBhYm91dCBpbnRlcm5hbCB2cy4gZXh0ZXJuYWwgY29waWVzIG9mIHRoaXMgcHJvcGVydHkuXG4gICAgICBjb25zdCBwcmV2aW91c1NlbGVjdGVkSXRlbSA9IHRoaXNbaW50ZXJuYWxTZWxlY3RlZEl0ZW1TeW1ib2xdO1xuICAgICAgbGV0IGluZGV4O1xuICAgICAgaWYgKGl0ZW0gIT09IHRoaXNbZXh0ZXJuYWxTZWxlY3RlZEl0ZW1TeW1ib2xdKSB7XG4gICAgICAgIC8vIFN0b3JlIGl0ZW0gYW5kIGxvb2sgdXAgY29ycmVzcG9uZGluZyBpbmRleC5cbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zO1xuICAgICAgICBjb25zdCBoYXNJdGVtcyA9IGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDA7XG4gICAgICAgIGluZGV4ID0gaGFzSXRlbXMgPyBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGl0ZW1zLCBpdGVtKSA6IC0xO1xuICAgICAgICB0aGlzW2V4dGVybmFsU2VsZWN0ZWRJbmRleFN5bWJvbF0gPSBpbmRleDtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgIGl0ZW0gPSBudWxsOyAvLyBUaGUgaW5kaWNhdGVkIGl0ZW0gaXNuJ3QgYWN0dWFsbHkgaW4gYGl0ZW1zYC5cbiAgICAgICAgfVxuICAgICAgICB0aGlzW2V4dGVybmFsU2VsZWN0ZWRJdGVtU3ltYm9sXSA9IGl0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IHRoaXNbZXh0ZXJuYWxTZWxlY3RlZEluZGV4U3ltYm9sXTtcbiAgICAgIH1cblxuICAgICAgLy8gTm93IGxldCBzdXBlciBkbyBhbnkgd29yay5cbiAgICAgIGlmICgnc2VsZWN0ZWRJdGVtJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3RlZEl0ZW0gPSBpdGVtOyB9XG5cbiAgICAgIGlmIChpdGVtICE9PSBwcmV2aW91c1NlbGVjdGVkSXRlbSkge1xuICAgICAgICAvLyBUaGUgc2VsZWN0ZWQgaXRlbSBjaGFuZ2VkLlxuICAgICAgICB0aGlzW2ludGVybmFsU2VsZWN0ZWRJdGVtU3ltYm9sXSA9IGl0ZW07XG5cbiAgICAgICAgaWYgKHByZXZpb3VzU2VsZWN0ZWRJdGVtKSB7XG4gICAgICAgICAgLy8gVXBkYXRlIHNlbGVjdGlvbiBzdGF0ZSBvZiBvbGQgaXRlbS5cbiAgICAgICAgICB0aGlzW3N5bWJvbHMuYXBwbHlTZWxlY3Rpb25dKHByZXZpb3VzU2VsZWN0ZWRJdGVtLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAvLyBVcGRhdGUgc2VsZWN0aW9uIHN0YXRlIHRvIG5ldyBpdGVtLlxuICAgICAgICAgIHRoaXNbc3ltYm9scy5hcHBseVNlbGVjdGlvbl0oaXRlbSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVQb3NzaWJsZU5hdmlnYXRpb25zKHRoaXMpO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzZWxlY3RlZC1pdGVtLWNoYW5nZWQnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW06IGl0ZW0sXG4gICAgICAgICAgICB2YWx1ZTogaXRlbSAvLyBmb3IgUG9seW1lciBiaW5kaW5nXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXNbaW50ZXJuYWxTZWxlY3RlZEluZGV4U3ltYm9sXSAhPT0gaW5kZXgpIHtcbiAgICAgICAgLy8gVXBkYXRlIHNlbGVjdGVkSW5kZXggcHJvcGVydHkgc28gaXQgY2FuIGhhdmUgaXRzIG93biBlZmZlY3RzLlxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3QgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIGxpc3QuXG4gICAgICovXG4gICAgc2VsZWN0Rmlyc3QoKSB7XG4gICAgICBpZiAoc3VwZXIuc2VsZWN0Rmlyc3QpIHsgc3VwZXIuc2VsZWN0Rmlyc3QoKTsgfVxuICAgICAgcmV0dXJuIHNlbGVjdEluZGV4KHRoaXMsIDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRydWUgaWYgdGhlIGxpc3Qgc2hvdWxkIGFsd2F5cyBoYXZlIGEgc2VsZWN0aW9uIChpZiBpdCBoYXMgaXRlbXMpLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBnZXQgc2VsZWN0aW9uUmVxdWlyZWQoKSB7XG4gICAgICByZXR1cm4gdGhpc1tzZWxlY3Rpb25SZXF1aXJlZFN5bWJvbF07XG4gICAgfVxuICAgIHNldCBzZWxlY3Rpb25SZXF1aXJlZChzZWxlY3Rpb25SZXF1aXJlZCkge1xuICAgICAgdGhpc1tzZWxlY3Rpb25SZXF1aXJlZFN5bWJvbF0gPSBzZWxlY3Rpb25SZXF1aXJlZDtcbiAgICAgIGlmICgnc2VsZWN0aW9uUmVxdWlyZWQnIGluIGJhc2UucHJvdG90eXBlKSB7IHN1cGVyLnNlbGVjdGlvblJlcXVpcmVkID0gc2VsZWN0aW9uUmVxdWlyZWQ7IH1cbiAgICAgIHRyYWNrU2VsZWN0ZWRJdGVtKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRydWUgaWYgc2VsZWN0aW9uIG5hdmlnYXRpb25zIHdyYXAgZnJvbSBsYXN0IHRvIGZpcnN0LCBhbmQgdmljZSB2ZXJzYS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGlvbldyYXBzKCkge1xuICAgICAgcmV0dXJuIHRoaXNbc2VsZWN0aW9uV3JhcHNTeW1ib2xdO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uV3JhcHModmFsdWUpIHtcbiAgICAgIHRoaXNbc2VsZWN0aW9uV3JhcHNTeW1ib2xdID0gU3RyaW5nKHZhbHVlKSA9PT0gJ3RydWUnO1xuICAgICAgaWYgKCdzZWxlY3Rpb25XcmFwcycgaW4gYmFzZS5wcm90b3R5cGUpIHsgc3VwZXIuc2VsZWN0aW9uV3JhcHMgPSB2YWx1ZTsgfVxuICAgICAgdXBkYXRlUG9zc2libGVOYXZpZ2F0aW9ucyh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3QgdGhlIGxhc3QgaXRlbSBpbiB0aGUgbGlzdC5cbiAgICAgKi9cbiAgICBzZWxlY3RMYXN0KCkge1xuICAgICAgaWYgKHN1cGVyLnNlbGVjdExhc3QpIHsgc3VwZXIuc2VsZWN0TGFzdCgpOyB9XG4gICAgICByZXR1cm4gc2VsZWN0SW5kZXgodGhpcywgdGhpcy5pdGVtcy5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3QgdGhlIG5leHQgaXRlbSBpbiB0aGUgbGlzdC5cbiAgICAgKi9cbiAgICBzZWxlY3ROZXh0KCkge1xuICAgICAgaWYgKHN1cGVyLnNlbGVjdE5leHQpIHsgc3VwZXIuc2VsZWN0TmV4dCgpOyB9XG4gICAgICByZXR1cm4gc2VsZWN0SW5kZXgodGhpcywgdGhpcy5zZWxlY3RlZEluZGV4ICsgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0IHRoZSBwcmV2aW91cyBpdGVtIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogSWYgdGhlIGxpc3QgaGFzIG5vIHNlbGVjdGlvbiwgdGhlIGxhc3QgaXRlbSB3aWxsIGJlIHNlbGVjdGVkLlxuICAgICAqL1xuICAgIHNlbGVjdFByZXZpb3VzKCkge1xuICAgICAgaWYgKHN1cGVyLnNlbGVjdFByZXZpb3VzKSB7IHN1cGVyLnNlbGVjdFByZXZpb3VzKCk7IH1cbiAgICAgIGNvbnN0IG5ld0luZGV4ID0gdGhpcy5zZWxlY3RlZEluZGV4IDwgMCA/XG4gICAgICAgIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA6ICAgICAvLyBObyBzZWxlY3Rpb24geWV0OyBzZWxlY3QgbGFzdCBpdGVtLlxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggLSAxO1xuICAgICAgcmV0dXJuIHNlbGVjdEluZGV4KHRoaXMsIG5ld0luZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIHRoZSBzZWxlY3RlZEl0ZW0gcHJvcGVydHkgY2hhbmdlcy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBTaW5nbGVTZWxlY3Rpb25cbiAgICAgKiBAZXZlbnQgc2VsZWN0ZWQtaXRlbS1jaGFuZ2VkXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGV0YWlsLnNlbGVjdGVkSXRlbSBUaGUgbmV3IHNlbGVjdGVkIGl0ZW0uXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGV0YWlsLnByZXZpb3VzSXRlbSBUaGUgcHJldmlvdXNseSBzZWxlY3RlZCBpdGVtLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiB0aGUgc2VsZWN0ZWRJbmRleCBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIFNpbmdsZVNlbGVjdGlvblxuICAgICAqIEBldmVudCBzZWxlY3RlZC1pbmRleC1jaGFuZ2VkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRldGFpbC5zZWxlY3RlZEluZGV4IFRoZSBuZXcgc2VsZWN0ZWQgaW5kZXguXG4gICAgICovXG5cbiAgfVxuXG4gIHJldHVybiBTaW5nbGVTZWxlY3Rpb247XG59O1xuXG5cbi8vIEVuc3VyZSB0aGUgZ2l2ZW4gaW5kZXggaXMgd2l0aGluIGJvdW5kcywgYW5kIHNlbGVjdCBpdCBpZiBpdCdzIG5vdCBhbHJlYWR5XG4vLyBzZWxlY3RlZC5cbmZ1bmN0aW9uIHNlbGVjdEluZGV4KGVsZW1lbnQsIGluZGV4KSB7XG4gIGNvbnN0IGNvdW50ID0gZWxlbWVudC5pdGVtcy5sZW5ndGg7XG5cbiAgY29uc3QgYm91bmRlZEluZGV4ID0gKGVsZW1lbnQuc2VsZWN0aW9uV3JhcHMpID9cbiAgICAvLyBKYXZhU2NyaXB0IG1vZCBkb2Vzbid0IGhhbmRsZSBuZWdhdGl2ZSBudW1iZXJzIHRoZSB3YXkgd2Ugd2FudCB0byB3cmFwLlxuICAgIC8vIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xODYxODI1MC83NjQ3MlxuICAgICgoaW5kZXggJSBjb3VudCkgKyBjb3VudCkgJSBjb3VudCA6XG5cbiAgICAvLyBLZWVwIGluZGV4IHdpdGhpbiBib3VuZHMgb2YgYXJyYXkuXG4gICAgTWF0aC5tYXgoTWF0aC5taW4oaW5kZXgsIGNvdW50IC0gMSksIDApO1xuXG4gIGNvbnN0IHByZXZpb3VzSW5kZXggPSBlbGVtZW50LnNlbGVjdGVkSW5kZXg7XG4gIGlmIChwcmV2aW91c0luZGV4ICE9PSBib3VuZGVkSW5kZXgpIHtcbiAgICBlbGVtZW50LnNlbGVjdGVkSW5kZXggPSBib3VuZGVkSW5kZXg7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIEZvbGxvd2luZyBhIGNoYW5nZSBpbiB0aGUgc2V0IG9mIGl0ZW1zLCBvciBpbiB0aGUgdmFsdWUgb2YgdGhlXG4vLyBgc2VsZWN0aW9uUmVxdWlyZWRgIHByb3BlcnR5LCByZWFjcXVpcmUgdGhlIHNlbGVjdGVkIGl0ZW0uIElmIGl0J3MgbW92ZWQsXG4vLyB1cGRhdGUgYHNlbGVjdGVkSW5kZXhgLiBJZiBpdCdzIGJlZW4gcmVtb3ZlZCwgYW5kIGEgc2VsZWN0aW9uIGlzIHJlcXVpcmVkLFxuLy8gdHJ5IHRvIHNlbGVjdCBhbm90aGVyIGl0ZW0uXG5mdW5jdGlvbiB0cmFja1NlbGVjdGVkSXRlbShlbGVtZW50KSB7XG5cbiAgY29uc3QgaXRlbXMgPSBlbGVtZW50Lml0ZW1zO1xuICBjb25zdCBpdGVtQ291bnQgPSBpdGVtcyA/IGl0ZW1zLmxlbmd0aCA6IDA7XG5cbiAgY29uc3QgcHJldmlvdXNTZWxlY3RlZEl0ZW0gPSBlbGVtZW50LnNlbGVjdGVkSXRlbTtcbiAgaWYgKCFwcmV2aW91c1NlbGVjdGVkSXRlbSkge1xuICAgIC8vIE5vIGl0ZW0gd2FzIHByZXZpb3VzbHkgc2VsZWN0ZWQuXG4gICAgaWYgKGVsZW1lbnQuc2VsZWN0aW9uUmVxdWlyZWQpIHtcbiAgICAgIC8vIFNlbGVjdCB0aGUgZmlyc3QgaXRlbSBieSBkZWZhdWx0LlxuICAgICAgZWxlbWVudC5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXRlbUNvdW50ID09PSAwKSB7XG4gICAgLy8gV2UndmUgbG9zdCB0aGUgc2VsZWN0aW9uLCBhbmQgdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gc2VsZWN0LlxuICAgIGVsZW1lbnQuc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUcnkgdG8gZmluZCB0aGUgcHJldmlvdXNseS1zZWxlY3RlZCBpdGVtIGluIHRoZSBjdXJyZW50IHNldCBvZiBpdGVtcy5cbiAgICBjb25zdCBpbmRleEluQ3VycmVudEl0ZW1zID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChpdGVtcywgcHJldmlvdXNTZWxlY3RlZEl0ZW0pO1xuICAgIGNvbnN0IHByZXZpb3VzU2VsZWN0ZWRJbmRleCA9IGVsZW1lbnQuc2VsZWN0ZWRJbmRleDtcbiAgICBpZiAoaW5kZXhJbkN1cnJlbnRJdGVtcyA8IDApIHtcbiAgICAgIC8vIFByZXZpb3VzbHktc2VsZWN0ZWQgaXRlbSB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBpdGVtcy5cbiAgICAgIC8vIFNlbGVjdCB0aGUgaXRlbSBhdCB0aGUgc2FtZSBpbmRleCAoaWYgaXQgZXhpc3RzKSBvciBhcyBjbG9zZSBhcyBwb3NzaWJsZS5cbiAgICAgIGNvbnN0IG5ld1NlbGVjdGVkSW5kZXggPSBNYXRoLm1pbihwcmV2aW91c1NlbGVjdGVkSW5kZXgsIGl0ZW1Db3VudCAtIDEpO1xuICAgICAgLy8gU2VsZWN0IGJ5IGl0ZW0sIHNpbmNlIGluZGV4IG1heSBiZSB0aGUgc2FtZSwgYW5kIHdlIHdhbnQgdG8gcmFpc2UgdGhlXG4gICAgICAvLyBzZWxlY3RlZC1pdGVtLWNoYW5nZWQgZXZlbnQuXG4gICAgICBlbGVtZW50LnNlbGVjdGVkSXRlbSA9IGl0ZW1zW25ld1NlbGVjdGVkSW5kZXhdO1xuICAgIH0gZWxzZSBpZiAoaW5kZXhJbkN1cnJlbnRJdGVtcyAhPT0gcHJldmlvdXNTZWxlY3RlZEluZGV4KSB7XG4gICAgICAvLyBQcmV2aW91c2x5LXNlbGVjdGVkIGl0ZW0gc3RpbGwgdGhlcmUsIGJ1dCBjaGFuZ2VkIHBvc2l0aW9uLlxuICAgICAgZWxlbWVudC5zZWxlY3RlZEluZGV4ID0gaW5kZXhJbkN1cnJlbnRJdGVtcztcbiAgICB9XG4gIH1cbn1cblxuLy8gRm9sbG93aW5nIGEgY2hhbmdlIGluIHNlbGVjdGlvbiwgcmVwb3J0IHdoZXRoZXIgaXQncyBub3cgcG9zc2libGUgdG9cbi8vIGdvIG5leHQvcHJldmlvdXMgZnJvbSB0aGUgZ2l2ZW4gaW5kZXguXG5mdW5jdGlvbiB1cGRhdGVQb3NzaWJsZU5hdmlnYXRpb25zKGVsZW1lbnQpIHtcbiAgbGV0IGNhblNlbGVjdE5leHQ7XG4gIGxldCBjYW5TZWxlY3RQcmV2aW91cztcbiAgY29uc3QgaXRlbXMgPSBlbGVtZW50Lml0ZW1zO1xuICBpZiAoaXRlbXMgPT0gbnVsbCB8fCBpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBObyBpdGVtcyB0byBzZWxlY3QuXG4gICAgY2FuU2VsZWN0TmV4dCA9IGZhbHNlO1xuICAgIGNhblNlbGVjdFByZXZpb3VzID0gZmFsc2U7XG4gIH0gaWYgKGVsZW1lbnQuc2VsZWN0aW9uV3JhcHMpIHtcbiAgICAvLyBTaW5jZSB0aGVyZSBhcmUgaXRlbXMsIGNhbiBhbHdheXMgZ28gbmV4dC9wcmV2aW91cy5cbiAgICBjYW5TZWxlY3ROZXh0ID0gdHJ1ZTtcbiAgICBjYW5TZWxlY3RQcmV2aW91cyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaW5kZXggPSBlbGVtZW50LnNlbGVjdGVkSW5kZXg7XG4gICAgaWYgKGluZGV4IDwgMCAmJiBpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBTcGVjaWFsIGNhc2UuIElmIHRoZXJlIGFyZSBpdGVtcyBidXQgbm8gc2VsZWN0aW9uLCBkZWNsYXJlIHRoYXQgaXQnc1xuICAgICAgLy8gYWx3YXlzIHBvc3NpYmxlIHRvIGdvIG5leHQvcHJldmlvdXMgdG8gY3JlYXRlIGEgc2VsZWN0aW9uLlxuICAgICAgY2FuU2VsZWN0TmV4dCA9IHRydWU7XG4gICAgICBjYW5TZWxlY3RQcmV2aW91cyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vcm1hbCBjYXNlOiB3ZSBoYXZlIGFuIGluZGV4IGluIGEgbGlzdCB0aGF0IGhhcyBpdGVtcy5cbiAgICAgIGNhblNlbGVjdFByZXZpb3VzID0gKGluZGV4ID4gMCk7XG4gICAgICBjYW5TZWxlY3ROZXh0ID0gKGluZGV4IDwgaXRlbXMubGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG4gIGlmIChlbGVtZW50LmNhblNlbGVjdE5leHQgIT09IGNhblNlbGVjdE5leHQpIHtcbiAgICBlbGVtZW50LmNhblNlbGVjdE5leHQgPSBjYW5TZWxlY3ROZXh0O1xuICB9XG4gIGlmIChlbGVtZW50LmNhblNlbGVjdFByZXZpb3VzICE9PSBjYW5TZWxlY3RQcmV2aW91cykge1xuICAgIGVsZW1lbnQuY2FuU2VsZWN0UHJldmlvdXMgPSBjYW5TZWxlY3RQcmV2aW91cztcbiAgfVxufVxuIiwiaW1wb3J0IGNyZWF0ZVN5bWJvbCBmcm9tICcuL2NyZWF0ZVN5bWJvbCc7XG5pbXBvcnQgc3ltYm9scyBmcm9tICcuL3N5bWJvbHMnO1xuXG5cbmNvbnN0IHBsYXlpbmdTeW1ib2wgPSBjcmVhdGVTeW1ib2woJ3BsYXlpbmcnKTtcbmNvbnN0IHNlbGVjdGlvblRpbWVyRHVyYXRpb25TeW1ib2wgPSBjcmVhdGVTeW1ib2woJ3NlbGVjdGlvblRpbWVyRHVyYXRpb24nKTtcbmNvbnN0IHRpbWVyVGltZW91dFN5bWJvbCA9IGNyZWF0ZVN5bWJvbCgndGltZXJUaW1lb3V0Jyk7XG5cblxuLyogRXhwb3J0ZWQgZnVuY3Rpb24gZXh0ZW5kcyBhIGJhc2UgY2xhc3Mgd2l0aCBUaW1lclNlbGVjdGlvbi4gKi9cbmV4cG9ydCBkZWZhdWx0IChiYXNlKSA9PiB7XG5cbiAgLyoqXG4gICAqIE1peGluIHdoaWNoIHByb3ZpZGVzIGZvciBhdXRvbWF0aWMgdGltZWQgY2hhbmdlcyBpbiBzZWxlY3Rpb24uXG4gICAqXG4gICAqIFRoaXMgbWl4aW4gaXMgdXNlZnVsIGZvciBjcmVhdGluZyBzbGlkZXNob3ctbGlrZSBlbGVtZW50cy5cbiAgICpcbiAgICogVGhpcyBtaXhpbiBleHBlY3RzIHRoZSBjb21wb25lbnQgdG8gZGVmaW5lIGFuIGBpdGVtc2AgcHJvcGVydHksIGFzIHdlbGwgYXNcbiAgICogYHNlbGVjdEZpcnN0YCBhbmQgYHNlbGVjdE5leHRgIG1ldGhvZHMuIFlvdSBjYW4gaW1wbGVtZW50IHRob3NlIHlvdXJzZWxmLFxuICAgKiBvciB1c2UgW0NvbnRlbnRJdGVtc01peGluXShDb250ZW50SXRlbXNNaXhpbi5tZCkgYW5kXG4gICAqIFtTaW5nbGVTZWxlY3Rpb25NaXhpbl0oU2luZ2xlU2VsZWN0aW9uTWl4aW4ubWQpLlxuICAgKi9cbiAgY2xhc3MgVGltZXJTZWxlY3Rpb24gZXh0ZW5kcyBiYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIC8vIFNldCBkZWZhdWx0cy5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wbGF5aW5nID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLnBsYXlpbmcgPSB0aGlzW3N5bWJvbHMuZGVmYXVsdHNdLnBsYXlpbmc7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRoaXMuc2VsZWN0aW9uVGltZXJEdXJhdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25UaW1lckR1cmF0aW9uID0gdGhpc1tzeW1ib2xzLmRlZmF1bHRzXS5zZWxlY3Rpb25UaW1lckR1cmF0aW9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnRlbnRDaGFuZ2VkKCkge1xuICAgICAgaWYgKHN1cGVyLmNvbnRlbnRDaGFuZ2VkKSB7IHN1cGVyLmNvbnRlbnRDaGFuZ2VkKCk7IH1cbiAgICAgIHJlc3RhcnRUaW1lcih0aGlzKTtcbiAgICB9XG5cbiAgICBnZXQgW3N5bWJvbHMuZGVmYXVsdHNdKCkge1xuICAgICAgY29uc3QgZGVmYXVsdHMgPSBzdXBlcltzeW1ib2xzLmRlZmF1bHRzXSB8fCB7fTtcbiAgICAgIGRlZmF1bHRzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgIGRlZmF1bHRzLnNlbGVjdGlvblRpbWVyRHVyYXRpb24gPSAxMDAwO1xuICAgICAgcmV0dXJuIGRlZmF1bHRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJlZ2luIGF1dG9tYXRpYyBwcm9ncmVzc2lvbiBvZiB0aGUgc2VsZWN0aW9uLlxuICAgICAqL1xuICAgIHBsYXkoKSB7XG4gICAgICBpZiAoc3VwZXIucGxheSkgeyBzdXBlci5wbGF5KCk7IH1cbiAgICAgIHN0YXJ0VGltZXIodGhpcyk7XG4gICAgICB0aGlzW3BsYXlpbmdTeW1ib2xdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXVzZSBhdXRvbWF0aWMgcHJvZ3Jlc3Npb24gb2YgdGhlIHNlbGVjdGlvbi5cbiAgICAgKi9cbiAgICBwYXVzZSgpIHtcbiAgICAgIGlmIChzdXBlci5wYXVzZSkgeyBzdXBlci5wYXVzZSgpOyB9XG4gICAgICBjbGVhclRpbWVyKHRoaXMpO1xuICAgICAgdGhpc1twbGF5aW5nU3ltYm9sXSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRydWUgaWYgdGhlIHNlbGVjdGlvbiBpcyBiZWluZyBhdXRvbWF0aWNhbGx5IGFkdmFuY2VkLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBnZXQgcGxheWluZygpIHtcbiAgICAgIHJldHVybiB0aGlzW3BsYXlpbmdTeW1ib2xdO1xuICAgIH1cbiAgICBzZXQgcGxheWluZyhwbGF5aW5nKSB7XG4gICAgICBjb25zdCBwcmV2aW91c1BsYXlpbmcgPSB0aGlzW3BsYXlpbmdTeW1ib2xdO1xuICAgICAgY29uc3QgcGFyc2VkID0gU3RyaW5nKHBsYXlpbmcpID09PSAndHJ1ZSc7IC8vIENhc3QgdG8gYm9vbGVhblxuICAgICAgaWYgKCdwbGF5aW5nJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5wbGF5aW5nID0gcGxheWluZzsgfVxuICAgICAgaWYgKHBhcnNlZCAhPT0gcHJldmlvdXNQbGF5aW5nKSB7XG4gICAgICAgIGlmIChwbGF5aW5nKSB7XG4gICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBXaGVuIHRoZSBzZWxlY3RlZCBpdGVtIGNoYW5nZXMgKGJlY2F1c2Ugb2Ygc29tZXRoaW5nIHRoaXMgbWl4aW4gZGlkLCBvclxuICAgICAqIHdhcyBjaGFuZ2VkIGJ5IGFuIG91dHNpZGUgYWdlbnQgbGlrZSB0aGUgdXNlciksIHdlIHdhaXQgYmVmb3JlIGFkdmFuY2luZ1xuICAgICAqIHRvIHRoZSBuZXh0IGl0ZW0uIEJ5IHRyaWdnZXJpbmcgdGhlIG5leHQgaXRlbSB0aGlzIHdheSwgd2UgaW1wbGljaXRseSBnZXRcbiAgICAgKiBhIGRlc2lyYWJsZSBiZWhhdmlvcjogaWYgdGhlIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0aW9uIChlLmcuLCBpbiBhXG4gICAgICogY2Fyb3VzZWwpLCB3ZSBsZXQgdGhlbSBzZWUgdGhhdCBzZWxlY3Rpb24gc3RhdGUgZm9yIGEgd2hpbGUgYmVmb3JlXG4gICAgICogYWR2YW5jaW5nIHRoZSBzZWxlY3Rpb24gb3Vyc2VsdmVzLlxuICAgICAqL1xuICAgIGdldCBzZWxlY3RlZEl0ZW0oKSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2VsZWN0ZWRJdGVtO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0ZWRJdGVtKGl0ZW0pIHtcbiAgICAgIGlmICgnc2VsZWN0ZWRJdGVtJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3RlZEl0ZW0gPSBpdGVtOyB9XG4gICAgICByZXN0YXJ0VGltZXIodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzIHRoYXQgd2lsbCBlbGFwc2UgYWZ0ZXIgdGhlIHNlbGVjdGlvbiBjaGFuZ2VzXG4gICAgICogYmVmb3JlIHRoZSBzZWxlY3Rpb24gd2lsbCBiZSBhZHZhbmNlZCB0byB0aGUgbmV4dCBpdGVtIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn0gLSBUaW1lIGluIG1pbGxpc2Vjb25kc1xuICAgICAqIEBkZWZhdWx0IDEwMDAgKDEgc2Vjb25kKVxuICAgICAqL1xuICAgIGdldCBzZWxlY3Rpb25UaW1lckR1cmF0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXNbc2VsZWN0aW9uVGltZXJEdXJhdGlvblN5bWJvbF07XG4gICAgfVxuICAgIHNldCBzZWxlY3Rpb25UaW1lckR1cmF0aW9uKHZhbHVlKSB7XG4gICAgICB0aGlzW3NlbGVjdGlvblRpbWVyRHVyYXRpb25TeW1ib2xdID0gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgaWYgKCdzZWxlY3Rpb25UaW1lckR1cmF0aW9uJyBpbiBiYXNlLnByb3RvdHlwZSkgeyBzdXBlci5zZWxlY3Rpb25UaW1lckR1cmF0aW9uID0gdmFsdWU7IH1cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBUaW1lclNlbGVjdGlvbjtcbn07XG5cblxuZnVuY3Rpb24gY2xlYXJUaW1lcihlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50W3RpbWVyVGltZW91dFN5bWJvbF0pIHtcbiAgICBjbGVhclRpbWVvdXQoZWxlbWVudFt0aW1lclRpbWVvdXRTeW1ib2xdKTtcbiAgICBlbGVtZW50W3RpbWVyVGltZW91dFN5bWJvbF0gPSBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnRUaW1lcihlbGVtZW50KSB7XG4gIGNsZWFyVGltZXIoZWxlbWVudCk7XG4gIGlmIChlbGVtZW50LnBsYXlpbmcgJiYgZWxlbWVudC5pdGVtcyAmJiBlbGVtZW50Lml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICBzdGFydFRpbWVyKGVsZW1lbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0VGltZXIoZWxlbWVudCkge1xuICAvLyBJZiBwbGF5KCkgaXMgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLCBjYW5jZWwgYW55IGV4aXN0aW5nIHRpbWVyLlxuICBjbGVhclRpbWVyKGVsZW1lbnQpO1xuICBlbGVtZW50W3RpbWVyVGltZW91dFN5bWJvbF0gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBzZWxlY3ROZXh0V2l0aFdyYXAoZWxlbWVudCk7XG4gIH0sIGVsZW1lbnQuc2VsZWN0aW9uVGltZXJEdXJhdGlvbik7XG59XG5cbi8vIFNlbGVjdCB0aGUgbmV4dCBpdGVtLCB3cmFwcGluZyB0byBmaXJzdCBpdGVtIGlmIG5lY2Vzc2FyeS5cbmZ1bmN0aW9uIHNlbGVjdE5leHRXaXRoV3JhcChlbGVtZW50KSB7XG4gIGNvbnN0IGl0ZW1zID0gZWxlbWVudC5pdGVtcztcbiAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoZWxlbWVudC5zZWxlY3RlZEluZGV4ID09IG51bGwgfHwgZWxlbWVudC5zZWxlY3RlZEluZGV4ID09PSBpdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICBlbGVtZW50LnNlbGVjdEZpcnN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2VsZWN0TmV4dCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY3JlYXRlIGEgc3ltYm9sIHRoYXQgY2FuIGJlIHVzZWQgZm9yIGFzc29jaWF0aW5nIHByaXZhdGVcbiAqIGRhdGEgd2l0aCBhbiBlbGVtZW50LlxuICpcbiAqIE1peGlucyBhbmQgY29tcG9uZW50IGNsYXNzZXMgb2Z0ZW4gd2FudCB0byBhc3NvY2lhdGUgcHJpdmF0ZSBkYXRhIHdpdGggYW5cbiAqIGVsZW1lbnQgaW5zdGFuY2UsIGJ1dCBKYXZhU2NyaXB0IGRvZXMgbm90IGhhdmUgZGlyZWN0IHN1cHBvcnQgZm9yIHRydWVcbiAqIHByaXZhdGUgcHJvcGVydGllcy4gT25lIGFwcHJvYWNoIGlzIHRvIHVzZSB0aGVcbiAqIFtTeW1ib2xdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N5bWJvbClcbiAqIGRhdGEgdHlwZSB0byBzZXQgYW5kIHJldHJpZXZlIGRhdGEgb24gYW4gZWxlbWVudC5cbiAqXG4gKiBVbmZvcnR1bmF0ZWx5LCB0aGUgU3ltYm9sIHR5cGUgaXMgbm90IGF2YWlsYWJsZSBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMS4gVGhlXG4gKiBgY3JlYXRlU3ltYm9sYCBoZWxwZXIgZnVuY3Rpb24gZXhpc3RzIGFzIGEgd29ya2Fyb3VuZCBmb3IgSUUgMTEuIFJhdGhlciB0aGFuXG4gKiByZXR1cm5pbmcgYSB0cnVlIFN5bWJvbCwgaXQgc2ltcGx5IHJldHVybnMgYW4gdW5kZXJzY29yZS1wcmVmaXhlZCBzdHJpbmcuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogICAgIGNvbnN0IGZvb1N5bWJvbCA9IGNyZWF0ZVN5bWJvbCgnZm9vJyk7XG4gKlxuICogICAgIGNsYXNzIE15RWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAqICAgICAgIGdldCBmb28oKSB7XG4gKiAgICAgICAgIHJldHVybiB0aGlzW2Zvb1N5bWJvbF07XG4gKiAgICAgICB9XG4gKiAgICAgICBzZXQgZm9vKHZhbHVlKSB7XG4gKiAgICAgICAgIHRoaXNbZm9vU3ltYm9sXSA9IHZhbHVlO1xuICogICAgICAgfVxuICogICAgIH1cbiAqXG4gKiBJbiBJRSAxMSwgdGhpcyBzYW1wbGUgd2lsbCBcImhpZGVcIiBkYXRhIGJlaGluZCBhbiBpbnN0YW5jZSBwcm9wZXJ0eSB0aGlzLl9mb28uXG4gKiBUaGUgdXNlIG9mIHRoZSB1bmRlcnNjb3JlIGlzIG1lYW50IHRvIHJlZHVjZSAobm90IGVsaW1pbmF0ZSkgdGhlIHBvdGVudGlhbFxuICogZm9yIG5hbWUgY29uZmxpY3RzLCBhbmQgZGlzY291cmFnZSAobm90IHByZXZlbnQpIGV4dGVybmFsIGFjY2VzcyB0byB0aGlzXG4gKiBkYXRhLiBJbiBtb2Rlcm4gYnJvd3NlcnMsIHRoZSBhYm92ZSBjb2RlIHdpbGwgZWxpbWluYXRlIHRoZSBwb3RlbnRpYWwgb2ZcbiAqIG5hbWluZyBjb25mbGljdHMsIGFuZCBiZXR0ZXIgaGlkZSB0aGUgZGF0YSBiZWhpbmQgYSByZWFsIFN5bWJvbC5cbiAqXG4gKiBAZnVuY3Rpb24gY3JlYXRlU3ltYm9sXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gLSBBIHN0cmluZyB0byBpZGVudGlmeSB0aGUgc3ltYm9sIHdoZW4gZGVidWdnaW5nXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVN5bWJvbChkZXNjcmlwdGlvbikge1xuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgU3ltYm9sKGRlc2NyaXB0aW9uKSA6XG4gICAgYF8ke2Rlc2NyaXB0aW9ufWA7XG59XG4iLCIvKlxuICogTWljcm90YXNrIGhlbHBlciBmb3IgSUUgMTEuXG4gKlxuICogRXhlY3V0aW5nIGEgZnVuY3Rpb24gYXMgYSBtaWNyb3Rhc2sgaXMgdHJpdmlhbCBpbiBicm93c2VycyB0aGF0IHN1cHBvcnRcbiAqIHByb21pc2VzLCB3aG9zZSB0aGVuKCkgY2xhdXNlcyB1c2UgbWljcm90YXNrIHRpbWluZy4gSUUgMTEgZG9lc24ndCBzdXBwb3J0XG4gKiBwcm9taXNlcywgYnV0IGRvZXMgc3VwcG9ydCBNdXRhdGlvbk9ic2VydmVycywgd2hpY2ggYXJlIGFsc28gZXhlY3V0ZWQgYXNcbiAqIG1pY3JvdGFza3MuIFNvIHRoaXMgaGVscGVyIHVzZXMgYW4gTXV0YXRpb25PYnNlcnZlciB0byBhY2hpZXZlIG1pY3JvdGFza1xuICogdGltaW5nLlxuICpcbiAqIFNlZSBodHRwczovL2pha2VhcmNoaWJhbGQuY29tLzIwMTUvdGFza3MtbWljcm90YXNrcy1xdWV1ZXMtYW5kLXNjaGVkdWxlcy9cbiAqXG4gKiBJbnNwaXJlZCBieSBQb2x5bWVyJ3MgYXN5bmMoKSBmdW5jdGlvbi5cbiAqL1xuXG5cbi8vIFRoZSBxdWV1ZSBvZiBwZW5kaW5nIGNhbGxiYWNrcyB0byBiZSBleGVjdXRlZCBhcyBtaWNyb3Rhc2tzLlxuY29uc3QgY2FsbGJhY2tzID0gW107XG5cbi8vIENyZWF0ZSBhbiBlbGVtZW50IHRoYXQgd2Ugd2lsbCBtb2RpZnkgdG8gZm9yY2Ugb2JzZXJ2YWJsZSBtdXRhdGlvbnMuXG5jb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuXG4vLyBBIG1vbm90b25pY2FsbHktaW5jcmVhc2luZyB2YWx1ZS5cbmxldCBjb3VudGVyID0gMDtcblxuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrIHRvIHRoZSBtaWNyb3Rhc2sgcXVldWUuXG4gKlxuICogVGhpcyB1c2VzIGEgTXV0YXRpb25PYnNlcnZlciBzbyB0aGF0IGl0IHdvcmtzIG9uIElFIDExLlxuICpcbiAqIE5PVEU6IElFIDExIG1heSBhY3R1YWxseSB1c2UgdGltZW91dCB0aW1pbmcgd2l0aCBNdXRhdGlvbk9ic2VydmVycy4gVGhpc1xuICogbmVlZHMgbW9yZSBpbnZlc3RpZ2F0aW9uLlxuICpcbiAqIEBmdW5jdGlvbiBtaWNyb3Rhc2tcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1pY3JvdGFzayhjYWxsYmFjaykge1xuICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gIC8vIEZvcmNlIGEgbXV0YXRpb24uXG4gIGVsZW1lbnQudGV4dENvbnRlbnQgPSArK2NvdW50ZXI7XG59XG5cblxuLy8gRXhlY3V0ZSBhbnkgcGVuZGluZyBjYWxsYmFja3MuXG5mdW5jdGlvbiBleGVjdXRlQ2FsbGJhY2tzKCkge1xuICB3aGlsZSAoY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrcy5zaGlmdCgpO1xuICAgIGNhbGxiYWNrKCk7XG4gIH1cbn1cblxuXG4vLyBDcmVhdGUgdGhlIG9ic2VydmVyLlxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihleGVjdXRlQ2FsbGJhY2tzKTtcbm9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwge1xuICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG59KTtcbiIsImltcG9ydCBjcmVhdGVTeW1ib2wgZnJvbSAnLi9jcmVhdGVTeW1ib2wnO1xuaW1wb3J0IHRvZ2dsZUNsYXNzIGZyb20gJy4vdG9nZ2xlQ2xhc3MnO1xuXG5cbi8vIFN5bWJvbHMgZm9yIHByaXZhdGUgZGF0YSBtZW1iZXJzIG9uIGFuIGVsZW1lbnQuXG5jb25zdCBzYWZlVG9TZXRBdHRyaWJ1dGVzU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdzYWZlVG9TZXRBdHRyaWJ1dGVzJyk7XG5jb25zdCBwZW5kaW5nQXR0cmlidXRlc1N5bWJvbCA9IGNyZWF0ZVN5bWJvbCgncGVuZGluZ0F0dHJpYnV0ZXMnKTtcbmNvbnN0IHBlbmRpbmdDbGFzc2VzU3ltYm9sID0gY3JlYXRlU3ltYm9sKCdwZW5kaW5nQ2xhc3NlcycpO1xuXG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9ucyBmb3IgdXBkYXRpbmcgYXR0cmlidXRlcywgaW5jbHVkaW5nIHRoZSBgY2xhc3NgIGF0dHJpYnV0ZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGFueSBwZW5kaW5nIHVwZGF0ZXMgdG8gYXR0cmlidXRlcyBhbmQgY2xhc3Nlcy5cbiAgICpcbiAgICogVGhpcyB3cml0ZXMgYW55IGBzZXRBdHRyaWJ1dGVgIG9yIGB0b2dnbGVDbGFzc2AgdmFsdWVzIHRoYXQgd2VyZSBwZXJmb3JtZWRcbiAgICogYmVmb3JlIGFuIGVsZW1lbnQgd2FzIGF0dGFjaGVkIHRvIHRoZSBkb2N1bWVudCBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgYnkgbWl4aW5zL2NvbXBvbmVudHMgaW4gdGhlaXJcbiAgICogYGNvbm5lY3RlZENhbGxiYWNrYC4gSWYgbXVsaXRwbGUgbWl4aW5zL2NvbXBvbmVudHMgaW52b2tlIHRoaXMgZHVyaW5nIHRoZVxuICAgKiBzYW1lIGBjb25uZWN0ZWRDYWxsYmFja2AsIG9ubHkgdGhlIGZpcnN0IGNhbGwgd2lsbCBoYXZlIGFueSBlZmZlY3QuIFRoZVxuICAgKiBzdWJzZXF1ZW50IGNhbGxzIHdpbGwgYmUgaGFybWxlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCBiZWluZyBhZGRlZCB0byB0aGUgZG9jdW1lbnQuXG4gICAqL1xuICBjb25uZWN0ZWQoZWxlbWVudCkge1xuICAgIGVsZW1lbnRbc2FmZVRvU2V0QXR0cmlidXRlc1N5bWJvbF0gPSB0cnVlO1xuXG4gICAgLy8gU2V0IGFueSBwZW5kaW5nIGF0dHJpYnV0ZXMuXG4gICAgaWYgKGVsZW1lbnRbcGVuZGluZ0F0dHJpYnV0ZXNTeW1ib2xdKSB7XG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgaW4gZWxlbWVudFtwZW5kaW5nQXR0cmlidXRlc1N5bWJvbF0pIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlbGVtZW50W3BlbmRpbmdBdHRyaWJ1dGVzU3ltYm9sXVthdHRyaWJ1dGVdO1xuICAgICAgICBzZXRBdHRyaWJ1dGVUb0VsZW1lbnQoZWxlbWVudCwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICBlbGVtZW50W3BlbmRpbmdBdHRyaWJ1dGVzU3ltYm9sXSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2V0IGFueSBwZW5kaW5nIGNsYXNzZXMuXG4gICAgaWYgKGVsZW1lbnRbcGVuZGluZ0NsYXNzZXNTeW1ib2xdKSB7XG4gICAgICBmb3IgKGxldCBjbGFzc05hbWUgaW4gZWxlbWVudFtwZW5kaW5nQ2xhc3Nlc1N5bWJvbF0pIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlbGVtZW50W3BlbmRpbmdDbGFzc2VzU3ltYm9sXVtjbGFzc05hbWVdO1xuICAgICAgICB0b2dnbGVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbcGVuZGluZ0NsYXNzZXNTeW1ib2xdID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldC91bnNldCB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGluZGljYXRlZCBuYW1lLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBleGlzdHMgcHJpbWFyaWx5IHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSBhbiBlbGVtZW50IHdhbnRzIHRvXG4gICAqIHNldCBhIGRlZmF1bHQgcHJvcGVydHkgdmFsdWUgdGhhdCBzaG91bGQgYmUgcmVmbGVjdGVkIGFzIGFuIGF0dHJpYnV0ZS4gQW5cbiAgICogaW1wb3J0YW50IGxpbWl0YXRpb24gb2YgY3VzdG9tIGVsZW1lbnQgY29uc3R1cmN0b3JzIGlzIHRoYXQgdGhleSBjYW5ub3RcbiAgICogc2V0IGF0dHJpYnV0ZXMuIEEgY2FsbCB0byBgc2V0QXR0cmlidXRlYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGxcbiAgICogYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZSAtIFRoZSBuYW1lIG9mIHRoZSAqYXR0cmlidXRlKiAobm90IHByb3BlcnR5KSB0byBzZXQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXQuIElmIG51bGwsIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZSByZW1vdmVkLlxuICAgKi9cbiAgc2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAoZWxlbWVudFtzYWZlVG9TZXRBdHRyaWJ1dGVzU3ltYm9sXSkge1xuICAgICAgLy8gU2FmZSB0byBzZXQgYXR0cmlidXRlcyBpbW1lZGlhdGVseS5cbiAgICAgIHNldEF0dHJpYnV0ZVRvRWxlbWVudChlbGVtZW50LCBhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVmZXIgc2V0dGluZyBhdHRyaWJ1dGVzIHVudGlsIHRoZSBmaXJzdCB0aW1lIHdlJ3JlIGNvbm5lY3RlZC5cbiAgICAgIGlmICghZWxlbWVudFtwZW5kaW5nQXR0cmlidXRlc1N5bWJvbF0pIHtcbiAgICAgICAgZWxlbWVudFtwZW5kaW5nQXR0cmlidXRlc1N5bWJvbF0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbcGVuZGluZ0F0dHJpYnV0ZXNTeW1ib2xdW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldC91bnNldCB0aGUgY2xhc3Mgd2l0aCB0aGUgaW5kaWNhdGVkIG5hbWUuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGV4aXN0cyBwcmltYXJpbHkgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIGFuIGVsZW1lbnQgd2FudHMgdG9cbiAgICogc2V0IGEgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZWZsZWN0ZWQgYXMgYXMgY2xhc3MuIEFuXG4gICAqIGltcG9ydGFudCBsaW1pdGF0aW9uIG9mIGN1c3RvbSBlbGVtZW50IGNvbnN0dXJjdG9ycyBpcyB0aGF0IHRoZXkgY2Fubm90XG4gICAqIHNldCBhdHRyaWJ1dGVzLCBpbmNsdWRpbmcgdGhlIGBjbGFzc2AgYXR0cmlidXRlLiBBIGNhbGwgdG9cbiAgICogYHRvZ2dsZUNsYXNzYCBkdXJpbmcgdGhlIGNvbnN0cnVjdG9yIHdpbGwgYmUgZGVmZXJyZWQgdW50aWwgdGhlIGVsZW1lbnRcbiAgICogaXMgY29ubmVjdGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBzZXQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIFRydWUgdG8gc2V0IHRoZSBjbGFzcywgZmFsc2UgdG8gcmVtb3ZlIGl0LlxuICAgKi9cbiAgdG9nZ2xlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lLCB2YWx1ZSkge1xuICAgIGlmIChlbGVtZW50W3NhZmVUb1NldEF0dHJpYnV0ZXNTeW1ib2xdKSB7XG4gICAgICAvLyBTYWZlIHRvIHNldCBjbGFzcyBpbW1lZGlhdGVseS5cbiAgICAgIHRvZ2dsZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWZlciBzZXR0aW5nIGNsYXNzIHVudGlsIHRoZSBmaXJzdCB0aW1lIHdlJ3JlIGNvbm5lY3RlZC5cbiAgICAgIGlmICghZWxlbWVudFtwZW5kaW5nQ2xhc3Nlc1N5bWJvbF0pIHtcbiAgICAgICAgZWxlbWVudFtwZW5kaW5nQ2xhc3Nlc1N5bWJvbF0gPSB7fTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbcGVuZGluZ0NsYXNzZXNTeW1ib2xdW2NsYXNzTmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxufTtcblxuXG4vLyBSZWZsZWN0IHRoZSBhdHRyaWJ1dGUgdG8gdGhlIGdpdmVuIGVsZW1lbnQuXG4vLyBJZiB0aGUgdmFsdWUgaXMgbnVsbCwgcmVtb3ZlIHRoZSBhdHRyaWJ1dGUuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVUb0VsZW1lbnQoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB0ZXh0ID0gU3RyaW5nKHZhbHVlKTtcbiAgICAvLyBBdm9pZCByZWN1cnNpdmUgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIGNhbGxzLlxuICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSAhPT0gdGV4dCkge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IGNyZWF0ZVN5bWJvbCBmcm9tICcuL2NyZWF0ZVN5bWJvbCc7XG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIFN5bWJvbCBvYmplY3RzIGZvciBzdGFuZGFyZCBjb21wb25lbnQgcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbiAqXG4gKiBUaGVzZSBTeW1ib2wgb2JqZWN0cyBhcmUgdXNlZCB0byBhbGxvdyBtaXhpbnMgYW5kIGEgY29tcG9uZW50IHRvIGludGVybmFsbHlcbiAqIGNvbW11bmljYXRlLCB3aXRob3V0IGV4cG9zaW5nIHRoZXNlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgaW4gdGhlIGNvbXBvbmVudCdzXG4gKiBwdWJsaWMgQVBJLlxuICpcbiAqIFRvIHVzZSB0aGVzZSBTeW1ib2wgb2JqZWN0cyBpbiB5b3VyIG93biBjb21wb25lbnQsIGluY2x1ZGUgdGhpcyBtb2R1bGUgYW5kXG4gKiB0aGVuIGNyZWF0ZSBhIHByb3BlcnR5IG9yIG1ldGhvZCB3aG9zZSBrZXkgaXMgdGhlIGRlc2lyZWQgU3ltYm9sLlxuICpcbiAqICAgICBpbXBvcnQgJ1NpbmdsZVNlbGVjdGlvbk1peGluJyBmcm9tICdiYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TaW5nbGVTZWxlY3Rpb25NaXhpbic7XG4gKiAgICAgaW1wb3J0ICdzeW1ib2xzJyBmcm9tICdiYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9zeW1ib2xzJztcbiAqXG4gKiAgICAgY2xhc3MgTXlFbGVtZW50IGV4dGVuZHMgU2luZ2xlU2VsZWN0aW9uTWl4aW4oSFRNTEVsZW1lbnQpIHtcbiAqICAgICAgIFtzeW1ib2xzLmFwcGx5U2VsZWN0aW9uXShpdGVtLCBzZWxlY3RlZCkge1xuICogICAgICAgICAvLyBUaGlzIHdpbGwgYmUgaW52b2tlZCB3aGVuZXZlciBhbiBpdGVtIGlzIHNlbGVjdGVkL2Rlc2VsZWN0ZWQuXG4gKiAgICAgICB9XG4gKiAgICAgfVxuICpcbiAqIEBtb2R1bGUgc3ltYm9sc1xuICovXG5jb25zdCBzeW1ib2xzID0ge1xuXG4gIC8qKlxuICAgKiBTeW1ib2wgZm9yIHRoZSBgYXBwbHlTZWxlY3Rpb25gIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYXBwbGllcyB0aGUgaW5kaWNhdGVkIHNlbGVjdGlvbiBzdGF0ZSB0byBhbiBpdGVtLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gYXBwbHlTZWxlY3Rpb25cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaXRlbSAtIHRoZSBpdGVtIGJlaW5nIHNlbGVjdGVkL2Rlc2VsZWN0ZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBzZWxlY3RlZCAtIHRydWUgaWYgdGhlIGl0ZW0gaXMgc2VsZWN0ZWQsIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgYXBwbHlTZWxlY3Rpb246IGNyZWF0ZVN5bWJvbCgnYXBwbHlTZWxlY3Rpb24nKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGRlZmF1bHRzYCBwcm9wZXJ0eS5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSBjYW4gYmUgdXNlZCB0byBzZXQgb3Igb3ZlcnJpZGUgZGVmYXVsdHMgdGhhdCB3aWxsIGJlIGFwcGxpZWRcbiAgICogdG8gYSBuZXcgY29tcG9uZW50IGluc3RhbmNlLiBXaGVuIGltcGxlbWVudGluZyB0aGlzIHByb3BlcnR5LCB0YWtlIGNhcmUgdG9cbiAgICogZmlyc3QgYWNxdWlyZSBhbnkgZGVmYXVsdHMgZGVmaW5lZCBieSB0aGUgc3VwZXJjbGFzcy4gVGhlIHN0YW5kYXJkIGlkaW9tIGlzXG4gICAqIGFzIGZvbGxvd3M6XG4gICAqXG4gICAqICAgICBnZXQgW3N5bWJvbHMuZGVmYXVsdHNdKCkge1xuICAgKiAgICAgICBjb25zdCBkZWZhdWx0cyA9IHN1cGVyW3N5bWJvbHMuZGVmYXVsdHNdIHx8IHt9O1xuICAgKiAgICAgICAvLyBTZXQgb3Igb3ZlcnJpZGUgZGVmYXVsdCB2YWx1ZXMgaGVyZVxuICAgKiAgICAgICBkZWZhdWx0cy5jdXN0b21Qcm9wZXJ0eSA9IGZhbHNlO1xuICAgKiAgICAgICByZXR1cm4gZGVmYXVsdHM7XG4gICAqICAgICB9XG4gICAqXG4gICAqIEB2YXIge29iamVjdH0gZGVmYXVsdHNcbiAgICovXG4gIGRlZmF1bHRzOiBjcmVhdGVTeW1ib2woJ2RlZmF1bHRzJyksXG5cbiAgLyoqXG4gICAqIFN5bWJvbCBmb3IgdGhlIGBkcmFnZ2luZ2AgcHJvcGVydHkuXG4gICAqXG4gICAqIENvbXBvbmVudHMgbGlrZSBjYXJvdXNlbHMgb2Z0ZW4gZGVmaW5lIGFuaW1hdGVkIENTUyB0cmFuc2l0aW9ucyBmb3JcbiAgICogc2xpZGluZyBlZmZlY3RzLiBTdWNoIGEgdHJhbnNpdGlvbiBzaG91bGQgdXN1YWxseSAqbm90KiBiZSBhcHBsaWVkIHdoaWxlXG4gICAqIHRoZSB1c2VyIGlzIGRyYWdnaW5nLCBiZWNhdXNlIGEgQ1NTIGFuaW1hdGlvbiB3aWxsIGludHJvZHVjZSBhIGxhZyB0aGF0XG4gICAqIG1ha2VzIHRoZSBzd2lwZSBmZWVsIHNsdWdnaXNoLiBJbnN0ZWFkLCBhcyBsb25nIGFzIHRoZSB1c2VyIGlzIGRyYWdnaW5nXG4gICAqIHdpdGggdGhlaXIgZmluZ2VyIGRvd24sIHRoZSB0cmFuc2l0aW9uIHNob3VsZCBiZSBzdXBwcmVzc2VkLiBXaGVuIHRoZVxuICAgKiB1c2VyIHJlbGVhc2VzIHRoZWlyIGZpbmdlciwgdGhlIHRyYW5zaXRpb24gY2FuIGJlIHJlc3RvcmVkLCBhbGxvd2luZyB0aGVcbiAgICogYW5pbWF0aW9uIHRvIHNob3cgdGhlIGNhcm91c2VsIHNsaWRpbmcgaW50byBpdHMgZmluYWwgcG9zaXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufSB0cnVlIGlmIGEgZHJhZyBpcyBpbiBwcm9ncmVzcywgZmFsc2UgaWYgbm90LlxuICAgKi9cbiAgZHJhZ2dpbmc6IGNyZWF0ZVN5bWJvbCgnZHJhZ2dpbmcnKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGdvRG93bmAgbWV0aG9kLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gZ28vbmF2aWdhdGUgZG93bi5cbiAgICpcbiAgICogQGZ1bmN0aW9uIGdvRG93blxuICAgKi9cbiAgZ29Eb3duOiBjcmVhdGVTeW1ib2woJ2dvRG93bicpLFxuXG4gIC8qKlxuICAgKiBTeW1ib2wgZm9yIHRoZSBgZ29FbmRgIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIHRvIHRoZSBlbmQgKGUuZy4sXG4gICAqIG9mIGEgbGlzdCkuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBnb0VuZFxuICAgKi9cbiAgZ29FbmQ6IGNyZWF0ZVN5bWJvbCgnZ29FbmQnKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGdvTGVmdGAgbWV0aG9kLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gZ28vbmF2aWdhdGUgbGVmdC5cbiAgICpcbiAgICogQGZ1bmN0aW9uIGdvTGVmdFxuICAgKi9cbiAgZ29MZWZ0OiBjcmVhdGVTeW1ib2woJ2dvTGVmdCcpLFxuXG4gIC8qKlxuICAgKiBTeW1ib2wgZm9yIHRoZSBgZ29SaWdodGAgbWV0aG9kLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gZ28vbmF2aWdhdGUgcmlnaHQuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBnb1JpZ2h0XG4gICAqL1xuICBnb1JpZ2h0OiBjcmVhdGVTeW1ib2woJ2dvUmlnaHQnKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGdvU3RhcnRgIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIHRoZSB1c2VyIHdhbnRzIHRvIGdvL25hdmlnYXRlIHRvIHRoZSBzdGFydFxuICAgKiAoZS5nLiwgb2YgYSBsaXN0KS5cbiAgICpcbiAgICogQGZ1bmN0aW9uIGdvU3RhcnRcbiAgICovXG4gIGdvU3RhcnQ6IGNyZWF0ZVN5bWJvbCgnZ29TdGFydCcpLFxuXG4gIC8qKlxuICAgKiBTeW1ib2wgZm9yIHRoZSBgZ29VcGAgbWV0aG9kLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIHdoZW4gdGhlIHVzZXIgd2FudHMgdG8gZ28vbmF2aWdhdGUgdXAuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBnb1VwXG4gICAqL1xuICBnb1VwOiBjcmVhdGVTeW1ib2woJ2dvVXAnKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGl0ZW1BZGRlZGAgbWV0aG9kLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIHdoZW4gYSBuZXcgaXRlbSBpcyBhZGRlZCB0byBhIGxpc3QuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBpdGVtQWRkZWRcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaXRlbSAtIHRoZSBpdGVtIGJlaW5nIHNlbGVjdGVkL2Rlc2VsZWN0ZWRcbiAgICovXG4gIGl0ZW1BZGRlZDogY3JlYXRlU3ltYm9sKCdpdGVtQWRkZWQnKSxcblxuICAvKipcbiAgICogU3ltYm9sIGZvciB0aGUgYGtleWRvd25gIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCB3aGVuIGFuIGVsZW1lbnQgcmVjZWl2ZXMgYSBga2V5ZG93bmAgZXZlbnQuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBrZXlkb3duXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgLSB0aGUgZXZlbnQgYmVpbmcgcHJvY2Vzc2VkXG4gICAqL1xuICBrZXlkb3duOiBjcmVhdGVTeW1ib2woJ2tleWRvd24nKVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc3ltYm9scztcbiIsIi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIGZvciBzdGFuZGFyZCBjbGFzc0xpc3QudG9nZ2xlKCkgYmVoYXZpb3Igb24gb2xkIGJyb3dzZXJzLFxuICogbmFtZWx5IElFIDExLlxuICpcbiAqIFRoZSBzdGFuZGFyZFxuICogW2NsYXNzbGlzdF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvY2xhc3NMaXN0KVxuICogb2JqZWN0IGhhcyBhIGB0b2dnbGUoKWAgZnVuY3Rpb24gdGhhdCBzdXBwb3J0cyBhIHNlY29uZCBCb29sZWFuIHBhcmFtZXRlclxuICogdGhhdCBjYW4gYmUgdXNlZCB0byBzdWNjaW5jdGx5IHR1cm4gYSBjbGFzcyBvbiBvciBvZmYuIFRoaXMgZmVhdHVyZSBpcyBvZnRlblxuICogdXNlZnVsIGluIGRlc2lnbmluZyBjdXN0b20gZWxlbWVudHMsIHdoaWNoIG1heSB3YW50IHRvIGV4dGVybmFsbHkgcmVmbGVjdFxuICogY29tcG9uZW50IHN0YXRlIGluIGEgQ1NTIGNsYXNzIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHN0eWxpbmcgcHVycG9zZXMuXG4gKlxuICogVW5mb3J0dW5hdGVseSwgSUUgMTEgZG9lcyBub3Qgc3VwcG9ydCB0aGUgQm9vbGVhbiBwYXJhbWV0ZXIgdG9cbiAqIGBjbGFzc0xpc3QudG9nZ2xlKClgLiBUaGlzIGhlbHBlciBmdW5jdGlvbiBiZWhhdmVzIGxpa2UgdGhlIHN0YW5kYXJkXG4gKiBgdG9nZ2xlKClgLCBpbmNsdWRpbmcgc3VwcG9ydCBmb3IgdGhlIEJvb2xlYW4gcGFyYW1ldGVyLCBzbyB0aGF0IGl0IGNhbiBiZVxuICogdXNlZCBldmVuIG9uIElFIDExLlxuICpcbiAqIEBmdW5jdGlvbiB0b2dnbGVDbGFzc1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBlbGVtZW50IHRvIG1vZGlmeVxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSAtIFRoZSBjbGFzcyB0byBhZGQvcmVtb3ZlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmb3JjZV0gLSBGb3JjZSB0aGUgY2xhc3MgdG8gYmUgYWRkZWQgKGlmIHRydWUpIG9yIHJlbW92ZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpZiBmYWxzZSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lLCBmb3JjZSkge1xuICBjb25zdCBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcbiAgY29uc3QgYWRkQ2xhc3MgPSAodHlwZW9mIGZvcmNlID09PSAndW5kZWZpbmVkJykgP1xuICAgICFjbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSA6XG4gICAgZm9yY2U7XG4gIGlmIChhZGRDbGFzcykge1xuICAgIGNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gIH1cbiAgcmV0dXJuIGFkZENsYXNzO1xufVxuIiwiaW1wb3J0IEF0dHJpYnV0ZU1hcnNoYWxsaW5nTWl4aW4gZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvQXR0cmlidXRlTWFyc2hhbGxpbmdNaXhpbic7XG5pbXBvcnQgQ29tcG9zYWJsZU1peGluIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0NvbXBvc2FibGVNaXhpbic7XG5pbXBvcnQgRGlzdHJpYnV0ZWRDaGlsZHJlbk1peGluIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0Rpc3RyaWJ1dGVkQ2hpbGRyZW5NaXhpbic7XG5pbXBvcnQgU2hhZG93RWxlbWVudFJlZmVyZW5jZXNNaXhpbiBmcm9tICcuLi8uLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TaGFkb3dFbGVtZW50UmVmZXJlbmNlc01peGluJztcbmltcG9ydCBTaGFkb3dUZW1wbGF0ZU1peGluIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL1NoYWRvd1RlbXBsYXRlTWl4aW4nO1xuXG5cbi8qKlxuICogQSBzYW1wbGUgZ2VuZXJhbC1wdXJwb3NlIGJhc2UgY2xhc3MgZm9yIGRlZmluaW5nIGN1c3RvbSBlbGVtZW50cyB0aGF0IG1peGVzXG4gKiBpbiBzb21lIGNvbW1vbiBmZWF0dXJlczogdGVtcGxhdGUgc3RhbXBpbmcgaW50byBhIHNoYWRvdyByb290LCBzaGFkb3cgZWxlbWVudFxuICogcmVmZXJlbmNlcywgbWFyc2hhbGxpbmcgYXR0cmlidXRlcyB0byBwcm9wZXJ0aWVzLCBhbmQgcmV0cmlldmluZyB0aGUgY2hpbGRyZW5cbiAqIGRpc3RyaWJ1dGVkIHRvIGEgY29tcG9uZW50LlxuICpcbiAqIFRoaXMgYmFzZSBjbGFzcyBpcyBub3Qgc3BlY2lhbCBpbiBhbnkgd2F5LCBhbmQgaXMgZGVmaW5lZCBvbmx5IGFzIGFcbiAqIGNvbnZlbmllbnQgc2hvcnRoYW5kIGZvciBhcHBseWluZyB0aGUgbWl4aW5zIGxpc3RlZCBhYm92ZS4gWW91IGNhbiB1c2UgdGhpc1xuICogY2xhc3MgYXMgYSBiYXNlIGNsYXNzIGZvciB5b3VyIG93biBlbGVtZW50cywgb3IgZWFzaWx5IGNyZWF0ZSB5b3VyIG93biBiYXNlXG4gKiBjbGFzcyBieSBhcHBseWluZyB0aGUgc2FtZSBzZXQgb2YgbWl4aW5zLlxuICpcbiAqIFRoZSBFbGVtZW50QmFzZSBiYXNlIGNsYXNzIGRvZXMgbm90IHJlZ2lzdGVyIGl0c2VsZiBhcyBhIGN1c3RvbSBlbGVtZW50IHdpdGhcbiAqIHRoZSBicm93c2VyLCBhbmQgaGVuY2UgY2Fubm90IGJlIGluZGVwZW5kZW50bHkgaW5zdGFudGlhdGVkLlxuICpcbiAqIEBtaXhlcyBBdHRyaWJ1dGVNYXJzaGFsbGluZ01peGluXG4gKiBAbWl4ZXMgQ29tcG9zYWJsZU1peGluXG4gKiBAbWl4ZXMgRGlzdHJpYnV0ZWRDaGlsZHJlbk1peGluXG4gKiBAbWl4ZXMgU2hhZG93RWxlbWVudFJlZmVyZW5jZXNNaXhpblxuICogQG1peGVzIFNoYWRvd1RlbXBsYXRlTWl4aW5cbiAqL1xuY2xhc3MgRWxlbWVudEJhc2UgZXh0ZW5kcyBDb21wb3NhYmxlTWl4aW4oSFRNTEVsZW1lbnQpLmNvbXBvc2UoXG4gIFNoYWRvd1RlbXBsYXRlTWl4aW4sICAgICAgICAgIC8vIGJlZm9yZSBub2RlIGZpbmRpbmcsIHNvIHNoYWRvdyByb290IGlzIHBvcHVsYXRlZFxuICBTaGFkb3dFbGVtZW50UmVmZXJlbmNlc01peGluLCAvLyBiZWZvcmUgbWFyc2hhbGxpbmcsIHNvIHByb3BlcnRpZXMgY2FuIHVzZSByZWZzXG4gIEF0dHJpYnV0ZU1hcnNoYWxsaW5nTWl4aW4sXG4gIERpc3RyaWJ1dGVkQ2hpbGRyZW5NaXhpblxuKSB7fVxuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZTtcbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgdHJhbnNwaWxlZCB0byBjcmVhdGUgYW4gRVM1LWNvbXBhdGlibGUgZGlzdHJpYnV0aW9uIGluIHdoaWNoXG4gKiB0aGUgcGFja2FnZSdzIG1haW4gZmVhdHVyZShzKSBhcmUgYXZhaWxhYmxlIHZpYSB0aGUgd2luZG93LkJhc2ljIGdsb2JhbC5cbiAqIElmIHlvdSdyZSBhbHJlYWR5IHVzaW5nIEVTNiB5b3Vyc2VsZiwgaWdub3JlIHRoaXMgZmlsZSwgYW5kIGluc3RlYWQgaW1wb3J0XG4gKiB0aGUgc291cmNlIGZpbGUocykgeW91IHdhbnQgZnJvbSB0aGUgc3JjIGZvbGRlci5cbiAqL1xuXG5pbXBvcnQgU2xpZGVzaG93IGZyb20gJy4vc3JjL1NsaWRlc2hvdyc7XG5cbndpbmRvdy5CYXNpYyA9IHdpbmRvdy5CYXNpYyB8fCB7fTtcbndpbmRvdy5CYXNpYy5TbGlkZXNob3cgPSBTbGlkZXNob3c7XG4iLCJpbXBvcnQgRWxlbWVudEJhc2UgZnJvbSAnLi4vLi4vYmFzaWMtZWxlbWVudC1iYXNlL3NyYy9FbGVtZW50QmFzZSc7XG5pbXBvcnQgQ29udGVudEl0ZW1zTWl4aW4gZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvQ29udGVudEl0ZW1zTWl4aW4nO1xuaW1wb3J0IERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW4gZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvRGlzdHJpYnV0ZWRDaGlsZHJlbkNvbnRlbnRNaXhpbic7XG5pbXBvcnQgRnJhY3Rpb25hbFNlbGVjdGlvbk1peGluIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL0ZyYWN0aW9uYWxTZWxlY3Rpb25NaXhpbic7XG5pbXBvcnQgU2VsZWN0aW9uQW5pbWF0aW9uTWl4aW4gZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvU2VsZWN0aW9uQW5pbWF0aW9uTWl4aW4nO1xuaW1wb3J0IFNlbGVjdGlvbkFyaWFBY3RpdmVNaXhpbiBmcm9tICcuLi8uLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL3NyYy9TZWxlY3Rpb25BcmlhQWN0aXZlTWl4aW4nO1xuaW1wb3J0IFNpbmdsZVNlbGVjdGlvbk1peGluIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL1NpbmdsZVNlbGVjdGlvbk1peGluJztcbmltcG9ydCBzeW1ib2xzIGZyb20gJy4uLy4uL2Jhc2ljLWNvbXBvbmVudC1taXhpbnMvc3JjL3N5bWJvbHMnO1xuaW1wb3J0IFRpbWVyU2VsZWN0aW9uTWl4aW4gZnJvbSAnLi4vLi4vYmFzaWMtY29tcG9uZW50LW1peGlucy9zcmMvVGltZXJTZWxlY3Rpb25NaXhpbic7XG5cblxuY29uc3QgYmFzZSA9IEVsZW1lbnRCYXNlLmNvbXBvc2UoXG4gIENvbnRlbnRJdGVtc01peGluLFxuICBEaXN0cmlidXRlZENoaWxkcmVuQ29udGVudE1peGluLFxuICBGcmFjdGlvbmFsU2VsZWN0aW9uTWl4aW4sXG4gIFNlbGVjdGlvbkFuaW1hdGlvbk1peGluLFxuICBTZWxlY3Rpb25BcmlhQWN0aXZlTWl4aW4sXG4gIFNpbmdsZVNlbGVjdGlvbk1peGluLFxuICBUaW1lclNlbGVjdGlvbk1peGluXG4pO1xuXG5cbi8qKlxuICogU2xpZGVzaG93IHdpdGggYW5pbWF0ZWQgdHJhbnNpdGlvbnMuXG4gKlxuICogQnkgZGVmYXVsdCB0aGUgc2xpZGVzaG93IHdpbGwgaW1tZWRpYXRlbHkgYmVnaW4gcGxheWluZyB3aGVuIGl0IGlzIGNvbm5lY3RlZFxuICogdG8gdGhlIGRvY3VtZW50LCBhZHZhbmNlIGV2ZXJ5IDMwMDAgbXMgKDMgc2Vjb25kcyksIGFuZCB1c2UgYSBzaW1wbGVcbiAqIGNyb3NzZmFkZSBlZmZlY3QuXG4gKlxuICogVGhpcyBjb21wb25lbnQgY2FuIGJlIHVzZWQgb24gaXRzIG93bi4gVG8gaW5jb3Jwb3JhdGUgc2xpZGVzaG93IGJlaGF2aW9yIGludG9cbiAqIGEgY29tcG9uZW50IG9mIHlvdXIgb3duLCBhcHBseSB0aGVcbiAqIFtUaW1lclNlbGVjdGlvbk1peGluXSguLi9iYXNpYy1jb21wb25lbnQtbWl4aW5zL2RvY3MvVGltZXJTZWxlY3Rpb25NaXhpbi5tZCkuXG4gKlxuICogQGV4dGVuZHMgRWxlbWVudEJhc2VcbiAqIEBtaXhlcyBDb250ZW50SXRlbXNNaXhpblxuICogQG1peGVzIERpc3RyaWJ1dGVkQ2hpbGRyZW5Db250ZW50TWl4aW5cbiAqIEBtaXhlcyBGcmFjdGlvbmFsU2VsZWN0aW9uTWl4aW5cbiAqIEBtaXhlcyBTZWxlY3Rpb25BbmltYXRpb25NaXhpblxuICogQG1peGVzIFNlbGVjdGlvbkFyaWFBY3RpdmVNaXhpblxuICogQG1peGVzIFNpbmdsZVNlbGVjdGlvbk1peGluXG4gKiBAbWl4ZXMgVGltZXJTZWxlY3Rpb25NaXhpblxuICovXG5jbGFzcyBTbGlkZXNob3cgZXh0ZW5kcyBiYXNlIHtcblxuICBnZXQgW3N5bWJvbHMuZGVmYXVsdHNdKCkge1xuICAgIGNvbnN0IGRlZmF1bHRzID0gc3VwZXJbc3ltYm9scy5kZWZhdWx0c10gfHwge307XG4gICAgZGVmYXVsdHMucGxheWluZyA9IHRydWU7XG4gICAgZGVmYXVsdHMuc2VsZWN0aW9uQW5pbWF0aW9uRHVyYXRpb24gPSA1MDA7XG4gICAgZGVmYXVsdHMuc2VsZWN0aW9uQW5pbWF0aW9uRWZmZWN0ID0gJ2Nyb3NzZmFkZSc7XG4gICAgZGVmYXVsdHMuc2VsZWN0aW9uUmVxdWlyZWQgPSB0cnVlO1xuICAgIGRlZmF1bHRzLnNlbGVjdGlvblRpbWVyRHVyYXRpb24gPSAzMDAwO1xuICAgIGRlZmF1bHRzLnNlbGVjdGlvbldyYXBzID0gdHJ1ZTtcbiAgICByZXR1cm4gZGVmYXVsdHM7XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgIDxzdHlsZT5cbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogLXdlYmtpdC1mbGV4O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICB9XG5cbiAgICAgICNjb250YWluZXIgOjpzbG90dGVkKCopIHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBvYmplY3QtZml0OiBjb250YWluO1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xuICAgICAgfVxuICAgICAgPC9zdHlsZT5cblxuICAgICAgPGRpdiBpZD1cImNvbnRhaW5lclwiIHJvbGU9XCJub25lXCI+XG4gICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG4gIH1cblxufVxuXG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnYmFzaWMtc2xpZGVzaG93JywgU2xpZGVzaG93KTtcbmV4cG9ydCBkZWZhdWx0IFNsaWRlc2hvdztcbiJdfQ==
