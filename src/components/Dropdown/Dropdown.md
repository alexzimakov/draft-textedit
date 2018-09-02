```js
const styled = require('styled-components').default;
const { faEllipsisV } = require('@fortawesome/free-solid-svg-icons');

const ListItem = styled.li`
  box-sizing: border-box;
  height: 40px;
  margin: 0;
  padding: 0 16px;
  cursor: pointer;
  line-height: 40px;

  &:hover {
    background: #f2f2f2;
  }
`;
const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

class DropdownDemo extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleDropdownOutsideClick = this.handleDropdownOutsideClick.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.buttonRef = React.createRef();
    this.state = {
      isDropdownOpen: false,
    };
  }

  handleButtonClick() {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  }

  handleDropdownOutsideClick(event) {
    if (this.buttonRef.current !== event.target) {
      this.setState({ isDropdownOpen: false });
    }
  }

  handleListItemClick(event) {
    this.setState({ isDropdownOpen: false });
  }

  render() {
    const { isDropdownOpen } = this.state;

    return (
      <React.Fragment>
        <Button
          forwardedRef={this.buttonRef}
          variant="text"
          icon={faEllipsisV}
          onClick={this.handleButtonClick}
        />
        <Dropdown
          elementRef={this.buttonRef}
          isOpen={isDropdownOpen}
          onOutsideClick={this.handleDropdownOutsideClick}>
          <List>
            <ListItem onClick={this.handleListItemClick}>Menu Item</ListItem>
            <ListItem onClick={this.handleListItemClick}>Another Menu Item</ListItem>
          </List>
        </Dropdown>
      </React.Fragment>
    );
  }
}

<DropdownDemo />;
```
