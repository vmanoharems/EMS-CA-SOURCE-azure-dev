var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetCompanyCode = HOST + "/api/Ledger/GetCompanyDetailForAccount";
var APIUrlGetAccountType = HOST + "/api/CompanySettings/GetAllAccountType"; //Account Type
var APIUrlAddCompanyDetail = HOST + "/api/Ledger/SaveCompnayAccounts";
var ApiUrlfunSaveOther = HOST + "/api/Ledger/InsertUpdateAccounts";
var ApiUrlCheckLedgerExistance = HOST + "/api/Ledger/CheckLedgerExistance";
var APIUrlGetTAByCategory = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlGetParentCode = HOST + "/api/Ledger/GetAllDetailOfTblAccount";
var APIUrlDetailTableCreate = HOST + "/api/Ledger/GetAccountDetailByProdId";
var APIUrlDeleteAccount = HOST + "/api/Ledger/DeleteTblAccountById";
var APIUrlfunGetDetailNoParent = HOST + "/api/Ledger/GetDetailAccountNoParent";


var strSegmentName = '';
var strIdno = 0;
var StrClassification = '';
var StrLength = 0;
var StrSegmentId = 0;
var strPublicTR = -1;
var strPublicParentId = 0;
var strAccountType = '';
var CurrentSegment = ''; //not use


var glbParentDetail = [];
var glbSegment = '';
var strAccountTypeForDetail = '';


$(document).ready(function () {
    $('#hrefNewAccountAdd').hide();
    GetSegmentsDetails();
});

function funAccounts() {
    $('#LiBreadCrumbName').text('G/L Setup');
}

