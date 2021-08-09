air.map = {};
'use strict';
$.extend(air.map, {
    mapObj: undefined,
    airHeatMap: undefined,
    airPointLayer: undefined,
    windyLayer: undefined,
    selectFeatures: undefined,
    selectControl: undefined,
    init: function(mapDiv) {
        this.initMap(mapDiv);
        this.initMapControl();
    },

    /**
     * 初始化地图及图层
     * @param {string} mapDiv div标签ID 
     */
    initMap: function(mapDiv) {
        var url = 'https://tiles.windy.com/tiles/v9.0/darkmap/{z}/{x}/{y}.png';
        url = 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'

        this.baseLayer = new ol.layer.Tile({
            // source: new ol.source.TileWMS({
            //     url: 'http://10.9.21.165:8080/geoserver/jiningwp/wms',
            //     params: {
            //         'LAYERS': 'jiningwp:JN_AIR_DP_DK',
            //         'TILED': true
            //     },
            //     transition: 0
            // })
            
            source: new ol.source.XYZ({
                url: url
            })
        });

        var popup = document.getElementById('popup');
        this.overlay = new ol.Overlay({
            element: popup,
            offset: [10,10],
            autoPan: true,
            autoPanAnimation: {
            duration: 250
            }
        });

        var map = new ol.Map({
            target: mapDiv,
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [116.65, 35.34],
                zoom: 11,
            }),
            overlays:[this.overlay],
            layers: [this.baseLayer]
        });

        this.mapObj = map;

        //空气质量云图
        this.airHeatMap = new HeatMap({
            map: map
        });

        //风场
        this.windLayer = new WindLayer(undefined,{
            layerName:'windAnimation',
            minResolution: undefined,
            maxResolution: undefined,
            projection: 'EPSG:4326',
        });
        this.windLayer.appendTo(map);

        //空气质量监测站
        this.airPointLayer = new MarkerLayer({
            map: map
        })
    },

    /**
     * 初始化地图控件
     */
    initMapControl: function() {
        var self = this;
        var registerSelectControl = function() {
            self.selectControl = new ol.interaction.Select({
                condition: function(evt) {
                    //单击选择
                    return evt.type == 'singleclick' || evt.type == 'pointermove';
                },
                // style: function (feature) {

                // },
                hitTolerance: 0,
                layers: function(layer){
                    //过滤掉不需要响应的图层
                    if(layer.get('name') === 'tts'){
                        return false;
                    } else {
                        return true;
                    }
                }
            });
    
            self.mapObj.addInteraction(self.selectControl);
            self.selectFeatures = self.selectControl.getFeatures();
    
            self.selectControl.on(['select','remove'], function(e){
                var fts = e.target.getFeatures().getArray();
                if(fts.length > 0){
                    var data = fts[0].values_.data;
                    var feature = fts[0];
                    if(data.callback){
                        data.callback(feature, data.callbackParams);
                    }
                } else {
                    air.map.overlay.setPosition(undefined);
                }
            });
        };

        //注册选择事件
        registerSelectControl();
    },

    setCenter: function() {

    },
    setZoom: function () {

    }
})