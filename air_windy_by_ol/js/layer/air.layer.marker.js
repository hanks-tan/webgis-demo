MarkerLayer = function(opts) {
    this.mapObj = opts.map;
    this.opts = Object.assign({}, opts);
    this.layer_ = undefined;
    this.data = undefined;
    this.defaultStyleFunc = function(feature){
        var colors = ['#1E9600','#FFF200','#FF8C00','#FF0000', '#89216B','#A52A2A'];
        var aqi = feature.get('AQI');
        var fillColor = colors[ Math.floor(aqi / (300 / colors.length))];

        var style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                
                fill: new ol.style.Fill({
                    color: fillColor,
                }),
                stroke: new ol.style.Stroke({
                    color: '#ddd',
                    width: 2
                })
            }),
            text: new ol.style.Text({
                font: '12px serif',
                text:  aqi.toString() ,
                fill: new ol.style.Fill({
                    color: '#000'
                })
            })
        })
        return style;
    };
    this.rendered = false;
    this.init();
};

MarkerLayer.prototype.init = function () {
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: this.defaultStyleFunc
    });
    this.layer_ = layer;
};

MarkerLayer.prototype.show = function (features) {
    this.layer_.getSource().clear();
    if(features.length > 0){
        this.layer_.getSource().addFeatures(features);
        this.data = features;
    };
    if(this.mapObj) {
        this.mapObj.addLayer(this.layer_);
        this.rendered = true;
    };
};

MarkerLayer.prototype.addData = function (features) {
    this.layer_.getSource().addFeatures(features);
    this.data = this.layer_.getSource.getFeatures();
};

MarkerLayer.prototype.getVisible = function(visible) {
    if(this.layer_){
        return this.layer_.getVisible();
    }
};

MarkerLayer.prototype.setVisible = function(visible) {
    if(this.layer_){
        this.layer_.setVisible(visible);
    }
};