var getComplexity = require('password-complexity');
var debug = require('debug')('PasswordField');

module.exports = PasswordField;

function PasswordField(options) {
  this.el = $(options.el);
  this.input = this.el.find('input');
  this.indicator = this.el.find('.js-password-indicator');
  this.content = this.el.find('.js-password-text');
  this.confirmField = $(this.el.attr('data-confirm-field'));
  this.el.on('keyup', this._onKeyUp.bind(this));
  this.confirmField.on('keyup', this.updateConfirmField.bind(this));
  this.minLength = this.input.attr('data-validates-minlength') || 0;
}

PasswordField.prototype._onKeyUp = function(event) {
  var score = this.getScore();
  this.renderIndicator(score);
  this.renderContent(score);
  this.updateConfirmField();
};

PasswordField.prototype.updateConfirmField = function() {
  var password = this.input.val();
  var confirm = this.confirmField.val();

  if( password.length < this.minLength || confirm.length === 0 ) {
    this.confirmField.removeClass('is-matching is-not-matching');
    return;
  }

  var equal = password !== "" && confirm !== "" && confirm === password;
  this.confirmField.toggleClass('is-matching', equal).toggleClass('is-not-matching', !equal);
};

PasswordField.prototype.getScore = function() {
  var complexity = getComplexity(this.input.val());

  // No password at all
  if( complexity === false ) return false;

  // Less than 8 characters
  if( complexity === -1 ) return 0;

  // Others
  if( complexity < 30 ) return 1;
  if( complexity < 50 ) return 2;
  if( complexity < 70 ) return 3;
  return 4;
};

PasswordField.prototype.getContentForScore = function(score) {
  if( score === false ) return "";
  if( score === 0 ) return "Too Short";
  if( score === 1 ) return "Weak";
  if( score === 2 ) return "Medium";
  if( score === 3 ) return "Strong";
  if( score === 4 ) return "Very Strong";
};

PasswordField.prototype.renderContent = function(score) {
  var content = this.getContentForScore(score);
  this.content.text(content);
};

PasswordField.prototype.renderIndicator = function(score) {
  debug('Score is %s', score);
  this.indicator.attr('data-strength', score);
};