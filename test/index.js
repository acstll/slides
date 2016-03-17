
var test = require('tape')

var Slides = require('../')
var c = Slides // constants

test('State updates (no loop)', function (t) {
  var elements = [{}, {}, {}, {}]
  var slides = new Slides(elements)

  t.equal(slides.activeIndex, 0)
  t.equal(slides.currentElement, elements[0])
  t.equal(slides.currentElement.state, null)

  slides.run()

  t.equal(slides.currentElement.state, c.CURRENT)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.PREVIOUS)
  t.equal(slides.elements[1].state, c.CURRENT)
  t.equal(slides.elements[2].state, c.NEXT)
  t.equal(slides.elements[3].state, c.AFTER)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.BEFORE)
  t.equal(slides.elements[1].state, c.PREVIOUS)
  t.equal(slides.elements[2].state, c.CURRENT)
  t.equal(slides.elements[3].state, c.NEXT)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.BEFORE)
  t.equal(slides.elements[1].state, c.BEFORE)
  t.equal(slides.elements[2].state, c.PREVIOUS)
  t.equal(slides.elements[3].state, c.CURRENT)

  t.equal(slides.move(), false)

  t.equal(slides.move(-1), true)
  t.equal(slides.elements[0].state, c.BEFORE)
  t.equal(slides.elements[1].state, c.PREVIOUS)
  t.equal(slides.elements[2].state, c.CURRENT)
  t.equal(slides.elements[3].state, c.NEXT)

  t.end()
})

test('State updates (loop)', function (t) {
  var elements = [{}, {}, {}, {}]
  var slides = new Slides(elements, { loop: true })

  t.equal(slides.activeIndex, 0)
  t.equal(slides.currentElement, elements[0])
  t.equal(slides.currentElement.state, null)

  slides.run()

  t.equal(slides.currentElement.state, c.CURRENT)

  // There's no BEFORE state in loop mode, "always forward"

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.PREVIOUS)
  t.equal(slides.elements[1].state, c.CURRENT)
  t.equal(slides.elements[2].state, c.NEXT)
  t.equal(slides.elements[3].state, c.AFTER)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.AFTER)
  t.equal(slides.elements[1].state, c.PREVIOUS)
  t.equal(slides.elements[2].state, c.CURRENT)
  t.equal(slides.elements[3].state, c.NEXT)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.NEXT)
  t.equal(slides.elements[1].state, c.AFTER)
  t.equal(slides.elements[2].state, c.PREVIOUS)
  t.equal(slides.elements[3].state, c.CURRENT)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.CURRENT)
  t.equal(slides.elements[1].state, c.NEXT)
  t.equal(slides.elements[2].state, c.AFTER)
  t.equal(slides.elements[3].state, c.PREVIOUS)

  t.end()
})

test('State updates (only 2 slides)', function (t) {
  var elements = [{}, {}]
  var slides = new Slides(elements)

  slides.run()

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.PREVIOUS)
  t.equal(slides.elements[1].state, c.CURRENT)

  t.equal(slides.move(), false)

  t.equal(slides.move(-1), true)
  t.equal(slides.elements[0].state, c.CURRENT)
  t.equal(slides.elements[1].state, c.NEXT)

  // Loop

  slides = new Slides(elements, { loop: true })
  slides.run()

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.NEXT)
  t.equal(slides.elements[1].state, c.CURRENT)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.CURRENT)
  t.equal(slides.elements[1].state, c.NEXT)

  t.end()
})

test('Events fire', function (t) {
  var elements = [{}, {}, {}]
  var slides = new Slides(elements, { loop: true })

  t.plan(7)

  slides.once('update', function onChange (el, previousState) {
    t.pass('update')
    t.equal(typeof el, 'object')
    t.equal(previousState, null)
  })

  slides.run()

  slides.on('move', function onMove (steps) {
    t.equal(steps, 2, 'move')
  })

  slides.once('update', function onChange (el, previousState) {
    t.pass('update')
    t.equal(typeof el, 'object')
    t.equal(typeof previousState, 'string')
  })

  slides.move(2)

  t.end()
})