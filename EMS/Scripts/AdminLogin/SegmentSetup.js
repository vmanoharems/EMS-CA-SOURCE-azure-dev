var APIUrlGetSegmentList = HOST + "/api/AdminTools/AdminAPIToolsSegmentList"; // + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlSaveSegment = HOST + "/api/AdminLogin/SaveSegment";
var APIUrlCleanUpDB = HOST + "/api/AdminLogin/ProductionCleanUp";
var PubRowCount = 0;
var strValue = 'False';
var StrStatus = '';
var strIsAccountExists = '';

$(document).ready(function () {
  
    GetSegmentList();
});

function GetSegmentList() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.AdminProdId+'&Mode='+1,
        cache: false,
        async: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       GetSegmentListSucess(response);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
}

function GetSegmentListSucess(response) {
   
  //  alert(response[0].IsAccountExists);
 
    var Tcount = response.length;
    if (Tcount > 0) {
       strIsAccountExists=response[0].IsAccountExists;
       // strIsAccountExists = 'No';
        var strHtml = '';
        var strUL = '';
        PubRowCount = Tcount;
        for (var i = 0; i < Tcount; i++) {
            if (i == 0) {
                $('#ddlName').html('<option value="' + response[i].SegmanetId + '">' + response[i].SegmentName + '</option>');
            }
            else {
                $('#ddlName').append('<option value="' + response[i].SegmanetId + '">' + response[i].SegmentName + '</option>');
            }
        }
        $('#UlRightTab').html(strUL);

        for (var i = 0; i < Tcount; i++) {
            if (response[i].SegmentName != 'SubAccount') {

                strHtml += '<tr id="tableTr_' + i + '">';
                var StrChecked = '';
                if (response[i].DetailFlag == true) {
                    var StrChecked = 'checked';
                }
                if (i == 0) {
                    strHtml += '<td><span class="redDot" id="spn_' + i + '" onclick="javascript:funRowRemove(' + i + ');"></span></td>';
                    strHtml += '<td><input id="txtCode_' + i + '" type="text" value="' + response[i].SegmentCode + '" disabled/></td>';
                    strHtml += '<td><input type="text" id="txtSLevel_' + i + '" value="' + response[i].CodeLength + '" disabled onkeypress = "return isNumberKey(event)"/></td>';
                    strHtml += '<td><input class="SearchName" type="text" id="txtSName_' + i + '" value="' + response[i].SegmentName + '" disabled/></td>';
                    strHtml += '<td><input type="text" id="txtSReport_' + i + '" value="' + response[i].Classification + '" disabled/></td>';
                    strHtml += '<td><select style="width: 47%;float: left;" id="ddlSegmentType_' + i + '" disabled class="form-control "><option selected>Company</option></select></td>';
                    strHtml += '<td style="display:none;"><input type="checkBox" id="ChkChekced_' + i + '" ' + StrChecked + ' disabled /></td>';
                    strHtml += '<tr id="TrNewSegment"><td colspan="6"><span class="fa fa-plus-square"" onclick="javascript:funAddNewRow();"></span><span style="font-size:16px;">  New Segment</span></td></tr>';

                } else {
                    StrStatus = response[1].SegmentStatus;
                    if (StrStatus != 'Completed' || strIsAccountExists=='No') {
                        strHtml += '<td><span class="redDot" id="spn_' + i + '"  onclick="javascript:funRowRemove(' + i + ');">-</span></td>';
                        strHtml += '<td><input class="clstxtCode" type="text" id="txtCode_' + i + '" value="' + response[i].SegmentCode + '" /></td>';
                        strHtml += '<td><input class="clstxtLevel" type="text" id="txtSLevel_' + i + '" value="' + response[i].CodeLength + '" onkeypress = "return isNumberKey(event)" /></td>';
                        strHtml += '<td><input class="clstxtName" type="text" id="txtSName_' + i + '" value="' + response[i].SegmentName + '" /></td>';
                        strHtml += '<td><input class="clstxtReport" type="text" id="txtSReport_' + i + '" value="' + response[i].SegmentReportDescription + '" /></td>';
                        strHtml += '<td><select style="width: 47%;float: left;" id="ddlSegmentType_' + i + '"   class="form-control clsSegmentType" onchange="javascript:funCheckDropDown(' + i + ');" ><option value="0" selected>Select</option><option value="Location">Location</option><option value="Ledger">Ledger</option><option value="Episode">Episode</option><option value="Detail">Detail</option><option value="Optional">Optional</option></select><input type="text" id="txt_' + i + '" style="display:none;width: 41%;margin-left: 7px;float: left;" /></td>';
                        strHtml += '<td style="display:none;"><input class="clsCheckBox" type="checkBox"' + StrChecked + ' id="ChkChekced_' + i + '" onchange="javascript:CheckBoxCheck(' + i + ');" /></td>';
                    }
                    else {
                        strHtml += '<td><span class="redDot" id="spn_' + i + '" >-</span></td>';
                        strHtml += '<td><input class="clstxtCode" type="text" id="txtCode_' + i + '" value="' + response[i].SegmentCode + '" disabled /></td>';
                        strHtml += '<td><input class="clstxtLevel" type="text" id="txtSLevel_' + i + '" value="' + response[i].CodeLength + '" disabled onkeypress = "return isNumberKey(event)" /></td>';
                        strHtml += '<td><input class="clstxtName" type="text" id="txtSName_' + i + '" value="' + response[i].SegmentName + '"  disabled/></td>';
                        strHtml += '<td><input class="clstxtReport" type="text" id="txtSReport_' + i + '" value="' + response[i].SegmentReportDescription + '" disabled /></td>';
                        strHtml += '<td><select style="width: 47%;float: left;" id="ddlSegmentType_' + i + '" disabled class="form-control clsSegmentType"  onchange="javascript:funCheckDropDown( ' + i + ');"><option value="0" selected>Select</option><option value="Location">Location</option><option value="Ledger">Ledger</option><option value="Episode">Episode</option><option value="Detail">Detail</option><option value="Set">Set</option><option value="Optional">Optional</option></select></td>';
                        strHtml += '<td style="display:none;"><input class="clsCheckBox" type="checkBox"' + StrChecked + ' id="ChkChekced_' + i + '" onchange="javascript:CheckBoxCheck(' + i + ');" disabled /></td>';
                    }
                }

                strHtml += '</tr>';
            }
        }
        $('#tblSegmentTBody').html(strHtml);

        for (var i = 1; i < response.length; i++) {
            if (response[i].Classification == 'Company' || response[i].Classification == 'Location' || response[i].Classification == 'Episode' || response[i].Classification == 'Detail' || response[i].Classification == 'Ledger') {
                $('#ddlSegmentType_' + i).val(response[i].Classification);
            }
            else {
                $('#ddlSegmentType_' + i).val('Optional');

            }

        }
        for (var i = 1; i < response.length; i++) {
            if (response[i].Classification == 'Detail') {
                $('#txtLevelMask1').val(response[i].SubAccount1);
                $('#txtLevelMask2').val(response[i].SubAccount2);
                $('#txtLevelMask3').val(response[i].SubAccount3);
                $('#txtLevelMask4').val(response[i].SubAccount4);
                $('#txtLevelMask5').val(response[i].SubAccount5);
                $('#txtLevelMask6').val(response[i].SubAccount6);
            }

        }

        if (StrStatus == 'Completed' && strIsAccountExists=='Yes') {
            $('#btnSaveSegment').hide();
            $('#btnCancel').hide();
            $('#TrNewSegment').remove();
            $('#btnNewSegmentButton').hide();
            $('#txtLevelMask1').attr('disabled', true);
            $('#txtLevelMask2').attr('disabled', true);
            $('#txtLevelMask3').attr('disabled', true);
            $('#txtLevelMask4').attr('disabled', true);
            $('#txtLevelMask5').attr('disabled', true);
            $('#txtLevelMask6').attr('disabled', true);
        }
    }
    else {
        CleanUpDB();
    }
}

