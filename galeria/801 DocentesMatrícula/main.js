// Require.js allows us to configure shortcut alias
// There usage will become more apparent futher along in the tutorial.
require.config({
  baseUrl : ".",
  paths: {
    jquery: 'http://exploratorium.s3.amazonaws.com/publico/libs/jquery/jquery-1.7.1.min',
    underscore: 'http://exploratorium.s3.amazonaws.com/publico/libs/underscore/underscore-min',
    backbone: 'http://exploratorium.s3.amazonaws.com/publico/libs/backbone/backbone-min',
    json2: 'http://exploratorium.s3.amazonaws.com/publico/libs/json2/json2',
    text: 'http://exploratorium.s3.amazonaws.com/publico/libs/require/text',
    d3: 'http://exploratorium.s3.amazonaws.com/publico/libs/d3/d3.v3.min',
    topojson: "http://exploratorium.s3.amazonaws.com/publico/libs/d3/topojson.v1.min",
    sankey: 'http://exploratorium.s3.amazonaws.com/publico/libs/d3/sankey',
    bootstrap: 'http://exploratorium.s3.amazonaws.com/publico/libs/bootstrap/js/bootstrap.min',
    VistaTooltip: 'http://exploratorium.s3.amazonaws.com/publico/libs/tideD3/VistaTooltip',
    VistaEjesXY: 'http://exploratorium.s3.amazonaws.com/publico/libs/tideD3/VistaEjesXY',
    VistaLoading: 'http://exploratorium.s3.amazonaws.com/publico/libs/tideD3/VistaLoading',
    templates: '../templates'
    
  },
  // shim - defines libraries that are not define as require modules (not containing "define")
  shim: {
    backbone: {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
    },

    d3: {
        exports: "d3"
    },

    topojson: {
        exports: "topojson"
    },

    sankey: {
        deps: ["d3"],
        exports: "sankey"
    },


    underscore: {
        exports: "_"
    },

    'bootstrap':{deps: ['jquery']}
  }
});


require([
  "app",
	], 
	function(App) {
		App.initialize();
	}
);

