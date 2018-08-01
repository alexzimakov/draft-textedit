import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import './Popover.css';

class Popover extends Component {
  static propTypes = {
    targetRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isSticky: PropTypes.bool,
    hasArrow: PropTypes.bool,
    offsetY: PropTypes.number,
    defaultPlacementY: PropTypes.oneOf(['top', 'bottom']),
    defaultPlacementX: PropTypes.oneOf(['left', 'right']),
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    onBackdropMouseDown: PropTypes.func,
    onEscapeKeyDown: PropTypes.func,
  };

  static defaultProps = {
    isSticky: false,
    hasArrow: true,
    offsetY: 4,
    defaultPlacementY: 'bottom',
    defaultPlacementX: null,
    id: '',
    className: '',
    style: {},
    onBackdropMouseDown: () => {},
    onEscapeKeyDown: () => {},
  };

  constructor(props) {
    super(props);
    this.animationFrame = null;
    this.popoverRef = React.createRef();
    this.mountElement = document.createElement('div');
    this.mountElement.id = `popover-root-${shortId.generate()}`;
    this.id = props.id || `popover-${shortId.generate()}`;
    this.state = {
      coordinates: { x: 0, y: 0 },
      placementX: props.defaultPlacementX,
      placementY: props.defaultPlacementY,
    };
  }

  componentDidMount() {
    document.body.appendChild(this.mountElement);
    window.addEventListener('resize', this.handleWindowResize);
    document.addEventListener('keydown', this.handleEscapeKeyDown);
  }

  componentDidUpdate(prevProps) {
    const { isOpen, isSticky } = this.props;
    const shouldRecalculateCoordinatesAndPlacement =
      prevProps.isOpen !== isOpen || prevProps.isSticky !== isSticky;

    if (shouldRecalculateCoordinatesAndPlacement) {
      this.calculateCoordinatesAndPlacement();
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.mountElement);
    window.removeEventListener('resize', this.handleWindowResize);
    document.removeEventListener('keydown', this.handleEscapeKeyDown);
  }

  calculateBaseYCoordinate = (targetBoundingRect, popoverBoundingRect) => {
    const { offsetY, defaultPlacementY } = this.props;
    let y = 0;

    /*
     * ^ Y
     * |
     * |  ___________________
     * | |                   |
     * | |      Popover      |
     * | |___________________|
     * |        ______
     * |       |      |
     * |       |Target|
     * |       |______|
     * |
     */
    if (defaultPlacementY === 'top') {
      y = targetBoundingRect.top - popoverBoundingRect.height - offsetY;
    }

    /*
     * ^ Y
     * |
     * |        ______
     * |       |      |
     * |       |Target|
     * |       |______|
     * |  ___________________
     * | |                   |
     * | |      Popover      |
     * | |___________________|
     * |
     */
    if (defaultPlacementY === 'bottom') {
      y = targetBoundingRect.bottom + offsetY;
    }

    return y;
  };

  calculateBaseXCoordinate = (targetBoundingRect, popoverBoundingRect) => {
    const { defaultPlacementX } = this.props;
    let x = 0;

    /*
     *  ___________________
     * |                   |
     * |      Popover      |
     * |___________________|
     *        ______
     *       |      |
     *       |Target|
     *       |______|
     *
     * -----------------------> X
     */
    if (!defaultPlacementX) {
      x = (targetBoundingRect.left + targetBoundingRect.right) / 2 - popoverBoundingRect.width / 2;
    }

    /*
     *  ___________________
     * |                   |
     * |      Popover      |
     * |___________________|
     *  ______
     * |      |
     * |Target|
     * |______|
     *
     * -----------------------> X
     */
    if (defaultPlacementX === 'left') {
      x = targetBoundingRect.left;
    }

    /*
     *  ___________________
     * |                   |
     * |      Popover      |
     * |___________________|
     *               ______
     *              |      |
     *              |Target|
     *              |______|
     *
     * -----------------------> X
     */
    if (defaultPlacementX === 'right') {
      x = targetBoundingRect.right - popoverBoundingRect.width;
    }

    return x;
  };

  calculateCoordinatesAndPlacement = () => {
    const { targetRef, isSticky, offsetY, defaultPlacementY, defaultPlacementX } = this.props;
    const { clientWidth: viewportWidth, clientHeight: viewportHeight } = document.documentElement;
    const targetBoundingRect = targetRef.current.getBoundingClientRect();
    const popoverBoundingRect = this.popoverRef.current.getBoundingClientRect();
    const scrollTop = isSticky ? 0 : window.pageYOffset;
    let x = this.calculateBaseXCoordinate(targetBoundingRect, popoverBoundingRect);
    let y = this.calculateBaseYCoordinate(targetBoundingRect, popoverBoundingRect);
    let placementY = defaultPlacementY;
    let placementX = defaultPlacementX;

    if (x < 0) {
      x = targetBoundingRect.left;
      placementX = 'left';
    } else if (x + popoverBoundingRect.width > viewportWidth) {
      x = targetBoundingRect.right - popoverBoundingRect.width;
      placementX = 'right';
    }

    if (y + popoverBoundingRect.height > viewportHeight) {
      y = targetBoundingRect.top - popoverBoundingRect.height - offsetY;
      placementY = 'top';
    } else if (y < 0) {
      y = targetBoundingRect.bottom + offsetY;
      placementY = 'bottom';
    }

    this.setState({
      ...this.state,
      coordinates: { x: Math.round(x), y: Math.round(y + scrollTop) },
      placementY,
      placementX,
    });
  };

  handleWindowResize = () => {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(this.calculateCoordinatesAndPlacement);
  };

  handleBackdropMouseDown = event => {
    const { onBackdropMouseDown } = this.props;

    event.preventDefault();
    onBackdropMouseDown(event);
  };

  handleEscapeKeyDown = event => {
    const { isOpen, onEscapeKeyDown } = this.props;

    if (isOpen && event.key === 'Escape') {
      event.preventDefault();
      onEscapeKeyDown(event);
    }
  };

  render() {
    const { children, isOpen, isSticky, hasArrow, className, style } = this.props;
    const {
      coordinates: { x, y },
      placementY,
      placementX,
    } = this.state;
    const popoverClasses = classNames(
      'DraftTextEditPopover',
      hasArrow && `DraftTextEditPopover_hasArrow`,
      placementY && `DraftTextEditPopover_placementY_${placementY}`,
      placementX && `DraftTextEditPopover_placementX_${placementX}`,
      className
    );
    const backdropStyle = {
      pointerEvents: isOpen ? 'all' : 'none',
      opacity: isOpen ? 1 : 0,
    };
    const popoverStyle = {
      position: isSticky ? 'fixed' : 'absolute',
      transform: `translate3d(${x}px, ${y}px, 0)`,
      pointerEvents: isOpen ? 'all' : 'none',
      opacity: isOpen ? 1 : 0,
      ...style,
    };

    return ReactDOM.createPortal(
      <div>
        <div
          style={backdropStyle}
          className="DraftTextEditPopoverBackdrop"
          role="presentation"
          onMouseDown={this.handleBackdropMouseDown}
        />
        <div
          ref={this.popoverRef}
          id={this.id}
          style={popoverStyle}
          className={classNames(popoverClasses)}
          role="tooltip">
          <div className="DraftTextEditPopover-InnerWrapper">
            <div className="DraftTextEditPopover-Body">{children}</div>
            {hasArrow && <span className="DraftTextEditPopover-Arrow" aria-hidden />}
          </div>
        </div>
      </div>,
      this.mountElement
    );
  }
}

export default Popover;
