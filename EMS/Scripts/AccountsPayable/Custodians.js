var APIUrlCheckCustodianDuplicacy = HOST + "/api/POInvoice/CheckCustodianDuplicacy";
var APIUrlInsertupdateCustodian = HOST + "/api/POInvoice/InsertupdateCustodian";
var APIUrlGetListOfCustodian = HOST + "/api/POInvoice/GetListOfCustodian";

var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorListForCustodian";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlGetCOACustodian = HOST + "/api/POInvoice/GetCoaDetailforCustodian";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";

var APIUrlFillCompanyFirst = HOST + "/api/AccountPayableOp/GetDedaultCOLO";
var APIUrlGetLocationByLoc = HOST + "/api/Ledger/GetCOABySegmentPosition";
var retriveSegment = [];

var GetVendorNamePO = [];
var GlbCOAList = [];
var GblOptionalCOA = [];
var StrNewLine = 0;
var strResponse = [];

$(document).ready(function () {
    $('#navMainUL li').removeClass('active');
    $('#hrefPayable').parent().addClass('active');
    $('#UlAccountPayable li').removeClass('active');
    $('#LiPettyCash').addClass('active');

    retriveSegment = JSON.parse(localStorage.ArrSegment).filter((e, i) => { return e.SegmentClassification.toUpperCase() !== 'SET'; })//$.parseJSON(localStorage.ArrSegment);
    CreateThead();
    CustodianList();
    // FillCompanyFirst();
    FillCompanyFirst();
})

function CreateThead() {
    strhtml = '';
    strhtml += '<tr>';
    strhtml += '<th class="second"><div class="th-inner">Active</div> </th>';
    strhtml += '<th class="third"><div class="th-inner">Custodian Code</div></th>';
    strhtml += '<th class="second"><div class="th-inner">Currency</div></th>';
    strhtml += '<th class="second"><div class="th-inner">Vendor</div></th>';

    for (var i = 0; i < retriveSegment.length; i++) {
        strhtml += '<th class="third"><div class="th-inner">' + retriveSegment[i].SegmentName + '</div></th>';
    }

    strhtml += '<th class="third"><div class="th-inner">Action</div></th>';
    strhtml += '</tr>';

    $('#tblCustodiansThead').html(strhtml);
}

//================================================= Get Custodian List
function CustodianList() {
    $('#tblCustodiansTBody').html('');
    $.ajax({
        url: APIUrlGetListOfCustodian + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CustodianListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function CustodianListSucess(response) {
    var strhtml = '';

    for (var j = 0; j < response.length; j++) {
        funAddNew(0);

        if (response[j].Status == false) {
            $('#chk_' + j).prop('checked', false);
            $('#chk_' + j).prop('disabled', true);
        } else {
            $('#chk_' + j).prop('disabled', true);
        }

        $('#txtCode_' + j).val(response[j].CustodianCode);
        $('#txtCode_' + j).prop('disabled', true);

        $('#txtUSD_' + j).val(response[j].Currency);

        $('#txtVendor_' + j).val(response[j].VendorName);
        $('#txtVendor_' + j).attr('vendorid', response[j].VendorID);
        $('#txtVendor_' + j).prop('disabled', true);

        $('#hdnCOACode_' + j).val(response[j].COACode);
        $('#hdnCOAId_' + j).val(response[j].COAID);
        $('#hdnCustodianId_' + j).val(response[j].CustodianID);
        var strCoaCode = response[j].COACode;
        var strsplit = strCoaCode.split('|');
        var strCOAPval = '';
        for (var i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].Type == 'SegmentRequired') {
                if (i == 0) { strCOAPval = strsplit[0]; }
                else if (i == 1) { strCOAPval = strsplit[0] + '|' + strsplit[1]; }
                else if (i == 2) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2]; }
                else if (i == 3) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3]; }
                else if (i == 4) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4]; }
                else if (i == 5) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4] + '|' + strsplit[5]; }

                if (retriveSegment[i].SegmentName == 'DT') {
                    var stsplit = strsplit[i].split('>');
                    var strlength = stsplit.length;
                    strlength = strlength - 1;
                    $('#txt_' + j + '_' + i).attr('coacode', strCOAPval);
                    $('#txt_' + j + '_' + i).val(stsplit[strlength]);
                    $('#txt_' + j + '_' + i).prop('disabled', true);

                } else {
                    $('#txt_' + j + '_' + i).attr('coacode', strCOAPval);
                    $('#txt_' + j + '_' + i).val(strsplit[i]);
                    $('#txt_' + j + '_' + i).prop('disabled', true);

                }
            }
        }

        $('#txtOptional_' + j + '_0').attr('accountid', response[j].Setid);
        $('#txtOptional_' + j + '_0').val(response[j].SetCode);
        $('#txtOptional_' + j + '_0').prop('disabled', true);

        $('#txtOptional_' + j + '_1').attr('accountid', response[j].SeriesID);
        $('#txtOptional_' + j + '_1').val(response[j].SeriesCode);
        $('#txtOptional_' + j + '_1').prop('disabled', true);

    }

    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#DvTB').attr('style', 'height:' + heightt + 'px;');
}

