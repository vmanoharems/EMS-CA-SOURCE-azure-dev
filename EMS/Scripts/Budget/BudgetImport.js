
///------------------------------------- Api Calling

var APIUrlSaveNewBudget = HOST + "/api/BudgetOperation/InsertUpdateBudget";
var APIUrlGetBudgetList = HOST + "/api/BudgetOperation/GetBudgetList";
var APIUrlGetBudgetDetail = HOST + "/api/BudgetOperation/GetBudgetDetail";
var APIUrlImportBudget = HOST + "/api/BudgetOperation/ImportBudget";
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlBudgetCategory = HOST + "/api/BudgetOperation/GetBudgetCategory";
var APIUrlBudgetAccounts = HOST + "/api/BudgetOperation/GetBudgetAccountsNew";
var APIUrlBudgetDetails = HOST + "/api/BudgetOperation/GetBudgetDetails";
var APIUrlBudgetCheckStatus = HOST + "/api/BudgetOperation/BudgetActionStatus";
var APIUrlBudgetCategoryUpdate = HOST + "/api/BudgetOperation/UpdateBudgetCategory";
var APIUrlBudgetAccountUpdate = HOST + "/api/BudgetOperation/UpdateBudgetAccount";
var APIUrlProcessBudget = HOST + "/api/BudgetOperation/ProcessBudget";
var APIUrlFillAccount = HOST + "/api/BudgetOperation/GetAccountNameForBudget";

var APIUrlFillSegment = HOST + "/api/Payroll/GetSegmentForPayroll";
var APIUrlBudgetCheckCOA = HOST + "/api/BudgetOperation/CheckCOAForProduction";
var APIUrlBudgetCategoryCOA = HOST + "/api/BudgetOperation/AddNewCategorytoBudget";

var APIUrlBudgetAccountAdd = HOST + "/api/BudgetOperation/AddNewAccounttoBudget";

var APIUrlProceedBudgetFinal = HOST + "/api/BudgetOperation/ProceedBudgetFinal";
var APIUrlCheckBudgetInFinalBudget = HOST + "/api/BudgetOperation/CheckBudgetInFinalBudget";

var APIUrlUpdateCodeMaskingCategory = HOST + "/api/BudgetOperation/UpdateCodeMaskingCategory";
var APIUrlUpdateCodeMaskingAccount = HOST + "/api/BudgetOperation/UpdateCodeMaskingAccount";

var APIUrlCreateCOAfromBudgetCategoryNew = HOST + "/api/BudgetOperation/CreateCOAfromBudgetCategoryNew";
var APIUrlCreateCOAfromBudgetAccountNew = HOST + "/api/BudgetOperation/CreateCOAfromBudgetAccountNew";
var APIUrlEmptyBudget = HOST + "/api/BudgetOperation/EmptyBudget"


var BuggetIDTemp = 0;
var BudgetFileID;
var BudgetAction = '';
var BudCateIDTemp;
var BudgetStatus;
var VarGetCompanyId = [];
var getEpisoderes = [];

// Editable Control Using TAB Key

var MaxRowCategory = 0;
var MaxColumnCategory = 1;
var MaxRowAccount = 0;
var MaxColumnAccount = 1;
var CategoryTabPressed = 'NO';
var AccountTabPressed = 'NO';
var CategoryCurrentRow = 0;
var CategoryCurrentColumn = 0;
var AccountCurrentRow = 0;
var AccountCurrentColumn = 0;
var SegmentClassGLName = '';
var SS1 = '';
var SS2 = '';
var SS3 = '';
var SS4 = '';
var SS5 = '';
var SS6 = '';
var SS7 = '';
var SS8 = '';
var SegmentStrCode = '';
var SegStr1 = '';
var SegStr2 = '';
var S1Check = '';
var S2Check = '';
var COACategoryString = '';
var COAAccountString = '';
var ButtonCheck = '';
var MaskingTypeCheckValue = '';

var SegString = '';
var SegStringCnt = 0;
var SegList = '';
//////////////////////

$(document).ready(function () {
    $("#dvMsgCategory").hide();
    $("#dvMsgAccount").hide();
    showLoad(2);
    funGetBudgetList();
    $('#txtCO').focus();
    COACategoryString = '';
    COAAccountString = '';
});

$('#btnBudgetSave').click(function () {
    function XMLToString(oXML) {
        if (window.ActiveXObject) {
            var oString = oXML.xml; return oString;
        }
        else {
            return (new XMLSerializer()).serializeToString(oXML);
        }
    }
})

function funNewBudgetSave() {
    $('#PopNewBudget').show();
}

function SaveNewBudget() {

    var isvalid = "";
    isvalid += CheckRequired($("#txtBudget"));
    isvalid += CheckRequired($("#txtDescription"));
    if (isvalid == "") {
        var ObjBudget = {
            BudgetId: 0,
            Companyid: 1,
            Prodid: localStorage.ProdId,
            BudgetName: $('#txtBudget').val(),
            Description: $('#txtDescription').val(),
            createdby: localStorage.UserId
        }

        $.ajax({
            url: APIUrlSaveNewBudget,
            chache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjBudget),
        })

          .done(function (response)
          { SaveNewBudgetSucess(response); })

              .fail(function (error)
              { SaveNewBudgetFail(error); })
    }
}

function SaveNewBudgetSucess(response) {

    if (response == 0) {
        var Msg = 'Budget Name already Exists!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');

    }
    else {
        BuggetIDTemp = response;
        ShowMsgBox('showMSG', 'Budget Saved Successfully', '', '');
        hideDiv('PopNewBudget');
        //funGetBudgetList();
        $('#ddlBudgetList').append('<option value=' + response + '>' + $('#txtBudget').val() + '</option>');
        $("#ddlBudgetList").val(response);
        // $('#ddlBudgetList').val(response);
        $('#spanBreadCumImport').html($('#txtBudget').val());
        $('#spanBudgetPopup').html($('#txtBudget').val());
        // getBudgetDetail(response);
        $('#tblBudget').empty();
        $('#tblBudget').append('<tr><th>Upload Date</th><th>User</th><th>Status</th><th>Currency</th><th>CO</th><th>Action</th></tr>');
        $('#tblBudget').append('<tr><td colspan="6" style="text-align: center;">No Record Found !!!</td></tr>');
        $('#txtBudget').val('');
        $('#txtDescription').val('');
        $('#ddlBudgetList').attr('style', 'display:block;');
        $('#UploadBudget').attr('style', 'display:block;');
    }
}

function SaveNewBudgetFail(error) {
    console.log(error);
}

function funGetBudgetList() {
    var ProdID = localStorage.ProdId;
    $.ajax({
        url: APIUrlGetBudgetList + '?Prodid=' + ProdID,
        chache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

       .done(function (response)
       { funGetBudgetListSucess(response); })

           .fail(function (error)
           { funGetBudgetListFail(error); })
}

function funGetBudgetListSucess(response) {

    var TLength = response.length;

    $('#ddlBudgetList').empty();
    if (TLength > 0) {
        $('#UploadBudget').attr('style', 'display:block;');
        for (var i = 0; i < TLength; i++) {
            var BudgetName = response[i].BudgetName;
            var BudgetId = response[i].BudgetId;

            $("#ddlBudgetList").append("<option  value=" + BudgetId + ">" + BudgetName + "</option>");
        }
        $('#ddlBudgetList').attr('style', 'display:block;');

        var BudgetBreadCum = response[0].BudgetName;
        $('#spanBreadCumImport').html(BudgetBreadCum);
        $('#spanBudgetPopup').html(BudgetBreadCum);

        var BudgetID = response[0].BudgetId;
        $("#" + BudgetID).attr('style', 'border-top: 30px solid #5c8fbe;');
        FillSegmentBudget(BudgetID);
       
    }
    else {
        $('#UploadBudget').attr('style', 'display:none;');
        $('#spanBreadCumImport').html('Add New Budget');
        $('#ddlBudgetList').attr('style', 'display:none;');

        $('#tblBudget').empty();
        $('#tblBudget').append('<tr><th>Upload Date</th><th>User</th><th>Status</th><th>Currency</th><th>CO</th><th>Action</th></tr><tr><td style="text-align:center;" colspan=7>No Budget Found !!</td></tr> ');
    }
}

function funGetBudgetListFail(error) {
    console.log(error);
}

function getBudgetDetailByID() {
    var BudgetID = $('select#ddlBudgetList option:selected').val();

    var BudgetName = $('select#ddlBudgetList option:selected').text();
    $('#spanBreadCumImport').html(BudgetName);
    $('#spanBudgetPopup').html(BudgetName);
    getBudgetDetail(BudgetID);
}

function getBudgetDetail(BudgetID) {
    BuggetIDTemp = BudgetID;
    $.ajax({
        url: APIUrlGetBudgetDetail + '?Budgetid=' + BudgetID + '&UserID=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(ProdID),
    })
.done(function (response) {
    BudgetDetailSucess(response);
})
}


function FillSegmentBudget(BudegtID) {
    $.ajax({
        url: APIUrlFillSegment + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillSegmentBudgetSucess(response, BudegtID); })
}

function FillSegmentBudgetSucess(response, BudgetID) {
    var TLength = response.length;
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            if (response[i].Classification == 'Detail')
            {
                break;
            }
            else
            {
                SegString += '<th>' + response[i].Classification + '</th>';
                SegStringCnt++;
            }
        }
    }
    getBudgetDetail(BudgetID);
}




