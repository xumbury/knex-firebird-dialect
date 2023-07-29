"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
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
    key: "_insertBody",
    value: function _insertBody(insertValues) {
      console.log(insertValues);
      var sql = '';
      if (Array.isArray(insertValues)) {
        if (insertValues.length === 0) {
          return '';
        }
      } else if ((0, _typeof2["default"])(insertValues) === 'object' && isEmpty(insertValues)) {
        return sql + this._emptyInsertValue;
      }
      var insertData = this._prepInsert(insertValues);
      console.log(insertData);
      if (typeof insertData === 'string') {
        sql += insertData;
      } else {
        if (insertData.columns.length) {
          sql += "(".concat(columnize_(insertData.columns, this.builder, this.client, this.bindingsHolder));
          sql += ') values (' + this._buildInsertValues(insertData) + ')';
        } else if (insertValues.length === 1 && insertValues[0]) {
          sql += this._emptyInsertValue;
        } else {
          sql = '';
        }
      }
      return sql;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcXVlcnljb21waWxlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJpZGVudGl0eSIsInJlZHVjZSIsIlF1ZXJ5Q29tcGlsZXJfRmlyZWJpcmQiLCJfUXVlcnlDb21waWxlciIsIl9pbmhlcml0czIiLCJfc3VwZXIiLCJfY2xhc3NDYWxsQ2hlY2syIiwiX2NyZWF0ZUNsYXNzMiIsImtleSIsInZhbHVlIiwiY29sdW1ucyIsImRpc3RpbmN0Q2xhdXNlIiwib25seVVuaW9ucyIsImhpbnRzIiwiX2hpbnRDb21tZW50cyIsImdyb3VwZWQiLCJpIiwic3FsIiwibGVuZ3RoIiwic3RtdCIsImRpc3RpbmN0IiwiZGlzdGluY3RPbiIsInR5cGUiLCJfc3FsIiwicHVzaCIsIl90b0NvbnN1bWFibGVBcnJheTIiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGVSYXciLCJhbmFseXRpYyIsImZvcm1hdHRlciIsImNvbHVtbml6ZSIsImNvbmNhdCIsIl9saW1pdCIsIl9vZmZzZXQiLCJqb2luIiwidGFibGVOYW1lIiwic2luZ2xlIiwib25seSIsIl9nZXQyIiwicmVwbGFjZSIsIm9mZnNldCIsImxpbWl0IiwiaW5zZXJ0IiwiY29uc29sZSIsImxvZyIsInJldHVybmluZyIsIl9yZXR1cm5pbmciLCJfaW5zZXJ0Qm9keSIsImluc2VydFZhbHVlcyIsIkFycmF5IiwiaXNBcnJheSIsIl90eXBlb2YyIiwiaXNFbXB0eSIsIl9lbXB0eUluc2VydFZhbHVlIiwiaW5zZXJ0RGF0YSIsIl9wcmVwSW5zZXJ0IiwiY29sdW1uaXplXyIsImJ1aWxkZXIiLCJjbGllbnQiLCJiaW5kaW5nc0hvbGRlciIsIl9idWlsZEluc2VydFZhbHVlcyIsIm5ld1ZhbHVlcyIsImhhc093blByb3BlcnR5IiwiY29sdW1uSW5mbyIsImNvbHVtbiIsInRhYmxlIiwiY3VzdG9tV3JhcElkZW50aWZpZXIiLCJvdXRwdXQiLCJyZXNwIiwiX3Jlc3AiLCJfc2xpY2VkVG9BcnJheTIiLCJyb3dzIiwiZmllbGRzIiwibWF4TGVuZ3RoUmVnZXgiLCJvdXQiLCJ2YWwiLCJuYW1lIiwiTkFNRSIsInRyaW0iLCJUWVBFIiwidG9Mb3dlckNhc2UiLCJudWxsYWJsZSIsIk5PVF9OVUxMIiwiTUFYX0xFTkdUSCIsIlF1ZXJ5Q29tcGlsZXIiLCJfZGVmYXVsdCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcnkvY29tcGlsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRmlyZWJpcmQgUXVlcnkgQnVpbGRlciAmIENvbXBpbGVyXG5pbXBvcnQgUXVlcnlDb21waWxlciBmcm9tIFwia25leC9saWIvcXVlcnkvcXVlcnljb21waWxlclwiO1xuY29uc3QgaWRlbnRpdHkgPSByZXF1aXJlKCdsb2Rhc2gvaWRlbnRpdHknKTtcbmNvbnN0IHJlZHVjZSA9IHJlcXVpcmUoJ2xvZGFzaC9yZWR1Y2UnKTtcblxuY2xhc3MgUXVlcnlDb21waWxlcl9GaXJlYmlyZCBleHRlbmRzIFF1ZXJ5Q29tcGlsZXIge1xuICBjb2x1bW5zKCkge1xuICAgIGxldCBkaXN0aW5jdENsYXVzZSA9IFwiXCI7XG4gICAgaWYgKHRoaXMub25seVVuaW9ucygpKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBjb25zdCBoaW50cyA9IHRoaXMuX2hpbnRDb21tZW50cygpO1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmdyb3VwZWQuY29sdW1ucyB8fCBbXTtcbiAgICBsZXQgaSA9IC0xLFxuICAgICAgc3FsID0gW107XG5cbiAgICBpZiAoY29sdW1ucykge1xuICAgICAgd2hpbGUgKCsraSA8IGNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHN0bXQgPSBjb2x1bW5zW2ldO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdCkgZGlzdGluY3RDbGF1c2UgPSBcImRpc3RpbmN0IFwiO1xuICAgICAgICBpZiAoc3RtdC5kaXN0aW5jdE9uKSB7XG4gICAgICAgICAgZGlzdGluY3RDbGF1c2UgPSB0aGlzLmRpc3RpbmN0T24oc3RtdC52YWx1ZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0bXQudHlwZSA9PT0gXCJhZ2dyZWdhdGVcIikge1xuICAgICAgICAgIHNxbC5wdXNoKC4uLnRoaXMuYWdncmVnYXRlKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnR5cGUgPT09IFwiYWdncmVnYXRlUmF3XCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFnZ3JlZ2F0ZVJhdyhzdG10KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RtdC50eXBlID09PSBcImFuYWx5dGljXCIpIHtcbiAgICAgICAgICBzcWwucHVzaCh0aGlzLmFuYWx5dGljKHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnZhbHVlICYmIHN0bXQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNxbC5wdXNoKHRoaXMuZm9ybWF0dGVyLmNvbHVtbml6ZShzdG10LnZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNxbC5sZW5ndGggPT09IDApIHNxbCA9IFtcIipcIl07XG4gICAgcmV0dXJuIChcbiAgICAgIGBzZWxlY3QgJHt0aGlzLl9saW1pdCgpfSAke3RoaXMuX29mZnNldCgpfSAke2hpbnRzfSR7ZGlzdGluY3RDbGF1c2V9YCArXG4gICAgICBzcWwuam9pbihcIiwgXCIpICtcbiAgICAgICh0aGlzLnRhYmxlTmFtZVxuICAgICAgICA/IGAgZnJvbSAke3RoaXMuc2luZ2xlLm9ubHkgPyBcIm9ubHkgXCIgOiBcIlwifSR7dGhpcy50YWJsZU5hbWV9YFxuICAgICAgICA6IFwiXCIpXG4gICAgKTtcbiAgfVxuXG4gIF9saW1pdCgpIHtcbiAgICByZXR1cm4gc3VwZXIubGltaXQoKS5yZXBsYWNlKFwibGltaXRcIiwgXCJmaXJzdFwiKTtcbiAgfVxuXG4gIF9vZmZzZXQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLm9mZnNldCgpLnJlcGxhY2UoXCJvZmZzZXRcIiwgXCJza2lwXCIpO1xuICB9XG5cbiAgb2Zmc2V0KCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgbGltaXQoKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBpbnNlcnQoKSB7XG4gICAgY29uc29sZS5sb2coJ2FxdWknKVxuICAgIGxldCBzcWwgPSBzdXBlci5pbnNlcnQoKTtcbiAgICBpZiAoc3FsID09PSBcIlwiKSByZXR1cm4gc3FsO1xuXG4gICAgY29uc29sZS5sb2coc3FsKVxuICAgIGNvbnN0IHsgcmV0dXJuaW5nIH0gPSB0aGlzLnNpbmdsZTtcbiAgICBpZiAocmV0dXJuaW5nKSBzcWwgKz0gdGhpcy5fcmV0dXJuaW5nKHJldHVybmluZyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3FsOiBzcWwsXG4gICAgICByZXR1cm5pbmcsXG4gICAgfTtcbiAgfVxuXG4gIF9pbnNlcnRCb2R5KGluc2VydFZhbHVlcykge1xuICAgIGNvbnNvbGUubG9nKGluc2VydFZhbHVlcylcbiAgICBsZXQgc3FsID0gJyc7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaW5zZXJ0VmFsdWVzKSkge1xuICAgICAgaWYgKGluc2VydFZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGluc2VydFZhbHVlcyA9PT0gJ29iamVjdCcgJiYgaXNFbXB0eShpbnNlcnRWYWx1ZXMpKSB7XG4gICAgICByZXR1cm4gc3FsICsgdGhpcy5fZW1wdHlJbnNlcnRWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnNlcnREYXRhID0gdGhpcy5fcHJlcEluc2VydChpbnNlcnRWYWx1ZXMpO1xuICAgIGNvbnNvbGUubG9nKGluc2VydERhdGEpXG4gICAgaWYgKHR5cGVvZiBpbnNlcnREYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgc3FsICs9IGluc2VydERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnNlcnREYXRhLmNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgIHNxbCArPSBgKCR7Y29sdW1uaXplXyhcbiAgICAgICAgICBpbnNlcnREYXRhLmNvbHVtbnMsXG4gICAgICAgICAgdGhpcy5idWlsZGVyLFxuICAgICAgICAgIHRoaXMuY2xpZW50LFxuICAgICAgICAgIHRoaXMuYmluZGluZ3NIb2xkZXJcbiAgICAgICAgKX1gO1xuICAgICAgICBzcWwgKz0gJykgdmFsdWVzICgnICsgdGhpcy5fYnVpbGRJbnNlcnRWYWx1ZXMoaW5zZXJ0RGF0YSkgKyAnKSc7XG4gICAgICB9IGVsc2UgaWYgKGluc2VydFZhbHVlcy5sZW5ndGggPT09IDEgJiYgaW5zZXJ0VmFsdWVzWzBdKSB7XG4gICAgICAgIHNxbCArPSB0aGlzLl9lbXB0eUluc2VydFZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3FsID0gJyc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzcWw7XG4gIH1cblxuICBfcmV0dXJuaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID8gYCByZXR1cm5pbmcgJHt0aGlzLmZvcm1hdHRlci5jb2x1bW5pemUodmFsdWUpfWAgOiBcIlwiO1xuICB9XG5cbiAgX3ByZXBJbnNlcnQoaW5zZXJ0VmFsdWVzKSB7XG4gICAgY29uc3QgbmV3VmFsdWVzID0ge307XG4gICAgY29uc29sZS5sb2coaW5zZXJ0VmFsdWVzKVxuICAgIGZvciAoY29uc3Qga2V5IGluIGluc2VydFZhbHVlcykge1xuICAgICAgaWYgKGluc2VydFZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5zZXJ0VmFsdWVzW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBuZXdWYWx1ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5fcHJlcEluc2VydChuZXdWYWx1ZXMpO1xuICB9XG4gIC8vIENvbXBpbGVzIGEgYGNvbHVtbkluZm9gIHF1ZXJ5XG4gIGNvbHVtbkluZm8oKSB7XG4gICAgY29uc3QgY29sdW1uID0gdGhpcy5zaW5nbGUuY29sdW1uSW5mbztcblxuICAgIC8vIFRoZSB1c2VyIG1heSBoYXZlIHNwZWNpZmllZCBhIGN1c3RvbSB3cmFwSWRlbnRpZmllciBmdW5jdGlvbiBpbiB0aGUgY29uZmlnLiBXZVxuICAgIC8vIG5lZWQgdG8gcnVuIHRoZSBpZGVudGlmaWVycyB0aHJvdWdoIHRoYXQgZnVuY3Rpb24sIGJ1dCBub3QgZm9ybWF0IHRoZW0gYXNcbiAgICAvLyBpZGVudGlmaWVycyBvdGhlcndpc2UuXG4gICAgY29uc3QgdGFibGUgPSB0aGlzLmNsaWVudC5jdXN0b21XcmFwSWRlbnRpZmllcihcbiAgICAgIHRoaXMuc2luZ2xlLnRhYmxlLFxuICAgICAgaWRlbnRpdHlcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNxbDogYFxuICAgICAgc2VsZWN0IFxuICAgICAgICBybGYucmRiJGZpZWxkX25hbWUgYXMgbmFtZSxcbiAgICAgICAgZmxkLnJkYiRjaGFyYWN0ZXJfbGVuZ3RoIGFzIG1heF9sZW5ndGgsXG4gICAgICAgIHR5cC5yZGIkdHlwZV9uYW1lIGFzIHR5cGUsXG4gICAgICAgIHJsZi5yZGIkbnVsbF9mbGFnIGFzIG5vdF9udWxsXG4gICAgICBmcm9tIHJkYiRyZWxhdGlvbl9maWVsZHMgcmxmXG4gICAgICBpbm5lciBqb2luIHJkYiRmaWVsZHMgZmxkIG9uIGZsZC5yZGIkZmllbGRfbmFtZSA9IHJsZi5yZGIkZmllbGRfc291cmNlXG4gICAgICBpbm5lciBqb2luIHJkYiR0eXBlcyB0eXAgb24gdHlwLnJkYiR0eXBlID0gZmxkLnJkYiRmaWVsZF90eXBlXG4gICAgICB3aGVyZSByZGIkcmVsYXRpb25fbmFtZSA9ICcke3RhYmxlfSdcbiAgICAgIGAsXG4gICAgICBvdXRwdXQocmVzcCkge1xuICAgICAgICBjb25zdCBbcm93cywgZmllbGRzXSA9IHJlc3A7XG5cbiAgICAgICAgY29uc3QgbWF4TGVuZ3RoUmVnZXggPSAvLipcXCgoXFxkKylcXCkvO1xuICAgICAgICBjb25zdCBvdXQgPSByZWR1Y2UoXG4gICAgICAgICAgcm93cyxcbiAgICAgICAgICBmdW5jdGlvbiAoY29sdW1ucywgdmFsKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdmFsLk5BTUUudHJpbSgpO1xuICAgICAgICAgICAgY29sdW1uc1tuYW1lXSA9IHtcbiAgICAgICAgICAgICAgdHlwZTogdmFsLlRZUEUudHJpbSgpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgIG51bGxhYmxlOiAhdmFsLk5PVF9OVUxMLFxuICAgICAgICAgICAgICAvLyBBVFNUT0RPOiBcImRlZmF1bHRWYWx1ZVwiIG7Do28gaW1wbGVtZW50YWRvXG4gICAgICAgICAgICAgIC8vIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh2YWwuTUFYX0xFTkdUSCkge1xuICAgICAgICAgICAgICBjb2x1bW5zW25hbWVdID0gdmFsLk1BWF9MRU5HVEg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb2x1bW5zO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge31cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIChjb2x1bW4gJiYgb3V0W2NvbHVtbl0pIHx8IG91dDtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBRdWVyeUNvbXBpbGVyX0ZpcmViaXJkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBQUEsY0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQXlELFNBQUFDLGFBQUFDLE9BQUEsUUFBQUMseUJBQUEsR0FBQUMseUJBQUEsb0JBQUFDLHFCQUFBLFFBQUFDLEtBQUEsT0FBQUMsZ0JBQUEsYUFBQUwsT0FBQSxHQUFBTSxNQUFBLE1BQUFMLHlCQUFBLFFBQUFNLFNBQUEsT0FBQUYsZ0JBQUEsbUJBQUFHLFdBQUEsRUFBQUYsTUFBQSxHQUFBRyxPQUFBLENBQUFDLFNBQUEsQ0FBQU4sS0FBQSxFQUFBTyxTQUFBLEVBQUFKLFNBQUEsWUFBQUQsTUFBQSxHQUFBRixLQUFBLENBQUFRLEtBQUEsT0FBQUQsU0FBQSxnQkFBQUUsMkJBQUEsbUJBQUFQLE1BQUE7QUFBQSxTQUFBSiwwQkFBQSxlQUFBTyxPQUFBLHFCQUFBQSxPQUFBLENBQUFDLFNBQUEsb0JBQUFELE9BQUEsQ0FBQUMsU0FBQSxDQUFBSSxJQUFBLDJCQUFBQyxLQUFBLG9DQUFBQyxPQUFBLENBQUFDLFNBQUEsQ0FBQUMsT0FBQSxDQUFBQyxJQUFBLENBQUFWLE9BQUEsQ0FBQUMsU0FBQSxDQUFBTSxPQUFBLDhDQUFBSSxDQUFBLHNCQUR6RDtBQUVBLElBQU1DLFFBQVEsR0FBR3ZCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztBQUMzQyxJQUFNd0IsTUFBTSxHQUFHeEIsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUFDLElBRWxDeUIsc0JBQXNCLDBCQUFBQyxjQUFBO0VBQUEsSUFBQUMsVUFBQSxhQUFBRixzQkFBQSxFQUFBQyxjQUFBO0VBQUEsSUFBQUUsTUFBQSxHQUFBM0IsWUFBQSxDQUFBd0Isc0JBQUE7RUFBQSxTQUFBQSx1QkFBQTtJ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