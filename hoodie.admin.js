// Generated by CoffeeScript 1.5.0
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Hoodie.AdminAccount = (function(_super) {

  __extends(AdminAccount, _super);

  function AdminAccount(hoodie, admin) {
    var method, _i, _len, _ref;
    this.hoodie = hoodie;
    this.admin = admin;
    this._handleSignInSuccess = __bind(this._handleSignInSuccess, this);
    this._handleAuthenticateRequestSuccess = __bind(this._handleAuthenticateRequestSuccess, this);
    this.username = 'admin';
    this._requests = {};
    _ref = ['signUp', 'destroy', 'anonymousSignUp', 'hasAnonymousAccount', 'setAnonymousPassword', 'getAnonymousPassword', 'removeAnonymousPassword'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      this[method] = void 0;
    }
  }

  AdminAccount.prototype.on = function(event, cb) {
    event = event.replace(/(^| )([^ ]+)/g, "$1account:$2");
    return this.admin.on(event, cb);
  };

  AdminAccount.prototype.trigger = function() {
    var event, parameters, _ref;
    event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.admin).trigger.apply(_ref, ["account:" + event].concat(__slice.call(parameters)));
  };

  AdminAccount.prototype.request = function(type, path, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return (_ref = this.admin).request.apply(_ref, arguments);
  };

  AdminAccount.prototype.signIn = function(password) {
    var username;
    username = 'admin';
    return this._sendSignInRequest(username, password);
  };

  AdminAccount.prototype.signOut = function(password) {
    var _this = this;
    return this._sendSignOutRequest().then(function() {
      return _this.trigger('signout');
    });
  };

  AdminAccount.prototype._handleAuthenticateRequestSuccess = function(response) {
    if (response.userCtx.name === 'admin') {
      this._authenticated = true;
      this.trigger('authenticated', this.username);
      return this.hoodie.resolveWith(this.admin);
    } else {
      this._authenticated = false;
      this.trigger('error:unauthenticated');
      return this.hoodie.rejectWith();
    }
  };

  AdminAccount.prototype._handleSignInSuccess = function(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return function(response) {
      _this.trigger('signin', _this.username);
      _this.trigger('authenticated', _this.username);
      return _this.hoodie.resolveWith(_this.admin);
    };
  };

  AdminAccount.prototype._userKey = function() {
    return 'admin';
  };

  return AdminAccount;

})(Hoodie.Account);

Hoodie.AdminApp = (function() {

  function AdminApp(hoodie, admin) {
    this.hoodie = hoodie;
    this.admin = admin;
  }

  AdminApp.prototype.getInfo = function() {
    var defer, info;
    defer = this.hoodie.defer();
    info = {
      name: "minutes.io"
    };
    window.setTimeout(function() {
      return defer.resolve(info);
    });
    return defer.promise();
  };

  AdminApp.prototype.getStats = function(since) {
    var defer, key, stats;
    defer = this.hoodie.defer();
    stats = {
      signups: 12,
      account_deletions: 3,
      users_active: 1302,
      users_total: 4211,
      growth: 0.04,
      active: -0.02,
      since: since
    };
    if (!since) {
      for (key in stats) {
        stats[key] = stats[key] * 17;
      }
    }
    window.setTimeout(function() {
      return defer.resolve(stats);
    });
    return defer.promise();
  };

  return AdminApp;

})();

Hoodie.AdminConfig = (function() {

  function AdminConfig(hoodie, admin) {
    this.hoodie = hoodie;
    this.admin = admin;
  }

  AdminConfig.prototype.get = function() {
    return this.admin.modules.find("appconfig").pipe(function(module) {
      return module.config;
    });
  };

  AdminConfig.prototype.set = function(config) {
    if (config == null) {
      config = {};
    }
    return this.admin.modules.update("appconfig", {
      config: config
    });
  };

  return AdminConfig;

})();

Hoodie.AdminLogs = (function() {

  function AdminLogs(hoodie, admin) {
    this.hoodie = hoodie;
    this.admin = admin;
  }

  AdminLogs.prototype.findAll = function() {
    return this.hoodie.resolveWith([]);
  };

  return AdminLogs;

})();

Hoodie.AdminModules = (function(_super) {

  __extends(AdminModules, _super);

  AdminModules.prototype.name = 'modules';

  function AdminModules(hoodie, admin) {
    this.hoodie = hoodie;
    this.admin = admin;
    this.findAll = __bind(this.findAll, this);
    this.find = __bind(this.find, this);
    AdminModules.__super__.constructor.apply(this, arguments);
  }

  AdminModules.prototype.find = function(type, moduleName) {
    if (!moduleName) {
      moduleName = type;
    }
    if (moduleName === 'module') {
      debugger;
    }
    return AdminModules.__super__.find.call(this, "module", moduleName);
  };

  AdminModules.prototype.findAll = function() {
    return AdminModules.__super__.findAll.call(this, 'module');
  };

  AdminModules.prototype.update = function(moduleName, config) {
    debugger;    return AdminModules.__super__.update.call(this, "module", moduleName, config);
  };

  AdminModules.prototype.getConfig = function(moduleName) {
    return this.hoodie.resolveWith({
      email: {
        transport: {
          host: "",
          port: 465,
          auth: {
            user: "@gmail.com",
            pass: ""
          },
          secureConnection: true,
          service: "Gmail"
        }
      }
    });
  };

  AdminModules.prototype.setConfig = function(moduleName, config) {
    if (config == null) {
      config = {};
    }
    return this.hoodie.resolveWith(config);
  };

  return AdminModules;

})(Hoodie.Remote);