function BudgetDetailSucess(response) {  
    var TLength = response.length;
    $('#tblBudget').empty();
    $('#tblBudget').append('<tr><th>Upload Date</th><th>User</th><th>Status</th><th>Currency</th>' + SegString+ '<th>Action</th></tr>');

    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            var ActionVal = '';
            var UploadDate = response[i].Uploadeddate;
            var User = response[i].Name;
          
            var Status = response[i].Status;
            var Currency = response[i].Currency;
            var SS1 = response[i].CompanCode;
            var SS2 = response[i].S2;
            var SS3 = response[i].S3; 
            var SS4 = response[i].S4;
            var SS5 = response[i].S5;
            var SS6 = response[i].S6;

            var BudgetFileID = response[i].BudgetFileID;
           
            if (SegStringCnt == 0)
            {
                $('#tblBudget').append('<tr><td>' + UploadDate + '</td><td>' + User + '</td><td>' + Status + '</td><td>' + Currency + '</td><td><a href=javascript:GetBudgetXMLFill("' + BudgetFileID + '","' + ActionVal + '","' + Status + '");>Detail</a></td></tr>');

            }
            else if (SegStringCnt == 1) {
                $('#tblBudget').append('<tr><td>' + UploadDate + '</td><td>' + User + '</td><td>' + Status + '</td><td>' + Currency + '</td><td>' + SS1 + '</td><td><a href=javascript:GetBudgetXMLFill("' + BudgetFileID + '","' + ActionVal + '","' + Status + '");>Detail</a></td></tr>');

            }
            else if (SegStringCnt == 2) {
                $('#tblBudget').append('<tr><td>' + UploadDate + '</td><td>' + User + '</td><td>' + Status + '</td><td>' + Currency + '</td><td>' + SS1 + '</td><td>' + SS2 + '</td><td><a href=javascript:GetBudgetXMLFill("' + BudgetFileID + '","' + ActionVal + '","' + Status + '");>Detail</a></td></tr>');

            }
            else if (SegStringCnt == 3) {
                $('#tblBudget').append('<tr><td>' + UploadDate + '</td><td>' + User + '</td><td>' + Status + '</td><td>' + Currency + '</td><td>' + SS1 + '</td><td>' + SS2 + '</td><td>' + SS3 + '</td><td><a href=javascript:GetBudgetXMLFill("' + BudgetFileID + '","' + ActionVal + '","' + Status + '");>Detail</a></td></tr>');

            }
            else if (SegStringCnt == 4) {
                $('#tblBudget').append('<tr><td>' + UploadDate + '</td><td>' + User + '</td><td>' + Status + '</td><td>' + Currency + '</td><td>' + SS1 + '</td><td>' + SS2 + '</td><td>' + SS3 + '</td><td>' + SS4 + '</td><td><a href=javascript:GetBudgetXMLFill("' + BudgetFileID + '","' + ActionVal + '","' + Status + '");>Detail</a></td></tr>');

            }
            else if (SegStringCnt == 5) {
                $('#tblBudget').append('<tr><td>' + UploadDate + '</td><td>' + User + '</td><td>' + Status + '</td><td>' + Currency + '</td><td>' + SS1 + '</td><td>' + SS2 + '</td><td>' + SS3 + '</td><td>' + SS4 + '</td><td>' + SS5 + '</td><td><a href=javascript:GetBudgetXMLFill("' + BudgetFileID + '","' + ActionVal + '","' + Status + '");>Detail</a></td></tr>');

            }
            else if (SegStringCnt == 6) {
                $('#tblBudget').append('<tr><td>' + UploadDate + '</td><td>' + User + '</td><td>' + Status + '</td><td>' + Currency + '</td><td>' + SS1 + '</td><td>' + SS2 + '</td><td>' + SS3 + '</td><td>' + SS4 + '</td><td>' + SS5 + '</td><td>' + SS6 + '</td><td><a href=javascript:GetBudgetXMLFill("' + BudgetFileID + '","' + ActionVal + '","' + Status + '");>Detail</a></td></tr>');

            }
        }
    }
    else {
        $('#tblBudget').append('<tr><td colspan="7" style="text-align: center;">No Record Found !!!</td></tr>');
    }
}

function AddNewBudget() {
    showDiv('PopNewBudget');
    $(".liComDet").attr('style', 'border-bottom: 30px solid #fff;');
    $("#liNewBudget").attr('style', 'border-bottom: 30px solid #5c8fbe;');
}

function UploadXML() {
    $('#btn1').attr('style', 'display:none;');
    SegStr1 = '';
    SegStr2 = '';
    BudgetStatus = 'Saved';

    BudgetAction = $('select#ddlAction option:selected').val();

    var data = new FormData();
    var files = $("#fileXML").get(0).files;

    if (files.length > 0) {
        $('#fileXML').attr('style', 'border: none;');
        SegStr1 = $("#txtCO").val() + "|";
        var isvalid = "";
        isvalid += CheckRequired($("#txtCO"));
        var LoopCnt = 1;
        $('#tblBudgetSetting input[type="text"]').each(function () {
            var CheckCls = $(this).attr('class');
            var CheckStr = CheckCls.slice(0, 13);

            var Checkid = $(this).attr('id').slice(3);

            if ((CheckStr == 'BudgetSetting')) {
                LoopCnt++;
                var inputVal = $(this).val();
                //if (SegmentClassGLName > LoopCnt) {
                //    SegStr1 = SegStr1 + inputVal + "|";
                //}
                //else if (SegmentClassGLName <= LoopCnt) {
                //    SegStr2 = SegStr2 + inputVal + "|";
                //}

                SegStr1 = SegStr1 + inputVal + "|";

                if (LoopCnt == 2) {
                    SS2 = inputVal;
                }
                else if (LoopCnt == 3) {
                    SS3 = inputVal;
                }
                else if (LoopCnt == 4) {
                    SS4 = inputVal;
                }
                else if (LoopCnt == 5) {
                    SS5 = inputVal;
                }
                else if (LoopCnt == 6) {
                    SS6 = inputVal;
                }
                else if (LoopCnt == 7) {
                    SS7 = inputVal;
                }
                else if (LoopCnt == 8) {
                    SS8 = inputVal;
                }

                if (inputVal == '') {
                    $('#' + $(this).attr('id')).attr('style', 'border-color:red;');
                    isvalid += "1";
                }
                else {
                    $('#' + $(this).attr('id')).attr('style', 'border: none;');
                }
            }
        });

        if (isvalid == "") {

            showLoad(1);
            data.append("UploadedXML", files[0]);
            data.append("uploadedby", localStorage.UserId);
            data.append("Action", "Initial Upload");
            //data.append("LeaveexistingCOA", LeaveCOA);

            data.append("CompanCode", $('#txtCO').val());
            data.append("prodid", localStorage.ProdId);
            data.append("Budgetid", BuggetIDTemp);
            data.append("S1", $('#txtCO').val());
            data.append("S2", SS2);
            data.append("S3", SS3);
            data.append("S4", SS4);
            data.append("S5", SS5);
            data.append("S6", SS6);
            data.append("S7", SS7);
            data.append("S8", SS8);
            data.append("LedgerLebel", 0);
            data.append("SegmentName", SegmentStrCode);
            data.append("SegStr1", SegStr1.slice(0, -1));
            data.append("SegStr2", SegStr2.slice(0, -1));

            var ajaxRequest = $.ajax({

                url: APIUrlImportBudget,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: "POST",
                // async: false,
                contentType: false,
                processData: false,

                data: data
            });
            ajaxRequest.done(function (response) {
                getBudgetDetail(BuggetIDTemp);
                BudgetFileID = response;
                $('#tabSettings').attr('style', 'display:none;');
                $('#tabCategories').attr('style', 'display:block;');
                GetBudgetCategory(response);
            });
        }
        else {
            $('#btn1').attr('style', 'display:block;');
        }
    }
    else {
        $('#btn1').attr('style', 'display:block;');
        $('#fileXML').attr('style', 'border: 1px solid red !important;');
    }
}

