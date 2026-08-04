<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class StatsController extends Controller
{
	public function dbSum(Request $request){
		$header = ["GWAS", "trait", "study", "domain"];
		$val = [];
		$val[] = DB::table('gwasDB')->count();

		$tmp = collect(DB::select("SELECT COUNT(DISTINCT uniqTrait) AS count FROM gwasDB"))->first();
		$val[] = $tmp->count;

		$tmp = collect(DB::select("SELECT COUNT(DISTINCT PMID) AS count FROM gwasDB"))->first();
		$val[] = $tmp->count;
		$tmp = collect(DB::select("SELECT COUNT(DISTINCT Domain) AS count FROM gwasDB"))->first();
		$val[] = $tmp->count;
		return json_encode(array_combine($header, $val));
	}

	public function yearSumPlot(){
		$script = $script = base_path('scripts/DBsummary.py');
		$host = config('database.connections.mysql.host');
		$user = config('database.connections.mysql.username');
		$pass = config('database.connections.mysql.password');
		$db = config('database.connections.mysql.database');

		$results = shell_exec("python $script $host $user $pass $db Year");
		return $results;
	}

	public function domainSumPlot(){
		$script = $script = base_path('scripts/DBsummary.py');
		$host = config('database.connections.mysql.host');
		$user = config('database.connections.mysql.username');
		$pass = config('database.connections.mysql.password');
		$db = config('database.connections.mysql.database');

		$results = shell_exec("python $script $host $user $pass $db Domain");
		return $results;
	}

	public function DomainPie(){
		$results = DB::select("SELECT Domain, COUNT(DISTINCT PMID) AS count FROM gwasDB GROUP BY Domain ORDER BY count DESC");
		return json_encode($results);
	}

	public function ChapterPie($domain){
		$results = DB::select('SELECT ChapterLevel, COUNT(DISTINCT PMID) AS count FROM gwasDB WHERE Domain=? GROUP BY ChapterLevel ORDER BY count DESC', [$domain]);
		return json_encode($results);
	}

	public function SubchapterPie($domain, $chapter){
		$results = DB::select('SELECT SubchapterLevel, COUNT(DISTINCT PMID) AS count FROM gwasDB WHERE Domain=? AND ChapterLevel=? GROUP BY SubchapterLevel ORDER BY count DESC', [$domain, $chapter]);
		return json_encode($results);
	}

	public function NsampleYear(){
		$results = DB::select('SELECT Year, N from gwasDB');
		return json_encode($results);
	}

	public function NsampleDomain(){
		$results = DB::select('SELECT Domain, N from gwasDB ORDER BY Domain');
		return json_encode($results);
	}
}
