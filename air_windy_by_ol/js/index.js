
$(document).ready(function () {
    air.main.init();
});

$('#air-cloud').click(function () {
    air.render.layerSwitch(this, air.map.airHeatMap);
});

$('#windy').click(function () {
    air.render.layerSwitch(this, air.map.windLayer);
});

$('#station').click(function (e) {
    air.render.layerSwitch(this, air.map.airPointLayer);
});
