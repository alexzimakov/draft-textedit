import React from 'react';
import { shallow } from 'enzyme';
import BlockTypeSelect from './BlockTypeSelect';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<BlockTypeSelect {...props} />);
}

describe('<BlockTypeSelect /> component', () => {
  it('should renders without errors', () => {
    renderComponent();
  });

  it('should adds class with modifier if position property if given', () => {
    const blockTypeSelect = renderComponent({ popoverPosition: 'left' });

    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_position_left')
    ).toBeTruthy();
    blockTypeSelect.setProps({ popoverPosition: 'right' });
    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_position_right')
    ).toBeTruthy();
  });

  it('should adds `keydown` event handler in `componentDidMount` lifecycle method', () => {
    jest.spyOn(document.body, 'addEventListener');

    const blockTypeSelect = renderComponent();
    const that = blockTypeSelect.instance();

    expect(document.body.addEventListener).toHaveBeenCalledWith(
      'keydown',
      that.handleKeyDown
    );
  });

  it('should removes `keydown` event handler in `componentWillUnmount` lifecycle method', () => {
    jest.spyOn(document.body, 'removeEventListener');

    const blockTypeSelect = renderComponent();
    const that = blockTypeSelect.instance();

    blockTypeSelect.unmount();
    expect(document.body.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      that.handleKeyDown
    );
  });

  it('should shows popover when click on button', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect
      .find('Button')
      .props()
      .onPress();
    blockTypeSelect.update();
    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_visible')
    ).toBeTruthy();
  });

  it('should hides popover when click outside of popover', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect.setState({ popoverIsVisible: true });
    blockTypeSelect.update();
    blockTypeSelect
      .find('Popover')
      .props()
      .onPressOutside({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      });
    blockTypeSelect.update();
    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_visible')
    ).toBeFalsy();
  });

  it('should hides popover when press Escape, Arrow Up or Arrow Down', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect.setState({ popoverIsVisible: true });
    blockTypeSelect.update();
    blockTypeSelect.instance().handleKeyDown({ key: 'Escape' });
    blockTypeSelect.update();
    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_visible')
    ).toBeFalsy();

    blockTypeSelect.setState({ popoverIsVisible: true });
    blockTypeSelect.update();
    blockTypeSelect.instance().handleKeyDown({ key: 'ArrowUp' });
    blockTypeSelect.update();
    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_visible')
    ).toBeFalsy();

    blockTypeSelect.setState({ popoverIsVisible: true });
    blockTypeSelect.update();
    blockTypeSelect.instance().handleKeyDown({ key: 'ArrowDown' });
    blockTypeSelect.update();
    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_visible')
    ).toBeFalsy();
  });

  it("should not hides popover when don't press Escape, Arrow Up or Arrow Down", () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect.setState({ popoverIsVisible: true });
    blockTypeSelect.update();
    blockTypeSelect.instance().handleKeyDown({ key: 'Enter' });
    blockTypeSelect.update();
    expect(
      blockTypeSelect
        .find('.DraftTextEditBlockTypeSelect-Popover')
        .hasClass('DraftTextEditBlockTypeSelect-Popover_visible')
    ).toBeTruthy();
  });

  it('should calls `onChange` callback with a block type', () => {
    const onChange = jest.fn();
    const blockTypeSelect = renderComponent({ onChange });

    blockTypeSelect
      .find('Option')
      .at(0)
      .props()
      .onPress('header-one');
    expect(onChange).toHaveBeenCalledWith('header-one');
  });

  it('should not throws an error if `onChange` property is not given', () => {
    const popover = renderComponent();

    expect(() => {
      popover.instance().props.onChange();
    }).not.toThrow();
  });
});
