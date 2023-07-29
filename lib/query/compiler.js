"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _querycompiler = _interopRequireDefault(require("knex/lib/query/querycompiler"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } } // Firebird Query Builder & Compiler
var identity = require('lodash/identity');
var reduce = require('lodash/reduce');
var QueryCompiler_Firebird = /*#__PURE__*/function (_QueryCompiler) {
  (0, _inherits2["default"])(QueryCompiler_Firebird, _QueryCompiler);
  var _super = _createSuper(QueryCompiler_Firebird);
  function QueryCompiler_Firebird() {
    (0, _classCallCheck2["default"])(this, QueryCompiler_Firebird);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(QueryCompiler_Firebird, [{
    key: "columns",
    value: function columns() {
      var distinctClause = "";
      if (this.onlyUnions()) {
        return "";
      }
      var hints = this._hintComments();
      var columns = this.grouped.columns || [];
      var i = -1,
        sql = [];
      if (columns) {
        while (++i < columns.length) {
          var stmt = columns[i];
          if (stmt.distinct) distinctClause = "distinct ";
          if (stmt.distinctOn) {
            distinctClause = this.distinctOn(stmt.value);
            continue;
          }
          if (stmt.type === "aggregate") {
            var _sql;
            (_sql = sql).push.apply(_sql, (0, _toConsumableArray2["default"])(this.aggregate(stmt)));
          } else if (stmt.type === "aggregateRaw") {
            sql.push(this.aggregateRaw(stmt));
          } else if (stmt.type === "analytic") {
            sql.push(this.analytic(stmt));
          } else if (stmt.value && stmt.value.length > 0) {
            sql.push(this.formatter.columnize(stmt.value));
          }
        }
      }
      if (sql.length === 0) sql = ["*"];
      return "select ".concat(this._limit(), " ").concat(this._offset(), " ").concat(hints).concat(distinctClause) + sql.join(", ") + (this.tableName ? " from ".concat(this.single.only ? "only " : "").concat(this.tableName) : "");
    }
  }, {
    key: "_limit",
    value: function _limit() {
      return (0, _get2["default"])((0, _getPrototypeOf2["default"])(QueryCompiler_Firebird.prototype), "limit", this).call(this).replace("limit", "first");
    }
  }, {
    key: "_offset",
    value: function _offset() {
      return (0, _get2["default"])((0, _getPrototypeOf2["default"])(QueryCompiler_Firebird.prototype), "offset", this).call(this).replace("offset", "skip");
    }
  }, {
    key: "offset",
    value: function offset() {
      return "";
    }
  }, {
    key: "limit",
    value: function limit() {
      return "";
    }
  }, {
    key: "insert",
    value: function insert() {
      console.log('aqui');
      var sql = (0, _get2["default"])((0, _getPrototypeOf2["default"])(QueryCompiler_Firebird.prototype), "insert", this).call(this);
      if (sql === "") return sql;
      var returning = this.single.returning;
      if (returning) sql += this._returning(returning);
      return {
        sql: sql,
        returning: returning
      };
    }
  }, {
    key: "_returning",
    value: function _returning(value) {
      return value ? " returning ".concat(this.formatter.columnize(value)) : "";
    }
  }, {
    key: "_prepInsert",
    value: function _prepInsert(insertValues) {
      var newValues = {};
      console.log(insertValues);
      for (var key in insertValues) {
        if (insertValues.hasOwnProperty(key)) {
          var value = insertValues[key];
          if (typeof value !== "undefined") {
            newValues[key] = value;
          }
        }
      }
      return (0, _get2["default"])((0, _getPrototypeOf2["default"])(QueryCompiler_Firebird.prototype), "_prepInsert", this).call(this, newValues);
    }
    // Compiles a `columnInfo` query
  }, {
    key: "columnInfo",
    value: function columnInfo() {
      var column = this.single.columnInfo;

      // The user may have specified a custom wrapIdentifier function in the config. We
      // need to run the identifiers through that function, but not format them as
      // identifiers otherwise.
      var table = this.client.customWrapIdentifier(this.single.table, identity);
      return {
        sql: "\n      select \n        rlf.rdb$field_name as name,\n        fld.rdb$character_length as max_length,\n        typ.rdb$type_name as type,\n        rlf.rdb$null_flag as not_null\n      from rdb$relation_fields rlf\n      inner join rdb$fields fld on fld.rdb$field_name = rlf.rdb$field_source\n      inner join rdb$types typ on typ.rdb$type = fld.rdb$field_type\n      where rdb$relation_name = '".concat(table, "'\n      "),
        output: function output(resp) {
          var _resp = (0, _slicedToArray2["default"])(resp, 2),
            rows = _resp[0],
            fields = _resp[1];
          var maxLengthRegex = /.*\((\d+)\)/;
          var out = reduce(rows, function (columns, val) {
            var name = val.NAME.trim();
            columns[name] = {
              type: val.TYPE.trim().toLowerCase(),
              nullable: !val.NOT_NULL
              // ATSTODO: "defaultValue" não implementado
              // defaultValue: null,
            };

            if (val.MAX_LENGTH) {
              columns[name] = val.MAX_LENGTH;
            }
            return columns;
          }, {});
          return column && out[column] || out;
        }
      };
    }
  }]);
  return QueryCompiler_Firebird;
}(_querycompiler["default"]);
var _default = QueryCompiler_Firebird;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcXVlcnljb21waWxlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJpZGVudGl0eSIsInJlZHVjZSIsIlF1ZXJ5Q29tcGlsZXJfRmlyZWJpcmQiLCJfUXVlcnlDb21waWxlciIsIl9pbmhlcml0czIiLCJfc3VwZXIiLCJfY2xhc3NDYWxsQ2hlY2syIiwiX2NyZWF0ZUNsYXNzMiIsImtleSIsInZhbHVlIiwiY29sdW1ucyIsImRpc3RpbmN0Q2xhdXNlIiwib25seVVuaW9ucyIsImhpbnRzIiwiX2hpbnRDb21tZW50cyIsImdyb3VwZWQiLCJpIiwic3FsIiwibGVuZ3RoIiwic3RtdCIsImRpc3RpbmN0IiwiZGlzdGluY3RPbiIsInR5cGUiLCJfc3FsIiwicHVzaCIsIl90b0NvbnN1bWFibGVBcnJheTIiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGVSYXciLCJhbmFseXRpYyIsImZvcm1hdHRlciIsImNvbHVtbml6ZSIsImNvbmNhdCIsIl9saW1pdCIsIl9vZmZzZXQiLCJqb2luIiwidGFibGVOYW1lIiwic2luZ2xlIiwib25seSIsIl9nZXQyIiwicmVwbGFjZSIsIm9mZnNldCIsImxpbWl0IiwiaW5zZXJ0IiwiY29uc29sZSIsImxvZyIsInJldHVybmluZyIsIl9yZXR1cm5pbmciLCJfcHJlcEluc2VydCIsImluc2VydFZhbHVlcyIsIm5ld1ZhbHVlcyIsImhhc093blByb3BlcnR5IiwiY29sdW1uSW5mbyIsImNvbHVtbiIsInRhYmxlIiwiY2xpZW50IiwiY3VzdG9tV3JhcElkZW50aWZpZXIiLCJvdXRwdXQiLCJyZXNwIiwiX3Jlc3AiLCJfc2xpY2VkVG9BcnJheTIiLCJyb3dzIiwiZmllbGRzIiwibWF4TGVuZ3RoUmVnZXgiLCJvdXQiLCJ2YWwiLCJuYW1lIiwiTkFNRSIsInRyaW0iLCJUWVBFIiwidG9Mb3dlckNhc2UiLCJudWxsYWJsZSIsIk5PVF9OVUxMIiwiTUFYX0xFTkdUSCIsIlF1ZXJ5Q29tcGlsZXIiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcnkvY29tcGlsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlyZWJpcmQgUXVlcnkgQnVpbGRlciAmIENvbXBpbGVyXG5pbXBvcnQgUXVlcnlDb21waWxlciBmcm9tIFwia25leC9saWIvcXVlcnkvcXVlcnljb21waWxlclwiO1xuY29uc3QgaWRlbnRpdHkgPSByZXF1aXJlKCdsb2Rhc2gvaWRlbnRpdHknKTtcbmNvbnN0IHJlZHVjZSA9IHJlcXVpcmUoJ2xvZGFzaC9yZWR1Y2UnKTtcblxuY2xhc3MgUXVlcnlDb21waWxlcl9GaXJlYmlyZCBleHRlbmRzIFF1ZXJ5Q29tcGlsZXIge1xuICBjb2x1bW5zKCkge1xuICAgIGxldCBkaXN0aW5jdENsYXVzZSA9IFwiXCI7XG4gICAgaWYgKHRoaXMub25seVVuaW9ucygpKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBjb25zdCBoaW50cyA9IHRoaXMuX2hpbnRDb21tZW50cygpO1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmdyb3VwZWQuY29sdW1ucyB8fCBbXTtcbiAgICBsZXQgaSA9IC0xLFxuICAgICAgc3FsID0gW107XG5cbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgd2hpbGUgKCsraSA8IGNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0bXQgPSBjb2x1bW5zW2ldO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdCkgZGlzdGluY3RDbGF1c2UgPSBcImRpc3RpbmN0IFwiO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdE9uKSB7XG4gICAgICAgICAgZGlzdGluY3RDbGF1c2UgPSB0aGlzLmRpc3RpbmN0T24oc3RtdC52YWx1ZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0bXQudHlwZSA9PT0gXCJhZ2dyZWdhdGVcIikge1xuICAgICAgICAgIHNxbC5wdXNoKC4uLnRoaXMuYWdncmVnYXRlKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnR5cGUgPT09IFwiYWdncmVnYXRlUmF3XCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFnZ3JlZ2F0ZVJhdyhzdG10KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RtdC50eXBlID09PSBcImFuYWx5dGljXCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFuYWx5dGljKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnZhbHVlICYmIHN0bXQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNxbC5wdXNoKHRoaXMuZm9ybWF0dGVyLmNvbHVtbml6ZShzdG10LnZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNxbC5sZW5ndGggPT09IDApIHNxbCA9IFtcIipcIl07XG4gICAgcmV0dXJuIChcbiAgICAgIGBzZWxlY3QgJHt0aGlzLl9saW1pdCgpfSAke3RoaXMuX29mZnNldCgpfSAke2hpbnRzfSR7ZGlzdGluY3RDbGF1c2V9YCArXG4gICAgICBzcWwuam9pbihcIiwgXCIpICtcbiAgICAgICh0aGlzLnRhYmxlTmFtZVxuICAgICAgICA/IGAgZnJvbSAke3RoaXMuc2luZ2xlLm9ubHkgPyBcIm9ubHkgXCIgOiBcIlwifSR7dGhpcy50YWJsZU5hbWV9YFxuICAgICAgICA6IFwiXCIpXG4gICAgKTtcbiAgfVxuXG4gIF9saW1pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIubGltaXQoKS5yZXBsYWNlKFwibGltaXRcIiwgXCJmaXJzdFwiKTtcbiAgfVxuXG4gIF9vZmZzZXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLm9mZnNldCgpLnJlcGxhY2UoXCJvZmZzZXRcIiwgXCJza2lwXCIpO1xuICB9XG5cbiAgb2Zmc2V0KCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgbGltaXQoKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBpbnNlcnQoKSB7XG4gICAgY29uc29sZS5sb2coJ2FxdWknKVxuICAgIGxldCBzcWwgPSBzdXBlci5pbnNlcnQoKTtcbiAgICBpZiAoc3FsID09PSBcIlwiKSByZXR1cm4gc3FsO1xuXG4gICAgY29uc3QgeyByZXR1cm5pbmcgfSA9IHRoaXMuc2luZ2xlO1xuICAgIGlmIChyZXR1cm5pbmcpIHNxbCArPSB0aGlzLl9yZXR1cm5pbmcocmV0dXJuaW5nKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzcWw6IHNxbCxcbiAgICAgIHJldHVybmluZyxcbiAgICB9O1xuICB9XG5cbiAgX3JldHVybmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA/IGAgcmV0dXJuaW5nICR7dGhpcy5mb3JtYXR0ZXIuY29sdW1uaXplKHZhbHVlKX1gIDogXCJcIjtcbiAgfVxuXG4gIF9wcmVwSW5zZXJ0KGluc2VydFZhbHVlcykge1xuICAgIGNvbnN0IG5ld1ZhbHVlcyA9IHt9O1xuICAgIGNvbnNvbGUubG9nKGluc2VydFZhbHVlcylcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBpbnNlcnRWYWx1ZXMpIHtcbiAgICAgIGlmIChpbnNlcnRWYWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGluc2VydFZhbHVlc1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgbmV3VmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuX3ByZXBJbnNlcnQobmV3VmFsdWVzKTtcbiAgfVxuICAvLyBDb21waWxlcyBhIGBjb2x1bW5JbmZvYCBxdWVyeVxuICBjb2x1bW5JbmZvKCkge1xuICAgIGNvbnN0IGNvbHVtbiA9IHRoaXMuc2luZ2xlLmNvbHVtbkluZm87XG5cbiAgICAvLyBUaGUgdXNlciBtYXkgaGF2ZSBzcGVjaWZpZWQgYSBjdXN0b20gd3JhcElkZW50aWZpZXIgZnVuY3Rpb24gaW4gdGhlIGNvbmZpZy4gV2VcbiAgICAvLyBuZWVkIHRvIHJ1biB0aGUgaWRlbnRpZmllcnMgdGhyb3VnaCB0aGF0IGZ1bmN0aW9uLCBidXQgbm90IGZvcm1hdCB0aGVtIGFzXG4gICAgLy8gaWRlbnRpZmllcnMgb3RoZXJ3aXNlLlxuICAgIGNvbnN0IHRhYmxlID0gdGhpcy5jbGllbnQuY3VzdG9tV3JhcElkZW50aWZpZXIoXG4gICAgICB0aGlzLnNpbmdsZS50YWJsZSxcbiAgICAgIGlkZW50aXR5XG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzcWw6IGBcbiAgICAgIHNlbGVjdCBcbiAgICAgICAgcmxmLnJkYiRmaWVsZF9uYW1lIGFzIG5hbWUsXG4gICAgICAgIGZsZC5yZGIkY2hhcmFjdGVyX2xlbmd0aCBhcyBtYXhfbGVuZ3RoLFxuICAgICAgICB0eXAucmRiJHR5cGVfbmFtZSBhcyB0eXBlLFxuICAgICAgICBybGYucmRiJG51bGxfZmxhZyBhcyBub3RfbnVsbFxuICAgICAgZnJvbSByZGIkcmVsYXRpb25fZmllbGRzIHJsZlxuICAgICAgaW5uZXIgam9pbiByZGIkZmllbGRzIGZsZCBvbiBmbGQucmRiJGZpZWxkX25hbWUgPSBybGYucmRiJGZpZWxkX3NvdXJjZVxuICAgICAgaW5uZXIgam9pbiByZGIkdHlwZXMgdHlwIG9uIHR5cC5yZGIkdHlwZSA9IGZsZC5yZGIkZmllbGRfdHlwZVxuICAgICAgd2hlcmUgcmRiJHJlbGF0aW9uX25hbWUgPSAnJHt0YWJsZX0nXG4gICAgICBgLFxuICAgICAgb3V0cHV0KHJlc3ApIHtcbiAgICAgICAgY29uc3QgW3Jvd3MsIGZpZWxkc10gPSByZXNwO1xuXG4gICAgICAgIGNvbnN0IG1heExlbmd0aFJlZ2V4ID0gLy4qXFwoKFxcZCspXFwpLztcbiAgICAgICAgY29uc3Qgb3V0ID0gcmVkdWNlKFxuICAgICAgICAgIHJvd3MsXG4gICAgICAgICAgZnVuY3Rpb24gKGNvbHVtbnMsIHZhbCkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHZhbC5OQU1FLnRyaW0oKTtcbiAgICAgICAgICAgIGNvbHVtbnNbbmFtZV0gPSB7XG4gICAgICAgICAgICAgIHR5cGU6IHZhbC5UWVBFLnRyaW0oKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICBudWxsYWJsZTogIXZhbC5OT1RfTlVMTCxcbiAgICAgICAgICAgICAgLy8gQVRTVE9ETzogXCJkZWZhdWx0VmFsdWVcIiBuw6NvIGltcGxlbWVudGFkb1xuICAgICAgICAgICAgICAvLyBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodmFsLk1BWF9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgY29sdW1uc1tuYW1lXSA9IHZhbC5NQVhfTEVOR1RIO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY29sdW1ucztcbiAgICAgICAgICB9LFxuICAgICAgICAgIHt9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoY29sdW1uICYmIG91dFtjb2x1bW5dKSB8fCBvdXQ7XG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUXVlcnlDb21waWxlcl9GaXJlYmlyZDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBQUEsY0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQXlELFNBQUFD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