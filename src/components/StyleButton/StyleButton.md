```jsx
const FontAwesomeIcon = require('@fortawesome/react-fontawesome/index');
const faBold = require('@fortawesome/fontawesome-free-solid/faBold');

<div style={{ display: 'flex' }}>
  <StyleButton style={{ marginRight: 8 }} title="Bold (\u2318B)">
    <FontAwesomeIcon icon={faBold} />
  </StyleButton>
  <StyleButton title="Heading 1">Heading 1</StyleButton>
</div>;
```

### Disabled state

```jsx
const FontAwesomeIcon = require('@fortawesome/react-fontawesome/index');
const faBold = require('@fortawesome/fontawesome-free-solid/faBold');

<div style={{ display: 'flex' }}>
  <StyleButton style={{ marginRight: 8 }} title="Bold (\u2318B)" disabled>
    <FontAwesomeIcon icon={faBold} />
  </StyleButton>
  <StyleButton active disabled title="Heading 1">
    Heading 1
  </StyleButton>
</div>;
```

### Active state

```jsx
const FontAwesomeIcon = require('@fortawesome/react-fontawesome/index');
const faBold = require('@fortawesome/fontawesome-free-solid/faBold');

<div style={{ display: 'flex' }}>
  <StyleButton style={{ marginRight: 8 }} title="Bold (\u2318B)" active>
    <FontAwesomeIcon icon={faBold} />
  </StyleButton>
  <StyleButton active title="Heading 1">
    Heading 1
  </StyleButton>
</div>;
```
