/* global define */

/**
 * Plugin for loading templates.
 *
 * Usage: define(['swig!path/to/template.html'], function(tpl) {
 *   console.log(tpl(context));
 * });
 */
define(['swig', 'util/tpl/filters', 'underscore', 'jquery'], function(swig, filters, _, $) {
  'use strict';

  /**
   * Escapes JavaScript content for proper minification.
   *
   * @param content JavaScript content.
   * @returns {XML|string} Escaped content.
   */
  function jsEscape(content) {
    return content.replace(/(['\\])/g, '\\$1')
      .replace(/[\f]/g, '\\f')
      .replace(/[\b]/g, '\\b')
      .replace(/[\n]/g, '\\n')
      .replace(/[\t]/g, '\\t')
      .replace(/[\r]/g, '\\r')
      .replace(/[\u2028]/g, '\\u2028')
      .replace(/[\u2029]/g, '\\u2029');
  }

  var buildMap = {};

  var loader = {
    resolve: function(to /*, from*/) {
      return to;
    },
    load: function(filename, callback) {
      console.log('requireLoader.load', filename, callback);
      var data = $.ajax({
        url: '/templates' + filename,
        async: false
      }).responseText;

      if (callback) {
        return callback(null, data);
      }

      return data;
    }
  };

  swig.setDefaults({loader: loader});

  _.each(filters, function(filter, name) {
    swig.setFilter(name, filter);
  });

  return {
    load: function(name, req, onload, config) {
      if (config && config.isBuild) {
        onload(); // Required by builder.
      }

      swig.compileFile(name, {filename: name}, function compileFileCallback(err, template) {
        if (err) {
          console.error(err);
        } else {
          onload(template);
        }
      });
    },

    write: function(pluginName, moduleName, write) {
      // Write all built files to a single output file.
      if (moduleName in buildMap) {
        var data = buildMap[moduleName];
        write('define("' + pluginName + '!' + moduleName + '", ["lib/swig"], function(s){return s.compile(\'' +
          jsEscape(data) + '\');});\n');
      }
    }
  };
});
