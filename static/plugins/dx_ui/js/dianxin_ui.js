// JavaScript Document
//监听文档点击事件
(function($){
	var DxColor = function($this,option){
		this.option = option;
		this.$elem = $this;
		this.value = '#00FF00';
		$this.on('click',$.proxy(this.create_dx_color,this))
	};
	$(document).on('mouseover','#dx_ui_color_table table td',function(){
		var c = $(this).attr('dx_bc');
		$('#dx_ui_color_text').val(c);
		$('#dx_ui_color_cur').css({'background-color':'#'+c});
		$('#dx_ui_color_table table td').removeClass('hover');
		$(this).addClass('hover');
	});
	//设置颜色
	function dx_set_color(e){
		this.value = $(e.target).attr('dx_bc');
		$('#dx_ui_color_text').val(this.value);
		$('#dx_ui_color_cur').css({'background-color':'#'+this.value});
		this.$elem.css({'background-color':'#'+this.value});
		this.$elem.trigger('change',this.value)
	}
	//清除颜色
	function dx_clear_color(){
		$('#dx_ui_color_text').val('');
		$('#dx_ui_color_cur').css({'background-color':''});
		DxColor.prototype.dx_close_color();
	}
	//关闭选择器
	DxColor.prototype.dx_get_color = function(){
		return this.value;
	}
	//关闭选择器
	DxColor.prototype.dx_close_color = function(){
		$('#dx_ui_color_selection').remove();
	}
	DxColor.prototype.create_dx_color = function(e){
		var $this = $(this);
		this.dx_close_color();
		//生成颜色表格
		var dx_color_pane = '<div id="dx_ui_color_selection" class="dx_ui_color_selection">'+
			'<div class="c_top">'+
				'<span id="dx_ui_color_cur">&nbsp;</span>'+
				'<input type="text" class="c_text" maxlength="6" id="dx_ui_color_text" />'+
				'<input type="button" value="清除" class="c_btn" id="dx_ui_clear_color" />'+
			'</div>'+
			'<table border="0" cellpadding="0" cellspacing="0" id="dx_ui_color_table">'+
				'<tr>'+
					'<td rowspan="2" class="td">'+
						'<table border="0" cellpadding="0" cellspacing="0">'+
							'<tr><td style="background:#000000;" dx_bc="000000"></td></tr>'+
							'<tr><td style="background:#333333;" dx_bc="333333"></td></tr>'+
							'<tr><td style="background:#666666;" dx_bc="666666"></td></tr>'+
							'<tr><td style="background:#999999;" dx_bc="999999"></td></tr>'+
							'<tr><td style="background:#CCCCCC;" dx_bc="CCCCCC"></td></tr>'+
							'<tr><td style="background:#FFFFFF;" dx_bc="FFFFFF"></td></tr>'+
							'<tr><td style="background:#FF0000;" dx_bc="FF0000"></td></tr>'+
							'<tr><td style="background:#00FF00;" dx_bc="00FF00"></td></tr>'+
							'<tr><td style="background:#0000FF;" dx_bc="0000FF"></td></tr>'+
							'<tr><td style="background:#FFFF00;" dx_bc="FFFF00"></td></tr>'+
							'<tr><td style="background:#00FFFF;" dx_bc="00FFFF"></td></tr>'+
							'<tr><td style="background:#FF00FF;" dx_bc="FF00FF"></td></tr>'+
						'</table>'+
					'</td>'+
					'<td class="td0"></td><td class="td1"></td><td class="td2"></td></tr>'+
				'<tr><td class="td3"></td><td class="td4"></td><td class="td5"></td></tr>'+
			'</table>'+
		'</div>';
		$('body').append(dx_color_pane);
		var left = this.$elem.offset().left, top = this.$elem.offset().top + this.$elem.outerHeight();
		$('#dx_ui_color_selection').css({left:left, top:top});
		this.$elem.addClass('dx_ui_color_select');
		$('#dx_ui_color_cur').css({'background-color':this.value});
		$('#dx_ui_color_text').val(this.value);
		
		var color = ['00','33','66','99','CC','FF'], dx_ui_color_table = $('#dx_ui_color_table');
		for(var r=0;r<6;r++){
			var table = $('<table border="0" cellpadding="0" cellspacing="0"></table>');
			dx_ui_color_table.find('.td'+r).append(table);
			
			for(var g=0;g<6;g++){
				var td = '', td_color = '';
				for(var b=0;b<6;b++){
					td_color = color[r]+color[b]+color[g];
					if(b == 0) td += '<tr>';
					td += '<td style="background-color:#'+td_color+'" dx_bc="'+td_color+'"> </td>';
					if(b == 5) td += '</tr>';
				}
				table.append(td);
			}
		}
		dx_ui_color_table.off('click','table td').on('click','table td',$.proxy(dx_set_color,this));
		$('#dx_ui_clear_color').off('click').on('click',function(){
			dx_clear_color();
		});
		e && e.stopPropagation();
		return false;
	};
	$.fn.dxColor = function(option){
		var option = {
			// showType : option.showType || 'text',
			// $inputObject : option.$inputObject || ''
		}
		return this.each(function(i){
			var $this = $(this); 
			var data = $this.data('dxColor');
			if(!data) $this.data('dxColor',(data=new DxColor($this,option)));
			if(typeof option == 'string') data[option].call($this);
		})
	};
	$.fn.dxColor.Constructor = DxColor
	$(document).click(function(e){
		var elem = $(e.target);
		if(!(elem.closest('.dx_ui_color_selection').hasClass('dx_ui_color_selection') || elem.closest('.dx_ui_color_select').hasClass('dx_ui_color_select'))){
			DxColor.prototype.dx_close_color();
		}
	});

$.fn.extend({
	dxRegion:function(obj){
		var obj = obj ? obj : {};
		obj = {
			value:obj.value || {region:'',ops:''},
			region : obj.region,
		};
		//监听文档点击事件
		$(document).on('click', function(e) {
			var elem = $(e.target);
			if(!(elem.closest('.dx_ui_region').hasClass('dx_ui_region') || elem.closest('.dx_ui_region_select').hasClass('dx_ui_region_select'))){
				if($('#dx_ui_region_selection').length && !$('#dx_ui_region_selection').hasClass('hide')){
					$('#dx_ui_region_selection').remove();
				}
			}
		})
		$(document).on('click', '.dx_ui_region .confirm', function(e){
			if($('#dx_ui_region_selection').length && !$('#dx_ui_region_selection').hasClass('hide')){
				$('#dx_ui_region_selection').addClass('hide');
				var ops=[],opsShow=[],district=[],districtShow=[];
				$('#dx_ui_region_selection .ops .checkbox-inline input:checked').each(function(){
					ops.push($(this).val());
					opsShow.push($(this).attr('data'));
				})
				$('#dx_ui_region_selection .region .checkbox-inline input:checked').each(function(){
					district.push($(this).val());
					districtShow.push($(this).attr('data'));
				})
				$('#districtShow').children('textarea').val(districtShow.join(','));
				$('#districtShow').removeClass('hide');
				district.length?$('#district').val(district.join(',')):$('#district').val('ALL');
				$('#opsShow').children('textarea').val(opsShow.join(','));
				$('#opsShow').removeClass('hide');
				ops.length?$('#ops').val(ops.join(',')):$('#ops').val('ALL');
			}
		});
		$(document).on('click', '.dx_ui_region .cancel', function() {
			$('#dx_ui_region_selection').remove();
		})
		//全选，反选
		$(document).on('click','.dx_ui_region_pane .title',function(){
			var checked = $(this).find('input').prop('checked');
			var parent = $(this).parent();
			parent.find('input:checkbox').prop('checked',checked);
		});
		//单选
		$(document).on('click','.dx_ui_region_pane .checkbox-inline',function(){
			var checked = $(this).find('input').prop('checked');
			var parent = $(this).closest('.parent');
			var title = parent.find('.title input').eq(0);
			if(checked == false) {
				title.prop('checked',false);
			}else{
				var f = true;
				parent.find('.checkbox-inline input').each(function(){
					if($(this).prop('checked')==false){
						f = false;
						return false;
					}
				});
				title.prop('checked',f);	
			}
		});

		return {
			setOption: function(option){
				obj = {
					value:option.value || obj.value || {region:'',ops:''},
					region : option.region || obj.region,
				};
			},
			create: function(elem) {
				// obj.value = {ops:'',region:''};
		  //       if($('#ops').val()!='ALL'){
		  //           obj.value.ops = $('#ops').val();
		  //       }
		  //       if($('#district').val()!='ALL'){
		  //           obj.value.region = $('#district').val();
		  //       }
				var region_json = obj.region;
				elem.addClass('dx_ui_region_select');
				if($('#dx_ui_region_selection').length == 0) {
					var dx_ui_region_selection = $('<div id="dx_ui_region_selection" class="dx_ui_region"></div>');
					var dx_region = $('<div class="dx_ui_region_pane"></div>').appendTo(dx_ui_region_selection);
					$.each(region_json,function(i,v){
						var row = $('<div class="item_row"></div>');
						var title = $('<label class="title"><input type="checkbox" value="'+v.value+'" />'+v.title+'</label>').appendTo(row);
						if(v.ops){
							var ops = obj.value.ops.split(',');
							var row1 = $('<div class="item_row ops"></div>');
							$.each(v.ops,function(i1,v1){
								if(v1.ops){
						            var title = $('<div>'+
						            '<label class="title"><input type="checkbox" value="'+v1.value+'" />'+v1.title+'</label>'+
						            '</div>');
						            var div = $('<div style="margin-left:10px;"></div>');
						            $.each(v1.ops,function(i2,v2){
						            	var row2 = $('<label style="margin-left:10px" class="checkbox-inline"><input type="checkbox" data="'+v2.title+'" value="'+v2.value+'" />'+v2.title+'</label>');
						            	if(ops.length){
						            		$.each(v2.value(','), function(m, n) {
							            		if( ops.indexOf(n) > -1 ) {
							            			row2.children('input').prop('checked',true);
							            			return false;
							            		}else{
							            			row2.children('input').prop('checked',false);
							            		}
						            		})
						            	}
						            	div.append(row2);
						            })
						            title.append(div).appendTo(row1);
								}else{
									var row2 = $('<label style="margin-left:10px" class="checkbox-inline"><input type="checkbox" data="'+v1.title+'" value="'+v1.value+'" />'+v1.title+'</label>');
						            if(ops.length){
						            	$.each(v1.value.split(','), function(m, n) {
						            		if(ops.indexOf(n)>-1){
						            			row2.children('input').prop('checked',true);
						            			return false;
						            		}else{
						            			row2.children('input').prop('checked',false);
						            		}
						            	})
					            	}
						            row1.append(row2);
								}
							})
							row.append(row1);
						}
						if(v.region){
							var region = obj.value.region.split(',');
							var row1 = $('<div class="item_row region"></div>');
							$.each(v.region,function(i1,v1){
								if(v1.region){
						            var title = $('<div class="parent">'+
						            '<label class="title"><input type="checkbox" value="'+v1.value+'" />'+v1.title+'</label>'+
						            '</div>');
						            var div = $('<div style="margin-left:10px"></div>');
						            $.each(v1.region,function(i2,v2){
						            	if(v2.region){
						            		var subTitle = $('<div class="parent">'+
						            			'<label class="title"><input type="checkbox" value="'+v2.value+'" />'+v2.title+'</label>'+
						            			'</div>');
						            		var subDiv = $('<div style="margin-left:10px"></div>');
						            		$.each(v2.region, function(i3, v3) {
						            			var row3 = $('<label style="margin-left:10px" class="checkbox-inline"><input type="checkbox" data="'+v3.title+'" value="'+v3.value+'" />'+v3.title+'</label>');
								            	if(region.length){
								            		if(region.indexOf(v3.value)>-1){
								            			row3.children('input').prop('checked',true);
								            		}else{
								            			row3.children('input').prop('checked',false);
							            			}
							            		}
								            	subDiv.append(row3);
						            		})
						            		subTitle.append(subDiv).appendTo(div);
						            	}else{
							            	var row2 = $('<label style="margin-left:10px" class="checkbox-inline"><input type="checkbox" data="'+v2.title+'" value="'+v2.value+'" />'+v2.title+'</label>');
							            	if(region.length){
							            		if(region.indexOf(v2.value)>-1){
							            			row2.children('input').prop('checked',true);
							            		}else{
							            			row2.children('input').prop('checked',false);
						            			}
						            		}
							            	div.append(row2);
						            	}
						            })
						            title.append(div).appendTo(row1);
								}else{
									var row2 = $('<label class="checkbox-inline"><input type="checkbox" data="'+v1.title+'" value="'+v1.value+'" />'+v1.title+'</label>');
						            if(region.length){
					            		if(region.indexOf(v1.value)>-1){
					            			row2.children('input').prop('checked',true);
					            		}else{
					            			row2.children('input').prop('checked',false);
					            		}
					            	}
						            row1.append(row2);
								}
							})
							row.append(row1);
						}
						dx_region.append(row);
					})
					$('body').append($(dx_ui_region_selection).append('<div class="text-center" style="padding:10px;"><span class="btn btn-sm confirm">确定</span></div>'));
				}
				var left = elem.offset().left, top = elem.offset().top + elem.outerHeight();
				
				$('#dx_ui_region_selection').css({left:left, top:top}).removeClass('hide');
			},
			remove: function() {
				$('#dx_ui_region_selection').remove();
			}
		}
	},
	dxTime:function(obj){
		var obj = obj ? obj : {};
		obj = {
			inputName : obj.inputName
		};
		
		this.each(function(i){
			var elem = this;
			$(this).click(function(){
				obj.timeArr = obj.inputName.val()|| '16777215,16777215,16777215,16777215,16777215,16777215,16777215';
				var v = obj.timeArr.split(',');
				var timeArr = [];
				for(var i=0;i<v.length;i++){
					//[[1,0,1,...],...]
					var a =  parseInt(v[i]).toString(2).split('');
					while(a.length<24){
						a.unshift('0');
					}
					a.reverse();
					timeArr.push(a);
				}
				obj.timeArr = timeArr;
				var selectPanel = $('#dx_ui_time_selection');
				if(!selectPanel.length){
					var selectPanel = $('<div class="dx_ui_time_selection" id="dx_ui_time_selection">'+
			    			'<div class="dx_ui_time_opt">'+
			        		'<a href="javascript:;" class="dx_ui_opt" id="dx_ui_time_all">全部时间</a>'+
			        		'<a href="javascript:;" class="dx_ui_opt" id="dx_ui_time_days">工作日</a>'+
			        		'<a href="javascript:;" class="dx_ui_opt" id="dx_ui_time_weekend">周末</a>'+
			        		'<a href="javascript:;" class="dx_ui_opt" id="dx_ui_time_reset">重置</a>'+
			        		'<span class="dx_ui_zt"><label></label>暂停时间段</span><span class="dx_ui_tf"><label></label>投放时间段</span>'+
			    		'</div>');
					var table = $('<table class="dx_ui_table" border="0" cellpadding="0" cellspacing="0" id="dx_ui_time_table"></table>');
					var weekDays = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
					var times = 24;
					var theadHtml = '<tr><th class="dx_ui_first_td"></th>';
					for(var i=0;i<times;i++){
						var cur = true;
						for(var j=0;j<obj.timeArr.length;j++){
							if(obj.timeArr[j][i]=='0'){
								cur = false;
								break;
							}
						}
						if(cur){
							theadHtml+='<th cur_index="'+i+'" class="cur"></th>';
						}else{
							theadHtml+='<th cur_index="'+i+'"></th>';
						}	
					}
					theadHtml+='</tr>';
					var tbodyHtml = '';
					$.each(weekDays,function(i,v){
						var tr = '';
						
						var dayArr = obj.timeArr[i];
						if(dayArr.toString()==[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].toString()){
							tr = '<tr><td class="dx_ui_first_td"><input type="checkbox" checked="checked"/>'+v+'</td>';
						}else{
							tr = '<tr><td class="dx_ui_first_td"><input type="checkbox" />'+v+'</td>';
						}
						for(var i=0;i<times;i++){
							if(dayArr[i]=='1'){
								tr+='<td><div class="selected">'+i+'</div></td>';
							}else{
								tr+='<td><div>'+i+'</div></td>';
							}
						}
						tr+='</tr>';
						tbodyHtml+=tr;
					})
					table.append(theadHtml).append(tbodyHtml).appendTo(selectPanel);
					selectPanel.appendTo($('body'));
				}
				var top = $(this).offset().top+$(this).outerHeight(), left = $(this).offset().left;
				selectPanel.css({top:top, left:left}).show();
				$(this).addClass('dx_ui_time_button');
				//全选
				$('#dx_ui_time_all').unbind('click').click(function(){
					$('#dx_ui_time_table .dx_ui_first_td input').prop('checked',true);
					$('#dx_ui_time_table th').addClass('cur');
					$('#dx_ui_time_table td div').addClass('selected');
				});
				//工作日
				$('#dx_ui_time_days').unbind('click').click(function(){
					$('#dx_ui_time_table .dx_ui_first_td input').prop('checked',false);
					$('#dx_ui_time_table th').removeClass('cur');
					$('#dx_ui_time_table td div').removeClass('selected');
					
					$('#dx_ui_time_table .dx_ui_first_td input:lt(5)').prop('checked',true);
					$('#dx_ui_time_table tr:lt(6) td div').addClass('selected');
				});
				//周末
				$('#dx_ui_time_weekend').unbind('click').click(function(){
					$('#dx_ui_time_table .dx_ui_first_td input').prop('checked',false);//.attr('checked',false);
					$('#dx_ui_time_table th').removeClass('cur');
					$('#dx_ui_time_table td div').removeClass('selected');
					
					$('#dx_ui_time_table .dx_ui_first_td input:gt(4)').prop('checked',true);
					$('#dx_ui_time_table tr:gt(5) td div').addClass('selected');
				});
				//头部th点击
				$('#dx_ui_time_table th:gt(0)').unbind('click').click(function(){
					$(this).toggleClass('cur');
					var flag = $(this).hasClass('cur');
					var index = $(this).attr('cur_index');
					$('#dx_ui_time_table tr:gt(0)').each(function(){
						if(flag) {
							$(this).find('div').eq(index).addClass('selected');
						}
						else {
							$(this).find('div').eq(index).removeClass('selected');
						}
					});
				});
				//选择星期几
				$('#dx_ui_time_table .dx_ui_first_td input').unbind('click').click(function(){
					if($(this).prop('checked')){
						$(this).closest('tr').find('div').addClass('selected');
					}else{
						$(this).closest('tr').find('div').removeClass('selected');
					}
				});
				//选择单个整点
				$('#dx_ui_time_table td').unbind('click').click(function(){
					$(this).find('div').toggleClass('selected');
				});
				//重置
				$('#dx_ui_time_reset').unbind('click').click(function(){
					$('#dx_ui_time_table .dx_ui_first_td input').prop('checked',false);
					$('#dx_ui_time_table th').removeClass('cur');
					$('#dx_ui_time_table td div').removeClass('selected');
				});
				return false;
			});
		});
		var $element = $(this);
		$(document).click(function(e){
			var elem = $(e.target);
			if(!(elem.closest('.dx_ui_time_button').hasClass('dx_ui_time_button') || elem.closest('.dx_ui_time_selection').hasClass('dx_ui_time_selection'))){
				if($('#dx_ui_time_selection').length){
					$('#dx_ui_time_selection').hide();
					var time_str = '', time_number = '';
					$('#dx_ui_time_table tr:gt(0)').each(function(){
						var number_arr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
						
						$(this).find('.selected').each(function(){
							number_arr[$(this).text()] = 1;
						})
						number_arr.reverse();
						time_number += ','+parseInt(number_arr.join(''),2); //目前JS最长支持15位的十进制数，如果太长，JS会自动截取前15位，后面的用0补上
						time_str += ','+number_arr.join(''); //十进制转换为二进制 parseInt('11111100',10).toString(2);
					});
					if(obj.inputName){
						obj.inputName.val(time_number.slice(1));
					}
				}
			}
		});
	}
});
})(window.$_1_10_2);