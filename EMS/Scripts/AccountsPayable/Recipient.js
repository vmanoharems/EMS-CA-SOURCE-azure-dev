var APIUrlGetRecipientVendorList = HOST + "/api/POInvoice/GetRecipientVendorList";

var APIUrlInsertRecipient = HOST + "/api/POInvoice/InsertRecipient";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlGetCOARecipient = HOST + "/api/Ledger/GetCOABySegmentPosition1";//"/api/POInvoice/GetAccountListForRecipient";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlFillCompanyFirst = HOST + "/api/AccountPayableOp/GetDedaultCOLO";

var retriveSegment = [];
var GlbCAList = [];

var AtlasPCRecipient = {
    RecipientSelected: {
        RecipientID: undefined
        , VendorID: undefined
        , COAID: undefined
        , Prodid: undefined
        , Createddate: undefined
        , Modifieddate: undefined
        , Createdby: undefined
        , CoaString: undefined
        , ModifiedBy: undefined
        , SetId: undefined
        , SeriesId: undefined
        , Status: undefined
    }
};

$(document).ready(function () {
    $('#navMainUL li').removeClass('active');
    $('#hrefPayable').parent().addClass('active');
    $('#UlAccountPayable li').removeClass('active');
    $('#LiPettyCash').addClass('active');
    retriveSegment = JSON.parse(localStorage.ArrSegment).filter((e, i) => { return e.SegmentClassification.toUpperCase() !== 'SET'; })//$.parseJSON(localStorage.ArrSegment);
    CreateTable();
    GetRecipientList();
    FillCompanyFirst();
})

function CreateTable() {
    var strhtml = '';
    var strhtm = '';
    strhtml += '<tr>'; strhtm += '<tr>';
    strhtml += '<th></th>';
    strhtml += '<th>Recipient</th>';
    strhtml += '<th>Vendor</th>';
    strhtml += '<th>Vendor Name</th>';
    // strhtml += '<th>Country</th>';
    strhtml += '<th>Address</th>';
    strhtml += '<th>City</th>';
    strhtml += '<th>State</th>';
    strhtml += '<th>Vendor Type</th>';
    for (var i = 0; i < retriveSegment.length; i++) {
        strhtml += '<th>' + retriveSegment[i].SegmentName + '</th>';
        strhtm += '<th></th>';
    }
    strhtml += '<th>Action</th>';

    strhtml += '</tr>';

    $('#TblRecipientThead').html(strhtml);

    strhtm += '<th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>'; // <th></th>
    strhtm += '</tr>';
    $('#tableTfoot').html(strhtm);
}

