localStorage.ActiveInvoiceTab = '/AccountPayable/PostInvoice';

var APIUrlGetInvoiceList = HOST + "/api/POInvoice/APInvoicesPaidInvoicesList";

var showpg = 0;
var PageCnt;
var oPaidInvoiceId = [];

$(document).ready(function () {

    $('#UlAccountPayable li').removeClass('active');
    $('#LiInvoice').addClass('active');
    GetInvoiceList();
    localStorage.ActiveInvoiceTab = location.pathname;
})


function GetInvoiceList() {
    $.ajax({
        url: APIUrlGetInvoiceList + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetInvoiceListSucess(response);
    })
    .fail(function (error) {
        console.log(error);
    })
}

function GetInvoiceListSucess(response) {
    oPaidInvoiceId = [];
    console.log(response);
    var strhtml = '';
    var Tcount = response.length;

    for (var i = 0; i < Tcount; i++) {
        strhtml += '<tr>';
        strhtml += '<td></td>';
        //strhtml += '<td><input type="checkBox" id="chk_' + response[i].Invoiceid + '" class="clsPosting" name="' + response[i].Invoiceid + '"/></td>';
        strhtml += '<td>' + dateFormat(response[i].InvoiceDate, 'mm-dd-yyyy') + '</td>';
        strhtml += '<td><a href="#" name="' + response[i].InvoiceID + '" style="color: #337ab7;" onclick="funGetInvoiceDetail(' + response[i].InvoiceID + ');">' + response[i].InvoiceNumber + '</a></td>';
        if (response[i].PaymentId == '0') {
            strhtml += '<td></td>';
        } else {
            strhtml += '<td>' + response[i].PaymentCheckNumber + '</td>';
        }

        let BRStatus = JSON.parse(response[i].BRStatus);
        let CheckStatus = (!BRStatus) ? response[i].CheckStatus : (BRStatus.Status + ': ' + BRStatus.StatementDate);

        strhtml += '<td>' + dateFormat(response[i].PaymentCheckDate, 'mm-dd-yyyy') + '</td>';
        strhtml += '<td>' + response[i].PayBy + '</td>';
        strhtml += '<td>' + CheckStatus + '</td>';
        strhtml += '<td>' + response[i].InvoiceTransactionNumber + '</td>';
        strhtml += '<td>' + response[i].InvoiceCompanyCode + '</td>';
        strhtml += '<td>' + response[i].VendorName + '</td>';
        strhtml += '<td>' + response[i].InvoiceLines + '</td>';
        var strAmount = '$ ' + parseFloat(response[i].CurrentBalance + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        strhtml += '<td>' + strAmount + '</td>';
        strhtml += '<td>' + response[i].CurrencyDocument + '</td>';
        strhtml += '</tr>';

        oPaidInvoiceId.push(response[i].InvoiceID);
    }

    localStorage.setItem("Invoices", JSON.stringify(oPaidInvoiceId));
    $('#TblPostedListTbody').html(strhtml);
    GetPostedTransactions();
    var heightt = $(window).height();
    heightt = heightt - 100;
    $('#DvTable').attr('style', 'height:' + heightt + 'px;');

    var oSearchVal = [];
    var table = $('#TblPosted').DataTable({
        //"iDisplayLength": showpg,
        paging: false,
        responsive: {
            details: {
                type: 'column',
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: false,
            targets: 0,

        }],
        scrollX: false,
        stateSave: true,
        stateSaveCallback: function (settings, data) {
            localStorage.setItem('DataTables_PaidInv' + settings.sInstance, JSON.stringify(data))
        },
        stateLoadCallback: function (settings) {
            if (JSON.parse(localStorage.getItem('DataTables_PaidInv' + settings.sInstance)) != null) {
                var searchval = JSON.parse(localStorage.getItem('DataTables_PaidInv' + settings.sInstance)).columns;
                $.each(searchval, function (index, value) {
                    oSearchVal.push(value.search.search);
                });
            }
            return JSON.parse(localStorage.getItem('DataTables_PaidInv' + settings.sInstance))
        },
    }).on('click', 'th', function () {
        GetPostedTransactions();
    });


    $('#TblPosted tfoot th').each(function () {
        var title = $('#TblPosted thead th').eq($(this).index()).text();
        var val = ""; if (oSearchVal[$(this).index()] != undefined) { val = oSearchVal[$(this).index()]; }
        $(this).html('<input type="text"  style="width:100px !important;" placeholder="' + title + '" value="' + val + '"/>');

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

    $('#TblPosted tfoot tr').insertAfter($('#TblPosted thead tr'));

    //$('#TblPosted').parent().css('overflow', 'scroll');
    //$('#TblPosted').parent().css('max-height', ($(window).height() - 180) + 'px');
    //$('#TblPosted').parent().css('min-height', ($(window).height() - 180) + 'px');
    //$('#TblPosted').parent().css('height', ($(window).height() - 180) + 'px');
    //$('#TblPosted_wrapper').attr('style', 'height:' + PageCnt + 'px;');

    $(`#TblPosted`).stickyTableHeaders('destroy'); // destroy the old sticky headers
    $('#DvTable').height((window.innerHeight - 150)); // Space used by JE header
    $('#DvTable').css('overflow', 'overlay'); // scroll
    $('#TblPosted').stickyTableHeaders({ scrollableArea: $('#DvTable') });
    $('#DvTable').prop('stickyTableHeaders', true);
}

$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});

function funGetInvoiceDetail(value) {
    localStorage.EditInvoiceId = value;
    window.location = '/AccountPayable/AtlasInvoice';
    //window.location.replace(HOST + "/AccountPayable/EditInvoice");
}

function GetPostedTransactions() {
    oPaidInvoiceId = [];

    var table = $('#TblPosted')
    table.find('tr').each(function (i, el) {
        var id = $(this).find("td").find('a').attr("name");
        if (id != undefined) {
            oPaidInvoiceId.push(id);
        }
    });

    localStorage.setItem("Invoices", JSON.stringify(oPaidInvoiceId));
}

//========================= Alt+N
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        localStorage.EditInvoiceId = 0;
        window.location = '/AccountPayable/AtlasInvoice';
        //window.location.replace(HOST + "/AccountPayable/AddInvoice");
    }


});