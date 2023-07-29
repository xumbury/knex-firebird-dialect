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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcXVlcnljb21waWxlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJpZGVudGl0eSIsInJlZHVjZSIsIlF1ZXJ5Q29tcGlsZXJfRmlyZWJpcmQiLCJfUXVlcnlDb21waWxlciIsIl9pbmhlcml0czIiLCJfc3VwZXIiLCJfY2xhc3NDYWxsQ2hlY2syIiwiX2NyZWF0ZUNsYXNzMiIsImtleSIsInZhbHVlIiwiY29sdW1ucyIsImRpc3RpbmN0Q2xhdXNlIiwib25seVVuaW9ucyIsImhpbnRzIiwiX2hpbnRDb21tZW50cyIsImdyb3VwZWQiLCJpIiwic3FsIiwibGVuZ3RoIiwic3RtdCIsImRpc3RpbmN0IiwiZGlzdGluY3RPbiIsInR5cGUiLCJfc3FsIiwicHVzaCIsIl90b0NvbnN1bWFibGVBcnJheTIiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGVSYXciLCJhbmFseXRpYyIsImZvcm1hdHRlciIsImNvbHVtbml6ZSIsImNvbmNhdCIsIl9saW1pdCIsIl9vZmZzZXQiLCJqb2luIiwidGFibGVOYW1lIiwic2luZ2xlIiwib25seSIsIl9nZXQyIiwicmVwbGFjZSIsIm9mZnNldCIsImxpbWl0IiwiaW5zZXJ0IiwicmV0dXJuaW5nIiwiX3JldHVybmluZyIsIl9wcmVwSW5zZXJ0IiwiaW5zZXJ0VmFsdWVzIiwibmV3VmFsdWVzIiwiY29uc29sZSIsImxvZyIsImhhc093blByb3BlcnR5IiwiY29sdW1uSW5mbyIsImNvbHVtbiIsInRhYmxlIiwiY2xpZW50IiwiY3VzdG9tV3JhcElkZW50aWZpZXIiLCJvdXRwdXQiLCJyZXNwIiwiX3Jlc3AiLCJfc2xpY2VkVG9BcnJheTIiLCJyb3dzIiwiZmllbGRzIiwibWF4TGVuZ3RoUmVnZXgiLCJvdXQiLCJ2YWwiLCJuYW1lIiwiTkFNRSIsInRyaW0iLCJUWVBFIiwidG9Mb3dlckNhc2UiLCJudWxsYWJsZSIsIk5PVF9OVUxMIiwiTUFYX0xFTkdUSCIsIlF1ZXJ5Q29tcGlsZXIiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcnkvY29tcGlsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlyZWJpcmQgUXVlcnkgQnVpbGRlciAmIENvbXBpbGVyXG5pbXBvcnQgUXVlcnlDb21waWxlciBmcm9tIFwia25leC9saWIvcXVlcnkvcXVlcnljb21waWxlclwiO1xuY29uc3QgaWRlbnRpdHkgPSByZXF1aXJlKCdsb2Rhc2gvaWRlbnRpdHknKTtcbmNvbnN0IHJlZHVjZSA9IHJlcXVpcmUoJ2xvZGFzaC9yZWR1Y2UnKTtcblxuY2xhc3MgUXVlcnlDb21waWxlcl9GaXJlYmlyZCBleHRlbmRzIFF1ZXJ5Q29tcGlsZXIge1xuICBjb2x1bW5zKCkge1xuICAgIGxldCBkaXN0aW5jdENsYXVzZSA9IFwiXCI7XG4gICAgaWYgKHRoaXMub25seVVuaW9ucygpKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBjb25zdCBoaW50cyA9IHRoaXMuX2hpbnRDb21tZW50cygpO1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmdyb3VwZWQuY29sdW1ucyB8fCBbXTtcbiAgICBsZXQgaSA9IC0xLFxuICAgICAgc3FsID0gW107XG5cbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgd2hpbGUgKCsraSA8IGNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0bXQgPSBjb2x1bW5zW2ldO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdCkgZGlzdGluY3RDbGF1c2UgPSBcImRpc3RpbmN0IFwiO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdE9uKSB7XG4gICAgICAgICAgZGlzdGluY3RDbGF1c2UgPSB0aGlzLmRpc3RpbmN0T24oc3RtdC52YWx1ZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0bXQudHlwZSA9PT0gXCJhZ2dyZWdhdGVcIikge1xuICAgICAgICAgIHNxbC5wdXNoKC4uLnRoaXMuYWdncmVnYXRlKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnR5cGUgPT09IFwiYWdncmVnYXRlUmF3XCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFnZ3JlZ2F0ZVJhdyhzdG10KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RtdC50eXBlID09PSBcImFuYWx5dGljXCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFuYWx5dGljKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnZhbHVlICYmIHN0bXQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNxbC5wdXNoKHRoaXMuZm9ybWF0dGVyLmNvbHVtbml6ZShzdG10LnZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNxbC5sZW5ndGggPT09IDApIHNxbCA9IFtcIipcIl07XG4gICAgcmV0dXJuIChcbiAgICAgIGBzZWxlY3QgJHt0aGlzLl9saW1pdCgpfSAke3RoaXMuX29mZnNldCgpfSAke2hpbnRzfSR7ZGlzdGluY3RDbGF1c2V9YCArXG4gICAgICBzcWwuam9pbihcIiwgXCIpICtcbiAgICAgICh0aGlzLnRhYmxlTmFtZVxuICAgICAgICA/IGAgZnJvbSAke3RoaXMuc2luZ2xlLm9ubHkgPyBcIm9ubHkgXCIgOiBcIlwifSR7dGhpcy50YWJsZU5hbWV9YFxuICAgICAgICA6IFwiXCIpXG4gICAgKTtcbiAgfVxuXG4gIF9saW1pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIubGltaXQoKS5yZXBsYWNlKFwibGltaXRcIiwgXCJmaXJzdFwiKTtcbiAgfVxuXG4gIF9vZmZzZXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLm9mZnNldCgpLnJlcGxhY2UoXCJvZmZzZXRcIiwgXCJza2lwXCIpO1xuICB9XG5cbiAgb2Zmc2V0KCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgbGltaXQoKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBpbnNlcnQoKSB7XG4gICAgbGV0IHNxbCA9IHN1cGVyLmluc2VydCgpO1xuICAgIGlmIChzcWwgPT09IFwiXCIpIHJldHVybiBzcWw7XG5cbiAgICBjb25zdCB7IHJldHVybmluZyB9ID0gdGhpcy5zaW5nbGU7XG4gICAgaWYgKHJldHVybmluZykgc3FsICs9IHRoaXMuX3JldHVybmluZyhyZXR1cm5pbmcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNxbDogc3FsLFxuICAgICAgcmV0dXJuaW5nLFxuICAgIH07XG4gIH1cblxuICBfcmV0dXJuaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID8gYCByZXR1cm5pbmcgJHt0aGlzLmZvcm1hdHRlci5jb2x1bW5pemUodmFsdWUpfWAgOiBcIlwiO1xuICB9XG5cbiAgX3ByZXBJbnNlcnQoaW5zZXJ0VmFsdWVzKSB7XG4gICAgY29uc3QgbmV3VmFsdWVzID0ge307XG4gICAgY29uc29sZS5sb2coaW5zZXJ0VmFsdWVzKVxuICAgIGZvciAoY29uc3Qga2V5IGluIGluc2VydFZhbHVlcykge1xuICAgICAgaWYgKGluc2VydFZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5zZXJ0VmFsdWVzW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBuZXdWYWx1ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5fcHJlcEluc2VydChuZXdWYWx1ZXMpO1xuICB9XG4gIC8vIENvbXBpbGVzIGEgYGNvbHVtbkluZm9gIHF1ZXJ5XG4gIGNvbHVtbkluZm8oKSB7XG4gICAgY29uc3QgY29sdW1uID0gdGhpcy5zaW5nbGUuY29sdW1uSW5mbztcblxuICAgIC8vIFRoZSB1c2VyIG1heSBoYXZlIHNwZWNpZmllZCBhIGN1c3RvbSB3cmFwSWRlbnRpZmllciBmdW5jdGlvbiBpbiB0aGUgY29uZmlnLiBXZVxuICAgIC8vIG5lZWQgdG8gcnVuIHRoZSBpZGVudGlmaWVycyB0aHJvdWdoIHRoYXQgZnVuY3Rpb24sIGJ1dCBub3QgZm9ybWF0IHRoZW0gYXNcbiAgICAvLyBpZGVudGlmaWVycyBvdGhlcndpc2UuXG4gICAgY29uc3QgdGFibGUgPSB0aGlzLmNsaWVudC5jdXN0b21XcmFwSWRlbnRpZmllcihcbiAgICAgIHRoaXMuc2luZ2xlLnRhYmxlLFxuICAgICAgaWRlbnRpdHlcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNxbDogYFxuICAgICAgc2VsZWN0IFxuICAgICAgICBybGYucmRiJGZpZWxkX25hbWUgYXMgbmFtZSxcbiAgICAgICAgZmxkLnJkYiRjaGFyYWN0ZXJfbGVuZ3RoIGFzIG1heF9sZW5ndGgsXG4gICAgICAgIHR5cC5yZGIkdHlwZV9uYW1lIGFzIHR5cGUsXG4gICAgICAgIHJsZi5yZGIkbnVsbF9mbGFnIGFzIG5vdF9udWxsXG4gICAgICBmcm9tIHJkYiRyZWxhdGlvbl9maWVsZHMgcmxmXG4gICAgICBpbm5lciBqb2luIHJkYiRmaWVsZHMgZmxkIG9uIGZsZC5yZGIkZmllbGRfbmFtZSA9IHJsZi5yZGIkZmllbGRfc291cmNlXG4gICAgICBpbm5lciBqb2luIHJkYiR0eXBlcyB0eXAgb24gdHlwLnJkYiR0eXBlID0gZmxkLnJkYiRmaWVsZF90eXBlXG4gICAgICB3aGVyZSByZGIkcmVsYXRpb25fbmFtZSA9ICcke3RhYmxlfSdcbiAgICAgIGAsXG4gICAgICBvdXRwdXQocmVzcCkge1xuICAgICAgICBjb25zdCBbcm93cywgZmllbGRzXSA9IHJlc3A7XG5cbiAgICAgICAgY29uc3QgbWF4TGVuZ3RoUmVnZXggPSAvLipcXCgoXFxkKylcXCkvO1xuICAgICAgICBjb25zdCBvdXQgPSByZWR1Y2UoXG4gICAgICAgICAgcm93cyxcbiAgICAgICAgICBmdW5jdGlvbiAoY29sdW1ucywgdmFsKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdmFsLk5BTUUudHJpbSgpO1xuICAgICAgICAgICAgY29sdW1uc1tuYW1lXSA9IHtcbiAgICAgICAgICAgICAgdHlwZTogdmFsLlRZUEUudHJpbSgpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgIG51bGxhYmxlOiAhdmFsLk5PVF9OVUxMLFxuICAgICAgICAgICAgICAvLyBBVFNUT0RPOiBcImRlZmF1bHRWYWx1ZVwiIG7Do28gaW1wbGVtZW50YWRvXG4gICAgICAgICAgICAgIC8vIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh2YWwuTUFYX0xFTkdUSCkge1xuICAgICAgICAgICAgICBjb2x1bW5zW25hbWVdID0gdmFsLk1BWF9MRU5HVEg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb2x1bW5zO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge31cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIChjb2x1bW4gJiYgb3V0W2NvbHVtbl0pIHx8IG91dDtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBRdWVyeUNvbXBpbGVyX0ZpcmViaXJkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFBQSxjQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBeUQsU0FBQUMsYUFBQUMsT0FBQSxRQUFBQyx5QkFBQSxH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