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
		return $this->plotDownload($request, date('Ymd_His'));
	}
}
