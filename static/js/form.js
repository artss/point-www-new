define(['backbone', 'underscore', 'jquery'], function(Backbone, _, $) {
  /**
   * Base form model.
   */
  var FormModel = Backbone.Model.extend({
    validate: function(fields) {
      if (_.isEmpty(_.keys(fields))) {
        fields = this.attributes;
      }

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
            var re = validator;
            validator = function(value) {
              if (!value) { return; }
              if (!re.test(value)) { return 'match'; }
            };
          }

          if (_.isFunction(validator)) {
            var res = validator(value);

            if (res && res.promise) { // Deferred
              res.done(chain);
              res.fail(function(message) {
                this.trigger('validated', field, false, message);
              });
            } else if (res) {
              this.trigger('validated', field, false, res);
            } else {
              _.defer(chain);
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
    }
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
      this.$submit = this.$('.js-submit');
    },

    focus: function(field) {
      var $field = _.isString(field) ? this.$('[name="' + field + '"]') : $(field);
      $field.focus();
    },

    setValue: function(evt) {
      var $field = _.isString(evt) ? this.$('[name="' + evt + '"]') : $(evt.target);

      var name = $field.attr('name');
      this.model.set(name, $field.val(), { validate: true });
    },

    setValueDelayed: _.debounce(function() {
      this.setValue.apply(this, arguments);
    }, 400),

    updateButton: function() {
      this.$submit.prop('disabled', !this.model.isValid());
    },

    setValidation: function(field, status, message) {
      var $field = _.isString(field) ? this.$('[name="' + field + '"]') : $(field);
      var $container = $field.closest('.js-input-container');
      if ($container.length === 0) {
        $container = $field;
      }

      var errdata = $field.data('error');
      var error;

      if (message) {
        error = _.isObject(errdata) ? errdata[message] || message : message;
      }

      if (!error) {
        error = _.isObject(errdata) ? errdata['default'] : errdata;
      }

      $container.find('.js-input-error-label').html(error);

      $container.toggleClass('error', !status);

      this.updateButton();
    },

    submit: function(evt) {
      evt.preventDefault();

      if (!this.isValid()) {
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

    remove: function() {
      this.stopListening(this.model);
      this.model.destroy();
      delete this.model;
    }
  });



  return {
    Model: FormModel,
    View: FormView
  };
});

