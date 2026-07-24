<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ReportController extends Controller
{
    public function submit(Request $request){
		$date = date('Y-m-d');
		$name = $request->input('name');
		$email = $request->input('email');
		$affi = $request->input('affi');
		$anony = $request->input('anony');
		$pheno = $request->input('pheno');
		$sumstats = $request->input('sumstats');
		$pub = $request->input('pub');
		$year = $request->input('year');
		$comment = $request->input('comment');

		if(strlen($name)==0){$name='NA';}
		if(strlen($email)==0){$email='NA';}
		if(strlen($affi)==0){$affi='NA';}

		DB::table('reportedGWAS')->insert(
			['name'=>$name, 'email'=>$email, 'affiliation'=>$affi,
			'anonymous'=>$anony, 'phenotype'=>$pheno, 'sumstats_link'=>$sumstats,
			'publication'=>$pub, 'year'=>$year, 'comment'=>$comment,
			'status'=>'Submitted', 'date_submit'=>$date, 'date_last_update'=>$date]
		);
		return;
	}

	public function getTable(){
		$result = DB::select('SELECT id, phenotype, sumstats_link, publication, year, status, note, date_submit, date_last_update FROM reportedGWAS');
		return array("data"=>$result);
	}
}
