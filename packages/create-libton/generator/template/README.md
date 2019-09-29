# <%= name %>

[![NPM version](https://badgen.net/npm/v/<%= name %>)](https://npmjs.com/package/<%= name %>)
[![NPM downloads](https://badgen.net/npm/dm/<%= name %>)](https://npmjs.com/package/<%= name %>)

<%= description %>

## Install

```bash
<% if (context.npmClient === 'yarn') { %>yarn add<% } else { %>npm i<% } %> <%= name %>
```

## Usage

```js
import { %= umdName % } from '<%= name %>';

<%= umdName %>();
//=> <%= filename %>
```
