"use strict"


var AtlasPurchaseOrders = {
    //GlbCOAList: []
    G_COALIST: {}
// Global 
    , APIUrlGetCOA: '/api/Ledger/GetCOABySegmentPosition'
    , APIUrl12GetCOA123: '/api/Ledger/GetCOABySegmentPosition1'
    , APIUrlFillCompany: '/api/CompanySettings/GetCompanyList'
    , APIUrlFillCompanyFirst: '/api/AccountPayableOp/GetDedaultCOLO'
    , APIUrlGetTransactionCode: '/api/CompanySettings/GetTranasactionCode'
    , APIUrlTranscationCode: '/api/CompanySettings/GetTransactionValueByCodeId'
    , APIUrlCompanyClosePeriod: '/api/POInvoice/GetClosePeriodFortransaction' // dynamic by Company
    , APIUrlAccountDetailsByCat: '/api/Ledger/GetTblAccountDetailsByCategory' //Optional COA; dynamic by SegmentName & SegmentLevel
// Static module specific
    , APIUrlFillVendor: '/api/POInvoice/GetVendorAddPO'
    , APIUrlGetSegmentList: '/api/AdminLogin/GetAllSegmentByProdId'
    , APIUrlFillRefVendor: '/api/POInvoice/GetVendorAddPO'
    , APIUrlCompanyPOStartVal: '/api/POInvoice/GetPONumberForCompany' // dynamic by Company
    , APIUrlCheckPONumber: '/api/POInvoice/CheckPONumber'
    , APIUrlFillPO: '/api/POInvoice/GetAllPurchaseOrder'
// Individual URLS
    , APIUrlGetVendorAddress: '/api/POInvoice/GetVendorAddress'
    , APIUrlSaveGetPODetail: '/api/POInvoice/GetPODetail'
    , APIUrlFillPOLines: '/api/POInvoice/GetPOLines'
// Action URLS
    //, APIUrlSavePO: '/api/POInvoice/SavePO' << obsolete
    , APIUrlfunDeletePOLine: '/api/POInvoice/DeletePOLine'
    , APIUrlDeletePoById: '/api/POInvoice/DeletePoById'
    , APIUrlfunClosePO: '/api/POInvoice/UpdatePOStatusClose'
    , BuildAtlasCache: function () {
        AtlasCache.CacheORajax(
            {
                'URL': this.APIUrlFillPO + '?ProdId=' + localStorage.ProdId
                , 'doneFunction': undefined // We're caching ONLY
                , 'objFunctionParameters': {
                    callParameters: JSON.stringify(
                        {
                            PODate: '01-01-1990',
                            PONumber: '',
                            POCO: '',
                            POstatus: '',
                            POVendorId: '',
                            POThirdPartyVendor: '',
                            POBatchNumber: '',
                            Balance: '',
                            ProdID: localStorage.ProdId
                        }
                    )
                }
            }
        );

        AtlasCache.CacheORajax(
            {
                'URL': this.APIUrlFillCompany + '?ProdId=' + localStorage.ProdId
                , 'doneFunction': undefined // We're caching ONLY
                , 'objFunctionParameters': {}
            }
        );

        AtlasCache.CacheORajax(
            {
                'URL': this.APIUrlFillVendor + '?ProdId=' + localStorage.ProdId
                , 'doneFunction': undefined // We're caching ONLY
                , 'objFunctionParameters': {
                }
            }
        );

        AtlasCache.CacheORajax(
            {
                'URL': this.APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 0
                , 'doneFunction': undefined // We're caching ONLY
                , 'objFunctionParameters': {}
            }
        );

        AtlasCache.CacheORajax(
            {
                'URL': this.APIUrlGetTransactionCode + '?ProdId=' + localStorage.ProdId
                , 'doneFunction': undefined // We're caching ONLY
                , 'objFunctionParameters': {}
                , 'cachebyname': 'Transaction Codes'
            }
        );
        AtlasCache.CacheORajax(
            {
                'URL': this.APIUrlFillRefVendor + '?ProdId=' + localStorage.ProdId
                , 'doneFunction': undefined // We're caching ONLY
                , 'objFunctionParameters': {}
            }
        );

        AtlasCache.CacheORajax(
            {
                'URL': this.APIUrlFillCompanyFirst + '?ProdId=' + localStorage.ProdId
                , 'doneFunction': undefined // We're caching ONLY
                , 'objFunctionParameters': {
                }
            }
        );

    }
    , funSegment: function (values, SegmentName, SegmentP) {
        $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');

        var COACode = '';
        var PreSegment = 0;
        COACode = $('#hdnCode_' + values).val();
        if (SegmentP == 0) {
            COACode = '~';
        } else {
            PreSegment = SegmentP - 1;
        }
        var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
        if (undefined === AtlasPurchaseOrders.G_COALIST[SegmentName]) {
            $.ajax({
                url: this.APIUrlGetCOA + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
            })
            .done(function (response) {
                AtlasPurchaseOrders.G_COALIST[SegmentName] = response;
                AtlasPurchaseOrders.funSegmentSucess(response, values, SegmentP);
            })
            .fail(function (error) {
                console.log(error);
            })
            ;
        } else {
            AtlasPurchaseOrders.funSegmentSucess(AtlasPurchaseOrders.G_COALIST[SegmentName], values, SegmentP);
        }
    }
    , funSegmentSucess: function (response, values, SegmentP) {
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

        $('#txt_' + values + '_' + SegmentP).addClass('SearchCode');
        $(".SearchCode").autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {

                $(this).val(ui.item.label);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);

                $('#hdnCode_' + values).val(ui.item.value);
                $('#hdnCOAId_' + values).val(ui.item.COAId);
                return false;
            },
            select: function (event, ui) {

                $(this).val(ui.item.label);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);

                $('#hdnCode_' + values).val(ui.item.value);
                $('#hdnCOAId_' + values).val(ui.item.COAId);

                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        })
    }
    , fun1Segment123: function (values, SegmentName, SegmentP) {
        var COACode = '';
        var PreSegment = 0;
        COACode = $('#hdnCode_' + values).val();
        if (SegmentP == 0) {
            COACode = '~';
        } else {
            PreSegment = SegmentP - 1;
        }
        var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');

        GlbCOAList = AtlasCache.Cache.GetItem('G_COALIST');
        let accountlist = GlbCOAList[strCOACode];
        if (accountlist) {
            if (!AtlasPurchaseOrders.G_COALIST[SegmentName]) {
                AtlasPurchaseOrders.G_COALIST[SegmentName] = {}
            }
            AtlasPurchaseOrders.G_COALIST[SegmentName][strCOACode] = GlbCOAList[strCOACode].Accounts;
        }

        if (undefined === AtlasPurchaseOrders.G_COALIST[SegmentName]) {
            $.ajax({
                url: this.APIUrl12GetCOA123 + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
            })
            .done(function (response) {
                AtlasPurchaseOrders.G_COALIST[SegmentName] = {};
                AtlasPurchaseOrders.G_COALIST[SegmentName][strCOACode] = response;
                AtlasPurchaseOrders.CreateCOAAutoComplete({
                    "cacheItemName": "GlbCOAList"
                    , "cacheItemValue": response
                    , "domID": values
                    , "SegmentName": SegmentName
                    , "SegmentPrefix": SegmentP
                }
                );
            })
            .fail(function (error) {
                AtlasUtilities.LogError(error);
            })
        } else {
            if (undefined === AtlasPurchaseOrders.G_COALIST[SegmentName][strCOACode]) {
                $.ajax({
                    url: this.APIUrl12GetCOA123 + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
                    cache: false,
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                    },
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                })
                .done(function (response) {
                    AtlasPurchaseOrders.G_COALIST[SegmentName] = {};
                    AtlasPurchaseOrders.G_COALIST[SegmentName][strCOACode] = response;
                    AtlasPurchaseOrders.CreateCOAAutoComplete({
                        "cacheItemName": "GlbCOAList"
                        , "cacheItemValue": response
                        , "domID": values
                        , "SegmentName": SegmentName
                        , "SegmentPrefix": SegmentP
                    }
                    );
                })
                .fail(function (error) {
                    AtlasUtilities.LogError(error);
                })
            } else {
                AtlasPurchaseOrders.CreateCOAAutoComplete({
                    "cacheItemName": "GlbCOAList"
                    , "cacheItemValue": AtlasPurchaseOrders.G_COALIST[SegmentName][strCOACode]
                    , "domID": values
                    , "SegmentName": SegmentName
                    , "SegmentPrefix": SegmentP
                }
                );
            }
        }
    }
    , CreateCOAAutoComplete: function (objParams) {
        let cacheItemName = objParams.cacheItemName;
        let response = objParams.cacheItemValue;
        let values = objParams.domID;
        let SegmentName = objParams.SegmentName;
        let SegmentP = objParams.SegmentPrefix;

        GlbCOAList = response;
        var array = [];
        var ProductListjson = response;
        array = response.error ? [] : $.map(response.filter((e) => { return e.Posting; }), function (m) {
            return {
                strlabel: m.COANo,
                label: m.COANo1,
                value: m.COACode,
                COAId: m.COAID,
            };
        });
        $('#txt_' + values + '_' + SegmentP).addClass('SearchCode');
        $(".SearchCode").autocomplete({
            minLength: 0,
            source: function (request, response) {
                let matches = $.map(array, (item) => { if (item.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) return item; });
                response(matches);
            },
            focus: function (event, ui) {
                $(this).val(ui.item.label);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);

                $('#hdnCode_' + values).val(ui.item.value);
                $('#hdnCOAId_' + values).val(ui.item.COAId);
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.strlabel);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);

                $('#hdnCode_' + values).val(ui.item.value);
                $('#hdnCOAId_' + values).val(ui.item.COAId);

                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        });
    }
    , TransactionCodeBlur(obj) {
        if (obj.value === '') {
            $(obj).removeAttr('TransValueId');
            $(obj).val('');
            return;
        }

        let thematch = GlbTransList.find((e, i) => {
            return e.TransValue.includes(obj.value.toUpperCase());
        });

        if (thematch) {
            $(obj).attr('TransValueId', thematch.TransactionValueID);
            $(obj).val(thematch.TransValue);
        } else {
            $(obj).notify('Invalid Code');
        }
    }
}
;
