export function global_cell_coords(col, row){
  return {
    x(){
      return col
    },
    y(){
      return row
    }
  }
}

export function local_cell_coords(col, row){
  return {
    x(){
      return col
    },
    y(){
      return row
    }
  }
}
