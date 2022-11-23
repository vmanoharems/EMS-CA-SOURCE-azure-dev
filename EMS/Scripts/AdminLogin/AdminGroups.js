var APIUrlSaveGroups = HOST + "/api/CompanySettings/InsertUpdateGroupCompanyAccess";
var APIUrlGetGroupList = HOST + "/api/CompanySettings/GetGroupDetailsBypropId";
var APIUrlGetModuleList = HOST + "/api/UserProfile/GetModuleTreeforgroup";
var APIUrlGetCompanyCode = HOST + "/api/CompanySettings/GetCompnayCodeByProdId";
var APIUrlSavePermisstion = HOST + "/api/CompanySettings/InsertUpdatePermission";
var APIUrlCheckGroupNameDuplicacy = HOST + "/api/CompanySettings/CheckGroupName";
var APIUrlComCodeId = HOST + "/api/CompanySettings/GetCompanyIdByGroupId";
//var APIUrlCheckGroupNameDuplicacy = HOST + "/api/CompanySettings/CheckGroupName";

var pubGroupId = 0;
var PubGrouName = [];
var DefaultValue = 0;
var strCompanyCode = '';
var strCompanyCodeArr = [];
$(document).ready(function () {
    $('#ULAdminNav li').removeClass('active');
    $('#LiPermissions').addClass('active');

    funGetGropsList();
   // funModuleList();
    funGetCompanyCode();
    funCompanyCodeDetails();
   
});


