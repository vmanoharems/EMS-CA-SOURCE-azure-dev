// Posted Collection requirements
var REConfig = new AtlasConfig();
var G_BASE_CURRENCY = 'USD';
var G_LedgerCollection = new LedgerCollection({
    divid: 'SaveInvoiceSuccess'
    , reportapi: '/api/ReportAPI/LedgerInQuiryTransaction'
    , callingdocumenttitle: 'Petty Cash'
    , transactiontype: 'PC'
    , reporttitle: 'Posting Report (Petty Cash)'
    , legacycallback: PCEnvelopePostSucess
});

var DT_tblList;
var DTCount = 0;
var formmodified = 0;
// Posted Collection

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillCustodian = HOST + "/api/POInvoice/GetCustodianCode";
var APIUrlFillRecipient = HOST + "/api/POInvoice/GetRecipientList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlCheckPCEnvelopeNumberDuplicacy = HOST + "/api/POInvoice/CheckPCEnvelopeNumberDuplicacy";
var APIUrlSavePC = HOST + "/api/POInvoice/SavePCEnvelope";

var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";

var APIUrlGetPCenvelopsList = HOST + "/api/POInvoice/GetPCEnvelopList";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlGetPCEnvelopDetail = HOST + "/api/POInvoice/GetDetailPCEnvelopeById";
var APIUrlGetPCEnvelopLineDetail = HOST + "/api/POInvoice/GetPCEnvelopeLineDetailById";
var APIUrlDeletePCDetail = HOST + "/api/POInvoice/DeletePCEnvelopeById";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";
var APIUrlUpdatePcEnvelope = HOST + "/api/POInvoice/updatePCEnvelopeStatus";

var ArrCompany = [];
var ArrCustodian = [];
var ArrRecipient = [];
var retriveSegment = [];
var retriveTransaction = [];
var GlbTransList = [];
var strCCount = 0;
var strAdAmountCount = 0;
var strEnvelopCount = 0;
var StrEnvelopId = 0;
var GetVendorNamePO = [];
var strClosePeriodId = 0;
var ArrSegment = [];
var oDeletedIds = [];
var sEnvelopeStatus = "";
GlbCOAList = [];
var StrDisplayTrue = 'True';
var Tcount = 0;
var PageCnt;
var GblOptionalCOA = [];

var TCodes = [];
var strCompany

AtlasUtilities.init();

var G_OBJAPPC_CUSTODIAN = {
    URL_API_CUSTODIANLIST: "/api/POInvoice/GetCustodianCode"
    , FULL_CUSTODIAN_LIST: []
    , setCustodianList: function (response, objParameters) {
        G_OBJAPPC_CUSTODIAN.FULL_CUSTODIAN_LIST = $.map(response, function (m) {
            return {
                value: m.CustodianID,
                label: m.CustodianCode
            };
        });
        if (response.length === 1) {
            G_OBJAPPC_CUSTODIAN.theCustodian = response[0];
        }
    }
    , Error(response, objParameters) {
        console.log(response);
    }
    , ListLoad() {
        AtlasUtilities.CallAjaxPost(
            G_OBJAPPC_CUSTODIAN.URL_API_CUSTODIANLIST + '?ProdId=' + localStorage.ProdId
            , false
            , this.setCustodianList
            , this.Error
            , { async: true }
        );
    }
    , init: function () {
        G_OBJAPPC_CUSTODIAN.ListLoad();
    }
    , DefalutCOAArray: []
    , theCustodian: {}
    , setCustodian(objCustodian) {
        G_OBJAPPC_CUSTODIAN.theCustodian = $.extend({}, objCustodian);
        G_OBJAPPC_CUSTODIAN.DefalutCOAArray = this.theCustodian.COACode.split("|");
    }
    , SegmentsetDefaultValues(SegmentArray) {
        G_OBJAPPC_CUSTODIAN.DefalutValuesArray = SegmentArray.slice(); // Make a copy of the Custodian array so that in case it is changed somewhere else, we retain the original
    }
    , SegmentgetDefaultValue: function (SegmentIndex) {
        try {
            return G_OBJAPPC_CUSTODIAN.DefalutCOAArray[SegmentIndex];
        } catch (e) {
            return '';
        }
    }
};

G_OBJAPPC_CUSTODIAN.init();

var G_OBJAPPC_RECIPIENT = {
    FULL_RECIPIENT_LIST: []
    , URL_API_RECIPIENTLIST: "/api/POInvoice/GetRecipientList"
    , setRecipient(objRecipient) {
        this.theRecipient = $.extend({}, objRecipient);
        this.DefalutCOAArray = this.theRecipient.CoaString.split("|");
    }
    , setRecipientList: function (response, objParameters) {
        G_OBJAPPC_RECIPIENT.FULL_RECIPIENT_LIST = $.map(response, function (m) {
            return {
                value: m.VendorID,
                label: m.VendorName,
                CAId: m.CoaID,
                AccountCode: m.CoaString,
                RecipientID: m.RecipientID,
                Addressw9: m.Addressw9,
                Address2w9: m.Address2w9
            };
        });
    }
    , Error(response, objParameters) {
        console.log(response);
    }
    , SegmentsetDefaultValues(SegmentArray) {
        this.DefalutValuesArray = SegmentArray.slice(); // Make a copy of the Custodian array so that in case it is changed somewhere else, we retain the original
    }
    , SegmentgetDefaultValue: function (SegmentIndex) {
        try {
            return this.DefalutCOAArray[SegmentIndex];
        } catch (e) {
            return '';
        }
    }
    , ListLoad() {
        AtlasUtilities.CallAjaxPost(
            this.URL_API_RECIPIENTLIST + '?ProdId=' + localStorage.ProdId
            , false
            , this.setRecipientList
            , this.Error
            , { async: true }
        );
    }
    , init: function () {
        this.ListLoad();
    }
};

G_OBJAPPC_RECIPIENT.init();

