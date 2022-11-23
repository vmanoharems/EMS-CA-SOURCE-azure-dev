var APIUrlGetUnpaidInvoiceList = HOST + "/api/POInvoice/APInvoicesOpenInvoicesList";


var showpg = 0;
var PageCnt;
var oPostedUnpaidInvoiceId = [];

$(document).ready(function () {

    $('#UlAccountPayable li').removeClass('active');
    $('#LiInvoice').addClass('active');
    GetInvoiceList();
})


function GetInvoiceList() {
    $.ajax({
        url: APIUrlGetUnpaidInvoiceList + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetInvoiceListSucess(response); })
.fail(function (error)
{ console.log(error); })
}

function GetInvoiceListSucess(response) {
    oPostedUnpaidInvoiceId = [];
    var strhtml = '';
    var Tcount = response.length;

    for (var i = 0; i < Tcount; i++) {
        strhtml += '<tr>';
        strhtml += '<td></td>';

        //strhtml += '<td><input type="checkBox" id="chk_' + response[i].Invoiceid + '" class="clsPosting" name="' + response[i].Invoiceid + '"/></td>';
        strhtml += '<td>' + dateFormat(response[i].InvoiceDate, "m-d-yyyy") + '</td>';
        strhtml += '<td><a href="#" name="' + response[i].InvoiceID + '" style="color: #337ab7;" onclick="funGetInvoiceDetail(' + response[i].InvoiceID + ');">' + response[i].InvoiceNumber + '</a></td>';
        strhtml += '<td>' + response[i].InvoiceTransactionNumber + '</td>';
        strhtml += '<td>' + response[i].InvoiceCompanyCode + '</td>';
        strhtml += '<td>' + response[i].BatchNumber + '</td>';
        strhtml += '<td>' + response[i].InvoiceVendorName + '</td>';
        strhtml += '<td>' + response[i].InvoiceLines + '</td>';
        var strAmount = '$ ' + parseFloat(response[i].CurrentBalance + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        strhtml += '<td>' + strAmount + '</td>';
        strhtml += '<td>' + response[i].CurrencyDocument + '</td>';
        strhtml += '</tr>';

        oPostedUnpaidInvoiceId.push(response[i].InvoiceID);
    }
    localStorage.setItem("Invoices", JSON.stringify(oPostedUnpaidInvoiceId));
    $('#TblPostedListTbody').html(strhtml);

    var heightt = $(window).height();
    heightt = heightt - 100;
    $('#DvTable').attr('style', 'height:' + heightt + 'px;');

    GetUnpaidTransactions();
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
        stateSave: true,
        stateSaveCallback: function (settings, data) {
            localStorage.setItem('DataTables_UnpaidInv' + settings.sInstance, JSON.stringify(data))
        },
        stateLoadCallback: function (settings) {
            if (JSON.parse(localStorage.getItem('DataTables_UnpaidInv' + settings.sInstance)) !== null) {
                var searchval = JSON.parse(localStorage.getItem('DataTables_UnpaidInv' + settings.sInstance)).columns;
                $.each(searchval, function (index, value) {
                    oSearchVal.push(value.search.search);
                });
            }
            return JSON.parse(localStorage.getItem('DataTables_UnpaidInv' + settings.sInstance))
        },
    }).on('click', 'th', function () {
        GetUnpaidTransactions();
    });

    $('#TblPosted tfoot th').each(function () {
        var title = $('#TblPosted thead th').eq($(this).index()).text();
        var val = ""; if (oSearchVal[$(this).index()] !== undefined) { val = oSearchVal[$(this).index()]; }
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
    localStorage.ActiveInvoiceTab = location.pathname;
});

function funGetInvoiceDetail(value) {
    localStorage.EditInvoiceId = value;
    localStorage.ActiveInvoiceTab = '/AccountPayable/PostedUnpaidInvoices'
    window.location = '/AccountPayable/AtlasInvoice';
    //window.location.replace(HOST + "/AccountPayable/EditInvoice");
}
function GetUnpaidTransactions() {
    oPostedUnpaidInvoiceId = [];

    var table = $('#TblPosted')
    table.find('tr').each(function (i, el) {
        var id = $(this).find("td").find('a').attr("name");
        if (id !== undefined) {
            oPostedUnpaidInvoiceId.push(id);
        }
    });

    localStorage.setItem("Invoices", JSON.stringify(oPostedUnpaidInvoiceId));
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