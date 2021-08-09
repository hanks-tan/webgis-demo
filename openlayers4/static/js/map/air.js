
/**
 * 呈现空气质量图(利用克里金差值)
 * @param {*} map openlayer的map对象
 * @param {*} geoJSON 空气质量数据
 * @param {*} region 可视化范围，一个Geometry对象
 */
function air(map,geoJSON,region){
    var airLayer_ = null;

    var params = {
        krigingModel:'exponential',//model还可选'gaussian','spherical'
        krigingSigma2:0,
        krigingAlpha:100,
        canvasAlpha:1,//半透明会出现网格边线
        colorsStart:['#267300','#C9FB02','#FFB700','#FF0000','#AC0063','#7E0023'],
        colorsEnd:['#98E600','#FFE500','#FF4000','#A80000','#82004C','#40001A'],
        min:0,
        max:300
    };
    var gradient = [];
    for(var i = 0; i< 5; i++){
        thisPartColors = new gradientColor(params.colorsStart[i],params.colorsEnd[i],20);
        gradient = gradient.concat(thisPartColors);
    };
    return {
        show: function(){
            if(!this.airLayer_){
                map.removeLayer(airLayer_);
            };
            var features = new ol.format.GeoJSON().readFeatures(geoJSON);
            var values=[],lngs=[],lats=[];
            features.forEach(ft => {
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
            if(values.length > 3){
                let variogram=kriging.train(values,lngs,lats,
                    params.krigingModel,params.krigingSigma2,params.krigingAlpha,params.max,params.min);
                
                var extent = region.getExtent();
                var cellWidth = (extent[2]-extent[0])/1000; //计算网格大小
                var polygon =  [];
                if(region.getType() === 'Polygon'){
                    polygon = region.getCoordinates();
                }else if(region.getType() === 'MultiPolygon') {
                    //-------------------------------------注意----------------------------
                    polygon = region.getCoordinates()[1];//注意，如果是多面，此处不一定就及取0
                }else{
                    console.log('网格范围未提供....')
                }
                let grid=kriging.grid(polygon,variogram,cellWidth);
        
                airLayer_ = new ol.layer.Image({
                    source: new ol.source.ImageCanvas({
                        canvasFunction:(extent, resolution, pixelRatio, size, projection) =>{
                            let canvas = document.createElement('canvas');
                            canvas.width = size[0];
                            canvas.height = size[1];
                            canvas.style.display='block';
                            //设置canvas透明度
                            canvas.getContext('2d').globalAlpha=params.canvasAlpha;
                            kriging.plot(canvas,grid,
                                [extent[0],extent[2]],[extent[1],extent[3]],gradient);
        
                            return canvas;
                        }
                    }),
                    opacity: 0.5
                })
                map.addLayer(airLayer_);
                //这两句用于将airlayer图层放到最下方
                //var layers = map.getLayers();
                //layers.insertAt(0,airLayer);
            }else{
                console.log('数据量不够....')
            }
        }
    }
}

