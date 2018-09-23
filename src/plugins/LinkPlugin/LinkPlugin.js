// @flow

import React from 'react';
import type { Node } from 'react';
import uniqueId from 'lodash/uniqueId';
import type { Decorator } from '../../constants/types';
import AbstractPlugin from '../AbstractPlugin';
import Link from './Link';
import LinkToolbarItem from './LinkToolbarItem';
import LinkWidget from './LinkWidget';

type Preferences = { title?: string };

const defaultPreferences = { title: 'Add Link' };

export default class LinkPlugin extends AbstractPlugin {
  title: ?string;

  constructor(preferences: Preferences = defaultPreferences) {
    super();
    this.name = uniqueId('link-plugin-');
    this.title = preferences.title;
  }

  getDecorator(): Decorator {
    return {
      strategy(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(character => {
          const entityKey = character.getEntity();

          if (!entityKey) {
            return false;
          }

          return contentState.getEntity(entityKey).getType() === 'LINK';
        }, callback);
      },
      component: props => {
        if (!this.editorActions) {
          return null;
        }

        return <Link {...props} editorActions={this.editorActions} />;
      },
    };
  }

  renderToolbarItem = (props: any): Node => {
    if (!this.editorActions) {
      return null;
    }

    return <LinkToolbarItem title={this.title} editorActions={this.editorActions} />;
  };

  renderWidget = (props: any): Node => {
    if (!this.editorActions) {
      return null;
    }

    return <LinkWidget editorActions={this.editorActions} />;
  };
}
