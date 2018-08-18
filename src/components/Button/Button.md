### Default button

```js
const styled = require('styled-components').default;
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').default;
const { faGift, faArrowRight, faHeart } = require('@fortawesome/free-solid-svg-icons');

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > * {
    margin: 4px;
  }
`;
const Icon = styled(FontAwesomeIcon)`
  margin: 0 0 0 0.5em;
`;

<Wrapper>
  <Button>Default</Button>
  <Button icon={faGift}>Default</Button>
  <Button>
    Default <Icon icon={faArrowRight} />
  </Button>
  <Button icon={faHeart} />
  <Button disabled>Disabled</Button>
</Wrapper>;
```

### Text Button

```js
const styled = require('styled-components').default;
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').default;
const { faGift, faArrowRight, faHeart } = require('@fortawesome/free-solid-svg-icons');

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > * {
    margin: 4px;
  }
`;
const Icon = styled(FontAwesomeIcon)`
  margin: 0 0 0 0.5em;
`;

<Wrapper>
  <Button variant="text">Text</Button>
  <Button icon={faGift} variant="text">
    Text
  </Button>
  <Button variant="text">
    Text <Icon icon={faArrowRight} />
  </Button>
  <Button icon={faHeart} variant="text" />
  <Button variant="text" disabled>
    Text
  </Button>
</Wrapper>;
```

### Outlined button

```js
const styled = require('styled-components').default;
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').default;
const { faGift, faArrowRight, faHeart } = require('@fortawesome/free-solid-svg-icons');

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > * {
    margin: 4px;
  }
`;
const Icon = styled(FontAwesomeIcon)`
  margin: 0 0 0 0.5em;
`;

<Wrapper>
  <Button variant="outlined">Outlined</Button>
  <Button icon={faGift} variant="outlined">
    Outlined
  </Button>
  <Button variant="outlined">
    Outlined <Icon icon={faArrowRight} />
  </Button>
  <Button icon={faHeart} variant="outlined" />
  <Button variant="outlined" disabled>
    Outlined
  </Button>
</Wrapper>;
```