function GetBudgetCategory(BudgetFileID) {
    $('#btn1').attr('style', 'display:block;');
    $('#ulFirst').attr('style', 'display:none;');
    $('#ulSecond').attr('style', 'display:block;');

    $.ajax({
        url: APIUrlBudgetCategory + '?BudgetFileID=' + BudgetFileID + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
.done(function (response) {
    BudgetCategorySucess(response);
})
}

function BudgetCategorySucess(response) {
    COACategoryString = '';
    $(".BudgetUpload").attr('style', 'border-bottom:30px solid #fff');
    $("#liCategory").attr('style', 'border-bottom:30px solid #4cbf63 !important;');

    var TLength = response.length;
    MaxRowCategory = TLength;
    $("#tblBudgetCate").empty();
    $('#btnCOACategory').attr('style', 'display:none;margin-right:10px;');
    //if (BudgetStatus == 'Saved') {
    //    $('#btnCOACategory').attr('style', 'display:block;margin-right:10px;');
    //}
    //else {
    //    $('#btnCOACategory').attr('style', 'display:none;margin-right:10px;');
    //}

    for (var i = 0; i < TLength; i++) {
        var BID = response[i].BudgetCategoryID;
        var cID = response[i].cID;
        var CategoryNumber = response[i].CategoryNumber;
        var CategoryDescription = response[i].CategoryDescription;
        var CategoryFringe = response[i].CategoryFringe;
        var CategoryTotal = response[i].CategoryTotal;
        var Available = response[i].Abailable;
        var COAString = response[i].COACodeOriginal;
        var Masking = response[i].Masking;
        MaskingTypeCheckValue = Masking;
        $('#spanMasking').html('Code Masking :- ' + Masking);
        var strHtml = "";
       
        if (BudgetStatus == 'Saved') {
          

            if (Available == 'RED') {
                if (COAString == '') {
                  
                    var MaskingResult = '';
                    MaskingResult = CheckMasking(Masking, CategoryNumber);

                    if ((MaskingResult == '') && (Masking.length == CategoryNumber.length)) {
                        $('#btnCOACategory').attr('style', 'display:block;margin-right:10px;');
                        strHtml += "<tr id=" + BID + " class='trBudgetRedBg'>";
                        strHtml += "<td><input type='checkbox' onChange='javascript:CreateCOACategory(" + BID + ");' id='chk" + BID + "'/> </td>";
                        strHtml += "<td><span style='display:none;' class='spanCategoryCheck' id=spanCh" + BID + ">NO</span>";
                        strHtml += CategoryNumber + "</td>";
                        strHtml += "<td><input name=" + (i + 1) + ":2 type='text' id=txtcDesc" + BID + " onfocusout='javascript:UpdateBudgetCategorycDesc(" + BID + ");' class='budgetHide detectTab' value='" + CategoryDescription + "' style='display:none;'><span id=spancDesc" + BID + " onclick='javascript:editBudgetCategorycDesc(" + BID + ");' class='budgetShow'>" + CategoryDescription + "</span></td>";
                        //  strHtml += "<td><input name=" + (i + 1) + ":3 type='text' id=txtcFringe" + BID + " onfocusout='javascript:UpdateBudgetCategorycFringe(" + BID + ");' class='budgetHide cls1 detectTab' value='" + CategoryFringe + "' style='display:none;'><span id=spancFringe" + BID + " onclick='javascript:editBudgetCategorycFringe(" + BID + ");' class='budgetShow'>" + CategoryFringe + "</span></td>";
                        strHtml += "<td><input name=" + (i + 1) + ":4 type='text' id=txtcTotal" + BID + " onfocusout='javascript:UpdateBudgetCategorycTotal(" + BID + ");' class='budgetHide cls1 detectTab' value='" + CategoryTotal + "' style='display:none;'><span id=spancTotal" + BID + " onclick='javascript:editBudgetCategorycTotal(" + BID + ");' class='budgetShow'>" + CategoryTotal + "</span></td>";

                    }
                    else {
                        strHtml += "<tr id=" + BID + " class='trMasking'>";
                        strHtml += "<td></td>";
                        //strHtml += "<td><input type='checkbox' onChange='javascript:CreateCOACategory(" + BID + ");' id='chk" + BID + "'/> </td>";
                        strHtml += "<td><input name=" + (i + 1) + " type='text' id=txtcCategoryy" + BID + " onfocusout='javascript:CategoryMasking(" + BID + ");' class='budgetHide detectTab clsCode' value='" + CategoryNumber + "' style='display:none;'><span id=spancCategory" + BID + " onclick='javascript:editBudgetCategorycCategory(" + BID + ");' class='budgetShow'>" + CategoryNumber + "</span></td>";
                        strHtml += "<td><input name=" + (i + 1) + ":2 type='text' id=txtcDesc" + BID + " onfocusout='javascript:UpdateBudgetCategorycDesc(" + BID + ");' class='budgetHide detectTab' value='" + CategoryDescription + "' style='display:none;'><span id=spancDesc" + BID + " onclick='javascript:editBudgetCategorycDesc(" + BID + ");' class='budgetShow'>" + CategoryDescription + "</span></td>";
                        // strHtml += "<td><input name=" + (i + 1) + ":3 type='text' id=txtcFringe" + BID + " onfocusout='javascript:UpdateBudgetCategorycFringe(" + BID + ");' class='budgetHide cls1 detectTab' value='" + CategoryFringe + "' style='display:none;'><span id=spancFringe" + BID + " onclick='javascript:editBudgetCategorycFringe(" + BID + ");' class='budgetShow'>" + CategoryFringe + "</span></td>";
                        strHtml += "<td><input name=" + (i + 1) + ":4 type='text' id=txtcTotal" + BID + " onfocusout='javascript:UpdateBudgetCategorycTotal(" + BID + ");' class='budgetHide cls1 detectTab' value='" + CategoryTotal + "' style='display:none;'><span id=spancTotal" + BID + " onclick='javascript:editBudgetCategorycTotal(" + BID + ");' class='budgetShow'>" + CategoryTotal + "</span></td>";

                    }
                }
                else {
                    strHtml += "<tr id=" + BID + ">";
                    strHtml += "<td></td>";
                    strHtml += "<td>" + CategoryNumber + "</td>";
                    strHtml += "<td>" + CategoryDescription + "</td>";
                    // strHtml += "<td><input name=" + (i + 1) + ":3 type='text' id=txtcFringe" + BID + " onfocusout='javascript:UpdateBudgetCategorycFringe(" + BID + ");' class='budgetHide cls1 detectTab' value='" + CategoryFringe + "' style='display:none;'><span id=spancFringe" + BID + " onclick='javascript:editBudgetCategorycFringe(" + BID + ");' class='budgetShow'>" + CategoryFringe + "</span></td>";
                    strHtml += "<td><input name=" + (i + 1) + ":4 type='text' id=txtcTotal" + BID + " onfocusout='javascript:UpdateBudgetCategorycTotal(" + BID + ");' class='budgetHide cls1 detectTab' value='" + CategoryTotal + "' style='display:none;'><span id=spancTotal" + BID + " onclick='javascript:editBudgetCategorycTotal(" + BID + ");' class='budgetShow'>" + CategoryTotal + "</span></td>";
                    strHtml += "</tr>";
                }
            }
            else {
                strHtml += "<tr id=" + CategoryNumber + " class='trBudgetGreenBg'>";
                strHtml += "<td></td>";
                strHtml += "<td>" + CategoryNumber + "</td>";
                strHtml += "<td>" + CategoryDescription + "</td>";
                //  strHtml += "<td><input name=" + (i + 1) + ":3 type='text' id=txtcFringeC" + CategoryNumber + " onfocusout='javascript:UpdateBudgetCategorycTotalCGreen(\"" + CategoryNumber + "\",\"" + CategoryDescription + "\");' class='budgetHide cls1 detectTab' value='" + CategoryFringe + "' style='display:none;'><span id=spancFringeC" + CategoryNumber + " onclick='javascript:editBudgetCategorycFringeC(" + CategoryNumber + ");' class='budgetShow'>" + CategoryFringe + "</span></td>";
                strHtml += "<td><input name=" + (i + 1) + ":4 type='text' id=txtcTotalC" + CategoryNumber + " onfocusout='javascript:UpdateBudgetCategorycTotalCGreen(\"" + CategoryNumber + "\",\"" + CategoryDescription + "\");' class='budgetHide cls1 detectTab' value='" + CategoryTotal + "' style='display:none;'><span id=spancTotalC" + CategoryNumber + " onclick='javascript:editBudgetCategorycTotalC(" + CategoryNumber + ");' class='budgetShow'>" + CategoryTotal + "</span></td>";
                strHtml += "</tr>";
            }

        }
        else {
          
            if (Available == 'RED') {
                strHtml += "<tr>";
            }
            else {
                strHtml += "<tr class='trBudgetGreenBg'>";
            }

            strHtml += "<td></td>";
            strHtml += "<td>" + CategoryNumber + "</td>";
            strHtml += "<td>" + CategoryDescription + "</td>";
            // strHtml += "<td>" + CategoryFringe + "</td>";
            strHtml += "<td>" + CategoryTotal + "</td>";
            strHtml += "</tr>";

        }

        $("#tblBudgetCate").append(strHtml);

    }
    showLoad(2);
}

function editBudgetCategorycCategory(CategoryID) {
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancCategory' + CategoryID).attr('style', 'display:none;');
    $('#txtcCategoryy' + CategoryID).attr('style', 'display:block !important;');
    $('#txtcCategoryy' + CategoryID).focus();
}

function editBudgetAccountcAccount(BAccountID) {
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancAccountt' + BAccountID).attr('style', 'display:none;');
    $('#txtbAIDD' + BAccountID).attr('style', 'display:block !important;');
    $('#txtbAIDD' + BAccountID).focus();
}

$('#tblBudgetCate').delegate('.clsCode', 'change keyup paste', function () {
    var MaskingType = MaskingTypeCheckValue;
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

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
        else if (strvalue == 97) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122) {

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
        else if (strvalue == 65) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122 || value >= 47 && value <= 58) {

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
        else if (strvalue == 45) {

            if (value == 45) {

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
    }
    if (maskingLength == strlength) {
    }
    else if (strlength > maskingLength) {
        $('#' + currentId).val(strval.substring(0, strval.length - 1));
        // funDivShowCode();

        $('#' + currentId).focus();
    }

    if (MaskingType.charAt(strlength) == '-') {
        var strval = $('#' + currentId).val();
        $('#' + currentId).val(strval + '-');
    }

})   // Code Length check

$('#tblBudgetAccount').delegate('.clsCode', 'change keyup paste', function () {
    var MaskingType = MaskingTypeCheckValue;
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

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
        else if (strvalue == 97) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122) {

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
        else if (strvalue == 65) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122 || value >= 47 && value <= 58) {

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
        else if (strvalue == 45) {

            if (value == 45) {

            }
            else {
                $('#' + currentId).val(strval.substring(0, strval.length - 1));
                //  funDivShowCode();
            }
        }
    }
    if (maskingLength == strlength) {
    }
    else if (strlength > maskingLength) {
        $('#' + currentId).val(strval.substring(0, strval.length - 1));
        // funDivShowCode();

        $('#' + currentId).focus();
    }

    if (MaskingType.charAt(strlength) == '-') {
        var strval = $('#' + currentId).val();
        $('#' + currentId).val(strval + '-');
    }

})

function CategoryMasking(BCI) {
    var CatNo = $('#txtcCategoryy' + BCI).val();


    var Resultt = CheckMasking(MaskingTypeCheckValue, CatNo)
    if (Resultt == '') {
        if (MaskingTypeCheckValue.length == CatNo.length) {
            $.ajax({
                url: APIUrlUpdateCodeMaskingCategory + '?BudgetFileID=' + BudgetFileID + '&CategoryNumber=' + CatNo + '&BudgetCategoryID=' + BCI,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'GET',

                contentType: 'application/json; charset=utf-8',
            })
        .done(function (response) {
            CategoryMaskingSucess(response);
        })
        }
        else {
            ErrorMsg('Please Correct The Code Masking.');
        }
    }
    else {
        ErrorMsg('Please Correct The Code Masking.');
    }
}

function CategoryMaskingSucess(response) {
    if (response[0].ReturnVal == '1') {
        SucessMsg('Record Updated in Budget File.');
        GetBudgetCategory(BudgetFileID);
    }
    else {
        ErrorMsg('Category Number Already Exists');
    }
}


function AccountMasking(BCI) {
    var CatNo = $('#txtbAIDD' + BCI).val();


    var Resultt = CheckMasking(MaskingTypeCheckValue, CatNo)
    if (Resultt == '') {
        if (MaskingTypeCheckValue.length == CatNo.length) {
            $.ajax({
                url: APIUrlUpdateCodeMaskingAccount + '?BudgetFileID=' + BudgetFileID + '&AccountNumber=' + CatNo + '&BudgetAccountID=' + BCI,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'GET',

                contentType: 'application/json; charset=utf-8',
            })
        .done(function (response) {
            AccountMaskingSucess(response);
        })
        }
        else {
            ErrorMsg('Please Correct The Code Masking.');
        }
    }
    else {
        ErrorMsg('Please Correct The Code Masking.');
    }
}

function AccountMaskingSucess(response) {
    if (response[0].ReturnVal == '1') {
        SucessMsg('Record Updated in Budget File.');
        BudgetAccount();
    }
    else {
        ErrorMsg('Category Number Already Exists');
    }
}


function CheckMasking(MaskingValue, AccountValue) {
    var ReturnVal = '';
    var MaskingType = MaskingValue;
    var maskingLength = MaskingType.length;

    var strval = AccountValue;
    var strlength = strval.length;

    for (var i = 0; i < strlength; i++) {
        var res = strval.charAt(i);
        var value = res.charCodeAt(0);


        var res1 = MaskingType.charAt(i);
        var strvalue = res1.charCodeAt(0);


        if (strvalue == 35) {

            if (value > 47 && value < 58) {
                ReturnVal += '';
            }
            else {
                ReturnVal += 'ERROR';
            }
        }
        else if (strvalue == 97) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122) {
                ReturnVal += '';
            }
            else {
                ReturnVal += 'ERROR';
            }
        }
        else if (strvalue == 65) {

            if (value >= 65 && value <= 90 || value >= 97 && value <= 122 || value >= 47 && value <= 58) {
                ReturnVal += '';
            }
            else {
                ReturnVal += 'ERROR';
            }
        }
        else if (strvalue == 45) {

            if (value == 45) {
                ReturnVal += '';
            }
            else {
                ReturnVal += 'ERROR';
            }
        }
    }

    if (maskingLength == strlength) {
        ReturnVal += '';
    }
    else if (strlength > maskingLength) {
        ReturnVal += 'ERROR';
    }
    return ReturnVal;
}

function CreateCOACategory(CategoryID) {

    if ($("#chk" + CategoryID).is(':checked')) {
        COACategoryString = COACategoryString + ',' + CategoryID;
        COACategoryString = COACategoryString.replace(',,', ',');
    } else {
        COACategoryString = COACategoryString.replace(CategoryID, '');
        COACategoryString = COACategoryString.replace(',,', ',');
    }

}
function CreateCOAAccount(AccountID) {

    if ($("#chkA" + AccountID).is(':checked')) {
        COAAccountString = COAAccountString + ',' + AccountID;
        COAAccountString = COAAccountString.replace(',,', ',');
    } else {
        COAAccountString = COAAccountString.replace(AccountID, '');
        COAAccountString = COAAccountString.replace(',,', ',');
    }
}

