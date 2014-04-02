function lookup(array, prop, value) {
    for (var i = 0, len = array.length; i < len; i++)
        if (array[i][prop] === value) return array[i];
}

function GetTimeFromInt(intTime) {
    var has30 = intTime % 1;
    var CurInt = parseInt(intTime / 1);
    if (CurInt < 10)
        CurInt = "0" + CurInt;

    if (has30 == 0) {
        return CurInt + ":00";
    } else {
        return CurInt + ":30";
    }
}

function fixOddEvenClasses() {
    $('#' + rsvrTblNm + ' tbody tr').removeClass();
    $('#' + rsvrTblNm + ' tbody tr:visible:even').addClass('even');
    $('#' + rsvrTblNm + ' tbody tr:visible:odd').addClass('odd');
}

SlotStatus = {
    free: 0,
    selected: 1,
    reserved: 2,
    maintenance: 3,
}

function schedulerIsRightClick(e) {
    if (e.which) {
        return (e.which == 3);
    } else if (e.button) {
        return (e.button == 2);
    }
    return false;
}

function schedulerCloneArray(originalArray) {
    var clonedArray = $.map(originalArray, function (obj) {
        return $.extend(true, {}, obj);
    });

    return clonedArray;
}

function schedulerGetSlots(slotSpan) {
    if (slotSpan == 0) slotSpan = 10;
    var slots = [];
    var d = new Date(2014, 1, 1, 0, 0, 0, 0);
    var i = 0;
    while (d.getDate() == 1) {
        var tmpTime = schedulerPadStr(d.getHours()) + ':' + schedulerPadStr(d.getMinutes());
        slots.push({ id: i, time: tmpTime });
        d = schedulerAddMinutes(d, slotSpan);
        i++;
    }
    return slots;
}

function schedulerGetLeases(slotSpan) {
    if (slotSpan == 0) slotSpan = 10;
    var slots = [];
    var d = new Date(2014, 1, 1, 0, 0, 0, 0);
    var i = 0;
    while (d.getDate() == 1) {
        //slots.push({ id: i, status: getRandomStatus() });
        slots.push({ id: i, status: "free" });
        d = schedulerAddMinutes(d, slotSpan);
        i++;
    }
    return slots;
}

//
//GetSlotId from time
function schedulerGetSlotId(startTime, duration, granularity) {
    startTime = parseInt(startTime);
    var d = new Date(startTime * 1000);
    var timespan = 60 / schedulerSlotsPerHour;
    var slotid = 0;
    slotid += d.getHours() * schedulerSlotsPerHour;
    slotid += d.getMinutes() / timespan;
    return slotid;
}
//
//Find Resource By Id
function schedulerFindResourceById(Resources, id) {
    for (var i = 0, len = Resources.length; i < len; i++) {
        if (Resources[i].id == id)
            return Resources[i]; // Return as soon as the object is found
    }
    return null; // The object was not found
}

//
//for testing
function getRandomStatus() {
    var randint = Math.floor(Math.random() * (10 - 0 + 1) + 0);
    switch (randint) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: return "free";
        //case 8: return "selected";
        case 7: case 8: case 9: return "reserved";
        case 10: return "maintenance";
    }
}

function schedulerPadStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}

function schedulerAddMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}