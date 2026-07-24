$(document).ready(function(){
	// popover
	var cnt = 10;
	$('.infoPop').each(function(){
		$(this)
			.attr('data-trigger', 'focus')
			.attr('role', 'button')
			.attr('tabindex', cnt)
			.popover();
		cnt = cnt + 1;
	});
});

function getDate(){
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth();
	if(m<10){m="0"+m}else{m=m.toString()}
	var d = date.getDate();
	if(d<10){d="0"+d}else{d=d.toString()}
	var h = date.getHours();
	if(h<10){h="0"+h}else{h=h.toString()}
	var mt = date.getMinutes();
	if(mt<10){mt="0"+mt}else{mt=mt.toString()}
	var s = data.getSecounts();
	if(s<10){s="0"+s}else{s=s.toString()}
	return y+m+d+"_"+h+mt+s;
}
