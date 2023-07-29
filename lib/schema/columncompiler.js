"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _columncompiler = _interopRequireDefault(require("knex/lib/schema/columncompiler"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
// Column Compiler
// -------
var ColumnCompiler_Firebird = /*#__PURE__*/function (_ColumnCompiler) {
  (0, _inherits2["default"])(ColumnCompiler_Firebird, _ColumnCompiler);
  var _super = _createSuper(ColumnCompiler_Firebird);
  function ColumnCompiler_Firebird() {
    var _this;
    (0, _classCallCheck2["default"])(this, ColumnCompiler_Firebird);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "modifiers", ["collate", "nullable"]);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "increments", "integer not null primary key");
    return _this;
  }
  (0, _createClass2["default"])(ColumnCompiler_Firebird, [{
    key: "collate",
    value: function collate(collation) {
      // TODO request `charset` modifier of knex column
      return collation && "character set ".concat(collation || "ASCII");
    }
  }]);
  return ColumnCompiler_Firebird;
}(_columncompiler["default"]);
var _default = ColumnCompiler_Firebird;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY29sdW1uY29tcGlsZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9jcmVhdGVTdXBlciIsIkRlcml2ZWQiLCJoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCIsIl9jcmVhdGVTdXBlckludGVybmFsIiwiU3VwZXIiLCJfZ2V0UHJvdG90eXBlT2YyIiwicmVzdWx0IiwiTmV3VGFyZ2V0IiwiY29uc3RydWN0b3IiLCJSZWZsZWN0IiwiY29uc3RydWN0IiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIiLCJzaGFtIiwiUHJveHkiLCJCb29sZWFuIiwicHJvdG90eXBlIiwidmFsdWVPZiIsImNhbGwiLCJlIiwiQ29sdW1uQ29tcGlsZXJfRmlyZWJpcmQiLCJfQ29sdW1uQ29tcGlsZXIiLCJfaW5oZXJpdHMyIiwiX3N1cGVyIiwiX3RoaXMiLCJfY2xhc3NDYWxsQ2hlY2syIiwiX2xlbiIsImxlbmd0aCIsImFyZ3MiLCJBcnJheSIsIl9rZXkiLCJjb25jYXQiLCJfZGVmaW5lUHJvcGVydHkyIiwiX2Fzc2VydFRoaXNJbml0aWFsaXplZDIiLCJfY3JlYXRlQ2xhc3MyIiwia2V5IiwidmFsdWUiLCJjb2xsYXRlIiwiY29sbGF0aW9uIiwiQ29sdW1uQ29tcGlsZXIiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NoZW1hL2NvbHVtbmNvbXBpbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2x1bW5Db21waWxlciBmcm9tIFwia25leC9saWIvc2NoZW1hL2NvbHVtbmNvbXBpbGVyXCI7XG5cbi8vIENvbHVtbiBDb21waWxlclxuLy8gLS0tLS0tLVxuXG5jbGFzcyBDb2x1bW5Db21waWxlcl9GaXJlYmlyZCBleHRlbmRzIENvbHVtbkNvbXBpbGVyIHtcbiAgbW9kaWZpZXJzID0gW1wiY29sbGF0ZVwiLCBcIm51bGxhYmxlXCJdO1xuICBpbmNyZW1lbnRzID0gXCJpbnRlZ2VyIG5vdCBudWxsIHByaW1hcnkga2V5XCI7XG5cbiAgY29sbGF0ZShjb2xsYXRpb24pIHtcbiAgICAvLyBUT0RPIHJlcXVlc3QgYGNoYXJzZXRgIG1vZGlmaWVyIG9mIGtuZXggY29sdW1uXG4gICAgcmV0dXJuIGNvbGxhdGlvbiAmJiBgY2hhcmFjdGVyIHNldCAke2NvbGxhdGlvbiB8fCBcIkFTQ0lJXCJ9YDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb2x1bW5Db21waWxlcl9GaXJlYmlyZDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxlQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBNEQsU0FBQUMsYUFBQUMsT0FBQSxRQUFBQyx5QkFBQSxHQUFBQyx5QkFBQSxvQkFBQUMscUJBQUEsUUFBQUMsS0FBQSxPQUFBQyxnQkFBQSxhQUFBTCxPQUFBLEdBQUFNLE1BQUEsTUFBQUwseUJBQUEsUUFBQU0sU0FBQSxPQUFBRixnQkFBQSxtQkFBQUcsV0FBQSxFQUFBRixNQUFBLEdBQUFHLE9BQUEsQ0FBQUMsU0FBQSxDQUFBTixLQUFBLEVBQUFPLFNBQUEsRUFBQUosU0FBQSxZQUFBRCxNQUFBLEdBQUFGLEtBQUEsQ0FBQVEsS0FBQSxPQUFBRCxTQUFBLGdCQUFBRSwyQkFBQSxtQkFBQVAsTUFBQTtBQUFBLFNBQUFKLDBCQUFBLGVBQUFPLE9BQUEscUJBQUFBLE9BQUEsQ0FBQUMsU0FBQSxvQkFBQUQsT0FBQSxDQUFBQyxTQUFBLENBQUFJLElBQUEsMkJBQUFDLEtBQUEsb0NBQUFDLE9BQUEsQ0FBQUMsU0FBQSxDQUFBQyxPQUFBLENBQUFDLElBQUEsQ0FBQVYsT0FBQSxDQUFBQyxTQUFBLENBQUFNLE9BQUEsOENBQUFJLENBQUE7QUFFNUQ7QUFDQTtBQUFBLElBRU1DLHVCQUF1QiwwQkFBQUMsZUFBQTtFQUFBLElBQUFDLFVBQUEsYUFBQUYsdUJBQUEsRUFBQUMsZUFBQTtFQUFBLElBQUFFLE1BQUEsR0FBQXpCLFlBQUEsQ0FBQXNCLHVCQUFBO0VBQUEsU0FBQUEsd0JBQUE7SUFBQSxJQUFBSSxLQUFBO0lBQUEsSUFBQUMsZ0JBQUEsbUJBQUFMLHVCQUFBO0lBQUEsU0FBQU0sSUFBQSxHQUFBaEIsU0FBQSxDQUFBaUIsTUFBQSxFQUFBQyxJQUFBLE9BQUFDLEtBQUEsQ0FBQUgsSUFBQSxHQUFBSSxJQUFBLE1BQUFBLElBQUEsR0FBQUosSUFBQSxFQUFBSSxJQUFBO01BQUFGLElBQUEsQ0FBQUUsSUFBQSxJQUFBcEIsU0FBQSxDQUFBb0IsSUFBQTtJQUFBO0lBQUFOLEtBQUEsR0FBQUQsTUFBQSxDQUFBTCxJQUFBLENBQUFQLEtBQUEsQ0FBQVksTUFBQSxTQUFBUSxNQUFBLENBQUFILElBQUE7SUFBQSxJQUFBSSxnQkFBQSxpQkFBQUMsdUJBQUEsYUFBQVQsS0FBQSxnQkFDZixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7SUFBQSxJQUFBUSxnQkFBQSxpQkFBQUMsdUJBQUEsYUFBQVQsS0FBQSxpQkFDdEIsOEJBQThCO0lBQUEsT0FBQUEsS0FBQTtFQUFBO0VBQUEsSUFBQVUsYUFBQSxhQUFBZCx1QkFBQTtJQUFBZSxHQUFBO0lBQUFDLEtBQUEsRUFFM0MsU0FBQUMsUUFBUUMsU0FBUyxFQUFFO01BQ2pCO01BQ0EsT0FBT0EsU0FBUyxxQkFBQVAsTUFBQSxDQUFxQk8sU0FBUyxJQUFJLE9BQU8sQ0FBRTtJQUM3RDtFQUFDO0VBQUEsT0FBQWxCLHVCQUFBO0FBQUEsRUFQbUNtQiwwQkFBYztBQUFBLElBQUFDLFFBQUEsR0FVckNwQix1QkFBdUI7QUFBQXFCLE9BQUEsY0FBQUQsUUFBQSJ9