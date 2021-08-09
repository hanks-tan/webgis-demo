air.data = {};
'use strict';
$.extend(air.data, {
    //空气质量数据接口
    airDataURL: './data/jn_air_03.json',
    //风场数据接口
    windDataURL: './data/wind_test_data.json',
    //边界数据接口
    extentDataURL: './data/jn_shijie.geojson',
    air_jiancezhan: undefined,
    wind: undefined,
    boundary: undefined,
    extent: [116,35,117,36],
    init: function () {
        this.initBoundary();
    },

    /**
     * 初始化边界数据
     */
    initBoundary: function () {
        var self = this;
        $.getJSON(self.extentDataURL, function(data){
            var fts = new ol.format.GeoJSON().readFeatures(data);
            self.boundary = fts[0].getGeometry();
        });
    },
    /**
     * 将接口取到的json格式的数据格式化为ol.Feature;
     * @param {Array} jsonArray
     * @returns {Array[ol.Feature]}
     */
    AQIData2Feature: function(jsonArray) {
        if(jsonArray.constructor === Array) {
            var fts = [];
            //返回数据中AQI、经度、纬度的索引
            var aqiIndex = '2';
            var lngIndex = '4';
            var latIndex = '5';
            var data = this.removeRepeatPoint(jsonArray,lngIndex,latIndex,aqiIndex);
            data.forEach(function (element) {
                var lng = parseFloat(element[lngIndex]);
                var lat = parseFloat(element[latIndex]);

                var ft = new ol.Feature({
                    geometry: new ol.geom.Point([lng, lat])
                });
                
                var properties = {};
                for (var key in element) {
                    if (element.hasOwnProperty(key)) {
                        var value = element[key];

                        //AQI属性在空气质量云图和监测站点展示都是必要属性
                        if(key === aqiIndex) {
                            key = 'AQI';
                        }
                        properties[key] = value;
                    }
                }
                ft.setProperties(properties);
                fts.push(ft)
            });

            return fts;
        } else {
            return null;
        }
    },

    /**
     * 数据清洗（去重复点和AQI值位零的元素）
     * @param {*} jsonArray json数组
     * @param {*} lngIndex 数组元素的经度索引
     * @param {*} latIndex 数组元素的纬度索引
     * @param {*} aqiIndex 数组元素的AQI索引
     */
    removeRepeatPoint: function (jsonArray,lngIndex,latIndex,aqiIndex) {
        console.log('清洗前：', jsonArray.length);
        var hashObject = {};
        var subJsonArray = [];
        jsonArray.forEach(function (element) {
            var lng = element[lngIndex];
            var lat = element[latIndex];
            var key = lng.toString() + ',' + lat.toString();
            if(element[aqiIndex].toString() === '0') {
                //jquery中 使用 return true跳到下个循环
                return true;
            }
            if(!hashObject[key]) {
                hashObject[key] = element;
                subJsonArray.push(element);
            }
        });

        console.log('清洗后：', subJsonArray.length);
        return subJsonArray;
    },

    /**
     * 获取空气质量数据
     * @param {Function} callback 回调函数
     */
    getAirData: function(callback) {
        //取本地数据，测试
        var self = this;
        $.getJSON(self.airDataURL, function(data) {
            callback(data);
        })

        //取服务器端数据，正式环境
        // var context = 'http://10.9.41.54:8060';
        // var method = '/jsonServlet?method=RptJnDataInfo.getAQIBySxInterface';
        // $.ajax({
        //     type: 'post',
        //     async: false,
        //     dataType: 'json',
        //     data: {},
        //     url: context + method,
        //     success: function (response) {
        //         var dataArr = response.result;
        //         self.callbak(dataArr);
        //     }
        // })
    },

    /**
     * 获取风场数据
     * @param {Function} callback 回调函数
     */
    getWindData: function(callback) {
        var self = this;
        $.getJSON(self.windDataURL,function(data) {
            callback(data);
        })
    }


})


