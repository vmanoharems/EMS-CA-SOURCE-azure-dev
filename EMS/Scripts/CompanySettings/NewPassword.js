var HOST = window.location.protocol + '://' + window.location.host;
if (window.location.hostname == 'localhost') {
    HOST = '';
}
else if (window.location.host == '182.70.240.22:88') {
    HOST = 'https://' + window.location.host;
    HOST = HOST + '/EMSCA';
}
else {
    HOST = '';
}
//--------API colling 12/29/2015-- -----------//
var APIUrlGetDetailsoFUser = HOST + "/api/AdminLogin/GetUserDetailsPassword";
var APIUrlSetPassword = HOST + "/api/AdminLogin/UpdatePasswordOfUser";
var strUserId = 2;

$(document).ready(function () {
    $('#Atlas_Content').removeClass('AtlasAccess');

    GetDetailsoFUser();
    $('#txtPassword').keyup(function () {
        $('#valresult').html(checkStrength($(this).val(), 'valresult'));
    });
});

//--------Group Detail 12/29/2015-- -----------//
function GetDetailsoFUser()
{
    strUserId= GetQueryStringParamByNameWith('token');
    $.ajax({
        url: APIUrlGetDetailsoFUser + '?UserId=' + strUserId,
        cache: false,
        type: 'POST',
      
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetDetailsoFUserSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetDetailsoFUserSucess(response)
{
    if (response[0].Accountstatus == 'Not Confirmed') {
        $('#DvUserSetPassword').show();
        $('#txtEmailId').val(response[0].Email);
    } else {
        $('#DvUserDetails').show();       
    }
}

//------Set Password 12/29/2015-- -----------//


function SetNewPassword() {
    if ($('#valresult').html() == 'Weak') {
        $('#txtPassword').focus();
        alert('Please fulfill password policy.');
        return false;
    }
    else if ($('#valresult').html() == 'Too short') {
        $('#txtPassword').focus();
        alert('Please fulfill password policy.');
        return false;
    }

    if (($.trim($('#txtPassword').val()) != '') && ($.trim($('#txtConfrimPassword').val()) != '')) {
        if (($('#txtPassword').val()) == ($('#txtConfrimPassword').val())) {
            SetPassword();
        }
        else {
            alert('Confirm Password does not match with password');
            return false;
        }
    }
    else {
        alert('please enter password and comfirm password');
        return false;
    }
}



function SetPassword()
{
    if ($('#txtPassword').val() == $('#txtConfrimPassword').val()) {

        $.ajax({
            url: APIUrlSetPassword + '?Password=' + $('#txtConfrimPassword').val() + '&UserId=' + strUserId,
            cache: false,
            type: 'POST',
          
            contentType: 'application/json; charset=utf-8',
        })


    .done(function (response)
    { SetPasswordSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
    } else {

    }
}
function SetPasswordSucess(response)
{
    alert('Password Saved!');
    window.location.replace(HOST + "/Home/Login");
}

//----------------------------------- error MSG
function ShowMSG(error)
{
    console.log(error);
}


function GetQueryStringParamByNameWith(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1]);
}



function checkStrength(password, targetid) {
    var strength = 0
    if (password.length < 6) {
        $('#' + targetid).removeClass();
        $('#' + targetid).addClass('short error validationerror');
        if (password.length == 0)
        { return ''; }
        else
        { return 'Too short'; }
    }
    if (password.length > 5) strength += 1
    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
    // If it has numbers and characters, increase strength value.
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // If it has two special characters, increase strength value.
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // Calculated strength value, we can return messages
    // If value is less than 2
    if (strength < 4) {
        $('#' + targetid).removeClass();
        $('#' + targetid).addClass('weak error validationerror');
        return 'Weak';
    } else if (strength == 4) {
        $('#' + targetid).removeClass()
        $('#' + targetid).addClass('good')
        return 'Good';
    } else {
        $('#' + targetid).removeClass();
        $('#' + targetid).addClass('strong');
        return 'Strong';
    }
}