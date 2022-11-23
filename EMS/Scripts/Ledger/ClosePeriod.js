//---------------------Api Colling---------------------//
var APIUrlFillClosePeriodCompanyId = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlStartEndPeriodCompanyId = HOST + "/api/Ledger/GetStartEndPeriodByCompanyId";
var APIUrlInsertFreezeEndPeriod = HOST + "/api/Ledger/InsertUpdateClosePeriod";
var APIUrlGetClosePeriodStatus = HOST + "/api/Ledger/GetClosePeriodStatus";
//---------------Grobal Variabe-----------------------//
var PublicCompanyID = 0;
var strClosePeriodId = 0;
var PubStrStatus = "";
var ArrStrPeriod = [];

//---------------End of Global variable-----------------//
$(document).ready(function () {
    $('#txtClosePeriod').val('');
    GetClosePeriodCompanyId();
    $('#ClsperiodDropdownId').change(function () {
        console.log('22222222');
        GetStartEndPeriod();
    });
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    if (curr_date.toString().length == 1)
        curr_date = '0' + curr_date;
    if (curr_month.toString().length == 1)
        curr_month = '0' + curr_month;
    var Date1 = curr_month + '/' + curr_date + '/' + curr_year;
    $('#txtDate').val(Date1);
});

$('#BtnFreeze').click(function () {
    if ($("#ClsperiodDropdownId option:selected").text() == 'Undefined') {
        var Msg = 'Please Select Company !!';
        ShowMsgBox('showMSG', Msg, '', '');
    } else {
        showDiv('startValues');
        $('#PopFreezeperiod').show();
        var SelectedText = $("#StartEndPDropdownId option:selected").text();
        var StrSelPeriod = SelectedText.split(' ');
        StrSelPeriod = StrSelPeriod[1];
        var strCompanyPeriod = $('#StartEndPDropdownId option:selected').attr('companyperiod');
        $('#SpanFreezId').text(strCompanyPeriod);
    }
})

$('#ClsperiodDropdownId').change(function () {
    // CheckClosePeriod();
    GetStartEndPeriod();
    console.log('111111111');
})

