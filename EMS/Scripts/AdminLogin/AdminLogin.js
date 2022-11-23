var HOST = window.location.protocol + '://' + window.location.host;
if (window.location.hostname === 'localhost') {
    HOST = '';
} else {
    HOST = '';
}

// --------------------------------------------------------------------------------API Calling
var APIUrlLoginAdminDetails = HOST + "/api/AdminLogin/GetUserDetailsAdmin";
var APIUrlfunCheckEmail = HOST + "/api/AdminLogin/CheckEmailVaild";
var APIUrlUpdateAuthCode = HOST + "/api/AdminLogin/UpdateAuthCode";
var APIUrlGenrateAPIKey = HOST + "/api/AdminLogin/UpdateAPIKeyToken";

var StrCount = 10;

$(document).ready(function () {
    $('#SectionLeftMenu').hide();
    $('.main-sidebar').attr('style', 'background-color: white !important;');
    $('#txtAdminUser').blur(function () {
        funCheckEmail();
    });

});

function funCheckEmail() {
    if ($('#txtAdminUser').val() !== '') {
        $.ajax({
            url: APIUrlfunCheckEmail + '?Email=' + $('#txtAdminUser').val()+'&Admin='+'Admin',
            cache: false,
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })

     .done(function (response)
        { funCheckEmailSucess(response); })
     .fail(function (error)
        { ShowMSG(error); })
    }
}

function funCheckEmailSucess(response)
{
    if (response === 0)
    {
        ShowMsgBox('showMSG', 'User does not exist.. !!', '', '');
       // alert('User does not exist.. !!');
        $('#txtAdminUser').val('');
        $('#txtAdminUser').focus();
    }
}

$('#hrfAdminLogin').click(function () {
    var isvalid = "";
    isvalid += CheckRequired($("#txtAdminUser"));
    isvalid += CheckRequired($("#txtAdminPassword"));

    if (isvalid === "") {
        var eml = $('#txtAdminUser').val();
        var pwd = $('#txtAdminPassword').val();
        $.ajax({
            url: APIUrlLoginAdminDetails + '?Email=' + eml + '&Password=' + pwd + '&Type=' + 'admin',
            cache: false,
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response)
            {LoginDetailsSucess(response);})
        .fail(function (error)
            { LoginDetailsFail(error); })
    }

});

function LoginDetailsSucess(response) {
    // alert(response.length);
    if (response === 1) {
        //   ShowMsgBox('showMSG', 'UserId not vaild', '', '');
        alert('UserId not vaild');
    }
    if (response.length === 1) {
        $("#lblLogin").notify(
          "Access granted! Check your email, please...",
          {
              position: "top",
              className: "success"
          }
          );
      //  $('#DvLoginSuccess').show();
        localStorage.AdminUserID = response[0].UserID;
        localStorage.AdminEmail = $('#txtAdminUser').val();
//        localStorage.AdminPassword = $('#txtAdminPassword').val();
        funGenrateAPIKey(); // Auth is requires from here on
        UpdateAuthCode();
    }
    else {
        $("#lblLogin").notify(
          "Holy guacamole! We cannot login you in! You should let someone know...",
          {
              position: "top",
              className: "error"
          }
        );

        ShowMsgBox('showMSG', 'Invaild Login Credentials ', '', '');
    }
}

function UpdateAuthCode() {
    $.ajax({
        url: APIUrlUpdateAuthCode + '?UserId=' + localStorage.AdminUserID + '&AuthCode=' + '',
        cache: false,
        async: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
        { UpdateAuthCodeSucess(response); })
    .fail(function (error)
        { console.log(error); })
    ;
}

function UpdateAuthCodeSucess(response) {
    if (response.length > 0) {
        $('#DvLoginSuccess').show();
        localStorage.AdminAuthenticationCode = response[0].AuthenticationCode;
    }
}


function LoginDetailsFail(error) {
    console.log(error);
}

function CheckAuthenticationCode() {
    if ($('#txtAuthenticationCode').val().trim() !== '') {
        if (localStorage.AdminAuthenticationCode === $('#txtAuthenticationCode').val().trim()) {
            window.location.replace(HOST + "/AdminEMS/SetupProduction");
            localStorage.AdminProductionId = $('#hdnProductionId').val();
        } else {
            StrCount--;
            if (StrCount === 0) {
                location.reload(true);
            }
            $('#spnAdminEmailInvaildCounter').text(StrCount);
            $('#DvInvaildCode').show();
        }
    }
}

function ShowMSG(error)
{
    console.log(error);
}

function ShowMsgBox(divID, msg, url, typ) {
    var s = msg;
    if (typ === '')
    { typ = 'successmsg'; }
    var result = s.replace("\\n", "<br />");
    $('#fade2').fadeIn(2000).fadeOut(5000);
    $('#' + divID).removeClass().addClass("alrtbox ").addClass(typ).html(msg).fadeIn(2000).fadeOut(5000);
    if (url !== '')
    { setTimeout('delayer(\'' + HOST + '/' + url + '\')', 7000); }
}

function funGenrateAPIKey() {
    $.ajax({
        url: APIUrlGenrateAPIKey + '?UserId=' + localStorage.AdminUserID + '&Email=' + $('#txtAdminUser').val() + '&DBName=' + '',
        cache: false,
        async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',

    })
    .done(
        function (response) {
            funGenrateAPIKeySucess(response);
        }
    )
    .fail(
        function (error) {
            LoginDetailsFail(error);
        }
    )
}

function funGenrateAPIKeySucess(response) {
    localStorage.AdminEMSKeyToken = 'Basic ' + response;
}