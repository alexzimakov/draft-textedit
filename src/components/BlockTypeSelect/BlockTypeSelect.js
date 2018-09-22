// @flow

import * as React from 'react';
import isFunction from 'lodash/isFunction';
import * as types from '../../constants/types';
import ToolbarButton from '../ToolbarButton';
import Dropdown from '../Dropdown';
import { Label, Arrow, OptionList, getStyledOption, CheckIcon } from './styled';

type Props = {
  options: Array<types.BlockType>,
  labels: { [types.BlockType]: string },
  defaultValue: types.BlockType,
  value?: types.BlockType,
  shouldUseFixedDropdownPosition: boolean,
  onChange?: (value: types.BlockType) => void,
};
type State = {
  value: types.BlockType,
  isDropdownOpen: boolean,
};

class BlockTypeSelect extends React.Component<Props, State> {
  toolbarButtonRef: types.Ref<HTMLButtonElement>;

  static defaultProps: Props = {
    options: [
      'unstyled',
      'header-one',
      'header-two',
      'header-three',
      'header-four',
      'header-five',
      'header-six',
      'blockquote',
      'code-block',
      'unordered-list-item',
      'ordered-list-item',
    ],
    labels: {
      'header-one': 'Heading 1',
      'header-two': 'Heading 2',
      'header-three': 'Heading 3',
      'header-four': 'Heading 4',
      'header-five': 'Heading 5',
      'header-six': 'Heading 6',
      blockquote: 'Blockquote',
      'code-block': 'Code',
      atomic: 'Figure',
      'unordered-list-item': 'Unordered list',
      'ordered-list-item': 'Ordered list',
      unstyled: 'Paragraph',
    },
    defaultValue: 'unstyled',
    shouldUseFixedDropdownPosition: false,
  };

  static getDerivedStateFromProps(props: Props) {
    if ('value' in props) {
      return { value: props.options.includes(props.value) ? props.value : 'unstyled' };
    }

    return null;
  }

  constructor(props: Props) {
    super(props);
    this.toolbarButtonRef = React.createRef();
    this.state = { value: props.defaultValue, isDropdownOpen: false };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleEscapeKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscapeKeydown);
  }

  getOptions = () => {
    const options = this.props.options;

    if (options.includes('unstyled')) {
      return options;
    }

    return ['unstyled', ...options];
  };

  openDropdown = () => {
    this.setState({ isDropdownOpen: true });
  };

  closeDropdown = () => {
    this.setState({ isDropdownOpen: false });
  };

  handleEscapeKeydown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
    if (this.state.isDropdownOpen && event.key === 'Escape') {
      this.closeDropdown();
    }
  };

  handleToolbarButtonPress = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  handleDropdownOutsideClick = (event: SyntheticMouseEvent<HTMLElement>) => {
    const toolbarButtonEl = this.toolbarButtonRef.current;

    if (toolbarButtonEl && !toolbarButtonEl.contains((event.target: any))) {
      this.closeDropdown();
    }
  };

  handleOptionPress = (option: types.BlockType) => {
    this.setState({ value: option, isDropdownOpen: false });
    isFunction(this.props.onChange) && this.props.onChange(option);
  };

  render() {
    const { labels, shouldUseFixedDropdownPosition } = this.props;
    const { value, isDropdownOpen } = this.state;
    const options = this.getOptions();

    return (
      <React.Fragment>
        <ToolbarButton
          forwardedRef={this.toolbarButtonRef}
          isActive={isDropdownOpen}
          onFocus={this.openDropdown}
          onBlur={this.closeDropdown}
          onPress={this.handleToolbarButtonPress}>
          <Label>{labels[value] || value}</Label> <Arrow />
        </ToolbarButton>
        <Dropdown
          elementRef={this.toolbarButtonRef}
          isOpen={isDropdownOpen}
          shouldUseFixedPosition={shouldUseFixedDropdownPosition}
          onOutsideClick={this.handleDropdownOutsideClick}>
          <OptionList>
            {options.map(option => {
              const Option = getStyledOption(option);
              const onMouseDown = (event: SyntheticMouseEvent<HTMLLIElement>) => {
                event.preventDefault();
                this.handleOptionPress(option);
              };

              return (
                <Option key={option} onMouseDown={onMouseDown}>
                  {value === option && <CheckIcon />}
                  {labels[option]}
                </Option>
              );
            })}
          </OptionList>
        </Dropdown>
      </React.Fragment>
    );
  }
}

export default BlockTypeSelect;
