var selectTable;
var selectedTable;
var maxSelect = 5;
$(document).ready(function(){
	$('#yearFrom').val("");
	$('#yearTo').val("");
	$('#nMin').val("");
	$('#nMax').val("");
	$('#Domain').val("null");
	Selection("Domain");

	$('#dbTable').on('click', 'tr', function(){
		var rowData = selectTable.row(this).data();
		window.open(subdir+"/traitDB/"+rowData["ID"]);
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
	}else if(type=="Chapter"){
		subchapter="null";
		trait="null";
	}else if(type=="Subchapter"){
		trait="null";
	}
	// $('#test').html(type+":"+domain+":"+chapter+":"+subchapter);
	if(type!="Trait"){
		SelectOptions(type, domain, chapter, subchapter, trait);
	}
	TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);
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

		TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax);
	}
}

function TableUpdate(domain, chapter, subchapter, trait, yearFrom, yearTo, nMin, nMax){
	$('#dbTable').DataTable().destroy();
	selectTable = $('#dbTable').DataTable({
		processing: false,
		serverSide: false,
		select: true,
		autoWidth: false,
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
			}
		},
		"columns":[
			{"data": "ID", name: "ID"},
			{"data": "PMID", name:"PMID"},
			{"data": "Year", name: "Year"},
			{"data": "Consortium", name: "Consortium"},
			{"data": "Domain", name: "Domain"},
			{"data": "ChapterLevel", name: "Chapter level"},
			{"data": "SubchapterLevel", name: "Subchapter level"},
			{"data": "Trait", name: "Trait"},
			{"data": "uniqTrait", name: "uniqTrait"},
			{"data": "Population", name: "Populaion"},
			{"data": "Ncase", name: "Case"},
			{"data": "Ncontrol", name: "Control"},
			{"data": "N", name: "N"},
			{"data": "SNPh2", name: "SNP h2"},
			{"data": "File", name: "File"}
		],
		columnDefs: [
			{width:"200px", target:4}
		],
		"lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 10,
		"stripeClasses": []
	});
}
