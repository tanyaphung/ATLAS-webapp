<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reportedGWAS', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email');
            $table->string('affiliation');
            $table->string('anonymous');
            $table->string('phenotype');
            $table->string('sumstats_link');
            $table->string('publication');
            $table->string('year');
            $table->string('comment');
            $table->string('status');
            $table->date('date_submit');
            $table->date('date_last_update');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportedGWAS');
    }
};
