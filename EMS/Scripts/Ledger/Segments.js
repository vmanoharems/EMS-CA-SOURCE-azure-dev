var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";


$(document).ready(function () {
    GetSegmentList();
});


function GetSegmentList() {
    PassDBName();
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId+'&Mode='+1,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
       
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { GetSegmentListSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}

function GetSegmentListSucess(response) {
    var strHtml = '';
    for (var i = 0; i < response.length; i++) {
        strHtml += '<tr>';
        strHtml += '<td>' + response[i].SegmentCode + '</td>';
        strHtml += '<td>' + response[i].SegmentName + '</td>';
        strHtml += '<td>' + response[i].CodeLength + '</td>';
        strHtml += '<td>' + response[i].Classification + '</td>';
        strHtml += '<td>' + response[i].SegmentReportDescription + '</td>';

        strHtml += '</tr>';
    }

    $('#tblSegmentTBody').html(strHtml);
}

//------------------------------------------- Error MSG

function ShowMSG(error) {
    console.log(error);
}