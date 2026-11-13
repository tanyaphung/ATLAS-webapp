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
@vite(['resources/js/traitDB.js', 'resources/js/global.js'])

@stop

@section('content')
<div style="padding-top: 50px; padding-right: 50px; padding-left: 50px">
	<div class="panel panel-default">
		<div class="panel-heading">
			<div class="panel-title">Browse summary statistics in GWAS ATLAS</div>
		</div>
		<div class="panel-body container">
			<strong>By trait categories</strong><br/>
			<div class="row">
				<div class="col-md-4 col-sm-4 col-xs-4">
					Domain:<br/>
					<select class="selectpicker" name="Domain" id="Domain" onchange='window.handleSelection("Domain");'>
						<option value=null>-- Please select Domain of interest --</option>
					</select>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4">
					Chapter level:<br/>
					<select class="selectpicker" name="Chapter" id="Chapter" onchange='window.handleSelection("Chapter");'>
						<option value=null>-- Please select Chapter of interest --</option>
					</select>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4">
					Subchapter level:<br/>
					<select class="selectpicker" name="Subchapter" id="Subchapter" onchange='window.handleSelection("Subchapter");'>
						<option value=null>-- Please select Subchapter of interest --</option>
					</select>
				</div>
			</div>
			<br/>
			<span class="form-inline">
				<strong>By trait</strong>
				<a class="infoPop" data-toggle="popover" data-content="Traits are ordered alphabetically. The number in parentheses is the number of GWAS in the database.">
					<i class="fa fa-question-circle-o fa-lg"></i>
				</a>
				<br/>
				<select class="selectpicker" data-width="75%" name="Trait" id="Trait" onchange='window.handleSelection("Trait");'>
					<option value=null>-- Please select Domain of interest --</option>
				</select><br/>
				<!-- Trait keyword: <input type="text" class="form-control" id="TraitKey" name="TraitKey" onkeydown="SelectEnter(event)"></input> -->
			</span>
			<br/>
			<span class="form-inline">
				<strong>By published year</strong><br/>
				From <input type="number" class="form-control" id="yearFrom" name="yearFrom" onkeydown="SelectEnter(event)">
				to <input type="number" class="form-control" id="yearTo" name="yearTo" onkeydown="SelectEnter(event)">
				(inclusive)
				<span class="info"><i class="fa fa-info"></i> Press enter to update the table below.</span>
			</span>
			<br/><br/>
			<span class="form-inline">
				<strong>By total sample size</strong><br/>
				Minimum: <input type="number" class="form-control" id="nMin" name="nMin" onkeydown="SelectEnter(event)">
				Maximum: <input type="number" class="form-control" id="nMax" name="nMax" onkeydown="SelectEnter(event)">
				(inclusive)
				<span class="info"><i class="fa fa-info"></i> Press enter to update the table below.</span>
			</span>
		</div>
	</div>

	<div>
		<span class="info"><i class="fa fa-info"></i> Click any of rows from the table to open a GWAS summary page.</span>
		<br/><br/>
		<table id="dbTable" class="display compact row-border" width="100%" cellspacing="0" style="display: block; overflow-x: auto; font-size: 14px;">
			<thead>
				<th>ID</th>
				<th>PMID</th>
				<th>Year</th>
				<th>Consortium</th>
				<th>Domain</th>
				<th>Chapter level</th>
				<th>Subchapter level</th>
				<th>Trait</th>
				<th>uniqTrait</th>
				<th>Population</th>
				<th>Case</th>
				<th>Control</th>
				<th>N</th>
				<th>SNP h2</th>
				<th>File</th>
			</thead>
			<tbody id="dbTableBody">
			</tbody>
		</table>
	</div>
</div>
@stop

@push('vite')
	@vite(['resources/js/utils/traitDB.js'])

@endpush