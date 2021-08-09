var xmap = {
    map: undefined,
    initMap: function () {
        var url = 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}';
        baseLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: url
            })
        });

        var view = new ol.View({
            center: [103.5, 34.697],
            zoom: 5,
            projection: 'EPSG:4326'
        });
    
        var map = new ol.Map({
            target: 'map',
            view: view,
            layers: [baseLayer]
        });
        this.map = map;
    }
};

