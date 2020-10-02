const DEVEL = false;

$(document).ready(function () {
  if (DEVEL) {
    console.log("***DEVELOPMENT***");
    onDataRetrieved();
  } else {
    $.get(window.location.pathname + "&data", function (data) {
      $("#order-data").html(data);
      onDataRetrieved();
    })
      .fail(function () {
        $("#loader").addClass("d-none");
        $("#data-error").removeClass("d-none");
      })
      .always(function () {
        $("#loader").addClass("d-none");
      });
  }
});

function onDataRetrieved() {
  removeBeakLines();
  registerExpandClick();
  adjustCss();
  showMore(); //TO REMOVE
  handlePanelShowMore();
}

function handlePanelShowMore() {
  $(".operatus-row-hidden").addClass("d-none");
  $(".operatus-expand-table").html(getShowMoreHtml());
  $(".panel-show-more").on("click", onShowMore);
  $(".panel-show-less").on("click", onShowMore);

  setTimeout(function() {
    $(".panel-show-more").toggleClass('panel-show-more-hover')
    setTimeout(function() {
      $(".panel-show-more").toggleClass('panel-show-more-hover')
    }, 1500)
  }, 1000)
}

function onShowMore(event) {
  const icon = event.target;
  const table = icon.closest(".operatus-table-panel");
  if (table === undefined) {
    return;
  }
  const tablePanel = $(table.children[0]);
  const hiddenRows = tablePanel.find(".operatus-row-hidden");
  const tableParent = tablePanel.parent();
  const showIcon = tableParent.find("svg");
  const srcHeight = tableParent.height();

  tableParent.css('overflow-y', 'hidden');
  tableParent.css("opacity", 0.5);
  
  hiddenRows.toggleClass("d-none");
  
  const dstHeight = tableParent.height();
  tableParent.css("height", srcHeight);  
  tableParent.animate(
    {
      height: dstHeight + "px",
      opacity: 1,
    },
    600,
    "swing",
    function () {      
      tableParent.css("opacity", "");
      tableParent.css('overflow-y', '');
      showIcon.parent().toggleClass("d-none");
      tableParent.css("height", "");
    }
  );  
}

function showMore() {
  $(".panelC-show-more").on("click", onShowMoreC);
  $(".panelC-show-less").on("click", onShowMoreC);

  $(".panelD-show-more").on("click", onShowMoreD);
  $(".panelD-show-less").on("click", onShowMoreD);

  $(".panelE-show-more").on("click", onShowMoreE);
  $(".panelE-show-less").on("click", onShowMoreE);
}

function onShowMoreC() {
  const panelC = $(".order-panel-C > div.inner-panel");
  onShowMoreCommon(panelC, "panelC", "", 300);
}

function onShowMoreD() {
  const panelD = $(".order-panel-D > div.inner-panel");
  onShowMoreCommon(panelD, "panelD", "", 300);
}

function onShowMoreE() {
  const panelE = $(".order-panel-E > div.inner-panel");
  onShowMoreCommon(panelE, "panelE", "-E", 0);
}

function onShowMoreCommon(panel, name, postfix, offset) {
  const srcHeight = panel.height();
  $("." + name + "-show-more").toggleClass("d-lg-block");
  $("." + name + "-show-less").toggleClass("d-none");

  if (panel.hasClass("overflow-panel" + postfix)) {
    panel.toggleClass("overflow-panel" + postfix);
    animateHeight(panel, srcHeight);
  } else {
    animateHeight(
      panel,
      srcHeight,
      "overflow-panel" + postfix,
      vhToPx(92) - offset
    );
  }
}

function registerExpandClick() {
  $(".icon-expand-d").on("click", expandPanelD);
  $(".icon-contract-d").on("click", expandPanelD);

  $(".icon-expand-c").on("click", expandPanelC);
  $(".icon-contract-c").on("click", expandPanelC);

  $(".icon-expand-e").on("click", expandPanelE);
  $(".icon-contract-e").on("click", expandPanelE);
}

function expandPanelC(event) {
  event.stopPropagation();
  event.stopImmediatePropagation();

  var panelC = $(".order-panel-C");
  var panelD = $(".order-panel-D");
  var parentC = $(".order-panel-C").parent();
  var parentD = $(".order-panel-D").parent();

  const srcWidth = panelC.width();

  var opacityFrom, opacityTo;
  if (parentD.hasClass("d-none")) {
    // from full view
    parentC.removeClass("col-lg-12");
    parentC.addClass("col-lg-4");
    opacityFrom = 0;
    opacityTo = 1;
  } else {
    // to full view
    parentC.removeClass("col-lg-4");
    parentC.addClass("col-lg-12");
    opacityFrom = 1;
    opacityTo = 0;
  }

  $(".icon-contract-c").toggleClass("d-none");
  toggleExpandIcon();

  animateOpacity(panelD, opacityFrom, opacityTo, parentD);
  animateWidth(panelC, srcWidth);
}

