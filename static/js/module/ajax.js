//post请求——同步
function _postAjax(ajaxUrl, sendData){
    var json_data;
    $.ajax({
        url: ajaxUrl,
        dataType: "json",
        async: false,
        //传送请求数据
        data: sendData,
        success: function(data){
            json_data = data;
        },
        error:function(xml){
            console.log(xml.readyState);
        }
    });
    return json_data;
}
//get 请求--同步
function _getAjax(ajaxUrl){
    var  json_data;

    $.ajax({
        url: ajaxUrl,
        async: false,
        dataType: "json",
        async: false,
        success: function(data){
            json_data = data;
        },
        error:function(xml){
            console.log(xml.readyState);
        }
    });
    return json_data;
}