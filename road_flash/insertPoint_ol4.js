//本方法用于实现在一条线上进行等距插入点。

/**
 * 计算两点间的距离
 * @param {起点} point1 
 * @param {终点} point2 
 */
function getDistance(point1,point2){
    var offsetx = point2[0] - point1[0]
    var offsety = point2[1] - point1[1];
    var distance = Math.sqrt(Math.pow(offsetx,2) + Math.pow(offsety,2));
    return distance;
}

/**
* 
* @param {起点} startPoint 
* @param {间隔长} length 
* @param {线段斜率} k 
*/
function markInsertPoint(startPoint,endPoint,length,k){
var angle = Math.atan(k);
var ox = Math.abs(length * Math.cos(angle));
var oy = Math.abs(length * Math.sin(angle));
if(k >=0){
    if(endPoint[0] < startPoint[0]){
        ox = -ox;
        oy = -oy;
    }
}
if(k<0){
    if(endPoint[0]< startPoint[0]){
        ox = -ox;
    }else{
        oy = -oy;
    }
}
return [startPoint[0] + ox,startPoint[1] + oy];
}
/**
* 判断点是否在线段的坐标范围内
* @param {要判断的点} point 
* @param {起点} startpoint 
* @param {终点} endpoint 
*/
function pointInLine(point,startpoint,endpoint){
var minx = Math.min(startpoint[0],endpoint[0]);
var maxx = Math.max(startpoint[0],endpoint[0]);
var miny = Math.min(startpoint[1],endpoint[1]);
var maxy = Math.max(startpoint[1],endpoint[1]);
var curx = point[0];
var cury = point[1];
if(curx > maxx || curx < minx || cury > maxy || cury < miny){
    return false;
}else{
    return true;
}
}

/**
* 给定一组坐标及间隔距离，进行等距插点，返回插入后的结果
* @param {坐标点集合} pointlist 
* @param {间隔距离} l 
*/
function insertPoint(pointlist,l){
    var newPointList=[];
    newPointList.push(pointlist[0]);
    var curLen=0; //计算当前插入点所用的长度
    var lastInsertLen=0;//上一个插入点与线段终点的长度
    for (let i = 1; i < pointlist.length; i++) {
        var sp = pointlist[i - 1];
        var ep = pointlist[i];
        var selen = getDistance(sp,ep);
        var curLen=l-lastInsertLen;
        if(selen < curLen){
            newPointList.push(ep);
            curLen = curLen -selen;
        }else{
            var k = (ep[1]-sp[1])/(ep[0]-sp[0]);
            while(true){
                var insertPoint = markInsertPoint(sp,ep,curLen,k);
                if(pointInLine(insertPoint,sp,ep)){
                    newPointList.push(insertPoint);
                    sp = insertPoint;
                    curLen = l;
                }else{
                    newPointList.push(ep);
                    lastInsertLen = getDistance(sp,ep);
                    break;
                }
            }
        }
    }
    newPointList.push(pointlist[pointlist.length-1]);
    return newPointList;
}