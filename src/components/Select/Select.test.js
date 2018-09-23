import React from 'react';
import { shallow } from 'enzyme';
import Select from './Select';

describe('<Select /> component', () => {
  it('should render without errors', () => {
    shallow(
      <Select>
        <option value="1">First Option</option>
        <option value="2">Second Option</option>
        <option value="3">Third Option</option>
      </Select>
    );
  });
});
