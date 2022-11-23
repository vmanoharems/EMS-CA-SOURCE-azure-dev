window.name = 'apvendors';

//--------  API Colling 12/26/2015-- -----------//
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlFillVendorState = HOST + "/api/CompanySettings/GetStateListByCountryId";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
//var APIUrlFillVendorAccount = HOST + "/api/Payroll/GetSuspenseAccountbyProdId";
var APIUrlGetAccountDetails = HOST + "/api/Ledger/GetLedgerDetailByProdId";
var APIUrlInsertUpdateVendorInfo = HOST + "/api/AccountPayableOp/InsertUpdateVendor";
var APIUrlGetVendorDetail = HOST + "/api/AccountPayableOp/GetVendorDetailByVendorID";
var APIUrlGetVendorNumber = HOST + "/api/AccountPayableOp/GetLastVendorNumByProdId";
var APIUrlInsrtVendorsInfo = HOST + "/api/AccountPayableOp/InsertUpdateVendorInfo";
var APIUrlGetVendorsCInfo = HOST + "/api/AccountPayableOp/GetVendorInfoByVendorId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode"; //

var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition1";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlFillCompanyFirst = HOST + "/api/AccountPayableOp/GetDedaultCOLO";
var APIUrlAPVendorsCheckExisting = HOST + "/api/AccountPayableOp/APVendorsCheckExisting";

//-----------Global  Varable --------//

var gblState = '';
var gblCountryName = '';
var gblCountryCode = '';
var StrVendorID = 0;
var GetDefaultAccountDetail = [];
var getVendorCountry = [];
var GetVendorState = [];
var getVendorStateRemit = [];
var StrGetVendorName = [];
var ContactInfoCount = 0;
var StrGetResponseType = [];
var strTrCount = 0;
var ArrSegment = [];
var ArrOptionalSegment = [];
var ArrTransCode = [];
GlbTransList = [];
var strResponse = [];
var VenCan = 0;
var StrGlobalflag = 0;
var PageCnt;
var showpg = 0;
var ssttrr = 0;
var GVNo = 0;
var CheckExistingFocusAfter = 'txtAddVendor';

//---------End Decelaration-------//

$(function () {
    $('#navMainUL li').removeClass('active');
    $('#hrefPayable').parent().addClass('active');

    formmodified = 0;
    $('#breadcrumbVendorLi').addClass('active');
    showdivRemidAddrss();
    $('#btnsavevendor').attr('style', 'display:none;');
    ShowtabVendors();
    $('#UlAccountPayable li').removeClass('active');
    $('#LiAPVendors').addClass('active');

    $('#UlAlpha li').removeClass('active');
    var SearchVal = '';
    try {     
        var urlparam = getUrlVars(window.location.href);
        var Vall = urlparam["ID"].replace('#', '');
        SearchVal = Vall;
        $('#' + urlparam["Cls"]).addClass('active');
    } catch (e) {
        SearchVal = 'All'
        $('#LiAlphaAll').addClass('active');
    }

    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;

    GetVendoreByProdId(SearchVal);

    G_FillCountryAutoComplete($('#txtRemitCountry'));
    G_FillCountryAutoComplete($('#txtW9Country'));
    // $('#LiAlphaAll').addClass('active');
    FillCompanyFirst();
    GetSegmentsDetails();
});


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
//-------------------Onfocus Function------------------//

$('#txtW9State').focus(function () {
    W9AddFun();
})

$('#txtRemitState').focus(function () {
    RemitAddFun();
})

$('#txtDAccount').focus(function () {
    GetTblAccountsDetails();
})

$('#btnsavevendor').click(function () {
    funSaveVendor();
})

$(window).load(function () {
    $('.Net').mask('00.00');
});

