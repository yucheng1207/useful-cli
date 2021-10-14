module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1622380344269, function(require, module, exports) {
// @flow

var interpret = require('format-message-interpret')
var parse = require('format-message-parse')
var plurals = require('format-message-interpret/plurals')
var supportedExp = new RegExp(
  '^(' + Object.keys(plurals).join('|') + ')\\b'
)

/*::
import type { Types } from 'format-message-interpret'
import type { AST } from 'format-message-parse'
type Options = {
  types: Types
}
type Internals = {
  ast: AST,
  format: (args?: Object) => string,
  locale: string,
  locales?: string | string[],
  toParts?: (args?: Object) => any[],
  options?: Options
}
*/

var internals/*: WeakMap<Object, Internals> */ = new WeakMap()

/*!
 * Intl.MessageFormat prollyfill
 * Copyright(c) 2015 Andy VanWagoner
 * MIT licensed
 **/
function MessageFormat (
  pattern/*: string */,
  locales/*:: ?: string | string[] */,
  options/*:: ?: Options */
) {
  if (!(this instanceof MessageFormat) || internals.has(this)) {
    throw new TypeError('calling MessageFormat constructor without new is invalid')
  }
  var ast = parse(pattern)
  internals.set(this, {
    ast: ast,
    format: interpret(ast, locales, options && options.types),
    locale: MessageFormat.supportedLocalesOf(locales)[0] || 'en',
    locales: locales,
    options: options
  })
}
module.exports = MessageFormat

// $FlowFixMe It thinks `value` needs to be defined for format
Object.defineProperties(MessageFormat.prototype, {
  format: {
    configurable: true,
    get: function format () {
      var values = internals.get(this)
      if (!values) throw new TypeError('MessageFormat.prototype.format called on value that\'s not an object initialized as a MessageFormat')
      return values.format
    }
  },
  formatToParts: {
    configurable: true,
    writable: true,
    value: function formatToParts (args/*:: ?: Object */) {
      var values = internals.get(this)
      if (!values) throw new TypeError('MessageFormat.prototype.formatToParts called on value that\'s not an object initialized as a MessageFormat')
      var frmt = values.toParts || (values.toParts = interpret.toParts(
        values.ast,
        values.locales,
        values.options && values.options.types
      ))
      return frmt(args)
    }
  },
  resolvedOptions: {
    configurable: true,
    writable: true,
    value: function resolvedOptions () {
      var values = internals.get(this)
      if (!values) throw new TypeError('MessageFormat.prototype.resolvedOptions called on value that\'s not an object initialized as a MessageFormat')
      return {
        locale: values.locale
      }
    }
  }
})

/* istanbul ignore else */
if (typeof Symbol !== 'undefined') {
  Object.defineProperty(MessageFormat.prototype, Symbol.toStringTag, { value: 'Object' })
}

Object.defineProperties(MessageFormat, {
  supportedLocalesOf: {
    configurable: true,
    writable: true,
    value: function supportedLocalesOf (requestedLocales/*:: ?: string | string[] */) {
      return [].concat(
        Intl.NumberFormat.supportedLocalesOf(requestedLocales),
        Intl.DateTimeFormat.supportedLocalesOf(requestedLocales),
        Intl.PluralRules ? Intl.PluralRules.supportedLocalesOf(requestedLocales) : [],
        [].concat(requestedLocales || []).filter(function (locale) {
          return supportedExp.test(locale)
        })
      ).filter(function (v, i, a) { return a.indexOf(v) === i })
    }
  }
})

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1622380344269);
})()
//# sourceMappingURL=index.js.map