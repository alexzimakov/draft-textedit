import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from './Tooltip';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<Tooltip {...props}>Tooltip</Tooltip>);
}

describe('<Tooltip /> component', () => {
  it('should renders without errors', () => {
    const tooltip = renderComponent({ id: 'test' });

    expect(tooltip.text()).toBe('Tooltip');
    expect(tooltip.find('.DraftTextEditTooltip').props().id).toBe('test');
    expect(
      tooltip.hasClass('DraftTextEditTooltip_positionY_bottom')
    ).toBeTruthy();
  });

  it('should renders with unique id if id prop is not given', () => {
    const tooltip = renderComponent();

    expect(tooltip.find('.DraftTextEditTooltip').props().id).toEqual(
      expect.stringMatching(/^tooltip-[A-Za-z0-9_-]+$/)
    );
  });

  it('should add a class with modifier for dark mode', () => {
    const tooltip = renderComponent({ darkMode: true });

    expect(tooltip.hasClass('DraftTextEditTooltip_darkMode')).toBeTruthy();
  });

  it('should add a class with modifier for X position', () => {
    const tooltip = renderComponent({ positionX: 'right' });

    expect(
      tooltip.hasClass('DraftTextEditTooltip_positionX_right')
    ).toBeTruthy();
  });
});
