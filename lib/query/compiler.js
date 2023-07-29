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

    // _insertBody(insertValues) {
    //   console.log(insertValues)
    //   let sql = '';
    //   if (Array.isArray(insertValues)) {
    //     if (insertValues.length === 0) {
    //       return '';
    //     }
    //   } else if (typeof insertValues === 'object' && isEmpty(insertValues)) {
    //     return sql + this._emptyInsertValue;
    //   }

    //   const insertData = this._prepInsert(insertValues);
    //   console.log(insertData)
    //   if (typeof insertData === 'string') {
    //     sql += insertData;
    //   } else {
    //     if (insertData.columns.length) {
    //       sql += `(${columnize_(
    //         insertData.columns,
    //         this.builder,
    //         this.client,
    //         this.bindingsHolder
    //       )}`;
    //       sql += ') values (' + this._buildInsertValues(insertData) + ')';
    //     } else if (insertValues.length === 1 && insertValues[0]) {
    //       sql += this._emptyInsertValue;
    //     } else {
    //       sql = '';
    //     }
    //   }
    //   return sql;
    // }
  }, {
    key: "_returning",
    value: function _returning(value) {
      return value ? " returning ".concat(this.formatter.columnize(value)) : "";
    }

    // _prepInsert(insertValues) {
    //   const newValues = {};
    //   console.log('pqp',insertValues)
    //   for (const key in insertValues) {
    //     if (insertValues.hasOwnProperty(key)) {
    //       const value = insertValues[key];
    //       if (typeof value !== "undefined") {
    //         newValues[key] = value;
    //       }
    //     }
    //   }
    //   console.log(newValues)
    //   return super._prepInsert(newValues);
    // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcXVlcnljb21waWxlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJpZGVudGl0eSIsInJlZHVjZSIsIlF1ZXJ5Q29tcGlsZXJfRmlyZWJpcmQiLCJfUXVlcnlDb21waWxlciIsIl9pbmhlcml0czIiLCJfc3VwZXIiLCJfY2xhc3NDYWxsQ2hlY2syIiwiX2NyZWF0ZUNsYXNzMiIsImtleSIsInZhbHVlIiwiY29sdW1ucyIsImRpc3RpbmN0Q2xhdXNlIiwib25seVVuaW9ucyIsImhpbnRzIiwiX2hpbnRDb21tZW50cyIsImdyb3VwZWQiLCJpIiwic3FsIiwibGVuZ3RoIiwic3RtdCIsImRpc3RpbmN0IiwiZGlzdGluY3RPbiIsInR5cGUiLCJfc3FsIiwicHVzaCIsIl90b0NvbnN1bWFibGVBcnJheTIiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGVSYXciLCJhbmFseXRpYyIsImZvcm1hdHRlciIsImNvbHVtbml6ZSIsImNvbmNhdCIsIl9saW1pdCIsIl9vZmZzZXQiLCJqb2luIiwidGFibGVOYW1lIiwic2luZ2xlIiwib25seSIsIl9nZXQyIiwicmVwbGFjZSIsIm9mZnNldCIsImxpbWl0IiwiaW5zZXJ0IiwiY29uc29sZSIsImxvZyIsInJldHVybmluZyIsIl9yZXR1cm5pbmciLCJjb2x1bW5JbmZvIiwiY29sdW1uIiwidGFibGUiLCJjbGllbnQiLCJjdXN0b21XcmFwSWRlbnRpZmllciIsIm91dHB1dCIsInJlc3AiLCJfcmVzcCIsIl9zbGljZWRUb0FycmF5MiIsInJvd3MiLCJmaWVsZHMiLCJtYXhMZW5ndGhSZWdleCIsIm91dCIsInZhbCIsIm5hbWUiLCJOQU1FIiwidHJpbSIsIlRZUEUiLCJ0b0xvd2VyQ2FzZSIsIm51bGxhYmxlIiwiTk9UX05VTEwiLCJNQVhfTEVOR1RIIiwiUXVlcnlDb21waWxlciIsIl9kZWZhdWx0IiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9xdWVyeS9jb21waWxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBGaXJlYmlyZCBRdWVyeSBCdWlsZGVyICYgQ29tcGlsZXJcbmltcG9ydCBRdWVyeUNvbXBpbGVyIGZyb20gXCJrbmV4L2xpYi9xdWVyeS9xdWVyeWNvbXBpbGVyXCI7XG5jb25zdCBpZGVudGl0eSA9IHJlcXVpcmUoJ2xvZGFzaC9pZGVudGl0eScpO1xuY29uc3QgcmVkdWNlID0gcmVxdWlyZSgnbG9kYXNoL3JlZHVjZScpO1xuXG5jbGFzcyBRdWVyeUNvbXBpbGVyX0ZpcmViaXJkIGV4dGVuZHMgUXVlcnlDb21waWxlciB7XG4gIGNvbHVtbnMoKSB7XG4gICAgbGV0IGRpc3RpbmN0Q2xhdXNlID0gXCJcIjtcbiAgICBpZiAodGhpcy5vbmx5VW5pb25zKCkpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIGNvbnN0IGhpbnRzID0gdGhpcy5faGludENvbW1lbnRzKCk7XG4gICAgY29uc3QgY29sdW1ucyA9IHRoaXMuZ3JvdXBlZC5jb2x1bW5zIHx8IFtdO1xuICAgIGxldCBpID0gLTEsXG4gICAgICBzcWwgPSBbXTtcblxuICAgIGlmIChjb2x1bW5zKSB7XG4gICAgICB3aGlsZSAoKytpIDwgY29sdW1ucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc3RtdCA9IGNvbHVtbnNbaV07XG4gICAgICAgIGlmIChzdG10LmRpc3RpbmN0KSBkaXN0aW5jdENsYXVzZSA9IFwiZGlzdGluY3QgXCI7XG4gICAgICAgIGlmIChzdG10LmRpc3RpbmN0T24pIHtcbiAgICAgICAgICBkaXN0aW5jdENsYXVzZSA9IHRoaXMuZGlzdGluY3RPbihzdG10LnZhbHVlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RtdC50eXBlID09PSBcImFnZ3JlZ2F0ZVwiKSB7XG4gICAgICAgICAgc3FsLnB1c2goLi4udGhpcy5hZ2dyZWdhdGUoc3RtdCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0bXQudHlwZSA9PT0gXCJhZ2dyZWdhdGVSYXdcIikge1xuICAgICAgICAgIHNxbC5wdXNoKHRoaXMuYWdncmVnYXRlUmF3KHN0bXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdG10LnR5cGUgPT09IFwiYW5hbHl0aWNcIikge1xuICAgICAgICAgIHNxbC5wdXNoKHRoaXMuYW5hbHl0aWMoc3RtdCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0bXQudmFsdWUgJiYgc3RtdC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc3FsLnB1c2godGhpcy5mb3JtYXR0ZXIuY29sdW1uaXplKHN0bXQudmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3FsLmxlbmd0aCA9PT0gMCkgc3FsID0gW1wiKlwiXTtcbiAgICByZXR1cm4gKFxuICAgICAgYHNlbGVjdCAke3RoaXMuX2xpbWl0KCl9ICR7dGhpcy5fb2Zmc2V0KCl9ICR7aGludHN9JHtkaXN0aW5jdENsYXVzZX1gICtcbiAgICAgIHNxbC5qb2luKFwiLCBcIikgK1xuICAgICAgKHRoaXMudGFibGVOYW1lXG4gICAgICAgID8gYCBmcm9tICR7dGhpcy5zaW5nbGUub25seSA/IFwib25seSBcIiA6IFwiXCJ9JHt0aGlzLnRhYmxlTmFtZX1gXG4gICAgICAgIDogXCJcIilcbiAgICApO1xuICB9XG5cbiAgX2xpbWl0KCkge1xuICAgIHJldHVybiBzdXBlci5saW1pdCgpLnJlcGxhY2UoXCJsaW1pdFwiLCBcImZpcnN0XCIpO1xuICB9XG5cbiAgX29mZnNldCgpIHtcbiAgICByZXR1cm4gc3VwZXIub2Zmc2V0KCkucmVwbGFjZShcIm9mZnNldFwiLCBcInNraXBcIik7XG4gIH1cblxuICBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICBsaW1pdCgpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIGluc2VydCgpIHtcbiAgICBjb25zb2xlLmxvZygnYXF1aScpXG4gICAgbGV0IHNxbCA9IHN1cGVyLmluc2VydCgpO1xuICAgIGlmIChzcWwgPT09IFwiXCIpIHJldHVybiBzcWw7XG5cbiAgICBjb25zb2xlLmxvZyhzcWwpXG4gICAgY29uc3QgeyByZXR1cm5pbmcgfSA9IHRoaXMuc2luZ2xlO1xuICAgIGlmIChyZXR1cm5pbmcpIHNxbCArPSB0aGlzLl9yZXR1cm5pbmcocmV0dXJuaW5nKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzcWw6IHNxbCxcbiAgICAgIHJldHVybmluZyxcbiAgICB9O1xuICB9XG5cbiAgLy8gX2luc2VydEJvZHkoaW5zZXJ0VmFsdWVzKSB7XG4gIC8vICAgY29uc29sZS5sb2coaW5zZXJ0VmFsdWVzKVxuICAvLyAgIGxldCBzcWwgPSAnJztcbiAgLy8gICBpZiAoQXJyYXkuaXNBcnJheShpbnNlcnRWYWx1ZXMpKSB7XG4gIC8vICAgICBpZiAoaW5zZXJ0VmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAvLyAgICAgICByZXR1cm4gJyc7XG4gIC8vICAgICB9XG4gIC8vICAgfSBlbHNlIGlmICh0eXBlb2YgaW5zZXJ0VmFsdWVzID09PSAnb2JqZWN0JyAmJiBpc0VtcHR5KGluc2VydFZhbHVlcykpIHtcbiAgLy8gICAgIHJldHVybiBzcWwgKyB0aGlzLl9lbXB0eUluc2VydFZhbHVlO1xuICAvLyAgIH1cblxuICAvLyAgIGNvbnN0IGluc2VydERhdGEgPSB0aGlzLl9wcmVwSW5zZXJ0KGluc2VydFZhbHVlcyk7XG4gIC8vICAgY29uc29sZS5sb2coaW5zZXJ0RGF0YSlcbiAgLy8gICBpZiAodHlwZW9mIGluc2VydERhdGEgPT09ICdzdHJpbmcnKSB7XG4gIC8vICAgICBzcWwgKz0gaW5zZXJ0RGF0YTtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgaWYgKGluc2VydERhdGEuY29sdW1ucy5sZW5ndGgpIHtcbiAgLy8gICAgICAgc3FsICs9IGAoJHtjb2x1bW5pemVfKFxuICAvLyAgICAgICAgIGluc2VydERhdGEuY29sdW1ucyxcbiAgLy8gICAgICAgICB0aGlzLmJ1aWxkZXIsXG4gIC8vICAgICAgICAgdGhpcy5jbGllbnQsXG4gIC8vICAgICAgICAgdGhpcy5iaW5kaW5nc0hvbGRlclxuICAvLyAgICAgICApfWA7XG4gIC8vICAgICAgIHNxbCArPSAnKSB2YWx1ZXMgKCcgKyB0aGlzLl9idWlsZEluc2VydFZhbHVlcyhpbnNlcnREYXRhKSArICcpJztcbiAgLy8gICAgIH0gZWxzZSBpZiAoaW5zZXJ0VmFsdWVzLmxlbmd0aCA9PT0gMSAmJiBpbnNlcnRWYWx1ZXNbMF0pIHtcbiAgLy8gICAgICAgc3FsICs9IHRoaXMuX2VtcHR5SW5zZXJ0VmFsdWU7XG4gIC8vICAgICB9IGVsc2Uge1xuICAvLyAgICAgICBzcWwgPSAnJztcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vICAgcmV0dXJuIHNxbDtcbiAgLy8gfVxuXG4gIF9yZXR1cm5pbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPyBgIHJldHVybmluZyAke3RoaXMuZm9ybWF0dGVyLmNvbHVtbml6ZSh2YWx1ZSl9YCA6IFwiXCI7XG4gIH1cblxuICAvLyBfcHJlcEluc2VydChpbnNlcnRWYWx1ZXMpIHtcbiAgLy8gICBjb25zdCBuZXdWYWx1ZXMgPSB7fTtcbiAgLy8gICBjb25zb2xlLmxvZygncHFwJyxpbnNlcnRWYWx1ZXMpXG4gIC8vICAgZm9yIChjb25zdCBrZXkgaW4gaW5zZXJ0VmFsdWVzKSB7XG4gIC8vICAgICBpZiAoaW5zZXJ0VmFsdWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgLy8gICAgICAgY29uc3QgdmFsdWUgPSBpbnNlcnRWYWx1ZXNba2V5XTtcbiAgLy8gICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAvLyAgICAgICAgIG5ld1ZhbHVlc1trZXldID0gdmFsdWU7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vICAgY29uc29sZS5sb2cobmV3VmFsdWVzKVxuICAvLyAgIHJldHVybiBzdXBlci5fcHJlcEluc2VydChuZXdWYWx1ZXMpO1xuICAvLyB9XG4gIC8vIENvbXBpbGVzIGEgYGNvbHVtbkluZm9gIHF1ZXJ5XG4gIGNvbHVtbkluZm8oKSB7XG4gICAgY29uc3QgY29sdW1uID0gdGhpcy5zaW5nbGUuY29sdW1uSW5mbztcblxuICAgIC8vIFRoZSB1c2VyIG1heSBoYXZlIHNwZWNpZmllZCBhIGN1c3RvbSB3cmFwSWRlbnRpZmllciBmdW5jdGlvbiBpbiB0aGUgY29uZmlnLiBXZVxuICAgIC8vIG5lZWQgdG8gcnVuIHRoZSBpZGVudGlmaWVycyB0aHJvdWdoIHRoYXQgZnVuY3Rpb24sIGJ1dCBub3QgZm9ybWF0IHRoZW0gYXNcbiAgICAvLyBpZGVudGlmaWVycyBvdGhlcndpc2UuXG4gICAgY29uc3QgdGFibGUgPSB0aGlzLmNsaWVudC5jdXN0b21XcmFwSWRlbnRpZmllcihcbiAgICAgIHRoaXMuc2luZ2xlLnRhYmxlLFxuICAgICAgaWRlbnRpdHlcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNxbDogYFxuICAgICAgc2VsZWN0IFxuICAgICAgICBybGYucmRiJGZpZWxkX25hbWUgYXMgbmFtZSxcbiAgICAgICAgZmxkLnJkYiRjaGFyYWN0ZXJfbGVuZ3RoIGFzIG1heF9sZW5ndGgsXG4gICAgICAgIHR5cC5yZGIkdHlwZV9uYW1lIGFzIHR5cGUsXG4gICAgICAgIHJsZi5yZGIkbnVsbF9mbGFnIGFzIG5vdF9udWxsXG4gICAgICBmcm9tIHJkYiRyZWxhdGlvbl9maWVsZHMgcmxmXG4gICAgICBpbm5lciBqb2luIHJkYiRmaWVsZHMgZmxkIG9uIGZsZC5yZGIkZmllbGRfbmFtZSA9IHJsZi5yZGIkZmllbGRfc291cmNlXG4gICAgICBpbm5lciBqb2luIHJkYiR0eXBlcyB0eXAgb24gdHlwLnJkYiR0eXBlID0gZmxkLnJkYiRmaWVsZF90eXBlXG4gICAgICB3aGVyZSByZGIkcmVsYXRpb25fbmFtZSA9ICcke3RhYmxlfSdcbiAgICAgIGAsXG4gICAgICBvdXRwdXQocmVzcCkge1xuICAgICAgICBjb25zdCBbcm93cywgZmllbGRzXSA9IHJlc3A7XG5cbiAgICAgICAgY29uc3QgbWF4TGVuZ3RoUmVnZXggPSAvLipcXCgoXFxkKylcXCkvO1xuICAgICAgICBjb25zdCBvdXQgPSByZWR1Y2UoXG4gICAgICAgICAgcm93cyxcbiAgICAgICAgICBmdW5jdGlvbiAoY29sdW1ucywgdmFsKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdmFsLk5BTUUudHJpbSgpO1xuICAgICAgICAgICAgY29sdW1uc1tuYW1lXSA9IHtcbiAgICAgICAgICAgICAgdHlwZTogdmFsLlRZUEUudHJpbSgpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgIG51bGxhYmxlOiAhdmFsLk5PVF9OVUxMLFxuICAgICAgICAgICAgICAvLyBBVFNUT0RPOiBcImRlZmF1bHRWYWx1ZVwiIG7Do28gaW1wbGVtZW50YWRvXG4gICAgICAgICAgICAgIC8vIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh2YWwuTUFYX0xFTkdUSCkge1xuICAgICAgICAgICAgICBjb2x1bW5zW25hbWVdID0gdmFsLk1BWF9MRU5HVEg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb2x1bW5zO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge31cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIChjb2x1bW4gJiYgb3V0W2NvbHVtbl0pIHx8IG91dDtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBRdWVyeUNvbXBpbGVyX0ZpcmViaXJkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFBQSxjQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBeUQsU0FBQUMsYUFBQUMsT0FBQSxRQUFBQyx5QkFBQSxHQUFBQyx5QkFBQSxvQkFBQUMscUJBQUEsUUFBQUMsS0FBQSxPQUFBQyxnQkFBQSxhQUFBTCxPQUFBLEdBQUFNLE1BQUEsTUFBQUwseUJBQUEsUUFBQU0sU0FBQSxPQUFBRixnQkFBQSxtQkFBQUcsV0FBQSxFQUFBRixNQUFBLEdBQUFHLE9BQUEsQ0FBQUMsU0FBQSxDQUFBTixLQUFBLEVBQUFPLFNBQUEsRUFBQUosU0FBQSxZQUFBRCxNQUFBLEdBQUFGLEtBQUEsQ0FBQVEsS0FBQSxPQUFBRCxTQUFBLGdCQUFBRSwyQkFBQSxtQkFBQVAsTUFBQTtBQUFBLFNBQUFKLDBCQUFBLGVBQUFPLE9BQUEscUJBQUFBLE9BQUEsQ0FBQUMsU0FBQSxvQkFBQUQsT0FBQSxDQUFBQyxTQUFBLENBQUFJLElBQUEsMkJBQUFDLEtBQUEsb0NBQUFDLE9BQUEsQ0FBQUMsU0FBQSxDQUFBQyxPQUFBLENBQUFDLElBQUEsQ0FBQVYsT0FBQSxDQUFBQyxTQUFBLENBQUFNLE9BQUEsOENBQUFJLENBQUEsc0JBRHpEO0FBRUEsSUFBTUMsUUFBUSxHQUFHdkIsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0FBQzNDLElBQU13QixNQUFNLEdBQUd4QixPQUFPLENBQUMsZUFBZSxDQUFDO0FBQUMsSUFFbEN5QixzQkFBc0IsMEJBQUFDLGNBQUE7RUFBQSxJQUFBQyxVQUFBLGFBQUFGLHNCQUFBLEVBQUFDLGNBQUE7RUFBQSxJQUFBRSxNQUFBLEdBQUEzQixZQUFBLENBQUF3QixzQkFBQTtFQUFBLFNBQUFBLHVCQUFBO0lBQUEsSUFBQUksZ0JBQUEsbUJBQUFKLHNCQUFBO0lBQUEsT0FB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