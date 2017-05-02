
$(document).ready(
    function() {
        time_path_select();
        time_stat_path_select();
        field_timeliness();
        init_get_tl_stat();
        alarm_group_select();
        $(document).on("click","#bd_DW_config_query",
            function(e) {
                e.stopImmediatePropagation();
                get_table_config();
            }
        );
        $(document).on("click",".bd_field_span_1",
            function(e) {
                e.stopImmediatePropagation();
                //var filter_text = this.innerText;
                var click_id = this.id;
                field_delete_click(click_id);
            }
        );
        $(document).on("click",".bd_field_delete_1",
            function(e) {
                e.stopImmediatePropagation();
                var click_id = this.id;
                field_delete_click(click_id);
            }
        );
        $(document).on("click","#bd_DW_config_submit",
            function(e) {
                e.stopImmediatePropagation();
                config_submit_click();
            }
        );
        $(document).on("click","#bd_DW_config_test",
            function(e) {
                e.stopImmediatePropagation();
                config_test_click();
            }
        );
        $(document).on("click","#bd_DW_config_create",
            function(e) {
                e.stopImmediatePropagation();
                config_create_click();
            }
        );
        $(document).on("click",".page_number",
            function(e) {
                var filter_text = this.innerText;
                var click_id = this.id;
                e.stopImmediatePropagation();
                draw_split_page(click_id);
            }
        );
        $(document).on("click","#bd_specify_page",
            function(e) {
                e.stopImmediatePropagation();
                jump_specify_page();
            }
        );
        $(document).on("click","#bd_DW_result_query",
            function(e) {
                e.stopImmediatePropagation();
                get_check_result();
            }
        );
        $(document).on("click","#bd_DW_rule_add",
            function(e) {
                e.stopImmediatePropagation();
                add_rule();
            }
        );
        $(document).on("click",".bd_field_span_5",
            function(e) {
                e.stopImmediatePropagation();
                var click_id = this.parentNode.id;
                rule_delete_click(click_id);
            }
        );
        $(document).on("click","#bd_DW_task_query",
            function(e) {
                e.stopImmediatePropagation();
                task_query();
            }
        );
        $(document).on("click","#bd_DW_timeliness_add",
            function(e) {
                e.stopImmediatePropagation();
                add_timeliness();
            }
        );
        $(document).on("click","#bd_DW_timeliness_rm",
            function(e) {
                e.stopImmediatePropagation();
                rm_timeliness();
            }
        );
        $(document).on("click","#bd_DW_timeliness_query",
            function(e) {
                e.stopImmediatePropagation();
                timeliness_query();
            }
        );
        $(document).on("click","#bd_DW_timeliness_config_query",
            function(e) {
                e.stopImmediatePropagation();
                query_timeliness_job_table();
            }
        );
        $(document).on("click","#bd_DW_static_query",
            function(e) {
                e.stopImmediatePropagation();
                draw_timline_static();
            }
        );
        $(document).on("click","#tl_stat_button",
            function(e) {
                e.stopImmediatePropagation();
                get_tl_stat();
            }
        );
        $(document).on("click","#xch_stat_button",
            function(e) {
                e.stopImmediatePropagation();
                get_xch_stat();
            }
        );
        $(document).on("click","#bd_DW_task_list_query",
            function(e) {
                e.stopImmediatePropagation();
                get_task_config_list();
            }
        );
        $(document).on("click",".bd_DW_task_status_margin",
            function(e) {
                e.stopImmediatePropagation();
                task_action_click(this);
            }
        );
    }
);
/**
 * 判断规则监控配置页是否为编辑页
 */
function currentIsEditPage() {
    var
        url = window.location.search,
        matchIndex,
        database ,
        table;


    if(url){
        matchIndex = url.indexOf("&");
        database = url.slice(url.indexOf('=') + 1, matchIndex);
        table = url.substring(url.indexOf('=', matchIndex+1) + 1, url.length);
        $("input[name = 'DW_query_db']").val(database);
        $("input[name = 'DW_query_table']").val(table);
        get_table_config();
    }
}

var username = getCookie('username');

//获取cookie
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) {
        return unescape(arr[2]);
    } else {
        return null
    }
}

function alarm_group_select() {
    var ret = send_get('/data_monitor/alarm_group/group_lists');
    var ret_data = ret['data'];
    var data = [];
    for(var i=0; i< ret_data.length; i++) {
        data.push({id: ret_data[i], text: ret_data[i]})
    }
    $("#timeliness_group_select").select2({data : data})
}

function time_path_select() {
    //定义新数组
    var path_data = [];
    var _path_data = [];

    $("#time_path").autocomplete({
        source: _path_data
    });

    $("#time_path").keyup(
        function(event){
            var path=$("#time_path").val();
            if(path.length>0){
                var data_dict = send_get("/data_monitor/xch/paths?path=" + path);
                var data = data_dict['data'];

                var len = data.length;
                for(var i=0;i<len-1;i++){
                    path_data[i]=data[i];
                };
                $("#hidden_path").val(path_data);
                var _data=$("#hidden_path").val().split(",");
                for(var j=0;j<_data.length;j++){
                    _path_data[j]=_data[j];
                }
            }
        }
    );
}