//-----------------GetVendor By Prodid----------------//
function GetVendoreByProdId(values, id) {
    let bustcache = true;
    if (window.performance) {
        if (performance.navigation.type == 1) {
            bustcache = true;
        }
    }

    GVNo++;
    $('#LoaderVendorId').attr('style', 'display:block;');
    // $('#UlAlpha li').removeClass('active');
    //$('#' + id).addClass('active');
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlGetVendoreByProdId + '?SortBy=' + values + '&ProdID=' + localStorage.ProdId
            , 'doneFunction': GetVendoreByProdIdSucess
            , 'bustcache': bustcache
            , 'objFunctionParameters': {
            }
        }
    );
    return;

    $.ajax({

        url: APIUrlGetVendoreByProdId + '?SortBy=' + values + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { GetVendoreByProdIdSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}

function ShowMSG(error) {
    console.log(error);
}

function GetVendoreByProdIdSucess(response) {
    $('#LoaderVendorId').attr('style', 'display:none;');
    $('#TableVendor').dataTable().fnDestroy();
    var strHtml = '';
    var fixToLen = 50;
    var fixToLen1 = 10;

    var tcount = response.length;
    for (var i = 0; i < tcount; i++) {
        var VendorID = response[i].VendorID;
        var Status = response[i].Status;
        var VendorNumber = response[i].VendorNumber;
        var VendorName = response[i].VendorName;
        var W9Country = response[i].RemitCountry;
        var W9Address1 = response[i].RemitAddress1;
        var W9City = response[i].RemitCity;
        var W9State = response[i].RemitState;
        var Currency = response[i].Currency;
        var Type = response[i].Type;
        var Duecount = response[i].Duecount;
        var StudioVendorNumber = response[i].StudioVendorNumber;
        var checkedstatus = '';
        title = 'title = ""';
        if (Status == true) {
            checkedstatus = "checked";
        }

        strHtml += '<tr id=tr' + VendorID + ' class="trshow">';
        // strHtml += '<td></td>';
        // strHtml += '<a class="transhide" id=A' + VendorID + '; >' + VendorID + '</a>';
        strHtml += '<td><input ' + checkedstatus + ' type="checkbox" disabled id="chktrasfield' + VendorID + '" style="margin-left: 20%;" value="' + VendorID + '";/> </td>';
        strHtml += '<td><a style="color:#777; margin-left: 20%;" id=txtVndrNumber' + VendorID + '>' + VendorNumber + '</a></td>';
        strHtml += '<td><a ' + title + '  href="#" onclick="funGetVendorDetail(' + VendorID + ')">'
               + (VendorName.length > fixToLen ? '<lable title="' + VendorName + '" style="word-break: break-all;">' + VendorName.substring(0, fixToLen) + '...</label>' : VendorName) +
               '</a></td>';
        // strHtml += '<td ><a href="#" style="color: #337ab7; margin-left:2%;" onclick="javascript:funGetVendorDetail(' + VendorID + ');" id=txtVndrName' + VendorID + '>' + VendorName + '</a></td>';
        strHtml += '<td><input class=" transhide form-control" type="text" id=txtCntryVdn' + VendorID + ' style="display:none;" value=' + W9Country + '><span class=" transshow" id=ACntryVdn' + VendorID + ' >' + W9Country + '</span></td>';
        strHtml += '<td><a ' + title + '  href="#"  style="color:#707070;">'
               + (W9Address1.length > fixToLen ? '<lable title="' + W9Address1 + '" style="word-break: break-all;">' + W9Address1.substring(0, fixToLen) + '...</label>' : W9Address1) +
               '</a></td>';
        //strHtml += '<td><input class=" transhide form-control" type="text" id=txtAdrsVdn' + VendorID + ' style="display:none;" value=' + W9Address1 + '><span class=" transshow" id=AAdrsVdn' + VendorID + ' >' + W9Address1 + '</span></td>';
        strHtml += '<td><a ' + title + '  href="#"  style="color:#707070;">'
              + (W9City.length > fixToLen1 ? '<lable title="' + W9City + '" style="word-break: break-all;">' + W9City.substring(0, fixToLen1) + '...</label>' : W9City) +
              '</a></td>';
        //strHtml += '<td><input class=" transhide form-control" type="text" id=txtCityVdn' + VendorID + ' style="display:none;" value=' + W9City + '><span class=" transshow" id=ACityVdn' + VendorID + ' >' + W9City + '</span></td>';
        strHtml += '<td><input class=" transhide form-control" type="text" id=txtStVdn' + VendorID + ' style="display:none;" value=' + W9State + '><span class=" transshow" id=AStVdn' + VendorID + ' >' + W9State + '</span></td>';
        strHtml += '<td><input class=" transhide form-control" type="text" id=txtCurrncyVdn' + VendorID + ' style="display:none; " value=' + Currency + '><span class=" transshow" id=ACurrncyVdn' + VendorID + ' >' + Currency + '</span></td>';

        if (Type !== '' && Type != null) {
            strHtml += '<td><a ' + title + '  href="#"  style="color:#707070;">'
                  + (Type.length > fixToLen ? '<lable title="' + Type + '" style="word-break: break-all;">' + Type.substring(0, fixToLen) + '...</label>' : Type) +
                  '</a></td>';
        } else {
            strHtml += '<td><input class=" transhide form-control" type="text" id=txtPaytypVdn' + VendorID + ' style="display:none; " value=' + Type + '><span class=" transshow" id=APaytypVdn' + VendorID + ' >' + Type + '</span></td>';
        }
        strHtml += '<td><input class=" transhide form-control" type="text" id=txtStudioVdn' + VendorID + ' style="display:none; " value=' + StudioVendorNumber + '><span class=" transshow" id=AStudioVdn' + VendorID + ' >' + StudioVendorNumber + '</span></td>';
        strHtml += '</tr>';
    }

    $('#AccountTypeVendorTBody').html(strHtml);
    $("#preload").css("display", "none");

    var PgNo = (PageCnt / 28);
//    if (parseInt(PageCnt) < 500) {
//    }
//else 
    if (parseInt(PageCnt) < 800) {
        PgNo = (PageCnt / 24);
    }

    var substr = PgNo.toString().split('.');
    showpg = parseInt(substr[0]);

    //  if (GVNo == 1) {
    var table = $('#TableVendor').DataTable({
        "dom": 'C<"clear"><Rrt<"positionFixed"pli>>',
        //"iDisplayLength": showpg,
        paging: false,
        responsive: {
            details: {
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: false,
            targets: 0,

        }],
        order: [1, 'asc']
    });

    $('#TableVendor').DataTable();

    $('#TableVendor tfoot th').each(function () {
        var title = $('#TableVendor thead th').eq($(this).index()).text();
        if (title == 'Active') {
        } else if (title == 'Status') {
            //  $(this).html('<select><option value="">All</option><option value="Open">Open</option><option value="Close">Close</option><option value="Partial">Partial</option></select>');
        } else if (title == 'Vendor') {
            $(this).html('<input type="text" style="width:35px !important;" placeholder="' + title + '" />');
        } else if (title == 'Vendor Name') {
            $(this).html('<input type="text" style="width:200Px; !important;" placeholder="' + title + '" />');
        } else if (title == 'Country') {
            $(this).html('<input type="text" style="width:40px !important;" placeholder="' + title + '" />');
        } else if (title == 'Address') {
            $(this).html('<input type="text" style="width:280px !important;" placeholder="' + title + '" />');
        } else if (title == 'City') {
            $(this).html('<input type="text" style="width:85px !important;" placeholder="' + title + '" />');
        } else if (title == 'State') {
            $(this).html('<input type="text" style="width:40px !important;" placeholder="' + title + '" />');
        } else if (title == 'Currency') {
            $(this).html('<input type="text" style="width:35px !important;" placeholder="' + title + '" />');
        } else if (title == 'Vendor Type') {
            $(this).html('<input type="text" style="width:178px !important;" placeholder="' + title + '" />');
        } else if (title == 'Studio Vendor') {
            $(this).html('<input type="text" style="width:35px !important;" placeholder="' + title + '" />');
        } else {
            $(this).html('<input type="text" style="width:90%;" placeholder="' + title + '" />');
        }
    });
    // if (GVNo == 1) {
    table.columns().eq(0).each(function (colIdx) {
        $('input', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
        $('select', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });

    $('#TableVendor tfoot tr').insertAfter($('#TableVendor thead tr'));
    //$('#TableVendor').parent().css('overflow', 'scroll');
    //$('#TableVendor').parent().css('max-height', ($(window).height() - 180) + 'px');
    //$('#TableVendor').parent().css('min-height', ($(window).height() - 180) + 'px');
    //$('#TableVendor').parent().css('height', ($(window).height() - 180) + 'px');
    //$('#TableVendor_wrapper').attr('style', 'height:' + PageCnt + 'px;');

    $(`#TableVendor`).stickyTableHeaders('destroy'); // destroy the old sticky headers
    $('#DvTB')
        .height((window.innerHeight - 150))
        .css('overflow', 'overlay')
        .prop('stickyTableHeaders', true);
    $('#TableVendor').stickyTableHeaders({ scrollableArea: $('#DvTB') });

}

//--------   Vendor Country list--------------------//
/*
function FillVendorCountrySuccess(response) {
    getVendorCountry = [];
    getVendorCountry = response;
    var ProductListjson = GetCountryList();

    var array = function( request, response ) {
        var matches = $.map(cntryList, function (m) {
            if ( m.name.toUpperCase().indexOf(request.term.toUpperCase()) === 0 ) {
                return {
                    value: m.ID
                    , label: m.name
                };
            }
        });
        response(matches);
    }
    //var array = response.error ? [] : $.map(response, function (m) {
    //    return {
    //        value: m.ID,
    //        label: m.name,
    //        //value: m.CountryCode,
    //        //label: m.CountryName,
    //    };
    //});
    $(".VendorCountryAutoFill").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        //focus: function (event, ui) {
        //    $(this).val(ui.item.label);
        //    $(this).attr('name', ui.item.value);
        //    return false;
        //},
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            return false;
        }
    })
}
*/

//---------------InsertUpdate Vendor----------------//
function funSaveVendor() {
    FunUseRemit(); // Double check the Use Remit by default
    var StrZipRemitAddrs = '';

    StrZipRemitAddrs = $('#txtRemitZip').val();
    StrZipW9Addrs = $('#txtW9Zip').val();

    var TransString = '';
    var strTrans = $('.clsTransCode0');
    for (var j = 0; j < strTrans.length; j++) {
        var strid = strTrans[j].id;
        var strvalue = $('#' + strid).attr('name');
        var strTransValueId = $('#' + strid).attr('TransValueId');
        if (strTransValueId != undefined) {
            TransString += strvalue;
            TransString += ':' + strTransValueId + ',';
        }
    }
    TransString = TransString.slice(0, -1);

    var ObjVendorInfo = {
        VendorID: StrVendorID,
        VendorNumber: $('#txtAddVendor').val(),
        VendorName: $('#txtAddVendorName').val().trim(),
        FirstName: $('#txtAddFirstName').val(),
        MiddleName: $('#txtAddMiddleName').val(),
        LastName: $('#txtAddLastName').val(),
        PrintOncheckAS: $('#txtPrntCheck').val(),

        W9Country: $('#txtW9Country').val(),
        W9Address1: $('#txtW9Address1').val(),
        W9Address2: $('#txtW9Address2').val(),
        W9Address3: $('#txtW9Address3').val(),
        W9City: $('#txtW9City').val(),
        W9State: $('#txtW9State').val(),
        W9Zip: StrZipW9Addrs,
        RemitCountry: $('#txtRemitCountry').val(),
        RemitAddress1: $('#txtRemitAddress1').val(),
        RemitAddress2: $('#txtRemitAddress2').val(),
        RemitAddress3: $('#txtRemitAddress3').val(),
        RemitCity: $('#txtRemitCity').val(),
        RemitState: $('#txtRemitState').val(),
        RemitZip: StrZipRemitAddrs,

        UseRemmitAddrs: $('#chkAddstoW').prop('checked'),
        Qualified: $('#txtOualified').val(),
        Currency: ('USD'),
        DefaultAccount: $('#txtDAccount').attr('name'),
        LedgerAccount: $('#txtledger').attr('name'),
        TaxID: $('#txtAddTaxID').val(),
        Type: $('#txtTaxtype').val(),
        TaxFormOnFile: $('#chkTaxOF').prop('checked'),
        TaxFormExpiry: $('#TaxFormExpiry').val(),
        DefaultForm: $('#txtAddDefltForm').val(),
        TaxName: $('#txtTaxName').val(),
        ForeignTaxId: $('#txtAddFTaxId').val(),
        PaymentType: $('#txtpaytype').val(),
        Duecount: $('#txtAddDue').val(),
        Duetype: $('#txttypedaymonth').val(),

        netpercentage: $('#txtAddNet').val(),
        PaymentAccount: $('#txtAddAccount').val(),
        Required: $('#ChkRequired').prop('checked'),
        StudioVendorNumber: $('#txtAddStudioVendr').val(),
        IsStudioApproved: $('#chkStudioAppd').prop('checked'),
        Status: $('#chkAddVendor').prop('checked'),
        Warning: $('#ChkWarning').prop('checked'),
        DefaultDropdown: $('#txtSelectFval').val(),
        CreatedBy: localStorage.UserId,
        ProdID: localStorage.ProdId,
        COAId: $('#hdnCOAId_0').val(),
        COAString: $('#hdnCode_0').val(),
        TransactionCodeString: TransString,
        SetId: $('#txtOptional_0_0').attr('accountid'),
        SeriesId: $('#txtOptional_0_1').attr('accountid')

    }
    var isvalid = $('#frmVendor').find('.field-Req').length;
    isvalid += G_legacy_CheckRequired($("#txtAddVendorName"));
    isvalid += G_legacy_CheckRequired($("#txtAddVendor"));
    isvalid += G_legacy_CheckRequired($("#txtW9Country"));
    isvalid += G_legacy_CheckRequired($("#txtW9Address1"));
    isvalid += G_legacy_CheckRequired($("#txtW9City"));
    isvalid += G_legacy_CheckRequired($("#txtW9State"));
    isvalid += G_legacy_CheckRequired($("#txtW9Zip"));
    isvalid += G_legacy_CheckRequired($("#txtRemitCountry"));
    isvalid += G_legacy_CheckRequired($("#txtRemitAddress1"));
    isvalid += G_legacy_CheckRequired($("#txtRemitCity"));
    isvalid += G_legacy_CheckRequired($("#txtRemitState"));
    isvalid += G_legacy_CheckRequired($("#txtRemitZip"));
    if ($('#chkTaxOF').is(':checked')) {
        isvalid += G_legacy_CheckRequired($('#TaxFormExpiry'), { blur: true });
    }

    if (isvalid > 0) {
        //$('#W9AddressbtnId').addClass('btn-vendorAddress02');
        $('#dialog-alert-notsaved').dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                }
            }
        });
    }
    if (isvalid === 0) {
        if (StrGlobalflag == StrGlobalflag) {
            StrGlobalflag++;
            $.ajax({
                url: APIUrlInsertUpdateVendorInfo,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjVendorInfo),
            })
            .done(function (response) {
                funSaveVendorSucess(response);
            })
            .fail(function (error) {
                ShowMSG(error);
            })
        }
    }
}

