////version 3
var scheduler_table_dragStart_td = 0;
var scheduler_table_dragStart_tr = 0;
var scheduler_table_dragEnd_td = 0;
var scheduler_table_dragEnd_tr = 0;
//tmp gia ta loops & check gia to last state
var tmp_scheduler_table_dragStart_td;
var tmp_scheduler_table_dragStart_tr;
var tmp_scheduler_table_dragEnd_td;
var tmp_scheduler_table_dragEnd_tr;
var schedulerTableIsDragging = false;
// try stop 
var continueExecuting = false;
var isExecuting = false;



function rangeMouseDown(e) {
    if (SchedulerData) console.time("mouse:rangeMouseDown");
    if (schedulerIsRightClick(e)) {
        return false;
    } else {
        scheduler_table_dragStart_tr = $(this).parent().index();
        scheduler_table_dragStart_td = $(this).index() -1;
        scheduler_table_dragEnd_tr = scheduler_table_dragStart_tr;
        scheduler_table_dragEnd_td = scheduler_table_dragStart_td;
        //alert(scheduler_table_dragStart_tr);
        //var allCells = $("#tblReservation td");
        //dragStart = allCells.index($(this));

        if ( $(this).hasClass("free")){
            $(this).addClass("selected_tmp");
            $(this).siblings("td[data-groupid='" + $(this).data('groupid') + "']").addClass("selected_tmp");
        }
        schedulerTableIsDragging = true;
        //selectRange();

        if (typeof e.preventDefault != 'undefined') { e.preventDefault(); }
        document.documentElement.onselectstart = function () { return false; };
    }
    if (SchedulerData) console.timeEnd("mouse:rangeMouseDown");
}

function rangeMouseUp(e) {
    if (SchedulerData) console.time("mouse:rangeMouseUp");
    if (schedulerIsRightClick(e)) {
        return false;
    } else {
        //var allCells = $("#tblReservation td");
        //dragEnd = allCells.index($(this));

        scheduler_table_dragEnd_tr = $(this).parent().index();
        scheduler_table_dragEnd_td = $(this).index() -1;

        schedulerTableIsDragging = false;
        selectRange(false);

        document.documentElement.onselectstart = function () { return true; };
    }
    if (SchedulerData) console.timeEnd("mouse:rangeMouseUp");
}

function rangeMouseMove(e) {
    //if (SchedulerData) console.time("mouse:rangeMouseMove");
    if (schedulerTableIsDragging) {
        scheduler_table_dragEnd_tr = $(this).parent().attr('data-trindex');
        scheduler_table_dragEnd_td = $(this).attr('data-tdindex');

        //if (SchedulerData) this.SchedulerData('foo');

        if ((scheduler_table_dragEnd_tr != tmp_scheduler_table_dragEnd_tr) || (scheduler_table_dragEnd_td != tmp_scheduler_table_dragEnd_td)) {
            //console.log(scheduler_table_dragEnd_tr + " - " + tmp_scheduler_table_dragEnd_tr);
            //console.log(scheduler_table_dragEnd_td + " - " + tmp_scheduler_table_dragEnd_td);
            //selectRange(true);
        }
    }
    //if (SchedulerData) console.timeEnd("mouse:rangeMouseMove");
}

