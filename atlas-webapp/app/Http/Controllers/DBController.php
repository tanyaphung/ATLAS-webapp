<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;

class DBController extends Controller
{
	public function SelectOption(Request $request){
		$type = $request -> input('type');
		$domain = $request -> input('domain');
		$chapter = $request -> input('chapter');
		$subchapter = $request -> input('subchapter');

		if(strcmp($type, 'Domain')==0){
			if(strcmp($domain, "null")==0){
				$Domain = [];
				$Trait = [];
				$results = DB::select('SELECT Domain, uniqTrait FROM gwasDB');
				foreach($results as $row){
					$d = $row->Domain;
					$t = $row->uniqTrait;
					if(array_key_exists($d, $Domain)){
						$Domain[$d] += 1;
					}else{
						$Domain[$d] = 1;
					}
					if(array_key_exists($t, $Trait)){
						$Trait[$t] += 1;
					}else{
						$Trait[$t] = 1;
					}
				}
				ksort($Domain);
				ksort($Trait);
				$json = array("Domain" => $Domain, "Chapter"=>[], "Subchapter"=>[], "Trait"=>$Trait);
				echo json_encode($json);
			}else{
				$results = DB::select('SELECT ChapterLevel,SubchapterLevel,uniqTrait FROM gwasDB WHERE Domain=?', [$domain]);
				$Chapter = [];
				$Subchapter = [];
				$Trait = [];
				foreach($results as $row){
					$c = $row->ChapterLevel;
					$s = $row->SubchapterLevel;
					$t = $row->uniqTrait;
					if(array_key_exists($c, $Chapter)){
						$Chapter[$c] += 1;
					}else{
						$Chapter[$c] = 1;
					}
					if(array_key_exists($s, $Subchapter)){
						$Subchapter[$s] += 1;
					}else{
						$Subchapter[$s] = 1;
					}
					if(array_key_exists($t, $Trait)){
						$Trait[$t] += 1;
					}else{
						$Trait[$t] = 1;
					}
				}
				ksort($Chapter);
				ksort($Subchapter);
				ksort($Trait);
				$json = array("Chapter"=>$Chapter, "Subchapter"=>$Subchapter, "Trait"=>$Trait);
				echo json_encode($json);
			}
		}else if(strcmp($type, 'Chapter')==0){
			if(strcmp($chapter, "null")==0){
				$results = DB::select('SELECT ChapterLevel,SubchapterLevel,uniqTrait FROM gwasDB WHERE Domain=?', [$domain]);
				$Chapter = [];
				$Subchapter = [];
				$Trait = [];
				foreach($results as $row){
					$c = $row->ChapterLevel;
					$s = $row->SubchapterLevel;
					$t = $row->uniqTrait;
					if(array_key_exists($c, $Chapter)){
						$Chapter[$c] += 1;
					}else{
						$Chapter[$c] = 1;
					}
					if(array_key_exists($s, $Subchapter)){
						$Subchapter[$s] += 1;
					}else{
						$Subchapter[$s] = 1;
					}
					if(array_key_exists($t, $Trait)){
						$Trait[$t] += 1;
					}else{
						$Trait[$t] = 1;
					}
				}
				ksort($Chapter);
				ksort($Subchapter);
				ksort($Trait);
				$json = array("Chapter"=>$Chapter, "Subchapter"=>$Subchapter, "Trait"=>$Trait);
				echo json_encode($json);
			}else{
				$results = DB::select('SELECT SubchapterLevel,uniqTrait FROM gwasDB WHERE Domain=? AND ChapterLevel=?', [$domain, $chapter]);
				$Subchapter = [];
				$Trait = [];
				foreach($results as $row){
					$s = $row->SubchapterLevel;
					$t = $row->uniqTrait;
					if(array_key_exists($s, $Subchapter)){
						$Subchapter[$s] += 1;
					}else{
						$Subchapter[$s] = 1;
					}
					if(array_key_exists($t, $Trait)){
						$Trait[$t] += 1;
					}else{
						$Trait[$t] = 1;
					}
				}
				ksort($Subchapter);
				ksort($Trait);
				$json = array("Subchapter"=>$Subchapter, "Trait"=>$Trait);
				echo json_encode($json);
			}
		}else if(strcmp($type, 'Subchapter')==0){
			if(strcmp($chapter,"null")==0 && strcmp($subchapter,"null")==0){
				$results = DB::select('SELECT ChapterLevel,SubchapterLevel,uniqTrait FROM gwasDB WHERE Domain=?', [$domain]);
				$Chapter = [];
				$Subchapter = [];
				$Trait = [];
				foreach($results as $row){
					$c = $row->ChapterLevel;
					$s = $row->SubchapterLevel;
					$t = $row->uniqTrait;
					if(array_key_exists($c, $Chapter)){
						$Chapter[$c] += 1;
					}else{
						$Chapter[$c] = 1;
					}
					if(array_key_exists($s, $Subchapter)){
						$Subchapter[$s] += 1;
					}else{
						$Subchapter[$s] = 1;
					}
					if(array_key_exists($t, $Trait)){
						$Trait[$t] += 1;
					}else{
						$Trait[$t] = 1;
					}
				}
				ksort($Chapter);
				ksort($Subchapter);
				ksort($Trait);
				$json = array("Chapter"=>$Chapter, "Subchapter"=>$Subchapter, "Trait"=>$Trait);
				echo json_encode($json);
			}else if(strcmp($subchapter,"null")==0){
				$results = DB::select('SELECT SubchapterLevel,uniqTrait FROM gwasDB WHERE Domain=? AND ChapterLevel=?', [$domain, $chapter]);
				$Subchapter = [];
				$Trait = [];
				foreach($results as $row){
					$s = $row->SubchapterLevel;
					$t = $row->uniqTrait;
					if(array_key_exists($s, $Subchapter)){
						$Subchapter[$s] += 1;
					}else{
						$Subchapter[$s] = 1;
					}
					if(array_key_exists($t, $Trait)){
						$Trait[$t] += 1;
					}else{
						$Trait[$t] = 1;
					}
				}
				ksort($Subchapter);
				ksort($Trait);
				$json = array("Subchapter"=>$Subchapter, "Trait"=>$Trait);
				echo json_encode($json);
			}else{
				$results = DB::select('SELECT uniqTrait FROM gwasDB WHERE Domain=? AND SubchapterLevel=?', [$domain, $subchapter]);
				$Trait = [];
				foreach($results as $row){
					$t = $row->uniqTrait;
					if(array_key_exists($t, $Trait)){
						$Trait[$t] += 1;
					}else{
						$Trait[$t] = 1;
					}
				}
				ksort($Trait);
				$json = array("Trait"=>$Trait);
				echo json_encode($json);
			}
		}else{

		}

	}

