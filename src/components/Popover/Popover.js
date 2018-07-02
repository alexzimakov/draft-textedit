import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Popover.css';

class Popover extends Component {
  constructor(props) {
    super(props);
    this.handleBodyMouseDown = this.handleBodyMouseDown.bind(this);
    this.popoverRef = React.createRef();
  }

  componentDidMount() {
    document.body.addEventListener('mousedown', this.handleBodyMouseDown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousedown', this.handleBodyMouseDown);
  }

  handleBodyMouseDown(event) {
    const { onPressOutside } = this.props;

    if (!this.popoverRef.current.contains(event.target)) {
      onPressOutside(event);
    }
  }

  render() {
    const { children, className, style, position } = this.props;
    const classes = classNames(
      'DraftTextEditPopover',
      position && `DraftTextEditPopover_position_${position}`,
      className
    );

    return (
      <div ref={this.popoverRef} className={classes} style={style}>
        <div className="DraftTextEditPopover-Body">
          <div className="DraftTextEditPopover-Content">{children}</div>
        </div>
      </div>
    );
  }
}

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  position: PropTypes.oneOf(['left', 'right']),
  onPressOutside: PropTypes.func,
};
Popover.defaultProps = {
  className: '',
  style: {},
  position: null,
  onPressOutside: () => {},
};

export default Popover;