function GetRecipientList() {
    $.ajax({
        url: APIUrlGetRecipientVendorList + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       GetRecipientListSucess(response);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
}

function GetRecipientListSucess(response) {
    $('#TblRecipient').dataTable().fnDestroy();
    var fixToLen = 30;
    var strhtml = '';
    for (var i = 0; i < response.length; i++) {
        title = 'title = ""';
        var strVendorName = response[i].VendorName;
        var RemitAddress1 = response[i].RemitAddress1;
        var VendorType = response[i].Type;
        strhtml += '<tr id="' + i + '">';
        strhtml += '<td></td>';

        if (response[i].RecipientID == 0) {
            strhtml += '<td style="width: 1% !important;" ><input type="checkbox" id="chk_' + i + '" onclick="javascript:funCheckBox(' + i + ');"/><input type="hidden" id="hdnCoaId_' + i + '"/><input type="hidden" id="hdnCoaCode_' + i + '"/> <input type="hidden" id="hdnVendorId_' + i + '" value="' + response[i].VendorID + '"/><input type="hidden" id="hdnRecipient_' + i + '" value="' + response[i].RecipientID + '" /></td>';
        } else {
            if (response[i].Status == true) {
                strhtml += '<td style="width: 1% !important;"><input type="checkbox" id="chk_' + i + '" checked onclick="javascript:funCheckUnCheck(' + i + ');" /><input type="hidden" id="hdnCoaId_' + i + '"/><input type="hidden" id="hdnCoaCode_' + i + '"/> <input type="hidden" id="hdnVendorId_' + i + '" value="' + response[i].VendorID + '"/><input type="hidden" id="hdnRecipient_' + i + '"  value="' + response[i].RecipientID + '"/></td>';
            } else {
                strhtml += '<td style="width: 1% !important;"><input type="checkbox" id="chk_' + i + '"  onclick="javascript:funCheckUnCheck(' + i + ');" /><input type="hidden" id="hdnCoaId_' + i + '"/><input type="hidden" id="hdnCoaCode_' + i + '"/> <input type="hidden" id="hdnVendorId_' + i + '" value="' + response[i].VendorID + '"/><input type="hidden" id="hdnRecipient_' + i + '"  value="' + response[i].RecipientID + '"/></td>';
            }
        }

        strhtml += '<td>' + response[i].VendorNumber + '</td>';
        strhtml += '<td><a ' + title + '  href="#"  style="color: #707070;">'
              + (strVendorName.length > fixToLen ? '<lable title="' + strVendorName + '" style="word-break: break-all;">' + strVendorName.substring(0, fixToLen) + '...</label>' : strVendorName) +
              '</a></td>';

        strhtml += '<td><a ' + title + '  href="#" style="color: #707070;" >'
             + (RemitAddress1.length > fixToLen ? '<lable title="' + RemitAddress1 + '" style="word-break: break-all;">' + RemitAddress1.substring(0, fixToLen) + '...</label>' : RemitAddress1) +
             '</a></td>';

        strhtml += '<td>' + response[i].RemitCity + '</td>';
        strhtml += '<td>' + response[i].RemitState + '</td>';
        if (VendorType == null) {
            strhtml += '<td>' + response[i].Type + '</td>'; VendorType
        } else {
            strhtml += '<td><a ' + title + '  href="#" style="color: #707070;">'
                 + (VendorType.length > fixToLen ? '<lable title="' + VendorType + '" style="word-break: break-all;">' + VendorType.substring(0, fixToLen) + '...</label>' : VendorType) +
                 '</a></td>';
        }

        var StrCode = response[i].CoaString;
        var strSplit = StrCode.split('|');
        for (var j = 0; j < retriveSegment.length; j++) {
            if (retriveSegment[j].Type == 'SegmentRequired') {
                if (StrCode == '') {
                    if (retriveSegment[j].SegmentName == 'DT') {
                        strhtml += `<td class="width40"><span id="spn_${i}_${j}"></span><input type="text" style="display:none;" class="input-segment ${retriveSegment[j].SegmentName} form-control input-required" onblur="javascript:GetSegmentValue(${i},'${retriveSegment[j].SegmentName}',${j});" onfocus="javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(${i},'${retriveSegment[j].SegmentName}',{SegmentP:${j},UnusedONLY:true}, this, true);" id="txt_${i}_${j}" name="${retriveSegment[j].SegmentName}" /> </td>`;
                    } else {
                        strhtml += `<td class="width40"><span id="spn_${i}_${j}"></span><input type="text" style="display:none;" class="input-segment ${retriveSegment[j].SegmentName} form-control input-required" onblur="javascript:GetSegmentValue(${i},'${retriveSegment[j].SegmentName}',${j});" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${i},'${retriveSegment[j].SegmentName}',${j}, this);" id="txt_${i}_${j}" name="${retriveSegment[j].SegmentName}" /> </td>`;
                    }
                } else {
                    var strsplit1 = strSplit[j].split('>');
                    var strvalue = '';
                    if (strsplit1.length == 1) {
                        strvalue = strSplit[j];
                    } else {
                        strvalue = strsplit1[strsplit1.length - 1];
                    }
                    if (retriveSegment[j].SegmentName == 'DT') {
                        strhtml += '<td class="width40"><span id="spn_' + i + '_' + j + '">' + strvalue + '</span><input type="text"  style="display:none;" class="form-control input-required" onblur="javascript:GetSegmentValue(' + i + ',\'' + retriveSegment[j].SegmentName + '\',' + j + ');" onfocus="javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(' + i + ',\'' + retriveSegment[j].SegmentName + '\',{SegmentP:' + j + ',UnusedONLY:true}, this);" id="txt_' + i + '_' + j + '" name="' + retriveSegment[j].SegmentName + '" /> </td>';
                    } else {
                        strhtml += '<td class="width40"><span id="spn_' + i + '_' + j + '">' + strvalue + '</span><input type="text"  style="display:none;" class="form-control input-required" onblur="javascript:GetSegmentValue(' + i + ',\'' + retriveSegment[j].SegmentName + '\',' + j + ');" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(' + i + ',\'' + retriveSegment[j].SegmentName + '\',' + j + ', this);" id="txt_' + i + '_' + j + '" name="' + retriveSegment[j].SegmentName + '" /> </td>';
                    }
                }
            }
        }

        var strCount = 0;
        for (var j = 0; j < retriveSegment.length; j++) {
            if (retriveSegment[j].Type != 'SegmentRequired') {
                if (strCount == 0) {
                    strhtml += '<td class="width40"><span id="spnOptional_' + i + '_' + j + '">' + response[i].SetAccountCode + '</span><input type="text" style="display:none;"   class="form-control" onblur="javascript:funCheckOptionalAutoFill(' + i + ',\'' + retriveSegment[j].SegmentName + '\',' + strCount + ');" onfocus="javascript:GetOptional(' + i + ',\'' + retriveSegment[j].SegmentName + '\',' + strCount + ');" id="txtOptional_' + i + '_' + strCount + '" name="' + retriveSegment[j].SegmentName + '" /></td>';
                } else {
                    strhtml += '<td class="width40"><span id="spnOptional_' + i + '_' + j + '">' + response[i].SeriesAccountCode + '</span><input type="text" style="display:none;"   class="form-control" onblur="javascript:funCheckOptionalAutoFill(' + i + ',\'' + retriveSegment[j].SegmentName + '\',' + strCount + ');" onfocus="javascript:GetOptional(' + i + ',\'' + retriveSegment[j].SegmentName + '\',' + strCount + ');" id="txtOptional_' + i + '_' + strCount + '" name="' + retriveSegment[j].SegmentName + '" /></td>';
                }
                strCount++;
            }
        }
        strhtml += '<td class="width40"><span id="SpnSave_' + i + '" style="display:none;"><a href="javascript:SaveRecipient(' + i + ');" title="save" class="btn btn-success"><i class="fa  fa-check"></i> Save</a></span></td>';
        strhtml += '</tr>';
    }

    $('#TblRecipientTbody').html(strhtml);

    var table = $('#TblRecipient').DataTable({
        "iDisplayLength": 25,
        responsive: {
            details: {

            }
        },
        columnDefs: [{
            sPlaceHolder: "head:after",
            className: 'control',
            orderable: false,
            targets: 0,

        }],
        order: [1, 'asc']
    });

    $('#TblRecipient tfoot th').each(function () {
        var title = $('#TblRecipient thead th').eq($(this).index()).text();
        if (title == 'Recipient') { }
        else if (title == 'Action') { }
        else if (title == 'Vendor') {
            $(this).html('<input type="text"    style="width:100% !important;" placeholder=" ' + title + '" />');

        } else if (title == 'CO' || title == 'LO' || title == 'EP' || title == 'Set' || title == 'Series') {
            $(this).html('<input type="text"    style="width:70% !important;" placeholder=" ' + title + '" />');
        } else {
            $(this).html('<input type="text"    style="width:80px !important;" placeholder=" ' + title + '" />');
        }
    });

    // Apply the search
    table.columns().eq(0).each(function (colIdx) {
        $('input', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
        $('select', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });

    $('#TblRecipient tfoot tr').insertAfter($('#TblRecipient thead tr'));
    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#DvTable').attr('style', 'height:' + heightt + 'px;');

    $('#TblRecipient tr').click(function () {
        var id = $(this).closest('tr').attr('id');
        $('#TblRecipient tr').attr('style', 'background-color: white');
        $('#' + id).attr('style', 'background-color: #d2d6de');
    })
}

function ShowTextBox(value) {
    $('#txtCashAccount_' + value).show();
    $('#spn_' + value).hide();
}

function funCheckBox(value) {
    fillcompanyandlocation(value);
    if ($('#chk_' + value).prop('checked') == true) {
        for (var j = 0; j < retriveSegment.length; j++) {
            $('#txt_' + value + '_' + j).show();
            $('#spn_' + value + '_' + j).hide();
            $('#SpnSave_' + value).show();
        }
        $('#txtOptional_' + value + '_' + 0).show();
        $('#txtOptional_' + value + '_' + 1).show();
        $('#txt_' + value + '_' + 0).select();
    } else {
        for (var j = 0; j < retriveSegment.length; j++) {
            $('#spn_' + value + '_' + j).show();
            $('#txt_' + value + '_' + j).hide();
            $('#SpnSave_' + value).hide();
        }
        $('#txtOptional_' + value + '_' + 0).hide();
        $('#txtOptional_' + value + '_' + 1).hide();
    }
    AtlasPCRecipient.RecipientSelected.VendorID = $('#hdnVendorId_' + value).val();
    AtlasPCRecipient.RecipientSelected.RecipientID = $('#hdnRecipient_' + value).val();
}

//Save
function SaveRecipient(value) {
    var isvalid = '';
    let detailindex = null;
    let detailselected = '';

    for (var j = 0; j < retriveSegment.length; j++) {
        if (retriveSegment[j].Type == 'SegmentRequired') {
            if (retriveSegment[j].SegmentClassification === 'Detail') { detailindex = j; }
            var strvalue = $('#txt_' + value + '_' + j).val();
            if (strvalue == '') {
                $('#txt_' + value + '_' + j).attr('style', 'border-color: red;');
                isvalid = isvalid + 1;
            }
        }
    }
    AtlasPCRecipient.RecipientSelected.COAID = AtlasUtilities.SEGMENTS.DETAILS.asObjects.COANo[$('#txt_' + value + '_' + detailindex).val()].COAID;
    AtlasPCRecipient.RecipientSelected.CoaString = AtlasUtilities.SEGMENTS.DETAILS.asObjects.COANo[$('#txt_' + value + '_' + detailindex).val()].COACode;

    var obj = {
        RecipientId: AtlasPCRecipient.RecipientSelected.RecipientID, //$('#hdnRecipient_' + value).val(),
        VendorID: AtlasPCRecipient.RecipientSelected.VendorID, // $('#hdnVendorId_' + value).val(),
        COAID: AtlasPCRecipient.RecipientSelected.COAID, // $('#hdnCoaId_' + value).val(),
        Prodid: localStorage.ProdId,
        Createdby: localStorage.UserId,
        CoaString: AtlasPCRecipient.RecipientSelected.CoaString, //$('#hdnCoaCode_' + value).val(),
        SetId: $('#txtOptional_' + value + '_' + 0).attr('accountid'),
        SeriesId: $('#txtOptional_' + value + '_' + 1).attr('accountid'),
        Status: true
    }

    if (isvalid === '') {

        $.ajax({
            url: APIUrlInsertRecipient,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(obj),
        })
        .done(function (response) {
            SaveRecipientSuccess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function SaveRecipientSuccess(response) {
    location.reload(true);
}

function funCheckUnCheck(value) {
    var obj = {
        RecipientId: $('#hdnRecipient_' + value).val(),
        VendorID: $('#hdnVendorId_' + value).val(),
        COAID: $('#hdnCoaId_' + value).val(),
        Prodid: localStorage.ProdId,
        Createdby: localStorage.UserId,
        CoaString: $('#hdnCoaCode_' + value).val(),
        SetId: $('#txtOptional_' + value + '_' + 0).attr('accountid'),
        SeriesId: $('#txtOptional_' + value + '_' + 1).attr('accountid'),
        Status: $('#chk_' + value).prop('checked')
    }

    $.ajax({
        url: APIUrlInsertRecipient,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
    })
    .done(function (response) {
        funCheckUnCheckSuccess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funCheckUnCheckSuccess(response) {
    ShowMsgBox('showMSG', 'Update Recipient.. !!', '', '');
}


//================================================== Segment
function funSegment(values, SegmentName, SegmentP) {
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');

    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    } else {
        PreSegment = SegmentP - 1;
    }
    var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');

    if (SegmentName != 'DT') {
        $.ajax({
            url: APIUrlGetCOA + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',

        })
        .done(function (response) {
            funSegmentSucess(response, values, SegmentP);
        })
        .fail(function (error) {
            console.log(error);
        })
    } else {
        var strCustodianId = $('#hdnRecipient_' + values).val();

        if (strCustodianId == '') {
            strCustodianId = 0;
        }
        $.ajax({
            url: APIUrlGetCOARecipient + '?CoaCode=' + strCOACode + '&ProdId=' + localStorage.ProdId + '&RecipientId=' + strCustodianId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',

        })
        .done(function (response) {
            funSegmentSucess(response, values, SegmentP);
        })
        .fail(function (error) {
            console.log(error);
        })
    }
}

function funSegmentSucess(response, values, SegmentP) {
    GlbCOAList = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.COANo,
            value: m.COACode,
            COAId: m.COAID,
        };
    });

    $('#txt_' + values + '_' + SegmentP).addClass('SearchCode');
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);
            $('#hdnCOACode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCOACode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {

            }
        }
    })
}

//================================================== Segment Optional
function GetOptional(values, SegmentName, SegmentP) {
    $('#txtOptional_' + values + '_' + SegmentP).removeClass('SearchOptionalCode');
    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + SegmentName,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetOptionalSucess(response, values, SegmentP);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetOptionalSucess(response, values, SegmentP) {
    GblOptionalCOA = [];
    GblOptionalCOA = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.AccountCode,
            value: m.AccountID,

        };
    });

    $('#txtOptional_' + values + '_' + SegmentP).addClass('SearchOptionalCode');
    $(".SearchOptionalCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('AccountID', ui.item.value);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('AccountID', ui.item.value);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {


            }
        }
    })
}

