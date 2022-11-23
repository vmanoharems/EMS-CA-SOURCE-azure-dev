var APIUrlTimeZone = HOST + "/api/CompanySettings/spTimeZone";


$(document).ready(function () {
   
    $('.treeview').removeClass('active');
    $('#LiTimeZone').addClass('active');
    TimeZone('', '', 1);

})
//==================================== Bank List
function TimeZone(TimeZone, TimeDifference, Mode) {
    $.ajax({
        url: APIUrlTimeZone + '?ProdID=' + localStorage.AdminProdId + '&TimeZone=' + encodeURIComponent(TimeZone) + '&TimeDifference=' + encodeURIComponent(TimeDifference) + '&Mode=' + Mode,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        TimeZoneSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    });

}

function funSaveTimeZone()
{
    var TimeZone1 = $('#ddlTimeZone option:selected').text();
    var TimeDifference = $('#ddlTimeZone option:selected').val();

    TimeZone(TimeZone1, TimeDifference, 2);
    alert('Time Zone Updated Sucessfully.');
}

function TimeZoneSucess(response) {
    if (response.length > 0) {
        $('#ddlTimeZone').val(response[0].TimeDifference);
    }
    else {
        $('#ddlTimeZone').val('07:00');
    }
    
}
