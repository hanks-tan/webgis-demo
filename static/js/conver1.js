(function(){
    
    var map, converLayer;
    function initMap() {
        var baselayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
            })
        });
    
        map = new ol.Map({
            target: 'map',
            layers: [baselayer],
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [112, 36],
                zoom: 5
            })
        });

        var mystyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color:"rgba(72,61,139, 0.2)",
            }),
            stroke: new ol.style.Stroke({
                color:"#BDBDBD",
                width:2
            })
        });
        converLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: mystyle
        });
        map.addLayer(converLayer);
    }

    //todo
    //添加遮罩
    function addconver(data) {
        $.getJSON(data, function(data) {
            var fts = new ol.format.GeoJSON().readFeatures(data);
            converLayer.getSource().addFeatures(fts);
        })
    }


    initMap();
    var dataURL = '../data/shanxi.geojson'
    addconver(dataURL);
})();