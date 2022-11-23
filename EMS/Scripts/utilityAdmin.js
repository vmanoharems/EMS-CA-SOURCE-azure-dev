var HOST = window.location.protocol + '://' + window.location.host;
if (window.location.hostname === 'localhost') {
    HOST = '';
}
else {
    HOST = '';
}

var APIUrlGetProductionList = HOST + "/api/AdminTools/AdminAPIToolsProductionList"; //"/api/AdminLogin/GetProdcutionListByUserId";
var APIUrlSaveAdminUser = HOST + "/api/AdminLogin/InsertEMSUser";
var APIUrlfunCheckEmail = HOST + "/api/AdminLogin/CheckEmailVaild";
var APIUrlfunGetDBName = HOST + "/api/AdminLogin/GetDBConfigByProdId";
var APIUrlPassDBName = HOST + "/api/Utility/PassDBName";
//
var APIUrlInsertupdateUsers = HOST + "/api/CompanySettings/InsertUpdateUser";
var APIUrlGenrateAPIKey = HOST + "/api/AdminLogin/UpdateAPIKeyToken";
//
var APIUrlfunAddUserForProduction = HOST + "/api/CompanySettings/addproductionaccessforuser";
var StrPublicUserId = 0;
var StrEmailUserId = 0;
//console.log(localStorage.AdminUserID);
if (localStorage.AdminUserID === '0' || localStorage.AdminUserID === 0) {
    // alert(localStorage.AdminUserID + '   check Admin');
    location.replace(HOST + "/AdminEMS/Login");
}
//if (localStorage.AdminEMSKeyToken == undefined)
//{
//    location.replace(HOST + "/AdminEMS/Login");
//}
//---------------------------------------------------- Logout Admin
$('.logoutAdmin').click(function () {
    localStorage.removeItem("AdminUserID");
    //localStorage.AdminUserID = 0;
    localStorage.removeItem("AdminAuthenticationCode");
    localStorage.removeItem("AdminProdId");
    localStorage.removeItem("AdminEmail");
    localStorage.removeItem("AdminPassword");
    localStorage.removeItem("AdminDBName");
    localStorage.removeItem("AdminEMSKeyToken");

    location.replace(HOST + "/AdminEMS/Login");
});

$(document).ready(function () {
    $('#spnProdName').text(localStorage.AdminProdName);
    $('#ULAdminNav li').removeClass('active');
    if (window.location.href.indexOf('SegmentSetup') !== -1) {
        $('#LiGLSetup').addClass('active');
    }
    if (window.location.href.indexOf('AdminPayroll') !== -1) {
        $('#LiPayroll').addClass('active');
    }
    if (window.location.href.indexOf('AddGroup') !== -1 || window.location.href.indexOf('AddUsers') !== -1 || window.location.href.indexOf('Users') !== -1) {
        $('#LiPermissions').addClass('active');
    }

    PassDBName();
});

function delayer(url) {
    window.location = url;
}