var G_OBJAPPC_ENVELOPE = {
    UserhasCreatedLine: false
    , PCEnvelopeID: 0
    , funCreateThead: function () {
        strhtml = '';
        strhtml += '<tr>';
        strhtml += '<th width="6% !important">Line</td>';
        for (let i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].SegmentName === 'CO') {
                strhtml += '<th style="display:none;">' + retriveSegment[i].SegmentName + '</th>';
            } else {
                strhtml += '<th>' + retriveSegment[i].SegmentName + '</th>';
            }
        }

        for (let i = 0; i < retriveTransaction.length; i++) {
            strhtml += '<th>' + retriveTransaction[i].TransCode + '</th>';
        }
        strhtml += '<th>Description</td>';
        strhtml += '<th>Amount</td>';
        strhtml += '<th>Vendor</td>';
        strhtml += '<th>TaxCode</td>';
        strhtml += '</tr>';
        $('#TblPCLineThead').html(strhtml);
    }
    , CreateCustodianRow: function (objD, action, rowID) {
        objD = (objD === undefined) ? {} : objD;

        //#in3080 Fix: After Row deletion tr id was getting duplicated on DOM hence fetching the current maxid and using that after incrementing it by 1 as next id.
        Tcount = GetMaxId() + 1;
        if (rowID === undefined) rowID = Tcount;

        var strNote = (objD['DESCRIPTION'] === undefined) ? $('#txtDescription').val() : objD['DESCRIPTION'];

        strCompany = $('#txtCompany').val();

        if (strCompany !== '' && strCompany !== undefined) {
            var strhtml = '';
            strhtml += `<tr id="${Tcount}" class="clsTr ATID${AtlasPaste.FillFieldValue(objD, 'AccountTypeId', '0')}">`;
            strhtml += '<td style="width:1% !important;"> <span id="spn_' + Tcount + '"> <i class="fa fa-minus-circle" onclick="javascript:funJEDeleteRow(' + Tcount + ');"></i></span><span class="row-seq-hide"><b> ' + Tcount + ' </b></span> </td>';   // 

            for (var i = 0; i < retriveSegment.length; i++) {
                if (retriveSegment[i].Type == 'SegmentRequired') {
                    if (retriveSegment[i].SegmentName === 'CO') {
                        strhtml += `<td style="display:none;" class="input-segment"><input type="text" class="input-required clsPaste form-segment CO" onblur="javascript: GetSegmentValue(${Tcount},'${retriveSegment[i].SegmentName}',${i});" onfocusout="javascript:ShowSegmentNotify(\'CO value   does not match with Custodian value\',\'warn\',this);" onblur="javascript:GetSegmentValue(${Tcount}, '${retriveSegment[i].SegmentName}', ${i});" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${Tcount}, '${retriveSegment[i].SegmentName}', ${i}, this);" id="txt_${Tcount}_${i}" name="${retriveSegment[i].SegmentName}" coacode="${strCompany}" value="${strCompany}" /></td>`;
                    } else if (retriveSegment[i].SegmentName === 'DT') {
                        strhtml += `<td class="width100 input-segment"><input type="text" class="detectTab input-required clsPaste form-segment DT" value="${AtlasPaste.FillFieldValue(objD, retriveSegment[i].SegmentName.toUpperCase())}" onblur="javascript: GetSegmentValue(${Tcount},'${retriveSegment[i].SegmentName}','${i}');" onfocus="javascript:AtlasUtilities.BuildDetailSegmentAutoComplete(${Tcount},'${retriveSegment[i].SegmentName}','${i}', this);" id="txt_${Tcount}_${i}" name="${retriveSegment[i].SegmentName}" /></td>`;
                    } else {
                        strhtml += `<td class="width40 input-segment"><input type="text" class="detectTab input-required clsPaste form-segment ${retriveSegment[i].SegmentName.toUpperCase()}" value="${AtlasPaste.FillFieldValue(objD, retriveSegment[i].SegmentName.toUpperCase(), G_OBJAPPC_RECIPIENT.SegmentgetDefaultValue(i))}" onblur="javascript:GetSegmentValue(${Tcount},'${retriveSegment[i].SegmentName}',${i});" onfocusout="javascript:ShowSegmentNotify('${retriveSegment[i].SegmentName} value does not match with Custodian value','warn',this);" onblur="javascript:GetSegmentValue(${Tcount},'${retriveSegment[i].SegmentName}',${i});" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${Tcount},'${retriveSegment[i].SegmentName}',${i}, this);" id="txt_${Tcount}_${i}" name="${retriveSegment[i].SegmentName}" /></td>`;
                    }
                } else if (retriveSegment[i].Type != 'SegmentRequired') {
                    strhtml += `<td class="width40"><input type="text" class="form-segment-optional ${Tcount} clsOtional${Tcount}" value="${AtlasPaste.FillFieldValue(objD, retriveSegment[i].SegmentName)}" onblur="javascript: funCheckOptionalAutoFill(${Tcount},'${retriveSegment[i].SegmentName}',${i});" onfocus="javascript:GetOptional(${Tcount},'${retriveSegment[i].SegmentName}',${i});" id="txtOptional_${Tcount}_${i}" name="${retriveSegment[i].SegmentName}"/></td>`;
                }
            }

            for (var i = 0; i < retriveTransaction.length; i++) {
                strhtml += `<td class="width40"><input type="text" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" class="clsPaste clsTransCode${Tcount} clsTransCode_${Tcount}" onfocus="javascript: funTransDetail(${Tcount},${retriveTransaction[i].TransId},'${retriveTransaction[i].TransCode}')" id="txt_${retriveTransaction[i].TransCode}_${Tcount}" name="${retriveTransaction[i].TransId}" value="${AtlasPaste.FillFieldValue(objD, retriveTransaction[i].TransCode, '')}"/></td>`;
            }

            strhtml += `<td class="width40"><input type="text" class="detectTab clsDescription input-required" id="txtDescription_${Tcount}" value="${strNote}" /></td>`;
            strhtml += `<td class="width40"><span style="float: left;background: #fff;padding: 4px 0px;"></span><input type="text" class="input-required detectTab AmountCalculation clsAmount amount w2field width90" onclick="javascript:funAmountblur(${Tcount});" id="txtAmount_${Tcount}" value="${AtlasPaste.FillFieldValue(objD, 'AMOUNT')}"/></td>`;
            strhtml += `<td class="width40"><input type="text" id="txtVendorName_${Tcount}" class="VendorCode clsVendorName" onfocus="javascript: FillVendor();" onblur="javascript: VendorBlur(${Tcount})" value="${AtlasPaste.FillFieldValue(objD, 'VENDOR')}"/></td>`;
            strhtml += `<td class="width40"><input type="text" id="TaxCode_${Tcount}" class="clsTaxCode clsTaxPC" name="TaxCode" onfocus="javascript:funTaxCode(${Tcount});" value="${AtlasPaste.FillFieldValue(objD, 'TAXCODE')}" /></td>`;
            // hidden values used for legacy COAID logic
            strhtml += `<td style="display:none;"><input type="hidden" class="clsCOAId" id="hdnCoaId_${Tcount}"><input type="hidden" class="clsCOACode" id="hdnCode_${Tcount}"><input type="hidden" class="clsPCLine" id="hdnLineId_${Tcount}"></td>`;
            strhtml += `<td class="width40" style="display:none;"><input type="text" class="clsDisplay" Flag="0" id="SpanDisId_${Tcount}"></td>`;

        } else {
            ShowMsgBox('showMSG', 'Select Company first..!!', '', 'failuremsg');
        }

        strhtml += '</tr>';
        $('#TblPCLineTBody').append(strhtml);
        //$('.w2float').w2field('float');
        $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 });
        AtlasUtilities.AddStickyTableHeaders('TblPCLine', 'dvTableDetail', 280);
        $('#txt_' + (Tcount) + '_1').focus();
    }
    , fnVendorBlur: function (obj) {
        let strval = obj.value.toLowerCase();
        let VendorList = AtlasCache.Cache.GetItembyName('Vendor List');
        if (typeof GlbVendorList !== 'undefined') GlbVendorList = VendorList; // For backwards compatability with global variable usage

        if (strval != '') {
            for (var i = 0; i < VendorList.length; i++) {
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
                    return VendorList[i].VendorID;
                    break;
                } else {
                }
            }
        } else {
            $(obj).removeClass('field-Req');
            return 0;
        }

        $(obj).notify('Invalid Vendor');
        $(obj).addClass('field-Req');
        return -1;
    }
    , SavePC: function() {
        var Tcount = $('#TblPCLineTBody tr').length;
        var ArrPCLine = [];
        var StrDisplayType = '';
        let invaliddata = 0;

        var ObjPCEn = {
            PcEnvelopeID: StrEnvelopId,
            Companyid: $('#ddlCompany').val(),
            BatchNumber: BatchManager.BatchNumber,
            CustodianId: $('#txtCustodian').attr('name'),
            RecipientId: $('#hdnRecipientId').val(),
            EnvelopeNumber: $('#txtEnvelopeNumber').val(),
            Description: $('#txtDescription').val(),
            AdvanceAmount: $('#txtAdvanceAmount').val(),
            EnvelopeAmount: $('#txtEnvelopeAmount').val(),
            LineItemAmount: $('#txtLineItemAmount').val(),
            Difference: $('#txtDifference').val(),
            PostedDate: $('#txtEnvelopeDate').val(),
            Status: 'Pending',
            CreatedBy: localStorage.UserId,
            Prodid: localStorage.ProdId,
            PostedBy: null,
            ClosePeriodId: $('#ddlClosePeriod').val()
            , CurrencyDocument: $('#ddlCurrency :selected').val()
        }

        var SclsCOAId = $('.clsCOAId');
        var SclsCOACode = $('.clsCOACode');
        var SclsAmount = $('.clsAmount');
        var SclsVendorName = $('.clsVendorName');
        var lclsTaxCode = $('.clsTaxCode');
        var SclsDescription = $('.clsDescription');
        var SclsPCLine = $('.clsPCLine');
        var sclsTr = $('.clsTr');
        var isDisabled = $('.clsDisplay');

        for (var i = 0; i < sclsTr.length; i++) {
            //var strVendorId = SclsVendorName[i].id;
            var FvendorId = this.fnVendorBlur(SclsVendorName[i]); //$('#' + strVendorId).attr('vendorid');
            if (FvendorId <= 0) FvendorId = null;
            var FsclsTr = sclsTr[i].id;
            var TransString = '';
            var strSet = '';
            var strSeires = '';
            var strOption = $('.clsOtional' + FsclsTr);
            let isTaxCodeValue = AtlasUtilities.TaxCode1099.find((e) => { 
                return e.TaxCode === $(lclsTaxCode[i]).val();
            });
            if (!isTaxCodeValue && $(lclsTaxCode[i]).val() !=='') {
                $(lclsTaxCode[i]).addClass('field-Req');
                invaliddata++;
            } else {
                $(lclsTaxCode[i]).removeClass('field-Req');
            }

            var strOptional = $(`.form-segment-optional.${FsclsTr}`);
            for (var j = 0; j < strOptional.length; j++) {
                let strid = strOptional[j].id;
                if ($('#' + strid).val() === '') break;
                let theSets = AtlasUtilities.SEGMENTS_CONFIG.Set;
                if (!theSets) {
                    strSet = '';
                    $('#' + strid).notify('Invalid Code');
                    $(`#${strid}`).addClass('field-Req');
                    invaliddata++;
                } else {
                    if (AtlasUtilities.SEGMENTS_CONFIG.Set[$('#' + strid).val()] === undefined) {
                        strSet = '';
                        $('#' + strid).notify('Invalid Code');
                        $(`#${strid}`).addClass('field-Req');
                    } else {
                        strSet = AtlasUtilities.SEGMENTS_CONFIG.Set[$('#' + strid).val()].AccountID;
                        $(`#${strid}`).removeClass('field-Req');
                    }
                }
            }

            let objTransString = {};
            var strTrans = $('.clsTransCode' + FsclsTr);
            strTrans.each((i,e) => {
                if (e.value !== '') {
                    let isMatch = TCodes[i].TV.find((f) => { 
                        return f.TransValue == e.value 
                    });

                    if (!isMatch && e.value !== '') {
                        $(e).addClass('field-Req');
                        invaliddata++;
                    } else {
                        objTransString[parseInt(e.name)] = isMatch.TVID;
                        $(e).removeClass('field-Req');
                    }
                }
            });
            TransString = JSON.stringify(objTransString).replace('{','').replace('}','').replace(/\"/g,'');

            var strDisplayT = $('.clsDisplay');
            var stridDisplay = strDisplayT[i].id;
            var strDisplayvalue = $('#' + stridDisplay).val();

            // Get the COAID and COACode based upon current values rather than on-the-fly (buggy) setting of segment values
            let objCOA = {}
            $(sclsTr[i]).find('td.input-segment').each(function(tde){ 
                $(this).find('input').each(function(ie){ 
                    objCOA[this.name] = $(this).val();
                    $(this).removeClass('field-Req');
                });
            });
            let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objCOA);
            if (COAID === undefined || COACode === undefined) {
                if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(sclsTr[i]).notify('Invalid Account');
                Object.keys(SegCheck).forEach((seg) => {$($(sclsTr)[i]).find(`td.input-segment [name=${seg}]`).addClass('field-Req');});
                $(sclsTr[i]).addClass('field-Req');
                invaliddata++;
            }
            let lineCOA = COAID;

            var objPCEnLine = {
                EnvelopeLineID: SclsPCLine[i].value,
                PCEnvelopeID: StrEnvelopId,
                TransactionLineNumber: '',
                COAID: lineCOA,
                Amount: SclsAmount[i].value,
                VendorID: FvendorId,
                TaxCode: lclsTaxCode[i].value,
                LineDescription: SclsDescription[i].value,
                TransactionCodeString: TransString,
                Setid: strSet,
                SeriesID: strSeires,
                Prodid: localStorage.ProdId,
                CreatedBy: localStorage.UserId,
                CoaString: COACode,
                Displayflag: strDisplayvalue

            }
            ArrPCLine.push(objPCEnLine);
        }

        var finalObj = {
            objPC: ObjPCEn,
            ObjPCLine: ArrPCLine
        }

        if (invaliddata > 0 ) {
            $('#SpnTransactionNobreadcrumb').notify('This entry was NOT SAVED. Please correct your highlighted data and save again.');
            $('#fade').hide();
            AtlasUtilities.HideLoadingAnimation();
            return 0;
        }

        $.ajax({
            url: APIUrlSavePC,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(finalObj),
        })
        .done(function (response) {
            $('#DvSuccess').show();
            setTimeout(function() {
                $('#hrfSuccessOK').focus();
            })
            $('#fade').show();

            if ($('#SpnTransactionNobreadcrumb').text() != '') {
                $('#spnTransactionNo').text($('#SpnTransactionNobreadcrumb').text());
            } else {
                $('#spnTransactionNo').text(response);
            }

            $('#lblBillingAddress1').text('');
            $('#lblBillingAddress2').text('');
            $('#txtCompany').prop('disabled', false);

            //SavePCSucess(response);
            AtlasUtilities.HideLoadingAnimation();
        })
        .fail(function (error) {
            AtlasUtilities.HideLoadingAnimation();
            ShowMSG(error);
        })
        ;

        // legacy code from SavePCSuccess()
        if (sEnvelopeStatus == "Pending") {
            funDeleteAllRemoved();
        }
    }
};

