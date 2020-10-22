const DEVEL = false;

$(document).ready(function () {
  handleLoader();

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

function handleLoader() {
  updateProgess(true);
}

function updateProgess(up) {
  var i = 0;
  var counterBack = setInterval(function () {
    i++;
    if (i <= 100) {
      const width = up ? i : 100 - i
      $(".progress-bar").css("width", width + "%");
    } else {
      clearInterval(counterBack);
      if (!$("#loader").hasClass("d-none")) {
        updateProgess(!up);
      }
    }
  }, 100);
}

function onDataRetrieved() {
  removeBeakLines();
  registerExpandClick();
  adjustCss();
  showMoreE();
  handlePanelShowMore();
  handlePanelFullScreen();
  handlePanelExpandSide();
  handleSubColumnFullScreen();
  updateExhibitorColor();
  reloadOpenStreetMaps();
}

function reloadOpenStreetMaps() {
  setTimeout(function () {
    const maps = $("#osm-place");
    for (const map of maps) {
      $(map).attr("src", $(map).attr("src"));
    }
  }, 1000);

  $("#osm-place").parent().prepend(getFullMap());
  $(".icon-full-map").on("click", showFullMap);
}

function updateExhibitorColor() {
  //$('.operatus-table-title').css('background-color', '#E0E0E0');
  const rgb = $("#coloRgb").val();
  if (rgb === undefined || !rgb || 0 === rgb.length) {
    return;
  }
  $(".sub-col-title").css("background-color", "#" + rgb);
  $(".panel-col-title").css("background-color", "#" + rgb);
}

function handlePanelExpandSide() {
  $(".panel-col-title").prepend(getExpandSideScreen());
  $(".icon-expand-side").on("click", expandPanelSide);
  $(".icon-contract-side").on("click", expandPanelSide);

  const panels = $(".panel-col-title").closest(".order-panel-D");
  for (const p of panels) {
    const row = $(p).find(".panel-col-title");
    $(row).parent().addClass("pr-lg-1");
  }
}

function handlePanelFullScreen() {
  $(".operatus-expand-full").prepend(
    getExpandFullScreen("icon-expand", "icon-contract")
  );
  $(".icon-expand").on("click", expandPanelFull);
  $(".icon-contract").on("click", expandPanelFull);

  $(".operatus-expand-hidden-3").addClass("d-lg-none");
  $(".operatus-expand-hidden-12").addClass("d-lg-none");

  $(".sub-col-A > .operatus-expand-main").parent().toggleClass("col-lg-4");
  $(".sub-col-B > .operatus-expand-main").parent().toggleClass("col-lg-4");
  $(".sub-col-C > .operatus-expand-main").parent().toggleClass("col-lg-4");
}

function handleSubColumnFullScreen() {
  $(".operatus-expand-sub-col-full > .operatus-table-panel").append(
    getExpandFullScreen("icon-expand-2", "icon-contract-2")
  );

  $(".icon-expand-2").on("click", expandSubColumnFull);
  $(".icon-contract-2").on("click", expandSubColumnFull);
}

function handlePanelShowMore() {
  $(".operatus-row-hidden").addClass("d-none");
  $(".operatus-expand-table").html(getShowMoreHtml());
  $(".panel-show-more").on("click", onShowMore);
  $(".panel-show-less").on("click", onShowMore);

  setTimeout(function () {
    $(".panel-show-more").toggleClass("panel-show-more-hover");
    $(".panelE-show-more").toggleClass("panelE-show-more-hover");
    $(".panelC-show-more").toggleClass("panelC-show-more-hover");
    $(".panelD-show-more").toggleClass("panelD-show-more-hover");
    setTimeout(function () {
      $(".panel-show-more").toggleClass("panel-show-more-hover");
      $(".panelE-show-more").toggleClass("panelE-show-more-hover");
      $(".panelC-show-more").toggleClass("panelC-show-more-hover");
      $(".panelD-show-more").toggleClass("panelD-show-more-hover");
    }, 1500);
  }, 1000);
}

function expandSubColumnFull(event) {
  const icon = event.target;
  const panel = icon.closest(".operatus-expand-sub-col-full");
  const subColumnC = icon.closest(".sub-col-C");
  if (panel === undefined || subColumnC === undefined) {
    return;
  }
  const srcWidth = $(panel).width();

  if ($(panel).hasClass("panel-expanded")) {
    animateWidth($(panel), srcWidth, srcWidth / 3, function () {
      handleSubColumnCExpand($(subColumnC), $(panel));
    });
  } else {
    handleSubColumnCExpand($(subColumnC), $(panel));
    animateWidth($(panel), srcWidth);
  }
}

function handleSubColumnCExpand(subColumnC, panel) {
  subColumnC.siblings(".sub-col-A").toggleClass("d-none");
  subColumnC.siblings(".sub-col-B").toggleClass("d-none");
  subColumnC.toggleClass("col-lg-4");
  subColumnC.toggleClass("pl-lg-1");
  subColumnC.children().each(function () {
    $(this).toggleClass("d-none");
  });
  panel.toggleClass("d-none");
  panel.toggleClass("panel-expanded");

  panel.find(".icon-expand-2").toggleClass("d-lg-block");
  panel.find(".icon-contract-2").toggleClass("d-none");
}

function showFullMap(event) {
  const icon = event.target;
  const panel = icon.closest(".operatus-table-panel");
  if (panel === undefined) {
    return;
  }
  const url = $(panel).find("#osm-place").attr("srcfull");
  if (url) {
    window.open(url, "_blank");
  }
}

function expandPanelSide(event) {
  const icon = event.target;
  const panel = icon.closest(".panel-col-title");
  const columnPanel = icon.closest(".inner-panel");
  if (panel === undefined || columnPanel === undefined) {
    return;
  }
  const isC = $(columnPanel).parent().hasClass("order-panel-C");
  const parentC = $(".order-panel-C").parent();
  const parentD = $(".order-panel-D").parent();
  const panelC = $(".order-panel-C");
  const panelD = $(".order-panel-D");
  var srcWidth = 0;
  var srcPanel = undefined;
  var otherPanel = undefined;
  if (isC) {
    srcWidth = parentC.width();
    srcPanel = panelC;
    otherPanel = panelD;
    parentC.toggleClass("col-lg-4");
    parentD.toggleClass("d-none");
  } else {
    srcWidth = parentD.width();
    srcPanel = panelD;
    otherPanel = panelC;
    parentD.toggleClass("col-lg-8");
    parentC.toggleClass("d-none");
  }
  animateOpacity($(otherPanel), 0, 1, undefined);
  animateWidth($(srcPanel), srcWidth, $(srcPanel).width());

  $(panel).find(".icon-contract-side").toggleClass("d-none");
  $(".icon-expand-side").toggleClass("d-lg-block");
  $(".icon-expand").toggleClass("d-lg-block");
}

function expandPanelFull(event) {
  const icon = event.target;
  const panel = icon.closest(".operatus-expand-full");
  const columnPanel = icon.closest(".inner-panel");
  if (panel === undefined || columnPanel === undefined) {
    return;
  }
  $(panel).find(".operatus-expand-hidden-3").toggleClass("d-lg-none");
  $(panel).find(".operatus-expand-hidden-3").toggleClass("col-lg-4");
  $(panel).find(".operatus-expand-hidden-12").toggleClass("d-lg-none");

  $(panel).find(".operatus-expand-main-3").toggleClass("col-lg-4");

  $(panel).find(".operatus-expand-main-hidden").toggleClass("d-lg-none");
  $(panel).find(".operatus-expand-main-hidden").toggleClass("col-lg-4");

  $(panel)
    .find(".sub-col-A > .operatus-expand-main")
    .parent()
    .toggleClass("col-lg-4");
  $(panel)
    .find(".sub-col-B > .operatus-expand-main")
    .parent()
    .toggleClass("col-lg-4");
  $(panel)
    .find(".sub-col-C > .operatus-expand-main")
    .parent()
    .toggleClass("col-lg-4");
  $(panel).find(".sub-col-title").toggleClass("d-lg-flex");

  $(".order-panel-D").parent().toggleClass("pl-lg-1");

  $(columnPanel)
    .children()
    .each(function () {
      $(this).toggleClass("d-none");
    });
  $(panel).toggleClass("d-none");
  expandPanelD(event);

  const tablePanels = $(panel).find(".operatus-table-panel");
  tablePanels.each(function () {
    tableShowMore($(this));
  });
  $(panel).find(".icon-expand").toggleClass("d-lg-block");
  $(panel).find(".icon-contract").toggleClass("d-none");
}

function onShowMore(event) {
  const icon = event.target;
  const table = icon.closest(".operatus-table-panel");
  if (table === undefined) {
    return;
  }
  tableShowMore($(table.children[0]));
}

function tableShowMore(tablePanel) {
  const hiddenRows = tablePanel.find(".operatus-row-hidden");
  if (hiddenRows.length === 0) {
    return;
  }
  const tableParent = tablePanel.parent();
  const showIcon = tableParent.find(".show-more-svg");
  const srcHeight = tableParent.height();

  tableParent.css("overflow-y", "hidden");
  tableParent.css("opacity", 0.5);

  hiddenRows.toggleClass("d-none");

  const dstHeight = tableParent.height();
  if (srcHeight === 0 && dstHeight === 0) {
    showIcon.parent().toggleClass("d-none");
    tableParent.css("opacity", "");
    tableParent.css("overflow-y", "");
    return;
  }

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
      tableParent.css("overflow-y", "");
      showIcon.parent().toggleClass("d-none");
      tableParent.css("height", "");
    }
  );
}

