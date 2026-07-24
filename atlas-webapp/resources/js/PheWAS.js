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
	$('#yearFrom').val("");
	$('#yearTo').val("");
	$('#nMin').val("");
	$('#nMax').val("");
	$('#Domain').val("null");
	Selection("Domain");
	// updatePlot();

	$('#PheWAStable_SNP').hide();
	$('#PheWAStable_SNP_info').hide();

	$('#plotPheWAS').on('click', function(){
		updatePlot();
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
		$('#PheWASplot .inLabel').remove();
		$('#PheWASplot .active').each(function(){
			$(this).removeClass("active")
		})
	});

	$('#Pupdate').on('click', function(){
		updatePlot();
	})
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

function SearchEnter(e){
	var code = e.keyCode ? e.keyCode : e.which;
	if(code==13){
		if($('#searchText').val().length>0){updatePlot();}
	}
}

function updatePlot(){
	$('#PheWASplot').html('<span style="color:grey;"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i><br/>Processing ...</span><br/>');
	var text = $('#searchText').val();
	if(text==undefined || text.length==0){text=""}
	var ids = [];
	var tmp = selectTable.columns(0).nodes()[0];
	tmp.forEach(function(d,i){
		if($(d).children('.manual_select_check').is(':checked')){
			ids.push(selectTable.row($(d).parents('tr')).data()["ID"]);
		}
	});
	$.ajax({
		url: subdir+"/PheWAS/getData",
		type: "POST",
		data:{
			text: text,
			ids: ids.join(":"),
			maxP: $('#maxP').val()
		},
		error: function(){
			alert("getData error");
		},
		success: function(data){
			if(data.length>0){
				data = JSON.parse(data);
				plotPheWAS(data, ids.length);
				tablePheWAS(data.type, data.data);
			}else{
				$('#PheWASplot').html('<div style="height:200px;color:red;font-size:24px;text-align:center;padding-top:50px;">Sorry, we could not find any hit...<br/>'
				+'Please try with different name or ID.</div>');
			}
		}
	})
}

function plotPheWAS(data, nIDs){
	$('#PheWASplot').html("");
	if(data.error.length>0){
		$('#nDataPheWAS').html("")
		$('#PheWASplot').append('<div id="errorms" style="height:200px;color:red;font-size:24px;text-align:center;padding-top:50px;"></div>')
		if(data.error=="SNP_input_error"){
			$('#errorms').append("Input format of the SNP is not valid.")
		}else if(data.error=="SNP_not_found"){
			$('#errorms').append("Searched SNP was not found in the selected GWAS.")
		}else if(data.error=="Gene_not_found"){
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
			// if(d[5].length>maxTrait){maxTrait = d[5].length}
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

		if(nIDs==0){nIDs = selectTable.columns(0).nodes()[0].length;}
		$('#nDataPheWAS').html('Number of GWASs considered: '+nIDs+' (including GWASs in which the serached SNP or gene was not tested, Bonferroni corrected P-value: '+(0.05/nIDs).toExponential(2)+').<br/>'
			+'Number of data points in the plot: '+nData+' (Bonferroni corrected P-value: '+(0.05/nData).toExponential(2)+').<br/>')

		var order={"alph":0, "p":1, "n":2, "domain_alph":3, "domain_p":4};
		var order_idx = order[$('#traitOrder').val()];

		var svg = d3.select("#PheWASplot").append("svg")
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
		var cur_height = 5;
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
		$('#traitOrder').on("change", function(){
			var type = $('#traitOrder').val();
			sortOptions(type);
		});
	}
}

function tablePheWAS(type, data){
	$('#PheWAStable_SNP').DataTable().destroy();
	$('#PheWAStable_gene').DataTable().destroy();
	if(type=="SNP"){
		$('#PheWAStable_gene').hide();
		$('#PheWAStable_SNP').show();
		$('#PheWAStable_SNP_info').show();
		$('#PheWAStable_SNP_body').html("");
		data.forEach(function(d){
			$('#PheWAStable_SNP_body').append('<tr><td>'+d[0]+'</td><td>'+d[2]+'</td><td>'
			+d[3]+'</td><td>'+d[4]+'</td><td>'+d[5]
			+'</td><td>'+d[1]+'</td><td>'+d[6]+'</td><td>'
			+d[7]+'</td><td>'+d[8]+'</td></tr>');
		});
		$('#PheWAStable_SNP').DataTable({
			dom: 'Bfrtip',
			buttons: ['pageLength', 'csvHtml5'],
			"lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			"iDisplayLength": 10,
			"stripeClasses": []
		});
	}else{
		$('#PheWAStable_SNP').hide();
		$('#PheWAStable_SNP_info').hide();
		$('#PheWAStable_gene').show();
		$('#PheWAStable_gene_body').html("");
		data.forEach(function(d){
			$('#PheWAStable_gene_body').append('<tr><td>'+d[0]+'</td><td>'+d[2]+'</td><td>'
			+d[3]+'</td><td>'+d[4]+'</td><td>'+d[5]
			+'</td><td>'+d[1]+'</td><td>'+d[6]+'</td></tr>');
		});
		$('#PheWAStable_gene').DataTable({
			dom: 'Bfrtip',
			buttons: ['pageLength', 'csvHtml5'],
			"lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			"iDisplayLength": 10,
			"stripeClasses": []
		});
	}
}

function CSVdown(name){
	var dt = getDate();
	$('#'+name).tableToCSV(dt);
}

function ImgDown(name, type){
	$('#traitData').val($('#'+name).html());
	$('#traitType').val(type);
	$('#traitFileName').val(name);
	$('#imgdownSubmit').trigger('click');
}
