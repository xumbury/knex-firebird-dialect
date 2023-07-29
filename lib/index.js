"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _lodash = require("lodash");
var _getStream = _interopRequireDefault(require("get-stream"));
var _assert = _interopRequireDefault(require("assert"));
var _client = _interopRequireDefault(require("knex/lib/client"));
var _columnbuilder = _interopRequireDefault(require("./schema/columnbuilder"));
var _columncompiler = _interopRequireDefault(require("./schema/columncompiler"));
var _compiler = _interopRequireDefault(require("./query/compiler"));
var _tablecompiler = _interopRequireDefault(require("./schema/tablecompiler"));
var _transaction = _interopRequireDefault(require("./transaction"));
var _compiler2 = _interopRequireDefault(require("./schema/compiler"));
var _formatter = _interopRequireDefault(require("./formatter"));
var _ddl = _interopRequireDefault(require("./schema/ddl"));
var _utils = require("./utils");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Client_Firebird = /*#__PURE__*/function (_Client) {
  (0, _inherits2["default"])(Client_Firebird, _Client);
  var _super = _createSuper(Client_Firebird);
  function Client_Firebird() {
    (0, _classCallCheck2["default"])(this, Client_Firebird);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(Client_Firebird, [{
    key: "_driver",
    value: function _driver() {
      return require("node-firebird");
    }
  }, {
    key: "schemaCompiler",
    value: function schemaCompiler() {
      return (0, _construct2["default"])(_compiler2["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "queryCompiler",
    value: function queryCompiler(builder, formatter) {
      return new _compiler["default"](this, builder, formatter);
    }
  }, {
    key: "columnCompiler",
    value: function columnCompiler() {
      return (0, _construct2["default"])(_columncompiler["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "columnBuilder",
    value: function columnBuilder() {
      return (0, _construct2["default"])(_columnbuilder["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "tableCompiler",
    value: function tableCompiler() {
      return (0, _construct2["default"])(_tablecompiler["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "transaction",
    value: function transaction() {
      return (0, _construct2["default"])(_transaction["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "wrapIdentifierImpl",
    value: function wrapIdentifierImpl(value) {
      if (value === "*") {
        return value;
      }
      return value;
    }

    // Get a raw connection from the database, returning a promise with the connection object.
  }, {
    key: "acquireRawConnection",
    value: function acquireRawConnection() {
      var _this = this;
      (0, _assert["default"])(!this._connectionForTransactions);
      var driverConnectFn = this.config.createDatabaseIfNotExists ? this.driver.attachOrCreate : this.driver.attach;
      return new Promise(function (resolve, reject) {
        var retryCount = 1,
          maxRetryCount = 3;
        var connect = function connect() {
          driverConnectFn(_this.connectionSettings, function (error, connection) {
            if (!error) {
              return resolve(connection);
            }

            // Bug in the "node-firebird" library
            // "Your user name and password are not defined. Ask your database administrator to set up a Firebird login."
            if (String(error === null || error === void 0 ? void 0 : error.gdscode) === '335544472' && retryCount < maxRetryCount) {
              retryCount++;
              return connect();
            }
            return reject(error);
          });
        };
        connect();
      });
    }

    // Used to explicitly close a connection, called internally by the pool when
    // a connection times out or the pool is shutdown.
  }, {
    key: "destroyRawConnection",
    value: function () {
      var _destroyRawConnection = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                connection.connection._socket.once("close", function () {
                  resolve();
                });
                connection.detach(function (err) {
                  if (err) {
                    reject(err);
                  }
                  connection.connection._socket.destroy();
                });
              }));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function destroyRawConnection(_x) {
        return _destroyRawConnection.apply(this, arguments);
      }
      return destroyRawConnection;
    }() // Runs the query on the specified connection, providing the bindings and any
    // other necessary prep work.
  }, {
    key: "_query",
    value: function _query(connection, obj) {
      if (!obj || typeof obj === "string") {
        obj = {
          sql: obj
        };
      }
      return new Promise(function (resolver, rejecter) {
        if (!connection) {
          return rejecter(new Error("Error calling ".concat(obj.method, " on connection.")));
        }
        var _obj = obj,
          sql = _obj.sql;
        if (!sql) {
          return resolver();
        }
        var c = connection._transaction || connection;
        c.query(sql, obj.bindings, function (error, rows, fields) {
          if (error) {
            return rejecter(error);
          }
          obj.response = [rows, fields];
          resolver(obj);
        });
      });
    }
  }, {
    key: "_stream",
    value: function _stream() {
      throw new Error("_stream not implemented");
      // const client = this;
      // return new Promise(function (resolver, rejecter) {
      //   stream.on('error', rejecter);
      //   stream.on('end', resolver);
      //   return client
      //     ._query(connection, sql)
      //     .then((obj) => obj.response)
      //     .then((rows) => rows.forEach((row) => stream.write(row)))
      //     .catch(function (err) {
      //       stream.emit('error', err);
      //     })
      //     .then(function () {
      //       stream.end();
      //     });
      // });
    }

    // Ensures the response is returned in the same format as other clients.
  }, {
    key: "processResponse",
    value: function () {
      var _processResponse = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(obj, runner) {
        var response, method, _response, rows, fields;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (obj) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              response = obj.response, method = obj.method;
              if (!obj.output) {
                _context2.next = 5;
                break;
              }
              return _context2.abrupt("return", obj.output.call(runner, response));
            case 5:
              _response = (0, _slicedToArray2["default"])(response, 2), rows = _response[0], fields = _response[1];
              _context2.next = 8;
              return this._fixBlobCallbacks(rows, fields);
            case 8:
              _context2.t0 = method;
              _context2.next = _context2.t0 === "first" ? 11 : _context2.t0 === "pluck" ? 12 : 13;
              break;
            case 11:
              return _context2.abrupt("return", rows[0]);
            case 12:
              return _context2.abrupt("return", (0, _lodash.map)(rows, obj.pluck));
            case 13:
              return _context2.abrupt("return", rows);
            case 14:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function processResponse(_x2, _x3) {
        return _processResponse.apply(this, arguments);
      }
      return processResponse;
    }()
    /**
     * The Firebird library returns BLOBs with callback function, convert to buffer
     * @param {*} rows
     * @param {*} fields
     */
  }, {
    key: "_fixBlobCallbacks",
    value: function () {
      var _fixBlobCallbacks2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(rows /* fields */) {
        var blobEntries;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (rows) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return", rows);
            case 2:
              blobEntries = [];
              (0, _utils.toArrayFromPrimitive)(rows).forEach(function (row, rowIndex) {
                Object.entries(row).forEach(function (_ref) {
                  var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                    colKey = _ref2[0],
                    colVal = _ref2[1];
                  if (colVal instanceof Function) {
                    blobEntries.push(new Promise(function (resolve, reject) {
                      colVal(function (err, name, emitter) {
                        _getStream["default"].buffer(emitter).then(function (buffer) {
                          rows[rowIndex][colKey] = buffer;
                          resolve();
                        })["catch"](reject);
                      });
                    }));
                  } else if (colVal instanceof Buffer) {
                    rows[rowIndex][colKey] = colVal.toString("utf8");
                  }
                });
              });
              _context3.next = 6;
              return Promise.all(blobEntries);
            case 6:
              return _context3.abrupt("return", rows);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function _fixBlobCallbacks(_x4) {
        return _fixBlobCallbacks2.apply(this, arguments);
      }
      return _fixBlobCallbacks;
    }()
  }, {
    key: "validateConnection",
    value: function validateConnection(db) {
      var _db$connection = db.connection,
        _isClosed = _db$connection._isClosed,
        _isDetach = _db$connection._isDetach,
        _socket = _db$connection._socket,
        _isOpened = _db$connection._isOpened;
      if (_isClosed || _isDetach || !_socket || !_isOpened) {
        return false;
      }
      return true;
    }
  }, {
    key: "poolDefaults",
    value: function poolDefaults() {
      var options = {
        min: 2,
        max: 4
      };
      return (0, _lodash.defaults)(options, (0, _get2["default"])((0, _getPrototypeOf2["default"])(Client_Firebird.prototype), "poolDefaults", this).call(this, this));
    }
  }, {
    key: "ping",
    value: function ping(resource, callback) {
      resource.query("select 1 from RDB$DATABASE", callback);
    }
  }, {
    key: "ddl",
    value: function ddl(compiler, pragma, connection) {
      return new _ddl["default"](this, compiler, pragma, connection);
    }
  }]);
  return Client_Firebird;
}(_client["default"]);
Object.assign(Client_Firebird.prototype, {
  dialect: "firebird",
  driverName: "node-firebird",
  Firebird_Formatter: _formatter["default"]
});
var _default = Client_Firebird;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbG9kYXNoIiwicmVxdWlyZSIsIl9nZXRTdHJlYW0iLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX2Fzc2VydCIsIl9jbGllbnQiLCJfY29sdW1uYnVpbGRlciIsIl9jb2x1bW5jb21waWxlciIsIl9jb21waWxlciIsIl90YWJsZWNvbXBpbGVyIiwiX3RyYW5zYWN0aW9uIiwiX2NvbXBpbGVyMiIsIl9mb3JtYXR0ZXIiLCJfZGRsIiwiX3V0aWxzIiwiX2NyZWF0ZVN1cGVyIiwiRGVyaXZlZCIsImhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2NyZWF0ZVN1cGVySW50ZXJuYWwiLCJTdXBlciIsIl9nZXRQcm90b3R5cGVPZjIiLCJyZXN1bHQiLCJOZXdUYXJnZXQiLCJjb25zdHJ1Y3RvciIsIlJlZmxlY3QiLCJjb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiIsInNoYW0iLCJQcm94eSIsIkJvb2xlYW4iLCJwcm90b3R5cGUiLCJ2YWx1ZU9mIiwiY2FsbCIsImUiLCJDbGllbnRfRmlyZWJpcmQiLCJfQ2xpZW50IiwiX2luaGVyaXRzMiIsIl9zdXBlciIsIl9jbGFzc0NhbGxDaGVjazIiLCJfY3JlYXRlQ2xhc3MyIiwia2V5IiwidmFsdWUiLCJfZHJpdmVyIiwic2NoZW1hQ29tcGlsZXIiLCJfY29uc3RydWN0MiIsIlNjaGVtYUNvbXBpbGVyIiwiY29uY2F0IiwiQXJyYXkiLCJzbGljZSIsInF1ZXJ5Q29tcGlsZXIiLCJidWlsZGVyIiwiZm9ybWF0dGVyIiwiUXVlcnlDb21waWxlciIsImNvbHVtbkNvbXBpbGVyIiwiQ29sdW1uQ29tcGlsZXIiLCJjb2x1bW5CdWlsZGVyIiwiQ29sdW1uQnVpbGRlciIsInRhYmxlQ29tcGlsZXIiLCJUYWJsZUNvbXBpbGVyIiwidHJhbnNhY3Rpb24iLCJUcmFuc2FjdGlvbiIsIndyYXBJZGVudGlmaWVySW1wbCIsImFjcXVpcmVSYXdDb25uZWN0aW9uIiwiX3RoaXMiLCJhc3NlcnQiLCJfY29ubmVjdGlvbkZvclRyYW5zYWN0aW9ucyIsImRyaXZlckNvbm5lY3RGbiIsImNvbmZpZyIsImNyZWF0ZURhdGFiYXNlSWZOb3RFeGlzdHMiLCJkcml2ZXIiLCJhdHRhY2hPckNyZWF0ZSIsImF0dGFjaCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmV0cnlDb3VudCIsIm1heFJldHJ5Q291bnQiLCJjb25uZWN0IiwiY29ubmVjdGlvblNldHRpbmdzIiwiZXJyb3IiLCJjb25uZWN0aW9uIiwiU3RyaW5nIiwiZ2RzY29kZSIsIl9kZXN0cm95UmF3Q29ubmVjdGlvbiIsIl9hc3luY1RvR2VuZXJhdG9yMiIsIl9yZWdlbmVyYXRvciIsIm1hcmsiLCJfY2FsbGVlIiwid3JhcCIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJwcmV2IiwibmV4dCIsImFicnVwdCIsIl9zb2NrZXQiLCJvbmNlIiwiZGV0YWNoIiwiZXJyIiwiZGVzdHJveSIsInN0b3AiLCJkZXN0cm95UmF3Q29ubmVjdGlvbiIsIl94IiwiX3F1ZXJ5Iiwib2JqIiwic3FsIiwicmVzb2x2ZXIiLCJyZWplY3RlciIsIkVycm9yIiwibWV0aG9kIiwiX29iaiIsImMiLCJxdWVyeSIsImJpbmRpbmdzIiwicm93cyIsImZpZWxkcyIsInJlc3BvbnNlIiwiX3N0cmVhbSIsIl9wcm9jZXNzUmVzcG9uc2UiLCJfY2FsbGVlMiIsInJ1bm5lciIsIl9yZXNwb25zZSIsIl9jYWxsZWUyJCIsIl9jb250ZXh0MiIsIm91dHB1dCIsIl9zbGljZWRUb0FycmF5MiIsIl9maXhCbG9iQ2FsbGJhY2tzIiwidDAiLCJtYXAiLCJwbHVjayIsInByb2Nlc3NSZXNwb25zZSIsIl94MiIsIl94MyIsIl9maXhCbG9iQ2FsbGJhY2tzMiIsIl9jYWxsZWUzIiwiYmxvYkVudHJpZXMiLCJfY2FsbGVlMyQiLCJfY29udGV4dDMiLCJ0b0FycmF5RnJvbVByaW1pdGl2ZSIsImZvckVhY2giLCJyb3ciLCJyb3dJbmRleCIsIk9iamVjdCIsImVudHJpZXMiLCJfcmVmIiwiX3JlZjIiLCJjb2xLZXkiLCJjb2xWYWwiLCJGdW5jdGlvbiIsInB1c2giLCJuYW1lIiwiZW1pdHRlciIsImdldFN0cmVhbSIsImJ1ZmZlciIsInRoZW4iLCJCdWZmZXIiLCJ0b1N0cmluZyIsImFsbCIsIl94NCIsInZhbGlkYXRlQ29ubmVjdGlvbiIsImRiIiwiX2RiJGNvbm5lY3Rpb24iLCJfaXNDbG9zZWQiLCJfaXNEZXRhY2giLCJfaXNPcGVuZWQiLCJwb29sRGVmYXVsdHMiLCJvcHRpb25zIiwibWluIiwibWF4IiwiZGVmYXVsdHMiLCJfZ2V0MiIsInBpbmciLCJyZXNvdXJjZSIsImNhbGxiYWNrIiwiZGRsIiwiY29tcGlsZXIiLCJwcmFnbWEiLCJGaXJlYmlyZF9EREwiLCJDbGllbnQiLCJhc3NpZ24iLCJkaWFsZWN0IiwiZHJpdmVyTmFtZSIsIkZpcmViaXJkX0Zvcm1hdHRlciIsIl9kZWZhdWx0IiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZhdWx0cywgbWFwIH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IGdldFN0cmVhbSBmcm9tIFwiZ2V0LXN0cmVhbVwiO1xuXG5pbXBvcnQgYXNzZXJ0IGZyb20gXCJhc3NlcnRcIjtcbmltcG9ydCBDbGllbnQgZnJvbSBcImtuZXgvbGliL2NsaWVudFwiO1xuXG5pbXBvcnQgQ29sdW1uQnVpbGRlciBmcm9tIFwiLi9zY2hlbWEvY29sdW1uYnVpbGRlclwiO1xuaW1wb3J0IENvbHVtbkNvbXBpbGVyIGZyb20gXCIuL3NjaGVtYS9jb2x1bW5jb21waWxlclwiO1xuaW1wb3J0IFF1ZXJ5Q29tcGlsZXIgZnJvbSBcIi4vcXVlcnkvY29tcGlsZXJcIjtcbmltcG9ydCBUYWJsZUNvbXBpbGVyIGZyb20gXCIuL3NjaGVtYS90YWJsZWNvbXBpbGVyXCI7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSBcIi4vdHJhbnNhY3Rpb25cIjtcbmltcG9ydCBTY2hlbWFDb21waWxlciBmcm9tIFwiLi9zY2hlbWEvY29tcGlsZXJcIjtcbmltcG9ydCBGaXJlYmlyZF9Gb3JtYXR0ZXIgZnJvbSBcIi4vZm9ybWF0dGVyXCI7XG5pbXBvcnQgRmlyZWJpcmRfRERMIGZyb20gXCIuL3NjaGVtYS9kZGxcIjtcbmltcG9ydCB7IHRvQXJyYXlGcm9tUHJpbWl0aXZlIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuY2xhc3MgQ2xpZW50X0ZpcmViaXJkIGV4dGVuZHMgQ2xpZW50IHtcbiAgX2RyaXZlcigpIHtcbiAgICByZXR1cm4gcmVxdWlyZShcIm5vZGUtZmlyZWJpcmRcIik7XG4gIH1cblxuICBzY2hlbWFDb21waWxlcigpIHtcbiAgICByZXR1cm4gbmV3IFNjaGVtYUNvbXBpbGVyKHRoaXMsIC4uLmFyZ3VtZW50cyk7XG4gIH1cblxuICBxdWVyeUNvbXBpbGVyKGJ1aWxkZXIsIGZvcm1hdHRlcikge1xuICAgIHJldHVybiBuZXcgUXVlcnlDb21waWxlcih0aGlzLCBidWlsZGVyLCBmb3JtYXR0ZXIpO1xuICB9XG5cbiAgY29sdW1uQ29tcGlsZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBDb2x1bW5Db21waWxlcih0aGlzLCAuLi5hcmd1bWVudHMpO1xuICB9XG5cbiAgY29sdW1uQnVpbGRlcigpIHtcbiAgICByZXR1cm4gbmV3IENvbHVtbkJ1aWxkZXIodGhpcywgLi4uYXJndW1lbnRzKTtcbiAgfVxuXG4gIHRhYmxlQ29tcGlsZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBUYWJsZUNvbXBpbGVyKHRoaXMsIC4uLmFyZ3VtZW50cyk7XG4gIH1cblxuICB0cmFuc2FjdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zYWN0aW9uKHRoaXMsIC4uLmFyZ3VtZW50cyk7XG4gIH1cblxuICB3cmFwSWRlbnRpZmllckltcGwodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IFwiKlwiKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLy8gR2V0IGEgcmF3IGNvbm5lY3Rpb24gZnJvbSB0aGUgZGF0YWJhc2UsIHJldHVybmluZyBhIHByb21pc2Ugd2l0aCB0aGUgY29ubmVjdGlvbiBvYmplY3QuXG4gIGFjcXVpcmVSYXdDb25uZWN0aW9uKCkge1xuICAgIGFzc2VydCghdGhpcy5fY29ubmVjdGlvbkZvclRyYW5zYWN0aW9ucyk7XG5cbiAgICBjb25zdCBkcml2ZXJDb25uZWN0Rm4gPSB0aGlzLmNvbmZpZy5jcmVhdGVEYXRhYmFzZUlmTm90RXhpc3RzXG4gICAgICA/IHRoaXMuZHJpdmVyLmF0dGFjaE9yQ3JlYXRlXG4gICAgICA6IHRoaXMuZHJpdmVyLmF0dGFjaDtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcmV0cnlDb3VudCA9IDEsIG1heFJldHJ5Q291bnQgPSAzO1xuICAgICAgY29uc3QgY29ubmVjdCA9ICgpID0+IHtcbiAgICAgICAgZHJpdmVyQ29ubmVjdEZuKHRoaXMuY29ubmVjdGlvblNldHRpbmdzLCAoZXJyb3IsIGNvbm5lY3Rpb24pID0+IHtcbiAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShjb25uZWN0aW9uKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBCdWcgaW4gdGhlIFwibm9kZS1maXJlYmlyZFwiIGxpYnJhcnlcbiAgICAgICAgICAvLyBcIllvdXIgdXNlciBuYW1lIGFuZCBwYXNzd29yZCBhcmUgbm90IGRlZmluZWQuIEFzayB5b3VyIGRhdGFiYXNlIGFkbWluaXN0cmF0b3IgdG8gc2V0IHVwIGEgRmlyZWJpcmQgbG9naW4uXCJcbiAgICAgICAgICBpZiAoU3RyaW5nKGVycm9yPy5nZHNjb2RlKSA9PT0gJzMzNTU0NDQ3MicgJiYgcmV0cnlDb3VudCA8IG1heFJldHJ5Q291bnQpIHtcbiAgICAgICAgICAgIHJldHJ5Q291bnQrK1xuICAgICAgICAgICAgcmV0dXJuIGNvbm5lY3QoKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25uZWN0KClcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFVzZWQgdG8gZXhwbGljaXRseSBjbG9zZSBhIGNvbm5lY3Rpb24sIGNhbGxlZCBpbnRlcm5hbGx5IGJ5IHRoZSBwb29sIHdoZW5cbiAgLy8gYSBjb25uZWN0aW9uIHRpbWVzIG91dCBvciB0aGUgcG9vbCBpcyBzaHV0ZG93bi5cbiAgYXN5bmMgZGVzdHJveVJhd0Nvbm5lY3Rpb24oY29ubmVjdGlvbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25uZWN0aW9uLmNvbm5lY3Rpb24uX3NvY2tldC5vbmNlKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcblxuICAgICAgY29ubmVjdGlvbi5kZXRhY2goKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25uZWN0aW9uLmNvbm5lY3Rpb24uX3NvY2tldC5kZXN0cm95KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFJ1bnMgdGhlIHF1ZXJ5IG9uIHRoZSBzcGVjaWZpZWQgY29ubmVjdGlvbiwgcHJvdmlkaW5nIHRoZSBiaW5kaW5ncyBhbmQgYW55XG4gIC8vIG90aGVyIG5lY2Vzc2FyeSBwcmVwIHdvcmsuXG4gIF9xdWVyeShjb25uZWN0aW9uLCBvYmopIHtcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBvYmogPSB7IHNxbDogb2JqIH07XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZXIsIHJlamVjdGVyKSB7XG4gICAgICBpZiAoIWNvbm5lY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVyKFxuICAgICAgICAgIG5ldyBFcnJvcihgRXJyb3IgY2FsbGluZyAke29iai5tZXRob2R9IG9uIGNvbm5lY3Rpb24uYClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBzcWwgfSA9IG9iajtcbiAgICAgIGlmICghc3FsKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlcigpO1xuICAgICAgfVxuICAgICAgY29uc3QgYyA9IGNvbm5lY3Rpb24uX3RyYW5zYWN0aW9uIHx8IGNvbm5lY3Rpb247XG4gICAgICBjLnF1ZXJ5KHNxbCwgb2JqLmJpbmRpbmdzLCAoZXJyb3IsIHJvd3MsIGZpZWxkcykgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZXIoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIG9iai5yZXNwb25zZSA9IFtyb3dzLCBmaWVsZHNdO1xuICAgICAgICByZXNvbHZlcihvYmopO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfc3RyZWFtKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIl9zdHJlYW0gbm90IGltcGxlbWVudGVkXCIpO1xuICAgIC8vIGNvbnN0IGNsaWVudCA9IHRoaXM7XG4gICAgLy8gcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlciwgcmVqZWN0ZXIpIHtcbiAgICAvLyAgIHN0cmVhbS5vbignZXJyb3InLCByZWplY3Rlcik7XG4gICAgLy8gICBzdHJlYW0ub24oJ2VuZCcsIHJlc29sdmVyKTtcbiAgICAvLyAgIHJldHVybiBjbGllbnRcbiAgICAvLyAgICAgLl9xdWVyeShjb25uZWN0aW9uLCBzcWwpXG4gICAgLy8gICAgIC50aGVuKChvYmopID0+IG9iai5yZXNwb25zZSlcbiAgICAvLyAgICAgLnRoZW4oKHJvd3MpID0+IHJvd3MuZm9yRWFjaCgocm93KSA9PiBzdHJlYW0ud3JpdGUocm93KSkpXG4gICAgLy8gICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgLy8gICAgICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG4gIH1cblxuICAvLyBFbnN1cmVzIHRoZSByZXNwb25zZSBpcyByZXR1cm5lZCBpbiB0aGUgc2FtZSBmb3JtYXQgYXMgb3RoZXIgY2xpZW50cy5cbiAgYXN5bmMgcHJvY2Vzc1Jlc3BvbnNlKG9iaiwgcnVubmVyKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgeyByZXNwb25zZSwgbWV0aG9kIH0gPSBvYmo7XG4gICAgaWYgKG9iai5vdXRwdXQpIHtcbiAgICAgIHJldHVybiBvYmoub3V0cHV0LmNhbGwocnVubmVyLCByZXNwb25zZSk7XG4gICAgfVxuXG4gICAgY29uc3QgW3Jvd3MsIGZpZWxkc10gPSByZXNwb25zZTtcbiAgICBhd2FpdCB0aGlzLl9maXhCbG9iQ2FsbGJhY2tzKHJvd3MsIGZpZWxkcyk7XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSBcImZpcnN0XCI6XG4gICAgICAgIHJldHVybiByb3dzWzBdO1xuICAgICAgY2FzZSBcInBsdWNrXCI6XG4gICAgICAgIHJldHVybiBtYXAocm93cywgb2JqLnBsdWNrKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiByb3dzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgRmlyZWJpcmQgbGlicmFyeSByZXR1cm5zIEJMT0JzIHdpdGggY2FsbGJhY2sgZnVuY3Rpb24sIGNvbnZlcnQgdG8gYnVmZmVyXG4gICAqIEBwYXJhbSB7Kn0gcm93c1xuICAgKiBAcGFyYW0geyp9IGZpZWxkc1xuICAgKi9cbiAgYXN5bmMgX2ZpeEJsb2JDYWxsYmFja3Mocm93cyAvKiBmaWVsZHMgKi8pIHtcbiAgICBpZiAoIXJvd3MpIHtcbiAgICAgIHJldHVybiByb3dzO1xuICAgIH1cblxuICAgIGNvbnN0IGJsb2JFbnRyaWVzID0gW107XG5cbiAgICB0b0FycmF5RnJvbVByaW1pdGl2ZShyb3dzKS5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICBPYmplY3QuZW50cmllcyhyb3cpLmZvckVhY2goKFtjb2xLZXksIGNvbFZhbF0pID0+IHtcbiAgICAgICAgaWYgKGNvbFZhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgYmxvYkVudHJpZXMucHVzaChcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgY29sVmFsKChlcnIsIG5hbWUsIGVtaXR0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICBnZXRTdHJlYW0uYnVmZmVyKGVtaXR0ZXIpLnRoZW4oKGJ1ZmZlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgcm93c1tyb3dJbmRleF1bY29sS2V5XSA9IGJ1ZmZlcjtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2xWYWwgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgICAgICByb3dzW3Jvd0luZGV4XVtjb2xLZXldID0gY29sVmFsLnRvU3RyaW5nKFwidXRmOFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChibG9iRW50cmllcyk7XG5cbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIHZhbGlkYXRlQ29ubmVjdGlvbihkYikge1xuICAgIGNvbnN0IHsgX2lzQ2xvc2VkLCBfaXNEZXRhY2gsIF9zb2NrZXQsIF9pc09wZW5lZCB9ID0gZGIuY29ubmVjdGlvbjtcblxuICAgIGlmIChfaXNDbG9zZWQgfHwgX2lzRGV0YWNoIHx8ICFfc29ja2V0IHx8ICFfaXNPcGVuZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHBvb2xEZWZhdWx0cygpIHtcbiAgICBjb25zdCBvcHRpb25zID0geyBtaW46IDIsIG1heDogNCB9O1xuICAgIHJldHVybiBkZWZhdWx0cyhvcHRpb25zLCBzdXBlci5wb29sRGVmYXVsdHModGhpcykpO1xuICB9XG5cbiAgcGluZyhyZXNvdXJjZSwgY2FsbGJhY2spIHtcbiAgICByZXNvdXJjZS5xdWVyeShcInNlbGVjdCAxIGZyb20gUkRCJERBVEFCQVNFXCIsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRkbChjb21waWxlciwgcHJhZ21hLCBjb25uZWN0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBGaXJlYmlyZF9EREwodGhpcywgY29tcGlsZXIsIHByYWdtYSwgY29ubmVjdGlvbik7XG4gIH1cbn1cblxuT2JqZWN0LmFzc2lnbihDbGllbnRfRmlyZWJpcmQucHJvdG90eXBlLCB7XG4gIGRpYWxlY3Q6IFwiZmlyZWJpcmRcIixcbiAgZHJpdmVyTmFtZTogXCJub2RlLWZpcmViaXJkXCIsXG5cbiAgRmlyZWJpcmRfRm9ybWF0dGVyLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudF9GaXJlYmlyZDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxPQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxVQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFFQSxJQUFBRyxPQUFBLEdBQUFELHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBSSxPQUFBLEdBQUFGLHNCQUFBLENBQUFGLE9BQUE7QUFFQSxJQUFBSyxjQUFBLEdBQUFILHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBTSxlQUFBLEdBQUFKLHNC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