var AddNew_click_default = function () {
    window.location.href = '/AccountPayable/PCEnvelopes?#AddNew';
};
var AddNew_click_onenvelope = function () {
    window.location.href = '/AccountPayable/PCEnvelopes?#AddNew';
};

$(document).ready(function () {
    G_OBJAPPC_ENVELOPE.PCEnvelopeID = 0;

    $('#APPCEnvelopeAddNew').click(AddNew_click_default);

    $('#navMainUL li').removeClass('active');
    $('#hrefPayable').parent().addClass('active');
    $('#UlAccountPayable li').removeClass('active');
    $('#LiPettyCash').addClass('active');

    GetPCenvelopsList();
    FillCompany();

    
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    if (curr_date.toString().length === 1) {
        curr_date = '0' + curr_date;
    }
    if (curr_month.toString().length === 1) {
        curr_month = '0' + curr_month;
    }
    var Date1 = curr_month + '/' + curr_date + '/' + curr_year;
    $('#txtEnvelopeDate').val(Date1);

    var strBatch = $('#spnBatchNumber').text();
    $('#txtBatchNumberPC').val(strBatch);
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 });
    retriveSegment = $.parseJSON(localStorage.ArrSegment);
    retriveTransaction = $.parseJSON(localStorage.ArrTransaction);
    G_OBJAPPC_ENVELOPE.funCreateThead();
    FillCustodian();
    FillRecipient();
    FillVendor(); // Required to support legacy hidden fields for VendorID

    if (window.location.hash === '#AddNew') {
        FillValue();
        funShowDiv('New');
        AtlasDocument.BindCurrency('');
    }

    GetTaxCodeList();
    AtlasUtilities.init();

    AtlasPaste.Config.StaticColumns(["DESCRIPTION", "AMOUNT", "VENDOR", "TAXCODE"]);
    AtlasPaste.Config.PastetoTable(G_OBJAPPC_ENVELOPE.CreateCustodianRow);
    AtlasPaste.Config.DestinationTable('TblPCLineTBody');
    AtlasPaste.Config.DisplayOffset({ top: 140, left: -100 });
    AtlasPaste.Config.Clearcallback(PasteClear);
    AtlasPaste.Config.AfterPastecallback(SetFocusAfterPaste);

    AtlasCache.CacheORajax({
        'URL': AtlasCache.APIURLs.AtlasConfig_TransactionCodes
        , 'doneFunction': function (response) { 
            TCodes = response.resultJSON;
            TcodesFound = true;
        }
        , bustcache: true
        , callParameters: { callPayload: JSON.stringify({ ProdID: localStorage.ProdId }) }
        , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        , 'cachebyname': 'Config.TransactionCodes'
    });

    $('.divDocumentForm').change(function () {
        formmodified = 1;
        window.onbeforeunload = confirmExit;
    });

    function confirmExit() {
        if (formmodified == 1) {
            return "You are about to cancel your form. All your data will be lost. Are you sure you want to do this?";
        }
    }
    document.title = 'Petty Cash';

    let waitvar = [];
    waitvar.push(
    AtlasCache.CacheORajax({
        'URL': AtlasCache.APIURLs.AtlasCache_VendorList + '?SortBy=' + 'All' + '&ProdID=' + localStorage.ProdId
        , 'doneFunction': undefined
        , 'objFunctionParameters': {
        }
        , 'cachebyname': 'Vendor List'
        , bustcache: true
    }))
    ;

    // Posted Collection requirement
    G_BuildSegmentOrder();
    G_AtlasConfig.ConfigGet('Settings.Currencies.Rates', (configRates) => {
        let RatesJSON = JSON.parse(configRates.ConfigJSON);
        G_BASE_CURRENCY = RatesJSON.BASE;
    })
    // Posted Collection
})

function SetFocusAfterPaste() {
    GetAmountCalculation();
    resizeTable();

    let i = $(`#${AtlasPaste.Config.DestinationTable()} tr`).length;
    $(`#txt_${i}_1`).select();
}

function PasteClear() {
    $(`#${AtlasPaste.Config.DestinationTable()}`).find('tr').not('.ATID4').each((i,e) => {
        funJEDeleteRow(e.id);
        $(this).remove();
    });
    //$(`#${AtlasPaste.Config.DestinationTable()}`).find('tr').not('.ATID4').remove();
}

$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});

