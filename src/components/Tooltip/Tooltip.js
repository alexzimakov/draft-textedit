import React from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import classNames from 'classnames';
import './Tooltip.css';

function Tooltip({
  children,
  id,
  className,
  style,
  darkMode,
  positionX,
  positionY,
}) {
  const classes = classNames(
    'DraftTextEditTooltip',
    darkMode && `DraftTextEditTooltip_darkMode`,
    positionX && `DraftTextEditTooltip_positionX_${positionX}`,
    positionY && `DraftTextEditTooltip_positionY_${positionY}`,
    className
  );

  return (
    <figure
      id={id || `tooltip-${shortId.generate()}`}
      className={classes}
      style={style}
      role="tooltip">
      <figcaption className="DraftTextEditTooltip-Body">
        <span className="DraftTextEditTooltip-Title">{children}</span>
      </figcaption>
    </figure>
  );
}

Tooltip.propTypes = {
  children: PropTypes.string.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  darkMode: PropTypes.bool,
  positionX: PropTypes.oneOf(['left', 'right']),
  positionY: PropTypes.oneOf(['top', 'bottom']),
};
Tooltip.defaultProps = {
  id: null,
  className: '',
  style: {},
  darkMode: false,
  positionY: 'bottom',
  positionX: null,
};

export default Tooltip;
