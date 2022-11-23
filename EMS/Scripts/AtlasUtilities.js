"use strict";

var TaxCode1099 = []; // backwards compatability ONLY #1735
var AllTaxCode1099 = []; // backwards compatability ONLY #1735

var AtlasUtilities = {
    GLOBALS: {
        CURRENCY_SYMBOL: '$'
    , CURRENCY_CODE: 'USD'
    }
    , URLS: {
        v1: {
            APIUrlFillCompany: '/api/CompanySettings/GetCompanyList'
            , APIUrlFillCompanyFirst: '/api/AccountPayableOp/GetDedaultCOLO'
            , APIUrlFillVendor: '/api/POInvoice/GetVendorAddPO'
            , APIUrlGetSegmentList: '/api/AdminLogin/GetAllSegmentByProdId'
            , APIUrlGetTransactionCode: '/api/CompanySettings/GetTranasactionCode'
            , APIUrlTranscationCode: '/api/CompanySettings/GetTransactionValueByCodeId'
            , APIUrlFillRefVendor: '/api/POInvoice/GetVendorAddPO'
            , APIUrlCompanyPOStartVal: '/api/POInvoice/GetPONumberForCompany' // dynamic by Company
            , APIUrlCompanyClosePeriod: '/api/POInvoice/GetClosePeriodFortransaction' // dynamic by Company
            , APIUrlAccountDetailsByCat: '/api/Ledger/GetTblAccountDetailsByCategory' //Optional COA; dynamic by SegmentName & SegmentLevel
            , APIUrlGetVendorAddress: '/api/POInvoice/GetVendorAddress'
            , APIUrlCheckPONumber: '/api/POInvoice/CheckPONumber'
            , APIUrlGetPeriodAll: '/api/ReportAPI/GetPeriodForBible'
            // Individual URLS
            , APIUrlSaveGetPODetail: '/api/POInvoice/GetPODetail'
            , APIUrlFillPOLines: '/api/POInvoice/GetPOLines'
            , APIUrlDeletePoById: '/api/POInvoice/DeletePoById'
            , APIUrlfunClosePO: '/api/POInvoice/UpdatePOStatusClose'
            // Action URLS
            //, APIUrlSavePO: '/api/POInvoice/SavePO' << Obsolete
            , APIUrlfunDeletePOLine: '/api/POInvoice/DeletePOLine'
            , APIUrlLedGetBatchNumByProdId: '/api/ReportAPI/GetAllBatchNumber'
        }
    }
    , AllTaxCode1099: {}
    , URL_GETCOADETAIL: "/api/Ledger/GetCOABySegmentPosition1"
    , URL_GETCOA: "/api/Ledger/GetCOABySegmentPosition"
    , URL_GETCOA_OPTIONAL: "/api/Ledger/GetTblAccountDetailsByCategory"
    , URL_SEGMENT_CONFIG: "/api/AtlasUtilities/AtlasUtilities_SegmentsConfig"
    , URL_GETTAXCODELIST: '/api/CompanySettings/SettingsTaxCodeGet'
    , SEGMENTS: { "name": "AtlasUtilities.SEGMENTS" }
    , SEGMENTS_CONFIG: {
        "name": "AtlasUtilities.SEGMENTS_CONFIG"
        , _COA: {
            _COACode: {}
            , _COAID: {}
        }
        , 'classification': {}
    }
    , Titlejs: ''
    , indebug: false
    , initialized: false
    , init: function () {
        let UT = this;
        let centerX = window.innerWidth * .5;
        let centerY = window.innerHeight * .5;
        if (document.getElementById('app-body')) {

            if ($('#REfadeDIV' + this.DIVBase) && !this.initialized) {
                $('#REfadeDIV' + this.DIVBase).remove(); // detach any existing DIV
            }
            let fadeDIV = document.createElement('div');
            fadeDIV.id = 'REfadeDIV' + this.DIVBase;
            //        fadeDIV.style.cssText = "    display: none;    position: fixed;    top: 0%;    left: 0%;    bottom: 0;    width: 100%;    height: 100%;    background-color: black;    z-index: 1001;    opacity: 0.4;";
            fadeDIV.className = 'REfadeDIVclass';
            document.getElementById('app-body').appendChild(fadeDIV);

            if ($('#REerrorDIV' + this.DIVBase) && !this.initialized) {
                $('#REerrorDIV' + this.DIVBase).remove(); // detach any existing DIV
            }
            let errorDIV = document.createElement('div');
            errorDIV.id = 'REerrorDIV' + this.DIVBase;
            //        errorDIV.className = 'REerrorDIVclass';
            errorDIV.style.cssText = " display: none;   position: fixed;   text-align: center;   top: " + (centerY - 150) + "px;   left: " + (centerX - 150) + "px; z-index: 9999;";
            errorDIV.innerHTML = "<h1>There was an error processing your request!</h1><a onclick=\"$('#REfadeDIV" + this.DIVBase + "').hide(); $('#REerrorDIV" + this.DIVBase + "').hide();\">Close</a>"
            document.getElementById('app-body').appendChild(errorDIV);

            if ($('#RELoadingDIV' + this.DIVBase) && !this.initialized) {
                $('#RELoadingDIV' + this.DIVBase).remove(); // detach any existing DIV
            }
            let loadingDIV = document.createElement('div');
            loadingDIV.id = 'RELoadingDIV' + this.DIVBase;
            loadingDIV.style.cssText = " display: none;   position: fixed;   text-align: center;   top: " + (centerY - 150) + "px;   left: " + (centerX - 150) + "px; z-index: 9999;";
            loadingDIV.innerHTML = "<span class=\"RELoadingSPAN\">LOADING REPORT... </span><br><img id=\"RELoadingDIV_img5\" src=\"/Images/loader_funnel.svg\" />";
            document.getElementById('app-body').appendChild(loadingDIV);

            if ($('#RELoadingTabDIV' + this.DIVBase) && !this.initialized) {
                $('#RELoadingTabDIV' + this.DIVBase).remove(); // detach any existing DIV
            }
            let loadingTabDIV = document.createElement('div');
            loadingTabDIV.id = 'RELoadingTabDIV' + this.DIVBase;
            loadingTabDIV.style.cssText = " display: none;   position: fixed;   text-align: center;   top: " + (centerY - 150) + "px;   left: " + (centerX - 150) + "px; z-index: 9999;";
            loadingTabDIV.innerHTML = "<span class=\"RELoadingSPAN\">Processing your request...</span> <br>";
            //            loadingTabDIV.innerHTML += "<br><a class=\"btn-default REdismissbutton pointerhand\"onclick=\"$('#" + loadingTabDIV.id + "').hide(); $('#REfadeDIV" + this.DIVBase + "').hide();\">Click here</a> <span class=\"RELoadingSPAN\"> to continue using Atlas while the report runs.</span><br>";
            loadingTabDIV.innerHTML += "<img class=\"RELoadingDIVimg\" id=\"RELoadingDIV_img5\" src=\"/Images/loader_funnel.svg\" />";
            document.getElementById('app-body').appendChild(loadingTabDIV);

            this.loadingDIV = loadingDIV;
            this.loadingTabDIV = loadingTabDIV;
            this.fadeDIV = fadeDIV;
            this.errorDIV = errorDIV;
        }
        if (localStorage.ProdId && localStorage.UserId) {
            let theCall = JSON.stringify(
                {
                    ProdID: localStorage.ProdId
                }
            );
            this.CallAjaxPost(
                this.URL_SEGMENT_CONFIG
                , false
                , this.INIT_segmentsconfig_success
                , this.ShowError
                , {
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                    , async: false
                    , callParameters: {
                        //callParameters: {
                        callPayload: theCall
                        //}
                    }
                }
            );

            this.GetTaxCodeList();
        }

        $(document)
        .ready(function () {
            // Have defaults for ajax start and stop
        })
        .ajaxStart(function () {
            if (this.indebug) {
                UT.ShowLoadingAnimation();
            }
        }.bind(UT))
        .ajaxStop(function () {
            //UT.HideLoadingAnimation();
        }.bind(UT))
        .ajaxError(function (event, request, settings) {
            UT.HideLoadingAnimation();
            UT.ShowError();
        }.bind(UT))
        ;

        this.initialized = true;
    }
    , INIT_segmentsconfig_success: function (response, objParams) {
        AtlasUtilities.SEGMENTS_CONFIG.sequence = response.resultJSON;
        let segsequence = AtlasUtilities.SEGMENTS_CONFIG.sequence;
        let segconfig = AtlasUtilities.SEGMENTS_CONFIG;
        let segclass = AtlasUtilities.SEGMENTS_CONFIG.classification;

        segsequence.forEach(
            function (element, eIndex) {
                if (element.Classification === 'Detail') AtlasUtilities.SEGMENTS_CONFIG.DetailIndex = parseInt(eIndex); // Store the sequence index for the Detail segment

                segconfig[element.SegmentCode] = {}; // store the sequence of the segments
                segclass[element.Classification] = element; // store the classifications of the segments for easy hash reference

                element.Accounts.forEach(
                    function (elementa) {
                        segconfig[element.SegmentCode][elementa.AccountCode] = elementa
                        elementa.COA.forEach(
                            function (key, value) {
                                key.AccountCode = elementa.AccountCode; // For easy reference to the AccountCode when you have just the COACode or the COAID
                                segconfig._COA._COACode[key.COACode] = key;
                                segconfig._COA._COAID[key.COAID] = key;
                            })
                        ;
                    }
                );
            }
        );
    }
    , ShowLoadingAnimation: function () {
        //document.title = 'Loading report... ' + this.ReportTitle;
        $('#REfadeDIV' + this.DIVBase).show();
        $('#' + this.loadingTabDIV.id).show()
        //let ignorethis = (this.TabInfo.DisplayinTab) ? $('#' + this.loadingTabDIV.id).show() : $('#RELoadingDIV' + this.DIVBase).show();
    }
    , HideLoadingAnimation: function () {
        //document.title = (document.title === 'Loading report... ' + this.ReportTitle) ? this.callingDocumentTitle : document.title;
        $('#RELoadingTabDIV' + this.DIVBase).hide()
        $('#RELoadingDIV' + this.DIVBase).hide();
        $('#REfadeDIV' + this.DIVBase).hide();
    }
    , ShowError: function (error, objParams) {
        AtlasUtilities.HideLoadingAnimation();
        console.log(error);
    }
    , CallAjaxPost: function (URL_CALL, cache, doneFunction, failFunction, objFunctionParameters) {
        let contentTypeString = (objFunctionParameters.contentType === undefined) ? 'application/json; charset=utf-8' : objFunctionParameters.contentType;
        let syncronous = (objFunctionParameters.async === undefined) ? true : objFunctionParameters.async;
        return $.ajax({
            url: URL_CALL
            , data: objFunctionParameters.callParameters
            , cache: false
            , async: syncronous
            , context: this
            , beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            }
            , type: 'POST'
            , contentType: contentTypeString
        })
        .done(function (response) {
            doneFunction(response, objFunctionParameters);
        })
        .fail(function (error) {
            failFunction(error, objFunctionParameters);
        })
    }
    , CallAjaxGet: function (URL_CALL, cache, doneFunction, failFunction) {
        let contentTypeString = 'application/json; charset=utf-8';
        $.ajax({
            url: URL_CALL
            , cache: false
            , beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            }
            , type: 'GET'
            , async: false
            , contentType: contentTypeString
        })
        .done(function (response) {
            doneFunction(response);
        })
        .fail(function (error) {
            failFunction(error);
        })
    }
    , LogError: function (error) {
        console.log(error);
    }
    , CompleteDate: function (event, obj) {
        var key = String.fromCharCode(event.keyCode);
        if (!(key >= 0 && key <= 9)) {
            $(obj).val($(obj).val().substr(0, $(obj).val().length - 1));
        }
        let value = $(obj).val();
        if (value.length === 2 || value.length === 5) {
            $(obj).val($(obj).val() + '/');
            CompleteDate(event, obj);
        }

        if (event.which === 9) {
            if (value.slice(-1) === '/' && value.length === 6) {
                $(obj).val($(obj).val() + '2017')
            }
        }
    }
    , BuildDetailSegmentAutoComplete: function (values, SegmentName, objSegmentP, objDom, selfcontained) {
        let SegmentP = (typeof objSegmentP === 'object') ? objSegmentP.SegmentP : objSegmentP;

        if (this.SEGMENTS.DETAILS && !objSegmentP.UnusedONLY && Object.keys(this.SEGMENTS.DETAILS.asObjects).length !== 0 && !localStorage.dirtydata) {
            this.BuildDetailSegmentAutoComplete_Success(this.SEGMENTS.DETAILS, { "values": values, "SegmentName": SegmentName, "SegmentP": SegmentP, "context": objDom })
            return;
        };

        GlbCOAList = [];
        var COACode = '';
        var PreSegment = 0;
        var strCOACode = '';

        if (selfcontained) { // used as a stop gap for unreliable hidden value tab through functionality
            $(objDom).closest('tr').find('input.input-segment:not(.DT)').each((i, e) => {
                strCOACode += e.value + '|';
            })

            strCOACode = strCOACode.split('|').slice(0, -1).join('|'); // get rid of the last '|' character
        } else {
            COACode = $('#hdnCode_' + values).val();
            if (SegmentP == 0) {
                COACode = '~';
            } else {
                PreSegment = SegmentP - 1;
            }
            strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
            if (strCOACode === undefined) { //This means we have an invalid detail code, so we need to pull all Details for the default company
                strCOACode = ''; // Set the COACode to empty so that the API call will return all values
                SegmentP = -2;
            } else if (strCOACode === '') {
                SegmentP = -2;
            }
        }
        // Need to figure out what above should be deleted
        SegmentP = -2;

        let URL = this.URL_GETCOADETAIL + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + ((typeof objSegmentP === 'object') ? '-1' : SegmentP);
        this.CallAjaxPost(URL, false, this.BuildDetailSegmentAutoComplete_Success, this.LogError, { "values": values, "SegmentName": SegmentName, "SegmentP": SegmentP, "context": objDom });
    }
    , BuildDetailSegmentAutoComplete_Success: function (response, objParams /*values, SegmentP*/) {
        localStorage.dirtydata = false;
        AtlasUtilities.SEGMENTS.DETAILS = response; // Set the Details List for global usage
        let objSegmentsDetail = AtlasUtilities.SEGMENTS.DETAILS;
        objSegmentsDetail.asObjects = {};
        let objDetailasObjects = objSegmentsDetail.asObjects;
        for (var i = 0; i < response.length; ++i) {
            for (let key in response[i]) {
                if (!objDetailasObjects[key]) {
                    objDetailasObjects[key] = {};
                }
                objDetailasObjects[key][response[i][key]] = response[i];
            }
        }
        // We now have the Detail Segment as an array as well as each account as an object for each field returned

        GlbCOAList = response;
        var array = [];
        var ProductListjson = response;
        array = response.error ? [] : $.map(response, function (m) {
            return {
                strlabel: m.COANo,
                label: m.COANo1,
                value: m.COACode,
                COAId: m.COAID,
            };
        });
        //$('#txt_' + objParams.values + '_' + objParams.SegmentP).addClass('SearchCode');
        //$(".form-segment.DT").autocomplete({
        $(`#${objParams.context.id}`).autocomplete({
            minLength: 1,
            autoFocus: false,
            position: { 'collision': 'flipfit' },
            source: function (request, response) {
                let matches = $.map(array, (item) => { if (item.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) return item; });
                response(matches);
            },
            focus: function (event, ui) {
                //$(this).val(ui.item.label);
                //$(this).attr('COACode', ui.item.value);
                //$(this).attr('COAId', ui.item.COAId);

                //$('#hdnCode_' + objParams.values).val(ui.item.value);
                //$('#hdnCOAId_' + objParams.values).val(ui.item.COAId);
                //$('#hdnCOACode_' + objParams.values).val(ui.item.value);
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.strlabel);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);

                $('#hdnCode_' + objParams.values).val(ui.item.value);
                $('#hdnCOAId_' + objParams.values).val(ui.item.COAId);
                $('#hdnCOACode_' + objParams.values).val(ui.item.value);
                $('body').data('hdnCOACode', ui.item.value);

                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        });

        $(`.form-segment.DT`).keydown(function (e) {
            if (e.keyCode != $.ui.keyCode.TAB) return;
            if (this.value === '') return;
            if (e.shiftKey) return;

            e.keyCode = $.ui.keyCode.DOWN;
            $(this).trigger(e);

            e.keyCode = $.ui.keyCode.ENTER;
            $(this).trigger(e);

            $(this.parentElement.nextSibling).find('input').focus();
        });

    }
    , BuildSegmentsAutoComplete: function (values, SegmentName, SegmentP, objDOM) {
        //$(`.input-segment.${SegmentName}`).autocomplete({ source: AtlasInput.AutoCompletes.Segments}); // future usage for unified input

        if (this.SEGMENTS[SegmentName]) {
            this.BuildSegmentsAutoComplete_Success(this.SEGMENTS[SegmentName], { "values": values, "SegmentName": SegmentName, "SegmentP": SegmentP, "context": objDOM })
            return;
        } else {
            // Convert the SEGMENTS_CONFIG into COANo, COACode array object
            this.BuildSegmentsAutoComplete_Success($.map(AtlasUtilities.SEGMENTS_CONFIG[SegmentName],
                function (e) {
                    return {
                        'COANo': e.AccountCode
                        , 'COACode': e.AccountCode
                    };
                })
                , { async: false, "values": values, "SegmentName": SegmentName, "SegmentP": SegmentP, "context": objDOM }
            );
        }

        return;
    }
    , BuildSegmentsAutoComplete_Success: function (response, objParams /*values, SegmentP*/) {
        AtlasUtilities.SEGMENTS[objParams.SegmentName] = response;

        GlbCOAList = response;
        var array = [];
        var ProductListjson = response;
        array = response.error ? [] : $.map(response, function (m) {
            return {
                label: m.COANo,
                value: m.COACode,
                COAId: m.COAID,
            };
        });

        //$('#txt_' + objParams.values + '_' + objParams.SegmentP).addClass('SearchCode');
        //$(`.form-segment.${objParams.SegmentName}`).autocomplete({
        $(`#${objParams.context.id}`).autocomplete({
            minLength: 1,
            autoFocus: false,
            position: { 'collision': 'flipfit' },
            source: array,
            focus: function (event, ui) {
                //$(this).val(ui.item.label);
                //$(this).attr('COACode', ui.item.value);
                //$(this).attr('COAId', ui.item.COAId);

                //$('#hdnCode_' + objParams.values).val(ui.item.value);
                //$('#hdnCOACode_' + objParams.values).val(ui.item.value);
                //$('#hdnCOAId_' + objParams.values).val(ui.item.COAId);
                //$('body').data('hdnCOACode', ui.item.value);
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.label);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);

                $('#hdnCode_' + objParams.values).val(ui.item.value);
                $('#hdnCOACode_' + objParams.values).val(ui.item.value);
                $('#hdnCOAId_' + objParams.values).val(ui.item.COAId);
                $('body').data('hdnCOACode', ui.item.value);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) { }
            }
        });


        $(`.form-segment.${objParams.SegmentName}`).keydown(function (e) {
            if (e.keyCode != $.ui.keyCode.TAB) return;
            if (this.value === '') return;
            if (e.shiftKey) return;

            e.keyCode = $.ui.keyCode.DOWN;
            $(this).trigger(e);

            e.keyCode = $.ui.keyCode.ENTER;
            $(this).trigger(e);

            $(this.parentElement.nextSibling).find('input').focus();
        });
    }
    , CheckCOA: function (doneFunction, errorFunction, objParams) {
        this.CallAjaxPost(APIUrlCheckCOA + '?ProdID=' + localStorage.ProdId, false, doneFunction, this.ShowError, objParams);
    }
    , FetchSegments: function (doneFunction, errorFunction, objParams) {
        this.CallAjaxPost(APIUrlFillSegment + '?ProdID=' + localStorage.ProdId + '&Mode=0', false, doneFunction, this.ShowError, objParams);
    }
    , SegmentJSON: function (objConfig) {
        if (this.initialized) {
            return {
                "Company": {
                    "Complete": function (config) {
                        console.log('from the Complete' + config.ID);
                    }
                    , "ID": "Company"
                    , "fillElement": objConfig.Company.fillElement
                    , "elementConfig": {
                        "elementType": "select-multiple"
                        , "values": $.map(
                            AtlasUtilities.SEGMENTS_CONFIG.CO
                            , function (m) {
                                return { "value": m.AccountCode, "label": m.AccountCode }
                            })
                        , "multiselectOptions": {
                            nonSelectedText: 'Select'
                            , includeSelectAllOption: true
                        }
                    }
                }
                , "Location": {
                    "Complete": function (config, parent) {
                        parent.Complete(config);
                    }
                    , "ID": "Location"
                    , "fillElement": objConfig.Location.fillElement
                    , "ElementGroupID": objConfig.Location.ElementGroupID
                    , "ElementGroupLabelID": objConfig.Location.ElementGroupLabelID
                    , "ElementGroupLabelValue": objConfig.Location.ElementGroupLabelValue || 'Location(s)'
                    , "elementConfig": {
                        "elementType": "select-multiple"
                        , "values": $.map(
                            AtlasUtilities.SEGMENTS_CONFIG.LO
                            , function (m) {
                                return { "value": m.AccountCode, "label": m.AccountCode }
                            })
                        , "multiselectOptions": {
                            nonSelectedText: 'Select'
                            , includeSelectAllOption: true
                        }
                    }
                }
                , "Episode": {
                    "Complete": function (config, parent) {
                        parent.Complete(config);
                    }
                    , "ID": "Episode"
                    , "fillElement": objConfig.Episode.fillElement
                    , "ElementGroupID": objConfig.Episode.ElementGroupID
                    , "ElementGroupLabelID": objConfig.Episode.ElementGroupLabelID
                    , "ElementGroupLabelValue": objConfig.Episode.ElementGroupLabelValue || 'Episode(s)'
                    , "elementConfig": {
                        "elementType": "select-multiple"
                        , "values": $.map(
                            AtlasUtilities.SEGMENTS_CONFIG.EP
                            , function (m) {
                                return { "value": m.AccountCode, "label": m.AccountCode }
                            })
                        , "multiselectOptions": {
                            nonSelectedText: 'Select'
                            , includeSelectAllOption: true
                        }
                    }
                }
                , "Set": {
                    "Complete": function (config, parent) {
                        parent.Complete(config);
                    }
                    , "ID": "Set"
                    , "fillElement": objConfig.Set.fillElement
                    , "ElementGroupID": objConfig.Set.ElementGroupID
                    , "ElementGroupLabelID": objConfig.Set.ElementGroupLabelID
                    , "ElementGroupLabelValue": objConfig.Set.ElementGroupLabelValue || 'Set(s)'
                    , "elementConfig": {
                        "elementType": "select-multiple"
                        , "values": $.map(
                            AtlasUtilities.SEGMENTS_CONFIG.Set
                            , function (m) {
                                return { "value": m.AccountCode, "label": m.AccountCode }
                            })
                        , "multiselectOptions": {
                            nonSelectedText: 'Select'
                            , includeSelectAllOption: true
                            , enableFiltering: true
                        }
                    }
                }
                , Complete (config) {
                    if (config.elementConfig.values.length !== 0) {
                        $(config.ElementGroupID).show(); //unhide the Group
                        $(config.ElementGroupLabelID).html(config.ElementGroupLabelValue)
                    }
                }
            }
        } else {
            return {};
        }
    }
    , GetTaxCodeList: function () {
        AtlasCache.CacheORajax(
            {
                'URL': this.URL_GETTAXCODELIST + '?ProdId=' + localStorage.ProdId + '&TaxCodeId=' + 0
                , 'doneFunction': AtlasUtilities.GetTaxCodeList_Success
                , 'objFunctionParameters': {}
                , 'cachebyname': 'Tax Codes'
            }
        )
    }
    , GetTaxCodeList_Success: function (response, objParams) {
        AtlasUtilities.AllTaxCode1099 = response;

        if (typeof AllTaxCode1099 !== 'undefined') AllTaxCode1099 = response;

        AtlasUtilities.TaxCode1099 = [];
        $.each(response, function (index, value) {
            if (value.Active == true)
                AtlasUtilities.TaxCode1099.push({ TaxCode: value.TaxCode, TaxDescription: value.TaxDescription, });
        });
        if (typeof TaxCode1099 !== 'undefined') TaxCode1099 = AtlasUtilities.TaxCode1099;
        console.log(AtlasUtilities.TaxCode1099);
    }
    , FormDisableToggle: function (divID, toggle) {
        $('#' + divID + ' :input').each(
            function (index, that) {
                $(that).attr('disabled', toggle);
            }
        );
    }
    , legacy: {
        GetSegmentValue: (values, SegmentName, SegmentP, objDOM) => {
            let objDOMInput = $('#txt_' + values + '_' + SegmentP);
            let strval = objDOMInput.val();
            let objMatch = (strval === '') ? AtlasUtilities.SEGMENTS_CONFIG[SegmentName] : AtlasUtilities.SEGMENTS_CONFIG[SegmentName][strval];

            if (!objMatch) {
                objDOMInput.addClass('field-Req');
            }

            if (objDOM) {
                let matching = AtlasUtilities.SEGMENTS_CONFIG.sequence[SegmentP].Accounts.find(function (i) { return i.AccountCode === strval; })
                if (!matching) {
                    $('#txt_' + values + '_' + SegmentP).addClass('field-Req');
                    $('#txt_' + values + '_' + SegmentP).notify('Invalid Value');
                } else if (matching.Posting === false) {
                    $('#txt_' + values + '_' + SegmentP).addClass('field-Req');
                    $('#txt_' + values + '_' + SegmentP).notify('Invalid Value');
                }
            }
        }
        , TransactionCodeBlur: function (obj, attr, TransList) {
            if (obj.value === '') {
                $(obj).removeAttr(attr);
                $(obj).val('');
                $(obj).removeClass('field-Req');
                return;
            }

            let thematch = TransList.find((e, i) => {
                return e.TransValue.includes(obj.value.toUpperCase());
            });

            if (thematch) {
                $(obj).attr(attr, thematch.TransactionValueID);
                $(obj).val(thematch.TransValue);
                $(obj).removeClass('field-Req');
            } else {
                $(obj).notify('Invalid Code');
                $(obj).addClass('field-Req');
            }
        }

    }
    , AddStickyTableHeaders: function (tblId, tabId, headerHeight) {
        if ($(`#${tabId}`).height() >= (window.innerHeight - headerHeight)) {
            $(`#${tblId}`).stickyTableHeaders('destroy');
            $(`#${tabId}`).height((window.innerHeight - headerHeight));
            $(`#${tabId}`).addClass('overlay');
            $(`#${tblId}`).stickyTableHeaders({ scrollableArea: $(`#${tabId}`) });
        }
    }
};

