!function t(e,o,n){function r(c,u){if(!o[c]){if(!e[c]){var l="function"==typeof require&&require;if(!u&&l)return l(c,!0);if(i)return i(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var s=o[c]={exports:{}};e[c][0].call(s.exports,function(t){var o=e[c][1][t];return r(o?o:t)},s,s.exports,t,e,o,n)}return o[c].exports}for(var i="function"==typeof require&&require,c=0;c<n.length;c++)r(n[c]);return r}({1:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t){var e=y[t];if(!e){var o=/-([a-z])/g;e=t.replace(o,function(t){return t[1].toUpperCase()}),y[t]=e}return e}function l(t){if(t===HTMLElement||t===Object)return[];var e=Object.getPrototypeOf(t.prototype).constructor,o=l(e),n=Object.getOwnPropertyNames(t.prototype),r=n.filter(function(e){return"function"==typeof Object.getOwnPropertyDescriptor(t.prototype,e).set}),i=r.map(function(t){return a(t)}),c=i.filter(function(t){return o.indexOf(t)<0});return o.concat(c)}function a(t){var e=h[t];if(!e){var o=/([A-Z])/g;e=t.replace(o,"-$1").toLowerCase()}return e}Object.defineProperty(o,"__esModule",{value:!0});var s=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}(),f=function t(e,o,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,o);if(void 0===r){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,o,n)}if("value"in r)return r.value;var c=r.get;if(void 0!==c)return c.call(n)},p=t("./safeAttributes"),d=n(p),y={},h={};o.default=function(t){var e=function(t){function e(){return r(this,e),i(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return c(e,t),s(e,[{key:"attributeChangedCallback",value:function(t,o,n){f(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"attributeChangedCallback",this)&&f(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"attributeChangedCallback",this).call(this);var r=u(t);r in this&&!(r in HTMLElement.prototype)&&(this[r]=n)}},{key:"connectedCallback",value:function(){f(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"connectedCallback",this)&&f(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"connectedCallback",this).call(this),d.default.connected(this)}},{key:"reflectAttribute",value:function(t,e){return d.default.setAttribute(this,t,e)}},{key:"reflectClass",value:function(t,e){return d.default.toggleClass(this,t,e)}}],[{key:"observedAttributes",get:function(){return l(this)}}]),e}(t);return e}},{"./safeAttributes":11}],2:[function(t,e,o){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function c(t,e){if("function"==typeof e)return e(t);var o=function(t){function e(){return n(this,e),r(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return i(e,t),e}(t);return u(e,o.prototype,a),o}function u(t,e){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return Object.getOwnPropertyNames(t).forEach(function(n){if(o.indexOf(n)<0){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r)}}),e}Object.defineProperty(o,"__esModule",{value:!0});var l=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}();o.default=function(t){var e=function(t){function e(){return n(this,e),r(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return i(e,t),l(e,null,[{key:"compose",value:function(){for(var t=arguments.length,e=Array(t),o=0;o<t;o++)e[o]=arguments[o];return e.reduce(c,this)}}]),e}(t);return e};var a=["constructor"]},{}],3:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t){var e=["link","script","style","template"];return[].filter.call(t,function(t){return!t.localName||e.indexOf(t.localName)<0})}Object.defineProperty(o,"__esModule",{value:!0});var l=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}(),a=function t(e,o,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,o);if(void 0===r){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,o,n)}if("value"in r)return r.value;var c=r.get;if(void 0!==c)return c.call(n)},s=t("./createSymbol"),f=n(s),p=t("./toggleClass"),d=n(p),y=t("./symbols"),h=n(y),b=(0,f.default)("items"),_=(0,f.default)("itemInitialized");o.default=function(t){var e=function(t){function e(){return r(this,e),i(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return c(e,t),l(e,[{key:"contentChanged",value:function(){a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"contentChanged",this)&&a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"contentChanged",this).call(this),this[b]=null,this[h.default.itemsChanged]()}},{key:h.default.itemAdded,value:function(t){a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),h.default.itemAdded,this)&&a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),h.default.itemAdded,this).call(this,t)}},{key:h.default.itemSelected,value:function(t,o){a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),h.default.itemSelected,this)&&a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),h.default.itemSelected,this).call(this,t,o),(0,d.default)(t,"selected",o)}},{key:h.default.itemsChanged,value:function(){var t=this;a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),h.default.itemsChanged,this)&&a(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),h.default.itemsChanged,this).call(this),Array.prototype.forEach.call(this.items,function(e){e[_]||(t[h.default.itemAdded](e),e[_]=!0)}),this.dispatchEvent(new CustomEvent("items-changed"))}},{key:"items",get:function(){var t=void 0;return null==this[b]?(t=u(this.content),null===this[b]&&(this[b]=t)):t=this[b],t}}]),e}(t);return e}},{"./createSymbol":9,"./symbols":12,"./toggleClass":13}],4:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(o,"__esModule",{value:!0});var u=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}(),l=function t(e,o,n,r){var i=Object.getOwnPropertyDescriptor(e,o);if(void 0===i){var c=Object.getPrototypeOf(e);null!==c&&t(c,o,n,r)}else if("value"in i&&i.writable)i.value=n;else{var u=i.set;void 0!==u&&u.call(r,n)}return n},a=function t(e,o,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,o);if(void 0===r){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,o,n)}if("value"in r)return r.value;var c=r.get;if(void 0!==c)return c.call(n)},s=t("./microtask"),f=n(s);o.default=function(t){var e=function(e){function o(){r(this,o);var t=i(this,(o.__proto__||Object.getPrototypeOf(o)).call(this));if(t.shadowRoot){var e=t.shadowRoot.querySelectorAll("slot");e.forEach(function(e){return e.addEventListener("slotchange",function(e){t.contentChanged()})})}return(0,f.default)(function(){return t.contentChanged()}),t}return c(o,e),u(o,[{key:"contentChanged",value:function(){a(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"contentChanged",this)&&a(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"contentChanged",this).call(this);var t=new CustomEvent("content-changed");this.dispatchEvent(t)}},{key:"content",get:function(){var t=this.distributedChildren;return"undefined"==typeof t&&console.warn('DistributedChildrenContentMixin expects the component to define a "distributedChildren" property.'),t},set:function(e){"content"in t.prototype&&l(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"content",e,this)}}]),o}(t);return e}},{"./microtask":10}],5:[function(t,e,o){"use strict";function n(t){if(Array.isArray(t)){for(var e=0,o=Array(t.length);e<t.length;e++)o[e]=t[e];return o}return Array.from(t)}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e){var o,r=Array.prototype.map.call(t,function(t){var o="undefined"!=typeof HTMLSlotElement?t instanceof HTMLSlotElement:"slot"===t.localName;if(o){var n=t.assignedNodes({flatten:!0});return n?u(n,e):[]}return t instanceof HTMLElement?[t]:t instanceof Text&&e?[t]:[]}),i=(o=[]).concat.apply(o,n(r));return i}Object.defineProperty(o,"__esModule",{value:!0});var l=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}();o.default=function(t){var e=function(t){function e(){return r(this,e),i(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return c(e,t),l(e,[{key:"distributedChildren",get:function(){return u(this.children,!1)}},{key:"distributedChildNodes",get:function(){return u(this.childNodes,!0)}},{key:"distributedTextContent",get:function(){var t=this.distributedChildNodes.map(function(t){return t.textContent});return t.join("")}}]),e}(t);return e}},{}],6:[function(t,e,o){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(o,"__esModule",{value:!0}),o.default=function(t){var e=function(t){function e(){n(this,e);var t=r(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));if(t.shadowRoot){t.$={};var o=t.shadowRoot.querySelectorAll("[id]");[].forEach.call(o,function(e){var o=e.getAttribute("id");t.$[o]=e})}return t}return i(e,t),e}(t);return e}},{}],7:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t){var e=document.createElement("template"),o=document.createElement("div");for(o.innerHTML=t;o.childNodes.length>0;)e.content.appendChild(o.childNodes[0]);return e}function l(t,e){window.WebComponents.ShadowCSS.shimStyling(t.content,e)}Object.defineProperty(o,"__esModule",{value:!0});var a=t("../src/symbols"),s=n(a);o.default=function(t){var e=function(t){function e(){r(this,e);var t=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this)),o=t[s.default.template];if(o){"string"==typeof o&&(o=u(o)),window.ShadowDOMPolyfill&&l(o,t.localName);var n=t.attachShadow({mode:"open"}),c=document.importNode(o.content,!0);n.appendChild(c)}return t}return c(e,t),e}(t);return e}},{"../src/symbols":12}],8:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e){var o=t.items.length,n=t.selectionWraps?(e%o+o)%o:Math.max(Math.min(e,o-1),0),r=t.selectedIndex;return r!==n&&(t.selectedIndex=n,!0)}function l(t){var e=t.items,o=e?e.length:0,n=t.selectedItem;if(n)if(0===o)t.selectedItem=null;else{var r=Array.prototype.indexOf.call(e,n),i=t.selectedIndex;if(r<0){var c=Math.min(i,o-1);t.selectedItem=e[c]}else r!==i&&(t.selectedIndex=r)}else t.selectionRequired&&(t.selectedIndex=0)}function a(t){var e=void 0,o=void 0,n=t.items;if(null!=n&&0!==n.length||(e=!1,o=!1),t.selectionWraps)e=!0,o=!0;else{var r=t.selectedIndex;r<0&&n.length>0?(e=!0,o=!0):(o=r>0,e=r<n.length-1)}t.canSelectNext!==e&&(t.canSelectNext=e),t.canSelectPrevious!==o&&(t.canSelectPrevious=o)}Object.defineProperty(o,"__esModule",{value:!0});var s=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}(),f=function t(e,o,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,o);if(void 0===r){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,o,n)}if("value"in r)return r.value;var c=r.get;if(void 0!==c)return c.call(n)},p=function t(e,o,n,r){var i=Object.getOwnPropertyDescriptor(e,o);if(void 0===i){var c=Object.getPrototypeOf(e);null!==c&&t(c,o,n,r)}else if("value"in i&&i.writable)i.value=n;else{var u=i.set;void 0!==u&&u.call(r,n)}return n},d=t("./createSymbol"),y=n(d),h=t("./symbols"),b=n(h),_=(0,y.default)("canSelectNext"),v=(0,y.default)("canSelectPrevious"),O=(0,y.default)("selectionRequired"),m=(0,y.default)("selectionWraps"),g=(0,y.default)("externalSelectedIndex"),j=(0,y.default)("externalSelectedItem"),w=(0,y.default)("internalSelectedIndex"),P=(0,y.default)("internalSelectedItem");o.default=function(t){var e=function(e){function o(){r(this,o);var t=i(this,(o.__proto__||Object.getPrototypeOf(o)).call(this));return"undefined"==typeof t.selectionRequired&&(t.selectionRequired=t[b.default.defaults].selectionRequired),"undefined"==typeof t.selectionWraps&&(t.selectionWraps=t[b.default.defaults].selectionWraps),t}return c(o,e),s(o,[{key:b.default.itemAdded,value:function(t){f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),b.default.itemAdded,this)&&f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),b.default.itemAdded,this).call(this,t),this[b.default.itemSelected](t,t===this.selectedItem)}},{key:b.default.itemsChanged,value:function(){f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),b.default.itemsChanged,this)&&f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),b.default.itemsChanged,this).call(this),l(this),a(this)}},{key:b.default.itemSelected,value:function(t,e){f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),b.default.itemSelected,this)&&f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),b.default.itemSelected,this).call(this,t,e)}},{key:"selectFirst",value:function(){return f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectFirst",this)&&f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectFirst",this).call(this),u(this,0)}},{key:"selectLast",value:function(){return f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectLast",this)&&f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectLast",this).call(this),u(this,this.items.length-1)}},{key:"selectNext",value:function(){return f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectNext",this)&&f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectNext",this).call(this),u(this,this.selectedIndex+1)}},{key:"selectPrevious",value:function(){f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectPrevious",this)&&f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectPrevious",this).call(this);var t=this.selectedIndex<0?this.items.length-1:this.selectedIndex-1;return u(this,t)}},{key:"canSelectNext",get:function(){return this[_]},set:function(e){var n=this[_];this[_]=e,"canSelectNext"in t.prototype&&p(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"canSelectNext",e,this),e!==n&&this.dispatchEvent(new CustomEvent("can-select-next-changed"))}},{key:"canSelectPrevious",get:function(){return this[v]},set:function(e){var n=this[v];this[v]=e,"canSelectPrevious"in t.prototype&&p(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"canSelectPrevious",e,this),e!==n&&this.dispatchEvent(new CustomEvent("can-select-previous-changed"))}},{key:b.default.defaults,get:function(){var t=f(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),b.default.defaults,this)||{};return t.selectionRequired=!1,t.selectionWraps=!1,t}},{key:"selectedIndex",get:function(){return null!=this[g]?this[g]:-1},set:function(e){var n=this[w],r=void 0;if(e!==this[g]){var i=this.items,c=i&&i.length>0;c&&e>=0&&e<i.length||(e=-1),this[g]=e,r=c&&e>=0?i[e]:null,this[j]=r}else r=this[j];if("selectedIndex"in t.prototype&&p(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectedIndex",e,this),e!==n){this[w]=e;var u=new CustomEvent("selected-index-changed",{detail:{selectedIndex:e,value:e}});this.dispatchEvent(u)}this[P]!==r&&(this.selectedItem=r)}},{key:"selectedItem",get:function(){return this[j]||null},set:function(e){var n=this[P],r=void 0;if(e!==this[j]){var i=this.items,c=i&&i.length>0;r=c?Array.prototype.indexOf.call(i,e):-1,this[g]=r,r<0&&(e=null),this[j]=e}else r=this[g];if("selectedItem"in t.prototype&&p(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectedItem",e,this),e!==n){this[P]=e,n&&this[b.default.itemSelected](n,!1),e&&this[b.default.itemSelected](e,!0),a(this);var u=new CustomEvent("selected-item-changed",{detail:{selectedItem:e,value:e}});this.dispatchEvent(u)}this[w]!==r&&(this.selectedIndex=r)}},{key:"selectionRequired",get:function(){return this[O]},set:function(e){this[O]=e,"selectionRequired"in t.prototype&&p(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectionRequired",e,this),l(this)}},{key:"selectionWraps",get:function(){return this[m]},set:function(e){this[m]="true"===String(e),"selectionWraps"in t.prototype&&p(o.prototype.__proto__||Object.getPrototypeOf(o.prototype),"selectionWraps",e,this),a(this)}}]),o}(t);return e}},{"./createSymbol":9,"./symbols":12}],9:[function(t,e,o){"use strict";function n(t){return"function"==typeof Symbol?Symbol(t):"_"+t}Object.defineProperty(o,"__esModule",{value:!0}),o.default=n},{}],10:[function(t,e,o){"use strict";function n(t){i.push(t),c.textContent=++u}function r(){for(;i.length>0;){var t=i.shift();t()}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=n;var i=[],c=document.createTextNode(""),u=0,l=new MutationObserver(r);l.observe(c,{characterData:!0})},{}],11:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e,o){if(null===o||"undefined"==typeof o)t.removeAttribute(e);else{var n=String(o);t.getAttribute(e)!==n&&t.setAttribute(e,o)}}Object.defineProperty(o,"__esModule",{value:!0});var i=t("./createSymbol"),c=n(i),u=t("./toggleClass"),l=n(u),a=(0,c.default)("safeToSetAttributes"),s=(0,c.default)("pendingAttributes"),f=(0,c.default)("pendingClasses");o.default={connected:function(t){if(t[a]=!0,t[s]){for(var e in t[s]){var o=t[s][e];r(t,e,o)}t[s]=null}if(t[f]){for(var n in t[f]){var i=t[f][n];(0,l.default)(t,n,i)}t[f]=null}},setAttribute:function(t,e,o){t[a]?r(t,e,o):(t[s]||(t[s]={}),t[s][e]=o)},toggleClass:function(t,e,o){t[a]?(0,l.default)(t,e,o):(t[f]||(t[f]={}),t[f][e]=o)}}},{"./createSymbol":9,"./toggleClass":13}],12:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(o,"__esModule",{value:!0});var r=t("./createSymbol"),i=n(r),c={defaults:(0,i.default)("defaults"),dragging:(0,i.default)("dragging"),goDown:(0,i.default)("goDown"),goEnd:(0,i.default)("goEnd"),goLeft:(0,i.default)("goLeft"),goRight:(0,i.default)("goRight"),goStart:(0,i.default)("goStart"),goUp:(0,i.default)("goUp"),itemAdded:(0,i.default)("itemAdded"),itemsChanged:(0,i.default)("itemsChanged"),itemSelected:(0,i.default)("itemSelected"),keydown:(0,i.default)("keydown"),template:(0,i.default)("template")};o.default=c},{"./createSymbol":9}],13:[function(t,e,o){"use strict";function n(t,e,o){var n=t.classList,r="undefined"==typeof o?!n.contains(e):o;return r?n.add(e):n.remove(e),r}Object.defineProperty(o,"__esModule",{value:!0}),o.default=n},{}],14:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(o,"__esModule",{value:!0});var u=t("../../basic-component-mixins/src/AttributeMarshallingMixin"),l=n(u),a=t("../../basic-component-mixins/src/ComposableMixin"),s=n(a),f=t("../../basic-component-mixins/src/DistributedChildrenMixin"),p=n(f),d=t("../../basic-component-mixins/src/ShadowElementReferencesMixin"),y=n(d),h=t("../../basic-component-mixins/src/ShadowTemplateMixin"),b=n(h),_=function(t){function e(){return r(this,e),i(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return c(e,t),e}((0,s.default)(HTMLElement).compose(b.default,y.default,l.default,p.default));o.default=_},{"../../basic-component-mixins/src/AttributeMarshallingMixin":1,"../../basic-component-mixins/src/ComposableMixin":2,"../../basic-component-mixins/src/DistributedChildrenMixin":5,"../../basic-component-mixins/src/ShadowElementReferencesMixin":6,"../../basic-component-mixins/src/ShadowTemplateMixin":7}],15:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}var r=t("./src/Modes"),i=n(r);window.Basic=window.Basic||{},window.Basic.Modes=i.default},{"./src/Modes":16}],16:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(o,"__esModule",{value:!0});var u=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}(),l=function t(e,o,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,o);if(void 0===r){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,o,n)}if("value"in r)return r.value;var c=r.get;if(void 0!==c)return c.call(n)},a=t("../../basic-element-base/src/ElementBase"),s=n(a),f=t("../../basic-component-mixins/src/DistributedChildrenContentMixin"),p=n(f),d=t("../../basic-component-mixins/src/ContentItemsMixin"),y=n(d),h=t("../../basic-component-mixins/src/SingleSelectionMixin"),b=n(h),_=t("../../basic-component-mixins/src/symbols"),v=n(_),O=s.default.compose(y.default,p.default,b.default),m=function(t){function e(){return r(this,e),i(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return c(e,t),u(e,[{key:v.default.itemSelected,value:function(t,o){l(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),v.default.itemSelected,this)&&l(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),v.default.itemSelected,this).call(this,t,o),t.style.display=o?"":"none",t.setAttribute("aria-hidden",!o)}},{key:v.default.defaults,get:function(){var t=l(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),v.default.defaults,this)||{};return t.selectionRequired=!0,t}},{key:v.default.template,get:function(){return"<slot></slot>"}}]),e}(O);customElements.define("basic-modes",m),o.default=m},{"../../basic-component-mixins/src/ContentItemsMixin":3,"../../basic-component-mixins/src/DistributedChildrenContentMixin":4,"../../basic-component-mixins/src/SingleSelectionMixin":8,"../../basic-component-mixins/src/symbols":12,"../../basic-element-base/src/ElementBase":14}]},{},[15]);
//# sourceMappingURL=basic-modes.js.map