function showMoreE() {
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
  $(".icon-expand-e").on("click", expandPanelE);
  $(".icon-contract-e").on("click", expandPanelE);
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
  var parentE = $(".order-panel-E").parent();
  const panelA = $(".order-panel-A");
  const panelB = $(".order-panel-B");
  const panelC = $(".order-panel-C");
  const panelE = $(".order-panel-E");
  var panelD = $(".order-panel-D");
  const srcWidth = panelD.width();
  var firstCol = $(".first-col");

  if (parentC.hasClass("d-none")) {
    // from full view
    parentD.removeClass("col-lg-12");
    parentD.addClass("col-lg-8");

    firstCol.removeClass("col-lg-12");
    firstCol.addClass("col-lg-9");
  } else {
    // to full view
    parentD.removeClass("col-lg-8");
    parentD.addClass("col-lg-12");

    firstCol.removeClass("col-lg-9");
    firstCol.addClass("col-lg-12");
  }
  animateOpacity(panelA, 0, 1, undefined);
  animateOpacity(panelB, 0, 1, parentB);
  animateOpacity(panelC, 0, 1, parentC);
  animateOpacity(panelE, 0, 1, parentE);

  parentA.toggleClass("col-lg-8");
  $(".icon-contract-d").toggleClass("d-none");
  toggleExpandIcon();

  animateWidth(panelD, srcWidth);
}