function CleanUpDB() {
    
    $.ajax({
        url: APIUrlCleanUpDB + '?ProdID=' + localStorage.AdminProdId + '&EmailId=' + localStorage.AdminEmail + '&UserId=' + localStorage.AdminUserID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CleanUpDBSucess(response);
    })
    .fail(function (error) {
        ShowErrorMSG(error);
    })

}

function CleanUpDBSucess(response) {
    console.log(response);
    GetSegmentList();
}

function ShowMSG(error) {
    console.log(error);
}

function funAddNewRow() {
    PubRowCount++;
    var strHtml = '';
    strHtml += '<tr id="tableTr_' + PubRowCount + '">';
    strHtml += '<td><span class="redDot" id="spn_' + PubRowCount + '" onclick="javascript:funRowRemove(' + PubRowCount + ');"></span></td>';
    // strHtml += '<td><span class="redDot" >-</span></td>';
    strHtml += '<td><input type="text" class="clstxtCode"  id="txtCode_' + PubRowCount + '" /></td>';
    strHtml += '<td><input type="text" class="clstxtLevel" id="txtSLevel_' + PubRowCount + '" onkeypress = "return isNumberKey(event)" /></td>';
    strHtml += '<td><input type="text" class="clstxtName" id="txtSName_' + PubRowCount + '" /></td>';
    strHtml += '<td><input type="text" class="clstxtReport" id="txtSReport_' + PubRowCount + '" /></td>';
    strHtml += '<td ><select  style="width: 47%;float: left;" id="ddlSegmentType_' + PubRowCount + '"  onchange="javascript:funCheckDropDown(' + PubRowCount + ');" class="form-control clsSegmentType" ><option value="0" selected>Select</option><option value="Location">Location</option><option value="Ledger">Ledger</option><option value="Series">Series</option><option value="Episode">Episode</option><option value="Detail">Detail</option><option value="Set">Set</option><option value="Optional">Optional</option></select><input type="text" id="txt_' + PubRowCount + '" style="display:none;width: 41%;margin-left: 7px;float: left;" /></td>';
    strHtml += '<td style="display:none;"><input type="checkBox" class="clsCheckBox" id="ChkChekced_' + PubRowCount + '" onchange="javascript:CheckBoxCheck(' + PubRowCount + ');"/></td>';
    strHtml += '</tr>';
    $('#tblSegmentTBody').append(strHtml);
}

