
(function(){
    var map = L.map('map').setView([35.87, 105.475], 5);

    var tiles = L.tileLayer('https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}', {
    }).addTo(map);

    $.getJSON('./data/city_air.geojson',function(data){
        var features = data.features;

        showidwLayer(features)

        showMark(features);
    })

    /**
     * 显示插值图层
     * @param {Array(point)} data 
     */
    function showidwLayer(data){
        var points = [];
        data.forEach(element => {
            var lng = element.geometry.coordinates[0];
            var lat = element.geometry.coordinates[1];
            var aqi = parseInt(element.properties.AQI);
            if(aqi){
                points.push([lat,lng,aqi]);
            }
        });

        var colors = {
            0:'#fff',
            0.3: '#A5CC82',
            0.6: '#00467F',
            0.9: '#292E49',
            1: '#000'
        }

        var idw = L.idwLayer(points,{
            opacity: 0.5,
            maxZoom: 18,
            cellSize: 10,
            exp: 5,
            max: 300,
            gradient: colors 
        });
        idw.addTo(map);
    }

    /**
     * 显示采样点
     * @param {*} data 
     */
    function showMark(data){
        data.forEach(element => {
            var lng = element.geometry.coordinates[0];
            var lat = element.geometry.coordinates[1];
            L.marker([lat, lng]).addTo(map)
        });
    }
})()