//===================================== List
function GetPCenvelopsList() {
    $.ajax({
        url: APIUrlGetPCenvelopsList + '?ProdId=' + localStorage.ProdId + '&Status=' + 'Pending',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPCenvelopsListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetPCenvelopsListSucess(response) {
    if (DTCount !== 0) {
        $($('#tblPC thead tr')[1]).appendTo($('#tblPC tfoot'))
        DT_tblList.destroy();
    }

    var strhtml = '';
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            strhtml += '<tr id="' + response[i].PcEnvelopeID + '" >';
            //strhtml += '<td></td>';
            strhtml += '<td><input type="checkbox" class="clsCheck" id="chk_' + response[i].PcEnvelopeID + '" name="' + response[i].PcEnvelopeID + '"></td>';
            strhtml += '<td>' + response[i].Status + '</td>';
            strhtml += '<td>' + response[i].CompanyCode + '</td>';
            strhtml += '<td><a href="#" style="color: #337ab7;" onclick=funEditPC(' + response[i].PcEnvelopeID + ');>' + response[i].EnvelopeNumber + '</a></td>';
            strhtml += '<td>' + response[i].CreatedDate + '</td>';
            strhtml += '<td>' + response[i].TransactionNumber + '</td>';
            strhtml += '<td>' + response[i].VendorName + '</td>';
            strhtml += '<td>' + parseFloat(response[i].AdvanceAmount).toFixed(2) + '</td>';
            strhtml += '<td>' + parseFloat(response[i].EnvelopeAmount).toFixed(2) + '</td>';
            strhtml += '<td>' + response[i].CurrencyDocument + '</td>';
            strhtml += '</tr>';
        }
    } else {
        strhtml += '<tr><td style="text-align:center;" colspan=9>No Records Found...</td></tr>';
    }
    $('#TblPCTBody').html(strhtml);

    DT_tblList = $('#tblPC').DataTable({
        "dom": 'C<"clear"><Rrt<"positionFixed"pli>>',
        //"iDisplayLength": showpg,
        paging: false,
        //responsive: {
        //    details: {
        //        //  type: 'column',
        //    }
        //},
        //columnDefs: [{
        //    className: 'control',
        //    orderable: false,
        //    targets: 0,

        //}],
        order: [1, 'asc']
    });
    if (DTCount === 0) {
        $('#tblPC tfoot th').each(function () {
            var title = $('#tblPC thead th').eq($(this).index()).text();
            $(this).html('<input type="text" style="width:100%;" placeholder=" ' + title + '" />');
        });

        // Apply the search
        DT_tblList.columns().eq(0).each(function (colIdx) {
            $('input', DT_tblList.column(colIdx).footer()).on('keyup change', function () {
                DT_tblList
                    .column(colIdx)
                    .search(this.value)
                    .draw();
            });
            //$('select', DT_tblList.column(colIdx).footer()).on('keyup change', function () {
            //    DT_tblList
            //        .column(colIdx)
            //        .search(this.value)
            //        .draw();
            //});
        });
    }
    DTCount++;
    $('#tblPC tfoot tr').insertAfter($('#tblPC thead tr'));

    $('#tblPC').parent().css('overflow', 'scroll');
    $('#tblPC').parent().css('max-height', ($(window).height() - 180) + 'px');
    $('#tblPC').parent().css('min-height', ($(window).height() - 180) + 'px');
    $('#tblPC').parent().css('height', ($(window).height() - 180) + 'px');
    $('#tblPC tr').click(function () {
        strPublicTR = $(this).closest('tr').attr('id');
        strPublicParentId = $('#' + strPublicTR).val();
        $('#TblPCTBody tr').removeClass('blueColor');
        $('#' + strPublicTR).addClass('blueColor');
        StrEnvelopId = strPublicTR;
    })

}

//====================================== Fill Company
function FillCompany() {
    $.ajax({
        url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        async: true,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillCompanySucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillCompanySucess(response) {
    ArrCompany = response;
    if (ArrCompany.length == 1) {
        $('#txtCompany').val(ArrCompany[0].CompanyCode);
        $('#hdnCompany').val(ArrCompany[0].CompanyID);
        $('#ddlCompany').val(ArrCompany[0].CompanyID);
        funGetClosePeriodDetail();
    }

    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CompanyID,
            label: m.CompanyCode
        };
    })
    $(".SearchCompany").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            //$('#txtCompany').val(ui.item.label);
            //$('#hdnCompany').val(ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $('#txtCompany').val(ui.item.label);
            $('#hdnCompany').val(ui.item.value);
            $('#ddlCompany').val(ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}

//====================================== Fill Custodian
function FillCustodian() {
    $.ajax({
        url: APIUrlFillCustodian + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: true,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillCustodianSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillCustodianSucess(response) {
    G_OBJAPPC_CUSTODIAN.FULL_CUSTODIAN_LIST = response;
    console.log(G_OBJAPPC_CUSTODIAN.FULL_CUSTODIAN_LIST)

    if (response.length === 1) {
        $('#txtCustodian').val(response[0].CustodianCode);
        $('#txtCustodian').attr('name', response[0].CustodianID);
    } else {
        var ProductListjson = response;
        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.CustodianID,
                label: m.CustodianCode
            };
        })

        $(".SearchCustodian").autocomplete({
            minLength: 1,
            source: array,
            autoFocus: true,
            focus: function (event, ui) {
                if (event.which !== 9) {
                    event.preventDefault();
                }
                //$('#txtCustodian').val(ui.item.label);
                //$('#txtCustodian').attr('name', ui.item.value);
                return false;
            },
            select: function (event, ui) {
                $('#txtCustodian').val(ui.item.label);
                $('#txtCustodian').attr('name', ui.item.value);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                    $('txtCustodian').removeAttr('name');
                }
            }
        })
    }
    ArrCustodian = response; // Always set the global variable to the response 
}

function funGetCustodianCoa() {
    //============================================================= auto complete
    var StrCheckVendorName = $('#txtCustodian').val().trim();
    var strStatus = 0;

    if (StrCheckVendorName !== '') {
        for (let i = 0; i < ArrCustodian.length; i++) {
            if (ArrCustodian[i].CustodianCode === StrCheckVendorName) {
                G_OBJAPPC_CUSTODIAN.setCustodian(ArrCustodian[i]);
                $('#hdnCustodianCoaId').val(ArrCustodian[i].COAID);
                $('#hdnCustodianCoaCode').val(ArrCustodian[i].COACode);
                $('#txtCustodian').val(ArrCustodian[i].CustodianCode);
                $('#txtCustodian').attr('name', ArrCustodian[i].CustodianID);
                strStatus++;
            }
        }
    } else {
        return;
    }

    if (strStatus == 0) {
        for (let i = 0; i < ArrCustodian.length; i++) {
            if (ArrCustodian[i].CustodianCode.substring(0, StrCheckVendorName.length).toUpperCase() === StrCheckVendorName.toUpperCase()) {
                $('#txtCustodian').val(ArrCustodian[i].CustodianCode);
                $('#txtCustodian').attr('name', ArrCustodian[i].CustodianID);
                $('#hdnCustodianCoaId').val(ArrCustodian[i].COAID);
                $('#hdnCustodianCoaCode').val(ArrCustodian[i].COACode);
                break;
            }
        }
    }

    //==================================================
    if ($('#txtCustodian').attr('name') !== '') {
        var strCustodianID = $('#txtCustodian').attr('name');
        for (var i = 0; i < ArrCustodian.length; i++) {
            if (ArrCustodian[i].CustodianID == strCustodianID) {
                $('#hdnCustodianCoaId').val(ArrCustodian[i].COAID);
                $('#hdnCustodianCoaCode').val(ArrCustodian[i].COACode);
                G_OBJAPPC_CUSTODIAN.setCustodian(ArrCustodian[i]);

                break;
            }
        }
        //=================================== Change Account Code
        var StrTr = $('.clsTr');
        for (var j = 0; j < StrTr.length; j++) {
            var strId = StrTr[j].id;
            if ($('#SpanDisId_' + strId).val() == '1') {
                var StrCustId = $('#hdnCustodianCoaId').val();
                var StrCustCoaCode = $('#hdnCustodianCoaCode').val();
                var strSplit = StrCustCoaCode.split('|');
                for (var i = 0; i < retriveSegment.length; i++) {
                    if (retriveSegment[i].SegmentName != 'DT') {
                        $('#txt_' + strId + '_' + i).val(strSplit[i]);
                    } else {
                        var DTsplit = strSplit[i].split('>');
                        var strval = DTsplit[DTsplit.length - 1];
                        $('#txt_' + strId + '_' + i).val(strval);
                    }
                }
                $('#hdnCode_' + strId).val(StrCustCoaCode);
                $('#hdnLineId_' + strId).val(StrCustId);

                break;
            }
        }
    }
}

function FillRecipientCoaStringInTr() {
    //======================================================= auto complete
    var StrCheckVendorName = $('#txtRecipient').val().trim();
    var strStatus = 0;

    if (StrCheckVendorName != '') {
        for (var i = 0; i < ArrRecipient.length; i++) {
            if (ArrRecipient[i].VendorName == StrCheckVendorName) {
                $('#txtRecipient').val(ArrRecipient[i].VendorName);
                $('#txtRecipient').attr('name', ArrRecipient[i].RecipientID);
                $('#hdnRecipientId').val(ArrRecipient[i].RecipientID);
                $('#hdnRecipientCode').val(ArrRecipient[i].CoaString);
                $('#hdnRecipientCAId').val(ArrRecipient[i].CoaID);
                $('#lblBillingAddress1').html(ArrRecipient[i].Addressw9);
                $('#lblBillingAddress2').html(ArrRecipient[i].Address2w9);
                G_OBJAPPC_RECIPIENT.setRecipient(ArrRecipient[i]);
                strStatus++;

                break;
            }
        }
    } else {
        $('#lblBillingAddress1').html('');
        $('#lblBillingAddress2').html('');

        return;
    }

    if (strStatus == 0) {
        for (var i = 0; i < ArrRecipient.length; i++) {
            if (ArrRecipient[i].VendorName.substring(0, StrCheckVendorName.length).toUpperCase() == StrCheckVendorName.toUpperCase()) {
                $('#txtRecipient').val(ArrRecipient[i].VendorName);
                $('#txtRecipient').attr('name', ArrRecipient[i].RecipientID);
                $('#hdnRecipientId').val(ArrRecipient[i].RecipientID);
                $('#hdnRecipientCode').val(ArrRecipient[i].CoaString);
                $('#hdnRecipientCAId').val(ArrRecipient[i].CoaID);
                $('#lblBillingAddress1').html(ArrRecipient[i].Addressw9);
                $('#lblBillingAddress2').html(ArrRecipient[i].Address2w9);
                strStatus++;

                break;
            }
        }
    }

    //=======================================================
    var StrTr = $('.clsTr');
    var strCustCount = 0;
    for (var j = 0; j < StrTr.length; j++) {
        var strId = StrTr[j].id;
        if ($('#SpanDisId_' + strId).val() == '1') {
            strCustCount++;
            if (strCustCount == 1) {
            } else {
                var StrCustId = $('#hdnRecipientCAId').val();
                var StrCustCoaCode = $('#hdnRecipientCode').val();
                var strSplit = StrCustCoaCode.split('|');

                for (var i = 0; i < retriveSegment.length; i++) {
                    if (retriveSegment[i].SegmentName != 'DT') {
                        $('#txt_' + strId + '_' + i).val(strSplit[i]);
                    } else {
                        var DTsplit = strSplit[i].split('>');
                        var strval = DTsplit[DTsplit.length - 1];
                        $('#txt_' + strId + '_' + i).val(strval);
                    }
                }

                $('#hdnCode_' + strId).val(StrCustCoaCode);
                $('#hdnLineId_' + strId).val(StrCustId);
            }
        } else if ($('#SpanDisId_' + strId).val() == '2') {
            var StrCustId = $('#hdnRecipientCAId').val();
            var StrCustCoaCode = $('#hdnRecipientCode').val();
            var strSplit = StrCustCoaCode.split('|');

            for (var i = 0; i < retriveSegment.length; i++) {
                if (retriveSegment[i].SegmentName != 'DT') {
                    $('#txt_' + strId + '_' + i).val(strSplit[i]);
                } else {
                    var DTsplit = strSplit[i].split('>');
                    var strval = DTsplit[DTsplit.length - 1];
                    $('#txt_' + strId + '_' + i).val(strval);
                }
            }

            $('#hdnCode_' + strId).val(StrCustCoaCode);
            $('#hdnLineId_' + strId).val(StrCustId);
        }
    }
}

//====================================== Fill Recipent
function FillRecipient() {
    $.ajax({
        url: APIUrlFillRecipient + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillRecipientSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillRecipientSucess(response) {
    ArrRecipient = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
            CAId: m.CoaID,
            AccountCode: m.CoaString,
            RecipientID: m.RecipientID,
            Addressw9: m.Addressw9,
            Address2w9: m.Address2w9
        };
    })
    $(".SearchRecipient").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            return false;
        },
        select: function (event, ui) {
            $('#txtRecipient').val(ui.item.label);
            $('#txtRecipient').attr('name', ui.item.value);
            $('#hdnRecipientId').val(ui.item.RecipientID);
            $('#hdnRecipientCode').val(ui.item.AccountCode);
            $('#hdnRecipientCAId').val(ui.item.CAId);
            $('#lblBillingAddress1').html(ui.item.Addressw9);
            $('#lblBillingAddress2').html(ui.item.Address2w9);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $('txtRecipient').removeAttr('name');
            }
        }
    })
}

//====================================== Close
function funGetClosePeriodDetail() {
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(strClosePeriodId));
    return;
}

function GetClosePeriodDetailSucess(response) {
    $('#ddlClosePeriod').empty();
    for (var i = 0; i < response.length; i++) {
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
}

//====================================== Row Creation
function GetMaxId() {
    var arrIds = [];
    if ($("#TblPCLineTBody tr").length > 0) {
        $("#TblPCLineTBody tr").each(function () {
            arrIds.push(this.id);
        });
        return Math.max.apply(null, arrIds)
    }
    return 0;
}

function funDescriptionblur(value) {
    if ($('#txtDescription_' + value).val() == '') {
        $('#txtDescription_' + value).attr('style', 'border-color:red !important;');
    } else {
        $('#txtDescription_' + value).attr('style', 'border-color:#d2d6de;');
    }
}

function funAmountblur(value) {
    if ($('#txtAmount_' + value).val() == '') {
        $('#txtAmount_' + value).attr('style', 'border-color:red !important;');
    } else {
        $('#txtAmount_' + value).attr('style', 'border-color:#d2d6de;');
    }
}

function funJEDeleteRow(value) {
    var strVal = $('#hdnLineId_' + value).val();
    $('#TblPCLine tr#' + value).remove();
    if ($.inArray(strVal, oDeletedIds) == -1) { oDeletedIds.push(strVal); }
    GetAmountCalculation();
    $('#txt_' + GetMaxId() + '_1').select();

}

//======================================= Check Duplicacy
function CheckPCEnvelopeNumber() {
    var obj = {
        EnvelopeNumber: $('#txtEnvelopeNumber').val().trim(),
        PcEnvelopeID: G_OBJAPPC_ENVELOPE.PCEnvelopeID,
        Prodid: localStorage.ProdId
    }

    $.ajax({
        url: APIUrlCheckPCEnvelopeNumberDuplicacy,// + '?EnvelopeNumber=' + $('#txtEnvelopeNumber').val() + '&PcEnvelopeID=' + 0 + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       CheckPCEnvelopeNumberSucess(response);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
}

function CheckPCEnvelopeNumberSucess(response) {
    if (response == 1) {
        $('#txtEnvelopeNumber').focus();
        $('#txtEnvelopeNumber').select();
        ShowMsgBox('showMSG', 'The envelope # entered is already in use. You must specify another envelope #', '', '');
    }
}

$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        if ($('#tabAddPO:visible').length == 0) {
            funShowDiv('New');
            document.title = 'New PC Envelope';
        } else {
            G_OBJAPPC_ENVELOPE.CreateCustodianRow(-1);
        }
    }

    if (event.altKey === true && key === 83) {
        if ($('#DvAdd').css('display') == 'block') {
            try {
                $(document.activeElement).blur();
            } catch (e) {}
            SavePCDetail();
        }
    }
});

