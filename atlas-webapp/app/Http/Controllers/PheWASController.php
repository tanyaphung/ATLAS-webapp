<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PheWASController extends Controller
{
    public function getData(Request $request){
		$text = $request->input('text');
		$ids = $request->input('ids');
		$maxP = $request->input('maxP');
		if($ids==""){$ids="NA";}
		if($maxP==""){$maxP="1";}

		$host = config('database.connections.mysql.host');
		$user = config('database.connections.mysql.username');
		$pass = config('database.connections.mysql.password');
		$db = config('database.connections.mysql.database');

		$datadir = config('app.datadir');
		$script = storage_path().'/scripts/getPheWASdata.py';
		$json = shell_exec("python $script $host $user $pass $db $text $ids $maxP $datadir");

		return $json;
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
