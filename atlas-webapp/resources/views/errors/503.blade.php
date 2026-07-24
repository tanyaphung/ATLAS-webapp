@extends('layouts.master')
@section('head')
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<meta name="csrf-token" content="{{ csrf_token() }}"/>
<script type="text/javascript">
	$.ajaxSetup({
		headers: {'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')}
	});
</script>
<script type="text/javascript" src="{!! URL::asset('js/odometer.min.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/odometer-theme-default.css') !!}">
<script type="text/javascript">
	$(document).ready(function(){
		$('.releaseSubmit').hide()
		$('.btn').prop("disabled", true);
		$.ajax({
			url: "/home/dbSum",
			type: "POST",
			success: function(data){
				data = JSON.parse(data);
				$('#totalGWAS').html(data.GWAS);
				$('#uniqTrait').html(data.trait);
				$('#uniqStudy').html(data.study);
				$('#uniqDomain').html(data.domain);
			}
		});

		$('.release').on('click', function(){
			console.log($(this).text())

			$('#release_file').val($(this).text());
			$('#releaseSubmit').trigger('click');
		})
	});
</script>
@stop

@section('content')
<div class="container" style="padding-top:50px;">
	<div id="message" style="text-align: center;">
		<div class="alert alert-danger" style="font-size:24px;">
			GWAS atlas is currently closed for an update.
			Will be back online as soon as possible!!
		</div>
	</div>
	<div style="text-align: center;">
		<h2>Welcome to the Atlas of GWAS Summary Statistics</h2>
	</div>
	<br/>
	<p>
		This atlas is a database of publicly available GWAS summary statistics.
		Each GWAS can be browsed with the manhattan plot, risk loci, MAGMA (i.e. gene-based) results, SNP heritability and genetic correlations with other GWAS in the database.
		600 GWAS were performed in this project based on UK Biobank release 2 data under application ID 16406.
		Full summary statistics can be downloaded from the original source following the provided links.
	</p>
	<p>
		If you have/find GWAS summary statistics that are publicly available
		and not included in this database, please let us know by contacting Kyoko Watanabe (k.watanabe@vu.nl).
	</p>
	<p>
		<strong>Citation:</strong><br/>
		Watanabe, K. <i>et al.</i> A global overview of pleiotropy and genetic architecture in complex traits. <i>Nat. Genet.</i> <b>51</b>, 1339-1348 (2019).
		<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/31427789">PMID: 31427789</a>
	</p>
	<br/>
	<p style="font-size: 18px;">
		Currently the database contains <span style="font-size:28px; color:#FF5C33;" class="odometer" id="totalGWAS"></span> GWAS from
		<span style="font-size:28px; color:#FF5C33;" class="odometer" id="uniqStudy"></span> unique studies
		across <span style="font-size:28px; color:#FF5C33;" class="odometer" id="uniqTrait"></span> unique traits and
		<span style="font-size:28px; color:#FF5C33;" class="odometer" id="uniqDomain"></span> domains.
	</p>
	<br/><br/>
	<div class="row">
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-success">
				<div class="panel-heading" style="padding-top:5px; padding-bottom:5px;"><h4>Browse GWAS</h4></div>
				<div class="panel-body" style="height:160px;">
					Overview of each GWAS such as Manhattan plots and QQ plot at SNP and gene levels and genetic correlations with other GWAS in the database.<br/>
					<br/><br/>
					<button class="btn btn-success" style="opacity:0.8;"><a href="{{ Config::get('app.subdir') }}/traitDB" style="color:black;">Browse GWAS</a></button>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-warning">
				<div class="panel-heading" style="padding-top:5px; padding-bottom:5px;"><h4>Multiple GWAS comparison</h4></div>
				<div class="panel-body" style="height:160px;">
					Multiple GWAS can be compared in terms of genetic correlations, overlap of significant genes based on MAGMA gene-analysis and overlap of genetic risk loci.<br/>
					<br/>
					<button class="btn btn-warning" style="opacity:0.8;"><a href="{{ Config::get('app.subdir') }}/multiGWAS" style="color:black;">Multiple GWAS comparison</a></button>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-info">
				<div class="panel-heading" style="padding-top:5px; padding-bottom:5px;"><h4>PheWAS</h4></div>
				<div class="panel-body" style="height:160px;">
					PheWAS plot for a SNP or gene can be created across GWAS in the database.<br/>
					<br/><br/><br/>
					<button class="btn btn-info" style="opacity:0.8;"><a href="{{ Config::get('app.subdir') }}/PheWAS" style="color:black;">PheWAS</a></button>
				</div>
			</div>
		</div>
	</div>

	<div style="padding-top:20ox; padding-bottom:20px;">
		<div class="panel panel-default">
			<div class="panel-heading"><h4>What's new</h4></div>
			<div class="panel-body" style="max-height:200px; overflow-y:auto;">
				<strong>2019-01-17</strong><br/>
				<div style="padding-left:20px">
					Second release of atlas database with in total of 4155 GWAS summary statistics (ID 3799-4155 are new GWASs).
					The last database curation was done in Oct 2018.
					Several updates have done for ID 1-3798 (see "DateLastModfied" column in the database).
				</div>
				<strong>2018-09-28</strong><br/>
				<div style="padding-left:20px">
					First release of atlas database with 3798 GWAS summary statistics.
					The last database curation was done in Aug 2017.
					We will update summary statistics published since then, in near future.
					Publication is under preparation.
				</div>
				<strong>2017-12-18</strong><br/>
				<div style="padding-left:20px">
					First internal release of the website.
				</div>
			</div>
		</div>
	</div>

</div>
</br>
@stop
