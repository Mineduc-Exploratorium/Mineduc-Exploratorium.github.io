// visAccesoEdSup
define([
	'underscore',
	'backbone',
	'jquery',
	'd3',
	'LayoutDotBarChart',
	'VistaTooltip',
	'VistaLeyendaSVG',
	], function(_, Backbone,$, d3, LayoutDotBarChart, VistaTooltip,VistaLeyendaSVG){

	var Visualizador = Backbone.View.extend(
		/** @lends Visualizador.prototype */
		{

		/**
		* @class VistaPrincipal vista que despliega visualizacion de ingresos vs costos de carreras
		*
		* @augments Backbone.View
		* @constructs
		*
		* @param {object} options parametros de incializacion
		* @param {array} options.data arreglo con datos (cada dato es un objeto con atributos)
		* @param {d3.select()} options.svg elemento SVG utilizado como contenedor del gráfico
		* @param {Backbone.View} options.tooltip vista utilizada como tooltip
		* Visualizador Inicia parametros de configuración y llamada a datos
		*/
		initialize: function() {
			//this.svg = this.options && this.options.svg ? this.options.svg : document.createElementNS('http://www.w3.org/2000/svg', "g");
			this.data = this.options && this.options.data ? this.options.data : [];

			// Binding de this (esta vista) al contexto de las funciones indicadas
			_.bindAll(this,"render", "tootipMessage","seleccionaOrigen")

			// Alias a this para ser utilizado en callback functions
			var self = this; 
			
			// Configuración de espacio de despliegue de contenido en pantalla
			this.margin = {top: 20, right: 20, bottom: 30, left: 20},
	    	this.width = 1000 - this.margin.left - this.margin.right,
	    	this.height = 400 - this.margin.top - this.margin.bottom;

	   		//this.color = d3.scale.category20();

	   		this.color = d3.scale.ordinal()
               .range(["blue", "red","yellow"])
               .domain(["Municipal", "Particular Subvencionado","Particular Pagado"])


			this.tooltip = new VistaTooltip();
	  		// Reescribe función generadora del mensaje en tooltip
			this.tooltip.message = this.tootipMessage;

			// Limpia Data
			// ===========
			// Limpia datos de entrada (P.Ej. Cambiar duración de semestres a años)
			this.data = _.map(this.data, function(d,i) {
				d.tasa = d.TOTAL_DOCENTES > 0 ? d.TOTAL_MATRICULA/d.TOTAL_DOCENTES : 0;

				if (d.tasa > 40) {
					d.grupo = "Mayor a 40"
				} else if (d.tasa >= 30) {
					d.grupo = "30 a 40"
				} else if (d.tasa >= 20) {
					d.grupo = "20 a 30"
				} else if (d.tasa >= 10) {
					d.grupo = "10 a 20"
				} else {
					d.grupo = "Menor a 10"
				}

				switch(d.TIPO_DEPENDENCIA)
				{
				case "1":
				  d.DEPENDENCIA = "Municipal"
				  break;
				case "2":
				  d.DEPENDENCIA = "Municipal"
				  break;
				case "3":
				  d.DEPENDENCIA = "Particular Subvencionado"
				  break;
				case "4":
				  d.DEPENDENCIA = "Particular Pagado"
				  break;
				case "5":
				  d.DEPENDENCIA = "Particular Subvencionado"
				  break;
				default:
				  d.DEPENDENCIA = null;
				}

				return d;
			})


			// Ordenar nodos por tasa de estudiantyes
			this.data = _.sortBy(this.data,function(d) {
				return -d.tasa;
			})



			this.xScale = d3.scale.ordinal()
				.domain(["Menor a 10","10 a 20","20 a 30","30 a 40","Mayor a 40"])
				.rangeBands([0,this.width], 0.1)

			this.layout = LayoutDotBarChart()
				.height(this.height)
				.groupAttribute("grupo")
				.scale(this.xScale)
				.sort(function(d) {return +d.tasa})


			this.svg = d3.select(this.el)
				.attr("width", this.width + this.margin.left + this.margin.right)
			    .attr("height", this.height + this.margin.top + this.margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


			this.legend = new VistaLeyendaSVG({
			 	svg : this.svg, 	// Elemento SVG en el cual se ubica la leyenda
			 	scale : this.color, // Escala ordinal con colores (range) para un dominio (domain)
			 	left: this.width, 	// Ubicacción horizontal del extremo DERECHO de la leyenda
			 	top:30
			 });	

			this.xAxis = d3.svg.axis()
			    .scale(this.xScale)
			    .orient("bottom");

			this.svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + this.height + ")")
		      .call(this.xAxis)
		      .append("text")
			      .attr("class", "label")
			      .attr("x", this.width)
			      .attr("y", -6)
			      .style("text-anchor", "end")
			      .text("Estudiantes/Docentes");

			
			// Parte inicialmente con la región 15
		    this.seleccionaOrigen(15);		
	 
		},

		/**
		* Selecciona una región (flitra datos correspondientes a dicha Region) y vuelve a desplegar resultados
		* @paran {number} num numero de Región (Ej. 15 para Arica)
		*/
		seleccionaOrigen:function(num){
			this.filteredData = _.filter(this.data,function(d) {
				return d.CP_REGION==num;
			})
			this.render()
		},

		/**
		* Reescribe función generador de mensajes utilizado en herramienta de tooltip
		* tooltip.tooltipMessage(data) 	
		*
		* @param {object} data objeto con atributos (Ej: {nombre: "Juan", Edad: 18}) utilizados en la creación del mensaje a desplegar por tooltip
		* @returns {string} Mensaje (html) a ser utilizado por tooltip
		*/
		tootipMessage : function(d) {
		
			var formatMiles = d3.format(",d");
			var formatDecimal = d3.format('.2f')

			msg = "<strong>"+d.NOMBRE_ESTA+" ("+d.RBD+")</strong>";
			msg += "<br>"+d.DEPENDENCIA;
			msg += "<br>"+d.NOM_COMUNA;
			msg += "<br>"+d.TOTAL_DOCENTES+ (d.TOTAL_DOCENTES == 1 ? " docente" : " docentes");
			msg += "<br>"+formatMiles(d.TOTAL_MATRICULA)+" estudiantes";
			msg += "<br>"+formatDecimal(d.tasa)+" estudiantes x docente";

			
			return msg;
		}, 


		/**
		* Despliegue inicial de elementos gráficos.
		*/
		render: function() {
			var self = this; // Auxiliar para referirse a this en funciones callback

			var nodes = this.layout.nodes(this.filteredData);

			// Asocia nodos con puntos de graficación
			this.dots = this.svg.selectAll("rect.dot")
				.data(nodes, function(d) {return d.RBD})


			// Eliminar puntos que ya no están en la selección
			this.dots.exit()
				.transition()
				.duration(1000)
				.call(offscreenPosition)
				.remove()	

			// Agregar nuevos puntos
			this.dots.enter()
					.append("rect")
					.attr("class", "dot")
					// Captura eventos para uso de tootlip
					.on("mouseenter", function(d) {
						self.tooltip.show(d)}
						)
					.on("mouseleave", function(d) {
						self.tooltip.hide()}
						)

					.attr("opacity", 0.8)
					// Los ubica en el origen
					
					.attr("y", function(d,i) {return self.height-d.dy+"px"})
					.attr("width",  function(d) {return d.dx+"px"})
					.attr("height",  function(d) {return d.dy+"px"})
					.style("fill", function(d) {return self.color(d.DEPENDENCIA)})
					.call(offscreenPosition)
					.transition()
					.duration(1000)
					.call(position)
					//.attr("x", function(d,i) {return d.x+"px"})
					//.attr("y", function(d,i) {return self.height-d.y-d.dy+"px"})

			// Ubica los puntos fuera de la pantalla para efectos de entrada/salida
			function offscreenPosition(dots) {
				var offscreenXScale = d3.scale.linear().domain([0, self.width]).range([-self.width, 2*self.width])

				dots.attr("x", function(d) {
					var offX = offscreenXScale(d.x)
					var randOffX = d3.random.normal(offX,10)
					return randOffX();
				})

				dots.attr("y",  d3.random.normal(self.height+100, 50))
			}

			// Ubica los puntos en su posición de destino
			function position(dots) {
				dots.attr("x", function(d) {return d.x })

				dots.attr("y", function(d) {return self.height-d.y-d.dy})
			}


		}

	});
  
  return Visualizador;
});

