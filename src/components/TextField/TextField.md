### Basic

```js
<TextField />
```

### Disabled

```js
<TextField disabled />
```

### Sizes

```js
const styled = require('styled-components').default;

const Wrapper = styled.div`
  display: flex;

  > * {
    margin: 4px 8px;
  }
`;

<Wrapper>
  <TextField size="large" placeholder="Write something..." />
  <TextField size="medium" placeholder="Write something..." />
  <TextField size="small" placeholder="Write something..." />
</Wrapper>;
```

### With icon

```js
const styled = require('styled-components').default;
const { faSearch } = require('@fortawesome/free-solid-svg-icons/faSearch');
const { faEye } = require('@fortawesome/free-solid-svg-icons/faEye');

const Wrapper = styled.div`
  display: flex;

  > * {
    margin: 4px 8px;
  }
`;

<Wrapper>
  <TextField placeholder="Write something..." leadingIcon={faSearch} />
  <TextField placeholder="Write something..." trailingIcon={faEye} />
</Wrapper>;
```
