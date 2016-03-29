
var constants = require('./constants')

module.exports = {
  getNewState: getNewState,
  getNewIndex: getNewIndex
}

function getNewState (slides, index) {
  var activeIndex = slides.activeIndex
  var total = slides.size

  // Loop mode
  if (slides.options.loop === true) {
    // If last item is 'current' and we're first
    if (index === 0 && (activeIndex + 1 === total) && total !== 1) {
      return constants.NEXT
    }
    // If first item is 'current' and we're last
    if (total > 2 && (index + 1 === total) && activeIndex === 0) {
      return constants.PREVIOUS
    }
    // No `before`, only `after`
    if (index < activeIndex && index !== activeIndex - 1) {
      return constants.AFTER
    }
  }

  if (index === activeIndex) {
    return constants.CURRENT
  }

  if (index < activeIndex) {
    return (index === activeIndex - 1)
      ? constants.PREVIOUS
      : constants.BEFORE
  }
  if (index > activeIndex) {
    return (index === activeIndex + 1)
      ? constants.NEXT
      : constants.AFTER
  }
}

function getNewIndex (slides, steps) {
  var newIndex = slides.activeIndex + steps

  if (!slides.options.loop) {
    if (newIndex > slides.lastIndex || newIndex < 0) {
      return false
    }
  } else {
    if (newIndex > slides.lastIndex) {
      newIndex = 0
    }
    if (newIndex < 0) {
      newIndex = slides.lastIndex
    }
  }

  return newIndex
}
