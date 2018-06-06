import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({ children }) {
  return <button className="Button">{children}</button>;
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
