import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

function renderComponent({ ...otherProps } = {}, mountFn = shallow) {
  return mountFn(<Button {...otherProps}>Button</Button>);
}

describe('<Button /> component', () => {
  it('should render without errors', () => {
    const button = renderComponent();

    expect(button.text()).toBe('Button');
  });

  it('should renders with custom style', () => {
    const button = renderComponent({ style: { color: 'red' } });

    expect(button.html().includes('color:red')).toBeTruthy();
  });

  it('should renders with custom class', () => {
    const button = renderComponent({ className: 'btn-test' });

    expect(button.hasClass('btn-test')).toBeTruthy();
  });

  it('should add classes for different variants', () => {
    const button = renderComponent({ variant: 'outlined' });

    expect(
      button.hasClass('DraftTextEditButton_variant_outlined')
    ).toBeTruthy();

    button.setProps({ variant: 'text' });
    expect(button.hasClass('DraftTextEditButton_variant_text')).toBeTruthy();
  });

  it('should add class for a primary button', () => {
    const button = renderComponent({ primary: true });

    expect(button.hasClass('DraftTextEditButton_primary')).toBeTruthy();
  });

  it('should call onPress callback', () => {
    const onPressStub = jest.fn();
    const eventStub = { preventDefault: jest.fn() };
    const button = renderComponent({ onPress: onPressStub });

    button.simulate('mousedown', eventStub);
    expect(eventStub.preventDefault).toHaveBeenCalled();
    expect(onPressStub).toHaveBeenCalledWith(eventStub);
  });

  it('should call onPress callback when `Enter` or `Space` keys were pressed', () => {
    const onPressStub = jest.fn();
    const eventStub = { preventDefault: jest.fn() };
    const button = renderComponent({ onPress: onPressStub });

    button.simulate('keydown', { ...eventStub, key: 'Enter' });
    button.simulate('keydown', { ...eventStub, key: ' ' });
    expect(onPressStub).toHaveBeenCalledTimes(2);
    expect(eventStub.preventDefault).toHaveBeenCalledTimes(2);
  });

  it('should not throw error is onPress callback is not a given', () => {
    const eventStub = { preventDefault: jest.fn() };
    const button = renderComponent();

    button.simulate('mousedown', eventStub);
    expect(eventStub.preventDefault).toHaveBeenCalled();
  });

  it('should not call onPress callback', () => {
    const onPressStub = jest.fn();
    const button = renderComponent({ onPress: onPressStub });

    button.simulate('keydown', { preventDefault: jest.fn(), key: 'Tab' });
    expect(onPressStub).not.toHaveBeenCalled();
  });
});
