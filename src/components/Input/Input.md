```jsx
<div style={{ maxWidth: 320 }}>
  <Input style={{ marginBottom: '1em' }} size="small" />
  <Input style={{ marginBottom: '1em' }} />
  <Input size="large" />
</div>
```

### Input with icon

```jsx
const faLock = require('@fortawesome/fontawesome-free-solid/faLock');

<div style={{ maxWidth: 320 }}>
  <Input style={{ marginBottom: '1em' }} size="small" icon={faLock} />
  <Input style={{ marginBottom: '1em' }} icon={faLock} />
  <Input size="large" icon={faLock} />
</div>;
```

### Input with clear button

```jsx
<div style={{ maxWidth: 320 }}>
  <Input style={{ marginBottom: '1em' }} size="small" shouldShowClearButton />
  <Input style={{ marginBottom: '1em' }} shouldShowClearButton />
  <Input size="large" shouldShowClearButton />
</div>
```

### Disabled state

```jsx
const faLock = require('@fortawesome/fontawesome-free-solid/faLock');

<Input style={{ maxWidth: 320 }} disabled icon={faLock} shouldShowClearButton />;
```
