
function getWindyValue(x, y, data) {
  var xIndex = Math.round(x)
  var yIindex = Math.round(y)
  var xValue = data[1].data[xIndex]
  var yValue = data[2].data[yIindex]
  return Math.sqrt(xValue * xValue + yValue * yValue)
}

function getWindAngle (u, v) {
  let k = Math.atan2(v,u) * 180 / Math.PI  // atan2 返回从原点(0,0)到(x,y)点的线段与x轴正方向之间的平面角度(弧度值)，也就是Math.atan2(y,x)
  // 经测试，atan2 返回的值，点在1、4象限值为正，否则为负值,取值范围（-pi,pi)
  let g = k
  if(u == 0 && v == 0) {
    g = 99999
  }else if(u >=0){
    if(v >=0){
      g = 90 -k
    } else {
      g = 90 + Math.abs(k)
    }
  } else {
    if(v >= 0){
      g =360 - (k - 90)
    }else{
      g = 90 + Math.abs(k)
    }
  }
  return g
}

function getWindDirection(angle) {
  let direction = ''
  if(angle <= 11.25 || angle >348.76){
    direction = '北'
  } else if(angle > 11.25 && angle <=33.75) {
    direction = '东北偏北'
  } else if(angle > 33.75 && angle <=56.25) {
    direction = '东北'
  } else if(angle > 56.25 && angle <=78.75) {
    direction = '东北偏东'
  } else if(angle > 78.75 && angle <=101.25) {
    direction = '东'
  } else if(angle > 101.25 && angle <=123.75) {
    direction = '东南偏东'
  } else if(angle > 123.75 && angle <=146.25) {
    direction = '东南'
  } else if(angle > 146.25 && angle <=168.75) {
    direction = '东南偏南'
  } else if(angle > 168.75 && angle <=191.25) {
    direction = '南'
  } else if(angle > 191.25 && angle <=213.75) {
    direction = '西南偏南'
  } else if(angle > 213.75 && angle <=236.25) {
    direction = '西南'
  } else if(angle > 236.25 && angle <=258.75) {
    direction = '西南偏西'
  } else if(angle > 258.75 && angle <=281.25) {
    direction = '西'
  } else if(angle > 281.25 && angle <=303.75) {
    direction = '西北偏北'
  } else if(angle > 303.75 && angle <=326.25) {
    direction = '西北'
  } else if(angle > 326.25 && angle <=348.75) {
    direction = '西北偏北'
  } else{
    direction = '无'
  }
  return direction
}