
//空气质量图层
//注意：克里金插值前，需求进行数据清洗
// 1、清理坐标重复的点，这个会导致渲染结果不准确（颜色单一或者其他）
// 2、清理空气质量值为0的数据

HeatMap = function(opt_options){
    'use strict';

    this.mapObj = opt_options.map; //必要 ol.Map对象
    this.data = undefined;

    this.defaultParams = {
        krigingModel:'spherical',//model还可选'gaussian','spherical','exponential'
        krigingSigma2:0,
        krigingAlpha:100,
        canvasAlpha:1,//半透明会出现网格边线
        colors: ['#1E9600','#FFF200','#FF8C00','#FF0000', '#89216B','#A52A2A'],//绿、黄、橙、红、紫、褐
        min:0,
        max:300,
        num:500      //  网格宽度计算参数
    };
    this.opts = Object.assign({},opt_options, this.defaultParams);

    this.gradient = [];//渐变色
    this.grid = [];//网格
    this.layer_ = undefined;
    this.init();
};

/**
 * 图层初始化
 */
HeatMap.prototype.init = function(){
    'usr strict';
    //生成渐变色
    var colorsLevel = this.opts.colors;
    var listcolor = [];
    var n = 20; //每个渐变跨度划分的颜色数量
    for (var index = 0; index < colorsLevel.length -1 ; index++) {
        var gradient = new gradientColor(colorsLevel[index], colorsLevel[index + 1], n);
        listcolor = listcolor.concat(gradient);
    }
    this.gradient = listcolor;
};


HeatMap.prototype.show = function(features, boundary){
    if(this.mapObj) {
        this.data = features;
        this.render(features, boundary);
        this.addToMap();
    }
};


HeatMap.prototype.render = function(features, boundary){
    console.log(new Date().toLocaleTimeString());

    var values=[],lngs=[],lats=[];
    self = this;
    features.forEach(function(ft) {
        if(ft.getGeometry().getType() === 'Point'){
            var v = ft.get('AQI');//数据中AQI值的索引为2
            if(typeof v === 'string'){
                v =parseInt(v);
            }
            if(v > 0){
                values.push(v);
                lngs.push(ft.getGeometry().getCoordinates()[0]);
                lats.push(ft.getGeometry().getCoordinates()[1]);
            }
        }
    });

    var opts = self.opts;
    if(values.length > 3){
        var variogram=kriging.train(values,lngs,lats,
            opts.krigingModel,opts.krigingSigma2,opts.krigingAlpha,opts.min,opts.max);
        
        var extent = boundary.getExtent();
        var cellWidth = (extent[2]-extent[0]) / opts.num; //计算网格大小
        var polygon =  [];
        if(boundary.getType() === 'Polygon'){
            polygon = boundary.getCoordinates();
        }else if(boundary.getType() === 'MultiPolygon') {
            //-------------------------------------注意----------------------------
            polygon = boundary.getCoordinates()[0];//注意，如果是多面，此处不一定就及取0
        }else{
            console.log('网格范围未提供....');
        }
        self.grid=kriging.grid(polygon,variogram,cellWidth);

        var heatLayer = new ol.layer.Image({
            source: new ol.source.ImageCanvas({
                canvasFunction:function (extent, resolution, pixelRatio, size, projection) {
                    var canvas = document.createElement('canvas');
                    canvas.width = size[0];
                    canvas.height = size[1];
                    canvas.style.display='block';
                    //设置canvas透明度
                    canvas.getContext('2d').globalAlpha=opts.canvasAlpha;
                    kriging.plot(canvas,self.grid,
                        [extent[0],extent[2]],[extent[1],extent[3]],self.gradient);

                    console.log(new Date().toLocaleTimeString());
                    return canvas;
                }
            }),
            opacity: 0.6
        });
        self.layer_ = heatLayer;
    }else{
        console.log('数据量不够....');
    }
};

HeatMap.prototype.remove = function() {
    this.mapObj.removeLayer(this.layer_);
}

HeatMap.prototype.addToMap = function() {
    this.mapObj.addLayer(this.layer_);
}

HeatMap.prototype.getVisible = function(visible) {
    if(this.layer_){
        return this.layer_.getVisible();
    }
};

HeatMap.prototype.setVisible = function(visible) {
    if(this.layer_){
        this.layer_.setVisible(visible);
    }
};

