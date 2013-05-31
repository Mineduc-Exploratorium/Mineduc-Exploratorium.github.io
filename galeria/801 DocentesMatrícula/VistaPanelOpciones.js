define([
  'underscore',
  'backbone',
  'jquery',
  'd3',
	], function(_, Backbone,$, d3){

	var VistaPanelOpciones = Backbone.View.extend(
	/** @lends VistaPanelSelectorAreas.prototype */
	  {
		/**
		* @class VistaPanelSelectorAreas Panel con un elemento "select" que permite escoger un área que será utilizada para modificar el despliegue del gráfico
		*
		* @augments Backbone.View
		* @constructs
		*
		* @param {object} options parametros de incializacion
		* @param {string} options.el Identificador de elemento en DOM donde se despliegau la vista
		* @param {string} options.areas Arreglo con el listado de áreas a seleccionar (Ej. ["Salud", "Educación", ...])
		*/
		initialize: function() {
			this.render()
		},

		events: {
			//"click button.visualizacion": "seleccionaOrigen",
			"change select#id_inputArea" : "seleccionaOrigen"
		},

		seleccionaOrigen: function(e) {
			//var viztype = $(e.target).attr("viztype");
			region = $(e.target).val();
			this.trigger("seleccionaOrigen", region);
		},

		

		/**
		* Despliegua elementos visuales 	
		*/
		render: function() {
		
			this.areas = [
			         {codigo: "0",  nombre: "Seleccione una región" },
			         {codigo: "15", nombre: "Arica y Parinacota" },
			         {codigo: "1",  nombre: "Tarapacá" },
			         {codigo: "2",  nombre: "Antofagasta" },
			         {codigo: "3",  nombre: "Atacama" },
			         {codigo: "4",  nombre: "Coquimbo" },
			         {codigo: "5",  nombre: "Valparaíso" },
			         {codigo: "13", nombre: "Metropolitana de Santiago" },
			         {codigo: "6",  nombre: "Libertador General Bernardo O'Higgins" },
			         {codigo: "7",  nombre: "Maule" },
			         {codigo: "8",  nombre: "Biobío" },
			         {codigo: "9",  nombre: "Araucanía" },
			         {codigo: "14", nombre: "Los Ríos" },
			         {codigo: "10", nombre: "Los Lagos" },
			         {codigo: "11", nombre: "Aysén del General Carlos Ibáñez del Campo" },
			         {codigo: "12", nombre: "Magallanes y de la Antártica Chilena" },
				];

			var selectorArea = d3.select(this.el)
			selectorArea.append("select")
				.attr("id", "id_inputArea")
				.selectAll("option")
				.data(this.areas)
				.enter()
					.append("option")
					.attr("value", function(d) {return d.codigo})
					.attr("selected", function(d) {return d.codigo == 15 ? "selected" : null})
					.text(function(d) {return  d.nombre})


		}
	});
  
  return VistaPanelOpciones;
});

