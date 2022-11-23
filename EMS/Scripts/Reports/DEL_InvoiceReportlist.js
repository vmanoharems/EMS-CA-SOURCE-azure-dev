



$(document).ready(function ()
{
    $('#UlListReports li').removeClass('active');
    $('#LiAPInvoiceReports').addClass('active');
});

function FunEditInvoice()
{
    var selectefItem = $("#txtReportGroupList").val();
    if (selectefItem == 'AP Invoice Edit/Audit') {
        window.location.replace(HOST + "/Reports/APInvioceEdit");
       // $('#JEAuditdiv').attr('Style', 'Display:none');
        //  $('#JEAuditdiv').attr('Style', 'Display:block');
    }
}