function funCheckOptionalAutoFill(value, segmentName, valueN) {
    var strval = $('#txtOptional_' + value + '_' + valueN).val();

    if (strval != '') {
        for (var i = 0; i < GblOptionalCOA.length; i++) {
            if (GblOptionalCOA[i].AccountCode.match(strval)) {
                //if (strval == GblOptionalCOA[i].AccountCode) {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[i].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[i].AccountID);
                break;
            } else {

            }
        }
    } else {
    }

    $('#txtOptional_' + value + '_' + valueN).removeClass('SearchOptionalCode');
}

function ShowMSG(error) {
    console.log(error);
}

//========================Default First Autofill=================//
function FillCompanyFirst() {
    $.ajax({
        url: APIUrlFillCompanyFirst + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillCompanyFirstSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillCompanyFirstSucess(response) {
    strResponse = response;
}

function fillcompanyandlocation(value) {
    if (strResponse.length == 1) {
        $('#txt_' + value + '_0').attr('coacode', strResponse[0].COCOA);
        $('#txt_' + value + '_0').val(strResponse[0].COCOA);
        $('#txt_' + value + '_0').attr('name', 'CO');
        $('#txt_' + value + '_0').attr('coaid', strResponse[0].COCOAID);

        $('#txt_' + value + '_1').attr('coacode', strResponse[0].LOCOA);
        $('#txt_' + value + '_1').val(strResponse[0].Location);
        $('#txt_' + value + '_1').attr('name', 'LO');
        $('#txt_' + value + '_1').attr('coaid', strResponse[0].LOCOAID);

        $('#hdnCOAId_' + value).val(strResponse[0].LOCOAID);
        $('#hdnCOACode_' + value).val(strResponse[0].LOCOA);
    }
}