$('#txtAdvanceAmount').blur(function () {
    var strCheck = 0;
    //====================================================== AMT change 
    $('#txtAdvanceAmount').val(numeral($('#txtAdvanceAmount').val()).format('0,0.00'));
    var AdvanceAmt = $('#txtAdvanceAmount').val();
    var strCheckCustodian = 0;
    var strclsDisplay = $('.clsDisplay');

    for (var i = 0; i < strclsDisplay.length; i++) {
        var Id = strclsDisplay[i].id;
        if ($('#' + Id).val() == '1') {
            AdvanceAmt // - minus
            var strId = Id.split('_');

            if (strCheckCustodian == 0) {
                var MinusAmt = (AdvanceAmt).replace(/,/g, '');
                MinusAmt = MinusAmt - (MinusAmt * 2);
                $('#txtAmount_' + strId[1]).val(numeral(MinusAmt).format('0,0.00'));
                strCheckCustodian++;
            } else if (strCheckCustodian == 1) {
                var PulseAmt = (AdvanceAmt).replace(/,/g, '');
                $('#txtAmount_' + strId[1]).val(numeral(PulseAmt).format('0,0.00'));
            }
        }
    }

    if (strCheckCustodian > 0) { return; }
    //====================================================== AMT change 
    if ($('#txtCompany').val() == '') {
        strCheck++;
        $('#txtCompany').attr('style', 'border-color: red;');
    }

    if ($('#txtCustodian').val() == '') {
        strCheck++;
        $('#txtCustodian').attr('style', 'border-color: red;');
    }

    if ($('#txtRecipient').val() == '') {
        strCheck++;
        $('#txtRecipient').attr('style', 'border-color: red;');

    }

    AdvanceAmt = (AdvanceAmt == '' ? AdvanceAmt = 0 : AdvanceAmt = AdvanceAmt);
    if (strCheck == 0) {
        if (parseFloat(AdvanceAmt) > 0) {
            funFillCustodian();
        }
        //AddRowInTable();
        $('#txtEnvelopeAmount').select();
    }
});

function CheckEnvelopeAmt() {
    if ($('#txtEnvelopeAmount').val() == '' || $('#txtEnvelopeAmount').val() == 0) {
    } else {
        G_OBJAPPC_ENVELOPE.CreateCustodianRow(0);
    }
}

$('#txtDescription').blur(function () {
    var strDescription = $('#txtDescription').val();
    let strOldDescription = $('#txtDescription').data("original_value");
    if (strOldDescription === undefined && strDescription !== '') {
        $('#txtDescription').data("original_value", $('#txtDescription').val());
    }

    $('.clsDescription').each(function () {
        if (this.value === strOldDescription) {
            this.value = strDescription;
        }
    });
})

$('#txtEnvelopeAmount').blur(function () {
    //====================================================== AMT change 
    var EnvelopeAmt = $('#txtEnvelopeAmount').val();
    var strCheckRecipient = 0;
    var strEnvelopeTrCount = 0;
    var strclsDisplay = $('.clsDisplay');

    for (var i = 0; i < strclsDisplay.length; i++) {
        var Id = strclsDisplay[i].id;
        if ($('#' + Id).val() == '2') {
            strEnvelopeTrCount++;
            var strId = Id.split('_');
            if (strCheckRecipient == 0) {
                var MinusAmt = (EnvelopeAmt).replace(/,/g, '');
                MinusAmt = MinusAmt - (MinusAmt * 2);
                $('#txtAmount_' + strId[1]).val(MinusAmt);
            }
        }
    }

    if (strCheckRecipient > 0) {
        GetAmountCalculation();
        return;
    }

    //====================================================== AMT change 
    var CheckEntry = $('#txtEnvelopeAmount').val();

    if (strEnvelopeTrCount == 0) {
        // AddRowInTableFor1Entry();
        EnvelopeAmt = (EnvelopeAmt == '' ? EnvelopeAmt = 0 : EnvelopeAmt = EnvelopeAmt);
        if (parseFloat(EnvelopeAmt) > 0) {
            funRecipientFill();
        }
    } else {
    }

    GetAmountCalculation();
    SetFocusAfterPaste();
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 });
})

//====================================== Pop up
function funAction(value) {
    if (value == 'Cancel') {
        $('#DivIDcancel').show();
        $('#fade').show();
    } else if (value == 'Delete') {
        $('#DivDelete').show();
        $('#fade').show();
    }
}

//====================================== Save Pc
function SavePCDetail() {
    formmodified = 0
    AtlasUtilities.ShowLoadingAnimation();

    var isvalid = "";
    var strClass = $('.detectTab');
    for (var i = 0; i < strClass.length; i++) {
        var strId = strClass[i].id;
        var strvalue = strClass[i].value;
        if (strvalue == '') {
            $('#' + strId).attr('style', 'border-color: red;');
            isvalid = isvalid + 1;
        }
    }

    if (isvalid === '') {
        var strDAmount = parseFloat($('#txtDifference').val());
        if (strDAmount == 0.00) {
            G_OBJAPPC_ENVELOPE.SavePC();
        } else {
            if ($('#txtEnvelopeAmount').val() !=='' || $('#TblPCLine tr').length < 2) {
                AtlasUtilities.HideLoadingAnimation();
                $('#CantSave').show();
                setTimeout(function() {
                    $('#btnCantSaveOK').focus();
                }, 300);
                $('#fade').show();
            } else {
                G_OBJAPPC_ENVELOPE.SavePC();
            }
        }
    } else {
        AtlasUtilities.HideLoadingAnimation();
        $('#PCEnvelope_MissingInformation').show();
        setTimeout(function() {
            $('#btnMissingInformationOK').focus();
        }, 300);
        $('#fade').show();
    }
}

function funDeleteAllRemoved() {
    for (var i = 0; i < oDeletedIds.length; i++) {
        funDeletePCDetail('PCEnvelopeLineId', oDeletedIds[i]);
    }

    oDeletedIds = [];
}


function funSuccessOk() {
    // location.reload(true);
    FillCompany();
    FillCustodian();
    FillRecipient();
    $('#DvSuccess').hide();
    $('#fade').hide();
    $('#txtCompany').val('');
    $('#txtCustodian').val('');
    $('#txtRecipient').val('');
    $('#txtEnvelopeNumber').val('');
    $('#txtDescription').val('');
    $('#txtAdvanceAmount').val('');
    $('#txtEnvelopeAmount').val('');
    $('#txtLineItemAmount').val('');
    $('#txtDifference').val('');
    $('#TblPCLineTBody').html('');
    $('#SpnTransactionNobreadcrumb').text('');
    strAdAmountCount = 0;
    strEnvelopCount = 0;
    StrEnvelopId = 0;
    funShowDiv('New');
}

$('#TblPCLineTBody').delegate('.clsDescription', 'keydown', function (event) {
    var strRowcount = $('#tblManualEntryTBody tr:last').attr('id');
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtDescription_' + stval).length > 0) {
            $('#txtDescription_' + stval).focus();
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtDescription_' + stval).length > 0) {
            $('#txtDescription_' + stval).focus();
        }
    }
})

$('#TblPCLineTBody').delegate('.clsAmount', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtAmount_' + stval).length > 0) {
            $('#txtAmount_' + stval).select();
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtAmount_' + stval).length > 0) {
            $('#txtAmount_' + stval).select();
        }
    }
    GetAmountCalculation();
})

//====================calculation Amount================//
$(document).on('onchange', ".clsAmount", function () {
    GetAmountCalculation();
});

//=======================================================================================//  GetAmountCalculation
function GetAmountCalculation() {
    var sclsAmount = $('.clsAmount');
    var sclsDisplay = $('.clsDisplay');
    var total = 0;

    for (var i = 0; i < sclsAmount.length; i++) {
        let amt = numeral(sclsAmount[i].value).value();
        var DisplayStatus = sclsDisplay[i].value;
        //        console.log(DisplayStatus);
        if (DisplayStatus == '' || DisplayStatus == '0') {
            //amt = (amt == '') ? 0 : amt;
            //if (amt != 0) {
            //    amt = parseFloat(amt.replace(/,/g, ''));
            //}
            total = parseFloat(total + amt);
        }
    }

    total = total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    $('#txtLineItemAmount').val(total);

    var totalDiff = 0;
    for (var i = 0; i < sclsAmount.length; i++) {
        let amt = numeral(sclsAmount[i].value).value();
        var DisplayStatus = sclsDisplay[i].value;
        //        console.log(DisplayStatus);
        amt = (amt == '') ? 0 : amt;
        //if (amt != 0) {
        //    amt = parseFloat(amt.replace(/,/g, ''));
        //}
        totalDiff = parseFloat(totalDiff + amt);

    }

    totalDiff = totalDiff.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    $('#txtDifference').val(totalDiff);
    //$('.w2ui-field').w2field('float', { min: 0 });
}
//========================================================= Segment Code
function funSegment(values, SegmentName, SegmentP) {
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
    //txt_0_Company
    $.ajax({
        url: APIUrlGetCOA + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funSegmentSucess(response, values, SegmentP);
    })
    .fail(function (error) {
        console.log(error);
    })
}

function funSegmentSucess(response, values, SegmentP) {
    // $('#txt_' + values + '_' + SegmentP).prop("disabled", false);
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
        minLength: 1,
        source: array,
        autoFocus: true,
        position: { 'collision': 'flipfit' },
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);
            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCoaId_' + values).val(ui.item.COAId);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).removeAttr('COACode');
                $(this).removeAttr('COAId');
            }
        }
    })
}

