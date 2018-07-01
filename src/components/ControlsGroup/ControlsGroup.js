import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ControlsGroup.css';

function ControlsGroup({ children, className, style }) {
  const classes = classNames('DraftTextEditControlsGroup', className);

  return (
    <ul className={classes} style={style}>
      {Children.map(children, control => (
        <li className="DraftTextEditControlsGroup-Control">{control}</li>
      ))}
    </ul>
  );
}

ControlsGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
};
ControlsGroup.defaultProps = {
  className: '',
  style: {},
};

export default ControlsGroup;
