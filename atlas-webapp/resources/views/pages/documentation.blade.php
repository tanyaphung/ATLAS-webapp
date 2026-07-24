@extends('layouts.master')
@section('head')
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
@stop

@section('content')
<div style="padding:40px;">
	<h2 id="top">Documentation</h2>
	<p><h3><strong>Contents</strong></h3>
		<div style="padding-left:20px;">
			<a href="#1">1. An atlas of GWAS summary statistics</a><br/>
			<a href="#2">2. Curated publicly available GWAS summary statistics</a><br/>
			<div style="padding-left:20px;">
				2.1. Conditions to be included in the database<br/>
				2.2. UK Biobank traits<br/>
				2.3. Pre-process of GWAS summary statistics<br/>
			</div>
			<a href="#3">3. Database features (GWAS information)</a><br/>
			<a href="#4">4. Definition of lead SNPs and risk loci</a><br/>
			<div style="padding-left:20px;">
				4.1. Lead SNPs<br/>
				4.2. Risk loci<br/>
				4.3. Reference panel<br/>
			</div>
			<a href="#5">5. Estimation of SNP heritability and genetic correlation with LD score regression</a><br/>
			<div style="padding-left:20px;">
				5.1. LD score regression (LDSC)<br/>
				5.2. SNP heritability estimation<br/>
				5.3. Genetic correlation<br/>
			</div>
			<a href="#6">6. MAGMA analyses</a><br/>
			<div style="padding-left:20px;">
				6.1. MAGMA gene analysis<br/>
				6.2. MAGMA gene-set analysis<br/>
			</div>
			<a href="#7">7. Multi GWAS comparison and pleiotropy</a><br/>
			<div style="padding-left:20px;">
				7.1. Scatter plots and regression lines<br/>
				7.2. Genetic correlation heatmap<br/>
				7.3. MAGMA gene overlap<br/>
				7.4. Pleiotropic risk loci<br/>
				7.5. Pleiotropic genes</br>
			</div>
			<a href="#8">8. PheWAS plot</a><br/>
			<a href="#9">9. Citation</a><br/>
			<a href="#10">10. References</a><br/>
			<a href="#11">11. URLs</a><br/>
		</div>
	</p>
	<p>
		<h3 id="1"><strong>1. An atlas of GWAS summary statistics</strong></h3>
		<div style="padding-left:20px;">
			This website is a comprehensive database of publicly available GWAS summary statistics.
			This is not only the central hub of summary statistics but we also aimed to
			provide insight into human complex traits.
			In this website, users are able to not only access to the original summary
			statistics but also obtain a variety of results from pre-performed analyses
			such as risk loci information, LD score regression [1], MAGMA [2] and multi GWAS comparison.
			To obtain global view of genetic architecture, we performed several analyses for
			selected 501 traits which are available in our paper [4].
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="2"><strong>2. Curated publicly available GWAS</strong></h3>
		<div style="padding-left:20px;">
			<h4>2.1. Conditions to be included in the database</h4>
			Publicly available GWAS summary statistics which include full list of tested SNPs
			are included in the database regardless of the cohort population or sample size.
			Publicly available means that full summary statistics are available without applying for
			access with review, but the online submission of use information, such as
			email and names, is considered as "publicly available".
			We excluded GWAS based on whole exome sequencing, immune-chip sequencing and
			GWAS of replication cohorts.
			When there are several version of GWAS summary statistics from the same study
			for the same traits, e.g. sex specific and pooled sex GWAS or adjusted for additional covariates,
			we included all of summary statistics as long as the sample size and population
			are explicitly mentioned in the original study.
			Details are described in the online Methods of [4].
			<h4>2.2. UK Biobank traits</h4>
			We performed GWAS of 600 traits from UK Biobank release 2 [5] under application ID 1640.
			We selected traits with at least 50,000 individuals with non-missing phenotypes and
			both cases and controls are at least 10,000 for binary traits.
			Only phenotype of first visit and first run (f.xxx.0.0) was used with some exceptions
			(please refer Supplementary Text and Supplementary Table 1-2 of [4] for details).
			GWAS was performed using PLINK v2.0 with either linear or logistic model by correcting for
			age, sex, 20 PCs (re-computed for EUR subjects only, not the PCs provided by UKB),
			array, assessment center and Townsend deprivation index.
			<br/><br/>
			<strong>Columns of the summary statistics</strong><br/>
			<div style="padding-left:20px">
				SNP: unique ID of the SNP consists of chromosome, position and alphabetically ordered alleles<br/>
				CHR: chromosome<br/>
				BP: base pair position on GRCh37<br/>
				A1: effect allele<br/>
				TEST: Type of test (ADD for all files)<br/>
				NMISS: Number of non-missing genotypes<br/>
				BETA/OR: Regression coefficient or odds ratio<br/>
				SE: Standard error (for OR, in logOR scale) <br/>
				L95: Lower bound on confidence interval for CMH odds ratio<br/>
				U95: Upper bound on confidence interval for CMH odds ratio<br/>
				STAT: Coefficient t-statistics<br/>
				P: P-value<br/>
				A2: non effect allele<br/>
				MAF: Minor allele frequency<br/>
				NCHROBS: Number of allele observation<br/>
				SNPID_UKB: rsID provided by UK Biobank<br/>
				A1_UKB: A1 allele in UK Biobank<br/>
				A2_UKB: A2 allele in UK Biobank<br/>
				INFO_UKB: Info score provided by UK Biobank<br/>
				MAF_UKB: MAF of entire UK Boiobank samples<br/>
			</div>
			<h4>2.3. Pre-process of GWAS summary statistics</h4>
			Curated summary statistics on the database was pre-processed to standardise the format.
			SNPs with P-value <=0 or >1, or non-numeric value such as “NA” were excluded.
			For summary statistics with non-hg19 genome coordinate, liftOver software was used
			to align to hg19.
			When only rsID is available in the summary statistics file without chromosome and
			position, genome coordinates were extracted from dbSNP 146.
			When rsID is missing, it is assigned based on dbSNP 146.
			When only effect allele is reported, another allele was extracted from dbSNP 146.
			<br/>
			<span class="info"><i class="fa fa-info"></i>
				We do not distribute pre-processed GWAS summary statistics to not induce confusion
				due to duplicated information in public domain.
				These pre-processed summary statistics were used for all the analyses available
				on this website and can be sued as input of FUMA (server side translation).
			</span>
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="3"><strong>3. Database features (GWAS information)</strong></h3>
		<div style="padding-left:20px;">
			<table class="table table-condensed table-bordered" style="width:80%;">
				<thead>
					<th>Feature</th>
					<th>Description</th>
				</thead>
				<tbody>
					<tr>
						<td>id</td>
						<td>Unique ID in the database (arbitrary order).</td>
					</tr>
					<tr>
						<td>PMID</td>
						<td>Pubmed ID of the original study. If the study is not published,
							mentioned in this feature or dio of bioRxiv is provided.
						</td>
					</tr>
					<tr>
						<td>Year</td>
						<td>The year of the original study is published.
							If the study is not published, the year
							of the data was distributed.
						</td>
					</tr>
					<tr>
						<td>File</td>
						<td>Link to the original summary statistics.
							When submission of online form is required, the link is to the online form.
							Otherwise, directly linked to the downloadable file.
						</td>
					</tr>
					<tr>
						<td>Website</td>
						<td>Link to the website if available (not the direct link to the summary statistics file).</td>
					</tr>
					<tr>
						<td>Consortium</td>
						<td>The name of consortium if available.</td>
					</tr>
					<tr>
						<td>Domain</td>
						<td>General domain of the trait.</td>
					</tr>
					<tr>
						<td>ChapterLevel</td>
						<td>Chapter of the trait obtained from either ICD10 or ICF10.</td>
					</tr>
					<tr>
						<td>SubchapterLevel</td>
						<td>Subchapter of the trait obtained from either ICD10 or ICF10.</td>
					</tr>
					<tr>
						<td>Trait</td>
						<td>The trait name used in the original study (or as close as possible).</td>
					</tr>
					<tr>
						<td>uniqTrait</td>
						<td>The trait name harmonised across database.
							This matches traits with slightly different name in the "Trait" feature, but
							does not mean that phenotype definition is exactly the same.
							Please refer the original study for detailed phenotype definition.
						</td>
					</tr>
					<tr>
						<td>Population</td>
						<td>
							One of the five super ancestry populations defined in
							1000 genome project, AFR (African), AMR (American), EAS (East asian),
							EUR (European), and SAS (South asian).
							If the GWAS is trans ethnic study, all of the population is listed but the
							first one has the highest proportion of the total sample size of the study.
							For example, EUR+EAS+SAS means the study cohorts are mix of three populations,
							but EUR samples occupy the highest proportion of the total sample size
							(does not have to be majority).
							For UK Biobank cohort, it is "UKB1 (EUR)" for release 1 and "UKB2 (EUR)" for release 2.
						</td>
					</tr>
					<tr>
						<td>Ncase</td>
						<td>For binary trait, the number of cases.</td>
					</tr>
					<tr>
						<td>Ncontrol</td>
						<td>For binary trait, the number of controls.</td>
					</tr>
					<tr>
						<td>N</td>
						<td>Total number of sample size used for the analyses.
							This number is the total sample size used to generate the summary statistics which is publicly available.
							In some meta-analysis studies, some cohorts are restricted to distribute summary statistics.
							In that case, publicly available summary statistics dose not include specific cohorts
							and the sample size in this database corresponds to the sample size excluding those cohorts.
						</td>
					</tr>
					<tr>
						<td>Nsnps</td>
						<td>The number of SNPs in the original GWAS summary statistics.</td>
					</tr>
					<tr>
						<td>Nhits</td>
						<td>The number of risk loci.
							The definition of risk loci is described in the next section, <a href="#4">4. Definition of lead SNPs and risk loci</a>.
						</td>
					</tr>
					<tr>
						<td>SNPh2</td>
						<td>SNP heritability estimated by LD score regression [1].
							This is only available for GWAS that meet certain criteria, otherwise blank.
							See section <a href="#5">5. Estimation of SNP heritability and genetic correlation with LD score regression</a> for details.
						</td>
					</tr>
					<tr>
						<td>SNPh2_se</td>
						<td>If SNP h2 is available, standard error of SNP h2.</td>
					</tr>
					<tr>
						<td>SNPh2_z</td>
						<td>If SNP h2 is available, Z statistics of SNP h2.</td>
					</tr>
					<tr>
						<td>LambdaGC</td>
						<td>If SNP h2 is available, estimated Lambda GC.</td>
					</tr>
					<tr>
						<td>Chi2</td>
						<td>If SNP h2 is available, estimated chi square.</td>
					</tr>
					<tr>
						<td>Intercept</td>
						<td>If SNP h2 is available, estimated single trait intercept.</td>
					</tr>
					<tr>
						<td>Note</td>
						<td>Any information that is relevant, extracted from the original study.</td>
					</tr>
				</tbody>
			</table>
			<br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="4"><strong>4. Definition of lead SNPs and risk loci</strong></h3>
		<div style="padding-left:20px;">
			<h4>4.1. Lead SNPs</h4>
			As described previously [3], lead SNPs are defined by double clumping.
			The first clumping is a clumping of SNPs with P-value < 0.05 at genome wide significant (P-value < 5e-8)
			and independent at r<sup>2</sup> < 0.6 which defines independent significant SNPs.
			The second clumping is a clumping of significant independent SNPs at r<sup>2</sup> < 0.1
			which defines lead SNPs.
			<h4>4.2. Risk loci</h4>
			Each of the independent significant SNPs have it's own LD block defined by the SNPs (P-value < 0.05)
			that are in LD with the independent significant SNP (r<sup>2</sup> &ge; 0.6).
			To define genomic risk loci as a region, first LD blocks of independent significant SNPs
			belongs to the same lead SNPs are merged. Then LD blocks which are physically overlapping or
			distance is 250Kb are merged.
			Each risk locus is represented by one of the lead SNPs with the minimum
			P-value within the locus.
			Therefore, a risk locus can contain multiple independent significant SNPs and lead SNPs.
			<h4>4.3. Reference panel</h4>
			We used 1000 genome phase 3 [6] of corresponding population (AFR, AMR, EAS, EUR, SAS)
			as a reference panel to compute LD for most of the GWAS in the database.
			For trans-ethnic GWAS, the population with the most proportion of the
			total sample size was used.
			When the GWAS is based on UKB release 1 cohort, we used randomly sampled
			10,000 white British subjects from UKB release 1 as reference.
			For GWAS performed in this study or based on UKB2 cohort, we used randomly sampled
			10,000 unrelated EUR subjects as a reference.
			For meta-analyses including UKB cohort, either UKB1 or UKB2 was used as reference.
			Indels and non-bi-allelic SNPs were excluded.
			For each GWAS, the population is specified in the "Population"
			feature of the database (described in the previous section <a href="#3">3. Database features</a>).
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="5"><strong>5. Estimation of SNP heritability and genetic correlation with LD score regression</strong></h3>
		<div style="padding-left:20px;">
			<h4>5.1. LD score regression (LDSC)</h4>
			We used LD score regression [1] software with pre-computed LD scores for
			EUR and EAS populations obtained from <a target="_blank", href="https://data.broadinstitute.org/alkesgroup/LDSCORE/">https://data.broadinstitute.org/alkesgroup/LDSCORE/</a>.
			SNPs are filtered on HapMap3 SNPs and the MHC region was excluded from any of LDSC analyses.
			<h4>5.2. SNP heritability estimation</h4>
			SNP heritability was estimated for GWAS with either EUR or EAS population
			(or, EUR or EAS has the most proportion of the total sample size), total sample size > 5,000
			and the number of SNPs available in the summary statistics file is > 450,000.
			When signed effect size or odds ratio is not available in the summary statistics file,
			"--a1-inc” flag was used.
			For all GWASs fulfil above criteria, SNP heritability was computed in observed scale.
			<br/>
			For binary traits, SNPs heritability was also computed in liability scale.
			The population prevalence was curated from literatures
			(only for diseases whose prevalence was available, Supplementary Table 25 [4] or in "Note" column of this databset)
			to compute SNP heritability at liability scale with “--samp-prep” and ”--pop-prep”
			flags and specified in the "Note" feature of the database.
			For most of personality/activity (binary) traits from UKB2 cohort,
			we assumed that sample prevalence is equal to population prevalence since
			UK Biobank is not designed to study a certain disease/trait as described
			previously [7].
			Likewise, when population prevalence was not available, sample prevalence
			was used as population prevalence for all other binary traits.
			<h4>5.3. Genetic correlation</h4>
			Genetic correlation was computed only for pairwise GWAS with the following criteria
			as suggested previously [8].
			<ul>
				<li>SNP heritability was estimated</li>
				<li>GWAS of EUR population of more than 80% of samples are EUR.</li>
				<li>Effect and non-effect alleles are explicitly mentioned in the header or elsewhere</li>
				<li>SNP heritability Z-score > 2</li>
			</ul>
			<br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="6"><strong>6. MAGMA analyses</strong></h3>
		<div style="padding-left:20px;">
			For the current release, MAGMA v1.06 [2] was used.
			<h4>6.1. MAGMA gene analysis</h4>
			MAGMA gene analysis was performed using 19,436 protein coding genes
			obtained from biomaRt (primary ID is Ensembl ID v92 GRCh37) which are
			mapped to entrez ID from NCBI.
			SNPs are assigned to genes with 1kb window both side.
			Reference panel of corresponding population based on either 1000G,
			UK Biobank release 1 or release 2 was used as described in the "Population"
			feature of the section <a href="#3">3. Database features</a>.
			The default model, snp-wide (mean) was used.
			<h4>6.2. MAGMA gene-set analysis</h4>
			MAGMA gene-set analysis was performed for 4,737 curated gene set
			and 5,917 GO terms (4,436 biological processes, 580 cellular components
			and 901 molecular functions) from MsigDB v6.1 [9].
			<br>
			For the release of v20191115, gene-set analyses for all traits in the database are updated to MsigDB v7.0
			(5,500 curated gene sets, 7,350 GO biological process, 1,001 GO cellular components, 1,645 GO molecular function).
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="7"><strong>7. Multi GWAS comparison</strong></h3>
		<div style="padding-left:20px;">
			<h4>7.1. Scatterplots and regression lines</h4>
			Linear regression line, correlation coefficient and P-value (null hypothesis
			is that the slope is zero) are computed by linregress function of scipy.stats
			module in Python 2.7.
			For the plot of year vs sample size, the regression line is not displayed when
			all data points are in the same year.
			For the plot inclucde SNP heritability, data points are limited to the GWAS
			whose SNP heritability was estimated by LD score regression.
			See <a href="#5">5.2. SNP heritability estimation</a> for details.
			<h4>7.2. Genetic correlation heatmap</h4>
			The heatmap only includes GWAS which meet the criteria for analyses of genetic correlation.
			See <a href=#5>5.3. Genetic correlation</a> for details.
			The value of genetic correlation was winsolized between -1.25 and 1.25.
			The Bonferroni correction was performed based on the number of possible pair
			in the heatmap (#GWASx(#GWAS-1)x0.5).
			<h4>7.3. MAGMA gene overlap</h4>
			The heatmap only includes GWAS with at least one genome-wide significant genes based on the genes tested in all selected GWAS
			(P-value < 0.05/#tested genes).
			The cell of <i>i</i>-th column and <i>j</i>-th row represents the proportion of overlapped
			significant genes between two GWAS based on the number of significant genes in <i>i</i>-th GWAS.
			<h4>7.4. Pleiotropic risk loci</h4>
			Pre-defined risk loci for each selected GWAS are pooled and physically overlapping risk loci are grouped.
			It does not require all risk loci in a group to be overlapped.
			For example, locus A and locus B are overlapping and locus B and locus C
			are also overlapping but locus A and locus C are not, in this case, locus
			A, B and C are grouped into one.
			Therefore, it is possible that a group of risk loci contains more than one risk loci from a single trait.
			For each grouped risk loci, number of associated GWAS (summary statistics) and domains are counted.
			Note that the number of associated GWAS is the the number of associated unique summary statistics
			which does not necessary reflect the number of associated unique traits when multiple summary statistics
			were selected for a single trait.
			See <a href="#4">4. Definition of lead SNPs and risk loci</a> for definition of risk loci.
			<h4>7.5. Pleiotropic genes</h4>
			First genes which are tested in all selected GWAS are selected and considered as genome-wide significant when
			P-value < 0.05/#tested genes.
			For each gene, the number of associated GWAS (summary statistics) and domains are counted.
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="8"><strong>8. PheWAS plot</strong></h3>
		<div style="padding-left:20px;">
			PheWAS plot can be created for a SNP or gene.
			For SNP, only SNPs with P-value < 0.05 are available to keep performance.<br/>
			When rsID is provided, chromosome and position are extracted from dbSNP build 146.
			Note that alleles across GWAS are ignored which means SNPs on the same genomic coordinate
			are considered as the same SNP.
			Genes can be searched by Ensembl ID, gene symbol or NCBI entrez ID.
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="9"><strong>9. Citation</strong></h3>
		<div style="padding-left:20px;">
			When you use results from GWAS atlas website, please cite the following.<br/>
			Watanabe, K. <i>et al.</i> A global view of genetic architecture in human complex traits.
			[under preparation].<br/>
			When you use GWAS summary statistics searched from atlas database,
			please cite the original GWAS study.
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="10"><strong>10. References</strong></h3>
		<div style="padding-left:20px;">
			<ol>
				<li>Bulik-Sullivan, B.K. <i>et al.</i> LD Score refression distinguishes confounding
					from polygenicity in genome-wide association studies. <i>Nat. Genet.</i> <b>47</b>, 291-295 (2015).
					<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/25642630">PMID: 25642630</a>
				</li>
				<li>de Leeuw, C.A. <i>et al.</i> MAGMA: Generalized gene-set analysis of GWAS data.
					<i>PLoS Comput. Biol.</i> <b>11</b>, e1004219 (2015).
					<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/25885710">PMID: 25885710</a>
				</li>
				<li>Watanabe, K. <i>et al.</i> Functional mapping and annotation of genetic associations with FUMA.
					<i>Nat. Commun.</i> <b>8</b>, 1826 (2017).
					<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/29184056">PMID: 29184056</a>
				</li>
				<li>Watanabe, K. <i>et al.</i> A global overview of pleiotropy and genetic architecture in complex traits.
					<i>Nat. Genet.</i> <b>51</b>, 1339-1348 (2019).
				</li>
				<li>Bycroft, C. <i>et al.</i> Genome-wide genetic data on ~500,000 UK Biobank particiants.
					<i>bioRxiv</i> <a target="_blank" href="https://www.biorxiv.org/content/early/2017/07/20/166298">doi:https://doi.org/10.1101/166298</a> (2017).
				</li>
				<li>The 1000 Genome Project Consortium. A global reference for human genetic variation.
					<i>Nature.</i> <b>526</b>, 68-74 (2015).
					<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/26432245">PMID: 26432245</a>
				</li>
				<li>Ge, T. <i>et al.</i> Phenome-wide heritability analysis of the UK Biobank.
					<i>PLoS Genet.</i> <b>13</b>, e1006711 (2017).
					<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/28388634">PMID: 28388634</a>
				</li>
				<li>Zheng, J. <i>et al.</i> LD Hub: a centralized database and web interface to perform LD score regression that
					maximizes the potential of summary level GWAS data for SNP heritability and genetic correlation analysis.
					<i>Bioinformatics.</i> <b>33</b>, 272-279 (2017).
					<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/27663502">PMID: 27663502</a>
				</li>
				<li>Libezon, A. <i>et al.</i> Molecular signatures database (MsigDB) 3.0.
					<i>Bioinformatics.</i> <b>27</b>, 1739-40 (2011).
					<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/21546393">PMID: 21546393</a>
				</li>
			</ol>
			<br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
	<p>
		<h3 id="11"><strong>11. URLs</strong></h3>
		<div style="padding-left:20px;">
			Here we list the URLs used to curate publicly availalbe GWAS summary statistics
			and software/tools used in GWAS atlas.<br/>
			<h4>Software/tools</h4>
			LD score: <a target="_blank" href="https://github.com/bulik/ldsc">https://github.com/bulik/ldsc</a><br/>
			MAGMA: <a target="_blank" href="https://ctg.cncr.nl/software/magma">https://ctg.cncr.nl/software/magma</a><br/>
			FUMA: <a target="_blank" href="http://fuma.ctglab.nl/">http://fuma.ctglab.nl/</a><br/>
			<br/>
			<h4>GWAS resources</h4>
			<a target="_blank" href="https://www.ebi.ac.uk/gwas/downloads/summary-statistics">https://www.ebi.ac.uk/gwas/downloads/summary-statistics</a><br/>
			<a target="_blank" href="https://grasp.nhlbi.nih.gov/FullResults.aspx">https://grasp.nhlbi.nih.gov/FullResults.aspx</a><br/>
			<a target="_blank" href="http://www.type2diabetesgenetics.org/informational/data#">http://www.type2diabetesgenetics.org/informational/data#</a><br/>
			<a target="_blank" href="https://www.ncbi.nlm.nih.gov/gap">https://www.ncbi.nlm.nih.gov/gap</a><br/>
			<a target="_blank" href="ftp://twinr-ftp.kcl.ac.uk/ImmuneCellScience/2-GWASResults">ftp://twinr-ftp.kcl.ac.uk/ImmuneCellScience/2-GWASResults</a><br/>
			<a target="_blank" href="http://amdgenetics.org/">http://amdgenetics.org/</a><br/>
			<a target="_blank" href="http://archive.broadinstitute.org/ftp/pub/rheumatoid_arthritis/Stahl_etal_2010NG/">http://archive.broadinstitute.org/ftp/pub/rheumatoid_arthritis/Stahl_etal_2010NG/</a><br/>
			<a target="_blank" href="http://csg.sph.umich.edu/abecasis/public/amdgene2012/">http://csg.sph.umich.edu/abecasis/public/amdgene2012/</a><br/>
			<a target="_blank" href="http://csg.sph.umich.edu/abecasis/public/lipids2013">http://csg.sph.umich.edu/abecasis/public/lipids2013</a><br/>
			<a target="_blank" href="http://diagram-consortium.org">http://diagram-consortium.org</a><br/>
			<a target="_blank" href="http://egg-consortium.org">http://egg-consortium.org</a><br/>
			<a target="_blank" href="http://enigma.ini.usc.edu/">http://enigma.ini.usc.edu/</a><br/>
			<a target="_blank" href="http://metabolomics.helmholtz-muenchen.de">http://metabolomics.helmholtz-muenchen.de</a><br/>
			<a target="_blank" href="http://mips.helmholtz-muenchen.de/proj/GWAS/gwas/gwas_server/">http://mips.helmholtz-muenchen.de/proj/GWAS/gwas/gwas_server/</a><br/>
			<a target="_blank" href="http://research-pub.gene.com/bronson_et_al_2016/">http://research-pub.gene.com/bronson_et_al_2016/</a><br/>
			<a target="_blank" href="http://ssgac.org">http://ssgac.org</a><br/>
			<a target="_blank" href="http://web.pasteur-lille.fr/en/recherche/u744/igap/igap_download.php">http://web.pasteur-lille.fr/en/recherche/u744/igap/igap_download.php</a><br/>
			<a target="_blank" href="http://wp.unil.ch/sgg/bayesian-lifespan-gwas/">http://wp.unil.ch/sgg/bayesian-lifespan-gwas/</a><br/>
			<a target="_blank" href="http://www.broadinstitute.org/collaboration/giant">http://www.broadinstitute.org/collaboration/giant</a><br/>
			<a target="_blank" href="http://www.cardiogramplusc4d.org">http://www.cardiogramplusc4d.org</a><br/>
			<a target="_blank" href="http://www.ccace.ed.ac.uk/node/335">http://www.ccace.ed.ac.uk/node/335</a><br/>
			<a target="_blank" href="http://www.computationalmedicine.fi">http://www.computationalmedicine.fi</a><br/>
			<a target="_blank" href="http://www.gefos.org">http://www.gefos.org</a><br/>
			<a target="_blank" href="http://www.ilae.org/Commission/genetics/consortium.cfm">http://www.ilae.org/Commission/genetics/consortium.cfm</a><br/>
			<a target="_blank" href="http://www.ipscsg.org/">http://www.ipscsg.org/</a><br/>
			<a target="_blank" href="http://www.mcgill.ca/genepi/adipogen-consortium">http://www.mcgill.ca/genepi/adipogen-consortium</a><br/>
			<a target="_blank" href="http://www.med.unc.edu/pgc/">http://www.med.unc.edu/pgc/</a><br/>
			<a target="_blank" href="http://www.reprogen.org">http://www.reprogen.org</a><br/>
			<a target="_blank" href="http://www.t2diabetesgenes.org/data/">http://www.t2diabetesgenes.org/data/</a><br/>
			<a target="_blank" href="http://www.thessgac.org/data">http://www.thessgac.org/data</a><br/>
			<a target="_blank" href="http://www.tweelingenregister.org/EAGLE/">http://www.tweelingenregister.org/EAGLE/</a><br/>
			<a target="_blank" href="http://www.tweelingenregister.org/GPC">http://www.tweelingenregister.org/GPC</a><br/>
			<a target="_blank" href="http://www.urr.cat/">http://www.urr.cat/</a><br/>
			<a target="_blank" href="https://ctg.cncr.nl/software/summary_statistics">https://ctg.cncr.nl/software/summary_statistics</a><br/>
			<a target="_blank" href="https://data.bris.ac.uk/data/dataset/28uchsdpmub118uex26ylacqm">https://data.bris.ac.uk/data/dataset/28uchsdpmub118uex26ylacqm</a><br/>
			<a target="_blank" href="https://sleepgenetics.org/downloads/">https://sleepgenetics.org/downloads/</a><br/>
			<a target="_blank" href="https://walker05.u.hpc.mssm.edu/">https://walker05.u.hpc.mssm.edu/</a><br/>
			<a target="_blank" href="https://www.cng.fr/gabriel/index.html">https://www.cng.fr/gabriel/index.html</a><br/>
			<a target="_blank" href="https://www.ibdgenetics.org">https://www.ibdgenetics.org</a><br/>
			<a target="_blank" href="https://www.magicinvestigators.org/">https://www.magicinvestigators.org/</a><br/>
			<a target="_blank" href="https://www.nhlbi.nih.gov/research/intramural/researchers/ckdgen">https://www.nhlbi.nih.gov/research/intramural/researchers/ckdgen</a><br/>
			<a target="_blank" href="https://www.broadinstitute.org/diabetes">https://www.broadinstitute.org/diabetes</a><br/>
			<br/><br/>[<a href="#top">Go to top</a>]<br/>
		</div>
	</p>
</div>
@stop
