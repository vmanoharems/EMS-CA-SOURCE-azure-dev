
var APIUrlFillPO = HOST + "/api/POInvoice/GetAllPurchaseOrder";
var APIUrlFillPOLines = HOST + "/api/POInvoice/GetPOLines";

//var APIUrlPOListPDF = HOST + "/api/POInvoice/GetAllPurchaseOrder";
var APIUrlPOListPDF = HOST + "/api/ReportAPI/GetAllPurchaseOrder";


$(document).ready(function () {
    $('#UlReports li').removeClass('active');
    $('#LiPOLising').addClass('active');
    //alert('hello vivek');
    FillPO();
});


$('#POPrintPDF').click(function () {
    FunPOListPDf();
})

function FillPO() {
    var Obj = {
        PODate: '01-01-1990',
        PONumber: '',
        POCO: '',
        POstatus: '',
        POVendorId: '',
        POThirdPartyVendor: '',
        POBatchNumber: '',
        Balance: '',
        ProdID: localStorage.ProdId
    }
    $.ajax({
        url: APIUrlFillPO + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(Obj),
    })

   .done(function (response)
   { FillPOSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}

function ShowMSG(error) {
    console.log(error);
}

function FillPOSucess(response) {

    $('#TblPO').dataTable().fnDestroy();
    $('#tbodyPO').html('');
    var str = '';
    //str += '<tr style="background-color: gray;" class="TrHide" id="TrFilter">';
    //str += '<td></td>';
    //str += '<td><input type="text" id="TrPODate" class="datepicker" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrPONo" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrPOCO" style="width: 100%;"/></td>';
    //str += '<td><select id="TrStatus" style="height: 100% !important;"><option value="" selected>Select</option> <option value="Open">Open</option><option value="Close">Close</option><option value="Partial">Partial</option> </select></td>';
    ////<input type="text" id="TrStatus" style="width: 100%;"/>
    //str += '<td><input type="text" id="TrVendor" style="width: 100%;" class="VendorCode" onfocus="javascript:FillVendor();"/></td>';
    //str += '<td><input type="text" id="TrThirdPartyVendor" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrPOBatchNumber" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrBalance" style="width: 100%;"/></td>';
    //str += '<td><span class="GreenDot" style="display:inline;" onclick="javascript:funSearchFilter();"></span></td></td>';
    ////<span class="redDot" style="display:inline;margin-top: 3px;margin-left: 1px;"></span>
    //str += '</tr>';
    if (response.length > 0) {


        for (var i = 0; i < response.length; i++) {
            var TParty = '';
            var VName = '';
            var TP = response[i].ThirdParty;
            if (TP == 0) {
                TParty = '';
                VName = response[i].VendorName;
            }
            else {
                TParty = response[i].VendorName;
                VName = '';
            }


            //===================================
            str += '<tr>';
            str += '<td></td>';
            str += '<td>' + response[i].PODate + '</td>';
            str += '<td><a href="javascript:editPO(' + response[i].POID + ');" style="color: #337ab7; ">' + response[i].PONumber + '</a></td>';
            str += '<td>' + response[i].COCode + '</td>';
            str += '<td>' + response[i].status + '</td>';
            // str += '<td>' + response[i].Payby + '</td>';
            str += '<td>' + response[i].tblVendorName + '</td>';
            str += '<td>' + TParty + '</td>';
            if (response[i].status == 'Closed') {

                str += '<td><input type="checkBox" id="chk_' + response[i].POID + '" onclick="javascript:funCloseOpen(' + response[i].POID + ');" checked/></td>';
            }
            else {
                str += '<td><input type="checkBox" id="chk_' + response[i].POID + '" onclick="javascript:funCloseOpen(' + response[i].POID + ');"/></td>';
            }
            str += '<td>' + response[i].BatchNumber + '</td>';
            var strAmount = (response[i].OriginalAmount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            if (strAmount == 'null') {
                strAmount = '$ ' + 0.00;
            }
            else {
                strAmount = '$ ' + strAmount;
            }
            str += '<td>' + strAmount + '</td>';
            // str += '<td><a href="javascript:FillDetail(' + response[i].POID + ');" style="color: #337ab7;">Transactions</a></td>';
            str += '</tr>';
        }
        $('#tbodyPO').html(str);
    }
    else {
        str += '<tr><td style="text-align:center;" colspan=8>No Purchase Order Found.</td></tr>';
        $('#tbodyPO').append(str);
    }

    if (parseInt(PageCnt) < 500) {
        var PgNo = (PageCnt / 28);
    }
    else if (parseInt(PageCnt) < 800) {
        var PgNo = (PageCnt / 24);
    }

    var substr = PgNo.toString().split('.');
    showpg = parseInt(substr[0]);

    var table = $('#TblPO').DataTable({
        "dom": 'C<"clear"><Rrt<"positionFixed"pli>>',
        "iDisplayLength": showpg,
        responsive: {
            details: {
                //  type: 'column',
            }
        },
        columnDefs: [{

            className: 'control',
            orderable: false,
            targets: 0,

        }],
        order: [1, 'asc']
    });
    $(".datepicker").datepicker();




    $('#TblPO tfoot th').each(function () {
        var title = $('#TblPO thead th').eq($(this).index()).text();

        if (title == 'Status') {
            $(this).html('<select><option value="">All</option><option value="Open">Open</option><option value="Close">Close</option><option value="Partial">Partial</option></select>');
        }
        else {
            $(this).html('<input type="text" placeholder=" ' + title + '" />');
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
    $('#TblPO').parent().css('overflow', 'scroll');
    $('#TblPO').parent().css('max-height', ($(window).height() - 180) + 'px');
    $('#TblPO').parent().css('min-height', ($(window).height() - 180) + 'px');
    $('#TblPO').parent().css('height', ($(window).height() - 180) + 'px');
    // $('#TblPO_wrapper').attr('style', 'height:' + PageCnt + 'px;');
}
$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});

function FillDetail(POID) {
    PurchaseOID = POID;
    GetSegmentsDetails();
    showDiv('transactionsPopup');
}


//================================PrintPDfr==================//


function FunPOListPDf()
{
    $.ajax({
        url: APIUrlPOListPDF + '?ProdId=' + localStorage.ProdId+'&ProName=' + localStorage.ProductionName,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { POListPDFSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function ShowMSG(error) {
    console.log(error);
}
function POListPDFSucess(response) {
    var fileName = "ReportPO.pdf";
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










