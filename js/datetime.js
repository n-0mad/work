$(document).ready(function () {
    convertUtcDateTimeToLocal();
});

function convertUtcDateTimeToLocal() {
    $(".local-datetime").each(function () {
        var utcInt = parseInt($(this).attr("data-utc"));
        if (!utcInt)
            return;
        var utcDateTime = new Date(utcInt);
        $(this).text(utcDateTime.toLocaleString());
    });
}