// @flow

import React from 'react';
import { EditorState } from 'draft-js';
import isFunction from 'lodash/isFunction';
import type { Ref, DecoratorComponentProps, EditorActions } from '../../constants/types';
import { EventsManager, Utils, EntityUtils } from '../../lib';
import Dropdown from '../../components/Dropdown';
import { Anchor, Actions, ActionButton } from './styled';

type Props = { editorActions: EditorActions } & DecoratorComponentProps;
type State = {
  isDropdownOpen: boolean,
  isDialogOpen: boolean,
  data: {
    linkTo: '' | 'mailto:',
    url: string,
    target: '' | '_self' | '_blank' | '_parent' | '_top',
    subject: string,
  },
};

export default class Link extends React.Component<Props, State> {
  anchorRef: Ref<HTMLAnchorElement>;
  isLocked: boolean;
  timeoutId: TimeoutID;

  static getDerivedStateFromProps(props: Props) {
    return {
      data: EntityUtils.getEntityData(props.entityKey, props.contentState, [
        'linkTo',
        'url',
        'target',
        'subject',
      ]),
    };
  }

  constructor(props: Props) {
    super(props);
    this.anchorRef = React.createRef();
    this.isLocked = false;
    this.state = {
      isDropdownOpen: false,
      isDialogOpen: false,
      data: EntityUtils.getEntityData(props.entityKey, props.contentState, [
        'linkTo',
        'url',
        'target',
        'subject',
      ]),
    };
  }

  componentDidMount() {
    EventsManager.addListener('create-link-entity', this.handleCreateLinkEntity);
    EventsManager.addListener('change-editor-state', this.handleChangeEditorState);
    EventsManager.addListener('editor-focus', this.handleEditorFocus);
    EventsManager.addListener('editor-blur', this.handleEditorBlur);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
    EventsManager.removeListener('create-link-entity', this.handleCreateLinkEntity);
    EventsManager.removeListener('change-editor-state', this.handleChangeEditorState);
    EventsManager.removeListener('editor-focus', this.handleEditorFocus);
    EventsManager.removeListener('editor-blur', this.handleEditorBlur);
  }

  openDropdown(callback?: () => mixed) {
    window.clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.setState({ isDropdownOpen: true });
      isFunction(callback) && callback();
    }, 100);
  }

  closeDropdown(callback?: () => mixed) {
    window.clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.setState({ isDropdownOpen: false });
      isFunction(callback) && callback();
    }, 100);
  }

  shouldDisableEditButton() {
    return this.state.data.linkTo === 'mailto:' || !Utils.isUrl(this.state.data.url);
  }

  handleCreateLinkEntity = (entityKey: string) => {
    this.closeDropdown(() => this.props.entityKey === entityKey && this.openDropdown());
  };

  handleChangeEditorState = (editorState: EditorState) => {
    const entityKey = EntityUtils.getCurrentEntityKey(editorState);

    if (!this.isLocked && entityKey === this.props.entityKey) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  };

  handleEditorFocus = () => {
    this.isLocked = false;
  };

  handleEditorBlur = () => {
    this.isLocked = true;
  };

  handleRemoveButtonMouseDown = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const editorState = this.props.editorActions.getEditorState();
    const newEditorState = EntityUtils.removeEntity(this.props.entityKey, editorState);

    this.props.editorActions.setEditorState(newEditorState);
    this.closeDropdown();
  };

  handleEditButtonMouseDown = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    EventsManager.dispatchEvent('edit-link-entity', this.props.entityKey);
  };

  handleOpenLinkButtonMouseDown = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Utils.openUrl(this.state.data.url);
  };

  render() {
    return (
      <React.Fragment>
        <Anchor innerRef={this.anchorRef} isActive={this.state.isDropdownOpen}>
          {this.props.children}
        </Anchor>
        <Dropdown
          elementRef={this.anchorRef}
          isOpen={this.state.isDropdownOpen}
          style={{ zIndex: 99, transition: '100ms opacity ease' }}>
          <Actions>
            <ActionButton
              disabled={this.shouldDisableEditButton()}
              onMouseDown={this.handleOpenLinkButtonMouseDown}>
              Go to Page
            </ActionButton>
            <ActionButton onMouseDown={this.handleEditButtonMouseDown}>Edit</ActionButton>
            <ActionButton onMouseDown={this.handleRemoveButtonMouseDown}>Remove</ActionButton>
          </Actions>
        </Dropdown>
      </React.Fragment>
    );
  }
}
