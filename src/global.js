import kaboom from "kaboom"
import define from './scenes'
import load from "./assets"

let w, h, sc, or
/*
 * w = width, canvas pixels
 * h = height, canvas pixels
 * sc = factor to scale canvas to size of viewport
 * or = orientation, 'landscape' || 'portrait'
 */

function calc_dims(){
  or = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  const canvas_root_dim = 128
  if(or === 'landscape'){
    h = canvas_root_dim
    sc = window.innerheight / h
    w = (window.innerWidth / window.innerHeight) * h
  } else {
    w = canvas_root_dim
    sc = window.innerWidth / w
    h = (window.innerHeight / window.innerWidth) * w
  }
}

calc_dims()

const k = kaboom({
  global: true,
  width: w,
  height: h,
  scale: sc,
  crisp: true,
  debug: true,
  clearColor: [0, 0, 0, 1]
})

load()
define()

export default k