function selectRange(isTemp) {
    if (SchedulerData) console.time("mouse:---selectRange");

    if (!schedulerCtrlPressed)
        $("#" + schedulerTblId + "  td.selected, #" + schedulerTblId + "  td.selected_tmp").each(function() {
            $(this).removeClass('selected selected_tmp').addClass('free');
            $(this).siblings("td[data-groupid='" + $(this).data('groupid') + "']").removeClass('selected selected_tmp').addClass("free");
            schedulerFreeSlot($(this).data('slotid'), $(this).siblings('th').data('rowindex'), $(this).siblings('th').data('resourceindex'));
        });

    tmp_scheduler_table_dragStart_td = scheduler_table_dragStart_td;
    tmp_scheduler_table_dragStart_tr = scheduler_table_dragStart_tr;
    tmp_scheduler_table_dragEnd_td = scheduler_table_dragEnd_td;
    tmp_scheduler_table_dragEnd_tr = scheduler_table_dragEnd_tr;

    if (tmp_scheduler_table_dragStart_td > tmp_scheduler_table_dragEnd_td) {
        var tmp = tmp_scheduler_table_dragStart_td;
        tmp_scheduler_table_dragStart_td = tmp_scheduler_table_dragEnd_td;
        tmp_scheduler_table_dragEnd_td = tmp;
    }

    if (tmp_scheduler_table_dragStart_tr > tmp_scheduler_table_dragEnd_tr) {
        var tmp = tmp_scheduler_table_dragStart_tr;
        tmp_scheduler_table_dragStart_tr = tmp_scheduler_table_dragEnd_tr;
        tmp_scheduler_table_dragEnd_tr = tmp;
    }
    //var angularScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
    //alert("tmp_scheduler_table_dragStart_td:" + tmp_scheduler_table_dragStart_td + "\n tmp_scheduler_table_dragStart_tr:" + tmp_scheduler_table_dragStart_tr + "\n tmp_scheduler_table_dragEnd_td:" + tmp_scheduler_table_dragEnd_td + "\n tmp_scheduler_table_dragEnd_tr:" + tmp_scheduler_table_dragEnd_tr);


    for (var i = tmp_scheduler_table_dragStart_tr; i <= tmp_scheduler_table_dragEnd_tr; i++) {
        for (var j = tmp_scheduler_table_dragStart_td; j <= tmp_scheduler_table_dragEnd_td; j++) {
            //alert("i:" + i + "j:" + j);
            var cell = $('#' + schedulerTblId + '  tbody tr:eq(' + i + ') td:eq(' + j + ')');
            //$(cell)
            var curClass = $(cell).attr("class");
            curClass = curClass.replace('ng-scope','').trim();
            //alert(curClass);
            switch (curClass) {
                case "free_tmp":
                    $(cell).removeClass('selected_tmp selected free_tmp free');
                    $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").removeClass("selected_tmp selected free_tmp free");
                    if (isTemp){
                        $(cell).addClass("free_tmp");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("free");
                    } else {
                        schedulerFreeSlot($(cell).data('slotid'), $(cell).siblings('th').data('rowindex'), $(cell).siblings('th').data('resourceindex'));
                        $(cell).addClass("free");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("free");
                    }
                    break;
                case "free":
                    $(cell).removeClass('selected_tmp selected free_tmp free');
                    $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").removeClass("selected_tmp selected free_tmp free");
                    if (isTemp){
                        $(cell).addClass("selected_tmp");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("selected_tmp");
                    }else {
                        schedulerSelectSlot($(cell).data('slotid'), $(cell).siblings('th').data('rowindex'), $(cell).siblings('th').data('resourceindex'));
                        $(cell).addClass("selected");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("selected");
                    }
                    break;
                case "selected_tmp":
                    $(cell).removeClass('selected_tmp selected free_tmp free');
                    $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").removeClass("selected_tmp selected free_tmp free");
                    if (isTemp){
                        $(cell).addClass("selected_tmp");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("selected_tmp");
                    } else {
                        schedulerSelectSlot($(cell).data('slotid'), $(cell).siblings('th').data('rowindex'), $(cell).siblings('th').data('resourceindex'));
                        $(cell).addClass("selected");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("selected");
                    }
                    break;
                case "selected":
                    $(cell).removeClass('selected_tmp selected free_tmp free');
                    $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").removeClass("selected_tmp selected free_tmp free");
                    if (isTemp){
                        $(cell).addClass("free_tmp");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("free_tmp");
                    } else {
                        schedulerFreeSlot($(cell).data('slotid'), $(cell).siblings('th').data('rowindex'), $(cell).siblings('th').data('resourceindex'));
                        $(cell).addClass("free");
                        $(cell).siblings("td[data-groupid='" + $(cell).data('groupid') + "']").addClass("free");
                    }
                    break;
                case "closed":
                    //do nothing
                    //alert("not allowed!");
                    break;
            }
        }
    }


    /*if (dragEnd + 1 < dragStart) { // reverse select
    //alert(1);
    $("#tblReservation td:not([class='info'])").slice(dragEnd, dragStart + 1).addClass('selected');
    } else {
    alert(dragStart + "-" + dragEnd);
    $("#tblReservation td:not([class='info'])").slice(dragStart, dragEnd).addClass('selected');
    }*/


    if (SchedulerData) console.timeEnd("mouse:---selectRange");
}

function ClearTableSelection(){
    $('#' + schedulerTblId + ' .selected').addClass("free").removeClass("selected");
}