var AtlasCache = {
    APIURLs: {
        AtlasConfig_TransactionCodes: '/api/AtlasUtilities/AtlasConfig_TransactionCodes'
        , AtlasCache_VendorList: '/api/AccountPayableOp/GetVendorListByProdID'
    }
    , isInitialized: false
    , isCacheLoaded: false
    , hasData: false
    , isStale: undefined
    , SEGMENTS_CONFIG: {
        "name": "AtlasCache.SEGMENTS_CONFIG"
        , _COA: {
            _COACode: {}
            , _COAID: {}
        }
    }
    , init: function () { // init DOES NOT load the cache from localStorage. The init function merely verifies the cache is for the active DB. If not, it wipes the cache
        let objCache = localStorage.AtlasCache;
        if (objCache === undefined) { // If there is no localStorage Cache, then create one
            localStorage.AtlasCache = JSON.stringify({ [localStorage.DBName]: {} });
        } else { // We need to check to make sure the current cache is for the current DB. If not, we need to delete the localStorage
            objCache = JSON.parse(localStorage.AtlasCache); // If we have something in Cache, let's try to parse the JSON
            if (objCache[localStorage.DBName] === undefined) {
                localStorage.removeItem('AtlasCache');
                localStorage.AtlasCache = JSON.stringify({ [localStorage.DBName]: {} });
            }
        }
        this.isInitialized = true;
        //this.Cache.parent = this;
    }
    , CacheORajax: function (objParams) {
        let URL = objParams.URL;
        let cache = this.Cache.GetItem(URL);
        let cachebyname = objParams.cachebyname;

        if (cache === undefined || objParams.bustcache) {
            console.log('no cache for ' + objParams.URL)
            return AtlasUtilities.CallAjaxPost(
                objParams.URL
                , true
                , function (response, objParams) {
                    AtlasCache.Cache.SetItem(
                        {
                            'cacheItemName': objParams.URL
                            , 'cacheItemValue': response
                            , 'cachebyname': objParams.cachebyname
                            , 'overwrite': objParams.overwrite
                        }
                    );
                    if (objParams.doneFunction) {
                        objParams.doneFunction(response, objParams);
                    }
                }
                , AtlasUtilities.LogError
                , objParams
            );
        } else {
            console.log('we have cache for ' + objParams.URL);
            if (objParams.doneFunction) {
                objParams.doneFunction(cache, objParams);
            }
        }
    }
    , CacheCOA: function (refresh) {
        refresh = refresh === undefined || refresh
        localStorage.removeItem('dirtydata');
        let COA = this.Cache.GetItem('COA');

        if (refresh || !COA) {
            let theCall = JSON.stringify(
                {
                    ProdID: localStorage.ProdId
                }
            )
            ;
            AtlasUtilities.CallAjaxPost(
                AtlasUtilities.URL_SEGMENT_CONFIG
                , false
                , this.INIT_segmentsconfig_success
                , AtlasUtilities.ShowError
                , {
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                    , async: false
                    , callParameters: {
                        callPayload: theCall
                    }
                }
            )
            ;
        } else {
            AtlasCache.SEGMENTS_CONFIG = AtlasCache.Cache.GetItem('COA');
            AtlasUtilities.SEGMENTS_CONFIG = AtlasCache.SEGMENTS_CONFIG; // For backwards compatability with code that is already using AtlasUtilities.SEGMENTS_CONFIG
        }
    }
    , INIT_segmentsconfig_success: function (response, objParams) {
        AtlasCache.SEGMENTS_CONFIG.sequence = response.resultJSON;
        let segsequence = AtlasCache.SEGMENTS_CONFIG.sequence;
        let segconfig = AtlasCache.SEGMENTS_CONFIG;
        let G_COALIST = {}

        segsequence.forEach(
            function (element, elementIndex) {
                segconfig[element.SegmentCode] = {};
                element.Accounts.forEach(
                    function (elementa, elementaIndex) {
                        if (element.Classification !== 'Detail') {
                            elementa.COA.forEach(
                                function (key, COAIndex) {
                                    if (key.COACode) {
                                        G_COALIST[key.COACode] =
                                            {
                                                'COANo': elementa.AccountCode
                                                , 'COACode': key.COACode
                                                , 'COAID': key.COAID
                                                , 'AccountCode': elementa.AccountCode + ' (' + elementa.AccountName + ')'
                                                , 'parent': key.COACode.split('|').slice(0, -1).join('|')
                                                , 'Accounts': []
                                            };
                                    }
                                }.bind(
                                {
                                    'segsequence': segsequence
                                    , 'element': element
                                    , 'elementa': elementa
                                    , 'G_COALIST': G_COALIST
                                    , 'G_COALIST_CURRENT': G_COALIST[elementa.COA[0].COACode]
                                })
                            );
                        } else { // Only perform this for segments other than the Detail segment
                            segconfig.DetailIndex = parseInt(elementIndex); // Store the sequence index for the Detail segment
                        }

                        segconfig[element.SegmentCode][elementa.AccountCode] = elementa
                        elementa.COA.forEach(
                            function (key, COAIndex) {
                                segconfig._COA._COACode[key.COACode] = key;
                                segconfig._COA._COAID[key.COAID] = key;
                                if (this.element.Classification !== 'Company' && this.elementa.COA[COAIndex].COACode) { // Ignore the Company segment and optional segments (e.g. Sets)
                                    let parent = this.elementa.COA[COAIndex].COACode.split('|').slice(0, -1).join('|')
                                    this.G_COALIST[parent].Accounts.push(
                                        {
                                            'COANo': this.elementa.AccountCode
                                            , 'COACode': this.elementa.COA[COAIndex].COACode
                                            , 'COAID': this.elementa.COA[COAIndex].COAID
                                            , 'COACodewDescription': this.elementa.AccountCode + ' (' + this.elementa.AccountName + ')'
                                            , 'COANo1': this.elementa.AccountCode + ' (' + this.elementa.AccountName + ')' // for backwards compatability
                                            , 'Posting': this.elementa.Posting
                                        }
                                    );
                                } // Add the accounts to everything except the COmpany segment b/c the Company segment doesn't have any parents
                            }.bind(
                                {
                                    'segsequence': segsequence
                                    , 'element': element
                                    , 'elementa': elementa
                                    , 'G_COALIST': G_COALIST
                                    , 'G_COALIST_CURRENT': G_COALIST[elementa.COA[0].COACode]
                                    //, 'parent': elementa.COA[COAIndex].COACode.split('|').slice(0, -1).join('|')
                                }
                            ));
                        ;
                    }
                );
            }
        );

        AtlasUtilities.SEGMENTS_CONFIG = AtlasCache.SEGMENTS_CONFIG; // For backwards compatability with code that is already using AtlasUtilities.SEGMENTS_CONFIG

        AtlasCache.Cache.SetItem(
            {
                cacheItemName: 'COA'
                , cacheItemValue: AtlasCache.SEGMENTS_CONFIG
                , overwrite: true
            })
        ;

        AtlasCache.Cache.SetItem(
            {
                cacheItemName: "G_COALIST"
                , cacheItemValue: G_COALIST
                , overwrite: true
            })
        ;
    }
    , Cache: {
        _Cache: {}
        , 'parent': function () { return AtlasCache; }
        , SetItem: function (objParams) {
            let cacheItemName = objParams.cacheItemName;
            let cacheItemValue = objParams.cacheItemValue;
            let isoverwrite = objParams.overwrite || true;
            let cachebyname = objParams.cachebyname;

            let lsCache = JSON.parse(localStorage.AtlasCache);
            let dbCache = lsCache[localStorage.DBName]
            let objCache = dbCache[cacheItemName];
            let objCBN = dbCache.cachebyName;

            if (!objCache) { // This means there is no AtlasCache setup for the current selected DB
                dbCache[cacheItemName] = {};
                objCache = dbCache[cacheItemName];
            }

            if (!objCBN) {
                dbCache.cachebyName = {};
                objCBN = dbCache.cachebyName;
            }

            if (isoverwrite || (!isoverwrite && objCache !== {})) {
                objCache = cacheItemValue;
                dbCache[cacheItemName] = objCache;
            }

            if (cachebyname) {
                objCBN[cachebyname] = cacheItemName; // Store the reference to the CacheItemName
            }

            localStorage.AtlasCache = JSON.stringify(lsCache);
            this.Load(true); // Always make sure the cache is loaded
        }
        , GetItem: function (cacheItemName) {
            if (!this.parent().isCacheLoaded) {
                this.Load();
            }
            return this._Cache[cacheItemName];
        }
        , GetItembyName: function (cacheItemName) {
            if (!this.parent().isCacheLoaded) {
                this.Load();
            }
            return this._Cache[this._Cache.cachebyName[cacheItemName]];
        }
        , Load: function (forcereload) {
            forcereload = forcereload === undefined || forcereload;

            if (!this.parent().isInitialized) { this.parent().init(); }

            if (!this.parent().isCacheLoaded || forcereload) {
                let lsCache = JSON.parse(localStorage.AtlasCache);
                let dbCache = lsCache[localStorage.DBName]
                this._Cache = dbCache;
            }

            this.parent().isCacheLoaded = true;
        }
        , ClearCache: function () {
            localStorage.removeItem('AtlasCache');
        }
    }
}
;