	public function dbTable(Request $request){
		// $type = $request -> input('type');
		$domain = $request -> input('domain');
		$chapter = $request -> input('chapter');
		$subchapter = $request -> input('subchapter');
		$trait = $request -> input('trait');
		$yearFrom = $request -> input('yearFrom');
		$yearTo = $request -> input('yearTo');
		$nMin = $request -> input('nMin');
		$nMax = $request -> input('nMax');

		$head = ['ID','PMID','Year','Consortium','Domain','ChapterLevel','SubchapterLevel','Trait','uniqTrait','Population','Ncase','Ncontrol','N', 'SNPh2', 'File'];
		// if($domain=="null" && $chapter=="null" && $subchapter=="null" && $trait=="null" && $yearFrom=="null" && $yearTo=="null" && $nMin=="null" && $nMax=="null"){
		if($this->NullCheck([$domain, $chapter, $subchapter, $trait, $yearFrom ,$yearTo, $nMin, $nMax])){
			// All null
			$query = 'SELECT id,PMID,Year,Consortium,Domain,ChapterLevel,SubchapterLevel,Trait,uniqTrait,Population,Ncase,Ncontrol,N,SNPh2,File FROM gwasDB';
			$results = DB::select($query);
			$results = json_decode(json_encode($results), true);
			$all_row = array();
			foreach($results as $row){
				$all_row[] = array_combine($head, $row);
			}
			$json = array('data'=>$all_row);
			echo json_encode($json);
			// }else if(strcmp($domain, "null")==0 || (strcmp($domain, "null")==0 && strcmp($chapter, "null")==0 && strcmp($subchapter, "null")==0 && strcmp($trait, "null")==0)){
		}else if($this->NullCheck([$domain, $trait, $yearFrom ,$yearTo, $nMin, $nMax])){
			$query = 'SELECT id,PMID,Year,Consortium,Domain,ChapterLevel,SubchapterLevel,Trait,uniqTrait,Population,Ncase,Ncontrol,N,SNPh2,File FROM gwasDB';
			$results = DB::select($query);
			$results = json_decode(json_encode($results), true);
			$all_row = array();
			foreach($results as $row){
				$all_row[] = array_combine($head, $row);
				// $all_row[] = $row;
			}
			$json = array('data'=>$all_row);
			echo json_encode($json);
			// echo json_encode($all_row);
			// echo json_encode($results);
		}else{
			$query = 'SELECT id,PMID,Year,Consortium,Domain,ChapterLevel,SubchapterLevel,Trait,uniqTrait,Population,Ncase,Ncontrol,N,SNPh2,File FROM gwasDB WHERE';
			$val = [];
			if(strcmp($domain, "null")!=0){
				$query .= ' Domain=?';
				$val[] = $domain;
			}
			if(strcmp($chapter, "null")!=0){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' ChapterLevel=?';
				$val[] = $chapter;
			}
			if(strcmp($subchapter, "null")!=0){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' SubchapterLevel=?';
				$val[] = $subchapter;
			}
			if(strcmp($trait, "null")!=0){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' uniqTrait=?';
				$val[] = $trait;
			}
			if($yearFrom != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' Year>=?';
				$val[] = $yearFrom;
			}
			if($yearTo != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' Year<=?';
				$val[] = $yearTo;
			}
			if($nMin != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' N>=?';
				$val[] = $nMin;
			}
			if($nMax != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' N<=?';
				$val[] = $nMax;
			}
			$results = DB::select($query, $val);
			$results = json_decode(json_encode($results), true);
			$all_row = array();
			foreach($results as $row){
				$all_row[] = array_combine($head, $row);
			}
			$json = array('data'=>$all_row);
			echo json_encode($json);
			// echo json_encode($results);
		}
	}

