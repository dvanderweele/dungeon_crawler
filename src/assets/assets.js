/* eslint-disable no-undef */

import Carved_01 from './Carved_01.png'
import Uncarved_01 from './Uncarved_01.png'
import Up_Button from './up_button.png'
import Right_Button from './right_button.png'
import Down_Button from './down_button.png'
import Left_Button from './left_button.png'
import Character_01 from './Character_01.png'

export default function load(){
  loadSprit('carved', Carved_01)
  loadSprite('uncarved', Uncarved_01)
  loadSprite('up_btn', Up_Button)
  loadSprite('right_btn', Right_Button)
  loadSprite('down_btn', Down_Button)
  loadSprite('left_btn', Left_Button)
  loadSprite('my_guy', Character_01, {
    sliceX: 4,
    sliceY: 4,
    anims: {
      go_up: {
        from: 0,
        to: 3
      },
      go_down: {
        from: 4,
        to: 7
      },
      go_right: {
        from: 8,
        to: 11
      },
      go_left: {
        from: 12,
        to: 15
      },
      idle_up: {
        from: 0,
        to: 0
      },
      idle_down: {
        from: 4,
        to: 4
      },
      idle_right: {
        from: 8,
        to: 8
      },
      idle_left: {
        from: 12,
        to: 12
      }
    }
  })
}
