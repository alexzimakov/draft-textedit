import React, { Component, Children } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import StatelessTooltip from './StatelessTooltip';
import './Tooltip.css';

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.wrapperRef = React.createRef();
    this.tooltipRef = React.createRef();
    this.tooltipId = `tooltip-${shortId.generate()}`;
    this.mountElement = document.createElement('div');
    this.mountElement.id = `tooltip-root-${shortId.generate()}`;
    this.state = {
      isVisible: false,
      coordinates: { x: 0, y: 0 },
      placement: 'top',
      position: null,
    };
  }

  componentDidMount() {
    document.body.appendChild(this.mountElement);
  }

  componentWillUnmount() {
    document.body.removeChild(this.mountElement);
  }

  calculateCoordinates() {
    const yAxisOffset = 4; // pixels
    const viewportWidth = document.documentElement.clientWidth;
    const wrapperBoundingRect = this.wrapperRef.current.getBoundingClientRect();
    const tooltipDimensions = this.tooltipRef.current.getDimensions();
    let x =
      (wrapperBoundingRect.left + wrapperBoundingRect.right) / 2 - tooltipDimensions.width / 2;
    let y = wrapperBoundingRect.top - tooltipDimensions.height - yAxisOffset;
    let placement = 'top';
    let position = null;

    if (x < 0) {
      x = wrapperBoundingRect.left;
      position = 'left';
    } else if (x + tooltipDimensions.width > viewportWidth) {
      x = wrapperBoundingRect.right - tooltipDimensions.width;
      position = 'right';
    }

    if (y < 0) {
      y = wrapperBoundingRect.bottom + yAxisOffset;
      placement = 'bottom';
    }

    this.setState({
      ...this.state,
      coordinates: { x, y },
      placement,
      position,
    });
  }

  showTooltip() {
    const { caption } = this.props;

    if (caption) {
      this.calculateCoordinates();
      this.setState({ isVisible: true });
    }
  }

  hideTooltip() {
    const { caption } = this.props;

    if (caption) {
      this.setState({ isVisible: false });
    }
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.hideTooltip();
    }
  }

  renderTooltip() {
    const { caption } = this.props;
    const { isVisible, coordinates, placement, position } = this.state;

    if (caption) {
      const style = {
        position: 'fixed',
        zIndex: 999,
        top: coordinates.y,
        left: coordinates.x,
        opacity: isVisible ? 1 : 0,
      };

      return ReactDOM.createPortal(
        <StatelessTooltip
          ref={this.tooltipRef}
          id={this.tooltipId}
          style={style}
          className="DraftTextEditTooltip"
          aria-hidden={!isVisible}
          placement={placement}
          position={position}>
          {caption}
        </StatelessTooltip>,
        this.mountElement
      );
    }

    return null;
  }

  render() {
    const { children, tag: Tag, className, style } = this.props;
    const wrapperClassName = classNames('DraftTextEditTooltipWrapper', className);

    return (
      <Tag
        ref={this.wrapperRef}
        style={style}
        className={wrapperClassName}
        aria-describedby={this.tooltipId}
        onMouseOver={this.showTooltip}
        onFocus={this.showTooltip}
        onMouseOut={this.hideTooltip}
        onBlur={this.hideTooltip}
        onKeyDown={this.handleKeyDown}>
        {Children.only(children)}
        {this.renderTooltip()}
      </Tag>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string,
  caption: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};
Tooltip.defaultProps = {
  tag: 'div',
  caption: '',
  className: '',
  style: {},
};

export default Tooltip;
