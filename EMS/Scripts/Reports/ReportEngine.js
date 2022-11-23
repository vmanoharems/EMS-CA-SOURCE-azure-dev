"use strict";

function ReportEngine(apiURL, objForm) {
    this.callbacks = {};
    this.ReportTitle = undefined;
    this.setAPIurl(apiURL);
    this.setobjForm(objForm);
    this.TabInfo = {
        DisplayinTab: false
        , printTab: undefined
        , printFrame: undefined
        , PDFurl: ''
    };
    let centerX = window.innerWidth * .5;
    let centerY = window.innerHeight * .5;

    if (objForm) {
        this.callingDocumentTitle = (objForm.callingDocumentTitle === undefined) ? document.title : objForm.callingDocumentTitle;
        this.ReportTitle = (objForm.ReportTitle === undefined) ? '' : objForm.ReportTitle;
        this.DIVBase = this.ReportTitle.toString().replace(/ /g, '');
    }

    if ($('#REfadeDIV' + this.DIVBase)) {
        $('#REfadeDIV' + this.DIVBase).remove(); // detach any existing DIV
    }
    let fadeDIV = document.createElement('div');
    fadeDIV.id = 'REfadeDIV' + this.DIVBase;
    //        fadeDIV.style.cssText = "    display: none;    position: fixed;    top: 0%;    left: 0%;    bottom: 0;    width: 100%;    height: 100%;    background-color: black;    z-index: 1001;    opacity: 0.4;";
    fadeDIV.className = 'REfadeDIVclass';
    document.getElementById('wrapper_main').appendChild(fadeDIV);


    if ($('#REerrorDIV' + this.DIVBase)) {
        $('#REerrorDIV' + this.DIVBase).remove(); // detach any existing DIV
    }
    let errorDIV = document.createElement('div');
    errorDIV.id = 'REerrorDIV' + this.DIVBase;
    //        errorDIV.className = 'REerrorDIVclass';
    errorDIV.style.cssText = " display: none;   position: fixed;   text-align: center;   top: " + (centerY - 150) + "px;   left: " + (centerX - 150) + "px; z-index: 9999;";
    errorDIV.innerHTML = "<h1>There was an error processing your report!</h1><a onclick=\"$('#REfadeDIV" + this.DIVBase + "').hide(); $('#REerrorDIV" + this.DIVBase + "').hide();\">Close</a>"
    document.getElementById('wrapper_main').appendChild(errorDIV);


    if ($('#RELoadingDIV' + this.DIVBase)) {
        $('#RELoadingDIV' + this.DIVBase).remove(); // detach any existing DIV
    }
    let loadingDIV = document.createElement('div');
    loadingDIV.id = 'RELoadingDIV' + this.DIVBase;
    loadingDIV.style.cssText = " display: none;   position: fixed;   text-align: center;   top: " + (centerY - 150) + "px;   left: " + (centerX - 150) + "px; z-index: 9999;";
    loadingDIV.innerHTML = "<span class=\"RELoadingSPAN\">LOADING REPORT... </span><br><img id=\"RELoadingDIV_img5\" src=\"/Images/loader_funnel.svg\" />";
    document.getElementById('wrapper_main').appendChild(loadingDIV);


    if ($('#RELoadingTabDIV' + this.DIVBase)) {
        $('#RELoadingTabDIV' + this.DIVBase).remove(); // detach any existing DIV
    }
    let loadingTabDIV = document.createElement('div');
    loadingTabDIV.id = 'RELoadingTabDIV' + this.DIVBase;
    loadingTabDIV.style.cssText = " display: none;   position: fixed;   text-align: center;   top: " + (centerY - 150) + "px;   left: " + (centerX - 150) + "px; z-index: 9999;";
    loadingTabDIV.innerHTML = "<span class=\"RELoadingSPAN\">LOADING REPORT in a new tab...</span> <br>";
    loadingTabDIV.innerHTML += "<br><a class=\"btn-default REdismissbutton pointerhand\"onclick=\"$('#" + loadingTabDIV.id + "').hide(); $('#REfadeDIV" + this.DIVBase + "').hide();\">Click here</a> <span class=\"RELoadingSPAN\"> to continue using Atlas while the report runs.</span><br>";
    loadingTabDIV.innerHTML += "<img class=\"RELoadingDIVimg\" id=\"RELoadingDIV_img5\" src=\"/Images/loader_funnel.svg\" />";
    document.getElementById('wrapper_main').appendChild(loadingTabDIV);

    this.loadingDIV = loadingDIV;
    this.loadingTabDIV = loadingTabDIV;
    this.fadeDIV = fadeDIV;
    this.errorDIV = errorDIV;
};

