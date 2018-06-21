import React from 'react';
import { shallow } from 'enzyme';
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

  it('should renders with custom style', () => {
    const button = renderComponent({ style: { zIndex: 1 } });

    expect(button.html().includes('z-index:1')).toBeTruthy();
  });

  it('should renders with custom class', () => {
    const button = renderComponent({ className: 'popover-test' });

    expect(button.hasClass('popover-test')).toBeTruthy();
  });

  it('should renders with correct position', () => {
    const popover = renderComponent();

    expect(popover.hasClass('DraftTextEditPopover_center')).toBeTruthy();

    popover.setProps({ position: 'left' });
    expect(popover.hasClass('DraftTextEditPopover_left')).toBeTruthy();

    popover.setProps({ position: 'right' });
    expect(popover.hasClass('DraftTextEditPopover_right')).toBeTruthy();
  });
});
