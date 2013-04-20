$().ready(function() {
	vista = new VistaPrincipal({el:"#mainchart"});
});

// VistaPrincipal
// ===================
// Vista principal con datos de ...
//
var VistaPrincipal = Backbone.View.extend({
	el:"body",
	
	initialize: function() {
		_.bindAll(this,"render")
		self= this; // Alias a this para ser utilizado en callback functions

		this.margin = {top: 20, right: 20, bottom: 30, left: 40},
    	this.width = 800 - this.margin.left - this.margin.right,
    	this.height = 500 - this.margin.top - this.margin.bottom;

    	this.imgwidth = 400;
		this.imgheight = 300;

		// Vista con tooltip para mostrar ficha de establecimiento
		this.tooltip = new VistaToolTipEstablecimiento();
		this.tooltip.message = function (data) {
			return data.nombre + " - " + data.tipo;
		}
 
    	// Carga de datos
    	//
		this.$el.append("<progress id='progressbar'></progress>");
		d3.json("data/galeria.json", function(data) {
			$("#progressbar").hide(); // Ocultar barra de progreso

			self.data = data;
			self.render();
		});
	},


	render: function() {
		self = this; // Para hacer referencia a "this" en callback functions

		
	
			// Genera elemento SVG contenedor principal de gráficos
		this.svg = d3.select(this.el).append("svg")
		    .attr("width", this.width + this.margin.left + this.margin.right)
		    .attr("height", this.height + this.margin.top + this.margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.svg.selectAll("circle")
			.data(this.data)
			.enter()
				.append("image")
				.attr("x", function(d,i) {return self.calculateImgPosition(i).x})
				.attr("y", function(d,i) {return self.calculateImgPosition(i).y})
				.attr("width", self.imgwidth)
				.attr("height", self.imgheight)
				.attr("xlink:href",  function(d) {return d.imgurl})
				.on("click", function(d) {
					alert(d.url);
					window.location.href = d.url;
				});


				/*
			<image x="20" y="20" width="300" height="80"
     xlink:href="http://jenkov.com/images/layout/top-bar-logo.png" />
				.append("circle")
				.attr("cx", function(d,i) {return 20*i})
				.attr("cy", function(d,i) {return 20*i})
				.attr("r", function(d) {return 8})
				*/

		$("body").append(this.tooltip.render().$el);

	},

	calculateImgPosition: function(i) {
		var maxcols = Math.ceil(this.width/this.imgwidth);

		var row = Math.floor(i/maxcols);
		var col = i-(row*maxcols);

		pos = {x:col*this.imgwidth, y:row*this.imgheight};
		return pos;
	}

});

// VistaToolTipEstablecimiento
// ----------------------------
// Muestra tooltip con mini ficha del establecimiensto (se ubica al hacer rollover sobre el establecimiento)
var VistaToolTipEstablecimiento = Backbone.View.extend({

	initialize: function() {
		this.datoestablecimiento = {
			nombre_establecimiento : "sin establecimiento",
			rbd:0,
			nombre_comuna : "sin comuna",
			financiamiento : 0,
			psu_lenguaje : 0,
			psu_matematica : 0,
			ive_media : 0,
			numero_alumnos : 0
		}
	},

	// show
	// ----
	// Genera el menaje a mostrar (de acuerdo a datos ingresados) y muestra el tooltip en la
	// posición indicada
	//
	// data: {nombre_establecimientos:"Escuela Arturo Prat", rbd: 123, ...}
	// pos : {x: 100, y: 250}
	show: function(data, pos) {
		$tooltip = this.$el;
		$tooltipcontent = $tooltip.find(".tooltipcontent")


		$tooltipcontent.html(this.message(data));

		$tooltip.css({"top":pos.y+10+$(window).scrollTop(), "left":pos.x-200});

		$tooltip.show();
	},

	hide: function() {
		$tooltip = this.$el;
		$tooltip.hide();
	},

	message: function(data) {
		var format = d3.format(",d")
		msg = data.nombre;
		/*
		msg = data.nombre+" ("+data.rbd + ") -"+data.nombre_comuna;
		msg += "<br>Financiamiento público 2011: $" + format(data.financiamiento)
		msg += "<br>PSU Leng: " + data.psu_lenguaje +" PSU Mat: "  + data.psu_matematica;
		msg += "<br>Índice de vulnerabilidad (media): " + Math.round(data.ive_media)+"%";
		msg += "<br>Matrícula total: " + data.numero_alumnos +" ( $"+format(Math.round(data.financiamiento/data.numero_alumnos))+"/est. en promedio)";
*/
		return msg
	},


	render: function() {
		$tooltip = this.$el
		$tooltip.hide();
		$tooltip.attr("style", "background:#ffff99;width:350px;position:absolute;z-index:9999;border-radius:8px");

		$tooltipcontent = $("<div>")
			.attr("class", "tooltipcontent")
			.attr("style", "padding:4px;border:1px solid");

		$tooltip.append($tooltipcontent);
		$tooltip.appendTo($("body"));

		this.hide();

		return this;
	}
});
