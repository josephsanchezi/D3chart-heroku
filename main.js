/* bar chart setting*/
//tick count
var tick_count = 3;
//bar width
var bar_width = 20;
//space width
var space_width = 5;
/////////////////////////////////////
var svg = d3.select("svg"),
	margin = {
		top: 20,
		right: 20,
		bottom: 50,
		left: 50
	},
// width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var parseTime = d3.timeFormat("%Y");
var y = d3.scaleLinear()
	.rangeRound([height, 0]);
// Load the data from q3.csv task 1
d3.dsv(",","q3.csv").then(function (data) {
	//ordered by ascending time task 2
	data.sort(function(a, b) {
	  return d3.ascending(a.year, b.year)
	})
	var xScaleRange = data.length * (bar_width+space_width);
	width = xScaleRange+ margin.left + margin.right;
	svg.attr('width',width);
	var x = d3.scaleBand()
	.rangeRound([0,xScaleRange])
	.padding(space_width/(bar_width+space_width));
	x.domain(data.map(function (d) {

		//parse time
		// d.year = parseTime(d.year);
			return d.year;
		}));
	y.domain([0, d3.max(data, function (d) {
				return Number(d.running_total);
			})]);

	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	// tick one for three
	.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return !(i % tick_count); })))
	.append("text")
	.attr("fill", "blue")
	.attr("y", margin.bottom/2)
	.attr("dy", "0.71em")
	.attr("class", "x_label")
	.attr("transform", "translate(" + (width-margin.left - margin.right)/2+ ",0)")
	.attr("text-anchor", "end")
	.text("year")
	;

	g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.attr("fill", "blue")
	.attr("class", "y_label")
	.attr("transform", "rotate(-90)")
	.attr("y", -(margin.left))
	.attr("dy", "0.71em")
	.attr("x", -(height/2-margin.bottom))
	.attr("text-anchor", "end")
	.text("running_total");

	// title
	g.append("g")
	.append("text")
	.attr("fill", "red")
	.attr("y", -15)
	.attr("dy", "0.71em")
	.attr("transform", "translate(" + (width-margin.left - margin.right)/2+ ",0)")
    .attr("text-anchor", "middle") 
    .text("Lego Sets by Year from Rebrickable");
    // GT name
	g.append("g")
	.append("text")
	.attr("fill", "red")
	.attr("y", height+margin.bottom/2)
	.attr("dy", "0.71em")
	.attr("transform", "translate(" + (width-margin.left - margin.right)+ ",0)")
    .attr("text-anchor", "end") 
    .text("write your name");

	g.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function (d) {
		return x(d.year);
	})
	.attr("y", function (d) {
		return y(Number(d.running_total));
	})
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
		return height - y(Number(d.running_total));
	});
});