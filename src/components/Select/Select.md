### Basic

```js
<Select>
  <option value="1">First Option</option>
  <option value="2">Second Option</option>
  <option value="3">Third Option</option>
</Select>
```

### Disabled

```js
<Select disabled>
  <option value="1">First Option</option>
  <option value="2">Second Option</option>
  <option value="3">Third Option</option>
</Select>
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
  <Select size="large">
    <option value="1">First Option</option>
    <option value="2">Second Option</option>
    <option value="3">Third Option</option>
  </Select>
  <Select>
    <option value="1">First Option</option>
    <option value="2">Second Option</option>
    <option value="3">Third Option</option>
  </Select>
  <Select size="small">
    <option value="1">First Option</option>
    <option value="2">Second Option</option>
    <option value="3">Third Option</option>
  </Select>
</Wrapper>;
```
