air.render = {};
$.extend(air.render, {
    layerSwitch: function(switchObj, layer){
        if (switchObj.checked) {
            if (layer.data != undefined) {
                layer.setVisible(true);
            } else {
                if(layer instanceof  HeatMap){
                    air.data.getAirData(this.showAirHeatMap);
                } else if(layer instanceof WindLayer) {
                    air.data.getWindData(this.showWindLayer);
                }else if(layer instanceof MarkerLayer) {
                    air.data.getAirData(this.showPointLayer);
                } else {
                    console.log('不能加载该图层...');
                }
            }
        } else {
            layer.setVisible(false);
        }
        this.upateState(switchObj);
    },

    /**
     * 显示空气质量热力图
     * @param {JSON} jsonObject 空气质量数据
     */
    showAirHeatMap: function(jsonObject) {
        var data = jsonObject.result;
        var fts = air.data.AQIData2Feature(data);
        var clipRegion = undefined;
        if(air.data.boundary != undefined) {
            clipRegion = air.data.boundary;
        } else {
            var plist = [];
            plist.push([115.71,34.3],[115.71,36.05],[117.71,36.05],[117.71,34.3]);
            clipRegion = new ol.geom.Polygon([plist]);
        }
        air.map.airHeatMap.show(fts, clipRegion);
    },

    /**
     * 显示风场数据
     * @param {JSON} jsonObject 风场数据
     */
    showWindLayer: function(jsonObject) {
        air.map.windLayer.setData(jsonObject);
    },

    /**
     * 显示空气质量监测站点
     * @param {JSON} jsonObject 空气质量数据
     */
    showPointLayer: function(jsonObject) {
        var r = jsonObject.result;
        var fts = air.data.AQIData2Feature(r);
        var data = {
            callback: function (feature, callbackParams) {
                //alert(feature.get('AQI'));
                var AQI = feature.get('AQI');
                var name = feature.get('0');
                var content = document.getElementById('content');
                content.innerHTML = '<p>'+name + ': ' + AQI + '</p>';
                air.map.overlay.setPosition(feature.getGeometry().getCoordinates());
            },
            callbackParams: {}
        };
        //添加marker的单击回调函数
        fts.forEach(function(element) {
            element.setProperties({'data': data})
        });
        air.map.airPointLayer.show(fts);
    },
    /**
     * 更新按钮状态
     * @param {*} obj 按钮对象
     */
    upateState: function(obj){
        if(obj.checked){
            $(obj.parentElement).addClass("active");
        } else {
            $(obj.parentElement).removeClass("active");
        }
    }

})