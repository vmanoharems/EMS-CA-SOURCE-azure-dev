var HOST = window.location.protocol + '://' + window.location.host;
if (window.location.hostname === 'localhost') {
    HOST = '';
}
else if (window.location.host === '182.70.240.22:88') {
    HOST = 'https://' + window.location.host;
    HOST = HOST + '/EMSCA';
}
else {
    HOST = '';
}

//-------------------------- API

var APIUrlLoginAdminDetails = HOST + "/api/AdminLogin/GetUserDetailsAdmin";

var APIUrlProductionList = HOST + "/api/AdminLogin/GetProdcutionListByUserId";
var APIUrlfunGetDBName = HOST + "/api/AdminLogin/GetDBConfigByProdId";

$(document).ready(function () {
    $('#txtEmail').focus();

});
$('#txtPassword').on("keypress", function (e) {
    if (e.keyCode == 13) {
        funLogin();
    }
});


$('#btnLogin').click(function () {
    funLogin();
})
function funLogin() {
    var eml = $('#txtEmail').val();
    var pwd = $('#txtPassword').val();
    $.ajax({
        url: APIUrlLoginAdminDetails + '?Email=' + eml + '&Password=' + pwd + '&Type=' + 'User',
        cache: false,
        type: 'GET',
       
        contentType: 'application/json; charset=utf-8',

    })
  .done(function (response)
  { LoginDetailsSucess(response); })

      .fail(function (error)
      { LoginDetailsFail(error); })
    // window.location = HOST + "/Accounts/AccountsPayable";
    //}
}
function LoginDetailsSucess(response) {
    var TLength = response.length;
    if (TLength > 0) {
        localStorage.UserId = response[0].UserID;     
        //localStorage.Email = $('#txtEmail').val();
        //localStorage.Password = $('#txtPassword').val();
        localStorage.PayrollSession = 'YES';
       // if (localStorage.UserId != -1) {
            //  window.location.replace(HOST + "/Accounts/AccountsPayable");
       // }
        // GetProductionList();
        window.location.replace(HOST + "/Payroll/LoadPayroll");
      //  $('#DvLoginUSer').hide();

    }
    else {
        alert('Invaild credentials');
        $('#txtEmail').val('');
        $('#txtPassword').val('');
        $('#txtEmail').focus();

    }
}
function LoginDetailsFail(error) {
    console.log(error);
}


function GetProductionList() {
    $.ajax({
        url: APIUrlProductionList + '?UserId=' + localStorage.UserId,
        cache: false,
        type: 'GET',
       
        contentType: 'application/json; charset=utf-8',

    })
 .done(function (response)
 { GetProductionListSucess(response); })

     .fail(function (error)
     { LoginDetailsFail(error); })
}

function GetProductionListSucess(response) {
    if (response.length > 0) {
        //localStorage.ProdId = response[0].ProductionId;
        window.location.replace(HOST + "/Payroll/LoadPayroll");
        funGetDBName();
    }
    else {
        $('#DvProductionList').show();
        $('#ddlProductionList').show();

        for (var i = 0; i < response.length; i++) {
            $('#ddlProductionList').append('<option value=' + response[i].ProductionId + '>' + response[i].Name + '</option>');
        }
    }
}

function funGetDBName() {
    $.ajax({
        url: APIUrlfunGetDBName + '?ProdId=' + localStorage.ProdId,
        cache: false,
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',

    })
    .done(function (response)
    { funGetDBNameSucess(response); })

        .fail(function (error)
        { ShowErrorMSG(error); })
}

function funGetDBNameSucess(response) {
    localStorage.DBName = response[0].DBName;
}