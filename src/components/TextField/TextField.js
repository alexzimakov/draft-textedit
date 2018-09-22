// @flow

import * as React from 'react';
import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import * as types from '../../constants/types';
import { InputContainer, Input, LeadingIcon, TrailingIcon } from './styled';

type Props = {
  size: 'small' | 'medium' | 'large',
  leadingIcon?: types.FaIcon,
  trailingIcon?: types.FaIcon,
  defaultValue: string,
  value?: string,
  style?: types.Style,
  type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url',
  disabled?: boolean,
  onChange?: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  onFocus?: (event: SyntheticFocusEvent<HTMLInputElement>) => void,
  onBlur?: (event: SyntheticFocusEvent<HTMLInputElement>) => void,
};
type State = {
  isFocused: boolean,
  value: string,
};

class TextField extends React.Component<Props, State> {
  inputRef: { current: ?HTMLInputElement };

  static defaultProps: Props = {
    size: 'medium',
    defaultValue: '',
    style: {},
    type: 'text',
    disabled: false,
  };

  static getDerivedStateFromProps(props: Props) {
    if ('value' in props) {
      return { value: props.value };
    }

    return null;
  }

  constructor(props: Props, context: any) {
    super(props, context);
    this.inputRef = React.createRef();
    this.state = {
      isFocused: false,
      value: props.defaultValue,
    };
  }

  focus = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  blur = () => {
    if (this.inputRef.current) {
      this.inputRef.current.blur();
    }
  };

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    this.setState({ value: event.currentTarget.value });
    isFunction(onChange) && onChange(event);
  };

  handleFocus = (event: SyntheticFocusEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;

    this.setState({ isFocused: true });
    isFunction(onFocus) && onFocus(event);
  };

  handleBlur = (event: SyntheticFocusEvent<HTMLInputElement>) => {
    const { onBlur } = this.props;

    this.setState({ isFocused: false });
    isFunction(onBlur) && onBlur(event);
  };

  render() {
    const { size, leadingIcon, trailingIcon, style, type, disabled, ...otherProps } = this.props;
    const { isFocused, value } = this.state;

    return (
      <InputContainer
        style={style}
        size={size}
        isDisabled={disabled}
        isFocused={isFocused}
        onClick={this.focus}>
        {leadingIcon && <LeadingIcon icon={leadingIcon} />}
        <Input
          {...pick(otherProps, [
            'accessKey',
            'autocomplete',
            'autofocus',
            'form',
            'formAction',
            'formMethod',
            'formNoValidate',
            'formTarget',
            'id',
            'maxLength',
            'name',
            'pattern',
            'placeholder',
            'readonly',
            'required',
            'tabIndex',
          ])}
          innerRef={this.inputRef}
          type={type}
          disabled={disabled}
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {trailingIcon && <TrailingIcon icon={trailingIcon} />}
      </InputContainer>
    );
  }
}

export default TextField;