function CheckBoxCheck(values) {
    var strCheckBox = $('.clsCheckBox');

    for (var i = 0; i < strCheckBox.length; i++) {
        strCheckBox[i].checked = false;
    }
    $('#ChkChekced_' + values).prop('checked', true);
}

function funCheckDropDown(values) {
    var strDropDownValue = $('#ddlSegmentType_' + values).val();
    if (strDropDownValue != 'Optional') {
        $('#txt_' + values).hide();
        var SegmentType = $('.clsSegmentType');
        var Tcount = SegmentType.length;
        for (var i = 0; i < Tcount; i++) {
            var SegId = SegmentType[i].id;
            var SegmentValue = SegmentType[i].value;
            var strSegId = SegId.split("_");
            if (values == strSegId[1])
            { }
            else {
                if (strDropDownValue == SegmentValue) {
                    // alert('test');
                    $('#ddlSegmentType_' + values).val(0);
                }
            }
        }
    }
    else {
        $('#txt_' + values).show();
        $('#txt_' + values).focus();

    }

}

function funRowRemove(values) {

    //    || values == 1 || values == 2 || values == 4 || values == 5
    if (values == 0 ) {
        ShowMsgBox('showMSG', ' You CANNOT remove this  Segment', '', '');
    }
    else {
        $('#tableTr_' + values).remove();
    }

   // funCheckSegmentSetup();

}
function funCheckSegmentSetup() {
    var strName = $('.clsCheckBox');

    var strLength = strName.length;
    for (var i = 0; i < strLength; i++) {
        if (strName[i].checked == true) {
            /// alert('true 123456789');
            strValue = 'true';
        }
    }
    if (strValue == 'False') {
        //   alert('Invaild');
        $('#DvInvaildSegment').show();
        $('#fade').show();
    }
}

function funSaveSegmentPopup() {
    funCheckSegmentSetup();
    if (strValue == 'False') {

    }
    else {
        //alert('Save Segment');
    }


}

