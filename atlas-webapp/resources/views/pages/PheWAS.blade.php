@extends('layouts.master')
@section('head')
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.0/js/bootstrap-select.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/1.10.12/js/dataTables.bootstrap.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/select/1.2.0/js/dataTables.select.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/select/1.2.0/css/select.dataTables.min.css">
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/buttons.flash.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
<script type="text/javascript" src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js"></script>
<script type="text/javascript" src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/buttons.html5.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.2/js/buttons.print.min.js"></script>
<script type="text/javascript" src="//d3js.org/d3.v3.min.js"></script>
<script src="//labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<script type="text/javascript" src="//d3js.org/queue.v1.min.js"></script>
<meta name="csrf-token" content="{{ csrf_token() }}"/>
<script type="text/javascript">
	$.ajaxSetup({
		headers: {'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')}
	});
	var subdir = "{{ Config::get('app.subdir') }}";
</script>
<script type="text/javascript" src="{!! URL::asset('js/global.js') !!}"></script>
<script type="text/javascript" src="{!! URL::asset('js/jquery.tabletoCSV.js') !!}"></script>
<script type="text/javascript" src="{!! URL::asset('js/PheWAS.js') !!}?100"></script>
@stop

@section('content')
<div style="padding-top:50px;padding-right:50px;padding-left:50px;">
	<!-- SNP or gene -->
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Search SNP or Gene</h4>
		</div>
		<div class="panel-body">
			<input id="searchText" class="form-control" style="width:100%;" type="text" onkeydown="SearchEnter(event)" placeholder="Search for a SNP (rsID or coordinate) or gene (symbol or gene ID)."/>
			<span style="color:grey;">
				Examples - SNP rsID: , SNP coordinate: , gene symbol: , gene ID: .
			</span>
		</div>
	</div>
	<!-- GWAS selection -->
	<div class="panel panel-default">
		<div class="panel-heading">
			<a data-toggle="collapse" href="#filt-body">
				<h4 class="panel-title" style="color:black;">Filter GWAS</h4>
			</a>
		</div>
		<div id="filt-body" class="panel-body panel-collapse collapse">
			<div class="container">
				Filter GWAS<br/>
				<strong>By trait categories</strong><br/>
				<div class="row">
					<div class="col-md-4 col-sm-4 col-xs-4">
						Domain:<br/>
						<select class="selectpicker" name="Domain" id="Domain" onchange='Selection("Domain");'>
							<option value=null>-- Please select Domain of interest --</option>
						</select>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-4">
						Chapter level:<br/>
						<select class="selectpicker" name="Chapter" id="Chapter" onchange='Selection("Chapter");'>
							<option value=null>-- Please select Chapter of interest --</option>
						</select>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-4">
						Subchapter level:<br/>
						<select class="selectpicker" name="Subchapter" id="Subchapter" onchange='Selection("Subchapter");'>
							<option value=null>-- Please select Subchapter of interest --</option>
						</select>
					</div>
				</div>
				<br/>
				<span class="form-inline">
					<strong>By trait</strong><br/>
					<select class="selectpicker" data-width="75%" name="Trait" id="Trait" onchange='Selection("Trait");'>
						<option value=null>-- Please select Domain of interest --</option>
					</select><br/>
				</span>
				<br/>
				<span class="form-inline">
					<strong>By published year</strong><br/>
					From <input type="number" class="form-control" id="yearFrom" name="yearFrom" onkeydown="SelectEnter(event)">
					to <input type="number" class="form-control" id="yearTo" name="yearTo" onkeydown="SelectEnter(event)">
					<span class="info"><i class="fa fa-info"></i> Press enter to update the table below.</span>
				</span>
				<br/><br/>
				<span class="form-inline">
					<strong>By total sample size</strong><br/>
					Minimum: <input type="number" class="form-control" id="nMin" name="nMin" onkeydown="SelectEnter(event)">
					Maximum: <input type="number" class="form-control" id="nMax" name="nMax" onkeydown="SelectEnter(ebent)">
					<span class="info"><i class="fa fa-info"></i> Press enter to update the table below.</span>
				</span>
				<br/>
			</div>

			<div class="row" style="padding:25px;">
				<h4><span id="manual_select_n">0</span> GWAS are selected.</h4>
				<button class="btn btn-default btn-xs" id="manual_select_all">Select all GWAS in the table</button><tab>
				<button class="btn btn-default btn-xs" id="manual_select_all_displayed">Select all displayed GWAS</button><tab>
				<button class="btn btn-default btn-xs" id="manual_clear_all">Clear all selected GWAS</button><br/>
				<br/>
				<table id="selectTable" class="display compact dt-body-right dt-head-center" width="90%" cellspacing="0" style="display: block; overflow-x: auto; font-size:12px;">
					<thead>
						<th>select</th>
						<th>ID</th>
						<th>PMID</th>
						<th>Year</th>
						<th>Domain</th>
						<th>Chapter level</th>
						<th>Subchapter level</th>
						<th>Trait</th>
						<th>uniqTrait</th>
						<th>Population</th>
						<th>N</th>
					</thead>
				</table>
			</div>
			<button class="btn btn-default" id="plotPheWAS">Plot PheWAS for selected GWAS</button>
			<div id="msg"></div>
		</div>
	</div>

	<!-- Result panel -->
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">PheWAS plot</h4>
		</div>
		<div class="panel-body">
			<form method="post" target="_blank" action="{{ Config::get('app.subdir') }}/PheWAS/imgdown">
				<input type="hidden" name="_token" value="{{ csrf_token() }}">
				<input type="hidden" name="data" id="traitData" val=""/>
				<input type="hidden" name="type" id="traitType" val=""/>
				<input type="hidden" name="fileName" id="traitFileName" val=""/>
				<input type="submit" id="imgdownSubmit" class="ImgDownSubmit"/>
			</form>

			<span class="form-inline">
				Sort traits by:
				<select id="traitOrder" class="forn-control">
					<option value="alph" selected>Alphabetically</option>
					<option value="p">P-value</option>
					<option value="n">Total sample size</option>
					<option value="domain_alph">Domain</option>
					<option value="domain_p">Domain and P-value</option>
				</select>
				<tab>
				<a id="clearLabel">Clear text labels</a>
			</span>
			<br/>
			<span class="form-inline">
				max P-value: <input class="form-control" type="number" id="maxP" value="0.05">
				<button class="btn btn-xs" id="Pupdate">Update</button>
			</span>
			<br/>
			<span class="info"><i class="fa fa-info"></i>
				For SNPs, 0.05 is the maximum P-value.
				SNPs with P-value > 0.05 are not displayed regardless of this option due to low performance of the website.
			</span>
			<br/>
			Download the plot as
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("PheWASplot","png");'>PNG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("PheWASplot","jpeg");'>JPG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("PheWASplot","svg");'>SVG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("PheWASplot","pdf");'>PDF</button>
			<br/>
			<div id="nDataPheWAS"></div>
			<div style="overflow-y:auto;text-align:center;">
				<div id="PheWASplot">
					<h4>Please search either SNP or gene from the search box</h4>
				</div>
			</div>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">PheWAS table</h4>
		</div>
		<div class="panel-body">
			<div style="overflow-x:auto;">
				<table id="PheWAStable_gene" class="display compact dt-body-right dt-head-center" width="90%" cellspacing="0" style="font-size:12px;">
					<thead>
						<th>atlas ID</th>
						<th>PMID</th>
						<th>Year</th>
						<th>Domain</th>
						<th>Trait</th>
						<th>P-value</th>
						<th>N</th>
					</thead>
					<tbody id="PheWAStable_gene_body"></tbody>
				</table>
				<table id="PheWAStable_SNP" class="display compact dt-body-right dt-head-center" width="90%" cellspacing="0" style="font-size:12px;">
					<thead>
						<th>atlas ID</th>
						<th>PMID</th>
						<th>Year</th>
						<th>Domain</th>
						<th>Trait</th>
						<th>P-value</th>
						<th>N</th>
						<th>EA</th>
						<th>NEA</th>
					</thead>
					<tbody id="PheWAStable_SNP_body"></tbody>
				</table>
				<span id="PheWAStable_SNP_info" class="info"><i class="fa fa-info"></i> Alleles for SNPs table <br/>
					EA (effect allele): allele increases the risk of the phenotype (for binary phenotype) or the phenotype value (for quantitative phenotype).<br/>
					NEA (non-effect allele): other alleles.<br/>
					EA and NEA are only provided for GWAS when both effect and non-effect alleles and signed effect (beta or OR) are provided in the original summary statistics.
					Otherwise NA.
				</span>
			</div>
		</div>
	</div>
</div>
@stop
