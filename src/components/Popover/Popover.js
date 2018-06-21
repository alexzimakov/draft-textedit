import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Popover.css';

function Popover({ children, className, style, position }) {
  const classes = classNames(
    'DraftTextEditPopover',
    `DraftTextEditPopover_${position}`,
    className
  );

  return (
    <div className={classes} style={style}>
      <div className="DraftTextEditPopover-Layout">{children}</div>
    </div>
  );
}

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  position: PropTypes.oneOf(['left', 'right', 'center']),
};
Popover.defaultProps = {
  className: '',
  style: {},
  position: 'center',
};

export default Popover;
