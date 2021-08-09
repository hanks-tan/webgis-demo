var map,vectorLayer;

function init() {
  var layerURL = 'http://localhost:8080/geoserver/china/wms?service=WMS'; 
  var layerName = 'china:world';  
  var baseLayer =  new OpenLayers.Layer.WMS(
    'chinaMap',
    layerURL,
    {
      layers: layerName
    }
  );
  
  map = new OpenLayers.Map({
   div: 'map',
   layers:[ baseLayer],
   center: [116.3, 32],
   zoom: 5 
  });

  //定义图层样式
  var style = new OpenLayers.Style({
    fillColor: "#ffcc66",
    strokeColor: "#ff9933",
    strokeWidth: 2,
    label: "${label}",//大括号内为要标注的要素属性，要素属性设置见76行
    fontColor: "#333333",
    fontFamily: "sans-serif",
    fontWeight: "bold"
  },{
    //符号字体随地图缩放而缩放
    rules: [
      new OpenLayers.Rule({
        minScaleDenominator: 200000000,
        symbolizer: {
          pointRadius: 7,
          fontSize: "9px"
        }
      }),
      new OpenLayers.Rule({
        maxScaleDenominator: 200000000,
        minScaleDenominator: 100000000,
        symbolizer: {
          pointRadius: 10,
          fontSize: "12px"
        }
      }),
      new OpenLayers.Rule({
        maxScaleDenominator: 100000000,
        symbolizer: {
          pointRadius: 13,
          fontSize: "15px"
        }
      })
    ]
  })

  vectorLayer = new OpenLayers.Layer.Vector("layerName",{
    styleMap: new OpenLayers.StyleMap(style)//设置图层样式
  })
  map.addLayer(vectorLayer);
}

//加载数据并显示
function loadData(){
  var data = [
    {name: 'p1', x: 119, y: 36},
    {name: 'p2', x: 114.6, y: 32.5},
    {name: 'p3', x: 120, y: 28.3},
    {name: 'p4', x: 103.4, y: 34.1},
    {name: 'p5', x: 118, y: 33.8},
  ];
  var fts = [];
  data.forEach(pt =>{
    var ft = new OpenLayers.Feature.Vector(
      new OpenLayers.Geometry.Point(pt.x, pt.y),
      {
        label: pt.name
      }
    )
    fts.push(ft);
  })
  vectorLayer.addFeatures(fts);
}

//在vector图层上注册单击选择事件
function registerClickEvent(){
  var selectControl = new OpenLayers.Control.SelectFeature(
    vectorLayer,
    {
      clickout: true, toggle:false,
      multiple: false, hover: false,
      toggleKey: "ctrlKey",
      multipleKey: "shiftKey"
    }
  )

  map.addControl(selectControl);
  selectControl.activate();

  vectorLayer.events.on({
    'featureselected': function(evt) {
      console.log(evt.feature.attributes);//打印选择的要素的属性
    }
  })

}
