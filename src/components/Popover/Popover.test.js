import React from 'react';
import { shallow, mount } from 'enzyme';
import Popover from './Popover';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(
    <Popover {...props}>
      <h3>Popover test</h3>
    </Popover>
  );
}

describe('<Popover /> component', () => {
  it('should renders without errors', () => {
    const popover = renderComponent();

    expect(popover.find('h3').text()).toBe('Popover test');
  });

  it('should renders with correct position', () => {
    const popover = renderComponent();

    popover.setProps({ position: 'left' });
    expect(popover.hasClass('DraftTextEditPopover_position_left')).toBeTruthy();

    popover.setProps({ position: 'right' });
    expect(
      popover.hasClass('DraftTextEditPopover_position_right')
    ).toBeTruthy();
  });

  it('should adds `mousedown` event handler in `componentDidMount` lifecycle method', () => {
    jest.spyOn(document.body, 'addEventListener');

    const popover = renderComponent();
    const that = popover.instance();

    expect(document.body.addEventListener).toHaveBeenCalledWith(
      'mousedown',
      that.handleBodyMouseDown
    );
  });

  it('should removes `mousedown` event handler in `componentWillUnmount` lifecycle method', () => {
    jest.spyOn(document.body, 'removeEventListener');

    const popover = renderComponent();
    const that = popover.instance();

    popover.unmount();
    expect(document.body.removeEventListener).toHaveBeenCalledWith(
      'mousedown',
      that.handleBodyMouseDown
    );
  });

  it('should calls `onPressOutside` callback when click outside of popover', () => {
    const onPressOutside = jest.fn();
    const popover = renderComponent({ onPressOutside }, mount);
    const event = new MouseEvent('mousedown');
    const that = popover.instance();

    that.handleBodyMouseDown(event);
    expect(onPressOutside).toHaveBeenCalledWith(event);
  });

  it('should not calls `onPressOutside` callback when click inside of popover', () => {
    const onPressOutside = jest.fn();
    const popover = renderComponent({ onPressOutside }, mount);
    const event = new MouseEvent('mousedown');
    const that = popover.instance();

    Object.defineProperty(event, 'target', { value: that.popoverRef.current });
    that.handleBodyMouseDown(event);
    expect(onPressOutside).not.toHaveBeenCalled();
  });

  it('should not throws an error if `onPressOutside` property is not given', () => {
    const popover = renderComponent();

    expect(() => {
      popover.instance().props.onPressOutside();
    }).not.toThrow();
  });
});
