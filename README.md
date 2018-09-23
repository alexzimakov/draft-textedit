# Draft TextEdit

A rich text editor built using [React](https://github.com/facebook/react), [Draft.js](https://github.com/facebook/draft-js) and [styled-components](https://github.com/styled-components/styled-components).

![DraftTextEdit](images/DraftTextEdit.png)

## Demo

[https://draft-textedit.netlify.com/#!/Editor](https://draft-textedit.netlify.com/#!/Editor)

## Installation

Using npm

```shell
$ npm i draft-textedit
```

### Using DraftTextEdit

Import `Editor` component.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from 'draft-textedit';
import './App.css';

class App extends Component.Component {
  render() {
    return (
      <div className="App">
        <div className="App-editor">
          <Editor placeholder="Write something..." />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```
