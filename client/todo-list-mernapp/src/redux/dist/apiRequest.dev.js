"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logOut = exports.updateItem = exports.deleteAllItemsWithStatusTrue = exports.deleteItem = exports.addTaskById = exports.getAllListById = exports.deleteUser = exports.getAllUser = exports.registerUser = exports.loginUser = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _authSlice = require("./authSlice");

var _userSlice = require("./userSlice");

var _taskSlice = require("./taskSlice");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_axios["default"].defaults.baseURL = 'http://15.235.202.44:5500/';

var loginUser = function loginUser(user, dispatch, navigate) {
  var res;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dispatch((0, _authSlice.loginStart)());
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post('http://15.235.202.44:5500/api/users/login', user, {
            withCredentials: true
          }));

        case 4:
          res = _context.sent;
          dispatch((0, _authSlice.loginSuccess)(res.data));
          navigate("/home");
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          dispatch((0, _authSlice.loginFailed)());

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.loginUser = loginUser;

var registerUser = function registerUser(user, dispatch, navigate) {
  var res;
  return regeneratorRuntime.async(function registerUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          dispatch((0, _authSlice.registerStart)());
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post('http://15.235.202.44:5500/api/users/register', user));

        case 4:
          res = _context2.sent;
          dispatch((0, _authSlice.registerSuccess)());
          navigate("/");
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          dispatch((0, _authSlice.registerFailed)());

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.registerUser = registerUser;

var getAllUser = function getAllUser(accessToken, dispatch) {
  var res;
  return regeneratorRuntime.async(function getAllUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          dispatch((0, _userSlice.getUserStart)());
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get('http://15.235.202.44:5500/api/users', {
            headers: {
              token: "Bearer ".concat(accessToken)
            }
          }, {
            withCredentials: true
          }));

        case 4:
          res = _context3.sent;
          dispatch((0, _userSlice.getUserSuccess)(res.data));
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          dispatch((0, _userSlice.getUserFailed)());

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.getAllUser = getAllUser;

var deleteUser = function deleteUser(accessToken, dispatch, id) {
  var res;
  return regeneratorRuntime.async(function deleteUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          dispatch((0, _userSlice.deleteUserStart)());
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_axios["default"]["delete"]('http://15.235.202.44:5500/api/users/' + id, {
            headers: {
              token: "Bearer  + ".concat(accessToken)
            }
          }));

        case 4:
          res = _context4.sent;
          dispatch((0, _userSlice.deleteUserSuccess)(res.data));
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          dispatch((0, _userSlice.deleteUserFailed)(_context4.t0.response.data));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.deleteUser = deleteUser;

var getAllListById = function getAllListById(accessToken, dispatch, id, axiosJWT) {
  var res;
  return regeneratorRuntime.async(function getAllListById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          dispatch((0, _taskSlice.getTaskStart)());
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(axiosJWT.get("http://15.235.202.44:5500/api/users/".concat(id, "/items"), {
            headers: {
              token: "Bearer ".concat(accessToken)
            }
          }));

        case 4:
          res = _context5.sent;
          dispatch((0, _taskSlice.getTaskSuccess)(res.data));
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](1);
          dispatch((0, _taskSlice.getTaskFailed)());

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.getAllListById = getAllListById;

var addTaskById = function addTaskById(task, accessToken, dispatch, id, axiosJWT) {
  var res;
  return regeneratorRuntime.async(function addTaskById$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          dispatch((0, _taskSlice.addTaskStart)());
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(axiosJWT.post("http://15.235.202.44:5500/api/users/".concat(id, "/items"), {
            task: task,
            headers: {
              token: "Bearer ".concat(accessToken)
            }
          }));

        case 4:
          res = _context6.sent;
          dispatch((0, _taskSlice.addTaskSuccess)(res.data));
          _context6.next = 11;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](1);
          dispatch((0, _taskSlice.addTaskFailed)());

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.addTaskById = addTaskById;

var deleteItem = function deleteItem(accessToken, dispatch, id, userId, axiosJWT) {
  var res;
  return regeneratorRuntime.async(function deleteItem$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          dispatch((0, _taskSlice.deleteTaskStart)());
          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(axiosJWT["delete"]("http://15.235.202.44:5500/api/users/".concat(userId, "/items/").concat(id), {
            headers: {
              token: "Bearer ".concat(accessToken)
            }
          }));

        case 4:
          res = _context7.sent;
          dispatch((0, _taskSlice.deleteTaskSuccess)(res.data));
          _context7.next = 11;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](1);
          dispatch((0, _taskSlice.deleteTaskFailed)());

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.deleteItem = deleteItem;

var deleteAllItemsWithStatusTrue = function deleteAllItemsWithStatusTrue(accessToken, dispatch, id, axiosJWT) {
  var res;
  return regeneratorRuntime.async(function deleteAllItemsWithStatusTrue$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          dispatch((0, _taskSlice.deleteTaskStart)());
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(axiosJWT["delete"]("http://15.235.202.44:5500/api/users/".concat(id, "/items"), {
            headers: {
              token: "Bearer ".concat(accessToken)
            },
            params: {
              itemStatus: true
            }
          }));

        case 4:
          res = _context8.sent;
          dispatch((0, _taskSlice.deleteTaskSuccess)(res.data));
          _context8.next = 11;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](1);
          dispatch((0, _taskSlice.deleteTaskFailed)());

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.deleteAllItemsWithStatusTrue = deleteAllItemsWithStatusTrue;

var updateItem = function updateItem(accessToken, dispatch, id, userId, updateItemText) {
  var res;
  return regeneratorRuntime.async(function updateItem$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          dispatch((0, _taskSlice.updateTaskStart)());
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].put("http://15.235.202.44:5500/api/users/".concat(userId, "/items/").concat(id), {
            headers: {
              token: "Bearer ".concat(accessToken)
            },
            item: updateItemText
          }));

        case 4:
          res = _context9.sent;
          dispatch((0, _taskSlice.updateTaskSuccess)(res.data));
          _context9.next = 11;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](1);
          dispatch((0, _taskSlice.updateTaskFailed)());

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.updateItem = updateItem;

var logOut = function logOut(dispatch, id, navigate, accessToken, axiosJWT) {
  return regeneratorRuntime.async(function logOut$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          dispatch((0, _authSlice.logOutStart)());
          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(axiosJWT.post("http://15.235.202.44:5500/api/users/logout", id, {
            headers: {
              token: "Bearer ".concat(accessToken)
            }
          }));

        case 4:
          dispatch((0, _authSlice.logOutSuccess)());
          navigate("/");
          _context10.next = 11;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](1);
          dispatch((0, _authSlice.logOutFailed)());

        case 11:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.logOut = logOut;