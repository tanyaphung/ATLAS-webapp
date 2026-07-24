var domain_col = {"Activities":"#ffa1ba","Aging":"#bf0058","Body Functions":"#f3136f",
"Body Structures":"#ff978f","Cardiovascular":"#8a1b22","Cell":"#ff6b63",
"Cognitive":"#be6100","Connective tissue":"#884500","Dermatological":"#fe9617",
"Ear, Nose, Throat":"#968900","Endocrine":"#ceca59","Environment":"#a8d538",
"Gastrointestinal":"#5ad754","Hematological":"#75db8d","Immunological":"#00532e",
"Infection":"#02a58b","Metabolic":"#78d7c6","Mortality":"#3ac7ff",
"Muscular":"#009cf8","Neoplasms":"#0261dd","Neurological":"#344382",
"Nutritional":"#9262ec","Ophthalmological":"#deb7fb","Psychiatric":"#6c179f",
"Reproduction":"#f790ff","Respiratory":"#d73fbf","Skeletal":"#930075",
"Social Interactions":"#772c50"};

$(document).ready(function(){
  dbSum();
  yearSumPlot();
  DomainPiePlot();
  domainSumPlot();
});

function dbSum(){
	$.ajax({
		url: subdir+"/stats/dbSum",
		type: "POST",
		success: function(data){
			data = JSON.parse(data);
			$('#totalGWAS').html(data.GWAS);
			$('#uniqTrait').html(data.trait);
			$('#uniqStudy').html(data.study);
			$('#uniqDomain').html(data.domain);
		}
	})
}

