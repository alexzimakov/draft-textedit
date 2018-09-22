import React from 'react';
import { shallow } from 'enzyme';
import SpacePlugin from './SpacePlugin';

describe('Space Plugin', () => {
  it('should have unique name', () => {
    const spacePlugin = new SpacePlugin();
    const spacePlugin1 = new SpacePlugin();

    expect(spacePlugin.name !== spacePlugin1.name).toBeTruthy();
  });

  it('should render toolbar item without errors', () => {
    const spacePlugin = new SpacePlugin();
    const ToolbarItem = spacePlugin.renderToolbarItem;

    shallow(<ToolbarItem />);
  });
});
