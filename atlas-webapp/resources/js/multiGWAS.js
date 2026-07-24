var selectTable;
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
var domains;
$(document).ready(function(){
	$('.ImgDownSubmit').hide();
	$('#locusPlotImgDown').hide();
	$('#genePlotOpt').hide();
	$('#yearFrom').val("");
	$('#yearTo').val("");
	$('#nMin').val("");
	$('#nMax').val("");
	$('#Domain').val("null");
	Selection("Domain");
	$('#processGWAS').on('click', function(){
		var ids = [];
		var tmp = selectTable.columns(0).nodes()[0];
		tmp.forEach(function(d,i){
			if($(d).children('.manual_select_check').is(':checked')){
				ids.push(selectTable.row($(d).parents('tr')).data()["ID"]);
			}
		});
		if(ids.length>1000){
			$('#msg').html('<span style="font-size:14px; color:red;"><i class="fa fa-ban"></i> Maximum 1000 GWAS can be processed at once.</span>');
		}else if(ids.length<2){
			$('#msg').html('<span style="font-size:14px; color:red;"><i class="fa fa-ban"></i> Minimum 2 GWAS need to be selected to compare.</span>');
		}else{
			$('#msg').html('');
			displayData(ids.join(":"));
		}
	});

	$('#manual_select_all').on('click', function(){
		var row_idx = selectTable.rows({filter:"applied"})[0];
		var tmp = selectTable.rows({filter:"applied"}).columns(0).nodes()[0];
		tmp.forEach(function(d,i){
			if(row_idx.indexOf(i)>=0){
				$(d).children('.manual_select_check').prop('checked', true);
			}
		});
		manual_select_check();
	});

	$('#manual_select_all_displayed').on('click', function(){
		$('.manual_select_check').each(function(){
			$(this).prop('checked', true);
		});
		manual_select_check();
	});

	$('#manual_clear_all').on('click', function(){
		var tmp = selectTable.columns(0).nodes()[0];
		tmp.forEach(function(d,i){
			$(d).children('.manual_select_check').prop('checked', false);
		});
		manual_select_check();
	});

	$('#clearLabel').on('click', function(){
		$('#genePlot .inLabel').remove();
		$('#genePlot .active').each(function(){
			$(this).removeClass("active")
		})
	});
});

function Selection(type){
	var domain = $('#Domain').val();
	var chapter = $('#Chapter').val();
	var subchapter = $('#Subchapter').val();
	var trait = $('#Trait').val();
	var yearFrom = $('#yearFrom').val();
	var yearTo = $('#yearTo').val();
	var nMin = $('#nMin').val();
	var nMax = $('#nMax').val();
	if(yearFrom==""){yearFrom="null"}
	if(yearTo==""){yearTo="null"}
	if(nMin==""){nMin="null"}
	if(nMax==""){nMax="null"}

	if(type=="Domain"){
		chapter="null";
		subchapter="null";
		trait="null";
		$('#Chapter').val("null");
		$('#Subchapter').val("null");
		$('#Trait').val("null");
	}else if(type=="Chapter"){
		subchapter="null";
		trait="null";
		$('#Subchapter').val("null");
		$('#Trait').val("null");
	}else if(type=="Subchapter"){
		trait="null";
		$('#Trait').val("null");
	}
	if(type!="Trait"){
		SelectOptions(type, domain, chapter, subchapter, trait);
	}

	if(selectTable!=null){selectTable.draw();}
	else{TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);}
}

function SelectOptions(type, domain, chapter, subchapter, trait){
	$.ajax({
		url: subdir+"/traitDB/SelectOption",
		type: "POST",
		data: {
			type: type,
			domain: domain,
			chapter: chapter,
			subchapter: subchapter
		},
		processing: true,
		success: function(data){
			if(type=="Domain"){
				data = JSON.parse(data);
				$.each(data, function(key, val){
					var out = '<option value=null>-- Please select '+key+' of interest --</option>';
					$.each(val, function(k, v){
						out += '<option value="'+k+'">'+k+' ('+v+')</option>';
					});
					$('#'+key).html(out).selectpicker('refresh');
				});
			}else if(type=="Chapter"){
				data = JSON.parse(data);
				$.each(data, function(key, val){
					var out = '<option value=null>-- Please select '+key+' of interest --</option>';
					$.each(val, function(k, v){
						out += '<option value="'+k+'">'+k+' ('+v+')</option>';
					});
					$('#'+key).html(out).selectpicker('refresh');
				});
			}else if(type=="Subchapter"){
			data = JSON.parse(data);
				$.each(data, function(key, val){
					var out = '<option value=null>-- Please select '+key+' of interest --</option>';
					$.each(val, function(k, v){
						out += '<option value="'+k+'">'+k+' ('+v+')</option>';
					});
					$('#'+key).html(out).selectpicker('refresh');
				});
			}
		}
	});
}

function SelectEnter(e){
	var code = e.keyCode ? e.keyCode : e.which;
	if(code==13){
		selectTable.draw();
	}
}

function manual_select_check(){
	var n = 0;
	var tmp = selectTable.columns(0).nodes()[0];
	tmp.forEach(function(d,i){
		if($(d).children('.manual_select_check').is(':checked')){
			n++;
		}
	})
	$('#manual_select_n').html(n);
}

function TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax){
	$('#selectTable').DataTable().destroy();
	selectTable = $('#selectTable').DataTable({
		processing: false,
		serverSide: false,
		select: false,
		"ajax" : {
			url: subdir+"/traitDB/dbTable",
			type: "POST",
			data: {
				domain: domain,
				chapter: chapter,
				subchapter: subchapter,
				trait: trait,
				yearFrom: yearFrom,
				yearTo: yearTo,
				nMin: nMin,
				nMax: nMax
			},
			complete: function(){
				// getIDs(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);
				// loadPanel(panel);
			},
		},
		error: function(){

		},
		"columns":[
			{"data": null, defaultContent:'<input type="checkbox" class="manual_select_check" onchange="manual_select_check();">'},
			{"data": "ID", name: "ID"},
			{"data": "PMID", name:"PMID"},
			{"data": "Year", name: "Year"},
			{"data": "Domain", name: "Domain"},
			{"data": "ChapterLevel", name: "Chapter level"},
			{"data": "SubchapterLevel", name: "Subchapter level"},
			{"data": "Trait", name: "Trait"},
			{"data": "uniqTrait", name: "uniqTrait"},
			{"data": "Population", name: "Populaion"},
			{"data": "N", name: "N"}
		],
		"order": [[1, "asc"]],
		"lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 10,
		"stripeClasses": []
	});
}

$.fn.dataTable.ext.search.push(
	function(settings, data, dataIndex){
		var domain = $('#Domain').val();
		var chapter = $('#Chapter').val();
		var subchapter = $('#Subchapter').val();
		var trait = $('#Trait').val();
		var yearFrom = $('#yearFrom').val();
		var yearTo = $('#yearTo').val();
		var nMin = $('#nMin').val();
		var nMax = $('#nMax').val();

		if(domain!="null" && data[4]!=domain){return false}
		if(chapter!="null" && data[5]!=chapter){return false}
		if(subchapter!="null" && data[6]!=subchapter){return false}
		if(trait!="null" && data[8]!=trait){return false}
		if(yearFrom!="" && data[3]<parseInt(yearFrom)){return false}
		if(yearTo!="" && data[3]>parseInt(yearTo)){return false}
		if(nMin!="" && data[10]<parseInt(nMin)){return false}
		if(nMax!="" && data[10]>parseInt(nMax)){return false}
		return true;
	}
)