var AtlasNavigation = {
    Navigate: {
        byURL: {}
        , byModule: {}
    }, init: function (response, objParams) {
        let resultJSON = response.resultJSON;
        resultJSON.forEach(function (key, value) {
            AtlasNavigation.Navigate.byURL[key.Module_URL.toLowerCase()] = key;
            AtlasNavigation.Navigate.byModule[key.ModuleName.toLowerCase()] = key;
        }
        );

        localStorage.Navigation = JSON.stringify(AtlasNavigation.Navigate);
    }
    , toModule: function (strModule) {
        window.open(location.origin + this.Navigate.byModule[strModule.toLowerCase()].Module_URL, strModule)
        //location.href = location.origin + this.Navigate.byModule[strModule.toLowerCase()].Module_URL;
    }
}
;

var AtlasAccess = {
    URL_GETACCESS: '/api/AtlasUtilities/AtlasUtilities_Access'
    , GUID: function () {
        return this._s4() + this._s4() + '-' + this._s4() + '-' + this._s4() + '-' + this._s4() + '-' + this._s4() + this._s4() + this._s4();
    }
    , _s4: function () {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    , init: function () {
        let theCall = JSON.stringify(
            {
                ProdID: localStorage.ProdId
                , UserID: localStorage.UserId
                , GUID: this.GUID()
            }
        )
        ;

        AtlasUtilities.CallAjaxPost(this.URL_GETACCESS, false
            , AtlasNavigation.init
            , AtlasUtilities.ShowError
            , {
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                , async: false
                , callParameters: {
                    callPayload: theCall
                }
                , "objNavigation": AtlasNavigation
            }
        )
    }
    , GrantAccess: function () {
        if (!AtlasNavigation.Navigate.byURL[location.pathname.toLowerCase()]) {
            $('#Atlas_Access').addClass('AtlasAccess_DENIED');
        } else if (AtlasNavigation.Navigate.byURL[location.pathname.toLowerCase()].Access === 0 || !AtlasNavigation.Navigate.byURL[location.pathname.toLowerCase()]) {
            $('#Atlas_Access').addClass('AtlasAccess_DENIED');
        } else {
            if (AtlasNavigation.Navigate.byURL[location.pathname.toLowerCase()].Access > 0) {
                $('#Atlas_Content').removeClass('AtlasAccess');
                $('#Atlas_Access').addClass('AtlasAccess');
            } else {
                $('#Atlas_Access').addClass('AtlasAccess_DENIED');
            }
        }
    }
}
;

class LedgerCollection {
    constructor(Config) {
        Config = (Config === undefined) ? {} : Config;
        if (Config.divid) this._divID = Config.divid;
        if (Config.reportapi) this._ReportAPI = Config.reportapi;
        if (Config.callingdocumenttitle) this._callingDocumentTitle = Config.callingdocumenttitle;
        if (Config.transactiontype) this._TransactionType = Config.transactiontype;
        if (Config.reporttitle) this._ReportTitle = Config.reporttitle;
        if (Config.legacycallback) this.Legacycallback = Config.legacycallback;
    }

    get DIV() {
        return this._divID
    }
    set DIV(divID) {
        this._divID = divID;
    }

    get ReportAPI() {
        return this._ReportAPI;
    }
    set ReportAPI(apiurl) {
        this._ReportAPI;
    }

    get callingDocumentTitle() {
        return this._callingDocumentTitle;
    }
    set callingDocumentTitle(documenttitle) {
        this._callingDocumentTitle = documenttitle;
    }

    get TransactionType() {
        return this._TransactionType;
    }
    set TransactionType(transactiontype) {
        this._TransactionType = transactiontype;
    }

    get ReportTitle() {
        return this._ReportTitle;
    }
    set ReportTitle(reporttitle) {
        this._ReportTitle = reporttitle;
    }

    get Legacycallback() {
        return this._Legacycallback;
    }
    set Legacycallback(thecallback) {
        if (typeof thecallback === 'function') this._Legacycallback = thecallback;
    }

    CloseDIVorRunReport(isRunPosting) {
        formmodified = 0;
        $(`#${this.DIV}`).hide();
        $('#fade').hide();

        // legacy
        let retriveSegment = $.parseJSON(localStorage.ArrSegment);
        let retriveTransaction = $.parseJSON(localStorage.ArrTransaction);
        let StrSegment = '';
        let StrSClassification = '';
        let StrSegmentOptional = '';
        let strTransCode = '';

        for (let i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].Type.toUpperCase() === 'SEGMENTREQUIRED') {
                StrSegment = StrSegment + retriveSegment[i].SegmentName + ',';
                StrSClassification = StrSClassification + retriveSegment[i].SegmentClassification + ',';
            } else {
                StrSegmentOptional = StrSegmentOptional + retriveSegment[i].SegmentName + ',';
            }
        }
        for (let i = 0; i < retriveTransaction.length; i++) {
            strTransCode = strTransCode + retriveTransaction[i].TransCode + ',';
        }

        StrSegment = StrSegment.substring(0, StrSegment.length - 1);
        StrSegmentOptional = StrSegmentOptional.substring(0, StrSegmentOptional.length - 1);
        strTransCode = strTransCode.substring(0, strTransCode.length - 1);
        StrSClassification = StrSClassification.substring(0, StrSClassification.length - 1);
        // end legacy

        let collectionid = $('#ddlPostingReportHistory_List').val();
        if (isRunPosting !== undefined || collectionid !== undefined) {
            collectionid = (collectionid === undefined)? $('#btnRunPostingReport').data('collectionid'): collectionid;

            let RE = new ReportEngine(this.ReportAPI);
            RE.FormCapture(); // Init the FormJSON
            RE.callingDocumentTitle = this.callingDocumentTitle;
            RE.FormJSON.LE = {
                objLInquiry: {
                    Companyid: 1,
                    ProdId: localStorage.ProdId,
                    UserID: localStorage.UserId,
                    ReportDate: dateFormat(new Date, 'mm/dd/yyyy'),
                    TransactionType: this.TransactionType
                }, ObjRD: {
                    ProductionName: localStorage.ProductionName,
                    Company: '',
                    Bank: localStorage.strBankId,
                    Batch: BatchManager.BatchNumber,
                    UserName: localStorage.UserId,
                    Segment: StrSegment,
                    SegmentOptional: StrSegmentOptional,
                    TransCode: strTransCode,
                    SClassification: StrSClassification,
                    SegmentOrder: G_SegmentOrder
                }
            };
            RE.FormJSON.fieldsetSegments = {
                fieldsetSegments_CO: Object.keys(AtlasUtilities.SEGMENTS_CONFIG.CO)
            }
            RE.FormJSON.fieldsetCurrency = {
                CurrencyReport: G_BASE_CURRENCY
            }
            RE.FormJSON.PostedCollection = collectionid;
            RE.ReportTitle = this.ReportTitle;
            RE.FormJSON.ReportTitle = this.ReportTitle;
            RE.FormJSON.SortOrder = '';
            RE.isJSONParametersCall = true;
            RE.RunReport({ DisplayinTab: true });
        }
    }

    PostCollection(varpost) {
        let waitvar = [];
        waitvar.push($.ajax(
            AtlasDocument.MakeAJAXPOSTobject(
                '/api/Ledger/PostCollection',
                JSON.stringify(
                    {
                        ProdID: localStorage.ProdId,
                        PostingUserID: localStorage.UserId,
                        PostingType: this.TransactionType,
                        JEID: varpost,
                    })
            )
        ).done(function (response) {
            //SaveAuditPostSucess(JSON.parse(response.ReturnLegacy));
            G_LedgerCollection.Legacycallback(JSON.parse(response.ReturnLegacy));
            $('#btnRunPostingReport').data('collectionid', response.PostedCollectionID);
        }).error(function (error) {
            AtlasUtilities.ShowError(error);
        }));
    }
}

