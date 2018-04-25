$(function () {
	// 初始化提示tips
	$('[data-toggle="tooltip"]').tooltip()
});



/****************************************************************************************detail*/
$(function() {
	$('.comment').click(function(e) {
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');

		if($('#toId').length > 0){
			$('#toId').val(toId);
		}
		else{
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');
		}

		if($('#commentId').length > 0){
			$('#commentId').val(commentId);
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm');
		}

	});
});
/****************************************************************************************detail end */











/***************************************************************************************admin*/
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

				del(url, id, function(){

					$(target).parents('tr').hide('fast');
				});
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
function del(url, id, callback){
	// alert(url);
	$.ajax({
		url: url + id,
		type: 'DELETE'
	})
	.done(function(results) {
		if(results.success === 1){
			swal("操作成功!", "已成功删除数据！", "success");
		}
		callback();
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
	// 逗号拼接
	return arr ? arr.join(',') : arr;
}
/************************************************************************************************ admin end */







/********************************************************************************************** about  */
$(function(){
	// 中英文切换
	$('a[name="tab-lang"]').bind('click', function(e) {

		event.preventDefault();

		var lang = $(this).attr('tab-area');

		$('#'+ lang).siblings().fadeOut(0,function() {

			$('#'+ lang).fadeIn(0);
		});

	});


});

/********************************************************************************************** about end  */







/********************************************************************************************** user list*/
$(function(){

	// 打开模态框之前
	$('#setRole').on('show.bs.modal', function (event) {
		// 模态框
		var modal = $(this);
		// 目标按钮
		var button = $(event.relatedTarget);
		// datawhatever
		var id = button.data('id');

		var role = button.data('role');

		modal.find('input[type="hidden"]').val(id.trim());

		// 原有权限
		var options = modal.find('select#role>option');
		for (var i = options.length - 1; i >= 0; i--) {
			if($(options[i]).val()== role) {
				// 绑定原有的值
				$(options[i]).attr('selected', 'true');
			}
			else {
				$(options[i]).removeAttr('selected');
			}
		}

	});


	/**
	 * 模态框关闭之后 清空表单数据
	 */
	$('#setRole').on('hidden.bs.modal', function (e) {
		// 输入框
		$('form').find("input[ type='text'], input[ type='number'], input[ type='hidden']").val('');
		// 选择框
		$('select').find('option').removeAttr('selected');
	});

});



/********************************************************************************************** user list end*/










/********************************************************************************************** profile */

$(function(){
	// 有更改信息的趋势
	$('form#profile input').focus(function(e) {
		// 显示保存按钮
		$(this).parents('form').find('button[type="submit"]').fadeIn('fast');
	});


	// 切换
	$('.tab-btn').bind('click', function(e) {

		var currview = $(this).parents('.tab-view');
		var nextview = $(this).parents('.tab-view').siblings('.tab-view')

		// 翻转90度
		currview.removeClass('tab-show').addClass('tab-hide');
		// 等待动画执行完成后隐藏
		setTimeout(function(){ currview.hide(); }, 500);
		// 显示
		setTimeout(function(){
			nextview.removeClass('tab-hide').addClass('tab-show');
			nextview.show();
		}, 500);
	});

});


// 图片上传实时预览
function preview(file)
{
	var prevDiv = document.getElementById('preview');
	if (file.files && file.files[0])
	{
		var reader = new FileReader();
		reader.onload = function(evt){
			prevDiv.innerHTML = ' <img style="width:120px" class="img-circle" src="' + evt.target.result + '" /> ';
		}
		reader.readAsDataURL(file.files[0]);
	}
}

// 修改密码前的提示
function setchangepwdconfirm(form, callback) {
	// 提示
	swal({
		title: "密码将修改，请牢记新密码！",
		text: "新密码：<span style='color:#a94442'>"+form.find('input#newpwd').val()+"</span>",
		type: "warning",
		html: true,
		showCancelButton: true,
		closeOnConfirm: false,
		confirmButtonText: "确定",
		confirmButtonColor: '#d9534f',
	}, callback);
}
// 修改密码
function postchangepwd(form) {
	var newpwd = form.find('input#newpwd').val();
	var _id = form.find('input#id').val();
	// alert(_id)
	// 发送ajax请求
	$.ajax({
		url: '/user/changepwd',
		type: 'POST',
		dataType: 'json',
		data: {
			newpassword: newpwd
		},
	})
	.done(function(result) {
		console.log("success");
		if(result.success==1) {
			swal("修改成功!", "", "success");
			// 跳转页面
			// window.location.href="jb51.jsp?backurl="+window.location.href;
		}
	})
	.fail(function() {
		console.log("error");
		// 错误提示
		swal({
			title: "<span class='text-danger'>未知错误！</span>",
			text: "请稍后重试，或<a href='/profile'>刷新</a>页面.",
			confirmButtonColor: "#D0D0D0",
			html: true
		});
	})
	.always(function() {
		console.log("complete");
	});
}

/********************************************************************************************** profile end*/

















/********************************************************************************************** 表单验证 */
$(function(){

	// 输入框绑定数据
	$.each($("[val-type]"),function(i, n) {
		// 鼠标离焦验证
		$(n).bind('blur', validebefore);
		// 键盘按起验证
		$(n).bind('keyup', validebefore);

	});

	// 表单提交前验证
	$('button[name="sbm"]').bind('click', function(e) {
		var form = $(this).parents('form');
		// 验证后进入beforesubmit
		validsubmit($(form), function(){
			// alert(form.attr('id'))
			beforesubmit($(form));
		});
	});



});

// 验证及提示
function validebefore() {
	// 取得验证值和验证类型
	var target = $(this);
	var val = target.val().trim();
	var valtype = target.attr('val-type');

	if( valtype == 'passpwd' || valtype == 'image'){ return; }

	if( !passvalue(val, valtype) ) { seterrorinput( target ); }
	// 通过后移除错误提示
	else { removeerrorinput( target ); }
}
// 验证结果
function passvalue( content, type ) {
	// 已定义的验证正则
	var types = {
		// 4到16位（字母，数字，下划线，减号）
		username: /^[a-zA-Z0-9_-]{4,16}$/,
		// 6-16个英文字母和数字
		pwd: /^[0-9A-Za-zA-Za-z0-9_\+\-\*\/\?\<\>\(\)\!\@\#\$\%\^\&\~\`]{6,255}$/,
		// 中文、英文、数字、_
		nick: /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,25}$/,
		// 时间类型
		date: /^[0-9/]{10,10}$/,

	}
	// 返回验证结果
	return types[type].test(content);
}

// 错误信息
function seterrorinput( el ) {
	$(el).parents('.form-group').addClass('has-error');
	$(el).next('span').removeClass('hide');
}
// 移除错误信息
function removeerrorinput( el ) {
	$(el).parents('.form-group').removeClass('has-error');
	$(el).next('span').addClass('hide');
}

// 提交表单之前的验证
function validsubmit( form , callback ) {
	// 验证标识
	var flag = true;
	// 为表单下所有需要验证的input添加验证
	$(form).find('[val-type]').each(function(index, el) {
		// 验证的值及验证类型
		var val = $(el).val().trim();
		var valtype = $(el).attr('val-type');
		// 空值
		if(val == undefined || val == '' || valtype == undefined || valtype == ''){
			// 错误信息
			seterrorinput($(el));
			flag = false;;
		}
		else if( valtype == 'passpwd' ){
			let pwd = $(el).parents('.form-group').prev().find('input[type="password"]').val();
			if( val != pwd ) { seterrorinput($(el)); flag = false; }

			// return;

		}
		else if( valtype == 'image') {  }
		else {
			// 验证没通过
			if ( !passvalue(val, valtype) ){ seterrorinput($(el)); flag = false; }
			// console.log(000)
		}
	});
	// alert(flag)
	// 验证通过后进入回调函数
	if(flag === true) callback();

	return flag;

}

// 验证后表单提交前处理
function beforesubmit( form ) {

	var formtype = form.attr('id');
	// 修改密码
	if( formtype =='changepwd' ) {

		setchangepwdconfirm(form, function(){

			postchangepwd(form);
		});
	}
	// 注册表单提交
	if( formtype == 'signup' ) $(form).submit();

}
