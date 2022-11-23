var APIUrlLoginAdminProdcutionList = HOST + "/api/AdminTools/AdminAPIToolsProductionList"; //"/api/AdminLogin/GetProdcutionListByUserId";
var APIUrlfunCheckDB = HOST + "/api/AdminLogin/CheckNewDBName";
var APIUrlSaveNewDB = HOST + "/api/AdminLogin/ProductionNewDBCreate";
var APIUrlfunGetDBName = HOST + "/api/AdminLogin/GetDBConfigByProdId";
var APIUrlCleanUpDB = HOST + "/api/AdminLogin/ProductionCleanUp";
var APIUrlGenrateAPIKey = HOST + "/api/AdminLogin/UpdateAPIKeyToken";

$(document).ready(function () {
    $('#SectionLeftMenu').hide();
    $('.main-sidebar').attr('style', 'background-color: white !important;');
    GetProdcutionListByUserId();
    //alert(localStorage.AdminProdName);
    $('#txtDBName').blur(function () {
        funCheckDB();
    });

//    AtlasUtilities.init();

    console.log(localStorage.AdminDBName);

});

//--------------------------------------------------Check Name DataBase 
function funCheckDB() {
    if ($('#txtDBName').val() !== '') {
        $.ajax({
            url: APIUrlfunCheckDB + '?DBName=' + $('#txtDBName').val().trim(),
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            funCheckDBSucess(response);
        })
        .fail(function (error) {
            ShowErrorMSG(error);
        })
        ;
    } else {
        $('#SpnAdminColor').removeClass('redDot');
        $('#SpnAdminColor').removeClass('GreenDot');
        $('#SpnAdminColor').addClass('BlueDot');
        $('#SpnSetupAlert').text('');
        $('#btnProduction').hide();
    }
}

function funCheckDBSucess(response) {
    if (response === 1) {
        $("#txtDBName").notify(
        "DB Name already in use! Please select another!",
            {
                position: "top",
                className: "error"
            }
        );

        $("#txtDBName").focus();

    }
    else {
        $('#SpnAdminColor').removeClass('BlueDot');
        $('#SpnAdminColor').removeClass('redDot');
        $('#SpnAdminColor').addClass('GreenDot');
        $('#SpnSetupAlert').text('');
        $('#btnProduction').show();
        $('#DvProCode').show();
    }
}

//------------------------------------------------- Existing  DBName
function GetProdcutionListByUserId() {
    $.ajax({
        url: APIUrlLoginAdminProdcutionList + '?UserId=' + localStorage.AdminUserID,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'GET',
       
        contentType: 'application/json; charset=utf-8',

    })
     .done(function (response)
     { GetProdcutionListByUserIdSucess(response); })

         .fail(function (error)
         { ShowErrorMSG(error); })

}
function GetProdcutionListByUserIdSucess(response) {
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            $('#ddlDBName').append('<option value=' + response[i].ProductionId + '>' + response[i].Name + '</option>');
        }
    }
}

function funGetProdcutionListByUserId() {
    if ($('#ddlDBName').val() !== 0) {
        
       
        localStorage.AdminProdId = $('#ddlDBName').val();
        localStorage.AdminProdName = $('#ddlDBName option:selected').text();
        $('#spnProdName').text(localStorage.AdminProdName);

        funGetDBName();

    }   
}

function funGetDBName()
{
    $.ajax({
        url: APIUrlfunGetDBName + '?ProdId=' + localStorage.AdminProdId,
        cache: false,
        async: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',       
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funGetDBNameSucess(response);
    })
    .fail(function (error) {
        ShowErrorMSG(error);
    })
}

function funGetDBNameSucess(response)
{
   
    localStorage.AdminDBName = response[0].DBName;
    
    funGenrateAPIKey();
    window.location.replace(HOST + "/AdminEMS/SegmentSetup");
}


//---------------------------------------------- Error MSG
function ShowErrorMSG(error) {
    console.log(error);
}

$('#HrfSetupNewDataBase').click(function () {
    $('#DvNewDBSetup').show();
    $('#txtDBName').focus();
});

$('#btnProduction').click(function () {
   
    if ($('#txtDBName').val() !== '') {
        if ($('#txtProductionCode').val() !== '') {
            $('#btnProduction').prop('disabled', true);
            //            AtlasUtilities.ShowLoadingAnimation();

            var ObjDBCreation = {
                ProdName: $('#txtDBName').val(),
                StudioId: 1,
                DivisionId: 1,
                status: 'Active',
                CreatedBy: localStorage.AdminUserID,
                ProductionCode: $('#txtProductionCode').val()
            }

            $(this).popover(
                {
                    content: 'We are building your DB. Once it is finished, this page will refresh. Then you can select the production from the drop down and setup the segments!'
                    , title: 'Please wait while we build your DB...'
                }
            );
            $(this).popover('show');
            $(this).html('Wait');

            $.ajax({
                url: APIUrlSaveNewDB,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
                },
                async: true,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjDBCreation),
            })
            .done(function (response) {
                SaveNewDBSucess(response);
            })
            .fail(function (error) {
                ShowErrorMSG(error);
            })
            ;
        } else {
            $("#txtProductionCode").notify(
            "Please enter a value!",
                {
                    position: "top",
                    className: "error"
                }
            );

            $('#txtProductionCode').focus();
        }
    } else {
        $("#txtDBName").notify(
        "Please enter a value!",
            {
                position: "top",
                className: "error"
            }
        );
        $('#txtDBName').focus();
    }
});

function SaveNewDBSucess(response)
{
    $('#dvLoader').attr('style', 'display:none;');
    console.log(response);
    if (response.length > 0)
    {
   
        localStorage.AdminDBName = response[0].DBName;
        localStorage.AdminProdId = response[0].prodId;
        ShowMsgBox('showMSG', ' Prodction Added successfully', '', '');
       // alert('Prodction Added successfully');
        location.reload(true);
    }
   // funGenrateAPIKey(response);
   // CleanUpDB(response);
}
function GenrateAPIKey()
{
    $.ajax({
        url: APIUrlGenrateAPIKey + '?UserId=' + localStorage.AdminUserID + '&Email=' + localStorage.AdminEmail + '&DBName=' + localStorage.AdminDBName,
        cache: false,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',

    })
   .done(function (response)
   { GenrateAPIKeySucess(response); })

       .fail(function (error)
       { LoginDetailsFail(error); })
}
function GenrateAPIKeySucess(response)
{
    localStorage.AdminEMSKeyToken = 'Basic ' + response;
   //  alert(localStorage.AdminProdId);

  //  CleanUpDB(localStorage.AdminProdId);
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
   // window.location.replace(HOST + "/AdminEMS/SegmentSetup");
    //  CleanUpDB(localStorage.AdminProdId);
 //   alert('Prodction Added successfully');
   // ShowMsgBox('showMSG', ' Prodction Added successfully ..!!', '', '');
   
}


function CleanUpDB(value)
{
  //  alert('Clean' + value);
    $.ajax({
        url: APIUrlCleanUpDB + '?ProdID=' + value,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
       

    })
     .done(function (response)
     { CleanUpDBSucess(response); })

         .fail(function (error)
         { ShowErrorMSG(error); })

    
}
function CleanUpDBSucess(response)
{
    console.log(response);
}