function funSaveVendorSucess(response) {
    InsertUpdateVendorsInfo(response);
    ShowMsgBox('showMSG', 'Vendor Information Saved ..!!', '', '');
    ShowAddtabVendors();
    AtlasCache.CacheORajax({
        'URL': APIUrlFillVendor + '?ProdId=' + localStorage.ProdId
        , bustcache: true
    });

    AtlasCache.CacheORajax({
        'URL': APIUrlGetVendoreByProdId + '?SortBy=All&ProdID=' + localStorage.ProdId
        , bustcache: true
    });

    //location.reload('true');
}

//-----------type Dropdown checkbox-----------------//
var expanded = false;
function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

//----------------------- Vendor Detail
function funGetVendorDetail(values) {
    $('#txtAddVendorName').focus();
    $.ajax({
        url: APIUrlGetVendorDetail + '?VendorID=' + values + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVendorDetailSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetVendorDetailSucess(response) {
    // CheckBoxName();
    $('#txtTaxtype').change(function () {
        SelectVenType();
    })

    var TLength = response.length;
    if (TLength == 0) {
        $('#breadcrumbVendorLi').html('Add Vendor');
    } else {
        var VendorNameBreadCum = response[0].VendorName;
        $('#breadcrumbVendorLi').html(VendorNameBreadCum);
    }

    $('#btnsavevendor').attr('style', 'display:block;');
    $('#btnCancelvendor').attr('style', 'display:block;');
    StrVendorID = response[0].VendorID;
    $('#txtAddVendor').val(response[0].VendorNumber);
    $('#txtAddVendorName').val(response[0].VendorName);
    $('#txtAddFirstName').val(response[0].FirstName);
    $('#txtAddMiddleName').val(response[0].MiddleName);
    $('#txtAddLastName').val(response[0].LastName);
    $('#txtPrntCheck').val(response[0].PrintOncheckAS);

    $('#txtW9Country').val(response[0].W9Country);
    $('#txtW9Country').attr('name', response[0].w9CountryName);

    $('#txtW9Address1').val(response[0].W9Address1);
    $('#txtW9Address2').val(response[0].W9Address2);
    $('#txtW9Address3').val(response[0].W9Address3);
    $('#txtW9City').val(response[0].W9City);
    $('#txtW9State').val(response[0].W9State);
    $('#txtW9Zip').val(response[0].W9Zip);

    $('#txtRemitCountry').val(response[0].RemitCountry);
    $('#txtRemitCountry').attr('name', response[0].reCountryName);

    $('#txtRemitAddress1').val(response[0].RemitAddress1);
    $('#txtRemitAddress2').val(response[0].RemitAddress2);
    $('#txtRemitAddress3').val(response[0].RemitAddress3);
    $('#txtRemitCity').val(response[0].RemitCity);
    $('#txtRemitState').val(response[0].RemitState);
    $('#txtRemitZip').val(response[0].RemitZip);

    $('#chkAddstoW').prop('checked', response[0].UseRemmitAddrs);
    $('#txtAddCurrency').val('USD');
    $('#txtDAccount').val(response[0].DefaultAccount);
    $('#txtledger').val(response[0].LedgerAccount);
    $('#txtAddTaxID').val(response[0].TaxID);
    $('#txtTaxtype').val(response[0].Type);
    $('#chkTaxOF').prop('checked', response[0].TaxFormOnFile);
    $('#TaxFormExpiry').val(response[0].TaxFormExpiry);
    $('#txtAddDefltForm').val(response[0].DefaultForm);
    $('#txtTaxName').val(response[0].TaxName);
    $('#txtAddFTaxId').val(response[0].ForeignTaxId);
    $('#txtpaytype').val(response[0].PaymentType);
    $('#txtAddDue').val(response[0].Duecount);
    $('#txttypedaymonth').val(response[0].Duetype);
    $('#txtAddNet').val(response[0].netpercentage);
    $('#txtAddAccount').val(response[0].PaymentAccount);
    $('#ChkRequired').prop('checked', response[0].Required);
    $('#txtAddStudioVendr').val(response[0].StudioVendorNumber);
    $('#chkStudioAppd').prop('checked', response[0].IsStudioApproved);
    $('#chkAddVendor').prop('checked', response[0].Status);
    $('#ChkWarning').prop('checked', response[0].Warning);
    $('#txtSelectFval').val(response[0].DefaultDropdown);
    // $('#breadcrumbVendorLi').text('Add Vendor');
    $('#tabAddVendors').attr('style', 'display:block;');
    $('#tabVendors').attr('style', 'display:none;');
    $('#tabPurchaseOrders').attr('style', 'display:none;');
    $('#tabAddPO').attr('style', 'display:none;');
    $('#VendorsAddTabLi').addClass('active');
    $('#VendorsTabLi').removeClass('active');
    $('#VendorsPOTabLi').removeClass('active');
    $('#VendorsADDPOTabLi').removeClass('active');
    $('#VendorsAddTabLi').attr('style', 'display:none');

    funTrCreate();
    var strCOAString = response[0].COAString;
    var strsplit = strCOAString.split('|');
    var strCOAPval = '';
    for (var j = 0; j < strsplit.length; j++) {
        //coacode = "01|100"
        if (j == 0) { strCOAPval = strsplit[0]; }
        else if (j == 1) { strCOAPval = strsplit[0] + '|' + strsplit[1]; }
        else if (j == 2) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2]; }
        else if (j == 3) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3]; }
        else if (j == 4) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4]; }
        else if (j == 5) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4] + '|' + strsplit[5]; }
        var SegVal = strsplit[j];

        var ssSegVal = SegVal.split('>');
        if (ssSegVal.length == 1) {
            $('#txt_' + 0 + '_' + j).val(SegVal);
            $('#txt_' + 0 + '_' + j).attr('coacode', strCOAPval);
        } else {
            var sLength = ssSegVal.length;
            sLength = sLength - 1;
            $('#txt_' + 0 + '_' + j).val(ssSegVal[sLength]);
            $('#txt_' + 0 + '_' + j).attr('coacode', strCOAPval);
        }

    }

    $('#hdnCode_0').val(strCOAString);
    $('#hdnCOAId_0').val(response[0].COAId);
    $('#txtOptional_0_0').val(response[0].SetCode);
    $('#txtOptional_0_0').attr('accountid', response[0].SetId);
    $('#txtOptional_0_1').val(response[0].SeriesCode);
    $('#txtOptional_0_1').attr('accountid', response[0].SeriesId);

    for (var j = 0; j < 1; j++) {
        var strTrans = response[0].TransDetail;
        var TvstringSplit = strTrans.split(',');

        for (var k = 0; k < TvstringSplit.length; k++) {
            var strTvs = TvstringSplit[k].split(':');
            $('#txt_' + strTvs[0] + '_' + 0).val(strTvs[1]);
            $('#txt_' + strTvs[0] + '_' + 0).attr('transvalueid', strTvs[2]);
        }

    }
    funGetVendorsContInfo();
    FunTaxEpiration();
}

