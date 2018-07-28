import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import './Popover.css';

class Popover extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    hasArrow: PropTypes.bool,
    placementX: PropTypes.oneOf(['left', 'right']),
    placementY: PropTypes.oneOf(['top', 'bottom']),
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  };

  static defaultProps = {
    hasArrow: true,
    placementX: null,
    placementY: null,
    id: '',
    className: '',
    style: {},
  };

  constructor(props) {
    super(props);
    this.id = props.id || `popover-${shortId.generate()}`;
    this.popoverRef = React.createRef();
    this.arrowRef = React.createRef();
  }

  getBoundaries = () => this.popoverRef.current.getBoundingClientRect();

  render() {
    const { children, hasArrow, placementY, placementX, className, style } = this.props;
    const popoverClasses = classNames(
      'DraftTextEditPopover',
      hasArrow && `DraftTextEditPopover_hasArrow`,
      placementY && `DraftTextEditPopover_placementY_${placementY}`,
      placementX && `DraftTextEditPopover_placementX_${placementX}`,
      className
    );

    return (
      <div
        ref={this.popoverRef}
        id={this.id}
        style={style}
        className={classNames(popoverClasses)}
        role="tooltip">
        <div className="DraftTextEditPopover-InnerWrapper">
          <div className="DraftTextEditPopover-Body">{children}</div>
          {hasArrow && (
            <span ref={this.arrowRef} className="DraftTextEditPopover-Arrow" aria-hidden />
          )}
        </div>
      </div>
    );
  }
}

export default Popover;