ReportEngine.prototype = {
    constructor: ReportEngine
    , setAPIurl: function (theURL) {
        this.APIurl = (theURL === undefined) ? '' : theURL;
    }
    , setobjForm: function (theForm) {
        this.FormJSON = (theForm === undefined) ? '' : theForm;
    }
    , setasExport: function (objExportRender) {
        this.isExport = true;
        this.FormJSON.isExport = true;
        this.ExportRender = objExportRender;
        this.FormJSON.ExportRender = objExportRender;
    }
    , setcallback: function (option, callback) {
        if (typeof callback === 'function') {
            this.callbacks[option] = callback
        }
    }
    , ShowLoadingAnimation: function () {
        document.title = 'Loading report... ' + this.ReportTitle;
        $('#REfadeDIV' + this.DIVBase).show();
        let ignorethis = (this.TabInfo.DisplayinTab) ? $('#' + this.loadingTabDIV.id).show() : $('#RELoadingDIV' + this.DIVBase).show();
    }
    , HideLoadingAnimation: function () {
        document.title = (document.title === 'Loading report... ' + this.ReportTitle) ? this.callingDocumentTitle : document.title;
        $('#RELoadingTabDIV' + this.DIVBase).hide()
        $('#RELoadingDIV' + this.DIVBase).hide();
        $('#REfadeDIV' + this.DIVBase).hide();
        //$('#RELoadingDIV').hide();
    }
    , PrintBrowserPDF: function () {
        let w = window.open(this.TabInfo.PDFurl);
        w.print();
        if (this.callbacks['Print']) {
            this.callbacks['Print']();
        }
    }
    , ClosePDF: function () {
        $('#dialog11').attr('style', 'display:none;');
        $('#dvFilterDv').attr('style', 'display:block');
        if (this.callbacks['Close']) {
            this.callbacks['Close']();
        }
    }
    , ShowError: function () {
        document.title = this.callingDocumentTitle;
        this.HideLoadingAnimation();
        $('#REfadeDIV' + this.DIVBase).show();
        $('#REerrorDIV' + this.DIVBase).show();
    }
    , NewTab: function () {
        this.TabInfo.DisplayinTab = true;
        this.TabInfo.printTab = window.open('');
        this.TabInfo.printTab.document.write("<img id=\"RELoadingDIV_gif\" src=\"/Images/InternetSlowdown_Day.gif\" style=\"width:480px; position:fixed; top:35%; left:35%\" />");
        this.TabInfo.printTab.document.title = 'Processing Report ' + this.ReportTitle;
    }
    , JSONParameters: function () {
        if (this.isJSONParametersCall) {
            return {
                callPayload: JSON.stringify(this.FormJSON)
            };
        } else {
            return this.FormJSON;
        }
    }
    , ajaxContentType: function () {
        if (this.isJSONParametersCall) {
            return 'application/x-www-form-urlencoded; charset=UTF-8';
        }
    }
    , RenderReport: function (response) {
        if (response === '') {
            alert('There is no data that matches the criteria you specified');
        } else {
            let ReportHTML = '';

            try { // Did we receive a JSON object with the report HTML?
                if (this.isExport) {

                    let theheader = {};
                    if (typeof response === 'object') {
                        ReportHTML = response;
                    } else if (typeof response === 'string') {
                        ReportHTML = JSON.parse(response);
                    }
                    let reportexportdata = $.map(ReportHTML.exportdata, function (ekey, evalue) {
                        let returnobj = {};
                        $.each(this.ExportRender, function (xindex, xvalue) {
                            if (typeof xvalue === 'function') {
                                let returnval = xvalue(ekey[xindex], ekey, returnobj); // Pass the current field as the first parameter and also the entire row
                                if (typeof returnval === 'object') {
                                    $.each(returnval, function (rindex, rvalue) {
                                        returnobj[rindex] = rvalue;
                                    });
                                } else if (returnval === undefined) { // if a field returns undefined then we will not include it
                                    return false;
                                } else {
                                    returnobj[xindex] = returnval; //xvalue(ekey[xindex]);
                                }
                            } else if (typeof xvalue === 'string') {
                                returnobj[xvalue] = ekey[xindex];
                            } else {
                                returnobj[xindex] = ekey[xindex];
                            }
                        });
                        return ((Object.keys(returnobj).length === 0 && returnobj.constructor === Object) ? undefined : returnobj);

                    }.bind(this));
                    let reportGUID = ReportHTML.GUID;
                    let exportFilename = this.ReportTitle + reportGUID + ".csv"

                    var csvData = new Blob([Papa.unparse({
                        //fields: theheader,
                        data: reportexportdata
                    })], {
                        type: 'text/csv;charset=utf-8;'
                    });

                    if (navigator.msSaveBlob) {
                        navigator.msSaveBlob(csvData, exportFilename);
                    } else {
                        //In FF link must be added to DOM to be clicked
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(csvData);
                        link.setAttribute('download', exportFilename);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        return;
                    }
                } else {
                    if (typeof response === 'object') {
                        ReportHTML = response.ReportHTML;
                        let objReportConfig = response.ReportConfig;
                        let objReportCSS = objReportConfig.ReportCSS;

                        //let objReportHTML = $.parseHTML(JSON.parse(response.resultHTML).m_StringValue);
                        this.RenderReportHTML(ReportHTML, objReportCSS, objReportConfig);
                    } else {
                        ReportHTML = JSON.parse(response).m_StringValue;
                        this.RenderReportHTML(ReportHTML); // We have no CSS or Config to render
                    }
                }
            } catch (e) {
                let fileName = response;
                let FILECompleteName = '/' + fileName;

                if (this.PDFViewer) {
                    localStorage.PDFViewer = FILECompleteName;
                    window.open('/Content/libs/PDFViewer/web/viewer.html');
                    return;
                } else {
                    //this.TabInfo.PDFurl = FILECompleteName; // Reset the URL for usage later

                    let DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
                    DialogContent += '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: G_RE.PrintBrowserPDF(\'\');" id="btnPrint">Print</a>';
                    DialogContent += '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: G_RE.ClosePDF();" id="btnClose">Close</a>';
                    ReportHTML = DialogContent;
                }
                //this.TabInfo.PDFurl = response;
            }
            if (this.TabInfo.PDFurl === '') { // We received the report as HTML
                $('#user-menu-user').notify('Report ' + this.ReportTitle + ' Finished!', { position: "left", className: "success" })

                let streamdoc = undefined;
                if (undefined === this.TabInfo.printTab) { // Create the iframe in case it is not defined within the HTML
                    let printframe = window.frames["print_frame"];
                    if (printframe === undefined) {
                        printframe = document.createElement('iframe');
                        printframe.setAttribute('id', 'print_frame');
                    }
                    printframe.hidden = true;

                    this.TabInfo.printFrame = printframe;
                    document.body.appendChild(this.TabInfo.printFrame);
                    streamdoc = this.TabInfo.printFrame.contentWindow;
                } else {
                    streamdoc = this.TabInfo.printTab;
                }
                // We have created streamdoc as either the iframe document or the new window/tab document object so we can use the attributes
                /* OBSOLETE 
                                streamdoc.document.body.innerHTML = '';
                                streamdoc.document.title = this.ReportTitle;
                                streamdoc.document.write(ReportHTML);
                                if (this.TabInfo.printTab.name) {
                                    //streamdoc.print(); // Can't call print because it will lock other windows
                                } else {
                                    streamdoc.document.write("<script>$('#RELoadingDIV_gif').hide();</script>")
                                }
                 END OBSOLETE */
            } else { // backwards compatability for the existing report PDF in browser preview
                let fileName = response;
                let FILECompleteName = '/' + fileName;
                this.TabInfo.PDFurl = FILECompleteName; // Reset the URL for usage later
                let heightt = $(window).height();
                let DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
                DialogContent += '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: G_RE.PrintBrowserPDF(\'\');" id="btnPrint">Print</a>';
                DialogContent += '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: G_RE.ClosePDF();" id="btnClose">Close</a>';

                heightt = heightt - 180;
                $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
                $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');
                $('#dvFilterDv').attr('style', 'display:none');
                $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
                $('#dialog11').html(DialogContent);
                $('#fade').hide();
                this.HideLoadingAnimation();
            }
        }
    }
    , RenderReportHTML: function (HTML, objCSS, objReportConfig) {
        let thedocument = this.TabInfo.printTab.document;

        thedocument.body.innerHTML = ''; // reset the tab's HTML
        thedocument.title = this.ReportTitle;
        thedocument.write(HTML);

        if (objReportConfig && objCSS) {
            let DOM = objReportConfig.DOM;
            let ReportStyle = document.createElement('style');
            ReportStyle.type = "text/css";

            let A_css = [];
            for (let selector in objCSS) {
                let style = selector + " {";

                for (let prop in objCSS[selector]) {
                    style += prop + ":" + objCSS[selector][prop];
                }

                style += "}";
                A_css.push(style);
            }

            let ReportStyleCSS = A_css.join("\n");
            ReportStyle.appendChild(thedocument.createTextNode(ReportStyleCSS));
            thedocument.querySelector(`#${DOM}`).appendChild(ReportStyle);
        }
    }
    , LogError: function (error) {
        console.log(error); // Log the error to the consol
    }
    , FormCapture: function (formID) {
        let JSONParameters = {};
        $(formID + ' :input(:not(.multiselect_option)')
            .each(function (index, that) {
                if (that.id !== '') {
                    let theJSON = JSONParameters; // Default to adding directly to the root
                    let thefieldset = $(that).closest('fieldset')[0];

                    if (thefieldset) {
                        if (thefieldset.id !== '' && !JSONParameters[thefieldset.id]) JSONParameters[thefieldset.id] = {};
                        theJSON = JSONParameters[thefieldset.id];
                    }
                    switch (that.type) {
                        case "checkbox": if (that.selected || that.checked) {
                            theJSON[that.id.replace('ddl', '')] = that.value;
                        }
                            break;
                        case "radio": if (that.checked) {
                            theJSON[that.id.replace('rb', '')] = that.value;
                        }
                            break;
                        case "text": theJSON[that.id.replace('txt', '')] = that.value;
                            break;
                        case "select-multiple": theJSON[that.id.replace('ddl', '')] = $(`${formID} select#${that.id}`).val();
                            break;
                        default: if (that.id !== '') {
                            theJSON[that.id.replace('ddl', '')] = that.value;
                        }
                    }
                    //console.log(that.id.replace('ddl', '') + ':' + that.value);
                };
            });
        // Universal parameters required for most API processing
        JSONParameters.ProdId = localStorage.ProdId; // for backward compatability
        JSONParameters.UserId = localStorage.UserId; // for backward compatability

        JSONParameters.ProdID = localStorage.ProdId;
        JSONParameters.UserID = localStorage.UserId;


        this.setobjForm(JSONParameters); // Set the Form Object;
        return JSONParameters;
    }
    , FormRender: function (elementsJSON) {
        let returnHTML = '';
        $.each(elementsJSON, function (key, value) {
            let theelementConfig = value.elementConfig;
            if (!theelementConfig) {
                return;
            }

            switch (theelementConfig.elementType) {
                case "select-multiple":
                    let elementHTML = '';
                    let selected = '';
                    if (Object.keys(theelementConfig.values).length === 1 && !theelementConfig.ignoreselectsingle) { selected = ' selected '; }
                    // If the element provided is not type:select-multiple, build an entire HTML element
                    if ($(value.fillElement).prop('type') !== 'select-multiple') {
                        elementHTML = '<select id="' + value.ID + '" multiple="multiple">';
                    }
                    // Loop through the values provided and build the optoin
                    $.each(theelementConfig.values, function (ekey, evalue) {
                        elementHTML += '<option value="' + evalue.value + '" ' + selected + '>' + evalue.label + '</option>';
                        //console.log(ekey + ': ' + evalue.label + ' = ' + evalue.value);
                    });

                    if ($(value.fillElement).prop('type') !== 'select-multiple') {
                        elementHTML += '</select>';
                    }
                    // Fill the element with our new HTML
                    if ($(value.fillElement)) {
                        $(value.fillElement).html(elementHTML);
                    }
                    // Initiate the bootstrap multiselect
                    $(value.fillElement).multiselect(theelementConfig.multiselectOptions);

                    if (typeof (value.Complete) === 'function') {
                        value.Complete(value, elementsJSON);
                    }
                    returnHTML += elementHTML;
                    break;
            }
            //console.log(key + ': ' + value.ID);
        })
        ;
        return returnHTML;
    }
    , Form: {
        RenderMemoCodes: function (domID, fieldset) {
            if (AtlasCache.Cache.GetItembyName('Config.TransactionCodes')) {
                let myfieldset = $(`<fieldset id="${fieldset}">`).appendTo(`${domID}`);
                let myfieldsetlegend = $('<legend>').text('MEMO CODES').appendTo(myfieldset);

                AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON.forEach(
                    (t) => {
                        let tD = $('<div>').appendTo(myfieldset);
                        let tL = $('<label>').text(t.TransCode).appendTo(myfieldset);
                        let tE = $(`<select multiple id="${t.Details.TCID}">`).appendTo(tD);

                        t.TV.forEach(
                            (v) => {
                                tE.append($('<option>').attr('value', v.TVID).text(v.TransValue));
                            }
                        )
                        myfieldset.append(tL);
                        $(tE).multiselect();
                        myfieldset.append(tD);
                    }
                );
            }
        }
        , RenderSegments: function (objP) {
            let domID = objP.domID;
            let fieldset = objP.fieldset;
            let legendlabel = objP.legendlabel;
            let excludelist = (!objP.excludelist) ? {} : objP.excludelist;
            let A_ = objP.A_List; // <<<< item with forEach()

            let myfieldset = $(`<fieldset id="${fieldset}">`).appendTo(`#${domID}`);
            let myfieldsetlegend = $('<legend>').text(legendlabel).appendTo(myfieldset);

            A_.forEach(
                (Item) => {
                    if (!excludelist[Item.Classification.toUpperCase()]) {
                        let ItemElement = undefined;
                        let ItemLabel = undefined;
                        let ItemDiv = undefined;

                        if (Item.Classification.toUpperCase() !== 'DETAIL') {
                            ItemDiv = $(`<div id="div${Item.Classification}" class="form-group">`).appendTo(myfieldset);
                            let selected = '';
                            ItemLabel = $('<label style="width:200px!important;">').text(Item.SegmentName).appendTo(ItemDiv);

                            if (Item.Accounts.length === 1) { console.log(Item.Accounts); selected = ' selected '; }

                            ItemElement = $(`<select multiple id="${fieldset}_${Item.SegmentCode}">`).appendTo(ItemDiv);
                            Item.Accounts.forEach((A) => {
                                if (Item.Accounts.length === 1) {
                                    ItemElement.append($('<option>').attr('value', A.AccountCode).attr('selected', true).text(A.AccountCode));
                                } else {
                                    ItemElement.append($('<option>').attr('value', A.AccountCode).text(A.AccountCode));
                                }
                            });

                            $(ItemElement).multiselect();
                            //myfieldset.append(ItemLabel);
                            myfieldset.append(ItemDiv);
                            $(`<div class="clearfix">`).appendTo(myfieldset);
                        } else {
                            ItemDiv = $(`<div id="divAccountFrom">`).appendTo(myfieldset);
                            ItemElement = $(`<input type="text" id="${fieldset}_${Item.SegmentCode}From">`).appendTo(ItemDiv);
                            $(ItemElement).autocomplete({
                                autoFocus: true
                            });
                            AtlasDocument.RenderSegmentAutocomplete(Item, ItemElement);

                            ItemLabel = $('<label style="width:200px!important;">').text('Account From').appendTo(myfieldset);
                            myfieldset.append(ItemDiv);

                            ItemDiv = $(`<div id="divAccountTo">`).appendTo(myfieldset);
                            ItemElement = $(`<input type="text" id="${fieldset}_${Item.SegmentCode}To">`).appendTo(ItemDiv);
                            $(ItemElement).autocomplete({
                                autoFocus: true
                            });
                            AtlasDocument.RenderSegmentAutocomplete(Item, ItemElement);
                            ItemLabel = $('<label style="width:200px!important;">').text('Account To').appendTo(myfieldset);
                            myfieldset.append(ItemDiv);
                        }
                    }
                }
            );
        }
        , RenderfieldsetPeriod: function (objP) {
            let domID = objP.formID;
            let fieldset = objP.fieldset;
            let legendlabel = objP.legendlabel;
            let excludelist = (!objP.excludelist) ? {} : objP.excludelist;
            let A_ = objP.A_List; // <<<< item with forEach()

            let myfieldset = $(`${domID} ${fieldset}`);//$(`<fieldset id="${fieldset}">`).appendTo(`#${domID}`);
            let myfieldsetlegend = $('<legend>').text(legendlabel).appendTo(myfieldset);
            let ItemElement = undefined;
            let ItemLabel = undefined;
            let ItemDiv = undefined;

            if (!excludelist.Period) {
                ItemDiv = $(`<div id="divPeriod" class="form-group">`).appendTo(myfieldset);
                ItemLabel = $('<label style="width:190px!important;">').text('Period From').appendTo(ItemDiv);
                ItemElement = $(`<input type="text" id="PeriodFrom" class="form-control pull-left SearchPeriod Period" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                myfieldset.append(ItemDiv);

                ItemDiv = $(`<div id="divPeriod" class="form-group">`).appendTo(myfieldset);
                ItemLabel = $('<label style="width:190px!important;">').text('Period To').appendTo(ItemDiv);
                ItemElement = $(`<input type="text" id="PeriodTo" class="form-control pull-left SearchPeriod Period" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                myfieldset.append(ItemDiv);
            }
            if (!excludelist.PeriodCF) {
                ItemDiv = $(`<div id="divPeriod" class="form-group">`).appendTo(myfieldset);
                ItemLabel = $('<label style="width:190px!important;">').text('Period Status').appendTo(ItemDiv);
                ItemElement = $(`<select id="PeriodStatus" class="form-control  pull-left" tabindex="4" style="margin-left:13px !important; width:160px !important;">
                                        <option value="Current">Current</option>
                                        <option value="Future">Future</option>
                                        <option value="Both">Both</option>
                                    </select>
                    `).appendTo(ItemDiv);
                myfieldset.append(ItemDiv);
            }
            if (!excludelist.PostedDate) {
                ItemDiv = $(`<div id="divPostedDate" class="form-group">`).appendTo(myfieldset);
                ItemLabel = $('<label style="width:190px!important;">').text('Posted Date From').appendTo(ItemDiv);
                ItemElement = $(`<input type="text" id="PostedDateFrom" class="form-control pull-left smartdate PostedDate" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                myfieldset.append(ItemDiv);

                ItemDiv = $(`<div id="divPeriodFrom" class="form-group">`).appendTo(myfieldset);
                ItemLabel = $('<label style="width:190px!important;">').text('Posted Date To').appendTo(ItemDiv);
                ItemElement = $(`<input type="text" id="PostedDateTo" class="form-control pull-left smartdate PostedDate" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                myfieldset.append(ItemDiv);
            }
            if (!excludelist.DocumentDate) {
                ItemDiv = $(`<div id="divPostedDate" class="form-group">`).appendTo(myfieldset);
                ItemLabel = $('<label style="width:190px!important;">').text('Document Date From').appendTo(ItemDiv);
                ItemElement = $(`<input type="text" id="DocumentDateFrom" class="form-control pull-left smartdate DocDate" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                myfieldset.append(ItemDiv);

                ItemDiv = $(`<div id="divPeriodFrom" class="form-group">`).appendTo(myfieldset);
                ItemLabel = $('<label style="width:190px!important;">').text('Document Date To').appendTo(ItemDiv);
                ItemElement = $(`<input type="text" id="DocumentDateTo" class="form-control pull-left smartdate LIDocDate" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                myfieldset.append(ItemDiv);
            }

        }
        , RenderBatchSelect: function (objP) {
            let objDOM = objP.DOM;
            $.ajax({
                url: `${AtlasUtilities.URLS.v1.APIUrlLedGetBatchNumByProdId}?ProdID=${localStorage.ProdId}`,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                cache: false,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
            })
            .done(function (response) {
                for (var i = 0; i < response.length; i++) {
                    $(objDOM).append('<option value="' + response[i].BatchNumber + '">' + response[i].BatchNumber + '</option>');
                }
                $(objDOM).multiselect({ nonSelectedText: 'Select', enableFiltering: true, maxHeight: 350 });
            })
            .fail(function (error) {
                ShowMSG(error);
            })

        }
        , RenderMultiCurrency: function (objP) {
            let domIDs = Array.isArray(objP.formID) ? objP.formID: [objP.formID];
            let fieldset = objP.fieldset;
            let legendlabel = objP.legendlabel;

            G_AtlasConfig.ConfigGet('Settings.Currencies.Rates', (configRates) => {
                let RatesJSON = JSON.parse(configRates.ConfigJSON);
                let base = RatesJSON.BASE;

                G_AtlasConfig.ConfigGet('Settings.Currencies.List', (configList) => {
                    let A_List = JSON.parse(configList.ConfigJSON);

                    domIDs.forEach((domID) => {
                        let myfieldset = $(`${domID} ${fieldset}`);//$(`<fieldset id="${fieldset}">`).appendTo(`#${domID}`);
                        let myfieldsetlegend = $('<legend>').text(legendlabel).appendTo(myfieldset);
                        let ItemElement = undefined;
                        let ItemLabel = undefined;
                        let ItemDiv = undefined;

                        ItemDiv = $(`<div id="divCurrencyReport" class="form-group">`).appendTo(myfieldset);
                        ItemLabel = $('<label style="width:200px!important;">').text('Report Currency').appendTo(ItemDiv);
                        let ItemElementHTML = AtlasInput.CreateSelect(A_List, { id: 'CurrencyReport' });
                        ItemElement = $(ItemElementHTML).appendTo(ItemDiv);
                        //ItemElement = $(`<input value="${base}" type="text" id="CurrencyReport" class="form-control pull-left SearchCurrency Currency" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                        myfieldset.append(ItemDiv);
                        $(`${domID} ${fieldset} #CurrencyReport`).val(base);

                        ItemDiv = $(`<div id="divCurrencyFilter" class="form-group">`).appendTo(myfieldset);
                        ItemLabel = $('<label style="width:200px!important;">').text('Filter by').appendTo(ItemDiv);
                        ItemElementHTML = AtlasInput.CreateSelect(Array.prototype.concat([""], A_List), { id: 'CurrencyFilter' });
                        ItemElement = $(ItemElementHTML).appendTo(ItemDiv);
                        //ItemElement = $(`<input type="text" id="CurrencyFilter" class="form-control pull-left SearchCurrency Currency" style="margin-left:13px !important;">`).appendTo(ItemDiv);
                        myfieldset.append(ItemDiv);
                    })
                })
            })
        }
    }
    , RunReport: function (Params) {
        Params = (Params === undefined) ? this.TabInfo : Params;
        if (Params.DisplayinTab && !this.isExport) {
            this.NewTab();
        } else if (Params.PDFViewer) {
            // Do nothing until the PDF is ready...
        } else {
            this.TabInfo.DisplayinTab = false; // bug with Chrome constantly setting to true;
            //            this.ShowLoadingAnimation();
        }
        this.ShowLoadingAnimation();

        let RE = this;
        AtlasUtilities.CallAjaxPost(
            this.APIurl
            , false
            , (response, objParams) => {
                setTimeout(() => {
                    this.RenderReport(response);
                }, 10);
                this.HideLoadingAnimation();
            }
            , (error) => {
                setTimeout(() => {
                    this.ShowError(error);
                    this.LogError(error);
                }, 10);
            }
            , {
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                , async: true
                , callParameters:
                    //{ callPayload: this.JSONParameters() }}
                     this.JSONParameters()
            }
        );

        if (this.callbacks['Run']) {
            this.callbacks['Run']();
        }
        return;
    }
    , ExportFunctions: {
        COAStohash: function (COAS, therow, theobj) {
            let A_COAS = COAS.split('|');
            let ret = Object.keys(AtlasUtilities.SEGMENTS_CONFIG.sequence).reduce((acc, cur, i) => {
                acc[AtlasUtilities.SEGMENTS_CONFIG.sequence[cur].SegmentCode] = '="'
                    + ((i === AtlasUtilities.SEGMENTS_CONFIG.DetailIndex) ? (A_COAS[i] || '').split('>').slice(-1)[0] : (A_COAS[i] || ""))
                    + '"'
                ; // we need this in case an invalid COA value is on the Ledger
                return acc;
            }, {}
            );
            return ret;
        }
        , TCodestohash: function (TVS, therow, theobj) {
            let objTVS = TVS.split(',').reduce((acc, cur, i) => { let a = cur.split(':'); acc[a[0]] = a[1]; return acc; }, {});
            let ret = Object.keys(G_TCodes).reduce((acc, cur, i) => { acc[G_TCodes[cur].TransCode] = objTVS[G_TCodes[cur].TransCode]; return acc; }, {});
            return ret;
        }
        , SegmentJSONtohash: function (SegmentsJSON, therow, theobj) {
            let JSONraw = JSON.parse(SegmentsJSON)[0];
            let JSONreturn = {};
            for (let segment in JSONraw) {
                let thevalue = JSONraw[segment];
                if (segment === 'DT') thevalue = thevalue.split('>').pop();
                JSONreturn[segment] = `="${thevalue}"`
            }
            return JSONreturn;
        }
    }
}
