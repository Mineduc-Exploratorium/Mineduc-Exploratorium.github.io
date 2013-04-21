$().ready(function() {
	vista = new VistaPrincipal({el:"#main-content"});
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

    	this.thumbnailWidth = 200;
		this.thumbnailHeight = 150;

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

		var itemsPorFila = 4
		// Genera un objeto con un grupo de items para cada fila {0:[{}, {}], 1:[...], }
		this.databyRows = _.groupBy(this.data, function(d,i) {return Math.floor(i/itemsPorFila)});
		// Convierte en objeto en un areglo de arreglos (con itemsPorFila c/u )
		this.databyRows = _.toArray(this.databyRows);
	
		// Genera contenedor principal de la galería
		this.galeria = d3.select(this.el)
			.append("div")
			.attr("id","galeria")

		// Genera las filas (<div class="row">) - Usando Rows de Boostrap
		this.filas = this.galeria.selectAll(".row")
			.data(this.databyRows)
			.enter()
				.append("div")
				.attr("class", "row");

		// Genera celdas en cada fila (<div class="span3">) - Usando span de Bootstrap
		this.celdas = this.filas.selectAll(".item")
			.data(function(d) {return d})
			.enter()
				.append("div")
					.attr("class", "span3")
				.append("a")
					.attr("href",function(d) {return d.url})				

		// Agrega título a cada celda
		this.celdas
				.append("h5")
					.text(function(d) {return d.titulo})

		// Agrega un div con la imágen
		this.celdas
				.append("img")
					.attr("class", "img-polaroid")
					.attr("src",  function(d) {return d.imgurl})


		$("body").append(this.tooltip.render().$el);

	},


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