function GetAccountType() {
    $.ajax({
        url: APIUrlGetAccountType + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
       
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
        .done(function (response)
        { GetAccountTypeByProdIdSucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
}
function GetAccountTypeByProdIdSucess(response) {
    for (var i = 0; i < response.length; i++) {
        strAccountType += '<option value=' + response[i].AccountTypeID + '>' + response[i].Code + '</option>';
    }
    for (var i = 0; i < response.length; i++) {
        if (response[i].Code != 'A' && response[i].Code != 'L') {
            strAccountTypeForDetail += '<option value=' + response[i].AccountTypeID + '>' + response[i].Code + '</option>';
        }
    }
    GetCompanyList();
}

function GetSegmentsDetails() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 1,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
      
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
    glbSegment = [];
    glbSegment = response;


    for (var i = 0; i < response.length; i++) {
        if (response[i].SegmentName != 'SubAccount') {
            if (i == 0) {
                $("#UlSegmentType").append('<li class="active" id="LiSegment_' + response[i].Classification + '" ><a href="#" onclick="javascript:funGetDetailsOfSegment(' + response[i].SegmentId + ',\'' + response[i].Classification + '\',\'' + response[i].CodeLength + '\');">' + response[i].SegmentCode + '</a></li>');
                StrClassification = response[i].Classification;
            }
            else {
                $("#UlSegmentType").append('<li class="" id="LiSegment_' + response[i].Classification + '"><a href="#" href="#" onclick="javascript:funGetDetailsOfSegment(' + response[i].SegmentId + ',\'' + response[i].Classification + '\',\'' + response[i].CodeLength + '\');">' + response[i].SegmentCode + '</a></li>');
            }
        }
    }
    GetAccountType();
}

function GetCompanyList() {
    $.ajax({
        url: APIUrlGetCompanyCode + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { GetCompanyCodeSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function GetCompanyCodeSucess(response) {
    $('#tblGLSetupThead').html('<tr><th class="third"> <div class="th-inner">Segment</div></th><th class="second"> <div class="th-inner">Ledger Type</div></th><th class="second"> <div class="th-inner">Name</div></th></tr>');

    var RCount = response.length;
    var strHtml = '';
    if (RCount > 0) {
        for (var i = 0; i < RCount; i++) {
            var CheckB = response[i].CheckB;
            strHtml += '<tr>';
            if (CheckB == 0) {
                strHtml += '<td>' + '<input type="checkBox" id="Chk_' + response[i].AccountCode + '" class="CompanyCheckBox" /><span style="color: #C1B9B9;    padding-left: 10px;">CO</span>' + '</td>';
            }
            else {
                strHtml += '<td>' + '<input type="checkBox" id="Chk_' + response[i].AccountCode + '" disabled checked /><span style="color: #C1B9B9;    padding-left: 10px;">CO</span>' + '</td>';

            }
            strHtml += '<td><span style="color: #C1B9B9;" id="spnAC_' + response[i].AccountCode + '">' + response[i].AccountCode + '</span></td>';
            strHtml += '<td><span style="color: #C1B9B9;" id="spnAN_' + response[i].AccountCode + '">' + response[i].AccountName + '</span></td>';
            strHtml += '</tr>';

        }
        $('#tblGLsetupTbody').html(strHtml);

    }
    else {
        $('#tblGLsetupTbody').html('<tr><td colspan="3" style="text-align: center;">No Record Found ...!!!</td></tr>');
        ShowMsgBox('showMSG', ' Please setup a Company under Settings before working with the Ledger.', '', '');
    }
}

function funGetDetailsOfSegment(values, Classification, Length) {
    $('#hrefNewAccountAdd').attr('style', 'display:inline');
    $('#hrefAddParent').hide();
    $('#spnDetail').removeAttr('style');
    $('#spnDetail').attr('style', 'color:#5a8ec0;');
   // $('#hrefAddParent').attr('style', 'display:none');
    $('#spnMaskingType').text(Length);
    //$('#DvMasking').attr('style', 'visibility:inline');
    //setTimeout(function () {
    //    $("#DvMasking").attr('style', 'visibility:hidden')
    //}, 2000);
    $('#aBuildBudget').attr('style', 'display:none;');
    StrSegmentId = values;
    StrLength = Length;

    $('#UlSegmentType li').removeClass('active');
    $('#LiSegment_' + Classification).addClass('active');
    strIdno = 0;
    StrClassification = Classification;
    $('#spnNewAddSegment').text(Classification);
    $('#hrefNewAccountAdd').show();
    strSegmentName = $('#LiSegment_' + values).text();

    if (Classification == 'Company')
    { $('#DvSaveCancel').show(); }
    else { $('#DvSaveCancel').hide(); }

    if (Classification == 'Company') {
        $('#hrefNewAccountAdd').hide();
        GetCompanyList();

    }
    else if (Classification == 'Ledger') {
        // $('#aBuildBudget').attr('style', 'display:block;'); /////////////////////////////////////////////////////// Budget   hide to here 
        $('#hrefNewAccountAdd').show();
        funGlTableCreate(Classification);
    }
    else if (Classification == 'Detail') {
        $('#hrefNewAccountAdd').show();
        funDetailTableCreate(Classification);
        funGetParentCode();
        $('#hrefAddParent').attr('style', 'margin-right: 0px;');   /// 40px;
    }
    else {
        //(Classification == 'Episode' || Classification == 'Set' || Classification == 'Location') 
        funEpisode(Classification);
    }
}
//-------------------------------------------------------------- Episode // Location // SET
function funEpisode(values) {
    PassDBName();
    $('#tblGLsetupTbody').html('');
    var strResponse = [];
    $.ajax({
        url: APIUrlGetTAByCategory + '?ProdId=' + localStorage.ProdId + '&Category=' + StrClassification,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response) {
     strResponse = response;
     funGLTableCreatOther(strResponse, values);
 })
 .fail(function (error)
 { ShowMSG(error); })



}
function funGLTableCreatOther(strResponse, values) {

    $('#tblGLSetupThead').html('<tr><th class="second"> <div class="th-inner">Segment</div></th><th class="second"> <div class="th-inner">Code</div></th><th class="second"> <div class="th-inner">Description</div></th><th class="second"> <div class="th-inner">Action</div></th></tr>');

    

    var strHtml = '';



    //strIdno++;
    var strHtml = '';
    strHtml += '<tr id="Tr_' + -1 + '" class="TrDisplayNone">';
    strHtml += '<td>' + '<span style="color: #C1B9B9;">' + strSegmentName + '</span>' + '<input type="hidden" id="hdnAccountId_' + -1 + '"></td>';
    strHtml += '<td><input type="text" class="clsCode checktextBoxval Width20" id="txtEpCode_' + -1 + '"  maxlength="' + StrLength + '"/></td>';
    strHtml += '<td><input type="text" id="txtEpDescrption_' + -1 + '" class="checktextBoxval" style="width:100%;"/></td>';
    strHtml += '<td><span id="SpnSave_' + -1 + '"><a href="javascript:funSaveOther(' + -1 + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + -1 + '" style="display:inline;"><a href="javascript:funcancelNewRow(' + -1 + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
    strHtml += '<span style="display:none;" id="spnEdit_' + -1 + '"><a href="#" onclick="javascript:funEditOther(' + -1 + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span>';
    strHtml += '</td>';
    strHtml += '</tr>';
    // $('#tblGLsetupTbody').append(strHtml);
    //
    if (strResponse.length > 0) {
        for (var i = 0; i < strResponse.length; i++) {
            strIdno = i;
            var AccountId = strResponse[i].AccountID;
            var AccountCode = strResponse[i].AccountCode;
            var AccountName = strResponse[i].AccountName;
            strHtml += '<tr>';
            strHtml += '<td>' + '<span style="color: #C1B9B9;">' + values + '</span><input type="hidden" id="hdnAccountId_' + strIdno + '" value="' + AccountId + '">' + '</td>';
            strHtml += '<td><input type="text" class="clsCode checktextBoxval Width20" id="txtEpCode_' + strIdno + '" maxlength="' + StrLength + '" value="' + AccountCode + '" disabled/><span id="spnCode' + strIdno + '" style="display:none;">' + AccountCode + '</span></td>';
            strHtml += '<td><input type="text" id="txtEpDescrption_' + strIdno + '" class="checktextBoxval" value="' + AccountName + '" style="width:100%;" disabled/><span id="spnDesc' + strIdno + '" style="display:none;">' + AccountName + '</span></td>';
            console.log(strResponse[i].Status);
            //if (strResponse[i].Status == false) {
            //    strHtml += '<td></td>';
            //} else {
                strHtml += '<td><span id="SpnSave_' + strIdno + '" style="display:none;"><a href="javascript:funSaveOther(' + strIdno + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + strIdno + '" style="display:none;"><a href="javascript:funCancelRow(' + strIdno + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
                strHtml += '<span style="display:inline;" id="spnEdit_' + strIdno + '"><a href="#" onclick="javascript:funEditOther(' + strIdno + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span><span><a onclick="javascript:funDelete(' + AccountId + ',\'' + values + '\');" class="btn btn-primary"><i class="fa fa-trash-o"></i></a></span>';
           // }
            strHtml += '</td>';
            strHtml += '</tr>';
        }

    }
    $('#tblGLsetupTbody').html(strHtml);

    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#DvTB').attr('style', 'height:' + heightt + 'px;');


}
//-------------------------------------------------------------- Add Row
function funAddRow() {
    if (StrClassification != 'Detail' && StrClassification != 'Ledger') {
        $('#Tr_' + -1).removeClass('TrDisplayNone');
        $('#txtEpCode_' + -1).focus();

    } else {
        if (StrClassification == 'Detail') {
            funAddRowDetail();

            // $('#Tr_' + -1).removeClass('TrDisplayNone');

        }
        else if (StrClassification == 'Ledger') {
            // funAddRowLeder();
            $('#Tr_' + -1).removeClass('TrDisplayNone');
            $('#txtGLCode_' + -1).focus();
        }

    }
    // }
}
//-------------------------------------------------------------- Detail Table
function funDetailTableCreate(values) {
    $("#preload").css("display", "block");
    $('#tblGLsetupTbody').html('');
    var strResponse = [];
    $.ajax({
        url: APIUrlDetailTableCreate + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response) {
     strResponse = response;
     funDetailTableCreateSuccess(strResponse, values);
 })
 .fail(function (error)
 { ShowMSG(error); })
    $('#tblGLSetupThead').html('<tr><th class="third"> <div class="th-inner">Segment</div></th><th class="second"> <div class="th-inner">Ledger Type</div></th><th class="second"> <div class="th-inner">Account Number</div></th><th class="second"> <div class="th-inner">AccountType</div></th><th class="second"> <div class="th-inner">Description</div></th><th class="second"> <div class="th-inner">Active</div></th> <th class="second"> <div class="th-inner">Sublevel</div></th><th class="second"> <div class="th-inner">Action</div></th> </tr>');

}
function funDetailTableCreateSuccess(strResponse, values) {
    //alert(strResponse);
    $('#spnDetail').attr('style', 'visibility:hidden');

    $("#preload").css("display", "block");
    var strHtml = '';
    var strRlength = strResponse.length;
    strHtml += '<tr id="' + -1 + '" class="TrDisplayNone" >';
    strHtml += '<td>' + '<span style="color: #C1B9B9;">' + strSegmentName + '</span><input type="hidden" id="hdnAccountId_' + -1 + '"></td>';
    strHtml += '<td><input type="text" id="ParentId_' + -1 + '" class=" SearchParentNo" onblur="javascript:funCheckLedgerExistance(' + -1 + ');" onkeypress="return isNumberKey(event)" onfocus="javascript:funGetParentCode(' + -1 + ');"/></td>';
    strHtml += '<td><input type="text" id="txtGLCode_' + -1 + '" class="clsCode Width70" onblur="javascript:CheckLedgerExistance(' + -1 + ');" /></td>';
    //onblur="javascript:funCheckLedgerExistance(' + -1 + ');"
    strHtml += '<td><select id="ddlAccountType_' + -1 + '" disabled>' + strAccountType + '</select></td>';

    strHtml += '<td><input type="text" id="txtGLDescription_' + -1 + '" style="width:100%;"/></td>';
    strHtml += '<td><input type="checkBox" id="ChkDetailPosting_' + -1 + '" checked/><input type="hidden" id="hdnParentId_' + -1 + '" /></td>';
    strHtml += '<td><span id="spnLeft_' + -1 + '" style=" margin-right: 5px;" > <i class="fa fa-chevron-left"></i></span>';
    strHtml += '<input type="text" id="txtSubLevel_' + -1 + '"  class="width30" disabled value="' + 1 + '"/>';
    strHtml += '<span id="spnRight_' + -1 + '" style=" margin-left: 5px;"> <i class="fa fa-chevron-right"></i></span></td>';
    strHtml += '<td><span id="SpnSave_' + -1 + '"><a href="javascript:funSaveDetail(' + -1 + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + -1 + '" style="display:inline;"><a href="javascript:funcancelNewRow(' + -1 + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
    strHtml += '<span style="display:none;" id="spnEdit_' + -1 + '"><a href="#" onclick="javascript:funEditOther(' + -1 + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span>';
    strHtml += '</tr>';
    if (strResponse.length > 0) {
        for (var i = 0; i < strResponse.length; i++) {
            var AccountId = strResponse[i].AccountID;
            var AccountCode = strResponse[i].AccountCode;
            var AccountName = strResponse[i].AccountName;
            var Posting = strResponse[i].Posting;
            var SubLevel = strResponse[i].SubLevel;
            var Code = strResponse[i].Code;
            var AccountTypeId = strResponse[i].AccountTypeId;

            var StrAccountType = '';
            if (AccountTypeId == 0) {
                StrAccountType = 'VisiblityHidden';
            }
            var ParentId = strResponse[i].ParentID;
            var ParentCode = strResponse[i].ParentCode;
            var strClass = '';
            if (SubLevel == 1) {
                strClass = 'VisiblityHidden';
                var Strspn = '';
            }
            if (SubLevel > 1) {

                if (SubLevel == 1) {
                    Strspn = '<span class="Indent" ><i class="fa fa-arrow-circle-right"></span></i>';
                }
                else if (SubLevel == 2) {
                    Strspn = '<span class="Indent-Indent" ><i class="fa fa-arrow-circle-right"></span></i>';
                }
                else if (SubLevel == 3) {
                    Strspn = '<span class="Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                }
                else if (SubLevel == 4) {
                    Strspn = '<span class="Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                }
                else if (SubLevel == 5) {
                    Strspn = '<span class="Indent-Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                }
                else if (SubLevel == 6) {
                    Strspn = '<span class="Indent-Indent-Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                }
            }

            strIdno = i;
            strHtml += '<tr id=' + strIdno + '>';
            strHtml += '<td>' + '<span style="color: #C1B9B9;">' + values + '</span><input type="hidden" id="hdnAccountId_' + strIdno + '" value="' + AccountId + '">' + '</td>';

            //            strHtml += '<td><input type="text"  id="txtGLCode_' + strIdno + '" class="clsCode" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" onkeypress="return isNumberKey(event)" value="' + AccountCode + '"/></td>';
            if (SubLevel == 1) {
                strHtml += '<td><input type="text" disabled id="ParentId_' + strIdno + '" class="SearchParentNo" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" value="' + ParentCode + '" name="' + ParentId + '" onfocus="javascript:funGetParentCode(' + strIdno + ');" /><span id="spnParent' + strIdno + '" style="display:none;">' + ParentCode + '</span></td>';
            }
            else {
                strHtml += '<td><input type="text" style="display:none;" id="ParentId_' + strIdno + '" class="clsCode SearchParentNo" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" onkeypress="return isNumberKey(event)" onfocus="javascript:funGetParentCode(' + strIdno + ');"/></td>';
            }
            strHtml += '<td>' + Strspn + '<input type="text" disabled id="txtGLCode_' + strIdno + '" value="' + AccountCode + '" class="clsCode Width70"/><span id="spnCode' + strIdno + '" style="display:none;">' + AccountCode + '</span> </td>';
            strHtml += '<td><select id="ddlAccountType_' + strIdno + '" disabled>' + strAccountType + '</select></td>';
            strHtml += '<td><input type="text" disabled  id="txtGLDescription_' + strIdno + '"/ value="' + AccountName + '" style="width:100%;"><span id="spnDesc' + strIdno + '" style="display:none;">' + AccountName + '</span></td>';
            if (Posting != null && Posting != false) {
                strHtml += '<td><input  type="checkBox" disabled id="ChkDetailPosting_' + strIdno + '" checked/><input type="hidden" id="hdnParentId_' + strIdno + '" value="' + ParentId + '" /><span id="spnPosting' + strIdno + '" style="display:none;">' + false + '</span></td>';
            }
            else {
                strHtml += '<td><input  type="checkBox" disabled id="ChkDetailPosting_' + strIdno + '" /> <input type="hidden" id="hdnParentId_' + strIdno + '" value="' + ParentId + '" /><span id="spnPosting' + strIdno + '" style="display:none;">' + true + '</span></td>';
            }
            strHtml += '<td><span id="spnLeft_' + strIdno + '" style=" margin-right: 5px;" class="' + strClass + '"> <i class="fa fa-chevron-left"></i></span>';
            strHtml += '<input type="text" disabled  id="txtSubLevel_' + strIdno + '" value="' + SubLevel + '" class="width30" disabled/>';
            strHtml += '<span id="spnRight_' + strIdno + '" style=" margin-left: 5px;"> <i class="fa fa-chevron-right"></i></span></td>';
            strHtml += '<td><span id="SpnSave_' + strIdno + '" style="display:none;"><a href="javascript:funSaveDetail(' + strIdno + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + strIdno + '" style="display:none;"><a href="javascript:funCancelRow(' + strIdno + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
            strHtml += '<span style="display:inline;" id="spnEdit_' + strIdno + '"><a href="#" onclick="javascript:funEditOther(' + strIdno + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span><a onclick="javascript:funDelete(' + AccountId + ',\'' + values + '\');" class="btn btn-primary"><i class="fa fa-trash-o"></i></a></span>';
            strHtml += '</tr>';
        }
    }

    $('#tblGLsetupTbody').html(strHtml);
    for (var i = 0; i < strResponse.length; i++) {
       // $("#ddlAccountType_" + i).val(strResponse[i].AccountTypeId);

        if ($("#ddlAccountType_" + i).find(":selected").text() == 'EX') {
            $('#ddlAccountType_' + i).attr('disabled', false);
            $('#ddlAccountType_' + i).html('');
            $('#ddlAccountType_' + i).html(strAccountTypeForDetail);

        }
        $('#ddlAccountType_' + i).val(strResponse[i].AccountTypeId);


    }
    $('#tblGLsetupTbody tr').click(function () {
        strPublicTR = $(this).closest('tr').attr('id');
        strPublicParentId = $('#hdnAccountId_' + strPublicTR).val();
        $('#tblGLsetupTbody tr').removeClass('TrColor');
        $('#' + strPublicTR).addClass('TrColor');
        if (strPublicTR != -1) {
            $('#spnDetail').removeAttr('style');
            $('#spnDetail').attr('style', 'color: #5a8ec0 !important;');
        }
        else {
            $('#spnDetail').attr('style', 'visibility:hidden;color: #5a8ec0 !important;');
        }
    })

    $("#preload").css("display", "none");

   funGetDetailNoParent(values, strRlength);
   

}

function funGetDetailNoParent(values, strRlength) {

    $.ajax({
        url: APIUrlfunGetDetailNoParent + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response) {

    funGetDetailNoParentSuccess(response, values, strRlength);
})
.fail(function (error)
{ ShowMSG(error); })
}
function funGetDetailNoParentSuccess(response, values, strRlength) {
    var strHtml = '';
    strResponse = response;
    for (var i = 0; i < strResponse.length; i++) {

        var AccountId = strResponse[i].AccountID;
        var AccountCode = strResponse[i].AccountCode;
        var AccountName = strResponse[i].AccountName;
        var Posting = strResponse[i].Posting;
        var SubLevel = strResponse[i].SubLevel;
        var Code = strResponse[i].Code;
        var AccountTypeId = strResponse[i].AccountTypeId;

        var StrAccountType = '';
        if (AccountTypeId == 0) {
            StrAccountType = 'VisiblityHidden';
        }
        var ParentId = strResponse[i].ParentId;
        var ParentCode = strResponse[i].ParentCode;
        var strClass = '';
        if (SubLevel == 1) {
            strClass = 'VisiblityHidden';
            var Strspn = '';
        }
        if (SubLevel > 1) {

            if (SubLevel == 1) {
                Strspn = '<span class="Indent" ><i class="fa fa-arrow-circle-right"></span></i>';
            }
            else if (SubLevel == 2) {
                Strspn = '<span class="Indent-Indent" ><i class="fa fa-arrow-circle-right"></span></i>';
            }
            else if (SubLevel == 3) {
                Strspn = '<span class="Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
            }
            else if (SubLevel == 4) {
                Strspn = '<span class="Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
            }
            else if (SubLevel == 5) {
                Strspn = '<span class="Indent-Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
            }
            else if (SubLevel == 6) {
                Strspn = '<span class="Indent-Indent-Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
            }
        }

        strIdno = strRlength + i;
        strHtml += '<tr id=' + strIdno + '>';
        strHtml += '<td>' + '<span style="color: #C1B9B9;">' + values + '</span><input type="hidden" id="hdnAccountId_' + strIdno + '" value="' + AccountId + '">' + '</td>';

        //            strHtml += '<td><input type="text"  id="txtGLCode_' + strIdno + '" class="clsCode" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" onkeypress="return isNumberKey(event)" value="' + AccountCode + '"/></td>';
        if (SubLevel == 1) {
            // strHtml += '<td><input type="text" disabled id="txtParentId_' + strIdno + '" class="SearchParentNo" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" value="' + ParentCode + '" name="' + ParentId + '" /><span id="spnParent' + strIdno + '" style="display:none;">' + ParentCode + '</span></td>';
            strHtml += '<td><input type="text" disabled id="ParentId_' + strIdno + '" class="SearchParentNo" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" onfocus="javascript:funGetParentCode(' + strIdno + ');" value="" name="" /><span id="spnParent' + strIdno + '" style="display:none;"></span></td>';

        }
        else {
            strHtml += '<td><input type="text" style="display:none;" id="ParentId_' + strIdno + '" class="clsCode SearchParentNo" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" onkeypress="return isNumberKey(event)"/></td>';

        }

        strHtml += '<td>' + Strspn + '<input type="text" disabled id="txtGLCode_' + strIdno + '" value="' + AccountCode + '" class="clsCode Width20"/><span id="spnCode' + strIdno + '" style="display:none;">' + AccountCode + '</span> </td>';



        strHtml += '<td><select id="ddlAccountType_' + strIdno + '" disabled>' + strAccountType + '</select></td>';


        strHtml += '<td><input type="text" disabled  id="txtGLDescription_' + strIdno + '"/ value="' + AccountName + '" style="width:100%;"><span id="spnDesc' + strIdno + '" style="display:none;">' + AccountName + '</span></td>';
        if (Posting != null && Posting != false) {
            strHtml += '<td><input  type="checkBox" disabled id="ChkDetailPosting_' + strIdno + '" checked/><input type="hidden" id="hdnParentId_' + strIdno + '" value="' + ParentId + '" /><span id="spnPosting' + strIdno + '" style="display:none;">' + false + '</span></td>';
        }
        else {
            strHtml += '<td><input  type="checkBox" disabled id="ChkDetailPosting_' + strIdno + '" /> <input type="hidden" id="hdnParentId_' + strIdno + '" value="' + ParentId + '" /><span id="spnPosting' + strIdno + '" style="display:none;">' + true + '</span></td>';
        }
        strHtml += '<td><span id="spnLeft_' + strIdno + '" style=" margin-right: 5px;" class="' + strClass + '"> <i class="fa fa-chevron-left"></i></span>';
        strHtml += '<input type="text" disabled  id="txtSubLevel_' + strIdno + '" value="' + SubLevel + '" class="width30" disabled/>';
        strHtml += '<span id="spnRight_' + strIdno + '" style=" margin-left: 5px;"> <i class="fa fa-chevron-right"></i></span></td>';

        strHtml += '<td><span id="SpnSave_' + strIdno + '" style="display:none;"><a href="javascript:funSaveDetail(' + strIdno + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + strIdno + '" style="display:none;"><a href="javascript:funCancelRow(' + strIdno + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
        strHtml += '<span style="display:inline;" id="spnEdit_' + strIdno + '"><a href="#" onclick="javascript:funEditOther(' + strIdno + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span><a onclick="javascript:funDelete(' + AccountId + ',\'' + values + '\');" class="btn btn-primary"><i class="fa fa-trash-o"></i></a></span>';
        strHtml += '</tr>';
    }
    $('#tblGLsetupTbody').append(strHtml);

    $('#tblGLsetupTbody tr').click(function () {
        strPublicTR = $(this).closest('tr').attr('id');
        strPublicParentId = $('#hdnAccountId_' + strPublicTR).val();
        //#5C8FBE

        $('#tblGLsetupTbody tr').removeClass('TrColor');
        $('#' + strPublicTR).addClass('TrColor');
        if (strPublicTR != -1) {
            $('#spnDetail').removeAttr('style');
            $('#spnDetail').attr('style', 'color: #5a8ec0 !important;');


        }
        else {
            $('#spnDetail').attr('style', 'visibility:hidden;color: #5a8ec0 !important;');


        }
    })

    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#DvTB').attr('style', 'height:' + heightt + 'px;');
}

//-------------------------------------------------------------- Add Row Details
function funAddRowDetail() {

    // strPublicTR
    var strsublevel = 1;
    var strParentTr = 0;
    var StrParentId = $('#hdnAccountId_' + strPublicTR).val();
    var strAccountTypeId = $('#ddlAccountType_' + strPublicTR).val();
    var ssAccountType = $('#ddlAccountType_' + strPublicTR).find('option:selected').text();
    if (strPublicTR == -1) {
        //var strvalue = 3;
        $('#' + strPublicTR).removeClass('TrDisplayNone');
        $('#' + -1).addClass('TrColor');
        strParentTr = -1;
        $('#ParentId_' + strPublicTR).focus();
    }
    else {
        if (StrParentId == '') {
            ShowMsgBox('showMSG', 'Please select an Account from the list where you would like to add a sub Detail account ..!!', '', '');
        }
        else {
            strsublevel = parseInt($('#txtSubLevel_' + strPublicTR).val()) + 1;
            if (strsublevel > 6) {
                ShowMsgBox('showMSG', 'Maximum levels reached.. !!!', '', '');

            }
            else {


                strIdno++;
                var strHtml = '';
                strHtml += '<tr id="' + strIdno + '" class="TrColor">';
                strHtml += '<td>' + '<span style="color: #C1B9B9;">' + strSegmentName + '</span><input type="hidden" id="hdnAccountId_' + strIdno + '" ></td>';
                if (strPublicTR == -1) {
                    strHtml += '<td><input type="text" id="ParentId_' + strIdno + '" class="clsCode SearchParentNo"  onkeypress="return isNumberKey(event)" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" /></td>';
                  
                }
                else {
                    strHtml += '<td><input type="text" style="display:none;" id="ParentId_' + strIdno + '" class="clsCode SearchParentNo"  name="' + strPublicParentId + '" onkeypress="return isNumberKey(event)" onblur="javascript:funCheckLedgerExistance(' + strIdno + ');" /></td>';
                   
                }
                var Strspn = '';
                if (strsublevel > 1) {
                    if (strsublevel == 1) {
                        Strspn = '<span class="Indent" ><i class="fa fa-arrow-circle-right"></span></i>';
                    }
                    else if (strsublevel == 2) {
                        Strspn = '<span class="Indent-Indent" ><i class="fa fa-arrow-circle-right"></span></i>';
                    }
                    else if (strsublevel == 3) {
                        Strspn = '<span class="Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                    }
                    else if (strsublevel == 4) {
                        Strspn = '<span class="Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                    }
                    else if (strsublevel == 5) {
                        Strspn = '<span class="Indent-Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                    }
                    else if (strsublevel == 6) {
                        Strspn = '<span class="Indent-Indent-Indent-Indent-Indent-Indent"><i class="fa fa-arrow-circle-right"></span></i>';
                    }
                }
                strHtml += '<td>' + Strspn + '<input type="text" id="txtGLCode_' + strIdno + '"  class="Width70 clsCode"/></td>';
                // onblur="javascript:funCheckLedgerExistance(' + strIdno + ');"
                strHtml += '<td><select id="ddlAccountType_' + strIdno + '" disabled>' + strAccountType + '</select></td>';
                strHtml += '<td><input type="text" id="txtGLDescription_' + strIdno + '" style="width:100%;"/></td>';
                strHtml += '<td><input type="checkBox" id="ChkDetailPosting_' + strIdno + '" checked/><input type="hidden" id="hdnParentId_' + strIdno + '" value="' + StrParentId + '" /></td>';
                strHtml += '<td><span id="spnLeft_' + strIdno + '" style=" margin-right: 5px;" > <i class="fa fa-chevron-left"></i></span>';
                strHtml += '<input type="text" id="txtSubLevel_' + strIdno + '"  class="width30" disabled value="' + strsublevel + '"/>';
                strHtml += '<span id="spnRight_' + strIdno + '" style=" margin-left: 5px;"> <i class="fa fa-chevron-right"></i></span></td>';
                // strHtml += '<td><input type="text" id="txtSubLevel_' + strIdno + '" class="width30"/></td>';
                strHtml += '<td><span id="SpnSave_' + strIdno + '"><a href="javascript:funSaveDetail(' + strIdno + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + strIdno + '" style="display:inline;"><a href="javascript:funcancelNewRow(' + strIdno + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
                strHtml += '<span style="display:none;" id="spnEdit_' + strIdno + '"><a href="#" onclick="javascript:funEditOther(' + strIdno + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span>';
                strHtml += '</tr>';
                strParentTr = strIdno;
                $('#' + strPublicTR).after(strHtml);
                $('#txtGLCode_' + strIdno).focus();
                $('#ddlAccountType_' + strIdno).val(strAccountTypeId);
                if ($('#ddlAccountType_' + strIdno).find('option:selected').text() == 'EX')
                {
                    $('#ddlAccountType_' + strIdno).prop('disabled', false);
                    $('#ddlAccountType_' + strIdno).html('');
                    $('#ddlAccountType_' + strIdno).html(strAccountTypeForDetail);
                    $('#ddlAccountType_' + strIdno).val(strAccountTypeId);



                }

            }
        }
    }

    $('#tblGLsetupTbody tr').removeClass('TrColor');
    if (strPublicTR != -1) {
        $('#' + strIdno).addClass('TrColor');
    }
    strPublicTR = -1;
    $('#tblGLsetupTbody tr').click(function () {
        strPublicTR = $(this).closest('tr').attr('id');
        strPublicParentId = $('#hdnAccountId_' + strPublicTR).val();

        $('#tblGLsetupTbody tr').removeClass('TrColor');
        $('#' + strPublicTR).addClass('TrColor');

    })

    // Detail SubAccount Code Length Check Here 
    var strposition = $('#txtSubLevel_' + strParentTr).val();
    strposition = strposition - 1;
    for (var i = 0; i < glbSegment.length; i++) {
        if (glbSegment[i].Classification == 'Detail') {
            if (strposition == 1) {
                $('#spnMaskingType').text(glbSegment[i].SubAccount1);
            }
            else if (strposition == 2) {
                $('#spnMaskingType').text(glbSegment[i].SubAccount2);
            }
            else if (strposition == 3) {
                $('#spnMaskingType').text(glbSegment[i].SubAccount3);
            }
            else if (strposition == 4) {
                $('#spnMaskingType').text(glbSegment[i].SubAccount4);
            }
            else if (strposition == 5) {
                $('#spnMaskingType').text(glbSegment[i].SubAccount5);
            }
            else if (strposition == 6) {
                $('#spnMaskingType').text(glbSegment[i].SubAccount6);
            }
            else if (strposition == 0) {
                $('#spnMaskingType').text(glbSegment[i].CodeLength);
            }

        }
    }
    funGetParentCode();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-------------------------------------------------------------- Ledger Table 
function funGlTableCreate(values) {


    $('#tblGLsetupTbody').html('');
    var strResponse = [];
    $.ajax({
        url: APIUrlGetTAByCategory + '?ProdId=' + localStorage.ProdId + '&Category=' + StrClassification,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response) {
     strResponse = response;
     funGlTableCreateSuccess(strResponse, values);
 })
 .fail(function (error)
 { ShowMSG(error); })





}
function funGlTableCreateSuccess(strResponse, values) {
    $('#tblGLSetupThead').html('<tr><th class="second"> <div class="th-inner">Segment</div></th><th class="second"> <div class="th-inner">Type</div></th><th class="second"> <div class="th-inner">Code</div></th><th class="second"> <div class="th-inner">Description</div></th><th class="third"> <div class="th-inner">BalanceSheet</div></th> <th class="second"> <div class="th-inner">Active</div></th><th class="second"> <div class="th-inner">Action</div></th> </tr>');



    var strHtml = '';

    strHtml += '<tr  id="Tr_' + -1 + '" class="TrDisplayNone">';
    strHtml += '<td>' + '<span style="color: #C1B9B9;">' + strSegmentName + '</span><input type="hidden" id="hdnAccountId_' + -1 + '">' + '</td>';
    strHtml += '<td><select id="ddlAccountType_' + -1 + '" class="clsAccountType" onChange="funCheckAccountEX(' + -1 + ');">' + strAccountType + '</select></td>';
    strHtml += '<td><input type="text" id="txtGLCode_' + -1 + '" class="GLCode clsCode Width20"/></td>';
    strHtml += '<td><input type="text" id="txtGLDescription_' + -1 + '" style="width:100%;"/></td>';
    strHtml += '<td><input type="checkBox" id="ChkGLBalSheet_' + -1 + '" checked/></td>';
    strHtml += '<td><input type="checkBox" id="ChkGLActive_' + -1 + '" checked/></td>';
    strHtml += '<td><span id="SpnSave_' + -1 + '"><a href="javascript:funSaveLedger(' + -1 + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + -1 + '" style="display:inline;"><a href="javascript:funcancelNewRow(' + -1 + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
    strHtml += '<span style="display:none;" id="spnEdit_' + -1 + '"><a href="#" onclick="javascript:funEditOther(' + -1 + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span>';
    strHtml += '</tr>';



    if (strResponse.length > 0) {
        for (var i = 0; i < strResponse.length; i++) {
            strIdno = i;
            var AccountId = strResponse[i].AccountID;
            var AccountCode = strResponse[i].AccountCode;
            var AccountName = strResponse[i].AccountName;
            var BalanceSheet = strResponse[i].BalanceSheet;
            var Status = strResponse[i].Status;
            var Code = strResponse[i].Code;
            //


            strHtml += '<tr>';
            strHtml += '<td>' + '<span style="color: #C1B9B9;">' + values + '</span><input type="hidden" id="hdnAccountId_' + strIdno + '" value="' + AccountId + '">' + '</td>';
            strHtml += '<td><select class="clsAccountType" onChange="funCheckAccountEX(' + strIdno + ');" id="ddlAccountType_' + strIdno + '" disabled>' + strAccountType + '</select><span id="spnddl' + strIdno + '" style="display:none;">' + strResponse[i].AccountTypeId + '</span></td>';
            strHtml += '<td><input type="text" disabled id="txtGLCode_' + strIdno + '" class="GLCode clsCode Width20" value="' + AccountCode + '"/><span id="spnCode' + strIdno + '" style="display:none;">' + AccountCode + '</span></td>';
            strHtml += '<td><input type="text" disabled id="txtGLDescription_' + strIdno + '" value="' + AccountName + '" style="width:100%;"/><span id="spnDesc' + strIdno + '" style="display:none;">' + AccountName + '</span></td>';
            if (BalanceSheet == true) {
                strHtml += '<td><input type="checkBox" id="ChkGLBalSheet_' + strIdno + '" checked disabled/><span id="spnBalance' + strIdno + '" style="display:none;">' + BalanceSheet + '</span></td>';

            } else {
                strHtml += '<td><input type="checkBox" id="ChkGLBalSheet_' + strIdno + '" disabled /><span id="spnBalance' + strIdno + '" style="display:none;">' + BalanceSheet + '</span></td>';

            }
            if (Status == true) {
                strHtml += '<td><input type="checkBox" id="ChkGLActive_' + strIdno + '" checked disabled/><span id="spnStatus' + strIdno + '" style="display:none;">' + Status + '</span></td>';
            }
            else {
                strHtml += '<td><input type="checkBox" id="ChkGLActive_' + strIdno + '" disabled/><span id="spnStatus' + strIdno + '" style="display:none;">' + Status + '</span></td>';

            }
            strHtml += '<td><span id="SpnSave_' + strIdno + '" style="display:none;"><a href="javascript:funSaveLedger(' + strIdno + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + strIdno + '" style="display:none;"><a href="javascript:funCancelRow(' + strIdno + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
            strHtml += '<span style="display:inline;" id="spnEdit_' + strIdno + '"><a href="#" onclick="javascript:funEditOther(' + strIdno + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span><span><a onclick="javascript:funDelete(' + AccountId + ',\'' + values + '\');" class="btn btn-primary"><i class="fa fa-trash-o"></i></a></span>';
            strHtml += '</tr>';
        }
    }
    $('#tblGLsetupTbody').html(strHtml);
    for (var i = 0; i < strResponse.length; i++) {
        $('#ddlAccountType_' + i).val(strResponse[i].AccountTypeId);

    }
    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#DvTB').attr('style', 'height:' + heightt + 'px;');
}
//=========================================================== Account Type Check single account with Account Type of EX

function funCheckAccountEX(values) {
    var strCount = 0;
    var strval = $('.clsAccountType');
    for (var i = 0; i < strval.length; i++) {
        var id = strval[i].id;
        // $('#ddlAccountType_' + values).find(":selected").text() == 'EX')
        if ($('select#' + id).find(":selected").text() == 'EX') {
          
            strCount++;
        }
    }
    if (strCount > 1)
    {
        $('#ddlAccountType_' + values).html(strAccountType);
    //    ShowMsgBox('showMSG', 'EX only one Time Create in Ledger Account', '', '');
    }
}

//-------------------------------------------------------------- Add Row Ledger
function funAddRowLeder() {
    strIdno++;
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<td>' + '<span style="color: #C1B9B9;">' + strSegmentName + '</span><input type="hidden" id="hdnAccountId_' + strIdno + '">' + '</td>';
    strHtml += '<td><select id="ddlAccountType_' + strIdno + '">' + strAccountType + '</select></td>';
    strHtml += '<td><input type="number" id="txtGLCode_' + strIdno + '" class="GLCode clsCode"/></td>';
    strHtml += '<td><input type="text" id="txtGLDescription_' + strIdno + '"/></td>';
    strHtml += '<td><input type="checkBox" id="ChkGLBalSheet_' + strIdno + '" checked/></td>';
    strHtml += '<td><input type="checkBox" id="ChkGLActive_' + strIdno + '"/></td>';
    strHtml += '<td><span id="SpnSave_' + strIdno + '"><a href="javascript:funSaveLedger(' + strIdno + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i></a></span><span id="spnCancel_' + strIdno + '" style="display:none;"><a href="javascript:funCancel(' + strIdno + ');" class="btn btn-primary"><i class="fa fa-close"></i></a></span>';
    strHtml += '<span style="display:none;" id="spnEdit_' + strIdno + '"><a href="#" onclick="javascript:funEditOther(' + strIdno + ');" class="transShow btn btn-warning  pull-left marginRight11" style="display:block;"><i class="fa fa-pencil"></i></a></span>';
    strHtml += '</tr>';
    $('#tblGLsetupTbody').append(strHtml);

}
//-------------------------------------------------------------- Class Blur 
$('#tblGLsetupTbody').delegate('.clsCode', 'blur', function () {

    var currentId = $(this).attr("id");
    $('#' + currentId).removeClass('RedBorder');
    var strCurrentId = $('#' + currentId).val();
    if (strCurrentId == '') {
        $('#' + currentId).addClass('RedBorder');
    }
    else {
        $('#' + currentId).removeClass('RedBorder');
    }
    //var strCode = $('.clsCode');
    //for (var i = 0; i < strCode.length; i++) {
    //    var StrCurrentId = strCode[i].id;
    //    var StrCurrentValue = strCode[i].value;
    //    if (currentId == StrCurrentId)
    //    { }
    //    else {
    //        if (strCurrentId == strCode[i].value) {

    //            $('#' + currentId).focus();
    //            $('#' + currentId).val('');

    //            //  $('#' + currentId).addClass('RedBorder');

    //        }
    //    }
    //}

    //    //alert(currentId);
});

//------------------------------------------- Function For COA Masking--------------------------------------------------------------


$('#tblGLsetupTbody').delegate('.clsCode', 'change keyup paste', function () {
    var MaskingType = $('#spnMaskingType').text();
    var maskingLength = MaskingType.length;
    var currentId = $(this).attr("id");
    var strval = $('#' + currentId).val();
    var strlength = strval.length;

    for (var i = 0; i < strlength; i++) {
        var res = strval.charAt(i);
        var value = res.charCodeAt(0);


        var res1 = MaskingType.charAt(i);
        var strvalue = res1.charCodeAt(0);


        if (strvalue == 35) {

            if (value > 47 && value < 58) {
                funDivShowCode(1);
            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                funDivShowCode(2);
            }
        }
        else if (strvalue == 97) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122) {
                funDivShowCode(1);
            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                funDivShowCode(2);
            }
        }
        else if (strvalue == 65) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122 || value >= 47 && value <= 58) {
                funDivShowCode(1);
            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                funDivShowCode(2);
            }
        }
        else if (strvalue == 45) {

            if (value == 45) {
                funDivShowCode(1);
            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                funDivShowCode(2);
            }
        }
    }
    if (maskingLength == strlength) {
    }
    else if (strlength > maskingLength) {
        $('#' + currentId).val(strval.substring(0, strval.length - 1));
        funDivShowCode(2);

        $('#' + currentId).focus();
    }

    if (MaskingType.charAt(strlength) == '-') {
        var strval = $('#' + currentId).val();
        $('#' + currentId).val(strval + '-');
    }

})   // Code Length check

function funDivShowCode(value) {

    if (value == 1) {
        $('#DvMasking').attr('style', 'visibility:inline;');

        $('#lblMask').removeClass('RedColor');
        $('#spnMaskingType').removeClass('RedColor');

        $('#lblMask').addClass('BlueColor');
        $('#spnMaskingType').addClass('BlueColor');

    }
    else {
        $('#DvMasking').attr('style', 'visibility:inline;');
        $('#lblMask').removeClass('BlueColor');
        $('#spnMaskingType').removeClass('BlueColor');

        $('#lblMask').addClass('RedColor');
        $('#spnMaskingType').addClass('RedColor');

    }
}

//------------------------------------------------------------- Error MSG
function ShowMSG(error) {
    console.log(error);
}
//------------------------------------------------------------- Add Button
$('#btnSaveGLsetup').click(function () {

    if (StrClassification == 'Company') {
        funAddCompanyDetail();
    } else if (StrClassification == 'Ledger') {
        funSaveLedger();
    } else if (StrClassification == 'Detail') {
        funSaveDetail();
    } else {
        funSaveOther();
    }
});

//---------------------------------------------- Company Save
function funAddCompanyDetail() {
    var objArr = [];
    var clsCompany = $('.CompanyCheckBox');
    var ClsClength = clsCompany.length;
    for (var i = 0; i < ClsClength; i++) {
        var clsId = clsCompany[i].id;
        var strsplit = clsId.split('_');
        if (clsCompany[i].checked == true) {
            var obj = {
                CreatedBy: localStorage.UserId,
                ProdId: localStorage.ProdId,
                ACCountCode: $('#spnAC_' + strsplit[1]).text(),
                AccountName: $('#spnAN_' + strsplit[1]).text()
            }

            objArr.push(obj);
        }
    }
    if (objArr.length != 0) {
        $.ajax({
            url: APIUrlAddCompanyDetail,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            type: 'POST',
            //    async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(objArr),
        })

       .done(function (response)
       { AddCompanyDetailSucess(response); })
       .fail(function (error)
       { ShowMSG(error); })
    }
}
function AddCompanyDetailSucess(response) {
    console.log(response);
    //show
    ShowMsgBox('showMSG', 'Account saved successfully.. !!', '', '');
    location.reload(true);
}
//----------------------------------------------  Save Other // Location, Set,Series
function funSaveOther(values) {

    var strval = $('#spnMaskingType').text();
    var strvallenght = strval.length;
    var strtBval = $('#txtEpCode_' + values).val();
    var strtBlength = strtBval.length;
    if (strvallenght == strtBlength) {

        if ($('#txtEpCode_' + values).val() != '') {

            var TblArr = [];
            //  for (var i = 0; i < Tcount; i++) {
            var ObjAccount = {
                AccountId: $('#hdnAccountId_' + values).val()
                , SegmentId: StrSegmentId
                , AccountCode: $('#txtEpCode_' + values).val()
                , AccountName: $('#txtEpDescrption_' + values).val()  //Description in all and 
                , AccountTypeId: '' // // ledger
                , BalanceSheet: '' // Ledger
                , Status: true     // All
                , Posting: ''  // Details
                , SubLevel: '' // Details
                , SegmentType: StrClassification //All
                , ParentId: '' //Detail
                , CreatedBy: localStorage.UserId
                , ProdId: localStorage.ProdId
            }
            TblArr.push(ObjAccount);
            //   }

            $.ajax({
                url: ApiUrlfunSaveOther,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                cache: false,
                type: 'POST',
                //    async: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(TblArr),

            })
            .done(function (response) {
                SaveOtherSuccess(response, values);
            })
            .fail(function (error) {
                console.log(error);
            })

        } else {
            $('#txtEpCode_' + values).focus();
            ShowMsgBox('showMSG', 'Please Fill the Record', '', '');
        }
    } else {
        $('#txtEpCode_' + values).addClass('RedBorder');
        $('#lblMask').removeClass('BlueColor');
        $('#spnMaskingType').removeClass('BlueColor');
        $('#lblMask').addClass('RedColor');
        $('#spnMaskingType').addClass('RedColor');
    }
    $('#SpnSave_' + values).hide();
    $('#spnCancel_' + values).hide();
    $('#spnEdit_' + values).show();
    $('#txtEpDescrption_' + values).prop('disabled', true);
}

function SaveOtherSuccess(response, values) {
    if (response == -1) {
        ShowMsgBox('showMSG', 'Account already exists. Please provide a different account code..!!', '', '');
    } else {
        AtlasCache.CacheCOA(true); // bust the COA cache

        $('#hdnAccountId_' + values).val(response);
        $('#SpnSave_' + values).attr('style', 'display:none;');
        $('#spnEdit_' + values).attr('style', 'display:show;');
        $('#spnCancel_' + values).attr('style', 'display:none;');

        if (StrClassification != 'Ledger' && StrClassification != 'Detail') {
            funEpisode(StrClassification);
            $('#txtEpCode_' + values).prop('disabled', true);
            $('#txtEpDescrption_' + values).prop('disabled', true);
        } else if (StrClassification == 'Ledger') {
            funGlTableCreate(StrClassification);

            $('#ddlAccountType_' + values).prop('disabled', true);
            $('#txtGLCode_' + values).prop('disabled', true);
            $('#txtGLDescription_' + values).prop('disabled', true);
            $('#ChkGLBalSheet_' + values).prop('disabled', true);
            $('#ChkGLActive_' + values).prop('disabled', true);
        } else {
            funDetailTableCreate(StrClassification);
        }
    }
}

//---------------------------------------------- Ledger Save
function funSaveLedger(values) {
    var strval = $('#spnMaskingType').text();
    var strvallenght = strval.length;
    var strtBval = $('#txtGLCode_' + values).val();
    var strtBlength = strtBval.length;
    if (strvallenght == strtBlength) {

        var TblArr = [];
        var ObjAccount = {
            AccountId: $('#hdnAccountId_' + values).val()
                , SegmentId: StrSegmentId
                , AccountCode: $('#txtGLCode_' + values).val()
                , AccountName: $('#txtGLDescription_' + values).val()  //Description in all and 
                , AccountTypeId: $('#ddlAccountType_' + values).val() // // ledger
                , BalanceSheet: $('#ChkGLBalSheet_' + values).prop('checked') // Ledger
                , Status: $('#ChkGLActive_' + values).prop('checked')      // All
                , Posting: $('#ChkDetailPosting_' + values).prop('checked')  // Details
                , SubLevel: $('#txtSubLevel_' + values).val() // Details
                , SegmentType: StrClassification //All
                , ParentId: '' //Detail
                , CreatedBy: localStorage.UserId
                , ProdId: localStorage.ProdId
        }
        TblArr.push(ObjAccount);


        //if ($('#ChkGLActive_' + values).prop('checked') != false && StrSegmentId != 0 && $('#txtGLCode_' + values).val() != '') {      ////////////////////////////////
        $.ajax({
            url: ApiUrlfunSaveOther,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            type: 'POST',
            // async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(TblArr),
        })
        .done(function (response) { SaveOtherSuccess(response, values); })
        .fail(function (error) { console.log(error); })
        // }
    } else {
        $('#txtGLCode_' + values).addClass('RedBorder');

        $('#lblMask').removeClass('BlueColor');
        $('#spnMaskingType').removeClass('BlueColor');
        $('#lblMask').addClass('RedColor');
        $('#spnMaskingType').addClass('RedColor');
    }
    $('#SpnSave_' + values).hide();
    $('#spnCancel_' + values).hide();
    $('#spnEdit_' + values).show();
    $('#txtGLDescription_' + values).prop('disabled', true);

}

//---------------------------------------------- Detail Save
function funSaveDetail(Values) {
    $('#SpnSave_' + Values).hide();
    $('#spnCancel_' + Values).hide();
    $('#spnEdit_' + Values).show();
    $('#txtGLDescription_' + Values).prop('disabled', true);
    var strval = $('#spnMaskingType').text();
    var strvallenght = strval.length;
    var strtBval = $('#txtGLCode_' + Values).val();
    var strtBlength = strtBval.length;
    if (strvallenght == strtBlength) {
        var TblArr = [];
        var ObjAccount = {
            AccountId: $('#hdnAccountId_' + Values).val()
                   , SegmentId: StrSegmentId
                , AccountCode: $('#txtGLCode_' + Values).val()
                , AccountName: $('#txtGLDescription_' + Values).val()  //Description in all and 
                , AccountTypeId: $('#ddlAccountType_' + Values).val() // // ledger
                , BalanceSheet: $('#ChkGLBalSheet_' + Values).prop('checked') // Ledger
                , Status: true     // All
                , Posting: $('#ChkDetailPosting_' + Values).prop('checked')  // Details
                , SubLevel: $('#txtSubLevel_' + Values).val() // Details
                , SegmentType: StrClassification //All
                , ParentId: $('#hdnParentId_' + Values).val() //Detail
                , CreatedBy: localStorage.UserId
                , ProdId: localStorage.ProdId
        }
        TblArr.push(ObjAccount);

        $.ajax({
            url: ApiUrlfunSaveOther,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            type: 'POST',
            // async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(TblArr),

        })
        .done(function (response) {
            localStorage.dirtydata = true;
            $('#' + Values).removeClass('TrColor');
            strPublicTR = -1;
            strPublicParentId = 0;
            // change
            SaveOtherSuccess(response, Values);
        })
        .fail(function (error) { console.log(error); })
    } else {
        $('#txtGLCode_' + Values).addClass('RedBorder');

        $('#lblMask').removeClass('BlueColor');
        $('#spnMaskingType').removeClass('BlueColor');
        $('#lblMask').addClass('RedColor');
        $('#spnMaskingType').addClass('RedColor');
    }



}

//--------------------------------------------- Edit Edit and Cancel
function funEditOther(values) {
    $('#SpnSave_' + values).show();
    $('#spnCancel_' + values).show();
    $('#spnEdit_' + values).hide();

    if (StrClassification != 'Ledger' && StrClassification != 'Detail') {
       // $('#txtEpCode_' + values).prop('disabled', false);
        $('#txtEpDescrption_' + values).prop('disabled', false);
    }
    else if (StrClassification == 'Ledger') {
        $('#ddlAccountType_' + values).prop('disabled', false);
        $('#txtGLCode_' + values).prop('disabled', false);
        $('#txtGLDescription_' + values).prop('disabled', false);
        $('#ChkGLBalSheet_' + values).prop('disabled', false);
        $('#ChkGLActive_' + values).prop('disabled', false);
    }
    else if (StrClassification == 'Detail') {
        $('#ParentId_' + values).prop('disabled', false);
        $('#txtGLDescription_' + values).prop('disabled', false);
        var strsublevel = $('#txtSubLevel_' + values).val();
        strsublevel = strsublevel - 1;
        if (strsublevel == 0) {

            $('#ChkDetailPosting_' + values).prop('disabled', true);
        }
        else {

            $('#ChkDetailPosting_' + values).prop('disabled', false);
        }
        for (var i = 0; i < glbSegment.length; i++) {
            if (glbSegment[i].Classification == 'Detail') {
                if (strsublevel == 1) {
                    $('#spnMaskingType').text(glbSegment[i].SubAccount1);
                }
                else if (strsublevel == 2) {
                    $('#spnMaskingType').text(glbSegment[i].SubAccount2);
                }
                else if (strsublevel == 3) {
                    $('#spnMaskingType').text(glbSegment[i].SubAccount3);
                }
                else if (strsublevel == 4) {
                    $('#spnMaskingType').text(glbSegment[i].SubAccount4);
                }
                else if (strsublevel == 5) {
                    $('#spnMaskingType').text(glbSegment[i].SubAccount5);
                }
                else if (strsublevel == 6) {
                    $('#spnMaskingType').text(glbSegment[i].SubAccount6);
                }
                else if (strsublevel == 0) {
                    $('#spnMaskingType').text(glbSegment[i].CodeLength);
                }

            }
        }
        if ($('#ddlAccountType_' + values).find(":selected").text() == 'EX') {
            $('#ddlAccountType_' + values).attr('disabled', false);
            var strval = $('#ddlAccountType_' + values).val();
            $('#ddlAccountType_' + values).html('');
            $('#ddlAccountType_' + values).html(strAccountTypeForDetail);
            $('#ddlAccountType_' + values).val(strval);
        }
    }

}
function funCancelRow(values) {

    $('#SpnSave_' + values).hide();
    $('#spnCancel_' + values).hide();
    $('#spnEdit_' + values).show();
    if (StrClassification != 'Ledger' && StrClassification != 'Detail') {
        $('#txtEpCode_' + values).prop('disabled', true);
        $('#txtEpDescrption_' + values).prop('disabled', true);
        var Code = $('#spnCode' + values).text();
        var Desc = $('#spnDesc' + values).text();

        $('#txtEpCode_' + values).val(Code);
        $('#txtEpDescrption_' + values).val(Desc);

    }
    else if (StrClassification == 'Ledger') {
        $('#ddlAccountType_' + values).prop('disabled', true);
        $('#txtGLCode_' + values).prop('disabled', true);
        $('#txtGLDescription_' + values).prop('disabled', true);
        $('#ChkGLBalSheet_' + values).prop('disabled', true);
        $('#ChkGLActive_' + values).prop('disabled', true);

        var spnddl = $('#spnddl' + values).text();
        var spnCode = $('#spnCode' + values).text();
        var spnDesc = $('#spnDesc' + values).text();
        var spnBalance = $('#spnBalance' + values).text();
        var spnStatus = $('#spnStatus' + values).text();

        $('#ddlAccountType_' + values).val(spnddl);
        $('#txtGLCode_' + values).val(spnCode);
        $('#txtGLDescription_' + values).val(spnDesc);
        $('#ChkGLBalSheet_' + values).prop('checked', spnBalance);
        $('#ChkGLActive_' + values).val('checked', spnStatus);
    }
    else if (StrClassification == 'Detail') {
        $('#ParentId_' + values).prop('disabled', true);
        $('#txtGLCode_' + values).prop('disabled', true);
        $('#txtGLDescription_' + values).prop('disabled', true);
        $('#ChkDetailPosting_' + values).prop('disabled', true);
        $('#txtSubLevel_' + values).prop('disabled', true);

        var spnParent = $('#spnParent' + values).text();
        var spnPosting = $('#spnPosting' + values).text();
        var spnDesc = $('#spnDesc' + values).text();
        var spnCode = $('#spnCode' + values).text();

        $('#txtParentId_' + values).val(spnParent);
        $('#txtGLDescription_' + values).val(spnDesc);
        $('#txtGLCode_' + values).val(spnCode);
        $('#ChkDetailPosting_' + values).prop('checked', spnPosting);



    }
}

function funcancelNewRow(values) {
    if (StrClassification != 'Ledger' && StrClassification != 'Detail') {
        $('#Tr_' + values).addClass('TrDisplayNone');
        $('#txtEpCode_' + values).val('');
        $('#txtEpDescrption_' + values).val('');

    }
    else if (StrClassification == 'Ledger') {
        $('#Tr_' + values).addClass('TrDisplayNone');
        $('#txtGLCode_' + values).val('');
        $('#txtGLDescription_' + values).val('');
        $('#ChkGLActive_' + values).prop('checked', false);

    }
    else if (StrClassification == 'Detail') {
        $('#' + values).addClass('TrDisplayNone');
        //if (values == -1) {
        //    values = 0;
        //}
        $('#ParentId_' + values).val('');
        $('#txtGLCode_' + values).val('');
        $('#txtGLDescription_' + values).val('');
        $('#ChkDetailPosting_' + values).prop('checked', false);
    }
}

//---------------------------------------------- Check Account Duplicacy in Detail
function funCheckLedgerExistance(values) {
    var Strvalue = $('#txtGLCode_' + values).val().trim();
    var Parentval = $('#ParentId_' + values).val();
    var strAccountTypeId = 0;
    if (Parentval != '') {
        for (var i = 0; i < glbParentDetail.length; i++) {
            if (glbParentDetail[i].AccountCode == Parentval) {
                $('#ParentId_' + values).attr('name', glbParentDetail[i].LedgerId);
                $('#ParentId_' + values).val(Parentval);
                $('#ddlAccountType_' + values).val(glbParentDetail[i].AccountTypeId);
                $('#hdnParentId_' + values).val(glbParentDetail[i].LedgerId);
                strAccountTypeId = glbParentDetail[i].AccountTypeId;
                break;
            }
            else {
                $('#ParentId_' + values).removeAttr('name');
                $('#ParentId_' + values).val('');
            }
        }
        for (var i = 0; i < glbParentDetail.length; ++i) {
            if (glbParentDetail[i].AccountCode.substring(0, Parentval.length) === Parentval) {
                $('#ParentId_' + values).attr('name', glbParentDetail[i].LedgerId);
                $('#ParentId_' + values).val(glbParentDetail[i].AccountCode);
                $('#ddlAccountType_' + values).val(glbParentDetail[i].AccountTypeId);
                $('#hdnParentId_' + values).val(glbParentDetail[i].LedgerId);
                strAccountTypeId = glbParentDetail[i].AccountTypeId;
                break;
            }
        }
    }
    else {
        $('#ParentId_' + values).attr('name', glbParentDetail[0].LedgerId);
        $('#ParentId_' + values).val(glbParentDetail[0].AccountCode);
        $('#ddlAccountType_' + values).val(glbParentDetail[0].AccountTypeId);
        $('#hdnParentId_' + values).val(glbParentDetail[0].LedgerId);

    }
    var ParentId = $('#hdnParentId_' + values).val();
    var StrSublevel = $('#txtSubLevel_' + values).val();

    funEnabledDisabled(values, strAccountTypeId);
    //var strV1 = Strvalue.split('-');
    //var strV1Length = strV1.length;
    //var FinStrValue = '';
    if (ParentId != '') {
        if (Strvalue != '') {

      //      $.ajax({
      //          url: ApiUrlCheckLedgerExistance + '?DetailCode=' + Strvalue + '&ParentId=' + ParentId + '&Sublevel=' + StrSublevel,
      //          beforeSend: function (request) {
      //              request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
      //          },
      //          cache: false,
      //          type: 'POST',
      //          // async: false,
      //          contentType: 'application/json; charset=utf-8',
      //      })
      //.done(function (response) { CheckLedgerExistanceSuccess(response, values); })
      //.fail(function (error) { console.log(error); })
        }
    } else {
        // $('#parentId_' + values).focus();

    }
}
function CheckLedgerExistanceSuccess(response, values) {

    if (response.length > 0) {
        $('#txtGLCode_' + values).val('');
        $('#txtGLCode_' + values).focus();

        ShowMsgBox('showMSG', 'This Account is already exists..!!', '', '');
    }
    //if (response.length > 0) {
    //    $('#ddlDetailType_' + values).html('<option value=' + response[0].AccountTypeID + '>' + response[0].Code + '</option>');
    //    $('#txtSubLevel_' + values).val(response[0].SubLevel);
    //    $('#hdnParentId_' + values).val(response[0].AccountID);
    //    if (response[0].AccountTypeID == 0) {
    //        $('#ddlDetailType_' + values).addClass('VisiblityHidden');
    //        $('#txtSubLevel_' + values).val(4);
    //        $('#spnLeft_' + values).removeClass('VisiblityHidden');
    //    }
    //    else {
    //        $('#ddlDetailType_' + values).removeClass('VisiblityHidden');
    //        $('#txtSubLevel_' + values).val(3);
    //        $('#spnLeft_' + values).addClass('VisiblityHidden');


    //    }

    //} else {
    //    // $('#ddlDetailType_' + values).removeClass('VisiblityHidden');
    //    // $('#txtSubLevel_' + values).val(3);
    //    ShowMsgBox('showMSG', 'This Account is not valid..!!', '', '');

    //    $('#txtGLCode_' + values).val('');
    //    $('#txtGLCode_' + values).focus();


    //}

}

//function CheckLedgerExistance(values)
//{
//     var Strvalue = $('#txtGLCode_' + values).val().trim();
//     var Parentval = $('#ParentId_' + values).val();
//    if (Parentval != '') {
//        for (var i = 0; i < glbParentDetail.length; i++) {
//            if (glbParentDetail[i].AccountCode == Parentval) {
//                $('#ParentId_' + values).attr('name', glbParentDetail[i].LedgerId);
//                $('#ParentId_' + values).val(Parentval);
//                $('#ddlAccountType_' + values).val(glbParentDetail[i].AccountTypeId);
//                break;
//            }
//            else {
//                $('#ParentId_' + values).removeAttr('name');
//                $('#ParentId_' + values).val('');
//            }
//        }
//        for (var i = 0; i < glbParentDetail.length; ++i) {
//            if (glbParentDetail[i].AccountCode.substring(0, Parentval.length) === Parentval) {
//                $('#ParentId_' + values).attr('name', glbParentDetail[i].LedgerId);
//                $('#ParentId_' + values).val(glbParentDetail[i].AccountCode);
//                $('#ddlAccountType_' + values).val(glbParentDetail[i].AccountTypeId);
//                break;
//            }
//        }
//    }
//    else {
//        $('#ParentId_' + values).attr('name', glbParentDetail[0].LedgerId);
//        $('#ParentId_' + values).val(glbParentDetail[0].AccountCode);
//        $('#ddlAccountType_' + values).val(glbParentDetail[0].AccountTypeId);
//    }
//}
//------------------------------------------------- text Box Validation Detail Tab
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 45 || charCode == 48 || charCode == 49 || charCode == 50 || charCode == 51 || charCode == 52 || charCode == 53 || charCode == 54 || charCode == 55 || charCode == 56 || charCode == 57 || charCode == 58)
        return true;

    return false;
}
//---------------------------------------------------------------- Get Parent Code For Detail Tab
function funGetParentCode(values) {

    $.ajax({
        url: APIUrlGetParentCode + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })
      .done(function (response) {
          GetParentCodeSucess(response, values);
      })
      .fail(function (error)
      { ShowMSG(error); })
}
function GetParentCodeSucess(response, values) {

    glbParentDetail = [];
    glbParentDetail = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.LedgerId,
            label: m.AccountCode,
            AccountTypeId: m.AccountTypeId,
        };
    });
    $(".SearchParentNo").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            $('#hdnParentId_' + values).val(ui.item.value);
            $('#ddlAccountType_' + values).val(ui.item.AccountTypeId);
            $('#ddlAccountType_' + values).val();
           // $('#ParentId_' + values).val(ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            $('#hdnParentId_' + values).val(ui.item.value);
            $('#ddlAccountType_' + values).val(ui.item.AccountTypeId);
            $('#ddlAccountType_' + values).val();
          //  $('#ParentId_' + values).val(ui.item.value);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //  $(this).val('');
                // $('#f').val('');
                //$(this).val('');
                //$(this).removeAttr('name');
                //$('#ddlAccountType_' + values).val(0);
            }
        }


    })

}
function funEnabledDisabled(value, strAccountTypeId) {


    if ($("#ddlAccountType_" + value).find(":selected").text() == 'EX') {
        $('#ddlAccountType_' + value).removeAttr("disabled");
        $('#ddlAccountType_' + value).html('');
       $('#ddlAccountType_' + value).html(strAccountTypeForDetail);


    }
    else {

        $('#ddlAccountType_' + value).attr("disabled", true);
        $('#ddlAccountType_' + value).html('');
        $('#ddlAccountType_' + value).html(strAccountType);
        $('#ddlAccountType_' + value).val(strAccountTypeId);
    }
}

function funAddRowDetailParent() {
    strPublicTR = -1;
    funAddRowDetail();
    $('#ChkDetailPosting_' + strPublicTR).prop('disabled', true);
    $('#ChkDetailPosting_' + strPublicTR).prop('checked', false);

}

function funDelete(value, Segment) {

    $.ajax({
        url: APIUrlDeleteAccount + '?AccountId=' + value + '&SegmentType=' + Segment,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
     
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { funDeleteSucess(response, Segment); })
  .fail(function (error)
  { ShowMSG(error); })
}
function funDeleteSucess(response, Segment) {
    if (response == 1) {
        if (Segment == 'Ledger') {
            ShowMsgBox('showMSG', 'This Ledger has been assigned to Detail Accounts. You cannot delete it.', '', '');
        } else {
            ShowMsgBox('showMSG', 'Can not Delete this Account because it is being used in COA', '', '');
        }
    }   
    else if (response == 2) {
        ShowMsgBox('showMSG', 'You must delete all sub accounts before you can delete this account', '', 'failuremsg');
    }
    else {
        if (Segment == 'Ledger') { 
            funGlTableCreate(Segment);
        }
        else if (Segment == 'Detail') {
            funDetailTableCreate(Segment);
        }
        else {
            funEpisode(Segment);
        }
    }
}

//if (StrLength >= Length) {
//}
//else {
//   // ShowMsgBox('showMSG', 'Allowed Code  Length :' + StrLength + '', '', '');
//    $('#' + currentId).val(CodeVal.substring(0, CodeVal.length - 1));
//}