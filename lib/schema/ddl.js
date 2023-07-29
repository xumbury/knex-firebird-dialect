"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _lodash = require("lodash");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } // Firebird_DDL
//
//
// columns and changing datatypes.
// -------
var Firebird_DDL = /*#__PURE__*/function () {
  function Firebird_DDL(client, tableCompiler, pragma, connection) {
    (0, _classCallCheck2["default"])(this, Firebird_DDL);
    this.client = client;
    this.tableCompiler = tableCompiler;
    this.pragma = pragma;
    this.tableNameRaw = this.tableCompiler.tableNameRaw;
    this.alteredName = (0, _lodash.uniqueId)('_knex_temp_alter');
    this.connection = connection;
    this.formatter = client && client.config && client.config.wrapIdentifier ? client.config.wrapIdentifier : function (value) {
      return value;
    };
  }
  (0, _createClass2["default"])(Firebird_DDL, [{
    key: "tableName",
    value: function tableName() {
      return this.formatter(this.tableNameRaw, function (value) {
        return value;
      });
    }
  }, {
    key: "getColumn",
    value: function () {
      var _getColumn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(column) {
        var _this = this;
        var currentCol;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              currentCol = (0, _lodash.find)(this.pragma, function (col) {
                return _this.client.wrapIdentifier(col.name).toLowerCase() === _this.client.wrapIdentifier(column).toLowerCase();
              });
              if (currentCol) {
                _context.next = 3;
                break;
              }
              throw new Error("The column ".concat(column, " is not in the ").concat(this.tableName(), " table"));
            case 3:
              return _context.abrupt("return", currentCol);
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getColumn(_x) {
        return _getColumn.apply(this, arguments);
      }
      return getColumn;
    }()
  }, {
    key: "getTableSql",
    value: function getTableSql() {
      var _this2 = this;
      this.trx.disableProcessing();
      return this.trx.raw("SELECT name, sql FROM sqlite_master WHERE type=\"table\" AND name=\"".concat(this.tableName(), "\"")).then(function (result) {
        _this2.trx.enableProcessing();
        return result;
      });
    }
  }, {
    key: "renameTable",
    value: function () {
      var _renameTable = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", this.trx.raw("ALTER TABLE \"".concat(this.tableName(), "\" RENAME TO \"").concat(this.alteredName, "\"")));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function renameTable() {
        return _renameTable.apply(this, arguments);
      }
      return renameTable;
    }()
  }, {
    key: "dropOriginal",
    value: function dropOriginal() {
      return this.trx.raw("DROP TABLE \"".concat(this.tableName(), "\""));
    }
  }, {
    key: "dropTempTable",
    value: function dropTempTable() {
      return this.trx.raw("DROP TABLE \"".concat(this.alteredName, "\""));
    }
  }, {
    key: "copyData",
    value: function copyData() {
      var _this3 = this;
      return this.trx.raw("SELECT * FROM \"".concat(this.tableName(), "\"")).then(function (result) {
        return _this3.insertChunked(20, _this3.alteredName, _lodash.identity, result);
      });
    }
  }, {
    key: "reinsertData",
    value: function reinsertData(iterator) {
      var _this4 = this;
      return this.trx.raw("SELECT * FROM \"".concat(this.alteredName, "\"")).then(function (result) {
        return _this4.insertChunked(20, _this4.tableName(), iterator, result);
      });
    }
  }, {
    key: "insertChunked",
    value: function () {
      var _insertChunked = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(chunkSize, target, iterator, result) {
        var chunked, _iterator, _step, batch;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              iterator = iterator || _lodash.identity;
              chunked = (0, _lodash.chunk)(result, chunkSize);
              _iterator = _createForOfIteratorHelper(chunked);
              _context3.prev = 3;
              _iterator.s();
            case 5:
              if ((_step = _iterator.n()).done) {
                _context3.next = 11;
                break;
              }
              batch = _step.value;
              _context3.next = 9;
              return this.trx.queryBuilder().table(target).insert((0, _lodash.map)(batch, iterator));
            case 9:
              _context3.next = 5;
              break;
            case 11:
              _context3.next = 16;
              break;
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](3);
              _iterator.e(_context3.t0);
            case 16:
              _context3.prev = 16;
              _iterator.f();
              return _context3.finish(16);
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[3, 13, 16, 19]]);
      }));
      function insertChunked(_x2, _x3, _x4, _x5) {
        return _insertChunked.apply(this, arguments);
      }
      return insertChunked;
    }()
  }, {
    key: "createTempTable",
    value: function createTempTable(createTable) {
      return this.trx.raw(createTable.sql.replace(this.tableName(), this.alteredName));
    }
  }, {
    key: "_doReplace",
    value: function _doReplace(sql, from, to) {
      var oneLineSql = sql.replace(/\s+/g, ' ');
      var matched = oneLineSql.match(/^CREATE TABLE\s+(\S+)\s*\((.*)\)/);
      var tableName = matched[1];
      var defs = matched[2];
      if (!defs) {
        throw new Error('No column definitions in this statement!');
      }
      var parens = 0,
        args = [],
        ptr = 0;
      var i = 0;
      var x = defs.length;
      for (i = 0; i < x; i++) {
        switch (defs[i]) {
          case '(':
            parens++;
            break;
          case ')':
            parens--;
            break;
          case ',':
            if (parens === 0) {
              args.push(defs.slice(ptr, i));
              ptr = i + 1;
            }
            break;
          case ' ':
            if (ptr === i) {
              ptr = i + 1;
            }
            break;
        }
      }
      args.push(defs.slice(ptr, i));
      var fromIdentifier = from.replace(/[`"'[\]]/g, '');
      args = args.map(function (item) {
        item = item.trim();
        var split = item.split(' ');
        var fromMatchCandidates = [new RegExp("`".concat(fromIdentifier, "`"), 'i'), new RegExp("\"".concat(fromIdentifier, "\""), 'i'), new RegExp("'".concat(fromIdentifier, "'"), 'i'), new RegExp("\\[".concat(fromIdentifier, "\\]"), 'i')];
        if (fromIdentifier.match(/^\S+$/)) {
          fromMatchCandidates.push(new RegExp("\\b".concat(fromIdentifier, "\\b"), 'i'));
        }
        var doesMatchFromIdentifier = function doesMatchFromIdentifier(target) {
          return (0, _lodash.some)(fromMatchCandidates, function (c) {
            return target.match(c);
          });
        };
        var replaceFromIdentifier = function replaceFromIdentifier(target) {
          return fromMatchCandidates.reduce(function (result, candidate) {
            return result.replace(candidate, to);
          }, target);
        };
        if (doesMatchFromIdentifier(split[0])) {
          // column definition
          if (to) {
            split[0] = to;
            return split.join(' ');
          }
          return ''; // for deletions
        }

        // skip constraint name
        var idx = /constraint/i.test(split[0]) ? 2 : 0;

        // primary key and unique constraints have one or more
        // columns from this table listed between (); replace
        // one if it matches
        if (/primary|unique/i.test(split[idx])) {
          var ret = item.replace(/\(.*\)/, replaceFromIdentifier);
          // If any member columns are dropped then uniqueness/pk constraint
          // can not be retained
          if (ret !== item && (0, _lodash.isEmpty)(to)) return '';
          return ret;
        }

        // foreign keys have one or more columns from this table
        // listed between (); replace one if it matches
        // foreign keys also have a 'references' clause
        // which may reference THIS table; if it does, replace
        // column references in that too!
        if (/foreign/.test(split[idx])) {
          split = item.split(/ references /i);
          // the quoted column names save us from having to do anything
          // other than a straight replace here
          var replacedKeySpec = replaceFromIdentifier(split[0]);
          if (split[0] !== replacedKeySpec) {
            // If we are removing one or more columns of a foreign
            // key, then we should not retain the key at all
            if ((0, _lodash.isEmpty)(to)) return '';else split[0] = replacedKeySpec;
          }
          if (split[1].slice(0, tableName.length) === tableName) {
            // self-referential foreign key
            var replacedKeyTargetSpec = split[1].replace(/\(.*\)/, replaceFromIdentifier);
            if (split[1] !== replacedKeyTargetSpec) {
              // If we are removing one or more columns of a foreign
              // key, then we should not retain the key at all
              if ((0, _lodash.isEmpty)(to)) return '';else split[1] = replacedKeyTargetSpec;
            }
          }
          return split.join(' references ');
        }
        return item;
      });
      args = args.filter((0, _lodash.negate)(_lodash.isEmpty));
      if (args.length === 0) {
        throw new Error('Unable to drop last column from table');
      }
      return oneLineSql.replace(/\(.*\)/, function () {
        return "(".concat(args.join(', '), ")");
      }).replace(/,\s*([,)])/, '$1');
    }
  }]);
  return Firebird_DDL;
}();
var _default = Firebird_DDL;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbG9kYXNoIiwicmVxdWlyZSIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwibyIsImFsbG93QXJyYXlMaWtlIiwiaXQiLCJTeW1ib2wiLCJpdGVyYXRvciIsIkFycmF5IiwiaXNBcnJheSIsIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsImxlbmd0aCIsImkiLCJGIiwicyIsIm4iLCJkb25lIiwidmFsdWUiLCJlIiwiX2UiLCJmIiwiVHlwZUVycm9yIiwibm9ybWFsQ29tcGxldGlvbiIsImRpZEVyciIsImVyciIsImNhbGwiLCJzdGVwIiwibmV4dCIsIl9lMiIsIm1pbkxlbiIsIl9hcnJheUxpa2VUb0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJzbGljZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsImZyb20iLCJ0ZXN0IiwiYXJyIiwibGVuIiwiYXJyMiIsIkZpcmViaXJkX0RETCIsImNsaWVudCIsInRhYmxlQ29tcGlsZXIiLCJwcmFnbWEiLCJjb25uZWN0aW9uIiwiX2NsYXNzQ2FsbENoZWNrMiIsInRhYmxlTmFtZVJhdyIsImFsdGVyZWROYW1lIiwidW5pcXVlSWQiLCJmb3JtYXR0ZXIiLCJjb25maWciLCJ3cmFwSWRlbnRpZmllciIsIl9jcmVhdGVDbGFzczIiLCJrZXkiLCJ0YWJsZU5hbWUiLCJfZ2V0Q29sdW1uIiwiX2FzeW5jVG9HZW5lcmF0b3IyIiwiX3JlZ2VuZXJhdG9yIiwibWFyayIsIl9jYWxsZWUiLCJjb2x1bW4iLCJfdGhpcyIsImN1cnJlbnRDb2wiLCJ3cmFwIiwiX2NhbGxlZSQiLCJfY29udGV4dCIsInByZXYiLCJmaW5kIiwiY29sIiwidG9Mb3dlckNhc2UiLCJFcnJvciIsImNvbmNhdCIsImFicnVwdCIsInN0b3AiLCJnZXRDb2x1bW4iLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiZ2V0VGFibGVTcWwiLCJfdGhpczIiLCJ0cngiLCJkaXNhYmxlUHJvY2Vzc2luZyIsInJhdyIsInRoZW4iLCJyZXN1bHQiLCJlbmFibGVQcm9jZXNzaW5nIiwiX3JlbmFtZVRhYmxlIiwiX2NhbGxlZTIiLCJfY2FsbGVlMiQiLCJfY29udGV4dDIiLCJyZW5hbWVUYWJsZSIsImRyb3BPcmlnaW5hbCIsImRyb3BUZW1wVGFibGUiLCJjb3B5RGF0YSIsIl90aGlzMyIsImluc2VydENodW5rZWQiLCJpZGVudGl0eSIsInJlaW5zZXJ0RGF0YSIsIl90aGlzNCIsIl9pbnNlcnRDaHVua2VkIiwiX2NhbGxlZTMiLCJjaHVua1NpemUiLCJ0YXJnZXQiLCJjaHVua2VkIiwiX2l0ZXJhdG9yIiwiX3N0ZXAiLCJiYXRjaCIsIl9jYWxsZWUzJCIsIl9jb250ZXh0MyIsImNodW5rIiwicXVlcnlCdWlsZGVyIiwidGFibGUiLCJpbnNlcnQiLCJtYXAiLCJ0MCIsImZpbmlzaCIsIl94MiIsIl94MyIsIl94NCIsIl94NSIsImNyZWF0ZVRlbXBUYWJsZSIsImNyZWF0ZVRhYmxlIiwic3FsIiwicmVwbGFjZSIsIl9kb1JlcGxhY2UiLCJ0byIsIm9uZUxpbmVTcWwiLCJtYXRjaGVkIiwibWF0Y2giLCJkZWZzIiwicGFyZW5zIiwiYXJncyIsInB0ciIsIngiLCJwdXNoIiwiZnJvbUlkZW50aWZpZXIiLCJpdGVtIiwidHJpbSIsInNwbGl0IiwiZnJvbU1hdGNoQ2FuZGlkYXRlcyIsIlJlZ0V4cCIsImRvZXNNYXRjaEZyb21JZGVudGlmaWVyIiwic29tZSIsImMiLCJyZXBsYWNlRnJvbUlkZW50aWZpZXIiLCJyZWR1Y2UiLCJjYW5kaWRhdGUiLCJqb2luIiwiaWR4IiwicmV0IiwiaXNFbXB0eSIsInJlcGxhY2VkS2V5U3BlYyIsInJlcGxhY2VkS2V5VGFyZ2V0U3BlYyIsImZpbHRlciIsIm5lZ2F0ZSIsIl9kZWZhdWx0IiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWEvZGRsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEZpcmViaXJkX0RETFxuLy9cbi8vXG4vLyBjb2x1bW5zIGFuZCBjaGFuZ2luZyBkYXRhdHlwZXMuXG4vLyAtLS0tLS0tXG5cbmltcG9ydCB7XG4gIHVuaXF1ZUlkLFxuICBmaW5kLFxuICBpZGVudGl0eSxcbiAgbWFwLFxuICBzb21lLFxuICBuZWdhdGUsXG4gIGlzRW1wdHksXG4gIGNodW5rLFxufSBmcm9tICdsb2Rhc2gnO1xuXG5cbmNsYXNzIEZpcmViaXJkX0RETCB7XG4gIGNvbnN0cnVjdG9yKGNsaWVudCwgdGFibGVDb21waWxlciwgcHJhZ21hLCBjb25uZWN0aW9uKSB7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy50YWJsZUNvbXBpbGVyID0gdGFibGVDb21waWxlcjtcbiAgICB0aGlzLnByYWdtYSA9IHByYWdtYTtcbiAgICB0aGlzLnRhYmxlTmFtZVJhdyA9IHRoaXMudGFibGVDb21waWxlci50YWJsZU5hbWVSYXc7XG4gICAgdGhpcy5hbHRlcmVkTmFtZSA9IHVuaXF1ZUlkKCdfa25leF90ZW1wX2FsdGVyJyk7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcbiAgICB0aGlzLmZvcm1hdHRlciA9XG4gICAgICBjbGllbnQgJiYgY2xpZW50LmNvbmZpZyAmJiBjbGllbnQuY29uZmlnLndyYXBJZGVudGlmaWVyXG4gICAgICAgID8gY2xpZW50LmNvbmZpZy53cmFwSWRlbnRpZmllclxuICAgICAgICA6ICh2YWx1ZSkgPT4gdmFsdWU7XG4gIH1cblxuICB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0dGVyKHRoaXMudGFibGVOYW1lUmF3LCAodmFsdWUpID0+IHZhbHVlKTtcbiAgfVxuXG4gIGFzeW5jIGdldENvbHVtbihjb2x1bW4pIHtcbiAgICBjb25zdCBjdXJyZW50Q29sID0gZmluZCh0aGlzLnByYWdtYSwgKGNvbCkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5jbGllbnQud3JhcElkZW50aWZpZXIoY29sLm5hbWUpLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgIHRoaXMuY2xpZW50LndyYXBJZGVudGlmaWVyKGNvbHVtbikudG9Mb3dlckNhc2UoKVxuICAgICAgKTtcbiAgICB9KTtcbiAgICBpZiAoIWN1cnJlbnRDb2wpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUaGUgY29sdW1uICR7Y29sdW1ufSBpcyBub3QgaW4gdGhlICR7dGhpcy50YWJsZU5hbWUoKX0gdGFibGVgXG4gICAgICApO1xuICAgIHJldHVybiBjdXJyZW50Q29sO1xuICB9XG5cbiAgZ2V0VGFibGVTcWwoKSB7XG4gICAgdGhpcy50cnguZGlzYWJsZVByb2Nlc3NpbmcoKTtcbiAgICByZXR1cm4gdGhpcy50cnhcbiAgICAgIC5yYXcoXG4gICAgICAgIGBTRUxFQ1QgbmFtZSwgc3FsIEZST00gc3FsaXRlX21hc3RlciBXSEVSRSB0eXBlPVwidGFibGVcIiBBTkQgbmFtZT1cIiR7dGhpcy50YWJsZU5hbWUoKX1cImBcbiAgICAgIClcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy50cnguZW5hYmxlUHJvY2Vzc2luZygpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gIH1cblxuICBhc3luYyByZW5hbWVUYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy50cngucmF3KFxuICAgICAgYEFMVEVSIFRBQkxFIFwiJHt0aGlzLnRhYmxlTmFtZSgpfVwiIFJFTkFNRSBUTyBcIiR7dGhpcy5hbHRlcmVkTmFtZX1cImBcbiAgICApO1xuICB9XG5cbiAgZHJvcE9yaWdpbmFsKCkge1xuICAgIHJldHVybiB0aGlzLnRyeC5yYXcoYERST1AgVEFCTEUgXCIke3RoaXMudGFibGVOYW1lKCl9XCJgKTtcbiAgfVxuXG4gIGRyb3BUZW1wVGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJ4LnJhdyhgRFJPUCBUQUJMRSBcIiR7dGhpcy5hbHRlcmVkTmFtZX1cImApO1xuICB9XG5cbiAgY29weURhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJ4XG4gICAgICAucmF3KGBTRUxFQ1QgKiBGUk9NIFwiJHt0aGlzLnRhYmxlTmFtZSgpfVwiYClcbiAgICAgIC50aGVuKChyZXN1bHQpID0+XG4gICAgICAgIHRoaXMuaW5zZXJ0Q2h1bmtlZCgyMCwgdGhpcy5hbHRlcmVkTmFtZSwgaWRlbnRpdHksIHJlc3VsdClcbiAgICAgICk7XG4gIH1cblxuICByZWluc2VydERhdGEoaXRlcmF0b3IpIHtcbiAgICByZXR1cm4gdGhpcy50cnhcbiAgICAgIC5yYXcoYFNFTEVDVCAqIEZST00gXCIke3RoaXMuYWx0ZXJlZE5hbWV9XCJgKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT5cbiAgICAgICAgdGhpcy5pbnNlcnRDaHVua2VkKDIwLCB0aGlzLnRhYmxlTmFtZSgpLCBpdGVyYXRvciwgcmVzdWx0KVxuICAgICAgKTtcbiAgfVxuXG4gIGFzeW5jIGluc2VydENodW5rZWQoY2h1bmtTaXplLCB0YXJnZXQsIGl0ZXJhdG9yLCByZXN1bHQpIHtcbiAgICBpdGVyYXRvciA9IGl0ZXJhdG9yIHx8IGlkZW50aXR5O1xuICAgIGNvbnN0IGNodW5rZWQgPSBjaHVuayhyZXN1bHQsIGNodW5rU2l6ZSk7XG4gICAgZm9yIChjb25zdCBiYXRjaCBvZiBjaHVua2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyeFxuICAgICAgICAucXVlcnlCdWlsZGVyKClcbiAgICAgICAgLnRhYmxlKHRhcmdldClcbiAgICAgICAgLmluc2VydChtYXAoYmF0Y2gsIGl0ZXJhdG9yKSk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlVGVtcFRhYmxlKGNyZWF0ZVRhYmxlKSB7XG4gICAgcmV0dXJuIHRoaXMudHJ4LnJhdyhcbiAgICAgIGNyZWF0ZVRhYmxlLnNxbC5yZXBsYWNlKHRoaXMudGFibGVOYW1lKCksIHRoaXMuYWx0ZXJlZE5hbWUpXG4gICAgKTtcbiAgfVxuXG4gIF9kb1JlcGxhY2Uoc3FsLCBmcm9tLCB0bykge1xuICAgIGNvbnN0IG9uZUxpbmVTcWwgPSBzcWwucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgIGNvbnN0IG1hdGNoZWQgPSBvbmVMaW5lU3FsLm1hdGNoKC9eQ1JFQVRFIFRBQkxFXFxzKyhcXFMrKVxccypcXCgoLiopXFwpLyk7XG5cbiAgICBjb25zdCB0YWJsZU5hbWUgPSBtYXRjaGVkWzFdO1xuICAgIGNvbnN0IGRlZnMgPSBtYXRjaGVkWzJdO1xuXG4gICAgaWYgKCFkZWZzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbHVtbiBkZWZpbml0aW9ucyBpbiB0aGlzIHN0YXRlbWVudCEnKTtcbiAgICB9XG5cbiAgICBsZXQgcGFyZW5zID0gMCxcbiAgICAgIGFyZ3MgPSBbXSxcbiAgICAgIHB0ciA9IDA7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IHggPSBkZWZzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgeDsgaSsrKSB7XG4gICAgICBzd2l0Y2ggKGRlZnNbaV0pIHtcbiAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgcGFyZW5zKys7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyknOlxuICAgICAgICAgIHBhcmVucy0tO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgICBpZiAocGFyZW5zID09PSAwKSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goZGVmcy5zbGljZShwdHIsIGkpKTtcbiAgICAgICAgICAgIHB0ciA9IGkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgaWYgKHB0ciA9PT0gaSkge1xuICAgICAgICAgICAgcHRyID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBhcmdzLnB1c2goZGVmcy5zbGljZShwdHIsIGkpKTtcblxuICAgIGNvbnN0IGZyb21JZGVudGlmaWVyID0gZnJvbS5yZXBsYWNlKC9bYFwiJ1tcXF1dL2csICcnKTtcblxuICAgIGFyZ3MgPSBhcmdzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbSA9IGl0ZW0udHJpbSgpXG4gICAgICBsZXQgc3BsaXQgPSBpdGVtLnNwbGl0KCcgJyk7XG5cblxuICAgICAgY29uc3QgZnJvbU1hdGNoQ2FuZGlkYXRlcyA9IFtcbiAgICAgICAgbmV3IFJlZ0V4cChgXFxgJHtmcm9tSWRlbnRpZmllcn1cXGBgLCAnaScpLFxuICAgICAgICBuZXcgUmVnRXhwKGBcIiR7ZnJvbUlkZW50aWZpZXJ9XCJgLCAnaScpLFxuICAgICAgICBuZXcgUmVnRXhwKGAnJHtmcm9tSWRlbnRpZmllcn0nYCwgJ2knKSxcbiAgICAgICAgbmV3IFJlZ0V4cChgXFxcXFske2Zyb21JZGVudGlmaWVyfVxcXFxdYCwgJ2knKSxcbiAgICAgIF07XG4gICAgICBpZiAoZnJvbUlkZW50aWZpZXIubWF0Y2goL15cXFMrJC8pKSB7XG4gICAgICAgIGZyb21NYXRjaENhbmRpZGF0ZXMucHVzaChuZXcgUmVnRXhwKGBcXFxcYiR7ZnJvbUlkZW50aWZpZXJ9XFxcXGJgLCAnaScpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZG9lc01hdGNoRnJvbUlkZW50aWZpZXIgPSAodGFyZ2V0KSA9PlxuICAgICAgICBzb21lKGZyb21NYXRjaENhbmRpZGF0ZXMsIChjKSA9PiB0YXJnZXQubWF0Y2goYykpO1xuXG4gICAgICBjb25zdCByZXBsYWNlRnJvbUlkZW50aWZpZXIgPSAodGFyZ2V0KSA9PlxuICAgICAgICBmcm9tTWF0Y2hDYW5kaWRhdGVzLnJlZHVjZShcbiAgICAgICAgICAocmVzdWx0LCBjYW5kaWRhdGUpID0+IHJlc3VsdC5yZXBsYWNlKGNhbmRpZGF0ZSwgdG8pLFxuICAgICAgICAgIHRhcmdldFxuICAgICAgICApO1xuXG4gICAgICBpZiAoZG9lc01hdGNoRnJvbUlkZW50aWZpZXIoc3BsaXRbMF0pKSB7XG4gICAgICAgIC8vIGNvbHVtbiBkZWZpbml0aW9uXG4gICAgICAgIGlmICh0bykge1xuICAgICAgICAgIHNwbGl0WzBdID0gdG87XG4gICAgICAgICAgcmV0dXJuIHNwbGl0LmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7IC8vIGZvciBkZWxldGlvbnNcbiAgICAgIH1cblxuICAgICAgLy8gc2tpcCBjb25zdHJhaW50IG5hbWVcbiAgICAgIGNvbnN0IGlkeCA9IC9jb25zdHJhaW50L2kudGVzdChzcGxpdFswXSkgPyAyIDogMDtcblxuICAgICAgLy8gcHJpbWFyeSBrZXkgYW5kIHVuaXF1ZSBjb25zdHJhaW50cyBoYXZlIG9uZSBvciBtb3JlXG4gICAgICAvLyBjb2x1bW5zIGZyb20gdGhpcyB0YWJsZSBsaXN0ZWQgYmV0d2VlbiAoKTsgcmVwbGFjZVxuICAgICAgLy8gb25lIGlmIGl0IG1hdGNoZXNcbiAgICAgIGlmICgvcHJpbWFyeXx1bmlxdWUvaS50ZXN0KHNwbGl0W2lkeF0pKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGl0ZW0ucmVwbGFjZSgvXFwoLipcXCkvLCByZXBsYWNlRnJvbUlkZW50aWZpZXIpO1xuICAgICAgICAvLyBJZiBhbnkgbWVtYmVyIGNvbHVtbnMgYXJlIGRyb3BwZWQgdGhlbiB1bmlxdWVuZXNzL3BrIGNvbnN0cmFpbnRcbiAgICAgICAgLy8gY2FuIG5vdCBiZSByZXRhaW5lZFxuICAgICAgICBpZiAocmV0ICE9PSBpdGVtICYmIGlzRW1wdHkodG8pKSByZXR1cm4gJyc7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9XG5cbiAgICAgIC8vIGZvcmVpZ24ga2V5cyBoYXZlIG9uZSBvciBtb3JlIGNvbHVtbnMgZnJvbSB0aGlzIHRhYmxlXG4gICAgICAvLyBsaXN0ZWQgYmV0d2VlbiAoKTsgcmVwbGFjZSBvbmUgaWYgaXQgbWF0Y2hlc1xuICAgICAgLy8gZm9yZWlnbiBrZXlzIGFsc28gaGF2ZSBhICdyZWZlcmVuY2VzJyBjbGF1c2VcbiAgICAgIC8vIHdoaWNoIG1heSByZWZlcmVuY2UgVEhJUyB0YWJsZTsgaWYgaXQgZG9lcywgcmVwbGFjZVxuICAgICAgLy8gY29sdW1uIHJlZmVyZW5jZXMgaW4gdGhhdCB0b28hXG4gICAgICBpZiAoL2ZvcmVpZ24vLnRlc3Qoc3BsaXRbaWR4XSkpIHtcbiAgICAgICAgc3BsaXQgPSBpdGVtLnNwbGl0KC8gcmVmZXJlbmNlcyAvaSk7XG4gICAgICAgIC8vIHRoZSBxdW90ZWQgY29sdW1uIG5hbWVzIHNhdmUgdXMgZnJvbSBoYXZpbmcgdG8gZG8gYW55dGhpbmdcbiAgICAgICAgLy8gb3RoZXIgdGhhbiBhIHN0cmFpZ2h0IHJlcGxhY2UgaGVyZVxuICAgICAgICBjb25zdCByZXBsYWNlZEtleVNwZWMgPSByZXBsYWNlRnJvbUlkZW50aWZpZXIoc3BsaXRbMF0pO1xuXG4gICAgICAgIGlmIChzcGxpdFswXSAhPT0gcmVwbGFjZWRLZXlTcGVjKSB7XG4gICAgICAgICAgLy8gSWYgd2UgYXJlIHJlbW92aW5nIG9uZSBvciBtb3JlIGNvbHVtbnMgb2YgYSBmb3JlaWduXG4gICAgICAgICAgLy8ga2V5LCB0aGVuIHdlIHNob3VsZCBub3QgcmV0YWluIHRoZSBrZXkgYXQgYWxsXG4gICAgICAgICAgaWYgKGlzRW1wdHkodG8pKSByZXR1cm4gJyc7XG4gICAgICAgICAgZWxzZSBzcGxpdFswXSA9IHJlcGxhY2VkS2V5U3BlYztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzcGxpdFsxXS5zbGljZSgwLCB0YWJsZU5hbWUubGVuZ3RoKSA9PT0gdGFibGVOYW1lKSB7XG4gICAgICAgICAgLy8gc2VsZi1yZWZlcmVudGlhbCBmb3JlaWduIGtleVxuICAgICAgICAgIGNvbnN0IHJlcGxhY2VkS2V5VGFyZ2V0U3BlYyA9IHNwbGl0WzFdLnJlcGxhY2UoXG4gICAgICAgICAgICAvXFwoLipcXCkvLFxuICAgICAgICAgICAgcmVwbGFjZUZyb21JZGVudGlmaWVyXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoc3BsaXRbMV0gIT09IHJlcGxhY2VkS2V5VGFyZ2V0U3BlYykge1xuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIHJlbW92aW5nIG9uZSBvciBtb3JlIGNvbHVtbnMgb2YgYSBmb3JlaWduXG4gICAgICAgICAgICAvLyBrZXksIHRoZW4gd2Ugc2hvdWxkIG5vdCByZXRhaW4gdGhlIGtleSBhdCBhbGxcbiAgICAgICAgICAgIGlmIChpc0VtcHR5KHRvKSkgcmV0dXJuICcnO1xuICAgICAgICAgICAgZWxzZSBzcGxpdFsxXSA9IHJlcGxhY2VkS2V5VGFyZ2V0U3BlYztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwbGl0LmpvaW4oJyByZWZlcmVuY2VzICcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcblxuICAgIGFyZ3MgPSBhcmdzLmZpbHRlcihuZWdhdGUoaXNFbXB0eSkpO1xuXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBkcm9wIGxhc3QgY29sdW1uIGZyb20gdGFibGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb25lTGluZVNxbFxuICAgICAgLnJlcGxhY2UoL1xcKC4qXFwpLywgKCkgPT4gYCgke2FyZ3Muam9pbignLCAnKX0pYClcbiAgICAgIC5yZXBsYWNlKC8sXFxzKihbLCldKS8sICckMScpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpcmViaXJkX0RETDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFNQSxJQUFBQSxPQUFBLEdBQUFDLE9BQUE7QUFTZ0IsU0FBQUMsMkJBQUFDLENBQUEsRUFBQUMsY0FBQSxRQUFBQyxFQUFBLFVBQUFDLE1BQUEsb0JBQUFILENBQUEsQ0FBQUcsTUFBQSxDQUFBQyxRQUFBLEtBQUFKLENBQUEscUJBQUFFLEVBQUEsUUFBQUcsS0FBQSxDQUFBQyxPQUFBLENBQUFOLENBQUEsTUFBQUUsRUFBQSxHQUFBSywyQkFBQSxDQUFBUCxDQUFBLE1BQUFDLGNBQUEsSUFBQUQsQ0FBQSxXQUFBQSxDQUFBLENBQUFRLE1BQUEscUJBQUFOLEVBQUEsRUFBQUYsQ0FBQSxHQUFBRSxFQUFBLE1B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