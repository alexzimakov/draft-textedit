import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.css';

function Button({ children, className, style, disabled, onClick }) {
  const classes = classNames('DraftTextEdit-Button', className);

  return (
    <button
      style={style}
      className={classes}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
Button.defaultProps = {
  className: '',
  style: {},
  disabled: false,
  onClick: null,
};

export default Button;
