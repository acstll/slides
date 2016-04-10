/* global NodeList, HTMLCollection */

var test = require('tape')
var Slides = require('../')

before()

test('Slides takes DOM collections', function (t) {
  var slides

  slides = new Slides(document.querySelectorAll('li'))
  t.equal(slides.size, 3, 'querySelectorAll')
  t.equal(slides.current.tagName, 'LI')
  t.ok(slides.elements instanceof NodeList)

  slides = new Slides(document.querySelector('ul').children)
  t.equal(slides.size, 3, '.children')
  t.equal(slides.current.tagName, 'LI')
  t.ok(slides.elements instanceof HTMLCollection)

  slides.move()
  t.equal(slides.current.textContent, '2', 'and it works')

  t.end()
})

function before () {
  var container = document.createElement('div')
  container.innerHTML = '<ul><li>1</li><li>2</li><li>3</li></ul>'
  document.body.appendChild(container)
}