function yearSumPlot(){
	var margin = {top:10, right: 50, bottom:30, left:65},
        width = 600,
        height = 280;
	var svg = d3.select("#yearSumPlot").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom)
              .append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")");
	var hist_height = 60;
	var hist_space = 10;
	var ipanel = 0;

	d3.json(subdir+'/stats/yearSumPlot', function(data){
		// summary data
		data.sum.forEach(function(d){
			d[0] = +parseInt(d[0]); //year (string)
			d[1] = +d[1]; //Nstudy
			d[2] = +d[2]; //Ngwas
			d[3] = +d[3]; //Ntrait
		});
		// box plot data
		data.Nbox.data.forEach(function(d){
			d[0] = +parseInt(d[0]); //year (string)
			d[1] = +d[1]; //median
			d[2] = +d[2]; //mean
			d[3] = +d[3]; //1st q
			d[4] = +d[4] //3rd q
			d[5] = +d[5] //min
			d[6] = +d[6] //max
		});
		// ourliers
		data.Nbox.out.forEach(function(d){
			d[0] = +parseInt(d[0]); //year (string)
			d[1] = +d[1]; //N
		});

		var years = data.sum.map(function(d){return d[0]});
		var x = d3.scale.ordinal().domain(years).rangeBands([0, width], 0.1);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		// Nstudy
		ipanel = 1;
		var y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		var ymax = d3.max(data.sum, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip1 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[1]});
		svg.call(tip1);
		svg.selectAll('.Nstudy').data(data.sum.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "pink")
			.on("mouseover", tip1.show)
			.on("mouseout", tip1.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis);
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N studies")
			.style("font-size", "12px");

		//Ngwas
		ipanel = 2;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data.sum, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip2 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[2]});
		svg.call(tip2);
		svg.selectAll('.Ngwas').data(data.sum.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "orange")
			.on("mouseover", tip2.show)
			.on("mouseout", tip2.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N GWAS")
			.style("font-size", "12px");

		//Ntrait
		ipanel = 3;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data.sum, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip3 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[3]});
		svg.call(tip3);
		svg.selectAll('.Ntrait').data(data.sum.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", "lightgreen")
			.on("mouseover", tip3.show)
			.on("mouseout", tip3.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N traits")
			.style("font-size", "12px");

		//Nsample
		ipanel = 4;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data.Nbox.out, function(d){return d[1]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip4 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return "Median: "+d[1]+"<br/>Avg: "+d[2]+"<br/>"});
		svg.call(tip4);
		// box
		svg.selectAll('.box').data(data.Nbox.data)
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("width", x.rangeBand()*0.7)
			.attr("y", function(d){return y(d[4])})
			.attr("height", function(d){return y(d[3])-y(d[4])})
			.style("fill", "skyblue")
			.style("opacity", .8)
			.style("stroke", "steelblue")
			.on("mouseover", tip4.show)
			.on("mouseout", tip4.hide);
		// median
		svg.selectAll('.medianline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.85})
			.attr("y1", function(d){return y(d[1])})
			.attr("y2", function(d){return y(d[1])})
			.style("stroke", "black");
		// mean
		svg.selectAll('.meanline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.85})
			.attr("y1", function(d){return y(d[2])})
			.attr("y2", function(d){return y(d[2])})
			.style("stroke", "black")
			.style("stroke-dasharray", "2,2");
		// upper bars
		svg.selectAll('.upperline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("y1", function(d){return y(d[4])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", "steelblue");
		svg.selectAll('.topline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[6])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", "steelblue");
		// lower bar
		svg.selectAll('.lowerline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("y1", function(d){return y(d[3])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", "steelblue");
		svg.selectAll('.bottomline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[5])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", "steelblue");
		// outlier
		svg.selectAll('.outdot').data(data.Nbox.out)
			.enter()
			.append('circle')
			.attr('r',2)
			.attr('cx', function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr('cy', function(d){return y(d[1])})
			.style("fill", "skyblue")
			.style("stroke", "steelblue");

		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N samples")
			.style("font-size", "12px");
	});
}

function domainSumPlot(){
	var margin = {top:20, right: 50, bottom:100, left:65},
        width = 800,
        height = 400;
	var svg = d3.select("#domainSumPlot").append("svg")
              .attr("width", width+margin.left+margin.right)
              .attr("height", height+margin.top+margin.bottom)
              .append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")");
	var hist_height = 70;
	var hist_space = 10;
	var ipanel = 0;

	d3.json(subdir+'/stats/domainSumPlot', function(data){
		// summary data
		data.sum.forEach(function(d){
			d[1] = +d[1]; //Nstudy
			d[2] = +d[2]; //Ngwas
			d[3] = +d[3]; //Ntrait
		});
		// Nsample box data
		data.Nbox.data.forEach(function(d){
			d[1] = +d[1]; //median
			d[2] = +d[2]; //mean
			d[3] = +d[3]; //1st q
			d[4] = +d[4] //3rd q
			d[5] = +d[5] //min
			d[6] = +d[6] //max
		});
		data.Nbox.out.forEach(function(d){
			d[1] = +d[1]; //N
		});
		// SNP h2 box data
		data.Hbox.data.forEach(function(d){
			d[1] = +d[1]; //median
			d[2] = +d[2]; //mean
			d[3] = +d[3]; //1st q
			d[4] = +d[4] //3rd q
			d[5] = +d[5] //min
			d[6] = +d[6] //max
		});
		data.Hbox.out.forEach(function(d){
			d[1] = +d[1]; //N
		});

		var years = data.sum.map(function(d){return d[0]});
		var x = d3.scale.ordinal().domain(years).rangeBands([0, width], 0.1);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		// Nstudy
		ipanel = 1;
		var y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		var ymax = d3.max(data.sum, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip1 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[1]});
		svg.call(tip1);
		svg.selectAll('.Nstudy').data(data.sum.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect').attr('class', 'bar')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", function(d){return domain_col[d[0]]})
			.style("opacity", .7)
			.on("mouseover", tip1.show)
			.on("mouseout", tip1.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("transform", "rotate(-60)")
			.attr("dy", "-.25em")
			.attr("dx", "-.85em");
		svg.append('g').attr("class", "y axis")
			.call(yAxis);
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N studies")
			.style("font-size", "12px");

		//Ngwas
		ipanel = 2;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data.sum, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip2 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[2]});
		svg.call(tip2);
		svg.selectAll('.Ngwas').data(data.sum.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", function(d){return domain_col[d[0]]})
			.style("opacity", .7)
			.on("mouseover", tip2.show)
			.on("mouseout", tip2.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N GWAS")
			.style("font-size", "12px");

		//Ntrait
		ipanel = 3;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data.sum, function(d){return d[ipanel]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip3 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return d[3]});
		svg.call(tip3);
		svg.selectAll('.Ntrait').data(data.sum.filter(function(d){if(d[ipanel]>0){return d}}))
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])})
			.attr("width", x.rangeBand())
			.attr("y", function(d){return y(d[ipanel])})
			.attr("height", function(d){return height-(hist_height+hist_space)*(ipanel-1)-y(d[ipanel])})
			.style("fill", function(d){return domain_col[d[0]]})
			.style("opacity", .7)
			.on("mouseover", tip3.show)
			.on("mouseout", tip3.hide);
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N traits")
			.style("font-size", "12px");

		//Nsample
		ipanel = 4;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data.Nbox.out, function(d){return d[1]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip4 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return "Median: "+d[1]+"<br/>Avg: "+d[2]+"<br/>"});
		svg.call(tip4);
		// box
		svg.selectAll('.box').data(data.Nbox.data)
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("width", x.rangeBand()*0.7)
			.attr("y", function(d){return y(d[4])})
			.attr("height", function(d){return y(d[3])-y(d[4])})
			.style("fill", function(d){return domain_col[d[0]]})
			.style("opacity", .7)
			.style("stroke", "steelblue")
			.on("mouseover", tip4.show)
			.on("mouseout", tip4.hide);
		// median
		svg.selectAll('.medianline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.85})
			.attr("y1", function(d){return y(d[1])})
			.attr("y2", function(d){return y(d[1])})
			.style("stroke", "black");
		// mean
		svg.selectAll('.meanline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.85})
			.attr("y1", function(d){return y(d[2])})
			.attr("y2", function(d){return y(d[2])})
			.style("stroke", "black")
			.style("stroke-dasharray", "2,2");
		// upper bars
		svg.selectAll('.upperline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("y1", function(d){return y(d[4])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", function(d){return domain_col[d[0]]});
		svg.selectAll('.topline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[6])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", function(d){return domain_col[d[0]]});
		// lower bar
		svg.selectAll('.lowerline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("y1", function(d){return y(d[3])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", function(d){return domain_col[d[0]]});
		svg.selectAll('.bottomline').data(data.Nbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[5])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", function(d){return domain_col[d[0]]});
		// outlier
		svg.selectAll('.outdot').data(data.Nbox.out)
			.enter()
			.append('circle')
			.attr('r',2)
			.attr('cx', function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr('cy', function(d){return y(d[1])})
			.style("fill", function(d){return domain_col[d[0]]})
			.style("opacity", .7)
			.style("stroke", "grey");

		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("N samples")
			.style("font-size", "12px");

		//SNP h2
		ipanel = 5;
		y = d3.scale.linear().range([height-(hist_height+hist_space)*(ipanel-1), height-hist_height*ipanel-hist_space*(ipanel-1)]);
		ymax = d3.max(data.Hbox.out, function(d){return d[1]});
		y.domain([0, ymax+ymax*0.05]);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);
		var tip5 = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return "Median: "+d[1]+"<br/>Avg: "+d[2]+"<br/>"});
		svg.call(tip5);
		// box
		svg.selectAll('.box').data(data.Hbox.data)
			.enter()
			.append('rect')
			.attr("x", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("width", x.rangeBand()*0.7)
			.attr("y", function(d){return y(d[4])})
			.attr("height", function(d){return y(d[3])-y(d[4])})
			.style("fill", function(d){return domain_col[d[0]]})
			.style("opacity", .7)
			.style("stroke", "steelblue")
			.on("mouseover", tip4.show)
			.on("mouseout", tip4.hide);
		// median
		svg.selectAll('.medianline').data(data.Hbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.85})
			.attr("y1", function(d){return y(d[1])})
			.attr("y2", function(d){return y(d[1])})
			.style("stroke", "black");
		// mean
		svg.selectAll('.meanline').data(data.Hbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.15})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.85})
			.attr("y1", function(d){return y(d[2])})
			.attr("y2", function(d){return y(d[2])})
			.style("stroke", "black")
			.style("stroke-dasharray", "2,2");
		// upper bars
		svg.selectAll('.upperline').data(data.Hbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("y1", function(d){return y(d[4])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", function(d){return domain_col[d[0]]});
		svg.selectAll('.topline').data(data.Hbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[6])})
			.attr("y2", function(d){return y(d[6])})
			.style("stroke", function(d){return domain_col[d[0]]});
		// lower bar
		svg.selectAll('.lowerline').data(data.Hbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr("y1", function(d){return y(d[3])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", function(d){return domain_col[d[0]]});
		svg.selectAll('.bottomline').data(data.Hbox.data)
			.enter()
			.append('line')
			.attr("x1", function(d){return x(d[0])+x.rangeBand()*0.25})
			.attr("x2", function(d){return x(d[0])+x.rangeBand()*0.75})
			.attr("y1", function(d){return y(d[5])})
			.attr("y2", function(d){return y(d[5])})
			.style("stroke", function(d){return domain_col[d[0]]});
		// outlier
		svg.selectAll('.outdot').data(data.Hbox.out)
			.enter()
			.append('circle')
			.attr('r',2)
			.attr('cx', function(d){return x(d[0])+x.rangeBand()*0.5})
			.attr('cy', function(d){return y(d[1])})
			.style("fill", function(d){return domain_col[d[0]]})
			.style("opacity", .7)
			.style("stroke", "grey");

		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+(height-(hist_height+hist_space)*(ipanel-1))+")")
			.call(xAxis).selectAll("text").remove();
		svg.append('g').attr("class", "y axis")
			.call(yAxis)
			.selectAll("text");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width+10)+","+(height-(hist_height+hist_space)*(ipanel-1)+height-hist_height*ipanel-hist_space*(ipanel-1))/2+")rotate(90)")
			.text("SNP h2")
			.style("font-size", "12px");
	});
}

