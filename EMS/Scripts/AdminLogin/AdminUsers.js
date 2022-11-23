
var APIUrlSaveGroups = HOST + "/api/CompanySettings/InsertUpdateGroups";
var APIUrlSaveName = HOST + "/api/CompanySettings/InsertUpdateName";
var APIUrlGetGroupList = HOST + "/api/CompanySettings/GetGroupDetailsBypropId";
var APIUrlGetUserList = HOST + "/api/CompanySettings/GetCAUserListByPropId";
var APIUrlstatusUpdate = HOST + "/api/CompanySettings/UpdateUserStatus";
//localStorage.pubUserId = 0;
$(document).ready(function () {
    $('#ULAdminNav li').removeClass('active');
    $('#LiPermissions').addClass('active');
    funGetUserList();
  
})

//------------------- User List
function funAddNewUser()
{
    // ~/Setting/Users

    localStorage.AdminpubUserId = 0;
    $(location).attr('href', 'AddUsers');
}
function funGetUserList()
{
    $.ajax({
        url: APIUrlGetUserList + '?PropId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { funGetUserListSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}

function funGetUserListSucess(response)
{
   
    CreateTable(response);

    $('#TblUser').DataTable({
         "iDisplayLength": 10,
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
        order: [1, 'asc']
    });
    ////$('#TblUser').parent().css('overflow', 'scroll');
    //$('#TblUser').parent().css('max-height', ($(window).height() - 242) + 'px');
    //$('#TblUser').parent().css('min-height', ($(window).height() - 242) + 'px');
    //$('#TblUser').parent().css('height', ($(window).height() - 220) + 'px');
    
}
function CreateTable(response) {

    var strHtml = '';
    var TCount = response.length;
    for (var i = 0; i < TCount; i++) {
        var Title = response[i].Title;
        var GroupName = response[i].GroupName;
        var UserId = response[i].UserID;
        var GroupId = response[i].GroupId;
        var Status = response[i].Status;
        var Name = response[i].Name;
        strHtml += '<tr><td></td>';
        strHtml += '<td><a href="#" onclick="javascript:funUserDetailsShow(' + UserId + ');" style="color: #337ab7;">' + Name + '</a>  - ' + Title + '</td>';
        strHtml += '<td>' + GroupName  + '</td>';
       // strHtml += '<td><a href="#" style="color: blue;">Edit</a></td>';
        strHtml += '<td><input type="checkbox" id="Chk' + UserId + '" value="' + Status + '" onclick="javascript:statusUpdate(' + UserId + ')";/> </td>';
        strHtml += '</tr>';
    }
    $('#TblUserBody').html(strHtml);
   
    for (var i = 0; i < TCount; i++) {
        var UserId = response[i].UserID;
        var Status = response[i].Status;
        $('#Chk' + UserId).prop('checked', Status);

    }
}
function ShowMSG(error)
{
    console.log(error);
}

function statusUpdate(Userid)
{
    $.ajax({
        url: APIUrlstatusUpdate + '?UserId=' + Userid + '&Status=' + $('#Chk' + Userid).prop('checked'),
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { funGetUserListSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}

//------------------------------------------------- Edit User

function funUserDetailsShow(Value)
{
    localStorage.AdminpubUserId = Value;
    $(location).attr('href', 'AddUsers');
}



