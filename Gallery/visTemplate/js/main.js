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

		// Vista con tooltip para mostrar ficha de establecimiento
		this.tooltip = new VistaToolTipEstablecimiento();
		this.tooltip.message = function (data) {
			return data.nombre + " - " + data.tipo;
		}
 
    	// Carga de datos
    	//
		this.$el.append("<progress id='progressbar'></progress>");
		d3.tsv("data/matriculaEdSup.txt", function(data) {
			$("#progressbar").hide(); // Ocultar barra de progreso

			self.data = data;
			self.render();
		});
	},


	render: function() {
		self = this; // Para hacer referencia a "this" en callback functions

		// Genera escalas utilizadas en gráfico X/Y
		this.xScale = d3.scale.sqrt()
    		.range([0, this.width]);

		this.yScale = d3.scale.sqrt()
    		.range([this.height, 0]);

		// Calcula el dominio de las escalas en base al valos de los datos que van en ejes 
		// x (psu Lenguaje) e y (financiamiento)
		this.xScale.domain(d3.extent(this.data, function(d) { return parseInt(d.pregrado2012)})).nice();
		this.yScale.domain(d3.extent(this.data, function(d) { return parseInt(d.titulados2011) })).nice();

		// Escala para calcular el radio de cada circulo
		radious = d3.scale.sqrt()
			.range([2, 15])
			.domain(d3.extent(this.data, function(d) { return parseInt(d.pregrado2012)}));

			// Genera elemento SVG contenedor principal de gráficos
		this.svg = d3.select(this.el).append("svg")
		    .attr("width", this.width + this.margin.left + this.margin.right)
		    .attr("height", this.height + this.margin.top + this.margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		var color = d3.scale.category10();

		var xAxis = d3.svg.axis()
		    .scale(this.xScale)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(this.yScale)
		    .orient("left");

		this.svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + this.height + ")")
		  .attr("opacity",1)
		  .call(xAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("x", this.width)
		  .attr("y", -6)
		  .style("text-anchor", "end")
		  .text("Matrícula Pregrado 2012");

		this.svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		  .attr("opacity",1)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Titulados 2011")


		this.svg.selectAll("circle")
			.data(this.data)
			.enter()
				.append("circle")
				.attr("cx", function(d) {return self.xScale(d.pregrado2012)})
				.attr("cy", function(d) {return self.yScale(d.titulados2011)})
				.attr("r", function(d) {return radious(d.pregrado2012)})
				.attr("fill", function(d) {return color(d.acreditacion)})
				.on("mouseenter", function(d) {
					pos = {x:d3.event.x, y:d3.event.y}
					self.tooltip.show(d, pos)}
					)
				.on("mouseleave", function(d) {self.tooltip.hide()})

		$("body").append(this.tooltip.render().$el);

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