function BudgetAccountListSucess(response) {

    $(".BudgetUpload").attr('style', 'border-bottom:30px solid #fff');
    $("#liAcccounts").attr('style', 'border-bottom:30px solid #4cbf63 !important;');

    var TLength = response.length;
    $("#tblBudgetAccount").empty();
    $('#btnCOAAccount').attr('style', 'display:none;margin-right:10px;');
    for (var i = 0; i < TLength; i++) {
        var BudgetAccountID = response[i].BudgetAccountID;
        var aID = response[i].AccountID;
        var AccountNumber = response[i].AccountNumber;
        var AccountDesc = response[i].AccountDesc;
        var AccountFringe = response[i].AccountFringe;
        var AccountTotal = response[i].AccountTotal;
        var CategoryNo = response[i].CategoryNumber;
        var Available = response[i].Status;
        var COAStr = response[i].COACodeOriginal;
        var Masking = response[i].Masking;
        MaskingTypeCheckValue = Masking;

        $('#spanMasking').html('Code Masking :- ' + Masking);
        var strHtml = "";

        if (BudgetStatus == 'Saved') {
           
            if (Available == 'RED') {
                if (COAStr == '') {

                    var MaskingResult = '';
                    MaskingResult = CheckMasking(Masking, AccountNumber);
                    if ((MaskingResult == '') && (Masking.length == AccountNumber.length)) {
                        $('#btnCOAAccount').attr('style', 'display:block;margin-right:10px;');
                        strHtml += "<tr id=tra" + BudgetAccountID + " class='trBudgetRedBg'>";
                        strHtml += "<td><input type='checkbox' onChange='javascript:CreateCOAAccount(" + BudgetAccountID + ");' id='chkA" + BudgetAccountID + "'/> </td>";
                        strHtml += "<td><span style='display:none;' class='spanAccountCheck' id=spanCha" + BudgetAccountID + ">NO</span>";
                        strHtml += CategoryNo + "</td>";
                        strHtml += "<td>" + AccountNumber + "</td>";
                        strHtml += "<td><input name=" + (i + 1) + ":2 type='text' id=txtaDesc" + BudgetAccountID + " onfocusout='javascript:UpdateBudgetAccountaDesc(" + BudgetAccountID + ");' class='budgetHide detectTabAc' value='" + AccountDesc + "' style='display:none;'><span id=spanaDesc" + BudgetAccountID + " onclick='javascript:editBudgetAccountaDesc(" + BudgetAccountID + ");' class='budgetShow'>" + AccountDesc + "</span></td>";
                    }
                    else {

                        strHtml += "<tr id=tra" + BudgetAccountID + " class='trMasking'>";
                        strHtml += "<td></td>";
                        //   strHtml += "<td><input type='checkbox' onChange='javascript:CreateCOAAccount(" + BudgetAccountID + ");' id='chkA" + BudgetAccountID + "'/> </td>";
                        strHtml += "<td><span style='display:none;' class='spanAccountCheck' id=spanCha" + BudgetAccountID + ">NO</span>";
                        strHtml += CategoryNo + "</td>";
                        strHtml += "<td><input name=" + (i + 1) + " type='text' id=txtbAIDD" + BudgetAccountID + " onfocusout='javascript:AccountMasking(" + BudgetAccountID + ");' class='budgetHide detectTab clsCode' value='" + AccountNumber + "' style='display:none;'><span id=spancAccountt" + BudgetAccountID + " onclick='javascript:editBudgetAccountcAccount(" + BudgetAccountID + ");' class='budgetShow'>" + AccountNumber + "</span></td>";                      
                        strHtml += "<td><input name=" + (i + 1) + ":2 type='text' id=txtaDesc" + BudgetAccountID + " onfocusout='javascript:UpdateBudgetAccountaDesc(" + BudgetAccountID + ");' class='budgetHide detectTabAc' value='" + AccountDesc + "' style='display:none;'><span id=spanaDesc" + BudgetAccountID + " onclick='javascript:editBudgetAccountaDesc(" + BudgetAccountID + ");' class='budgetShow'>" + AccountDesc + "</span></td>";
                    }
                }
                else {
                    strHtml += "<tr id=tra" + BudgetAccountID + ">";
                    strHtml += "<td></td>";
                    strHtml += "<td><span style='display:none;' class='spanAccountCheck' id=spanCha" + BudgetAccountID + ">NO</span>";
                    strHtml += CategoryNo + "</td>";
                    strHtml += "<td>" + AccountNumber + "</td>";
                    strHtml += "<td>" + AccountDesc + "</td>";
                }

                if (BudgetStatus == 'Saved') {

                    // strHtml += "<td><input name=" + (i + 1) + ":3 type='text' id=txtaFringe" + BudgetAccountID + " onfocusout='javascript:UpdateBudgetAccountaFringe(" + BudgetAccountID + ");' class='budgetHide cls1 detectTabAc' value='" + AccountFringe + "' style='display:none;'><span id=spanaFringe" + BudgetAccountID + " onclick='javascript:editBudgetAccountaFringe(" + BudgetAccountID + ");' class='budgetShow'>" + AccountFringe + "</span></td>";
                    strHtml += "<td><input name=" + (i + 1) + ":5 type='text' id=txtaTotal" + BudgetAccountID + " onfocusout='javascript:UpdateBudgetAccountaTotal(" + BudgetAccountID + ");' class='budgetHide cls1 detectTabAc' value='" + AccountTotal + "' style='display:none;'><span id=spanaTotal" + BudgetAccountID + " onclick='javascript:editBudgetAccountaTotal(" + BudgetAccountID + ");' class='budgetShow'>" + AccountTotal + "</span></td>";
                    strHtml += "</tr>";
                }
                else {

                }

            }
            else {
                strHtml += "<tr id=tra" + BudgetAccountID + " class='trBudgetGreenBg'>";
                strHtml += "<td></td>";
                strHtml += "<td><span style='display:none;' class='spanAccountCheck' id=spanCha" + BudgetAccountID + ">YES</span>";

                if (BudgetStatus == 'Saved') {
                    strHtml += CategoryNo + "</td>";
                    strHtml += "<td>" + AccountNumber + "</td>";
                    strHtml += "<td>" + AccountDesc + "</td>";
                    //  strHtml += "<td><input name=" + (i + 1) + ":3 type='text' id=txtaFringeA" + AccountNumber + " onfocusout='javascript:AddAccounttoBudget(\"" + AccountNumber + "\",\"" + AccountDesc + "\",\"" + CategoryNo + "\");' class='budgetHide cls1 detectTabAc' value='" + AccountFringe + "' style='display:none;'><span id=spanaFringeA" + AccountNumber + " onclick='javascript:editBudgetAccountaFringeA(\"" + AccountNumber + "\");' class='budgetShow'>" + AccountFringe + "</span></td>";
                    strHtml += "<td><input name=" + (i + 1) + ":5 type='text' id=txtaTotalA" + AccountNumber + " onfocusout='javascript:AddAccounttoBudget(\"" + AccountNumber + "\",\"" + AccountDesc + "\",\"" + CategoryNo + "\");' class='budgetHide cls1 detectTabAc' value='" + AccountTotal + "' style='display:none;'><span id=spanaTotalA" + AccountNumber + " onclick='javascript:editBudgetAccountaTotalA(\"" + AccountNumber + "\");' class='budgetShow'>" + AccountTotal + "</span></td>";
                    strHtml += "</tr>";
                }
                else {
                    strHtml += CategoryNo + "</td>";
                    strHtml += "<td>" + AccountNumber + "</td>";
                    strHtml += "<td>" + AccountDesc + "</td>";
                    //  strHtml += "<td>" + AccountFringe + "</td>";
                    strHtml += "<td>" + AccountTotal + "</td>";
                    strHtml += "</tr>";
                }
            }
        }
        else {
          
            if (Available == 'RED') {
                strHtml += "<tr>";
            }
            else {
                strHtml += "<tr class='trBudgetGreenBg'>";
            }

            strHtml += "<td></td>";
            strHtml += "<td>" + CategoryNo + "</td>";
            strHtml += "<td>" + AccountNumber + "</td>";
            strHtml += "<td>" + AccountDesc + "</td>";
            // strHtml += "<td>" + AccountFringe + "</td>";
            strHtml += "<td>" + AccountTotal + "</td>";
            strHtml += "</tr>";
        }


        $("#tblBudgetAccount").append(strHtml);
    }
    showLoad(2);
}



$(document).on('keydown', 'input.detectTab', function (e) {
    var keyCode = e.keyCode || e.which;

    var data = this.name;

    var arr = data.split(':');
    CategoryCurrentRow = arr[0];
    CategoryCurrentColumn = arr[1];

    if (keyCode == 9) {
        CategoryTabPressed = 'YES'
    }
    else {
        CategoryTabPressed = 'NO'
    }
});

$(document).on('keydown', 'input.detectTabAc', function (e) {
    var keyCode = e.keyCode || e.which;

    var data = this.name;
    var arr = data.split(':');
    AccountCurrentRow = arr[0];
    AccountCurrentColumn = arr[1];

    if (keyCode == 9) {
        AccountTabPressed = 'YES'
    }
    else {
        AccountTabPressed = 'NO'
    }
});

//-------------------------------Auto Fill Company Code --------------------------

$('#txtCO').click(function () {
    FillCompany();
})
$('#txtCO').focus(function () {
    FillCompany();
})

//--------------------------------------------------- CompanyCode   
function FillCompany() {
    $.ajax({
        //url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
        url: APIUrlFillAccount + '?ProdId=' + localStorage.ProdId + '&Classification=Company',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillCompanySucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillCompanySucess(response) {
    VarGetCompanyId = [];
    VarGetCompanyId = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.AccountCode,
            label: m.AccountCode,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".CompnayCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnCO").val(ui.item.value);
            $('#txtCO').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnCO").val(ui.item.value);
            $('#txtCO').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnCO").val('');
                //$('#txtCO  ').val('');
            }
        }
    })
}
//---------------------------------------------------

function BudgetAccount() {
    $('#tabCategories').attr('style', 'display:none;');
    $('#tabDetails').attr('style', 'display:none;');
    $('#tabAccounts').attr('style', 'display:block;');


    BudgetAccountList(ButtonCheck);
}

