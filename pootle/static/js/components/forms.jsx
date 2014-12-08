'use strict';

var React = require('react');
var _ = require('underscore');


var FormElement = React.createClass({

  /* Lifecycle */

  getDefaultProps: function () {
    return {
      type: 'text',
    };
  },


  /* Layout */

  render: function () {
    var attribute = this.props.attribute;
    var fieldId = ['id', attribute].join('_');
    var hint = this.props.help;

    var errors = (_.size(this.props.errors) > 0 &&
                  this.props.errors[attribute]);

    var inputClass = {
      text: FormValueInput,
      email: FormValueInput,
      password: FormValueInput,
      textarea: FormValueInput,

      checkbox: FormCheckedInput,
      radio: FormCheckedInput

      // TODO: FormSelectInput
    }[this.props.type];

    var newProps = {
      id: fieldId,
      name: attribute,
      value: this.props.formData[attribute],
    };
    var inputProps = _.extend({}, this.props, newProps);
    var formInput = React.createFactory(inputClass)(inputProps);

    return (
      <div className="field-wrapper">
        <label htmlFor={fieldId}>{this.props.label}</label>
        {formInput}
      {hint &&
        <span className="helptext">{hint}</span>}
      {errors &&
        <ul className="errorlist">{errors.map(function (msg, i) {
          return <li key={i}>{msg}</li>;
        })}</ul>}
      </div>
    );
  }
});


var FormValueInput = React.createClass({

  /* Handlers */

  handleChange: function (e) {
    this.props.handleChange(e.target.name, e.target.value);
  },


  /* Layout */

  render: function () {
    if (this.props.type === 'textarea') {
      return <textarea onChange={this.handleChange} {...this.props} />;
    }

    return <input onChange={this.handleChange} {...this.props} />;
  }

});


var FormCheckedInput = React.createClass({

  /* Handlers */

  handleChange: function (e) {
    this.props.handleChange(e.target.name, e.target.checked);
  },


  /* Layout */

  render: function () {
    return <input checked={this.props.value} onChange={this.handleChange}
                  {...this.props} />;
  }

});


module.exports = {
  FormElement: FormElement
};