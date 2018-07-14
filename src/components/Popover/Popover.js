import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import StatelessPopover from './StatelessPopover';
import './Popover.css';

const DEFAULT_PLACEMENT_Y = 'bottom';

class Popover extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    positionFixed: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    positionFixed: false,
    className: '',
    style: {},
    onOpen: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);
    this.popoverRef = React.createRef();
    this.wrapperRef = React.createRef();
    this.popoverId = `popover-${shortId.generate()}`;
    this.mountElement = document.createElement('div');
    this.mountElement.id = `popover-root-${shortId.generate()}`;
    this.state = {
      isOpen: false,
      coordinates: { x: 0, y: 0 },
      placementY: DEFAULT_PLACEMENT_Y,
      placementX: null,
    };
  }

  componentDidMount() {
    document.body.appendChild(this.mountElement);
    window.addEventListener('resize', this.calculateCoordinatesAndPlacement);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.positionFixed !== this.props.positionFixed) {
      this.calculateCoordinatesAndPlacement();
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.mountElement);
    window.removeEventListener('resize', this.calculateCoordinatesAndPlacement);
  }

  calculateCoordinatesAndPlacement = () => {
    const { positionFixed } = this.props;
    const offsetY = 4;
    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = document.documentElement;
    const scrollTop = positionFixed ? 0 : window.pageYOffset || document.documentElement.scrollTop;
    const {
      top: referenceOffsetTop,
      right: referenceOffsetRight,
      bottom: referenceOffsetBottom,
      left: referenceOffsetLeft,
    } = this.wrapperRef.current.getBoundingClientRect();
    const { width: popoverWidth, height: popoverHeight } = this.popoverRef.current.getBoundaries();
    let x = (referenceOffsetLeft + referenceOffsetRight) / 2 - popoverWidth / 2;
    let y = referenceOffsetBottom + offsetY;
    let placementY = DEFAULT_PLACEMENT_Y;
    let placementX = null;

    if (x < 0) {
      x = referenceOffsetLeft;
      placementX = 'left';
    } else if (x + popoverWidth > viewportWidth) {
      x = referenceOffsetRight - popoverWidth;
      placementX = 'right';
    }

    if (y + popoverHeight > viewportHeight) {
      y = referenceOffsetTop - popoverHeight - offsetY;
      placementY = 'top';
    }

    this.setState({
      ...this.state,
      coordinates: { x, y: y + scrollTop },
      placementY,
      placementX,
    });
  };

  openPopover = () => {
    const { onOpen } = this.props;

    this.calculateCoordinatesAndPlacement();
    this.setState({ isOpen: true });
    onOpen();
  };

  closePopover = () => {
    const { onClose } = this.props;

    this.setState({ isOpen: false });
    onClose();
  };

  handleKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePopover();
    }
  };

  handleTargetMouseDown = event => {
    event.preventDefault();
    this.openPopover();
  };

  handleBackdropMouseDown = event => {
    event.preventDefault();
    this.closePopover();
  };

  renderPopover = () => {
    const { content, positionFixed } = this.props;
    const {
      isOpen,
      coordinates: { x, y },
      placementY,
      placementX,
    } = this.state;
    const popoverWrapperStyle = {
      pointerEvents: isOpen ? 'all' : 'none',
      opacity: isOpen ? 1 : 0,
    };
    const popoverStyle = {
      position: positionFixed ? 'fixed' : 'absolute',
      zIndex: 9999,
      top: 0,
      left: 0,
      transform: `translate3d(${x}px, ${y}px, 0)`,
    };

    return ReactDOM.createPortal(
      <div
        style={popoverWrapperStyle}
        className="DraftTextEditPopoverWrapper"
        aria-hidden={!isOpen}>
        <div
          className="DraftTextEditPopoverWrapper-Backdrop"
          role="presentation"
          onMouseDown={this.handleBackdropMouseDown}
        />
        <StatelessPopover
          ref={this.popoverRef}
          id={this.popoverId}
          style={popoverStyle}
          placementY={placementY}
          placementX={placementX}>
          {content}
        </StatelessPopover>
      </div>,
      this.mountElement
    );
  };

  render() {
    const { children, style, className } = this.props;
    const { isOpen } = this.state;
    const popoverClassName = classNames('DraftTextEditPopover', className);

    return (
      <div style={style} className={popoverClassName}>
        <div
          ref={this.wrapperRef}
          className="DraftTextEditPopover-Switcher"
          role="switch"
          tabIndex={-1}
          aria-checked={isOpen}
          aria-describedby={this.popoverId}
          onFocus={this.openPopover}
          onBlur={this.closePopover}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleTargetMouseDown}>
          {children}
        </div>
        {this.renderPopover()}
      </div>
    );
  }
}

export default Popover;
