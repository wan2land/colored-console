Colored Console
===

![Example](example.png)

## Install

### npm

```bash
$ npm install colored-console
```

## How To Use

```js
var ColoredConsole = require('colored-console');
console.log(ColoredConsole("plain <c:red>Hel<b:blue>l</b:blue>o World</c:red>").parse());
```

or

```js
var ColoredConsole = require('colored-console');
console.log(new ColoredConsole("plain <c:red>Hel<b:blue>l</b:blue>o World</c:red>").parse());
```

## Tags

### color codes list

- black
- red
- green
- yellow
- blue
- purple
- cyan
- gray
- sblack
- sred
- sgreen
- syellow
- sblue
- spurple
- scyan
- sgray

### `<c:{colorCode}>` or `<color:{colorCode}>`

Change font color.

### `<b:{colorCode}>` or `<background:{colorCode}>`

Change background color.

### `<b>` or `<strong>`

Apply bold text.

### `<u>` or `<underline>`

Apply underlined text.


