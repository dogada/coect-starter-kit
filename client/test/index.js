'use strict';

var riot = require('riot')

require('./tags/todo.tag')

function mount() {
  riot.mount('todo', {
    title: 'I want to behave!',
    items: [
      { title: 'Avoid excessive coffeine', done: true},
      { title: 'Hidden item', hidden: true},
      { title: 'Be less provocative'},
      { title: 'Be nice to people'}
    ]
  })
}


module.exports = {
  mount: mount
}