function ShowtabVendors() {
    $('#breadcrumbVendorLi').html('Vendors');
    $('#VendorsAddTabLi').attr('style', 'display:block;');
    $('#tabVendors').attr('style', 'display:block;');
    $('#tabAddVendors').attr('style', 'display:none;');
    $('#tabPurchaseOrders').attr('style', 'display:none;');
    $('#tabAddPO').attr('style', 'display:none;');
    $('#VendorsTabLi').addClass('active');
    $('#VendorsAddTabLi').removeClass('active');
    $('#VendorsPOTabLi').removeClass('active');
    $('#VendorsADDPOTabLi').removeClass('active');
    $('#btnsavevendor').attr('style', 'display:none;');
    $('#btnCancelvendor').attr('style', 'display:none;');
}

function ShowAddtabVendors() {
    showdivRemidAddrss();
    funTrCreate();
    EmptytxtVendor();
    funGetVendorNumber();
    ResetVendorForm();

    $('#txtAddVendorName').focus();
}


function EmptytxtVendor() {
    $('#txtAddLastName').val('');
    $('#txtPrntCheck').val('');

    $('#txtW9Country').val('');
    $('#txtW9Address1').val('');
    $('#txtW9Address2').val('');
    $('#txtW9Address3').val('');
    $('#txtW9City').val('');
    $('#txtW9State').val('');
    $('#txtW9Zip').val('');
    $('#txtRemitCountry').val('');
    $('#txtRemitAddress1').val('');
    $('#txtRemitAddress2').val('');
    $('#txtRemitAddress3').val('');
    $('#txtRemitCity').val('');
    $('#txtRemitState').val('');
    $('#txtRemitZip').val('');
    $('#chkAddstoW').val('');
    $('#txtOualified').val('');
    $('#txtAddVendor').val('');
    $('#txtDAccount').val('');
    $('#txtledger').val('');
    $('#txtAddTaxID').val('');
    $('#chkTaxOF').val('');
    $('#txtTaxName').val('');
    $('#txtAddFTaxId').val('');
    $('#TaxFormExpiry').val('');
    $('#txtAddDue').val('');
    $('#txtAddNet').val('');
    $('#txtAddAccount').val('');
    $('#txtAddMPAA').val('');
    $('#txtAddStudioVendr').val('');
    $('#chkStudioAppd').val('');
    $('#chkAddVendor').val('');
    $('#txtAddVendorName').val('');
    $('#txtAddFirstName').val('');
    $('#txtAddLastName').val('');
    $('#txtAddMiddleName').val('');
    $('#chkAddVendor').val('');
    $('#chkStudioAppd').val('');

    $('#chkTaxOF').prop('checked', false);
    $('#txtSelectFval').val('');
    $('#ChkRequired').prop('checked', false);
    $('#ChkWarning').prop('checked', false);
    $('#txtTaxtype option:selected').prop('selected', false);
    $('#txtpaytype option:selected').prop('selected', false);
    ContactInfo_Clear();
}

//----------------Keybord Shortcut--------------//
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) { // Alt+N = New
        ShowAddtabVendors();
        $('#txtAddVendorName').focus();
        StrVendorID = 0; // reset the Vendor ID
    }

    if (event.altKey === true && key === 83) {
        funSaveVendor();
        event.preventDefault();
        event.stopPropagation();
        //event.disabledEventPropagation();
    }
});

function showdivRemidAddrss() {
    $('#chkAddressw').attr('style', 'display:none');
    $('#RemidAddressdiv').attr('style', 'display:block');
    $('#W9AddressdivID').attr('style', 'display:none');
    $('#W9AddressbtnId').removeClass('btn-vendorAddress');
    $('#RemitAddressbtnId').addClass('btn-vendorAddress');
    $('#W9AddressbtnId').addClass('btn-vendorAddress01');
}
function showdivW9Addrss() {
    // $('#txtW9Country').val('');
    $('#chkAddressw').attr('style', 'display:block');
    $('#chkAddressw').css("fontSize", "12px");
    $('#W9AddressdivID').attr('style', 'display:block');
    $('#RemidAddressdiv').attr('style', 'display:none');
    $('#RemitAddressbtnId').removeClass('btn-vendorAddress');
    $('#W9AddressbtnId').addClass('btn-vendorAddress');
    $('#RemitAddressbtnId').addClass('btn-vendorAddress01');
    if ($('#txtW9Country').val() == '') {
    }
}

function W9AddFun() {
    G_CountryStates($('#txtW9Country'), $('#txtW9State'));

    //var strvalW = $('#txtW9Country').attr('name');
    //GetVendorStateList(strvalW);
}

function RemitAddFun() {
    G_CountryStates($('#txtRemitCountry'), $('#txtRemitState'));
    //var strval = $('#txtRemitCountry').attr('name');
    //GetVendorStateList(strval);
}

$("#txtAddStudioVendr").blur(function () {
    if ($('#txtAddStudioVendr').val().length > 0) {
        var tt = $('#txtAddStudioVendr').val();
        var Printoncheck = $("#txtAddStudioVendr").val();
        //$("#txtAddVendor").val(Printoncheck);
        $("#txtAddVendor").attr("disabled", true);
    } else { }
});

function VendorNameFullforCheck() {
    return (($('#txtAddFirstName').val().trim() === '') ? '' : $('#txtAddFirstName').val().trim())
        + (($('#txtAddMiddleName').val().trim() === '') ? '' : (' ' + $('#txtAddMiddleName').val().trim()))
        + (($('#txtAddLastName').val().trim() === '') ? '' : (' ' + $('#txtAddLastName').val().trim()))
        ;
}

function VendorNameFullfromFML() {
    return (($('#txtAddLastName').val().trim() === '') ? '' : $('#txtAddLastName').val().trim())
        + (($('#txtAddFirstName').val().trim() === '') ? '' : (", " + $('#txtAddFirstName').val().trim()))
        + (($('#txtAddMiddleName').val().trim() === '') ? '' : (" " + $('#txtAddMiddleName').val().trim()))
    ;
}

