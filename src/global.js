import kaboom from "kaboom"
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
    w = canvas_root_dim
    sc = window.innerWidth / w
    h = (window.innerWidth / window.innerHeight) * w
  } else {
    h = canvas_root_dim
    sc = window.innerHeight / h
    w = (window.innerHeight / window.innerWidth) * h
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

export default k
