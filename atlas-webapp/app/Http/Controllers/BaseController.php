<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class BaseController extends Controller
{
	public function sumstats($file){
		return response() -> download($this->safePath(config('app.sumstatsdir'), $file));
	}

	public function DTfile(Request $request){
		$id = $request -> input('id');
		$fin = $request -> input('infile');
		$cols = $request -> input('header');
		$cols = explode(":", $cols);
		$f = $this->safePath($this->gwasDir($id), $fin);
		if(file_exists($f)){
			$file = fopen($f, 'r');
			$all_rows = array();
			$head = fgetcsv($file, 0, "\t");
			$index = array();
			foreach($cols as $c){
				if(in_array($c, $head)){
					$index[] = array_search($c, $head);
				}else{
					$index[] = -1;
				}
			}
			while($row = fgetcsv($file, 0, "\t")){
				$temp = [];
				foreach($index as $i){
					if($i==-1){
						$temp[] = "NA";
					}else{
						$temp[] = $row[$i];
					}
				}
				$all_rows[] = $temp;
			}
			$json = (array('data'=> $all_rows));

			echo json_encode($json);
		}else{
			echo '{"data":[]}';
		}
    }

	public function release(Request $request){
		$file = $request -> input('file');
		return response() -> download($this->safePath(config('app.releasedir'), $file));
	}

	public function getAckn(){
		$out = [];
		$rows = DB::select('SELECT name, affiliation, count(*) as count FROM reportedGWAS WHERE anonymous=0 GROUP BY name, affiliation ORDER BY count DESC');
		// name and affiliation come from the public report form and the home
		// page inserts this string as HTML, so escape them
		foreach($rows as $r){
			$n = e($r->name);
			$a = e($r->affiliation);
			$c = $r->count;
			if($a=="NA"){
				$out[] = $n." [".$c."]";
			}else{
				$out[] = $n." (".$a.") [".$c."]";
			}
		}
		$anony = collect(DB::select('SELECT name FROM reportedGWAS WHERE anonymous=1'))->count();
		if($anony>0){
			$out[] = "Anonymous [".$anony."]";
		}
		if(count($out)>0){
			return implode(", ", $out);
		}else{
			return "No contribution has been made.";
		}
	}
}