$("#txtAddVendorName").blur(function () {
    var strPrintonCheck = $('#txtPrntCheck').val().trim();
    var thisValue = this.value.trim(); 
    //var StrlastName = $("#txtAddLastName").val().trim();
    let objtoFocus = (thisValue === '') ? '#txtAddFirstName': '#txtPrntCheck'; // Default focus to Print on Check field

    if (strPrintonCheck === '') {
        if (thisValue === '') {
            strPrintonCheck = VendorNameFullforCheck();
            objtoFocus = '#txtAddFirstName';
            this.value = VendorNameFullfromFML();
        } else {
            strPrintonCheck = thisValue;
        }

        $('#txtPrntCheck').val(strPrintonCheck);
    }
    $(objtoFocus).focus();

});

//================CheckboxPrintOnCheck=================//
function FunPrintOnCheck() {
    if ($('#txtPrntCheck').val().trim() === '') {
        $('#txtPrntCheck').val(VendorNameFullforCheck());
    }
    if ($('#txtAddVendorName').val().trim() === '') {
        $('#txtAddVendorName').val(VendorNameFullfromFML());
    }
}

//==============getvendorNumber==================//
function funGetVendorNumber() {
    $.ajax({
        url: APIUrlGetVendorNumber + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVendorNumberSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetVendorNumberSucess(response) {
    $('#txtAddVendor').val(response[0].VendorNo);
    $("#txtAddVendor").attr("disabled", true);
}

//============Check Postal Code=============//

$('#txtRemitZip').blur((e) => {
    let val = $('#txtRemitZip').val();

if (val.length > 10) {
    $('#txtRemitZip').val('');
}
});

$('#txtW9Zip').blur((e) => {
    let val = $('#txtW9Zip').val();

if (val.length > 10) {
    $('#txtW9Zip').val('');
}
});

//============Check Code RemmitAddress=============//
$('#txtW9Country').blur(function () {
    var StrCountryVen = $('#txtW9Country').val().trim();
    if (StrCountryVen != '') {
        for (var i = 0; i < getVendorCountry.length; i++) {
            if ((getVendorCountry[i].name).toLowerCase() == StrCountryVen.toLowerCase()) {
                $('#txtW9Country').attr('name', getVendorCountry[i].ID);
                $('#txtW9Country').val(getVendorCountry[i].name);
                GetVendorStateList(getVendorCountry[i].ID);
                //  $('#txtW9State').val('');
                //   $('#txtW9State').removeAttr('name');
                break;
            } else {
                $('#txtW9Country').removeAttr('name');
                $('#txtW9Country').val('');
            }
        }
        for (var i = 0; i < getVendorCountry.length; ++i) {
            if (getVendorCountry[i].name.substring(0, StrCountryVen.length).toLowerCase() === StrCountryVen.toLowerCase()) {
                $('#txtW9Country').attr('name', getVendorCountry[i].ID);
                $('#txtW9Country').val(getVendorCountry[i].name);

                GetVendorStateList(getVendorCountry[i].ID);
                break;
            }
        }
    } else {
        $('#txtW9Country').attr('name', getVendorCountry[0].ID);
        $('#txtW9Country').val(getVendorCountry[0].name);
        GetVendorStateList(getVendorCountry[0].ID);
        // $('#txtW9State').removeAttr('name');
        //  $('#txtW9State').val('');
    }

})

//function funCheckVendorstate() {
$('#txtW9State').blur(function () {
    W9AddFun();
    G_CountryStates($('#txtW9Country'), $('#txtW9State'));
    return;

    var StrStateVen = $('#txtW9State').val().trim();
    if (StrStateVen != '') {
        for (var i = 0; i < GetVendorState.length; i++) {
            if ((GetVendorState[i].StateName).toLowerCase() == StrStateVen.toLowerCase()) {
                $('#txtW9State').val(GetVendorState[i].StateName);
                $('#txtW9State').attr('name', GetVendorState[i].StateID);

                break;
            } else {
                $('#txtW9State').removeAttr('name');
                $('#txtW9State').val('');

            }
        }
        for (var i = 0; i < GetVendorState.length; ++i) {
            if (GetVendorState[i].StateName.substring(0, StrStateVen.length).toLowerCase() === StrStateVen.toLowerCase()) {
                $('#txtW9State').val(GetVendorState[i].StateName);
                $('#txtW9State').attr('name', GetVendorState[i].StateID);
                break;
            }
        }
    } else {
        $('#txtW9State').val(GetVendorState[0].StateName);
        $('#txtW9State').attr('name', GetVendorState[0].StateID);

    }
})

//============Check Code W9Address=============//

$('#txtRemitCountry').blur(function () {
    var StrCountryVenRemit = $('#txtRemitCountry').val().trim();
    G_CountryStates($('#txtRemitCountry'), $('#txtRemitState'));
    return;

    if (StrCountryVenRemit != '') {
        for (var i = 0; i < getVendorCountry.length; i++) {
            if ((getVendorCountry[i].name).toLowerCase() == (StrCountryVenRemit).toLowerCase()) {
                $('#txtRemitCountry').attr('name', getVendorCountry[i].ID);
                $('#txtRemitCountry').val(getVendorCountry[i].name);
                G_CountryStates($('#txtRemitCountry'), $('#txtRemitState'));
                //GetVendorStateList(getVendorCountry[i].ID);
                break;
            } else {
                $('#txtRemitCountry').removeAttr('name');
                $('#txtRemitCountry').val('');
            }
        }

        for (var i = 0; i < getVendorCountry.length; ++i) {
            if (getVendorCountry[i].name.substring(0, StrCountryVenRemit.length).toLowerCase() === StrCountryVenRemit.toLowerCase()) {
                $('#txtRemitCountry').attr('name', getVendorCountry[i].ID);
                $('#txtRemitCountry').val(getVendorCountry[i].name);
                G_CountryStates($('#txtRemitCountry'), $('#txtRemitState'));
                //GetVendorStateList(getVendorCountry[i].ID);
                break;
            }
        }
    } else {
        $('#txtRemitCountry').attr('name', getVendorCountry[0].ID);
        $('#txtRemitCountry').val(getVendorCountry[0].name);
        GetVendorStateList(getVendorCountry[0].ID);
        // $('#txtRemitState').removeAttr('name');
        // $('#txtRemitState').val('');
    }
})

$('#txtRemitState').blur(function () {
    var StrStateVenRemit = $('#txtRemitState').val().trim();

    if (StrStateVenRemit != '') {
        for (var i = 0; i < getVendorStateRemit.length; i++) {
            if ((getVendorStateRemit[i].StateName).toLowerCase() == StrStateVenRemit.toLowerCase()) {
                $('#txtRemitState').val(getVendorStateRemit[i].StateName);
                $('#txtRemitState').attr('name', getVendorStateRemit[i].StateID);
                break;
            } else {
                $('#txtRemitState').val('');
                $('#txtRemitState').removeAttr('name');
            }
        }
        for (var i = 0; i < getVendorStateRemit.length; ++i) {
            if (getVendorStateRemit[i].StateName.substring(0, StrStateVenRemit.length).toLowerCase() === StrStateVenRemit.toLowerCase()) {
                $('#txtRemitState').val(getVendorStateRemit[i].StateName);
                $('#txtRemitState').attr('name', getVendorStateRemit[i].StateID);
                break;
            }
        }
    } else {
        $('#txtRemitState').val(getVendorStateRemit[0].StateName);
        $('#txtRemitState').attr('name', getVendorStateRemit[0].StateID);
    }

})
    
//===========Check Default Account================//

$('#txtDAccount').blur(function () {
    var StrDefaultAccount = $('#txtDAccount').val().trim();
    if (StrDefaultAccount != '') {
        for (var i = 0; i < GetDefaultAccountDetail.length; i++) {
            if ((GetDefaultAccountDetail[i].hierarchy2) == StrDefaultAccount) {
                $('#txtDAccount').attr('name', GetDefaultAccountDetail[i].hierarchy2);
                $('#txtDAccount').val(GetDefaultAccountDetail[i].hierarchy2);
                break;
            }
            else {
                $('#txtDAccount').removeAttr('name');
                $('#txtDAccount').val('');
            }
        }

        for (var i = 0; i < GetDefaultAccountDetail.length; ++i) {
            //  var strval = GetDefaultAccountDetail[i].hierarchy2;
            if (GetDefaultAccountDetail[i].hierarchy2.match(StrDefaultAccount)) {
                $('#txtDAccount').attr('name', GetDefaultAccountDetail[i].hierarchy2);
                $('#txtDAccount').val(GetDefaultAccountDetail[i].hierarchy2);
                break;
            } else {
                $('#txtDAccount').removeAttr('name');
                $('#txtDAccount').val('');
            }
        }
    } else {
        $('#txtDAccount').removeAttr('name');
        $('#txtDAccount').val('');
    }
})

//================Details AutoComplete====================//

function GetTblAccountsDetails() {
    value = 'Detail'
    $.ajax({
        //url: APIUrlGetAccountDetails + '?ProdId=' + localStorage.ProdId + '&Category=' + value,
        url: APIUrlGetAccountDetails + '?ProdId=' + localStorage.ProdId,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetTblAccountDeatailsSuccess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetTblAccountDeatailsSuccess(response) {
    var array = [];
    GetDefaultAccountDetail = [];
    GetDefaultAccountDetail = response;
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {

        return {
            value: m.hierarchy2,
            label: m.hierarchy2 + '(' + m.AccountName + ')',

        };
    });
    $(".FillDVendorAccount").autocomplete({
        position: { my: "left bottom", at: "left top", collision: "flip" },
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //$(this).removeAttr('name');
            }
        }
    })
}

function funCancelVendor() {
    //FunCancelVen();
    // location.reload('true');   
    VenCan = 1;
    window.location.href = 'Vendors';
}

//================RemmitAddres Copy==============//

function FunUseRemit() {
    if ($('#chkAddstoW').is(':checked')) {
        var txtCountry = $('#txtRemitCountry').attr('name');
        var txtCountryNAme = $('#txtRemitCountry').val();
        var txtAddrs1 = $('#txtRemitAddress1').val();
        var txtAddrs2 = $('#txtRemitAddress2').val();
        var txtAddrs3 = $('#txtRemitAddress3').val();
        var txtCity = $('#txtRemitCity').val();
        var txtState = $('#txtRemitState').attr('name');
        var txtStateNAme = $('#txtRemitState').val();
        var txtZip = $('#txtRemitZip').val();

        $('#txtW9Country').val(txtCountryNAme);
        $('#txtW9Country').attr('name', txtCountryNAme);
        $('#txtW9Address1').val(txtAddrs1);
        $('#txtW9Address2').val(txtAddrs2);
        $('#txtW9Address3').val(txtAddrs3);
        $('#txtW9City').val(txtCity);
        $('#txtW9State').val(txtStateNAme);
        $('#txtW9State').attr('name', txtState);
        $('#txtW9Zip').val(txtZip);
        $('#txtW9Country').prop("disabled", true);
        $('#txtW9Address1').prop("disabled", true);
        $('#txtW9Address2').prop("disabled", true);
        $('#txtW9Address3').prop("disabled", true);
        $('#txtW9City').prop("disabled", true);
        $('#txtW9State').prop("disabled", true);
        $('#txtW9Zip').prop("disabled", true);
    } else { 
        /*
        $('#txtW9Country').val('');
        $('#txtW9Country').removeAttr('name');
        $('#txtW9Address1').val('');
        $('#txtW9Address2').val('');
        $('#txtW9Address3').val('');
        $('#txtW9City').val('');
        $('#txtW9State').val('');
        $('#txtW9State').removeAttr('name');
        $('#txtW9Zip').val('');*/
        $('#txtW9Country').prop("disabled", false);
        $('#txtW9Address1').prop("disabled", false);
        $('#txtW9Address2').prop("disabled", false);
        $('#txtW9Address3').prop("disabled", false);
        $('#txtW9City').prop("disabled", false);
        $('#txtW9State').prop("disabled", false);
        $('#txtW9Zip').prop("disabled", false);
        $('#txtW9Country').focus();
    }
}

//==================ShowAdditional Info=================//
function showDivOfInfo() {
    $('#DivVendorInfo').attr('Style', 'Display:block');

}

//=================InertUpdateVendoreInfo================//
function InsertUpdateVendorsInfo(VendorId) {
    formmodified = 0;
    StrVerndorInfoID = $('#txtAddVendor').val();
    if (StrVendorID == 0) {
        StrVendorID = $('#txtAddVendor').val();
    } else { }

    var strType = $('.clsVendorType');
    var strvalue = $('.clsVendorValue');
    var ObjArr = [];
    for (var i = 0; i < strType.length; i++) {
        var obj = {
            vendorInfoId: 0,
            VendorID: VendorId,
            ContactInfoType: (strType[i].textContent).trim(),
            VendorContInfo: (strvalue[i].textContent).trim(),
            CreatedBy: localStorage.UserId,
            ProdID: localStorage.ProdId
        }
        ObjArr.push(obj);
    }

    if (strType.length > 0) {
        $.ajax({
            url: APIUrlInsrtVendorsInfo,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjArr),
        })
        .done(function (response) {
            InsertUpdateVendorsInfoSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function InsertUpdateVendorsInfoSucess(response) {
    ShowMsgBox('showMSG', ' Vendor Info Saved ..!!', '', '');
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlGetVendoreByProdId + '?SortBy=' + 'All' + '&ProdID=' + localStorage.ProdId
            , 'doneFunction': undefined
            , 'objFunctionParameters': {
            }
        }
    );
}

//=================GetVendoreInfo=======================//
function funGetVendorsContInfo() {
    $.ajax({
        url: APIUrlGetVendorsCInfo + '?VendorID=' + StrVendorID + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVendorsContInfoSucess(response);
    })
    .fail(function (error) { 
        ShowMSG(error); })
}

function GetVendorsContInfoSucess(response) {
    var strhtml = "";
    StrGetResponseType = response;
    var tcount = response.length;
    for (var i = 0; i < tcount; i++) {
        var vendorInfoId = response[i].VendorID;
        var ContactType = response[i].ContactInfoType;
        var VendorInfo = response[i].VendorContInfo;
        strhtml += '<tr id="strCon_' + ContactInfoCount + '">';
        strhtml += '<td><span class="clsVendorType" id= "SpanConInfo"> ' + ContactType + '</span></td>';
        strhtml += '<td><span class="clsVendorValue" id="SpanConType"> ' + VendorInfo + '</span><span class="crossBtn" onclick="funDelete(' + ContactInfoCount + ')"></span></td>';
        strhtml += '</tr>';
    }
    ContactInfoCount++;
    $('#tblVendoreInfoTBody').html(strhtml);
    $('#txtAddVendorName').focus();
}

function funddlChange() {
    var strclass = $('.clsVendorType');

    for (var i = 0; i < strclass.length; i++) {
        var strval = strclass[i].innerText;
        if (strval == $('#txtSelectInfo').val()) {
            $('#txtSelectInfo').html('<option value="select">select</option>');
            $('#txtSelectInfo').append('<option value="Phone">Phone</option><option value="Fax">Fax</option><option value="Email">Email</option><option value="Skype">Skype</option><option value="Name">Name</option>');

        }
    }
    $('#txtAddInfo').val('');
    var strval = $('#txtSelectInfo').val();
    if (strval == 'Phone') {
        $('#txtAddInfo').addClass('form-control phone_us field-Req');
    } else if (strval == 'Email') {
    }
}

function funInsertintoTable() {

    var strddl = $('#txtSelectInfo').val();
    var strval = $('#txtAddInfo').val();
    var strCheck = $('.clsVendorType');
    var ObjArr = [];
    for (var i = 0; i < strCheck.length; i++) {
        var obj = {
            strVInfo: strCheck[i].textContent,
            // alert(fff);
        }
    }
    ObjArr.push(obj);

    if ($("#txtAddInfo").val() !== '' && strddl !== 'Select' && ObjArr.strVInfo !== 'Name' && ObjArr.strVInfo !== 'Skype' && ObjArr.strVInfo !== 'Email' && ObjArr.strVInfo !== 'Phone' && ObjArr.strVInfo !== 'Fax') {
        var strhtml = '';
        strhtml += '<tr id="strCon_' + ContactInfoCount + '">';
        strhtml += '<td><span class="clsVendorType" id= "SpanConInfo"> ' + strddl + '</span></td>';
        strhtml += '<td><span class="clsVendorValue" id="SpanConType"> ' + strval + '</span><span class="" onclick="funDelete(' + ContactInfoCount + ')" style="font-size: 20px;float: right;color:red;"><i class="fa fa-times" aria-hidden="true"></i></span></td>';
        strhtml += '</tr>';
        $('#tblVendoreInfoTBody').append(strhtml);
        ContactInfoCount++;
    }
    $('#txtAddInfo').val('');
    $('#txtSelectInfo').val('select');
}
function funDelete(value) {
    $('#strCon_' + value).remove();

}

//=================Get Transaction  Detail
function GetTransactionCode() {
    $.ajax({
        url: APIUrlGetTransactionCode + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { GetTransactionCodeSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetTransactionCodeSucess(response) {
    var strHtml = '';
    strHtml += '<tr>';
    // strHtml += '<th></th>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'Detail') {
            strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
        }
        else {
            strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
        }
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < response.length; i++) {
        var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }
        ArrTransCode.push(obj);
        strHtml += '<th>' + response[i].TransCode + '</th>';

    }
    strHtml += '<th style="display:none;"></th>';
    //strHtml += '<th>Credit</th>';
    //strHtml += '<th>Vendor</th>';
    //strHtml += '<th>3P</th>';
    //strHtml += '<th style="width:70px;">Notes</th>';

    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);
    //  funTrCreate();

}

function funTrCreate() {
    var strhtml = '';

    strhtml += '<tr id="' + strTrCount + '" class="clsTr">';
    //  strhtml += '<td style="width:1px;"><span style=""><i class="" onclick="#"></i></span></td>'; /// strTrCount

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<td class="width40"><input type="text"  class="SearchCode   detectTab" onblur="javascript:GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" /></td>';

        }
        else {
            strhtml += '<td class="width40"><input type="text"  class="SearchCode   detectTab" onblur="javascript:GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:fun1Segment123(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" /></td>';
        }// ArrSegment[i].SegmentName + '_' + ArrSegment[i].SegmentId
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOtional' + strTrCount + '   " onblur="javascript:funCheckOptionalAutoFill(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + strTrCount + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" /></td>';
        // ArrSegment[i].SegmentName + '_' + ArrSegment[i].SegmentId
    }
    for (var i = 0; i < ArrTransCode.length; i++) {
        strhtml += '<td class="width40"><input type="text" onblur="javascript:funBlurTrans(' + strTrCount + ',\'' + ArrTransCode[i].TransCode + '\');" class="SearchCode clsTransCode' + strTrCount + '  clsTransCode_' + strTrCount + '" onfocus="javascript:funTransDetail(' + strTrCount + ',' + ArrTransCode[i].TransId + ')" id="txt_' + ArrTransCode[i].TransCode + '_' + strTrCount + '" name="' + ArrTransCode[i].TransId + '" /></td>';
    }
    strhtml += '<td style="display:none;"><input type="hidden" class="clsCOACode" id="hdnCode_' + strTrCount + '"><input type="hidden" class="clsCOAId" id="hdnCOAId_' + strTrCount + '"></td>';
    strhtml += '</tr>';
    $('#tblManualEntryTBody').html(strhtml);

    fillcompanyandlocation(strTrCount);
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO') {
            $('#txt_' + strTrCount + '_' + i).focus();
        }
    }
    // strTrCount++;
}

//===================segment

function funSegment(values, SegmentName, SegmentP) {
    GlbCOAList = [];
    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    }
    else {

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

  .done(function (response)
  { funSegmentSucess(response, values, SegmentP); })
  .fail(function (error)
  { console.log(error); })
}
function funSegmentSucess(response, values, SegmentP) {

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
    
    $('#txt_' + values + '_' + SegmentP).addClass('SearchCode');
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: function (request, response) {
            let matches = $.map(array, (item) => {
                if (item.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) {
                    return item;
        }
    });
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
        // $(this).val('');
        // $('#f').val('');
        //$(this).val('');
        //$(this).removeAttr('COACode');
        //$(this).removeAttr('COAId');

        //$('#hdnCode_' + values).val('');
        //$('#hdnCOAId_' + values).val('');

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
                //$('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
                //$('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);

            }
        }
    }
    else {
        //$('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
        //$('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);
    }
}

