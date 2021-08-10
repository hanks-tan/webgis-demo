(function(){
    
    var map, converLayer;
    function initMap() {
        var baselayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
            })
        });
    
        map = new ol.Map({
            target: 'map',
            layers: [baselayer],
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [112, 36],
                zoom: 6
            })
        });

        var mystyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color:"rgba(72,61,139, 0.4)",
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
            var ft = fts[0];
            var converGeom = erase(ft.getGeometry());

            var convertFt = new ol.Feature({
                geometry: converGeom
            })
            converLayer.getSource().addFeature(convertFt);
        })
    }

    // 擦除操作,生产遮罩范围
    function erase(geom) {
        var extent = [-180,-90,180,90];
        var polygonRing = ol.geom.Polygon.fromExtent(extent);
        var coords = geom.getCoordinates();
        coords.forEach(coord =>{ 
            var linearRing = new ol.geom.LinearRing(coord[0]);
            polygonRing.appendLinearRing(linearRing);
        })
        return polygonRing;
    }


    initMap();
    var dataURL = '../data/shanxi.geojson'
    addconver(dataURL);
})();