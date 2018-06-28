import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.css';

class Button extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handelKeyDown = this.handelKeyDown.bind(this);
  }

  handleMouseDown(event) {
    event.preventDefault();
    this.props.onPress(event);
  }

  handelKeyDown(event) {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      const { onPress } = this.props;
      onPress(event);
    }
  }

  render() {
    const {
      children,
      className,
      size,
      variant,
      primary,
      ...otherProps
    } = this.props;
    const classes = classNames(
      'DraftTextEditButton',
      `DraftTextEditButton_size_${size}`,
      variant && `DraftTextEditButton_variant_${variant}`,
      primary && 'DraftTextEditButton_primary',
      className
    );

    return (
      <button
        className={classes}
        {...otherProps}
        onMouseDown={this.handleMouseDown}
        onKeyDown={this.handelKeyDown}>
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  accessKey: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  primary: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
  variant: PropTypes.oneOf(['text', 'outlined']),
  onPress: PropTypes.func,
};
Button.defaultProps = {
  className: '',
  style: {},
  accessKey: '',
  autoFocus: false,
  disabled: false,
  type: 'button',
  primary: false,
  size: 'small',
  variant: null,
  onPress: () => {},
};

export default Button;