function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function funBlurTrans(value, Name) {
    //alert(value + '   ' + Name);
    if (GlbTransList.length == 0)
    { }
    else
        var strtextval = $('#txt_' + Name + '_' + value).val();

    if (strtextval != '') {
        for (var i = 0; i < GlbTransList.length; i++) {
            if (GlbTransList[i].TransValue.match(strtextval)) {
                // if (GlbTransList[i].TransValue == strtextval) {
                $('#txt_' + Name + '_' + value).val(GlbTransList[i].TransValue);
                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[i].TransactionValueID);
                break;
            }
            else {
                $('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);
            }
        }
    }
    else {
        //$('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
        //$('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);

    }
}

//============================================= Get Segment Detail
function GetSegmentsDetails() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + '0',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetSegmentListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetSegmentListSucess(response) {
    ArrSegment = [];
    for (var i = 0; i < response.length; i++) {

        var ObjSegment = {
            SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode
        }


        ArrSegment.push(ObjSegment);
        if (response[i].Classification == 'Detail') {
            break;
        }
    }

    var strval = 0;
    for (var i = 0; i < response.length; i++) {

        if (strval > 0) {
            var ObjSegment = {
                SegmentId: response[i].SegmentId, SegmentName: response[i].Classification, SegmentLevel: response[i].SegmentLevel
            }
            ArrOptionalSegment.push(ObjSegment);
        }
        if (response[i].Classification == 'Detail') {
            strval++;
        }

    }
    GetTransactionCode();
}
function GetOptional(values, SegmentName, SegmentP) {
    //var SegmentName = 'Set';
    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + SegmentName,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetOptionalSucess(response, values); })
