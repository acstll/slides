/* global HTMLCollection */

var extend = require('xtend')
var assign = require('xtend/mutable')
var inherits = require('inherits')
var EventEmitter = require('eventemitter3')

var moveIndex = require('./helpers').moveIndex
var changeState = require('./helpers').changeState
var constants = require('./constants')

var defaults = { loop: false }

/*
  TODO
  - add getter `nextElement` and `previousElement`
  - implement `moveTo` method
*/

/*
  Events:
  - 'move' (steps)
  - 'update' (el, previousState)
*/

module.exports = assign(Slides, constants)

function Slides (elements, options) {
  var self = this

  if (typeof HTMLCollection !== 'undefined' && elements instanceof HTMLCollection) {
    elements = [].slice.call(elements, 0)
  }
  elements.forEach(function (el, index) {
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

Object.defineProperty(Slides.prototype, 'currentElement', {
  get: function () {
    var self = this
    return self.elements[self.activeIndex]
  }
})

// Object.defineProperty(Slides.prototype, 'nextElement', {
//   get: function () {
//     var self = this
//   }
// })

// Object.defineProperty(Slides.prototype, 'previousElement', {
//   get: function () {
//     var self = this
//   }
// })

Object.defineProperty(Slides.prototype, 'size', {
  get: function () {
    return this.elements.length
  }
})

Slides.prototype.run = function run () {
  updateState(this)
}

Slides.prototype.move = function move (steps) {
  steps = steps || 1
  var self = this
  var newIndex = moveIndex(self, steps)

  if (newIndex === false || self.size === 0) {
    return false
  }

  self.activeIndex = newIndex
  self.emit('move', steps)
  updateState(self)

  return true
}

function updateState (slides, steps) {
  slides.elements.forEach(function (el) {
    var previousState = el.state
    var newState = changeState(slides, el.index)

    if (previousState !== newState) {
      el.state = newState
      slides.emit('update', el, previousState)
    }
  })
}