//================================================= Add New Row
function funAddNew(value) {
    if (StrNewLine == 0) {
        var strI = $('#tblCustodiansTBody tr').length;
        StrSaveTrNo = strI;
        var strhtml = '';

        strhtml += '<tr id=' + strI + '>';
        strhtml += '<td class="width40"><input type="checkBox" id="chk_' + strI + '" checked/></td>';
        strhtml += '<td class="width40"><input type="text" id="txtCode_' + strI + '"  class="form-control detect' + strI + '" onblur="javascript:funCheckCode(' + strI + ');"/></td>';
        strhtml += '<td class="width40"><input type="text" id="txtUSD_' + strI + '" class="form-control detect' + strI + '" disabled value="USD" /></td>';
        strhtml += '<td class="width100"><input type="text" id="txtVendor_' + strI + '" class="form-control SearchVendor detect' + strI + '" VendorId="" onfocus="javascript:FillVendor(' + strI + ');"/></td>';
        for (var i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].Type === 'SegmentRequired') {
                if (retriveSegment[i].SegmentName === 'DT') {
                    strhtml += `<td class="width100"><input type="text" class="input-segment ${retriveSegment[i].SegmentName} form-control detect${strI} input-required" onblur="javascript:GetSegmentValue(${strI},'${retriveSegment[i].SegmentName}',${i});" onfocus="javascript:AtlasUtilities.BuildDetailSegmentAutoComplete('${strI}','${retriveSegment[i].SegmentName}',{SegmentP:'${i}',UnusedONLY:true}, this, true);" id="txt_${strI}_${i}" name="${retriveSegment[i].SegmentName}" /></td>`;  //Passing in additional parameter to force checking for unused accounts
                } else {
                    strhtml += `<td class="width40"><input type="text"  class="input-segment ${retriveSegment[i].SegmentName} form-control detect${strI} input-required" onblur="javascript:GetSegmentValue(${strI},'${retriveSegment[i].SegmentName}',${i});" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strI},'${retriveSegment[i].SegmentName}',${i}, this);" id="txt_${strI}_${i}" name="${retriveSegment[i].SegmentName}" /></td>`;
                }
            }
        }

        strhtml += '<td style="display:none;"><input type="hidden" id="hdnCOAId_' + strI + '" value="0"/><input type="hidden" id="hdnCOACode_' + strI + '" value="0"/><input type="hidden" id="hdnCustodianId_' + strI + '" value="0"/></td>';

        var strCount = 0;
        for (var i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].Type != 'SegmentRequired') {
                strhtml += '<td class="width40"><input type="text"  class="form-control   detectTab " onblur="javascript:funCheckOptionalAutoFill(' + strI + ',\'' + retriveSegment[i].SegmentName + '\',' + strCount + ');" onfocus="javascript:GetOptional(' + strI + ',\'' + retriveSegment[i].SegmentName + '\',' + strCount + ');" id="txtOptional_' + strI + '_' + strCount + '" name="' + retriveSegment[i].SegmentName + '" /></td>';
                strCount++;
            }
        }
        let editdisplay = 'none';

        if (value == -1) {
            strhtml += '<td class="width40"><span id="SpnSave_' + strI + '" style="display:inline;"><a href="javascript:Save(' + strI + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i> Save</a></span>';
            //strhtml += '<span style="display:none;" id="spnEdit_' + strI + '"><a href="#" onclick="javascript:funEditOther(' + strI + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span>';
        } else {
            editdisplay = 'inline';
            strhtml += '<td class="width40"><span id="SpnSave_' + strI + '" style="display:none;"><a href="javascript:Save(' + strI + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i> Save</a></span>';
            //strhtml += '<span id="spnCancel_' + strI + '" style="display:none;"><a href="javascript:funCancelRow(' + strI + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
        }// strhtml += '<span><a onclick="javascript:funDelete(3,L);" class="btn btn-primary"><i class="fa fa-trash-o"></i></a></span></td>';
        strhtml += '<span id="spnCancel_' + strI + '" style="display:none;"><a href="javascript:funCancelRow(' + strI + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
        strhtml += '<span style="display:' + editdisplay + ';" id="spnEdit_' + strI + '"><a href="#" onclick="javascript:funEditOther(' + strI + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i> Edit</a></span>';
        strhtml += '</tr>';

        $('#tblCustodiansTBody').append(strhtml);

        if (value == -1) {
            fillcompanyandlocation(strI);

            $('#txtCode_' + strI).focus();
            StrNewLine++;
        }
    } else {
    }
}

