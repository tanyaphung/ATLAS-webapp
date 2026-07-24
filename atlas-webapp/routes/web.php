<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PheWASController;
use App\Http\Controllers\MultiController;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\DBController;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::group(['middleware'=>'web'], function(){
	Route::get('/', function(){
	    return view('pages.home');
	});

	Route::post('/home/dbSum', [StatsController::class, 'dbSum']);

	Route::post('/home/release', [BaseController::class, 'release']);

	Route::get('/home/getAckn', [BaseController::class, 'getAckn']);

	Route::get('/howto', function(){
	  return view('pages.howto');
	});

	// ************** Trait DB Page ***************
	Route::get('/traitDB', function(){
	  return view('pages.traitDB');
	});

	Route::post('/traitDB/SelectOption', [DBController::class, 'SelectOption']);

	Route::post('/traitDB/dbTable', [DBController::class, 'dbTable']);

	// ************** Trait DB View Page ***************
	Route::get('/traitDB/{id}', function($id){
	  return view('pages.traitView') -> with(["id"=>$id]);
	});

	Route::post('/traitDB/getData', [DBController::class, 'getData']);

	Route::post('/traitDB/topSNPs', [BaseController::class, 'DTfile']);

	Route::post('/traitDB/DTfile', [DBController::class, 'DTfile']);

	Route::get('/traitDB/manhattan/{id}/{file}', [DBController::class, 'manhattan']);

	Route::get('/traitDB/QQplot/{id}/{type}', [DBController::class, 'QQplot']);

	Route::get('/traitDB/GCplot/{id}/{n}', [DBController::class, 'GCplot']);

	Route::post('/traitDB/getGCdata', [DBController::class, 'getGCdata']);

	Route::post('/traitDB/getGClist', [DBController::class, 'getGClist']);

	Route::post('/traitDB/imgdown', [DBController::class, 'imgdown']);

	Route::post('/traitDB/imgdown2', [DBController::class, 'imgdown2']);

	// ************** Download sumstats ***************
	Route::get('/ukb2_sumstats/{file}', [BaseController::class, 'sumstats']);

	// ************** Multi GWAS Comparison page ***************
	Route::get('/multiGWAS', function(){
	  return view('pages.multiGWAS');
	});

	Route::post('/multiGWAS/getSummary', [MultiController::class, 'getSummary']);

	Route::post('/multiGWAS/getGC', [MultiController::class, 'getGC']);

	Route::post('/multiGWAS/getGenes', [MultiController::class, 'getGenes']);

	Route::post('/multiGWAS/getLociOverlap', [MultiController::class, 'getLociOverlap']);

	Route::post('/multiGWAS/getGenesPleiotropy', [MultiController::class, 'getGenesPleiotropy']);

	Route::post('/multiGWAS/imgdown', [MultiController::class, 'imgdown']);

	Route::post('/multiGWAS/getPheData', [PheWASController::class, 'getData']);

	// ************** Multi GWAS Comparison page ***************
	Route::get('/PheWAS', function(){
	  return view('pages.PheWAS');
	});

	Route::post('/PheWAS/getData', [PheWASController::class, 'getData']);

	Route::post('/PheWAS/imgdown', [PheWASController::class, 'imgdown']);

	Route::get('/faq', function(){
	  return view('pages.faq');
	});

	// ************** Report GWAS Page ***************
	Route::get('/report', function(){
	  return view('pages.report');
	});

	Route::post('/report/submit', [ReportController::class, 'submit']);

	Route::get('/report/getTable', [ReportController::class, 'getTable']);

	// ************** Stats Page ***************
	Route::get('/stats', function(){
	  return view('pages.stats');
	});

	Route::post('/stats/dbSum', [StatsController::class, 'dbSum']);

	Route::get('/stats/yearSumPlot', [StatsController::class, 'yearSumPlot']);

	Route::get('/stats/domainSumPlot', [StatsController::class, 'domainSumPlot']);

	Route::get('/stats/DomainPie', [StatsController::class, 'DomainPie']);

	Route::get('/stats/ChapterPie/{domain}', [StatsController::class, 'ChapterPie']);

	Route::get('/stats/SubchapterPie/{domain}/{chapter}', [StatsController::class, 'SubchapterPie']);

	Route::get('/stats/NsampleYear', [StatsController::class, 'NsampleYear']);

	Route::get('/stats/NsampleDomain', [StatsController::class, 'NsampleDomain']);

	Route::get('/documentation', function(){
	  return view('pages.documentation');
	});
});