  // argument should be an array
	public function NullCheck($data){
		$check = true;
		foreach($data as $d){
			if($d!="null"){
				$check = false;
				return $check;
			}
		}
		return $check;
	}

	public function getIDs(Request $request){
		$domain = $request -> input('domain');
		$chapter = $request -> input('chapter');
		$subchapter = $request -> input('subchapter');
		$trait = $request -> input('trait');
		$yearFrom = $request -> input('yearFrom');
		$yearTo = $request -> input('yearTo');
		$nMin = $request -> input('nMin');
		$nMax = $request -> input('nMax');
		// if($domain=="null" && $chapter=="null" && $subchapter=="null" && $trait=="null" && $yearFrom=="null" && $yearTo=="null" && $nMin=="null" && $nMax=="null"){
		if($this->NullCheck([$domain, $chapter, $subchapter, $trait, $yearFrom ,$yearTo, $nMin, $nMax])){
			// All null
			$query = 'SELECT ID FROM gwasDB';
			$results = DB::select($query);
			$ids = array();
			foreach($results as $row){
				$ids[] = $row->ID;
			}
			echo json_encode($ids);
			// return response()->json($results);
			// }else if(strcmp($domain, "null")==0 || (strcmp($domain, "null")==0 && strcmp($chapter, "null")==0 && strcmp($subchapter, "null")==0 && strcmp($trait, "null")==0)){
		}else if($this->NullCheck([$domain, $yearFrom ,$yearTo, $nMin, $nMax])){
			$query = 'SELECT ID FROM gwasDB';
			$results = DB::select($query);
			$ids = array();
			foreach($results as $row){
				$ids[] = $row->ID;
			}
			echo json_encode($ids);
			// return response()->json($results);
		}else{
			$query = 'SELECT ID FROM gwasDB WHERE';
			$val = [];
			if(strcmp($domain, "null")!=0){
				$query .= ' Domain=?';
				$val[] = $domain;
			}
			if(strcmp($chapter, "null")!=0){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' ChapterLevel=?';
				$val[] = $chapter;
			}
			if(strcmp($subchapter, "null")!=0){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' SubchapterLevel=?';
				$val[] = $subchapter;
			}
			if(strcmp($trait, "null")!=0){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' Trait=?';
				$val[] = $trait;
			}
			if($yearFrom != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' Year>=?';
				$val[] = $yearFrom;
			}
			if($yearTo != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' Year<=?';
				$val[] = $yearTo;
			}
			if($nMin != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' N>=?';
				$val[] = $nMin;
			}
			if($nMax != "null"){
				if(count($val)!=0){$query .= " AND";}
				$query .= ' N<=?';
				$val[] = $nMax;
			}
			$results = DB::select($query, $val);
			$ids = array();
			foreach($results as $row){
				$ids[] = $row->ID;
			}
			echo json_encode($ids);
			// return response()->json($results);
		}
	}

