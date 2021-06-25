/* eslint-disable no-undef */
import k from "./global"
import Miner from './nystrom'

const b = document.querySelector('body')
b.style.backgroundColor = '#000000'
b.style.margin = '0'

k.scene('hello', () => {
  const center_x = Math.floor(width() / 2)
  const center_y = Math.floor(height() / 2)
  add([
    text("Dungeons", 10),
    color(rgba(1, 0, 0, 1)),
    origin('bot'),
    pos(center_x, center_y - 10),
  ]);
  add([
    text("by 'veezy", 7),
    color(rgba(1, 1, 1, 1)),
    origin('center'),
    pos(center_x, center_y)
  ])
  let last = '...'
  const lt = add([
    text(`Loading ${last}`, 4),
    color(rgb(1, 1, 1)),
    origin('topleft'),
    pos(center_x - Math.floor(11 * 4 / 2), center_y + 10)
  ])
  loop(0.4, () => {
    if(last === '...'){
      last = ''
    } else if(last === ''){
      last = '.'
    } else if(last === '.'){
      last = '..'
    } else {
      last = '...'
    }
    lt.color = rgb(rand(), rand(), rand)
    lt.text = `Loading ${last}`
  })
  const m = new Miner(35, 35, 200)
  const crawlr = add([
    text(m.state, 4),
    color(rgb(1, 1, 1)),
    origin('top'),
    pos(center_x, center_y + 20)
  ])
  render(() => {
    if(!m.done){
      m.step()
      crawlr.text = m.state
    } else {
      crawlr.text = m.state
      wait(1, () => {
        go('explore', m)
      })
    }
  })
})

k.start('hello')
