<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGCTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('GenCor', function (Blueprint $table) {
            $table->integer('id1');
            $table->integer('id2');
            $table->float('rg');
            $table->float('se');
            $table->float('z');
            $table->float('p');
            $table->float('gcov_int');
            $table->float('gcov_int_se');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('GenCor');
    }
}
