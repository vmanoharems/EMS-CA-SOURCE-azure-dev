var AtlasPaste = {
    _Data: undefined
    , Config: {
        _documentConfig_lines: undefined //["DEBIT", "CREDIT", "VENDOR", "TAXCODE", "DESCRIPTION"]
        , _clearcallback: () => { }
        , _afterpastecallback: () => { }
        , _PastetoDocument: undefined
        , _DestinationTable: undefined
        , _CurrentTableRowID: undefined
        , _DisplayPreviewOffset: undefined
        , IgnoreList: {}
        , StaticColumns: function (setConfig) {
            if (setConfig) AtlasPaste.Config._documentConfig_lines = setConfig;
            return this._documentConfig_lines;
        }        
        , CurrentTableRow: function (rowID) {
            if (rowID === undefined) return AtlasPaste._CurrentTableRowID;
            AtlasPaste._CurrentTableRowID = rowID
        }
        , PastetoTable: function (callforward) {
            if (typeof callforward === 'function') AtlasPaste.Config._PastetoDocument = callforward;
        }
        , DestinationTable: (tableID) => {
            if (tableID === undefined) return AtlasPaste._DestinationTable;
            AtlasPaste._DestinationTable = tableID;

            // Assign the object to which we'll delegate paste functionality
            $(`#${tableID}`).delegate('.clsPaste', 'paste', function (e) {
                AtlasPaste.Config.CurrentTableRow(this.parentElement.parentElement.id); // Set the ID of the current row so that we know where to insert for future features.
                AtlasPaste.Paste(e);
            });
        }
        , DisplayOffset(objOffset) {
            if (objOffset === undefined) return AtlasPaste.Config._DisplayPreviewOffset;
            AtlasPaste.Config._DisplayPreviewOffset = objOffset;
        }
        , Clearcallback(callback) {
            if (typeof callback === 'function') {
                AtlasPaste.Config._clearcallback = callback;
            }
        }
        , AfterPastecallback(callback) {
            if (typeof callback === 'function') {
                AtlasPaste.Config._afterpastecallback = callback;
            }
        }
    }
    , hasHeader: false
    , tableHeaders: null
    , tblHeaderLength: 0
    , fnClear: function () {
        AtlasPaste.Config._clearcallback();
    }
    , PastetoTable: function (data, action) {
        if (AtlasPaste.Config._PastetoDocument === undefined) return -1;
        return AtlasPaste.Config._PastetoDocument(data, action);
    }
    , PastetoDocument: function (action) {
        AtlasPaste.Preview.Headers = {};
        AtlasPaste.Preview.UserSelectedHeaders('tblAtlasPastePreview');
        let Paste = AtlasPaste.Preview.BuildData('tblAtlasPastePreview');
        // #1556 Rely solely on the proper setup and execution of the _clearcallback() function
        //if (action === 'clear') $(`#${AtlasPaste.Config.DestinationTable()}`).empty(); // Empty the current table values
        Paste.forEach(function (e) {
            AtlasPaste.PastetoTable(e, action);
        });

        AtlasPaste.Config._afterpastecallback(action);

        $('#AtlasPasteHtmlOverlayPopup').hide();
    }
    , Preview: {
        Headers: {}
        , UserSelectedHeaders: function (tblID) {
            $(`table#${tblID} thead tr th`).each(function () {
                if (this.children.length === 1) {
                    //let selectedop = this.children[0].selectedOptions[0].innerText;
                    let selectedop = (this.children[0].name);
                    try {
                        if (!selectedop) {
                            selectedop = this.children[0].children[0].selectedOptions[0].text; // Needed because of AtlasInvoice
                        }
                    } catch (e) {
                        selectedop = '';
                    }
                    if (!AtlasPaste.Config.IgnoreList[selectedop] && !AtlasPaste.Preview.Headers[selectedop] /* This is only required because of StickyHeaders.*/) {
                        AtlasPaste.Preview.Headers[selectedop] = this.cellIndex
                    }
                }
            })
        }
        , Data: {}
        , BuildData: function (tblID) {
            let ret = []
            $(`#${tblID}`).find('.APInclude:checked').each(function (index) {
                let tr = this.parentElement.parentElement;
                let rowdata = {}
                Object.keys(AtlasPaste.Preview.Headers).forEach(function (e) {
                    rowdata[e] = tr.cells[AtlasPaste.Preview.Headers[e]].innerText
                    //console.log();
                });
                ret.push(rowdata);
            });
            return ret;
        }
    }
    , FillFieldValue: function (objData, field, def) {
        let thevalue = objData[field];
        let theupper = objData[field.toUpperCase()];
        //field = field.toUpperCase();
        if (
            (thevalue === undefined || thevalue === '' || thevalue === null)
            && (theupper === undefined || theupper === '' || theupper === null)
            ) {
            return ((def === undefined) ? '' : def);
        } else {
            return (thevalue)? thevalue: objData[field.toUpperCase()];
        }
    }
    , Paste: function (e) {
        let $start = $(this);
        let source;
        //check for access to clipboard from window or event
        if (window.clipboardData !== undefined) {
            source = window.clipboardData
        } else {
            source = e.originalEvent.clipboardData;
        }
        var data = source.getData("Text");
        //papa parse initilization for binding data

        rowCount = 0;
        errorCount = 0;
        firstError = undefined;
        let config = AtlasPaste.buildPapaConfig(this.hasHeader);
        let input = data;

        start = AtlasPaste.now();
        let results = Papa.parse(input, config);

        //Show Overlay Popup
        $("#AtlasPasteHtmlOverlayPopup").show();
        $('#AtlasPasteHtmlOverlayPopup').offset(AtlasPaste.Config.DisplayOffset());
        e.preventDefault();
        //  });
    },
    buildPapaConfig: function (hasHeader) {
        return {
            header: hasHeader,
            skipEmptyLines: true,
            complete: AtlasPaste.completeFn,
            error: AtlasPaste.errorFn,
        };
    },
    completeFn: function completeFn(results) {
        let A_Data = results.data; // Default to accepting a paste w/o a header line
        AtlasPaste._Data = results.data;

        end = AtlasPaste.now();
        if (results && results.errors) {
            if (results.errors) {
                errorCount = results.errors.length;
                firstError = results.errors[0];
            }
            if (results.data && results.data.length > 0)
                rowCount = results.data.length;
        }

        let A_tableconstruct = A_Data[0].map(function (x) { return x.toUpperCase(); }); //A_Data[0];
        if (this.hasHeader) { // If user defines the paste as a paste with headers, then pull the headers from the results.meta object
            A_tableconstruct = results.meta.fields;
        }
        let headerStaticCols = AtlasPaste.Config._documentConfig_lines; // Use AtlasPaste line configuration
        if (A_tableconstruct.length !== AtlasPaste.tblHeaderLength) {
            let TransactionCodes = (AtlasCache.Cache.GetItembyName('Config.TransactionCodes'))? AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON: [];
            let ColumnSelect = document.createElement('SELECT');
            $(ColumnSelect).addClass('AtlasPasteSelect');

            let selOptions = {};
            selOptions['ignore'] = document.createElement('option');
            selOptions['ignore'].text = 'ignore';
            ColumnSelect.add(selOptions['ignore']);

            AtlasUtilities.SEGMENTS_CONFIG.sequence.forEach(function (column, i) {
                let COLINDEX = column.SegmentCode.toUpperCase();
                selOptions[COLINDEX] = { element: document.createElement('option'), 'type': 'segment', 'class': 'drpPasteSegment' };
                selOptions[COLINDEX].element.text = column.SegmentCode.toUpperCase();
                ColumnSelect.add(selOptions[COLINDEX].element);
            });
            TransactionCodes.forEach(function (column, i) {
                let COLINDEX = column.TransCode.toUpperCase();
                selOptions[COLINDEX] = { element: document.createElement('option'), 'type': 'segment', 'class': 'drpPasteSegment' };
                selOptions[COLINDEX].element.text = column.TransCode.toUpperCase();
                ColumnSelect.add(selOptions[COLINDEX].element);
            });
            headerStaticCols.forEach(function (column, i) {
                let COLINDEX = column.toUpperCase();
                selOptions[COLINDEX] = { element: document.createElement('option'), 'type': 'static', 'class': 'drpPasteDefault' };
                selOptions[COLINDEX].element.text = column.toUpperCase();
                ColumnSelect.add(selOptions[COLINDEX].element);
            });

            let tableHeaders = A_tableconstruct.reduce((obj, col, ci) => {
                var headCount = 0;
                $(ColumnSelect).attr('name', col);

                if (selOptions[col]) {
                    selOptions[col].element.selected = true;
                    if (selOptions[col].class) {
                        ColumnSelect.className = selOptions[col].class + ' AtlasPasteSelect'
                    } else {
                        ColumnSelect.className = '';
                    }
                } else {
                    selOptions['ignore'].selected = true;
                }
                DdlPasteHeader = '';
                DdlPasteHeader = ColumnSelect.outerHTML.replace(ColumnSelect.selectedOptions[0].outerHTML, ColumnSelect.selectedOptions[0].outerHTML.replace('<option>', '<option selected>'));

                obj.withheader.push({ data: col });
                obj.thehtml += '<th class="AtlasPasteHeader">' + DdlPasteHeader + '</th>';
                ////Child Checkbox
                //if (ci == 0) obj.thearray.push([col]);
                ////Child Checkbox
                obj.thearray.push([col]);
                return obj;
            }, { withheader: [{ 'data': 'checkbox' }], thearray: [''], thehtml: '<th class="AtlasPasteHeader"></th>' }); // pass in the empty starting values

            //Assigning dropdown value to atlaspaste variable for one time dd binging
            AtlasPaste.tableHeaders = tableHeaders;
        } else {
            AtlasPaste.tblHeaderLength = AtlasPaste.tableHeaders.withheader.length;
        }
        //Child Checkbox
        $.each(A_Data, function (index, addChkBx) {
            //addChkBx.unshift('<input type="checkbox" class="APInclude" checked Id="chkChild' + index + '">');
            addChkBx.unshift('');
        });
        //Child Checkbox
        $('#pasteDiv').empty();
        $('#pasteDiv').append('<table id="tblAtlasPastePreview" class="display"  width="100%"><thead><tr>'
            //+ '<th><input type="checkBox" class="" id="ChkHeaderPaste" onchange="javascript:CheckUncheckAllPaste();"/></th>' //Header Checkbox
            + AtlasPaste.tableHeaders.thehtml + '</tr></thead></table>');

        let PPHeight = $('#Atlas_Content').height() - 210; // Fill the right pane Content - space for breadcrumbs - space for dialog header and dialog footer

        let tblAtlasPastePreview = $('#tblAtlasPastePreview').DataTable({
            dom: "Bfrtip",
            bSort: false,
            destroy: true,
            ServerMethod: "POST",
            lengthChange: true,
            responsive: false,
            deferRender: true,
            pageResize: false,
            fixedHeader: true,
            //colReorder: true,
            //rowReorder: true,
            data: A_Data, // We're assuming the Data matches the table construct
            paging: false,
            //scrollY: PPHeight, /// This is resulting in an error. Appears to be a DataTables bug 
            columns: (this.hasHeader === true) ? AtlasPaste.tableHeaders.withheader : AtlasPaste.tableHeaders.thearray
            , "language": {
                "emptyTable": "Processing your data..."
            }

            , columnDefs: [{
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" class="APInclude" checked Id="chkChild' + meta.row + '">';
                }
                , orderable: false,
                targets: 0
            }]

        })
        ;
        $('#tblAtlasPastePreview').stickyTableHeaders({ scrollableArea: $('#pasteDiv') });

        $('.AtlasPasteSelect').change(function () {
            if (this.value === 'ignore') { // Add to the ignore list
                AtlasPaste.Config.IgnoreList[this.name] = this.value;
                return;
            } else if (AtlasPaste.Config.IgnoreList[this.name]) { // Delete from the ignore list
                delete AtlasPaste.Config.IgnoreList[this.name];
            }

            this.name = this.value;
        });
    },
    errorFn: function errorFn(err, file) {
        end = now();
        console.log("ERROR:", err, file);
    },
    now: function now() {
        return typeof window.performance !== 'undefined'
                ? window.performance.now()
                : 0;
    },
    //FunDynamicHead: function FunDynamicHead() {

    //}
}