function displayData(ids){
	$('.col4BoxBody').css({'height': 'auto'});
	$('.col6BoxBody').css({'height': 'auto'});
	$('#sumBody').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#yearVSnBody').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#nVSlociBody').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#nVSh2Body').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#lociVSh2Body').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#colorBody').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#gcPlot').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#magmaPlot').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#lociPlot').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#lousPlot').html("");
	$('#genesPlot').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	$('#geneTable').html("");

	$.ajax({
		url: subdir+"/multiGWAS/getSummary",
		type: "POST",
		data: {
			ids: ids
		},
		error: function(){
			alert("getData error.")
		},
		success: function(data){
			data = JSON.parse(data);

			// Domains
			domains = d3.set(data.plotData.data.map(function(d){return d[2];})).values();
			domains.sort();

			summary(data.sum);
			corPlot(data.plotData.data, data.plotData.cor);
		},
		complete: function(){
			$.ajax({
				url: subdir+"/multiGWAS/getGC",
				type: "POST",
				data: {
					ids: ids
				},
				error: function(){
					alert("getGC error.")
				},
				success: function(gc){
					gc = JSON.parse(gc);
					$.ajax({
						url: subdir+"/multiGWAS/getGenes",
						type: "POST",
						data: {
							ids: ids
						},
						error: function(){
							alert("getGenes error.")
						},
						success: function(magma){
							magma = JSON.parse(magma);
							// GC and MAGMA row size
							if(gc.data.id.length>20 || magma.data.id.length>20){
								$('#gc_magma_row').removeClass();
								$('#gcCol').removeClass();
								$('#magmaCol').removeClass();
							}else{
								$('#gc_magma_row').addClass('row');
								$('#gcCol').addClass("col-md-6 col-sm-6 col-xs-6");
								$('#magmaCol').addClass("col-md-6 col-sm-6 col-xs-6");
								// GC and MAGMA max height
								var maxTrait = 0;
								gc.data.id.forEach(function(d){
									if(gc.data.Trait[d].length > maxTrait){maxTrait = gc.data.Trait[d].length}
								});
								magma.data.id.forEach(function(d){
									if(magma.data.Trait[d].length > maxTrait){maxTrait = magma.data.Trait[d].length}
								});
								var maxIDs = Math.max(gc.data.id.length, magma.data.id.length);
								var height = 20 * maxIDs + maxTrait * 5 + 180;
								$('.col6BoxBody').css({'height': height+"px"});
							}

							// heatmatp order select reset
							$('#gcOrder option').each(function(){
								$(this).prop("selected", false);
							})
							$('#magmaOrder option').each(function(){
								$(this).prop("selected", false);
							})

							gcPlot(gc);
							magmaPlot(magma);
						}
					})
				}
			})

			$.ajax({
				url: subdir+"/multiGWAS/getLociOverlap",
				type: "POST",
				data: {
					ids: ids
				},
				error: function(){
					alert("getLociOverlap error.")
				},
				success: function(data){
					data = JSON.parse(data);
					LociOverPlot(data);
				}
			})

			$.ajax({
				url: subdir+"/multiGWAS/getGenesPleiotropy",
				type: "POST",
				data: {
					ids: ids
				},
				error: function(){
					alert("getGenesPleiotropy error.")
				},
				success: function(data){
					data = JSON.parse(data);
					GenesPleiotropyPlot(data);
				}
			})
		}
	})
}

function summary(data){
	var table = '<table class="table table-bordered"><tbody>'
		+ '<tr><td>Selected GWAS</td><td>'+data.GWAS+'</td></tr>'
		+ '<tr><td>Unique Traits</td><td>'+data.Trait+'</td></tr>'
		+ '<tr><td>Unique Domain</td><td>'+data.Domain+'</td></tr>'
		+ '<tr><td>Unique Studies</td><td>'+data.Study+'</td></tr>'
		+ '<tr><td>Maximum sample size</td><td>'+data.maxN+'</td></tr>'
		+ '<tr><td>Minimum sample size</td><td>'+data.minN+'</td></tr>'
		+ '<tr><td>Average sample size</td><td>'+data.avgN+'</td></tr>'
		+ '</tbody></table>';
	$('#sumBody').html(table);
}

