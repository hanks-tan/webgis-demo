function AirLayer(opts) {
    this.opts = opts;
    this.features = opts.features;//ol.Features对象,带AQI属性
    this.bourdary = opts.bourdary;
    this.map = opts.map;
    this.params = {
        krigingModel:'exponential',//model还可选'gaussian','spherical'
        krigingSigma2:0,
        krigingAlpha:100,
        canvasAlpha:1,//半透明会出现网格边线
        colorList: ['#43ce17','#e1d72c','#f72d0e','#a7134c'],
        min:0,
        max:200
    };
    this.gradient = [];
    this.airLayer_ = undefined;
    this.init();
}

AirLayer.prototype.init = function() {
    //初始化渐变色,todo
    var gradient = [];
    for(var i = 1; i< this.params.colorList.length; i++){
        thisPartColors = new gradientColor(this.params.colorList[i-1],this.params.colorList[i],20);
        gradient = gradient.concat(thisPartColors);
    };
    this.gradient = gradient;
};



AirLayer.prototype.show = function() {
    if(this.map) {
        var layer = this.initKriging();
        if(layer) {
            this.map.addLayer(layer);
        }
    }
};

AirLayer.prototype.initKriging = function() {
    //初始化数据
    var values=[],lngs=[],lats=[];
    this.features.forEach(function(ft) {
        if(ft.getGeometry().getType() === 'Point'){
            var v = ft.get('AQI');
            if(typeof v === 'string'){
                v =parseInt(v);
            }
            values.push(v);
            lngs.push(ft.getGeometry().getCoordinates()[0]);
            lats.push(ft.getGeometry().getCoordinates()[1]);
        }
    });
    if(values.length < 3) {
        return;
    }
    var params = this.params;
    var variogram=kriging.train(values,lngs,lats,
        params.krigingModel,params.krigingSigma2,params.krigingAlpha,params.max,params.min);
    
    var extent = this.bourdary.getExtent();
    var cellWidth = (extent[2]-extent[0])/1000; //计算网格大小
    var polygon =  undefined;
    if(this.bourdary.getType() === 'Polygon'){
        polygon = this.bourdary.getCoordinates();
    }else if(this.bourdary.getType() === 'MultiPolygon') {
        //-------------------------------------注意----------------------------
        polygon = this.bourdary.getCoordinates()[1];//注意，如果是多面，此处不一定就及取0
    }else{
        console.log('网格范围未提供....')
    }
    let grid=kriging.grid(polygon,variogram,cellWidth);

    var self =this;
    this.airLayer_ = new ol.layer.Image({
        source: new ol.source.ImageCanvas({
            canvasFunction:(extent, resolution, pixelRatio, size, projection) =>{
                let canvas = document.createElement('canvas');
                canvas.width = size[0];
                canvas.height = size[1];
                canvas.style.display='block';
                //设置canvas透明度
                canvas.getContext('2d').globalAlpha=params.canvasAlpha;
                kriging.plot(canvas,grid,
                    [extent[0],extent[2]],[extent[1],extent[3]],self.gradient);

                return canvas;
            }
        }),
        opacity: 0.8
    })
    
    return this.airLayer_;
}