function DomainPiePlot(){
	var width = 250,
		height = 250,
		radius = Math.min(width, height)/2;
	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 80);
	var arcLabel = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);
	var arcOver = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 85);
	var outerArc = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 5);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){return d.count;});

	var color = d3.scale.ordinal()
		.range(["#80ccff", "#8080ff", "#ff80df", "#e699cc", "#ff8080", "#ffb380", "#ff9980"]);

	d3.json(subdir+"/stats/DomainPie", function(data){
		var total = 0;
		data.forEach(function(d){
			d.count = +d.count;
			total += d.count;
		});

		// get label position without overlap
		var label = [];
		data.forEach(function(d){label.push(d.Domain)});
		var tmp = PieCorrdinate(pie(data), label, outerArc);
		var label_pos = tmp[0];
		var links = tmp[1];
		for(var i=0; i<label_pos.length; i++){
			data[i].x = label_pos[i][0];
			data[i].y = label_pos[i][1];
		}

		// set margin
		var margin = {top:Math.max(Math.abs(tmp[4])-radius+10, 50), right:Math.max(tmp[2]-radius+10, 50), bottom:Math.max(tmp[5]-radius+10, 50), left:Math.max(Math.abs(tmp[3])-radius+10, 50)};

		var svg = d3.select("#DomainPie").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

		var g = svg.selectAll(".arc")
			.data(pie(data)).enter().append("g")
			.attr("class", "arc");
		g.append("path").attr("d", arc)
			.style("fill", function(d){return domain_col[d.data.Domain]})
			.style("opacity", .65)
			.on("mouseover", function(d){
				d3.select(this)
				.attr("d", arcOver)
			})
			.on("mouseout", function(d){
				d3.select(this)
				.attr("d", arc)
			})
			.on("click", function(d, i){
				ChapterPiePlot(data[i]["Domain"]);
			});

		svg.selectAll(".label").data(data).enter()
			.append("text")
			.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
			.text(function(d) { return d.Domain; })
			.style("font-size", "10")
			.attr("text-anchor", function(d){
				if(d.x>0){
					return "start";
				}else{
					return "end";
				}
			})
			.attr("dx", function(d){
				if(d.x>0){
					return ".25em";
				}else{
					return "-.25em";
				}
			})
			.attr("dy", ".4em");
		svg.selectAll(".line").data(links.filter(function(d){if(Math.abs(d[2]-d[1])>8){return d}})).enter()
			.append("line")
			.attr("x1", function(d){return d[0]})
			.attr("x2", function(d){return d[0]})
			.attr("y1", function(d){return d[1]})
			.attr("y2", function(d){return d[2]})
			.style("stroke", "black");
		g.append("text")
			.attr("transform", function(d){ return "translate(" + arcLabel.centroid(d) + ")"})
			.text(function(d){ return d.data.count; })
			.style("font-size", "10")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em");

		// center label
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", -10)
			.text(total);
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 5)
			.text("unique")
			.style('font-size', 10);
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 15)
			.text("study-domain pairs")
			.style('font-size', 10);
	});
}