function corPlot(data, cor){
	$('.col4BoxBody').css({'height': '360'});

	//Domain color legend
	$('#colorBody').html('<div id="domainColor"></div>');
	var svg = d3.select("#domainColor").append("svg")
		.attr("width", 350)
		.attr("height", 300)
		.append("g")
		.attr("transform", "translate(40,10)");
	var cur_height = 20;
	domains.forEach(function(d){
		svg.append('circle')
			.attr('cx', 30)
			.attr('cy', cur_height)
			.attr('r', 4)
			// .style("fill", domain_col(domains.indexOf(d)));
			.style("fill", domain_col[d]);
		svg.append('text')
			.attr('x', 40)
			.attr('y', cur_height+4)
			.text(d)
			.attr('text-anchor', 'start');
		cur_height += 20;
	});
	// plot data
	data.forEach(function(d){
		d[0] = +d[0]; // id
		d[1] = +d[1]; // year
		d[4] = +d[4]; // N
		d[5] = +d[5]; // Nhits
		if(d[6]==null){d[6] = -9;}
		else{d[6] = +d[6];} // h2
		d[7] = +d[7]; // h2_z
	});

	// tip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-5,0])
		.html(function(d){return d[0]+': '+d[3]+' ('+d[1]+')'});

	// year vs sample size
	$('#yearVSnBody').html('<div id="yearVSnPlot"></div>');
	var margin = {top:20, right: 60, bottom:40, left:50},
		width = 250,
		height = 250;
	var svg = d3.select("#yearVSnPlot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");
	svg.call(tip)

	var xMin = d3.min(data, function(d){return d[1]}),
		xMax = d3.max(data, function(d){return d[1]}),
		yMin = d3.min(data, function(d){return d[4]}),
		yMax = d3.max(data, function(d){return d[4]});
	var x = d3.scale.linear().range([0, width]);
	x.domain([xMin-1, xMax+1]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d"));
	var y = d3.scale.linear().range([height, 0]);
	y.domain([yMin-(yMax-yMin+1)*0.1, yMax+(yMax-yMin+1)*0.1]);
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
	if(cor!=null && cor.yearVSn.x1!=undefined && cor.yearVSn.x1!=null){
		svg.append('line')
			.attr('x1', x(cor.yearVSn.x1))
			.attr('x2', x(cor.yearVSn.x2))
			.attr('y1', y(cor.yearVSn.y1))
			.attr('y2', y(cor.yearVSn.y2))
			.style('stroke', 'red')
			.style("stroke-dasharray", ("3,3"));
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',0)')
			.text("r = "+Math.round(cor.yearVSn.r*1000)/1000)
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',15)')
			.text("p = "+cor.yearVSn.p.toExponential(2))
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'middle')
			.attr('transform', 'translate('+(width/2)+',-5)')
			.text(function(){
				var f = "y = ";
				if(Math.abs(cor.yearVSn.slope)<0.01){f += cor.yearVSn.slope.toExponential(2)}
				else{f += Math.round(cor.yearVSn.slope*100)/100}
				if(cor.yearVSn.intercept<0){f += "x-"+Math.round(Math.abs(cor.yearVSn.intercept)*100)/100}
				else{f+="x+"+Math.round(cor.yearVSn.intercept*100)/100}
				return f;
			})
			.style('font-size', '10px');
	}

	svg.selectAll('.dot').data(data).enter()
		.append('circle')
		.attr("r", 3)
		.attr("cx", function(d){return x(d[1])})
		.attr("cy", function(d){return y(d[4])})
		.style("fill", function(d){return domain_col[d[2]]})
		.style("opacity", "0.6")
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);
	svg.append("g").attr("class", "x axis").call(xAxis)
		.attr("transform", "translate(0,"+height+")")
		.selectAll('text')
		.style('text-anchor', 'end')
		.attr("transform", "rotate(-60)")
		.attr("dy", "-.25em")
		.attr("dx", "-.65em");
	svg.append("g").attr("class", "y axis").call(yAxis);
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate(-35,"+(height/2)+")rotate(-90)")
		.text("Number of samples / 10e3")
		.attr("font-size", "10px");
	svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll("text").style("font-family", "sans-serif");

	// sample size vs #risk loci
	$('#nVSlociBody').html('<div id="nVSlociPlot"></div>');
	var margin = {top:20, right: 60, bottom:40, left:50},
		width = 250,
		height = 250;
	var svg = d3.select("#nVSlociPlot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");
	svg.call(tip);

	var xMin = d3.min(data, function(d){return d[4]}),
		xMax = d3.max(data, function(d){return d[4]}),
		yMin = d3.min(data, function(d){return d[5]}),
		yMax = d3.max(data, function(d){return d[5]});
	var x = d3.scale.linear().range([0, width]);
	x.domain([xMin-(xMax-xMin+1)*0.1, xMax+(xMax-xMin+1)*0.1]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
	var y = d3.scale.linear().range([height, 0]);
	y.domain([yMin-(yMax-yMin+1)*0.1, yMax+(yMax-yMin+1)*0.1]);
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

	if(cor!=null && cor.nVSloci.x1!=undefined && cor.nVSloci.x1!=null){
		svg.append('line')
			.attr('x1', x(cor.nVSloci.x1))
			.attr('x2', x(cor.nVSloci.x2))
			.attr('y1', y(cor.nVSloci.y1))
			.attr('y2', y(cor.nVSloci.y2))
			.style('stroke', 'red')
			.style("stroke-dasharray", ("3,3"));
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',0)')
			.text("r = "+Math.round(cor.nVSloci.r*1000)/1000)
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',15)')
			.text("p = "+cor.nVSloci.p.toExponential(2))
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'middle')
			.attr('transform', 'translate('+(width/2)+',-5)')
			.text(function(){
				var f = "y = ";
				if(Math.abs(cor.nVSloci.slope)<0.01){f += cor.nVSloci.slope.toExponential(2)}
				else{f += Math.round(cor.nVSloci.slope*100)/100}
				if(cor.nVSloci.intercept<0){f += "x-"+Math.round(Math.abs(cor.nVSloci.intercept)*100)/100}
				else{f+="x+"+Math.round(cor.nVSloci.intercept*100)/100}
				return f;
			})
			.style('font-size', '10px');
	}

	svg.selectAll('.dot').data(data).enter()
		.append('circle')
		.attr("r", 3)
		.attr("cx", function(d){return x(d[4])})
		.attr("cy", function(d){return y(d[5])})
		.style("fill", function(d){return domain_col[d[2]]})
		.style("opacity", "0.6")
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);
	svg.append("g").attr("class", "x axis").call(xAxis)
		.attr("transform", "translate(0,"+height+")");
	svg.append("g").attr("class", "y axis").call(yAxis);
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate("+width/2+","+(height+30)+")")
		.text("Number of samples / 10e3")
		.attr("font-size", "10px");
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate(-38,"+(height/2)+")rotate(-90)")
		.text("Number of risk loci")
		.attr("font-size", "10px");
	svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll("text").style("font-family", "sans-serif");

	// sample size vs h2
	$('#nVSh2Body').html('<div id="nVSh2Plot"></div>');
	var margin = {top:20, right: 60, bottom:40, left:50},
		width = 250,
		height = 250;
	var svg = d3.select("#nVSh2Plot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");
	svg.call(tip);

	var yMin = d3.min(data, function(d){if(d[6] > -9){return d[6]}}),
		yMax = d3.max(data, function(d){return d[6]}),
		xMin = d3.min(data, function(d){return d[4]}),
		xMax = d3.max(data, function(d){return d[4]});
	var x = d3.scale.linear().range([0, width]);
	x.domain([xMin-(xMax-xMin+1)*0.1, xMax+(xMax-xMin+1)*0.1]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
	var y = d3.scale.linear().range([height, 0]);
	y.domain([yMin-(yMax-yMin+0.01)*0.1, yMax+(yMax-yMin+0.01)*0.1]);
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

	if(cor!=null && cor.nVSh2.x1!=undefined && cor.nVSh2.x1!=null){
		svg.append('line')
			.attr('x1', x(cor.nVSh2.x1))
			.attr('x2', x(cor.nVSh2.x2))
			.attr('y1', y(cor.nVSh2.y1))
			.attr('y2', y(cor.nVSh2.y2))
			.style('stroke', 'red')
			.style("stroke-dasharray", ("3,3"));
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',0)')
			.text("r = "+Math.round(cor.nVSh2.r*1000)/1000)
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',15)')
			.text("p = "+cor.nVSh2.p.toExponential(2))
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'middle')
			.attr('transform', 'translate('+(width/2)+',-5)')
			.text(function(){
				var f = "y = ";
				if(Math.abs(cor.nVSh2.slope)<0.01){f += cor.nVSh2.slope.toExponential(2)}
				else{f += Math.round(cor.nVSh2.slope*100)/100}
				if(cor.nVSh2.intercept<0){f += "x-"+Math.round(Math.abs(cor.nVSh2.intercept)*100)/100}
				else{f+="x+"+Math.round(cor.nVSh2.intercept*100)/100}
				return f;
			})
			.style('font-size', '10px');
	}

	svg.selectAll('.dot').data(data.filter(function(d){if(d[6] > -9){return d}})).enter()
		.append('circle')
		.attr("r", 3)
		.attr("cx", function(d){return x(d[4])})
		.attr("cy", function(d){return y(d[6])})
		.style("fill", function(d){return domain_col[d[2]]})
		.style("opacity", "0.6")
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);
	svg.append("g").attr("class", "x axis").call(xAxis)
		.attr("transform", "translate(0,"+height+")");
	svg.append("g").attr("class", "y axis").call(yAxis);
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate("+width/2+","+(height+30)+")")
		.text("Number of samples / 10e3")
		.attr("font-size", "10px");
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate(-35,"+(height/2)+")rotate(-90)")
		.text("SNP h2")
		.attr("font-size", "10px");
	svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll("text").style("font-family", "sans-serif");

	// #risk loci vs h2
	$('#lociVSh2Body').html('<div id="lociVSh2Plot"></div>');
	var margin = {top:20, right: 60, bottom:40, left:50},
		width = 250,
		height = 250;
	var svg = d3.select("#lociVSh2Plot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");
	svg.call(tip);

	var yMin = d3.min(data, function(d){if(d[6] > -9){return d[6]}}),
		yMax = d3.max(data, function(d){return d[6]}),
		xMin = d3.min(data, function(d){return d[5]}),
		xMax = d3.max(data, function(d){return d[5]});
	var x = d3.scale.linear().range([0, width]);
	x.domain([xMin-(xMax-xMin+1)*0.1, xMax+(xMax-xMin+1)*0.1]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
	var y = d3.scale.linear().range([height, 0]);
	y.domain([yMin-(yMax-yMin+0.01)*0.1, yMax+(yMax-yMin+0.01)*0.1]);
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

	if(cor!=null && cor.lociVSh2.x1!=undefined && cor.lociVSh2.x1!=null){
		svg.append('line')
			.attr('x1', x(cor.lociVSh2.x1))
			.attr('x2', x(cor.lociVSh2.x2))
			.attr('y1', y(cor.lociVSh2.y1))
			.attr('y2', y(cor.lociVSh2.y2))
			.style('stroke', 'red')
			.style("stroke-dasharray", ("3,3"));
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',0)')
			.text("r = "+Math.round(cor.lociVSh2.r*1000)/1000)
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'start')
			.attr('transform', 'translate('+width+',15)')
			.text("p = "+cor.lociVSh2.p.toExponential(2))
			.style('font-size', '10px');
		svg.append('text').attr('text-anchor', 'middle')
			.attr('transform', 'translate('+(width/2)+',-5)')
			.text(function(){
				var f = "y = ";
				if(Math.abs(cor.lociVSh2.slope)<0.01){f += cor.lociVSh2.slope.toExponential(2)}
				else{f += Math.round(cor.lociVSh2.slope*100)/100}
				if(cor.lociVSh2.intercept<0){f += "x-"+Math.round(Math.abs(cor.lociVSh2.intercept)*100)/100}
				else{f+="x+"+Math.round(cor.lociVSh2.intercept*100)/100}
				return f;
			})
			.style('font-size', '10px');
	}

	svg.selectAll('.dot').data(data.filter(function(d){if(d[6] > -9){return d}})).enter()
		.append('circle')
		.attr("r", 3)
		.attr("cx", function(d){return x(d[5])})
		.attr("cy", function(d){return y(d[6])})
		.style("fill", function(d){return domain_col[d[2]]})
		.style("opacity", "0.6")
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);
	svg.append("g").attr("class", "x axis").call(xAxis)
		.attr("transform", "translate(0,"+height+")");
	svg.append("g").attr("class", "y axis").call(yAxis);
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate("+width/2+","+(height+30)+")")
		.text("Number of risk loci")
		.attr("font-size", "11px");
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate(-35,"+(height/2)+")rotate(-90)")
		.text("SNP h2")
		.attr("font-size", "11px");
	svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll("text").style("font-family", "sans-serif");
}

