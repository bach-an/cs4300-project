const RED_HEX = "#FF0000"
const RED_RGB = webglUtils.hexToRgb(RED_HEX)
const BLUE_HEX = "#0000FF"
const BLUE_RGB = webglUtils.hexToRgb(BLUE_HEX)
const GREEN_HEX = "#00FF00"
const GREEN_RGB = webglUtils.hexToRgb(GREEN_HEX)
const RECTANGLE = "RECTANGLE"

const origin = {x: 0, y: 0, z: 0}
const sizeOne = {width: 1, height: 1, depth: 1}
const PLATFORM = "PLATFORM"

let shapes = [
  {
    type: PLATFORM,
    position: origin,
    dimensions: sizeOne,
    color: BLUE_RGB,
    translation: {x:  0, y: 0, z: 0},
    scale:       {x:   0.5, y:   0.5, z:   0.5},
    rotation:    {x:   0, y:  0, z:   0},
  }
]
