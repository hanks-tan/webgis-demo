function VideoMap (options) {
    this.map = undefined
    this.vectorLayer = undefined
    this.position = options.position ;
    this.initMap()
}

VideoMap.prototype.initMap = function(){
    var baseLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
      })
    })
    this.vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector()
    })

    var view = new ol.View({
      center: [111.74469, 37.30270],
      zoom: 11,
      projection: 'EPSG:4326'
    });

    var map = new ol.Map({
        target: 'map',
        view: view,
        layers: [baseLayer, this.vectorLayer]
    });
    this.map = map;
  }

  VideoMap.prototype.setPosition = function(position){
    var source = this.vectorLayer.getSource()
    source.clear()

    var point = new ol.Feature(new ol.geom.Point(position.coordinate))

    source.addFeature(point)
    var style = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        src: '../image/r.png',
        rotation: position.uAngle,
        scale: 1
      })
    })
    point.setStyle(style)
  }

  VideoMap.prototype.createRegularPolygonCurve = function(origin, radius, sides,r,angel) {
    var rotation = 360 - r;
    var angle = Math.PI * ((1/sides) - (1/2));
    if(rotation) {
        angle += (rotation / 180) * Math.PI;
    }
    var rotatedAngle, x, y;
    var points = [];
    for(var i=0; i<sides; ++i) {
        var an = i*((360 - rotation)/360);
        rotatedAngle = angle + (an * 2 * Math.PI / sides);
        x = origin[0] + (radius * Math.cos(rotatedAngle));
        y = origin[1] + (radius * Math.sin(rotatedAngle));
        points.push([x,y]);
    }
    if(rotation!=0){
        points.push(origin);
    }
    var ring = new ol.geom.LinearRing(points);
    ring.rotate(Math.PI-((angel-r/2)/180)*Math.PI,origin);
    var poy = new ol.geom.Polygon([points]);
    var a = ring.A;
    poy.A=a;

    return poy;
  }

  /**
   * origin: 圆心
   * radius: 半径
   * sides：边数（圆弧的）
   * r：弧度（角度为单位）
   * angle：方向角（角度为单位）
   */
  VideoMap.prototype.drawRegularPolygonCurve = function(origin, radius, sides,r,angel){
    var polygon = this.createRegularPolygonCurve(origin, radius, sides,r,angel)
    var ft = new ol.Feature({
      geometry: polygon
    })
    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 1
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0,0,255,0.3)'
      })
    })
    ft.setStyle(style)
    this.vectorLayer.getSource().addFeature(ft)
  }