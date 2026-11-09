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

class PheWASController extends Controller
{
    public function getData(Request $request){
		$text = trim((string) $request->input('text'));
		$ids = $request->input('ids');
		$maxP = $request->input('maxP');
		if($ids==""){$ids="NA";}
		else{$this->validIds($ids);}
		if($maxP==""){$maxP="1";}

		// text is an rsID, chr:pos, or a gene symbol / Ensembl ID
		if(!preg_match('/^[A-Za-z0-9._:-]{1,50}$/', $text)){abort(422, 'Invalid query');}
		if(!is_numeric($maxP)){abort(422, 'Invalid maxP');}

		return $this->runScript('getPheWASdata.py', [$text, $ids, $maxP, config('app.datadir')]);
	}

	public function imgdown(Request $request){
		$t = time();
		$svg = $request->input('data');
		$type = $request->input('type');
		$fileName = $request->input('fileName');
		$filedir = config('app.datadir').'/tmp_plot/'.$t.'/';
		File::makeDirectory($filedir, $mode = 0755, $recursive = true);
		$svgfile = $filedir.'temp.svg';
		$outfile = $filedir.$fileName.'_'.date('Ymd_His', $t).'.'.$type;

		$svg = preg_replace("/\),rotate/", ")rotate", $svg);
		$svg = preg_replace("/,skewX\(.+?\)/", "", $svg);
		$svg = preg_replace("/,scale\(.+?\)/", "", $svg);
		if($type=="svg"){
			file_put_contents($svgfile, $svg);
			File::move($svgfile, $outfile);
		}else{
			$image = new \Imagick();
			$image->setResolution(300,300);
			$image->readImageBlob('<?xml version="1.0"?>'.$svg);
			$image->setImageFormat($type);
			$image->writeImage($outfile);
			return response() -> download($outfile);
		}
		return response() -> download($outfile);
    }
}