function ChapterPiePlot(domain){
	var width = 250,
		height = 250,
		radius = Math.min(width, height)/2;

	// d3.select('#ChapterPie').select('svg').remove();
	$('#ChapterPie').html("Selected domain: "+domain+"<br/>");

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 80);
	var arcOver = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 85);
	var arcLabel = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);
	var outerArc = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 5);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){return d.count;});

	d3.json(subdir+"/stats/ChapterPie/"+domain, function(data){
		var total = 0;
		data.forEach(function(d){
			d.count = +d.count;
			total += d.count;
		});

		// generate color
		var color = d3.scale.linear().domain([0, data.length/4, data.length/2, data.length*3/4, data.length]).range(["#6666ff", "#cc66ff", "#ff6699", "#ffcc66", "#00cc66"]);

		// get label position without overlap
		var label = [];
		data.forEach(function(d){label.push(d.ChapterLevel)});
		var tmp = PieCorrdinate(pie(data), label, outerArc);
		var label_pos = tmp[0];
		var links = tmp[1];
		for(var i=0; i<label_pos.length; i++){
			data[i].x = label_pos[i][0];
			data[i].y = label_pos[i][1];
		}

		// set margin
		var margin = {top:Math.max(Math.abs(tmp[4])-radius+10, 50), right:Math.max(tmp[2]-radius+10, 50), bottom:Math.max(tmp[5]-radius+10, 50), left:Math.max(Math.abs(tmp[3])-radius+10, 50)};

		var svg = d3.select("#ChapterPie").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

		var g = svg.selectAll(".arc")
			.data(pie(data)).enter().append("g")
			.attr("class", "arc");
		g.append("path").attr("d", arc)
			.style("fill", function(d,i){return color(i)})
			.style("opacity", .8)
			.on("mouseover", function(d){
				d3.select(this)
				.attr("d", arcOver)
			})
			.on("mouseout", function(d){
				d3.select(this)
				.attr("d", arc)
			})
			.on("click", function(d, i){
				SubchapterPiePlot(domain, data[i]["ChapterLevel"]);
			});
		svg.selectAll(".label").data(data).enter()
			.append("text")
			.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
			.text(function(d) { return d.ChapterLevel; })
			.style("font-size", "10")
			.attr("text-anchor", function(d){
				if(d.x>0){
					return "start";
				}else{
					return "end";
				}
			})
			.attr("dx", function(d){
			if(d.x>0){
					return ".25em";
				}else{
					return "-.25em";
				}
			})
			.attr("dy", ".4em");
		svg.selectAll(".line").data(links.filter(function(d){if(Math.abs(d[2]-d[1])>8){return d}})).enter()
			.append("line")
			.attr("x1", function(d){return d[0]})
			.attr("x2", function(d){return d[0]})
			.attr("y1", function(d){return d[1]})
			.attr("y2", function(d){return d[2]})
			.style("stroke", "black");
		g.append("text")
			.attr("transform", function(d){ return "translate(" + arcLabel.centroid(d) + ")"})
			.text(function(d){ return d.data.count; })
			.style("font-size", "10")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em");
		// center label
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", -10)
			.text(total);
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 5)
			.text("unique")
			.style('font-size', 10);
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 15)
			.text("study-chapter pairs")
			.style('font-size', 10);
	});
}