.fail(function (error)
{ ShowMSG(error); })

}
function GetOptionalSucess(response, values) {
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
    $(".SearchOptionalCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('AccountID', ui.item.value);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('AccountID', ui.item.value);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {


            }
        }
    })
}
function funTransDetail(values, TransId) {
    $.ajax({
        url: APIUrlTranscationCode + '?TransactionCodeID=' + TransId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { TransDetailSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function TransDetailSucess(response) {
    GlbTransList = [];
    GlbTransList = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$(this).removeAttr('TransValueId');
                //$(this).val('');
            }
        }
    })
}

//==================GetAllTransEPisode===========//
function GetTransEpi() {
    var strTr = $('.clsTr');
    var strCOACode = $('.clsCOACode');
    for (var i = 0; i < strTr.length; i++) {
        var strId = strTr[i].id;
    }
}

$('#ChkWarning').click(function () {
    GetTransEpi();
})

//============TaxEpiration==================//
function FunTaxEpiration() {
    if ($('#chkTaxOF').is(':checked')) {
        $('#TaxFormExpiry').prop("disabled", false);
        $('#TaxFormExpiry').blur();
    } else {
        $('#TaxFormExpiry').prop("disabled", true);
        $('#TaxFormExpiry').val('');
        $('#TaxFormExpiry').removeClass('field-Req');
        $('#TaxFormExpiry').notify('');
    }
}

const ValdateW9Date = function() {
    $(this).removeClass('field-Req');
    let thedate = moment(this.value, 'MM/DD/YYYY').format('MM/DD/YYYY');
    if (thedate.toUpperCase() === 'INVALID DATE') { // moment.isValid doesn't work properly for a value like 33, which is invalid
        this.value = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
    } else {
        this.value = thedate;
    }

    if (moment(thedate).isBefore(new Date().toLocaleDateString())) {
        $(this).notify('Please supply a valid future expiration date', { position: 'right top', autoHide: false });
        $(this).addClass('field-Req');
    }
}
const ResetFieldNotify = function () {
    $(this).notify('');
}