//------------------------------------------------- Get Company Code
function funGetCompanyCode() {
    $.ajax({
        url: APIUrlGetCompanyCode + '?ProdId=' + localStorage.AdminProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { GetCompanyCodeSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function GetCompanyCodeSucess(response) {
  
    var TCount = response.length;
    for (var i = 0; i < TCount; i++) {
        $('#UlGroup').append('<li ><input type="checkBox" id="chk_' + response[i].CompanyID + '" class="clsMultipleDropDown" onclick="javascript:funCheckBoxChange( ' + response[i].CompanyID + ',\'' + response[i].CompanyCode + '\');" /><span id="spn_' + response[i].CompanyID + '" style="    margin-left: 10px;" onclick="javascript:funCheckBox( ' + response[i].CompanyID + ',\'' + response[i].CompanyCode + '\');" >' + response[i].CompanyCode + '</span></li>');
    }
}
//------------------------------------------------- Get companyId by GroupId
function funCompanyCodeDetails() {
    $.ajax({
        url: APIUrlComCodeId + '?GroupId=' + pubGroupId,
        cache: false,
                beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { CompanyIdSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function CompanyIdSucess(response) {
    $('#txtGroupDropDown').val('');
    var clsCompany = $('.clsMultipleDropDown');
    for(var i = 0; i < clsCompany.length; i++)
    {
        var strId = clsCompany[i].id;
        $('#' +strId).prop('checked', false) ;
        }

    strCompanyCode ='';
    strCompanyCodeArr =[];
    var Tcount = response.length;
    for(var i = 0; i < Tcount; i++) {
        strCompanyId = response[i].CompanyID;
        // $("#ms-opt-" + strCompanyId).prop('checked', true);
        $('#chk_' +response[i].CompanyID).prop('checked', true);
        strCompanyCodeArr.push(response[i].CompanyCode);
        if (Tcount -1 == i) {
            strCompanyCode += response[i].CompanyCode;
            } else {
            strCompanyCode += response[i].CompanyCode + ',';
            }
        }
    $('#txtGroupDropDown').val(strCompanyCode);
}

//----------------------------------------------- Module List
function funModuleList() {
    $.ajax({
        url: APIUrlGetModuleList + '?GroupId=' + pubGroupId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { ModuleListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function ModuleListSucess(response) {
    CreateTableModule(response);
    var tLength = response.length;
    var data = response;
    if (tLength > 0) {
        var Headers = Object.keys(data[0]);
        strSrcFields = [];
        var arrH = Headers.length;
        for (iH = 0; iH < arrH; iH++) {
            strSrcFields.push(Headers[iH]);
        }
        strSrcOrgFields = strSrcFields;
    }
    var lastIdx = null;

    $('#TblModule tbody tr').click(function (e) {
        if ($(this).hasClass("row_selected")) {
            $(this).removeClass("row_selected");
        }
        else {
            //oTable.$('tr.row_selected').removeClass('row_selected');
            $(this).addClass("row_selected");
        }
    });

    $('#TblModule').parent().css('overflow', 'scroll');
    $('#TblModule').parent().css('max-height', ($(window).height() - 250) + 'px');
    $('#TblModule').parent().css('min-height', ($(window).height() - 250) + 'px');
    $('#TblModule').parent().css('height', ($(window).height() - 245) + 'px');

    formmodified = 0;
}
function CreateTableModule(response) {
    var strHtml = '';
    $('#TblModuleTBody').html('');
    var TCount = response.length;
    for (var i = 0; i < TCount; i++) {
        var Title = response[i].Title;
        var ModuleName = response[i].ModuleName;
        var ModuleLevel = response[i].ModuleLevel;
        var Children = response[i].ChildCount;
        var ParentId = response[i].PARENT;
        var MdouleId = response[i].CHILD;
        var hierarchy = response[i].hierarchy;
        var strhierarchy = hierarchy.split('>');


        if (ParentId == 0) {
            strHtml += '<tr id="Tr_" name="">';
            if (Children != 0) {
                strHtml += '<td><a href="javascript:ShowHideTable(' + MdouleId + ');" ><span id="spn' + MdouleId + '" class="RedColor RightIcon ParentCls"></span></a></td>';
            }
            else {
                strHtml += '<td></td>';

            }
            strHtml += '<td><span style=";margin-left: 8px;">' + ModuleName + '</span>  </td>';
            strHtml += '<td><select id="ddlMId_' + MdouleId + '" onchange="javascript:SavePermisstion(' + MdouleId + ',' + ParentId + ');"><option value="No Access">No Access</option><option value="FullControl">Full Control</option></select></td>';
        }
        else {
            if (ParentId != 0 && Children == 0) {
                strHtml += '<tr id="Tr_' + ParentId + '" class="Tr_' + ParentId + '  Trr_' + strhierarchy[0] + ' "  style="display:none;" >';
                strHtml += '<td></td>';
                strHtml += '<td><span style="float: left;margin-left: 27px;     font-size: 15px;">' + ModuleName + '<span>  </td>';
                strHtml += '<td><select id="ddlMId_' + MdouleId + '" class="cls_' + ParentId + '" onchange="javascript:SavePermisstion(' + MdouleId + ',' + ParentId + ');"><option value="No Access">No Access</option><option value="FullControl">Full Control</option></select></td>';
            }
            else if (ParentId != 0 && Children != 0) {
                strHtml += '<tr id="Tr_' + ParentId + '" class="Tr_' + ParentId + '" style="display:none;">';
                strHtml += '<td><a href="javascript:ShowHideTable(' + MdouleId + ');" ><span id="spn' + MdouleId + '" class="RedColor RightIcon"></span></a></td>';
                strHtml += '<td><span style=";margin-left: 8px;">' + ModuleName + '</span>  </td>';
                strHtml += '<td><select id="ddlMId_' + MdouleId + '" class="cls_' + ParentId + '" onchange="javascript:SavePermisstion(' + MdouleId + ',' + ParentId + ');"><option value="No Access">No Access</option><option value="FullControl">Full Control</option></select></td>';
            }
        }
        strHtml += '</tr>';
    }
    $('#TblModuleTBody').html(strHtml);
    for (var i = 0; i < TCount; i++) {

        var Access = response[i].Access;
        var MdouleId = response[i].CHILD;
        $('#ddlMId_' + MdouleId).val(Access);
    }
}
function ShowHideTable(value) {
    if ($('#Tr_' + value).css('display') == 'none') {
        $('.Tr_' + value).removeAttr('style', 'display:none');
        $('#spn_' + value).removeClass();
        $('#spn_' + value).addClass('fa fa-caret-down');
    }
    else {
        // $('.Tr_' + value).add('style', 'display:none');
        $('.Tr_' + value).attr("style", 'display:none');
        $('#spn_' + value).removeClass();
        $('#spn_' + value).addClass('fa fa-caret-right');
    }
}
function SavePermisstion(value, parentId) {
    var strDefault = 0;
    var StrArr = [];
    $('#ddlMId_' + parentId).val('ReadOnly');

    var strAccessClass = $('#ddlMId_' + value).val();
    strDefault++;
    if (parentId != 0) {
        var strAccess = $('#ddlMId_' + parentId).val();
        var ObjPermission = {
            GroupID: pubGroupId, ModuleID: parentId, Access: strAccess, ProdID: localStorage.AdminProdId, CreatedBy: localStorage.AdimUserId
        }
        StrArr.push(ObjPermission);

    }
    if (pubGroupId != 0) {
        var strAccess = $('#ddlMId_' + value).val();
        var ObjPermission = {
            GroupID: pubGroupId, ModuleID: value, Access: strAccess, ProdID: localStorage.AdminProdId, CreatedBy: localStorage.AdimUserId
        }
        StrArr.push(ObjPermission);

        var strclass = $('.cls_' + value);
        var strlen = strclass.length;
        for (var i = 0; i < strlen; i++) {
            var strId = strclass[i].id;
            var strSplit = strId.split('_');
            var ObjPermission = {
                GroupID: pubGroupId, ModuleID: strSplit[1], Access: strAccessClass, ProdID: localStorage.AdminProdId, CreatedBy: localStorage.AdimUserId
            }
            StrArr.push(ObjPermission);
        }

        $.ajax({
            url: APIUrlSavePermisstion,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(StrArr),
        })
            .done(function (response)
            { SavePermisstionSucess(response); })
            .fail(function (error)
            { ShowMSG(error); })
        var Msg = 'Group Permission changed !!';
        $('#DvSuccess').show();
        setTimeout(function () {
            $("#DvSuccess").hide('blind', {}, 500)
        }, 2000);
    } else {
        ShowMsgBox('showMSG', ' Please Save Group First !!', '', '');
    }
}
function SavePermisstionSucess(response) {
    formmodified = 0;
    funModuleList();
}
//------------------------------------------------------- Group Name LI
function funGetGropsList() {
    $.ajax({
        url: APIUrlGetGroupList + '?PropId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })

      .done(function (response)
      { GetGroupListSucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
}
function GetGroupListSucess(response) {
    PubGrouName = [];
    $('#UlGroupName').html('');
    var strHtml = '';
    var Tcount = response.length;
    for (var i = 0; i < Tcount; i++) {
        //   PubGrouName.push(response[i].GroupName);
        var GroupName = response[i].GroupName;
        var GroupId = response[i].GroupId;
        var CheckBox = response[i].Status;
        if (i == 0) {
            $('#ddlGroupList').html('<option value=' + GroupId + ' name="' + GroupId + '_' + "'" + GroupName + "'" + '_' + "'" + CheckBox + "'" + '" onchange="javascript:funGetGroupDetails(' + GroupId + '_' + "'" + GroupName + "'" + '_' + "'" + CheckBox + "'" + ');">' + GroupName + '</option>');
            pubGroupId = GroupId;
            $('#txtGroupName').val(GroupName);
            $('#LiNewGroup').text(GroupName);

            $('#ChkActive').prop('checked', CheckBox);
        }
        else {
            $('#ddlGroupList').append('<option value=' + GroupId + ' name="' + GroupId + '_' + "'" + GroupName + "'" + '_' + "'" + CheckBox + "'" + '" onchange="javascript:funGetGroupDetails(' + GroupId + ',' + "'" + GroupName + "'" + ',' + "'" + CheckBox + "'" + ');">' + GroupName + '</option>');
        }

        var ObjGroup = {
            strGroupName: GroupName,
            strGroupId: GroupId,
            strCheckBox: CheckBox
        }
        PubGrouName.push(ObjGroup);

        //if (i == 0) {
        //    strHtml += '<li class="active" id="liGroupName_' + GroupId + '" onclick="javascript:funGetGroupDetails(' + GroupId + ',' + "'" + GroupName + "'" + ',' + "'" + CheckBox + "'" + ');"><a href="#">' + GroupName + '</a></li>';
        //    pubGroupId = GroupId;
        //    $('#txtGroupName').val(GroupName);
        //    $('#ChkActive').prop('checked', CheckBox);
        //}
        //else {
        //    strHtml += '<li id="liGroupName_' + GroupId + '" onclick="javascript:funGetGroupDetails(' + GroupId + ',' + "'" + GroupName + "'" + ',' + "'" + CheckBox + "'" + ');"><a href="#">' + GroupName + '</a></li>';
        //}
    }
    // strHtml += '<li id="liGroupName_0" onclick="javascript:funAddGroup();"><a href="#">+ Add Grouop</a></li>';
    // $('#UlGroupName').html(strHtml);
    //alert(PubGrouName.length);
    funModuleList();
    funCompanyCodeDetails();
}
function funCancelGroup() {
    $('#licancelGroup').hide();
    $('#ddlGroupList').show();

    pubGroupId = $('#ddlGroupList').val();
    var GName = $("#ddlGroupList option:selected").text();
    $('#liAddGroup').attr('style', 'border-bottom: 30px solid #337ab7; !important;');
    $('#txtGroupName').val(GName);
    var strName = $('#ddlGroupList').find('option:selected').attr("name");
    var FstrName = strName.split("_");
    if (FstrName[2] == "'False'") {
        $('#ChkActive').prop('checked', 0);
    } else {
        $('#ChkActive').prop('checked', 1);

    }

    funModuleList();
    funGetCompanyCode();
    funCompanyCodeDetails();
}

$("#ddlGroupList").change(function () {
    var strValue = $("#ddlGroupList").val();
    var Tcount = PubGrouName.length;
    for (var i = 0; i < Tcount; i++) {
        if (strValue == PubGrouName[i].strGroupId) {
            funGetGroupDetails(PubGrouName[i].strGroupId, PubGrouName[i].strGroupName, PubGrouName[i].strCheckBox);
        }
    }
});

function funAddGroup() {

    $('#txtGroupName').focus();
    $('#ChkActive').prop('checked', true);
    $('#txtGroupName').val('');
    //  $('#UlGroupName li').removeClass();
    $("#liAddGroup").attr('style', 'border-bottom:30px solid #4cbf63;');
    $('#LiNewGroup').text('Add New Group');
    $('#licancelGroup').show();
    $('#ddlGroupList').attr('style', 'visibility: hidden;');
    $('#AbtnAddGroup').attr('style', 'background-color: #4CBF63;');

    $(".multiselect_option").prop('checked', false);

    $('#btnSaveGroup').show();
    $('#btnCancelGroup').show();



    pubGroupId = 0;
    // new 

    /// Module Table 
    $.ajax({
        url: APIUrlGetModuleList + '?GroupId=' + 0,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { ModuleListSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function funGetGroupDetails(GroupId, GroupName, CheckBox) {
    pubGroupId = GroupId;
    var ChkValue = 0;
    funModuleList();
    //$('#UlGroupName li').removeClass();
    //$('#liGroupName_' + GroupId).addClass('active');

    $('#txtGroupName').val(GroupName);
    $('#LiNewGroup').text(GroupName);

    //$('#ChkActive').prop('checked', false);
    if (CheckBox == 'False') {
        ChkValue = 0;
    }
    else {
        ChkValue = 1;
    }

    $('#ChkActive').prop('checked', ChkValue);
    //  funModuleList();
    funCompanyCodeDetails();

}

$('#prv-testimonial').on('click', function () {
    var counli = $('#UlGroupName li');
    if (counli.length > 1) {
        var $last = $('#UlGroupName li:last');
        $last.remove().css({ 'margin-left': '-60px' });
        $('#UlGroupName li:first').before($last);
        $last.animate({ 'margin-left': '0px' }, 100);
    }
});
$('#nxt-testimonial').on('click', function () {
    var counli = $('#UlGroupName li');
    if (counli.length > 1) {
        var $first = $('#UlGroupName li:first');
        $first.animate({ 'margin-left': '-60px' }, 100, function () {
            $first.remove().css({ 'margin-left': '0px' });
            $('#UlGroupName li:last').after($first);
        });
    }
});

//-------------------------------------------------- Save Group Details

$('#btnSaveGroup').click(function () {
    // alert('test');
    var isvalid = "";
    isvalid += CheckRequired($("#txtGroupName"));
    {
         var strCompanyId = $('.clsMultipleDropDown');
        var strCompany = '';
        for (var i = 0; i < strCompanyId.length; i++) {
            if (strCompanyId[i].checked == true) {
                var StrId = strCompanyId[i].id;
                var FStrId = StrId.split('_');
                strCompany += FStrId[1]+ ',';
                }
            }
        strCompany = strCompany.substring(0, strCompany.length - 1);

        var GroupName = $('#txtGroupName').val().trim();
        var GroupLength = PubGrouName.length;
        //for(var i=0;i<GroupLength;i++)
        //{
        //    if (GroupName == PubGrouName[i])
        //    {
        //        $('#txtGroupName').val('');
        //        alert('Group Name Already Exists');
        //        DefaultValue = 1;
        //    }
        //}

        CheckGroupNameDuplicacy();

        if (DefaultValue == 0) {
            if (GroupName != '') {
                var CompanyGroup = {
                    GroupId: pubGroupId,
                    Groupname: $('#txtGroupName').val().trim(),
                    ProdId: localStorage.AdminProdId,
                    Status: $('#ChkActive').prop('checked'),
                    CreatedBy: localStorage.UserId,
                }

                var CompanyGroupAccess = {
                    GroupId: pubGroupId,
                    Company: strCompany,
                    ProdId: localStorage.AdminProdId,
                    CreatedBy: localStorage.UserId,
                    ObjGroup: CompanyGroup
                }

                $.ajax({
                    url: APIUrlSaveGroups,
                    cache: false,
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
                    },
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(CompanyGroupAccess),
                })
               .done(function (response)
               { SaveGroupsSucess(response); })
               .fail(function (error)
               { ShowMSG(error); })
            }
            else {
                $('#txtGroupName').focus();
            }
        }
    }
})
function SaveGroupsSucess(response) {
    var Msg = 'Group Saved Sucessfully !!';

    ShowMsgBox('showMSG', Msg, '', '');
    //   alert('Group Saved');
    // funGetGropsList();
    location.reload(true);
}
function CheckGroupNameDuplicacy() {
   
    $.ajax({
        url: APIUrlCheckGroupNameDuplicacy + '?ProdId=' + localStorage.AdminProdId + '&GroupName=' + $('#txtGroupName').val().trim() + '&GroupId=' + pubGroupId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        //  data: JSON.stringify(CompanyGroupAccess),
    })
       .done(function (response)
       { CheckGroupNameDuplicacySucess(response); })
       .fail(function (error)
       { ShowMSG(error); })
}
function CheckGroupNameDuplicacySucess(response) {
    if (response == 1) {
        DefaultValue = response;
        $('#txtGroupName').val('');
        ShowMsgBox('showMSG', 'There is already a Group with this Name.!!!!!!!', '', 'failuremsg');
    }
}
//--------------------------------------------- Error MSG
function ShowMSG(error) {
    console.log(error);
}


 function DvOpenClose() {

        //$("#singlechatpanel-1").is(':visible')

        if ($('#DvGroup').css('display') == 'block') {
            $('#DvGroup').hide();


        }
        else {
            $('#DvGroup').show();


        }
    }
    function funCheckBox(CId, CCode)
    {
        if ($('#chk_' + CId).prop('checked') == true) {
            $('#chk_' + CId).prop('checked', false);
        }
        else {

            $('#chk_' + CId).prop('checked', true);
        }
        funCheckBoxChange(CId, CCode);
    }
    function funCheckBoxChange(CId, CCode) {

      //  $('#chk_' + CId).prop('checked', true);
        var Rcount = 0;
        var ArrLength = strCompanyCodeArr.length;
        if ($('#chk_' + CId).prop('checked') == true) {                      //---------------------------- Add in Array
            for (var i = 0; i < strCompanyCodeArr.length; i++) {
                if (strCompanyCodeArr[i] == CCode) {
                    Rcount++;
                }
          
            }
            if (Rcount == 0) {
                strCompanyCodeArr.push(CCode);
            }
            //strCompanyCode = '';
            //if (ArrLength == strCompanyCodeArr.length - 1) {
            //    strCompanyCode += CCode;
            //} else {
            //    strCompanyCode += CCode + ',';
            //}
        }
        else {
            strCompanyCodeArr.splice($.inArray(CCode, strCompanyCodeArr), 1);  //-------------------- Remove in Array
        }

        //------------------------------------ Fill value in Text Box
        var FCount = strCompanyCodeArr.length;
        strCompanyCode = '';
        for (var i = 0; i < FCount; i++) {
            strCompanyCode += strCompanyCodeArr[i]+ ',';
        }
        strCompanyCode = strCompanyCode.substring(0, strCompanyCode.length - 1);
        $('#txtGroupDropDown').val(strCompanyCode);
    }
    $("#DvMultipleDDL").mouseleave(function () {
       
        $('#DvGroup').attr('style', 'display:none;');
    });


    $(document).ready(function () {
        formmodified = 0;
        $('form *').change(function () {
            formmodified = 1;
        });
        window.onbeforeunload = confirmExit;
        function confirmExit() {
            if (formmodified == 1) {
                return "Changes were made but not saved. Would you like to save changes? ";
            }
        }
        $("input[name='commit']").click(function () {
            formmodified = 0;
        });
    });



//=================CheckGroup-=================//

    //function CheckGroupNameDuplicacy() {
    //    alert('kkkk');
    // //    alert($('#txtGroupName').val().trim()+'  '+pubGroupId);
    //    $.ajax({
    //        url: APIUrlCheckGroupNameDuplicacy + '?ProdId=' + localStorage.ProdId + '&GroupName=' + $('#txtGroupName').val().trim() + '&GroupId=' + pubGroupId,
    //        cache: false,
    //        beforeSend: function (request) {
    //            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
    //        },
    //        type: 'POST',
    //        contentType: 'application/json; charset=utf-8',
    //        //  data: JSON.stringify(CompanyGroupAccess),
    //    })
    //       .done(function (response)
    //       { CheckGroupNameDuplicacySucess(response); })
    //       .fail(function (error)
    //       { ShowMSG(error); })
    //}
    //function CheckGroupNameDuplicacySucess(response) {
    //    if (response == 1) {
    //        DefaultValue = response;
    //        $('#txtGroupName').val('');
    //        ShowMsgBox('showMSG', 'There is already a Group with this Name.!!!!!!!', '', 'failuremsg');
    //    }
    //}