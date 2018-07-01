import React from 'react';
import { shallow } from 'enzyme';
import ControlsGroup from './ControlsGroup';

function renderComponent(props = {}, mountFn = shallow) {
  return mountFn(
    <ControlsGroup {...props}>
      <button />
      <button />
      <button />
    </ControlsGroup>
  );
}

describe('<ControlsGroup /> component', () => {
  it('should renders without errors', () => {
    const controlsGroup = renderComponent();

    expect(
      controlsGroup.find('.DraftTextEditControlsGroup-Control')
    ).toHaveLength(3);
  });
});
