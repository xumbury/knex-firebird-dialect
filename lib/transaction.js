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
var _transaction = _interopRequireDefault(require("knex/lib/execution/transaction"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var debug = require("debug")("knex:tx");
var Transaction_Firebird = /*#__PURE__*/function (_Transaction) {
  (0, _inherits2["default"])(Transaction_Firebird, _Transaction);
  var _super = _createSuper(Transaction_Firebird);
  function Transaction_Firebird() {
    (0, _classCallCheck2["default"])(this, Transaction_Firebird);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(Transaction_Firebird, [{
    key: "begin",
    value: function begin(conn) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        conn.transaction(_this.client.driver.ISOLATION_READ_COMMITED, function (error, transaction) {
          if (error) return reject(error);
          conn._transaction = transaction;
          resolve();
        });
      });
    }
  }, {
    key: "savepoint",
    value: function savepoint() {
      throw new Error("savepoints not implemented");
    }
  }, {
    key: "commit",
    value: function commit(conn, value) {
      return this.query(conn, "commit", 1, value);
    }
  }, {
    key: "release",
    value: function release() {
      throw new Error("releasing savepoints not implemented");
    }
  }, {
    key: "rollback",
    value: function rollback(conn, error) {
      return this.query(conn, "rollback", 2, error);
    }
  }, {
    key: "rollbackTo",
    value: function rollbackTo() {
      throw new Error("rolling back to savepoints not implemented");
    }
  }, {
    key: "query",
    value: function query(conn, method, status, value) {
      var _this2 = this;
      var q = new Promise(function (resolve, reject) {
        var transaction = conn._transaction;
        transaction[method](function (error) {
          delete conn._transaction;
          if (error) return reject(error);
          resolve();
        });
      })["catch"](function (error) {
        status = 2;
        value = error;
        _this2._completed = true;
        debug("%s error running transaction query", _this2.txid);
      }).then(function () {
        if (status === 1) _this2._resolver(value);
        if (status === 2) _this2._rejecter(value);
      });
      if (status === 1 || status === 2) {
        this._completed = true;
      }
      return q;
    }
  }]);
  return Transaction_Firebird;
}(_transaction["default"]);
var _default = Transaction_Firebird;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfdHJhbnNhY3Rpb24iLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9jcmVhdGVTdXBlciIsIkRlcml2ZWQiLCJoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCIsIl9jcmVhdGVTdXBlckludGVybmFsIiwiU3VwZXIiLCJfZ2V0UHJvdG90eXBlT2YyIiwicmVzdWx0IiwiTmV3VGFyZ2V0IiwiY29uc3RydWN0b3IiLCJSZWZsZWN0IiwiY29uc3RydWN0IiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIiLCJzaGFtIiwiUHJveHkiLCJCb29sZWFuIiwicHJvdG90eXBlIiwidmFsdWVPZiIsImNhbGwiLCJlIiwiZGVidWciLCJUcmFuc2FjdGlvbl9GaXJlYmlyZCIsIl9UcmFuc2FjdGlvbiIsIl9pbmhlcml0czIiLCJfc3VwZXIiLCJfY2xhc3NDYWxsQ2hlY2syIiwiX2NyZWF0ZUNsYXNzMiIsImtleSIsInZhbHVlIiwiYmVnaW4iLCJjb25uIiwiX3RoaXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInRyYW5zYWN0aW9uIiwiY2xpZW50IiwiZHJpdmVyIiwiSVNPTEFUSU9OX1JFQURfQ09NTUlURUQiLCJlcnJvciIsInNhdmVwb2ludCIsIkVycm9yIiwiY29tbWl0IiwicXVlcnkiLCJyZWxlYXNlIiwicm9sbGJhY2siLCJyb2xsYmFja1RvIiwibWV0aG9kIiwic3RhdHVzIiwiX3RoaXMyIiwicSIsIl9jb21wbGV0ZWQiLCJ0eGlkIiwidGhlbiIsIl9yZXNvbHZlciIsIl9yZWplY3RlciIsIlRyYW5zYWN0aW9uIiwiX2RlZmF1bHQiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vc3JjL3RyYW5zYWN0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRlYnVnID0gcmVxdWlyZShcImRlYnVnXCIpKFwia25leDp0eFwiKTtcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tIFwia25leC9saWIvZXhlY3V0aW9uL3RyYW5zYWN0aW9uXCI7XG5cbmNsYXNzIFRyYW5zYWN0aW9uX0ZpcmViaXJkIGV4dGVuZHMgVHJhbnNhY3Rpb24ge1xuICBiZWdpbihjb25uKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbm4udHJhbnNhY3Rpb24oXG4gICAgICAgIHRoaXMuY2xpZW50LmRyaXZlci5JU09MQVRJT05fUkVBRF9DT01NSVRFRCxcbiAgICAgICAgKGVycm9yLCB0cmFuc2FjdGlvbikgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgY29ubi5fdHJhbnNhY3Rpb24gPSB0cmFuc2FjdGlvbjtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBzYXZlcG9pbnQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwic2F2ZXBvaW50cyBub3QgaW1wbGVtZW50ZWRcIik7XG4gIH1cblxuICBjb21taXQoY29ubiwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeShjb25uLCBcImNvbW1pdFwiLCAxLCB2YWx1ZSk7XG4gIH1cblxuICByZWxlYXNlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJlbGVhc2luZyBzYXZlcG9pbnRzIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIHJvbGxiYWNrKGNvbm4sIGVycm9yKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnkoY29ubiwgXCJyb2xsYmFja1wiLCAyLCBlcnJvcik7XG4gIH1cblxuICByb2xsYmFja1RvKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInJvbGxpbmcgYmFjayB0byBzYXZlcG9pbnRzIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIHF1ZXJ5KGNvbm4sIG1ldGhvZCwgc3RhdHVzLCB2YWx1ZSkge1xuICAgIGNvbnN0IHEgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGNvbm4uX3RyYW5zYWN0aW9uO1xuICAgICAgdHJhbnNhY3Rpb25bbWV0aG9kXSgoZXJyb3IpID0+IHtcbiAgICAgICAgZGVsZXRlIGNvbm4uX3RyYW5zYWN0aW9uO1xuICAgICAgICBpZiAoZXJyb3IpIHJldHVybiByZWplY3QoZXJyb3IpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBzdGF0dXMgPSAyO1xuICAgICAgICB2YWx1ZSA9IGVycm9yO1xuICAgICAgICB0aGlzLl9jb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICBkZWJ1ZyhcIiVzIGVycm9yIHJ1bm5pbmcgdHJhbnNhY3Rpb24gcXVlcnlcIiwgdGhpcy50eGlkKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IDEpIHRoaXMuX3Jlc29sdmVyKHZhbHVlKTtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMikgdGhpcy5fcmVqZWN0ZXIodmFsdWUpO1xuICAgICAgfSk7XG4gICAgaWYgKHN0YXR1cyA9PT0gMSB8fCBzdGF0dXMgPT09IDIpIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBxO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uX0ZpcmViaXJkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFBQSxZQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBeUQsU0FBQUMsYUFBQUMsT0FBQSxRQUFBQyx5QkFBQSxHQUFBQyx5QkFBQSxvQkFBQUMscUJBQUEsUUFBQUMsS0FBQSxPQUFBQyxnQkFBQSxhQUFBTCxPQUFBLEdBQUFNLE1BQUEsTUFBQUwseUJBQUEsUUFBQU0sU0FBQSxPQUFBRixnQkFBQSxtQkFBQUcsV0FBQSxFQUFBRixNQUFBLEdBQUFHLE9BQUEsQ0FBQUMsU0FBQSxDQUFBTixLQUFBLEVBQUFPLFNBQUEsRUFBQUosU0FBQSxZQUFBRCxNQUFBLEdBQUFGLEtBQUEsQ0FBQVEsS0FBQSxPQUFBRCxTQUFBLGdCQUFBRSwyQkFBQSxtQkFBQVAsTUFBQTtBQUFBLFNBQUFKLDBCQUFBLGVBQUFPLE9BQUEscUJBQUFBLE9BQUEsQ0FBQUMsU0FBQSxvQkFBQUQsT0FBQSxDQUFBQyxTQUFBLENBQUFJLElBQUEsMkJBQUFDLEtBQUEsb0NBQUFDLE9BQUEsQ0FBQUMsU0FBQSxDQUFBQyxPQUFBLENBQUFDLElBQUEsQ0FBQVYsT0FBQSxDQUFBQyxTQUFBLENBQUFNLE9BQUEsOENBQUFJLENBQUE7QUFEekQsSUFBTUMsS0FBSyxHQUFHdkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUFDLElBR3BDd0Isb0JBQW9CLDBCQUFBQyxZQUFBO0VBQUEsSUFBQUMsVUFBQSxhQUFBRixvQkFBQSxFQUFBQyxZQUFBO0VBQUEsSUFBQUUsTUFBQSxHQUFBMUIsWUFBQSxDQUFBdUIsb0JBQUE7RUFBQSxTQUFBQSxxQkFBQTtJQUFBLElBQUFJLGdCQUFBLG1CQUFBSixvQkFBQTtJQUFBLE9BQUFHLE1BQUEsQ0FBQWIsS0FBQSxPQUFBRCxTQUFBO0VBQUE7RUFBQSxJQUFBZ0IsYUFBQSxhQUFBTCxvQkFBQTtJQUFBTSxHQUFBO0lBQUFDLEtBQUEsRUFDeEIsU0FBQUMsTUFBTUMsSUFBSSxFQUFFO01BQUEsSUFBQUMsS0FBQTtNQUNWLE9BQU8sSUFBSUMsT0FBTyxDQUFDLFVBQUNDLE9BQU8sRUFBRUMsTUFBTSxFQUFLO1FBQ3RDSixJQUFJLENBQUNLLFdBQVcsQ0FDZEosS0FBSSxDQUFDSyxNQUFNLENBQUNDLE1BQU0sQ0FBQ0MsdUJBQXVCLEVBQzFDLFVBQUNDLEtBQUssRUFBRUosV0FBVyxFQUFLO1VBQ3RCLElBQUlJLEtBQUssRUFBRSxPQUFPTCxNQUFNLENBQUNLLEtBQUssQ0FBQztVQUMvQlQsSUFBSSxDQUFDbkMsWUFBWSxHQUFHd0MsV0FBVztVQUMvQkYsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUNGLENBQUM7TUFDSCxDQUFDLENBQUM7SUFDSjtFQUFDO0lBQUFOLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFZLFVBQUEsRUFBWTtNQUNWLE1BQU0sSUFBSUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDO0lBQy9DO0VBQUM7SUFBQWQsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQWMsT0FBT1osSUFBSSxFQUFFRixLQUFLLEVBQUU7TUFDbEIsT0FBTyxJQUFJLENBQUNlLEtBQUssQ0FBQ2IsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUVGLEtBQUssQ0FBQztJQUM3QztFQUFDO0lBQUFELEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFnQixRQUFBLEVBQVU7TUFDUixNQUFNLElBQUlILEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQztJQUN6RDtFQUFDO0lBQUFkLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFpQixTQUFTZixJQUFJLEVBQUVTLEtBQUssRUFBRTtNQUNwQixPQUFPLElBQUksQ0FBQ0ksS0FBSyxDQUFDYixJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRVMsS0FBSyxDQUFDO0lBQy9DO0VBQUM7SUFBQVosR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQWtCLFdBQUEsRUFBYTtNQUNYLE1BQU0sSUFBSUwsS0FBSyxDQUFDLDRDQUE0QyxDQUFDO0lBQy9EO0VBQUM7SUFBQWQsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQWUsTUFBTWIsSUFBSSxFQUFFaUIsTUFBTSxFQUFFQyxNQUFNLEVBQUVwQixLQUFLLEVBQUU7TUFBQSxJQUFBcUIsTUFBQTtNQUNqQyxJQUFNQyxDQUFDLEdBQUcsSUFBSWxCLE9BQU8sQ0FBQyxVQUFDQyxPQUFPLEVBQUVDLE1BQU0sRUFBSztRQUN6QyxJQUFNQyxXQUFXLEdBQUdMLElBQUksQ0FBQ25DLFlBQVk7UUFDckN3QyxXQUFXLENBQUNZLE1BQU0sQ0FBQyxDQUFDLFVBQUNSLEtBQUssRUFBSztVQUM3QixPQUFPVCxJQUFJLENBQUNuQyxZQUFZO1VBQ3hCLElBQUk0QyxLQUFLLEVBQUUsT0FBT0wsTUFBTSxDQUFDSyxLQUFLLENBQUM7VUFDL0JOLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDO01BQ0osQ0FBQyxDQUFDLFNBQ00sQ0FBQyxVQUFDTSxLQUFLLEVBQUs7UUFDaEJTLE1BQU0sR0FBRyxDQUFDO1FBQ1ZwQixLQUFLLEdBQUdXLEtBQUs7UUFDYlUsTUFBSSxDQUFDRSxVQUFVLEdBQUcsSUFBSTtRQUN0Qi9CLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRTZCLE1BQUksQ0FBQ0csSUFBSSxDQUFDO01BQ3hELENBQUMsQ0FBQyxDQUNEQyxJQUFJLENBQUMsWUFBTTtRQUNWLElBQUlMLE1BQU0sS0FBSyxDQUFDLEVBQUVDLE1BQUksQ0FBQ0ssU0FBUyxDQUFDMUIsS0FBSyxDQUFDO1FBQ3ZDLElBQUlvQixNQUFNLEtBQUssQ0FBQyxFQUFFQyxNQUFJLENBQUNNLFNBQVMsQ0FBQzNCLEtBQUssQ0FBQztNQUN6QyxDQUFDLENBQUM7TUFDSixJQUFJb0IsTUFBTSxLQUFLLENBQUMsSUFBSUEsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNoQyxJQUFJLENBQUNHLFVBQVUsR0FBRyxJQUFJO01BQ3hCO01BQ0EsT0FBT0QsQ0FBQztJQUNWO0VBQUM7RUFBQSxPQUFBN0Isb0JBQUE7QUFBQSxFQXpEZ0NtQyx1QkFBVztBQUFBLElBQUFDLFFBQUEsR0E0RC9CcEMsb0JBQW9CO0FBQUFxQyxPQUFBLGNBQUFELFFBQUEifQ==