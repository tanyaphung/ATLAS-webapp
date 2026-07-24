var table_desriptions = {
	"File": "Link to the original soruce of summary statistics file.",
	"Population": "Population assigned to one of the 5 populations from 1000 genomes, i.e. AFR, AMR, EAS, EUR and SAS. For multi-ethnic GWAS, all populations included in the GWAS are listed here. For UK Biobank chohort, UKB1 or UKB2 for each release.",
	"Nsnps": "The number of SNPs in the original summary statistics file.",
	"Nhits": "The number of independent genomic risk loci. See documentation for details of definitioin of risk loci.",
	"SNPh2": "SNPs based heritability in observed scale computed by LD score regression. This value is only available for GWAS which meet certain criteria. See documentaion for details.",
	"SNPh2_l2": "SNPs based heritability in liability scale computed by LD score regression. This value is only available for GWAS which meet certain criteria. See documentaion for details.",
}

$(document).ready(function(){
	$('.ImgDownSubmit').hide();
	$.ajax({
		url: subdir+"/traitDB/getData",
		type: "POST",
		data: {
			id: id
		},
		error: function(){
			alert("error for getData");
		},
		success: function(data){
			var temp = JSON.parse(data);
			$('#title').html("<h3>atlas ID: "+id+" <strong>"+temp[0]["Trait"]+"</strong></h3>");
			var header = ["id", "PMID", "Year", "File", "Website", "Consortium", "Domain", "ChapterLevel", "SubchapterLevel",
				"Trait", "uniqTrait", "Population", "Ncase", "Ncontrol", "N", "Genome", "Nsnps", "Nhits", "SNPh2",
				"SNPh2_se", "SNPh2_z", "SNPh2_l", "SNPh2_l_se", "LambdaGC", "Chi2", "Intercept", "Note"];
			var table = '';
			for(var i=0; i<header.length; i++){
				if(header[i]=="Genome"){continue;}
				if(header[i] in table_desriptions){
					table += '<tr><td>'+header[i]+' <a class="infoPop" data-toggle="popover" title="'
						+header[i]+'" data-content="'+table_desriptions[header[i]]+'"><i class="fa fa-question-circle-o fa-lg"></i></a>';
				}else{
					table += '<tr><td>'+header[i]+'</td>';
				}
				if(header[i]=="PMID"){
					if(temp[0][header[i]].indexOf("Not")>=0){
						table += '<td style="word-break: break-all;">'+temp[0][header[i]]+'</td></tr>';
					}else if(temp[0][header[i]].indexOf("BioRxiv")>=0){
						table += '<td style="word-break: break-all;">'+temp[0][header[i]]+'</td></tr>';
					}else{
						var pmid = temp[0][header[i]].split(":");
						var out = [];
						pmid.forEach(function(d){
							out.push('<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/'+d+'">PMID: '+d+'</a>');
						});
						table += '<td style="word-break: break-all;">'+out.join(", ")+'</td></tr>';
					}
				}else if(header[i]=="File" || header[i]=="Website"){
					if(temp[0][header[i]].length>0){
						table += '<td style="word-break: break-all;"><a target="_blank" href="'+temp[0][header[i]]+'">'+temp[0][header[i]]+"</a>";
					}
				}else{
					table += '<td style="word-break: break-all;">'+temp[0][header[i]]+'</td></tr>';
				}
			}
			$('#infoTable').html(table);
		},
		complete: function(){
			var cnt = 10;
			$('.infoPop').each(function(){
				$(this)
					.attr('data-trigger', 'focus')
					.attr('role', 'button')
					.attr('tabindex', cnt)
					.popover();
				cnt = cnt + 1;
			});
		}
	});

	var file = "GenomicRiskLoci.txt";
	$('#topSNPtable').DataTable({
		processing: true,
		serverSide: false,
		select: false,
		ajax : {
			url: subdir+"/traitDB/DTfile",
			type: "POST",
			data: {
				id: id,
				infile: file,
				header: "chr:pos:rsID:p"
			}
		},
		error: function(){
			alert("top SNP table error");
		},
		"order": [[0, 'asc']],
		"lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 10,
		"stripeClasses": []
	});

	file = "magma.sets.top";
	$('#MAGMAtable').DataTable({
		processing: true,
		serverSide: false,
		select: false,
		ajax : {
			url: subdir+"/traitDB/DTfile",
			type: "POST",
			data: {
				id: id,
				infile: file,
				header: "FULL_NAME:NGENES:BETA:BETA_STD:SE:P:Pbon"
			}
		},
		error: function(){
			alert("MAGMA gene set table error");
		},
		"order": [[6, 'asc']],
		"lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 10,
		"stripeClasses": []
	});

	GWplot(id);
	QQplot(id);

	$.ajax({
		url: subdir+"/traitDB/getGClist",
		type: "POST",
		success: function(data){
			data = JSON.parse(data);
			var multi_select = "";
			data.forEach(function(d){
				// multi_select += '<option value="'+d.id+'">'+d.id+': '+d.Trait+' (published: '+d.Year+', sample size: '+d.N+')</option>';
				multi_select += '<span class="GC_manual_trait"><input class="GC_manual_check" type="checkbox" value="'+d.id+'" onchange="GC_manual_count();">'+d.id+': '+d.Trait+' (published: '+d.Year+', sample size: '+d.N+')</br></span>';
			});
			$('#GC_manual_select').append(multi_select);
			$('#GC_manual_select').children('span').each(function(){
				$(this).children('input').prop('disabled', true);
			});
		}
	});

	$('#GC_manual_search').on('change keyup', function(){
		var target = $(this).val().toLowerCase();
		$('.GC_manual_trait').each(function(){
			var text = $(this).text().toLowerCase();
			if(text.indexOf(target)>-1){
				$(this).show()
			}else{
				$(this).hide()
			}
		})
	});

	$('#GC_manual_clear').on('click', function(){
		$('#GC_manual_select').children('span').each(function(){
			$(this).children('input').prop('checked', false);
			GC_manual_count();
		});
	});

	$('#GC_update').on('click', function(){
		d3.select("#GCplot").selectAll("svg").remove();
		$('#GCtableBody').html("");
		var topN = $('#GC_topN').val();
		var excSamePhe = $('#GC_excSamePhe').is(":checked");
		var maxNPhe = $('#GC_maxNPhe').is(":checked");
		var maxP = $('#GC_p').val();
		var maxPbon = $('#GC_pbon').val();
		var manual = $('#GC_manual').is(":checked");
		var manualids = [];
		$('.GC_manual_check').each(function(){
			if($(this).is(':checked')){manualids.push($(this).val());}
		})
		if(manualids.length>0){manualids = manualids.join(":");}
		else{manualids=null;}
		getGCdata(id, topN, excSamePhe, maxNPhe, maxP, maxPbon, manual, manualids);
	});

	$('#GC_update').trigger('click');
});