//------------------Comapany DropdownFill---------------//
function GetClosePeriodCompanyId() {
    $.ajax({
        url: APIUrlFillClosePeriodCompanyId + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetClosePeriodCompanyIdSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetClosePeriodCompanyIdSucess(response) {
    var TLength = response.length;
    for (var i = 0; i < TLength; i++) {
        var CompanyID = response[i].CompanyID;
        var CompanyCode = response[i].CompanyCode;
        if (i == 0) {
            PublicCompanyID = CompanyID;
        }
        $('#ClsperiodDropdownId').append('<option value=' + CompanyID + ' >' + CompanyCode + '</option>');
    }
    GetStartEndPeriod();
}

//----------------------getStartEndPeriodByCompanyId------------------//
function GetStartEndPeriod() {
    $.ajax({
        url: APIUrlStartEndPeriodCompanyId + '?CompanyID=' + $('#ClsperiodDropdownId').val(),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetStartEndPeriodSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    });
}

function GetStartEndPeriodSucess(response) {
    ArrStrPeriod = [];
    $('#StartEndPDropdownId').html('');
    var TLength = response.length;
    for (var i = 0; i < TLength; i++) {
        var Col1 = response[i].col1;
        var Col2 = response[i].col2;
        var Col3 = response[i].col3;
        var Col4 = response[i].col4;
        var periodType = response[i].PeriodType;
        var perioddate = response[i].perioddate;
        var CompanyPeriod = response[i].CompanyPeriod;
        var PeriodStatus = response[i].PeriodStatus
        if (response[i].PeriodStartType == 'Period Start') {
            if (i == 0) {
                if (response[i].Status == 'Freeze') {
                    $('#BtnFreeze').hide();
                    $('#BtnUnFreeze').show();
                }
                else {
                    $('#BtnFreeze').show();
                    $('#BtnUnFreeze').hide();
                }
            }
            $('#StartEndPDropdownId').append('<option value="' + response[i].ClosePeriodId + '" name="' + response[i].Status + '" ddPosition="' + i + '" CompanyPeriod=' + CompanyPeriod + '>' + PeriodStatus + ' Period Starting - ' + response[i].StartPeriod + '</option>');
        } else {
            if (i == 0) {
                if (response[i].Status == 'Freeze') {
                    $('#BtnFreeze').hide();
                    $('#BtnUnFreeze').show();
                }
                else {
                    $('#BtnFreeze').show();
                    $('#BtnUnFreeze').hide();
                }
            }
            $('#StartEndPDropdownId').append('<option value="' + response[i].ClosePeriodId + '" name="' + response[i].Status + '" ddPosition="' + i + '" CompanyPeriod=' + CompanyPeriod + '>' + PeriodStatus + ' Period Ending - ' + response[i].EndPeriod + '</option>');
        }
        var obj = {
            ColsePeriod: Col1
        }
        ArrStrPeriod.push(obj);
        var obj = {
            ColsePeriod: Col2
        }
        ArrStrPeriod.push(obj);
        var obj = {
            ColsePeriod: Col3
        }
        ArrStrPeriod.push(obj);
        var obj = {
            ColsePeriod: Col4
        }
        ArrStrPeriod.push(obj);
        var obj = {
            colsePeriod: perioddate
        }
        ArrStrPeriod.push(obj);
    }
    GetClosePeriodList();
}

//======================================================== Check
function funCheckStatus() {
    var strCompanyId = $('#ClsperiodDropdownId').val();
    var strStatus = $('#StartEndPDropdownId option:selected').attr('name');
    // var strEndPeriod = ArrStrPeriod[ddlperiod - 1].ColsePeriod;
    if (strStatus == 'Freeze') {
        $('#BtnFreeze').hide();
        $('#BtnUnFreeze').show();
    } else {
        $('#BtnFreeze').show();
        $('#BtnUnFreeze').hide();
    }
}

//============Insert Freeze period==================//
function InsertFreezePeriod(value) {
    var SelectedText = $("#StartEndPDropdownId option:selected").text();
    var StrSelPeriod = SelectedText.split(' ');
    StrSelPeriod = StrSelPeriod[0];
    var strCompanyId = $('#ClsperiodDropdownId').val();
    var strStartPeriod = '';
    var ddlperiod = $('#StartEndPDropdownId').val();
    var obj = {
        CompanyId: strCompanyId
        , ClosePeriodId: ddlperiod
        , Status: value
        , CreatedBy: localStorage.UserId
        , EndPeriod: $('#txtDate').val()
    }
    $.ajax({
        url: APIUrlInsertFreezeEndPeriod,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
    })
    .done(function (response) {
        InsertCloseEndPeriodSucess(response, value);
    });
}

function InsertCloseEndPeriodSucess(response, value) {
    if (value == 'Open') {
        ShowMsgBox('showMSG', 'Unfrozen', '', '');
        hideDiv('PopUnFreezeperiod');
        $('#BtnUnFreeze').hide();
        $('#BtnFreeze').show();
    } else {
        ShowMsgBox('showMSG', 'Frozen', '', '');
        $('#BtnUnFreeze').show();
        $('#BtnFreeze').hide();
    }

    hideDiv('PopFreezeperiod');
    GetClosePeriodList();
    AtlasCache.CacheORajax(
        {
            URL: AtlasForms.FormItems.URLS.COMPANYPERIODLIST + '?CompanyId=' + $('#ClsperiodDropdownId').val()
            , bustcache: true
        }
    );
    //AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());
}

//============ Close Button=================//
$('#BtnClose').click(function () {
    var ddlperiod = $('#StartEndPDropdownId').val();
    var strval = $('#StartEndPDropdownId option:selected').attr('ddPosition');
    var SelectedText = $("#StartEndPDropdownId option:selected").text();
    var StrSelPeriod = SelectedText.split(' ');
    StrSelPeriod = StrSelPeriod[1];
    var sstrval = $("#StartEndPDropdownId option:selected").text()
    $('#spnClosePeriod').text(sstrval);
    if (strval == 0) {
        $('#PopNewClosePeriod').show();
        $('#fade').show();
        $('#txtClosePeriod').val('');
    }
    else {
        var SelectedText = $("#StartEndPDropdownId option:selected").text();
        var StrSelPeriod = SelectedText.split(' ');
        StrSelPeriod = StrSelPeriod[1];
        $('#PopCloseperiod').show();
        $('#spanClsPerid').text(StrSelPeriod);
    }
});
//============ Error MSG==============//
function ShowMSG(error) {
    console.log(error);
}
//-------------Insert ClosePeriodByComapyId------//
function ShowClosePeriod() {
    showDiv('startValues');
    $('#PopNewClosePeriod').show();
    $('#PopCloseperiod').hide();
}
//==========CheckClosePeriods==========//
function CheckClosePeriod() {
    $.ajax({
        url: APIUrlCheckClosePeriod + '?CompanyID=' + $('#ClsperiodDropdownId').val(),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response)
   { CheckClosePeriodSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function CheckClosePeriodSucess(response) {
    var TLength = response.length;
    for (var i = 0; i < TLength; i++) {
        PubStrStatus = response[0].Status;
    }
}

//--------------------ClosePeriod----------------------//
function InsertClosePeriod() {
    if ($('#txtClosePeriod').val() == 'YES') {
        var strCompanyId = $('#ClsperiodDropdownId').val();
        var strStartPeriod = '';
        var ddlperiod = $('#StartEndPDropdownId').val();
        var sstrval = $("#StartEndPDropdownId option:selected").text()
        $('#spnClosePeriod').text(sstrval);
        var obj = {
            CompanyId: strCompanyId,
            ClosePeriodId: ddlperiod,
            Status: 'Closed'
            , CreatedBy: localStorage.UserId
            , EndPeriod: $('#txtDate').val()
        }

        $.ajax({
            url: APIUrlInsertFreezeEndPeriod,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(obj),
        })
        .done(function (response) {
            InsertClosePeriodSucess(response, sstrval);
        })
    } else if ($('#txtClosePeriod').val() != 'YES') {
        var Msg = 'Please Type YES !!';
        ShowMsgBox('showMSG', Msg, '', '');
    }

}

function InsertClosePeriodSucess(response, sstrval) {
    var strCompanyPeriod = $('#StartEndPDropdownId option:selected').attr('companyperiod');
    var strDate = $('#txtDate').val();
    ShowMsgBox('showMSG', 'Company Period : ' + strCompanyPeriod + '  Is closed on : ' + strDate + '', '', '');
    $('#PopNewClosePeriod').hide();
    hideDiv('PopNewClosePeriod');

    GetStartEndPeriod();

    AtlasCache.CacheORajax({
        URL: AtlasForms.FormItems.URLS.COMPANYPERIODLIST + '?CompanyId=' + $('#ClsperiodDropdownId').val()
        , bustcache: true
    });

}

//-----------------Unfreeze Period--------------//
$('#BtnUnFreeze').click(function () {
    $('#PopUnFreezeperiod').show();
    $('#fade').show();
});

function GetClosePeriodList() {
    $.ajax({
        url: APIUrlGetClosePeriodStatus + '?CompanyId=' + $('#ClsperiodDropdownId').val() + '&ClosePeriodID=' + 0,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'Post',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        //console.log(response);
        $('#tblPeriodTBody').html('');
        var strHtml = '';
        for (var i = 0; i < response.length; i++) {
            strHtml += `<tr>
            <td> ${response[i].CompanyPeriod} </td>
            <td> ${response[i].Status} ${(response[i].PeriodStatus !== '' ? ' (' + response[i].PeriodStatus + ')' : '')} </td>
            <td> ${GetDateFomate(response[i].StartPeriod, 2)} </td>
            <td> ${GetDateFomate(response[i].EndPeriod, 2)} </td>
            </tr>`
        }
        $('#tblPeriodTBody').html(strHtml);
    })
    .fail(function (error) {
        ShowMSG(error);
    });
}