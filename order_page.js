$(document).ready(function () {
  removeBeakLines()

  $(".order-panel-D").on("click", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    var parentA = $(".order-panel-A").parent();
    var parentB = $(".order-panel-B").parent();
    var parentC = $(".order-panel-C").parent();
    var parentD = $(".order-panel-D").parent();
    var parentE = $(".order-panel-E").parent().detach();
    
    var mainRow = $(".main-row");
    var firstRow = $(".first-row");
    var secondRow = $(".second-row");
    var firstCol = $(".first-col")

    
    if (parentC.hasClass("d-none")) {
      // from full view
      parentD.removeClass("col-lg-12");
      parentD.addClass("col-lg-8");

      firstCol.removeClass("col-lg-12")
      firstCol.addClass("col-lg-9")

      firstCol.removeClass("col-lg-12");
      firstCol.addClass("col-lg-9");
      mainRow.append(parentE);
      var panelE = $(".order-panel-E");
      
      parentA.removeClass("col-lg-6")
      parentA.addClass("col-lg-8")
      parentB.removeClass("col-lg-3")
      parentB.addClass("col-lg-4")
      panelE.removeClass('h-300');
    } else {
      // to full view
      parentD.removeClass("col-lg-8");
      parentD.addClass("col-lg-12");      

      firstCol.removeClass("col-lg-9");
      firstCol.addClass("col-lg-12");
      firstRow.append(parentE);
      var panelE = $(".order-panel-E");

      parentA.removeClass("col-lg-8")
      parentA.addClass("col-lg-6")
      parentB.removeClass("col-lg-4")
      parentB.addClass("col-lg-3")
      panelE.addClass('h-300');
    }
    parentC.toggleClass("d-none");
  });


  //$("#childNode").detach().appendTo("#parentNode");

});

function removeBeakLines() {
  $("br").remove();
}