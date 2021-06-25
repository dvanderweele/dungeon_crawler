/* eslint-disable no-undef */

export default class Miner {
  constructor(rows, cols, roomTries){
    this.g = new Grid(cols, rows)
    this.max_room_dim = Math.floor(Math.min(cols, rows) / 5)
    this.roomRegistry = []
    this.vertsPerRow = Math.floor(this.g.width / 2) 
    this.vertsPerCol = Math.floor(this.g.height / 2) 
    this.numVertices = this.vertsPerRow * this.vertsPerCol
    this.crawlStack = [this.g.getIdx(...this.randStartingVert())]
    this.roomsLinked = 0
    this.trimmed = false
    this.next = []
    this.roomTries = roomTries
    this.tries = 0
  }

  validRoomBorders(x, y, w, h){
    let valid = true 
    for(let px = 0; px < x + w + 2; px++){
      if(this.g.isBorder(x, y - 1)){
        break
      } else {
        if(this.g.isCarved(px, y - 2)){
          valid = false
          break
        }
      }
      px++
    }
    for(let py = 0; py < y + h + 2; py++){
      if(!valid || this.g.isBorder(x + w, y)){
        break
      } else {
        if(this.g.isCarved(x + w + 1, py)){
          valid = false
          break
        }
      }
      py++
    }
    for(let px = x + w - 1; px >= x - 2; px--){
      if(!valid || this.g.isBorder(x, y + h + 1)){
        break
      } else {
        if(this.g.isCarved(px, y + h + 2)){
          valid = false
          break
        }
      }
      px--
    }
    for(let py = y + h + 1; py >= y - 2; py--){
      if(!valid || this.g.isBorder(x - 1, y)){
        break
      } else {
        if(this.g.isCarved(x - 2, py)){
          valid = false
          break
        }
      }
      py--
    }
    return valid
  }

