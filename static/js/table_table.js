/**
 * Created by yangfan on 17/1/29.
 */

var historyUrl = "/data_monitor/xch/history?path=";
var staticUrl = "/data_monitor/xch/static?path=";

function timeliness_job_table() {
    var data = send_get('/data_monitor/xch/timeliness_jobs');
    var datas = data['data'];
    show_timeliness_job(datas);
}


function timeliness_task_table() {
    var data = send_get('/data_monitor/xch/timeliness_tasks');
    var datas = data['data'];
    show_timeliness_task(datas);
}

function query_timeliness_job_table() {
    var post_data = {};
    post_data['path'] = $("#bd_DW_timeliness_path").val();
    post_data['owner'] = $("#bd_DW_timeliness_owner").val();
    post_data['status'] = $("#bd_DW_items_status_select").val();
    post_data['category'] =$(".J_category").val();
    post_data['data_level'] =$(".J_dataLevel").val();
    post_data['business_line'] =$(".J_businessLine").val();
    var data = send_post('/data_monitor/xch/timeliness_jobs', post_data);
    var datas = data['data'];
    show_timeliness_job(datas);
}

// function abc () {}

function show_timeliness_job(datas) {
    var items = [];
    $.each(datas, function(name, value){
        var item = [];
        item.push('<a href="' + historyUrl + this.path+'" style="color: #2798eb">' + this.path + '</a>');
        item.push(format_item_name(this.cron_config, this.item_name, this.path));
        item.push(format_cron_config(this.cron_config, this.path));
        item.push(this.buffer_time);
        item.push(this.owner);
        item.push(this.create_time);
        item.push(getColor(this.status));
        items.push(item);
    });
    $('#timeliness_job_table').DataTable({
        "bDestroy":true,
        "bLengthChange": true,
        "searching": true,
        "ordering": true,
        "paging": true,
        "data": items,
        "columns": [
        {
            "title": "路径",
        },
        {
            "title": "任务名",
        },
        {
            "title": "检查时间",
        },
        {
            "title": "超时时间",
        },
        {
            "title": "责任人",
        },
        {
            "title": "创建时间",
        },
        {
            "title": "状态",
        }
        ],
        "aaSorting": [[ 5, "desc" ]]
    });
}

function show_timeliness_task(datas) {
    var items = [];
    $.each(datas, function(name, value){
        var item = [];
        item.push(this.table_name);
        item.push(this.schedule_time);
        item.push(this.owner);
        item.push(this.start_time);
        item.push(getStatusColor(this.status));
        items.push(item);
    });
    $('#timeliness_task_table').DataTable({
        "bDestroy":true,
        "bLengthChange": true,
        "searching": true,
        "ordering": true,
        "paging": true,
        "data": items,
        "columns": [
        {
            "title": "路径"
        },
        {
            "title": "检查时间"
        },
        {
            "title": "责任人"
        },
        {
            "title": "执行时间"
        },
        {
            "title": "状态"
        }
        ]
        //"aaSorting": [[ 3, "desc" ]]
    });
}

function xch_history_task_table() {
    var pathname = window.location.pathname;
    var path;
    if (pathname == "/data_monitor/xch/history") {
        path = getQueryString('path');
        $("#history_path_name").text(path);
    }
    var data = send_get('/data_monitor/xch/timeliness_tasks?path=' + path);
    var datas = data['data'];
    show_history_task(datas);
}


function show_history_task(datas) {
    var items = [];
    $.each(datas, function(name, value){
        var item = [];
        item.push(this.table_name);
        item.push(this.schedule_time);
        item.push(this.owner);
        item.push(this.start_time);
        item.push(getStatusColor(this.status));
        item.push(getStatusColor(this.result))
        items.push(item);
    });
    $('#xch_history_task_table').DataTable({
        "bDestroy":true,
        "bLengthChange": true,
        "searching": true,
        "ordering": true,
        "paging": true,
        "data": items,
        "columns": [
        {
            "title": "路径"
        },
        {
            "title": "检查时间"
        },
        {
            "title": "责任人"
        },
        {
            "title": "执行时间"
        },
        {
            "title": "状态"
        },
        {
            "title": "结果"
        }
        ]
        //"aaSorting": [[ 3, "desc" ]]
    });
}

function xch_static() {
    var path;
    if (window.location.pathname == "/data_monitor/xch/static") {
        path = getQueryString('path');
        get_xch_static(path);
    }
}

function get_xch_static(path) {
    var date = getNowFormatDate();
    $("#xch_stat_path").val(path);
    $("#xch_stat_time").val(date);
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
            show_xch_stat(data);
        }
    });
}


function get_xch_stat() {
    var path = $("#xch_stat_path").val();
    var date = $("#xch_stat_time").val();
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
            show_xch_stat(data);
        }
    });
}



function show_xch_stat(data) {
    var time_series = []
    for(var i=0; i<24; i++){
        time_series.push(i)
    }
    var date = $("#xch_stat_time").val();
    var size = data['size'];
    var time = data['time'];
    if (size.length > 0 && time.length > 0) {
        $("#xch_size_label").text('文件大小');
        $("#xch_time_label").text('产出时间');
    } else {
        pop_window('无历史数据, 请检查路径和日期!')
    }
    var ctx = document.getElementById("xch_time_pic");
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
    var ctx = document.getElementById("xch_size_pic");
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


//从URL中获取参数
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null)
        //return unescape(r[2]);
        return r[2];
    return null;
}

function format_cron_config(cron_config, path) {
    var times = cron_config.split(':');
    var hour = times[0];
    if (hour == "*") {
        return '<a href="' + staticUrl + path +'" style="color: #2798eb">' + cron_config + '</a>'
    } else {
        return cron_config
    }
}

function format_item_name(cron_config, item_name, path) {
    var times = cron_config.split(':');
    var hour = times[0];
    if (hour == "*") {
        return '<a href="' + staticUrl + path+ '" style="color: #333">' + item_name + '<span class="badge bg-blue">小时级</span></a>'
    } else {
        return item_name
    }
}