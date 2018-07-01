import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import Button from '../Button';
import Tooltip from '../Tooltip';
import './StyleButton.css';

class StyleButton extends Component {
  constructor(props) {
    super(props);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.state = {
      tooltipIsVisible: false,
    };
  }

  showTooltip() {
    this.setState({ tooltipIsVisible: true });
  }

  hideTooltip() {
    this.setState({ tooltipIsVisible: false });
  }

  handlePress() {
    const { onPress } = this.props;
    onPress();
  }

  render() {
    const {
      children,
      className,
      style,
      disabled,
      title,
      active,
      ...otherProps
    } = this.props;
    const { tooltipIsVisible } = this.state;
    const classes = classNames('DraftTextEditStyleButton', className);
    const buttonClasses = classNames(
      'DraftTextEditStyleButton-Button',
      active && 'DraftTextEditStyleButton-Button_active',
      className
    );
    let tooltipId = null;
    let tooltip = null;

    if (title) {
      const shouldShowTooltip = !disabled && tooltipIsVisible;
      const tooltipClasses = classNames(
        'DraftTextEditStyleButton-Tooltip',
        shouldShowTooltip && 'DraftTextEditStyleButton-Tooltip_visible'
      );

      tooltipId = `tooltip-${shortId.generate()}`;
      tooltip = (
        <span className={tooltipClasses}>
          <Tooltip id={tooltipId}>{title}</Tooltip>
        </span>
      );
    }

    return (
      <span className={classes} style={style} {...otherProps}>
        <Button
          className={buttonClasses}
          disabled={disabled}
          variant="text"
          aria-describedby={tooltipId}
          onMouseOver={this.showTooltip}
          onFocus={this.showTooltip}
          onMouseOut={this.hideTooltip}
          onBlur={this.hideTooltip}
          onPress={this.handlePress}>
          {children}
        </Button>
        {tooltip}
      </span>
    );
  }
}

StyleButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  disabled: PropTypes.bool,
  title: PropTypes.string,
  active: PropTypes.bool,
  onPress: PropTypes.func,
};
StyleButton.defaultProps = {
  className: '',
  style: {},
  disabled: false,
  title: '',
  active: false,
  onPress: () => {},
};

export default StyleButton;
