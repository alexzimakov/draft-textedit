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
    <BlockTypeSelect popoverPosition="left" />
  </ControlsGroup>
  <ControlsGroup>
    <ToolbarButton title="Bold (\u2318B)">
      <FontAwesomeIcon icon={faBold} />
    </ToolbarButton>
    <ToolbarButton title="Italic (\u2318I)">
      <FontAwesomeIcon icon={faItalic} />
    </ToolbarButton>
    <ToolbarButton title="Underline (\u2318U)">
      <FontAwesomeIcon icon={faUnderline} />
    </ToolbarButton>
    <ToolbarButton title="Strikethrough">
      <FontAwesomeIcon icon={faStrikethrough} />
    </ToolbarButton>
    <ToolbarButton title="Code">
      <FontAwesomeIcon icon={faCode} />
    </ToolbarButton>
  </ControlsGroup>
  <ControlsGroup>
    <ToolbarButton title="Unordered list">
      <FontAwesomeIcon icon={faListUl} />
    </ToolbarButton>
    <ToolbarButton title="Ordered list">
      <FontAwesomeIcon icon={faListOl} />
    </ToolbarButton>
  </ControlsGroup>
  <ControlsGroup>
    <ToolbarButton title="Link">
      <FontAwesomeIcon icon={faLink} />
    </ToolbarButton>
    <ToolbarButton title="Table">
      <FontAwesomeIcon icon={faTable} />
    </ToolbarButton>
    <ToolbarButton title="Quote">
      <FontAwesomeIcon icon={faQuoteLeft} />
    </ToolbarButton>
    <ToolbarButton title="Add image">
      <FontAwesomeIcon icon={faImage} />
    </ToolbarButton>
  </ControlsGroup>
  <ControlsGroup>
    <ToolbarButton title="Undo">
      <FontAwesomeIcon icon={faUndo} />
    </ToolbarButton>
    <ToolbarButton title="Redo">
      <FontAwesomeIcon icon={faRedo} />
    </ToolbarButton>
  </ControlsGroup>
</div>;
```
