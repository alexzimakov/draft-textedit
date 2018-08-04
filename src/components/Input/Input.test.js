import React from 'react';
import { shallow, mount } from 'enzyme';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faLink from '@fortawesome/fontawesome-free-solid/faLink';
import Input from './Input';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<Input {...props} />);
}

describe('<Input /> component', () => {
  it('should renders with necessary elements', () => {
    const input = renderComponent();

    expect(input.find('.DraftTextEditInput')).toHaveLength(1);
    expect(input.find('.DraftTextEditInput-DOMInput')).toHaveLength(1);
  });

  it('should renders with icon', () => {
    const input = renderComponent({ icon: faLink });

    expect(
      input.contains(
        <FontAwesomeIcon className="DraftTextEditInput-Icon" icon={faLink} role="presentation" />
      )
    ).toBeTruthy();
  });

  it('should renders with clear button', () => {
    const input = renderComponent({ shouldShowClearButton: true });

    expect(input.find('.DraftTextEditInput-ClearButton')).toBeTruthy();
  });

  it('should adds class when input is disabled', () => {
    const input = renderComponent({ disabled: true });

    expect(input.hasClass('DraftTextEditInput_disabled')).toBeTruthy();
  });

  it('should manages focus', () => {
    const input = renderComponent({}, mount);

    jest.spyOn(input.instance().inputRef.current, 'focus');
    input.find('.DraftTextEditInput').simulate('click');
    expect(input.instance().inputRef.current.focus).toHaveBeenCalled();
    expect(input.hasClass('DraftTextEditInput_hasFocus'));
  });

  it('should handles input focus and blur events', () => {
    const input = renderComponent();

    input
      .find('.DraftTextEditInput-DOMInput')
      .props()
      .onFocus();
    input.update();
    expect(input.hasClass('DraftTextEditInput_hasFocus')).toBeTruthy();

    input
      .find('.DraftTextEditInput-DOMInput')
      .props()
      .onBlur();
    input.update();
    expect(input.hasClass('DraftTextEditInput_hasFocus')).toBeFalsy();
  });

  it('should not throws an error if `onChange` property is not given', () => {
    const input = renderComponent();

    expect(() => {
      input.instance().props.onChange();
    }).not.toThrow();
  });

  it('should calls `onChange` callback', () => {
    const onChange = jest.fn();
    const event = { target: { value: 'test' } };
    const input = renderComponent({ onChange });

    input.find('.DraftTextEditInput-DOMInput').simulate('change', event);
    expect(onChange).toHaveBeenCalledWith(event.target.value);
  });

  it('should calls `onChange` callback with empty string', () => {
    const onChange = jest.fn();
    const event = { target: { value: 'test' }, preventDefault: jest.fn() };
    const input = renderComponent({ shouldShowClearButton: true, onChange });

    input.find('.DraftTextEditInput-ClearButton').simulate('click', event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('should not throws an error if `onFocus` property is not given', () => {
    const input = renderComponent();

    expect(() => {
      input.instance().props.onFocus();
    }).not.toThrow();
  });

  it('should calls `onFocus` callback', () => {
    const onFocus = jest.fn();
    const event = { preventDefault: jest.fn() };
    const input = renderComponent({ onFocus });

    input.find('.DraftTextEditInput-DOMInput').simulate('focus', event);
    expect(onFocus).toHaveBeenCalledWith(event);
  });

  it('should not throws an error if `onBlur` property is not given', () => {
    const input = renderComponent();

    expect(() => {
      input.instance().props.onBlur();
    }).not.toThrow();
  });

  it('should calls `onBlur` callback', () => {
    const onBlur = jest.fn();
    const event = { preventDefault: jest.fn() };
    const input = renderComponent({ onBlur });

    input.find('.DraftTextEditInput-DOMInput').simulate('blur', event);
    expect(onBlur).toHaveBeenCalledWith(event);
  });
});
