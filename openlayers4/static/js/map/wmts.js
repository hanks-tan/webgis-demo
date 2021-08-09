let app = {
  map: undefined,
  baseLayer: undefined,
  projection: undefined,
  init() {
    
    let view = new ol.View({
      projection: 'EPSG:4326',
      zoom: 4,
      center: [115, 32]
    })

    let map = new ol.Map({
      target: 'map',
      view: view,
      layers: []
    });
    this.map = map
    this.projection = this.map.getView().getProjection()

    let source = this.createSource1()
    let baseLayer = new ol.layer.Tile({
      source: source
    })
    map.addLayer(baseLayer)
  },
  createSource1() {
    
    var projectionExtent = this.projection.getExtent();

            //切片名
    var matrixIds = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10',
          'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

      //切片大小
    var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5,
        4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
    
    let source = new ol.source.WMTS({
      url: 'http://localhost:8080/geoserver/gwc/service/wmts',
      layer: 'china:china',
      matrixSet: 'EPSG:4326',
      projection: this.projection,
      tileGrid: new ol.tilegrid.WMTS({
          origin: [-180.0, 90.0],
          resolutions: resolutions,
          matrixIds: matrixIds
      }),
      wrapX: true
    })

    return source
  },

  createSource3() {
    let url = 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/china%3Achina@EPSG%3A4326@png/'
    let source = new ol.source.XYZ({  
      projection: this.projection,
      tileGrid: ol.tilegrid.createXYZ({extent: this.projection.getExtent()}),
      tileUrlFunction: function (tileCoord, pixelRatio, proj) {
        return url+(tileCoord[0]-1)+ '/'+tileCoord[1] + '/' + (Math.pow(2,tileCoord[0]-1)+tileCoord[2]) + '.png'; 
      }  
    })
    return source
  }

}

app.init()
