<!-- Tab bar -->
<nav class="navbar navbar-inverse navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header" style="padding-left: 30px;">
      <!-- <a class="navbar-brand" href="{{ Config::get('app.subdir') }}/"><span style="color: #1E90FF; font-size: 130%;">IPGAP</span></a> -->
      <a class="navbar-brand" href="{{ Config::get('app.subdir') }}/" style="padding-top: 5px;">
        <img src="{!! URL::asset('image/atlas.png') !!}" height="50px;">
        <!-- <span style="color:#fff; font-size:30px;">FUMA</span> -->
      </a>
    </div>

    <div class="collapse navbar-collapse" id="headNav" style="padding-right: 50px;">
      <ul class="nav navbar-nav navbar-right">
        <!-- local_start -->
        <li class="{{ Request::is('/') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/">Home</a></li>
        <!-- <li class="{{ Request::is('howto') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/howto">How to use</a></li> -->
        <li class="{{ Request::is('traitDB*') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/traitDB">Browse GWAS</a></li>
        <li class="{{ Request::is('multiGWAS*') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/multiGWAS">Multiple GWAS comparison</a></li>
		<li class="{{ Request::is('PheWAS*') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/PheWAS">PheWAS</a></li>
		<li class="{{ Request::is('stats*') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/stats">Stats</a></li>
		<li class="{{ Request::is('report*') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/report">Report GWAS</a></li>
        <li class="{{ Request::is('documentation*') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/documentation">Documentation</a></li>
		<li class="{{ Request::is('howto') ? 'active' : ''}}"><a href="{{ Config::get('app.subdir') }}/faq">FAQ</a></li>
      </ul>
    </div>
  </div>
</nav>
