/**
 * Created by hujunhujun_i on 2017/3/16.
 */
/**
 * Created by hujunhujun_i on 2017/2/20.
 */
// 配置后端相关接口
var
    el = {
        //任务名
        jobNameEl: '.J_jobName',
        //执行方式
        executeWayEl: '.J_executeWay',
        //执行标准
        selectStandardEl: '.J_compareSymble',
        //有范围时的样式
        rangeStyle: '.J_rangeStyle',
        //无范围时的样式
        generalStyle: '.J_generalStyle',
        //暂存比较值的结果
        compareValueInp: '.J_compareValue',
        compareValueFromEl: '.J_compareValueFrom',
        compareValueToEl: '.J_compareValueTo',
        generalCompareValueEl: '.J_generalCompareValue',
        //时间选择下拉列表
        cronConfigEl: '.J_cronConfig',
        //时间-点
        hourEl: '.J_hour',
        //时间-分
        minuteEl: '.J_minute',
        //暂存时间结果
        cronConfigResultInp: '.J_cronConfigResult',
        //超时
        bufferTimeEl: '.J_bufferTime',
        //状态
        statusEl: '.J_status',
        //状态按钮
        statusBtn: '.J_statusBtn',
        //负责人
        ownerEl: '.J_owner',
        //报警组
        alarmGroupEl: '.J_alarmGroup',
        //报警组下拉列表
        alarmSelect: '.timeliness_group_select',
        //sql
        sqlsEl: '.J_sqls',
        //暂存id
        hiddenJobId: '.J_jobId',
        //选择报警组后渲染的区域
        selectRenderResult: '.select2-selection__rendered',
        //保存
        saveTrigger: '.J_save',
        //返回
        returnTrigger: '.J_return',
        //编辑
        editTrigger: '.J_edit',
        //删除
        delTrigger: '.J_del',
        //启用/停用
        changeStatusTrigger: '.J_status',
        //查询
        searchTrigger: '.J_search',
        //状态查询下拉列表
        statusSearchTrigger: '.J_statusSearch',
        //搜索负责人
        ownerSearchEl: '.J_ownerSearch',
        //列表
        hiveMonitorTable: '#hive_monitor_table',
        //请求列表数据
        requestTableDataUrl: '/data_monitor/xch/hive_jobs',
        //save url
        saveUrl: '/data_monitor/xch/send_hive_config',
        //删除 url
        deleteUrl: '/data_monitor/xch/hive_config_rm?job_id=',
        //编辑Url
        editUrl : '/data_monitor/xch/get_hive_config?job_id=',
        //启用、停用
        changeStatusUrl: '/data_monitor/xch/update_hive_status'
    },
    //调用组件后返回的对象
    tableEl;

$(document).ready(function () {
    buildEvent();
});

function alarm_group_select() {
    var ret = send_get('/data_monitor/alarm_group/group_lists');
    var ret_data = ret['data'];
    var data = [];
    for(var i=0; i< ret_data.length; i++) {
        data.push({id: ret_data[i], text: ret_data[i]})
    }
    $("#hive_group_select").select2({data : data})
}

