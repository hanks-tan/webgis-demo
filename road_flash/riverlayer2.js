/**
 * 轨迹动画类
 * @param {*} options 
 */
function RiverLayer(options){
    this.options = options || {};
    this.map = options.map;//地图对象
    this.name = options.name;//图层名
    this.lines = options.lines;//轨迹线，type:[LineString]
    this.step = options.step ? options.step : 30;//线的分段间隔
    this.colorList = options.colorList ? options.colorList : ['#E0F8F7', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8'];//
    this.lineLength = options.lineLength ? options.lineLength : 5;//分段长度，以插值后的点个数为单位,建议为颜色数组长的整数倍
    this.speed = options.speed ? options.speed : 100;//动画的刷新频率
    this.pointsStep = options.pointsStep ? options.pointsStep : 0.01;//插值点之间的间隔
    
    //类变量
    this.index = 0;
    this.pointSet = [];
    this.timer = null;
    this.slineLength = 0;//内部小段长度，以插值后的点个数为单位,
    
    //计算内部分段长度
    var len = this.colorList.length;
    if(len <= this.lineLength){
        if(this.lineLength % len != 0){
            this.lineLength = this.lineLength - (this.length % len);
        }
    }else{
        this.lineLength = len;
    }
    this.slineLength = this.lineLength / len;
}

/**
 *  类初始化
 */
RiverLayer.prototype.initialize = function(){
    if(!this.map){
        return;
    }
    if(!this.lines){
        return;
    }
    if(this.lines.length < 1){
        return;
    }
    var that = this;
    that.pathSource = new ol.source.Vector();
    that.riverLayer = new ol.layer.Vector({
        source: that.pathSource,
        name: that.name,
        style:function(feature){
            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: feature.get('color'),
                    width: feature.get('width')
                })
            })
            return style;
        }
    });
    that.map.addLayer(that.riverLayer);
    that.startTracker(that.lines,that.pointsStep,that.speed);
}

/**
 * 开始动画
 * @param {Array[ol.geom.LineString]} lineList 线数组
 * @param {int} speL 线间距
 * @param {int} speTime 动画间隔
 */
RiverLayer.prototype.startTracker = function(lineList,speL,speTime){
    if(lineList.length <= 0){
        console.log("lineList is null!")
        return;
    }
    var that = this;
    lineList.forEach(function(element) {        
        var points;
        //检查线类型
        if(element.getType() === 'MultiLineString'){
            points = element.getCoordinates()[0];
        }else if (element.getType() === 'LineString'){
            points = element.getCoordinates();
        }else{
            console.log('this line type error, type is ' + element.getType());
            return;
        }
        if(points.length > 0){
            var insertResult = insertPoint(points,speL);
            var trackObj = new PointsTrack({
                linePoints: insertResult,
                l: that.lineLength,
                s: that.step
            });
            that.pointSet.push(trackObj);
        }
    });
    this.timer = window.setInterval(this.move.bind(this),speTime);
}


RiverLayer.prototype.createLineFeatures = function(trackObj){
    // var count = this.index / (this.step + this.lineLength);
    // var features = [];
    // for (var i = 0; i < count + 1; i++) {
    //     var offset = i *  (this.step + this.lineLength);
    //     var upperIndex = this.index % (this.step + this.lineLength) + offset;
    //     var lowIndex = ((upperIndex -  this.lineLength))> 0 ? (upperIndex - this.lineLength) : 0;
    //     var curPoints = insertResult.slice(lowIndex,upperIndex);
    //     if(curPoints.length < 1){
    //         continue;
    //     }

    //     //计算分组数量
    //     var groupCount = parseInt(curPoints.length / this.slineLength);
    //     groupCount = (curPoints.length % this.slineLength) > 0 ? groupCount +1 : groupCount;
    //     for (let j = 0; j < groupCount; j++) {
    //         var innerLowerIndex = j * this.slineLength;
    //         var innerUpperIndex = (j + 1) * this.slineLength;
    //         innerUpperIndex = (innerUpperIndex > curPoints.length -1) ? (curPoints.length -1) : innerUpperIndex;
    //         var linePoints = curPoints.slice(innerLowerIndex -1,innerUpperIndex);
    //         var feature = new ol.Feature({
    //             geometry: new ol.geom.LineString(linePoints),
    //             color: this.colorList[j],
    //             width: j+1
    //         })
    //         features.push(feature);
    //     }
    // }
    // return features;
    var features = [];
    var display = trackObj.filterDisPlay();
    trackObj.updateState();
    for(var i = 0; i < display.length; i++) {
        var element = display[i];
        var lowerIndex = element.lower;
        var upperIndex = element.upper;
        var curPoints = trackObj.linePoints.slice(lowerIndex, upperIndex);

        //计算分组数量
        var groupCount = parseInt(curPoints.length / this.slineLength);
        groupCount = (curPoints.length % this.slineLength) > 0 ? groupCount +1 : groupCount;
        for (let j = 0; j < groupCount; j++) {
            var innerLowerIndex = j * this.slineLength;
            var innerUpperIndex = (j + 1) * this.slineLength;
            innerUpperIndex = (innerUpperIndex > curPoints.length -1) ? (curPoints.length -1) : innerUpperIndex;
            var linePoints = curPoints.slice(innerLowerIndex -1,innerUpperIndex);
            var feature = new ol.Feature({
                geometry: new ol.geom.LineString(linePoints),
                color: this.colorList[j],
                width: j+1
            })
            features.push(feature);
        }
    }
    return features;

}

RiverLayer.prototype.show = function(){
    this.initialize();
}

RiverLayer.prototype.remove = function() {
    if(this.pathSource){
        this.pathSource.clear();
    }
    if(this.map){
        this.map.removeLayer(this.riverLayer);
    }
    this.hxLines = [];
    this.moveIndex = 0;
    window.clearInterval(this.timer);
    this.timer = null;
}

RiverLayer.prototype.move = function(){
    var featureSet = [];
    var self = this;
    this.pointSet.forEach(function(element) {
        var curFeatures = self.createLineFeatures(element);
        featureSet = featureSet.concat(curFeatures);
    });
    this.pathSource.clear();
    this.pathSource.addFeatures(featureSet);
    ++this.index;
    if(this.index >100000){
        this.index = 0;
    }
}