function SubchapterPiePlot(domain, chapter){
	var width = 250,
		height = 250,
		radius = Math.min(width, height)/2;

	// d3.select('#SubchapterPie').select('svg').remove();
	$('#SubchapterPie').html("Selected domain: "+domain+"<br/>Selected chapter: "+chapter+"<br/>");

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 80);
	var arcOver = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 85);
	var arcLabel = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);
	var outerArc = d3.svg.arc()
		.outerRadius(radius - 5)
		.innerRadius(radius - 5);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){return d.count;});

	d3.json(subdir+"/stats/SubchapterPie/"+domain+"/"+chapter, function(data){
		var total = 0;
		data.forEach(function(d){
			d.count = +d.count;
			total += d.count;
		});

		// generate color
		var color = d3.scale.linear().domain([0, data.length/4, data.length/2, data.length*3/4, data.length]).range(["#6666ff", "#cc66ff", "#ff6699", "#ffcc66", "#00cc66"]);

		// get label position without overlap
		var label = [];
		data.forEach(function(d){label.push(d.SubchapterLevel)});
		var tmp = PieCorrdinate(pie(data), label, outerArc);
		var label_pos = tmp[0];
		var links = tmp[1];
		for(var i=0; i<label_pos.length; i++){
			data[i].x = label_pos[i][0];
			data[i].y = label_pos[i][1];
		}

		// set margin
		var margin = {top:Math.max(Math.abs(tmp[4])-radius+10, 50), right:Math.max(tmp[2]-radius+10, 50), bottom:Math.max(tmp[5]-radius+10, 50), left:Math.max(Math.abs(tmp[3])-radius+10, 50)};

		var svg = d3.select("#SubchapterPie").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+(margin.left+width/2)+","+(margin.top+height/2)+")");

		var g = svg.selectAll(".arc")
			.data(pie(data)).enter().append("g")
			.attr("class", "arc");
		g.append("path").attr("d", arc)
			.style("fill", function(d,i){return color(i)})
			.style("opacity", .8)
			.on("mouseover", function(d){
				d3.select(this)
					.attr("d", arcOver)
			})
			.on("mouseout", function(d){
				d3.select(this)
					.attr("d", arc)
			});
		svg.selectAll(".label").data(data).enter()
			.append("text")
			.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
			.text(function(d) { return d.SubchapterLevel; })
			.style("font-size", "10")
			.attr("text-anchor", function(d){
				if(d.x>0){
					return "start";
				}else{
					return "end";
				}
			})
			.attr("dx", function(d){
				if(d.x>0){
					return ".25em";
				}else{
					return "-.25em";
				}
			})
			.attr("dy", ".4em");
		svg.selectAll(".line").data(links.filter(function(d){if(Math.abs(d[2]-d[1])>8){return d}})).enter()
			.append("line")
			.attr("x1", function(d){return d[0]})
			.attr("x2", function(d){return d[0]})
			.attr("y1", function(d){return d[1]})
			.attr("y2", function(d){return d[2]})
			.style("stroke", "black");
		g.append("text")
			.attr("transform", function(d){ return "translate(" + arcLabel.centroid(d) + ")"})
			.text(function(d){ return d.data.count; })
			.style("font-size", "10")
			.attr("text-anchor", "middle")
			.attr("dy", ".25em");
		// center label
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", -10)
			.text(total);
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 5)
			.text("unique")
			.style('font-size', 10);
		svg.append("text").attr("text-anchor", "middle")
			.attr("x", 0).attr("y", 15)
			.text("study-subchapter pairs")
			.style('font-size', 10);
	});
}

