import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import classNames from 'classnames';
import './Button.css';

class Button extends Component {
  static customProps = ['primary', 'size', 'variant', 'onPress'];

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    accessKey: PropTypes.string,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    primary: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large']),
    variant: PropTypes.oneOf(['text', 'outlined']),
    onPress: PropTypes.func,
  };

  static defaultProps = {
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

  handleMouseDown = event => {
    event.preventDefault();
    this.props.onPress(event);
  };

  handelKeyDown = event => {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      const { onPress } = this.props;
      onPress(event);
    }
  };

  render() {
    const { children, className, size, variant, primary, ...otherProps } = this.props;
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
        onMouseDown={this.handleMouseDown}
        onKeyDown={this.handelKeyDown}
        {...omit(otherProps, Button.customProps)}>
        {children}
      </button>
    );
  }
}

export default Button;
