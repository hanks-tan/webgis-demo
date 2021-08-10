
function initMap(){
    var Esri_DarkGreyCanvas = L.tileLayer(
        "http://{s}.sm.mapstack.stamen.com/" +
        "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
        "{z}/{x}/{y}.png",
        {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
            'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        }
    );

    map = L.map('map', {
        layers: [Esri_DarkGreyCanvas]
    });
    
    map.setView([33, 118], 11);

    return map;
}

function showWindy(dataURL, layerControl){
    $.getJSON(dataURL, function(data){
        var velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: 'GBR Wind',
                displayPosition: 'bottomleft',
                displayEmptyString: 'No wind data'
            },
            data: data,
            minVelocity: 0, //Velocity：速率
            maxVelocity: 10,
            velocityScale: 0.005,
            particleMultiplier: 1 / 300,//粒子的数量
            lineWidth: 2,                     //粒子的粗细
            frameRate: 15,                      //定义每秒执行的次数
            colorScale: ["rgb(255,255,255)","rgb(255,255,255)","rgb(255,255,255)","rgb(255,255,255)","rgb(255,255,255)"]
        });
    
        // layerControl.addOverlay(velocityLayer, 'Wind - Great Barrier Reef');
        // velocityLayer.addTo(map);
        return velocityLayer;
    })
}

(function(){
    var map = initMap();
    var data = '/static/data/windydata1.json';
    var layer = showWindy(data);
    layer.addTo(map);
})()