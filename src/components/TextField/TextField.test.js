import React from 'react';
import { shallow, mount } from 'enzyme';
import { faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import TextField from './TextField';

function renderComponent(props = {}, mountFn = mount) {
  return mountFn(<TextField {...props} />);
}

describe('<TextField /> component', () => {
  it('should render with necessary elements', () => {
    const textField = renderComponent({}, shallow);

    expect(textField.find('styled__InputContainer')).toHaveLength(1);
    expect(textField.find('styled__Input')).toHaveLength(1);
  });

  it('should render with leading icon', () => {
    const textField = renderComponent({ leadingIcon: faSearch }, shallow);

    expect(textField.find('styled__LeadingIcon')).toHaveLength(1);
  });

  it('should render with trailing icon', () => {
    const textField = renderComponent({ trailingIcon: faEye }, shallow);

    expect(textField.find('styled__TrailingIcon')).toHaveLength(1);
  });

  it('should not throw an error when set focus using DOM API and an input reference is null', () => {
    const textField = renderComponent({}, shallow);

    expect(textField.instance().focus).not.toThrow();
  });

  it('should set focus using DOM API', () => {
    const textField = renderComponent();
    jest.spyOn(textField.instance().inputRef.current, 'focus');

    textField.instance().focus();

    expect(textField.instance().inputRef.current.focus).toHaveBeenCalled();
  });

  it('should set focus when click on `InputContainer`', () => {
    const textField = renderComponent();

    jest.spyOn(textField.instance().inputRef.current, 'focus');
    textField
      .find('styled__InputContainer')
      .props()
      .onClick();
  });

  it('should not throw an error when unset focus using DOM API and an input reference is null', () => {
    const textField = renderComponent({}, shallow);

    expect(textField.instance().blur).not.toThrow();
  });

  it('should unset focus using DOM API', () => {
    const textField = renderComponent();
    jest.spyOn(textField.instance().inputRef.current, 'blur');

    textField.instance().blur();

    expect(textField.instance().inputRef.current.blur).toHaveBeenCalled();
  });

  it('should call `onChange` callback', () => {
    const onChange = jest.fn();
    const textField = renderComponent({ onChange });
    const event = { currentTarget: textField.instance().inputRef.current };

    textField
      .find('styled__Input')
      .props()
      .onChange(event);

    expect(onChange).toHaveBeenCalledWith(event);
  });

  it('should call `onFocus` callback and update state', () => {
    const onFocus = jest.fn();
    const textField = renderComponent({ onFocus });
    const event = { currentTarget: textField.instance().inputRef.current };

    textField
      .find('styled__Input')
      .props()
      .onFocus(event);

    expect(textField.state().isFocused).toBeTruthy();
    expect(onFocus).toHaveBeenCalledWith(event);
  });

  it('should call `onBlur` callback and update state', () => {
    const onBlur = jest.fn();
    const textField = renderComponent({ onBlur });
    const event = { currentTarget: textField.instance().inputRef.current };

    textField
      .find('styled__Input')
      .props()
      .onBlur(event);

    expect(textField.state().isFocused).toBeFalsy();
    expect(onBlur).toHaveBeenCalledWith(event);
  });

  it('should update value if props are changed', () => {
    const textField = renderComponent();

    textField.setProps({ value: 'abc' });

    expect(textField.state().value).toBe('abc');
  });
});
