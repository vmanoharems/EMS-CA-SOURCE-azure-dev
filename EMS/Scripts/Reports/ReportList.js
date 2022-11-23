



$(document).ready(function ()
{
   // alert('hi Vivek');
});

function OnChangeReport()
{
    var selectefItem = $("#txtReportGroupList").val();
    if (selectefItem == 'JE Audit')
    {
        $('#JEAuditdiv').attr('Style', 'Display:none');
      //  $('#JEAuditdiv').attr('Style', 'Display:block');
    }
    else
    {
        $('#JEAuditdiv').attr('Style', 'Display:none');
       
    }
    if (selectefItem == 'AP Invoice Edit/Audit') {
        window.location.replace(HOST + "/Reports/APInvioceEdit");
       // $('#JEAuditdiv').attr('Style', 'Display:none');
        //  $('#JEAuditdiv').attr('Style', 'Display:block');
    }
}