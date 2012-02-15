$(function(){
	//localStorageに都道府県情報有り
	if(localStorage.pref !== undefined){
		selectedPref = localStorage.pref;

		$('#pref').children('option').each(function(){
			if($(this).attr('value') == selectedPref){
				$(this).attr('selected','selected');
			}
		});

		$json = 'http://www.drk7.jp/weather/json/'+selectedPref+'.js';
		$.getJSON($json+'?callback=?');
	} else {
		selectedPref = '';
	}

	//localStorageにエリア情報有り
	if(localStorage.area !== undefined){
		selectedArea = localStorage.area;
	} else {
		selectedArea = '';
	}

	//localStorageに都道府県・エリア情報有り
	if(localStorage.pref !== undefined && localStorage.area !== undefined){
		$('input[type=submit]').attr('value','再選択');
		$('input[type=submit]').removeClass('check');
		$('input[type=submit]').removeAttr('disabled');
	}

	$('select').change(function(){
		//エリア選択時
		if($(this).attr('id').indexOf('pref') !== -1){
			$('#area').children('option').not(':first-child').remove();
		}

		selectedPref = $('#pref').children(':selected').attr('value');
		selectedArea = $('#area').children(':selected').attr('value');

		if(selectedPref === ''){
			$(this).siblings('input[type=submit]').attr('value','都道府県を選択してね');
			$(this).siblings('input[type=submit]').attr('disabled','disabled');
		}

		if(selectedPref !== '' && selectedArea === ''){
			$(this).siblings('input[type=submit]').attr('value','エリアを選択してね');
			$(this).siblings('input[type=submit]').attr('disabled','disabled');

			$json = 'http://www.drk7.jp/weather/json/'+selectedPref+'.js';
			$.getJSON($json+'?callback=?');
		}

		if(selectedArea !== ''){
			$(this).siblings('input[type=submit]').attr('value','確認する');
			$(this).siblings('input[type=submit]').addClass('check');
			$(this).siblings('input[type=submit]').removeAttr('disabled');
		}
	});

	$('input[type=submit]').click(function(){
		$('#answer').children().remove();
		if($(this).hasClass('check')){
			localStorage.pref = selectedPref;
			localStorage.area = selectedArea;
			$json = 'http://www.drk7.jp/weather/json/'+selectedPref+'.js';
			$.getJSON($json+'?callback=?');
		} else {
			localStorage.clear();
			selectedPref = '';
			selectedArea = '';
			$('select').each(function(){
				$(this).removeAttr('selected');
			});
			$('select').children('option:first-child').attr('selected','selected');
			$(this).attr('disabled','disabled');
			$(this).attr('value','都道府県を選択してね');
			$('select').removeAttr('disabled');
		}
	});

	$('form').submit(function(){
		localStorage.pref = selectedPref;
		localStorage.area = selectedArea;
		$("#pref").attr('disabled','disabled');
		$("#area").attr('disabled','disabled');

		if($('input[type=submit]').hasClass('check')){
		$('input[type=submit]').attr('value','再選択');
		$('input[type=submit]').removeClass('check');
		} else {
		}
		return false;
	});

});

function drk7jpweather(){}

drk7jpweather.callback = function(data){
		var areas = data.pref.area;
	if($('#area').children('option').length == 1){
		var areaOption = new Array();

		for(var i in areas){
			areaOption.push(i);
		}
		areaOption.sort();

		for(var j in areaOption){
			$('<option value="'+areaOption[j]+'">'+areaOption[j]+'</option>').appendTo('#area');
		}

		$('#area').children('option').each(function(){
			if($(this).attr('value') == selectedArea){
			$(this).attr('selected','selected');
			}
		});
	}

	if(selectedPref !== '' && selectedArea !== ''){
		for(var k in areas){
			if(k === selectedArea){
				rainfallChance = data.pref.area[k].info[0].rainfallchance.period;
				
		total = 0;
		for(var i in rainfallChance){
			total = total + parseInt(rainfallChance[i].content);
		}
		if(total == 0){
			answer = '快晴！！';
		} else if(total >= 1 && total <= 40){
			answer = '必要無いかも。';
		} else if(total >= 41 && total <= 160){
			answer = 'あると助かるかな？';
		} else if(total >= 161 && total <= 240){
			answer = 'あって損はないよ。';
		} else if(total >= 241 && total <= 320){
			answer = '無いと厳しいかも。';
		} else if(total >= 321 && total <= 400){
			answer = '絶対いるよ！！';
		}
		$('#answer').append('<p>'+answer+'</p>');
			}
		}
	}
}
