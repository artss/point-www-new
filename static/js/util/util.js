define(['underscore'], function(_) {
  return {
    parseUrl: function parseUrl(url) {
      var a = document.createElement('a');
      a.href = url;

      return _.pick(a, ['href', 'protocol', 'host', 'hostname', 'port',
                        'pathname', 'search', 'hash']);
    }
  };
});