function ShowDivSwitch() {
    $('#DvLayoutSwtich').show();
    // $('#fade').show();
    funGetProductionList();

}
function funGetProductionList() {
    $.ajax({
        url: APIUrlGetProductionList + '?UserId=' + localStorage.AdminUserID,
        cache: false,
        type: 'GET',
        // async: false,
        contentType: 'application/json; charset=utf-8',

    })
       .done(function (response)
       { GetProductionListSucess(response); })

           .fail(function (error)
           { ShowErrorMSG(error); })
}
function GetProductionListSucess(response) {
    $('#ddlLayoutChooseAccount').html('<option value= 0>Select </option>');
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            $('#ddlLayoutChooseAccount').append('<option value=' + response[i].ProductionId + '>' + response[i].Name + '</option>');
        }
    }
}
function funSwitchOpen() {
    if ($('#ddlLayoutChooseAccount').val() != 0) {
        $('#DvLayoutACode').show();
    }
    else {
        $('#DvLayoutACode').hide();
    }
}
function CheckAuthenticationCodeLayout() {
    var isvalid = "";
    isvalid += CheckRequired($("#txtAuthenticationCodeLayout"));

    if (isvalid == "") {
        if ($('#txtAuthenticationCodeLayout').val() != '') {
            if ($('#txtAuthenticationCodeLayout').val() == localStorage.AdminAuthenticationCode) {
                localStorage.AdminProdId = $('#ddlLayoutChooseAccount').val();
                localStorage.AdminProdName = $('#ddlLayoutChooseAccount option:selected').text();
                funGetDBNameSwitch();

                location.reload(true);

            }
            else {

            }
        }
    }
}
//-------------------------------------------- Show Error MSG
function ShowErrorMSG(error) {
    console.log(error);
}
//-------------------------------------------Show Div / Hide Div
function showDiv(id) {
    $('#' + id).show();
    $('#fade').show();
    scroll(0, 0);
}
function hideDiv(id) {
    $('#' + id).hide();
    $('#fade').hide();
}
//------------------------------------------- Show MSG Box
function ShowMsgBox(divID, msg, url, typ) {
    var s = msg;
    if (typ == '')
    { typ = 'successmsg'; }
    var result = s.replace("\\n", "<br />");
    $('#fade2').fadeIn(2000).fadeOut(5000);
    $('#' + divID).removeClass().addClass("alrtbox ").addClass(typ).html(msg).fadeIn(2000).fadeOut(5000);
    if (url != '')
    { setTimeout('delayer(\'' + HOST + '/' + url + '\')', 7000); }
}
//------------------------------------------- Create New User Admin side

function ShowDivAdminSet() {

    $('#ULAdminNav li').removeClass('active');
    $('#LiSetAdmin').addClass('active');

    $('#setAdmin').show();
    $('#fade').show();
}
function SetAdminButton() {
    var isvalid = "";
    isvalid += CheckRequired($("#txtAdminEmail"));
    isvalid += CheckRequired($("#txtAdminConfirmEmail"));


    if (isvalid == "") {
        if ($("#txtAdminEmail").val() == $("#txtAdminConfirmEmail").val()) {
            $('#DvSetAdminAuthCode').show();
            checkEmailAvailable();


        } else {
            ShowMsgBox('showMSG', 'Email and Confirm Email is not same', '', '');
            $('#DvSetAdminAuthCode').hide();

        }
    }
}

