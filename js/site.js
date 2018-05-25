// Write your Javascript code.
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function openUserProfile() {
    $("#userProfileModal").modal();
}

$(document).ready(function () {
    $("#userProfileModal").on('shown.bs.modal', function (e) {
        $("#userProfileLink").addClass("active");
    });

    $("#userProfileModal").on('hidden.bs.modal', function (e) {
        $("#userProfileLink").removeClass("active");
    });
});