function PieCorrdinate(data, label, arc){
	var label_pos = [];
	var links = [];
	data.forEach(function(d){
		label_pos.push(arc.centroid(d));
	});

	for(var i=0; i<label.length; i++){
		label_pos[i].push(label[i])
	}

	// Split into blocks
	var rt_idx = [], rb_idx = [], lt_idx = [], lb_idx = [];

	for(var i=0; i<label_pos.length; i++){
		if(label_pos[i][0]>=0 && label_pos[i][1]<0){rt_idx.push(i)}
		else if(label_pos[i][0]>=0 && label_pos[i][1]>=0){rb_idx.push(i)}
		else if(label_pos[i][0]<0 && label_pos[i][1]<0){lt_idx.push(i)}
		else if(label_pos[i][0]<00 && label_pos[i][1]>=0){lb_idx.push(i)}
	}

	// process each block
	if(rt_idx.length > 1){
		for(var i = rt_idx.length-2; i>=0; i--){
			if(Math.abs(label_pos[rt_idx[i]][1] - label_pos[rt_idx[i+1]][1])<10){
				links.push([label_pos[rt_idx[i]][0], label_pos[rt_idx[i]][1], label_pos[rt_idx[i+1]][1]-11])
				label_pos[rt_idx[i]][1] = label_pos[rt_idx[i+1]][1]-11;
			}else if(label_pos[rt_idx[i]][1]>label_pos[rt_idx[i+1]][1]){
				links.push([label_pos[rt_idx[i]][0], label_pos[rt_idx[i]][1], label_pos[rt_idx[i+1]][1]-11])
				label_pos[rt_idx[i]][1] = label_pos[rt_idx[i+1]][1]-11;
			}
		}
	}
	if(rb_idx.length > 1){
		for(var i = 1; i<rb_idx.length; i++){
			if(Math.abs(label_pos[rb_idx[i]][1] - label_pos[rb_idx[i-1]][1])<10){
				links.push([label_pos[rb_idx[i]][0], label_pos[rb_idx[i]][1], label_pos[rb_idx[i-1]][1]+11])
				label_pos[rb_idx[i]][1] = label_pos[rb_idx[i-1]][1]+11;
			}else if(label_pos[rb_idx[i]][1]<label_pos[rb_idx[i-1]][1]){
				links.push([label_pos[rb_idx[i]][0], label_pos[rb_idx[i]][1], label_pos[rb_idx[i-1]][1]+11])
				label_pos[rb_idx[i]][1] = label_pos[rb_idx[i-1]][1]+11;
			}
		}
	}
	if(lt_idx.length > 1){
		for(var i = 1; i<lt_idx.length; i++){
			if(Math.abs(label_pos[lt_idx[i]][1] - label_pos[lt_idx[i-1]][1])<10){
				links.push([label_pos[lt_idx[i]][0], label_pos[lt_idx[i]][1], label_pos[lt_idx[i-1]][1]-11])
				label_pos[lt_idx[i]][1] = label_pos[lt_idx[i-1]][1]-11;
			}else if(label_pos[lt_idx[i]][1]>label_pos[lt_idx[i-1]][1]){
				links.push([label_pos[lt_idx[i]][0], label_pos[lt_idx[i]][1], label_pos[lt_idx[i-1]][1]-11])
				label_pos[lt_idx[i]][1] = label_pos[lt_idx[i-1]][1]-11;
			}
		}
	}
	if(lb_idx.length > 1){
		for(var i = lb_idx.length-2; i>=0; i--){
			if(Math.abs(label_pos[lb_idx[i]][1] - label_pos[lb_idx[i+1]][1])<10){
				links.push([label_pos[lb_idx[i]][0], label_pos[lb_idx[i]][1], label_pos[lb_idx[i+1]][1]+11])
				label_pos[lb_idx[i]][1] = label_pos[lb_idx[i+1]][1]+11;
			}else if(label_pos[lb_idx[i]][1]<label_pos[lb_idx[i+1]][1]){
				links.push([label_pos[lb_idx[i]][0], label_pos[lb_idx[i]][1], label_pos[lb_idx[i+1]][1]+11])
				label_pos[lb_idx[i]][1] = label_pos[lb_idx[i+1]][1]-11;
			}
		}
	}

	var max_x = []
	var top = 0;
	var bottom = 0;
	label_pos.forEach(function(d){
			if(d[0]>0){
				max_x.push(d[0]+d[2].length*5)
			}else{
				max_x.push(d[0]-d[2].length*5)
			}
			if(d[1]<top){top = d[1]}
			if(d[1]>bottom){bottom = d[1]}
	});

	return [label_pos, links, Math.max(...max_x), Math.min(...max_x), top, bottom]
}
