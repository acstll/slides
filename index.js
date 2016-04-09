var extend = require('xtend')
var assign = require('xtend/mutable')
var inherits = require('inherits')
var EventEmitter = require('eventemitter3')

var getNewIndex = require('./helpers').getNewIndex
var getNewState = require('./helpers').getNewState
var constants = require('./constants')

var defaults = { loop: false }

/*
  Events:
  - 'move' (steps)
  - 'update' (el, previousState)
*/

module.exports = assign(Slides, constants)

function Slides (elements, options) {
  var self = this

  if (typeof elements.length === 'undefined') {
    throw new Error('The first argument is expected to be an Array or an Array-like object')
  }

  forEach(elements, function (el, index) {
    el.index = index
    el.state = null
  })

  self.options = extend(defaults, options || {})
  self.elements = elements
  self.activeIndex = 0
  self.lastIndex = elements.length ? elements.length - 1 : null

  EventEmitter.call(self)
}

inherits(Slides, EventEmitter)

Slides.defaults = defaults

Object.defineProperty(Slides.prototype, 'current', {
  get: function () {
    var self = this
    return self.elements[self.activeIndex]
  }
})

Object.defineProperty(Slides.prototype, 'next', {
  get: function () {
    return getElementBySteps(this, 1)
  }
})

Object.defineProperty(Slides.prototype, 'previous', {
  get: function () {
    return getElementBySteps(this, -1)
  }
})

Object.defineProperty(Slides.prototype, 'first', {
  get: function () {
    return this.elements[0]
  }
})

Object.defineProperty(Slides.prototype, 'last', {
  get: function () {
    var self = this
    return self.elements[self.size - 1]
  }
})

Object.defineProperty(Slides.prototype, 'size', {
  get: function () {
    return this.elements.length
  }
})

Slides.prototype.update = function update () {
  return updateState(this)
}

Slides.prototype.move = function move (steps) {
  steps = steps || 1
  var self = this
  var newIndex = getNewIndex(self, steps)

  if (newIndex === false || self.size <= 1) {
    return false
  }

  self.activeIndex = newIndex
  self.emit('move', steps)
  updateState(self)

  return true
}

Slides.prototype.moveTo = function moveTo (index) {
  var self = this
  var oldIndex, steps

  if (index >= self.size) {
    return false
  }

  oldIndex = self.activeIndex
  steps = index > oldIndex ? oldIndex + index : index - oldIndex
  self.activeIndex = index
  self.emit('move', steps)
  updateState(self)

  return true
}

function updateState (slides) {
  forEach(slides.elements, function (el) {
    var previousState = el.state
    var newState = getNewState(slides, el.index)

    if (previousState !== newState) {
      el.state = newState
      slides.emit('update', el, previousState)
    }
  })

  return slides
}

function getElementBySteps (slides, steps) {
  var nextIndex = getNewIndex(slides, steps)

  if (nextIndex === false) {
    return null
  }

  return slides.elements[nextIndex]
}

function forEach (collection, fn) {
  Array.prototype.forEach.call(collection, fn)
}
