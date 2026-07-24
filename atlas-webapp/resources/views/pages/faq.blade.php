@extends('layouts.master')
@section('head')
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	$('.panel-heading.faq a').on('click', function(){
		if($(this).attr('class')=="active"){
			$(this).removeClass('active');
			$(this).children('i').attr('class', 'fa fa-chevron-down');
		}else{
			$(this).addClass('active');
			$(this).children('i').attr('class', 'fa fa-chevron-up');
		}
	});
})
</script>
@stop

@section('content')
<div style="padding-top: 50px; padding-right: 50px; padding-left: 50px;">
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>How can I find a trait in the database? <a href="#faq1" data-toggle="collapse" class="active" style="float: right; padding-right:20px;"><i class="fa fa-chevron-up"></i></a></h4>
		</div>
		<div class="panel-body collapse in" id="faq1">
			From the "Browse GWAS" page, you can search GWAS summary statistics in the database by trait name.
			You can search any key word from search box.
			Traits can also be filtered by published year and sample size in the filtering boxes.
			<br/><br/>
			<img src="{!! URL::asset('/image/faq1.png') !!}" style="width:80%;float:left;"/>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>I can't find GWAS summary statistics I'm looking for. <a href="#faq2" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq2">
			The atlas of GWAS summary statistics only contains GWAS summary statistics when results of full SNPs are publicly available without any application to access.
			Non-GWAS results such as WES or customised chip studies are not included (for the current version).
			Please also check the latest release of the database from the home page.
			If the GWAS is already published and full results are publicly available, but you can't still find them in the database,
			please report the GWAS from <a href="{{ Config::get('app.subdir') }}/report">Report GWAS page</a>.
			We appreciate your contribution to make the database comprehensive!!
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>What is atlas ID for each trait? <a href="#faq3" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq3">
			The atlas ID for each trait is a unique identifier in the database.
			The ID itself dose not mean anything and the order of traits in the database is arbitrary.
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>What are top SNPs? <a href="#faq4" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq4">
			Top SNPs are the SNPs with the minimum P-value in each genomic risk locus.
			For each GWAS in the database, risk loci are defined as described previously
			[<a target="_blank" href="https://www.nature.com/articles/s41467-017-01261-5">Watanabe et al. 2017</a>].
			See documentation <a href="{{ Config::get('app.subdir') }}/documentation#4">4. Definition of lead SNPs and risk loci</a> for details.
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>How can I check genetic correlation of a trait of interest with other traits in the database?
				<a href="#faq5" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq5">
			At the bottom of the trait page, you can find a plot and table of genetic correlation of the selected GWAS with the other GWAS in the database.
			By default, top 10 traits with the highest absolute genetic correlation are
			displayed regardless of significance.
			Nothing is shown for traits which are not eligible for estimation of genetic correlation
			(see <a href="{{ Config::get('app.subdir') }}/documentation#5">5.3. Genetic correlation</a> in the Documentation).
			Several options are available to obtain genetic correlation with a custom list of traits as the followings.<br/>
			(a) Exclude traits with the same name: If there is any other traits with the same name in the "uniqTrait" feature in the database,
			those can be excluded by activating this option.<br/>
			(b) Select GWAS with the maximum sample size per trait: For traits with more than one GWAS
			in the database, one with the largest sample size is selected per trait.
			Note that this selection is performed after other filtering options.<br/>
			(c) P-value and Bonferroni corrected P-value threshold.<br/>
			(d) The number of traits to display.</br>
			(e) Manual selection of trait: Traits can also be manually selected.
			Other filtering options are still performed on the selected traits.<br/>
			(f) Genetic correlation plot: Each bar is colored based on P-value;
			grey for P-value &ge; 0.05, high transparency red (positive) and blue (negative) for P-value < 0.05,
			and red or blue for P-value < P<sub>bon</sub>.
			Bonferroni correction is performed for the number of possible pairs after filtering based on selected options but
			before the filtering of P-value.<br/>
			(g) Genetic correlation table: same as (f) but in table format.
			<br/><br/>
			<img src="{!! URL::asset('/image/faq5.png') !!}" style="width:80%;float:left;"/>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>I have a list of traits that I want to compare. How do I do that? <a href="#faq6" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq6">
			In the "Multi GWAS comparison" page, there is a same database table and filtering options as "Browse GWAS" page.
			You can search your traits and click check box manually.
			Once a trait is checked, this remains when you search another trait.
			For example, you first search for schizophrenia and check one of the GWAS.
			Next you search body mass index which shows several entries of GWAS.
			The selected GWAS for schizophrenia is not in the filtered table but it remained selected as you can notice from the number of selected GWAS  at the top of the table.
			There are two buttons to select "all GWAS in the table" and "all displayed GWAS".
			The former checks all GWAS in the current filtered table while the later select only the ones displayed.
			For example, when you filter GWAS on traits in Psychiatric domain, the "select all GWAS in the table" will check all psychiatric traits,
			but "select all displayed GWAS" only checks 10 GWAS which hare visible.
			You can change the number of entries to display at the upper left size of the table.
			By combining these buttons, you can effectively select large number of traits.
			<br/><br/>
			<img src="{!! URL::asset('/image/faq6.png') !!}" style="width:80%;float:left;"/>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>How can I create genetic correlation heatmap for a list of traits. <a href="#faq7" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq7">
			In the "Multi GWAS comparison" page, select GWAS that you want to compare and press "Compare selected GWAS" button.
			This will create multiple plots including genetic correlation heatmap.
			GWAS can be sorted by alphabetically, trait domain or hierarchical clustering.
			The plot can be downloaded as a image and data can be downloaded in json format.
			The downloaded json file can be used to customise the plot with j3.ds script available at
			<a target="_blank" href="https://github.com/Kyoko-wtnb/GWASatlas-plots">https://github.com/Kyoko-wtnb/GWASatlas-plots</a>.
			<br/><br/>
			<img src="{!! URL::asset('/image/faq7.png') !!}" style="width:80%;float:left;"/>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>Genetic correlation heatmap is missing some of the selected GWAS. <a href="#faq8" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq8">
			Genetic correlation was estimated only for traits that meet several criteria.
			See documentation <a href="{{ Config::get('app.subdir') }}/documentation#5">5. Estimation of SNP heritability and genetic correlatoin</a> for details.
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>Why isn't the genetic correlation heatmap displayed? <a href="#faq9" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq9">
			Since it reduce the interface performance to display large heatmap, when there are more than 100 GWAS,
			the website does not display the heatmap.
			However, you can download the data in json format and create heatmap on your local computer with d3.js script available at
			<a target="_blank" href="https://github.com/Kyoko-wtnb/GWASatlas-plots">https://github.com/Kyoko-wtnb/GWASatlas-plots</a>.
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>How can I see overlapping risk loci across mutliple traits? <a href="#faq10" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq10">
			At the second last box on the "Multiple GWAS Comparison" page, there is a manhattan like plot for pleiotropic risk loci.
			Each data point represent a group of physically overlapping risk loci.
			See documentation <a href="{{ Config::get('app.subdir') }}/documentation#7">7. Multi GWAS comparison</a> for details.
			Y-axis is the number of associated domains by default which can be changed to the number or associated GWAS
			(the bottom plot uses number of associated GWAS for Y-axis).
			As a measure of pleiotropy, we recommend to use the number of associated domains when you have multiple traits from multiple
			domains since traits within a domain tend to have higher phenotypic correlation.
			When you are comparing traits within one or a few domains, or you don't suspect high phenotypic correlation between selected traits within a domain,
			the number of associated GWAS might be better measurement for pleiotropy.
			Note that the number of associated GWAS is the number of unique summary statistics.
			Therefore, this does not necessary represent the number of unique trait when multiple summary statistics for a single trait are selected.
			<br/>
			By clicking one of the risk loci groups, you can visualise overlapping risk loci at the bottom of the manhattan plot.
			<br/><br/>
			<img src="{!! URL::asset('/image/faq10.png') !!}" style="width:80%;float:left;"/>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>I want to compare significant genes across multiple traits. <a href="#faq11" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq11">
			There are two types of comparison for significant genes based on MAGMA gene analyses.
			First comparison is to compare how many significant genes are shared between GWAS.
			The heatmap shows the proportion of shared significant genes and the number of significant genes at the right side.
			Note that the heatmap is asymmetric.
			GWAS can be sorted by alphabetically, trait domain or hierarchical clustering.
			The plot can be downloaded as a image and data can be downloaded in json format.
			The downloaded json file can be used to customise the plot with j3.ds script available at
			<a target="_blank" href="https://github.com/Kyoko-wtnb/GWASatlas-plots">https://github.com/Kyoko-wtnb/GWASatlas-plots</a>.
			<br/>
			Second comparison is to compare the number of associated GWAS per gene.
			At the bottom of "Multiple GWAS Comparison" page, there is a manhattan like plot for pleiotropic genes.
			Y-axis is the number of associated domains by default which can be changed to the number or associated GWAS
			(the bottom plot uses number of associated GWAS for Y-axis).
			As a measure of pleiotropy, we recommend to use the number of associated domains when you have multiple traits from multiple
			domains since traits within a domain tend to have higher phenotypic correlation.
			When you are comparing traits within one or a few domains, or you don't suspect high phenotypic correlation between selected traits within a domain,
			the number of associated GWAS might be better measurement for pleiotropy.
			Note that the number of associated GWAS is the number of unique summary statistics.
			Therefore, this does not necessary represent the number of unique trait when multiple summary statistics for a single trait are selected.
			<br/>
			By clicking one of the genes, you can display PheWAS plot for the selected GWAS.
			<br/><br/>
			<img src="{!! URL::asset('/image/faq11_1.png') !!}" style="width:70%;float:left;"/>
			<br/>
			<img src="{!! URL::asset('/image/faq11_2.png') !!}" style="width:70%;float:left;"/>
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>PheWAS plot does not find my gene or SNP. <a href="#faq12" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq12">
			By default, only GWAS with P-value < 0.05 are displayed.
			You can first try changing the P-value.
			Note that for SNPs, P-value 0.05 is the maximum threshold.
			It is also possible that the selected gene or SNP is not tested in the selected GWAS.
			When you are searching by gene name, please also try different alias of the gene if there is any.
		</div>
	</div>
	<div class="panel panel-default">
		<div class="panel-heading faq" style="padding-top:5px;padding-bottom:5px;">
			<h4>Number of traits in PheWAS plot are less then what I selected. <a href="#faq13" data-toggle="collapse" style="float: right; padding-right:20px;"><i class="fa fa-chevron-down"></i></a></h4>
		</div>
		<div class="panel-body collapse" id="faq13">
			The PheWAS plot only displays GWAS with P-value < 0.05 by default.
			Some of the missing GWAS might have P-value &ge; 0.05.
			It is also possible that the selected gene or SNP is not tested in the selected GWAS.
		</div>
	</div>
</div>
@stop
