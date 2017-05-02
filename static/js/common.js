var status_obj = new Object;
$(document).ready(
    function() {
        $(document).on("click",".bd_nav_project_no",
            function(e) {
                var filter_text = this.innerText;
                var click_id = this.id;
                project_click(click_id);
            }
        );
        $(document).on("click",".bd_left_side_header",
            function(e) {
                var click_id = this.id;
                //left_side_head(click_id);
            }
        );
        $(document).on("click",".bd_panel_content",
            function(e) {
                var parent_id = $(this).parent().parent().prev().attr("id");
                //left_side_head(parent_id);
            }
        );
    }
);


function project_click(click_id) {
    var project_id_arr = new Array('bd_intelligent_voice','bd_dynamic_tuning', 
        'bd_allocation_order', 'bd_three_certificates');

    for(var i = 0; i < project_id_arr.length; i++) {
        if (project_id_arr[i] == click_id) {
            $('#project_id_arr[i]').removeClass().addClass("bd_nav_project_yes");
        } else {
            $('#project_id_arr[i]').removeClass().addClass("bd_nav_project_no");
        }
    }
}


function left_side_head(click_id) {
    $(".bd_left_side_header").each(function () {
        var elem_id = $(this).attr("id");
        var arr_tmp = $(this).find("span");
        $(arr_tmp[2]).removeClass();
        if (elem_id == click_id) {
            $(arr_tmp[2]).addClass("glyphicon glyphicon-chevron-down bd_panel_status_down");
        }
        else {
            $(arr_tmp[2]).addClass("glyphicon glyphicon-chevron-up bd_panel_status_up");
        }
    });
}

