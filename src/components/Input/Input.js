/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle';
import classNames from 'classnames';
import { FontAwesomeIconPropType } from '../../constants/propTypes';
import './Input.css';

class Input extends Component {
  static propTypes = {
    id: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    className: PropTypes.string,
    type: PropTypes.oneOf([
      'email',
      'date',
      'datetime-local',
      'month',
      'number',
      'password',
      'search',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ]),
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    icon: FontAwesomeIconPropType,
    shouldShowClearButton: PropTypes.bool,
    defaultValue: PropTypes.string,
    // eslint-disable-next-line
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    id: '',
    className: '',
    style: {},
    placeholder: '',
    type: 'text',
    disabled: false,
    size: 'medium',
    icon: null,
    shouldShowClearButton: false,
    defaultValue: '',
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
  };

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      hasFocus: false,
      value: props.defaultValue,
    };
  }

  getState = () => ({ ...this.state, ...pick(this.props, ['value']) });

  handleClick = () => {
    this.inputRef.current.focus();
  };

  handleClearButtonClick = event => {
    event.preventDefault();

    const { onChange } = this.props;

    this.setState({ value: '' });
    onChange('');
  };

  handleChange = event => {
    const { onChange } = this.props;
    const {
      target: { value },
    } = event;

    this.setState({ value });
    onChange(value);
  };

  handleFocus = event => {
    const { onFocus } = this.props;

    this.setState({ hasFocus: true });
    onFocus(event);
  };

  handleBlur = event => {
    const { onBlur } = this.props;

    this.setState({ hasFocus: false });
    onBlur(event);
  };

  render() {
    const {
      id,
      style,
      className,
      type,
      disabled,
      placeholder,
      size,
      icon,
      shouldShowClearButton,
    } = this.props;
    const { hasFocus, value } = this.getState();
    const inputClassName = classNames(
      'DraftTextEditInput',
      `DraftTextEditInput_size_${size}`,
      disabled && 'DraftTextEditInput_disabled',
      hasFocus && 'DraftTextEditInput_hasFocus',
      className
    );

    return (
      <div style={style} className={inputClassName} onClick={this.handleClick}>
        {icon && (
          <FontAwesomeIcon className="DraftTextEditInput-Icon" role="presentation" icon={icon} />
        )}
        <input
          id={id}
          ref={this.inputRef}
          className="DraftTextEditInput-DOMInput"
          type={type}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {shouldShowClearButton && (
          <button
            className="DraftTextEditInput-ClearButton"
            disabled={disabled}
            onClick={this.handleClearButtonClick}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        )}
      </div>
    );
  }
}

export default Input;
