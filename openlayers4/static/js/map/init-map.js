
var map;
var baseLayer;
function initChinaMap() {
    //本地地图
    // baseLayer = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         //url: 'http://localhost:8080/geoserver/szlh2/wms',
    //         url:'http://10.18.224.161:8080/geoserver/serverTest/wms',
    //         params: {
    //             'LAYERS': 'serverTest:chinaBaseMap',
    //             'TILED': true
    //         },
    //         transition: 0
    //     })
    // });

    //openstreetMap地图
    // baseLayer = new ol.layer.Tile({
    //     source: new ol.source.OSM()
    // });

    //esri地图
    // baseLayer = new ol.layer.Tile({
    //     source: new ol.source.XYZ({
    //         url: 'http://cache1.arcgisonline.cn/ArcGIS/rest/services/' + 
    //             'ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
    //     })
    // });

    //esri深色
    // baseLayer = new ol.layer.Tile({
    //     source: new ol.source.XYZ({
    //         url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    //     })
    // });

    var esri_dark = 'http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}'
    var esri_raster = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    var esri_vec_h = 'http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
    var windy_map = 'https://tiles.windy.com/tiles/v9.0/darkmap/{z}/{x}/{y}.png'
    var wmflabs = 'http://a.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'//a.tiles,b.tiles,c.tiles均可

    baseLayer = createXYZLayer(wmflabs);
    //baseLayer = vectorTile_MVT('chinaNS:shengjie');
    //baseLayer = vectorTile_geojson('chinaNS:shengjie');
    var view = new ol.View({
        center: [103.5, 34.697],
        zoom: 5,
        projection: 'EPSG:4326'
    });

    map = new ol.Map({
        target: 'map',
        view: view,
        layers: [baseLayer]
    });

    function createXYZLayer(url){
        var xyzLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: url
            })
        });
        return xyzLayer;
    }

    function vectorTile_MVT(layerName){
        var proj4326 = new ol.proj.Projection({
            code: 'EPSG:4326',
            unit: 'degrees',
            axisOrientation: 'neu'
        });
        var vTile = new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
                format: new ol.format.MVT(),
                projection: proj4326,                
                tileGrid:ol.tilegrid.createXYZ({
                    extent: ol.proj.get('EPSG:4326').getExtent(),
                    maxZoom:22
                }),
                tilePixelRatio:1,
                //要却并不geoserver启动了磁盘缓存可用
                tileUrlFunction: function(tileCoord){
                    return 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/' + layerName + 
                    '@EPSG%3A4326@pbf/' + (tileCoord[0] - 1) + '/' + tileCoord[1] + '/' + (Math.pow(2, tileCoord[0] - 1) + tileCoord[2]) + '.pbf'
                }
                // url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/' + layerName +
                // '@EPSG%3A4326@pbf/{z}/{x}/{-y}.pbf'
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#585858'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgb(255,255,255)',
                    width: 1
                })
            }),
            projection: proj4326
        })
        return vTile;
    }

    function vectorTile_geojson(layerName){
        var proj4326 = new ol.proj.Projection({
            code: 'EPSG:4326',
            unit: 'degrees',
            axisOrientation: 'neu'
        });
        var vTile = new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
                format: new ol.format.GeoJSON(),
                projection: proj4326,                
                tileGrid:ol.tilegrid.createXYZ({
                    extent: ol.proj.get('EPSG:4326').getExtent(),
                    maxZoom:22
                }),
                tilePixelRatio:1,
                //要却并不geoserver启动了磁盘缓存可用
                tileUrlFunction: function(tileCoord){
                    return 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/' + layerName + 
                    '@EPSG%3A4326@geojson/' + (tileCoord[0] - 1) + '/' + tileCoord[1] + '/' + (Math.pow(2, tileCoord[0] - 1) + tileCoord[2]) + '.geojson'
                }
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#585858'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgb(255,255,255)',
                    width: 1
                })
            }),
            projection: proj4326
        })
        return vTile;
    }
}

function initJnMap(){
    baseLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url:'http://10.9.21.165:8080/geoserver/jiningwp/wms',
            params: {
                'LAYERS': 'jiningwp:JN_SHJ_YS',
                'TILED': false
            }
        }),
        transition: 1
    })

    var view = new ol.View({
        center: [116.7,35.3],
        zoom: 10,
        minZoom:3,
        maxZoom:20,
        projection: "EPSG:4326"
    });

    map = new ol.Map({
        target: 'map',
        view: view,
        layers: [baseLayer]
    });
}