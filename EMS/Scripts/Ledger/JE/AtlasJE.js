var AtlasJE = {
    APIUURL_GetJEHeader: '/api/Ledger/GetJEntryByJEId'
    , APIURL_GetJEBody: '/api/Ledger/GetJEDetailByJEId'
    , _divHeader: undefined
    , _tblBody: undefined
    , _tblBodyth: undefined
    , _tblBodytbody: undefined
    , _tblBodydiv: undefined
    , _JournalEntryID: undefined
    , _funcNewLine: undefined
    , _funcNewLinecallback: undefined
    , Config: {
        BodyTablediv: function (divID) {
            if (divID === undefined) return AtlasJE._tblBodydiv;
            AtlasJE._tblBodydiv = divID;
        }
        , BodyTableth: function (tblIDth) {
            if (tblIDth === undefined) return AtlasJE._tblBodyth;
            AtlasJE._tblBodyth = tblIDth;
        }
        , BodyTable: function (tblID) {
            if (tblID === undefined) return AtlasJE._tblBody;
            AtlasJE._tblBody = tblID;
        }
        , BodyTabletbody: function (tblIDtbody) {
            if (tblIDtbody === undefined) return AtlasJE._tblBodytbody;
            AtlasJE._tblBodytbody = tblIDtbody;
        }
        , NewLine: function (funcNew, funccallback) {
            if (typeof funcNew === 'function') {
                AtlasJE._funcNewLine = funcNew;
            }

            if (typeof funccallback === 'function') {
                AtlasJE._funcNewLinecallback = funccallback;
            }

            if (AtlasJE._funcNewLinecallback) {
                return function () {
                    AtlasJE._funcNewLine();
                    AtlasJE._funcNewLinecallback();
                }
            } else {
                return AtlasJE._funcNewLine;
            }
        }
    }
    , JournalEntryID: function () {
        return AtlasJE._JournalEntryID;
    }
    , Document: {
        Header: {}
        , Body: {}
    }
    , BlankLine: function () {
        this.Config.NewLine()();
    }
    , init: function (JEID, headercallback, bodycallback) {
        setTimeout(() => {
            AtlasUtilities.ShowLoadingAnimation();
        }, 10);

        $(`#${AtlasJE.Config.BodyTabletbody()}`).empty(); // Empty the body table

        AtlasJE._JournalEntryID = JEID;
        AtlasJE.Document.Header = {};
        AtlasJE.Document.Body = {};

        let strHtml = '';
        strHtml += '<tr>';
        strHtml += '<th>Delete</th>';
        let ArrSegment = AtlasUtilities.SEGMENTS_CONFIG.sequence;
        for (var i = 0; i < ArrSegment.length; i++) {
            strHtml += '<th>' + ArrSegment[i].SegmentCode + '</th>';
        }
        let ArrTransCode = (AtlasCache.Cache.GetItembyName('Config.TransactionCodes')) ? AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON : [];
        for (var i = 0; i < ArrTransCode.length; i++) {
            strHtml += '<th>' + ArrTransCode[i].TransCode + '</th>';
        }
        strHtml += '<th>Debit</th>';
        strHtml += '<th>Credit</th>';
        strHtml += '<th>Vendor</th>';
        strHtml += '<th style="width:40px;">Tax Code</th>';
        strHtml += '<th style="width:70px;">Description</th>';
        strHtml += '</tr>';
        $(`#${AtlasJE.Config.BodyTableth()}`).html(strHtml);

        var waitKEY = [];
        waitKEY.push(AtlasUtilities.CallAjaxPost(
            `${AtlasJE.APIUURL_GetJEHeader}?JournalEntryId=${JEID}`
            , false
            , function (response, objFunctionParameters) {
                AtlasJE.Document.Header = response[0];
                headercallback(response);

                AtlasUtilities.CallAjaxPost(
                `${AtlasJE.APIURL_GetJEBody}?JournalEntryId=${JEID}`
                , false
                , function (response, objFunctionParameter) {
                    //console.log(Date.now());
                    AtlasJE.Document.Body = response;
                    bodycallback(response);
                    AtlasUtilities.HideLoadingAnimation();
                    //console.log(Date.now());
                }
                , AtlasUtilities.LogError
                , { async: true }
                );
            }
            , AtlasUtilities.LogError
            , { async: true }
        ));
    }
    , fnVendorBlur: function (obj, noautocomplete) {
        let strval = obj.value.toLowerCase();
        let VendorList = AtlasCache.Cache.GetItembyName('Vendor List');
        let VID = undefined;
        if (typeof GlbVendorList !== 'undefined') GlbVendorList = VendorList; // For backwards compatability with global variable usage

        if (strval != '') {
            for (var i = 0; i < VendorList.length; i++) {
                if (noautocomplete) {
                    if (VendorList[i].VendorName.toLowerCase() === strval) {
                        VID = VendorList[i].VendorID; // Always return the VendorID when there is a match
                        break;
                    }
                } else {
                    if (VendorList[i].VendorName.toLowerCase().match(strval)) {
                        $(obj).val(VendorList[i].VendorName);
                        $(obj).attr('name', VendorList[i].VendorID);
                        if (VendorList[i].DefaultDropdown == null) {
                            $('#ddlTaxCode_' + obj.parentElement.parentElement.id).val(0);
                        } else {
                            if ($('#ddlTaxCode_' + obj.parentElement.parentElement.id).val() != "") {
                            } else {
                                $('#ddlTaxCode_' + obj.parentElement.parentElement.id).val(VendorList[i].DefaultDropdown);
                            }
                        }
                        $(obj).removeClass('field-Req');
                        VID = VendorList[i].VendorID; // Always return the VendorID when there is a match
                        break;
                    }
                }
            }
        } else {
            $(obj).removeClass('field-Req');
            return 0;
        }

        if (VID === undefined) {
            $(obj).notify('Invalid Vendor');
            $(obj).addClass('field-Req');
        }
        return VID;
    }
    //===============================================Vendor
    , fnGetVendorList(obj) {
        let waitvar = [];
        waitvar.push(
            AtlasCache.CacheORajax({
                'URL': AtlasCache.APIURLs.AtlasCache_VendorList + '?SortBy=' + 'All' + '&ProdID=' + localStorage.ProdId
                , 'doneFunction': function (response) {
                    if (typeof GlbVendorList !== 'undefined') { // backward compatability to global variable usage
                        GlbVendorList = [];
                        GlbVendorList = response;
                    }
                    var array = [];
                    var ProductListjson = response;
                    array = response.error ? [] : $.map(response, function (m) {
                        return {
                            value: m.VendorID,
                            label: m.VendorName,
                            TaxCode: m.DefaultDropdown,
                        };
                    });

                    $(`#${obj.id}`).autocomplete({
                        minLength: 0,
                        source: array,
                        focus: function (event, ui) {
                            $(this).attr('name', ui.item.value);
                            $(this).attr('TaxtCode', ui.item.TaxCode);
                            $(this).val(ui.item.label);
                            return false;
                        },
                        select: function (event, ui) {
                            $(this).attr('name', ui.item.value);
                            $(this).attr('TaxtCode', ui.item.TaxCode);
                            $(this).val(ui.item.label);
                            return false;
                        },
                        change: function (event, ui) {
                            if (!ui.item) {
                            }
                        }
                    })
                }
                , 'objFunctionParameters': {
                }
                , 'cachebyname': 'Vendor List'
            }) // End call to CacheORajax
        );

        return;
    }

}

$('.smartdate').blur(function () {
    if (this.value === '') return;
    let thedate = moment(this.value, 'MM/DD/YYYY').format('MM/DD/YYYY');
    if (thedate.toUpperCase() === 'INVALID DATE') { // moment.isValid doesn't work properly for a value like 33, which is invalid
        this.value = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
    } else {
        this.value = thedate;
    }
});
