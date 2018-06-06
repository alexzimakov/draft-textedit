import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

describe('<AwesomeComponent /> component', () => {
  it('should renders without errors', () => {
    const button = shallow(<Button>Test</Button>);

    expect(button.text()).toBe('Test');
  });
});
