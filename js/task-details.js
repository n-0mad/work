function taskAttachmentClick(el) {
    $(".task-attachment").removeClass("active");
    var attach = $(el);
    attach.addClass("active");

    //show selected task
    var id = attach.attr('id');
    window.location.href = "/Files/Index/" + id;
}