$(document).ready(function () {
  removeBeakLines()

  $(".order-panel-D").on("click", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    var parentC = $(".order-panel-C").parent();
    var parentD = $(".order-panel-D").parent();
    var parentE = $(".order-panel-E").parent();
    var firstCol = $(".first-col")
    if (parentC.hasClass("d-none")) {
      parentD.removeClass("col-lg-12");
      parentD.addClass("col-lg-8");
      firstCol.removeClass("col-lg-12")
      firstCol.addClass("col-lg-9")
    } else {
      parentD.removeClass("col-lg-8");
      parentD.addClass("col-lg-12");
      firstCol.removeClass("col-lg-9")
      firstCol.addClass("col-lg-12")
    }
    parentC.toggleClass("d-none");
    parentE.toggleClass("d-none");
  });
});

function removeBeakLines() {
  $("br").remove();
}