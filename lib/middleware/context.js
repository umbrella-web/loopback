var loopback = require('../loopback');
var cls = require('continuation-local-storage');

module.exports = context;

var name = 'loopback';

function context(options) {
  options = options || {};
  var scope = options.name || name;
  var ns = cls.createNamespace(scope);

  // Make the namespace globally visible via the process.context property
  process.context = process.context || {};
  process.context[scope] = ns;

  // Set up loopback.getCurrentContext()
  loopback.getCurrentContext = function() {
    return ns;
  };

  // Return the middleware
  return function (req, res, next) {
    // Bind req/res event emitters to the given namespace
    ns.bindEmitter(req);
    ns.bindEmitter(res);
    // Create namespace for the request context
    ns.run(function (context) {
      // Run the code in the context of the namespace
      ns.set('req', req);
      ns.set('res', res);
      next();
    });
  };
}
