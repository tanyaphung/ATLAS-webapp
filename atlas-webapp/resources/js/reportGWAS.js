$(document).ready(function(){
	CheckInput();
	getTable();
	$('#reportSubmit').on('click', function(){
		var name=$('#name').val();
		var email=$('#email').val();
		var affi=$('#affiliation').val();
		var anony=$('#anonymous').is(':checked');
		if(anony){anony=1}else{anony=0}
		var pheno=$('#phenotype').val();
		var sumstats=$('#sumstats').val();
		var pub=$('#publication').val();
		var year=$('#year').val();
		var comment=$('#comment').val();
		if(comment==undefined){comment="NA"}
		swal({
			title: "Report missing GWAS: ",
			text: "Name: "+name+", Email: "+email+", Affiliation: "+affi+
			", Phenotype: "+pheno+", Link: "+sumstats+", Publication: "+pub
			+", Year: "+year+", Comment: "+comment,
			icon: "info",
			buttons: true,
		}).then(function(isConfirm){
			if(isConfirm){
				$.ajax({
					url: subdir+'/report/submit',
					type: 'POST',
					data:{
						name: name,
						email: email,
						affi: affi,
						anony: anony,
						pheno: pheno,
						sumstats: sumstats,
						pub: pub,
						year: year,
						comment: comment
					},
					beforeSend: function(){
						var options = {
							theme: "sk-circle",
							message: 'Publishing the result, please wait for a second.'
						}
						HoldOn.open(options);
					},
					error: function(){
						alert('Errror occured during submission');
					},
					success: function(){
						HoldOn.close()
						swal({
							title: "Thank you!",
							text: "The GWAS has been recorded, thank you for your contribution!!",
							icon: "success",
						});
					}, complete: function(){
						getTable();
					}
				})
			}
		});
	})
})

function CheckInput(){
	var submit = false;
	if($('#phenotype').val().length>0 && $('#sumstats').val().length>0 && $('#publication').val().length>0 && $('#year').val().length>0){
		submit=true;
	}
	if(submit){
		$('#reportSubmit').prop('disabled', false);
	}else{
		$('#reportSubmit').prop('disabled', true);
	}
}

function getTable(){
	$('#reportedTable').DataTable().destroy();
	$('#reportedTable').DataTable({
		processing: false,
		serverSide: false,
		select: false,
		"ajax" : {
			url: subdir+"/report/getTable",
			type: "GET"
		},
		"columns":[
			{"data": "id", name: "ID"},
			{"data": "phenotype", name:"Publication"},
			{"data": "sumstats_link", name: "Link"},
			{"data": "publication", name: "Publication"},
			{"data": "year", name: "Year"},
			{"data": "status", name: "Status"},
			{"data": "note", name: "Note"},
			{"data": "date_submit", name: "Date submitted"},
			{"data": "date_last_update", name: "Date last updated"}
		],
		"order": [[0, "desc"]],
		"lengthMenue": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 10,
		"stripeClasses": []
	});
}
