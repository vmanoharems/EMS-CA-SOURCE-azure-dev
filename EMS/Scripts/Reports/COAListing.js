var APIUrlGetCompanyCode = HOST + "/api/CompanySettings/GetCompnayCodeByProdId"; /// Not used now  /////
var APIUrlGetSegmentDetails = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOAbyProdId"; // Not used now  /////
var APIUrlGetCOAListByCompnayId = HOST + "/api/Ledger/GetCOAListByCompany";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlUpdateCOADescriptionById = HOST + "/api/Ledger/UpdateCOADescriptionById";
var APIUrlGetAccountType = HOST + "/api/CompanySettings/GetAllAccountType";
var APIUrlGetCOAListReport = HOST + "/api/ReportAPI/GetCOAListByCompany";


var CompanyCode = '';
var SegmentDetail = 0;
var SegmentArr = [];
var gblSegment = [];
var gblCodeString = '';
var GblSegmentUse = [];
var strCOACode = '';

$(document).ready(function () {
    $('#UlReports li').removeClass('active');
    $('#LiCOAListing').addClass('active');
    funGetSegmentDetail();
  //  GetCompnayCode();

})
//=================================================== Account Type
function GetAccountType() {
    $.ajax({
        url: APIUrlGetAccountType + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
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
    var strAccountType = '';
    var strHtml = '';
    strAccountType += '<option value=All>All</option>';
    for (var i = 0; i < response.length; i++) {
        strAccountType += '<option value=' + response[i].Code + '>' + response[i].Code + '</option>';
    }
   
    strHtml += '<label style="width: 90px !important;">' + 'Account Type' + '</label>';
    strHtml += ' <select id="ddlAccountType" class="form-control floatLeft" onchange="javascript: GetCOACode();" style="width: 14%;margin-right: 10px;">' + strAccountType + '</select>';
    $('#DvFilter').append(strHtml);

}
//------------------------------------------------ Create Filter
function funGetSegmentDetail() {
    $.ajax({
        url: APIUrlGetSegmentDetails + '?ProdId=' + localStorage.ProdId+'&Mode='+0,
        cache: false,
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetSegmentDetailSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function GetSegmentDetailSucess(response) {
    $('#DvFilter').html('');
    gblSegment = [];
    gblSegment = response;
    GblSegmentUse=[];
    var strHtml='';
    for (var i = 0; i < response.length; i++) {
        
        if (response[i].Classification == 'Detail') {
             $('#DvFilter').append(strHtml);
            break;
        }
        if (response[i].Classification == 'Episode')
        {
            GblSegmentUse.push(response[i].Classification);
            strHtml += '<label style="width:70px !important;display:none;" >' + response[i].Classification + '</label>';
            strHtml += ' <select style="display:none;" id="ddl' + response[i].Classification + 'COA" class="form-control floatLeft" onchange="javascript: GetCOACode();" style="width: 14%;margin-right: 10px;"></select>';
            GetTblAccountByClasscification(response[i].Classification);
        }
        else {
            GblSegmentUse.push(response[i].Classification);
            strHtml += '<label style="width:70px !important;">' + response[i].Classification + '</label>';
            strHtml += ' <select id="ddl' + response[i].Classification + 'COA" class="form-control floatLeft" onchange="javascript: GetCOACode();" style="width: 14%;margin-right: 10px;"></select>';
            GetTblAccountByClasscification(response[i].Classification);
        }
    }
    var strHtml = '';
    strHtml += '<tr>';
    for (var i = 0; i < response.length; i++) {
       
        if (response[i].Classification == 'Detail') {
            strHtml += '<th class="first"> <div class="th-inner">' + response[i].Classification + '</div></th>';
            SegmentDetail = i;
            break;
        }
    }
    strHtml += '<th class="second"> <div class="th-inner">Description</div></th>';
    strHtml += '<th class="second"> <div class="th-inner">Report Description</div></th>';
    strHtml += '<th class="first"> <div class="th-inner">Posting</div></th>';
    strHtml += '<th class="first"> <div class="th-inner">Type</div></th>';
    //strHtml += '<th>Balance</th>';
    strHtml += '</tr>';
    $('#tblCOAThead').html(strHtml);

    GetAccountType();

    GetCOAList();

}
//---------------------------------------COA List
function GetCOAList(value) {
   
    $("#preload").css("display", "block");
    $('#TblCOATBody').html('');
    $.ajax({
        url: APIUrlGetCOAListByCompnayId + '?ProdId=' + localStorage.ProdId + '&CodeString=' + value,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { GetCOAListByCompnayIdSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}
function GetCOAListByCompnayIdSucess(response) {
    var Tcount = response.length;
    var strAccountType = $('#ddlAccountType').val();
    var strval = '';
    if (strAccountType == 'All')
    {
        var strHtml = '';
        if (Tcount > 0) {
            for (var i = 0; i < Tcount; i++) {
                var strDetail = response[i].Detail.replace(/>/g, ' ');
                    strHtml += '<tr>';
                    strHtml += '<td>' + strDetail + '</td>';
                    strHtml += '<td>' + response[i].Descriptions + '</td>';
                    if (response[i].ReportDescription == '') {
                        // strHtml += '<td>' + response[i].Descriptions + '</td>';
                        strHtml += '<td><span style="color: blue;" id="spn_' + response[i].COAID + '" >' + response[i].Descriptions + '</span><input type="text" class="txtEnter" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;" name="' + response[i].COAID + '"/></td>';
                    }
                    else {
                        strHtml += '<td><span style="color: blue;" id="spn_' + response[i].COAID + '" >' + response[i].ReportDescription + '</span><input type="text" class="txtEnter" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;" name="' + response[i].COAID + '"/></td>';
                    }
                    if (response[i].Posting == true) {
                        strHtml += '<td><input type="checkBox" checked disabled/></td>';
                    }
                    else {
                        strHtml += '<td><input type="checkBox" disabled/></td>';
                    }
                    strHtml += '<td>' + response[i].AccountType + '</td>';
                    strHtml += '</tr>';
                
            }
        }
        else {
            var strCount = SegmentDetail;
            strCount = strCount + 3;
            strHtml += '<tr><td colspan="' + strCount + '" style="text-align: center;">No Record Found.. !!</td></tr>';
        }
    }
   else if (strAccountType != 'EX')
    {
        var strHtml = '';
        if (Tcount > 0) {
            for (var i = 0; i < Tcount; i++) {
                var strDetail = response[i].Detail.replace(/>/g, ' ');

                if (strAccountType == response[i].AccountType) {
                    strHtml += '<tr>';
                    strHtml += '<td>' + strDetail + '</td>';
                    strHtml += '<td>' + response[i].Descriptions + '</td>';
                    if (response[i].ReportDescription == '') {
                        // strHtml += '<td>' + response[i].Descriptions + '</td>';
                        strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].Descriptions + '</span><input type="text" class="txtEnter" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;" name="' + response[i].COAID + '"/></td>';
                    }
                    else {
                        strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].ReportDescription + '</span><input type="text" class="txtEnter" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;" name="' + response[i].COAID + '"/></td>';
                    }
                    if (response[i].Posting == true) {
                        strHtml += '<td><input type="checkBox" checked disabled/></td>';
                    }
                    else {
                        strHtml += '<td><input type="checkBox" disabled/></td>';
                    }
                    strHtml += '<td>' + response[i].AccountType + '</td>';
                    strHtml += '</tr>';
                }
            }
        }
        else {
            var strCount = SegmentDetail;
            strCount = strCount + 3;
            strHtml += '<tr><td colspan="' + strCount + '" style="text-align: center;">No Record Found.. !!</td></tr>';
        }
    }
    else {
        var strHtml = '';
        if (Tcount > 0) {
            for (var i = 0; i < Tcount; i++) {
                var strDetail = response[i].Detail.replace(/>/g, ' ');

                if ('A' != response[i].AccountType && 'L' != response[i].AccountType) {


                    strHtml += '<tr>';
                    strHtml += '<td>' + strDetail + '</td>';
                    strHtml += '<td>' + response[i].Descriptions + '</td>';
                    if (response[i].ReportDescription == '') {
                        // strHtml += '<td>' + response[i].Descriptions + '</td>';
                        strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].Descriptions + '</span><input type="text" class="txtEnter" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;" name="' + response[i].COAID + '"/></td>';
                    }
                    else {
                        strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].ReportDescription + '</span><input type="text" class="txtEnter" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;" name="' + response[i].COAID + '"/></td>';

                    }
                    if (response[i].Posting == true) {
                        strHtml += '<td><input type="checkBox" checked disabled/></td>';

                    }
                    else {
                        strHtml += '<td><input type="checkBox" disabled/></td>';

                    }
                    strHtml += '<td>' + response[i].AccountType + '</td>';


                    strHtml += '</tr>';

                }

            }
        }
        else {
            var strCount = SegmentDetail;
            strCount = strCount + 3;
            strHtml += '<tr><td colspan="' + strCount + '" style="text-align: center;">No Record Found.. !!</td></tr>';
        }
    }
    
    
    $('#TblCOATBody').html(strHtml);
    $("#preload").css("display", "none");

    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#DvTB').attr('style', 'height:' + heightt + 'px !important; ');
}



//=================================== Fill Value In DDL /Filter
function GetTblAccountByClasscification(value) {
    

    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + value,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })


.done(function (response)
{ GetTblAccountByClasscificationSuccess(response, value); })
.fail(function (error)
{ ShowMSG(error); })
}

function GetTblAccountByClasscificationSuccess(response, value) {
    for (var i = 0; i < response.length; i++) {

        if (value == 'Episode') {
            gblCodeString += response[i].AccountCode + '|';
            $('#ddl' + value + 'COA').append('<option value="' + response[i].AccountCode + '">' + response[i].AccountCode + '</option>');
        }
        else {
            if (i == 0) {
                gblCodeString += response[i].AccountCode + '|';
                $('#ddl' + value + 'COA').append('<option value="0">Select</option>');
            }

            $('#ddl' + value + 'COA').append('<option value="' + response[i].AccountCode + '">' + response[i].AccountCode + '</option>');
        }
    }
   // GetCOAList(gblCodeString);
}

function GetCOACode()
{
    var strCOACode = '';
    for (var i = 0; i < GblSegmentUse.length; i++)
    {
        var strval = $('#ddl' + GblSegmentUse[i] + 'COA').val();
        strCOACode += strval + '|';
    }
    GetCOAList(strCOACode);
}

$(document).on('keydown', 'input.txtEnter', function (e) {
    var keyCode = e.keyCode || e.which;

    //var data = this.name;

    //var arr = data.split(':');
    //CategoryCurrentRow = arr[0];
    //CategoryCurrentColumn = arr[1];

    if (keyCode == 13) {
       
        funShowSpan(this.name);
    }
    
});
function funShowTextBox(value)
{
    var strval= $('#spn_'+value).text();
    $('#spn_' + value).hide();
    $('#txt_' + value).val(strval);
    $('#txt_' + value).show();

    $('#txt_' + value).focus();
    $('#txt_' + value).select();

  
}
function funShowSpan(value)
{
    var strval = $('#txt_' + value).val().trim();
    $('#txt_' + value).hide();
    $('#spn_' + value).text(strval);
    $('#spn_' + value).show();

    ///////////// Ajax Calling 


    $.ajax({
        url: APIUrlUpdateCOADescriptionById + '?COAId=' + value + '&Description=' + strval,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ UpdateCOADescriptionByIdSucess(response); })
.fail(function (error)
{ ShowMSG(error); })

}
function UpdateCOADescriptionByIdSucess(response)
{

}

//==========================COA list Report=======================//

function GetCOAListReport(value) {

  //  $("#preload").css("display", "block");
  //  $('#TblCOATBody').html('');
    $.ajax({
        url: APIUrlGetCOAListReport + '?ProdId=' + localStorage.ProdId + '&CodeString=' + value + '&ProName=' + localStorage.ProductionName,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { GetCOAListReportSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}
function GetCOAListReportSucess(response) {
    alert('COA Report Created ');
    var fileName = "ReportCOA.pdf";
    $("#dialog").dialog({
        modal: true,
        title: fileName,
        width: 840,
        height: 500,
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }

        },
        open: function () {
            var object = "<object data=\"{FileName}\" type=\"application/pdf\" width=\"800px\" height=\"350px\">";
            object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
            object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
            object += "</object>";

            object = object.replace(/{FileName}/g, /CheckPDF/ + fileName);

            $("#dialog").html(object);
        }
    });
}

$('#POPrintPDF').click(function () {
    GetCOAPDF();
})

function GetCOAPDF() {
    var strCOACodePDf = '';
    for (var i = 0; i < GblSegmentUse.length; i++) {
        var strval = $('#ddl' + GblSegmentUse[i] + 'COA').val();
        strCOACodePDf += strval + '|';
    }

    GetCOAListReport(strCOACodePDf);

}