function GC_manual_count(){
	var nTrait = 0;
	$('.GC_manual_check').each(function(){
		if($(this).is(':checked')){nTrait++;}
	})
	$('#GC_manual_n').html(nTrait);
}

function GWplot(id){
	var chromSize = [249250621, 243199373, 198022430, 191154276, 180915260, 171115067,
		159138663, 146364022, 141213431, 135534747, 135006516, 133851895, 115169878, 107349540,
		102531392, 90354753, 81195210, 78077248, 63025520, 59128983, 48129895, 51304566, 155270560];
	var chromStart = [];
	chromStart.push(0);
	for(var i=1; i<chromSize.length; i++){
		chromStart.push(chromStart[i-1]+chromSize[i-1]);
	}

	var margin = {top:30, right: 30, bottom:50, left:50},
		width = 800,
		height = 300;
	var svg = d3.select("#manhattan").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");
	var svg2 = d3.select("#geneManhattan").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
	    .attr("transform", "translate("+margin.left+","+margin.top+")");
	d3.json(subdir+"/traitDB/manhattan/"+id+"/manhattan.txt", function(data){
		data.forEach(function(d){
			d[0] = +d[0]; //chr
			d[1] = +d[1]; // bp
			d[2] = +d[2]; // p
		});
		var chr = d3.set(data.map(function(d){return d[0];})).values();

		var max_chr = chr.length;
		var x = d3.scale.linear().range([0, width]);
		x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		var y = d3.scale.linear().range([height, 0]);
		var minP = d3.min(data, function(d){if(d[2]>1e-300){return d[2]}})
		var lowP = d3.min(data, function(d){return d[2]});
		var yMax = -Math.log10(minP);
		if(lowP < 1e-300){
			if(yMax>=300){yMax = 360;}
			else{yMax += yMax*0.2;}
			yMax += 10;
		}
		y.domain([0, yMax]);
		var yAxis = d3.svg.axis().scale(y).orient("left");

		svg.selectAll("dot.manhattan").data(data).enter()
			.append("circle")
			.attr("r", 2)
			.attr("cx", function(d){return x(d[1]+chromStart[d[0]-1])})
			.attr("cy", function(d){if(d[2]<1e-300){return y(yMax)}else{return y(-Math.log10(d[2]))}})
			.attr("fill", function(d){if(d[0]%2==0){return "steelblue"}else{return "blue"}});

		svg.append("line")
			.attr("x1", 0).attr("x2", width)
			.attr("y1", y(-Math.log10(5e-8))).attr("y2", y(-Math.log10(5e-8)))
			.style("stroke", "red")
			.style("stroke-dasharray", ("3,3"));
		svg.append("g").attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
		svg.append("g").attr("class", "y axis").call(yAxis)
			.selectAll('text')
			.each(function(d){
				if(d >= -Math.log10(minP)*1.2){this.remove()}
			})
			.style('font-size', '11px');
		if(lowP < 1e-300){
			svg.append("text")
				.attr("x", -32).attr("y", y(yMax)+2)
				.text(">300")
				.style("font-size", '11px')
				.style("font-family", "sans-serif");
			svg.append("text")
				.attr("x", 0).attr("y", y(yMax)*1.5)
				.text("\u2248")
				.attr("text-anchor", "middle")
				.style("font-size", '20px')
				.style("font-family", "sans-serif");
		}

		//Chr label
		for(var i=0; i<chr.length; i++){
			svg.append("text").attr("text-anchor", "middle")
				.attr("transform", "translate("+x((chromStart[i]*2+chromSize[i])/2)+","+(height+20)+")")
				.text(chr[i])
				.style("font-size", "10px");
		}
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+width/2+","+(height+35)+")")
			.text("Chromosome");
		svg.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
			.text("-log10 P-value");
		svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll('text').style("font-family", "sans-serif");
	});

	d3.json(subdir+"/traitDB/manhattan/"+id+"/magma.genes.out", function(data){
		data.forEach(function(d){
			d[0] = +d[0]; //chr
			d[1] = +d[1]; //start
			d[2] = +d[2]; //stop
			d[3] = +d[3]; //p
		});

		var nSigGenes=0;
		var sortedP = [];
		sortedP.push(0);
		data.forEach(function(d){
			if(d[3]<=0.05/data.length){nSigGenes++;}
			sortedP.push(d[3]);
		});
		$('#topGenes').val(nSigGenes);

		$('#geneManhattanDesc').html("Input SNPs were mapped to "+data.length+" protein coding genes (distance 0). "
			+"Genome wide significance (red dashed line in the plot) was defined at P = 0.05/"+data.length+" = "+((0.05/data.length).toExponential(3))+".");

		sortedP = sortedP.sort(function(a,b){return a-b;});
		var chr = d3.set(data.map(function(d){return d[0];})).values();
		var max_chr = chr.length;
		var x = d3.scale.linear().range([0, width]);
		x.domain([0, (chromStart[max_chr-1]+chromSize[max_chr-1])]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		var y = d3.scale.linear().range([height, 0]);
		y.domain([0, d3.max(data, function(d){return -Math.log10(d[3]);})+1]);
		var yAxis = d3.svg.axis().scale(y).orient("left");

		svg2.selectAll("dot.geneManhattan").data(data).enter()
			.append("circle")
			.attr("r", 2)
			.attr("cx", function(d){return x((d[1]+d[2])/2+chromStart[d[0]-1])})
			.attr("cy", function(d){return y(-Math.log10(d[3]))})
			.attr("fill", function(d){if(d[0]%2==0){return "steelblue"}else{return "blue"}});

		svg2.selectAll('text.gene').data(data.filter(function(d){if(d[3]<=0.05/data.length){return d;}})).enter()
			.append("text")
			.attr("class", "gene")
			.attr("x", function(d){return x((d[1]+d[2])/2+chromStart[d[0]-1])})
			.attr("y", function(d){return y(-Math.log10(d[3]))-2})
			.text(function(d){return d[4]})
			.style("font-size", "10px");

		svg2.append("line")
			.attr("x1", 0).attr("x2", width)
			.attr("y1", y(-Math.log10(0.05/data.length))).attr("y2", y(-Math.log10(0.05/data.length)))
			.style("stroke", "red")
			.style("stroke-dasharray", ("3,3"));
		svg2.append("g").attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")").call(xAxis).selectAll("text").remove();
		svg2.append("g").attr("class", "y axis").call(yAxis)
			.selectAll('text').style('font-size', '11px');

		//Chr label
		for(var i=0; i<chr.length; i++){
			svg2.append("text").attr("text-anchor", "middle")
				.attr("transform", "translate("+x((chromStart[i]*2+chromSize[i])/2)+","+(height+20)+")")
				.text(chr[i])
				.style("font-size", "10px");
		}
		svg2.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+width/2+","+(height+35)+")")
			.text("Chromosome");
		svg2.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(-35)+","+(height/2)+")rotate(-90)")
			.text("-log10 P-value");
		svg2.selectAll('path').style('fill', 'none').style('stroke', 'grey');
		svg2.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
		svg2.selectAll('text').style("font-family", "sans-serif");

		$('#topGenes').on("input", function(){
			svg2.selectAll(".gene").remove();
			var n = $('#topGenes').val();
			svg2.selectAll('text.gene').data(data.filter(function(d){if(d[3]<=sortedP[n]){return d;}})).enter()
				.append("text")
				.attr("class", "gene")
				.attr("x", function(d){return x((d[1]+d[2])/2+chromStart[d[0]-1])})
				.attr("y", function(d){return y(-Math.log10(d[3]))-2})
				.text(function(d){return d[4]})
				.style("font-size", "10px")
				.style("font-family", "sans-serif");
		})
	});
}