//================================================= Check Duplicacy
function funCheckCode(value) {
    if ($('#txtCode_' + value).val().trim() != '') {
        var strId = $('#hdnCustodianId_' + value).val();
        $.ajax({
            url: APIUrlCheckCustodianDuplicacy + '?CustodianID=' + strId + '&CustodianCode=' + $('#txtCode_' + value).val().trim() + '&ProdId=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            funCheckCodeSucess(response, value);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function funCheckCodeSucess(response, value) {
    if (response == 1) {
        $('#txtCode_' + value).val('');
        ShowMsgBox('showMSG', 'Custodian Name already exists.. !!', '', '');
    }

}

//================================================= Save 
function Save(value) {
    // StrSaveTrNo
    var isvalid = '';
    var strClass = $('.detect' + value);
    for (var i = 0; i < strClass.length; i++) {
        var strId = strClass[i].id;
        var strvalue = strClass[i].value;

        if (strvalue == '') {
            $('#' + strId).attr('style', 'border-color: red;');
            isvalid = isvalid + 1;
        }
    }

    if (isvalid == '') {
        SaveCustodian(value);
    }
}

function SaveCustodian(value) {
    var StrSaveTrNo = value;
    let DetailSegmentIndex = (function () {
        for (let i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].SegmentClassification === 'Detail') { return i; break; }
        }
    })();

    var Obj = {
        CustodianID: $('#hdnCustodianId_' + StrSaveTrNo).val(),
        CustodianCode: $('#txtCode_' + StrSaveTrNo).val().trim(),
        Currency: 'USD',
        VendorID: $('#txtVendor_' + StrSaveTrNo).attr('VendorId'),
        COAID: $('#hdnCOAId_' + StrSaveTrNo).val(),
        //        COACode: $('#hdnCOACode_' + StrSaveTrNo).val(),
        COACode: $('#txt_' + StrSaveTrNo + '_' + DetailSegmentIndex).attr('COACode'),
        Setid: $('#txtOptional_' + StrSaveTrNo + '_0').attr('accountid'),
        SeriesID: $('#txtOptional_' + StrSaveTrNo + '_1').attr('accountid'),
        Prodid: localStorage.ProdId,
        CompanyID: 0,
        Createdy: localStorage.UserId,
        Status: $('#chk_' + StrSaveTrNo).prop('checked')
    }

    $.ajax({
        url: APIUrlInsertupdateCustodian,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(Obj),
    })
    .done(function (response) {
        SaveCustodianSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function SaveCustodianSucess(response) {
    CustodianList();
    StrNewLine = 0;
}

//================================================== Segment
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
    if (SegmentName != 'DT') {
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
    } else {
        var strCustodianId = $('#hdnCustodianId_' + values).val();
        if (strCustodianId == '') {
            strCustodianId = 0;
        }

        $.ajax({
            url: APIUrlGetCOACustodian + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&CustodianId=' + strCustodianId,
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
}

function funSegmentSucess(response, values, SegmentP) {
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
            $('#hdnCOACode_' + values).val(ui.item.value);
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

function funCheckNextValue(values, SegmentName, SegmentP) {
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');
    var strval = $('#txt_' + values + '_' + SegmentP).val();
    var strStatus = 1;
    var strhidden = $('#hdnCOACode_' + values).val();
    var strsplit = strhidden.split('|');
    for (var i = 0; i <= SegmentP; i++) {
        if (i == SegmentP) {
            if (strval == strsplit[i]) {
                strStatus = 0;
            }
        }
    }

    if (strStatus == 0) {
    } else {
        if (GlbCOAList.length > 0) {
            var strstatus = true;
            var strval = $('#txt_' + values + '_' + SegmentP).val();
            if (strval != '') {
                for (var i = 0; i < GlbCOAList.length; i++) {
                    //if (GlbCOAList[i].COANo.match(strval)) {
                    if (strval == GlbCOAList[i].COANo) {
                        $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[i].COANo);
                        $('#txt_' + values + '_' + SegmentP).attr('COACode', GlbCOAList[i].COACode);
                        $('#txt_' + values + '_' + SegmentP).attr('COAId', GlbCOAList[i].COAID);

                        $('#hdnCode_' + values).val(GlbCOAList[i].COACode);
                        $('#hdnCOAId_' + values).val(GlbCOAList[i].COAID);
                        break;
                    } else {
                        $('#txt_' + values + '_' + SegmentP).val('');
                        $('#txt_' + values + '_' + SegmentP).removeAttr('COACode');
                        $('#txt_' + values + '_' + SegmentP).removeAttr('COAId');

                        $('#hdnCode_' + values).val('');
                        $('#hdnCOAId_' + values).val('');
                        strstatus = false;
                    }
                }
            } else {
                $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[0].COANo);
                $('#txt_' + values + '_' + SegmentP).attr('COACode', GlbCOAList[0].COACode);
                $('#txt_' + values + '_' + SegmentP).attr('COAId', GlbCOAList[0].COAID);
                $('#hdnCode_' + values).val(GlbCOAList[0].COACode);
                $('#hdnCOAId_' + values).val(GlbCOAList[0].COAID);

            }

            if (strstatus == false) {
            } else {
            }

            var strValue = $('#txt_' + values + '_' + SegmentName).val();
            for (var i = SegmentP + 1; i < retriveSegment.length; i++) {
                var strSName = retriveSegment[SegmentP].SegmentName;
                $('#txt_' + values + '_' + i).val('');
            }
            $('#txt_' + values + '_' + SegmentP).removeAttr('style');
            $('#txt_' + values + '_' + SegmentP).attr('style', 'border-color:#d2d6de;');
        }
    }
}

//================================================== Segment Optional
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

//================================================== Vendor
function FillVendor(value) {
    $.ajax({
        url: APIUrlFillVendor + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillVendorSucess(response, value);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillVendorSucess(response, value) {
    GetVendorNamePO = [];
    GetVendorNamePO = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
        };
    });
    $(".SearchVendor").autocomplete({
        minLength: 0,
        autoFocus: true,
        source: array,
        //focus: function (event, ui) {
        //    $('#txtVendor_' + value).val(ui.item.label);
        //    $('#txtVendor_' + value).attr('vendorid', ui.item.value);
        //    return false;
        //},
        select: function (event, ui) {
            $('#txtVendor_' + value).val(ui.item.label);
            $('#txtVendor_' + value).attr('vendorid', ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}

function VendorCheck(value) {
    var StrCheckVendorName = $('#txtVendor').val().trim();
    var strStatus = 0;

    if (StrCheckVendorName != '') {
        for (var i = 0; i < GetVendorNamePO.length; i++) {
            if (GetVendorNamePO[i].VendorName == StrCheckVendorName) {
                $('#txtVendor_' + value).val(GetVendorNamePO[i].VendorName);
                $('#txtVendor_' + value).attr('vendorid', GetVendorNamePO[i].VendorName);

                strStatus++;
                break;
            }
        }

        for (var i = 0; i < GetVendorNamePO.length; ++i) {
            if (GetVendorNamePO[i].VendorName.substring(0, StrCheckVendorName.length) === StrCheckVendorName) {
                $('#txtVendor_' + value).val(GetVendorNamePO[i].VendorName);
                $('#txtVendor_' + value).attr('vendorid', GetVendorNamePO[i].VendorName);
                strStatus++;
                break;
            }
        }
    } else {
        $('#txtVendor').focus();
        strStatus++;
    }

    if (strStatus == 0) {
        $('#txtVendor_' + value).val('');
        $('#txtVendor_' + value).removeAttr('vendorid');
    }
}

function funEditOther(values) {
    $('#SpnSave_' + values).show();
    $('#spnCancel_' + values).show();
    $('#spnEdit_' + values).hide();

    $('#chk_' + values).prop('disabled', false);

    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type == 'SegmentRequired') {
            //  $('#txt_' + values + '_' + i).prop('disabled', false);
        }
    }
    $('#txtOptional_' + values + '_0').prop('disabled', false);
    $('#txtOptional_' + values + '_1').prop('disabled', false);
}

function funCancelRow(values) {
    $('#SpnSave_' + values).hide();
    $('#spnCancel_' + values).hide();
    $('#spnEdit_' + values).show();

    $('#chk_' + values).prop('disabled', true);
    $('#txtCode_' + values).prop('disabled', true);
    $('#txtVendor_' + values).prop('disabled', true);
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type == 'SegmentRequired') {
            $('#txt_' + values + '_' + i).prop('disabled', true);
        }
    }
    $('#txtOptional_' + values + '_0').prop('disabled', true);
    $('#txtOptional_' + values + '_1').prop('disabled', true);
}

$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        funAddNew(-1);
    }
});

//
//===============Fill DefaultCompanyLocation================//
function FillCompanyFirst() {
    $.ajax({
        url: APIUrlFillCompanyFirst + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillCompanyFirstSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    });
}

function FillCompanyFirstSucess(response) {
    strResponse = response;
}

function fillcompanyandlocation(val) {
    if (strResponse.length == 1) {
        $('#txt_' + val + '_0').attr('coacode', strResponse[0].COCOA);
        $('#txt_' + val + '_0').val(strResponse[0].COCOA);
        $('#txt_' + val + '_0').attr('name', 'CO');
        $('#txt_' + val + '_0').attr('coaid', strResponse[0].COCOAID);

        $('#txt_' + val + '_1').attr('coacode', strResponse[0].LOCOA);
        $('#txt_' + val + '_1').val(strResponse[0].Location);
        $('#txt_' + val + '_1').attr('name', 'LO');
        $('#txt_' + val + '_1').attr('coaid', strResponse[0].LOCOAID);

        $('#hdnCOAId_' + val).val(strResponse[0].LOCOAID);
        $('#hdnCOAId_' + val).val(strResponse[0].LOCOA);
    }
}