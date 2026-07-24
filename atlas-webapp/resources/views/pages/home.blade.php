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

		$.ajax({
			url: "/home/getAckn",
			type: "GET",
			success: function(data){
				console.log(data)
				$('#ackn').append(data);
			}
		});
	});
</script>
@stop

@section('content')
<div class="container" style="padding-top:50px;">
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
		and not included in this database, please let us know from <a href="{{ Config::get('app.subdir') }}/report">Report GWAS</a> page.
		We appreciate any contribution to make the GWAS atlas as comprehensive as possible!!
		Contributions are acknowledged at the bottom of this page (except anonymous submissions).
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

	<div style="padding-top:20px; padding-bottom:20px;">
		<div class="panel panel-default">
			<div class="panel-heading"><h4>What's new</h4></div>
			<div class="panel-body" style="max-height:200px; overflow-y:auto;">
				<strong>2019-11-15</strong><br/>
				<div style="padding-left:20px">
					Third release of atlas database with in total of 4756 GWAS summary statistics.
					The last database curation was done in Aug 2019.
					SNP heritability in observed scale was added to the database.
					Several updates were made for previous entries (see "DateLastModified" column in the database).
				</div>
				<strong>2019-09-10</strong><br/>
				<div style="padding-left:20px">
					Allele misspecification for atlas ID 4096, 4098-4155 are fixed.
					This update only affects EA and NEA columns for the PheWAS table of SNPs.<br/>
				</div>
				<strong>2019-08-19</strong><br/>
				<div style="padding-left:20px">
					The study was published in <i>Nature Genetics</i>.
				</div>
				<strong>2019-04-17</strong><br/>
				<div style="padding-left:20px">
					We have added a page to report missing GWAS from the ATLAS database.
					We appreciate any contribution and will be acknowledged at the bottom of this page.
				</div>
				<strong>2019-01-17</strong><br/>
				<div style="padding-left:20px">
					Second release of atlas database with in total of 4155 GWAS summary statistics (ID 3799-4155 are new GWASs).
					The last database curation was done in Oct 2018.
					Several updates were made for ID 1-3798 (see "DateLastModified" column in the database).
				</div>
				<strong>2018-12-20</strong><br/>
				<div style="padding-left:20px">
					Preprint is now available (<a target="_blank" href="https://www.biorxiv.org/content/early/2018/12/19/500090">doi: https://doi.org/10.1101/500090</a>).
					The second release of the atlas database (total 4155 GWAS) will be available soon.
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

	<div style="padding-top:20px; padding-bottom:20px;">
		<div class="panel panel-default">
			<div class="panel-heading"><h4>Database release</h4></div>
			<div class="panel-body" style="overflow-y:auto;">
				<form method="post" target="_blank" action="{{ Config::get('app.subdir') }}/home/release">
					<input type="hidden" name="_token" value="{{ csrf_token() }}">
					<input type="hidden" name="file" id="release_file" val=""/>
					<input type="submit" id="releaseSubmit" class="releaseSubmit"/>
				</form>
				<strong>Release 3: v20191115</strong><br/>
				<div style="padding-left:20px">
					README file: <a class="release">gwasATLAS_v20191115.readme</a><br/>
					Plain text file: <a class="release">gwasATLAS_v20191115.txt.gz</a><br/>
					Excel file: <a class="release">gwasATLAS_v20191115.xlsx.gz</a><br/>
					Used column names: <a class="release">gwasATLAS_v20191115_columns.txt.gz</a><br/>
					Full pair-wise genetic correlation: <a class="release">gwasATLAS_v20191115_GC.txt.gz</a><br/>
					Full MAGMA gene P-values: <a class="release">gwasATLAS_v20191115_magma_P.txt.gz</a><br/>
					Full MAGMA gene-set P-values (MsigDB v7.0): <a class="release">gwasATLAS_v20191115_magma_sets_P.txt.gz</a><br/>
					Full risk loci: <a class="release">gwasATLAS_v20191115_riskloci.txt.gz</a><br/>
				</div>
				<br/>
				<strong>Release 2: v20190117</strong><br/>
				<div style="padding-left:20px">
					README file: <a class="release">gwasATLAS_v20190117.readme</a><br/>
					Plain text file: <a class="release">gwasATLAS_v20190117.txt.gz</a><br/>
					Excel file: <a class="release">gwasATLAS_v20190117.xlsx.gz</a><br/>
				</div>
				<br/>
				<strong>Release 1: v20180928</strong><br/>
				<div style="padding-left:20px">
					README file: <a class="release">gwasATLAS_v20180928.readme</a><br/>
					Plain text file: <a class="release">gwasATLAS_v20180928.txt.gz</a><br/>
					Excel file: <a class="release">gwasATLAS_v20180928.xlsx.gz</a><br/>
				</div>
			</div>
		</div>
	</div>

	<div style="padding-top:20ox; padding-bottom:20px;">
		<div class="panel panel-default">
			<div class="panel-heading"><h4>Acknowledgements for contributions</h4></div>
			<div class="panel-body" style="max-height:200px; overflow-y:auto;">
				<div id="ackn">
					<strong>
						Thank you for your contributions!!<br/>
						Names are ordered by the number of submissions (within square brackets), otherwise arbitral.
					</strong>
					<br/>
				</div>
			</div>
		</div>
	</div>

</div>
</br>
@stop
