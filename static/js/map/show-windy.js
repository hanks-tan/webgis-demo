// 初始化地图，返回一个map对象
function initMap(){
    var Esri_DarkGreyCanvas = L.tileLayer(
        "http://{s}.sm.mapstack.stamen.com/" +
        "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
        "{z}/{x}/{y}.png",
    );


    map = L.map('map', {
        layers: [Esri_DarkGreyCanvas]
    });
    
    map.setView([33.4, 118], 9);
    return map;
}

// 生成一个wind图层并返回
function windLayer(data){
    var velocityLayer = L.velocityLayer({
        // displayValues: true,
        // displayOptions: {
        //     velocityType: 'GBR Wind',
        //     displayPosition: 'bottomleft',
        //     displayEmptyString: 'No wind data'
        // },
        data: data,
        // minVelocity: 0, //Velocity：速率
        // maxVelocity: 10,
        // velocityScale: 0.005,
        // // particleMultiplier: 1 / 100,//粒子的数量
        // // lineWidth: 2,                     //粒子的粗细
        // frameRate: 15,                      //定义每秒执行的次数
        // colorScale: ["rgb(255,255,255)","rgb(255,255,255)","rgb(255,255,255)","rgb(255,255,255)"]
    });
    return velocityLayer;
}

(function(){
    var map = initMap();
    var data = '../../data/windydata1.json';
    $.getJSON(data).done(function(data){
        var layer = windLayer(data);
        layer.addTo(map);
    })
})()