import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown';
import * as blockTypes from '../../constants/blockTypes';
import StyleButton from '../StyleButton';
import DropdownMenu from '../DropdownMenu';
import Option from './Option';
import './BlockTypeSelect.css';

class BlockTypeSelect extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.oneOf(Object.values(blockTypes))),
    labels: PropTypes.objectOf(PropTypes.string),
    popoverIsFixed: PropTypes.bool,
    // eslint-disable-next-line
    value: PropTypes.oneOf(Object.values(blockTypes)),
    defaultValue: PropTypes.oneOf(Object.values(blockTypes)),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    options: [
      blockTypes.headerOne,
      blockTypes.headerTwo,
      blockTypes.headerThree,
      blockTypes.headerFour,
      blockTypes.headerFive,
      blockTypes.headerSix,
      blockTypes.paragraph,
    ],
    labels: {
      [blockTypes.headerOne]: 'Heading 1',
      [blockTypes.headerTwo]: 'Heading 2',
      [blockTypes.headerThree]: 'Heading 3',
      [blockTypes.headerFour]: 'Heading 4',
      [blockTypes.headerFive]: 'Heading 5',
      [blockTypes.headerSix]: 'Heading 6',
      [blockTypes.blockQuote]: 'Blockquote',
      [blockTypes.codeBlock]: 'Code',
      [blockTypes.atomic]: 'Figure',
      [blockTypes.unorderedList]: 'Unordered list',
      [blockTypes.orderedList]: 'Ordered list',
      [blockTypes.paragraph]: 'Paragraph',
    },
    popoverIsFixed: false,
    defaultValue: blockTypes.paragraph,
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.popoverRef = React.createRef();
    this.state = { value: props.defaultValue, isActive: false };
  }

  getState = () => ({ ...this.state, ...pick(this.props, ['value']) });

  handlePopoverOpen = () => {
    this.setState({ isActive: true });
  };

  handlePopoverClose = () => {
    this.setState({ isActive: false });
  };

  handleOptionPress = value => {
    const { onChange } = this.props;

    this.setState({ value });
    this.popoverRef.current.closePopover();
    onChange(value);
  };

  renderPopoverContent = () => {
    const { options, labels } = this.props;
    const { value } = this.getState();

    return (
      <ul className="DraftTextEditBlockTypeSelect-Options" role="listbox">
        {options.map(option => (
          <Option
            key={option}
            value={option}
            label={labels[option]}
            selected={option === value}
            onPress={this.handleOptionPress}
          />
        ))}
      </ul>
    );
  };

  render() {
    const { labels, popoverIsFixed } = this.props;
    const { value, isActive } = this.getState();

    return (
      <div className="DraftTextEditBlockTypeSelect">
        <DropdownMenu
          ref={this.popoverRef}
          content={this.renderPopoverContent()}
          positionFixed={popoverIsFixed}
          onOpen={this.handlePopoverOpen}
          onClose={this.handlePopoverClose}>
          <StyleButton className="DraftTextEditBlockTypeSelect-Button" active={isActive}>
            <span className="DraftTextEditBlockTypeSelect-Button_label">
              {labels[value] || value}
            </span>
            <FontAwesomeIcon
              className="DraftTextEditBlockTypeSelect-Button_arrow"
              icon={faChevronDown}
            />
          </StyleButton>
        </DropdownMenu>
      </div>
    );
  }
}

export default BlockTypeSelect;