//========================================================= Transaction Code
function funTransDetail(values, TransId, Name) {
    $('#txt_' + Name + '_' + values).removeClass('SearchCodeTransaction');
    $.ajax({
        url: APIUrlTranscationCode + '?TransactionCodeID=' + TransId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       GlbTransList = response;
       TransDetailSucess(response, values, Name);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
}

function TransDetailSucess(response, values, Name) {
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
            //  BuyerId: m.BuyerId,
        };
    });

    $('#txt_' + Name + '_' + values).addClass('SearchCodeTransaction');
    $(".SearchCodeTransaction").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        position: { 'collision': 'flipfit' },
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            //    $(this).attr('TransValueId', ui.item.value);
            //    $(this).val(ui.item.label);
            //    return false;
        },
        select: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {

            if (!ui.item) {
                var isExist = IsExistItem(response, $(this).val(), "TransValue");
                if (isExist == false)
                {
                    $(this).val('');
                    $(this).removeAttr('TransValueId');
                }
            }
        }
    })
}

//========================================================= Optional SET/Series
function GetOptional(values, SegmentName, SegmentP) {
    $('#txtOptional_' + values + '_' + SegmentP).removeClass('SearchOptionalCode');
    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + SegmentName,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetOptionalSucess(response, values, SegmentP);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetOptionalSucess(response, values, SegmentP) {
    GblOptionalCOA = [];
    GblOptionalCOA = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.AccountCode,
            value: m.AccountID,

        };
    });

    $('#txtOptional_' + values + '_' + SegmentP).addClass('SearchOptionalCode');
    $(".SearchOptionalCode").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        position: { 'collision': 'flipfit' },
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            //$(this).val(ui.item.label);
            //$(this).attr('AccountID', ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('AccountID', ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {

                var isExist = IsExistItem(response, $(this).val(), "AccountCode");
                if (isExist == false) {
                    $(this).val('');
                    $(this).removeAttr('AccountID');
                }
               
            }
        }
    })
}

function funCheckOptionalAutoFill(value, segmentName, valueN) {
    var strval = $('#txtOptional_' + value + '_' + valueN).val();

    if (strval != '') {
        for (var i = 0; i < GblOptionalCOA.length; i++) {
            if (GblOptionalCOA[i].AccountCode.match(strval)) {
                //if (strval == GblOptionalCOA[i].AccountCode) {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[i].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[i].AccountID);

                break;
            } else {
            }
        }
    } else {
    }

    $('#txtOptional_' + value + '_' + valueN).removeClass('SearchOptionalCode');
}

//=========================================================== Detail
function PCEnvelopDetail() {
    if (StrEnvelopId == 0) {
        ShowMsgBox('showMSG', 'Please select the Row ..!!!', '', '');
    } else {
        GetPCEnvelopDetail();
    }
}

function GetPCEnvelopDetail() {
    //$('#PCNew').addClass('active');
    $('#PCView').removeClass('active');
    $('#DvAdd').show();
    $('#DvView').hide();
    $('#DvViewIcon').hide();
    $('#DvPCSaveIcon').show();

    $.ajax({
        url: APIUrlGetPCEnvelopDetail + '?PcEnvelopeId=' + StrEnvelopId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: true,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPCEnvelopDetailSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetPCEnvelopDetailSucess(response) {
    if (response.length > 0) {
        BatchManager.ForceBatch(response[0].BatchNumber);
        AtlasDocument.BindCurrency(response[0].CurrencyDocument);
        $('#APPCEnvelopeAddNew').click(AddNew_click_onenvelope);

        StrEnvelopId = response[0].PcEnvelopeID;
        $('#txtCompany').val(response[0].CompanyCode);
        $('#txtCompany').prop('disabled', true);

        $('#txtBatchNumberPC').val(response[0].BatchNumber);
        $('#txtCustodian').val(response[0].CustodianCode);
        $('#txtCustodian').attr('name', response[0].CustodianId);
        $('#hdnCustodianCoaId').val(response[0].CustodianCoaId);
        $('#hdnCustodianCoaCode').val(response[0].CustodianCoaString);
        $('#txtRecipient').val(response[0].VendorName);
        $('#hdnRecipientId').val(response[0].RecipientId);
        $('#hdnRecipientCode').val(response[0].RecipientCoaString);
        $('#hdnRecipientCAId').val(response[0].RecipientCoaId);
        $('#txtEnvelopeNumber').val(response[0].EnvelopeNumber);
        $('#txtEnvelopeDate').val(response[0].CreatedDate);
        $('#txtDescription').val(response[0].Description);
        $('#txtDescription').data('original_value', response[0].Description);
        $('#txtAdvanceAmount').val(response[0].AdvanceAmount);
        $('#txtEnvelopeAmount').val(response[0].EnvelopeAmount);
        $('#txtLineItemAmount').val(response[0].LineItemAmount);
        $('#txtDifference').val(parseFloat(response[0].Difference).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#lblBillingAddress1').html(response[0].Addressw9);
        $('#lblBillingAddress2').html(response[0].Address2w9);

        $('#hdnCompany').val(response[0].Companyid);
        $('#ddlCompany').val(response[0].Companyid);
        $('#ddlClosePeriod option[value=' + response[0].ClosePeriodId + ']').prop('selected', true);
        sEnvelopeStatus = response[0].Status
        $('#SpnTransactionNobreadcrumb').text('Transaction # (' + response[0].TransactionNumber + ')');
        strClosePeriodId = response[0].ClosePeriodId;

        AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(strClosePeriodId));

        GetPCEnvelopLineDetail();
    }
}

function GetPCEnvelopLineDetail() {
    $.ajax({
        url: APIUrlGetPCEnvelopLineDetail + '?PcEnvelopeId=' + StrEnvelopId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: true,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        console.log(Date.now());
        GetPCEnvelopLineDetailSucess(response);
        AtlasUtilities.HideLoadingAnimation();
        console.log(Date.now());
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetPCEnvelopLineDetailSucess(response) {
    G_OBJAPPC_ENVELOPE.funCreateThead();
    $('#TblPCLineTBody').html('');
    let A = 1; // Required for legacy code

    strCompany = $('#txtCompany').val();

    response.forEach((line) => {
        let objData = Object.assign({}, AtlasUtilities.SEGMENTS_CONFIG._COA._COACode[line.CoaString]);
        if (line.TransactionCodeString !== '') {
            let TString = line.TransactionCodeString.split(','); // Split the TransactionString
            TString.reduce(function(acc, cur) { 
                let [TC,TV] = cur.split(':'); 
                let TCV = TCodes.find(function(item) { 
                    return item.Details.TCID == TC;
                });
            
                let TVID = TCV.TV.find(function(tv){ 
                    return tv.TVID == TV; 
                });

                acc[TCV.TransCode] = TVID.TransValue;
                return acc;
                //TCodes.find(function (TC) { return TC.Details.TCID ===  }).TV.find(function (TV) { return TV.TVID === 1 })
            }, objData);
        }

        if (line.Setid){
            objData['Set'] = AtlasUtilities.SEGMENTS_CONFIG.sequence[3].Accounts.filter(e => { return e.AccountID === line.Setid})[0].AccountCode; //line.Setid;
        }
        objData.AMOUNT = line.Amount;
        objData.VENDOR = line.VendorName;
        objData.TAXCODE = line.TaxCode;
        objData.DESCRIPTION = line.LineDescription;
        objData.EnvelopeLineID = line.EnvelopeLineID;
        objData.AccountTypeId = line.AccountTypeId;
        objData.Displayflag = line.Displayflag;
        objData.PCEnvelopeID = line.PCEnvelopeID;
        objData.DT = line.Acct;

        G_OBJAPPC_ENVELOPE.CreateCustodianRow(objData, 'existing', line.EnvelopeLineID);

        // Legacy code
        let strsplit = line.CoaString.split('|');
        let strCOAPval = '';
        for (var j = 0; j < retriveSegment.length; j++) {
            if (retriveSegment[j].Type == 'SegmentRequired') {
                if (j == 0) { strCOAPval = strsplit[0]; }
                else if (j == 1) { strCOAPval = strsplit[0] + '|' + strsplit[1]; }
                else if (j == 2) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2]; }
                else if (j == 3) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3]; }
                else if (j == 4) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4]; }
                else if (j == 5) {
                    strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4] + '|' + strsplit[5];
                }

                try {
                    if (retriveSegment[j].SegmentName == 'DT') {
                        var stsplit = strsplit[j].split('>');
                        var strlength = stsplit.length;
                        strlength = strlength - 1;
                        $('#txt_' + A + '_' + j).attr('coacode', strCOAPval);
                        $('#txt_' + A + '_' + j).val(stsplit[strlength]);
                    } else {
                        $('#txt_' + A + '_' + j).attr('coacode', strCOAPval);
                        $('#txt_' + A + '_' + j).val(strsplit[j]);
                    }
                } catch (e) {}// do nothing on legacy code error because COAID is being created during save using Framework lib
            }
        }

        $('#txtOptional_' + A + '_0').attr('accountid', line.Setid);
        $('#txtOptional_' + A + '_0').val(line.setAccountCode);

        $('#txtOptional_' + A + '_1').attr('accountid', line.SeriesID);
        $('#txtOptional_' + A + '_1').val(line.SeriesAccountCode);

        var strvCOATransaction = line.TransactionvalueString;
        var trastr = strvCOATransaction.split(',');
        for (var k = 0; k < trastr.length; k++) {
            var TraVal = trastr[k];
            var trastr1 = TraVal.split(':');
            $('#txt_' + trastr1[0] + '_' + A).val(trastr1[1]);
            $('#txt_' + trastr1[0] + '_' + A).attr('transvalueid', trastr1[2]);
        }

        $('#txtVendorName_' + A).attr('vendorid', line.VendorID);

        $('#hdnCoaId_' + A).val(line.COAID);
        $('#hdnCode_' + A).val(line.CoaString);
        $('#hdnLineId_' + A).val(line.EnvelopeLineID);
        $('#SpanDisId_' + A).val(line.Displayflag);

        if (line.AccountTypeId == 4) {
            $('#spn_' + A).hide();
            for (var z = 0; z < retriveSegment.length; z++) {
                if (retriveSegment[z].Type == 'SegmentRequired') {
                    $('#txt_' + A + '_' + z).prop('disabled', true);
                }
            }

            $('#txtOptional_' + A + '_0').prop('disabled', true);
            $('#txtOptional_' + A + '_1').prop('disabled', true);
            for (var z = 0; z < retriveTransaction.length; z++) {
                $('#txt_' + retriveTransaction[z].TransCode + '_' + A).prop('disabled', true);
            }

            $('#txtAmount_' + A).prop('disabled', true);
            $('#txtDescription_' + A).prop('disabled', false);
            $('#txtVendorName_' + A).removeClass('detectTab');
            $('#txtVendorName_' + A).prop('disabled', false);
            $('#chkThirdParty_' + A).prop('disabled', true);
        }

        A++;
        //End Legacy code
    });

    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 });
    resizeTable();

    setTimeout(function () {
        if (!G_OBJAPPC_ENVELOPE.UserhasCreatedLine) {
            $('#txt_' + Tcount + '_' + 1).select();
            GetAmountCalculation();
        }
    }, 10);
    formmodified = 0; // invalid the formmodified flag after loading the PC details, which updates the formmodified to 1   
}

