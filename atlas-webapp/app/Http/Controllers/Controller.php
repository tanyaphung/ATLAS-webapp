<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

abstract class Controller
{
	// GWAS ids are passed around as "1:34:727"
	const IDS_PATTERN = '/^\d+(:\d+)*$/';

	// Run one of the analytics scripts in scripts/ and return its stdout.
	// Arguments are passed as an array, so no shell is involved and user input
	// cannot be interpreted as a command. DB credentials go through the
	// environment instead of the command line (see scripts/atlas_db.py).
	protected function runScript($script, array $args = []){
		$config = DB::connection()->getConfig();
		$result = Process::env([
				'ATLAS_DB_HOST' => $config['host'],
				'ATLAS_DB_USER' => $config['username'],
				'ATLAS_DB_PASSWORD' => $config['password'],
				'ATLAS_DB_NAME' => $config['database'],
			])
			->run(array_merge(['python3', base_path('scripts/'.$script)], array_map('strval', $args)));
		if($result->failed()){
			Log::error($script.' failed: '.$result->errorOutput());
		}
		return $result->output();
	}

	// Full path of $name inside $dir, or a 404. $name must be a plain file
	// name (no "/" or ".."), and an existing file must resolve inside $dir
	// (catches symlinks). A missing file or folder is returned as is, so
	// callers keep their own file_exists() handling.
	protected function safePath($dir, $name){
		if(!is_string($name) || !preg_match('/^[A-Za-z0-9_][A-Za-z0-9._-]*$/', $name)){
			abort(404);
		}
		$base = realpath($dir);
		if($base === false){
			return $dir.'/'.$name;
		}
		$path = realpath($base.'/'.$name);
		if($path === false){
			return $base.'/'.$name;
		}
		if(!str_starts_with($path, $base.DIRECTORY_SEPARATOR)){
			abort(404);
		}
		return $path;
	}

	// Per-GWAS folder for a numeric id, or a 404
	protected function gwasDir($id){
		if(!preg_match('/^\d+$/', (string) $id)){
			abort(404);
		}
		return config('app.datadir').'/'.$id;
	}

	// Abort with 422 unless $ids looks like "1:34:727"
	protected function validIds($ids){
		if(!is_string($ids) || !preg_match(self::IDS_PATTERN, $ids)){
			abort(422, 'Invalid ids');
		}
		return $ids;
	}
}