//-------------------------------------------- Save Admin
function funInsertAdmin() {
    if (StrEmailUserId == 0) {
        funSetAdmin();
    }
    else {
        funAddUserProduction(StrEmailUserId);
    }
}
function funSetAdmin() {
    var ObjAdminUser = {
        Name: 'acs',
        Title: 'ACS',
        Email: $('#txtAdminEmail').val(),
        Password: 'acs123',
        AuthenticationCode: $('#txtAdminAUthCode').val(),
        Accountstatus: 'Not Confirmed',
        Status: true,
        createdby: localStorage.AdminUserIDS,
        AdminFlag: true,
        ProdId: localStorage.AdminProdId
    }


    $.ajax({
        url: APIUrlSaveAdminUser,
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjAdminUser),
    })
                .done(function (response)
                { SaveAdminUserSucess(response); })
                .fail(function (error)
                { ShowMSG(error); })
}
function SaveAdminUserSucess(response) {
    StrPublicUserId = response;
    ShowMsgBox('showMSG', 'Email Send to user ..!!', '', '');
    $('#setAdmin').hide();
    // $('#txtAdminEmail').val('');
    $('#txtAdminConfirmEmail').val('');
    $('#txtAdminAUthCode').val('');
    funSetAdminUser();

}
//--------------------------------------------- Production user 
function funSetAdminUser() {


    var ObjUser = {
        UserId: StrPublicUserId,
        Name: $('#txtAdminEmail').val(),
        Title: 'USER',
        Email: $('#txtAdminEmail').val(),
        Status: false,
        createdby: localStorage.AdminUserID,
        Adminflag: false,
        ProdId: localStorage.AdminProdId,
    }

    $.ajax({
        url: APIUrlInsertupdateUsers,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },

        //  async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjUser),
    })
   .done(function (response)
   { funUserSaveSucess(response); })

       .fail(function (error)
       { ShowMSG(error); })

}
function funUserSaveSucess(response) {
    location.reload(true);
}
//-------------------------------------------- check Admin Email
function checkEmailAvailable() {
    $.ajax({
        url: APIUrlfunCheckEmail + '?Email=' + $('#txtAdminConfirmEmail').val() + '&Admin=' + 'User',
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { CheckEmailSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function CheckEmailSucess(response) {
    if (response != 0) {
        // ShowMsgBox('showMSG', 'User Already Exists.. !!', '', '');
        StrEmailUserId = response;
        // funAddUserProduction(response);
        //$('#txtAdminConfirmEmail').val('');
        //$('#txtAdminEmail').val('');
        //$('#DvSetAdminAuthCode').hide();
    }
}
function funAddUserProduction(response) {
    $.ajax({
        url: APIUrlfunAddUserForProduction + '?AdminUserid=' + response + '&ProdID=' + localStorage.AdminProdId + '&EmailId=' + $('#txtAdminConfirmEmail').val() + '&ProdcutionName=' + $('#spnProdName').text(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ funAddUserProductionSucess(response); })

    .fail(function (error)
    { ShowMSG(error); })
}
function funAddUserProductionSucess(response) {

    $(location).attr('href', 'Users');

}

function PassDBName() {
    if (localStorage.AdminDBName != undefined && localStorage.AdminDBName != null) {

        $.ajax({
            url: APIUrlPassDBName + '?DBName=' + localStorage.AdminDBName,
            cache: false,
            type: 'GET',
            //  async: false,
            contentType: 'application/json; charset=utf-8',

        })
        .done(function (response) {
            //console.log(response);
        })
        .fail(function (error) {
            ShowErrorMSG(error);
        })
    }
}
//--------------------------------------- 
function funGetDBNameSwitch() {
    $.ajax({
        url: APIUrlfunGetDBName + '?ProdId=' + localStorage.AdminProdId,
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',

    })
        .done(function (response)
        { funGetDBNameSucess(response); })

            .fail(function (error)
            { ShowErrorMSG(error); })
}
function funGetDBNameSucess(response) {
    localStorage.AdminDBName = response[0].DBName;
    funGenrateAPIKey();
}


function funGenrateAPIKey() {

    $.ajax({
        url: APIUrlGenrateAPIKey + '?UserId=' + localStorage.AdminUserID + '&Email=' + localStorage.AdminEmail + '&DBName=' + localStorage.AdminDBName,
        cache: false,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',

    })
.done(function (response)
{ funGenrateAPIKeySucess(response); })

    .fail(function (error)
    { LoginDetailsFail(error); })
}
function funGenrateAPIKeySucess(response) {
    localStorage.AdminEMSKeyToken = 'Basic ' + response;

}
///////////// Admin Logout Session


////////////Session Logout ///////////////////  Added by Vijay on 3 - Feb- 16

var IDLE_TIMEOUTAdmin = 3000; //seconds
var _idleSecondsCounterAdmin = 0;
document.onclick = function () {
    _idleSecondsCounterAdmin = 0;
};
document.onmousemove = function () {
    _idleSecondsCounterAdmin = 0;
};
document.onkeypress = function () {
    _idleSecondsCounterAdmin = 0;
};
window.setInterval(CheckIdleTimeAdmin, 1000);

function CheckIdleTimeAdmin() {
    _idleSecondsCounterAdmin++;
    var oPanel = document.getElementById("SecondsUntilExpire3");
    if (oPanel)
        oPanel.innerHTML = (IDLE_TIMEOUTAdmin - _idleSecondsCounterAdmin) + "";
    if (_idleSecondsCounterAdmin >= IDLE_TIMEOUTAdmin) {

        Logout();
    }
}

function Logout() {
    localStorage.removeItem("AdminUserID");
    //localStorage.AdminUserID = 0;

    localStorage.removeItem("AdminAuthenticationCode");
    localStorage.removeItem("AdminProdId");
    localStorage.removeItem("AdminEmail");
    localStorage.removeItem("AdminPassword");
    localStorage.removeItem("AdminDBName");
    localStorage.removeItem("AdminEMSKeyToken");


    location.replace(HOST + "/AdminEMS/Login");
}

