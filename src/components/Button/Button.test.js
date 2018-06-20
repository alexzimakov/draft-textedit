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

  it('should call onClick callback', () => {
    const onClickStub = jest.fn();
    const eventStub = { preventDefault: jest.fn() };
    const button = renderComponent({ onClick: onClickStub });

    button.simulate('click', eventStub);
    expect(onClickStub).toHaveBeenCalledWith(eventStub);
  });

  it('should not call onClick callback', () => {
    const onClickStub = jest.fn();
    const styleButton = renderComponent({ onClick: onClickStub });

    styleButton.simulate('keydown', { preventDefault: jest.fn(), key: 'Tab' });
    expect(onClickStub).not.toHaveBeenCalled();
  });
});