function expandPanelE(event) {
  event.stopPropagation();
  event.stopImmediatePropagation();

  var parentC = $(".order-panel-C").parent();
  var parentD = $(".order-panel-D").parent();
  var firstCol = $(".first-col");
  const panelE = $(".order-panel-E");
  const srcWidth = panelE.width();
  var parentE = panelE.parent();
  parentE.detach();

  var mainRow = $(".main-row");
  var secondRow = $(".second-row");

  if (parentC.hasClass("d-none")) {
    // from full view
    firstCol.removeClass("col-lg-12");
    firstCol.addClass("col-lg-9");

    mainRow.append(parentE);
    var parentE = $(".order-panel-E").parent();
    parentE.removeClass("col-lg-12");
    parentE.addClass("col-lg-3");
  } else {
    // to full view
    firstCol.removeClass("col-lg-9");
    firstCol.addClass("col-lg-12");

    secondRow.append(parentE);
    var parentE = $(".order-panel-E").parent();
    parentE.removeClass("col-lg-3");
    parentE.addClass("col-lg-12");
  }

  parentC.toggleClass("d-none");
  parentD.toggleClass("d-none");
  $(".icon-contract-e").toggleClass("d-none");
  toggleExpandIcon();

  animateWidth(panelE, srcWidth);
}

function expandPanelD(event) {
  event.stopPropagation();
  event.stopImmediatePropagation();

  var parentA = $(".order-panel-A").parent();
  var parentB = $(".order-panel-B").parent();
  var parentC = $(".order-panel-C").parent();
  var parentD = $(".order-panel-D").parent();
  var parentE = $(".order-panel-E").parent().detach();

  var panelD = $(".order-panel-D");
  const srcWidth = panelD.width();

  var mainRow = $(".main-row");
  var firstRow = $(".first-row");
  var firstCol = $(".first-col");

  if (parentC.hasClass("d-none")) {
    // from full view
    parentD.removeClass("col-lg-12");
    parentD.addClass("col-lg-8");

    firstCol.removeClass("col-lg-12");
    firstCol.addClass("col-lg-9");

    firstCol.removeClass("col-lg-12");
    firstCol.addClass("col-lg-9");
    mainRow.append(parentE);
    var panelE = $(".order-panel-E");

    parentA.removeClass("col-lg-6");
    parentA.addClass("col-lg-8");
    parentB.removeClass("col-lg-3");
    parentB.addClass("col-lg-4");
    panelE.removeClass("h-300");
  } else {
    // to full view
    parentD.removeClass("col-lg-8");
    parentD.addClass("col-lg-12");

    firstCol.removeClass("col-lg-9");
    firstCol.addClass("col-lg-12");
    firstRow.append(parentE);
    var panelE = $(".order-panel-E");

    parentA.removeClass("col-lg-8");
    parentA.addClass("col-lg-6");
    parentB.removeClass("col-lg-4");
    parentB.addClass("col-lg-3");
    panelE.addClass("h-300");
  }
  parentC.toggleClass("d-none");
  $(".icon-contract-d").toggleClass("d-none");
  toggleExpandIcon();

  animateWidth(panelD, srcWidth);
}

function animateOpacity(panel, from, to, parent) {
  panel.css("opacity", from);
  panel.animate(
    {
      opacity: to,
    },
    300,
    "swing",
    function () {
      panel.css("opacity", 1);
      parent.toggleClass("d-none");
    }
  );
}

function animateWidth(panel, srcWidth) {
  const dstWidth = panel.width();
  panel.css("opacity", 0.5);
  panel.css("width", srcWidth);
  panel.animate(
    {
      width: dstWidth + "px",
      opacity: 1,
    },
    200,
    "swing",
    function () {
      panel.css("width", "100%");
    }
  );
}

function animateHeight(panel, srcHeight, classToAdd, forceDstHeight) {
  var dstHeight = forceDstHeight;
  if (dstHeight === undefined) {
    dstHeight = panel.height();
  }
  panel.css("opacity", 0.5);
  panel.css("height", srcHeight);
  panel.animate(
    {
      height: dstHeight + "px",
      opacity: 1,
    },
    1000,
    "swing",
    function () {
      panel.css("height", "100%");
      if (classToAdd !== undefined) {
        panel.toggleClass(classToAdd);
      }
    }
  );
}

function toggleExpandIcon() {
  $(".icon-expand-c").toggleClass("d-lg-block");
  $(".icon-expand-d").toggleClass("d-lg-block");
  $(".icon-expand-e").toggleClass("d-lg-block");
}

function adjustCss() {
  $("td").css({ height: "30px" });
  $("td > a").css({ height: "30px" });
  $("td > a > div > div > p").css({ height: "20px" });
  $("td > a > div > div > p")
    .parent()
    .parent()
    .parent()
    .parent()
    .css({ height: "30px" });
}

function removeBeakLines() {
  $("br").remove();
}

function vhToPx(vh) {
  return (vh * document.documentElement.clientHeight) / 100;
}

function getShowMoreHtml() {
  return `<div class="panel-show-more">
  <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-arrow-down-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
    </svg>
</div>
<div class="panel-show-less d-none">
  <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-arrow-up-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
    </svg>                                
</div>`;
}