function QQplot(id){
	var margin = {top:30, right: 30, bottom:50, left:50},
		width = 300,
		height = 300;

	var qqSNP = d3.select("#QQplot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");
	var qqGene = d3.select("#geneQQplot").append("svg")
		.attr("width", width+margin.left+margin.right)
		.attr("height", height+margin.top+margin.bottom)
		.append("g").attr("transform", "translate("+margin.left+","+margin.top+")");

	d3.json(subdir+'/traitDB/QQplot/'+id+'/SNP', function(data){
		data.forEach(function(d){
			d.obs = +d.obs;
			d.exp = +d.exp;
		});

		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);
		var xMax = d3.max(data, function(d){return d.exp;});
		var minP = d3.max(data, function(d){if(d.obs<300){return d.obs}})
		var lowP = d3.max(data, function(d){return d.obs});
		var yMax = minP;
		if(lowP > 300){
			if(yMax>=300){yMaxp = 360;}
			else{yMax += yMax*0.2;}
		}
		x.domain([0, (xMax+xMax*0.01)]);
		y.domain([0, (yMax+yMax*0.01)]);
		var yAxis = d3.svg.axis().scale(y).orient("left");
		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var maxP = Math.min(xMax, yMax);

		qqSNP.selectAll("dot.QQ").data(data).enter()
			.append("circle")
			.attr("r", 2)
			.attr("cx", function(d){return x(d.exp)})
			.attr("cy", function(d){if(d.obs>300){y(yMax)}else{return y(d.obs)}})
			.attr("fill", "grey");
		qqSNP.append("g").attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")").call(xAxis)
			.selectAll('text').style('font-size', '11px');
		qqSNP.append("g").attr("class", "y axis").call(yAxis)
			.selectAll('text')
			.each(function(d){
				if(d >= minP*1.2){this.remove()}
			})
			.style('font-size', '11px');
		if(lowP > 300){
			qqSNP.append("text")
				.attr("x", -32).attr("y", y(yMax)+2)
				.text(">300")
				.style("font-size", '11px')
				.style("font-family", "sans-serif");
			qqSNP.append("text")
				.attr("x", 0).attr("y", y(yMax)*5)
				.text("\u2248")
				.attr("text-anchor", "middle")
				.style("font-size", '20px')
				.style("font-family", "sans-serif");
		}
		qqSNP.append("line")
			.attr("x1", 0).attr("x2", x(maxP))
			.attr("y1", y(0)).attr("y2", y(maxP))
			.style("stroke", "red")
			.style("stroke-dasharray", ("3,3"));
		qqSNP.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(-35)+","+height/2+")rotate(-90)")
			.text("Observed -log10 P-value");
		qqSNP.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width/2)+","+(height+35)+")")
			.text("Expected -log10 P-value");
		qqSNP.selectAll('path').style('fill', 'none').style('stroke', 'grey');
		qqSNP.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
		qqSNP.selectAll('text').style("font-family", "sans-serif");
	});

	d3.json(subdir+'/traitDB/QQplot/'+id+'/Gene', function(data){
		data.forEach(function(d){
			d.obs = +d.obs;
			d.exp = +d.exp;
			d.n = +d.n;
		});

		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);
		var xMax = d3.max(data, function(d){return d.exp;});
		var yMax = d3.max(data, function(d){return d.obs;});
		x.domain([0, (xMax+xMax*0.01)]);
		y.domain([0, (yMax+yMax*0.01)]);
		var yAxis = d3.svg.axis().scale(y).orient("left");
		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var maxP = Math.min(xMax, yMax);

		qqGene.selectAll("dot.geneQQ").data(data).enter()
			.append("circle")
			.attr("r", 2)
			.attr("cx", function(d){return x(d.exp)})
			.attr("cy", function(d){return y(d.obs)})
			.attr("fill", "grey");
		qqGene.append("g").attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")").call(xAxis)
			.selectAll('text').style('font-size', '11px');
		qqGene.append("g").attr("class", "y axis").call(yAxis)
			.selectAll('text').style('font-size', '11px');
		qqGene.append("line")
			.attr("x1", 0).attr("x2", x(maxP))
			.attr("y1", y(0)).attr("y2", y(maxP))
			.style("stroke", "red")
			.style("stroke-dasharray", ("3,3"));
		qqGene.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(-35)+","+height/2+")rotate(-90)")
			.text("Observed -log10 P-value");
		qqGene.append("text").attr("text-anchor", "middle")
			.attr("transform", "translate("+(width/2)+","+(height+35)+")")
			.text("Expected -log10 P-value");
		qqGene.selectAll('path').style('fill', 'none').style('stroke', 'grey');
		qqGene.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
		qqGene.selectAll("text").style("font-family", "sans-serif");
	});
}

