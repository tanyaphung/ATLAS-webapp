<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;

class MultiController extends Controller
{
	public function getSummary(Request $request){
		$ids = $request->input('ids');
		$ids = explode(":", $ids);

		$tmp = DB::select('
    SELECT
        id,
        PMID,
        Year,
        Domain,
        Trait,
        N,
        Nhits,
        SNPh2,
        SNPh2_z
    FROM gwasDB
');
		$tmp = json_decode(json_encode($tmp), true);
		$dbData = [];
		foreach($tmp as $r){
			if(in_array($r['id'], $ids)){
				$dbData[] = $r;
			}
		}
		unset($tmp);

		// summary of selected GWAS
		$sum = [];
		$sum['GWAS'] = count($ids);
		$sum['Trait'] = count(array_unique(preg_replace("/(.+) \(.+\)/", "$1", array_column($dbData, 'Trait'))));
		$sum['Domain'] = count(array_unique(array_column($dbData, 'Domain')));
		$sum['Study'] = count(array_unique(array_column($dbData, 'PMID')));
		$sum['maxN'] = max(array_column($dbData, 'N'));
		$sum['minN'] = min(array_column($dbData, 'N'));
		$sum['avgN'] = round(array_sum(array_column($dbData, 'N'))/count($dbData), 2);

		// h2 and riskloci
		$plotData = [];
		$tmpdata = [];
		foreach($dbData as $r){
			$plotData[] = [$r['id'], $r['Year'], $r['Domain'], $r['Trait'], $r['N']/1000, $r['Nhits'], $r['SNPh2'], $r['SNPh2_z']];
			$tmpdata[] = [$r['id'], $r['Year'], $r['N']/1000, $r['Nhits'], $r['SNPh2'], $r['SNPh2_z']];
		}

		$plotCor = $this->runScript('getPlotCor.py', [json_encode(['data'=>$tmpdata])]);
		if($plotCor == ""){$plotCor = [];}
		else{$plotCor = json_decode($plotCor);}

		$out = ["sum"=>$sum, "plotData"=>['data'=>$plotData, 'cor'=>$plotCor]];
		return json_encode($out);
	}

	public function getGC(Request $request){
		$ids = $this->validIds($request->input('ids'));
		return $this->runScript('getGCheat.py', [$ids]);
	}

	public function getGenes(Request $request){
		$ids = $this->validIds($request->input('ids'));
		return $this->runScript('getGeneheat.py', [$ids, '2.5e-6']);
	}

	public function getLociOverlap(Request $request){
		$ids = $this->validIds($request->input('ids'));
		return $this->runScript('getLociOverlap.py', [$ids]);
	}

	public function getGenesPleiotropy(Request $request){
		$ids = $this->validIds($request->input('ids'));
		return $this->runScript('getGenesPleiotropy.py', [$ids]);
	}

	public function imgdown(Request $request){
		return $this->plotDownload($request, date('Ymd_His'));
	}
}
