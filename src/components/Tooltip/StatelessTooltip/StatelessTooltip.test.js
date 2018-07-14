import React from 'react';
import { shallow, mount } from 'enzyme';
import StatelessTooltip from './StatelessTooltip';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<StatelessTooltip {...props}>Tooltip</StatelessTooltip>);
}

describe('<StatelessTooltip /> component', () => {
  it('should renders without errors', () => {
    const statelessTooltip = renderComponent({ id: 'test' });

    expect(statelessTooltip.text()).toBe('Tooltip');
    expect(statelessTooltip.find('.DraftTextEditStatelessTooltip').props().id).toBe('test');
    expect(
      statelessTooltip.hasClass('DraftTextEditStatelessTooltip_placement_bottom')
    ).toBeTruthy();
  });

  it('should renders with unique id if id prop is not given', () => {
    const statelessTooltip = renderComponent();

    expect(statelessTooltip.find('.DraftTextEditStatelessTooltip').props().id).toEqual(
      expect.stringMatching(/^tooltip-[A-Za-z0-9_-]+$/)
    );
  });

  it('should add a class with modifier for dark mode', () => {
    const statelessTooltip = renderComponent({ darkMode: true });

    expect(statelessTooltip.hasClass('DraftTextEditStatelessTooltip_darkMode')).toBeTruthy();
  });

  it('should add a class with modifier for position', () => {
    const statelessTooltip = renderComponent({ position: 'right' });

    expect(statelessTooltip.hasClass('DraftTextEditStatelessTooltip_position_right')).toBeTruthy();
  });

  it('should returns tooltip dimensions', () => {
    const statelessTooltip = renderComponent({}, mount);

    expect(statelessTooltip.instance().getDimensions()).toEqual({ width: 0, height: 0 });
  });
});
