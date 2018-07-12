import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import * as blockTypes from '../../../constants/blockTypes';
import './Option.css';

class Option extends Component {
  constructor(props) {
    super(props);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
  }

  handleOnMouseDown(event) {
    event.preventDefault();
    const { value, onPress } = this.props;
    onPress(value);
  }

  render() {
    const { className, style, value, label, selected } = this.props;
    const classes = classNames(
      'DraftTextEditBlockTypeOption',
      `DraftTextEditBlockTypeOption_style_${value}`,
      className
    );

    return (
      <li
        className={classes}
        style={style}
        role="option"
        aria-selected={selected}
        onMouseDown={this.handleOnMouseDown}>
        {selected && (
          <FontAwesomeIcon
            className="DraftTextEditBlockTypeOption-SelectedIcon"
            icon={faCheck}
            aria-hidden
          />
        )}
        {label || value}
      </li>
    );
  }
}

Option.propTypes = {
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  value: PropTypes.oneOf(Object.values(blockTypes)).isRequired,
  label: PropTypes.string,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
};
Option.defaultProps = {
  className: '',
  style: {},
  label: '',
  selected: false,
  onPress: () => {},
};

export default Option;