$(document).ready(function () {
    AtlasUtilities.init();
    AtlasCache.init();

    if (!window.location.pathname.match('/Home/Login') && window.location.pathname !== '/') { // There are no permissions to check on the Login page
        AtlasAccess.init();
        AtlasAccess.GrantAccess();
    }

    if (document.querySelector('#prev')) {
        $(window).keydown(function (e) {
            if (e.altKey) {
                switch (e.keyCode) {
                    case 37:
                        $("#prev").trigger("click");
                        e.preventDefault();
                        break;
                    case 39:
                        $("#next").trigger("click");
                        e.preventDefault();
                        break;
                }
            }
        });
    }
    if (jQuery().w2field) $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib

    if (/Reports/i.test(document.location.href)) {
        document.title = 'Reports';
    } else if (/Vendors/i.test(document.location.href)) {
        document.title = 'Vendors';
    } else if (/PurchaseOrder/i.test(document.location.href)) {
        document.title = 'Purchase Orders';
    } else if (/Invoice/i.test(document.location.href)) {
        document.title = 'AP Invoices';
    } else if (/Envelope/i.test(document.location.href)) {
        document.title = 'Petty Cash';
    } else if (/Budget/i.test(document.location.href)) {
        document.title = 'Budget';
    } else if (/Ledger/i.test(document.location.href)) {
        document.title = 'Ledger';
    } else if (/CRW/i.test(document.location.href)) {
        document.title = 'CRW';
    } else if (/Payroll/i.test(document.location.href)) {
        document.title = 'Payroll';
    }
})
;





/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length === 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

//==============get date (used in close period) =================//
function GetDateFomate(dt, Mode) {
    if (dt === null) {
        return '';
    }
    var retVal = '';
    var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var d = new Date(dt);
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    if (Mode == 1) retVal = ((curr_date < 10 ? '0' : '') + curr_date + " " + m_names[curr_month] + " " + curr_year);
    else if (Mode == 2) retVal = ((curr_month < 9 ? '0' : '') + (curr_month + 1) + "/" + curr_date + "/" + curr_year);
    return retVal;
}

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

