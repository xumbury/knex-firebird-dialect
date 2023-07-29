"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _columnbuilder = _interopRequireDefault(require("knex/lib/schema/columnbuilder"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ColumnBuilder_Firebird = /*#__PURE__*/function (_ColumnBuilder) {
  (0, _inherits2["default"])(ColumnBuilder_Firebird, _ColumnBuilder);
  var _super = _createSuper(ColumnBuilder_Firebird);
  function ColumnBuilder_Firebird() {
    (0, _classCallCheck2["default"])(this, ColumnBuilder_Firebird);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(ColumnBuilder_Firebird, [{
    key: "primary",
    value: function primary() {
      this.notNullable();
      return (0, _get2["default"])((0, _getPrototypeOf2["default"])(ColumnBuilder_Firebird.prototype), "primary", this).apply(this, arguments);
    }
  }, {
    key: "nullable",
    value: function nullable() {
      if (arguments.length === 0 || arguments['0'] === true) {
        return this;
      }
      return (0, _get2["default"])((0, _getPrototypeOf2["default"])(ColumnBuilder_Firebird.prototype), "nullable", this).apply(this, arguments);
    }
  }]);
  return ColumnBuilder_Firebird;
}(_columnbuilder["default"]);
var _default = ColumnBuilder_Firebird;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY29sdW1uYnVpbGRlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJDb2x1bW5CdWlsZGVyX0ZpcmViaXJkIiwiX0NvbHVtbkJ1aWxkZXIiLCJfaW5oZXJpdHMyIiwiX3N1cGVyIiwiX2NsYXNzQ2FsbENoZWNrMiIsIl9jcmVhdGVDbGFzczIiLCJrZXkiLCJ2YWx1ZSIsInByaW1hcnkiLCJub3ROdWxsYWJsZSIsIl9nZXQyIiwibnVsbGFibGUiLCJsZW5ndGgiLCJDb2x1bW5CdWlsZGVyIiwiX2RlZmF1bHQiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjaGVtYS9jb2x1bW5idWlsZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2x1bW5CdWlsZGVyIGZyb20gXCJrbmV4L2xpYi9zY2hlbWEvY29sdW1uYnVpbGRlclwiO1xuXG5jbGFzcyBDb2x1bW5CdWlsZGVyX0ZpcmViaXJkIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG5cdHByaW1hcnkoKSB7XG5cdFx0dGhpcy5ub3ROdWxsYWJsZSgpO1xuXHRcdHJldHVybiBzdXBlci5wcmltYXJ5KC4uLmFyZ3VtZW50cyk7XG5cdH1cblxuXHRudWxsYWJsZSgpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBhcmd1bWVudHNbJzAnXSA9PT0gdHJ1ZSkge1xuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9XG5cdFx0cmV0dXJuIHN1cGVyLm51bGxhYmxlKC4uLmFyZ3VtZW50cylcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb2x1bW5CdWlsZGVyX0ZpcmViaXJkXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxjQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBMEQsU0FBQUMsYUFBQUMsT0FBQSxRQUFBQyx5QkFBQSxHQUFBQyx5QkFBQSxvQkFBQUMscUJBQUEsUUFBQUMsS0FBQSxPQUFBQyxnQkFBQSxhQUFBTCxPQUFBLEdBQUFNLE1BQUEsTUFBQUwseUJBQUEsUUFBQU0sU0FBQSxPQUFBRixnQkFBQSxtQkFBQUcsV0FBQSxFQUFBRixNQUFBLEdBQUFHLE9BQUEsQ0FBQUMsU0FBQSxDQUFBTixLQUFBLEVBQUFPLFNBQUEsRUFBQUosU0FBQSxZQUFBRCxNQUFBLEdBQUFGLEtBQUEsQ0FBQVEsS0FBQSxPQUFBRCxTQUFBLGdCQUFBRSwyQkFBQSxtQkFBQVAsTUFBQTtBQUFBLFNBQUFKLDBCQUFBLGVBQUFPLE9BQUEscUJBQUFBLE9BQUEsQ0FBQUMsU0FBQSxvQkFBQUQsT0FBQSxDQUFBQyxTQUFBLENBQUFJLElBQUEsMkJBQUFDLEtBQUEsb0NBQUFDLE9BQUEsQ0FBQUMsU0FBQSxDQUFBQyxPQUFBLENBQUFDLElBQUEsQ0FBQVYsT0FBQSxDQUFBQyxTQUFBLENBQUFNLE9BQUEsOENBQUFJLENBQUE7QUFBQSxJQUVwREMsc0JBQXNCLDBCQUFBQyxjQUFBO0VBQUEsSUFBQUMsVUFBQSxhQUFBRixzQkFBQSxFQUFBQyxjQUFBO0VBQUEsSUFBQUUsTUFBQSxHQUFBekIsWUFBQSxDQUFBc0Isc0JBQUE7RUFBQSxTQUFBQSx1QkFBQTtJQUFBLElBQUFJLGdCQUFBLG1CQUFBSixzQkFBQTtJQUFBLE9BQUFHLE1BQUEsQ0FBQVosS0FBQSxPQUFBRCxTQUFBO0VBQUE7RUFBQSxJQUFBZSxhQUFBLGFBQUFMLHNCQUFBO0lBQUFNLEdBQUE7SUFBQUMsS0FBQSxFQUMzQixTQUFBQyxRQUFBLEVBQVU7TUFDVCxJQUFJLENBQUNDLFdBQVcsQ0FBQyxDQUFDO01BQ2xCLFdBQUFDLEtBQUEsaUJBQUExQixnQkFBQSxhQUFBZ0Isc0JBQUEsQ0FBQUosU0FBQSxvQkFBQUwsS0FBQSxPQUF3QkQsU0FBUztJQUNsQztFQUFDO0lBQUFnQixHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBSSxTQUFBLEVBQVc7TUFDVixJQUFJckIsU0FBUyxDQUFDc0IsTUFBTSxLQUFLLENBQUMsSUFBSXRCLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDdEQsT0FBTyxJQUFJO01BQ1o7TUFDQSxXQUFBb0IsS0FBQSxpQkFBQTFCLGdCQUFBLGFBQUFnQixzQkFBQSxDQUFBSixTQUFBLHFCQUFBTCxLQUFBLE9BQXlCRCxTQUFTO0lBQ25DO0VBQUM7RUFBQSxPQUFBVSxzQkFBQTtBQUFBLEVBWG1DYSx5QkFBYTtBQUFBLElBQUFDLFFBQUEsR0FjbkNkLHNCQUFzQjtBQUFBZSxPQUFBLGNBQUFELFFBQUEifQ==