import React from 'react';
import { mount } from 'enzyme';
import Popover from './Popover';

function renderComponent(
  {
    isOpen = false,
    offsetY = 10,
    targetRef = { current: document.createElement('div') },
    ...otherProps
  } = {},
  mountFn = mount
) {
  return mountFn(
    <Popover targetRef={targetRef} isOpen={isOpen} offsetY={offsetY} {...otherProps}>
      <p>Popover content</p>
    </Popover>
  );
}

describe('<Popover /> component', () => {
  const targetEl = document.createElement('div');
  const targetRef = { current: targetEl };
  const pageYOffset = 100;
  const targetBoundingClientRect = {
    top: 500,
    right: 700,
    bottom: 540,
    left: 500,
    width: 100,
    height: 80,
  };
  const popoverBoundingClientRect = {
    top: 0,
    right: 400,
    bottom: 200,
    left: 0,
    width: 400,
    height: 200,
  };

  beforeAll(() => {
    Object.defineProperty(window, 'pageYOffset', { value: pageYOffset });
    Object.defineProperties(window.document.documentElement, {
      clientWidth: { value: 1440 },
      clientHeight: { value: 900 },
    });
    Object.defineProperty(targetEl, 'getBoundingClientRect', {
      writable: true,
      value() {
        return targetBoundingClientRect;
      },
    });
  });

  it('should renders with necessary components and children', () => {
    const popover = renderComponent({});

    expect(popover.contains(<p>Popover content</p>)).toBeTruthy();
    expect(popover.find('.DraftTextEditPopoverBackdrop')).toHaveLength(1);
    expect(popover.find('.DraftTextEditPopover')).toHaveLength(1);
    expect(popover.find('.DraftTextEditPopover-InnerWrapper')).toHaveLength(1);
    expect(popover.find('.DraftTextEditPopover-Body')).toHaveLength(1);
  });

  it('should renders with default id if `id` is not given', () => {
    const statelessPopover = renderComponent();

    expect(statelessPopover.find('.DraftTextEditPopover').props().id).toEqual(
      expect.stringMatching(/^popover-[A-Za-z0-9_-]+$/)
    );
  });

  it('should adds the DOM element for mounting on `componentDidMount` call', () => {
    const popover = renderComponent();

    expect(global.document.contains(popover.instance().mountElement)).toBeTruthy();
  });

  it('should removes the DOM element for mounting on `componentWillUnmount` call', () => {
    const popover = renderComponent();
    const { mountElement } = popover.instance();

    popover.unmount();
    expect(global.document.contains(mountElement)).toBeFalsy();
  });

  it('should adds resize eventListener on `componentDidMount` call', () => {
    jest.spyOn(global, 'addEventListener');
    const popover = renderComponent();

    expect(global.addEventListener).toHaveBeenCalledWith(
      'resize',
      popover.instance().handleWindowResize
    );
  });

  it('should removes resize eventListener on `componentWillUnmount` call', () => {
    jest.spyOn(global, 'removeEventListener');
    const popover = renderComponent();
    const { handleWindowResize } = popover.instance();

    popover.unmount();
    expect(global.removeEventListener).toHaveBeenCalledWith('resize', handleWindowResize);
  });

  it('should not throws an error if `onBackdropMouseDown` property is not given', () => {
    const popover = renderComponent();

    expect(() => {
      popover.instance().handleBackdropMouseDown({ preventDefault: jest.fn() });
    }).not.toThrow();
  });

  it('should calls `onBackdropMouseDown` callback', () => {
    const popover = renderComponent();
    const preventDefault = jest.fn();
    const onBackdropMouseDown = jest.fn();
    popover.setProps({ isOpen: true, onBackdropMouseDown });
    popover.update();
    popover.find('.DraftTextEditPopoverBackdrop').simulate('mousedown', { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(onBackdropMouseDown).toHaveBeenCalled();
  });

  it('should not throws an error if `onEscapeKeyDown` property is not given', () => {
    const popover = renderComponent();
    popover.setProps({ isOpen: true });
    popover.update();

    expect(() => {
      popover.instance().handleEscapeKeyDown({ preventDefault: jest.fn(), key: 'Escape' });
    }).not.toThrow();
  });

  it('should not call `onEscapeKeyDown` callback if `isOpen` property falsy', () => {
    const preventDefault = jest.fn();
    const onEscapeKeyDown = jest.fn();
    const popover = renderComponent({ onEscapeKeyDown });
    popover.instance().handleEscapeKeyDown({ preventDefault, key: 'Escape' });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(onEscapeKeyDown).not.toHaveBeenCalled();
  });

  it('should calls `onEscapeKeyDown` callback', () => {
    const preventDefault = jest.fn();
    const onEscapeKeyDown = jest.fn();
    const popover = renderComponent({ isOpen: true, onEscapeKeyDown });
    popover.instance().handleEscapeKeyDown({ preventDefault, key: 'Escape' });

    expect(preventDefault).toHaveBeenCalled();
    expect(onEscapeKeyDown).toHaveBeenCalled();
  });

  it('should cancel current animation frame', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockReturnValue('animationFrameId');
    jest.spyOn(window, 'cancelAnimationFrame');
    renderComponent({}, mount);

    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith('animationFrameId');
  });

  it('should recalculates coordinates and placement when user resize page', () => {
    const popover = renderComponent({ isOpen: true, targetRef });
    const X = Math.round(
      (targetBoundingClientRect.left + targetBoundingClientRect.right) / 2 -
        popoverBoundingClientRect.width / 2
    );
    const Y = Math.round(targetBoundingClientRect.bottom + popover.props().offsetY + pageYOffset);

    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());

    window.dispatchEvent(new Event('resize'));
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_bottom')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_right')
    ).toBeFalsy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_left')
    ).toBeFalsy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates if:
      - \`isSticky\` property set to \`true\`;
      - \`defaultPlacementX\` property does not set;
      - \`defaultPlacementY\` property set to "bottom";`, () => {
    const popover = renderComponent({ targetRef, isSticky: true });
    const X = Math.round(
      (targetBoundingClientRect.left + targetBoundingClientRect.right) / 2 -
        popoverBoundingClientRect.width / 2
    );
    const Y = Math.round(targetBoundingClientRect.bottom + popover.props().offsetY);

    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_bottom')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_right')
    ).toBeFalsy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_left')
    ).toBeFalsy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates if:
      - \`isSticky\` property set to \`false\`;
      - \`defaultPlacementX\` property does not set;
      - \`defaultPlacementY\` property set to "top";`, () => {
    const popover = renderComponent({ targetRef, defaultPlacementY: 'top' });
    const X = Math.round(
      (targetBoundingClientRect.left + targetBoundingClientRect.right) / 2 -
        popoverBoundingClientRect.width / 2
    );
    const Y = Math.round(
      targetBoundingClientRect.top -
        popoverBoundingClientRect.height -
        popover.props().offsetY +
        pageYOffset
    );

    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_top')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_right')
    ).toBeFalsy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_left')
    ).toBeFalsy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates if:
      - \`isSticky\` property set to \`false\`;
      - \`defaultPlacementX\` property set to "left";
      - \`defaultPlacementY\` property set to "bottom";`, () => {
    const popover = renderComponent({ targetRef, defaultPlacementX: 'left' });
    const X = Math.round(targetBoundingClientRect.left);
    const Y = Math.round(targetBoundingClientRect.bottom + popover.props().offsetY + pageYOffset);

    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_bottom')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_left')
    ).toBeTruthy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates and placement if:
      - \`isSticky\` property set to \`false\`;
      - \`defaultPlacementX\` property set to "right";
      - \`defaultPlacementY\` property set to "bottom";`, () => {
    const popover = renderComponent({ targetRef, defaultPlacementX: 'right' });
    const X = Math.round(targetBoundingClientRect.right - popoverBoundingClientRect.width);
    const Y = Math.round(targetBoundingClientRect.bottom + popover.props().offsetY + pageYOffset);

    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_bottom')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_right')
    ).toBeTruthy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates and placement if:
      - \`isSticky\` property set to \`false\`;
      - \`defaultPlacementX\` property does not set;
      - \`defaultPlacementY\` property set to "bottom";
      - the popover beyond a left viewport boundary`, () => {
    const popover = renderComponent({ targetRef });
    const X = 50;
    const Y = Math.round(targetBoundingClientRect.bottom + popover.props().offsetY + pageYOffset);

    Object.defineProperty(targetEl, 'getBoundingClientRect', {
      writable: true,
      value() {
        return { ...targetBoundingClientRect, right: 250, left: 50 };
      },
    });
    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_bottom')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_left')
    ).toBeTruthy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates and placement if:
      - \`isSticky\` property set to \`false\`;
      - \`defaultPlacementX\` property does not set;
      - \`defaultPlacementY\` property set to "bottom";
      - the popover beyond a right viewport boundary`, () => {
    const popover = renderComponent({ targetRef });
    const X = Math.round(1400 - popoverBoundingClientRect.width);
    const Y = Math.round(targetBoundingClientRect.bottom + popover.props().offsetY + pageYOffset);

    Object.defineProperty(targetEl, 'getBoundingClientRect', {
      writable: true,
      value() {
        return { ...targetBoundingClientRect, right: 1400, left: 1200 };
      },
    });
    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_bottom')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_right')
    ).toBeTruthy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates and placement if:
      - \`isSticky\` property set to \`false\`;
      - \`defaultPlacementX\` property does not set";
      - \`defaultPlacementY\` property set to "top";
      - the popover beyond a top viewport boundary`, () => {
    const popover = renderComponent({ targetRef, defaultPlacementY: 'top' });
    const X = Math.round(
      (targetBoundingClientRect.left + targetBoundingClientRect.right) / 2 -
        popoverBoundingClientRect.width / 2
    );
    const Y = Math.round(130 + popover.props().offsetY + pageYOffset);

    Object.defineProperty(targetEl, 'getBoundingClientRect', {
      writable: true,
      value() {
        return { ...targetBoundingClientRect, top: 50, bottom: 130 };
      },
    });
    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_bottom')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_right')
    ).toBeFalsy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_left')
    ).toBeFalsy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });

  it(`should calculates correct coordinates and placement if:
      - \`isSticky\` property set to \`false\`;
      - \`defaultPlacementX\` property does not set;
      - \`defaultPlacementY\` property set to "bottom";
      - the popover beyond a bottom viewport boundary`, () => {
    const popover = renderComponent({ targetRef });
    const X = Math.round(
      (targetBoundingClientRect.left + targetBoundingClientRect.right) / 2 -
        popoverBoundingClientRect.width / 2
    );
    const Y = Math.round(
      870 - popoverBoundingClientRect.height - popover.props().offsetY + pageYOffset
    );

    Object.defineProperty(targetEl, 'getBoundingClientRect', {
      writable: true,
      value() {
        return { ...targetBoundingClientRect, top: 870, bottom: 950 };
      },
    });
    Object.defineProperty(popover.instance().popoverRef.current, 'getBoundingClientRect', {
      value() {
        return popoverBoundingClientRect;
      },
    });
    popover.setProps({ isOpen: true });
    popover.update();

    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementY_top')
    ).toBeTruthy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_right')
    ).toBeFalsy();
    expect(
      popover.find('.DraftTextEditPopover').hasClass('DraftTextEditPopover_placementX_left')
    ).toBeFalsy();
    expect(popover.find('.DraftTextEditPopover').props().style.transform).toBe(
      `translate3d(${X}px, ${Y}px, 0)`
    );
  });
});
