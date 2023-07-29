"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _formatter = _interopRequireDefault(require("knex/lib/formatter"));
var _raw = _interopRequireDefault(require("knex/lib/raw"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Firebird_Formatter = /*#__PURE__*/function (_Formatter) {
  (0, _inherits2["default"])(Firebird_Formatter, _Formatter);
  var _super = _createSuper(Firebird_Formatter);
  function Firebird_Formatter() {
    (0, _classCallCheck2["default"])(this, Firebird_Formatter);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(Firebird_Formatter, [{
    key: "values",
    value: function values(_values) {
      var _this = this;
      if (Array.isArray(_values)) {
        if (Array.isArray(_values[0])) {
          return "( values ".concat(_values.map(function (value) {
            return "(".concat(_this.parameterize(value), ")");
          }).join(", "), ")");
        }
        return "(".concat(this.parameterize(_values), ")");
      }
      if (_values instanceof _raw["default"]) {
        return "(".concat(this.parameter(_values), ")");
      }
      return this.parameter(_values);
    }
  }]);
  return Firebird_Formatter;
}(_formatter["default"]);
var _default = Firebird_Formatter;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZm9ybWF0dGVyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfcmF3IiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJGaXJlYmlyZF9Gb3JtYXR0ZXIiLCJfRm9ybWF0dGVyIiwiX2luaGVyaXRzMiIsIl9zdXBlciIsIl9jbGFzc0NhbGxDaGVjazIiLCJfY3JlYXRlQ2xhc3MyIiwia2V5IiwidmFsdWUiLCJ2YWx1ZXMiLCJfdGhpcyIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsIm1hcCIsInBhcmFtZXRlcml6ZSIsImpvaW4iLCJSYXciLCJwYXJhbWV0ZXIiLCJGb3JtYXR0ZXIiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi9zcmMvZm9ybWF0dGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBGb3JtYXR0ZXIgZnJvbSBcImtuZXgvbGliL2Zvcm1hdHRlclwiO1xuaW1wb3J0IFJhdyBmcm9tIFwia25leC9saWIvcmF3XCI7XG5cbmNsYXNzIEZpcmViaXJkX0Zvcm1hdHRlciBleHRlbmRzIEZvcm1hdHRlciB7XG4gIHZhbHVlcyh2YWx1ZXMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXNbMF0pKSB7XG4gICAgICAgIHJldHVybiBgKCB2YWx1ZXMgJHt2YWx1ZXNcbiAgICAgICAgICAubWFwKCh2YWx1ZSkgPT4gYCgke3RoaXMucGFyYW1ldGVyaXplKHZhbHVlKX0pYClcbiAgICAgICAgICAuam9pbihcIiwgXCIpfSlgO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAoJHt0aGlzLnBhcmFtZXRlcml6ZSh2YWx1ZXMpfSlgO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZXMgaW5zdGFuY2VvZiBSYXcpIHtcbiAgICAgIHJldHVybiBgKCR7dGhpcy5wYXJhbWV0ZXIodmFsdWVzKX0pYDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJhbWV0ZXIodmFsdWVzKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGaXJlYmlyZF9Gb3JtYXR0ZXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLFVBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLElBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUErQixTQUFBRSxhQUFBQyxPQUFBLFFBQUFDLHlCQUFBLEdBQUFDLHlCQUFBLG9CQUFBQyxxQkFBQSxRQUFBQyxLQUFBLE9BQUFDLGdCQUFBLGFBQUFMLE9BQUEsR0FBQU0sTUFBQSxNQUFBTCx5QkFBQSxRQUFBTSxTQUFBLE9BQUFGLGdCQUFBLG1CQUFBRyxXQUFBLEVBQUFGLE1BQUEsR0FBQUcsT0FBQSxDQUFBQyxTQUFBLENBQUFOLEtBQUEsRUFBQU8sU0FBQSxFQUFBSixTQUFBLFlBQUFELE1BQUEsR0FBQUYsS0FBQSxDQUFBUSxLQUFBLE9BQUFELFNBQUEsZ0JBQUFFLDJCQUFBLG1CQUFBUCxNQUFBO0FBQUEsU0FBQUosMEJBQUEsZUFBQU8sT0FBQSxxQkFBQUEsT0FBQSxDQUFBQyxTQUFBLG9CQUFBRCxPQUFBLENBQUFDLFNBQUEsQ0FBQUksSUFBQSwyQkFBQUMsS0FBQSxvQ0FBQUMsT0FBQSxDQUFBQyxTQUFBLENBQUFDLE9BQUEsQ0FBQUMsSUFBQSxDQUFBVixPQUFBLENBQUFDLFNBQUEsQ0FBQU0sT0FBQSw4Q0FBQUksQ0FBQTtBQUFBLElBRXpCQyxrQkFBa0IsMEJBQUFDLFVBQUE7RUFBQSxJQUFBQyxVQUFBLGFBQUFGLGtCQUFBLEVBQUFDLFVBQUE7RUFBQSxJQUFBRSxNQUFBLEdBQUF6QixZQUFBLENBQUFzQixrQkFBQTtFQUFBLFNBQUFBLG1CQUFBO0lBQUEsSUFBQUksZ0JBQUEsbUJBQUFKLGtCQUFBO0lBQUEsT0FBQUcsTUFBQSxDQUFBWixLQUFBLE9BQUFELFNBQUE7RUFBQTtFQUFBLElBQUFlLGFBQUEsYUFBQUwsa0JBQUE7SUFBQU0sR0FBQTtJQUFBQyxLQUFBLEVBQ3RCLFNBQUFDLE9BQU9BLE9BQU0sRUFBRTtNQUFBLElBQUFDLEtBQUE7TUFDYixJQUFJQyxLQUFLLENBQUNDLE9BQU8sQ0FBQ0gsT0FBTSxDQUFDLEVBQUU7UUFDekIsSUFBSUUsS0FBSyxDQUFDQyxPQUFPLENBQUNILE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1VBQzVCLG1CQUFBSSxNQUFBLENBQW1CSixPQUFNLENBQ3RCSyxHQUFHLENBQUMsVUFBQ04sS0FBSztZQUFBLFdBQUFLLE1BQUEsQ0FBU0gsS0FBSSxDQUFDSyxZQUFZLENBQUNQLEtBQUssQ0FBQztVQUFBLENBQUcsQ0FBQyxDQUMvQ1EsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNmO1FBQ0EsV0FBQUgsTUFBQSxDQUFXLElBQUksQ0FBQ0UsWUFBWSxDQUFDTixPQUFNLENBQUM7TUFDdEM7TUFFQSxJQUFJQSxPQUFNLFlBQVlRLGVBQUcsRUFBRTtRQUN6QixXQUFBSixNQUFBLENBQVcsSUFBSSxDQUFDSyxTQUFTLENBQUNULE9BQU0sQ0FBQztNQUNuQztNQUVBLE9BQU8sSUFBSSxDQUFDUyxTQUFTLENBQUNULE9BQU0sQ0FBQztJQUMvQjtFQUFDO0VBQUEsT0FBQVIsa0JBQUE7QUFBQSxFQWhCOEJrQixxQkFBUztBQUFBLElBQUFDLFFBQUEsR0FtQjNCbkIsa0JBQWtCO0FBQUFvQixPQUFBLGNBQUFELFFBQUEifQ==