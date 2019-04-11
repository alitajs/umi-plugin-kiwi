"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _path = require("path");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _default(api, options) {
  console.log(api);
  api.registerCommand('kiwiinit', {
    hide: true
  }, args => {
    require('child_process').exec('kiwi --init', [], (error, stdout, stderr) => {
      if (error) {
        console.error('exec error: ' + error);
        return;
      }

      console.log(stdout);
      console.log(stderr);
    });
  });
  api.modifyAFWebpackOpts(memo => {
    return _objectSpread({}, memo, {
      alias: _objectSpread({}, memo.alias || {}, {
        'umi/I18N': (0, _path.join)(__dirname, './I18N.js')
      })
    });
  });
}