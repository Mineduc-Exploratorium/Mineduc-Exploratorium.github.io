// Filename: app.js
define(["VistaPrincipal"], 
  function(VistaPrincipal) {
		var initialize = function() {
			vista = new VistaPrincipal({el:"#mainvisualization"});
		}

		return { 
			initialize: initialize
		};
	}
);
		