function BudgetAccountList(ButtonCheck) {
    showLoad(1);
    $.ajax({
        url: APIUrlBudgetAccounts + '?BudgetFileID=' + BudgetFileID + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },

        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
.done(function (response) {
    BudgetAccountListSucess(response);
})
}

function BudgetDetail() {
    $('#tabCategories').attr('style', 'display:none;');
    $('#tabAccounts').attr('style', 'display:none;');
    $('#tabDetails').attr('style', 'display:block;');
    BudgetDetailList();
}

function BudgetDetailList() {
    showLoad(1);
    $.ajax({
        url: APIUrlBudgetDetails + '?BudgetFileID=' + BudgetFileID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
.done(function (response) {
    BudgetDetailListSucess(response);
})
}

function BudgetDetailListSucess(response) {
    $(".BudgetUpload").attr('style', 'border-bottom:30px solid #fff');
    $(".BudgetUpload a").attr('style', 'color:#fff !important;');
    $("#liDetail").attr('style', 'border-bottom:30px solid #4cbf63 !important;');


    BudgetGlobalCount = 1;
    // $(".BudgetUpload").attr('style', 'border-bottom:30px solid #fff');
    // $("#liDetail").attr('style', 'border-bottom:30px solid #5c8fbe');
    // $('#liCategory a').attr('style', 'color:#5c8fbe !important;')

    var TLength = response.length;
    $("#tblBudgetDetail").empty();

    // $("#tblBudgetDetail").append("<tr><th>Category No.</th><th>A/c Number</th><th>Detail No.</th> <th>AggPercent</th><th>DLocation</th><th>DetailSet</th><th>Description</th><th>Amount</th><th>Unit</th><th>X</th><th>Unit2</th><th>Currency</th><th>Rate</th><th>Unit3</th> <th>Unit4</th><th>SubTotal</th><th>HiddenDfourthMlt</th></tr>");
    for (var i = 0; i < TLength; i++) {
        var strHtml = '';
        var BudgetDetailID = response[i].BudgetDetailID;
        var AccountID = response[i].AccountID;
        //  var AggPercent = response[i].AggPercent;
        // var DLocation = response[i].DLocation;
        //  var DetailSet = response[i].DetailSet;
        var Description = response[i].Description;
        //  var Amount = response[i].Amount;
        // var Unit = response[i].Unit;
        // var X = response[i].X;
        //  var Unit2 = response[i].Unit2;
        //  var Currency = response[i].Currency;
        //  var Rate = response[i].Rate;
        // var Unit3 = response[i].Unit3;
        // var Unit4 = response[i].Unit4;
        var SubTotal = response[i].SubTotal;
        //  var HiddenDfourthMlt = response[i].HiddenDfourthMlt;
        var AccountNumber = response[i].AccountNumber;
        var CategoryNumber = response[i].CategoryNumber;
        var DetailNumber = response[i].DetailNumber;


        strHtml += "<tr id=" + BudgetDetailID + ">";
        strHtml += "<td>" + CategoryNumber + "</td>";
        strHtml += "<td>" + AccountNumber + "</td>";
        strHtml += "<td><input type='text' style='width: 50px;' id=txt" + BudgetDetailID + " value='" + DetailNumber + "'/></td>";
        // strHtml += "<td>" + AggPercent + "</td>";
        // strHtml += "<td>" + DLocation + "</td>";
        // strHtml += "<td>" + DetailSet + "</td>";
        strHtml += "<td>" + Description + "</td>";
        //if (Description == '') {
        //    strHtml += "<td><input type='text' id=txtbdNO" + BudgetDetailID + " onfocusout='javascript:UpdateBudgetDetailDesc(" + BudgetDetailID + ");' class='budgetHide cls2' value='" + Description + "' style='display:none;'><span id=spanaddID" + BudgetDetailID + " onclick='javascript:editBudgetDetailDesc(" + BudgetDetailID + ");'  class='budgetShow BlankWidth'>" + Description + "</span></td>";
        //}
        //else {
        //    strHtml += "<td><input type='text' id=txtbdNO" + BudgetDetailID + " onfocusout='javascript:UpdateBudgetDetailDesc(" + BudgetDetailID + ");' class='budgetHide cls2' value='" + Description + "' style='display:none;'><span id=spanaddID" + BudgetDetailID + " onclick='javascript:editBudgetDetailDesc(" + BudgetDetailID + ");'  class='budgetShow'>" + Description + "</span></td>";
        //}

        //  strHtml += "<td>" + Description + "</td>";

        // strHtml += "<td>" + Amount + "</td>";
        //  strHtml += "<td>" + Unit + "</td>";
        //  strHtml += "<td>" + X + "</td>";
        //  strHtml += "<td>" + Unit2 + "</td>";
        //  strHtml += "<td>" + Currency + "</td>";
        //  strHtml += "<td>" + Rate + "</td>";
        //  strHtml += "<td>" + Unit3 + "</td>";
        // strHtml += "<td>" + Unit4 + "</td>";
        strHtml += "<td>" + SubTotal + "</td>";
        //  strHtml += "<td>" + HiddenDfourthMlt + "</td></tr>";


        $("#tblBudgetDetail").append(strHtml);

    }
    // $('#liAcccounts a').attr('style', 'color:#5c8fbe !important;');
    //$('#liDetail a').attr('style', 'color:#fff !important;');
    showLoad(2);
}

function UpdateBudgetDetailDesc(BudgetDetailID) {

}
function editBudgetDetailDesc(budgetdetailID) {
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');

    $('#spanaddID' + budgetdetailID).attr('style', 'display:none;');
    $('#txtbdNO' + budgetdetailID).attr('style', 'display:block !important;');
    $('#txtbdNO' + budgetdetailID).focus();
}

function GetBudgetXMLFill(FileID, Status, Type) {
    showLoad(1);
    BudgetStatus = Type;
    if (Type == 'Saved') {
        $('#btnBudgetProceed').attr('style', 'display:block;');
    }
    else {
        $('#btnBudgetProceed').attr('style', 'display:none;');
    }

    if (Status == '1') {
        BudgetAction = 'Initial Upload'
    }
    else if (Status == '2') {
        BudgetAction = 'Add To'
    }
    else if (Status == '3') {
        BudgetAction = 'Replace'
    }
    else if (Status == '4') {
        BudgetAction = 'Replace All'
    }
    $('#liDetail a').attr('style', 'color:#5c8fbe');
    $('#liAcccounts a').attr('style', 'color:#5c8fbe');

    BudgetFileID = FileID;
    showDiv('uploadBudget');
    $('#tabSettings').attr('style', 'display:none;');
    $('#tabAccounts').attr('style', 'display:none;');
    $('#tabDetails').attr('style', 'display:none;');
    $('#tabCategories').attr('style', 'display:block;');
    GetBudgetCategory(BudgetFileID);
}

function ProcessBudget() {

}
function CancelBudget() {
    $('#tabDetails').attr('style', 'display:none;');
    hideDiv('uploadBudget');
}

function showLoad(value) {
    if (value == 1) {
        $('#dvLoader').attr('style', 'display:block;');
    }
    else {
        $('#dvLoader').attr('style', 'display:none;');
    }
}

//Edit Update Budget Category cNo.

function editBudgetCategoryCNO(BudCateID) {
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancID' + BudCateID).attr('style', 'display:none;');
    $('#txtcNO' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcNO' + BudCateID).focus();
}

function UpdateBudgetCategoryCno(BudCateID) {

    //var ChnagesCheck = 'NO';

    //$("#txtcNO" + BudCateID).on('change paste', function () {
    //    ChnagesCheck = 'YES';
    //});

    //$("#txtcNO" + BudCateID).live('change', function () {
    //    ChnagesCheck = 'YES';
    //});

    //jQuery().on('input', function () {

    //});
    //if (ChnagesCheck == 'YES') {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtcNO" + BudCateID));
    if (isvalid == '') {

        var BudgetCategoryUpdate = {
            BudgetCategoryID: BudCateID,
            Parameter: $('#txtcNO' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '1'
        }

        $.ajax({
            url: APIUrlBudgetCategoryUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetCategoryUpdate),
        })
    .done(function (response) {
        UpdateBudgetCategoryCnoSucess(response);
    })
        //    }
        //}
        //else {
        //    if (CategoryTabPressed == 'YES') {
        //        BudCateIDTemp = BudCateID;
        //        TabCategoryKeyPressed();
        //    }
        //}
    }
}

function UpdateBudgetCategoryCnoSucess(response) {

    var arr = response.split('/');
    var Result = arr[0];
    var ResultValue = arr[1];
    var BudgetCategoryID = arr[2];

    if (Result == 'Record Updated Sucessfully') {

        SucessMsg('Record Updated Sucessfully.');
        // ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');

        $('#spancID' + BudCateIDTemp).html($('#txtcNO' + BudCateIDTemp).val());
        if (ResultValue != '0') {
            $('#spanCh' + BudgetCategoryID).html('YES');
            // $('#' + BudgetCategoryID).removeClass('trLedgerCls');
        }
        else {
            $('#spanCh' + BudgetCategoryID).html('NO');
            // $('#' + BudgetCategoryID).addClass('trLedgerCls');
        }
    }
    else {
        ErrorMsg('Category Number Already Exists');
        // ShowMsgBox('showMSG', 'Category Number Already Exists', '', 'failuremsg');

        $('#txtcNO' + BudCateIDTemp).val($('#spancID' + BudCateIDTemp).html());
    }

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    if (CategoryTabPressed == 'YES') {
        TabCategoryKeyPressed();
    }
}

function ErrorMsg(Msg) {
    $("#dvMsgCategory").removeClass('SucessCls');
    $("#dvMsgCategory").html(Msg);
    $("#dvMsgCategory").addClass('ErrorCls');
    $("#dvMsgCategory").show();
    setTimeout(function () {
        $("#dvMsgCategory").hide('blind', {}, 500)
    }, 2000);
}
function SucessMsg(Msg) {
    $("#dvMsgCategory").removeClass('ErrorCls');
    $("#dvMsgCategory").html(Msg);
    $("#dvMsgCategory").addClass('SucessCls');
    $("#dvMsgCategory").show();
    setTimeout(function () {
        $("#dvMsgCategory").hide('blind', {}, 500)
    }, 2000);
}

function AccountErrorMsg(Msg) {
    $("#dvMsgAccount").removeClass('SucessCls');
    $("#dvMsgAccount").html(Msg);
    $("#dvMsgAccount").addClass('ErrorCls');
    $("#dvMsgAccount").show();
    setTimeout(function () {
        $("#dvMsgAccount").hide('blind', {}, 500)
    }, 2000);
}
function AccountSucessMsg(Msg) {
    $("#dvMsgAccount").removeClass('ErrorCls');
    $("#dvMsgAccount").html(Msg);
    $("#dvMsgAccount").addClass('SucessCls');
    $("#dvMsgAccount").show();
    setTimeout(function () {
        $("#dvMsgAccount").hide('blind', {}, 500)
    }, 2000);
}

function TabCategoryKeyPressed() {
    CategoryTabPressed = 'NO';
    var nextCateGoryTrId = $('#' + BudCateIDTemp).next("tr").attr("id");
   
    BudCateIDTemp = nextCateGoryTrId;
    if (CategoryCurrentColumn == (MaxColumnCategory)) {
       
        //editBudgetCategoryCNO(BudCateIDTemp);
        //$('#txtcNO' + BudCateIDTemp).focus();
        editBudgetCategorycDesc(BudCateIDTemp);
        $('#txtcDesc' + BudCateIDTemp).focus();
    }
    else {
        //if (CategoryCurrentColumn == 1) {
        //    editBudgetCategorycDesc(BudCateIDTemp);
        //    $('#txtcDesc' + BudCateIDTemp).focus();
        //}
        //if (CategoryCurrentColumn == 2) {
        //    editBudgetCategorycFringe(BudCateIDTemp);
        //    $('#txtcFringe' + BudCateIDTemp).focus();
        //}
        //if (CategoryCurrentColumn == 3) {
        //    editBudgetCategorycOriginal(BudCateIDTemp);
        //    $('#txtcOriginal' + BudCateIDTemp).focus();
        //}
       // if (CategoryCurrentColumn == 3) {
            editBudgetCategorycTotal(BudCateIDTemp);
            
            $('#txtcTotal' + BudCateIDTemp).select();
            $('#txtcTotal' + BudCateIDTemp).focus();
        //}
        //if (CategoryCurrentColumn == 5) {
        //    editBudgetCategorycVariance(BudCateIDTemp);
        //    $('#txtcVariance' + BudCateIDTemp).focus();
        //}
    }
}

function TabAccountKeyPressed() {
    AccountTabPressed = 'NO';
    var nextAccountTrId = $('#tra' + BudCateIDTemp).next("tr").attr("id").substring(3);
    BudCateIDTemp = nextAccountTrId;

    if (AccountCurrentColumn == (MaxColumnAccount)) {
       
        editBudgetAccountaNO(BudCateIDTemp);
        $('#txtaNO' + BudCateIDTemp).focus();

    }
    else {
        //if (AccountCurrentColumn == 1) {
        //    editBudgetAccountaDesc(BudCateIDTemp);

        //    $('#txtaDesc' + BudCateIDTemp).focus();
        //}
        //if (AccountCurrentColumn == 2) {
        //    editBudgetAccountaFringe(BudCateIDTemp);

        //    $('#txtaFringe' + BudCateIDTemp).focus();
        //}
        //if (AccountCurrentColumn == 3) {
        //    editBudgetAccountaOriginal(BudCateIDTemp);

        //    $('#txtaOriginal' + BudCateIDTemp).focus();
        //}
        //if (AccountCurrentColumn == 3) {
            editBudgetAccountaTotal(BudCateIDTemp);
            $('#txtaTotal' + BudCateIDTemp).focus();
            $('#txtaTotal' + BudCateIDTemp).select();

        //}
        //if (AccountCurrentColumn == 5) {
        //    editBudgetAccountaVariance(BudCateIDTemp);
        //    $('#txtaVariance' + BudCateIDTemp).focus();
        //}
    }


}

//Edit Update Budget Category cDesc.

function editBudgetCategorycDesc(BudCateID) {
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancDesc' + BudCateID).attr('style', 'display:none;');
    $('#txtcDesc' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcDesc' + BudCateID).focus();
}

function UpdateBudgetCategorycDesc(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtcDesc" + BudCateID));
    if (isvalid == '') {

        var BudgetCategoryUpdate = {
            BudgetCategoryID: BudCateID,
            Parameter: $('#txtcDesc' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '2'
        }

        $.ajax({
            url: APIUrlBudgetCategoryUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetCategoryUpdate),
        })
    .done(function (response) {
        UpdateBudgetCategorycDescSucess(response);
    })
    }
}

function UpdateBudgetCategorycDescSucess(response) {
    // ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    SucessMsg('Record Updated Sucessfully.');
    $('#spancDesc' + BudCateIDTemp).html($('#txtcDesc' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    //if (CategoryTabPressed == 'YES') {
    //    TabCategoryKeyPressed();
    //}
}

//Edit Updade Category Fringe

function editBudgetCategorycFringe(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancFringe' + BudCateID).attr('style', 'display:none;');
    $('#txtcFringe' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcFringe' + BudCateID).focus();
}

function UpdateBudgetCategorycFringe(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtcFringe" + BudCateID));
    if (isvalid == '') {

        var BudgetCategoryUpdate = {
            BudgetCategoryID: BudCateID,
            Parameter: $('#txtcFringe' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '3'
        }

        $.ajax({
            url: APIUrlBudgetCategoryUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetCategoryUpdate),
        })
    .done(function (response) {
        UpdateBudgetCategorycFringeSucess(response);
    })
    }
}

function UpdateBudgetCategorycFringeSucess(response) {
    //  ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    SucessMsg('Record Updated Sucessfully.');
    $('#spancFringe' + BudCateIDTemp).html($('#txtcFringe' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    //if (CategoryTabPressed == 'YES') {
    //    TabCategoryKeyPressed();
    //}
}

// Edit Update Budget Category Original 

function editBudgetCategorycOriginal(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancOriginal' + BudCateID).attr('style', 'display:none;');
    $('#txtcOriginal' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcOriginal' + BudCateID).focus();
}

function UpdateBudgetCategorycOriginal(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtcOriginal" + BudCateID));
    if (isvalid == '') {

        var BudgetCategoryUpdate = {
            BudgetCategoryID: BudCateID,
            Parameter: $('#txtcOriginal' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '4'
        }

        $.ajax({
            url: APIUrlBudgetCategoryUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetCategoryUpdate),
        })
    .done(function (response) {
        UpdateBudgetCategorycOriginalSucess(response);
    })
    }
}

function UpdateBudgetCategorycOriginalSucess(response) {
    // ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    SucessMsg('Record Updated Sucessfully.');
    $('#spancOriginal' + BudCateIDTemp).html($('#txtcOriginal' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    //if (CategoryTabPressed == 'YES') {
    //    TabCategoryKeyPressed();
    //}
}

//Edit Update Category Total

function editBudgetCategorycTotal(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancTotal' + BudCateID).attr('style', 'display:none;');
    $('#txtcTotal' + BudCateID).attr('style', 'display:block !important;');
   
    $('#txtcTotal' + BudCateIDTemp).select();
    $('#txtcTotal' + BudCateID).focus();
}

function UpdateBudgetCategorycTotal(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtcTotal" + BudCateID));
    if (isvalid == '') {

        var BudgetCategoryUpdate = {
            BudgetCategoryID: BudCateID,
            Parameter: $('#txtcTotal' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '5'
        }

        $.ajax({
            url: APIUrlBudgetCategoryUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetCategoryUpdate),
        })
    .done(function (response) {
        UpdateBudgetCategorycTotalSucess(response);
    })
    }
}

function UpdateBudgetCategorycTotalSucess(response) {
    SucessMsg('Record Updated Sucessfully.');
    $('#spancTotal' + BudCateIDTemp).html($('#txtcTotal' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    if (CategoryTabPressed == 'YES') {
        TabCategoryKeyPressed();
    }
}

//Edit Update Category Variance

function editBudgetCategorycVariance(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancVariance' + BudCateID).attr('style', 'display:none;');
    $('#txtcVariance' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcVariance' + BudCateID).focus();
}

function UpdateBudgetCategorycVariance(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtcVariance" + BudCateID));
    if (isvalid == '') {

        var BudgetCategoryUpdate = {
            BudgetCategoryID: BudCateID,
            Parameter: $('#txtcVariance' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '6'
        }

        $.ajax({
            url: APIUrlBudgetCategoryUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetCategoryUpdate),
        })
    .done(function (response) {
        UpdateBudgetCategorycVarianceSucess(response);
    })
    }
}

function UpdateBudgetCategorycVarianceSucess(response) {
    SucessMsg('Record Updated Sucessfully.');
    // ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    $('#spancVariance' + BudCateIDTemp).html($('#txtcVariance' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    //if (CategoryTabPressed == 'YES') {
    //    TabCategoryKeyPressed();
    //}
}

///////////////////////////////////////////////////////////////////////////////////////////////////

//Edit Update Budget Account cNo.

function editBudgetAccountaNO(BudCateID) {
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaID' + BudCateID).attr('style', 'display:none;');
    $('#txtaNO' + BudCateID).attr('style', 'display:block !important;');
    $('#txtaNO' + BudCateID).focus();
}
function UpdateBudgetAccountcNo(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtaNO" + BudCateID));
    if (isvalid == '') {

        var BudgetAccountUpdate = {
            BudgetAccountID: BudCateID,
            Parameter: $('#txtaNO' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '1'
        }

        $.ajax({
            url: APIUrlBudgetAccountUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetAccountUpdate),
        })
    .done(function (response) {
        UpdateBudgetAccountaNoSucess(response);
    })
    }
}

function UpdateBudgetAccountaNoSucess(response) {
    var arr = response.split('/');
    var Result = arr[0];
    var ResultValue = arr[1];
    var BudgetAcccID = arr[2];

    if (Result == 'Record Updated Sucessfully') {
        AccountSucessMsg('Record Updated Sucessfully.');
        //  ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');

        $('#spanaID' + BudCateIDTemp).html($('#txtaNO' + BudCateIDTemp).val());
        if (ResultValue != '0') {
            $('#spanCha' + BudgetAcccID).html('YES');
            //  $('#tra' + BudgetAcccID).removeClass('trLedgerCls');
        }
        else {
            $('#spanCha' + BudgetAcccID).html('NO');
            //  $('#tra' + BudgetAcccID).addClass('trLedgerCls');
        }
    }

    else {
        // ShowMsgBox('showMSG', 'Account Number Already Exists', '', 'failuremsg');
        AccountErrorMsg('Account Number Already Exists');

        $('#txtaNO' + BudCateIDTemp).val($('#spanaID' + BudCateIDTemp).html());

    }
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');

    if (AccountTabPressed == 'YES') {
        TabAccountKeyPressed();
    }
}

//Edit Update Budget Account cDesc.

function editBudgetAccountaDesc(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaDesc' + BudCateID).attr('style', 'display:none;');
    $('#txtaDesc' + BudCateID).attr('style', 'display:block !important;');
    $('#txtaDesc' + BudCateID).focus();
}

function UpdateBudgetAccountaDesc(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtaDesc" + BudCateID));
    if (isvalid == '') {

        var BudgetAccountUpdate = {
            BudgetAccountID: BudCateID,
            Parameter: $('#txtaDesc' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '2'
        }

        $.ajax({
            url: APIUrlBudgetAccountUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetAccountUpdate),
        })
    .done(function (response) {
        UpdateBudgetAccountaDescSucess(response);
    })
    }
}

function UpdateBudgetAccountaDescSucess(response) {
    AccountSucessMsg('Record Updated Sucessfully.');
    //  ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    $('#spanaDesc' + BudCateIDTemp).html($('#txtaDesc' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    if (AccountTabPressed == 'YES') {
        TabAccountKeyPressed();
    }
}

//Edit Updade Account Fringe

function editBudgetAccountaFringe(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaFringe' + BudCateID).attr('style', 'display:none;');
    $('#txtaFringe' + BudCateID).attr('style', 'display:block !important;');
    $('#txtaFringe' + BudCateID).focus();
}

function UpdateBudgetAccountaFringe(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtaFringe" + BudCateID));
    if (isvalid == '') {

        var BudgetAccountUpdate = {
            BudgetAccountID: BudCateID,
            Parameter: $('#txtaFringe' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '3'
        }

        $.ajax({
            url: APIUrlBudgetAccountUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetAccountUpdate),
        })
    .done(function (response) {
        UpdateBudgetAccountaFringeSucess(response);
    })
    }
}

function UpdateBudgetAccountaFringeSucess(response) {
    AccountSucessMsg('Record Updated Sucessfully.');
    // ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    $('#spanaFringe' + BudCateIDTemp).html($('#txtaFringe' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    if (AccountTabPressed == 'YES') {
        TabAccountKeyPressed();
    }
}

// Edit Update Budget Account Original 

function editBudgetAccountaOriginal(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaOriginal' + BudCateID).attr('style', 'display:none;');
    $('#txtaOriginal' + BudCateID).attr('style', 'display:block !important;');
    $('#txtaOriginal' + BudCateID).focus();
}

function UpdateBudgetAccountaOriginal(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtaOriginal" + BudCateID));
    if (isvalid == '') {

        var BudgetAccountUpdate = {
            BudgetAccountID: BudCateID,
            Parameter: $('#txtaOriginal' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '4'
        }

        $.ajax({
            url: APIUrlBudgetAccountUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetAccountUpdate),
        })
    .done(function (response) {
        UpdateBudgetAccountaOriginalSucess(response);
    })
    }
}

function UpdateBudgetAccountaOriginalSucess(response) {
    AccountSucessMsg('Record Updated Sucessfully.');
    // ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    $('#spanaOriginal' + BudCateIDTemp).html($('#txtaOriginal' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    if (AccountTabPressed == 'YES') {
        TabAccountKeyPressed();
    }
}

//Edit Update Account Total

function editBudgetAccountaTotal(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaTotal' + BudCateID).attr('style', 'display:none;');
    $('#txtaTotal' + BudCateID).attr('style', 'display:block !important;');
    $('#txtaTotal' + BudCateID).focus();
    $('#txtaTotal' + BudCateIDTemp).select();
}

function UpdateBudgetAccountaTotal(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtaTotal" + BudCateID));
    if (isvalid == '') {

        var BudgetAccountUpdate = {
            BudgetAccountID: BudCateID,
            Parameter: $('#txtaTotal' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '5'
        }

        $.ajax({
            url: APIUrlBudgetAccountUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetAccountUpdate),
        })
    .done(function (response) {
        UpdateBudgetAccountaTotalSucess(response);
    })
    }
}

function UpdateBudgetAccountaTotalSucess(response) {
    AccountSucessMsg('Record Updated Sucessfully.');
    //  ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    $('#spanaTotal' + BudCateIDTemp).html($('#txtaTotal' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    if (AccountTabPressed == 'YES') {
        TabAccountKeyPressed();
    }
}

//Edit Update Account Variance

function editBudgetAccountaVariance(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaVariance' + BudCateID).attr('style', 'display:none;');
    $('#txtaVariance' + BudCateID).attr('style', 'display:block !important;');
    $('#txtaVariance' + BudCateID).focus();
}

function UpdateBudgetAccountaVariance(BudCateID) {
    BudCateIDTemp = BudCateID;
    var isvalid = "";
    isvalid = CheckRequired($("#txtaVariance" + BudCateID));
    if (isvalid == '') {

        var BudgetAccountUpdate = {
            BudgetAccountID: BudCateID,
            Parameter: $('#txtaVariance' + BudCateID).val(),
            ModifyBy: localStorage.UserId,
            Mode: '6'
        }

        $.ajax({
            url: APIUrlBudgetAccountUpdate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(BudgetAccountUpdate),
        })
    .done(function (response) {
        UpdateBudgetAccountaVarianceSucess(response);
    })
    }
}

function UpdateBudgetAccountaVarianceSucess(response) {
    AccountSucessMsg('Record Updated Sucessfully.');
    // ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');
    $('#spanaVariance' + BudCateIDTemp).html($('#txtaVariance' + BudCateIDTemp).val());
    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    if (AccountTabPressed == 'YES') {
        TabAccountKeyPressed();
    }
}

///Proceed Budget

function ProceedBudget() {

    var CheckStatusCategory = '';
    var CheckStatusAccount = '';


    var tblCategory = $('#tblBudgetCate tr').length;
    $("span.spanCategoryCheck").each(function () {
        var runId = $(this).text();
        if (runId == 'NO') {
            CheckStatusCategory = '1';
        }
    });

    if (CheckStatusCategory == '') {

        var tblAccount = $('#tblBudgetAccount tr').length;
        $("span.spanAccountCheck").each(function () {
            var runId = $(this).text();
            if (runId == 'NO') {
                CheckStatusAccount = '1';
            }
        });

        if (CheckStatusAccount == '') {
            var ObjProcessBudget = {
                ActionType: BudgetAction,
                BudgetFileID: BudgetFileID,
                BudgetID: BuggetIDTemp,
                createdby: localStorage.UserId
            }

            $.ajax({
                url: APIUrlProcessBudget,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                sync: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjProcessBudget),
            })
             .done(function (response) {
                 ProceedBudgetSucess(response);
             })
        }
        else {
            ShowMsgBox('showMSG', 'Please Resolve Error in Account Tab First.', '', 'failuremsg');
        }
    }
    else {
        ShowMsgBox('showMSG', 'Please Resolve Error in Category Tab First.', '', 'failuremsg');
    }
}
function ProceedBudgetSucess(response) {
    funGetBudgetList();
    ShowMsgBox('showMSG', 'Budget has been proceed Sucessfully.', '', '');
    CancelBudget();
}

function TabCategory() {
    showLoad(1);
    $('#ulSecond li a').attr('style', 'color:#5c8fbe;');
    $('#tabCategories').attr('style', 'display:block;');
    $('#tabAccounts').attr('style', 'display:none;');
    $('#tabDetails').attr('style', 'display:none;');
    GetBudgetCategory(BudgetFileID);
}
function TabAccount() {
    showLoad(1);
    $('#ulSecond li a').attr('style', 'color:#5c8fbe;');
    $('#tabCategories').attr('style', 'display:none;');
    $('#tabAccounts').attr('style', 'display:block;');
    $('#tabDetails').attr('style', 'display:none;');
    BudgetAccount();
}
function TabDetail() {
    $('#ulSecond li a').attr('style', 'color:#5c8fbe;');
    $('#tabCategories').attr('style', 'display:none;');
    $('#tabAccounts').attr('style', 'display:none;');
    $('#tabDetails').attr('style', 'display:block;');
    BudgetDetail();
}

//--------------------------------------------------- Episode Code   
function AutoFill(SegmentClassification) {

    $.ajax({
        url: APIUrlFillAccount + '?ProdId=' + localStorage.ProdId + '&Classification=' + SegmentClassification,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillEpiSucess(response, SegmentClassification); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillEpiSucess(response, value) {
    getEpisoderes = [];
    getEpisoderes = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.AccountId,
            label: m.AccountCode,
            //  BuyerId: m.BuyerId,
        };
    });
    $('#txt' + value).autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //   $(this).val('');

            }
        }
    })
}
//---------------------------------------------------

function FillSegment() {
    $.ajax({
        url: APIUrlFillSegment + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillSegmentSucess(response); })
}

function FillSegmentSucess(response) {
    var TLength = response.length;
    if (TLength > 0) {

        var EndLavel = 'YES';
        //$("#tblBudgetSetting thead tr").find("th:gt(0)").remove();
        $("#tblBudgetSetting thead tr").find("th").remove();
        $("#tblBudgetSetting tbody tr").find("td:gt(0)").remove();

        SegList = '';
        for (var i = 0; i < TLength; i++) {
            if (EndLavel == 'YES') {
                if (response[i].Classification == "Company") {
                    var trText = "<th>" + response[i].SegmentCode + "</th>";
                    SegmentStrCode += response[i].SegmentCode + ',';
                    $('#tblBudgetSetting thead tr').append(trText);
                }
                    //else if (response[i].Classification == "Ledger") {
                    //    SegmentClassGLName = response[i].SegmentLevel;
                    //}
                else if (response[i].Classification == "Detail") {
                    EndLavel = 'NO';
                }
                else {
                    var trText = "<th>" + response[i].SegmentCode + "</th>";
                    SegmentStrCode += response[i].SegmentCode + ',';
                    $('#tblBudgetSetting thead tr').append(trText);

                    var CodeLength = response[i].CodeLength.length;

                    var NameProperty = response[i].Classification + '|' + CodeLength;
                    var tdText = "<td><input id='txt" + response[i].Classification + "' type='text' class='BudgetSetting form-control width90 " + response[i].Classification + " input-required'" + response[i].SegmentCode + " name='" + NameProperty + "'  onblur = 'javascript:checkEpisode(\"" + response[i].Classification + "\" );'  /></td>";
                    $('#tblBudgetSetting tbody tr').append(tdText);
                    SegList += 'txt' + response[i].Classification + '|';

                    var Classs = response[i].Classification;
                    $('#txt' + Classs).focus(function () {

                        var strValue = $(this).attr('name');
                        var arr = strValue.split('|');
                        var StrName = arr[0];

                        SegmentClassNme = Classs;
                        AutoFill(StrName);
                    })
                }
            }
        }
    }
}

function CheckBudgetCOA() {
    $.ajax({
        url: APIUrlBudgetCheckCOA + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response) {
         CheckBudgetCOASucess(response);
     })
    COAAccountString = '';
}

function CheckBudgetCOASucess(response) {
    if (response == 0) {
        ShowMsgBox('showMSG', 'Please create COA for this production, before building a budget file.', '', 'failuremsg');
    }
    else {
        FillSegment();
        $('#tabSettings').attr('style', 'display:block;');
        $('#tabAccounts').attr('style', 'display:none;');
        $('#tabDetails').attr('style', 'display:none;');
        $('#tabCategories').attr('style', 'display:none;');

        $('#liSetting').attr('style', 'border-bottom:30px solid #4cbf63 !important;');
        //$('#liSetting a').attr('style', 'color:#fff !important;');
        $('#liCategory').attr('style', 'border-bottom:30px solid #fff;');
        $('#liAcccounts').attr('style', 'border-bottom:30px solid #fff;');
        $('#liDetail').attr('style', 'border-bottom:30px solid #fff;');

        $('#liCategory a').attr('style', 'color:#5c8fbe;');
        $('#liAcccounts a').attr('style', 'color:#5c8fbe;');
        $('#liDetail a').attr('style', 'color:#5c8fbe;');

        $('#ulFirst').attr('style', 'display:block;');
        $('#ulSecond').attr('style', 'display:none;');

        showDiv('uploadBudget');
    }


}

/////////////---------COA GREEN---------------/////////////////////////

function editBudgetCategorycDescC(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancDescC' + BudCateID).attr('style', 'display:none;');
    $('#txtcDescC' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcDescC' + BudCateID).focus();
}

function editBudgetCategorycFringeC(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancFringeC' + BudCateID).attr('style', 'display:none;');
    $('#txtcFringeC' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcFringeC' + BudCateID).focus();
}

function editBudgetCategorycTotalC(BudCateID) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spancTotalC' + BudCateID).attr('style', 'display:none;');
    $('#txtcTotalC' + BudCateID).attr('style', 'display:block !important;');
    $('#txtcTotalC' + BudCateID).focus();
    $('#txtcTotalC' + BudCateID).preventDefault();

}

function UpdateBudgetCategorycTotalCGreen(BudCateID, Desc) {
    BudCateIDTemp = BudCateID;

    //  var Desc = $("#txtcDescC" + BudCateID).val();
    var Total = $("#txtcTotalC" + BudCateID).val();
    var Fringe = $("#txtcFringeC" + BudCateID).val();

    var BudgetCategoryUpdate = {
        BudgetCategoryID: BudCateID,
        Parameter: $('#txtcTotalC' + BudCateID).val(),
        ModifyBy: localStorage.UserId,

    }

    $.ajax({
        url: APIUrlBudgetCategoryCOA + '?Budgetfileid=' + BudgetFileID + '&CategoryNumber=' +
            BudCateID + '&CategoryDescription='
            + Desc + '&CategoryFringe=' + Fringe + '&CategoryTotal=' +
            Total + '&ProdID=' + localStorage.ProdId + '&createdby=' + localStorage.UserId,


        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(BudgetCategoryUpdate),
    })
.done(function (response) {
    UpdateBudgetCategorycTotalGreenSucess(response);
})
}

function UpdateBudgetCategorycTotalGreenSucess(response) {
    SucessMsg('Record Entered in Budget File.');
    GetBudgetCategory(response);
}

function UpdateBudgetCategorycTotalC(BudCateID) {
    BudCateIDTemp = BudCateID;

    var Desc = $("#txtcDescC" + BudCateID).val();
    var Total = $("#txtcTotalC" + BudCateID).val();
    var Fringe = $("#txtcFringeC" + BudCateID).val();

    var BudgetCategoryUpdate = {
        BudgetCategoryID: BudCateID,
        Parameter: $('#txtcTotalC' + BudCateID).val(),
        ModifyBy: localStorage.UserId,

    }

    $.ajax({
        url: APIUrlBudgetCategoryCOA + '?Budgetfileid=' + BudgetFileID + '&CategoryNumber=' +
            BudCateID + '&CategoryDescription='
            + Desc + '&CategoryFringe=' + Fringe + '&CategoryTotal=' +
            Total + '&ProdID=' + localStorage.ProdId + '&createdby=' + localStorage.UserId,


        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(BudgetCategoryUpdate),
    })
.done(function (response) {
    UpdateBudgetCategorycTotalSucess(response);
})
}


//function UpdateBudgetCategorycTotalSucess(response) {
//    SucessMsg('Record Updated.');
//    GetBudgetCategory(response);
//}

function CreateCategoryCOA() {
    var Check = COACategoryString.slice(1);
    if (Check != '') {

        $.ajax({
            url: APIUrlCreateCOAfromBudgetCategoryNew + '?BCIString=' + Check + '&BudgetFileID=' + BudgetFileID + ' &Prodid=' + localStorage.ProdId + '&CreatedBy=' + localStorage.UserId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },

            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })
    .done(function (response) {
        CreateCategoryCOASucess(response);
    })
    }
    else {
        alert('No Category Selected to Create COA');
    }
}

function CreateCategoryCOASucess(response) {
    ShowMsgBox('showMSG', 'COA Created Successfully', '', '');
    GetBudgetCategory(BudgetFileID);
}


function CreateAccountCOA() {
    var Check = COAAccountString.slice(1);
    if (Check != '') {

        $.ajax({
            url: APIUrlCreateCOAfromBudgetAccountNew + '?BAIString=' + Check + '&BudgetFileID=' + BudgetFileID + ' &Prodid=' + localStorage.ProdId + '&CreatedBy=' + localStorage.UserId,

            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },

            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })
    .done(function (response) {
        CreateAccountCOASucess(response);
    })
    }
    else {
        alert('No Account selected to Create COA');
    }
}

function CreateAccountCOASucess(response) {
    ShowMsgBox('showMSG', 'COA Created Successfully', '', '');
    BudgetAccount();
}

function AddAccounttoBudget(AccountNumber, Desc, CategoryNumber) {

    // var Desc = $("#txtaDescA" + AccountNumber).val();
    var Total = $("#txtaFringeA" + AccountNumber).val();
    var Fringe = $("#txtaTotalA" + AccountNumber).val();


    $.ajax({
        url: APIUrlBudgetAccountAdd + '?Budgetfileid=' + BudgetFileID + '&AccountNumber=' +
            AccountNumber + '&AccountDescription='
            + Desc + '&AccountFringe=' + Fringe + '&AccountTotal=' +
            Total + '&ProdID=' + localStorage.ProdId + '&createdby=' + localStorage.UserId + '&CategoryNumber=' + CategoryNumber,


        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(BudgetCategoryUpdate),
    })
.done(function (response) {
    AddAccounttoBudgetSucess(response);
})
}


function AddAccounttoBudgetSucess(response) {

    var Msg = 'Record Entered in Budget File.';
    ShowMsgBox('showMSG', Msg, '', '');

    BudgetAccount();
}

function editBudgetAccountaDescA(AccountNumber) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaDescA' + AccountNumber).attr('style', 'display:none;');
    $('#txtaDescA' + AccountNumber).attr('style', 'display:block !important;');
    $('#txtaDescA' + AccountNumber).focus();
}


function editBudgetAccountaFringeA(AccountNumber) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaFringeA' + AccountNumber).attr('style', 'display:none;');
    $('#txtaFringeA' + AccountNumber).attr('style', 'display:block !important;');
    $('#txtaFringeA' + AccountNumber).focus();
}

function editBudgetAccountaTotalA(AccountNumber) {

    $('.budgetHide').attr('style', 'display:none;');
    $('.budgetShow').attr('style', 'display:block;');
    $('#spanaTotalA' + AccountNumber).attr('style', 'display:none;');
    $('#txtaTotalA' + AccountNumber).attr('style', 'display:block !important;');
    $('#txtaTotalA' + AccountNumber).focus();
}

function ProceedBudgetNew() {
    $.ajax({
        url: APIUrlCheckBudgetInFinalBudget + '?BudgetID=' + BuggetIDTemp + '&BudgetFileID=' + BudgetFileID + '&createdby=' + localStorage.UserId + '&ProdID=' + localStorage.ProdId,

        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(BudgetCategoryUpdate),
    })
.done(function (response) {
    ProceedBudgetNewSucess(response);
})
}

function ProceedBudgetNew1Sucess(response) {
    if (response == 1) {
        showDiv('dvConfirm');
    }
    else {
        var Msg = 'Budget Proceed Suceessfully.';
        ShowMsgBox('showMSG', Msg, '', '');
        window.location.href = 'Import';
    }
}


function ProceedBudgetNewSucess(response) {
    if (response[0].Result == '1') {
        showDiv('dvConfirm');
    }
    else if (response[0].Result == '3') {
        // ShowMsgBox('showMSG', Msg, '', '');
        var Msg = 'There are ' + response[0].ErrorCount + ' Category records , that does not match COA. Please Correct the errors.';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    }
    else if (response[0].Result == '4') {
        var Msg = 'There are ' + response[0].ErrorCount + ' Accounts records , that does not match COA. Please Correct the errors.';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    }
    else {
        var Msg = 'Budget Proceed Suceessfully.';
        ShowMsgBox('showMSG', Msg, '', '');
        // window.location.href = 'Import';
        $('#uploadBudget').attr('style', 'display:none;');
        $('#fade').attr('style', 'display:none;');
        
        getBudgetDetail(BuggetIDTemp);
    }
}


function overWriteBudget() {
    $.ajax({
        url: APIUrlProceedBudgetFinal + '?BudgetID=' + BuggetIDTemp + '&BudgetFileID=' + BudgetFileID + '&createdby=' + localStorage.UserId + '&ProdID=' + localStorage.ProdId,

        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(BudgetCategoryUpdate),
    })
.done(function (response) {
    ProceedBudgetNew1Sucess(response);
})
}

$('#txtCO').blur(function () {
    var StrCheckCompany = $('#txtCO').val().trim();
    if (StrCheckCompany != '') {
        for (var i = 0; i < VarGetCompanyId.length; i++) {
            if (VarGetCompanyId[i].AccountCode == StrCheckCompany) {
                $('#hdnCO').val(VarGetCompanyId[i].AccountCode);
                $('#txtCO').val(VarGetCompanyId[i].AccountCode);
                break;
            }
            else {
                $('#hdnCO').val(' ');
                $('#txtCO').val('');
            }
        }
        for (var i = 0; i < VarGetCompanyId.length; ++i) {
            if (VarGetCompanyId[i].AccountCode.substring(0, StrCheckCompany.length) === StrCheckCompany) {
                $('#hdnCO').val(VarGetCompanyId[i].AccountCode);
                $('#txtCO').val(VarGetCompanyId[i].AccountCode);
                break;
            }
        }
    }
    else {
        $('#hdnCO').val(VarGetCompanyId[0].AccountCode);
        $('#txtCO').val(VarGetCompanyId[0].AccountCode);
    }
})


//===============chechEpisode==================

function checkEpisode(value) {
    var StrCheckEps = $('#txt' + value).val();
    if (StrCheckEps != '') {
        for (var i = 0; i < getEpisoderes.length; i++) {
            if (getEpisoderes[i].AccountCode == StrCheckEps) {

                $('#txt' + value).val(getEpisoderes[i].AccountCode);
                break;
            }
            else {

                $('#txt' + value).val('');
            }
        }
        for (var i = 0; i < getEpisoderes.length; ++i) {
            if (getEpisoderes[i].AccountCode.substring(0, StrCheckEps.length) === StrCheckEps) {

                $('#txt' + value).val(getEpisoderes[i].AccountCode);
                break;
            }
        }
    }
    else {

        $('#txt' + value).val(getEpisoderes[0].AccountCode);
    }
}


function EmptyBudget() {
    // $('#btn1').attr('style', 'display:none;');
    SegStr1 = '';
    SegStr2 = '';
    BudgetStatus = 'Saved';

    SegStr1 = $("#txtCO").val() + "|";
    var isvalid = "";
    isvalid += CheckRequired($("#txtCO"));

    //var cc = SegList.split('|');
    //for (var z = 0; z < cc.length; z++)
    //{
      
    //    if ($("#" + cc[z]).val() == '') {
    //        $('#' + cc[z]).attr('style', 'border-color:red;');
    //        isvalid += "1";
    //    }
    //    else {
    //        $('#' + cc[z]).attr('style', 'border: none;');
    //    }
    //}
    if (isvalid == '') {
        var LoopCnt = 1;
        $('#tblBudgetSetting input[type="text"]').each(function () {
            var CheckCls = $(this).attr('class');
            var CheckStr = CheckCls.slice(0, 13);

            var Checkid = $(this).attr('id').slice(3);

            if ((CheckStr == 'BudgetSetting')) {
                LoopCnt++;
                var inputVal = $(this).val();

                if (inputVal == '') {
                    var strValue = $(this).attr('name');
                    var arr = strValue.split('|');
                    var CodLength = arr[1];
                    for (var i = 0; i < CodLength; i++) {
                        inputVal += '0';
                    }
                }


                SegStr1 = SegStr1 + inputVal + "|";

                if (LoopCnt == 2) {
                    SS2 = inputVal;
                }
                else if (LoopCnt == 3) {
                    SS3 = inputVal;
                }
                else if (LoopCnt == 4) {
                    SS4 = inputVal;
                }
                else if (LoopCnt == 5) {
                    SS5 = inputVal;
                }
                else if (LoopCnt == 6) {
                    SS6 = inputVal;
                }
                else if (LoopCnt == 7) {
                    SS7 = inputVal;
                }
                else if (LoopCnt == 8) {
                    SS8 = inputVal;
                }

                //if (inputVal == '') {
                //    $('#' + $(this).attr('id')).attr('style', 'border-color:red;');
                //    isvalid += "1";
                //}
                //else {
                //    $('#' + $(this).attr('id')).attr('style', 'border: none;');
                //}
            }
        });
    }

    if (isvalid == "") {

        showLoad(1);
        var data = new FormData();
        data.append("uploadedby", localStorage.UserId);
        data.append("CompanCode", $('#txtCO').val());
        data.append("prodid", localStorage.ProdId);
        data.append("Budgetid", BuggetIDTemp);
        data.append("S1", $('#txtCO').val());
        data.append("S2", SS2);
        data.append("S3", SS3);
        data.append("S4", SS4);
        data.append("S5", SS5);
        data.append("S6", SS6);
        data.append("S7", SS7);
        data.append("S8", SS8);
        data.append("LedgerLebel", 0);
        data.append("SegmentName", SegmentStrCode);
        data.append("SegStr1", SegStr1.slice(0, -1));
        data.append("SegStr2", SegStr2.slice(0, -1));

        var ajaxRequest = $.ajax({

            url: APIUrlEmptyBudget,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: "POST",
            // async: false,
            contentType: false,
            processData: false,

            data: data
        });
        ajaxRequest.done(function (response) {
            getBudgetDetail(BuggetIDTemp);
            BudgetFileID = response;
            $('#tabSettings').attr('style', 'display:none;');
            $('#tabCategories').attr('style', 'display:block;');
            $('#uploadBudget').attr('style', 'display:none;');
            //  GetBudgetCategory(response); 
            ProceedBudgetNew();
        });
    }
    else {
      //  $('#btn2').attr('style', 'display:block;');
    }
}



