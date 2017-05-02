$.fn.extend({
    trim: function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
	singeDate: function(obj){
		if(obj == undefined) obj = {};
		obj = {
			isDisabled : obj.isDisabled || '1',
			maxDate    : obj.maxDate || '',
			minDate    : obj.minDate || '',
			hhmmss     : obj.hhmmss || '',
			ymdShow    : obj.ymdShow || 'true'
		}
        var $this = $(this);
		$(this).focus(function(){
			//var d = new Date().getTime();
			var kDate = $(this);
			$(this).attr('tid','tid');
			$('.kui_d_pane').remove();
			/* 日期插件的HTML元素 */
			var kui_div_date = '<div class="kui_d_pane"><iframe id="kui_frame_d" width="187" height="219" frameborder="0"></iframe><div class="kui_data_content_pane"><div class="kui_prev_next_month"><a href="javascript:;" class="kui_prev_m"><img src="/static/plugins/singeDate/img/date_prev.png" /></a><span class="kui_today"></span><a href="javascript:;" class="kui_next_m"><img src="/static/plugins/singeDate/img/date_next.png" /></a></div><div class="kui_year_month"><div class="kui_year"><select class="kui_year_select"></select>年</div><div class="kui_month"><select class="kui_month_select"></select>月</div></div><table class="kui_data_tab" border="0" cellpadding="0" cellspacing="0"><tr><th class="d_th_bg">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="d_th_bg">六</th></tr><tbody class="kui_date_info"></tbody></table><div class="kui_fun_btn"><a href="javascript:;" class="kui_clean_btn">清除</a><div class="kui_hhmmss"><input type="text" class="kui_hh" maxlength="2" onkeydown="singeDateDown(event);" onfocus="singeDatefocus(this)" onkeyup="singeDateUp(this,0);" onblur="singeDateBlur(this)" />时<input type="text" class="kui_mm" maxlength="2" onkeydown="singeDateDown(event);"onfocus="singeDatefocus(this)" onkeyup="singeDateUp(this,1);" onblur="singeDateBlur(this)" />分<input type="text" class="kui_ss" maxlength="2" onkeydown="singeDateDown(event);" onfocus="singeDatefocus(this)" onkeyup="singeDateUp(this,1);" onblur="singeDateBlur(this)" />秒</div><a href="javascript:;" class="kui_confirm_btn">确定</a></div><div class="kui_hh_tips HMS"><a href="javascript:;">00</a><a href="javascript:;">01</a><a href="javascript:;">02</a><a href="javascript:;">03</a><a href="javascript:;">04</a><a href="javascript:;">05</a><a href="javascript:;">06</a><a href="javascript:;">07</a><a href="javascript:;">08</a><a href="javascript:;">09</a><a href="javascript:;">10</a><a href="javascript:;">11</a><a href="javascript:;">12</a><a href="javascript:;">13</a><a href="javascript:;">14</a><a href="javascript:;">15</a><a href="javascript:;">16</a><a href="javascript:;">17</a><a href="javascript:;">18</a><a href="javascript:;">19</a><a href="javascript:;">20</a><a href="javascript:;">21</a><a href="javascript:;">22</a><a href="javascript:;">23</a></div><div class="kui_mm_tips HMS"><a href="javascript:;">00</a><a href="javascript:;">05</a><a href="javascript:;">10</a><a href="javascript:;">15</a><a href="javascript:;">20</a><a href="javascript:;">25</a><a href="javascript:;">30</a><a href="javascript:;">35</a><a href="javascript:;">40</a><a href="javascript:;">45</a><a href="javascript:;">50</a><a href="javascript:;">55</a></div><div class="kui_ss_tips HMS"><a href="javascript:;">00</a><a href="javascript:;">05</a><a href="javascript:;">10</a><a href="javascript:;">15</a><a href="javascript:;">20</a><a href="javascript:;">25</a><a href="javascript:;">30</a><a href="javascript:;">35</a><a href="javascript:;">40</a><a href="javascript:;">45</a><a href="javascript:;">50</a><a href="javascript:;">55</a></div></div></div>';
			$('body').append(kui_div_date);
			$('.kui_d_pane').hide();
			/* 给日期插件定位 */
			function txtPosition(){
				var txt_left = kDate.offset().left;
				var txt_top = kDate.offset().top + kDate.outerHeight();
				var txt_wid = kDate.outerWidth();
				var dHeight = $('.kui_data_content_pane').outerHeight();
				var scrollWidth = $(window).width();
				if(txt_left + 187 < scrollWidth){
					// 判断文本框的下方是否够显示弹出框的高度
					if($(window).height() - txt_top < dHeight){ //文本框在左下角
						$('.kui_d_pane').attr('style','left:'+ txt_left +'px; top:'+ (kDate.offset().top - dHeight) +'px;');
					}
					else{ //文本框在左上角
						$('.kui_d_pane').attr('style','left:'+ txt_left +'px; top:'+ txt_top +'px;');
					}
				}
				else{
					// 判断文本框的下方是否够显示弹出框的高度
					if($(window).height() - txt_top < dHeight){ //文本框在右下角
						$('.kui_d_pane').attr('style','left:'+(txt_left+txt_wid-187)+'px; top:'+ (kDate.offset().top - dHeight) +'px;');
					}
					else{ //文本框在右上角
						$('.kui_d_pane').attr('style','left:'+(txt_left+txt_wid-187)+'px; top:'+ txt_top +'px;');
					}
				}
			}
			$('.kui_d_pane').show();
			if(obj.ymdShow == 'false'){
				$('.kui_year_month').hide();
			}
			if(obj.hhmmss == 'true'){
				$('.kui_hhmmss').show();
				var hsm = kDate.val().split(/\s/)[1];
				var hh = (hsm == undefined) ? '00' : hsm.split(':')[0] == undefined ? '00':hsm.split(':')[0];
				var mm = (hsm == undefined) ? '00' : hsm.split(':')[1] == undefined ? '00':hsm.split(':')[1];
				var ss = (hsm == undefined) ? '00' : hsm.split(':')[2] == undefined ? '00':hsm.split(':')[2];
				$('.kui_hh').val(hh);
				$('.kui_mm').val(mm);
				$('.kui_ss').val(ss);
			}
			/* 获取当前系统时间 */
			var kui_dd = new Date();
			var kui_year = kui_dd.getFullYear();
			var kui_month = kui_dd.getMonth()+1;
			var kui_date = kui_dd.getDate();
			var kui_day = kui_dd.getDay(); /* 获取当前的星期(0-6),0代表周日 */
			var kui_hours = kui_dd.getHours();
			var kui_minutes = kui_dd.getMinutes();
			var kui_seconds = kui_dd.getSeconds();
			var n_time = kui_dd.getTime();
			var vals = kDate.val();
			var now_year = $.trim(vals) == '' ? kui_year : $.trim(vals).substring(0,4);
			var now_month = $.trim(vals) == '' ? kui_month : (/^[0-9]+$/.test($.trim(vals).substring(5,7)) ? $.trim(vals).substring(5,7) : '0'+$.trim(vals).substring(5,6));
			$('.kui_today').text(now_year+'年'+now_month+'月');
			/* 年和月的默认值 */
			var sel_y = [];
			for(var i=parseInt(now_year)-10;i<=parseInt(now_year)+10;i++){
				if(i == now_year){
					sel_y.push('<option value='+i+' selected="selected">'+i+'</option>');
				}
				else{
					sel_y.push('<option value='+i+'>'+i+'</option>');
				}
			}
			$('.kui_year_select').append(sel_y.join(''));
			var sel_m = [];
			for(var i=1;i<=12;i++){
				if(i < 10){
					i = '0'+i;
				}
				if(i == now_month){
					sel_m.push('<option value='+i+' selected="selected">'+i+'</option>');
				}
				else{
					sel_m.push('<option value='+i+'>'+i+'</option>');
				}
			}
			$('.kui_month_select').append(sel_m.join(''));
			$('.kui_year_select,.kui_month_select').change(function(){
				change_date();
			});
			/* 上月下月 */
			$('a.kui_prev_m').click(function(){
				prev_m();
			});
			function prev_m(){
				var kui_y = $('.kui_year_select').val();
				var kui_m = $('.kui_month_select').val();
				if(kui_m==1){
					$('.kui_year_select').val(kui_y-1)
					$('.kui_month_select').val('12');
				}
				if(kui_m>1 && kui_m <11){
					$('.kui_month_select').val('0'+(kui_m-1));
				}
				if(kui_m>10 && kui_m <13){
					$('.kui_month_select').val(kui_m-1);
				}
				$('.kui_today').text($('.kui_year_select').val()+'年'+$('.kui_month_select').val()+'月');
				change_date();
			}
			$('a.kui_next_m').click(function(){
				next_m();
			});
			function next_m(){
				var kui_y = $('.kui_year_select').val();
				var kui_m = $('.kui_month_select').val();
				if(kui_m>0 && kui_m <9){
					$('.kui_month_select').val('0'+(parseInt(kui_m,10)+1));
				}
				if(kui_m>8 && kui_m <12){
					$('.kui_month_select').val(parseInt(kui_m,10)+1);
				}
				if(kui_m==12){
					$('.kui_year_select').val(parseInt(kui_y)+1);
					$('.kui_month_select').val('01');
				}
				$('.kui_today').text($('.kui_year_select').val()+'年'+$('.kui_month_select').val()+'月');
				change_date();
			}
			change_date();
			txtPosition();
			/* 日期变化函数 */
			function change_date(){
				/* 日期 -- 根据年和月计算出来 */
				var kui_y = $('.kui_year_select').val();
				var kui_m = $('.kui_month_select').val();
				var kui_d = $('.td_select').html() == null ? kui_date : $('.td_select').html();
				var now_date = vals;

				var kui_max_date = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
				if (((kui_y % 4 == 0) && (kui_y % 100 != 0)) || (kui_y % 400 == 0)){
					kui_max_date[1] = 29;
				}
				var this_max_date = kui_max_date[kui_m-1];
				/* 计算星期数 */
				var C = 1;  /* C是从这一年的元旦算起到这一天为止（包括这一天是内）的天数 */
				for(var i=0;i < kui_m - 1;i++){
					C += kui_max_date[i];
				}
				var kui_si = ((kui_y - 1)%4) == 0 ? ((kui_y - 1)/4) : ((kui_y - 1 - (kui_y - 1)%4)/4);
				var kui_yibai = ((kui_y - 1)%100) == 0 ? ((kui_y - 1)/100) : ((kui_y - 1 - (kui_y - 1)%100)/100);
				var kui_sibai = ((kui_y - 1)%400) == 0 ? ((kui_y - 1)/400) : ((kui_y - 1 - (kui_y - 1)%400)/400);
				var S= kui_y - 1 + kui_si - kui_yibai + kui_sibai + C; /* 求出S的值之后，除以7，余几就是星期几；除尽了就是星期日 */

				var aa = (kui_date - 1)%7;
				var bb = S%7; /* 每月1号的星期数 */
				/* TD表格的行数 */
				var kui_td_lines = (bb + this_max_date)%7 == 0 ? (bb + this_max_date)/7 : (bb + this_max_date - (bb + this_max_date)%7)/7 +1;

				/* 动态添加表格数据 */
				var kui_tbody = $('.kui_data_tab .kui_date_info');
				kui_tbody.find('tr').remove();
				var arr_tr = [];
				for(var i=0;i<kui_td_lines;i++){
					arr_tr.push('<tr class="kui_top_tr">');
					var m_ = kui_month < 10 ? '0'+kui_month : kui_month;
					var k_d_ = kui_date < 10 ? '0'+kui_date : kui_date;
					var dd1 = kui_year+'-'+m_+'-'+k_d_; //拼接当前系统时间的年月日
					if(i == 0){
						/* 第一行中有空白的单元格 */
						for(var j = 1;j < bb+1;j ++){
							var prev_m = (kui_m == 1) ? 11 : (kui_m - 2); //上一个月份，用于把第一行的表格显示完全
							arr_tr.push('<td class="kui_td_kong prev_m_kong">'+(kui_max_date[prev_m]-bb+j)+'</td>');
						}
						/* 第一行中有值单元格 */
						var kui_i = 1;
						for(var j=bb+1;j<=7;j++){
							var d_ = (7*i+kui_i) < 10 ? '0'+(7*i+kui_i) : (7*i+kui_i);
							var mm_ = kui_m < 10 ? '0'+parseInt(kui_m,10) : kui_m;
							var dd2 = kui_y+'-'+mm_+'-'+d_;
							var cla = '';
							if(dd2 >= dd1){
								if(vals == dd2){
									cla = 'kui_not_kong td_select';
								}
								else{
									cla = 'kui_not_kong';
								}
							}
							else{
								if(obj.isDisabled == '1'){
									cla = 'kui_not_kong';
								}
								else{
									cla = 'kui_td_hui';
								}
							}
							arr_tr.push('<td class="'+cla+'" onmouseover="singeDateOver(this);" onmouseout="singeDateOut(this);">'+(7*i+kui_i)+'</td>');
							kui_i++;
						}
						$('.kui_top_tr').removeClass('kui_top_tr');
					}
					else if(i==kui_td_lines-1){
						var kui_i = 8-bb;
						for(var j=1;j<=7;j++){
							var dd2 = kui_y+'-'+kui_m+'-'+(7*(i-1)+kui_i);
							var cla = '';
							if((7*(i-1)+kui_i) > this_max_date){
								arr_tr.push('<td class="kui_td_kong next_m_kong">'+(7*(i-1)+kui_i-this_max_date)+'</td>');
							}
							else{
								if(dd2 >= dd1){
									if(vals == dd2){
										cla = 'kui_not_kong td_select';
									}
									else{
										cla = 'kui_not_kong';
									}
								}
								else{
									if(obj.isDisabled == '1'){
										cla = 'kui_not_kong';
									}
									else{
										cla = 'kui_td_hui';
									}
								}
								arr_tr.push('<td class="'+cla+'" onmouseover="singeDateOver(this);" onmouseout="singeDateOut(this);">'+(7*(i-1)+kui_i)+'</td>');
							}
							kui_i++;
						}
					}
					else{
						var kui_i = 8 - bb;
						for(var j=1;j<=7;j++){
							var d_ = (7*(i-1)+kui_i) < 10 ? '0'+(7*(i-1)+kui_i) : (7*(i-1)+kui_i);
							var mm_ = kui_m < 10 ? '0'+parseInt(kui_m,10) : kui_m;
							var dd2 = kui_y+'-'+mm_+'-'+d_;
							var cla = '';
							if(dd2 >= dd1){
								if(vals == dd2){
									cla = 'kui_not_kong td_select';
								}
								else{
									cla = 'kui_not_kong';
								}
							}
							else{
								if(obj.isDisabled == '1'){
									cla = 'kui_not_kong';
								}
								else{
									cla = 'kui_td_hui';
								}
							}
							arr_tr.push('<td class="'+cla+'" onmouseover="singeDateOver(this);" onmouseout="singeDateOut(this);">'+(7*(i-1)+kui_i)+'</td>');
							kui_i++;
						}
					}
					arr_tr.push('</tr>');
				}
				if(kui_td_lines == 5){
					arr_tr.push('<tr class="kui_top_tr">');
					for(var i=1;i<8;i++){
						arr_tr.push('<td class="kui_td_kong next_m_kong">'+(6-(bb+this_max_date%7-1)+i)+'</td>');
					}
					arr_tr.push('</tr>');
				}
				else if(kui_td_lines == 4){
					arr_tr.push('<tr class="kui_top_tr">');
					for(var i=1;i<8;i++){
						arr_tr.push('<td class="kui_td_kong next_m_kong">'+i+'</td>');
					}
					arr_tr.push('</tr>');
					arr_tr.push('<tr class="kui_top_tr">');
					for(var i=8;i<15;i++){
						arr_tr.push('<td class="kui_td_kong next_m_kong">'+i+'</td>');
					}
					arr_tr.push('</tr>');
				}
				kui_tbody.append(arr_tr.join(''));
				if(obj.maxDate != ''){
					/* 计算最大日期是哪一天 */
					var max_seconds = n_time + obj.maxDate*24*60*60*1000;
					var max_d = new Date(max_seconds);
					/* 超过最大日期的变灰 */
					if(kui_y > max_d.getFullYear() || (kui_y == max_d.getFullYear() && kui_m > (max_d.getMonth()+1))){
						$('.kui_not_kong').each(function(){
							$(this).addClass('kui_td_hui').removeClass('kui_not_kong').attr('title','超出了设置的最大日期');
						});
					}
					if(kui_y == max_d.getFullYear() && kui_m == (max_d.getMonth()+1)){
						$('.kui_not_kong').each(function(){
							if($(this).html() == max_d.getDate()){
								$(this).addClass('kui_last_s_td');
							}
							$('.kui_last_s_td').nextAll().addClass('kui_td_hui').removeClass('kui_not_kong').attr('title','超出了设置的最大日期');
							$('.kui_last_s_td').closest('tr').nextAll().find('.kui_not_kong').addClass('kui_td_hui').removeClass('kui_not_kong').attr('title','超出了设置的最大日期');
						});
					}
				}
				if(obj.minDate != ''){
					/* 计算最小日期是哪一天 */
					var min_seconds = n_time - obj.minDate*24*60*60*1000;
					var min_d = new Date(min_seconds);
					/* 小于最小日期的变灰 */
					if(kui_y < min_d.getFullYear() || (kui_y == min_d.getFullYear() && kui_m < (min_d.getMonth()+1))){
						$('.kui_not_kong').each(function(){
							$(this).addClass('kui_td_hui').removeClass('kui_not_kong').attr('title','超出了设置的最小日期');
						});
					}
					if(kui_y == min_d.getFullYear() && kui_m == (min_d.getMonth()+1)){
						$('.kui_not_kong').each(function(){
							if($(this).html() == min_d.getDate()){
								$(this).addClass('kui_last_s_td');
							}
							$('.kui_last_s_td').prevAll().addClass('kui_td_hui').removeClass('kui_not_kong').attr('title','超出了设置的最小日期');
							$('.kui_last_s_td').closest('tr').prevAll().find('.kui_not_kong').addClass('kui_td_hui').removeClass('kui_not_kong').attr('title','超出了设置的最小日期');
						});
					}
				}
				var selDay = parseInt(now_date.substring(8,10),10);
				$('.kui_not_kong').each(function(i){
					if(kui_max_date[kui_m-1] < selDay){
						$('.kui_not_kong:last').addClass('td_select');
					}
					else{
						if($.trim(vals) == ''){
							if($(this).html() == kui_date && kui_m == $('.kui_month_select').val()){
								$(this).addClass('td_select');
							}
						}
						else{
							if($(this).html() == selDay){
								$(this).addClass('td_select');
							}
						}
					}
				});
				$('.kui_data_tab .kui_not_kong').each(function(){
					$(this).click(function(){
						$('.kui_not_kong').removeClass('td_select');
						$(this).addClass('td_select');
						kui_d = $(this).html() == null ? now_date.substring(8,10) : ($(this).html() < 10 ? 0 + $(this).html() : $(this).html());
						//$('.kui_today').html(kui_y +'年'+ kui_m +'月'+ kui_d +'日');
						if(obj.hhmmss == ''){
							kDate.val(kui_y +'-'+ kui_m +'-'+ kui_d);
						}
						else{
							kDate.val(kui_y +'-'+ kui_m +'-'+ kui_d+' '+$('.kui_hh').val()+':'+$('.kui_mm').val()+':'+$('.kui_ss').val());
						}
						$('.kui_d_pane').remove();
					});
				});
				$('.next_m_kong').click(function(){
					$('.kui_next_m').click();
				});
				$('.prev_m_kong').click(function(){
					$('.kui_prev_m').click();
				});
			}
			/* 清除日期按钮 */
			$('.kui_clean_btn').click(function(){
				kDate.val('');
			});
			/* 关闭日期插件 */
			$('.kui_confirm_btn').click(function(){
				$('.kui_data_tab .td_select').click();
			});
			//var t = new Date().getTime();
			//alert(t-d);
		});

		$.fn.singeDate.version = 2.0;
		$.fn.singeDate.author = 'xiaoliansheng';
		$.fn.singeDate.createDate = '2011-05-30';
		$.fn.singeDate.info = '原创于北龙中网，于2010-11实现1.0版本，此版本创作于联拓天际. 此插件可能还存在很多问题，如有问题，请发邮件至xiao.liansheng@163.com';
		// 点击文档的其它地方让日期插件关闭
		$(function(){
			$(document).click(function(e){
				var data_pane = $(e.target).closest('.kui_data_content_pane');
				var flag = $(e.target).attr('tid');
				var f = $(e.target).hasClass('kui_td_kong');
				if(flag == 'tid' || f){

				}
				else if(typeof(data_pane[0]) == 'undefined'){
					$('.kui_d_pane').remove();
				}
			});
		});
	}
});
//鼠标移上移走表格
function singeDateOver(eles){
	if($(eles).hasClass("kui_not_kong")){
		$(eles).addClass('td_hover');
	}
}
function singeDateOut(eles){
	$(eles).removeClass('td_hover');
}
//时分秒键盘按下按起事件
function singeDateDown(event){
	var c = event.keyCode;
	if((c > 47 && c < 58) || (c > 95 && c < 106) || c == 8 || c == 46 || (c > 34 && c < 41)){

	}
	else{

	}
}
function stopDefault(event){
	if(event && event.preventDefault){
		//阻止默认浏览器动作(W3C)
		event.preventDefault();
	}
	else{
		//IE中阻止函数器默认动作的方式
		window.event.returnValue = false;
	}
}
function singeDateUp(eles,a){
	if(a == 0){
		if(eles.value>23){
			eles.value = 23;
		}
	}
	else{
		if(eles.value>59){
			eles.value = 59;
		}
	}
}
//时分秒失去焦点事件
function singeDateBlur(eles){
	if(eles.value.length == 0){
		eles.value = '00';
	}
	else if(eles.value.length == 1){
		eles.value = '0'+eles.value;
	}
}
function singeDatefocus(event){
	$('.HMS').hide();
	$('.'+$(event).attr('class')+'_tips').show();
}

$('body').on('click','.kui_hh_tips a',function(){
	$('.kui_hh').val($(this).text());
	$('.kui_hh_tips').hide();
});
$("body").on('click','.kui_mm_tips a',function(){
	$('.kui_mm').val($(this).text());
	$('.kui_mm_tips').hide();
});
$("body").on('click','.kui_ss_tips a',function(){
	$('.kui_ss').val($(this).text());
	$('.kui_ss_tips').hide();
});
