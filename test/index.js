
var test = require('tape')
var Slides = require('../')
var c = Slides // constants

test('State updates (no loop)', function (t) {
  var elements = [{}, {}, {}, {}]
  var slides = new Slides(elements)

  t.equal(slides.activeIndex, 0)
  t.equal(slides.current, elements[0])
  t.equal(slides.current.state, null)

  slides.update()

  t.equal(slides.current.state, c.CURRENT)

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
  t.equal(slides.current, elements[0])
  t.equal(slides.current.state, null)

  slides.update()

  t.equal(slides.current.state, c.CURRENT)

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

  slides.update()

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.PREVIOUS)
  t.equal(slides.elements[1].state, c.CURRENT)

  t.equal(slides.move(), false)

  t.equal(slides.move(-1), true)
  t.equal(slides.elements[0].state, c.CURRENT)
  t.equal(slides.elements[1].state, c.NEXT)

  // Loop

  slides = new Slides(elements, { loop: true })
  slides.update()

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.NEXT)
  t.equal(slides.elements[1].state, c.CURRENT)

  t.equal(slides.move(), true)
  t.equal(slides.elements[0].state, c.CURRENT)
  t.equal(slides.elements[1].state, c.NEXT)

  t.end()
})

test('State updates (only 1 slide)', function (t) {
  var elements = [{}]
  var slides = new Slides(elements)

  slides.update()
  t.equal(slides.elements[0].state, c.CURRENT)

  t.equal(slides.move(), false)
  t.equal(slides.move(-1), false)

  // Loop

  slides = new Slides(elements, { loop: true })
  slides.update()
  t.equal(slides.elements[0].state, c.CURRENT)

  t.equal(slides.move(), false)
  t.equal(slides.move(-1), false)

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

  slides.update()

  slides.on('move', function onMove (steps) {
    t.equal(steps, 2, 'move')
  })

  slides.once('update', function onChange (el, previousState) {
    t.pass('update')
    t.equal(typeof el, 'object')
    t.equal(typeof previousState, 'string')
  })

  slides.move(2)
})

test('moveTo', function (t) {
  var elements = [{}, {}, {}, {}]
  var slides = new Slides(elements).update()

  t.plan(8)

  slides.once('move', function (steps) {
    t.pass('fires `move` event')
    t.equal(steps, 3)
    t.equal(slides.current, elements[3])
  })

  t.equal(slides.moveTo(3), true)

  slides.once('move', function (steps) {
    t.equal(steps, -1)
    t.equal(slides.current, elements[2])
  })

  t.equal(slides.moveTo(2), true)

  t.equal(slides.moveTo(6), false)
})

test('Position properties', function (t) {
  var elements = [{}, {}, {}, {}, {}]
  var slides = new Slides(elements, { loop: true }).update()

  t.equal(slides.first, elements[0], 'first')
  t.equal(slides.last, elements[elements.length - 1], 'last')
  t.equal(slides.next, elements[1], 'next')
  t.equal(slides.previous, elements[4], 'previous')

  slides = new Slides(elements, { loop: false }).update()
  slides.moveTo(4)

  t.equal(slides.next, null, 'next')
  t.equal(slides.previous, elements[3], 'previous')

  t.end()
})

test('Slides takes only Arrays or Array-like', function (t) {
  t.throws(function () {
    var slides = new Slides(1)
  }, 'throws otherwise')

  t.end()
})