  tryPlaceRoom(){
    let w = Math.floor(rand(3, this.max_room_dim + 1))
    w = w % 2 === 0 ? w - 1 : w
    let h = Math.floor(rand(3, this.max_room_dim + 1))
    h = h % 2 === 0 ? h - 1 : h
    let startx = Math.floor(rand(2, this.g.width))
    startx = startx % 2 === 0 ? startx : startx - 1
    let starty = Math.floor(rand(2, this.g.height))
    starty = starty % 2 === 0 ? starty : starty - 1
    let invalid = false
    if(startx + w - 1 < this.g.width && starty + h - 1 < this.g.height){
      for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
          if(startx + x >= this.g.width || starty + y >= this.g.height){
            invalid = true
          }
          if(this.g.isCarved(x+startx, y+starty)){
            invalid = true
          }
          if(invalid){
            break
          }
        }
        if(invalid){
          break
        }
      }
      if(!invalid && !this.validRoomBorders(startx, starty, w, h)){
        invalid = true
      }
      if(!invalid){
        this.roomRegistry.push({
          'x': startx,
          'y':starty,
          'w': w,
          'h': h
        })
        for(let y = 0; y < h; y++){
          for(let x = 0; x < w; x++){
            this.g.carve(x+startx, y+starty)
            this.g.dirty(x+startx, y+starty)
          }
        }
      }
    }
  }
    
  randStartingVert(){
    let i, y, x
    do {
      i = Math.floor(rand(1, this.numVertices))
      y = Math.floor(i / this.vertsPerRow) * 2 + 2
      if(i <= this.vertsPerRow){
        x = i * 2
      } else if(i % this.vertsPerRow === 0){
        x = this.vertsPerRow
      } else {
        x = (i - (this.vertsPerRow * Math.floor(i / this.vertsPerRow))) * 2
      }
    } while(this.g.isCarved(x, y) || this.g.isBorder(x, y) || !this.g.isVertex(x, y))
    return [x, y]
  }

  validNeighbor(x, y, d){
    /*
     * 1 — north
     * 2 — east
     * 3 — south
     * 4 or * - west
     */
    if(d===1){
      return !this.g.isBorder(x, y - 1) && !this.g.isCarved(x, y - 1) && !this.g.isBorder(x, y - 2) && !this.g.isCarved(x, y - 2)
    } else if(d===2){
      return !this.g.isBorder(x + 1, y) && !this.g.isCarved(x + 1, y) && !this.g.isBorder(x + 2, y) && !this.g.isCarved(x + 2, y)
    } else if(d===3){
      return !this.g.isBorder(x, y + 1) && !this.g.isCarved(x, y + 1) && !this.g.isBorder(x, y + 2) && !this.g.isCarved(x, y + 2)
    } else {
      return !this.g.isBorder(x - 1, y) && !this.g.isCarved(x - 1, y) && !this.g.isBorder(x - 2, y) && !this.g.isCarved(x - 2, y)
    }
  }
    
  crawl(){
    if(this.crawlStack.length > 0){
      const x = this.g.colOf(this.crawlStack[this.crawlStack.length-1])
      const y = this.g.rowOf(this.crawlStack[this.crawlStack.length-1])
      const options = []
      this.validNeighbor(x, y, 1) && options.push([
        this.g.getIdx(x, y - 1),
        this.g.getIdx(x, y - 2)
      ])
      this.validNeighbor(x, y, 2) && options.push([
        this.g.getIdx(x + 1, y),
        this.g.getIdx(x + 2, y)
      ])
      this.validNeighbor(x, y, 3) && options.push([
        this.g.getIdx(x, y + 1),
        this.g.getIdx(x, y + 2)
      ])
      this.validNeighbor(x, y, 4) && options.push([
        this.g.getIdx(x - 1, y),
        this.g.getIdx(x - 2, y)
      ])
      if(!this.g.isCarved(x, y)){
        this.g.carve(x, y)
        this.g.dirty(x, y)
      }
      if(options.length > 0){
        const [corridor, neighbor] = choose(options)
        this.g.carve(this.g.colOf(corridor), this.g.rowOf(corridor))
        this.g.dirty(this.g.colOf(corridor), this.g.rowOf(corridor))
        this.g.carve(this.g.colOf(neighbor), this.g.rowOf(neighbor))
        this.g.dirty(this.g.colOf(neighbor), this.g.rowOf(neighbor))
        this.crawlStack.push(neighbor)
      } else {
        this.crawlStack.pop()
      }
    } 
  }

  linkRoom(){
    const r = this.roomRegistry[this.roomsLinked]
        /*
         * ROOM SCHEMA
         * x
         * y
         * w
         * h
         *
         * SIDES LEGEND
         * 1 - North
         * 2 - East
         * 3 - South
         * 4 - West
         */
    const sides = []
    if(!this.g.isBorder(r['x'], r['y'] - 1)){
      sides.push(1)
    } 
    if(!this.g.isBorder(r['x'] + r['w'], r['y'])){
      sides.push(2)
    }
    if(!this.g.isBorder(r['x'], r['y'] + r['h'])){
      sides.push(3)
    }
    if(!this.g.isBorder(r['x'] - 1, r['y'])){
      sides.push(4)
    }
    let s = choose(sides)
    let offset = s % 2 === 0 ? Math.floor(rand(0, r['h'] - 1)) : Math.floor(rand(0, r['w'] - 1))
    if(offset % 2 != 0){
        offset -= 1
    }
    let idx
    if(s === 1){
      const x = r['x'] + offset 
      const y = r['y'] - 1
      this.g.carve(x, y)
      this.g.dirty(x, y)
      this.g.setVertDoor(x, y)
      idx = sides.indexOf(1)
    } else if(s === 2){
      const x = r['x'] + r['w']
      const y = r['y'] + offset
      this.g.carve(x, y)
      this.g.dirty(x, y)
      this.g.setHorzDoor(x, y)
      idx = sides.indexOf(2)
    } else if(s === 3){
      const x = r['x'] + offset
      const y = r['y'] + r['h']
      this.g.carve(x, y)
      this.g.dirty(x, y)
      this.g.setVertDoor(x, y)
      idx = sides.indexOf(3)
    } else {
      const x = r['x'] - 1
      const y = r['y'] + offset
      this.g.carve(x, y)
      this.g.dirty(x, y)
      this.g.setHorzDoor(x, y)
      idx = sides.indexOf(4)
    }
    sides.splice(idx, 1)
    s = choose(sides)
    offset = s % 2 === 0 ? Math.floor(rand(0, r['h'] - 1)) : Math.floor(rand(0, r['w'] - 1))
    if(offset % 2 != 0){
      offset -= 1
    }
    const oneMore = rand() < 0.5
    if(oneMore){
      if(s === 1){
        const x = r['x'] + offset 
        const y = r['y'] - 1
        this.g.carve(x, y)
        this.g.dirty(x, y)
        this.g.setVertDoor(x, y)
      } else if(s === 2){
        const x = r['x'] + r['w']
        const y = r['y'] + offset
        this.g.carve(x, y)
        this.g.dirty(x, y)
        this.g.setHorzDoor(x, y)
      } else if(s === 3){
        const x = r['x'] + offset
        const y = r['y'] + r['h']
        this.g.carve(x, y)
        this.g.dirty(x, y)
        this.g.setVertDoor(x, y)
      } else {
        const x = r['x'] - 1
        const y = r['y'] + offset
        this.g.carve(x, y)
        this.g.dirty(x, y)
        this.g.setHorzDoor(x, y)
      }
    }
    this.roomsLinked++
  }
    
  isDeadend(i){
    const uncarved_sides = []
    const carved_sides = []
    const x = this.g.colOf(i)
    const y = this.g.rowOf(i)
    if(!this.g.isCarved(x, y - 1)){
      uncarved_sides.push(1) 
    } else {
      carved_sides.push(this.g.getIdx(x, y - 1))
    }
    if(!this.g.isCarved(x + 1, y)){
      uncarved_sides.push(2)
    } else {
      carved_sides.push(this.g.getIdx(x + 1, y))
    }
    if(!this.g.isCarved(x, y + 1)){
      uncarved_sides.push(3)
    } else {
      carved_sides.push(this.g.getIdx(x, y + 1))
    }
    if(!this.g.isCarved(x - 1, y)){
      uncarved_sides.push(4)
    } else {
      carved_sides.push(this.g.getIdx(x - 1, y))
    }
    return uncarved_sides.length < 3 ? false : carved_sides[0]
  }

  tryTrimming(){
    if(!this.trimmed){ 
      let oneTrimmed = false
      if(this.next.length < 1){
        // linear search for deadend
        this.g.arr.forEach((v, i) => {
          const res = !this.g.isBorder(i) ? this.isDeadend(i) : null
          if(res){
            const x = this.g.colOf(i)
            const y = this.g.rowOf(i)
            this.g.setCell(x, y, this.g.FILLED)
            this.g.dirty(x, y)
            this.next.push(res)
            oneTrimmed = true 
          } 
        })
      } else {
        // process nexts
        // first validate them
        const tmp = []
        this.next.forEach(v => {
          const res = this.isDeadend(v)
          if(res){
            const x = this.g.colOf(v)
            const y = this.g.rowOf(v)
            this.g.setCell(x, y, this.g.FILLED)
            this.g.dirty(x, y)
            tmp.push(res)
          }
        })
        oneTrimmed = true
        this.next = tmp
      }
      if(!oneTrimmed){
        this.trimmed = true 
      }
    }
  }

  step(){
    if(this.tries < this.roomTries){
      this.tryPlaceRoom()
      this.tries++
    } else if(this.crawlStack.length > 0){
      this.crawl()
    } else if(this.roomsLinked < this.roomRegistry.length){
      this.linkRoom()
    } else if(!this.trimmed){
      this.tryTrimming()
    }
  }
}

