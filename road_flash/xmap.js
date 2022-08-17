xmap = {};
'use strict';
$.extend(xmap, {
    baseLayer: undefined,
    map: undefined,
    /**
     * 初始化地图及图层
     * @param {string} mapDiv div标签ID 
     */
    initMap: function(mapDiv) {
        var url = 'https://tiles.windy.com/tiles/v9.0/darkmap/{z}/{x}/{y}.png';
        // url = 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}';
        url = 'http://tile.stamen.com/toner/{z}/{x}/{y}.png'

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


        var map = new ol.Map({
            target: 'map',
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [116.65, 35.34],
                zoom: 11,
            }),
            layers: []
        });

        this.map = map;
    }
})