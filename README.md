# Slides

This is meant to be used as a foundation for building slideshows in JavaScript.

# Install

<mark>TODO</mark>

```
npm ???
```

# Usage

```js
var Slides = require('???')

// `elements` should be an array of objects (DOM nodes, for instance)
var slides = new Slides(elements)

// `move` triggers every time the slides change position
slides.on('move', function (steps) {
  // `steps` is usually 1 or -1 (backwards)

  // Here you could update a counter
  counterEL.textContent = `${slides.current.index + 1}`/`${slides.size}`
})

// `update` triggers on every move, for every element that changes state
// `state` is a string and there’s 5 types:
// current, next, previous, before and after
slides.on('update', function (el, previousState) {
  // Here you could show the current element, and hide all others
  // (for the most basic kind of slideshow)
  el.classList.add(el.state)
  el.classList.remove(previousState)
})

slides.update() // bootstrap state, call once

slides.move() // one step forward
slides.move(-1) // a step backwards

slides.moveTo(slides.first.index) // back to the first slide
```

This library doesn't do **anything** to `elements` other than:

- add an `index` property
- add a `state` property and update it accordingly

It's up to you to handle your DOM nodes in any way you like to make the slideshow, well, do something.

# API

### `new Slides(elements[, options])`

- `elements` *Array*
- `options` *Object*
  - `loop` *Boolean* Run the slides in loop mode or not. Default `false`.

The `slides` instance is an EventEmitter (node.js API).

## Events

- `move` (steps) Triggered once for every slideshow move.
- `update` (el, previousState) Triggered on every move, for every element whose state has changed.

## Methods

Feel free to add methods to `Slides.prototype` to extend its funcionality.

### `update()`

Call this after setting up event listeners. This basically updates (mutates) the elements’ `state` property.

### `move([steps])`

- `steps` *Integer* How many steps the slides show move.

### `moveTo(index)`

- `index` *Integer*

## Properties

- **size** *Integer*
- **current** *Element*
- **next** *Element*
- **previous** *Element*
- **first** *Element*
- **last** *Element*

### State constants in constructor `Slides`

- `BEFORE`
- `PREVIOUS`
- `CURRENT`
- `NEXT`
- `AFTER`

# License

MIT
