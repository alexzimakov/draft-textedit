import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './StyleButton.css';

class StyleButton extends Component {
  constructor(props) {
    super(props);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handelKeyDown = this.handelKeyDown.bind(this);
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

  handleMouseDown(event) {
    event.preventDefault();
    const { style, onPress } = this.props;
    onPress(style);
  }

  handelKeyDown(event) {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      const { style, onPress } = this.props;
      onPress(style);
    }
  }

  renderTooltip(tooltip) {
    const { tooltipIsVisible } = this.state;
    const classes = classNames(
      'DraftTextEdit-StyleButton__tooltip',
      tooltipIsVisible && 'DraftTextEdit-StyleButton__tooltip_visible'
    );

    return <span className={classes}>{tooltip}</span>;
  }

  render() {
    const { children, tooltip, disabled, active } = this.props;
    const classes = classNames(
      'DraftTextEdit-StyleButton',
      active && 'DraftTextEdit-StyleButton_active'
    );

    return (
      <button
        disabled={disabled}
        className={classes}
        onFocus={this.showTooltip}
        onBlur={this.hideTooltip}
        onMouseOver={this.showTooltip}
        onMouseOut={this.hideTooltip}
        onMouseDown={this.handleMouseDown}
        onKeyDown={this.handelKeyDown}>
        {children}
        {tooltip && this.renderTooltip(tooltip)}
      </button>
    );
  }
}

StyleButton.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  onPress: PropTypes.func,
};
StyleButton.defaultProps = {
  tooltip: '',
  disabled: false,
  active: false,
  onPress: () => {},
};

export default StyleButton;