$('#TaxFormExpiry')
    .blur(ValdateW9Date)
    .focus(ResetFieldNotify)
;

//==============WarnCheckBox=============//
function FunRequiredChk() {
    if ($('#ChkWarning').is(':checked')) {
        $('#ChkWarning').prop("checked", false);
    }
    else {
        // $('#ChkWarning').prop("disabled", false);

    }

}

function FunWarnChk() {
    if ($('#ChkRequired').is(':checked')) {
        $('#ChkRequired').prop("checked", false);
    }
    else {
        // $('#ChkRequired').prop("disabled", false);
    }

}
//=============CancelConfirm============//

$(document).ready(function () {
    GetTaxCodeList();
    formmodified = 0;
    $('form *').change(function () {
        formmodified = 1;
    });
    window.onbeforeunload = confirmExit;
    function confirmExit() {
        if (formmodified == 1) {
            if (VenCan == 1) {
                return "Cancel is not reversible.";
            }
            else {
                return "Your data will be lost. ";
            }
        }
    }
    $("input[name='commit']").click(function () {
        formmodified = 0;
    });
});

function SelectVenType() {
    $('#ChkRequired').prop("checked", false);
    $('#ChkWarning').prop("checked", false);
    var strval = $('#txtTaxtype').val();
    if (strval == 'C-Corp') {

        $('#txtAddDefltForm').val('');

    }
    else if (strval == 'S-Corp') {

        $('#txtAddDefltForm').val('');

    }
    else if (strval == '') {

        $('#txtAddDefltForm').val('1099');

    }
    else {
        $('#txtAddDefltForm').val('1099');
    }
}

//======================================================//

function fun1Segment123(values, SegmentName, SegmentP) {
    GlbCOAList = [];
    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    }
    else {

        PreSegment = SegmentP - 1;
    }
    var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
    //txt_0_Company

    $.ajax({
        url: APIUrl12GetCOA123 + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { fun1Segment123Sucess(response, values, SegmentP); })
  .fail(function (error)
  { console.log(error); })
}
function fun1Segment123Sucess(response, values, SegmentP) {

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
                // $(this).val('');
                // $('#f').val('');
                //$(this).val('');
                //$(this).removeAttr('COACode');
                //$(this).removeAttr('COAId');

                //$('#hdnCode_' + values).val('');
                //$('#hdnCOAId_' + values).val('');

            }
        }
    })
}
//===============Select Default Company=================//
function FillCompanyFirst() {
    AtlasCache.CacheORajax(
    {
        'URL': APIUrlFillCompanyFirst + '?ProdId=' + localStorage.ProdId
        , 'doneFunction': FillCompanyFirstSucess
        , 'objFunctionParameters': {
        }
    }
);
    return;

    $.ajax({
        url: APIUrlFillCompanyFirst + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillCompanyFirstSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function FillCompanyFirstSucess(response) {
    strResponse = response;
}

function fillcompanyandlocation(strTrCount) {
    return;

    if (strResponse.length == 1) {
        $('#txt_' + strTrCount + '_0').attr('coacode', strResponse[0].COCOA);
        $('#txt_' + strTrCount + '_0').val(strResponse[0].COCOA);
        $('#txt_' + strTrCount + '_0').attr('name', 'CO');
        $('#txt_' + strTrCount + '_0').attr('coaid', strResponse[0].COCOAID);

        $('#txt_' + strTrCount + '_1').attr('coacode', strResponse[0].LOCOA);
        $('#txt_' + strTrCount + '_1').val(strResponse[0].Location);
        $('#txt_' + strTrCount + '_1').attr('name', 'LO');
        $('#txt_' + strTrCount + '_1').attr('coaid', strResponse[0].LOCOAID);

        $('#hdnCOAId_' + strTrCount).val(strResponse[0].LOCOAID);
        $('#hdnCOAId_' + strTrCount).val(strResponse[0].LOCOA);
    } else {

    }
}

function FunVendorsCheckExisting(fieldName,fieldValue) {
    if (fieldValue === '') { return; }
    var apiURL = APIUrlAPVendorsCheckExisting + '?JSONparameters={ "field to check name":"' + fieldName + '" , "field to check value":"' + fieldValue + '" , "existing record":' + StrVendorID + '}';
    //   console.log(apiURL);
    $.ajax({
        url: apiURL,
        cache: false,
        beforeSend: function (request) { request.setRequestHeader("Authorization", localStorage.EMSKeyToken); },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        async:false
    })
    .done(function (response) { 
        var vObj = JSON.parse(response)['existing record'];
        if (parseInt(vObj) > 0) {
            if (StrVendorID != vObj) {
                switch (fieldName) {
                    case 'VendorNumber':
                        $('#txtAddVendor').val(''); // Vendor Number is not allowed to be duplicate
                        $('#spnMsg').html('ERROR\: Vendor Number ' + fieldValue + ' is already in use. You must use a different Vendor Number');
                        CheckExistingFocusAfter = 'txtAddVendor';
                        console.log('1');
                        break;
                    case 'VendorName':
                        //                        $('#txtAddVendorName').val('');
                        // $('#txtPrntCheck').val('');
                        $('#spnMsg').html('WARNING\: Vendor Name ' + fieldValue + ' already exists.');
                        CheckExistingFocusAfter = 'txtPrntCheck';
                        //$('#dvVendorNotification').show();
                        //$('#fade').show();
                        console.log('2');

                        break;
                    case 'TaxID':
                        //                        $('#txtAddTaxID').val('');
                        $('#spnMsg').html('WARNING\: TaxID ' + fieldValue + ' is already in use.');
                        CheckExistingFocusAfter = 'txtTaxtype';
                        console.log('3');

                        break;
                }
                $('#dvVendorNotification').show();
                $('#fade').show();
                setTimeout(function () {
                    $("#VendorNotificationOK").focus();
                }, 100); // wait for Chrome to set focus properly
            }
        } else {
            console.log(fieldName + ' ' + fieldValue + ' Not Exist');
        }

        return true;
    })
    .fail(function (error) {
        ShowMSG(error);
        return false;
    })
}

function CheckVendorResetFocus()
{
    $('#dvVendorNotification').hide();
    $('#fade').hide();
    setTimeout(function () { $('#'+CheckExistingFocusAfter).focus(); }, 10);
}
function funTaxCode() {
    //clsTax
    var array = [];
    var ProductListjson = TaxCode1099;
    array = TaxCode1099.error ? [] : $.map(TaxCode1099, function (m) {
        return { label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(), };
    });
    $(".clsTax").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.value);
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
                }
                catch (er) {
                    $(this).val('');
                    console.log(er);
                }
            }
        }

    })
}
   
function ResetVendorForm() {
    StrVendorID = 0; // Set the global var for the VendorID back to 0 so that we know it's a new Vendor

    $("#chkAddstoW").prop("checked", true);
    $("#chkAddVendor").prop("checked", true);
    $('#breadcrumbVendorLi').text('');
    $('#VendorsAddTabLi').attr('style', 'display:none');
    $('#tabAddVendors').attr('style', 'display:block;');
    $('#tabVendors').attr('style', 'display:none;');
    $('#tabPurchaseOrders').attr('style', 'display:none;');
    $('#tabAddPO').attr('style', 'display:none;');
    $('#VendorsAddTabLi').addClass('active');
    $('#VendorsTabLi').removeClass('active');
    $('#VendorsPOTabLi').removeClass('active');
    $('#VendorsADDPOTabLi').removeClass('active');
    $('#btnsavevendor').attr('style', 'display:block;');
    $('#VendorsADDPOTabLi').attr('style', 'display:none');
    $('#btnCancelvendor').attr('style', 'display:block');
}

function ContactInfo_Clear() {
    $('#tblVendoreInfoTBody').html('');
    ContactInfoCount = 0;
}