function gcPlot(data){
	$('#gcPlot').html("");
	if(data.data.id == undefined || data.data.id == null || data.data.id.length==0){
		$('#gcPlot').html('<span style="color:red;padding-top:20px;">No genetic correlatioin is available for selected GWAS.<span>');
		$('.GCimg').each(function(){$(this).prop('disabled', true)})
	}else if(data.data.id.length > 100){
		$('#gcPlot').html('<span style="color:red;padding-top:20px;">The heatmap is too large to display. Please download data in json format and create the plot on your local server.<span>');
		$('.GCimg').each(function(){$(this).prop('disabled', true)})
	}else{
		$('.GCimg').each(function(){$(this).prop('disabled', false)})
		var ids = data.data["id"];
		var n = ids.length;
		var cellsize = 12;
		if(n < 20){cellsize = 20;}
		else if(n < 50){cellsize = 15;}
		data.data.rg.forEach(function(d){
			d[0] = +d[0]; //id1
			d[1] = +d[1]; //id2
			d[2] = +d[2]; //rg
			d[3] = +d[3]; //p
			d[4] = +d[4]; //pbon
		});

		var maxTrait = 0;
		ids.forEach(function(d){
			if(data.data.Trait[d].length > maxTrait){
				maxTrait = data.data.Trait[d].length;
			}
		});

		var margin = {bottom: maxTrait*5.5+5, right: 100, top: 20, left: maxTrait*5.5+5},
			width = cellsize*n,
			height = cellsize*n;
		var svg = d3.select('#gcPlot').append('svg')
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g").attr("transform", "translate("+margin.left+","+margin.top+")");
		var colorScale = d3.scale.linear().domain([-1.25, 0, 1.25]).range(["#000099", "#fff", "#b30000"]);
		var sizeScale = d3.scale.linear().domain([0.05, 1]).range([1, 0]);

		// legened
		var t = [];
		for(var i =0; i<26; i++){t.push(i);}
		var legendRect = svg.selectAll(".legend").data(t).enter().append("g")
			.append("rect")
			.attr("class", 'legendRect')
			.attr("x", width+15)
			.attr("y", function(d){return (25-d)*3})
			.attr("width", 15)
			.attr("height", 3)
			.attr("fill", function(d){return colorScale(d*0.1-1.25)});
		var legendText = svg.selectAll("text.legend").data([0,12.5,25]).enter().append("g")
			.append("text")
			.attr("text-anchor", "start")
			.attr("class", "legenedText")
			.attr("x", width+32)
			.attr("y", function(d){return (25-d)*3+5})
			.text(function(d){return d*0.1-1.25})
			.style("font-size", "12px");

		// y axis label
		var rowLabels = svg.append("g").selectAll(".rowLabel")
			.data(ids).enter().append("text")
			.text(function(d){return data.data.Trait[d];})
			.attr("x", -7)
			.attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;})
			.style("font-size", "10px")
			.style("text-anchor", "end")
			.attr('dy', function(){if(cellsize==20){return ".1em"}else{return ".2em"}});
		// x axis label
		var colLabels = svg.append("g").selectAll(".colLabel")
			.data(ids).enter().append("text")
			.text(function(d){return data.data.Trait[d];})
			.style("text-anchor", "start")
			.style("font-size", "10px")
			.attr("transform", function(d){
				return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
			})
			.attr('dy', function(){if(cellsize==20){return ".4em"}else{return ".35em"}});

		// heatmap for significant rg
		var heatMapSig = svg.append("g").attr("class", "cell heatmapcell")
			.selectAll("rect.cell").data(data.data.rg.filter(function(d){if(d[3]<0.05){return d}})).enter()
			.append("rect")
			.attr("width", cellsize-1).attr("height", cellsize-1)
			.attr('x', function(d){return data.data.order.alph[d[0]]*cellsize})
			.attr('y', function(d){return data.data.order.alph[d[1]]*cellsize})
			.attr('fill', function(d){
				if(d[2]>1.25){return colorScale(1.25)}
				else if(d[2] < -1.25){return colorScale(-1.25)}
				else{return colorScale(d[2])}
			});
		// stars for significant rg after bon correction
		var stars = svg.append("g").attr("class", "cell star")
			.selectAll("star").data(data.data.rg.filter(function(d){if(d[4]<0.05 && d[0] != d[1]){return d}})).enter()
			.append("text")
			.attr('x', function(d){return data.data.order.alph[d[0]]*cellsize+(cellsize-1)/2})
			.attr('y', function(d){return data.data.order.alph[d[1]]*cellsize+cellsize*0.75})
			.text("*")
			.style("text-anchor", "middle")
			.attr('dy', function(){if(cellsize==20){return ".1em"}else{return ".2em"}});
		// heatmap for non-significant rg
		var heatMapNonsig = svg.append("g").attr("class", "cell heatmapcell")
			.selectAll("rect.cell.nonsig").data(data.data.rg.filter(function(d){if(d[3]>=0.05){return d}})).enter()
			.append("rect")
			.attr("width", function(d){return (cellsize-1)*sizeScale(d[3])})
			.attr("height", function(d){return (cellsize-1)*sizeScale(d[3])})
			.attr("x", function(d){return data.data.order.alph[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
			.attr("y", function(d){return data.data.order.alph[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
			.attr('fill', function(d){return colorScale(d[2])});
		// Domain labels col
		var colDomain = svg.append("g").attr("class", "colDomain")
			.selectAll("rect.colDomain").data(data.data.id).enter()
			.append("rect")
			.attr('x', function(d){return data.data.order.alph[d]*cellsize})
			.attr('y', height+1)
			.attr("width", cellsize-1)
			.attr("height", 3)
			// .attr("fill", function(d){return domain_col(domains.indexOf(data.data.Domain[d]))});
			.attr("fill", function(d){return domain_col[data.data.Domain[d]]});
		// Domain labels row
		var rowDomain = svg.append("g").attr("class", "rowDomain")
			.selectAll("rect.rowDomain").data(data.data.id).enter()
			.append("rect")
			.attr('x', -4)
			.attr('y', function(d){return data.data.order.alph[d]*cellsize})
			.attr("width", 3)
			.attr("height", cellsize-1)
			// .attr("fill", function(d){return domain_col(domains.indexOf(data.data.Domain[d]))});
			.attr("fill", function(d){return domain_col[data.data.Domain[d]]});
		svg.selectAll("text").style("font-family", "sans-serif");

		// reordering labels
		function sortOptions(type){
			if(type == "alph"){
				heatMapSig.transition().duration(1000)
					.attr("x", function(d){return data.data.order.alph[d[0]]*cellsize})
					.attr("y", function(d){return data.data.order.alph[d[1]]*cellsize});
				stars.transition().duration(1000)
					.attr("x", function(d){return data.data.order.alph[d[0]]*cellsize+(cellsize-1)/2})
					.attr("y", function(d){return data.data.order.alph[d[1]]*cellsize+cellsize*0.75});
				heatMapNonsig.transition().duration(1000)
					.attr("x", function(d){return data.data.order.alph[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
					.attr("y", function(d){return data.data.order.alph[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)});
				rowLabels.transition().duration(1000)
					.attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;});
				colLabels.transition().duration(1000)
					.attr("transform", function(d){
						return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
					});
				colDomain.transition().duration(1000)
					.attr("x", function(d){return data.data.order.alph[d]*cellsize});
				rowDomain.transition().duration(1000)
					.attr("y", function(d){return data.data.order.alph[d]*cellsize});
			}else if(type == "domain"){
				heatMapSig.transition().duration(1000)
					.attr("x", function(d){return data.data.order.domain[d[0]]*cellsize})
					.attr("y", function(d){return data.data.order.domain[d[1]]*cellsize});
				stars.transition().duration(1000)
					.attr("x", function(d){return data.data.order.domain[d[0]]*cellsize+(cellsize-1)/2})
					.attr("y", function(d){return data.data.order.domain[d[1]]*cellsize+cellsize*0.75});
				heatMapNonsig.transition().duration(1000)
					.attr("x", function(d){return data.data.order.domain[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
					.attr("y", function(d){return data.data.order.domain[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)});
				rowLabels.transition().duration(1000)
					.attr("y", function(d){return data.data.order.domain[d]*cellsize+(cellsize-1)/2;});
				colLabels.transition().duration(1000)
					.attr("transform", function(d){
						return "translate("+(data.data.order.domain[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
					});
				colDomain.transition().duration(1000)
					.attr("x", function(d){return data.data.order.domain[d]*cellsize});
				rowDomain.transition().duration(1000)
					.attr("y", function(d){return data.data.order.domain[d]*cellsize});
			}else if(type == "clst"){
				heatMapSig.transition().duration(1000)
					.attr("x", function(d){return data.data.order.clst[d[0]]*cellsize})
					.attr("y", function(d){return data.data.order.clst[d[1]]*cellsize});
				stars.transition().duration(1000)
					.attr("x", function(d){return data.data.order.clst[d[0]]*cellsize+(cellsize-1)/2})
					.attr("y", function(d){return data.data.order.clst[d[1]]*cellsize+cellsize*0.75});
				heatMapNonsig.transition().duration(1000)
					.attr("x", function(d){return data.data.order.clst[d[0]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)})
					.attr("y", function(d){return data.data.order.clst[d[1]]*cellsize+((1-sizeScale(d[3]))/2)*(cellsize-1)});
				rowLabels.transition().duration(1000)
					.attr("y", function(d){return data.data.order.clst[d]*cellsize+(cellsize-1)/2;});
				colLabels.transition().duration(1000)
					.attr("transform", function(d){
						return "translate("+(data.data.order.clst[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
					});
				colDomain.transition().duration(1000)
					.attr("x", function(d){return data.data.order.clst[d]*cellsize});
				rowDomain.transition().duration(1000)
					.attr("y", function(d){return data.data.order.clst[d]*cellsize});
			}
		}

		$('#gcOrder').on("change", function(){
			var type = $('#gcOrder').val();
			sortOptions(type);
		});
	}

	$('#downGCjson').on('click', function(){
		$("<a />", {
			"download": "GC.json",
			"href": "data:text/json, "+encodeURIComponent(JSON.stringify(data)),
		}).appendTo("body")
		.click(function(){
			$(this).remove()
		})[0].click()
	})
}

function magmaPlot(data){
	$('#magmaPlot').html("");

	if(data.data.id == undefined || data.data.id == null || data.data.id.length==0){
		$('#magmaPlot').html('<span style="color:red;padding-top:20px;">No significant genes are overlapped between selected GWAS.<span>');
		$('.Mimg').each(function(){$(this).prop('disabled', true)})
	}else if(data.data.id.length > 100){
		$('#magmaPlot').html('<span style="color:red;padding-top:20px;">The heatmap is too large to display. Please download data in json format and create the plot on your local server.<span>');
		$('.Mimg').each(function(){$(this).prop('disabled', true)})
	}else{
		$('.Mimg').each(function(){$(this).prop('disabled', false)})
		var ids = data.data["id"];
		var n = ids.length;
		var cellsize = 12;
		if(n < 20){cellsize = 20;}
		else if(n < 50){cellsize = 15;}

		data.data.go.forEach(function(d){
			d[0] = +d[0]; //id1
			d[1] = +d[1]; //id2
			d[2] = +d[2]; //overlap
		});

		data.data.ng.forEach(function(d){
			d[0] = +d[0] //id
			d[1] = +d[1] //n genes
		});

		var maxTrait = 0;
		ids.forEach(function(d){
			if(data.data.Trait[d].length > maxTrait){
				maxTrait = data.data.Trait[d].length;
			}
		});

		var barWidth = 50;
		var space = 5;
		var margin = {bottom: maxTrait*5.5+5, right: 100, top: 20, left: maxTrait*5.5+5},
			width = cellsize*n+space+barWidth,
			height = cellsize*n;
		var svg = d3.select('#magmaPlot').append('svg')
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g").attr("transform", "translate("+margin.left+","+margin.top+")");
		var colorScale = d3.scale.linear().domain([0, 0.5, 1]).range(["#fff", "#ffba70", "#b30000"]);
		// var sizeScale = d3.scale.linear().domain([0.05, 1]).range([1, 0]);

		// legened
		var t = [];
		for(var i =0; i<11; i++){t.push(i);}
		var legendRect = svg.selectAll(".legend").data(t).enter().append("g")
			.append("rect")
			.attr("class", 'legendRect')
			.attr("x", width+20)
			.attr("y", function(d){return (d)*8})
			.attr("width", 15)
			.attr("height", 8)
			.attr("fill", function(d){return colorScale(1-d*0.1)});
		var legendText = svg.selectAll("text.legend").data([0,5,10]).enter().append("g")
			.append("text")
			.attr("text-anchor", "start")
			.attr("class", "legenedText")
			.attr("x", width+38)
			.attr("y", function(d){return (d)*8+10})
			.text(function(d){return 1-d*0.1})
			.style("font-size", "12px");

		// y axis label
		var rowLabels = svg.append("g").selectAll(".rowLabel")
			.data(ids).enter().append("text")
			.text(function(d){return data.data.Trait[d];})
			.attr("x", -7)
			.attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;})
			.style("font-size", "10px")
			.style("text-anchor", "end")
			.attr('dy', function(){if(cellsize==20){return ".1em"}else{return ".2em"}});
		// x axis label
		var colLabels = svg.append("g").selectAll(".colLabel")
			.data(ids).enter().append("text")
			.text(function(d){return data.data.Trait[d];})
			.style("text-anchor", "start")
			.style("font-size", "10px")
			.attr("transform", function(d){
				return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
			})
			.attr('dy', function(){if(cellsize==20){return ".4em"}else{return ".35em"}});

		// heatmap for non zero overlap
		var heatMap = svg.append("g").attr("class", "cell heatmapcell")
			.selectAll("rect.cell").data(data.data.go).enter()
			.append("rect")
			.attr("width", cellsize-1).attr("height", cellsize-1)
			.attr('x', function(d){return data.data.order.alph[d[0]]*cellsize})
			.attr('y', function(d){return data.data.order.alph[d[1]]*cellsize})
			.attr('fill', function(d){if(d[2]==-1){return "grey";}else{return colorScale(d[2])}});

		// Domain labels col
		var colDomain = svg.append("g").attr("class", "colDomain")
			.selectAll("rect.colDomain").data(data.data.id).enter()
			.append("rect")
			.attr('x', function(d){return data.data.order.alph[d]*cellsize})
			.attr('y', height+1)
			.attr("width", cellsize-1)
			.attr("height", 3)
			// .attr("fill", function(d){return domain_col(domains.indexOf(data.data.Domain[d]))});
			.attr("fill", function(d){return domain_col[data.data.Domain[d]]});
		// Domain labels row
		var rowDomain = svg.append("g").attr("class", "rowDomain")
			.selectAll("rect.rowDomain").data(data.data.id).enter()
			.append("rect")
			.attr('x', -4)
			.attr('y', function(d){return data.data.order.alph[d]*cellsize})
			.attr("width", 3)
			.attr("height", cellsize-1)
			// .attr("fill", function(d){return domain_col(domains.indexOf(data.data.Domain[d]))});
			.attr("fill", function(d){return domain_col[data.data.Domain[d]]});

		// n genes bar plot
		var x = d3.scale.linear().range([cellsize*n+space, width]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(3);
		x.domain([0, d3.max(data.data.ng, function(d){return d[1]})]);

		var barPlot = svg.append("g").attr("class", "bar")
			.selectAll("bar").data(data.data.ng).enter()
			.append("rect")
			.attr("width", function(d){return x(d[1])-x(0)})
			.attr("height", cellsize-1)
			.attr("x", cellsize*n+space)
			.attr("y", function(d){return data.data.order.alph[d[0]]*cellsize})
			.attr("fill", "skyblue");
		var barText = svg.append("g")
			.selectAll("bar.text").data(data.data.ng).enter()
			.append("text")
			.attr("x", function(d){return x(d[1])})
			.attr("y", function(d){return data.data.order.alph[d[0]]*cellsize+cellsize/2})
			.text(function(d){return d[1];})
			.style("text-anchor", "start")
			.style("font-size", "9px")
			.attr('dy', function(){if(cellsize==20){return ".1em"}else{return ".2em"}});

		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")")
			.call(xAxis).selectAll("text")
			.attr("transform", "translate(-12, 3)rotate(-60)")
			.style("text-anchor", "end")
			.style("font-size", "10px");
		svg.selectAll("text").style("font-family", "sans-serif");


		// reordering labels
		function sortOptions(type){
			if(type == "alph"){
				heatMap.transition().duration(1000)
					.attr("x", function(d){return data.data.order.alph[d[0]]*cellsize})
					.attr("y", function(d){return data.data.order.alph[d[1]]*cellsize});
				barPlot.transition().duration(1000)
					.attr("y", function(d){return data.data.order.alph[d[0]]*cellsize});
				barText.transition().duration(1000)
					.attr("y", function(d){return data.data.order.alph[d[0]]*cellsize+cellsize/2});
				rowLabels.transition().duration(1000)
					.attr("y", function(d){return data.data.order.alph[d]*cellsize+(cellsize-1)/2;});
				colLabels.transition().duration(1000)
					.attr("transform", function(d){
						return "translate("+(data.data.order.alph[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
					});
				colDomain.transition().duration(1000)
					.attr("x", function(d){return data.data.order.alph[d]*cellsize});
				rowDomain.transition().duration(1000)
					.attr("y", function(d){return data.data.order.alph[d]*cellsize});
			}else if(type == "domain"){
				heatMap.transition().duration(1000)
					.attr("x", function(d){return data.data.order.domain[d[0]]*cellsize})
					.attr("y", function(d){return data.data.order.domain[d[1]]*cellsize});
				barPlot.transition().duration(1000)
					.attr("y", function(d){return data.data.order.domain[d[0]]*cellsize});
				barText.transition().duration(1000)
					.attr("y", function(d){return data.data.order.domain[d[0]]*cellsize+cellsize/2});
				rowLabels.transition().duration(1000)
					.attr("y", function(d){return data.data.order.domain[d]*cellsize+(cellsize-1)/2;});
				colLabels.transition().duration(1000)
					.attr("transform", function(d){
						return "translate("+(data.data.order.domain[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
					});
				colDomain.transition().duration(1000)
					.attr("x", function(d){return data.data.order.domain[d]*cellsize});
				rowDomain.transition().duration(1000)
					.attr("y", function(d){return data.data.order.domain[d]*cellsize});
			}else if(type == "clst"){
				heatMap.transition().duration(1000)
					.attr("x", function(d){return data.data.order.clst[d[0]]*cellsize})
					.attr("y", function(d){return data.data.order.clst[d[1]]*cellsize});
				barPlot.transition().duration(1000)
					.attr("y", function(d){return data.data.order.clst[d[0]]*cellsize});
				barText.transition().duration(1000)
					.attr("y", function(d){return data.data.order.clst[d[0]]*cellsize+cellsize/2});
				rowLabels.transition().duration(1000)
					.attr("y", function(d){return data.data.order.clst[d]*cellsize+(cellsize-1)/2;});
				colLabels.transition().duration(1000)
					.attr("transform", function(d){
						return "translate("+(data.data.order.clst[d]*cellsize+(cellsize-1)/2)+","+(height+7)+")rotate(90)";
					});
				colDomain.transition().duration(1000)
					.attr("x", function(d){return data.data.order.clst[d]*cellsize});
				rowDomain.transition().duration(1000)
					.attr("y", function(d){return data.data.order.clst[d]*cellsize});
			}
		}

		$('#magmaOrder').on("change", function(){
			var type = $('#magmaOrder').val();
			sortOptions(type);
		})
	}

	$('#downMAGMAjson').on('click', function(){
		$("<a />", {
			"download": "MAGMA_genes.json",
			"href": "data:text/json, "+encodeURIComponent(JSON.stringify(data)),
		}).appendTo("body")
		.click(function(){
			$(this).remove()
		})[0].click()
	})
}

function LociOverPlot(data){
	$('#lociPlot').html("");
	$('#locusPlot').html("");
	$('#locusPlotImgDown').hide();
	$('#lociYaxis').val("domain");
	var chromSize = [249250621, 243199373, 198022430, 191154276, 180915260, 171115067,
		159138663, 146364022, 141213431, 135534747, 135006516, 133851895, 115169878, 107349540,
		102531392, 90354753, 81195210, 78077248, 63025520, 59128983, 48129895, 51304566, 155270560];
	var chromStart = [];
	chromStart.push(0);
	for(var i=1; i<chromSize.length; i++){
		chromStart.push(chromStart[i-1]+chromSize[i-1]);
	}

	data.loci_group.forEach(function(d){
		d[0] = +d[0] // id
		d[1] = +d[1] // chr
		d[2] = +d[2] // start
		d[3] = +d[3] // end
		d[4] = +d[4] // nTrait
		d[5] = +d[5] // nDomain
	});
	data.loci.forEach(function(d){
		// d[0] = +d[0] // id
		d[3] = +d[3] // chr
		d[4] = +d[4] // pos
		if(d[5]<1e-300){d[5] += 1e-300}
		else{d[5] = +d[5]} // p
		d[6] = +d[6] // start
		d[7] = +d[7] // end
		d[8] = +d[8] // lociid
	});

	var margin = {top:30, right: 30, bottom:50, left:50},
		width = 800,
		height = 250;
	var svg = d3.select("#lociPlot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

	var chr = [];
	var max_chr = d3.max(data.loci_group, function(d){return d[1]});
	for(var i=1; i<=22; i++){
		chr.push(i);
	}
	if(max_chr==23){chr.push(23)}
	max_chr = Math.max(...chr);

	var max_nTrait = d3.max(data.loci_group, function(d){return d[4]});
	var nTrait_size = d3.scale.linear().range([1.5,5]).domain([0,max_nTrait*1.01])
	var max_nDomain = d3.max(data.loci_group, function(d){return d[5]});
	var nDomain_size = d3.scale.linear().range([1.5,5]).domain([0,max_nDomain*1.01])
	var x = d3.scale.linear().range([0, width]);
	x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(0);
	var y = d3.scale.linear().range([height, 0]);
	y.domain([1, max_nDomain+1]);
	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format("d"));

	// tip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-5,0])
		.html(function(d){return 'Chr: '+d[1]+'</br>Start: '+d[2]+'</br>End: '+d[3]+'</br>#GWAS: '+d[4]});
	svg.call(tip);

	// zoom
	var zoom = d3.behavior.zoom().x(x).scaleExtent([1,10]).on("zoom", zoomed);
	svg.call(zoom);
	// add rect
	svg.append("rect").attr("width", width).attr("height", height)
		.style("fill", "transparent")
		.style("shape-rendering", "crispEdges");

	svg.selectAll(".dot").data(data.loci_group).enter()
		.append("circle")
		.attr('class', 'locidot')
		.attr("r", function(d){return nTrait_size(d[4]);})
		.attr("cx", function(d){return x((d[2]+d[3])/2+chromStart[d[1]-1])})
		.attr("cy", function(d){return y(d[5])})
		.attr("fill", function(d){
			if(d[1]%2==0){return "steelblue"}
			else{return "blue"}
		})
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.on("click", function(d){
			if(d[4]>1){
				locusPlot(d[0]);
			}
		})
		.style("opacity", 0.6);

	svg.append("g").attr("class", "x axis")
		.attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
	svg.append("g").attr("class", "y axis").call(yAxis)
		.selectAll('text').style('font-size', '11px');

	//Chr label
	svg.selectAll('.chr').data(chr).enter()
		.append('text')
		.attr('class', 'chrtext')
		.attr('x', function(d){return x((chromStart[d-1]*2+chromSize[d-1])/2)})
		.attr('y', height+20)
		.text(function(d){return d})
		.style("font-size", "10px");
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate("+width/2+","+(height+35)+")")
		.text("Chromosome");
	svg.append("text").attr("text-anchor", "middle")
		.attr("class", "ytitle")
		.attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
		.text("Number of Domains");
	svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll("text").style("font-family", "sans-serif");

	function zoomed(){
		svg.selectAll(".chrtext")
			.attr('x', function(d){return x((chromStart[d-1]*2+chromSize[d-1])/2)})
			.style('fill', function(d){
					var x_tmp = x((chromStart[d-1]*2+chromSize[d-1])/2);
					if(x_tmp<0 || x_tmp>width){return "none"}
					else{return "black"}
			});
		svg.selectAll(".locidot")
			.attr("cx", function(d){return x((d[2]+d[3])/2+chromStart[d[1]-1]);})
			.style("fill", function(d){
				var x_tmp = x((d[2]+d[3])/2+chromStart[d[1]-1]);
				if(x_tmp<0 || x_tmp>width){return "transparent";}
				else if(d[1]%2==0){return "steelblue"}
				else{return "blue"}
			});
	}

	function Yaxis(type){
		if(type=="GWAS"){
			y.domain([1, max_nTrait+1]);
			svg.selectAll(".y.axis").call(yAxis);
			svg.selectAll(".locidot").transition().duration(1000)
				.attr("r", function(d){return nDomain_size(d[5])})
				.attr("cy", function(d){return y(d[4])});
			svg.selectAll(".ytitle").text("Number of GWAS");
		}else{
			y.domain([1, max_nDomain+1]);
			svg.selectAll(".y.axis").call(yAxis);
			svg.selectAll(".locidot").transition().duration(1000)
				.attr("r", function(d){return nTrait_size(d[4]);})
				.attr("cy", function(d){return y(d[5])});
			svg.selectAll(".ytitle").text("Number of Domains");
		}
	}

	$('#lociYaxis').on("change", function(){
		var type = $('#lociYaxis').val();
		Yaxis(type);
	})

	function locusPlot(lociid){
		$('#locusPlotImgDown').show();
		$('#locusPlot').html("");
		var tmpdata = data.loci.filter(function(d){if(d[8]==lociid){return d}});
		var ids = d3.set(tmpdata.map(function(d){return d[0];})).values();

		var traits = [];
		var maxTrait = 0;
		ids.forEach(function(d){
			if(traits.indexOf(data.Trait[d])<0){
				if(data.Trait[d].length > maxTrait){maxTrait = data.Trait[d].length}
				traits.push(data.Trait[d]);
			}
		})

		var cellheight = 20;
		if(ids.length>15){
			cellheight = 15;
		}

		var margin = {top:30, right: 50, bottom:50, left:maxTrait*6},
			width = 500,
			height = (cellheight)*ids.length;
		if(height < 100){height = 100}

		var maxP = d3.max(tmpdata, function(d){return -Math.log10(d[5])});
		var minP = 8;
		var maxX = d3.max(tmpdata, function(d){return d[7]});
		var minX = d3.min(tmpdata, function(d){return d[6]});
		var side = (maxX-minX)*0.1;

		var x = d3.scale.linear().range([0, width]);
		x.domain([minX-side, maxX+side]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(4);
		var y = d3.scale.ordinal().domain(traits).rangeBands([height, 0], 0.1);
		var yAxis = d3.svg.axis().scale(y).orient("left");

		var svg = d3.select("#locusPlot").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+","+margin.top+")");

		// legend
		var midP = (maxP+minP)/2;
		svg.append("text")
			.attr("x", width+18)
			.attr("y", 0)
			.text("-log10 P")
			.attr("text-anchor", "middle")
			.style("font-size", "10px");
		svg.append("circle")
			.attr("cx", width+13)
			.attr("cy", 15)
			.attr("r", Math.round(maxP)/maxP*(cellheight*0.85/2-3)+3)
			.attr("fill", "grey")
			.attr("oppacity", "0.8");
		svg.append("text")
			.attr("x", width+23)
			.attr("y", 18)
			.text(Math.round(maxP))
			.style("font-size", "10px");
		svg.append("circle")
			.attr("cx", width+13)
			.attr("cy", 32)
			.attr("r", Math.round(midP)/maxP*(cellheight*0.85/2-3)+3)
			.attr("fill", "grey")
			.attr("oppacity", "0.8");
		svg.append("text")
			.attr("x", width+23)
			.attr("y", 35)
			.text(Math.round(midP))
			.style("font-size", "10px");
		svg.append("circle")
			.attr("cx", width+13)
			.attr("cy", 48)
			.attr("r", Math.round(minP)/maxP*(cellheight*0.85/2-3)+3)
			.attr("fill", "grey")
			.attr("oppacity", "0.8");
		svg.append("text")
			.attr("x", width+23)
			.attr("y", 51)
			.text(Math.round(minP))
			.style("font-size", "10px");

		// line
		svg.selectAll('.line').data(tmpdata).enter()
			.append("line")
			.attr("x1", function(d){return x(d[6])})
			.attr("x2", function(d){return x(d[7])})
			.attr("y1", function(d){return y(data.Trait[d[0]])+y.rangeBand()*0.5})
			.attr("y2", function(d){return y(data.Trait[d[0]])+y.rangeBand()*0.5})
			// .style("stroke", function(d){return domain_col(domains.indexOf(data.Domain[d[0]]))});
			.style("stroke", function(d){return domain_col[data.Domain[d[0]]]});

		// top SNP
		svg.selectAll(".dot").data(tmpdata).enter()
			.append("circle")
			.attr("cx", function(d){return x(d[4])})
			.attr("cy", function(d){return y(data.Trait[d[0]])+y.rangeBand()*0.5})
			.attr("r", function(d){return -Math.log10(d[5])/maxP*(cellheight*0.85/2-3)+3;})
			// .style("fill", function(d){return domain_col(domains.indexOf(data.Domain[d[0]]))});
			.style("fill", function(d){return domain_col[data.Domain[d[0]]]});
		svg.selectAll(".rsID").data(tmpdata).enter()
			.append("text")
			.attr("x", function(d){return x(d[4])})
			.attr("y", function(d){return y(data.Trait[d[0]])+3})
			.text(function(d){return d[2]})
			.attr("text-anchor", "start")
			.attr("font-size", "9.5px");

		svg.append("g").attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")").call(xAxis);
		svg.append("g").attr("class", "y axis").call(yAxis)
			.selectAll('text').style('font-size', '11px');
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+width/2+","+(height+35)+")")
			.text("Chromosome "+tmpdata[0][3]);
		svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll("text").style("font-family", "sans-serif");
	}
}

function GenesPleiotropyPlot(data){
	$('#genesPlot').html("");
	$('#genePlot').html("");
	$('#genePlotOpt').hide();
	$('#genePlotTitle').html("");
	$('#geneYaxis').val("domain");
	var chromSize = [249250621, 243199373, 198022430, 191154276, 180915260, 171115067,
		159138663, 146364022, 141213431, 135534747, 135006516, 133851895, 115169878, 107349540,
		102531392, 90354753, 81195210, 78077248, 63025520, 59128983, 48129895, 51304566, 155270560];
	var chromStart = [];
	chromStart.push(0);
	for(var i=1; i<chromSize.length; i++){
		chromStart.push(chromStart[i-1]+chromSize[i-1]);
	}

	data.genes.forEach(function(d){
		d[2] = +d[2] // chr
		d[3] = +d[3] // start
		d[4] = +d[4] // end
		d[5] = +d[5] // nTrait
		d[6] = +d[6] // nDomain
	});

	var margin = {top:30, right: 30, bottom:50, left:50},
		width = 800,
		height = 250;
	var svg = d3.select("#genesPlot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

	var chr = [];
	var max_chr = d3.max(data.genes, function(d){return d[2]});
	for(var i=1; i<=22; i++){
		chr.push(i);
	}
	if(max_chr==23){chr.push(23)}
	max_chr = Math.max(...chr);

	var max_nTrait = d3.max(data.genes, function(d){return d[5]});
	var nTrait_size = d3.scale.linear().range([1.5,8]).domain([0,max_nTrait*1.001])
	var max_nDomain = d3.max(data.genes, function(d){return d[6]});
	var nDomain_size = d3.scale.linear().range([1.5,8]).domain([0,max_nDomain*1.001])
	var x = d3.scale.linear().range([0, width]);
	x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(0);
	var y = d3.scale.linear().range([height, 0]);
	y.domain([1, max_nDomain+1]);
	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format("d"));

	// tip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-5,0])
		.html(function(d){return 'ENSG ID: '+d[0]+'<br/>Symbol: '+d[1]+'<br/>Chr: '+d[2]+'</br>Start: '+d[3]+'</br>End: '+d[4]+'</br>#Traits: '+d[5]+'<br/>#Domains: '+d[6]});
	svg.call(tip);

	// zoom
	var zoom = d3.behavior.zoom().x(x).scaleExtent([1,10]).on("zoom", zoomed);
	svg.call(zoom);
	// add rect
	svg.append("rect").attr("width", width).attr("height", height)
		.style("fill", "transparent")
		.style("shape-rendering", "crispEdges");

	svg.selectAll(".dot").data(data.genes).enter()
		.append("circle")
		.attr('class', 'genedot')
		.attr("r", function(d){return nTrait_size(d[5]);})
		.attr("cx", function(d){return x((d[3]+d[4])/2+chromStart[d[2]-1])})
		.attr("cy", function(d){return y(d[6])})
		.attr("fill", function(d){
			if(d[2]%2==0){return "steelblue"}
			else{return "blue"}
		})
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.on("click", function(d){
			genePlot(d[0], d[1], data.id.join(":"));
		})
		.style("opacity", 0.6);

	svg.append("g").attr("class", "x axis")
		.attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
	svg.append("g").attr("class", "y axis").call(yAxis)
		.selectAll('text').style('font-size', '11px');

	//Chr label
	svg.selectAll('.chr').data(chr).enter()
		.append('text')
		.attr('class', 'chrtext')
		.attr('x', function(d){return x((chromStart[d-1]*2+chromSize[d-1])/2)})
		.attr('y', height+20)
		.text(function(d){return d})
		.style("font-size", "10px");
	svg.append("text").attr("text-anchor", "middle")
		.attr("transform", "translate("+width/2+","+(height+35)+")")
		.text("Chromosome");
	svg.append("text").attr("text-anchor", "middle")
		.attr("class", "ytitle")
		.attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
		.text("Number of Domains");
	svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
	svg.selectAll("text").style("font-family", "sans-serif");

	function zoomed(){
		svg.selectAll(".chrtext")
			.attr('x', function(d){return x((chromStart[d-1]*2+chromSize[d-1])/2)})
			.style('fill', function(d){
					var x_tmp = x((chromStart[d-1]*2+chromSize[d-1])/2);
					if(x_tmp<0 || x_tmp>width){return "none"}
					else{return "black"}
			});
		svg.selectAll(".genedot")
			.attr("cx", function(d){return x((d[3]+d[4])/2+chromStart[d[2]-1])})
			.style("fill", function(d){
				var x_tmp = x((d[3]+d[4])/2+chromStart[d[2]-1]);
				if(x_tmp<0 || x_tmp>width){return "transparent";}
				else if(d[2]%2==0){return "steelblue"}
				else{return "blue"}
			});
	}

	function Yaxis(type){
		if(type=="GWAS"){
			y.domain([1, max_nTrait+1]);
			svg.selectAll(".y.axis").call(yAxis);
			svg.selectAll(".genedot").transition().duration(1000)
				.attr("r", function(d){return nDomain_size(d[6])})
				.attr("cy", function(d){return y(d[5])});
			svg.selectAll(".ytitle").text("Number of GWAS");
		}else{
			y.domain([1, max_nDomain+1]);
			svg.selectAll(".y.axis").call(yAxis);
			svg.selectAll(".genedot").transition().duration(1000)
				.attr("r", function(d){return nTrait_size(d[5]);})
				.attr("cy", function(d){return y(d[6])});
			svg.selectAll(".ytitle").text("Number of Domains");
		}
	}

	$('#geneYaxis').on("change", function(){
		var type = $('#geneYaxis').val();
		Yaxis(type);
	})

	function genePlot(ensg, symbol, ids){
		$('#genePlotTitle').html('<h4>PheWAS plot of '+ensg+' ('+symbol+')</h4>')
		$('#genePlot').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
		$.ajax({
			url: subdir+"/multiGWAS/getPheData",
			type: "POST",
			data:{
				text: ensg,
				ids: ids,
				maxP: 1
			},
			error: function(){
				alert("getData error");
			},
			success: function(data){
				if(data.length>0){
					data = JSON.parse(data);
					genePheWAS(data);
					// tablePheWAS(data.data);
				}
			}
		})
	}
}

function genePheWAS(data){
	$('#genePlot').html("");
	$('#genePlotOpt').show();
	if(data.error.length>0){
		$('#PheWASplot').append('<div id="errorms" style="height:200px;color:red;font-size:24px;text-align:center;padding-top:50px;"></div>')
		if(data.error=="Gene_not_found"){
			$('#errorms').append("Searched gene was not found in the selected GWAS.")
		}else if(data.error=="Gene_id_not_match"){
			$('#errorms').append("Searched gene did not match with existing ID.")
		}else{
			$('#errorms').append("Input value is not valid.")
		}
	}else{
		// var maxTrait = 0;
		data.data.forEach(function(d){
			d[0] = +d[0] //id
			if(d[1]<1e-300){d[1] = 1e-300}
			else{d[1] = +d[1]} //P-value
		})

		var nData = data.data.length;
		var minP = d3.min(data.data, function(d){return d[1]});
		var margin = {top:30, right:150, bottom:20, left:80},
			width = nData*3,
			height = 300;
		if(width<150){width=150}
		if(width>1000){width=1000}
		var cellsize = width/(nData+1);
		var labelFont = 10;

		if(nData>100){labelFont=5;}
		else if(nData>50){labelFont=6;}
		else if(nData>10){labelFont=8;}

		var order={"alph":0, "p":1, "n":2, "domain_alph":3, "domain_p":4};
		var order_idx = order[$('#genePlotOrder').val()];

		var svg = d3.select("#genePlot").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+","+margin.top+")");

		// tip
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-5,0])
			.html(function(d){return 'P-value: '+d[1]+'<br/>PMID: '+d[2]+'</br>Year: '+d[3]+'</br>Domain: '+d[4]+'</br>Trait: '+d[5]+'</br>Total N: '+d[6]});
		svg.call(tip);

		var x = d3.scale.linear().range([0,width])
		x.domain([0,nData+1]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(0);
		var y = d3.scale.linear().range([height, 0]);
		y.domain([0, -Math.log10(minP)*1.05]);
		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

		// legend
		var domains = d3.set(data.data.map(function(d){return d[4];})).values().sort();
		var cur_height = 20;
		domains.forEach(function(d){
			svg.append('circle')
				.attr('cx', width+20)
				.attr('cy', cur_height)
				.attr('r', 3)
				.style("fill", domain_col[d])
				.style("opacity", "0.8");
			svg.append('text')
				.attr('x', width+28)
				.attr('y', cur_height+4)
				.text(d)
				.attr('text-anchor', 'start')
				.style("font-size", "11px");
			cur_height += 12;
		});

		// plot
		var dot = svg.selectAll('.dot').data(data.data).enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('r', 3)
			.attr('cx', function(d){return x(data.order[order_idx].indexOf(d[0])+1)})
			.attr('cy', function(d){return y(-Math.log10(d[1]))})
			.style("fill", function(d){return domain_col[d[4]]})
			.style("opacity", "0.8")
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
			.on("click", function(d){
				if(!d3.select(this).classed("active")){
					d3.select(this).attr("class", "active");
					svg.append("text")
						.attr("class", "inLabel")
						.text(d[5])
						.attr('x', x(data.order[order_idx].indexOf(d[0])+1))
						.attr('y', y(-Math.log10(d[1])))
						.style('font-size', '10px')
						.style('text-anchor', function(){
							if((data.order[order_idx].indexOf(d[0])+1)/nData>0.8){return "end";}
							else{return "start";}
						});
				}
			});

		svg.append("g").attr("class", "x axis").call(xAxis)
			.attr("transform", "translate(0,"+height+")")
			.selectAll('text').remove();
		svg.append("g").attr("class", "y axis").call(yAxis);
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
			.text("-log10 P-value");
		svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll("text").style("font-family", "sans-serif");

		function sortOptions(type){
			order_idx = order[type];
			dot.transition().duration(1000)
				.attr('cx', function(d){return x(data.order[order_idx].indexOf(d[0])+1)});
			svg.selectAll(".inLabel").remove();
			$('#PheWASplot .active').each(function(){
				$(this).removeClass("active")
			})

		}
		$('#genePlotOrder').on("change", function(){
			var type = $('#genePlotOrder').val();
			sortOptions(type);
		});
	}
}

function ImgDown(name, type){
	$('#traitData').val($('#'+name).html());
	$('#traitType').val(type);
	$('#traitFileName').val(name);
	$('#imgdownSubmit').trigger('click');
}