export class Grid {
    /*
     * 0 - filled === 1, carved === 0
     * 1 - if horzDoor === 1, allowing horizontal passage
     * 2 - if vertDoor === 1, allowing vertical passage
     * 3 - undiscovered === 0, discovered === 1
     * 4 - if visited === 1
     * 5 - clean === 0, dirty === 1
     * 6 - if node === 1
     * 7 - if edge === 1
     */
    constructor(cols, rows){
        this.FILLED       = 0B00000001
        this.HORZDOOR     = 0B00000010
        this.VERTDOOR     = 0B00000100
        this.DISCOVERED   = 0B00001000
        this.VISITED      = 0B00010000
        this.CLEAN        = 0B00100000
        this.VERTEX       = 0B01000000
        this.EDGE         = 0B10000000
        if(rows % 2 === 0){
            rows += 1
        }
        if(cols % 2 === 0){
            cols += 1
        }
        this.width = cols
        this.height = rows
        this.arr = new Uint8Array((rows * cols))
        this.arr.fill((this.FILLED | this.CLEAN))
        for(let i = 0; i < this.arr.length; i++){
            const x = this.colOf(i)
            const y = this.rowOf(i)
            if(x % 2 === 0 && y % 2 === 0){
                this.setVertex(x, y)
            }
            if(!this.isBorder(x, y) && x % 2 === 0 && y % 2 === 1){
                this.setEdge(x, y)
            }
            if(!this.isBorder(x, y) && y % 2 === 0 && x % 2 === 1){
                this.setEdge(x, y)
            }
        }
    }
    getIdx(x, y){ // 
        if(x < 1){
            x = 1
        }
        if(y < 1){
            y = 1
        }
        return this.width * (y - 1) + x - 1
    }
    colOf(idx){ //
        return (idx % this.width) + 1
    }
    rowOf(idx){ //
        return Math.floor(idx / this.width) + 1
    }
    getCell(x, y, val){
        return this.arr[this.getIdx(x, y)] & val
    }
    setCell(x, y, val){
        this.arr[this.getIdx(x, y)] |= val
    }
    unsetCell(x, y, val){
        this.arr[this.getIdx(x, y)] &= ~val
    }
    isCarved(x, y){
        return this.getCell(x, y, this.FILLED) != this.FILLED
    }
    carve(x, y){
        this.unsetCell(x, y, this.FILLED)
    }
    isHorzDoor(x, y){
        return this.getCell(x, y, this.HORZDOOR) == this.HORZDOOR
    }
    setHorzDoor(x, y){
        this.setCell(x, y, this.HORZDOOR)
    }
    isVertDoor(x, y){
        return this.getCell(x, y, this.VERTDOOR) == this.VERTDOOR
    }
    setVertDoor(x, y){
        this.setCell(x, y, this.VERTDOOR)
    }
    isDiscovered(x, y){
        return this.getCell(x, y, this.DISCOVERED) == this.DISCOVERED
    }
    setDiscovered(x, y){
        this.setCell(x, y, this.DISCOVERED)
    }
    isVisited(x, y){
        return this.getCell(x, y, this.VISITED) == this.VISITED
    }
    setVisited(x, y){
        this.setCell(x, y, this.VISITED)
    }
    isDirty(x, y){
        return this.getCell(x, y, this.CLEAN) != this.CLEAN
    }
    dirty(x, y){
        this.unsetCell(x, y, this.CLEAN)
    }
    clean(x, y){
        this.setCell(x, y, this.CLEAN)
    }
    isVertex(x, y){
        return this.getCell(x, y, this.VERTEX) == this.VERTEX
    }
    setVertex(x, y){
        this.setCell(x, y, this.VERTEX)
    }
    isEdge(x, y){
        return this.getCell(x, y, this.EDGE) == this.EDGE
    }
    setEdge(x, y){
        this.setCell(x, y, this.EDGE)
    }
    isBorder(x, y){
        return x===1 || x ===this.width || y===1 || y===this.height
    }
}


 
