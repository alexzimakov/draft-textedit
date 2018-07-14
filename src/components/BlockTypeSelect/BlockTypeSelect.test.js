import React from 'react';
import { shallow, mount } from 'enzyme';
import BlockTypeSelect from './BlockTypeSelect';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(<BlockTypeSelect {...props} />);
}

describe('<BlockTypeSelect /> component', () => {
  it('should renders with necessary components', () => {
    const blockTypeSelect = renderComponent();

    expect(blockTypeSelect.find('Popover')).toHaveLength(1);
    expect(blockTypeSelect.find('StyleButton')).toHaveLength(1);
  });

  it('should renders with option value if `labels` property is empty', () => {
    const blockTypeSelect = renderComponent({ labels: {} }, mount);

    expect(blockTypeSelect.find('StyleButton').text()).toBe('unstyled');
  });

  it('should highlight `StyleButton` when popover is open', () => {
    const blockTypeSelect = renderComponent();

    blockTypeSelect
      .find('Popover')
      .props()
      .onOpen();
    blockTypeSelect.update();
    expect(blockTypeSelect.find('StyleButton').props().active).toBeTruthy();
  });

  it('should calls `onChange` callback with a block type', () => {
    const onChange = jest.fn();
    const blockTypeSelect = renderComponent({ onChange }, mount);

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