function animateOpacity(panel, from, to, parent) {
  if (parent && from === 0) {
    parent.toggleClass("d-none");
  }
  panel.css("opacity", from);
  panel.animate(
    {
      opacity: to,
    },
    400,
    "swing",
    function () {
      if (parent && to === 0) {
        parent.toggleClass("d-none");
      }
      panel.css("opacity", 1);
    }
  );
}

function animateWidth(panel, srcWidth, forceDstWidth, doneFunction) {
  var dstWidth = panel.width();
  if (forceDstWidth !== undefined) {
    dstWidth = forceDstWidth;
  }
  panel.css("opacity", 0.5);
  panel.css("width", srcWidth);
  panel.animate(
    {
      width: dstWidth + "px",
      opacity: 1,
    },
    500,
    "swing",
    function () {
      panel.css("width", "auto");
      if (doneFunction !== undefined) {
        doneFunction();
      }
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

  $('[data-toggle="tooltip"]').tooltip();
}

function removeBeakLines() {
  $("br").remove();
}

function vhToPx(vh) {
  return (vh * document.documentElement.clientHeight) / 100;
}

function getShowMoreHtml() {
  return `<div class="panel-show-more">
  <svg class="show-more-svg" width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-arrow-down-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
    </svg>
</div>
<div class="panel-show-less d-none">
  <svg class="show-more-svg" width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-arrow-up-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
    </svg>                                
</div>`;
}

function getExpandFullScreen(classExpand, classContract) {
  return `<div class="${classExpand} d-none d-lg-block">
    <svg class="show-expand-svg" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrows-angle-expand" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"></path>
    </svg>
  </div>
  <div class="${classContract} d-none">
    <svg class="show-expand-svg" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrows-angle-contract" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707zM15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707z"></path>
    </svg>
  </div>`;
}

function getExpandSideScreen() {
  return `<div class="icon-expand-side d-none d-lg-block">
    <svg class="show-expand-side-svg" width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-arrow-bar-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"></path>
  </svg>
  </div>
    <div class="icon-contract-side d-none">
      <svg class="show-expand-side-svg" width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-arrow-bar-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"></path>
    </svg>
  </div>`;
}

function getFullMap() {
  return `<div class="icon-full-map d-none d-lg-block">
  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-map" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z"/>
  </svg>
  </div>`;
}