Hoodie.AdminUsers = (function(_super) {

  __extends(AdminUsers, _super);

  AdminUsers.prototype.name = '_users';

  AdminUsers.prototype.prefix = 'org.couchdb.user:';

  function AdminUsers(hoodie, admin) {
    this._mapDocsFromFindAll = __bind(this._mapDocsFromFindAll, this);    this.hoodie = hoodie;
    this.admin = admin;
    AdminUsers.__super__.constructor.apply(this, arguments);
  }

  AdminUsers.prototype.addTestUser = function(email) {
    var baseUrl, hash, testHoodieUser;
    baseUrl = hoodie.baseUrl;
    hash = "test-" + (hoodie.uuid(5));
    this.hoodie.store.clear();
    testHoodieUser = new Hoodie(baseUrl.replace(/\bapi\./, "" + hash + ".api."));
    testHoodieUser.account.ownerHash = hash;
    if (!email) {
      email = "" + testHoodieUser.account.ownerHash + "@example.com";
    }
    return testHoodieUser.account.signUp(email, 'secret').then(function() {
      return testHoodieUser.account.signOut();
    });
  };

  AdminUsers.prototype.addTestUsers = function(nr) {
    var i, promises, timestamp;
    if (nr == null) {
      nr = 1;
    }
    timestamp = (new Date).getTime();
    promises = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 1; 1 <= nr ? _i <= nr : _i >= nr; i = 1 <= nr ? ++_i : --_i) {
        _results.push(this.addTestUser());
      }
      return _results;
    }).call(this);
    return $.when.apply($, promises);
  };

  AdminUsers.prototype.removeAllTestUsers = function() {
    return this.hoodie.rejectWith({
      error: "not yet implemented"
    });
  };

  AdminUsers.prototype.getTotal = function() {
    return this.findAll().pipe(function(users) {
      return users.length;
    });
  };

  AdminUsers.prototype.search = function(query) {
    var path;
    path = "/_all_docs?include_docs=true";
    path = "" + path + "&startkey=\"org.couchdb.user:user/" + query + "\"&endkey=\"org.couchdb.user:user/" + query + "|\"";
    return this.request("GET", path).pipe(this._mapDocsFromFindAll).pipe(this.parseAllFromRemote);
  };

  AdminUsers.prototype.request = function(type, path, options) {
    if (options == null) {
      options = {};
    }
    if (this.name) {
      path = "/" + (encodeURIComponent(this.name)) + path;
    }
    options.contentType || (options.contentType = 'application/json');
    if (type === 'POST' || type === 'PUT') {
      options.dataType || (options.dataType = 'json');
      options.processData || (options.processData = false);
      options.data = JSON.stringify(options.data);
    }
    return this.admin.request(type, path, options);
  };

  AdminUsers.prototype._mapDocsFromFindAll = function(response) {
    var rows;
    rows = response.rows.filter(function(row) {
      return /^org\.couchdb\.user:/.test(row.id);
    });
    return rows.map(function(row) {
      return row.doc;
    });
  };

  return AdminUsers;

})(Hoodie.Remote);

Hoodie.Admin = (function() {

  function Admin(hoodie) {
    this.hoodie = hoodie;
    this.account = new Hoodie.AdminAccount(this.hoodie, this);
    this.app = new Hoodie.AdminApp(this.hoodie, this);
    this.users = new Hoodie.AdminUsers(this.hoodie, this);
    this.config = new Hoodie.AdminConfig(this.hoodie, this);
    this.logs = new Hoodie.AdminLogs(this.hoodie, this);
    this.modules = new Hoodie.AdminModules(this.hoodie, this);
  }

  Admin.prototype.trigger = function() {
    var event, parameters, _ref;
    event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.hoodie).trigger.apply(_ref, ["admin:" + event].concat(__slice.call(parameters)));
  };

  Admin.prototype.on = function(event, data) {
    event = event.replace(/(^| )([^ ]+)/g, "$1admin:$2");
    return this.hoodie.on(event, data);
  };

  Admin.prototype.request = function(type, path, options) {
    var baseUrl, defaults;
    if (options == null) {
      options = {};
    }
    baseUrl = this.hoodie.baseUrl.replace(/\bapi\./, 'admin.api.');
    defaults = {
      type: type,
      url: "" + baseUrl + path,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      dataType: 'json'
    };
    return $.ajax($.extend(defaults, options));
  };

  Admin.prototype.authenticate = function() {
    return this.account.authenticate();
  };

  Admin.prototype.signIn = function(password) {
    return this.account.signIn(password);
  };

  Admin.prototype.signOut = function() {
    return this.account.signOut();
  };

  return Admin;

})();

Hoodie.extend('admin', Hoodie.Admin);
