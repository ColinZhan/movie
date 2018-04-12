$(function(){

	/**
	 * 列表页删除功能
	 */
	$('.del').click(function(event) {
		var target = $(event.target);
		var id = target.data('id');
		/* 获取当前页面的路径，转化为字符串并拼接参数 */
		var url = window.location.pathname.toString() + '?id=';

		swal({
			title: "您确定要删除吗？",
			// text: "您确定要删除这条数据？",
			type: "warning",
			showCancelButton: true,
			closeOnConfirm: false,
			confirmButtonText: "确定",
			confirmButtonColor: "#ec6c62"
			}, function() {
				del(url, id);
		});

	});



	/**
	 * 请求豆瓣API数据
	 */
	$('#douban').blur(function() {
		var douban = $(this);
		var id = douban.val();

		if(id){
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/'+id,
				type: 'GET',
				dataType: 'jsonp',
				cache: true,
				crossDomain: true,
				jsonp: 'callback'
			})
			.done(function(data) {
				console.log("success");
				console.log(data);
				$('#inputTitle').val(data.title);
				$('#inputDoctor').val(arrayToStr(data.directors, 1));
				$('#inputActor').val(arrayToStr(data.casts, 1));
				$('#inputCountry').val(arrayToStr(data.countries, 0));
				$('#inputLanguage').val(arrayToStr(data.languages, 0));
				$('#inputPoster').val(data.images.large);
				$('#inputYear').val(data.year);
				$('#inputSummary').val(data.summary);
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
		}

	});

});



/**
 * 删除操作（包含用户，电影，类型）
 * @param  {[tring]} url [删除操作的路由]
 * @param  {[string]} id  [要删除的数据的_id]
 * @return {[none]}     [删除完成后给出提示]
 */
function del(url, id){
	// alert(url);
	$.ajax({
		url: url + id,
		type: 'DELETE'
	})
	.done(function(results) {
		if(results.success === 1){
			swal("操作成功!", "已成功删除数据！", "success");

			var tr = $('.item-id-' + id);
			if(tr.length > 0){
				tr.fadeOut(1000);
			}
		}
	})
	.fail(function() {
		swal("网络错误！", "删除失败，若长期删除失败，请联系管理员。", "error");
	})
	.always(function() {
		console.log("完成。");
	});
}


/**
 * 将数组转化为都好拼接的字符串
 * @param  {[array]} array [数组]
 * @param  {[int]} flag   [标记]
 * 0：数组
 * 1：数组里面是对象
 * @return {[string]}     [description]
 */
function arrayToStr(array, flag){
	var arr = [];
	switch(flag){
		case 0:
			return array ? array.join(',') : array;
		case 1:
			for (var i = 0; i <= array.length - 1; i++) {
				arr.push(array[i].name);
			}
			break;
	}

	return arr ? arr.join(',') : arr;
}
