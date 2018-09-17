```js
class DialogDemo extends React.Component {
  constructor() {
    super();
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.state = { isDialogOpen: false };
  }

  openDialog() {
    this.setState({ isDialogOpen: true });
  }

  closeDialog() {
    this.setState({ isDialogOpen: false });
  }

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.openDialog}>Open dialog</Button>
        <Dialog
          title="Warning"
          isOpen={this.state.isDialogOpen}
          onBackdropPress={this.closeDialog}
          onCancelPress={this.closeDialog}
          onConfirmPress={this.closeDialog}>
          Are you sure want to delete this item?
        </Dialog>
      </React.Fragment>
    );
  }
}

<DialogDemo />;
```