	public function getData(Request $request){
		$id = $request->input("id");
		$result = DB::table('gwasDB')->where('id', $id)->get();
		return json_encode($result);
	}

	public function manhattan($id, $file){
		$filedir = $this->gwasDir($id).'/';
		if($file == "manhattan.txt"){
			if(file_exists($filedir.$file)){
				$f = fopen($filedir.$file, "r");
				$header = fgetcsv($f, 0, "\t");
				$all_rows = [];
				while($row = fgetcsv($f, 0, "\t")){
					$row[0] = (int)$row[0];
					$row[1] = (int)$row[1];
					$row[2] = (float)$row[2];
					$all_rows[] = $row;
				}
				return json_encode($all_rows);
			}else{
				return "{}";
			}

		}else if($file == "magma.genes.out"){
			if(file_exists($filedir.$file)){
				$f = fopen($filedir.$file, "r");
				$header = fgetcsv($f, 0, "\t");
				$all_rows = [];
				while($row = fgetcsv($f, 0, "\t")){
					if($row[1]=="X"){$row[1] = "23";}
					$row[1] = (int)$row[1];
					$row[2] = (int)$row[2];
					$row[3] = (int)$row[3];
					$row[8] = (float)$row[8];
					$all_rows[] = array($row[1], $row[2], $row[3], $row[8], $row[9]);
				}
				return json_encode($all_rows);
			}else{
				return "{}";
			}
		}
	}

	public function QQplot($id, $plot){
		$filedir = $this->gwasDir($id).'/';
		if($plot=="SNP"){
			$file="QQSNPs.txt";
			if(file_exists($filedir.$file)){
				$f = fopen($filedir.$file, "r");
				$header = fgetcsv($f, 0, "\t");
				$all_rows = [];
				while($row = fgetcsv($f, 0, "\t")){
					$all_rows[] = array_combine($header, $row);
				}
				return json_encode($all_rows);
			}else{
				return "{}";
			}
		}else if($plot=="Gene"){
			$file="magma.genes.out";
			if(file_exists($filedir.$file)){
				$f = fopen($filedir.$file, "r");
				$obs = array();
				$exp = array();
				$c = 0;
				fgetcsv($f, 0, "\t");
				while($row = fgetcsv($f, 0, "\t")){
					$c++;
					$obs[] = -log10($row[8]);
				}
				sort($obs);
				$step = (1-1/$c)/$c;
				$header = ["obs", "exp", "n"];
				$all_rows = array();
				for($i=0; $i<$c; $i++){
					$all_rows[] = array_combine($header, [$obs[$i], -log10(1-$i*$step), $i+1]);
				}
				return json_encode($all_rows);
			}else{
				return "{}";
			}
		}
	}

