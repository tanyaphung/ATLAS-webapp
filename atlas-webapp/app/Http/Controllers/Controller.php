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

	// Send the SVG of a plot back as an svg/png/jpeg/pdf download.
	// Everything happens in memory: nothing is written to disk, and the
	// download name is built from a cleaned-up fileName plus $suffix.
	protected function plotDownload($request, $suffix){
		$type = $request->input('type');
		if(!in_array($type, ['svg', 'png', 'jpeg', 'pdf'], true)){
			abort(422, 'Invalid type');
		}
		$name = preg_replace('/[^A-Za-z0-9_-]/', '', (string) $request->input('fileName'));
		$name = substr($name, 0, 64) ?: 'plot';

		$svg = (string) $request->input('data');
		$svg = preg_replace("/\),rotate/", ")rotate", $svg);
		$svg = preg_replace("/,skewX\(.+?\)/", "", $svg);
		$svg = preg_replace("/,scale\(.+?\)/", "", $svg);
		// The plots are plain D3 output. Drop anything that could make the
		// SVG (or ImageMagick, when rasterising) load other files or run code.
		$svg = preg_replace('/<!(DOCTYPE|ENTITY)[^>]*>/i', '', $svg);
		$svg = preg_replace('/<script\b.*?<\/script>/is', '', $svg);
		$svg = preg_replace('/\s(xlink:)?href\s*=\s*("[^"#][^"]*"|\'[^\'#][^\']*\')/i', '', $svg);

		if($type=="svg"){
			$blob = $svg;
		}else{
			$image = new \Imagick();
			$image->setResolution(300,300);
			$image->readImageBlob('<?xml version="1.0"?>'.$svg);
			$image->setImageFormat($type);
			$blob = $image->getImagesBlob();
		}
		return response()->streamDownload(function() use ($blob){ echo $blob; }, $name.'_'.$suffix.'.'.$type);
	}

	// Abort with 422 unless $ids looks like "1:34:727"
	protected function validIds($ids){
		if(!is_string($ids) || !preg_match(self::IDS_PATTERN, $ids)){
			abort(422, 'Invalid ids');
		}
		return $ids;
	}
}
