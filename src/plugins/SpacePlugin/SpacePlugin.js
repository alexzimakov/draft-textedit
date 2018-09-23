// @flow

import React from 'react';
import type { Node } from 'react';
import uniqueId from 'lodash/uniqueId';
import AbstractPlugin from '../AbstractPlugin';
import { Space } from './styled';

export default class SpacePlugin extends AbstractPlugin {
  constructor() {
    super();
    this.name = `space-plugin-${uniqueId()}`;
  }

  renderToolbarItem = (): Node => {
    return <Space />;
  };
}
