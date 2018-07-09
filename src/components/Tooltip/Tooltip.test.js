import React from 'react';
import { mount } from 'enzyme';
import Tooltip from './Tooltip';

function renderComponent({ caption = 'Tooltip text', ...otherProps } = {}, mountFn = mount) {
  return mountFn(
    <Tooltip caption={caption} {...otherProps}>
      <button>Button with tooltip</button>
    </Tooltip>
  );
}

describe('<Tooltip /> component', () => {
  it('should renders with necessary components and the children', () => {
    const tooltip = renderComponent();

    expect(tooltip.find('StatelessTooltip')).toHaveLength(1);
    expect(tooltip.find('div')).toHaveLength(1);
    expect(tooltip.contains(<button>Button with tooltip</button>)).toBeTruthy();
  });

  it('should renders with custom tag', () => {
    const tooltip = renderComponent({ tag: 'section' });

    expect(tooltip.find('StatelessTooltip')).toHaveLength(1);
    expect(tooltip.find('section')).toHaveLength(1);
    expect(tooltip.contains(<button>Button with tooltip</button>)).toBeTruthy();
  });

  it('should renders without `StatelessTooltip` if caption property is empty', () => {
    const tooltip = renderComponent({ caption: '' });

    expect(tooltip.find('StatelessTooltip')).toHaveLength(0);
    expect(tooltip.contains(<button>Button with tooltip</button>)).toBeTruthy();
  });

  it('should mounts the tooltip into a separate DOM element', () => {
    const tooltip = renderComponent();

    expect(global.document.contains(tooltip.instance().mountElement)).toBeTruthy();
  });

  it('should removes the DOM element for mounting on `componentWillUnmount` call', () => {
    const tooltip = renderComponent();
    const { mountElement } = tooltip.instance();

    tooltip.unmount();
    expect(global.document.contains(mountElement)).toBeFalsy();
  });

  it('should shows tooltip with default position on hover', () => {
    const tooltip = renderComponent();
    const instance = tooltip.instance();

    Object.defineProperty(document.documentElement, 'clientWidth', { value: 320 });
    jest
      .spyOn(instance.wrapperRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 200, right: 150, bottom: 220, left: 100, width: 50, height: 20 });
    jest
      .spyOn(instance.tooltipRef.current, 'getDimensions')
      .mockReturnValue({ width: 80, height: 40 });
    tooltip
      .find('div')
      .props()
      .onMouseOver();
    tooltip.update();
    expect(tooltip.find('StatelessTooltip').props().style).toEqual({
      opacity: 1,
      top: 156,
      left: 85,
    });
    expect(tooltip.find('StatelessTooltip').props().placement).toBe('top');
    expect(tooltip.find('StatelessTooltip').props().position).toBeNull();
    expect(tooltip.find('StatelessTooltip').props()['aria-hidden']).toBeFalsy();
  });

  it('should shows tooltip with left position on hover', () => {
    const tooltip = renderComponent();
    const instance = tooltip.instance();

    Object.defineProperty(document.documentElement, 'clientWidth', { value: 320 });
    jest
      .spyOn(instance.wrapperRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 200, right: 60, bottom: 220, left: 10, width: 50, height: 20 });
    jest
      .spyOn(instance.tooltipRef.current, 'getDimensions')
      .mockReturnValue({ width: 80, height: 40 });
    tooltip
      .find('div')
      .props()
      .onMouseOver();
    tooltip.update();
    expect(tooltip.find('StatelessTooltip').props().style).toEqual({
      opacity: 1,
      top: 156,
      left: 10,
    });
    expect(tooltip.find('StatelessTooltip').props().placement).toBe('top');
    expect(tooltip.find('StatelessTooltip').props().position).toBe('left');
    expect(tooltip.find('StatelessTooltip').props()['aria-hidden']).toBeFalsy();
  });

  it('should shows tooltip with right position on hover', () => {
    const tooltip = renderComponent();
    const instance = tooltip.instance();

    Object.defineProperty(document.documentElement, 'clientWidth', { value: 320 });
    jest
      .spyOn(instance.wrapperRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 200, right: 310, bottom: 220, left: 260, width: 50, height: 20 });
    jest
      .spyOn(instance.tooltipRef.current, 'getDimensions')
      .mockReturnValue({ width: 80, height: 40 });
    tooltip
      .find('div')
      .props()
      .onMouseOver();
    tooltip.update();
    expect(tooltip.find('StatelessTooltip').props().style).toEqual({
      opacity: 1,
      top: 156,
      left: 230,
    });
    expect(tooltip.find('StatelessTooltip').props().placement).toBe('top');
    expect(tooltip.find('StatelessTooltip').props().position).toBe('right');
    expect(tooltip.find('StatelessTooltip').props()['aria-hidden']).toBeFalsy();
  });

  it('should shows tooltip with bottom placement on hover', () => {
    const tooltip = renderComponent();
    const instance = tooltip.instance();

    Object.defineProperty(document.documentElement, 'clientWidth', { value: 320 });
    jest
      .spyOn(instance.wrapperRef.current, 'getBoundingClientRect')
      .mockReturnValue({ top: 10, right: 150, bottom: 30, left: 100, width: 50, height: 20 });
    jest
      .spyOn(instance.tooltipRef.current, 'getDimensions')
      .mockReturnValue({ width: 80, height: 40 });
    tooltip
      .find('div')
      .props()
      .onMouseOver();
    tooltip.update();
    expect(tooltip.find('StatelessTooltip').props().style).toEqual({
      opacity: 1,
      top: 34,
      left: 85,
    });
    expect(tooltip.find('StatelessTooltip').props().placement).toBe('bottom');
    expect(tooltip.find('StatelessTooltip').props().position).toBeNull();
    expect(tooltip.find('StatelessTooltip').props()['aria-hidden']).toBeFalsy();
  });

  it('should hides tooltip on mouse out', () => {
    const tooltip = renderComponent();

    tooltip.setState({
      coordinates: { y: 156, x: 10 },
    });
    tooltip.update();
    tooltip
      .find('div')
      .props()
      .onMouseOut();
    tooltip.update();
    expect(tooltip.find('StatelessTooltip').props().style.opacity).toBe(0);
    expect(tooltip.find('StatelessTooltip').props()['aria-hidden']).toBeTruthy();
  });

  it('should hides tooltip on escape key down', () => {
    const tooltip = renderComponent();
    const preventDefault = jest.fn();

    tooltip.setState({
      coordinates: { y: 156, x: 10 },
    });
    tooltip.update();
    tooltip
      .find('div')
      .props()
      .onKeyDown({ key: 'Escape', preventDefault });
    tooltip.update();
    expect(preventDefault).toHaveBeenCalled();
    expect(tooltip.find('StatelessTooltip').props().style.opacity).toBe(0);
    expect(tooltip.find('StatelessTooltip').props()['aria-hidden']).toBeTruthy();
  });
});