function GCManualSelectCheck(){
	if($('#GC_manual').is(":checked")){
		$('#GC_manual_select').children('span').each(function(){
			$(this).children('input').prop('disabled', false);
		});
	}else{
		$('#GC_manual_select').children('span').each(function(){
			$(this).children('input').prop('disabled', true);
		});
	}
}

function getGCdata(id, topN, excSamePhe, maxNPhe, maxP, maxPbon, manual, manualids){
	$.ajax({
		url: subdir+"/traitDB/getGCdata",
		type: "POST",
		data: {
			id: id,
			topN: topN,
			excSamePhe: excSamePhe,
			maxNPhe: maxNPhe,
			maxP: maxP,
			maxPbon: maxPbon,
			manual: manual,
			manualids: manualids
		},
		error: function(){
			alert("error for GCdata");
		},
		success: function(data){
			data = JSON.parse(data);
			GCplot(data);
		}
	});
}

function GCplot(data){
	if(data.GC==null || data.GC==undefined || data.GC.length==0){
		table = '<tr><td colspan="7" style="text-align:center; font-size:14px;"> No data available.</td></tr>';
		$('#GCtableBody').html(table);
		$('#GCplot').html('<span style="color:red;"><i class="fa fa-ban"></i> Genetic cirrelation is not available for the specified conditions or thie GWAS does not meet the criteria.</span>');
	}else{
		$('#GCtotalN').html("The number of GWAS to be tested is "+data.totalN+" (used for Bonferroni correction).");
		var table="";
		var maxLabel = 0;
		data.GC.forEach(function(d){
			d.id = +d.id;
			d.rg = +d.rg;
			d.se = +d.se;
			d.z = +d.z;
			d.p = +d.p;
			d.pbon = +d.pbon;
			if(d.Trait.length>maxLabel){maxLabel = d.Trait.length}
			table += "<tr>";
			table += "<td>"+d.id+"</td>";
			table += "<td>"+d.Trait+"</td>";
			table += "<td>"+Math.round(d.rg*1000)/1000+"</td>";
			table += "<td>"+Math.round(d.se*1000)/1000+"</td>";
			table += "<td>"+Math.round(d.z*1000)/1000+"</td>";
			table += "<td nowrap>"+d.p.toExponential(2)+"</td>";
			table += "<td nowrap>"+d.pbon.toExponential(2)+"</td>";
			table += "</tr>";
		})
		$('#GCtableBody').html(table);
		var margin = {top:30, right: 30, bottom:50, left:6.3*maxLabel},
			width = 250,
			height = 20*data.GC.length;
		var svg = d3.select("#GCplot").append("svg")
			.attr("width", width+margin.left+margin.right)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate("+margin.left+","+margin.top+")");
		var y_element = data.GC.map(function(d){return d.id+":"+d.Trait;});
		var y = d3.scale.ordinal().domain(y_element).rangeRoundBands([0,height], 0.1);
		var x = d3.scale.linear().range([0, width]);
		x.domain([-d3.max(data.GC, function(d){return Math.abs(d.rg);})-d3.max(data.GC, function(d){return d.se;}),
		d3.max(data.GC, function(d){return Math.abs(d.rg);})+d3.max(data.GC, function(d){return d.se;})]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
		var yAxis = d3.svg.axis().scale(y).orient("left");

		svg.append("rect").attr("x", x(0)).attr("y", 0)
			.attr("width", 0.05).attr("height", height)
			.style("stroke", "grey");
		svg.selectAll("rect.bar").data(data.GC).enter()
			.append('rect')
			.attr('x', function(d){
				if(d.rg>0){return x(0)}
				else{return x(d.rg)}
			})
			.attr('y', function(d){return y(d.id+":"+d.Trait)})
			.attr('width', function(d){
				if(d.rg>0){return x(d.rg)-x(0)}
				else{return x(0)-x(d.rg)}
			})
			.attr('height', y.rangeBand())
			.attr("fill", function(d){
				if(d.p>=0.05){return "grey"}
				else if(d.rg>0){return "red"}
				else{return "blue"}
			})
			.attr("opacity", function(d){
				if(d.pbon<0.05){return 0.8}
				else{return 0.5}
			});
		svg.selectAll(".error").data(data.GC).enter()
			.append('line')
			.attr('x1', function(d){return x(d.rg-d.se)})
			.attr('x2', function(d){return x(d.rg+d.se)})
			.attr('y1', function(d){return y(d.id+":"+d.Trait)+y.rangeBand()/2})
			.attr('y2', function(d){return y(d.id+":"+d.Trait)+y.rangeBand()/2})
			.attr('stroke', 'black');
		svg.selectAll(".error").data(data.GC).enter()
			.append('line')
			.attr('x1', function(d){return x(d.rg-d.se)})
			.attr('x2', function(d){return x(d.rg-d.se)})
			.attr('y1', function(d){return y(d.id+":"+d.Trait)+y.rangeBand()*0.25})
			.attr('y2', function(d){return y(d.id+":"+d.Trait)+y.rangeBand()*0.75})
			.attr('stroke', 'black');
		svg.selectAll(".error").data(data.GC).enter()
			.append('line')
			.attr('x1', function(d){return x(d.rg+d.se)})
			.attr('x2', function(d){return x(d.rg+d.se)})
			.attr('y1', function(d){return y(d.id+":"+d.Trait)+y.rangeBand()*0.25})
			.attr('y2', function(d){return y(d.id+":"+d.Trait)+y.rangeBand()*0.75})
				.attr('stroke', 'black');
		svg.append('g').attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")")
			.call(xAxis);
		svg.append('g').attr("class", "y axis")
			.call(yAxis);
		svg.selectAll('path').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll('.axis').selectAll('line').style('fill', 'none').style('stroke', 'grey');
		svg.selectAll("text").style("font-family", "sans-serif");
	}
}

function ImgDown(name, type){
	$('#traitData').val($('#'+name).html());
	$('#traitType').val(type);
	$('#traitID').val(id);
	$('#traitFileName').val(name);
	$('#imgdownSubmit').trigger('click');
}

function ImgDown2(name, type){
	$('#traitData2').val($('#'+name).html());
	$('#traitType2').val(type);
	$('#traitID2').val(id);
	$('#traitFileName2').val(name);
	$('#imgdownSubmit2').trigger('click');
}

function CSVdown(name){
	$('#'+name).tableToCSV("atlasID_"+id);
}