function resizeTable() {
    AtlasUtilities.AddStickyTableHeaders('TblPCLine', 'dvTableDetail', 280);
}

//========================================================== Vendor Name
function FillVendor() {
    $.ajax({
        url: APIUrlFillVendor + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillVendorSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillVendorSucess(response) {
    GetVendorNamePO = [];
    GetVendorNamePO = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,

        };
    });
    $(".VendorCode").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        position: { 'collision': 'flipfit' },
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
        },
        //focus: function (event, ui) {
        //    $(this).val(ui.item.label);
        //    $(this).attr('vendorId', ui.item.value);
        //    return false;
        //},
        select: function (event, ui) {
            //            event.preventDefault();
            $(this).val(ui.item.label);
            $(this).attr('vendorId', ui.item.value);
            return false;
            if (this.value !== '') {
            } else {
                event.preventDefault();
            }
            if (event.keyCode == 13) {
                $(this).next("input").focus().select();
            }
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                $(this).removeAttr('vendorId');
            }
        }
    })
}

function VendorBlur(value) {
    var StrCheckVendorName = $('#txtVendorName_' + value).val()
    var strStatus = 0;

    if (StrCheckVendorName != '') {
        let objVendor = GetVendorNamePO.find((e) => { return e.VendorName === StrCheckVendorName});
        if (objVendor) {
            $('#hdnVendorID').val(objVendor.VendorID);
            $('#txtVendor').val(objVendor.VendorName);
            strStatus = 1;
        }
        //for (var i = 0; i < GetVendorNamePO.length; i++) {
        //    if (GetVendorNamePO[i].VendorName == StrCheckVendorName) {
        //        $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
        //        $('#txtVendor').val(GetVendorNamePO[i].VendorName);
        //        strStatus++;

        //        return GetVendorNamePO[i].VendorID; // return the vendorID b/c legacy code is not working well
        //        break;
        //    } else {
        //    }
        //}
    } else {
        $('#txtVendor').focus();
        $('#hdnVendorID').val('');
        strStatus++;
    }

    if (strStatus == 0) {
        $('#hdnVendorID').val('');
        //$('#txtVendor').val('');
    }
}

//============================================================ Delete 
function funDeletePCDetail(Type, Id) {
    formmodified = 0;
    var strVal = 0;
    if (Type == 'PCEnvelope') {
        strVal = StrEnvelopId;
    } else {
        strVal = Id;
    }

    $.ajax({
        url: APIUrlDeletePCDetail + '?PCEnvelopeId=' + strVal + '&ProdId=' + localStorage.ProdId + '&Detail=' + Type,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       funDeletePCSucess(response, Type);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
}

function funDeletePCSucess(response, Type) {
    if (Type == 'PCEnvelope') {
        location.reload(true);
    } else {
        GetAmountCalculation();
    }
}

//============================================================ Cancel
function funCancel() {
    formmodified = 0;
    location.href = '/AccountPayable/PCEnvelopes';
}

//============================================================ Add NEW / View
function funShowDiv(value) {
    if (value == 'New') {
        // DO NOT TOUCH THIS CODE
        $('#PCEnvelopes').removeClass('active');
        $('#PCNew').addClass('active');
        $('#PCView').removeClass('active');
        // DO NOT TOUCH ABOVE
        $('#DvAdd').show();
        $('#DvView').hide();
        $('#DvViewIcon').hide();
        $('#DvPCSaveIcon').show();
        $('#txtCompany').focus();
        StrEnvelopId = 0;
        strAdAmountCount = 0;
        strEnvelopCount = 0;
        strCCount = 0;

        $('#txtCompany').val('');
        $('#txtCustodian').val('');
        $('#txtRecipient').val('');
        $('#txtEnvelopeNumber').val('');
        $('#txtDescription').val('');
        $('#txtAdvanceAmount').val('');
        $('#txtEnvelopeAmount').val('');
        $('#txtLineItemAmount').val('');
        $('#txtDifference').val('');
        $('#txtBatchNumberPC').val(BatchManager.BatchNumber);

        FillValue();
        document.title = 'New PC Envelope';
    } else {
        $('#PCView').addClass('active');
        $('#PCNew').removeClass('active');
        $('#DvAdd').hide();
        $('#DvView').show();
        $('#DvViewIcon').show();
        $('#DvPCSaveIcon').hide();
        PCEnvelopDetail();
    }
}

function funEditPC(value) {
    setTimeout( () => {
        AtlasUtilities.ShowLoadingAnimation();
    }, 10);

    StrEnvelopId = value;
    G_OBJAPPC_ENVELOPE.PCEnvelopeID = value;
    funShowDiv('View');
}

function FillValue() {
    FillCompany();
    FillCustodian();
    FillRecipient();

    if (ArrCompany.length == 1) {
        $('#txtCompany').val(ArrCompany[0].CompanyCode);
        $('#hdnCompany').val(ArrCompany[0].CompanyID);
        $('#ddlCompany').val(ArrCompany[0].CompanyID);
    }

    if (ArrCustodian.length == 1) {
        $('#txtCustodian').val(ArrCustodian[0].CustodianCode);
        $('#txtCustodian').attr('name', ArrCustodian[0].CustodianID);
    }

    if (ArrRecipient.length == 1) {
        $('#txtRecipient').val(ArrRecipient[0].VendorName);
        $('#txtRecipient').attr('name', ArrRecipient[0].VendorID);
        $('#hdnRecipientId').val(ArrRecipient[0].RecipientID);
        $('#hdnRecipientCode').val(ArrRecipient[0].CoaString);
        $('#hdnRecipientCAId').val(ArrRecipient[0].CoaID);
    }
}

$('#TblPCLineTBody').delegate('.clsTaxCode', 'keydown', function (event) {
    var strRowcount = $('#TblPCLineTBody tr:last').attr('id');

    if (event.which === 9) {
        if (event.shiftKey === true && event.which === 9) {
        } else {
            var $this = $(this)
            var strId = $this.attr('id');
            var strSplit = strId.split('_');
            if (strRowcount == strSplit[1]) {
                G_OBJAPPC_ENVELOPE.CreateCustodianRow(0);
                funSetPreviousRecord(strSplit[1]);
            }
        }
    }
})

function funSetPreviousRecord(value) {
    var TrId = parseInt(value) + 1;
    //console.log(retriveSegment);
    //console.log(retriveTransaction);
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type == 'SegmentRequired') {
            var strval = $('#txt_' + value + '_' + i).val();
            var strCode = $('#txt_' + value + '_' + i).attr('coacode');
            var strcoaid = $('#txt_' + value + '_' + i).attr('coaid');

            $('#txt_' + TrId + '_' + i).val(strval);
            $('#txt_' + TrId + '_' + i).attr('coacode', strCode);
            $('#txt_' + TrId + '_' + i).attr('coaid', strcoaid);
        } else {
            var strval = $('#txtOptional_' + value + '_' + (retriveSegment.length - 1 - i)).val();
            var strId = $('#txtOptional_' + value + '_' + (retriveSegment.length - 1 - i)).attr('accountid');

            $('#txtOptional_' + TrId + '_' + (retriveSegment.length - 1 - i)).val(strval);
            $('#txtOptional_' + TrId + '_' + (retriveSegment.length - 1 - i)).attr('accountid', strId);
        }
    }

    for (var i = 0; i < retriveTransaction.length; i++) {
        var strval = $('#txt_' + retriveTransaction[i].TransCode + '_' + value).val();
        var transvalueid = $('#txt_' + retriveTransaction[i].TransCode + '_' + value).attr('transvalueid');
        $('#txt_' + retriveTransaction[i].TransCode + '_' + TrId).val(strval);
        $('#txt_' + retriveTransaction[i].TransCode + '_' + TrId).attr('transvalueid', transvalueid);
    }

    $('#txtDescription_' + TrId).val($('#txtDescription_' + value).val());
    $('#hdnCoaId_' + TrId).val($('#hdnCoaId_' + value).val());
    $('#hdnCode_' + TrId).val($('#hdnCode_' + value).val());

    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].SegmentName == 'DT') {
            var stri = i - 1;
            $('#txt_' + TrId + '_' + stri).select();
            G_OBJAPPC_ENVELOPE.UserhasCreatedLine = true;

            break;
        }
    }
}

function ShowMSG(themessage) {
    console.log(themessage);
}

function funTaxCode(value) {
    var array = [];
    var ProductListjson = TaxCode1099;
    array = TaxCode1099.error ? [] : $.map(TaxCode1099, function (m) {
        return {
            label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(),
        };
    });

    $(".clsTaxPC").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        position: { 'collision': 'flipfit' },
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            //$(this).val(ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                try {
                    var findVal = $(this).val();
                    findVal = findVal.toUpperCase();
                    var GetElm = $.grep(array, function (v) {
                        return v.value == findVal;
                    });
                    if (GetElm.length > 0)
                        $(this).val(findVal);
                    else
                        $(this).val('');
                } catch (er) {
                    $(this).val('');
                    console.log(er);
                }
            }
        }
    })
}

//============================================= PC POST  function 
$('#chkCheckAll').change(function () {
    var strcheckBox = $('.clsCheck');
    var strval = true;
    if ($('#chkCheckAll').is(':checked')) {
        strval = true;
    } else {
        strval = false;
    }

    for (var i = 0; i < strcheckBox.length; i++) {
        var strId = strcheckBox[i].id;
        if (strval == true) {
            $('#' + strId).prop('checked', true);
        } else {
            $('#' + strId).prop('checked', false);
        }
    }
})

