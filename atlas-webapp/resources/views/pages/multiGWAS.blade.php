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
<script type="text/javascript" src="{!! URL::asset('js/multiGWAS.js') !!}?0.0.2"></script>

@stop

@section('content')
<div style="padding-top:50px;padding-right:50px;padding-left:50px;">
	<!-- GWAS selection -->
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Select GWAS</h4>
		</div>
		<div class="panel-body">
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
					Maximum: <input type="number" class="form-control" id="nMax" name="nMax" onkeydown="SelectEnter(event)">
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
			<button class="btn btn-default" id="processGWAS">Compare selected GWAS</button>
			<div id="msg"></div>
		</div>
	</div>

	<!-- Result panels -->
	<div class="row">
		<form method="post" target="_blank" action="{{ Config::get('app.subdir') }}/multiGWAS/imgdown">
			<input type="hidden" name="_token" value="{{ csrf_token() }}">
			<input type="hidden" name="data" id="traitData" val=""/>
			<input type="hidden" name="type" id="traitType" val=""/>
			<input type="hidden" name="fileName" id="traitFileName" val=""/>
			<input type="submit" id="imgdownSubmit" class="ImgDownSubmit"/>
		</form>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Summary of selected GWAS</h4>
				</div>
				<div class="panel-body col4BoxBody" id="sumBody" style="text-align:center; overflow:auto;">
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Year vs Sample size</h4>
				</div>
				<div class="panel-body col4BoxBody" style="text-align:center; overflow:auto;">
					Download the plot as
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("yearVSnPlot","png");'>PNG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("yearVSnPlot","jpeg");'>JPG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("yearVSnPlot","svg");'>SVG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("yearVSnPlot","pdf");'>PDF</button>
					<br/>
					<div id="yearVSnBody"></div>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Sample size vs Number of risk loci</h4>
				</div>
				<div class="panel-body col4BoxBody" style="text-align:center; overflow:auto;">
					Download the plot as
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSlociPlot","png");'>PNG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSlociPlot","jpeg");'>JPG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSlociPlot","svg");'>SVG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSlociPlot","pdf");'>PDF</button>
					<br/>
					<div id="nVSlociBody"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Sample size vs SNP heritability</h4>
				</div>
				<div class="panel-body col4BoxBody" style="text-align:center; overflow:auto;">
					Download the plot as
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSh2Plot","png");'>PNG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSh2Plot","jpeg");'>JPG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSh2Plot","svg");'>SVG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("nVSh2Plot","pdf");'>PDF</button>
					<br/>
					<span class="info"><i class="fa fa-info"></i>SNP heritability is in liability scale.<br/></span>
					<div id="nVSh2Body"></div>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Number of risk loci vs SNP heritability</h4>
				</div>
				<div class="panel-body col4BoxBody" style="text-align:center; overflow:auto;">
					Download the plot as
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociVSh2Plot","png");'>PNG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociVSh2Plot","jpeg");'>JPG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociVSh2Plot","svg");'>SVG</button>
					<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociVSh2Plot","pdf");'>PDF</button>
					<br/>
					<span class="info"><i class="fa fa-info"></i>SNP heritability is in liability scale.<br/></span>
					<div id="lociVSh2Body"></div>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Domain Color-code</h4>
				</div>
				<div class="panel-body col4BoxBody" id="colorBody" style="text-align:center; overflow:auto;">
				</div>
			</div>
		</div>
	</div>
	<div class="row" id="gc_magma_row">
		<div class="col-md-6 col-sm-6 col-xs-6" id="gcCol">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Genetic Correlation</h4>
				</div>
				<div class="panel-body col6BoxBody" id="gcBody" style="overflow: auto;">
					<div>
						<span class="form-inline">Sort traits by:
							<select id="gcOrder" class="forn-control">
								<option value="alph">Alphabetically</option>
								<option value="domain">Domain</option>
								<option value="clst">Cluster</option>
							</select>
						</span>
						<br/>
						Download the plot as
						<button class="btn btn-default btn-xs ImgDown GCimg" onclick='ImgDown("gcPlot","png");'>PNG</button>
						<button class="btn btn-default btn-xs ImgDown GCimg" onclick='ImgDown("gcPlot","jpeg");'>JPG</button>
						<button class="btn btn-default btn-xs ImgDown GCimg" onclick='ImgDown("gcPlot","svg");'>SVG</button>
						<button class="btn btn-default btn-xs ImgDown GCimg" onclick='ImgDown("gcPlot","pdf");'>PDF</button>
						<br/>
						Download data as
						<button class="btn btn-default btn-xs" id="downGCjson">json</button>
						<br/><br/>
						<span class="info"><i class="fa fa-info"></i>
							The heatmap is symmetric.
							Significant genetic correlations after Bonferroni correction (< 0.05) are labeled with "*".
							Rectangles next to the trait labels are colored based on the domain of the trait.
						</span>
					</div>
					<div id="gcPlot" style="text-align:center;"></div>
				</div>
			</div>
		</div>
		<div class="col-md-6 col-sm-6 col-xs-6" id="magmaCol">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">MAGMA genes overlap</h4>
				</div>
				<div class="panel-body col6BoxBody" id="magmaBody" style="overflow: auto;">
					<div>
						<span class="form-inline">Sort traits by:
							<select id="magmaOrder" class="forn-control">
								<option value="alph">Alphabetically</option>
								<option value="domain">Domain</option>
								<option value="clst">Cluster</option>
							</select>
							<!-- P-value threshold:
							<input type="number" class="form-contorl" id="magmaP" value="2.5e-6"> -->
						</span>
						<br/>
						Download the plot as
						<button class="btn btn-default btn-xs ImgDown Mimg" onclick='ImgDown("magmaPlot","png");'>PNG</button>
						<button class="btn btn-default btn-xs ImgDown Mimg" onclick='ImgDown("magmaPlot","jpeg");'>JPG</button>
						<button class="btn btn-default btn-xs ImgDown Mimg" onclick='ImgDown("magmaPlot","svg");'>SVG</button>
						<button class="btn btn-default btn-xs ImgDown Mimg" onclick='ImgDown("magmaPlot","pdf");'>PDF</button>
						<br/>
						Download data as
						<button class="btn btn-default btn-xs" id="downMAGMAjson">json</button>
						<br/><br/>
						<span class="info"><i class="fa fa-info"></i>
							The heatmap is asymmetric.
							The cell of <i>i</i>th column and <i>j</i>th row represents the proportion of overlapped significant genes (P-value < 2.5e-6) between two GWAS
							based on the number of significant genes in ith GWAS (the number of genes significant in both GWAS <i>i</i> and <i>j</i> divided by the number of significant genes in GWAS <i>i</i>).
							Rectangles next to the trait labels are colored based on the domain of the trait.
						</span>
					</div>
					<div id="magmaPlot" style="text-align:center;"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Pleiotropic risk loci</h4>
		</div>
		<div class="panel-body" id="LociOverBody">
			<span class="info"><i class="fa fa-info"></i>
				Each dot represents a group of physically overlapping risk loci.
				See <a href="{{ Config::get('app.subdir') }}/documentation#7">Documentation</a> for details.
				The genome wide plot can be zoomed in and out by scroll.
				When Y-axis is the number of associated domains, the dots are sized by the number of associated GWAS and vice versa.
				Note that the number of associated GWAS is the number of associated unique summary statistics which does not necessary reflect the number of associated unique traits
				when multiple summary statistics for a single trait are selected.
				By clicking a dot, another plot for a specific group of risk loci will be plotted (only if the number of GWAS in the grouped locus is > 1).
				Note that P-value < 1e-300 is replaced with 1e-300 (maximum -log10 P-value is 300 in this plot).
			</span><br/>
			<span class="form-inline">Y-axis:
				<select id="lociYaxis" class="forn-control">
					<option value="domain">Number of associated domains</option>
					<option value="GWAS">number of associated GWAS</option>
				</select>
			</span>
			<br/>
			Download the plot as
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociPlot","png");'>PNG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociPlot","jpeg");'>JPG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociPlot","svg");'>SVG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("lociPlot","pdf");'>PDF</button>
			<br/>
			<div id="lociPlot" style="text-align:center;"></div>
			<br/>
			<div id="locusPlotImgDown">
				Download the plot as
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("locusPlot","png");'>PNG</button>
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("locusPlot","jpeg");'>JPG</button>
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("locusPlot","svg");'>SVG</button>
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("locusPlot","pdf");'>PDF</button>
			</div>
			<div id="locusPlot" style="text-align:center;"></div>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Pleiotropic genes</h4>
		</div>
		<div class="panel-body" id="genesBody">
			<span class="info"><i class="fa fa-info"></i>
				Each dot represents a single gene.
				The genome wide plot can be zoomed in and out by scroll.
				When Y-axis is the number of associated domains, the dots are sized by the number of associated GWAS and vice versa.
				Note that the number of associated GWAS is the number of associated unique summary statistics which does not necessary reflect the number of associated unique traits
				when multiple summary statistics for a single trait are selected.
				By clicking a dot, PheWAS plot of the selected gene for selected GWAS will be displayed below.
				Note that P-value < 1e-300 is replaced with 1e-300 (maximum -log10 P-value is 300 in this plot).
			</span><br/>
			<span class="form-inline">Y-axis:
				<select id="geneYaxis" class="forn-control">
					<option value="domain">Number of associated domains</option>
					<option value="GWAS">number of associated GWAS</option>
				</select>
			</span>
			<br/>
			Download the plot as
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genesPlot","png");'>PNG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genesPlot","jpeg");'>JPG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genesPlot","svg");'>SVG</button>
			<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genesPlot","pdf");'>PDF</button>
			<br/>
			<div id="genesPlot" style="text-align:center;"></div>
			<br/>
			<div id="genePlotTitle"></div>
			<div id="genePlotOpt">
				<span class="form-inline">
					Sort traits by:
					<select id="genePlotOrder" class="forn-control">
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
				Download the plot as
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genePlot","png");'>PNG</button>
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genePlot","jpeg");'>JPG</button>
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genePlot","svg");'>SVG</button>
				<button class="btn btn-default btn-xs ImgDown" onclick='ImgDown("genePlot","pdf");'>PDF</button>
				<br/>
			</div>
			<div id="genePlot" style="text-align:center;"></div>
		</div>
	</div>
</div>

@stop