function CheckUncheckAllPaste() {
    var checked = $('#ChkHeaderPaste').prop('checked');
    //console.log(checked);
    $('#tblAtlasPastePreview').find('input:checkbox').prop('checked', checked);
    //if (checked) {
    //    $('#tblAtlasPastePreview').find('input:checkbox').addClass('APInclude');
    //} else {
    //    $('#tblAtlasPastePreview').find('input:checkbox').removeClass('APInclude');
    //}
}

function fnApplyAndAppend(saveFlag) {
    if (saveFlag == 'Apply')
        hideDiv('tblAtlasPastePreview');
    else if (saveFlag == 'ApplyAndAppend')
        hideDiv('tblAtlasPastePreview');
}

$(document).ready(function () {
    $('#AtlasClearPaste').click(function () {
        AtlasPaste.fnClear();
        AtlasPaste.PastetoDocument('clear');
    });
    $('#AtlasPasteAppend').click(function () {
        AtlasPaste.PastetoDocument('append');
    });
})


/*!
 * StickyTableHeaders 0.1.24 (2018-01-14 23:29)
 * MIT licensed
 * Copyright (C) Jonas Mosbech - https://github.com/jmosbech/StickyTableHeaders
 */
!function (e, i, t) { "use strict"; var o = "stickyTableHeaders", n = 0, d = { fixedOffset: 0, leftOffset: 0, marginTop: 0, objDocument: document, objHead: "head", objWindow: i, scrollableArea: i, cacheHeaderHeight: !1, zIndex: 3 }; e.fn[o] = function (t) { return this.each(function () { var l = e.data(this, "plugin_" + o); l ? "string" == typeof t ? l[t].apply(l) : l.updateOptions(t) : "destroy" !== t && e.data(this, "plugin_" + o, new function (t, l) { var a = this; a.$el = e(t), a.el = t, a.id = n++, a.$el.bind("destroyed", e.proxy(a.teardown, a)), a.$clonedHeader = null, a.$originalHeader = null, a.cachedHeaderHeight = null, a.isSticky = !1, a.hasBeenSticky = !1, a.leftOffset = null, a.topOffset = null, a.init = function () { a.setOptions(l), a.$el.each(function () { var i = e(this); i.css("padding", 0), a.$originalHeader = e("thead:first", this), a.$clonedHeader = a.$originalHeader.clone(), i.trigger("clonedHeader." + o, [a.$clonedHeader]), a.$clonedHeader.addClass("tableFloatingHeader"), a.$clonedHeader.css({ display: "none", opacity: 0 }), a.$originalHeader.addClass("tableFloatingHeaderOriginal"), a.$originalHeader.after(a.$clonedHeader), a.$printStyle = e('<style type="text/css" media="print">.tableFloatingHeader{display:none !important;}.tableFloatingHeaderOriginal{position:static !important;}</style>'), a.$head.append(a.$printStyle) }), a.$clonedHeader.find("input, select").attr("disabled", !0), a.updateWidth(), a.toggleHeaders(), a.bind() }, a.destroy = function () { a.$el.unbind("destroyed", a.teardown), a.teardown() }, a.teardown = function () { a.isSticky && a.$originalHeader.css("position", "static"), e.removeData(a.el, "plugin_" + o), a.unbind(), a.$clonedHeader.remove(), a.$originalHeader.removeClass("tableFloatingHeaderOriginal"), a.$originalHeader.css("visibility", "visible"), a.$printStyle.remove(), a.el = null, a.$el = null }, a.bind = function () { a.$scrollableArea.on("scroll." + o, a.toggleHeaders), a.isWindowScrolling || (a.$window.on("scroll." + o + a.id, a.setPositionValues), a.$window.on("resize." + o + a.id, a.toggleHeaders)), a.$scrollableArea.on("resize." + o, a.toggleHeaders), a.$scrollableArea.on("resize." + o, a.updateWidth) }, a.unbind = function () { a.$scrollableArea.off("." + o, a.toggleHeaders), a.isWindowScrolling || (a.$window.off("." + o + a.id, a.setPositionValues), a.$window.off("." + o + a.id, a.toggleHeaders)), a.$scrollableArea.off("." + o, a.updateWidth) }, a.debounce = function (e, i) { var t = null; return function () { var o = this, n = arguments; clearTimeout(t), t = setTimeout(function () { e.apply(o, n) }, i) } }, a.toggleHeaders = a.debounce(function () { a.$el && a.$el.each(function () { var i, t, n, d = e(this), l = a.isWindowScrolling ? isNaN(a.options.fixedOffset) ? a.options.fixedOffset.outerHeight() : a.options.fixedOffset : a.$scrollableArea.offset().top + (isNaN(a.options.fixedOffset) ? 0 : a.options.fixedOffset), s = d.offset(), r = a.$scrollableArea.scrollTop() + l, c = a.$scrollableArea.scrollLeft(), f = a.isWindowScrolling ? r > s.top : l > s.top; f && (t = a.options.cacheHeaderHeight ? a.cachedHeaderHeight : a.$clonedHeader.height(), n = (a.isWindowScrolling ? r : 0) < s.top + d.height() - t - (a.isWindowScrolling ? 0 : l)), f && n ? (i = s.left - c + a.options.leftOffset, a.$originalHeader.css({ position: "fixed", "margin-top": a.options.marginTop, top: 0, left: i, "z-index": a.options.zIndex }), a.leftOffset = i, a.topOffset = l, a.$clonedHeader.css("display", ""), a.isSticky || (a.isSticky = !0, a.updateWidth(), d.trigger("enabledStickiness." + o)), a.setPositionValues()) : a.isSticky && (a.$originalHeader.css("position", "static"), a.$clonedHeader.css("display", "none"), a.isSticky = !1, a.resetWidth(e("td,th", a.$clonedHeader), e("td,th", a.$originalHeader)), d.trigger("disabledStickiness." + o)) }) }, 0), a.setPositionValues = a.debounce(function () { var e = a.$window.scrollTop(), i = a.$window.scrollLeft(); !a.isSticky || e < 0 || e + a.$window.height() > a.$document.height() || i < 0 || i + a.$window.width() > a.$document.width() || a.$originalHeader.css({ top: a.topOffset - (a.isWindowScrolling ? 0 : e), left: a.leftOffset - (a.isWindowScrolling ? 0 : i) }) }, 0), a.updateWidth = a.debounce(function () { if (a.isSticky) { a.$originalHeaderCells || (a.$originalHeaderCells = e("th,td", a.$originalHeader)), a.$clonedHeaderCells || (a.$clonedHeaderCells = e("th,td", a.$clonedHeader)); var i = a.getWidth(a.$clonedHeaderCells); a.setWidth(i, a.$clonedHeaderCells, a.$originalHeaderCells), a.$originalHeader.css("width", a.$clonedHeader.width()), a.options.cacheHeaderHeight && (a.cachedHeaderHeight = a.$clonedHeader.height()) } }, 0), a.getWidth = function (t) { var o = []; return t.each(function (t) { var n, d = e(this); if ("border-box" === d.css("box-sizing")) { var l = d[0].getBoundingClientRect(); n = l.width ? l.width : l.right - l.left } else if ("collapse" === e("th", a.$originalHeader).css("border-collapse")) if (i.getComputedStyle) n = parseFloat(i.getComputedStyle(this, null).width); else { var s = parseFloat(d.css("padding-left")), r = parseFloat(d.css("padding-right")), c = parseFloat(d.css("border-width")); n = d.outerWidth() - s - r - c } else n = d.width(); o[t] = n }), o }, a.setWidth = function (e, i, t) { i.each(function (i) { var o = e[i]; t.eq(i).css({ "min-width": o, "max-width": o }) }) }, a.resetWidth = function (i, t) { i.each(function (i) { var o = e(this); t.eq(i).css({ "min-width": o.css("min-width"), "max-width": o.css("max-width") }) }) }, a.setOptions = function (i) { a.options = e.extend({}, d, i), a.$window = e(a.options.objWindow), a.$head = e(a.options.objHead), a.$document = e(a.options.objDocument), a.$scrollableArea = e(a.options.scrollableArea), a.isWindowScrolling = a.$scrollableArea[0] === a.$window[0] }, a.updateOptions = function (e) { a.setOptions(e), a.unbind(), a.bind(), a.updateWidth(), a.toggleHeaders() }, a.init() }(this, t)) }) } }(jQuery, window);
