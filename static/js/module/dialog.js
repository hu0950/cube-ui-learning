/**
 * Created by hujunhujun_i on 2017/3/2.
 */

(function($){
    var
        //base variable
        el = {
            containerEl : '#common-container',
            alertDialogEl: '#alertDialog',
            confirmDialogEl: '#confirmDialog'
        },
        //base configuration
        cfg= {
            title: "提示信息",
            content: "暂无内容",
            okBtn: '确定',
            cancelBtn: '取消'
        },
        alertHtml = '',
        confirmHtml = '';

    jQuery.dialogPlugin = {
        alert: function (str, callback, settings) {
            if(str){
                cfg["content"] = str;
            }
            if((typeof settings == "object") && (typeof settings.length != 'number')){
                cfg = $.extend(cfg, settings);
            }else if(settings){
                console.log("请检查当前所配的setting是否符合对象格式");
            }

            if($(el.alertDialogEl).length != 0){
                $(el.alertDialogEl).remove();
            }else{
                //alert dialog html
                alertHtml += '<div class="modal fade" tabindex="-1" role="dialog" id="alertDialog">';
                alertHtml += '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+ cfg.title + '</h4></div>';
                alertHtml += '<div class="modal-body"><p>'+ cfg.content +'</p></div>';
                alertHtml += '<div class="modal-footer"><button type="button" class="btn btn-primary J_confirmAlert">' + cfg.okBtn + '</button></div></div></div></div>';
            }

            $(el.containerEl).append(alertHtml);
            $(el.alertDialogEl).modal('show');
            // 绑定alter对话框的事件
            alertHandle(callback);
        },
        confirm: function (str, okCb, cancelCb, settings) {
            if(str){
                cfg["content"] = str;
            }

            if((typeof settings == "object") && (typeof settings.length != 'number')){
                cfg = $.extend(cfg, settings);
            }else if(settings){
                console.log("请检查当前所配的setting是否符合对象格式");
            }

            if($(el.confirmDialogEl).length != 0){
                $(el.confirmDialogEl).remove();
            }else{
                //confirm dialog html
                confirmHtml += '<div class="modal fade" tabindex="-1" role="dialog" id="confirmDialog">';
                confirmHtml += '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+ cfg.title + '</h4></div>';
                confirmHtml += '<div class="modal-body"><p>'+ cfg.content +'</p></div>';
                confirmHtml += '<div class="modal-footer"><button type="button" class="btn btn-default J_cancelConfirm" data-dismiss="modal">'+ cfg.cancelBtn +'</button> <button type="button" class="btn btn-primary J_acceptConfirm">' + cfg.okBtn + '</button></div></div></div></div>';
            }

            $(el.containerEl).append(confirmHtml);
            $(el.confirmDialogEl).modal('show');
            // 绑定confirm对话框的事件
            confirmHandle(okCb, cancelCb);
        }
    };
    function alertHandle(callback) {
        //绑定“确定”触发事件
        $(document).on('click', '.J_confirmAlert' ,function () {
            if($.isFunction(callback)){
                callback();
            }else if(callback){
                console.log("请检查所配置的回调函数");
            }
            $(el.alertDialogEl).modal('hide');
        });
    }
    function confirmHandle(okCb, cancelCb){
        $(document).on('click', '.J_acceptConfirm' ,function () {
            if($.isFunction(okCb)){
                okCb();
            }else if(okCb){
                console.log("请检查所配置的回调函数");
            }
            $(el.confirmDialogEl).modal('hide');
        });

        $(document).on('click', '.J_cancelConfirm' ,function () {
            if ($.isFunction(cancelCb)) {
                cancelCb();
            }else if(cancelCb){
                console.log("请检查所配置的回调函数");
            }
            $(el.confirmDialogEl).modal('hide');
        });
    }
})(jQuery);

