var HOST =  '';

//=======================
var APIUrlCheckEmailVaild = HOST + "/api/AdminLogin/CheckEmailVaild";
var APIUrlForgetPassowrd = HOST + "/api/AdminLogin/ForGetPassword";

$(document).ready(function () {

});

function funSubmit() {
    if ($('#txtEmail').val() != '')
    {
        $.ajax({
            url: APIUrlCheckEmailVaild + '?Email=' + $('#txtEmail').val() + '&Admin=' + 'User',
            cache: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            funSubmitSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function funSubmitSucess(response) {
    if (response == 0)
    {
    } else {
        // Convert text to bytes (text must be a multiple of 16 bytes)
        let textBytes = aesjs.utils.utf8.toBytes(response.toString().padEnd(16));

        let aesCbc = new aesjs.ModeOfOperation.cbc(pubkey, pubiv);
        let encryptedBytes = aesCbc.encrypt(textBytes);

        let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        funForgetPassowrd(encryptedHex);
    }
}

function funForgetPassowrd(response) {
    $.ajax({
        url: APIUrlForgetPassowrd + '?UserId=' + response + '&Email=' + $('#txtEmail').val(),
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',

    })
    .done(function (response) {
        funForgetPassowrdSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funForgetPassowrdSucess(response)
{
    $(location).attr('href', 'Login');
}

//========================== SwhoMSG
function ShowMSG(error)
{
    console.log(error);
}


