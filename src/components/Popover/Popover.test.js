import React from 'react';
import { mount } from 'enzyme';
import Popover from './Popover';

function renderComponent(
  { content = <p>Popover content</p>, ...otherProps } = {},
  mountFn = mount
) {
  return mountFn(
    <Popover content={content} {...otherProps}>
      <button>Open popover</button>
    </Popover>
  );
}

describe('<Popover /> component', () => {
  it('should renders with necessary components and children', () => {
    const popover = renderComponent();

    expect(popover.contains(<button>Open popover</button>)).toBeTruthy();
    expect(popover.contains(<p>Popover content</p>)).toBeTruthy();
    expect(popover.find('.DraftTextEditPopover-Switcher')).toHaveLength(1);
    expect(popover.find('StatelessPopover')).toHaveLength(1);
  });

  it('should adds the DOM element for mounting on `componentDidMount` call', () => {
    const popover = renderComponent();

    expect(global.document.contains(popover.instance().mountElement)).toBeTruthy();
  });

  it('should adds resize eventListener on `componentDidMount` call', () => {
    jest.spyOn(global, 'addEventListener');
    const popover = renderComponent();

    expect(global.addEventListener).toHaveBeenCalledWith(
      'resize',
      popover.instance().calculateCoordinatesAndPlacement
    );
  });

  it('should removes the DOM element for mounting on `componentWillUnmount` call', () => {
    const popover = renderComponent();
    const { mountElement } = popover.instance();

    popover.unmount();
    expect(global.document.contains(mountElement)).toBeFalsy();
  });

  it('should removes resize eventListener on `componentWillUnmount` call', () => {
    jest.spyOn(global, 'removeEventListener');
    const popover = renderComponent();
    const { calculateCoordinatesAndPlacement } = popover.instance();

    popover.unmount();
    expect(global.removeEventListener).toHaveBeenCalledWith(
      'resize',
      calculateCoordinatesAndPlacement
    );
  });

  it('should opens popover with default placementY when switch was clicked', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const popover = renderComponent();
    Object.defineProperties(global.document.documentElement, {
      clientWidth: { value: 500 },
      clientHeight: { value: 800 },
    });
    jest.spyOn(popover.instance().wrapperRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 30,
      right: 200,
      bottom: 60,
      left: 100,
      width: 100,
      height: 30,
    });
    jest.spyOn(popover.instance().popoverRef.current, 'getBoundaries').mockReturnValue({
      width: 200,
      height: 150,
    });

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    expect(mouseEvent.preventDefault).toHaveBeenCalled();
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'all',
      opacity: 1,
    });
    expect(popover.find('StatelessPopover').props().placementY).toBe('bottom');
    expect(popover.find('StatelessPopover').props().style).toEqual({
      position: 'absolute',
      zIndex: 9999,
      top: 0,
      left: 0,
      transform: 'translate3d(50px, 64px, 0)',
    });
  });

  it('should opens popover with top placementY when switch was clicked', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const popover = renderComponent();
    Object.defineProperties(global.document.documentElement, {
      clientWidth: { value: 500 },
      clientHeight: { value: 800 },
    });
    jest.spyOn(popover.instance().wrapperRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 570,
      right: 200,
      bottom: 600,
      left: 100,
      width: 100,
      height: 30,
    });
    jest.spyOn(popover.instance().popoverRef.current, 'getBoundaries').mockReturnValue({
      width: 200,
      height: 400,
    });

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    expect(mouseEvent.preventDefault).toHaveBeenCalled();
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'all',
      opacity: 1,
    });
    expect(popover.find('StatelessPopover').props().placementY).toBe('top');
    expect(popover.find('StatelessPopover').props().style).toEqual({
      position: 'absolute',
      zIndex: 9999,
      top: 0,
      left: 0,
      transform: 'translate3d(50px, 166px, 0)',
    });
  });

  it('should opens popover with left placementX when switch was clicked', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const popover = renderComponent();
    Object.defineProperties(global.document.documentElement, {
      clientWidth: { value: 500 },
      clientHeight: { value: 800 },
    });
    jest.spyOn(popover.instance().wrapperRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 570,
      right: 120,
      bottom: 600,
      left: 20,
      width: 100,
      height: 30,
    });
    jest.spyOn(popover.instance().popoverRef.current, 'getBoundaries').mockReturnValue({
      width: 200,
      height: 400,
    });

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    expect(mouseEvent.preventDefault).toHaveBeenCalled();
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'all',
      opacity: 1,
    });
    expect(popover.find('StatelessPopover').props().placementX).toBe('left');
    expect(popover.find('StatelessPopover').props().style).toEqual({
      position: 'absolute',
      zIndex: 9999,
      top: 0,
      left: 0,
      transform: 'translate3d(20px, 166px, 0)',
    });
  });

  it('should opens popover with right placementX when switch was clicked', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const popover = renderComponent();
    Object.defineProperties(global.document.documentElement, {
      clientWidth: { value: 500 },
      clientHeight: { value: 800 },
    });
    jest.spyOn(popover.instance().wrapperRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 570,
      right: 490,
      bottom: 600,
      left: 390,
      width: 100,
      height: 30,
    });
    jest.spyOn(popover.instance().popoverRef.current, 'getBoundaries').mockReturnValue({
      width: 200,
      height: 400,
    });

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    expect(mouseEvent.preventDefault).toHaveBeenCalled();
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'all',
      opacity: 1,
    });
    expect(popover.find('StatelessPopover').props().placementX).toBe('right');
    expect(popover.find('StatelessPopover').props().style).toEqual({
      position: 'absolute',
      zIndex: 9999,
      top: 0,
      left: 0,
      transform: 'translate3d(290px, 166px, 0)',
    });
  });

  it('should opens popover with fixed position when switch was clicked', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const popover = renderComponent({ positionFixed: true });
    Object.defineProperties(global.document.documentElement, {
      clientWidth: { value: 500 },
      clientHeight: { value: 800 },
    });
    jest.spyOn(popover.instance().wrapperRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 570,
      right: 490,
      bottom: 600,
      left: 390,
      width: 100,
      height: 30,
    });
    jest.spyOn(popover.instance().popoverRef.current, 'getBoundaries').mockReturnValue({
      width: 200,
      height: 400,
    });

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    expect(mouseEvent.preventDefault).toHaveBeenCalled();
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'all',
      opacity: 1,
    });
    expect(popover.find('StatelessPopover').props().style).toEqual({
      position: 'fixed',
      zIndex: 9999,
      top: 0,
      left: 0,
      transform: 'translate3d(290px, 166px, 0)',
    });
  });

  it('should closes popover when backdrop was clicked', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const popover = renderComponent();

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    popover.find('.DraftTextEditPopoverWrapper-Backdrop').simulate('mousedown', mouseEvent);
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'none',
      opacity: 0,
    });
  });

  it('should closes popover when Escape was pressed', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const keyDownEvent = { preventDefault: jest.fn(), key: 'Escape' };
    const popover = renderComponent();

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    popover.instance().handleKeyDown(keyDownEvent);
    popover.update();
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'none',
      opacity: 0,
    });
  });

  it('should not close popover when any other key was pressed', () => {
    const mouseEvent = { preventDefault: jest.fn() };
    const keyDownEvent = { preventDefault: jest.fn(), key: 'Enter' };
    const popover = renderComponent();

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    popover.instance().handleKeyDown(keyDownEvent);
    popover.update();
    expect(popover.find('.DraftTextEditPopoverWrapper').props().style).toEqual({
      pointerEvents: 'all',
      opacity: 1,
    });
  });

  it('should calls `onOpen` and `onClose` callbacks', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const mouseEvent = { preventDefault: jest.fn() };
    const popover = renderComponent({ onOpen, onClose });

    popover.find('.DraftTextEditPopover-Switcher').simulate('mousedown', mouseEvent);
    popover.find('.DraftTextEditPopoverWrapper-Backdrop').simulate('mousedown', mouseEvent);
    expect(onOpen).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
