```jsx
const FontAwesomeIcon = require('@fortawesome/react-fontawesome/index');
const {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
} = require('@fortawesome/fontawesome-free-solid');

<div>
  <StyleButton style="BOLD" tooltip="Bold (\u2318B)">
    <FontAwesomeIcon icon={faBold} />
  </StyleButton>
  <StyleButton style="ITALIC" tooltip="Italic (\u2318I)">
    <FontAwesomeIcon icon={faItalic} />
  </StyleButton>
  <StyleButton style="UNDERLINE" tooltip="Underline (\u2318U)">
    <FontAwesomeIcon icon={faUnderline} />
  </StyleButton>
</div>;
```

### Disabled

```jsx
const FontAwesomeIcon = require('@fortawesome/react-fontawesome/index');
const {
  faBold,
  faItalic,
  faUnderline,
} = require('@fortawesome/fontawesome-free-solid');

<div>
  <StyleButton style="BOLD" disabled>
    <FontAwesomeIcon icon={faBold} />
  </StyleButton>
  <StyleButton style="ITALIC" disabled>
    <FontAwesomeIcon icon={faItalic} />
  </StyleButton>
  <StyleButton style="UNDERLINE" disabled>
    <FontAwesomeIcon icon={faUnderline} />
  </StyleButton>
</div>;
```

### Active

```jsx
const FontAwesomeIcon = require('@fortawesome/react-fontawesome/index');
const {
  faBold,
  faItalic,
  faUnderline,
} = require('@fortawesome/fontawesome-free-solid');

<div>
  <StyleButton style="BOLD" tooltip="Bold (\u2318B)" active>
    <FontAwesomeIcon icon={faBold} />
  </StyleButton>
  <StyleButton style="ITALIC" tooltip="Italic (\u2318I)" active>
    <FontAwesomeIcon icon={faItalic} />
  </StyleButton>
  <StyleButton style="UNDERLINE" tooltip="Underline (\u2318U)" active>
    <FontAwesomeIcon icon={faUnderline} />
  </StyleButton>
</div>;
```
