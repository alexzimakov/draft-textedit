// @flow

import React from 'react';
import { EditorState, SelectionState } from 'draft-js';
import type { EditorActions } from '../../constants/types';
import { EntityUtils, EventsManager } from '../../lib';
import Dialog from '../../components/Dialog';
import Select from '../../components/Select';
import TextField from '../../components/TextField';
import {
  Form,
  FormField,
  LabelWrapper,
  InputWrapper,
  RadioButton,
  TextFieldWrapper,
} from './styled';

type Props = { editorActions: EditorActions };
type State = {
  isDialogOpen: boolean,
  entityKey: ?string,
  formData: {
    linkTo: '' | 'mailto:',
    url: string,
    target: '' | '_self' | '_blank' | '_parent' | '_top',
    subject: string,
  },
};

export default class LinkWidget extends React.Component<Props, State> {
  initialSelectionState: ?SelectionState;

  constructor(props: Props) {
    super(props);
    this.initialSelectionState = null;
    this.state = {
      isDialogOpen: false,
      entityKey: null,
      formData: { linkTo: '', url: '', target: '', subject: '' },
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleEscapeKeydown);
    EventsManager.addListener('create-link-entity', this.handleCreateLinkEntity);
    EventsManager.addListener('edit-link-entity', this.handleEditLinkEntity);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscapeKeydown);
    EventsManager.removeListener('create-link-entity', this.handleCreateLinkEntity);
    EventsManager.removeListener('edit-link-entity', this.handleEditLinkEntity);
  }

  saveSelectionState() {
    this.initialSelectionState = this.props.editorActions.getEditorState().getSelection();
  }

  restoreSelectionState() {
    const initialSelectionState = this.initialSelectionState;
    const editorState = this.props.editorActions.getEditorState();

    if (initialSelectionState) {
      this.props.editorActions.setEditorState(
        EditorState.forceSelection(editorState, initialSelectionState)
      );
    }
  }

  openDialog(entityKey: string) {
    this.saveSelectionState();
    const editorState = this.props.editorActions.getEditorState();
    const contentState = editorState.getCurrentContent();
    const formData = EntityUtils.getEntityData(entityKey, contentState, [
      'linkTo',
      'url',
      'target',
      'subject',
    ]);

    this.props.editorActions.lock(() => {
      this.setState({
        isDialogOpen: true,
        entityKey,
        formData: { ...this.state.formData, ...formData },
      });
    });
  }

  closeDialog() {
    this.setState({
      isDialogOpen: false,
      formData: {
        linkTo: '',
        url: '',
        target: '',
        subject: '',
      },
    });
    this.props.editorActions.unlock(() => this.restoreSelectionState());
  }

  handleCreateLinkEntity = (entityKey: string) => {
    this.openDialog(entityKey);
  };

  handleEditLinkEntity = (entityKey: string) => {
    this.openDialog(entityKey);
  };

  handleEscapeKeydown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
    if (this.state.isDialogOpen && event.key === 'Escape') {
      this.closeDialog();
    }
  };

  handleCancelButtonPress = () => this.closeDialog();

  handleBackdropPress = () => this.closeDialog();

  handleChange = (event: SyntheticInputEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
    });
  };

  handleSubmit = (event?: SyntheticEvent<HTMLElement>) => {
    if (event) {
      event.preventDefault();
    }

    const editorState = this.props.editorActions.getEditorState();
    const entityKey = this.state.entityKey;
    const entityData = this.state.formData;

    if (entityKey) {
      const newEditorState = EntityUtils.updateEntityData(entityKey, editorState, entityData);

      this.props.editorActions.setEditorState(newEditorState, () => {
        this.restoreSelectionState();
        this.closeDialog();
      });
    }
  };

  render() {
    const formData = this.state.formData;

    return (
      <Dialog
        title="Edit link"
        confirmButtonCaption="Save"
        isOpen={this.state.isDialogOpen}
        onConfirmPress={this.handleSubmit}
        onCancelPress={this.handleCancelButtonPress}
        onBackdropPress={this.handleBackdropPress}>
        <Form onSubmit={this.handleSubmit}>
          <FormField>
            <LabelWrapper>Link to:</LabelWrapper>
            <InputWrapper>
              <RadioButton>
                <input
                  type="radio"
                  name="linkTo"
                  value=""
                  checked={!formData.linkTo}
                  onChange={this.handleChange}
                />{' '}
                Webpage
              </RadioButton>
              <RadioButton>
                <input
                  type="radio"
                  name="linkTo"
                  value="mailto:"
                  checked={formData.linkTo === 'mailto:'}
                  onChange={this.handleChange}
                />{' '}
                Email
              </RadioButton>
            </InputWrapper>
          </FormField>
          <FormField>
            <LabelWrapper>
              <label htmlFor="url">Url:</label>
            </LabelWrapper>
            <TextFieldWrapper>
              <TextField
                id="url"
                placeholder={
                  formData.linkTo === 'mailto:' ? 'noreply@example.com' : 'https://example.com'
                }
                name="url"
                value={formData.url}
                onChange={this.handleChange}
              />
            </TextFieldWrapper>
          </FormField>
          <FormField>
            {formData.linkTo === 'mailto:' ? (
              <React.Fragment>
                <LabelWrapper>
                  <label htmlFor="subject">Subject:</label>
                </LabelWrapper>
                <TextFieldWrapper>
                  <TextField
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={this.handleChange}
                  />
                </TextFieldWrapper>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <LabelWrapper>
                  <label htmlFor="target">Target:</label>
                </LabelWrapper>
                <InputWrapper>
                  <Select
                    id="target"
                    name="target"
                    value={formData.target}
                    onChange={this.handleChange}>
                    <option value="_blank">Blank</option>
                    <option value="_self">Self</option>
                    <option value="_parent">Parent</option>
                    <option value="_top">Top</option>
                  </Select>
                </InputWrapper>
              </React.Fragment>
            )}
          </FormField>
        </Form>
      </Dialog>
    );
  }
}
