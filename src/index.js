/* eslint-disable no-undef */
import k from "./global"

document.querySelector('body').style.backgroundColor = '#000000'

k.scene('hello', () => {
  add([
    text("ohhimarx", 32),
    pos(100, 100),
  ]);
})

start('hello')
