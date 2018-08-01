```jsx
const contentStyle = {
  display: 'flex-inline',
  padding: '0 1em',
  color: '#767b91',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
};

class PopoverDemo extends React.Component {
  constructor(props) {
    super(props);
    this.targetRef = React.createRef();
    this.togglePopover = this.togglePopover.bind(this);
    this.state = { isOpen: false };
  }

  togglePopover() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <div>
        <button ref={this.targetRef} onClick={this.togglePopover}>
          Click to toggle Popover
        </button>
        <Popover
          targetRef={this.targetRef}
          isOpen={this.state.isOpen}
          onBackdropMouseDown={this.togglePopover}
          onEscapeKeyDown={this.togglePopover}>
          <h3 style={contentStyle}>Popover on top</h3>
        </Popover>
      </div>
    );
  }
}

<PopoverDemo />;
```