function buildEvent(){
    //保存
    $(document).on('click', el.saveTrigger, function (e) {
        var
            sendData = validate();
        if(sendData != false){
            sendAjax(sendData);
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
    //选择执行标准时触发
    $(document).on('change', el.selectStandardEl, function () {
        controlSelectStandard();
    });
    //选择时间下拉列表
    $(document).on('change', el.cronConfigEl, function () {
        controlSelectTime();
    });
    //状态：启用/停用
    $(document).on('change', 'input:radio[name="status"]', function (e) {
        setStatusValue(e.target);
    });
    //删除
    // $(document).on('click', el.delTrigger, function (e) {
    //     delJob(e.target);
    //     e.stopPropagation();
    //     e.stopImmediatePropagation();
    // });
    $(document).on('click', el.editTrigger, function (e) {
        controlPageConvert(e.target);
    });
    //查询
    $(document).on('click', el.searchTrigger, function () {
        hive_monitor_table();
    });
    // //更改启用/停用
    // $(document).on('click', el.changeStatusTrigger, function (e) {
    //     sendChangeStatusAjax(e.target);
    // });
    $(document).on('click', el.returnTrigger, function (e) {
        returnList();
    });
    $(document).on('keyup', el.sqlsEl, function () {
        highLighterCode();
    });
}
function returnList(){
    window.open('hive_monitor_list', '_self');
}
function highLighterCode() {
    var
        code = $(el.sqlsEl).val(),
        highLightCode;

    highLightCode = wangHighLighter.highLight('SQL', 'visual Studio', code);
    // $(el.sqlsEl).text(highLightCode);
    $('.J_div').html(highLightCode);
}

function sendChangeStatusAjax(jobId) {
    var
        status = $(ev).attr('data-status');
    // jobId = (tableEl.row($(ev).parents('tr') ).data())[6];

    $.ajax({
        type:"post",
        url: el.changeStatusUrl,
        dataType:"json",
        data: { job_id: jobId, status: status },
        async: false,
        success:function(returnData){
            if(returnData['errno'] == '0'){
                if(status == 0){
                    $(ev).text('启用');
                    $(ev).attr('data-status', '1');
                    $($(ev).parents('tr').children('td')[3]).text('停用');
                }else{
                    $(ev).text('停用');
                    $(ev).attr('data-status', '0');
                    $($(ev).parents('tr').children('td')[3]).text('启用');
                }
            }else{
                $.dialogPlugin.alert(returnData['msg']);
            }
        },
        error: function () {
            $.dialogPlugin.alert("请求数据失败");
        }
    });
}

/**
 * 执行标准相应逻辑
 */
function controlSelectStandard() {
    var
        selectStandardValue = $.trim($(el.selectStandardEl).val());

    if(selectStandardValue != '0'){
        if(selectStandardValue == 'float-percent'){
            $(el.rangeStyle).css("display" , "inline-block");
            $(el.generalStyle).css("display" , "none");
        }else{
            $(el.rangeStyle).css("display" , "none");
            $(el.generalStyle).css("display" , "inline-block");
        }
    }else{
        $(el.rangeStyle).css("display" , "none");
        $(el.generalStyle).css("display" , "none");
    }
}
/**
 * 控制时间选择的相关逻辑
 */
function controlSelectTime() {
    var
        timeSelectValue = $.trim($(el.cronConfigEl).val());

    if(timeSelectValue == 'hour'){
        $(el.hourEl).val('*');
    }else{
        $(el.hourEl).val('');
    }
}
/**
 * 验证相关
 */
function validate() {
    var
        postData = {},
        compareConfObject = {},
        jobNameValue = $.trim($(el.jobNameEl).val()),
        selectStandardValue = $(el.selectStandardEl).val(),
        compareValueFromValue = $.trim($(el.compareValueFromEl).val()),
        generalCompareValue = $.trim($(el.generalCompareValueEl).val()),
        compareValueToValue = $.trim($(el.compareValueToEl).val()),
        hourValue = $.trim($(el.hourEl).val()),
        minuteValue = $.trim($(el.minuteEl).val()),
        bufferTimeValue = $.trim($(el.bufferTimeEl).val()),
        alarmGroupValue = $(el.selectRenderResult).attr("title"),
        ownerValue = $.trim($(el.ownerEl).val()),
        sqlValue = $.trim($(el.sqlsEl).val());

    //清空tip
    $('.tip-error').text('');

    //任务名
    if(jobNameValue == ''){
        $(el.jobNameEl).focus();
        $('.tip-error').text('您未填写任务名');
        return false;
    }else{
        postData["job_name"] = jobNameValue;
    }

    //执行标准
    if(selectStandardValue == '0'){
        $('.tip-error').text('您未填写执行标准');
        return false;
    }else if(selectStandardValue == 'float-percent'){
        if(compareValueFromValue == '' ){
            $('.tip-error').text('您未填写执行标准');
            $(el.compareValueFromEl).focus();
            return false;
        }else{
            if(compareValueToValue == ''){
                $(el.compareValueToEl).focus();
                return false;
            }else{
                compareConfObject["compare_type"] = $(el.executeWayEl).val();
                compareConfObject["compare_symble"] = "float-percent";
                compareConfObject["compare_value"] = compareValueFromValue + "," + compareValueToValue;
                postData["compare_conf"] = JSON.stringify(compareConfObject);
            }
        }
    }else{
        if(generalCompareValue == '' ){
            $(el.generalCompareValueEl).focus();
            $('.tip-error').text('您未填写执行标准');
            return false;
        }else{
            compareConfObject["compare_type"] = $(el.executeWayEl).val();
            compareConfObject["compare_symble"] = selectStandardValue;
            compareConfObject["compare_value"] = generalCompareValue;
            postData["compare_conf"] = JSON.stringify(compareConfObject);
        }
    }

    //时间
    if(hourValue == '' || minuteValue == ''){
        if(hourValue == ''){
            $(el.hourEl).focus();
            $('.tip-error').text('您未填写时间');
            return false;
        }else{
            $(el.minuteEl).focus();
            return false;
        }
    }else{
        postData["cron_config"] = hourValue + ":" + minuteValue;
    }

    //超时
    if(bufferTimeValue == ''){
        $(el.bufferTimeEl).focus();
        $('.tip-error').text('您未填写超时字段');
        return false;
    }else{
        postData["buffer_time"] = bufferTimeValue;
    }

    //报警组
    if(alarmGroupValue == '请选择'){
        $(el.alarmGroupEl).focus();
        $('.tip-error').text('您未填写报警组');
        return false;
    }else{
        postData["alarm_group"] = alarmGroupValue;
    }

    //负责人
    if(ownerValue == ''){
        $(el.ownerEl).focus();
        $('.tip-error').text('您未填写负责人');
        return false;
    }else{
        postData["owner"] = ownerValue;
    }

    //sql
    if(sqlValue == ''){
        $('.tip-error').text('您未填写sql语句');
        return false;
    }else{
        postData["sqls"] = sqlValue;
    }

    postData["job_id"] = $.trim($(el.hiddenJobId).val());
    postData["status"] = $.trim($(el.statusEl).val());
    return postData;
}
/**
 * 根据选择设定状态值
 * @param ev
 */
function setStatusValue(ev) {
    var
        currentClickStatus = $(ev).val();

    $(el.statusEl).val(currentClickStatus);
}
/**
 * 保存发送
 * @param sendData
 */
function sendAjax(sendData){
    $.ajax({
        type:"post",
        url: el.saveUrl,
        dataType:"json",
        async: false,
        data: sendData,
        success:function(data){
            console.log(data['errno']);
            console.log(data['msg']);
            if(data['errno'] == '0'){
                $.dialogPlugin.alert("保存成功!", function ()
                {
                    window.open('hive_monitor_list', '_self');
                });

            }else{
                $.dialogPlugin.alert(data['msg']);
            }
        },
        error: function () {
            $.dialogPlugin.alert("请求数据失败");
        }
    })
}
function hive_monitor_table() {
    tableEl = $("#hive_monitor_table").DataTable({
        "bDestroy":true,
        "bLengthChange": true,
        "searching": true,
        "ordering": false,
        "paging": true,
        'bStateSave': false,   //在删除返回，保留在同一页上
        "bServerSide": true,//这个用来指明是通过服务端来取数据
        "iDisplayLength" : 15, //默认显示的记录数
        "aLengthMenu":[10,20,30,50],   //选择一页显示条数
        "sPaginationType" : "full_numbers", //详细分页组，可以支持直接跳转到某页
        "fnServerParams": function (aoData) {
            aoData.push(
                {"name": "owner", "value": $(el.ownerSearchEl).val()},
                {"name": "status", "value": $(el.statusSearchTrigger).val()}
            )
        },
        "aoColumns": [
            {"mDataProp":"job_name"},
            {"mDataProp":"cron_config"},
            {"mDataProp":"buffer_time"},
            {"mDataProp":"status_str"},
            {"mDataProp":"owner"},
            {"mDataProp":"alarm_group"},
            // {"mDataProp":"id"},
            {"mDataProp":"oper", "sWidth": "20%"}
        ],
        "sAjaxSource": '/data_monitor/xch/hive_jobs',//这个是请求的地址
        "fnServerData": processGetData, // 获取数据的处理函数
        "oLanguage": { //国际化配置
            "sProcessing" : "正在获取数据，请稍后...",
            "sLengthMenu" : "显示 _MENU_ 条",
            "sSearch": "搜索:",
            "sZeroRecords" : "没有您要搜索的内容",
            "sInfo" : "从 _START_ 到  _END_ 条记录 共 _TOTAL_ 条记录",
            "sInfoEmpty" : "记录数为0",
            "sInfoFiltered" : "(共显示 _MAX_ 条数据)",
            "sInfoPostFix" : "",
            "oPaginate": {
                "sFirst" : "首页",
                "sPrevious" : "上一页",
                "sNext" : "下一页",
                "sLast" : "尾页"
            }
        }
    });
    // tableEl.column(6).visible( false );
}
// TODO: 删除、查询后的刷页
function processGetData(sSource, aDataSet, fnCallback) {
    var
        operStr,
        dataList,
        dataListItem,
        jobNameStr,
        statusStr;

    $.ajax({
        type:"post",
        url: sSource ,
        data: aDataSet,
        dataType:"json",
        async: false,
        success:function(data) {
            dataList = data.aaData;
            $.each(dataList, function(item){
                dataListItem = dataList[item];
                //任务名
                jobNameStr = '<a href="/data_monitor/xch/hive_history?job_id=' + dataListItem["id"] + '" title="点击可查看历史任务" class="key-link">'  + dataListItem["job_name"] + '</a>';
                //启用/停用
                if(dataListItem["status"] == 1){
                    statusStr = '启用';
                }else if(dataListItem["status"] == 0){
                    statusStr = '停用';
                }
                //分情况考虑操作
                if(dataListItem["status"] == 0){
                    operStr = '<a class="link J_status margin-right-10" data-status="1" href="javascript:;" onclick="sendChangeStatusAjax('+ dataListItem["id"]+','+ e.target + '")>启用</a><a class="link J_edit margin-right-10" href="/data_monitor/xch/hive_monitor_conf?job_id=' + dataListItem["id"] + '">编辑</a><a class="link J_del margin-right-10" onclick="delJob('+ dataListItem["id"] + ')" href="javascript:;">删除</a>';
                }else if(dataListItem["status"] == 1){
                    operStr = '<a class="link J_status margin-right-10" data-status="0" href="javascript:;" onclick="sendChangeStatusAjax('+ dataListItem["id"]+','+ e.target + '")>停用</a><a class="link J_edit margin-right-10" href="/data_monitor/xch/hive_monitor_conf?job_id=' + dataListItem["id"] + '">编辑</a><a class="link J_del margin-right-10" onclick="delJob('+ dataListItem["id"] + ')" href="javascript:;">删除</a>';
                }
                $.extend(dataListItem, {"job_name": jobNameStr, "status_str": statusStr, "oper": operStr} );
            });
            fnCallback(data);
        },
        error: function() {
            pop_window("请求数据失败");
        }
    });
}
// /**
//  * hive任务列表
//  */
// function hive_monitor_table() {
//     var
//         data,
//         dataList;
//
//     data = send_get(el.requestTableDataUrl);
//     //json data
//     dataList = data['data'];
//     get_every_data_detail(dataList);
// }
// /**
//  * 获取搜索列表数据
//  */
// function getSearchResultList() {
//     var
//         data,
//         sendData = {};
//
//     sendData["owner"] = $(el.ownerSearchEl).val();
//     sendData["status"] = $(el.statusSearchTrigger).val();
//
//     $.ajax({
//         type:"post",
//         url: el.requestTableDataUrl,
//         dataType:"json",
//         data: sendData,
//         async: false,
//         success:function(returnData){
//             if(returnData['errno'] == '0'){
//                 get_every_data_detail(returnData['data']);
//                 //重载table数据
//                 $(el.hiveMonitorTable).dataTable().fnDraw(false);
//             }else{
//                  $.dialogPlugin.alert(returnData['msg']);
//             }
//         },
//         error: function () {
//              $.dialogPlugin.alert("请求数据失败");
//         }
//     });
// }
// function get_every_data_detail(dataList) {
//     var
//         items = [];
//
//     $.each(dataList, function(){
//         var item = [];
//         item.push('<a href="/data_monitor/xch/hive_history?job_id='+ this.id + '" title="点击可查看历史任务" class="key-link">'  + this.job_name  + '</a>' );
//         item.push(this.cron_config);
//         item.push(this.buffer_time);
//         if(this.status == 1){
//             item.push('启用');
//         }else{
//             item.push('停用');
//         }
//         item.push(this.owner);
//         item.push(this.alarm_group);
//         item.push(this.id);
//         // 编辑、删除
//         if(this.status == 0){
//             item.push('<a class="link J_status margin-right-10" data-status="1" href="javascript:;">启用</a><a class="link J_edit margin-right-10" href="/data_monitor/xch/hive_monitor_conf?job_id=' + this.id + '">编辑</a><a class="link J_del margin-right-10" href="javascript:;">删除</a>');
//         }else if(this.status == 1){
//             item.push('<a class="link J_status margin-right-10" data-status="0" href="javascript:;">停用</a><a class="link J_edit margin-right-10" href="/data_monitor/xch/hive_monitor_conf?job_id=' + this.id + '">编辑</a><a class="link J_del margin-right-10" href="javascript:;">删除</a>');
//         }
//         items.push(item);
//     });
//     render_table(items);
// }
// /**
//  * 渲染表格
//  * @param tableData
//  */
// function render_table(tableData) {
//     tableEl = $(el.hiveMonitorTable).DataTable({
//         "bDestroy":true,
//         "bLengthChange": false,
//         "searching": false,
//         "ordering": false,
//         "paging": true,
//         'stateSave': true,   //在删除返回，保留在同一页上
//         "data": tableData,
//         "columns": [
//             {
//                 "title": "任务名",
//                 "sWidth": '20%'
//             },
//             {
//                 "title": "时间"
//             },
//             {
//                 "title": "超时"
//             },
//             {
//                 "title": "状态"
//             },
//             {
//                 "title": "负责人"
//             },
//             {
//                 "title": "报警组"
//             },
//             {
//                 "title": "id"
//             },
//             {
//                 "title": "操作",
//                 "sWidth": '20%'
//             }
//         ]
//     });
//     tableEl.column(6).visible( false );
// }
// TODO:test隐藏列存数据
/**
 * 删除任务
 * @param  jobId
 */
function delJob(jobId) {
    var
        json_data;

    $.dialogPlugin.confirm("确认要删除该任务吗？", function () {
        // jobId = (tableEl.row($(ev).parents('tr')).data())[6];
        // jobId = $(ev).attr("data-del-id");
        console.log(jobId);
        $.ajax({
            type: "get",
            url: el.deleteUrl + jobId,
            dataType: "json",
            async: false,
            error: function () {
                $.dialogPlugin.alert("请求数据失败");
            },
            success: function (data) {
                json_data = data;
                if (json_data['errno'] == '0') {
                    $.dialogPlugin.alert("删除成功！");
                    // hive_monitor_table();
                    // tableEl.ajax.reload();
                    //重载table数据
                    $(el.hiveMonitorTable).dataTable().fnDraw(false);
                }
                else if (json_data['error'] == '-1') {
                    $.dialogPlugin.alert(json_data['msg']);
                }
            }
        });
    });
}
/**
 * 控制编辑页面跳转
 */
function controlPageConvert() {
    window.open("/data_monitor/xch/hive_monitor_conf", '_self');
}
/**
 * 判断当前是否为编辑页
 */
function currentIsEditPage() {
    var
        url = window.location.search,
        jobId;

    if(url){
        //若为编辑页，则取参数job_id
        jobId = url.substring(url.lastIndexOf('=') + 1, url.length);
        requestJobDetailAjax(jobId);
    }
    $(el.hiddenJobId).val(jobId);
}

function sqlTextArea() {
    var editor = CodeMirror.fromTextArea('code', {
        height: "450px",
        parserfile: "../../static/plugins/codemirror/parsesql.js",
        stylesheet: "../../static/plugins/codemirror/sqlcolors.css",
        path: "../../static/plugins/codemirror/",
        textWrapping: false
    });
}

/**
 * 发送jobId，请求编辑页面的数据
 * @param sendData
 */
function requestJobDetailAjax(sendData){
    $.ajax({
        type:"get",
        url: el.editUrl + sendData,
        dataType:"json",
        async: false,
        success:function(returnData){
            if(returnData['errno'] == '0'){
                renderEditPage(returnData.data);
            }else{
                $.dialogPlugin.alert(returnData['msg']);
            }
        },
        error: function () {
            $.dialogPlugin.alert("请求数据失败");
        }
    })
}
/**
 * 渲染编辑页数据
 * @param data
 */
function renderEditPage(data) {
    var
        statusVal = data["status"],
        time = data["cron_config"],
        compareConfObj = JSON.parse(data["compare_conf"]),
        splitCompareValue,
        compareValue,
        splitTimeArr = time.split(":"),
        hourValue = splitTimeArr[0],
        minuteValue = splitTimeArr[1],
        compareSymbleValue = compareConfObj["compare_symble"],
        compareTypeValue = compareConfObj["compare_type"],
        highLightCode;

    alarm_group_select();

    $(el.jobNameEl).val(data["job_name"]);
    // $(el.sqlsEl).val(data["sqls"]);
    $(el.ownerEl).val(data["owner"]);
    $(el.bufferTimeEl).val(data["buffer_time"]);

    //渲染报警组下拉列表
    $("#timeliness_owner_select").select2();
    $("#hive_group_select").select2("val", data['alarm_group']);

    //渲染执行方式
    $(el.executeWayEl).find('option[value="' + compareTypeValue + '"]').prop('selected', true);
    //渲染执行标准
    $(el.selectStandardEl).find('option[value="' + compareSymbleValue + '"]').prop('selected', true);
    controlSelectStandard();

    if(compareConfObj["compare_symble"] == 'float-percent'){
        compareValue = compareConfObj["compare_value"];
        splitCompareValue = compareValue.split(",");
        $(el.compareValueFromEl).val(splitCompareValue[0]);
        $(el.compareValueToEl).val(splitCompareValue[1]);
    }else{
        $(el.generalCompareValueEl).val(compareConfObj["compare_value"]);
    }
    //状态
    $(el.statusBtn).find('input:radio[value = "'+ statusVal +'"]').attr('checked', 'checked');
    $(el.statusBtn).find('input:radio[value = "'+ statusVal +'"]').siblings('input').removeAttr('checked');

    //时间
    if(hourValue == "*"){
        $(el.cronConfigEl).find('input:radio[value = "小时级"]').prop('selected', true);
    }else{
        $(el.cronConfigEl).find('input:radio[value = "天级"]').prop('selected', true);
    }
    $(el.hourEl).val(hourValue);
    $(el.minuteEl).val(minuteValue);
    highLightCode = wangHighLighter.highLight('SQL', 'visual Studio', data["sqls"]);
    $(el.sqlsEl).text(data["sqls"]);
    $('.J_div').html(highLightCode);
}

function hive_history_task_table() {
    var pathname = window.location.pathname;
    var path,
        job_id;

    if (pathname == "/data_monitor/xch/hive_history") {
        job_id = getQueryString('job_id');
        /**$("#history_path_name").text(path);**/
    }
    var data = send_get('/data_monitor/xch/hive_tasks?job_id=' + job_id);
    var datas = data['data'];
    show_hive_history_task(datas);
}

function show_hive_history_task(datas) {
    var items = [];
    $.each(datas, function(name, value){
        var item = [];
        item.push(this.job_name);
        item.push(this.start_time);
        item.push(this.end_time);
        item.push(this.owner);
        item.push(getStatusColor(this.status));
        item.push('<a href="/data_monitor/xch/hive_result?task_id='+ this.task_id +'">'+getStatusColor(this.result)+'</a>');
        items.push(item);
    });
    $('#hive_history_task_table').DataTable({
        "bDestroy":true,
        "bLengthChange": true,
        "searching": true,
        "ordering": true,
        "paging": true,
        "data": items,
        "bAutoWidth": false,
        "columns": [
            {
                "title": "任务名",
                "sWidth": "30%"
            },
            {
                "title": "开始时间",
                "sWidth": "21%"
            },
            {
                "title": "结束时间",
                "sWidth": "21%"
            },
            {
                "title": "负责人",
                "sWidth": "21%"
            },
            {
                "title": "任务状态"
            },
            {
                "title": "任务结果"
            }
        ]
        //"aaSorting": [[ 3, "desc" ]]
    });

}

function hive_result_task_table() {
    var pathname = window.location.pathname;
    var path,
        task_id;

    if (pathname == "/data_monitor/xch/hive_result") {
        task_id = getQueryString('task_id');
        /**$("#history_path_name").text(path);**/
    }
    var data = send_get('/data_monitor/xch/get_hive_result?task_id=' + task_id);
    var datas = data['data'];
    show_hive_result_task(datas);
}

function show_hive_result_task(datas) {
    var items = [];
    $.each(datas, function(name, value){
        var item = [];
        item.push(this.title);
        item.push("<pre>" + this.content + "</pre>");
        items.push(item);
    });
    $('#hive_result_task_table').DataTable({
        "bDestroy":true,
        "bLengthChange": false,
        "searching": false,
        "ordering": true,
        "paging": false,
        "data": items,
        "bAutoWidth": false,
        "bScrollInfinite" : false, //是否启动初始化滚动条
        // "scrollX": true,
        "columns": [
            {
                "title": "内容",
                "sWidth": "13%"
            },
            {
                "title": "结果"
            }
        ]
    });
}
