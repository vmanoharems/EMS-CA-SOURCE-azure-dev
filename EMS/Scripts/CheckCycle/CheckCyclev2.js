let AtlasCheckCycle = {

    URL_GETBANKINFO: "/api/CompanySettings/GetBankInfoDetails?ProdID=",
    URL_GETVENDORDETAILS: "/api/POInvoice/GetVendorAddPO?ProdID=",
    URL_GETUSERDETAILS: "/api/CompanySettings/GetUserDetailsByUserId?UserId=",
    URL_GETCHECKCYCLE: "/api/CheckCyclev2/GetCheckCycle",
    URL_GETCHECKNUMBER: "/api/POInvoice/GetCheckNumberForPayment",
    URL_PREVIEWPAYMENT: "/api/ReportAPI/ReportsPaymentPreview",
    REv2: new ReportEngine(),
    oVendorDetails: [],
    oStates: ["F", "P", "C", "D", "Z"],
    sTable: "#tblFilterList",
    sTbody: "#tblFilterListTBody",
    BankID: undefined
    , BankName: undefined
    , iTempGroupNumber: undefined
    , iNextCheckNumber: undefined
    , iNewCheckNumber: undefined
    , iTotalInvoices: 0
    , iTotalNotPaid: 0
    , iNumCheck: 0
    , iNumVendors: 0
    , iNumInvoices: 0
    , iNumNotPaidInvoices: 0
    , sAction: ""
    , iCheckCycleId: 0
    , iStartCheckNumber: undefined
    , iEndCheckNumber: undefined
    , oCheckCycleItems: []
    , stsClose: true
    , checkcount: 0
    , oChecItems:[]
    , RenderSegment: function () {

        SegmentJSON = AtlasUtilities.SegmentJSON(
        {
            "Company": {
                fillElement: '.FilterCompany'
            }
              , "Location": {
                  fillElement: '.FilterLocation'
                  , ElementGroupID: '.FilterLocationGroup'
                  , ElementGroupLabelID: '.FilterLocationLabel'
              }
              , "Episode": {
                  fillElement: '.FilterEpisode'
                  , ElementGroupID: '.FilterEpisodeGroup'
                  , ElementGroupLabelID: '.FilterEpisodeLabel'
              }
              , "Set": {
                  fillElement: '.FilterSet'
                  , ElementGroupID: '.FilterSetGroup'
                  , ElementGroupLabelID: '.FilterSetLabel'
              }
        });

        this.REv2.FormRender(SegmentJSON);
        SegmentJSON.Company.fillElement = ".FilterCompany";
        SegmentJSON.Company.Complete = undefined;
        SegmentJSON.Location.fillElement = ".FilterLocation";
        SegmentJSON.Location.ElementGroupID = ".FilterLocationGroup";
        SegmentJSON.Episode.fillElement = '.FilterEpisode';
        SegmentJSON.Episode.ElementGroupID = ".FilterEpisodeGroup";
        SegmentJSON.Episode.elementConfig.multiselectOptions = { nonSelectedText: 'Select' };
        SegmentJSON.Set.fillElement = '.FilterSet';
        SegmentJSON.Set.ElementGroupID = ".FilterSetGroup";
    },
    GetBankDetails: function () {
        AtlasCache.CacheORajax(
              {
                  'URL': this.URL_GETBANKINFO + localStorage.ProdId
                    , 'doneFunction': AtlasCheckCycle.GetBankDetailsSucess
                    , 'objFunctionParameters': {
                    }
              });
    },
    SetBank: function (BankName, BankID) {
        this.BankID = BankID;
        this.BankName = BankName;
        $('#txtBankName').data({
            'BankName': BankName
            , 'BankID': BankID

        }
        );
        $('#txtBankName').val(BankName);
    }
    , GetBankDetailsSucess: function (response) {
        if (response.length == 1) {
            this.SetBank(response[0].Bankname, response[0].BankId);
            //$('#txtBankName').val(response[0].Bankname);
            //$('#hdnBank').val(response[0].BankId);
        }

        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.BankId,
                label: m.Bankname,

            };
        });
        $(".SearchBank").autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {
                AtlasCheckCycle.SetBank(ui.item.label, ui.item.value)
                //$("#hdnBank").val(ui.item.value);
                //$('#txtBankName').val(ui.item.label);
                return false;
            },
            select: function (event, ui) {
                AtlasCheckCycle.SetBank(ui.item.label, ui.item.value)
                //$("#hdnBank").val(ui.item.value);
                //$('#txtBankName').val(ui.item.label);
                $("#btnSearch").removeAttr("disabled");
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                    $("#btnSearch").prop("disabled", true);
                }
                else {
                    $("#btnSearch").removeAttr("disabled");
                }
            }
        })
    },
    GetVendor: function () {
        AtlasCache.CacheORajax(
        {
            'URL': this.URL_GETVENDORDETAILS + localStorage.ProdId
                     , 'doneFunction': AtlasCheckCycle.GetVendorSucess
                     , 'objFunctionParameters': {
                     }
        });
    },
    GetVendorSucess: function (response) {

        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.VendorID,
                label: m.VendorName,
            };
        });
        oVendorDetails = array;
        $(".VendorCode").autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {
                $("#hdnVendorID").val(ui.item.value);
                $('#txtVendor').val(ui.item.label);
                $('#txtVendorFilter').val(ui.item.label);
                return false;
            },
            select: function (event, ui) {

                $("#hdnVendorID").val(ui.item.value);
                $('#txtVendor').val(ui.item.label);
                $('#txtVendorFilter').val(ui.item.label);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {

                }
            }
        });
    },
    CheckCycleSearch: function () {
        $("#divPaymentFilter").removeClass("atlas-hide");
        $("#divInvoiceList").removeClass("atlas-hide");
        $("#btnSearch").addClass("atlas-hide");
        $("#divFilters").addClass("atlas-hide");
        AtlasCheckCycle.GetNextCheckNumber();
        AtlasCheckCycle.GetCheckCycle();       
    },
    ConfirmCancel: function () {
        $("#dvCancelCR").dialog({
            modal: true,
            buttons: {
                "Yes": function () {
                    AtlasCheckCycle.GetCheckCycle("cancel");
                },
                "No": function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    SetGroup: function (vendorid, index) {

        var elechk = "#chk_" + vendorid + "_" + index;
        var eleFrom = "#txtchkgrp_" + index;
        var eleTo = "#spngrp_" + index;

        if ($(elechk).prop("checked") == true) {

            var prevGroup = $(eleTo).text();
            $(eleTo).text($(eleFrom).val());
            $(eleFrom).hide(); $(eleTo).show();     
        }
    },
    GetGroup: function (vendorid, index) {

        var elechk = "#chk_" + vendorid + "_" + index;
        var eleFrom = "#spngrp_" + index;
        var eleTo = "#txtchkgrp_" + index;

        if ($(elechk).prop("checked") == true) {

            $(eleTo).val($(eleFrom).text());
            $(eleFrom).hide(); $(eleTo).show();
            $(eleTo).focus();
            this.iTempGroupNumber = $(eleFrom).text();
        }
    },
    SetCheckNumber: function (index) {

        var eleFrom = "#txtCheckNum_" + index;
        var eleTo = "#spnChkNum_" + index;
 
        $(eleTo).text($(eleFrom).val());
        $(eleFrom).hide(); $(eleTo).show();
        $(subtotal).text($(eleFrom).val());


    },
    GetCheckNumber: function (index,vendorid) {

        var eleFrom = "#txtCheckNum_" + index;
        var eleTo = "#spnChkNum_" + index;
        var chk = "#chk_" + vendorid+"_"+index;

        if ($(chk).prop("checked") == true)
        {
            $(eleFrom).val($(eleTo).text());
            $(eleTo).hide(); $(eleFrom).show();
            $(eleFrom).focus();
        }              
    },
    CalculateAmount: function (vendorid, index) {

        var elechk = "#chk_" + vendorid + "_" + index;
        var elegroup = "#txtchkgrp_" + index;
        var elecheck = "#txtCheckNum_" + index;
        var eleAmount = "#lblAmount_" + index;
        var row = $("#tblFilterListTBody").find('tr').filter("[id='V_" + vendorid + "_" + index + "']");

        var amount = $(eleAmount).text().replace(",", "");           

            if ($(elechk).prop("checked") == true) {
                $(elegroup).val("0");
                this.SetCheckNumber(vendorid, index);
                $(row).attr("checkgroup", "0");

            } else {
                $(elegroup).val("-1");
                $(elecheck).val("-1");
                this.SetCheckNumber(vendorid, index);      
                $(row).attr("checkgroup", "-1");
            }

            
            this.CalculateTotal();
       
    },
    CalculateTotal: function () {

        var invCount = 0;

        var amount = $(".amount");
        var total = 0; var amttotal = 0; var vendorspaid = []; checksnum = []; AtlasCheckCycle.iNumVendors = 0; AtlasCheckCycle.iNumCheck = 0;

        $.each(amount, function (key, ele) {
            var subamount = $(ele).attr("amount").replace(",", "");
            var vendor = $(ele).closest("tr").attr("vendorid");
            var chk = "#chk_" + vendor + "_" + key;
            var checknum = "#txtCheckNum_"+ key;
            if ($(chk).prop("checked") == true) {
                
                if ($(checknum).val() != "-1")
                {
                    if ($.inArray($(checknum).val(), checksnum) == -1) {
                        AtlasCheckCycle.iNumCheck++;
                        checksnum.push($(checknum).val());
                    }
                }

                total = parseFloat(total) + parseFloat(subamount);
               
                if (subamount != "0.00") {
                    if ($.inArray(vendor, vendorspaid) == -1) {
                        AtlasCheckCycle.iNumVendors++;
                        vendorspaid.push(vendor);
                    }
                }
            }
        });

        $.each(amount, function (key, ele) {
            var amt = $(this).attr("amount").replace(",", "");
            amttotal = parseFloat(amttotal) + parseFloat(amt);
            invCount++;
        });

        AtlasCheckCycle.iTotalInvoices = amttotal;
        $("#lblInvoicesPaid").text($('.clsInvoiceId:checked').length);
        $("#lblTotal").text(numeral(parseFloat(total)).format('#,###.##'));
        $("#lblTotalPaid").text(numeral(parseFloat(total)).format('#,###.##'));
        $("#lblTotalNotPaid").text(numeral(parseFloat((parseFloat(amttotal) - parseFloat(total)))).format('#,###.##'));
        $("#lblInvoicesNotPaid").text($('.clsInvoiceId:not(:checked)').length);
        $("#lblVendorsPaid").text(AtlasCheckCycle.iNumVendors);
        $("#lblCheck").text(AtlasCheckCycle.iNumCheck);
        this.GetVendorSummury();
    },
    checkUserStatus: function (createdby) {
        if (createdby == localStorage.UserId) {
            $("#dvExistingCCReturn").dialog({
                modal: true,
                minWidth: 600,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
        } else {
            $("#dvExistingCCBlocked").dialog({
                modal: true,
                minWidth: 600,
                buttons: {
                    Ok: function () {
                        AtlasNavigation.toModule('Check Cycle');
                    }
                }
                , close: function () { AtlasNavigation.toModule('Check Cycle') }
            });
        }
    },
    checkCycleState: function (state) {
        switch (state) {
            case this.oStates[0]:

                break;
            case this.oStates[1]:

                break;
            case this.oStates[2]:

                break;
            case this.oStates[3]:
                $("#dvNotifyDuplicate").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                        }
                    }
                });
                break;
            case this.oStates[4]:
                $("#dvNotifyError").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
                            AtlasNavigation.toModule('Check Cycle');
                        }
                    }
                });
                break;
            default:
        }
    },
    GetNextCheckNumber: function () {
        AtlasCache.CacheORajax(
        {
            'URL': this.URL_GETCHECKNUMBER + '?BankId=' + AtlasCheckCycle.BankID + '&ProdId=' + localStorage.ProdId
                     , 'doneFunction': AtlasCheckCycle.GetNextCheckNumberSucess
                     , 'objFunctionParameters': {
                     }
        });
    },
    GetNextCheckNumberSucess: function (response) {

        AtlasCheckCycle.iNextCheckNumber = response;
        $("#txtInitialCheck").val(response);
    },
    GetCheckCycle: function (action) {
        let objJson = "{\"ProdID\":" + localStorage.ProdId + ",\"BankID\":" + AtlasCheckCycle.BankID + ", \"UserID\": " + localStorage.UserId + "}";
        if (AtlasCheckCycle.isRecalled == true) {
            objJson = "{\"ProdID\":" + localStorage.ProdId + ",\"BankID\":" + AtlasCheckCycle.BankID + ", \"UserID\": " + localStorage.UserId + ", \"Action\": \"INIT\", \"PaymentType\": \"" + $("#ddlType").val() + "\", \"CheckDate\": \"" + $("#txtPaymentDate").val() + "\" }";
        }
        if (action == "save") {
            AtlasUtilities.sAction = "SAVE";
            var occ = AtlasCheckCycle.PrepairCheckCycleData();
            objJson = "{\"ProdID\":" + localStorage.ProdId + ",\"BankID\":" + AtlasCheckCycle.BankID + ", \"UserID\": " + localStorage.UserId + ", \"Action\": \"SAVE\", \"JSONdocument\": " + occ + "}";
        }
        if (action == "cancel") {
            AtlasUtilities.sAction = "CANCEL";
            objJson = "{\"ProdID\":" + localStorage.ProdId + ",\"BankID\":" + AtlasCheckCycle.BankID + ", \"UserID\": " + localStorage.UserId + ", \"Action\": \"CANCEL\", \"CCID\": " + AtlasCheckCycle.iCheckCycleId + "}";
        }
        AtlasUtilities.CallAjaxPost(
            this.URL_GETCHECKCYCLE
            , false
            , this.GetCheckCycleSucess
            , this.GetCheckCycleFailed
            , {
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                , async: false
                , callParameters: {
                    callPayload: objJson
                }
            }
        );
        //AtlasCache.CacheORajax(
        //      {
        //          'URL': this.URL_GETCHECKCYCLE
        //            , 'doneFunction': AtlasCheckCycle.GetCheckCycleSucess
        //            , callParameters: { callPayload: JSON.stringify({ objJson }) }
        //            , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        //            , 'cachebyname': ''
        //            , 'objFunctionParameters': {
        //            }
        //            , bustcache: true
        //      });
    },
    GetCheckCycleSucess: function (response) {

        if (response.Status == "DELETED") {
            AtlasNavigation.toModule('Check Cycle');
        }
        else {

            AtlasCheckCycle.oCheckCycleItems = response;
            let oCCSetup = $.parseJSON(response.CCSetup);
            let oBSetup = $.parseJSON(response.BSetup);
            $(".clsUserName").text(oCCSetup.UName.trim());
            $(".clsBankName").text(oCCSetup.BName.trim());
            AtlasCheckCycle.iCheckCycleId = response.CheckCycleID;

            if (AtlasUtilities.sAction != "SAVE") {
                console.log(response.V);
                AtlasCheckCycle.RenderCheckCycle(response.V);
            }
            AtlasCheckCycle.sPaymentType = response.PaymentType;
            //AtlasCheckCycle.checkUserStatus(response.createdby);
            //AtlasCheckCycle.checkCycleState(response.State);
            console.log(response);
            if (oBSetup.NEXT != null) {
                $("#txtInitialCheck").val(oBSetup.NEXT);
                AtlasCheckCycle.iNextCheckNumber = oBSetup.NEXT;
            }
            else {
                $("#txtInitialCheck").val(oBSetup.START);
                AtlasCheckCycle.iStartCheckNumber = AtlasCheckCycle.iNextCheckNumber = oBSetup.START;
            }
            AtlasCheckCycle.iStartCheckNumber = oBSetup.START;
            AtlasCheckCycle.iEndCheckNumber = oBSetup.END;
            $(".clscheckcycle").text(" [" + response.CheckCycleID + "] ");
            if (AtlasCheckCycle.isRecalled != true) {
                AtlasCheckCycle.checkUserStatus(response.createdby);
                AtlasCheckCycle.checkCycleState(response.State);
            }
            console.log(response); AtlasCheckCycle.isRecalled = true;
            if (AtlasUtilities.sAction == "SAVE") {
                stsClose = true;
                $.notify("Check Cycle Details Saved", "success");
            }
        }

    },
    GetCheckCycleFailed: function (response) {
        if ($("#tblFilterListTBody").find(".checkgroup").length == 0 && AtlasCheckCycle.isRecalled != true && response.status == "200") {
            AtlasCheckCycle.isRecalled = true;
            AtlasCheckCycle.GetCheckCycle();
        }
    },
    RenderCheckCycle: function (oVendor) {
        var sHTML = "";
        for (var i = 0; i < oVendor.length; i++) {

            for (var j = 0; j < oVendor[i].CCCG.length; j++) {
         
                var subtotal = 0;
                for (var k = 0; k < oVendor[i].CCCG[j].CCCGI.length; k++) {

                    var checkitem = {

                        vendorId: oVendor[i].VendorID,
                        vendorName: oVendor[i].VendorName,
                        CheckNumber: oVendor[i].CCCG[j].CheckNumber,
                        InvoiceNumber: oVendor[i].CCCG[j].CCCGI[k].InvoiceNumber,
                        InvoiceID: oVendor[i].CCCG[j].CCCGI[k].InvoiceID,
                        InvoiceDate: oVendor[i].CCCG[j].CCCGI[k].InvoiceDate,
                        Amount: oVendor[i].CCCG[j].CCCGI[k].Amount,
                        CheckGroupNumber: oVendor[i].CCCG[j].CheckGroupNumber,
                        CheckDate: oVendor[i].CCCG[j].CheckDate
                    }

                    AtlasCheckCycle.oChecItems.push(checkitem);
                   
                    var amount = oVendor[i].CCCG[j].CCCGI[k].Amount;
                    subtotal = subtotal + amount;
                }
             
            }
        }
       
        sHTML = this.CreateCheckRows(AtlasCheckCycle.oChecItems);

      
        $(this.sTable).dataTable().fnDestroy(); // force destroy of the DT before we reset it

        $(this.sTbody).html(sHTML);

        var heightt = $(window).height();
        heightt = heightt - 200;
        $('#DvTable').attr('style', 'height:' + heightt + 'px;');
      
        if (AtlasUtilities.sAction != "SAVE") {
            $(this.sTable + ' thead tr').clone(true).appendTo(this.sTable + ' thead');

            $(this.sTable + ' thead tr:eq(1) th').each(function (i) {
                if (i != 0) {
                    var title = $(this).text();
                    $(this).html('<input type="text"  style="width:100%;" placeholder=" ' + title + '"  />');

                    $('input', this).on('keyup change', function () {
                        if (table.column(i).search() !== this.value) {
                            table
                           .column(i)
                           .search(this.value)
                           .draw();
                        }
                    });
                }
                else {
                    $(this).html('<span></span>');
                }
            });
        }
    
        var table = $(this.sTable).DataTable({
            "iDisplayLength": 20,           
            paging: false,
            ordering: false,
            info: false,
            orderCellsTop: true,
        });

        this.CalculateTotal();
    },
    CreateCheckRows: function (obj) {

        var sHTMLTemplate = ""; var checked = ""; var isdisabled = "";
        for (var i = 0; i < obj.length; i++) {
            sHTMLTemplate += '<tr role="row" invoiceid="' + obj[i].InvoiceID + '" vendorid="' + obj[i].vendorId + '" rowitem="' + i + '"  id="V_' + obj[i].vendorId + '_' + i + '" checkgroup="' + obj[i].CheckGroupNumber + '" >';
            if (obj[i].CheckNumber != "-1") {
                checked = "checked";                              
            } else { checked = ""; }
            sHTMLTemplate += '<td ><input type="checkBox" ' + checked + ' class="clsInvoiceId" id="chk_' + obj[i].vendorId + '_' + i + '" onclick="AtlasCheckCycle.CalculateAmount(' + obj[i].vendorId + ',' + i + ');" /></td>';
            sHTMLTemplate += '<td class="vendorname">' + obj[i].vendorName + '</td>';
            sHTMLTemplate += '<td ><input type="text"  class="checknum"  style="width:50px;" id="txtCheckNum_' + i + '" value="' + obj[i].CheckNumber + '" onblur="AtlasCheckCycle.ResequenseCheckNum(this,'+i+');" ></td>';
            sHTMLTemplate += '<td class="clsInvoiceNum">' + obj[i].InvoiceNumber + '</td>';
            if (obj[i].CheckNumber == "-1") {
                isdisabled = "disabled";
            } else { isdisabled = "";}
            sHTMLTemplate += '<td ><input style="width:50px;"  type="text" onkeypress="return AtlasCheckCycle.Validate(event);" class="checkgrp" id="txtchkgrp_' + i + '" onblur="AtlasCheckCycle.SetNewCheckNumber(' + obj[i].vendorId + ',this);"  value="' + obj[i].CheckGroupNumber + '"></td>';
            sHTMLTemplate += '<td class="clsInvoiceDt">' + obj[i].InvoiceDate + '</td>';
            sHTMLTemplate += '<td >' + obj[i].CheckDate + '</td>';
            sHTMLTemplate += '<td ><span style="float:right" class="amount" id="lblAmount_' + i + '" amount="' + obj[i].Amount + '">$' + numeral(obj[i].Amount).format('#,###.##') + '</span> </td></tr>';
        }
        return sHTMLTemplate;
    },      
    CheckNumberRange: function () {
        if (parseInt($("#txtInitialCheck").val()) <= parseInt(AtlasCheckCycle.iEndCheckNumber) && parseInt($("#txtInitialCheck").val()) >= parseInt(AtlasCheckCycle.iStartCheckNumber)) {
            AtlasCheckCycle.ResequenseCheckNum($("#txtInitialCheck").val(),true);
        }
        else {

            $("#dvCheckInvalid").dialog({
                modal: true,
                minWidth: 600,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                        $("#txtInitialCheck").val(AtlasCheckCycle.iNextCheckNumber);
                    }
                }
            });
        }
    },
    ValidateChcekCyclePrint: function () {
        var isvalid = true;
        var checkgroups = $("#tblFilterListTBody").find(".checkgroup");
        $.each(checkgroups, function (index, value) {
            var checknumspan = $(this).find("span").first();
            if (checknumspan.text() == "-1") {
                isvalid = false;
            }
        });
        if (isvalid == false) {
            $("#dvWireACH").dialog({
                modal: true,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    },
    PrepairCheckCycleData : function()
    {
        var ocheckcycle = AtlasCheckCycle.oCheckCycleItems;

        var V = []; var CCCG = []; var CCCGI = []; tempcheckgroup = ""; tempvendorgroup = ""; var tempchecknum = ""; var vendorgroup = []; var vendcheck = "";

        var vendorgroups = $("#tblFilterListTBody").find("tr");

        var vcount = 0;
        $.each(vendorgroups, function (index, value) {                                    
           
            vendcheck = "";
            var vendorid = $(this).attr("vendorid");
            var checkgroup = $(this).attr("checkgroup");           
            var vendorname = $(this).find(".vendorname").text();
             
            var checkgroups = $("#tblFilterListTBody").find("tr").filter("[vendorid=" + vendorid + "]").filter("[checkgroup=" + checkgroup + "]");

            var vendorcount = $("#tblFilterListTBody").find("tr").filter("[vendorid=" + vendorid + "]");

            

            if ($.inArray(vendorid + "-" + checkgroup, vendorgroup) == -1)
            {
                var count = 0; vendcheck = vendorid + "-" + checkgroup;
                $.each(checkgroups, function (index, value) {

                 
                    var checkgroup = $(this).attr("checkgroup");
                    var checknum = $(this).find(".checknum").val();
                    tempchecknum = checknum;
                    if (checknum == "") { checknum = "-1"; }

                    tempcheckgroup = checkgroup;

                    var invoiceid = $(this).attr("invoiceid");
                    var invoicenum = $(this).find(".clsInvoiceNum").text();
                    var invoicedt = $(this).find(".clsInvoiceDt").text();
                    var invoiceamnt = $(this).find(".amount").attr("amount");

                    var items = {

                        InvoiceID: invoiceid,
                        InvoiceNumber: invoicenum,
                        InvoiceDate: invoicedt,
                        Amount: invoiceamnt
                    }

                    CCCGI.push(items); count++;

                    if (checkgroups.length == count) {

                        checkgroup = checkgroup.toString().trim().replace("A", "#")
                        if (checkgroup.toString().indexOf("#") > -1) {
                            checkgroup = checkgroup.split('_')[0];
                        }

                        var groups = {
                            CheckCycleID: ocheckcycle.CheckCycleID,
                            CheckGroupID: -1,
                            VendorName: vendorname,
                            CheckGroupNumber: checkgroup,
                            CheckNumber: tempchecknum,
                            CheckStatus: "N",
                            PrintStatus: false,
                            CheckDate: ocheckcycle.createdDatetime,
                            CCCGI: CCCGI
                        };

                        CCCG.push(groups);
                        CCCGI = [];
                    }
                    
                });
                vendorgroup.push(vendcheck);
            }
            

            tempvendorgroup = vendorid; vcount++;

            if (vendorcount.length == vcount) {

               
                var vendors = {
                    VendorID: vendorid,
                    VendorName: vendorname,
                    CCCG: CCCG
                };
                V.push(vendors);
                CCCG = [];
                vcount = 0;
            }
           

        });


        var ocheckitems = {

            createdby: ocheckcycle.createdby,
            CheckCycleID: ocheckcycle.CheckCycleID,
            Status: ocheckcycle.Status,
            State: ocheckcycle.State,
            BankID: ocheckcycle.BankID,
            PaymentType: ocheckcycle.PaymentType,
            createdDatetime: ocheckcycle.createdDatetime,
            JSONdocument: ocheckcycle.JSONdocument,
            prodID: ocheckcycle.prodID,
            isdeleted: ocheckcycle.isdeleted,
            CCSetup: ocheckcycle.CCSetup,
            BSetup: ocheckcycle.BSetup,
            V: V
        };

        console.log(ocheckitems);

        var occitem = JSON.stringify(ocheckitems);

        return occitem;
    },
    ReportPaymentPreview : function()
    {
        var JSONParameters = {};
        var InvDtFrom = ""; var InvDtTo = "";
        if ($("#txtInvoiceDateFrom").val() == "") { InvDtFrom = "All"; } else { InvDtFrom = $("#txtInvoiceDateFrom").val();}
        if ($("#txtInvoiceDateTo").val() == "") { InvDtTo = "All"; } else { InvDtTo = $("#txtInvoiceDateTo").val(); }

        var InvAmntFrom = ""; var InvAmntTo = "";
        if ($("#txtInvAmntFrom").val() == "") { InvAmntFrom = "All"; } else { InvAmntFrom = $("#txtInvAmntFrom").val(); }
        if ($("#txtInvAmntTo").val() == "") { InvAmntTo = "All"; } else { InvAmntTo = $("#txtInvAmntTo").val(); }
        var PeriodStatus = "";
        if ($("#ddlPeriodFilter").val() == null) { PeriodStatus = "All"; } else { PeriodStatus = $("#ddlPeriodFilter").val(); }

        var oFilterItems = {

            Location: $("#ddlLocation").val(),
            Episode: $("#ddlEpisode").val(),
            Sets: $("#ddlSet").val(),
            PaymentType: $("#ddlType").val(),
            PeriodStatus: PeriodStatus,
            InvoiceDtFrom: InvDtFrom,
            InvoiceDtTo: InvDtTo,
            InvoiceAmntFrom: InvAmntFrom,
            InvoiceAmntTo: InvAmntTo,
            UserName: $(".clsUserName").text(),
            PayDate: $("#txtPaymentDate").val(),
            Vendor: $("#txtVendorFilter").val(),
        };
      
        JSONParameters.callPayload = this.PrepairCheckCycleData();
        console.log(JSONParameters);
        APIName = 'URL_PREVIEWPAYMENT';
        let RE = new ReportEngine(this.URL_PREVIEWPAYMENT);
        RE.ReportTitle = 'Payment Preview Report';
        RE.callingDocumentTitle = 'Payment Preview Report';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckCycle = JSONParameters;
        RE.FormJSON.Filters = oFilterItems;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.UserId = localStorage.UserId;
        RE.FormJSON.BankId = AtlasCheckCycle.BankID;
        RE.RunReport({ DisplayinTab: true });
        G_RE = RE;
    },
    GetVendorSummury : function()
    {
        var vendorgroups = $("#tblFilterListTBody").find(".vendorgroup");

        $.each(vendorgroups, function (index, value) {

            var vendorid = $(this).attr("vendorid");
            
            var unpaidcount = $(this).find("#lblUnpaiCount_" + vendorid);
            var unpaidamnt = $(this).find("#lblUnpaidAmnt_" + vendorid);
            var paidcount = $(this).find("#lblPaidCount_" + vendorid);
            var paidamnt = $(this).find("#lblPaidAmnt_" + vendorid);
            var checkscount = $(this).find("#lblChecksCount_" + vendorid);

            unpaidcount.text($(".clsinovice").filter("[name='" + vendorid + "']").filter("[checkgroup='-1']").length);
            paidcount.text($(".clsinovice").filter("[name='" + vendorid + "']").filter("[checkgroup!='-1']").length);

            var unpaindamntrow = $(".clsinovice").filter("[name='" + vendorid + "']").filter("[checkgroup='-1']").find('.amount');

            var amntunpaid = 0;
            $.each(unpaindamntrow, function (index, value) {

                var amnt = $(value).text().replace(",", "");

                amntunpaid = parseFloat(amntunpaid) + parseFloat(amnt);

            });
            unpaidamnt.text(numeral(parseFloat(amntunpaid)).format('#,###.##'));

            var paindamntrow = $(".clsinovice").filter("[name='" + vendorid + "']").filter("[checkgroup!='-1']").find('.amount');

            var amntpaid = 0;
            $.each(paindamntrow, function (index, value) {

                var amnt = $(value).text().replace(",", "");

                amntpaid = parseFloat(amntpaid) + parseFloat(amnt);

            });
            paidamnt.text(numeral(parseFloat(amntpaid)).format('#,###.##'));

            checkscount.text($(".checkgroup").filter("[name='" + vendorid + "']").length);

        });
    },
    Validate: function (event) {
            var regex = new RegExp("^[0-9#]+$");
            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
    },
    ShowClose : function()
    {       
            $("#dvClose").dialog({
                modal: true,
                minWidth: 600,
                buttons: {
                    "Yes": function () {
                        AtlasNavigation.toModule('Check Cycle');
                    },
                    "No": function () {
                        $(this).dialog("close");
                    }
                }
              
            });        
    },
    SetCheckNumber : function(vendorid,index)
    {
        var row = $("#tblFilterListTBody").find('tr').filter("[vendorid='" + vendorid + "']")[0];
        if(row != undefined)
        {
            var existingcheck = $(row).find(".checknum");
            var existinggroup = $(row).find(".checkgrp");
            var chkinv = $(row).find(".clsInvoiceId");

            var hasrow = $("#tblFilterListTBody").find('tr').filter("[vendorid='" + vendorid + "']").filter("[checkgroup=0]").length;            
            var newchecknum = "#txtCheckNum_" + index;

            if ($(chkinv).prop("checked") == true) {
                if (hasrow > 0) {

                    var row = $("#tblFilterListTBody").find('tr').filter("[vendorid='" + vendorid + "']").filter("[checkgroup=0]")[hasrow - 1];
                    var existingchecknum = $(row).find(".checknum");   
                    $(newchecknum).attr("value", $(existingchecknum).val());
                    $(newchecknum).val($(existingchecknum).val());                                   
                }
                else
                {
                    $(newchecknum).attr("value", AtlasCheckCycle.iNextCheckNumber);
                    $(newchecknum).val(AtlasCheckCycle.iNextCheckNumber);
                    AtlasCheckCycle.iNextCheckNumber++;
                }
            }
            else
            {                
                $(newchecknum).val("-1");
                $(newchecknum).attr("value", "-1");
            }
        }
    },
    SetNewCheckNumber : function(vendorid,elegroup)
    {
        var checkgroup = $(elegroup).val();
        var hasrow = $("#tblFilterListTBody").find('tr').filter("[vendorid='" + vendorid + "']").filter("[checkgroup=" + checkgroup.replace("#","A") + "]").length;
        var newrow = $(elegroup).closest('tr');
        var chk = $(newrow).find(".clsInvoiceId");
        var existingcheck = $(newrow).attr("checkgroup");
        
        var index = $(newrow).index();

        if ($(chk).prop("checked") == true) {
            if (existingcheck != checkgroup) {
                if (hasrow > 0 && checkgroup != "#") {

                    var row = $("#tblFilterListTBody").find('tr').filter("[vendorid='" + vendorid + "']").filter("[checkgroup=" + checkgroup + "]")[hasrow - 1];                   
                    var existingchecknum = $(row).find(".checknum");
                    var newchecknum = $(newrow).find(".checknum");
                    $(newrow).attr("checkgroup", checkgroup);
                    $(elegroup).attr("value", checkgroup);
                    $(newchecknum).attr("value", $(existingchecknum).val());
                    $(newchecknum).val($(existingchecknum).val());
                    $(chk).attr("checked", "checked");

                }
                else {

                    var row = $("#tblFilterListTBody").find('tr').filter("[vendorid='" + vendorid + "']").filter("[checkgroup='-1']")[0];
                    var checknum = $(newrow).find(".checknum");
                    $(newrow).attr("checkgroup", checkgroup.replace("#", "A_" + AtlasCheckCycle.iNextCheckNumber));
                    $(elegroup).attr("value", checkgroup);
                    if (AtlasCheckCycle.iNextCheckNumber == undefined) {
                        AtlasCheckCycle.iNextCheckNumber = $("#txtInitialCheck").val();
                    }
                
                        $(checknum).attr("value", AtlasCheckCycle.iNextCheckNumber);
                        $(checknum).val(AtlasCheckCycle.iNextCheckNumber);
                        AtlasCheckCycle.iNextCheckNumber++;
                    
                    $(chk).attr("checked", "checked");
                    
                }
            }
            this.CalculateTotal();
        }
    },
    CheckAll : function()
    {
        var vendorid;
        $('#tblFilterListTBody tr').each(function (i, row) {
            
            var chk = $(row).find(".clsInvoiceId");
            var checknum = $(row).find(".checknum");
            var checkgroup = $(row).find(".checkgrp");
            

            if ($("#chkAll").prop("checked") == true)
            {
                if (vendorid != $(row).attr("vendorid") && i != 0) {
                    AtlasCheckCycle.iNextCheckNumber++;
                }
                $(chk).prop('checked', true);                             
                $(row).attr("checkgroup", "0");
                $(checkgroup).val("0");
                $(checknum).val(AtlasCheckCycle.iNextCheckNumber);
                vendorid = $(row).attr("vendorid");
            }
            else
            {
                $(chk).prop('checked', false);
                $(row).attr("checkgroup", "-1");
                $(checkgroup).val("-1");
                $(checknum).val("-1");
            }
           
        });
        this.CalculateTotal();
    },
    ResequenseCheckNum : function(checkNo,index)
    {
        var vendorid;
        if (index == 0 || index == true) {
            if ($("#ddlType").val() == "Check" || $("#ddlType").val() == "Manual Check") {

                $('#tblFilterListTBody tr').each(function (i, row) {

                    var chk = $(row).find(".clsInvoiceId");
                    var checknum = $(row).find(".checknum");
                    var checkgroup = $(row).find(".checkgrp");

                    if (index == 0 && i == 0) { AtlasCheckCycle.iNextCheckNumber = $(checkNo).val(); }
                    else if (index == true && i == 0) { AtlasCheckCycle.iNextCheckNumber = $("#txtInitialCheck").val(); }

                    if ($(chk).prop("checked") == true) {

                        if (vendorid != $(row).attr("vendorid") && i != 0) {
                            AtlasCheckCycle.iNextCheckNumber++;
                        }
                    

                        $(checknum).val(AtlasCheckCycle.iNextCheckNumber);
                        vendorid = $(row).attr("vendorid");
                    }
                });

            }
        }
    }

};
$(document).ready(function () {

    $(function () {
        $(".datepicker").datepicker();
    });

    var currentDate = new Date();
    $('#txtPaymentDate').val(dateFormat(currentDate, 'mm/dd/yyyy'));


    $("#tabToolbar").click(function () {
        $("#divTool").slideToggle("slow");
    });

    $("#ddlPeriod").multiselect();
    $("#ddlPeriodFilter").multiselect();
    AtlasCheckCycle.RenderSegment();
    AtlasCheckCycle.GetBankDetails();
    AtlasCheckCycle.GetVendor();

    $('#ddlType').on('change', function () {
        if (this.value == "Check") {
            $("#txtInitialCheck").show();
            $(".checkname").text("Check Number");
        }
        else {
            $("#txtInitialCheck").hide();
            if (this.value == "Manual Check") {
                $(".checkname").text("Check Number");
            }
            else if (this.value == "Wire Check") {
                $(".checkname").text("Wire ID");
            }
            else if (this.value == "ACH") {     
                $(".checkname").text("ACH ID");
            }
        }
    });
});