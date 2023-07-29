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
var _compiler = _interopRequireDefault(require("knex/lib/schema/compiler"));
var _lodash = require("lodash");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } } // Firebird: Column Builder & Compiler
// -------
// Schema Compiler
// -------
var SchemaCompiler_Firebird = /*#__PURE__*/function (_SchemaCompiler) {
  (0, _inherits2["default"])(SchemaCompiler_Firebird, _SchemaCompiler);
  var _super = _createSuper(SchemaCompiler_Firebird);
  function SchemaCompiler_Firebird() {
    (0, _classCallCheck2["default"])(this, SchemaCompiler_Firebird);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(SchemaCompiler_Firebird, [{
    key: "hasTable",
    value: function hasTable(tableName) {
      var fullTableName = this.formatter.wrap(prefixedTableName(this.schema, String(tableName))).toUpperCase();
      var sql = "select 1 as x from rdb$relations where rdb$relation_name = '".concat(fullTableName, "'");
      this.pushQuery({
        sql: sql,
        output: function output(raw) {
          var result = (0, _lodash.flatten)(raw).shift();
          if (!result || !(result instanceof Object)) {
            return;
          }
          return Number(result.x) === 1;
        }
      });
    }

    // Compile the query to determine if a column exists.
  }, {
    key: "hasColumn",
    value: function hasColumn(tableName, column) {
      this.pushQuery({
        sql: "select i.rdb$field_name as \"Field\" from " + "rdb$relations r join rdb$RELATION_FIELDS i " + "on (i.rdb$relation_name = r.rdb$relation_name) " + "where r.rdb$relation_name = '".concat(this.formatter.wrap(tableName.toUpperCase()), "'"),
        output: function output(resp) {
          var _this = this;
          return (0, _lodash.some)((0, _lodash.flatten)(resp), function (col) {
            return _this.client.wrapIdentifier(col.field.trim().toLowerCase()) === _this.client.wrapIdentifier(column.trim().toLowerCase());
          });
        }
      });
    }
  }, {
    key: "dropTableIfExists",
    value: function dropTableIfExists(tableName) {
      var fullTableName = this.formatter.wrap(prefixedTableName(this.schema, tableName)).toUpperCase();
      var dropTableSql = this.dropTablePrefix + fullTableName;
      this.pushQuery("\n      EXECUTE BLOCK AS BEGIN\n      if (exists(select 1 from rdb$relations where rdb$relation_name = '".concat(fullTableName, "')) then\n      execute statement '").concat(dropTableSql, "';\n      END\n    "));
      return this;
    }
  }, {
    key: "renameTable",
    value: function renameTable(tableName, to) {
      throw new Error("".concat(this.name, " is not implemented for this dialect (http://www.firebirdfaq.org/faq363/)."));
    }
  }]);
  return SchemaCompiler_Firebird;
}(_compiler["default"]);
function prefixedTableName(prefix, table) {
  return prefix ? "".concat(prefix, ".").concat(table) : table;
}
var _default = SchemaCompiler_Firebird;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY29tcGlsZXIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9sb2Rhc2giLCJfY3JlYXRlU3VwZXIiLCJEZXJpdmVkIiwiaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCIsIl9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfY3JlYXRlU3VwZXJJbnRlcm5hbCIsIlN1cGVyIiwiX2dldFByb3RvdHlwZU9mMiIsInJlc3VsdCIsIk5ld1RhcmdldCIsImNvbnN0cnVjdG9yIiwiUmVmbGVjdCIsImNvbnN0cnVjdCIsImFyZ3VtZW50cyIsImFwcGx5IiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yIiwic2hhbSIsIlByb3h5IiwiQm9vbGVhbiIsInByb3RvdHlwZSIsInZhbHVlT2YiLCJjYWxsIiwiZSIsIlNjaGVtYUNvbXBpbGVyX0ZpcmViaXJkIiwiX1NjaGVtYUNvbXBpbGVyIiwiX2luaGVyaXRzMiIsIl9zdXBlciIsIl9jbGFzc0NhbGxDaGVjazIiLCJfY3JlYXRlQ2xhc3MyIiwia2V5IiwidmFsdWUiLCJoYXNUYWJsZSIsInRhYmxlTmFtZSIsImZ1bGxUYWJsZU5hbWUiLCJmb3JtYXR0ZXIiLCJ3cmFwIiwicHJlZml4ZWRUYWJsZU5hbWUiLCJzY2hlbWEiLCJTdHJpbmciLCJ0b1VwcGVyQ2FzZSIsInNxbCIsImNvbmNhdCIsInB1c2hRdWVyeSIsIm91dHB1dCIsInJhdyIsImZsYXR0ZW4iLCJzaGlmdCIsIk9iamVjdCIsIk51bWJlciIsIngiLCJoYXNDb2x1bW4iLCJjb2x1bW4iLCJyZXNwIiwiX3RoaXMiLCJzb21lIiwiY29sIiwiY2xpZW50Iiwid3JhcElkZW50aWZpZXIiLCJmaWVsZCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsImRyb3BUYWJsZUlmRXhpc3RzIiwiZHJvcFRhYmxlU3FsIiwiZHJvcFRhYmxlUHJlZml4IiwicmVuYW1lVGFibGUiLCJ0byIsIkVycm9yIiwibmFtZSIsIlNjaGVtYUNvbXBpbGVyIiwicHJlZml4IiwidGFibGUiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NoZW1hL2NvbXBpbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEZpcmViaXJkOiBDb2x1bW4gQnVpbGRlciAmIENvbXBpbGVyXG4vLyAtLS0tLS0tXG5pbXBvcnQgU2NoZW1hQ29tcGlsZXIgZnJvbSBcImtuZXgvbGliL3NjaGVtYS9jb21waWxlclwiO1xuXG5pbXBvcnQgeyBzb21lLCBmbGF0dGVuIH0gZnJvbSBcImxvZGFzaFwiO1xuXG4vLyBTY2hlbWEgQ29tcGlsZXJcbi8vIC0tLS0tLS1cbmNsYXNzIFNjaGVtYUNvbXBpbGVyX0ZpcmViaXJkIGV4dGVuZHMgU2NoZW1hQ29tcGlsZXIge1xuICBoYXNUYWJsZSh0YWJsZU5hbWUpIHtcbiAgICBjb25zdCBmdWxsVGFibGVOYW1lID0gdGhpcy5mb3JtYXR0ZXJcbiAgICAgIC53cmFwKHByZWZpeGVkVGFibGVOYW1lKHRoaXMuc2NoZW1hLCBTdHJpbmcodGFibGVOYW1lKSkpXG4gICAgICAudG9VcHBlckNhc2UoKTtcblxuICAgIGNvbnN0IHNxbCA9IGBzZWxlY3QgMSBhcyB4IGZyb20gcmRiJHJlbGF0aW9ucyB3aGVyZSByZGIkcmVsYXRpb25fbmFtZSA9ICcke2Z1bGxUYWJsZU5hbWV9J2A7XG4gICAgdGhpcy5wdXNoUXVlcnkoe1xuICAgICAgc3FsLFxuICAgICAgb3V0cHV0OiAocmF3KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZsYXR0ZW4ocmF3KS5zaGlmdCgpO1xuICAgICAgICBpZiAoIXJlc3VsdCB8fCAhKHJlc3VsdCBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTnVtYmVyKHJlc3VsdC54KSA9PT0gMTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvLyBDb21waWxlIHRoZSBxdWVyeSB0byBkZXRlcm1pbmUgaWYgYSBjb2x1bW4gZXhpc3RzLlxuICBoYXNDb2x1bW4odGFibGVOYW1lLCBjb2x1bW4pIHtcbiAgICB0aGlzLnB1c2hRdWVyeSh7XG4gICAgICBzcWw6XG4gICAgICAgIGBzZWxlY3QgaS5yZGIkZmllbGRfbmFtZSBhcyBcIkZpZWxkXCIgZnJvbSBgICtcbiAgICAgICAgYHJkYiRyZWxhdGlvbnMgciBqb2luIHJkYiRSRUxBVElPTl9GSUVMRFMgaSBgICtcbiAgICAgICAgYG9uIChpLnJkYiRyZWxhdGlvbl9uYW1lID0gci5yZGIkcmVsYXRpb25fbmFtZSkgYCArXG4gICAgICAgIGB3aGVyZSByLnJkYiRyZWxhdGlvbl9uYW1lID0gJyR7dGhpcy5mb3JtYXR0ZXIud3JhcChcbiAgICAgICAgICB0YWJsZU5hbWUudG9VcHBlckNhc2UoKVxuICAgICAgICApfSdgLFxuICAgICAgb3V0cHV0KHJlc3ApIHtcbiAgICAgICAgcmV0dXJuIHNvbWUoZmxhdHRlbihyZXNwKSwgKGNvbCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmNsaWVudC53cmFwSWRlbnRpZmllcihjb2wuZmllbGQudHJpbSgpLnRvTG93ZXJDYXNlKCkpID09PVxuICAgICAgICAgICAgdGhpcy5jbGllbnQud3JhcElkZW50aWZpZXIoY29sdW1uLnRyaW0oKS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGRyb3BUYWJsZUlmRXhpc3RzKHRhYmxlTmFtZSkge1xuICAgIGNvbnN0IGZ1bGxUYWJsZU5hbWUgPSB0aGlzLmZvcm1hdHRlclxuICAgICAgLndyYXAocHJlZml4ZWRUYWJsZU5hbWUodGhpcy5zY2hlbWEsIHRhYmxlTmFtZSkpXG4gICAgICAudG9VcHBlckNhc2UoKTtcbiAgICBjb25zdCBkcm9wVGFibGVTcWwgPSB0aGlzLmRyb3BUYWJsZVByZWZpeCArIGZ1bGxUYWJsZU5hbWU7XG5cbiAgICB0aGlzLnB1c2hRdWVyeShgXG4gICAgICBFWEVDVVRFIEJMT0NLIEFTIEJFR0lOXG4gICAgICBpZiAoZXhpc3RzKHNlbGVjdCAxIGZyb20gcmRiJHJlbGF0aW9ucyB3aGVyZSByZGIkcmVsYXRpb25fbmFtZSA9ICcke2Z1bGxUYWJsZU5hbWV9JykpIHRoZW5cbiAgICAgIGV4ZWN1dGUgc3RhdGVtZW50ICcke2Ryb3BUYWJsZVNxbH0nO1xuICAgICAgRU5EXG4gICAgYCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbmFtZVRhYmxlKHRhYmxlTmFtZSwgdG8pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHt0aGlzLm5hbWV9IGlzIG5vdCBpbXBsZW1lbnRlZCBmb3IgdGhpcyBkaWFsZWN0IChodHRwOi8vd3d3LmZpcmViaXJkZmFxLm9yZy9mYXEzNjMvKS5gXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcmVmaXhlZFRhYmxlTmFtZShwcmVmaXgsIHRhYmxlKSB7XG4gIHJldHVybiBwcmVmaXggPyBgJHtwcmVmaXh9LiR7dGFibGV9YCA6IHRhYmxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBTY2hlbWFDb21waWxlcl9GaXJlYmlyZDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsSUFBQUEsU0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQUMsT0FBQSxHQUFBRCxPQUFBO0FBQXVDLFNBQUFFLGFBQUFDLE9BQUEsUUFBQUMseUJBQUEsR0FBQUMseUJBQUEsb0JBQUFDLHFCQUFBLFFBQUFDLEtBQUEsT0FBQUMsZ0JBQUEsYUFBQUwsT0FBQSxHQUFBTSxNQUFBLE1BQUFMLHlCQUFBLFFBQUFNLFNBQUEsT0FBQUYsZ0JBQUEsbUJBQUFHLFdBQUEsRUFBQUYsTUFBQSxHQUFBRyxPQUFBLENBQUFDLFNBQUEsQ0FBQU4sS0FBQSxFQUFBTyxTQUFBLEVBQUFKLFNBQUEsWUFBQUQsTUFBQSxHQUFBRixLQUFBLENBQUFRLEtBQUEsT0FBQUQsU0FBQSxnQkFBQUUsMkJBQUEsbUJBQUFQLE1BQUE7QUFB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