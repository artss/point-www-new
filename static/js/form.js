define(['backbone', 'underscore', 'jquery', 'lib/backbone.validation'], function(Backbone, _, $) {
  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

  var FormModel = Backbone.Model.extend({});

  var FormView = Backbone.View.extend({
    model: FormModel,

    events: {
      'submit': 'submit',
      'change': 'validateField',
      'input input': 'validateFieldDelayed'
    },

    initialize: function(options) {
      if (!options.model) {
        this.model = new this.model();
      }
      Backbone.View.prototype.initialize.call(this, options);

      this.listenTo(this.model, {
        'validated': this.updateValidation
      });
    },

    render: function() {
      this.$submit = this.$('.js-submit');
      this.updateValidation();
    },

    focus: function(field) {
      var $field = _.isString(field) ? this.$('[name="' + field + '"]') : $(field);
      $field.focus();
    },

    validate: function(fields) {
      var validation = this.model.validate();
      return _.isEmpty(fields) ? validation : _.pick(validation, fields);
    },

    validateField: function(evt) {
      var $field = _.isString(evt) ? this.$('[name="' + evt + '"]') : $(evt.target);

      var name = $field.attr('name');
      this.model.set(name, $field.val());
      var validation = this.validate(name);

      this.setValidation($field, _.isEmpty(validation));
    },

    validateFieldDelayed: _.debounce(function() {
      this.validateField.apply(this, arguments);
    }, 400),

    updateValidation: function() {
      this.$submit.prop('disabled', !this.isValid());
    },

    isValid: function() {
      return this.model.isValid.apply(this.model, arguments);
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
    }
  });



  return {
    Model: FormModel,
    View: FormView
  };
});

