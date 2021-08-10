
light_url = 'http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}';
dark_url = 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{x}/{y}.pdf';
var baselayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: dark_url
    })
});

var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        projection: 'EPSG:4326',
        zoom: 3,
        center: [116,34]
    }),
    layers: [baselayer]
});

//遮罩层样式
var whiteStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(72,61,139, 0.2)'
    }),
    stroke: new ol.style.Stroke({
        color: '#0066CC',
        width: 1
    })
});

var converLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: whiteStyle
});

map.addLayer(converLayer);


var extent = [-180,-90,180,90];
function addConver(name){
    name = name.toLowerCase();
    var data = '/static/data/states.geojson';
    var polygonRing = ol.geom.Polygon.fromExtent(extent);
    $.getJSON(data,function(data){
        var features = new ol.format.GeoJSON().readFeatures(data);
        features.forEach(element =>{
            if(element.get('STATE_NAME').toLowerCase() === name){
                var coords = element.getGeometry().getCoordinates();
                //创建环
                coords.forEach(coord =>{ 
                    var linearRing = new ol.geom.LinearRing(coord[0]);
                    polygonRing.appendLinearRing(linearRing);
                })
            }
        })

        var ft = new ol.Feature({
            geometry: polygonRing
        })

        converLayer.getSource().addFeature(ft);

    })    
}