function UpdatePcEnvelope() {
    var strcheckBox = $('.clsCheck');
    var strval = '';

    for (var i = 0; i < strcheckBox.length; i++) {
        var strchecked = strcheckBox[i].checked;
        var strid = strcheckBox[i].id;
        if (strchecked == true) {
            strval += $('#' + strid).attr('name') + ',';
        }
    }

    strval = strval.substring(0, strval.length - 1);
    if (strval == '') {
        ShowMsgBox('showMSG', 'Please Select PC Envelope first..!!', '', '');
    } else {
        //show popup
        G_LedgerCollection.PostCollection(strval);
        window.onbeforeunload = undefined;
        //PCEnvelopePost(strval);
    }
}

/*
Obsolete with LedgerCollection Feature
function PCEnvelopePost(strval) {
    $.ajax({
        url: APIUrlUpdatePcEnvelope + '?PCEnvelopId=' + strval,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        PCEnvelopePostSucess(response);
        window.onbeforeunload = confirmExit;
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}
*/

function PCEnvelopePostSucess(response) {
    // GetPCenvelopsList();
    $('#SaveInvoiceSuccess').show();
    $('#fade').show();

    var strhtml = '';
    strhtml += '<tr><th style="width: 31%; text-align: center;">Envelope #</th><th style="text-align: center;"> Transaction #</th></tr>';
    for (var i = 0; i < response.length; i++) {
        strhtml += '<tr>';
        strhtml += '<td>' + response[i].EnvelopeNumber + '</td>';
        strhtml += '<td>' + response[i].TransactionNumber + '</td>';
        strhtml += '</tr>';
    }

    $('#tblResult').html(strhtml);
    $('#btnSaveOK').focus();
    GetPCenvelopsList();
}

//function funSaveInvoiceSuccess() {
//    location.reload(true);
//}

function funFillCustodian() {
    //==================================================== minus line
    G_OBJAPPC_ENVELOPE.CreateCustodianRow({AccountTypeId: 4},'custodian');
    var Tcount = $('#TblPCLineTBody tr').length;
    var CustCoaId = $('#hdnCustodianCoaId').val();
    var CustCoaCode = $('#hdnCustodianCoaCode').val();
    if (CustCoaCode === '' && G_OBJAPPC_CUSTODIAN.FULL_CUSTODIAN_LIST.length === 1) {
        // Get the default custodian
        CustCoaCode = G_OBJAPPC_CUSTODIAN.FULL_CUSTODIAN_LIST[0].COACode;
    }

    var strSplit = CustCoaCode.split('|');
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].SegmentName != 'DT') {
            $('#txt_' + Tcount + '_' + i).val(strSplit[i]);
        } else {
            var DTsplit = strSplit[i].split('>');
            var strval = DTsplit[DTsplit.length - 1];
            $('#txt_' + Tcount + '_' + i).val(strval);
        }

        $('#txt_' + Tcount + '_' + i).prop('disabled', true);
    }

    var strnCount = 0;
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type != 'SegmentRequired') {
            $('#txtOptional_' + Tcount + '_' + strnCount).prop('disabled', true);
            strnCount++;
        }
    }

    for (var i = 0; i < retriveTransaction.length; i++) {
        $('#txt_' + retriveTransaction[i].TransCode + '_' + Tcount).prop('disabled', true);
    }

    $('#txtDescription_' + Tcount).val($('#txtDescription').val());
    $('#txtDescription_' + Tcount).prop('disabled', false);

    var strAMT = $('#txtAdvanceAmount').val();
    strAMT = (strAMT == '') ? 0 : strAMT;
    if (strAMT != 0) {
        strAMT = parseFloat(strAMT.replace(/,/g, ''));
    }

    strAMT = strAMT - (strAMT * 2);
    $('#txtAmount_' + Tcount).val(strAMT);
    $('#txtAmount_' + Tcount).prop('disabled', true);
    $('#chkThirdParty_' + Tcount).prop('disabled', true);
    $('#hdnCoaId_' + Tcount).val(CustCoaId);
    $('#hdnCode_' + Tcount).val(CustCoaCode);
    $('#txtVendorName_' + Tcount).prop('disabled', false);
    $('#SpanDisId_' + Tcount).val('1');
    $('#spn_' + Tcount).attr('style', 'display:none;');

    //======================================================== Recipient Line
    G_OBJAPPC_ENVELOPE.CreateCustodianRow({AccountTypeId: 4}, 'Custodian');

    var Tcount = $('#TblPCLineTBody tr').length;
    var CustCoaId = $('#hdnRecipientCAId').val();
    var CustCoaCode = $('#hdnRecipientCode').val();
    var strSplit = CustCoaCode.split('|');
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].SegmentName != 'DT') {
            $('#txt_' + Tcount + '_' + i).val(strSplit[i]);
        } else {
            var DTsplit = strSplit[i].split('>');
            var strval = DTsplit[DTsplit.length - 1];
            $('#txt_' + Tcount + '_' + i).val(strval);
        }
        $('#txt_' + Tcount + '_' + i).prop('disabled', true);
    }

    var strnCount = 0;
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type != 'SegmentRequired') {
            $('#txtOptional_' + Tcount + '_' + strnCount).prop('disabled', true);
            strnCount++;
        }
    }

    for (var i = 0; i < retriveTransaction.length; i++) {
        $('#txt_' + retriveTransaction[i].TransCode + '_' + Tcount).prop('disabled', true);
    }

    $('#txtDescription_' + Tcount).val($('#txtDescription').val());
    $('#txtDescription_' + Tcount).prop('disabled', false);

    var strAMT = $('#txtAdvanceAmount').val();
    strAMT = (strAMT == '') ? 0 : strAMT;
    if (strAMT != 0) {
        strAMT = parseFloat(strAMT.replace(/,/g, ''));
    }

    //strAMT = strAMT - (strAMT * 2);
    $('#txtAmount_' + Tcount).val(strAMT);
    $('#txtAmount_' + Tcount).prop('disabled', true);
    $('#chkThirdParty_' + Tcount).prop('disabled', true);
    $('#hdnCoaId_' + Tcount).val(CustCoaId);
    $('#hdnCode_' + Tcount).val(CustCoaCode);
    $('#txtVendorName_' + Tcount).prop('disabled', false);
    $('#SpanDisId_' + Tcount).val('1');
    $('#spn_' + Tcount).attr('style', 'display:none;');

    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 });
};

function funRecipientFill() {
    G_OBJAPPC_ENVELOPE.CreateCustodianRow({AccountTypeId: 4}, 'Recipient');
    var Tcount = $('#TblPCLineTBody tr').length;
    var CustCoaId = $('#hdnRecipientCAId').val();
    var CustCoaCode = $('#hdnRecipientCode').val();
    var strSplit = CustCoaCode.split('|');
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].SegmentName != 'DT') {
            $('#txt_' + Tcount + '_' + i).val(strSplit[i]);
        } else {
            var DTsplit = strSplit[i].split('>');
            var strval = DTsplit[DTsplit.length - 1];
            $('#txt_' + Tcount + '_' + i).val(strval);
        }
        $('#txt_' + Tcount + '_' + i).prop('disabled', true);
    }

    var strnCount = 0;
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type != 'SegmentRequired') {
            $('#txtOptional_' + Tcount + '_' + strnCount).prop('disabled', true);
            strnCount++;
        }
    }

    for (var i = 0; i < retriveTransaction.length; i++) {
        $('#txt_' + retriveTransaction[i].TransCode + '_' + Tcount).prop('disabled', true);
    }

    $('#txtDescription_' + Tcount).val($('#txtDescription').val());
    $('#txtDescription_' + Tcount).prop('disabled', false);

    var strAMT = $('#txtEnvelopeAmount').val();
    strAMT = (strAMT == '') ? 0 : strAMT;
    if (strAMT != 0) {
        strAMT = parseFloat(strAMT.replace(/,/g, ''));
    }

    strAMT = strAMT - (strAMT * 2);
    $('#txtAmount_' + Tcount).val(strAMT);
    $('#txtAmount_' + Tcount).prop('disabled', true);
    $('#chkThirdParty_' + Tcount).prop('disabled', true);
    $('#hdnCoaId_' + Tcount).val(CustCoaId);
    $('#hdnCode_' + Tcount).val(CustCoaCode);
    $('#txtVendorName_' + Tcount).prop('disabled', false);
    $('#SpanDisId_' + Tcount).val('2');
    $('#spn_' + Tcount).attr('style', 'display:none;');

    G_OBJAPPC_ENVELOPE.CreateCustodianRow(0);
};

var ShowSegmentNotify = function (sMessage, sType, oControl) {
    var coaCustodian = ""; var coaCode = ""; var tempCoa = []; var tempSegmentCode = []; var tempCodes = [];

    var indexDetail = AtlasUtilities.SEGMENTS_CONFIG.DetailIndex;
    var oSegmentCode = AtlasUtilities.SEGMENTS_CONFIG.sequence

    var sCOACodeCustodian = $('#hdnCustodianCoaCode').val();
    var tempCoaCus = sCOACodeCustodian.split("|", indexDetail);

    $.each(oSegmentCode, function (index, value) {
        tempSegmentCode.push(value.SegmentCode);
    });

    $.each(tempCoaCus, function (index, value) {
        coaCustodian += value + "|";
        tempCodes.push(value);
    });

    coaCustodian = coaCustodian.slice(0, -1);

    if (sCOACodeCustodian != "") {
        var sControlId = $(oControl).attr('Id');
        var sControlName = $(oControl).attr('name');
        var sControlValue = $(oControl).val();

        if (sControlId.indexOf('txtRecipient') > -1) {
            var sCOACodeRecipient = $('#hdnRecipientCode').val();

            if (sCOACodeRecipient != "") {
                tempCoa = sCOACodeRecipient.split("|", indexDetail);
                $.each(tempCoa, function (index, value) {
                    coaCode += value + "|";
                });

                coaCode = coaCode.slice(0, -1);

                if (coaCustodian != coaCode) {
                    $.notify(sMessage, sType);
                }
            }
        } else {
            var index = tempSegmentCode.indexOf(sControlName);
            if (tempCodes[index] != sControlValue) {
                $.notify(sMessage, sType);
            }
        }
    }
}