function owner_select(flag) {
    if(flag != true) {
        $("#timeliness_owner_select").select2();
        var data_dict = send_get("data_monitor/alarm_group/user?email=" + username + "@didichuxing.com");
        if (data_dict['errno'] == 0) {
            var data = data_dict['data'];
            $("#timeliness_owner_select").select2({data: [{id: data['displayName'], text: data['displayName']}]});
            $("#timeliness_owner_select").select2("val", data['displayName']);
        }
    }
    $("#timeliness_owner_select").select2({
        ajax: {
            url: "/data_monitor/alarm_group/user" ,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    email: params.term + "@didichuxing.com", // search term
                    page: params.page
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;
                data.data['id'] = data.data['mail'];
                return {
                    results: [data.data],
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 1,
        templateResult: formatRepo, // omitted for brevity, see the source of this page
        templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
    });
    //$("#timeliness_owner_select").keyup(
    //  function(event) {
    //      var owner = $("#timeliness_owner_select").val();
    //      if(owner.length > 0) {
    //          var data_dict = send_get("data_monitor/alarm_group/user?email=" + owner + "@didichuxing.com");
    //          if(data_dict['errno'] == 0) {
    //              var data = data_dict['data'];
    //              $("#timeliness_owner_select").select2("val", data['displayName']);
    //          }
    //      }
    //
    //  }
    //);
}

function formatRepo (repo) {
    if (repo.loading) return repo.text;
    repo.text = repo.mail;
    repo.id = repo.displayName;
    var markup = '<div class="clearfix">' +
        '<div><span class="badge bg-green" >' + repo.displayName + ',' + repo.mail +  '</span></div></div>' +
        console.log(repo)
    return markup;
}

function formatRepoSelection (repo) {
    repo.selected = true;
    repo.code = repo.id
    repo.name = repo.text
    if(repo.code == null || repo.code == ""){
        repo.text = '请选择一个停车场'
        repo.name = repo.text
    }
    $("#timeliness_owner_select").val(repo.id);
    console.log(repo);
    return repo.code ;
}

function time_stat_path_select() {
    //定义新数组
    var path_data = [];
    var _path_data = [];

    $("#tl_stat_path").autocomplete({
        source: _path_data
    });

    $("#tl_stat_path").keyup(
        function(event){
            var path=$("#tl_stat_path").val();
            if(path.length>0){
                var data_dict = send_get("/data_monitor/xch/hour_paths?path=" + path)
                console.log(data_dict)
                var data = data_dict['data'];
                console.log(data)

                var len = data.length;
                for(var i=0;i<len-1;i++){
                    path_data[i]=data[i];
                };
                console.log(path_data)
                $("#tl_hidden_path").val(path_data);
                console.log($("#tl_hidden_path").val())
                var _data=$("#tl_hidden_path").val().split(",");
                for(var j=0;j<_data.length;j++){
                    _path_data[j]=_data[j];
                }
            }
        }
    );
}


function pop_window(message) {
    layer.alert(message, {
        skin: 'layui-layer-lan',
        closeBtn: 0
    });
}



function task_action_click(item) {
    var click_span = $(item).children("span");
    var action = $(click_span).text();
    var td_arr = $(item).parent().parent().children();
    var db = td_arr[0].innerText;
    var table = td_arr[1].innerText;
    if (action == "启 用") {
        var json_data = send_get('/data_monitor/rule_check/switch?db=' + db + '&table=' + table + '&status=1');
        if (json_data['errno'] == 0) {
            $(click_span).attr("class", "bd_DW_task_status_start");
            var next = $(item).next().children("span");
            $(next).attr("class", "bd_DW_task_status_no");
        }
        else {
            pop_window(json_data['msg']);
        }
    }
    else if (action == "停 用") {
        var json_data = send_get('/data_monitor/rule_check/switch?db=' + db + '&table=' + table + '&status=0');
        if (json_data['errno'] == 0) {
            $(click_span).attr("class", "bd_DW_task_status_stop");
            var next = $(item).prev().children("span");
            $(next).attr("class", "bd_DW_task_status_no");
        }
        else {
            pop_window(json_data['msg']);
        }
    }
    else {
        pop_window("不能识别的任务状态");
    }
}


function get_task_config_list() {
    var post_data = new Object;
    post_data['cur_page'] = '1';

    post_data['db'] = $("input[name='DW_query_db']").val();
    post_data['table'] = $("input[name='DW_query_table']").val();
    post_data['owner'] = $("input[name='DW_query_owner']").val();

    var obj_arr = $('#bd_DW_task_list_query').parent().children();
    var index_tmp = $(obj_arr[1]).get(0).selectedIndex;
    post_data["status"] = $(obj_arr[1]).get(0).options[index_tmp].value;
    var json_data = send_post('/data_monitor/rule_check/task_config_page', post_data);
    $('#bd_DW_item_body').empty();
    $('#bd_DW_item_body').append(json_data['table']);
    $('#split_page').empty();
    $('#split_page').append(json_data['page']);
}

function timeliness_query() {
    var post_data = new Object;
    post_data['cur_page'] = '1';

    post_data['path'] = $("input[name='DW_query_path']").val();
    post_data['owner'] = $("input[name='DW_query_owner']").val();

    var json_data = send_post('/data_monitor/xch/timeliness_task_page', post_data);
    $('#bd_DW_timeliness_body').empty();
    $('#bd_DW_timeliness_body').append(json_data['table']);
    $('#split_page').empty();
    $('#split_page').append(json_data['page']);
}

function timeliness_config_list() {
    var post_data = new Object;
    post_data['cur_page'] = '1';

    post_data['path'] = $("input[name='DW_query_time_path']").val();
    post_data['owner'] = $("input[name='DW_query_time_owner']").val();
    post_data['status'] = $("#bd_DW_items_status_select").val();

    var json_data = send_post('/data_monitor/xch/time_config_page', post_data);
    $('#bd_DW_time_config_body').empty();
    $('#bd_DW_time_config_body').append(json_data['table']);
    $('#split_page').empty();
    $('#split_page').append(json_data['page']);
}

function field_timeliness() {
    $('#time_path').blur(function(){
        var
            path = $('#time_path').val(),
            json_data = send_get('/data_monitor/xch/time_config_item?path=' + path),
            categoryId = JSON.stringify(json_data["category"]),
            dataLevelId = JSON.stringify((json_data["data_level"])),
            businessLineId = JSON.stringify(json_data["business_line"]);

        if (JSON.stringify(json_data) != "{}") {
            $("#time_buffer_time").val(json_data['buffer_time']);
            $("#time_task_name").val(json_data['item_name']);
            $("#time_email").val(json_data['owner_email']);
            $("#time_phone").val(json_data['owner_phone']);
            $("#timeliness_owner_select").select2({data: [{id: json_data['owner'], text: json_data['owner']}]});
            $("#timeliness_owner_select").select2("val",json_data['owner']);
            owner_select(true);
            $("#bd_DW_monitor_status_select").val(json_data['status']);
            var cron_config = json_data['cron_config'];
            var list = cron_config.split(':');
            if (list[0] == '*') {
                $('#bd_DW_monitor_type_select').val('hour');
            }
            else {
                $('#bd_DW_monitor_type_select').val('day');
            }
            $("#time_hour").val(list[0]);
            $("#time_minute").val(list[1]);
            $("#timeliness_group_select").select2("val", json_data['alarm_group']);

            if(categoryId >= 1){
                $(".J_categories option[value='0']").removeProp("selected");
                $(".J_categories option[value='"+ categoryId + "']").prop("selected", true);
            }else{
                $(".J_categories").find("option[value='0']").prop("selected", true);
            }
            if(dataLevelId >= 1){
                $(".J_dataLevels option[value='0']").removeProp("selected");
                $(".J_dataLevels option[value='"+ dataLevelId + "']").prop("selected", true);
            }else{
                $(".J_dataLevels").find("option[value='0']").prop("selected", true);
            }
            if(businessLineId >= 1){
                $(".J_businessLines option[value='0']").removeProp("selected");
                $(".J_businessLines option[value='"+ businessLineId + "']").prop("selected", true);
            }else{
                $(".J_businessLines").find("option[value='0']").prop("selected", true);
            }
        }
    });
}

function rm_timeliness() {
    var path = $("#time_path").val();

    var json_data = send_get('/data_monitor/xch/time_config_rm?path=' + path);
    if (json_data['errno'] == 0) {
        pop_window('删除成功');
    } else if (json_data['errno'] == -1) {
        pop_window(json_data['msg']);
    }else {
        pop_window('删除失败');
    }
}


function add_timeliness(click_id) {
    var post_data = new Object;

    var min = $("#time_minute").val();
    var monitor_type = $("#bd_DW_monitor_type_select").val();
    if (monitor_type == 'day') {
        var hour = $("#time_hour").val();
        if (hour == '*') {
            pop_window('天级别监控小时不能配置为*');
            return 1;
        }
        post_data['cron_config'] = hour + ':' + min;
    }
    else {
        post_data['cron_config'] = '*:' + min;
    }

    post_data['buffer_time'] = $("#time_buffer_time").val();
    var path = $("#time_path").val();
    if (path != '请输入监控路径...') {
        post_data['path'] = path;
    } else {
        pop_window("请输入path");
        return
    }
    post_data['task_name'] = $("#time_task_name").val();
    value_tmp = $("#time_email").val();
    if (/例如/.test(value_tmp))
        post_data['owner_email'] = '';
    else
        post_data['owner_email'] = value_tmp;

    value_tmp = $("#time_phone").val();
    if (/例如/.test(value_tmp))
        post_data['owner_phone'] = '';
    else
        post_data['owner_phone'] = value_tmp;
    post_data['alarm_group'] = $('#timeliness_group_select').val();
    post_data['owner'] = $("#timeliness_owner_select").val();
    post_data['status'] = $("#bd_DW_monitor_status_select").val();
    post_data['category'] = $(".J_categories").val();
    post_data['data_level'] = $(".J_dataLevels").val();
    post_data['business_line'] = $(".J_businessLines").val();
    var json_data = send_post('/data_monitor/xch/send_timeliness_config', post_data);
    pop_window("添加任务成功");
}


function task_query() {
    var post_data = new Object;
    post_data['cur_page'] = '1';
    post_data['db'] = $("input[name='DW_query_db']").val();
    post_data['table'] = $("input[name='DW_query_table']").val();
    post_data['owner'] = $("input[name='DW_query_owner']").val();
    post_data['begin'] = $("input[name='queryDate1']").val();
    post_data['end'] = $("input[name='queryDate2']").val();

    var obj_arr = $('#bd_DW_task_query').parent().children();
    var index_tmp = $(obj_arr[7]).get(0).selectedIndex;
    post_data["status"] = $(obj_arr[7]).get(0).options[index_tmp].value;
    index_tmp = $(obj_arr[9]).get(0).selectedIndex;
    post_data["result"] = $(obj_arr[9]).get(0).options[index_tmp].value;

    var json_data = send_post('/data_monitor/rule_check/task_page', post_data);
    $('#bd_DW_task_body').empty();
    $('#bd_DW_task_body').append(json_data['table']);
    $('#split_page').empty();
    $('#split_page').append(json_data['page']);
}


function add_rule_1(rule_html, op) {
    if (op == '!='){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">!=</option>' +
            '    <option value="">=</option>' +
            '    <option value="">&gt;</option>' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;=</option>' +
            '</select>';
    }
    else if (op == '>'){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">&gt;</option>' +
            '    <option value="">!=</option>' +
            '    <option value="">=</option>' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;=</option>' +
            '</select>';
    }
    else if (op == '<'){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;</option>' +
            '    <option value="">!=</option>' +
            '    <option value="">=</option>' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;=</option>' +
            '</select>';
    }
    else if (op == '>='){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;</option>' +
            '    <option value="">!=</option>' +
            '    <option value="">=</option>' +
            '    <option value="">&lt;=</option>' +
            '</select>';
    }
    else if (op == '<='){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">&lt;=</option>' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;</option>' +
            '    <option value="">!=</option>' +
            '    <option value="">=</option>' +
            '</select>';
    }
    else {
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">=</option>' +
            '    <option value="">&lt;=</option>' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;</option>' +
            '    <option value="">!=</option>' +
            '</select>';
    }
    return rule_html;
}


function add_rule_2(rule_html, op) {
    if (op == '-'){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">-</option>' +
            '    <option value="">+</option>' +
            '    <option value="">*</option>' +
            '    <option value="">/</option>' +
            '    <option value="">=</option>' +
            '</select>';
    }
    else if (op == '*'){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">*</option>' +
            '    <option value="">-</option>' +
            '    <option value="">+</option>' +
            '    <option value="">/</option>' +
            '    <option value="">=</option>' +
            '</select>';
    }
    else if (op == '/'){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">/</option>' +
            '    <option value="">*</option>' +
            '    <option value="">-</option>' +
            '    <option value="">+</option>' +
            '    <option value="">=</option>' +
            '</select>';
    }
    else if (op == '='){
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">=</option>' +
            '    <option value="">/</option>' +
            '    <option value="">*</option>' +
            '    <option value="">-</option>' +
            '    <option value="">+</option>' +
            '</select>';
    }
    else {
        rule_html += '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">+</option>' +
            '    <option value="">-</option>' +
            '    <option value="">*</option>' +
            '    <option value="">/</option>' +
            '    <option value="">=</option>' +
            '</select>';
    }
    return rule_html;
}


function get_history_rule(rule_html, n) {
    var rule_id = $(n).attr('id');
    var obj_arr_6 = $(n).children();
    var len_tmp = obj_arr_6.length;
    var value_1 = $(obj_arr_6[1]).val();
    var index_tmp = $(obj_arr_6[2]).get(0).selectedIndex;
    var op = $(obj_arr_6[2]).get(0).options[index_tmp].text;
    var value_2 = $(obj_arr_6[3]).val();

    rule_html += '<div class="bd_DW_relation_block" id="' + rule_id + '">' +
        '<span class="glyphicon glyphicon-minus-sign bd_field_span_5"></span>' +
        '<input type="text" name="field_first" value="' + value_1 + '" class="bd_DW_input_len_150">';

    if (len_tmp > 4) {
        rule_html = add_rule_2(rule_html, op);
        rule_html += '<input type="text" name="field_second" value="' + value_2 + '" class="bd_DW_input_len_150">';

        index_tmp = $(obj_arr_6[4]).get(0).selectedIndex;
        var op_1 = $(obj_arr_6[4]).get(0).options[index_tmp].text;

        rule_html = add_rule_1(rule_html, op_1);
        var value_3 = $(obj_arr_6[5]).val();
        rule_html += '<input type="text" name="field_second" value="' + value_3 + '" class="bd_DW_input_len_150">';
    }
    else {
        rule_html = add_rule_1(rule_html, op);
        rule_html += '<input type="text" name="field_second" value="' + value_2 + '" class="bd_DW_input_len_150">';
    }
    rule_html += '</div>';
    return rule_html;
}


function rule_delete_click(click_id) {
    var rule_html = '';
    $('#' + click_id).parent().children().each(function(i, n) {
        var id_str = $(n).attr('id');
        if (id_str == click_id)
            return true;
        rule_html = get_history_rule(rule_html, n);
    });
    $('#bd_DW_rule_list').empty();
    $('#bd_DW_rule_list').append(rule_html);
}


function add_rule() {
    var operator = $('#bd_DW_rule_add_type option:selected').text();
    var op_type = 'one';
    if (operator == '二元操作')
        op_type = 'two';

    var rule_html = '';
    $('#bd_DW_rule_list').children().each(function(i, n) {
        rule_html = get_history_rule(rule_html, n);
    });

    var rule_list = $('#bd_DW_rule_list').children();
    var rule_len = rule_list.length;
    var rule_id = 'bd_DW_rule_list_';
    if (rule_len == 0) {
        rule_id += '0';
    }
    else {
        str_tmp = $(rule_list[rule_len - 1]).attr('id');
        arr_tmp = str_tmp.split('_');
        len_tmp = arr_tmp.length;
        rule_id += parseInt(arr_tmp[len_tmp -1]) + 1;
    }

    if (op_type == 'one') {
        rule_html += '<div class="bd_DW_relation_block" id="' + rule_id + '">' +
            '<span class="glyphicon glyphicon-minus-sign bd_field_span_5"></span>' +
            '<input type="text" name="field_first" value="" class="bd_DW_input_len_150">' +
            '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">=</option>' +
            '    <option value="">!=</option>' +
            '    <option value="">&gt;</option>' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;=</option>' +
            '</select>' +
            '<input type="text" name="field_second" value="" class="bd_DW_input_len_150">' +
            '</div>';
    }
    else {
        rule_html += '<div class="bd_DW_relation_block" id="' + rule_id + '">' +
            '<span class="glyphicon glyphicon-minus-sign bd_field_span_5"></span>' +
            '<input type="text" name="field_first" value="" class="bd_DW_input_len_150">' +
            '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">+</option>' +
            '    <option value="">-</option>' +
            '    <option value="">*</option>' +
            '    <option value="">/</option>' +
            '</select>' +
            '<input type="text" name="field_second" value="" class="bd_DW_input_len_150">' +
            '<select class="form-control input-sm bd_DW_field_operator">' +
            '    <option value="">=</option>' +
            '    <option value="">!=</option>' +
            '    <option value="">&gt;</option>' +
            '    <option value="">&lt;</option>' +
            '    <option value="">&gt;=</option>' +
            '    <option value="">&lt;=</option>' +
            '</select>' +
            '<input type="text" name="field_second" value="" class="bd_DW_input_len_150">' +
            '</div>';
    }
    $('#bd_DW_rule_list').empty();
    $('#bd_DW_rule_list').append(rule_html);
}


function parse_field_config(ret_arr) {
    var is_first = 1;
    var error = 0;
    $('#bd_DW_filed_conf').children().each(function(i, n) {
        if (is_first == 1) {
            is_first = 0;
            return true;
        }
        var class_name = $(n).attr('class');
        if (class_name == 'bd_field_config_block_none')
            return true;
        var post_data = new Object;
        var obj_arr_1 = $(n).children('div.bd_field_span_2').children();
        post_data['col_name'] = $.trim($(obj_arr_1[0]).text());
        post_data['comment'] = $.trim($(obj_arr_1[1]).text());
        var obj_arr_2 = $(n).children('div.bd_field_span_3').children();
        var obj_arr_2_1 = $(obj_arr_2[0]).children();
        if ($(obj_arr_2_1[0]).is(':checked') == true)
            post_data['empty'] = 1;
        else
            post_data['empty'] = 0;
        if ($(obj_arr_2_1[1]).is(':checked') == true)
            post_data['repeat'] = 1;
        else
            post_data['repeat'] = 0;
        post_data['threshold'] = new Object;
        if ($(obj_arr_2_1[2]).is(':checked') == true) {
            var obj_arr_3 = $(obj_arr_2_1[3]).children();
            post_data['threshold']['first'] = parseFloat($.trim($(obj_arr_3[0]).val()));
            post_data['threshold']['second'] = parseFloat($.trim($(obj_arr_3[1]).val()));
        }
        if ($(obj_arr_2_1[4]).is(':checked') == true)
            post_data['enum'] = parseInt($.trim($(obj_arr_2_1[5]).val()));
        else
            post_data['enum'] = 0;
        if ($(obj_arr_2_1[6]).is(':checked') == true)
            post_data['length'] = parseInt($.trim($(obj_arr_2_1[7]).val()));
        else
            post_data['length'] = 0;
        if ($(obj_arr_2_1[8]).is(':checked') == true)
            post_data['regex'] = $.trim($(obj_arr_2_1[9]).val());
        else
            post_data['regex'] = '';
        var obj_arr_2_2 = $(obj_arr_2[1]).children();
        if ($(obj_arr_2_2[0]).is(':checked') == true) {
            post_data['enum_detail'] = $.trim($(obj_arr_2_2[1]).val());
            if (post_data['enum_detail'] == '字段之间请用逗号分割, 例如: field_1,field_2') {
                pop_window('"枚举详情" 不能配置为 "字段之间请用逗号分割, 例如: field_1,field_2"')
                error = 1;
                return false;
            }
            if (post_data['enum'] != 0) {
                var str_arr = post_data['enum_detail'].split(',');
                if (str_arr.length != post_data['enum']) {
                    pop_window("配置的枚举个数不等于枚举详情中的个数");
                    error = 1;
                    return false;
                }
            }
        }
        else
            post_data['enum_detail'] = "";
        ret_arr.push(post_data);
    });
    if (error == 0)
        return 0;
    else
        return 1;
}


function parse_table_config(post_data) {
    var obj_arr_1 = $('#bd_DW_table_conf').children();
    post_data['time'] = $.trim($("input[name='queryDate']").val());

    var obj_arr_2 = $(obj_arr_1[1]).children();
    //post_data['split'] = $(obj_arr_2[1]).val();
    post_data['owner'] = $.trim($(obj_arr_2[1]).val());

    post_data['record_count'] = new Object;
    var obj_arr_3 = $(obj_arr_1[3]).children();
    if ($(obj_arr_3[0]).is(':checked') == true) {
        post_data['record_count']['first'] = parseInt($.trim($(obj_arr_3[1]).val()));
        post_data['record_count']['second'] = parseInt($.trim($(obj_arr_3[2]).val()));
    }

    var obj_arr_4 = $(obj_arr_1[4]).children();
    if ($(obj_arr_4[0]).is(':checked') == true) {
        var index_tmp = $(obj_arr_4[1]).get(0).selectedIndex;
        var monitor_type = $(obj_arr_4[1]).get(0).options[index_tmp].text;
        var min = $.trim($(obj_arr_4[4]).val());
        if (monitor_type == '天级') {
            var hour = $.trim($(obj_arr_4[3]).val());
            if (hour == '*') {
                pop_window('天级别监控小时不能配置为*');
                return 1;
            }
            post_data['cron_config'] = hour + ':' + min;
        }
        else {
            post_data['cron_config'] = '*:' + min;
        }
    }

    var obj_arr_5 = $(obj_arr_1[5]).children();
    if ($(obj_arr_5[0]).is(':checked') == true) {
        post_data['union_key'] = $.trim($(obj_arr_5[1]).val());
        if (post_data['union_key'] == '字段之间请用逗号分割, 例如: field_1,field_2') {
            pop_window('"联合主键" 不能配置为 "字段之间请用逗号分割, 例如: field_1,field_2"')
            return 1;
        }
    }

    // 原：业务规则code
    // post_data['relative'] = [];
    // $('#bd_DW_rule_list').children().each(function(i, n) {
    //     var arr_tmp = [];
    //     var obj_arr_6 = $(n).children();
    //     var len_tmp = obj_arr_6.length;
    //     var str_tmp = $.trim($(obj_arr_6[1]).val());
    //     arr_tmp.push(str_tmp);
    //     var index_tmp = $(obj_arr_6[2]).get(0).selectedIndex;
    //     str_tmp = $(obj_arr_6[2]).get(0).options[index_tmp].text;
    //     arr_tmp.push(str_tmp);
    //     str_tmp = $.trim($(obj_arr_6[3]).val());
    //     arr_tmp.push(str_tmp);
    //     if (len_tmp > 4) {
    //         index_tmp = $(obj_arr_6[4]).get(0).selectedIndex;
    //         str_tmp = $(obj_arr_6[4]).get(0).options[index_tmp].text;
    //         arr_tmp.push(str_tmp);
    //         str_tmp = $.trim($(obj_arr_6[5]).val());
    //         arr_tmp.push(str_tmp);
    //     }
    //     post_data['relative'].push(arr_tmp);
    // });
    return 0;
}


function parse_notification_config(ret_dict) {
    var obj_arr_1 = $('#bd_DW_notification_conf').children();

    var obj_arr_2 = $(obj_arr_1[1]).children();
    var mail_checked = $(obj_arr_2[0]).is(':checked');
    ret_dict['owner_email'] = $.trim($(obj_arr_2[1]).val());
    if (ret_dict['owner_email'] == '请用逗号分割, 例如: zhangsan,lisi') {
        pop_window('"邮件通知" 不能配置为 "请用逗号分割, 例如: zhangsan,lisi"')
        return 1;
    }

    var obj_arr_3 = $(obj_arr_1[2]).children();
    var phone_checked = $(obj_arr_3[0]).is(':checked');
    ret_dict['owner_phone'] = $.trim($(obj_arr_3[1]).val());
    if (ret_dict['owner_phone'] == '请用逗号分割, 例如: 13012341234,13512341235') {
        pop_window('"短信通知" 不能配置为 "请用逗号分割, 例如: 13012341234,13512341235"')
        return 1;
    }

    if (mail_checked == true && phone_checked == true)
        ret_dict['notification_conf'] = 3;
    else if (mail_checked == true && phone_checked == false)
        ret_dict['notification_conf'] = 1;
    else if (mail_checked == false && phone_checked == true)
        ret_dict['notification_conf'] = 2;
    else
        ret_dict['notification_conf'] = 4;
    return 0;
}


function config_create_click() {
    var db = $("input[name='DW_query_db']").val();
    var table = $("input[name='DW_query_table']").val();
    //layer.load(2);
    //setTimeout(function(){
    //    layer.closeAll('loading');
    //}, 10000);
    var index = layer.load(1, {
        shade: [0.1,'#fff'] //0.1透明度的白色背景
    });
    //var json_data = send_get('/data_monitor/rule_check/get_new_table_config?db=' + db + '&table=' + table);
    var json_data = send_get_async('/data_monitor/rule_check/get_new_table_config?db=' + db + '&table=' + table);
}


function config_submit_click() {
    var ret_dict = new Object;
    var ret_arr = [];
    var ret = parse_field_config(ret_arr);
    if (ret == 1)
        return 1;
    ret_dict['field_conf'] = JSON.stringify(ret_arr);

    post_data = new Object;
    ret = parse_table_config(post_data);
    if (ret == 1)
        return 1;
    ret_dict['time'] = post_data['time'];
    ret_dict['relation_conf'] = JSON.stringify(post_data['relative']);
    ret_dict['cron_config'] = post_data['cron_config'];
    ret_dict['table_conf'] = JSON.stringify(post_data);

    ret = parse_notification_config(ret_dict);
    if (ret == 1)
        return 1;

    ret_dict['db'] = $.trim($("input[name='DW_query_db']").val());
    ret_dict['table'] = $.trim($("input[name='DW_query_table']").val());
    ret_dict['username'] = $("#DW_username").text();
    ret_dict['email'] = $("#DW_email").text();
    ret_dict['phone'] = $("#DW_phone").text();
    var json_data = send_post('/data_monitor/rule_check/send_table_config', ret_dict);
    if (json_data['errno'] == '0') {
        pop_window('提交成功');
    }
    else if (json_data['errno'] == '-1') {
        pop_window(json_data['msg']);
    }
    else {
        pop_window('submit failed');
    }
}



function config_test_click() {
    var ret_dict = new Object;
    var ret_arr = [];
    var ret = parse_field_config(ret_arr);
    if (ret == 1)
        return 1;
    ret_dict['field_conf'] = JSON.stringify(ret_arr);

    post_data = new Object;
    ret = parse_table_config(post_data);
    if (ret == 1)
        return 1;
    ret_dict['time'] = post_data['time'];
    ret_dict['relation_conf'] = JSON.stringify(post_data['relative']);
    ret_dict['cron_config'] = post_data['cron_config'];
    ret_dict['table_conf'] = JSON.stringify(post_data);

    ret = parse_notification_config(ret_dict);
    if (ret == 1)
        return 1;

    ret_dict['db'] = $.trim($("input[name='DW_query_db']").val());
    ret_dict['table'] = $.trim($("input[name='DW_query_table']").val());
    ret_dict['username'] = $("#DW_username").text();
    ret_dict['email'] = $("#DW_email").text();
    ret_dict['phone'] = $("#DW_phone").text();
    var index = layer.load(1, {
        shade: [0.1,'#fff'] //0.1透明度的白色背景
    });
    var json_data = send_post_async('/data_monitor/rule_check/submit_test', ret_dict);
}


function field_delete_click(click_id) {
    var str_arr = click_id.split('_');
    var arr_len = str_arr.length;
    if (arr_len == 4) {
        field_id = str_arr[3];
        delete_id = 'bd_DW_field_delete_' + field_id;
        $('#' + click_id).parent().removeClass();
        $('#' + click_id).parent().addClass('bd_field_config_block_none');
        $('#' + delete_id).parent().removeClass();
        $('#' + delete_id).parent().addClass('bd_field_delete_item');
    }
    else {
        delete_id = str_arr[4];
        field_id = 'bd_DW_field_' + delete_id;
        $('#' + field_id).parent().removeClass();
        $('#' + field_id).parent().addClass('bd_field_config_block');
        $('#' + click_id).parent().removeClass();
        $('#' + click_id).parent().addClass('bd_field_delete_item_none');
    }
}


function get_check_result() {
    var db = $("input[name='DW_query_db']").val();
    var table = $("input[name='DW_query_table']").val();
    var queryDate = $("input[name='queryDate']").val();

    var json_data = send_get('/data_monitor/rule_check/get_check_result?db=' + db + '&table=' + table + '&date=' + queryDate);
    if (json_data['msg'] == 'result not exists') {
        pop_window(db + '.' + table + ' ' + queryDate + ' result not exist!');
        return;
    }

    if (json_data['field_result'] == "\n" && json_data['table_result'] == "\n" && json_data['relation_result']) {
        pop_window('检查结果都正确');
        return;
    }
    $('#bd_DW_field_body').empty();
    $('#bd_DW_field_body').append(json_data['field_result']);
    $('#bd_DW_table_body').empty();
    $('#bd_DW_table_body').append(json_data['table_result']);
    $('#bd_DW_relation_body').empty();
    $('#bd_DW_relation_body').append(json_data['relation_result']);

    /*var regex_list = $("[name='regex_result']");
    console.log(regex_list);
    for (var i=0; i< regex_list.length; i++) {
        var value = $(regex_list[i]).val();
        value = value.replace(/#/g, "\\");
        $(regex_list[i]).val(value);
        console.log(value)
    }*/
}


function get_table_config() {
    var db = $("input[name='DW_query_db']").val();
    var table = $("input[name='DW_query_table']").val();
    var json_data = send_get('/data_monitor/rule_check/get_table_config?db=' + db + '&table=' + table);
    if (json_data['msg'] == 'table not exists') {
        pop_window(db + '.' + table + ' not exist!');
        return;
    }
    $('#bd_DW_filed_conf').empty();
    $('#bd_DW_filed_conf').append(json_data['field']);
    $('#bd_DW_filed_delete').empty();
    $('#bd_DW_filed_delete').append(json_data['delete']);
    $('#bd_DW_table_conf').empty();
    $('#bd_DW_table_conf').append(json_data['table']);
    $('#bd_DW_notification_conf').empty();
    $('#bd_DW_notification_conf').append(json_data['notification']);
    $('#bd_DW_submit_block').empty();
    $('#bd_DW_submit_block').append('<button type="button" class="didi-btn didi-btn-ok margin-left-30 adjust-position-style" id="bd_DW_config_test">测 试</button>' +
        '<button type="button" class="didi-btn didi-btn-highlight adjust-position-style" id="bd_DW_config_submit">提 交</button>');
    var owner = $("input[name='table_owner']").val();
    if (owner == "") {
        $("input[name='table_owner']").val(username);
    }

    // add by yangfan, for \\ parse bad influence
    var regex_list = $("[name='regex_input']");
    console.log(regex_list);
    for (var i=0; i< regex_list.length; i++) {
        var value = $(regex_list[i]).val();
        value = value.replace(/#/g, "\\");
        $(regex_list[i]).val(value);
        console.log(value)
    }
    //$("[name='regex_input']").each(function(j, item) {
    //    var value = item.val();
    //    value = value.replace(/#/g, "\\");
    //    item.val(value);
    //    console.log(value)
    //});

}


function jump_specify_page() {
    var post_data = new Object;
    post_data['cur_page'] = $("input[name='specify_page']").val();
    var url_path = window.location.pathname;
    if (url_path == '/data_monitor/xch/timeliness_config') {
        post_data['path'] = $("input[name='DW_query_path']").val();
        post_data['owner'] = $("input[name='DW_query_owner']").val();
        var json_data = send_post('/data_monitor/xch/timeliness_task_page', post_data);
        $('#bd_DW_timeliness_body').empty();
        $('#bd_DW_timeliness_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }
    if (url_path == '/data_monitor/xch/time_config_list') {
        post_data['path'] = $("input[name='DW_query_time_path']").val();
        post_data['owner'] = $("input[name='DW_query_time_owner']").val();
        var json_data = send_post('/data_monitor/xch/time_config_page', post_data);
        $('#bd_DW_time_config_body').empty();
        $('#bd_DW_time_config_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }
    else if (url_path == '/data_monitor/rule_check/task') {
        post_data['db'] = $("input[name='DW_query_db']").val();
        post_data['table'] = $("input[name='DW_query_table']").val();
        post_data['owner'] = $("input[name='DW_query_owner']").val();
        post_data['begin'] = $("input[name='queryDate1']").val();
        post_data['end'] = $("input[name='queryDate2']").val();

        var obj_arr = $('#bd_DW_task_query').parent().children();
        var index_tmp = $(obj_arr[7]).get(0).selectedIndex;
        post_data["status"] = $(obj_arr[7]).get(0).options[index_tmp].value;
        index_tmp = $(obj_arr[9]).get(0).selectedIndex;
        post_data["result"] = $(obj_arr[9]).get(0).options[index_tmp].value;
        var json_data = send_post('/data_monitor/rule_check/task_page', post_data);
        $('#bd_DW_task_body').empty();
        $('#bd_DW_task_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }
    else if (url_path == '/data_monitor/rule_check/task_list') {
        post_data['db'] = $("input[name='DW_query_db']").val();
        post_data['table'] = $("input[name='DW_query_table']").val();
        post_data['owner'] = $("input[name='DW_query_owner']").val();
        var obj_arr = $('#bd_DW_task_list_query').parent().children();
        var index_tmp = $(obj_arr[1]).get(0).selectedIndex;
        post_data["status"] = $(obj_arr[1]).get(0).options[index_tmp].value;
        var json_data = send_post('/data_monitor/rule_check/task_config_page', post_data);
        $('#bd_DW_item_body').empty();
        $('#bd_DW_item_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }
}


function draw_split_page(click_id){
    var post_data = new Object;
    str_arr = click_id.split('_');
    post_data['cur_page'] = str_arr[1];
    var url_path = window.location.pathname;
    if (url_path == '/data_monitor/xch/timeliness_config') {
        post_data['path'] = $("input[name='DW_query_path']").val();
        post_data['owner'] = $("input[name='DW_query_owner']").val();
        var json_data = send_post('/data_monitor/xch/timeliness_task_page', post_data);
        $('#bd_DW_timeliness_body').empty();
        $('#bd_DW_timeliness_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }
    if (url_path == '/data_monitor/xch/time_config_list') {
        post_data['path'] = $("input[name='DW_query_time_path']").val();
        post_data['owner'] = $("input[name='DW_query_time_owner']").val();
        var json_data = send_post('/data_monitor/xch/time_config_page', post_data);
        $('#bd_DW_time_config_body').empty();
        $('#bd_DW_time_config_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }
    else if (url_path == '/data_monitor/rule_check/task') {
        post_data['db'] = $("input[name='DW_query_db']").val();
        post_data['table'] = $("input[name='DW_query_table']").val();
        post_data['owner'] = $("input[name='DW_query_owner']").val();
        post_data['begin'] = $("input[name='queryDate1']").val();
        post_data['end'] = $("input[name='queryDate2']").val();

        var obj_arr = $('#bd_DW_task_query').parent().children();
        var index_tmp = $(obj_arr[7]).get(0).selectedIndex;
        post_data["status"] = $(obj_arr[7]).get(0).options[index_tmp].value;
        index_tmp = $(obj_arr[9]).get(0).selectedIndex;
        post_data["result"] = $(obj_arr[9]).get(0).options[index_tmp].value;

        var json_data = send_post('/data_monitor/rule_check/task_page', post_data);
        $('#bd_DW_task_body').empty();
        $('#bd_DW_task_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }
    else if (url_path == '/data_monitor/rule_check/task_list') {
        post_data['db'] = $("input[name='DW_query_db']").val();
        post_data['table'] = $("input[name='DW_query_table']").val();
        post_data['owner'] = $("input[name='DW_query_owner']").val();
        var obj_arr = $('#bd_DW_task_list_query').parent().children();
        var index_tmp = $(obj_arr[1]).get(0).selectedIndex;
        post_data["status"] = $(obj_arr[1]).get(0).options[index_tmp].value;
        var json_data = send_post('/data_monitor/rule_check/task_config_page', post_data);
        $('#bd_DW_item_body').empty();
        $('#bd_DW_item_body').append(json_data['table']);
        $('#split_page').empty();
        $('#split_page').append(json_data['page']);
    }

}

function init_get_tl_stat() {
    if (window.location.pathname == "/data_monitor/xch/timeliness_result") {
        get_tl_stat_init();
    }
}

function get_tl_stat_init() {
    var path = '/user/xiaoju/data/bi/beatles_ods/beatles_strive_order';
    var date = getNowFormatDate();
    $("#tl_stat_time").val(date);
    console.log(date);
    var url = '/data_monitor/xch/timeliness_get_static?path=' + path + '&date=' + date;
    console.log(url);
    $.ajax({
        type: 'GET',
        async: false,
        url: url,
        data: '',
        dataType: 'json',
        success: function (data) {
            show_tl_stat(data);
        }
    });
}

function get_tl_stat() {
    var path = $("#tl_stat_path").val();
    var date = $("#tl_stat_time").val();
    console.log(date);
    var url =  '/data_monitor/xch/timeliness_get_static?path=' + path + '&date=' + date;
    console.log(url);
    $.ajax({
        type: 'GET',
        async: false,
        url: url,
        data:'',
        dataType: 'json',
        success: function(data){
            show_tl_stat(data);
        }
    });
}

function show_tl_stat(data) {
    var time_series = []
    for(var i=0; i<24; i++){
        time_series.push(i)
    }
    var date = $("#tl_stat_time").val();
    var size = data['size'];
    var time = data['time'];
    if (size.length > 0 && time.length > 0) {
        $("#tl_size_label").text('文件大小');
        $("#tl_time_label").text('产出时间');
    } else {
        pop_window('无历史数据, 请检查路径和日期!')
    }
    var ctx = document.getElementById("tl_time_pic");
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time_series,
            datasets: [{
                label:'产出时间(' + date + ')',
                backgroundColor: "transparent",
                borderColor: "orange",
                pointBorderColor: "orange",
                pointHoverBorderColor: "orange",
                pointBorderWidth: 1,
                data: time[1],
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true, // X轴 上竖线是否显示
                    color: '#ffffff', //颜色
                    stacked: true,
                    scaleLabel: {
                        display: true, // x轴下面显示 x名字 是否显示
                        labelString: '数据时间(hrs)', //名字
                    },
                    gridLines: {
                        color: 'green', // X轴 上竖线颜色
                        zeroLineColor: "green" // 起点的颜色
                    },
                    ctx: {
                        font: "18px  Helvetica, Arial, sans-serif"
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '实际产出时间-数据时间(min)'
                    },
                    ticks: { // 刻度线
                        suggestedMin: 0,
                        suggestedMax: 180,
                    },
                    gridLines: {
                        color: 'green',
                        zeroLineColor: "green"
                    }
                }]
            },
            legend: {
                align: 'center', //程度标的目标地位
                verticalAlign: 'bottom', //垂直标的目标地位
                x: 0, //间隔x轴的间隔
                y: 0, //间隔Y轴的间隔
                labelFormatter: function() {
                    /*
                     *  格式化函数可用的变量：this， 可以用 console.log(this) 来查看包含的详细信息
                     *  this 代表当前数据列对象，所以默认的实现是 return this.name
                     */
                    return  '(Click to hide or show)';

                }
            }
        }
    });
    var ctx = document.getElementById("tl_size_pic");
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time_series,
            datasets: [{
                label:'文件大小(' + date + ')',
                backgroundColor: "transparent",
                borderColor: "purple",
                pointBorderColor: "purple",
                pointHoverBorderColor: "purple",
                pointBorderWidth: 1,
                data: size[1]
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true, // X轴 上竖线是否显示
                    color: '#ffffff', //颜色
                    stacked: true,
                    scaleLabel: {
                        display: true, // x轴下面显示 x名字 是否显示
                        labelString: '数据时间(hrs)', //名字
                    },
                    gridLines: {
                        color: 'green', // X轴 上竖线颜色
                        zeroLineColor: "green" // 起点的颜色
                    },
                    ctx: {
                        font: "18px  Helvetica, Arial, sans-serif"
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '文件大小(MB)'
                    },
                    //ticks: { // 刻度线
                    //    suggestedMin: 0,
                    //    suggestedMax: 250,
                    //},
                    gridLines: {
                        color: 'green',
                        zeroLineColor: "green"
                    }
                }]
            },
            legend: {
                align: 'center', //程度标的目标地位
                verticalAlign: 'bottom', //垂直标的目标地位
                x: 0, //间隔x轴的间隔
                y: 0, //间隔Y轴的间隔
                labelFormatter: function() {
                    /*
                     *  格式化函数可用的变量：this， 可以用 console.log(this) 来查看包含的详细信息
                     *  this 代表当前数据列对象，所以默认的实现是 return this.name
                     */
                    return  '(Click to hide or show)';

                }
            }
        }
    });

}


function draw_timline_static() {
    var path = $("input[name='DW_query_path']").val();
    var url = '/data_monitor/xch/timeliness_get_static?path=' + path;
    var json_data = send_get(url);
    draw_highchart(json_data['XData'], json_data['YData']);
}

function draw_highchart(XData, YData) {
    $('#bd_DW_timeliness_static_pic').highcharts({
        chart: {
            type: 'line',
            margin: [ 50, 50, 100, 80]
        },
        title: {
            text: '及时性数据统计'
        },
        xAxis: {
            tickInterval : 6,
            title: {
                text: '日期'
            },
            categories: XData,
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                text: '小时'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            enabled: true
        },
        tooltip: {
            pointFormat: '小时: <b>{point.y:.1f}</b>',
        },
        series: [{
            name: '小时',
            data: YData,
            marker: {
                enabled: true,
                symbol: 'circle',
                //fillColor:'#ff3300',
                radius: 3
            },
            dataLabels: {
                enabled: false,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
    });
}

function send_post(url, post_data){
    var json_data = "";
    $.ajax({
        type:"post",
        url:url,
        datatype:"json",
        async: false,
        data:post_data,
        error: function() {
            pop_window("请求数据失败");
        },
        success:function(data){
            //json_data = $.parseJSON(data);
            json_data = data;
        },
    });
    return json_data;
}

function send_post_async(url, post_data) {
    var json_data = "";
    $.ajax({
        type:"post",
        url:url,
        datatype:"json",
        async: true,
        data:post_data,
        error: function() {
            pop_window("请求数据失败");
        },
        success:function(data) {
            setTimeout(function(){
                layer.closeAll('loading');
            }, 10);
            json_data = data;
            if (json_data['errno'] == '0') {
                pop_window('提交成功');
            }
            else if (json_data['errno'] == '-1') {
                pop_window(json_data['msg']);
            }
            else {
                pop_window('submit failed');
            }
        },
    });
    return json_data;
}

function send_get(url) {
    var json_data = "";
    $.ajax({
        type:"get",
        url:url,
        datatype:"json",
        async: false,
        error: function() {
            pop_window("请求数据失败");
        },
        success:function(data) {
            //json_data = $.parseJSON(data);
            json_data = data;
        },
    });
    return json_data;
}
function send_get_async(url) {
    var json_data = "";
    $.ajax({
        type:"get",
        url:url,
        datatype:"json",
        async: true,
        error: function() {
            pop_window("请求数据失败");
        },
        success:function(data) {
            setTimeout(function(){
                layer.closeAll('loading');
            }, 10);
            json_data = data;
            if (json_data['errno'] == '0') {
                pop_window('提交成功');
            }
            else if (json_data['errno'] == '-1') {
                pop_window(json_data['msg']);
            }
            else {
                pop_window('submit failed');
            }
        },
    });
    return json_data;
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getColor(s) {
    var bg = ''
    switch (s) {
        case 1:
            bg = '<span class="badge bg-green">启用</span>';
            break;
        case 0:
            bg = '<span class="badge bg-red">停用</span>';
            break;
    }
    return bg
}

function getStatusColor(s) {
    var bg='';
    switch (s) {
        case "running":
            bg = '<span class="badge bg-blue">running</span>';
            break;
        case "waiting":
            bg = '<span class="badge bg-gray">waiting</span>';
            break;
        case 'failed':
            bg = '<span class="badge bg-red">failed</span>';
            break;
        case 'success':
            bg = '<span class="badge bg-green">success</span>';
            break;
        case 'correct':
            bg = '<span class="badge bg-green">correct</span>';
            break;
        case 'error':
            bg = '<span class="badge bg-red">error</span>';
            break;
    }
    return bg
}

/**
 * 获取下拉列表数据
 */
function getSelectData() {
    var
        json_data;

    $.ajax({
        type:"get",
        url: '/data_monitor/xch/timeliness_category',
        dataType:"json",
        async: false,
        success:function(data){
            json_data = data;
            renderSelect(json_data.data);
        },
        error: function() {
            pop_window("请求数据失败");
        }
    });
}
/**
 * 渲染下拉列表
 * @param data
 */
function renderSelect(data) {
    var
        categoriesStr = '',
        dataLevelsStr = '',
        businessLinesStr = '',
        categoriesData,
        dataLevelsData,
        businessLinesData,
        categoriesObject,
        dataLevelsObject,
        businessLinesObject;

    categoriesData = data["categories"];
    dataLevelsData = data["data_levels"];
    businessLinesData = data["business_lines"];
    //使用场景
    for(var i = 0; i < categoriesData.length; i++){
        categoriesObject = categoriesData[i];
        categoriesStr += '<option value="'+ categoriesObject["category_id"] +'">'+ categoriesObject["category_name"] + '</option>';
    }
    //数据层级
    for(var j = 0; j < dataLevelsData.length; j++){
        dataLevelsObject = dataLevelsData[j];
        dataLevelsStr += '<option value="'+ dataLevelsObject["data_level_id"] +'">'+ dataLevelsObject["data_level_name"] + '</option>';
    }
    //业务线
    for(var k = 0; k < businessLinesData.length; k++){
        businessLinesObject = businessLinesData[k];
        businessLinesStr += '<option value="'+ businessLinesObject["business_line_id"] +'">'+ businessLinesObject["business_line_name"] + '</option>';
    }
    $(".J_categories").append(categoriesStr);
    $(".J_dataLevels").append(dataLevelsStr);
    $(".J_businessLines").append(businessLinesStr);
    $(".J_category").append(categoriesStr);
    $(".J_dataLevel").append(dataLevelsStr);
    $(".J_businessLine").append(businessLinesStr);
}

//新增需求：业务规则模块
/**
 * 添加业务规则
 */
$(document).on('click', '.J_addRule', function () {
    var
        ruleStr = '',
        isCanAdd;

    if($('.J_tip').length != 0){
        $('.J_tip').remove();
    }
    //判断是否可以添加
    isCanAdd = forbidAdd();
    if(isCanAdd){
        ruleStr = '<div class="J_rule rule-item"><i class="glyphicon glyphicon-minus-sign J_del" style="color: red;"></i>'+
            '<input type="text" class="J_ruleDims"><select class="J_relate"><option value="0">不关联</option><option value="1">关联全表</option> <option value="2">关联字段</option></select>'+
            '<div class="J_detail hidden"></div></div>';
        $('.J_ruleList').append(ruleStr);
    }
});
/**
 * 若存在编辑项，禁止添加
 * @returns {boolean}
 */
function forbidAdd() {
    var
        lastEl = $('.J_ruleList').children('.J_rule').last(),
        ruleInp = $(lastEl).children('.J_ruleDims'),
        lastInpVal = $.trim($(ruleInp).val()),
        repeatTipStr = '<span class="J_repeatTip">请先完成此添加';

    if( ($(ruleInp).length != 0)  && (lastInpVal == '')){
        $('.J_ruleList').children('.J_rule').last('.J_relate').append(repeatTipStr);
        setTimeout(function () {
            $('.J_repeatTip').remove();
        }, 1000);
        return false;
    }else{
        return true;
    }
}
/**
 * 根据选择的关联方式，渲染不同的效果
 */
$(document).on('change', '.J_relate', function (e) {
    var
        detailEl =  $(e.target).next('.J_detail');

    if($(this).val() == 2){
        $(detailEl).removeClass('hidden');
        getDetail(e.target);
    }else if(($('.J_relate').val() == 0) || ($('.J_relate').val() == 1)){
        if(!$(detailEl).hasClass('hidden')){
            $(detailEl).addClass('hidden');
        }
    }
});
/**
 * 删除业务规则
 */
$(document).on('click', '.J_del', function (e) {
    $(e.target).parents('.J_rule').remove();
    noContentTip();
});
function noContentTip() {
    var
        tipStr = '<p class="no-content-tip J_tip">暂无内容</p>';

    if($('.J_ruleList').children('.J_rule').length == 0){
        $('.J_ruleList').append(tipStr);
    }
}

/**
 * 获取关联字段详情
 * @param ev
 */
function getDetail(ev) {
    var
        checkboxStr = '',
        optionVal,
        selectContainer = $(ev).next('.J_detail'),
        count = 0;

    $(selectContainer).empty();
    //检查是否有可关联的字段
    if($('.conf-field').length != 0){
        $('.conf-field').each(function (index, item) {
            optionVal = $(item).text();
//          checkboxStr += '<input type="checkbox" value="'+optionVal+'">'+ optionVal;
            checkboxStr += '<span class="checkboxItem"><input type="checkbox" value="'+ optionVal +'" name="" id="r'+count+'">'+optionVal+'<label for="r'+count+'"></label></span>';
            count ++;
        });
    }else{
        checkboxStr = '<span>暂无可关联字段</span>'
    }
    $(selectContainer).append(checkboxStr);

}