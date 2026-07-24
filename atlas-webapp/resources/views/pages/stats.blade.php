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
<script type="text/javascript" src="//cdn.datatables.net/fixedcolumns/3.2.2/js/dataTables.fixedColumns.min.js"></script>
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
<script type="text/javascript" src="{!! URL::asset('js/odometer.min.js') !!}"></script>
<script type="text/javascript" src="{!! URL::asset('js/stats.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/odometer-theme-default.css') !!}">

@stop

@section('content')
<div style="padding-top:50px;padding-right:50px;padding-left:50px;">
	<div class="row">
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Database Summary</h4>
				</div>
				<div class="panel-body" style="height: 380px;">
					<div class="row" style="padding-top:30px;">
						<div class="col-md-6 col-sm-6 col-xs-6" style="text-align:center; padding:20px;">
							<div id="totalGWAS" class="odometer" style="font-size:35px;"></div><br/>
							<span style="font-size:20px;">GWAS</span>
						</div>
						<div class="col-md-6 col-sm-6 col-xs-6" style="text-align:center; padding:20px;">
							<div id="uniqTrait" class="odometer" style="font-size:35px;"></div><br/>
							<span style="font-size:20px;">Unique Traits</span>
						</div>
					</div>
					<div class="row" style="padding-top:30px;">
						<div class="col-md-6 col-sm-6 col-xs-6" style="text-align:center; padding:20px;">
							<div id="uniqStudy" class="odometer" style="font-size:35px;"></div><br/>
							<span style="font-size:20px;">Unique Studies</span>
						</div>
						<div class="col-md-6 col-sm-6 col-xs-6" style="text-align:center; padding:20px;">
							<div id="uniqDomain" class="odometer" style="font-size:35px;"></div><br/>
							<span style="font-size:20px;">Domains</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-8 col-sm-8 col-xs-8">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Summary by Published Year</h4>
				</div>
				<div class="panel-body" style="height: 380px; overflow-x: auto;">
					<div id="yearSumPlot" style="text-align: center;">
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Domain Distribution (per study)</h4>
				</div>
				<div class="panel-body" style="height: 400px; overflow: auto;">
					<div id="DomainPie" style="text-align: center;">
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Chapter Distribution (per study)</h4>
				</div>
				<div class="panel-body" style="height: 400px; overflow: auto;">
					<div id="ChapterPie" style="text-align: center;">
						Click one of the domains from the left pie chart.
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-4 col-sm-4 col-xs-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">Sub-chapter Distribution (per study)</h4>
				</div>
				<div class="panel-body" style="height: 400px; overflow: auto;">
					<div id="SubchapterPie" style="text-align: center;">
						Click one of the chapters from the left pie chart.
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Summary by Domain</h4>
		</div>
		<div class="panel-body">
			<div id="domainSumPlot" style="text-align: center;">
			</div>
			<br/>
			<span class="info"><i class="fa fa-info"></i>
				SNP heritability is in liability scale (winsorized at 1).
			</span>
			<br/>
		</div>
	</div>
</div>
@stop
