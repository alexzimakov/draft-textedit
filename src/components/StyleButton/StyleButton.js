import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../Button';
import Tooltip from '../Tooltip';
import './StyleButton.css';

function StyleButton({ children, className, style, disabled, title, active, onPress }) {
  const buttonClassName = classNames(
    'DraftTextEditStyleButton-Button',
    active && 'DraftTextEditStyleButton-Button_active',
    className
  );

  return (
    <Tooltip
      className="DraftTextEditStyleButton"
      style={style}
      caption={disabled ? '' : title}
      tag="span">
      <Button className={buttonClassName} disabled={disabled} variant="text" onPress={onPress}>
        {children}
      </Button>
    </Tooltip>
  );
}

StyleButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
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
