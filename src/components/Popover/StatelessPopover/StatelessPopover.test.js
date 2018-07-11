import React from 'react';
import { shallow, mount } from 'enzyme';
import StatelessPopover from './StatelessPopover';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(
    <StatelessPopover {...props}>
      <button>Show popover</button>
    </StatelessPopover>
  );
}

describe('<StatelessPopover /> component', () => {
  it('should renders with necessary components and children', () => {
    const statelessPopover = renderComponent();

    expect(statelessPopover.contains(<button>Show popover</button>)).toBeTruthy();
    expect(statelessPopover.find('.DraftTextEditStatelessPopover-InnerWrapper')).toHaveLength(1);
    expect(statelessPopover.find('.DraftTextEditStatelessPopover-Body')).toHaveLength(1);
  });

  it('should adds correct classes when `hasArrow`, `placementX` or `placementY` are given', () => {
    const statelessPopover = renderComponent({
      hasArrow: true,
      placementX: 'left',
      placementY: 'top',
    });

    expect(statelessPopover.hasClass('DraftTextEditStatelessPopover_hasArrow')).toBeTruthy();
    expect(statelessPopover.hasClass('DraftTextEditStatelessPopover_placementX_left')).toBeTruthy();
    expect(statelessPopover.hasClass('DraftTextEditStatelessPopover_placementY_top')).toBeTruthy();
  });

  it('should renders with default id if `id` is not given', () => {
    const statelessPopover = renderComponent();

    expect(statelessPopover.find('.DraftTextEditStatelessPopover').props().id).toEqual(
      expect.stringMatching(/^popover-[A-Za-z0-9_-]+$/)
    );
  });

  it('should returns boundaries of component', () => {
    const boundaries = {
      top: 10,
      right: 60,
      bottom: 30,
      left: 20,
      width: 40,
      height: 20,
      x: 20,
      y: 10,
    };
    const statelessPopover = renderComponent({}, mount);
    jest
      .spyOn(statelessPopover.instance().popoverRef.current, 'getBoundingClientRect')
      .mockReturnValue(boundaries);

    expect(statelessPopover.instance().getBoundaries()).toEqual(boundaries);
  });
});
