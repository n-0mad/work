var minWidth = 992;

$(document).ready(function () {
    
    var filterId = getURLParameter('filterId');
    var taskId = getURLParameter('taskId');
    
    subscribeScroll();

    if (filterId == undefined && taskId == undefined)
    {
        loadTasks(6);
        setHamburgerMenuItemActivated(6);
        return;
    }

    if (filterId == undefined && taskId != undefined)
    {
        loadTasks(5, taskId);
        setHamburgerMenuItemActivated(5);
        return;
    }

    loadTasks(filterId, taskId);
    setHamburgerMenuItemActivated(filterId);
});

function subscribeScroll() {
    var win = $(window);
    var doc = $(document);

    // Each time the user scrolls
    win.scroll(function () {
        // Vertical end reached?
        var height = doc.height() - win.height();
        var pos = win.scrollTop();

        if (pos >= height - 100 && pos <= height) {
            addTasks();
        }
    });
}

function loadTasks(filterId, taskId) {
    $.ajax({
        url: '/Tasks/GetTasks',
        datatype: "json",
        data: { 'filterId': filterId },
        type: "post",
        contenttype: 'application/json; charset=utf-8',
        async: true,
        beforeSend: function () {
            $("#taskList").empty();
            $("#progress").show();
            $(".list-group-item").removeClass("active");
            var el = $("#f" + filterId);
            if (el == undefined)
                return;

            var item = $(el);
            item.addClass("active");
        },
        success: function (data) {
            $("#taskList").html(data);

            if (taskId == undefined)
                return;

            var task = $("#" + taskId);
            if (!task.length) {
                addTasks(taskId);
                return;
            }

            scrollToElement("#" + taskId);
            var win = $(window);
            if (win.width() <= minWidth) {
                selectTask(task);
            }
            else {
                processTaskClick(task);
            }
        },
        error: function (xhr) {
            alert('error' + xhr);
        },
        complete: function () {
            $("#progress").hide();
            convertUtcDateTimeToLocal();
        }
    });
}

var ready = true; //Assign the flag here
function addTasks(taskId) {
    if (!ready)
        return;

    ready = false; //Set the flag here
    $.ajax({
        url: '/Tasks/GetNextTasks',
        datatype: "json",
        type: "post",
        contenttype: 'application/json; charset=utf-8',
        async: true,
        success: function (data) {
            if (data.indexOf("Нет данных для отображения") !== -1)
                return;
            $("#taskList").append(data);

            if (taskId == undefined)
                return;

            var task = $("#" + taskId);
            if (!task.length) {
                ready = true;
                addTasks(taskId);
                return;
            }

            scrollToElement("#" + taskId);
            var win = $(window);
            if (win.width() <= minWidth) {
                selectTask(task);
            }
            else {
                processTaskClick(task);
            }
        },
        error: function (xhr) {
            alert('error' + xhr);
        },
        complete: function () {
            $("#progress").hide();
            ready = true; //Reset the flag here
        },
    });
}

function processTaskClick(el) {
    $(".task-node").removeClass("active");
    var task = $(el);
    task.addClass("active");

    //show selected task
    var id = task.attr('id');

    pushHistory(id);
    var win = $(window);
    if (win.width() <= minWidth) {
        var currentLocation = window.location.href;
        window.location.href = "/taskdetails?id=" + id;
    }
    else {
        showTaskDetails(id);
    }
}

function selectTask(el) {
    $(".task-node").removeClass("active");
    var task = $(el);
    task.addClass("active");
}

function setHamburgerMenuItemActivated(filterId) {
    $(".sidenav-item").removeClass("active");
    var item = $("#hf" + filterId);
    item.addClass("active");
}

function getURLParameter(sParam) {

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function scrollToElement(elementId) {
    $('html, body').animate({
        scrollTop: $(elementId).offset().top - 120
    }, 0);
}

function showTaskDetails(taskId) {
    $.ajax({
        url: '/Tasks/GetTaskDetails',
        datatype: "json",
        data: { 'taskId': taskId },
        type: "post",
        contenttype: 'application/json; charset=utf-8',
        async: true,
        beforeSend: function () {
            $("#taskDetails").empty();
        },
        success: function (data) {
            $("#taskDetails").html(data);
        },
        error: function (xhr) {
            alert('error' + xhr);
        },
        complete: function () {
            $("#progress").hide();
        }
    });
}

function pushHistory(id) {
    var filterId = getURLParameter('filterId');
    history.pushState(null, "", "/Tasks?filterId=" + filterId + "&taskId=" + id);
}