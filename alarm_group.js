/**
 * Created by hujun on 2017/2/8.
 */
// 配置后端相关接口
var
    el = {
        //列表页表格
        alarmGroupTable: '#group_table',
        //编辑
        editTrigger: '.J_editBtn',
        //删除
        delTrigger: '.J_del',
        //查询
        searchTrigger: '.J_search',
        //确定选择查询结果
        confirmTrigger: '.J_confirmAdd',
        //保存添加列表的结果
        saveAddTrigger: '.J_saveAdd',
        //返回列表页
        returnTrigger: '.J_returnList',
        //关闭
        closeTrigger: '.J_close',
        //取消
        cancelTrigger: '.J_cancelAdd',
        //删除报警组列表信息
        delAddListTrTrigger: '.J_delAddListTr',
        //删除报警组
        confirmDelTrigger: '.J_confirmDel',
        //取消删除操作
        // cancelDelTrigger: '.J_cancel',
        //报警组名称
        nameEl: '.J_name',
        //描述
        descEl: '.J_desc',
        //提示
        tipEl: '.J_tip',
        //模态框表单
        modalForm: '.J_modalForm',
        //输入的查询内容
        searchContentEl: '.J_searchContent',
        //显示搜索结果表格
        searchResultBodyEl: '.J_searchResultBody',
        //添加列表页表格
        addListBodyEl: '.J_addListBody',
        //请求表格数据ajax地址
        requestTableDataUrl: '/data_monitor/alarm_group/groups',
        //编辑页数据url
        editUrl: '/data_monitor/alarm_group/get_group?group_name=',
        //删除url
        deleteUrl: '/data_monitor/alarm_group/group_rm?group_name=',
        //查询员工信息url
        searchUrl: 'data_monitor/alarm_group/user?email=',
        //保存
        saveUrl: 'data_monitor/alarm_group/group_add'
    },
    //调用表格组件后返回的对象
    tableEl;
    //删除列表标记
    // isDelTag;

$(document).ready(function () {
    buildAlarmEvent();
});

function buildAlarmEvent() {
    //编辑
    $(document).on('click', el.editTrigger, function (e) {
        getEditInfo(e.target);
    });
    //删除报警组
    $(document).on('click', el.delTrigger, function (e) {
        del(e.target);
    });
    //搜索
    $(el.searchTrigger).on('click', function (e) {
        search();
    });
    //取消
    $(el.cancelTrigger).on('click', function () {
        afterDialogDisappear();
    });
    //关闭
    $(el.closeTrigger).on('click', function () {
        afterDialogDisappear();
    });
    //将查询结果添加到添加列表，待保存
    $(el.confirmTrigger).on('click', function () {
        if($(el.searchContentEl).val() != ''){
            renderConfirmData();
        }else{
            $(el.searchContentEl).focus();
        }
        return false;
    });
    //保存添加列表
    $(el.saveAddTrigger).on('click', function () {
        saveAddList();
    });
    //返回列表页
    $(el.returnTrigger).on('click', function () {
        returnList();
    });
    //删除添加、编辑列表
    $(document).on('click', el.delAddListTrTrigger, function (e) {
        delAddInfo(e.target);
    });
    //禁止回车搜索查询
    $(el.searchContentEl).keydown(function(e) {
        if (e.keyCode == 13) {
            return false;
        }
    });
    $(el.nameEl).keydown(function(e) {
        if (e.keyCode == 13) {
            return false;
        }
    });
    $(document).on('click', el.confirmDelTrigger, function (e) {
        sendDelAjax();
    });
    $(document).on('click', el.cancelTrigger, function () {
        cancelDel();
    });

}
/**
 * 进入列表初始化时，清除sessionStorage记录
 */
function cleanSessionStorage() {
    sessionStorage.removeItem("paramName");
}


