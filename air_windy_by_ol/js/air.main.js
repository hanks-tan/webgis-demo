air.main = {};
$.extend(air.main, {
    init: function() {
        air.map.init('map');
        air.data.init();
    }
});