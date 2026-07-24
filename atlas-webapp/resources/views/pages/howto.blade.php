@extends('layouts.master')
@section('head')
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
@stop

@section('content')
<div style="padding:40px;">
	<h2 id="top">How to use GWAS atlas website</h2>
	<p><h3><strong>Contents</strong></h3>
		<div style="padding-left:20px;">
			<a href="#1">1. Browse GWAS summary statistics</a><br/>
			<div style="padding-left:20px;">
				<a href="#1.1">1.1. Find your trait</a><br/>
				<a href="#1.2">1.2. Summary of GWAS results</a><br/>
				<a href="#1.3">1.3. Genetic correlation with other traits</a><br/>
			</div>
			<a href="#2">2. Compare multiple GWAS</a><br/>
			<div style="padding-left:20px;">
				<a href="#2.1">2.1. Select GWAS to compare</a><br/>
				<a href="#2.2">2.2. Summary of results</a><br/>
				<a href="#2.3">2.3. Pair-wise genetic correlation</a><br/>
				<a href="#2.4">2.4. Overlap of significant genes based on MAGMA gene analyses</a><br/>
				<a href="#2.5">2.5. Risk locus and gene pleiotropy</a><br/>
			</div>
			<a href="#3">3. Create PheWAS plot</a><br/>
			<div style="padding-left:20px;">
				<a href="#3.1">3.1. Search by SNP or gene name</a><br/>
				<a href="#3.2">3.2. Filter GWAS</a><br/>
			</div>
			<a href="#4">4. Frequently asked questions</a><br/>
		</div>
	</p>
	<p><h3 id="1"><strong>1. Browse GWAS summary statistics</strong></h3>
		<div style="padding-left:20px;">
			<h4 id="1.1">1.1. Find your trait</h4>
			<div class="row">
				<div class="col-md-4 col-sm-4 col-xs-4">
					Go to the "Browse GWAS" page which displays a table of entire entries of GWAS summary statistics in the database.
					If you know which trait you are looking for, you can either select from the list of traits (b)
					or type the trait name in the search box (e).
					If you are just looking for what kind of traits are available in the database,
					you can also filter by domain, chapter or subchapter level (a).
					Traits can also be filtered by published year and sample size in the filtering boxes (c and d).
					Any key ward can be searched from the search box (e).
					Each GWAS in the table (f) is clickable which will open a new tab with detailed information.<br/>
					<br/>
					(a) Filtering by trait categories.<br/>
					(b) Select by trait name.<br/>
					(c) Filtering by published year.<br/>
					(d) Filtering by total sample size.<br/>
					(e) Search box.<br/>
					(f) GWAS entries.<br/>
				</div>
				<div class="col-md-8 col-sm-8 col-xs-8">
					<div style="padding-right:20px;">
						<img src="{!! URL::asset('/image/howto1.png') !!}" style="width:90%;float:right;"/>
					</div>
				</div>
			</div>


			<div class="row">
				<div class="col-md-8 col-sm-8 col-xs-8">
					<h4 id="1.2">1.2. Summary of GWAS results (right image)</h4>
					When a GWAS is clicked, it will open a new tab with summary of the following results results.
					<br/>
					(a) GWAS information table:
					There are variety of basic information about the study.
					Original study is accessible from PMID field.
					Original summary statistics file can be accessed from the link.
					Details of each feature is available in <a href="{{ Config::get('app.subdir') }}/documentation#3">3. Database features</a> in the documentation.</br>
					(b) Manhattan plot<br/>
					(c) Q-Q plot<br/>
					(d) List of top SNPs in each genomic risk locus<br/>
					(e) Gene manhattan plot: P-value is based on MAGMA gene ananlysis.
					Top genes can be labeled by changing the number of the box.<br/>
					(f) Gene Q-Q plot<br/>
					(g) Top associated gene set: Results of MAGMA gene-set analysis.
					Gene sets which are significantly associated after Bonferroni correction are
					displayed. If the number of significant gene sets are less than 10,
					top 10 significant gene sets are displayed. <br/>
					(h) Generic correlation: Genetic correlation of the selected trait
					with other traits in the database.
					See next section for details.

					<h4 id="1.3">1.3. Genetic correlation (bottom image)</h4>
					By default, top 10 traits with the highest absolute genetic correlation are
					displayed regardless of significance.
					Nothing is shown for traits which are not eligible for estimation of genetic correlation
					(see <a href="{{ Config::get('app.subdir') }}/documentation#5">5.3. Genetic correlation</a> in the Documentation).
					Several options are available to obtain genetic correlation with a custom list of traits as the followings.<br/>
					(a) Exclude the same trait: If there is any other traits with the same name in the "uniqTrait" feature in the database,
					those can be excluded by activating this option.<br/>
					(b) Select GWAS with the maximum sample size per trait: For traits with more than one GWAS
					in the database, one with the largest sample size is selected per trait.
					Note that this selection is performed after other filtering options.<br/>
					(c) P-value and Bonferroni corrected P-value threshold.<br/>
					(d) The number of traits to display.</br>
					(e) Manual selection of trait: Traits can also be manually selected.
					Other filtering options are still performed on the selected traits.<br/>
					(f) Genetic correlation plot: Each bar is colored based on P-value;
					grey for P-value >= 0.05, high transparency red (positive) and blue (negative) for P-value < 0.05,
					and red or blue for P-value < P<sub>bon</sub>.
					Bonferroni correction is performed for the number of possible pairs
					before filtering of P-value but after other filtering options.<br/>
					(g) Genetic correlation table: same as (f) but in table format.
					<br/><br/>
					<img src="{!! URL::asset('/image/howto3.png') !!}" style="width:90%;"/>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4">
					<h4></h4><br/>
					<div style="padding-right:20px;">
						<img src="{!! URL::asset('/image/howto2.png') !!}" style="width:90%;float:right;"/>
					</div>
				</div>
			</div>

		</div>
	</p>
	<p><h3 id="2"><strong>2. Compare multiple GWAS</strong></h3>
		<div style="padding-left:20px;">
			<h4 id="2.1">2.1. Select GWAS to compare</h4>
			<div class="row">
				<div class="col-md-4 col-sm-4 col-xs-4">
					Go to "Multiple GWAS comparison" page.
					Database entries can be filtered same as in the "Browse GWAS" page.
					GWAS can be selected by checking the box manually or using buttons described below.<br/>
					(a) Number of selected GWAS: This number should be > 1 and &le; 100.<br/>
					(b) Select all displayed GWAS: this button only checks "currently displayed"
					GWAS, but not all the GWAS after filtering.
					You can change the number of GWAS to display from the left top of the table.<br/>
					(c) Clear all selected GWAS: Reset the selection of GWAS regardless of displayed or not.<br/>
					(d) Submit selected GWAS<br/>
				</div>
				<div class="col-md-8 col-sm-8 col-xs-8">
					<div style="padding-right:20px;">
						<img src="{!! URL::asset('/image/howto4.png') !!}" style="width:90%;float:right;"/>
					</div>
				</div>
			</div>

			<h4 id=2.2>2.2. Summary of results</h4>
			When selected GWAS are submitted correctly, several plots will be displayed
			in the page.
			See <a href="{{ Config::get('app.subdir') }}/documentation#7">7. Multi GWAS comparison</a> of documentation for details.<br/>
			(a) Summary of selected GWAS.<br/>
			(b) Scatterplot of published year and sample size: Each dot is a GWAS colored by domain.<br/>
			(c) Scatterplot of sample size and number of risk loci: Each dot is a GWAS colored by domain.<br/>
			(d) Scatterplot of SNP heritability and sample size: Each dot is a GWAS colored by domain.<br/>
			(e) Scatterplot of SNP heritability and number of risk loci: Each dot is a GWAS colored by domain.<br/>
			(f) Color code: Color of each domain. This color code is used in all plots in the page.<br/>
			(g) Genetic correlation heatmap: Each cell is colored by r<sub>g</sub> and sized by P-value.
			The significant ones are labeled by "*".
			The order of row and column can be selected from alphabetically, domain and hierarchical clustering.
			The color of rectangles next to the GWAS label represent the color of domain. <br/>
			(h) MAGMA gene overlap heatmap: Each cell is colored by proportion of overlapping significant genes.
			The order of row and column can be selected from alphabetically, domain and hierarchical clustering.
			The color of rectangles next to the GWAS label represent the color of domain. <br/>
			(i) Manhattan like plot of risk loci: Each dot is a locai group (see <a href="{{ Config::get('app.subdir') }}/documentation#7">7.4. Risk loci overlap</a>
			in the documentation for details) sized by the the number of GWAS in the loci group (same as Y-axis).
			The plot is zoomable and it will display plot (j) by cliking a dot.<br/>
			(j) Zoomed plot of a selected loci group: Each dot represents a top SNP in the locus of given GWAS
			sized by P-value, colored by domain and labelled by rsID.
			A horizontal line represents the region of the risk locus.
			See <a href="{{ Config::get('app.subdir') }}/documentation#4">4.2. Risk loci</a> in the documentation for the definition of risk loci.
			<br/><br/>
			<img src="{!! URL::asset('/image/howto5.png') !!}" style="width:90%;"/>

		</div>
	</p>
</div>
@stop
