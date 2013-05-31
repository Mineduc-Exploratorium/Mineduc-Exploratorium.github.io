define([
  'underscore',
  'd3',
	], function(_, d3){

	var LayoutDotBarChart = function() {
		var layout = {};
		var height = 500;
		var groupAttribute = "grupo";
		var scale = d3.scale.ordinal();


		layout.nodes = function(data) {
			var sortedData = _.sortBy(data, sort);


			var groupedData = _.groupBy(sortedData, function(d) {return d[groupAttribute]});
			var bandWidth = scale.rangeBand();
			var maxNumberOfDots = _.max(_.map(d3.values(groupedData), function(d) {return d.length}));

			var columnHeight = height;
			var columnWidth = scale.rangeBand();
			var HWRatio = columnHeight/columnWidth;
			var numDotsWidth = Math.ceil(Math.sqrt(maxNumberOfDots/HWRatio));
			var dotSide = columnWidth/numDotsWidth;

			var nodes = [];

			_.each(d3.keys(groupedData), function(key) {

				_.each(groupedData[key], function(d, i) {
					var miniRow = Math.floor(i/numDotsWidth)
					var miniColumn = i-miniRow*numDotsWidth;
					d.dx = dotSide;
					d.dy = dotSide;
					d.x = scale(key) + miniColumn*dotSide;
					d.y = miniRow*dotSide;

					nodes.push(d);
				});

			})

			return nodes;
		};

		layout.height = function(_) {
		    if (!arguments.length) return height;
		    height = _;
		    return layout;
		};

		layout.groupAttribute = function(_) {
		    if (!arguments.length) return groupAttribute;
		    groupAttribute = _;
		    return layout;
		};

		layout.scale = function(_) {
		    if (!arguments.length) return scale;
		    scale = _;
		    return layout;
		};

		layout.sort = function(_) {
		    if (!arguments.length) return sort;
		    sort = _;
		    return layout;
		};

		sort = function(d) {
			return d.tasa;
		}


		return layout
	}



  
  return LayoutDotBarChart;
});

