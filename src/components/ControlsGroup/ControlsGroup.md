```jsx
const FontAwesomeIcon = require('@fortawesome/react-fontawesome/index');
const faBold = require('@fortawesome/fontawesome-free-solid/faBold');
const faItalic = require('@fortawesome/fontawesome-free-solid/faItalic');
const faUnderline = require('@fortawesome/fontawesome-free-solid/faUnderline');
const faStrikethrough = require('@fortawesome/fontawesome-free-solid/faStrikethrough');
const faCode = require('@fortawesome/fontawesome-free-solid/faCode');
const faListUl = require('@fortawesome/fontawesome-free-solid/faListUl');
const faListOl = require('@fortawesome/fontawesome-free-solid/faListOl');
const faLink = require('@fortawesome/fontawesome-free-solid/faLink');
const faTable = require('@fortawesome/fontawesome-free-solid/faTable');
const faQuoteLeft = require('@fortawesome/fontawesome-free-solid/faQuoteLeft');
const faImage = require('@fortawesome/fontawesome-free-solid/faImage');
const faUndo = require('@fortawesome/fontawesome-free-solid/faUndo');
const faRedo = require('@fortawesome/fontawesome-free-solid/faRedo');

<div style={{ display: 'flex' }}>
  <ControlsGroup>
    <StyleButton title="Bold (\u2318B)">
      <FontAwesomeIcon icon={faBold} />
    </StyleButton>
    <StyleButton title="Italic (\u2318I)">
      <FontAwesomeIcon icon={faItalic} />
    </StyleButton>
    <StyleButton title="Underline (\u2318U)">
      <FontAwesomeIcon icon={faUnderline} />
    </StyleButton>
    <StyleButton title="Strikethrough">
      <FontAwesomeIcon icon={faStrikethrough} />
    </StyleButton>
    <StyleButton title="Code">
      <FontAwesomeIcon icon={faCode} />
    </StyleButton>
  </ControlsGroup>
  <ControlsGroup>
    <StyleButton title="Unordered list">
      <FontAwesomeIcon icon={faListUl} />
    </StyleButton>
    <StyleButton title="Ordered list">
      <FontAwesomeIcon icon={faListOl} />
    </StyleButton>
  </ControlsGroup>
  <ControlsGroup>
    <StyleButton title="Link">
      <FontAwesomeIcon icon={faLink} />
    </StyleButton>
    <StyleButton title="Table">
      <FontAwesomeIcon icon={faTable} />
    </StyleButton>
    <StyleButton title="Quote">
      <FontAwesomeIcon icon={faQuoteLeft} />
    </StyleButton>
    <StyleButton title="Add image">
      <FontAwesomeIcon icon={faImage} />
    </StyleButton>
  </ControlsGroup>
  <ControlsGroup>
    <StyleButton title="Undo">
      <FontAwesomeIcon icon={faUndo} />
    </StyleButton>
    <StyleButton title="Redo">
      <FontAwesomeIcon icon={faRedo} />
    </StyleButton>
  </ControlsGroup>
</div>;
```