	public function getGCdata(Request $request){
		$id = $request->input('id');
		$topN = $request->input('topN');
		$excSamePhe = $request->input('excSamePhe');
		$maxNPhe = $request->input('maxNPhe');
		$maxP = $request->input('maxP');
		$maxPbon = $request->input('maxPbon');
		$manual = $request->input('manual');
		$manualids = $request->input('manualids');
		$manualids = explode(":", $manualids);

		$gc_db = DB::select('SELECT gc.*, db.Trait FROM ( SELECT IF (id1 = ?, id2, id1) AS id, rg, se, z, p FROM GenCor WHERE (id1 = ? OR id2 = ?) ORDER BY ABS(rg) DESC) AS gc JOIN gwasDB AS db ON gc.id=db.id', [$id, $id, $id]);
		$gc_db = json_decode(json_encode($gc_db), true);

		$all_ids = [];
		foreach($gc_db as $r){
			if($manual=="true" && !in_array($r['id'], $manualids)){continue;}
			$all_ids[] = $r['id'];
		}

		// Exclude same trait
		$exc_ids = [];
		if($excSamePhe=="true"){
			$trait = collect(DB::select('SELECT uniqTrait FROM gwasDB WHERE id=?', [$id]))->first();
			$trait = $trait->uniqTrait;
			$tmp = DB::select('SELECT id FROM gwasDB WHERE uniqTrait=?', [$trait]);
			foreach($tmp as $row){
				$exc_ids[] = $row->id;
			}
		}

		// Get GWAS with max N per Trait
		$maxN_ids = $all_ids;
		if($maxNPhe=="true"){
			$tmp = DB::select('SELECT id, uniqTrait, N FROM gwasDB');
			$maxN = [];
			$maNid = [];
			foreach($tmp as $row){
				if(in_array($row->id, $all_ids)){
					$t = $row->uniqTrait;
					if(array_key_exists($t, $maxN)){
						if($row->N > $maxN[$t]){
							$maxN[$t] = $row->N;
							$maxNid[$t] = $row->id;
						}
					}else{
						$maxN[$t] = $row->N;
						$maxNid[$t] = $row->id;
					}
				}
			}
			$maxN_ids = array_values($maxNid);
		}

		// filter GC
		$gc = [];
		$n = 0;
		foreach($gc_db as $r){
			if(in_array($r['id'], $exc_ids)){continue;}
			if(!in_array($r['id'], $maxN_ids)){continue;}
			$n++;
			if($r['p']>$maxP){continue;}
			$gc[] = $r;
		}

		usort($gc, function($a, $b){
			if(abs($a['rg'])==abs($b['rg'])){return 0;}
			return (abs($a['rg']) < abs($b['rg'])) ? 1: -1;
		});

		$count = 0;
		$gcout = [];
		foreach($gc as $r){
			$pbon = (float) $r['p']*$n;
			if($pbon>1){$pbon = 1;}
			if($pbon>$maxPbon){continue;}
			$r['pbon'] = $pbon;
			$gcout[] = $r;
			$count++;
			if($count >= $topN){break;}
		}

		usort($gcout, function($a, $b){
			if($a['rg']==$b['rg']){return 0;}
			return ($a['rg'] < $b['rg']) ? 1: -1;
		});

		return json_encode(["GC"=>$gcout, "totalN"=>$n]);
	}

	public function getGClist(){
		$results = DB::select("SELECT id, Trait, Year, N from gwasDB WHERE Population LIKE '%EUR%' AND SNPh2_z>2 AND Trait NOT LIKE '%male%' ORDER BY Trait");
		return json_encode($results);
	}

	public function DTfile(Request $request){
		$id = $request -> input('id');
		$file = $request -> input('infile');
		$cols = $request -> input('header');
		$cols = explode(":", $cols);
		$path = $this->safePath($this->gwasDir($id), $file);
		if(file_exists($path)){
			$f = fopen($path, "r");
			$header = fgetcsv($f, 0, "\t");
			$all_rows = array();
			$index = array();
			foreach($cols as $c){
				if(in_array($c, $header)){
					$index[] = array_search($c, $header);
				}else{
					$index[] = -1;
				}
			}
			while($row = fgetcsv($f, 0, "\t")){
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
			return json_encode($json);
		}else{
			return '{"data":[]}';
		}
	}

	public function imgdown(Request $request){
		$id = $request->input('id');
		return $this->plotDownload($request, 'atlas_'.(preg_match('/^\d+$/', (string) $id) ? $id : ''));
	}

	public function imgdown2(Request $request){
		$id = $request->input('id');
		return $this->plotDownload($request, 'atlas_'.(preg_match('/^\d+$/', (string) $id) ? $id : ''));
	}
}
