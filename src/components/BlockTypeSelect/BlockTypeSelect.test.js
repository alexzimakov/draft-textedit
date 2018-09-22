import React from 'react';
import { mount } from 'enzyme';
import BlockTypeSelect from './BlockTypeSelect';

const options = [
  'unstyled',
  'header-one',
  'header-two',
  'code-block',
  'unordered-list-item',
  'ordered-list-item',
];
function renderComponent(props = {}, mountFn = mount) {
  return mountFn(<BlockTypeSelect options={options} {...props} />);
}

describe('<BlockTypeSelect /> component', () => {
  it('should render with necessary elements', () => {
    const blockTypeSelect = renderComponent();

    expect(blockTypeSelect.find('ToolbarButton')).toHaveLength(1);
    expect(blockTypeSelect.find('styled__Label')).toHaveLength(1);
    expect(blockTypeSelect.find('styled__Arrow')).toHaveLength(1);
    expect(blockTypeSelect.find('Dropdown')).toHaveLength(1);
    expect(blockTypeSelect.find('styled__OptionList')).toHaveLength(1);
    expect(blockTypeSelect.find('styled__Option')).toHaveLength(options.length);
  });

  it('should display option value if label for this option is not provided', () => {
    const blockTypeSelect = renderComponent({ labels: {} });

    expect(blockTypeSelect.find('styled__Label').text()).toBe('unstyled');
  });

  it('should add event listener for keydown event', () => {
    jest.spyOn(window, 'addEventListener');

    const blockTypeSelect = renderComponent();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'keydown',
      blockTypeSelect.instance().handleEscapeKeydown
    );
  });

  it('should remove event listener for keydown event', () => {
    jest.spyOn(window, 'removeEventListener');

    const blockTypeSelect = renderComponent();
    const handleEscapeKeydown = blockTypeSelect.instance().handleEscapeKeydown;

    blockTypeSelect.unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', handleEscapeKeydown);
  });

  it('should add `unstyled` option to the options list', () => {
    const blockTypeSelect = renderComponent({ options: ['header-one'] });

    expect(blockTypeSelect.find('styled__Option')).toHaveLength(2);
    expect(
      blockTypeSelect
        .find('styled__Option')
        .at(0)
        .text()
    ).toBe('Paragraph');
  });

  it('should set `unstyled` value for unknown option', () => {
    const blockTypeSelect = renderComponent({ value: 'header-one' });

    blockTypeSelect.setProps({ value: 'unknown' });

    expect(blockTypeSelect.state().value).toBe('unstyled');
  });

  it('should close dropdown and call the `onChange` callback after select any option', () => {
    const onChange = jest.fn();
    const blockTypeSelect = renderComponent({ onChange });

    blockTypeSelect.setState({ isDropdownOpen: true });
    blockTypeSelect.update();
    blockTypeSelect
      .find('styled__Option')
      .at(1)
      .simulate('mousedown');

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeFalsy();
    expect(onChange).toHaveBeenCalledWith(options[1]);
  });

  it('should open dropdwon after the button click', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect
      .find('ToolbarButton')
      .props()
      .onPress();
    blockTypeSelect.update();

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeTruthy();
  });

  it('should close dropdwon after the button click', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect.setState({ isDropdownOpen: true });
    blockTypeSelect.update();
    blockTypeSelect
      .find('ToolbarButton')
      .props()
      .onPress();
    blockTypeSelect.update();

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeFalsy();
  });

  it('should open dropdwon after the button focused', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect
      .find('ToolbarButton')
      .props()
      .onFocus();
    blockTypeSelect.update();

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeTruthy();
  });

  it('should close dropdwon after the button blurred', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect.setState({ isDropdownOpen: true });
    blockTypeSelect.update();
    blockTypeSelect
      .find('ToolbarButton')
      .props()
      .onBlur();
    blockTypeSelect.update();

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeFalsy();
  });

  it('should close dropdwon after click outside of dropdown', () => {
    const blockTypeSelect = renderComponent();
    const event = new MouseEvent('click');

    Object.defineProperty(event, 'target', {
      configurable: true,
      value: blockTypeSelect.instance().toolbarButtonRef.current.firstElementChild,
    });
    blockTypeSelect.setState({ isDropdownOpen: true });
    blockTypeSelect.update();
    blockTypeSelect
      .find('Dropdown')
      .props()
      .onOutsideClick(event);
    blockTypeSelect.update();

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeTruthy();

    Object.defineProperty(event, 'target', {
      configurable: true,
      value: window.document.body.firstElementChild,
    });
    blockTypeSelect
      .find('Dropdown')
      .props()
      .onOutsideClick(event);
    blockTypeSelect.update();

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeFalsy();
  });

  it('should close dropdwon after Escape key press', () => {
    const blockTypeSelect = renderComponent();
    const event = new KeyboardEvent('keydown');

    Object.defineProperty(event, 'key', { value: 'Escape' });
    blockTypeSelect.setState({ isDropdownOpen: true });
    blockTypeSelect.update();
    window.dispatchEvent(event);
    blockTypeSelect.update();

    expect(blockTypeSelect.find('Dropdown').props().isOpen).toBeFalsy();
  });
});
