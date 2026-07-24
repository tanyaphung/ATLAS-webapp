@extends('layouts.master')
@section('head')
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.0/js/bootstrap-select.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
<script type="text/javascript" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/1.10.12/js/dataTables.bootstrap.min.js"></script>
<meta name="csrf-token" content="{{ csrf_token() }}"/>
<script type="text/javascript">
	$.ajaxSetup({
		headers: {'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')}
	});
	var subdir = "{{ Config::get('app.subdir') }}";
</script>
<script src="//unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
<!-- <script src="//cdn.jsdelivr.net/npm/sweetalert2@8"></script> -->
<!-- <script type="text/javascript" src="{!! URL::asset('js/sweetalert.min.js') !!}"></script>
<link rel="stylesheet" href="{!! URL::asset('css/sweetalert.css') !!}"> -->
<script type="text/javascript" src="{!! URL::asset('js/global.js') !!}"></script>
<script type="text/javascript" src="{!! URL::asset('js/HoldOn.min.js') !!}?0.0.1"></script>
<script type="text/javascript" src="{!! URL::asset('js/reportGWAS.js') !!}?0.0.3"></script>
@stop

@section('content')
<div style="padding-top:50px;padding-right:50px;padding-left:50px;">
	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Report missing GWAS</h4>
		</div>
		<div class="panel-body">
			<div style="padding-right:30px;padding-left:30px;">
				We appreciate any contribution of reporting GWAS missing from the current release of GWAS ATLAS.
				Please fill following information as much as possible.
				Please also check the table below the submission form, if the GWAS is already reported.<br/>
				We will manually check if reported GWAS is suitable for the GWAS ATLAS.<br/>
				Any contribution will be acknowledged on the "Home" page.
				If you wish to be acknowledged, please provide your name and affiliation.
				If you wish to stay anonymous, please check the option when you submit.
				<br/><br/>

				<div class="form-inline">
					Name: <input type="text" class="form-control" id="name" name="name"/><br/>
					Email: <input type="text" class="form-control" id="email" name="email"/>
					<span class="info"><i class="fa fa-info"></i> Please provide an e-mail if possible. We will only contact you if there is any question about the reported GWAS.</span></br>
					Affiliation: <input type="text" class="form-control" id="affiliation" name="affiliation"/><br/>
					Anonymous submission: <input type="checkbox" id="anonymous"/>
					<span class="info"><i class="fa fa-info"></i> When this option is checked, name, affiliation and e-mail are only used internally (if necessary), but not displayed publicly.</span></br>
					Phenotype<sup style="color:red;">*</sup>:
					<input type="text" class="form-control" id="phenotype" name="phenotype" onkeyup="CheckInput();" oninput="CheckInput();" onpaste="CheckInput();"/><br/>
					Link to summary statistics<sup style="color:red;">*</sup>:
					<input type="text" class="form-control" id="sumstats" name="sumstats" onkeyup="CheckInput();" oninput="CheckInput();" onpaste="CheckInput();"/><br/>
					Corresponding publication<sup style="color:red;">*</sup>:
					<input type="text" class="form-control" id="publication" name="publication" onkeyup="CheckInput();" oninput="CheckInput();" onpaste="CheckInput();"/><br/>
					Year<sup style="color:red;">*</sup>: <input type="number" class="form-control" id="year" name="year" onkeyup="CheckInput();" oninput="CheckInput();" onpaste="CheckInput();"/><br/>
					Comment:<br>
					<textarea id="comments" name="comments" rows="5" cols="30" maxlength="2000"></textarea>
				</div>
				<span style="color:red;"><sup>*</sup>Required fields</span><br/><br/>
				<button class="btn btn-default btn-sm" id="reportSubmit">Submit</button>
			</div>
		</div>
	</div>

	<div class="panel panel-default">
		<div class="panel-heading">
			<h4 class="panel-title">Reported GWAS and process status</h4>
		</div>
		<div class="panel-body">
			<div style="padding-right:30px;padding-left:30px;">
				<table id="reportedTable" class="display compact dt-body-right dt-head-center" width="90%" cellspacing="0" style="display: block; overflow-x: auto; font-size:14px;">
					<thead>
						<th>ID</th>
						<th>Phenotype</th>
						<th>Link</th>
						<th>Publication</th>
						<th>Year</th>
						<th>Status</th>
						<th>Note</th>
						<th>Date submitted</th>
						<th>Date last updated</th>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>
@stop
