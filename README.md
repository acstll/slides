# Slides

Slideshow utility.

# Install

<mark>TODO</mark>

```
npm ???
```

# Usage

```js
var slides = new Slides(elements)

slides.on('move', function (steps) {
  // ..
})

slides.on('update', function (el, previousState) {
  // ..
})

slides.run() // bootstrap state, call once

slides.move() // one step forward
slides.move(-1) // a step backwards
```

# License

MIT
