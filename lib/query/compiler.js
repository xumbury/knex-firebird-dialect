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
      console.log(sql);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcXVlcnljb21waWxlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJpZGVudGl0eSIsInJlZHVjZSIsIlF1ZXJ5Q29tcGlsZXJfRmlyZWJpcmQiLCJfUXVlcnlDb21waWxlciIsIl9pbmhlcml0czIiLCJfc3VwZXIiLCJfY2xhc3NDYWxsQ2hlY2syIiwiX2NyZWF0ZUNsYXNzMiIsImtleSIsInZhbHVlIiwiY29sdW1ucyIsImRpc3RpbmN0Q2xhdXNlIiwib25seVVuaW9ucyIsImhpbnRzIiwiX2hpbnRDb21tZW50cyIsImdyb3VwZWQiLCJpIiwic3FsIiwibGVuZ3RoIiwic3RtdCIsImRpc3RpbmN0IiwiZGlzdGluY3RPbiIsInR5cGUiLCJfc3FsIiwicHVzaCIsIl90b0NvbnN1bWFibGVBcnJheTIiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGVSYXciLCJhbmFseXRpYyIsImZvcm1hdHRlciIsImNvbHVtbml6ZSIsImNvbmNhdCIsIl9saW1pdCIsIl9vZmZzZXQiLCJqb2luIiwidGFibGVOYW1lIiwic2luZ2xlIiwib25seSIsIl9nZXQyIiwicmVwbGFjZSIsIm9mZnNldCIsImxpbWl0IiwiaW5zZXJ0IiwiY29uc29sZSIsImxvZyIsInJldHVybmluZyIsIl9yZXR1cm5pbmciLCJfcHJlcEluc2VydCIsImluc2VydFZhbHVlcyIsIm5ld1ZhbHVlcyIsImhhc093blByb3BlcnR5IiwiY29sdW1uSW5mbyIsImNvbHVtbiIsInRhYmxlIiwiY2xpZW50IiwiY3VzdG9tV3JhcElkZW50aWZpZXIiLCJvdXRwdXQiLCJyZXNwIiwiX3Jlc3AiLCJfc2xpY2VkVG9BcnJheTIiLCJyb3dzIiwiZmllbGRzIiwibWF4TGVuZ3RoUmVnZXgiLCJvdXQiLCJ2YWwiLCJuYW1lIiwiTkFNRSIsInRyaW0iLCJUWVBFIiwidG9Mb3dlckNhc2UiLCJudWxsYWJsZSIsIk5PVF9OVUxMIiwiTUFYX0xFTkdUSCIsIlF1ZXJ5Q29tcGlsZXIiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcnkvY29tcGlsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlyZWJpcmQgUXVlcnkgQnVpbGRlciAmIENvbXBpbGVyXG5pbXBvcnQgUXVlcnlDb21waWxlciBmcm9tIFwia25leC9saWIvcXVlcnkvcXVlcnljb21waWxlclwiO1xuY29uc3QgaWRlbnRpdHkgPSByZXF1aXJlKCdsb2Rhc2gvaWRlbnRpdHknKTtcbmNvbnN0IHJlZHVjZSA9IHJlcXVpcmUoJ2xvZGFzaC9yZWR1Y2UnKTtcblxuY2xhc3MgUXVlcnlDb21waWxlcl9GaXJlYmlyZCBleHRlbmRzIFF1ZXJ5Q29tcGlsZXIge1xuICBjb2x1bW5zKCkge1xuICAgIGxldCBkaXN0aW5jdENsYXVzZSA9IFwiXCI7XG4gICAgaWYgKHRoaXMub25seVVuaW9ucygpKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBjb25zdCBoaW50cyA9IHRoaXMuX2hpbnRDb21tZW50cygpO1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmdyb3VwZWQuY29sdW1ucyB8fCBbXTtcbiAgICBsZXQgaSA9IC0xLFxuICAgICAgc3FsID0gW107XG5cbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgd2hpbGUgKCsraSA8IGNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0bXQgPSBjb2x1bW5zW2ldO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdCkgZGlzdGluY3RDbGF1c2UgPSBcImRpc3RpbmN0IFwiO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdE9uKSB7XG4gICAgICAgICAgZGlzdGluY3RDbGF1c2UgPSB0aGlzLmRpc3RpbmN0T24oc3RtdC52YWx1ZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0bXQudHlwZSA9PT0gXCJhZ2dyZWdhdGVcIikge1xuICAgICAgICAgIHNxbC5wdXNoKC4uLnRoaXMuYWdncmVnYXRlKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnR5cGUgPT09IFwiYWdncmVnYXRlUmF3XCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFnZ3JlZ2F0ZVJhdyhzdG10KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RtdC50eXBlID09PSBcImFuYWx5dGljXCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFuYWx5dGljKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnZhbHVlICYmIHN0bXQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNxbC5wdXNoKHRoaXMuZm9ybWF0dGVyLmNvbHVtbml6ZShzdG10LnZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNxbC5sZW5ndGggPT09IDApIHNxbCA9IFtcIipcIl07XG4gICAgcmV0dXJuIChcbiAgICAgIGBzZWxlY3QgJHt0aGlzLl9saW1pdCgpfSAke3RoaXMuX29mZnNldCgpfSAke2hpbnRzfSR7ZGlzdGluY3RDbGF1c2V9YCArXG4gICAgICBzcWwuam9pbihcIiwgXCIpICtcbiAgICAgICh0aGlzLnRhYmxlTmFtZVxuICAgICAgICA/IGAgZnJvbSAke3RoaXMuc2luZ2xlLm9ubHkgPyBcIm9ubHkgXCIgOiBcIlwifSR7dGhpcy50YWJsZU5hbWV9YFxuICAgICAgICA6IFwiXCIpXG4gICAgKTtcbiAgfVxuXG4gIF9saW1pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIubGltaXQoKS5yZXBsYWNlKFwibGltaXRcIiwgXCJmaXJzdFwiKTtcbiAgfVxuXG4gIF9vZmZzZXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLm9mZnNldCgpLnJlcGxhY2UoXCJvZmZzZXRcIiwgXCJza2lwXCIpO1xuICB9XG5cbiAgb2Zmc2V0KCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgbGltaXQoKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBpbnNlcnQoKSB7XG4gICAgY29uc29sZS5sb2coJ2FxdWknKVxuICAgIGxldCBzcWwgPSBzdXBlci5pbnNlcnQoKTtcbiAgICBpZiAoc3FsID09PSBcIlwiKSByZXR1cm4gc3FsO1xuXG4gICAgY29uc29sZS5sb2coc3FsKVxuICAgIGNvbnN0IHsgcmV0dXJuaW5nIH0gPSB0aGlzLnNpbmdsZTtcbiAgICBpZiAocmV0dXJuaW5nKSBzcWwgKz0gdGhpcy5fcmV0dXJuaW5nKHJldHVybmluZyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3FsOiBzcWwsXG4gICAgICByZXR1cm5pbmcsXG4gICAgfTtcbiAgfVxuXG4gIF9yZXR1cm5pbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPyBgIHJldHVybmluZyAke3RoaXMuZm9ybWF0dGVyLmNvbHVtbml6ZSh2YWx1ZSl9YCA6IFwiXCI7XG4gIH1cblxuICBfcHJlcEluc2VydChpbnNlcnRWYWx1ZXMpIHtcbiAgICBjb25zdCBuZXdWYWx1ZXMgPSB7fTtcbiAgICBjb25zb2xlLmxvZyhpbnNlcnRWYWx1ZXMpXG4gICAgZm9yIChjb25zdCBrZXkgaW4gaW5zZXJ0VmFsdWVzKSB7XG4gICAgICBpZiAoaW5zZXJ0VmFsdWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbnNlcnRWYWx1ZXNba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIG5ld1ZhbHVlc1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLl9wcmVwSW5zZXJ0KG5ld1ZhbHVlcyk7XG4gIH1cbiAgLy8gQ29tcGlsZXMgYSBgY29sdW1uSW5mb2AgcXVlcnlcbiAgY29sdW1uSW5mbygpIHtcbiAgICBjb25zdCBjb2x1bW4gPSB0aGlzLnNpbmdsZS5jb2x1bW5JbmZvO1xuXG4gICAgLy8gVGhlIHVzZXIgbWF5IGhhdmUgc3BlY2lmaWVkIGEgY3VzdG9tIHdyYXBJZGVudGlmaWVyIGZ1bmN0aW9uIGluIHRoZSBjb25maWcuIFdlXG4gICAgLy8gbmVlZCB0byBydW4gdGhlIGlkZW50aWZpZXJzIHRocm91Z2ggdGhhdCBmdW5jdGlvbiwgYnV0IG5vdCBmb3JtYXQgdGhlbSBhc1xuICAgIC8vIGlkZW50aWZpZXJzIG90aGVyd2lzZS5cbiAgICBjb25zdCB0YWJsZSA9IHRoaXMuY2xpZW50LmN1c3RvbVdyYXBJZGVudGlmaWVyKFxuICAgICAgdGhpcy5zaW5nbGUudGFibGUsXG4gICAgICBpZGVudGl0eVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3FsOiBgXG4gICAgICBzZWxlY3QgXG4gICAgICAgIHJsZi5yZGIkZmllbGRfbmFtZSBhcyBuYW1lLFxuICAgICAgICBmbGQucmRiJGNoYXJhY3Rlcl9sZW5ndGggYXMgbWF4X2xlbmd0aCxcbiAgICAgICAgdHlwLnJkYiR0eXBlX25hbWUgYXMgdHlwZSxcbiAgICAgICAgcmxmLnJkYiRudWxsX2ZsYWcgYXMgbm90X251bGxcbiAgICAgIGZyb20gcmRiJHJlbGF0aW9uX2ZpZWxkcyBybGZcbiAgICAgIGlubmVyIGpvaW4gcmRiJGZpZWxkcyBmbGQgb24gZmxkLnJkYiRmaWVsZF9uYW1lID0gcmxmLnJkYiRmaWVsZF9zb3VyY2VcbiAgICAgIGlubmVyIGpvaW4gcmRiJHR5cGVzIHR5cCBvbiB0eXAucmRiJHR5cGUgPSBmbGQucmRiJGZpZWxkX3R5cGVcbiAgICAgIHdoZXJlIHJkYiRyZWxhdGlvbl9uYW1lID0gJyR7dGFibGV9J1xuICAgICAgYCxcbiAgICAgIG91dHB1dChyZXNwKSB7XG4gICAgICAgIGNvbnN0IFtyb3dzLCBmaWVsZHNdID0gcmVzcDtcblxuICAgICAgICBjb25zdCBtYXhMZW5ndGhSZWdleCA9IC8uKlxcKChcXGQrKVxcKS87XG4gICAgICAgIGNvbnN0IG91dCA9IHJlZHVjZShcbiAgICAgICAgICByb3dzLFxuICAgICAgICAgIGZ1bmN0aW9uIChjb2x1bW5zLCB2YWwpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB2YWwuTkFNRS50cmltKCk7XG4gICAgICAgICAgICBjb2x1bW5zW25hbWVdID0ge1xuICAgICAgICAgICAgICB0eXBlOiB2YWwuVFlQRS50cmltKCkudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgbnVsbGFibGU6ICF2YWwuTk9UX05VTEwsXG4gICAgICAgICAgICAgIC8vIEFUU1RPRE86IFwiZGVmYXVsdFZhbHVlXCIgbsOjbyBpbXBsZW1lbnRhZG9cbiAgICAgICAgICAgICAgLy8gZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHZhbC5NQVhfTEVOR1RIKSB7XG4gICAgICAgICAgICAgIGNvbHVtbnNbbmFtZV0gPSB2YWwuTUFYX0xFTkdUSDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbnM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKGNvbHVtbiAmJiBvdXRbY29sdW1uXSkgfHwgb3V0O1xuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXJ5Q29tcGlsZXJfRmlyZWJpcmQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUFBLGNBQUEsR0FBQUMsc0JBQUEs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