```js
const styled = require('styled-components').default;
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').default;
const { faBold } = require('@fortawesome/free-solid-svg-icons/faBold');
const { faItalic } = require('@fortawesome/free-solid-svg-icons/faItalic');
const { faUnderline } = require('@fortawesome/free-solid-svg-icons/faUnderline');

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin-right: 8px;
  }
`;

<Wrapper>
  <ToolbarButton title="Bold (\u2318B)">
    <FontAwesomeIcon icon={faBold} />
  </ToolbarButton>
  <ToolbarButton title="Italic (\u2318I)" isActive>
    <FontAwesomeIcon icon={faItalic} />
  </ToolbarButton>
  <ToolbarButton title="Underline (\u2318U)" isDisabled>
    <FontAwesomeIcon icon={faUnderline} />
  </ToolbarButton>
  <ToolbarButton>Heading 1</ToolbarButton>
</Wrapper>;
```
