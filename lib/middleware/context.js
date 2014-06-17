var cls = require('continuation-local-storage')

module.exports = context;

var name = 'loopback';

function context(options) {
  options = options || {};
  var ns = cls.createNamespace(name);

  // Make the namespace globally visible via the process.context property
  process.context = ns;
  return function (req, res, next) {
    // Create namespace for the request context
    ns.run(function (context) {
      ns.set('req', req);
      ns.set('res', res);
      next();
    });
  };
}

module.exports.getCurrent = function () {
  return cls.getNamespace('loopback');
};