function alarm_group_table_data() {
    tableEl = $("#group_table").DataTable({
        "bDestroy":true,
        "bLengthChange": true,
        "searching": true,
        "ordering": false,
        "paging": true,
        'bStateSave': false,   //在删除返回，保留在同一页上
        "bServerSide": true,//这个用来指明是通过服务端来取数据
        "iDisplayLength" : 15, //默认显示的记录数
        "aLengthMenu":[10,20,30,50],
        //"sPaginationType" : "full_numbers", //详细分页组，可以支持直接跳转到某页
        "sAjaxSource": "/data_monitor/alarm_group/groups",//这个是请求的地址
        "fnServerData": sendGet, // 获取数据的处理函数
        //"data": tableData,
        //后端返回的数据格式是对象，而不是类数组时候，在这声明该列应渲染什么数据
        "aoColumns": [
             {"mDataProp":"group_name"},
             {"mDataProp":"group_des"},
             {"mDataProp":"timestamp"},
             {"mDataProp":"oper", "sWidth": "20%"}
             ],
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
}

function sendGet(sSource, aDataSet, fnCallback) {
    var
        convertTimestamp,
        operStr,
        timestamp,
        dataList,
        dataListItem;

    $.ajax({
        type:"get",
        url: sSource ,
        data: aDataSet,
        dataType:"json",
        async: false,
        success:function(data) {
            dataList = data.aaData;
            $.each(dataList, function(item){
                dataListItem = dataList[item];
                convertTimestamp = dataListItem["timestamp"].replace("T"," ");
                operStr = '<a class="link J_editBtn margin-right-10" href="/data_monitor/alarm_group/add" data-param="' + dataListItem["group_name"] + '">编辑</a><a class="link J_del" href="javascript:;">删除</a>';
                $.extend(dataListItem, {"timestamp":convertTimestamp, "oper": operStr} );
            });
            fnCallback(data);
        },
        error: function() {
            pop_window("请求数据失败");
        }
    });
}

//function get_data_detail(dataList) {
//    var items = [];
//    $.each(dataList, function(){
//        var item = [];
//        item.push(this.group_name);
//        item.push(this.group_des);
//        item.push(this.timestamp);
//        // 编辑、删除
//        item.push('<a class="link J_editBtn margin-right-10" href="/data_monitor/alarm_group/add" data-param="' + this.group_name + '">编辑</a><a class="link J_del" href="javascript:;">删除</a>');
//        items.push(item);
//    });
//    //render_tables(items);
//}

//function render_tables(tableData) {
//    tableEl = $("#group_table").DataTable({
//        "bDestroy":true,
//        "bLengthChange": true,
//        "searching": true,
//        "ordering": true,
//        "paging": true,
//        'bStateSave': true,   //在删除返回，保留在同一页上
//        "bServerSide": true,//这个用来指明是通过服务端来取数据
//        "sAjaxSource": "/data_monitor/alarm_group/groups",//这个是请求的地址
//        "fnServerData": sendGet, // 获取数据的处理函数
//        "data": tableData,
//        "columns": [
//            {
//                "title": "名称"
//            },
//            {
//                "title": "描述",
//                "sWidth": "15%"
//            },
//            {
//                "title": "时间"
//            },
//            {
//                "title": "操作",
//                "sWidth": "15%"
//            }
//        ],
//        "oLanguage": {
//            "oPaginate": {
//                "sNext": "下一页",
//                "sPrevious": "上一页"
//            }
//        }
//    });
//
//}

/**
 * 删除——弹出确认框
 * @param ev
 */
function del(ev) {
    var
        rowData = tableEl.row($(ev).parents('tr') ).data(),
        sendData = rowData[0];

    $('#delTip').modal('show');
    $('#delTip').attr('data-param', sendData);
}
/**
 * 确认删除, 发送Ajax
 */
function sendDelAjax() {
    var
        json_data,
        sendData = $('#delTip').attr('data-param');

    $.ajax({
        type: "get",
        url: el.deleteUrl + sendData,
        dataType: "json",
        async: true,
        error: function () {
            pop_window("请求数据失败");
        },
        success: function (data) {
            json_data = data;
            if (json_data['errno'] == '0') {
                $('#delTip').modal('hide');
                $('#delTip').removeAttr('data-param');
                $.dialogPlugin.alert("删除成功！");
                alarm_group_table_data();
                // tableEl.ajax.reload();
                //重载table数据
                $(el.alarmGroupTable).dataTable().fnDraw(false);
            }
            else if (json_data['errno'] == '-1') {
                pop_window(json_data['message']);
            }
        }
    });
}
/**
 * 取消删除操作
 */
function cancelDel() {
    $('#delTip').modal('hide');
    $('#delTip').removeAttr('data-param');
}
// function cancelDelList() {
//     $("#delTip").modal("hide");
// }
/**
 * 搜索员工信息响应
 */
function search() {
    var
        json_data,
        inputValue = $(el.searchContentEl).val();

    if(inputValue == ''){
        $(el.searchContentEl).focus();
    }else {
        //删除上一次搜索记录
        $(el.searchResultBodyEl).empty();
        $.ajax({
            type: "get",
            url: el.searchUrl + inputValue + '@didichuxing.com',
            dataType: "json",
            async: true,
            error: function () {
                pop_window("请求数据失败");
            },
            success: function (data) {
                json_data = data;
                if (json_data['errno'] == '0') {
                   renderSearchResult(json_data);
                }
                else if (json_data['errno'] == '-1') {
                    pop_window(json_data['message']);
                }
            }
        });
    }
}
/**
 * 渲染搜索结果
 * @param json_data
 */
function renderSearchResult(json_data) {
    var
        renderData = json_data.data,
        searchResultTr = '<tr>'+
                            '<td>' + renderData.displayName + '</td>' +
                            '<td>' + renderData.mobile + '</td>' +
                            '<td>' + renderData.department + '</td>' +
                            '<td>' + renderData.mail + '</td>' +
                         '</tr>';

    if($(el.tipEl)){
        $(".J_tip").remove();
        $(el.searchResultBodyEl).append(searchResultTr);
    }
}
/**
 * 关闭或取消模态框后，清除查询结果
 */
function afterDialogDisappear() {
    $(el.searchContentEl).val('');
    $(el.searchResultBodyEl).empty();
}

/**
 * 将选择结果渲染至添加列表中
 */
function renderConfirmData(){
    var
        tdEls = $(el.searchResultBodyEl).children('tr').children('td'),
        addListTr = '',
        tdInfoStr = '',
        inpEl = '',
        saveInfo = '';


    for(var i = 0; i < $(tdEls).length; i++){
        saveInfo = '{&quot;name&quot;:&quot;'+ $(tdEls)[0].innerHTML +'&quot;,&quot;phone&quot;:&quot;' + $(tdEls)[1].innerHTML + '&quot;,&quot;department&quot;:&quot;' + $(tdEls)[2].innerHTML + '&quot;,&quot;email&quot;:&quot;' +$(tdEls)[3].innerHTML +'&quot;}';
        inpEl = '<input type="hidden" class="J_members" name="saveInfo" value="'+ saveInfo +'">';
        tdInfoStr += '<td>' +  $(tdEls)[i].innerHTML + '</td>';
    }
    addListTr = '<tr>'+
                    inpEl + tdInfoStr +
                    '<td><a class="link J_delAddListTr" href="javascript:;"> 删除 </a></td>'+
                '</tr>';

    $(el.addListBodyEl).append(addListTr);
    $('#addDialog').modal('hide');
    afterDialogDisappear();
}

/**
 * 提交保存添加/编辑列表所有数据
 */
function saveAddList() {
    if($(el.nameEl).val() == ''){
        console.log("");
        //名称为空，提示填写
        $(el.nameEl).focus();
    }else {
        console.log("不为空");
        getAddListData();
    }
}
/**
 * 获取当前操作列表数据
 */
function getAddListData() {
    var
        tr = $(el.addListBodyEl).children('tr'),
        trEl,
        inpSaveData,
        everyMemberData,
        membersData = [],
        sendObj = {},
        nameValue = $(el.nameEl).val(),
        descValue = $(el.descEl).val();

    for(var i = 0 ; i < $(tr).length; i ++){
        trEl = $(tr)[i];
        inpSaveData = $(trEl).children('input').val();
        if(inpSaveData){
            everyMemberData = JSON.parse(inpSaveData);
            membersData.push(everyMemberData);
        }
    }
    sendObj["group_name"] = nameValue;
    sendObj["group_des"] = descValue;
    sendObj["members"] = JSON.stringify(membersData);
    sendSaveAddData(sendObj);
}
/**
 * 向后台发送保存数据
 * @param sendObj
 */
function sendSaveAddData(sendObj) {
    var json_data;

    $.ajax({
        type: "post",
        url: el.saveUrl,
        dataType: "json",
        data: sendObj,
        async: true,
        error: function () {
            pop_window("请求数据失败");
        },
        success: function (data) {
            json_data = data;
            if (json_data['errno'] == '0') {
                $.dialogPlugin.alert('保存成功！');
                window.open('/data_monitor/alarm_group/list', '_self');
            }
            else if (json_data['errno'] == '-1') {
                pop_window(json_data['message']);
            }
        }
    });
    sessionStorage.removeItem("paramName");
}
/**
 * 返回列表页
 */
function returnList() {
    sessionStorage.removeItem("paramName");
    // window.open('list', '_self');
    window.open('/data_monitor/alarm_group/list', '_self');
}
/**
 * 删除当前操作列表中信息
 * @param ev
 */
function delAddInfo(ev) {
    var
        noContentTip = '<tr class="J_tip"><td colspan = "5" style="text-align:center;">暂无内容</td></tr>',
        delTr = $(ev).parents('tr');

    $.dialogPlugin.confirm('确认要删除该报警组成员吗？', function () {
        console.log(1111);
        console.log(delTr);
        $(delTr).remove();
        if($(el.delAddListTrTrigger, el.addListBodyEl).length == 0){
            $(el.addListBodyEl).append(noContentTip);
        }
        $.dialogPlugin.alert("删除成功！");
    });
}
/**
 * 获取跳转编辑页的所需参数
 * @param ev
 */
function getEditInfo(ev) {
    var
        //将参数保存在全局变量中
        param = $(ev).attr('data-param');

    sessionStorage.setItem("paramName", param);
}
/**
 * 发送ajax请求数据
 */
function sendAjaxRequestEditInfo() {
   var
       groupName = sessionStorage.getItem("paramName");

    //若是编辑页
    if(groupName){
        var
            json_data,
            renderData;
        //发送请求
        $.ajax({
            type: "get",
            url: el.editUrl + groupName,
            dataType: "json",
            async: true,
            error: function () {
                pop_window("请求数据失败");
            },
            success: function (data) {
                json_data = data;
                if (json_data['errno'] == '0') {
                    renderData = json_data.data;
                    renderEditInfo(renderData[0]);
                }
                else if (json_data['errno'] == '-1') {
                    pop_window(json_data['message']);
                }
            }
        });
        // sessionStorage.removeItem("paramName");
    }
}
/**
 * 渲染编辑页信息
 * @param data
 */
function renderEditInfo(data) {
    var
        groupNameValue = data["group_name"],
        descValue = data["group_des"],
        membersValue = JSON.parse(data["members"]),
        editStrTrs = '',
        memberObject,
        saveInfo,
        inpEl;

    $(el.nameEl).val(groupNameValue);
    $(el.descEl).val(descValue);
    if(membersValue != ''){
        if($(el.tipEl)) {
            $(".J_tip").remove();
        }
        for(var k = 0 ; k < membersValue.length ; k ++){
            memberObject = membersValue[k];
            saveInfo = '{&quot;name&quot;:&quot;'+ memberObject["name"] +'&quot;,&quot;phone&quot;:&quot;' + memberObject["phone"] + '&quot;,&quot;department&quot;:&quot;' + memberObject["department"] + '&quot;,&quot;email&quot;:&quot;' + memberObject["email"] +'&quot;}';
            inpEl = '<input type="hidden" class="J_members" name="saveInfo" value="'+ saveInfo +'">';
            editStrTrs += '<tr>'+
                    inpEl +
                    '<td>' + memberObject["name"] + '</td>' +
                    '<td>' + memberObject["phone"] + '</td>' +
                    '<td>' + memberObject["department"] + '</td>' +
                    '<td>' + memberObject["email"] + '</td>' +
                    '<td><a class="link J_delAddListTr" href="javascript:;"> 删除 </a></td>' +
                '</tr>';
        }
    }
    $(el.addListBodyEl).append(editStrTrs);
}


// (function($){
//     $.fn.serializeJson=function(){
//         var serializeObj={};
//         var array=this.serializeArray();
//         var str=this.serialize();
//         $(array).each(function(){
//             if(serializeObj[this.name]){
//                 if($.isArray(serializeObj[this.name])){
//                     serializeObj[this.name].push(this.value);
//                 }else{
//                     serializeObj[this.name]=[serializeObj[this.name],this.value];
//                 }
//             }else{
//                 serializeObj[this.name]=this.value;
//             }
//         });
//         return serializeObj;
//     };
// })(jQuery);