function funSaveSegment() {
    var PubCount = 0;
    var pubSublevel = 0;
    var pubCountOptional = 0;
    //  alert(StrStatus);
    var FinalObj = [];
    var Scode = $('.clstxtCode');
    var SLevel = $('.clstxtLevel');
    var SName = $('.clstxtName');
    var SReport = $('.clstxtReport');
    var SDetail = $('.clsCheckBox');
    var SegmentType = $('.clsSegmentType'); //add

    for (var i = 0; i < SegmentType.length; i++) {
        if (SegmentType[i].value == 'Ledger') {
            PubCount++;
            //  pubSublevel--;
        }
        if (SegmentType[i].value == 'Detail') {
            PubCount++;
        }
    }

    if (PubCount == 2) {
        if (strValue == 'False') {
            var strLength = SName.length;
            for (var i = 0; i < strLength; i++) {
                //===================================================== Optional
                var strClassification = '';
                if (SegmentType[i].value == 'Optional') {
                    var strid = SegmentType[i].id;
                    var stridval = strid.split('_');
                    strClassification = $('#txt_' + stridval[1]).val();
                    if ($('#txt_' + stridval[1]).val() == '') {
                        pubCountOptional++;
                    }
                } else {
                    strClassification = SegmentType[i].value;
                }
                //===================================================== Optional End

                pubSublevel++;
                if (SegmentType[i].value == 'Ledger') {
                    pubSublevel--;
                }
                if (SegmentType[i].value == 'Detail') {
                    var objSegment = {
                        SegmentCode: Scode[i].value,
                        SegmentName: SName[i].value,
                        SegmentReportDescription: SReport[i].value,
                        CodeLength: SLevel[i].value,
                        SegmentLevel: i,
                        DetailFlag: SDetail[i].checked,
                        ProdId: localStorage.AdminProdId,
                        CreatedBy: localStorage.AdminUserID,
                        Classification: SegmentType[i].value,
                        SubAccount1: $('#txtLevelMask1').val(),
                        SubAccount2: $('#txtLevelMask2').val(),
                        SubAccount3: $('#txtLevelMask3').val(),
                        SubAccount4: $('#txtLevelMask4').val(),
                        SubAccount5: $('#txtLevelMask5').val(),
                        SubAccount6: $('#txtLevelMask6').val(),

                    }

                } else if (SegmentType[i].value == 'Ledger') {
                    var objSegment = {
                        SegmentCode: Scode[i].value,
                        SegmentName: SName[i].value,
                        SegmentReportDescription: SReport[i].value,
                        CodeLength: SLevel[i].value,
                        SegmentLevel: i + 2,
                        DetailFlag: SDetail[i].checked,
                        ProdId: localStorage.AdminProdId,
                        CreatedBy: localStorage.AdminUserID,
                        Classification: SegmentType[i].value,
                        SubAccount1: $('#txtLevelMask1').val(),
                        SubAccount2: $('#txtLevelMask2').val(),
                        SubAccount3: $('#txtLevelMask3').val(),
                        SubAccount4: $('#txtLevelMask4').val(),
                        SubAccount5: $('#txtLevelMask5').val(),
                        SubAccount6: $('#txtLevelMask6').val(),

                    }
                } else {
                    var objSegment = {
                        SegmentCode: Scode[i].value,
                        SegmentName: SName[i].value,
                        SegmentReportDescription: SReport[i].value,
                        CodeLength: SLevel[i].value,
                        SegmentLevel: i,
                        DetailFlag: SDetail[i].checked,
                        ProdId: localStorage.AdminProdId,
                        CreatedBy: localStorage.AdminUserID,
                        Classification: strClassification,
                    }
                }

                FinalObj.push(objSegment);
            }

            if (pubCountOptional != 0) {
                ShowMsgBox('showMSG', ' Please Fill Segment Type.. !!', '', '');
            } else {

                $.ajax({
                    url: APIUrlSaveSegment,
                    cache: false,
                    async: false,
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
                    },
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(FinalObj),
                })
                .done(function (response) {
                    SaveSegmentSucess(response);
                })
                .fail(function (error) {
                    ShowMSG(error);
                });
            }
        }
        else {
            //  alert('Invaild Setup');
        }

    } else {
        ShowMsgBox('showMSG', ' Detail and Ledger must be selected', '', '');
    }
  
}
function SaveSegmentSucess(response) {
    ShowMsgBox('showMSG', ' Segment Save Successfully ..!!', '', '');
    location.reload(true);
}

$('#HrfSetupNewDataBase').click(function () {

});


function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 65 || charCode == 97 || charCode == 35 || charCode == 45)
        return true;

    return false;
}

// onkeypress = "return isNumberKey(event)"