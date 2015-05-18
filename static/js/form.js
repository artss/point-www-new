define(['backbone', 'underscore', 'jquery'], function(Backbone, _, $) {
  /**
   * RegExp validators generator.
   *
   * @param {string} name Validator name.
   * @param {RegExp} re Regular expression.
   *
   * @return {function} Validator function
   */
  function matchFn(name, re) {
    return function(value) {
      if (!value) { return; }
      return re.test(value) ? undefined : name;
    };
  }

  /**
   * Base form model.
   */
  var FormModel = Backbone.Model.extend({
    validate: function(fields) {
      if (_.isEmpty(fields)) {
        fields = this.attributes;
      } else if (_.isObject(this._valid)) {
        fields = _.extend(_.pick(this.attributes, _.keys(this._valid)), fields);
      }

      console.log('fields', fields);

      if (!this._valid) {
        this._valid = {};
      }

      _.each(fields, function(value, field) {
        this._valid[field] = false;

        var validators = this.validation[field].slice();

        var chain = function() {
          if (_.isEmpty(validators)) {
            // validation done; all is correct
            this._valid[field] = true;
            this.trigger('validated', field, true);
            return;
          }

          var validator = validators.shift();

          if (_.isString(validator)) {
            validator = FormModel.validators[validator];

          } else if (_.isRegExp(validator)) {
            validator = matchFn('match', validator);
          }

          if (_.isFunction(validator)) {
            var res = validator.call(this, value);

            if (res && res.promise) { // Deferred
              res.done(chain);
              res.fail(function(message) {
                this.trigger('validated', field, false, message);
              }.bind(this));
            } else if (res) {
              this.trigger('validated', field, false, res);
            } else {
              chain();
            }
          }
        }.bind(this);

        chain();
      }, this);
    },

    isValid: function() {
      if (typeof this._valid === 'undefined') {
        this.validate();
      }

      return !_.some(_.values(this._valid), function(v) { return !v; });
    }
  });

  FormModel.validators = {
    required: function(value) {
      if (!value) {
        return 'required';
      }
    },

    integer: matchFn('integer', /^\d+$/),
    email: matchFn('email', /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i),
    url: matchFn('url', /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i)
  };

  /**
   * Base form view.
   */
  var FormView = Backbone.View.extend({
    model: FormModel,

    events: {
      'submit': 'submit',
      'change': 'setValue',
      'input input': 'setValueDelayed'
    },

    initialize: function(options) {
      if (!options.model) {
        this.model = new this.model();
      }
      Backbone.View.prototype.initialize.call(this, options);

      this.listenTo(this.model, {
        'validated': this.setValidation
      });
    },

    render: function() {
      this.model.set(_.reduce(this.$el.serializeArray(), function(memo, f) {
        memo[f.name] = f.value;
        return memo;
      }, {}));
      this.$submit = this.$('.js-submit');
    },

    focus: function(field) {
      var $field = _.isString(field) ? this.getField(field) : $(field);
      $field.focus();
    },

    getField: function(name) {
      return this.$('[name="' + name + '"]');
    },

    setValue: function(evt) {
      var $field = _.isString(evt) ? this.getField(evt) : $(evt.target);

      var obj = {};
      obj[$field.attr('name')] = $field.val();

      this.model.set(obj);
      this.model.validate(obj);
    },

    setValueDelayed: _.debounce(function() {
      this.setValue.apply(this, arguments);
    }, 400),

    updateButton: function(valid) {
      if (this.$submit.hasClass('loading')) { return; }
      if (typeof valid === 'undefined') {
        valid = this.model.isValid();
      }
      this.$submit.prop('disabled', !valid);
    },

    setValidation: function(field, valid, message) {
      var $field = _.isString(field) ? this.getField(field) : $(field);
      var $container = $field.closest('.js-input-container');
      if ($container.length === 0) {
        $container = $field;
      }

      if (!valid) {
        var errdata = $field.data('error');
        var error;

        if (message) {
          error = _.isObject(errdata) ? errdata[message] || message : message;
        }

        if (!error) {
          error = _.isObject(errdata) ? errdata['default'] : errdata;
        }

        $container.find('.js-input-error-label').html(error);

        $field.focus();
      }

      $container.toggleClass('error', !valid);

      this.updateButton();
    },

    submit: function(evt) {
      evt.preventDefault();

      this.model.validate();
      if (!this.model.isValid()) {
        return;
      }

      this.$(':input').prop('disabled', true);
      this.$submit.addClass('loading');

      $.ajax({
        url: this.$el.attr('action'),
        type: this.$el.attr('method').toUpperCase(),
        data: this.model.toJSON()
      })

      .always(function() {
        this.$(':input').prop('disabled', false);
        this.$submit.removeClass('loading');
      }.bind(this))

      .success(function(data) {
        this.trigger('success', data.data);
      }.bind(this))

      .error(function(xhr) {
        this.trigger('error', xhr.responseJSON.data);
      }.bind(this));
    },

    destroy: function() {
      this.stopListening(this.model);
      this.model.destroy();
      delete this.model;

      Backbone.view.prototype.destroy.apply(this, arguments);
    }
  });



  return {
    Model: FormModel,
    View: FormView
  };
});

