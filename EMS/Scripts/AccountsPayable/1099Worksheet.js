var G_RE = undefined;

var oWorksheetConfig = {
      URL_GETRANSDETAILS: "/api/ModuleTen/GetTransactionDetails"
    , URL_GEVENDORDETAILS: "/api/AccountPayableOp/GetVendorListByProdID?SortBy=All&ProdID="
    , URL_GetTaxCodeList: "/api/CompanySettings/SettingsTaxCodeGet"
    , URL_GetVendorStateList : "/api/CompanySettings/GetStateListByCountryId"
    , URL_SAVETRANSDETAILS: "/api/ModuleTen/SaveWorksheet"
    , URL_IRSPrintPDF: "/api/ModuleTen/IRSPrintPDF"
    , URL_VendorSETUP: "/api/ModuleTen/PrintSetupReport"
    , URL_PrintWorkSheet: "/api/ModuleTen/PrintWorkSheet"
    , URL_PrintWorkSheetSummary: "/api/ModuleTen/PrintWorkSheetSummary"
    , URL_GETCompanyDetail : "/api/CompanySettings/GetCompanyDetail"
    , TransactionsFilters: []
    , oTransacitionDetails: []
    , oVendorDetails: []
    , objVCache: {}
    , oTaxYears: []
    , oWorkState: []
    , TaxCode1099: []
    , oTaxCode: []
    , colId: []
    , count: 0
    , iSubTotal : 0
    , iTotal: 0
    , TaxYear: localStorage.TY1099
    , sVendorName: ""
    , sTable: "#tblWorksheet"
    , sTbody: "#tblTransBody"
    , oWorksheet :[]
    , oVendors : []
    , oTransactions: []
    , oTransactionLine: []
    , oPaymentExist: []
    , oCompanyDetails: []
    , isShowTaxYear: false
    , Delta: []
    , TaxCodeSummarybyVendorID: function (VendorID) {
        let ret = {};
        $(`[name=${VendorID}]`)
            .each(function () {
                if ($(this.children[8].children[0]).val() !== '') {
                    let addvalue = numeral(($($(this.children[9]))[0]).innerText).value();
                    let reval = ret[$($(this.children[8].children)[0]).val()];
                    ret[$($(this.children[8].children)[0]).val()] = (!reval) ? addvalue : reval + addvalue; // index[8] is the tax code field
                }
            });

        return ret;
    }
    , BindTaxCode: function (reload) {
        if (!reload) AtlasUtilities.ShowLoadingAnimation()

        $.ajax({
            url: this.URL_GetTaxCodeList + '?ProdId=' + localStorage.ProdId + '&TaxCodeId=' + 0,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
        })
       .done(function (response) {
           oWorksheetConfig.TaxCode1099 = [];
           $.each(response, function (index, value) {
               if (value.Active === true)
                   oWorksheetConfig.TaxCode1099.push({ TaxCode: value.TaxCode, TaxDescription: value.TaxDescription, TaxID: value.TaxID });
           });

           oWorksheetConfig.oTaxCode = oWorksheetConfig.TaxCode1099.error ? [] : $.map(oWorksheetConfig.TaxCode1099, function (m) {
               return {
                   label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(), id: m.TaxID,
               };
           });

           $.each(oWorksheetConfig.oTaxCode, function (key, value) {
               $('#ddlTaxCode').append($("<option></option>").attr("value", value.value).text(value.label));
           });
           $('#ddlTaxCode').multiselect();

           oWorksheetConfig.BindTaxYear();
          
        })
       .fail(function (error)
       {  });    
    }
    , TaxCodeAutoComplete : function(id, objField) {
        $(".clsTaxCode_"+id).autocomplete({
            minLength: 1,
            source: oWorksheetConfig.oTaxCode,
            autoFocus: true,
            focus: function (event, ui) {
                if (event.which !== 9) {
                    event.preventDefault();
                }
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.value);
                $(this).attr("Desc", ui.item.label);
                $(this).attr("taxid", ui.item.id);
                $(this).removeClass("field-Req");
                $(this.parentElement.parentElement).addClass('DELTA'); // Make this row a delta
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                    try {
                        var findVal = $(this).val();
                        findVal = findVal.toUpperCase();
                        var GetElm = $.grep(oWorksheetConfig.oTaxCode, function (v) {
                            return v.value === findVal;
                        });
                        if (GetElm.length > 0) {
                            $(this).val(findVal);
                            $(this).attr("taxid", GetElm[0].id);
                        }
                        else {
                           // $(this).val('');
                            $(this).attr("taxid", null);
                            //$(this).addClass("field-Req");
                        }
                    } catch (er) {
                        $(this).val('');
                        $(this).attr("taxid",null);
                        console.log(er);
                    }
                }
                $(this.parentElement.parentElement).addClass('DELTA'); // Make this row a delta
            }

        });
    }
    , GetTaxCodeId: function (sTaxCode) {
        var id = "";
        $.each(oWorksheetConfig.oTaxCode, function (key, value) {
            if (sTaxCode === value.value)
            {
                id = value.id;
            }
        });
        return id;
     }
    , BindTaxYear : function()
    {
        oWorksheetConfig.oTaxYears = JSON.parse(localStorage.TaxYears);
        $.each(oWorksheetConfig.oTaxYears, function (key, value) {
            $('.taxyear').append($("<option></option>").attr("value", value).text(value));
        });
        $('.taxyear').val(localStorage.TY1099);
        oWorksheetConfig.BindState();
        
    }
    , BindState : function() {
        $.ajax({
            url: `${this.URL_GetVendorStateList}?CountryID=${G_CountrybyCode('US').ID}`,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            oWorksheetConfig.oWorkState = response;
            $('.workstate').append($("<option></option>").attr("value", "0").text(""));
            $.each(oWorksheetConfig.oWorkState, function (key, value) {
                //$('.workstate').append($("<option></option>").attr("value", value.StateCode.replace("US-","")).text(value.StateCode.replace("US-","")));
                $('.workstate').append($("<option></option>").attr("value", value.StateCode).text(value.StateCode));
            });
            $('#ddlWorkState').val(0);
            oWorksheetConfig.SetFilters();
        })
        .fail(function (error) { })
    }
    , SetFilters : function()
    {

        var oFilter = ""; oWorksheetConfig.oPaymentExist = []; this.iTotal = 0; var staxyear = "";
        if ($('#btnApply').text() == "UnApply") { staxyear = $('.taxyear').val(); } else { staxyear = localStorage.TY1099;$('.taxyear').val(localStorage.TY1099); }
        
        oFilter = '"ProdID":"' + localStorage.ProdId + '","TaxYear":"' + staxyear + '","CompanyID":"' + localStorage.CompanyID + '"';

        if ($('#txtPayDtFrom').val() !== "" && $('#txtPayDtTo').val() !== "" && $('#btnApply').text() == "UnApply")
        {
            var fromDt = dateFormat($('#txtPayDtFrom').val(), 'yyyy-mm-dd');
            var toDt = dateFormat($('#txtPayDtTo').val(), 'yyyy-mm-dd');
            oFilter += ',"PaymentDateFrom":"' + fromDt + '","PaymentDateTo":"' + toDt + '"'
        }
        if ($('#txtPayNumber').val() !== "" && $('#btnApply').text() == "UnApply") {
            oFilter += ',"PaymentNumber":"' + $('#txtPayNumber').val().trim() + '"'
        }
        if ($('#txtInvoice').val() !== "" && $('#btnApply').text() == "UnApply") {
            oFilter += ',"InvoiceNumber":"' + $('#txtInvoice').val().trim() + '"'
        }
        if ($('#txtAccountFrom').val() !== "" && $('#txtAccountTo').val() !== "" && $('#btnApply').text() == "UnApply") {
            oFilter += ',"AccountFrom":"' + $('#txtAccountFrom').val().trim() + '","AccountTo":"' + $('#txtAccountTo').val().trim() + '"'
        }
        if ($('#chkwith1099').is(':checked') == true && $('#btnApply').text() == "UnApply") { oFilter += ',"incnotaxcode":"' + 0 + '"' }
        if ($('#chkWithout1099').is(':checked') == true && $('#btnApply').text() == "UnApply") { oFilter += ',"incnotaxcode":"' + 1 + '"' }
        if ($('#chkAll').is(':checked') == true && $('#btnApply').text() == "UnApply") { oFilter += ',"incnotaxcode":"' + -1 + '"' }
        if ($('#chkTotal').is(':checked') == true && $('#btnApply').text() == "UnApply") { oFilter += ',"minimumtotal":"' + 600 + '"' }
        if ($('#txtAmount').val() !== "" && $('#btnApply').text() == "UnApply") {
            oFilter += ',"Amount":"' + numeral($('#txtAmount').val().trim()).value() + '"'
        }
      
        oFilter = "{" + oFilter + "}";

        this.TransactionsFilters = {
            sFilters: oFilter
        };

        this.GetTransactionsDetails();
    }
    ,CreateFilters : function()
    {
        AtlasUtilities.ShowLoadingAnimation();
        if ($('#btnApply').text() == "Apply") {

            $('#btnApply').text("UnApply"); $("#tabToolbar").addClass("filter-applied");
            this.SetFilters();
            
           
        }
        else {
          
            $('#btnApply').text("Apply"); $("#tabToolbar").removeClass("filter-applied");
            this.SetFilters();
           

        }
        $("#divTool").slideToggle("slow");
    }
    , SortByName: function (a, b) {
        var aName = a.VendorID;
        var bName = b.VendorID;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    , GetVendorDetails: function () {
        AtlasCache.CacheORajax(
        {
            'URL': this.URL_GEVENDORDETAILS + localStorage.ProdId
                    , 'doneFunction': oWorksheetConfig.GetVendoreByProdIdSucess
                    , 'objFunctionParameters': {
                    }
        });       
    }
    , GetVendoreByProdIdSucess : function(response) {
        let objC = oWorksheetConfig.objVCache;
        objC = response.reduce((ret, vendor) => {
            ret[vendor.VendorID] = vendor;
            return ret;
        }, objC);

        oWorksheetConfig.oVendorDetails = response;
        oWorksheetConfig.CreateRow();
    }
    , GetTransactionsDetails: function () {
        $.ajax({
            url: this.URL_GETRANSDETAILS
            ,cache: false
            ,beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            }
            ,type: 'POST'
            ,data: JSON.stringify(this.TransactionsFilters) 
            ,contentType: 'application/json; charset=utf-8'
          
        })
        .done(function (response) {
            oWorksheetConfig.GetTransactionsDetailsSuccess(response);
        })
        .fail(function (error) { })       
    }   
    , GetTransactionsDetailsSuccess: function (response) {
        //this.oTransacitionDetails = response.sort(this.SortByName); // Sorting incorrectly
        this.oTransacitionDetails = response;

        if (this.oTransacitionDetails.length > 0) {         
                this.GetVendorDetails();
        } else {
            this.NoRecordsFound();
        }
    }
    , NoRecordsFound() {
        AtlasUtilities.HideLoadingAnimation();
        $(this.sTbody).html('<tr><td colspan="11" align="center">No Records Found</td></tr>');
    }
    , CreateRow: function () {
        let sHTML = "", vendorid = ""; // limit scope to the block

 
        for (var i = 0; i < this.oTransacitionDetails.length; i++) {

             if (vendorid !== this.oTransacitionDetails[i].VendorID) {

                 if (sHTML !== "")
                 {
                     sHTML += this.RowTransTotal(this.iSubTotal, this.sVendorName);
                     //sHTML += this.RowTransTotal(numeral(this.iSubTotal).format('#,###.##'), this.sVendorName);
                     this.AmountTotal(this.iSubTotal);
                     hastotal = this.iSubTotal;
                     this.iSubTotal = 0;
                 }


                 sHTML += this.RowVendorDetails(oWorksheetConfig.oVendorDetails, this.oTransacitionDetails[i].VendorID)
                 sHTML += this.RowTransDetails(this.oTransacitionDetails[i], i)
              


             } else {
               
                 sHTML += this.RowTransDetails(this.oTransacitionDetails[i],i)
             }

            
                        
             vendorid = this.oTransacitionDetails[i].VendorID;
         }

        if (sHTML !== "") {
            sHTML += this.RowTransTotal(this.iSubTotal, this.sVendorName);
            this.AmountTotal(this.iSubTotal);
            this.iSubTotal = 0;
        }

         if (sHTML !== "") {
             sHTML += this.RowTransTotal(this.iTotal, "Paid to 1099 Vendors");
             $("#dollartotal").text(numeral(this.iTotal).format('#,###.##'));
         }

         $(this.sTable).dataTable().fnDestroy(); // force destroy of the DT before we reset it
         $(this.sTbody).html(sHTML);

         let dth = $(window).height() - 240;
         $(this.sTable).DataTable({
             scrollY: dth,
            scrollCollapse: true,
            fixedHeader: true,
            paging: false,
            sorting: false,
            info: false,
            destroy: true
         });
        oWorksheetConfig.GetCount();
        oWorksheetConfig.CheckValidateFields();
        AtlasUtilities.HideLoadingAnimation();
    }
    , RowVendorDetails : function(iVendor,iVendorID)
    {
        let oVendor = []
        let i = 0;
        oVendor[i] = oWorksheetConfig.objVCache[iVendorID];
        let sVendorName = (oVendor[i].TaxName !== '') ? oVendor[i].TaxName : oVendor[i].PrintOncheckAS;

        var sHTMLTemplate = "";
        //for (var i = 0; i < oVendor.length; i++) {
        //    switch(iVendorID)
        //    {
        //        case oVendor[i].VendorID :
                    sHTMLTemplate += '<tr class="' + this.NoTaxId(oVendor[i].TaxID) + '" name="' + oVendor[i].VendorID + '">';
                    //sHTMLTemplate += '<td class="merged-cell" >'
                    //    + '<select class="form-control inline" id="ddlStatus_${iVendorID}"><option value="1099">1099</option><option value="Correction">Correction</option><option value="Void">Void</option></select> '
                    //    + '</td>';
// The above should work, but it does not. Bug in dataTables lib???
                    sHTMLTemplate += `<td colspan="10" class="merged-cell" ><b>
                        <select class="form-control inline" id="ddlStatus_${iVendorID}"><option value="1099">Print 1099</option><option value="CORRECTED">CORRECTED</option><option value="VOID">VOID</option><option value=""></option></select>`;
                    sHTMLTemplate += `${oWorksheetConfig.RenderVendorDetails(sVendorName, oVendor[i].W9Address1, oVendor[i].W9Address2, oVendor[i].W9Address3, oVendor[i].W9City, oVendor[i].W9State, oVendor[i].W9Zip, oVendor[i].W9Country, oVendor[i].Type, oVendor[i].TaxID)}`;
                    sHTMLTemplate += `<span id="lblVendorName_${iVendorID}" phone="${oVendor[i].VendorPhone}" class="atlas-hide">${sVendorName}</b></td>`;
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblAddress1_' + iVendorID + '"><b>' + oVendor[i].W9Address1 + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblAddress2_' + iVendorID + '"><b>' + oVendor[i].W9Address2 + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblAddress3_' + iVendorID + '"><b>' + oVendor[i].W9Address3 + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblCity_' + iVendorID + '"><b>' + oVendor[i].W9City + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblState_' + iVendorID + '"><b>' + oVendor[i].W9State + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblZip_' + iVendorID + '"><b>' + oVendor[i].W9Zip + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblCountry_' + iVendorID + '"><b>' + oVendor[i].W9Country + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblType_' + iVendorID + '"><b>' + oVendor[i].Type + '</b></span></td>';
                    sHTMLTemplate += '<td class="merged-cell atlas-hide" ><span id="lblTaxID_' + iVendorID + '"><b>' + oVendor[i].TaxID + '</b></span></td>';
                    sHTMLTemplate += '</tr>';
                    this.sVendorName = sVendorName;
        //   }
        //}
        return sHTMLTemplate;
       
    }   
    , RowTransDetails: function (oTransaction,index)
    {
        var sHTMLTemplate = ""; var source = []; var states = ""; var desc = ""; var taxcode = []; 

        if ($('#ddlSource').val() != null && $('#btnApply').text() == "UnApply") { source = $('#ddlSource').val(); } else { source.push(oTransaction.Source); }
        if ($('#ddlWorkState').val() != 0 && $('#btnApply').text() == "UnApply") { states = $('#ddlWorkState').val(); } else { states = oTransaction.WorkState; }
        if ($('#ddlTaxCode').val() != null && $('#btnApply').text() == "UnApply") { taxcode = $('#ddlTaxCode').val(); } else { taxcode.push(oTransaction.TaxCode); }
        if ($('#txtDescription').val() != "" && $('#btnApply').text() == "UnApply") { desc = $('#txtDescription').val(); } else { desc = oTransaction.Description; }

        if ($.inArray(oTransaction.Source, source) > -1 && states == oTransaction.WorkState && $.inArray(oTransaction.TaxCode, taxcode) > -1 && oTransaction.Description.toLowerCase().indexOf(desc.toLowerCase()) > -1) {

            sHTMLTemplate += '<tr class="clsTransaction '+oTransaction.WorkState+'" id=' + index + '  name="' + oTransaction.VendorID + '"  JournalEntryDetailID="' + oTransaction.JournalEntryDetailID + '" JournalEntryID="' + oTransaction.JournalEntryID + '">';
                //sHTMLTemplate += '<td></td>';
                sHTMLTemplate += '<td> <span id="lblPaymentDt_' + index + '">' + this.IsDetailsExist(this.setDateFormat(oTransaction.PaymentDate), oTransaction.PaymentNumber, oTransaction.VendorID) + '</span></td>';
                sHTMLTemplate += '<td><span id="lblPaymentNo_' + index + '">' + this.IsDetailsExist(oTransaction.PaymentNumber, this.setDateFormat(oTransaction.PaymentDate), oTransaction.VendorID) + '</span></td>';
                sHTMLTemplate += '<td><span id="lblInvoiceNo_' + index + '">' + oTransaction.InvoiceNumber + '</span></td>';
                sHTMLTemplate += '<td><span id="lblSource_' + index + '">' + oTransaction.Source + '</span></td>';
                sHTMLTemplate += '<td>' + oWorksheetConfig.SetTaxYear('ddlTaxYear_' + index, oTransaction.TransactionYear, oWorksheetConfig.oTaxYears, oWorksheetConfig.isShowTaxYear, oTransaction.VendorID + oTransaction.PaymentNumber, oTransaction.JournalEntryID) + '</td>';
                sHTMLTemplate += '<td>' + oWorksheetConfig.SetWorkState('ddlWorkState_' + index, oTransaction.WorkState, oWorksheetConfig.oWorkState) + '</td>';
                sHTMLTemplate += '<td><span id="lblAccountCode_' + index + '">' + oTransaction.AccountCode + '</span></td>';
                sHTMLTemplate += '<td><span id="lblDescription_' + index + '">' + oTransaction.Description + '</span></td>';
                sHTMLTemplate += '<td><input type="text" id="txtTaxCode_' + index + '" class="form-control clsTaxCode_' + index + ' width40"  onfocus="oWorksheetConfig.TaxCodeAutoComplete(' + index + ');"  value="' + oWorksheetConfig.ReplaceEmpty(oTransaction.TaxCode) + '" onblur="oWorksheetConfig.CheckValidateFields();" taxid="' + oWorksheetConfig.GetTaxCodeId(oTransaction.TaxCode) + '"/></td>';
                sHTMLTemplate += '<td><span class="floatLight">$</span><span class="floatRight" id="lblTotal_' + index + '">' + numeral(this.CalculateAmount(oTransaction.DebitAmount, oTransaction.CreditAmount)).format('#,###.##') + '</span></td>';
                //sHTMLTemplate += '<td><span class="floatLight">$</span><span class="floatRight" id="lblTotal_' + index + '">' + numeral(this.CalculateAmount(oTransaction.DebitAmount, oTransaction.CreditAmount)).format('#,###.##') + '</span></td>';
                sHTMLTemplate += '</tr>';

                this.AmountSubTotal(this.CalculateAmount(oTransaction.DebitAmount, oTransaction.CreditAmount));
                return sHTMLTemplate;
        }

    }
    , IsDetailsExist: function (sPaymentdetail,sPayData,sVendorId) {

         var item = "";
         if ($.inArray(sPaymentdetail + "-" + sPayData + "-" + sVendorId, oWorksheetConfig.oPaymentExist) == -1) {

             item = sPaymentdetail; oWorksheetConfig.isShowTaxYear = true;
             oWorksheetConfig.oPaymentExist.push(sPaymentdetail + "-" + sPayData + "-" + sVendorId);
         }
         else {
             item = ""; oWorksheetConfig.isShowTaxYear = false;
         }
         return item;
     }
    ,ReplaceEmpty : function(val)
    {
        var item = "";
        if (val != null) { item = val; }

        return item;
    }
    ,SetTaxYear : function(dropdown, setvalue, oValues,isHide,sGroup, JEID)
    {
        var option = "", select = "";
        $.each(oValues, function (key, value) {
            if (setvalue == value) {
                option +=  "<option selected='true' value='" + value + "'>" + value + "</option>";
            } else {
                option += "<option  value=" + value + ">" + value + "</option>";
            }
        });

        if (isHide === false) {
            select = `<select id="${dropdown}" vendorid="${sGroup}" jeid="${JEID}" class="form-control atlas-hide  taxyeargroup_${sGroup}">${option}</select>`;
            //select = "<select id=" + dropdown + " vendorid=" + sGroup + " class='form-control atlas-hide  taxyeargroup_" + sGroup + "'>" + option + "</select>";
        } else {
            select = `<select id="${dropdown}" vendorid="${sGroup}" jeid="${JEID}" class="form-control taxyeargroup" onchange='oWorksheetConfig.OnChangeTaxYear(this);'>${option}</select>`;
            //select = "<select id=" + dropdown + " onchange='oWorksheetConfig.OnChangeTaxYear(this);' class='form-control taxyeargroup' vendorid=" + sGroup + ">" + option + "</select>";
        }
        return select;  

    }
    ,RenderVendorDetails: function (VendorName, W9Address1, W9Address2, W9Address3, W9City, W9State, W9Zip, W9Country, Type, TaxID)
    {
        var vendordetails = "";

        if (VendorName != "") { vendordetails += VendorName + " (" }
        if (W9Address1 != "") { vendordetails += W9Address1 + " " }
        if (W9Address2 != "") { vendordetails += W9Address2 + " " }
        if (W9Address3 != "") { vendordetails += W9Address3 + " " }
        if (W9City != "") { vendordetails += W9City + ", " }
        if (W9State != "") { vendordetails += W9State + " " }
        if (W9Zip != "") { vendordetails += W9Zip + " " }
        if (W9Country != "") { vendordetails += W9Country + ") Type: " }
        if (Type != "") { vendordetails += Type + " " }
        if (TaxID != "") { vendordetails += TaxID + " " }

        return vendordetails.trim().replace(/^,|,$/g, '');
    }
    , OnChangeTaxYear : function(item) {
        $(item.parentElement.parentElement).addClass('DELTA'); // Make this row a delta

        $(".taxyeargroup_" + $(item).attr('vendorid')).each(
            function () {
                $(this).val($(item).val());
        });
        $(`select[jeid=${$(item).attr('jeid')}]`)
        .each(
            function () {
                $(this).val($(item).val());
        });
    }
    , SetWorkState: function (dropdown, setvalue, oValues) {
         var option = "";
         $.each(oValues, function (key, value) {

             if (value.StateCode.replace("US-", "") == setvalue) {
                 option += "<option selected='true' value=" + value.StateID + ">" + value.StateCode.replace("US-", "") + "</option>";
             }
             else {
                 option += "<option value=" + value.StateID + ">" + value.StateCode.replace("US-", "") + "</option>";
             }
         });
         var select = "<select id=" + dropdown + " class='form-control' onchange='oWorksheetConfig.OnChangeWorkState(this);'>" + option + "</select>";
         return select;
    }
    , OnChangeWorkState: function (objState) {
        $(objState.parentElement.parentElement).addClass('DELTA'); // Make this row a delta
    }
    ,RowTransTotal: function (iTotal,sVendor) {
         var sHTMLTemplate = "";

         sHTMLTemplate += '<tr>';
         //sHTMLTemplate += '<td></td>';
         sHTMLTemplate += '<td></td>';
         sHTMLTemplate += '<td></td>';
         sHTMLTemplate += '<td></td>';
         sHTMLTemplate += '<td></td>';
         sHTMLTemplate += '<td></td>';
         sHTMLTemplate += '<td></td>';
         sHTMLTemplate += '<td></td>';
         //sHTMLTemplate += '<td><b>Total</b></td>';
         sHTMLTemplate += '<td colspan="2" class="bordert-top-bot"><b>' + sVendor + '</b></td>';
         sHTMLTemplate += '<td style="display:none"></td>';
         sHTMLTemplate += '<td class="bordert-top-bot col-amnt-width"><span class="floatLight">$</span><span class="floatRight">' + numeral(iTotal).format('#,###.##') + '</span></td>';
         sHTMLTemplate += '</tr>';

       
         return sHTMLTemplate;
     }
    ,AmountSubTotal : function(iAmount)
    {
        this.iSubTotal = (parseFloat(this.iSubTotal) + parseFloat(iAmount)).toFixed(2);
    }
    ,AmountTotal: function (iSubTotal) {

        this.iTotal = (parseFloat(this.iTotal) + parseFloat(iSubTotal)).toFixed(2);
        //console.log(this.iTotal);
    }
    ,CalculateAmount: function (iDebit, iCredit) {
        var iAmount = 0;
        iAmount = iDebit - iCredit;
        return iAmount.toFixed(2);
    }
    ,NoTaxId: function (sTaxid) {

        var sTaxCode = "";

        if (sTaxid != "")
        {
            sTaxCode = 'vendorgroup vendordetails';
        }
        else {
            sTaxCode = 'no-taxid vendordetails';
        }        
        return sTaxCode;
    }
    ,setDateFormat : function(date)
    {
        return dateFormat(date, 'mm-dd-yyyy'); // Use dateFormat function from global: utilities.js
        //var dt = new Date(date);
        //var day = dt.getDate();
        //var month = dt.getMonth();
        //var year = dt.getFullYear();

        //return month + '-' + day + '-' + year;
    },
    ClearFilters : function()
    {

        $('#btnApply').text("Apply"); $("#tabToolbar").removeClass("filter-applied");
        $('#txtPayDtFrom').val("");
        $('#txtAccountFrom').val("");
        $('#txtPayNumber').val("");
        $('#txtAmount').val("");
        $('#txtInvoice').val("");
        $('#ddlSource option:selected').each(function () {
            $(this).prop('selected', false);
        });
        $("#ddlSource").multiselect('rebuild');
        $('#ddlSource').next().find('button').text('Select options');
        $('#txtPayDtTo').val("");
        $('#txtAccountTo').val("");

        //$('#txtAccountTo').val("");
        //$('#txtAmountTo').val("");
        //$('#ddlWorkState option:selected').each(function () {
        //    $(this).prop('selected', false);
        //});
        $('#ddlWorkState').val(0);
        $('.taxyear').val(localStorage.TY1099);
        $('#txtDescription').val("");
        $('#ddlTaxCode option:selected').each(function () {
            $(this).prop('selected', false);
        });
        $("#ddlTaxCode").multiselect('rebuild');
        $('#ddlTaxCode').next().find('button').text('Select options');
        $('#chkTotal').attr('checked', false);
        $('#chkwith1099').attr('checked', false);
        $('#chkWithout1099').attr('checked', false);
        $('#chkAll').attr('checked', false);
        $('#chkAll').prop("disabled", false);
        $('#chkwith1099').prop("disabled", false);
        $('#chkWithout1099').prop("disabled", false);
        $('#chkTotal').prop("disabled", false);
        oWorksheetConfig.SetFilters();
    }
    , CreateTransactionLineObj: function () {
         var oTransactionLine = [];
         var table = $("#tblTransBody").find(".clsTransaction.DELTA");

         table.each(function (i, el) {
             let id = el.id;
             var JournalEntryDetailID = $(this).attr("JournalEntryDetailID");
             var JournalEntryID = $(this).attr("JournalEntryID");
             var TaxWorkState = $("#ddlWorkState_" + id).find("option:selected").text();
             var TaxYear = $("#ddlTaxYear_" + id).val();
             var TaxCode = null;
             if ($('#txtTaxCode_'+id).val() != "") { TaxCode = $("#txtTaxCode_" + id).attr("taxid"); }            
             var TaxfilingID = null;
             var VendorId = $(this).attr("name");
             if ($("#ddlTaxYear_" + id).val() == localStorage.TY1099) { TaxfilingID = localStorage.TaxFillingId; }

             var oTransactionsItems = {
                 "JournalEntryID": JournalEntryID
                 , "TaxfilingID": TaxfilingID
                  ,"JournalEntryDetailID": JournalEntryDetailID
                  , "TaxWorkState": TaxWorkState
                  , "TaxYear": TaxYear
                  , "TaxCodeID_Original": null
                  , "TaxCodeID_Edit": TaxCode
                  , "TaxCodeLineID": 1
                  , "TaxCodeEdit_Description": null
                  , "TaxCodeEdit_Amount": null
                  , "VendorID": VendorId
             };

             oTransactionLine.push(oTransactionsItems);
         });

         return oTransactionLine;
    }
     , SortById: function (a, b) {
         var aId = a.JournalEntryID;
         var bId = b.JournalEntryID;
         return ((aId < bId) ? -1 : ((aId > bId) ? 1 : 0));
     }
    ,CreateTransactionObj : function() {
        var oTransactions = [], oTransLine = [],lineitems = {}, tempJEID = "", tempYear = "", tempTaxFillingId = "";
        var oTempTransLine = oWorksheetConfig.CreateTransactionLineObj();
       
        oTempTransLine = oTempTransLine.sort(this.SortById);

        $.each(oTempTransLine, function (i, val) {
            var JournalEntryDetailID = val.JournalEntryDetailID;
            var JournalEntryID = val.JournalEntryID;
            var TaxWorkState = val.TaxWorkState;
            var TaxfilingID = val.TaxfilingID;
            var TaxYear = val.TaxYear;
            let VendorID = val.VendorID;

            if (tempJEID != JournalEntryID && oTransLine.length > 0) {
                var oTransactionsItems = {
                    "JournalEntryID": tempJEID
                       , "TaxfilingID": tempTaxFillingId
                       , "TaxYear": tempYear
                       , "TransactionLines": oTransLine
                };

                oTransactions.push(oTransactionsItems);
                oTransLine = []; tempYear = "";
            }

            lineitems = {
                "JournalEntryDetailID": JournalEntryDetailID
                 , "TaxWorkState": TaxWorkState
                 , "TaxCodeID_Original": null
                 , "TaxCodeID_Edit": val.TaxCodeID_Edit
                 , "TaxCodeLineID": 1
                 , "TaxCodeEdit_Description": null
                 , "TaxCodeEdit_Amount": null
                 , "VendorID": VendorID
            }
            
            oTransLine.push(lineitems);
            tempJEID = JournalEntryID; tempYear = TaxYear; tempTaxFillingId = TaxfilingID;

            if(oTempTransLine.length-1 == i) {
                var oTransactionsItems = {
                    "JournalEntryID": tempJEID
                      , "TaxfilingID": tempTaxFillingId
                      , "TaxYear": tempYear
                      , "TransactionLines": oTransLine
                };

                oTransactions.push(oTransactionsItems);
                oTransLine = []; tempYear = "";
            } 
        });

        return oTransactions;
    }
    , CreateVendorObj: function () {

        var oVendors = [];

        var table = $("#tblTransBody").find(".vendorgroup");

        table.each(function (i, el) {

            var VendorId = $(this).attr("name");
            var VendorName = $("#lblVendorName_" + VendorId).text();
            var Address1 = $("#lblAddress1_" + VendorId).text();
            var Address2 = $("#lblAddress2_" + VendorId).text();
            var Address3 = $("#lblAddress3_" + VendorId).text();
            var City = $("#lblCity_" + VendorId).text();
            var State = $("#lblState_" + VendorId).text();
            var Zip = $("#lblZip_" + VendorId).text();
            var Country = $("#lblCountry_" + VendorId).text();
            var Type = $("#lblType_" + VendorId).text();
            var TaxID = $("#lblTaxID_" + VendorId).text();
            var Status = $("#ddlStatus_" + VendorId).find("option:selected").text();

            var oVendorItems = {
                "VendorID": VendorId
                , "VendorName": VendorName
                , "VendorAddress": {
                    "Address1": Address1
                    , "Address2": Address2
                    , "Address3": Address3
                    , "City": City
                    , "State": State
                    , "PostalCode": Zip
                    , "Country": Country
                    , "VendorType": Type
                    , "TIN": TaxID
                }
                , "1099Status": Status
            };

            oVendors.push(oVendorItems);
        });

        return oVendors;
    }
    ,CreateWorksheetObj: function () {
        oWorksheetConfig.oVendors = oWorksheetConfig.CreateVendorObj();
        oWorksheetConfig.oTransactions = oWorksheetConfig.CreateTransactionObj();

        var dtTransDate = new Date();
        var Worksheet = {
            "Worksheet" : {
                  "TaxFilingID": localStorage.TaxFillingId
                , "ProdID": localStorage.ProdId
                , "TaxYear": localStorage.TY1099
                , "CompanyID": localStorage.CompanyID
                , "ProcessStatus": 1
                , "FilingType": 1
                , "FilingStatus": 1
                , "FilingDate": null
                , "Modifiedby": localStorage.UserId
                , "ModifiedDate": dtTransDate
                , "CurrentUserID": localStorage.UserId
                , "CurrentUserDate": dtTransDate
                , "CompletedDate": null
                , "Vendors": oWorksheetConfig.oVendors
                , "Transactions": oWorksheetConfig.oTransactions
          }
        }

        return Worksheet;
     }
     ,CheckValidateFields : function()
     {
         var table = $("#tblTransBody").find(".clsTransaction");
         table.each(function (i, el) {

             var TaxWorkState = $("#ddlWorkState_" + i).find("option:selected").text();
             var TaxYear = $("#ddlWorkState_" + i).find("option:selected").text();
             var TaxCode = $("#txtTaxCode_" + i).
                 val();

             if (TaxWorkState == "") { $("#ddlWorkState_" + i).addClass("field-Req") } else { $("#ddlWorkState_" + i).removeClass("field-Req") }
             if (TaxYear == "") { $("#ddlWorkState_" + i).addClass("field-Req") } else { $("#ddlWorkState_" + i).removeClass("field-Req") }
            //if (TaxCode == "") { $("#txtTaxCode_" + i).addClass("field-Req") } else { $("#txtTaxCode_" + i).removeClass("field-Req") }
         });
     }
    , SaveWorksheet : function() {
        //if ($("#tblTransBody").find('.field-Req').length == 0) { // This logic is not specified in the requirements at all
        var InvalidTaxCodeCount = 0;
        $.each($('#tblTransBody tr'), function (i, v) {
            if ($('#txtTaxCode_' + i).val() === undefined) {
                $(this).addClass("field-Req");
            } else{
                var findVal = $('#txtTaxCode_' + i).val();
                var GetElm = $.grep(oWorksheetConfig.oTaxCode, function (v) {
                    return v.value === findVal;
                });

                if (GetElm.length > 0) {
                } else {
                    if (findVal != '') {
                        $('#txtTaxCode_' + i).addClass("field-Req");
                        InvalidTaxCodeCount = 1;
                    }
                }
            }
        });

        if (InvalidTaxCodeCount == 1) {
            $('#tblResult').text("There are entries with invalid tax codes. Please correct them before you continue.");
            $('#SaveSuccess').show();
            return false;
        }
        oWorksheetConfig.oWorksheet = oWorksheetConfig.CreateWorksheetObj();
    //console.log(oWorksheetConfig.oWorksheet);
        if (oWorksheetConfig.oWorksheet.Worksheet.Transactions.length === 0) {
            $('#btnOperation').notify('No changes to save');
        } else {
            var oWorksheet = {
                ProdID: localStorage.ProdId,
                TaxFillingId: localStorage.TaxFillingId,
                sJson: JSON.stringify(oWorksheetConfig.oWorksheet),
                sTaxYear: localStorage.TY1099
            };

            $.ajax({
                url: this.URL_SAVETRANSDETAILS
            , cache: false
            , beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            }
            , type: 'POST'
            , data: JSON.stringify(oWorksheet)
            , contentType: 'application/json; charset=utf-8'
            })
            .done(function (response) {

                var itemResponse = JSON.parse(response);
                if (itemResponse[0].Action == "UPDATE") {
                    $('#tblResult').text("Worksheet Updated Successfuly.");
                }
                else if (itemResponse[0].Action == "INSERT") {

                    $('#tblResult').text("Worksheet Saved Successfuly.");
                }
                $('#SaveSuccess').show();
                $('#fade').show();
                $('#btnSaveOK').focus();
                oWorksheetConfig.TransactionsFilters = [];
                oWorksheetConfig.oTransacitionDetails = [];
                oWorksheetConfig.oVendorDetails = [];
                oWorksheetConfig.oTaxYears = [];
                oWorksheetConfig.oWorkState = [];
                oWorksheetConfig.TaxCode1099 = [];
                oWorksheetConfig.oTaxCode = [];
                oWorksheetConfig.colId = [];
                oWorksheetConfig.count = 0;
                oWorksheetConfig.iSubTotal = 0;
                oWorksheetConfig.iTotal = 0;
                oWorksheetConfig.sVendorName = "";
                oWorksheetConfig.oWorksheet = [];
                oWorksheetConfig.oVendors = [];
                oWorksheetConfig.oTransactions = [];
                oWorksheetConfig.oTransactionLine = [];
                oWorksheetConfig.oPaymentExist = [];
                $(oWorksheetConfig.sTbody).html('');
                oWorksheetConfig.BindTaxCode(true);

            })
            .fail(function (error) {
                console.log(error);
            });
        }
    }
    , SucessOk : function()
    {
        $('#SaveSuccess').hide();
        $('#fade').hide();
    }
    ,PrintIRS : function()
    {
        var oVendors = [];
        var table = $("#tblTransBody").find(".vendordetails");

        table.each(function (i, el) {

            var VendorId = $(this).attr("name");
            var VendorName = $("#lblVendorName_" + VendorId).text();
            var Address1 = $("#lblAddress1_" + VendorId).text();
            var Address2 = $("#lblAddress2_" + VendorId).text();
            var Address3 = $("#lblAddress3_" + VendorId).text();
            var City = $("#lblCity_" + VendorId).text();
            var State = $("#lblState_" + VendorId).text();
            var Zip = $("#lblZip_" + VendorId).text();
            var Country = $("#lblCountry_" + VendorId).text();
            var Type = $("#lblType_" + VendorId).text();
            var TaxID = $("#lblTaxID_" + VendorId).text();
            var Status = $("#ddlStatus_" + VendorId).val();

            var oVendorItems = {
                "VendorID": VendorId
                , "VendorName": VendorName
                , "Address1": Address1
                , "Address2": Address2
                , "Address3": Address3
                , "City": City
                , "State": State
                , "PostalCode": Zip
                , "Country": Country
                , "VendorType": Type
                , "TIN": TaxID
                , "PrintStatus": Status
                , "TaxCodes": oWorksheetConfig.TaxCodeSummarybyVendorID(VendorId)
            };
            
            oVendors.push(oVendorItems);
        });
        let oCompany = {
            "CompanyName":  oWorksheetConfig.oCompanyDetails.CompanyName
            , "CompAddress1":  oWorksheetConfig.oCompanyDetails.Address1
            , "CompAddress2":  oWorksheetConfig.oCompanyDetails.Address2
            , "CompAddress3":  oWorksheetConfig.oCompanyDetails.Address3
            , "CompCity":  oWorksheetConfig.oCompanyDetails.City
            , "CompState":  oWorksheetConfig.oCompanyDetails.State
            , "CompCountry":  oWorksheetConfig.oCompanyDetails.Country
            , "CompZip":  oWorksheetConfig.oCompanyDetails.Zip
            , "CompanyPhone": oWorksheetConfig.oCompanyDetails.CompanyPhone
            , "CompanyEIN": oWorksheetConfig.oCompanyDetails.EIN
        }

        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify(oVendors);
        APIName = 'URL_IRSPrintPDF';
        let RE = new ReportEngine(this.URL_IRSPrintPDF);
        RE.ReportTitle = '1099 TY: ' + oWorksheetConfig.TaxYear;
        RE.callingDocumentTitle = 'Worksheet 1099';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckRun = JSONParameters;
        RE.FormJSON.CompanyDetails = oCompany;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.UserId = localStorage.UserId;
        RE.setcallback('Run', function () {
            //$('#worksheet').hide();
        });
        RE.setcallback('Close', function () {
            $('#worksheet').show();
        });
        RE.setcallback('Print', function () {
            $('#worksheet').show();
        });
        RE.PDFViewer = true;
        RE.RunReport({ DisplayinTab: false });
        G_RE = RE;
        return;

        $.ajax({
            url: this.URL_IRSPrintPDF,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'post',
            contentType: 'application/json; charset=utf-8',
        })
       .done(function (response) {
           oWorksheetConfig.PDFSucess(response);
       })
       .fail(function (error)

        {  });
    }
    ,PDFSucess :function(FileName) {
        if (FileName == '')
        {
            alert('Data not found for given Values.');
        } else {
           
            var fileName = FileName + ".pdf";
            console.log(fileName);
            GlobalFile = fileName;
            $('#dialog11').attr('style', 'width:100%;height:' + $(window).height() - 240 + 'px;display:none;');
            var FILECompleteName = 'BankingPDF/' + fileName;    
            $('#dvFilterDv').attr('style', 'display:none');
            var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
            DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF();" id="btnPrint">Print</a>';
            DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
            $('#dialog11').html(DialogContent);      
        }
       
    }
    ,GetCompanyDetail: function () {
         $.ajax({
             url: this.URL_GETCompanyDetail + '?CompanyID=' + localStorage.CompanyID,
             cache: false,
             beforeSend: function (request) {
                 request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
             },
             type: 'GET',
             contentType: 'application/json; charset=utf-8',
         })
         .done(function (response) {
             oWorksheetConfig.CompanyDetailSucess(response);
         })
     }
    , CompanyDetailSucess: function (response) {
        //for (var i = 0; i < response.length; i++) { // We should ONLY be receiving a single record!
            oWorksheetConfig.oCompanyDetails.CompanyName = response[0].CompanyName;
            oWorksheetConfig.oCompanyDetails.Address1 = response[0].Address1;
            oWorksheetConfig.oCompanyDetails.Address2 = response[0].Address2;
            oWorksheetConfig.oCompanyDetails.Address3 = response[0].Address3;
            oWorksheetConfig.oCompanyDetails.City = response[0].City;
            oWorksheetConfig.oCompanyDetails.State = response[0].State;
            oWorksheetConfig.oCompanyDetails.Country = response[0].Country;
            oWorksheetConfig.oCompanyDetails.Zip = response[0].Zip;
            oWorksheetConfig.oCompanyDetails.CompanyPhone = response[0].CompanyPhone;
            oWorksheetConfig.oCompanyDetails.EIN = response[0].EIN;
        //}
    }
    ,OnChangePowerButton : function(element)
    {
        var ddlPowerButton = $(element);
        $('#btnOperation').text(ddlPowerButton.text());        
    }
    ,OnClickPowerButton : function(element)
    {
        var Opertation = $(element).text();
        switch(Opertation)
        {
            case "Print Worksheet": break;
            case "Print Summary Report": break;
            case "Print 1099's": oWorksheetConfig.PrintIRS(); break;
            case "Generate IRS FIRE File": break;
            case "Save Worksheet": oWorksheetConfig.SaveWorksheet();  break;
        }
    },
    OnTransactionChange : function(element,chk1,chk2,type)
    {
                if ($(element).is(':checked')) {
                    $(chk1).prop("checked", false); $(chk2).prop("checked", false); $(chk1).prop("disabled", true); $(chk2).prop("disabled", true);
                }
                else {
                    $(chk1).prop("checked", false); $(chk2).prop("checked", false); $(chk1).prop("disabled", false); $(chk2).prop("disabled", false);
                }
    },
    VendorSetupReports: function () {

        var oVendorDetails = [];

        var sWorkState = "", sPayment = "", sAmount = "", sInvoice = "", sTaxcode = "", sVendors = "", sVendorsTotal = "", sPamentDate = "", sSource = "", sAccount = "", VendorType;
       
        var table = $("#tblTransBody").find(".vendordetails");
        table.each(function (i, el) {

            var hasTran = $(this).next().first().attr("name");
            var VendorId = $(this).attr("name");

            if (VendorId == hasTran) {

                var VendorName = $("#lblVendorName_" + VendorId).text();
                var Address1 = $("#lblAddress1_" + VendorId).text();
                var Address2 = $("#lblAddress2_" + VendorId).text();
                var Address3 = $("#lblAddress3_" + VendorId).text();
                var City = $("#lblCity_" + VendorId).text();
                var State = $("#lblState_" + VendorId).text();
                var Zip = $("#lblZip_" + VendorId).text();
                var Country = $("#lblCountry_" + VendorId).text();
                var Type = $("#lblType_" + VendorId).text();
                var TaxID = $("#lblTaxID_" + VendorId).text();
                var Status = $("#ddlStatus_" + VendorId).val();
                var Phone = $("#lblVendorName_" + VendorId).attr("phone");

                var oVendorItems = {

                    "VendorID": VendorId
                    , "VendorName": VendorName
                    , "Address1": Address1
                    , "Address2": Address2
                    , "Address3": Address3
                    , "City": City
                    , "State": State
                    , "PostalCode": Zip
                    , "Country": Country
                    , "VendorType": Type
                    , "TIN": TaxID
                    , "PrintStatus": Status
                    , "TaxCodes": oWorksheetConfig.TaxCodeSummarybyVendorID(VendorId)
                    , "Phone": Phone

                };

                oVendorDetails.push(oVendorItems);
            }
        });

          

        if ($("#ddlWorkState").val() != "0") { sWorkState = $("#ddlWorkState").val(); } else { sWorkState = "ALL" }
        if ($("#txtPayNumber").val() != "") { sPayment = $("#txtPayNumber").val(); } else { sPayment = "ALL" }
        if ($("#txtAmount").val() != "") { sAmount = $("#txtAmount").val(); } else { sAmount = "ALL" }
        if ($("#txtInvoice").val() != "") { sInvoice = $("#txtInvoice").val(); } else { sInvoice = "ALL" }
        if ($("#chkTotal").prop("checked") == true) { sVendorsTotal = "($600 +)"; } else { sVendorsTotal = ""; }
        if ($("#txtPayDtFrom").val() != "" && $("#txtPayDtTo").val() != "") { sPamentDate = $("#txtPayDtFrom").val() + " To " + $("#txtPayDtTo").val(); } else { sPamentDate = "ALL"; }
        if ($("#txtAccountFrom").val() != "" && $("#txtAccountTo").val() != "") { sAccount = $("#txtAccountFrom").val() + " To " + $("#txtAccountTo").val(); } else { sAccount = "ALL"; }

        if ($("#chkwith1099").prop("checked") == true) { sVendors = "w/1099"; } 
        else if($("#chkWithout1099").prop("checked") == true) { sVendors = "w/o 1099"; } else { sVendors = "ALL"; }
        
        sVendors = sVendors + " " + sVendorsTotal;

        if ($("#ddlSource").val() != null) {
            $.each($("#ddlSource").val(), function (index, value) {
                sSource += value + ", ";
            });
        }

        if ($("#ddlTaxCode").val() != null) {
                $.each($("#ddlTaxCode").val(), function (index, value) {
                    sTaxcode += value + ", ";
                });
        }
        
        sTaxcode = sTaxcode.trim().replace(/^,|,$/g, '');
        sSource = sSource.trim().replace(/^,|,$/g, '');

        var oComapanyItems = {
            "Company": localStorage.CompanyName,
            "CompanyName": oWorksheetConfig.oCompanyDetails.CompanyName
           , "TaxYear": oWorksheetConfig.TaxYear
           , "WorkState": sWorkState
           , "Payment": sPayment
           , "Amount": sAmount
           , "Invoice": sInvoice
           , "Taxcode": sTaxcode
           , "Source": sSource
           , "VendorTotal": sVendors
           , "PaymentDate": sPamentDate
           , "Account": sAccount
        }

        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify(oVendorDetails);
        APIName = 'URL_VendorSETUP';
        let RE = new ReportEngine(this.URL_VendorSETUP);
        RE.ReportTitle = '1099 Vendor Setup Report TY: ' + oWorksheetConfig.TaxYear;
        RE.callingDocumentTitle = 'Vendor Setup Report';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckRun = JSONParameters;
        RE.FormJSON.ComapanyItems = oComapanyItems;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        G_RE = RE;
       
    },
    PrintWorkSheet: function () {

        var oVendorDetails = []; var oTransactions = []; var Total = 0; var SubTotal = 0;

        var sWorkState = "", sPayment = "", sAmount = "", sInvoice = "", sTaxcode = "", sVendors = "", sVendorsTotal = "", sPamentDate = "", sSource = "", sAccount = "", VendorType;

        var table = $("#tblTransBody").find(".vendordetails");
        table.each(function (i, el) {

            var hasTran = $(this).next().first().attr("name");
            var VendorId = $(this).attr("name");

            SubTotal = 0;  oTransactions = [];

            if (VendorId == hasTran) {

                var VendorName = $("#lblVendorName_" + VendorId).text();
                var Address1 = $("#lblAddress1_" + VendorId).text();
                var Address2 = $("#lblAddress2_" + VendorId).text();
                var Address3 = $("#lblAddress3_" + VendorId).text();
                var City = $("#lblCity_" + VendorId).text();
                var State = $("#lblState_" + VendorId).text();
                var Zip = $("#lblZip_" + VendorId).text();
                var Country = $("#lblCountry_" + VendorId).text();
                var Type = $("#lblType_" + VendorId).text();
                var TaxID = $("#lblTaxID_" + VendorId).text();
                var Status = $("#ddlStatus_" + VendorId).val();
                var Phone = $("#lblVendorName_" + VendorId).attr("phone");

                var tableTrans = $("#tblTransBody").find('.clsTransaction')
                tableTrans.each(function (j, el) {
                    
                    if ($(this).attr('name') == VendorId) {

                        var id = $(this).attr('id');

                        var Date = $("#lblPaymentDt_" + id).text();
                        var Payment = $("#lblPaymentNo_" + id).text();
                        var Invoice = $("#lblInvoiceNo_" + id).text();
                        var Source = $("#lblSource_" + id).text();
                        var TaxYear = $("#ddlTaxYear_" + id).val();
                        var WorkState = $("#ddlWorkState_" + id + " option:selected").text();
                        var Account = $("#lblAccountCode_" + id).text();
                        var Description = $("#lblDescription_" + id).text();
                        var TaxCode = $("#txtTaxCode_" + id).val();
                        var Amount = $("#lblTotal_" + id).text().replace(",", '');

                        SubTotal = (parseFloat(SubTotal) + parseFloat(Amount)).toFixed(2);
                   
                        var tran = {

                            "Date": Date
                            , "Payment": Payment
                            , "Invoice": Invoice
                            , "Source": Source
                            , "TaxYear": TaxYear
                            , "WorkState": WorkState
                            , "Account": Account
                            , "Description": Description
                            , "TaxCode": TaxCode
                            , "Amount": Amount
                        };

                        oTransactions.push(tran);
                    }
                 
                });

                var oVendorItems = {

                    "VendorID": VendorId
                    , "VendorName": VendorName
                    , "Address1": Address1
                    , "Address2": Address2
                    , "Address3": Address3
                    , "City": City
                    , "State": State
                    , "PostalCode": Zip
                    , "Country": Country
                    , "VendorType": Type
                    , "TIN": TaxID
                    , "PrintStatus": Status
                    , "TaxCodes": oWorksheetConfig.TaxCodeSummarybyVendorID(VendorId)
                    , "Phone": Phone
                    , "Transactions": oTransactions
                    , "Total": SubTotal
                };

                Total = (parseFloat(Total) + parseFloat(SubTotal)).toFixed(2);

                oVendorDetails.push(oVendorItems);
            }
        });

        if ($("#ddlWorkState").val() != "0") { sWorkState = $("#ddlWorkState").val(); } else { sWorkState = "ALL" }
        if ($("#txtPayNumber").val() != "") { sPayment = $("#txtPayNumber").val(); } else { sPayment = "ALL" }
        if ($("#txtAmount").val() != "") { sAmount = $("#txtAmount").val(); } else { sAmount = "ALL" }
        if ($("#txtInvoice").val() != "") { sInvoice = $("#txtInvoice").val(); } else { sInvoice = "ALL" }
        if ($("#chkTotal").prop("checked") == true) { sVendorsTotal = "($600 +)"; } else { sVendorsTotal = ""; }
        if ($("#txtPayDtFrom").val() != "" && $("#txtPayDtTo").val() != "") { sPamentDate = $("#txtPayDtFrom").val() + " To " + $("#txtPayDtTo").val(); } else { sPamentDate = "ALL"; }
        if ($("#txtAccountFrom").val() != "" && $("#txtAccountTo").val() != "") { sAccount = $("#txtAccountFrom").val() + " To " + $("#txtAccountTo").val(); } else { sAccount = "ALL"; }


        if ($("#chkwith1099").prop("checked") == true) { sVendors = "w/1099"; }
        else if ($("#chkWithout1099").prop("checked") == true) { sVendors = "w/o 1099"; } else { sVendors = "ALL"; }

        sVendors = sVendors + " " + sVendorsTotal;

        if ($("#ddlSource").val() != null) {
            $.each($("#ddlSource").val(), function (index, value) {
                sSource += value + ", ";
            });
        }

        if ($("#ddlTaxCode").val() != null) {
            $.each($("#ddlTaxCode").val(), function (index, value) {
                sTaxcode += value + ", ";
            });
        }

        sTaxcode = sTaxcode.trim().replace(/^,|,$/g, '');
        sSource = sSource.trim().replace(/^,|,$/g, '');

        var oComapanyItems = {
            "Company": localStorage.CompanyName,
            "CompanyName": oWorksheetConfig.oCompanyDetails.CompanyName
           , "TaxYear": oWorksheetConfig.TaxYear
           , "WorkState": sWorkState
           , "Payment": sPayment
           , "Amount": sAmount
           , "Invoice": sInvoice
           , "Taxcode": sTaxcode
           , "Source": sSource
           , "VendorTotal": sVendors
           , "PaymentDate": sPamentDate
           , "Account": sAccount
           , "WorkSheetTotal": Total
        }

        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify(oVendorDetails);
        APIName = 'URL_PrintWorkSheet';
        let RE = new ReportEngine(this.URL_PrintWorkSheet);
        RE.ReportTitle = '1099 WorkSheet Report: ' + oWorksheetConfig.TaxYear;
        RE.callingDocumentTitle = '1099 WorkSheet Report';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckRun = JSONParameters;
        RE.FormJSON.ComapanyItems = oComapanyItems;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        G_RE = RE;

    },
    PrintWorkSheetSummary: function () {

        var oVendorDetails = []; var oTransactions = []; var Total = 0; var SubTotal = 0;

        var sWorkState = "", sPayment = "", sAmount = "", sInvoice = "", sTaxcode = "", sVendors = "", sVendorsTotal = "", sPamentDate = "", sSource = "", sAccount = "", VendorType;

        var table = $("#tblTransBody").find(".vendordetails");
        table.each(function (i, el) {

            var hasTran = $(this).next().first().attr("name");
            var VendorId = $(this).attr("name");

            SubTotal = 0; oTransactions = [];

            if (VendorId == hasTran) {

                var VendorName = $("#lblVendorName_" + VendorId).text();
                var Address1 = $("#lblAddress1_" + VendorId).text();
                var Address2 = $("#lblAddress2_" + VendorId).text();
                var Address3 = $("#lblAddress3_" + VendorId).text();
                var City = $("#lblCity_" + VendorId).text();
                var State = $("#lblState_" + VendorId).text();
                var Zip = $("#lblZip_" + VendorId).text();
                var Country = $("#lblCountry_" + VendorId).text();
                var Type = $("#lblType_" + VendorId).text();
                var TaxID = $("#lblTaxID_" + VendorId).text();
                var Status = $("#ddlStatus_" + VendorId).val();
                var Phone = $("#lblVendorName_" + VendorId).attr("phone");

                var tableTrans = $("#tblTransBody").find('.clsTransaction')
                tableTrans.each(function (j, el) {

                    if ($(this).attr('name') == VendorId) {

                        var id = $(this).attr('id');

                        var WorkState = $("#ddlWorkState_"+id+" option:selected").text();                     
                        var TaxCode = $("#txtTaxCode_" + id).val();
                        var Amount = $("#lblTotal_" + id).text().replace(",", '');

                        SubTotal = (parseFloat(SubTotal) + parseFloat(Amount)).toFixed(2);

                        var tran = {

                            "WorkState": WorkState
                              , "TaxCode": TaxCode
                              , "Amount": Amount
                        };

                        oTransactions.push(tran);
                    }

                });

                var oVendorItems = {

                    "VendorID": VendorId
                    , "VendorName": VendorName
                    , "Address1": Address1
                    , "Address2": Address2
                    , "Address3": Address3
                    , "City": City
                    , "State": State
                    , "PostalCode": Zip
                    , "Country": Country
                    , "VendorType": Type
                    , "TIN": TaxID
                    , "PrintStatus": Status
                    , "TaxCodes": oWorksheetConfig.TaxCodeSummarybyVendorID(VendorId)
                    , "Phone": Phone
                    , "Transactions": oTransactions
                    , "Total": SubTotal
                };

                Total = (parseFloat(Total) + parseFloat(SubTotal)).toFixed(2);

                oVendorDetails.push(oVendorItems);
            }
        });

        if ($("#ddlWorkState").val() != "0") { sWorkState = $("#ddlWorkState").val(); } else { sWorkState = "ALL" }
        if ($("#txtPayNumber").val() != "") { sPayment = $("#txtPayNumber").val(); } else { sPayment = "ALL" }
        if ($("#txtAmount").val() != "") { sAmount = $("#txtAmount").val(); } else { sAmount = "ALL" }
        if ($("#txtInvoice").val() != "") { sInvoice = $("#txtInvoice").val(); } else { sInvoice = "ALL" }
        if ($("#chkTotal").prop("checked") == true) { sVendorsTotal = "($600 +)"; } else { sVendorsTotal = ""; }
        if ($("#txtPayDtFrom").val() != "" && $("#txtPayDtTo").val() != "") { sPamentDate = $("#txtPayDtFrom").val() + " To " + $("#txtPayDtTo").val(); } else { sPamentDate = "ALL"; }
        if ($("#txtAccountFrom").val() != "" && $("#txtAccountTo").val() != "") { sAccount = $("#txtAccountFrom").val() + " To " + $("#txtAccountTo").val(); } else { sAccount = "ALL"; }

        if ($("#chkwith1099").prop("checked") == true) { sVendors = "w/1099"; }
        else if ($("#chkWithout1099").prop("checked") == true) { sVendors = "w/o 1099"; } else { sVendors = "ALL"; }

        sVendors = sVendors + " " + sVendorsTotal;

        if ($("#ddlSource").val() != null) {
            $.each($("#ddlSource").val(), function (index, value) {
                sSource += value + ", ";
            });
        }

        if ($("#ddlTaxCode").val() != null) {
            $.each($("#ddlTaxCode").val(), function (index, value) {
                sTaxcode += value + ", ";
            });
        }

        sTaxcode = sTaxcode.trim().replace(/^,|,$/g, '');
        sSource = sSource.trim().replace(/^,|,$/g, '');

        var oComapanyItems = {
            "Company": localStorage.CompanyName,
            "CompanyName": oWorksheetConfig.oCompanyDetails.CompanyName
           , "TaxYear": oWorksheetConfig.TaxYear
           , "WorkState": sWorkState
           , "Payment": sPayment
           , "Amount": sAmount
           , "Invoice": sInvoice
           , "Taxcode": sTaxcode
           , "Source": sSource
           , "VendorTotal": sVendors
           , "PaymentDate": sPamentDate
           , "Account": sAccount
           , "WorkSheetTotal": Total
        }

        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify(oVendorDetails);
        APIName = 'URL_PrintWorkSheetSummary';
        let RE = new ReportEngine(this.URL_PrintWorkSheetSummary);
        RE.ReportTitle = '1099 Vendor Summary Report : ' + oWorksheetConfig.TaxYear;
        RE.callingDocumentTitle = '1099 Vendor Summary Report';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckRun = JSONParameters;
        RE.FormJSON.ComapanyItems = oComapanyItems;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        G_RE = RE;

    },

    GetCount : function()
    {

        var table = $("#tblTransBody").find(".vendordetails");
        var vcount = 0, fcount = 0; var workstate = [];
        table.each(function (i, el) {
            var hasTran = $(this).next().first().attr("name");
            var VendorId = $(this).attr("name");                     
            if (VendorId == hasTran) {

                workstate = [];
                vcount++;
                var tableTrans = $("#tblTransBody").find('.clsTransaction')
                tableTrans.each(function (j, el) {               
                    if ($(this).attr('name') == VendorId) {
                        var id = $(this).attr('id');
                        var WorkState = $("#ddlWorkState_" + id + " option:selected").text();
                        if ($.inArray(WorkState, workstate) == -1) {
                            workstate.push(WorkState);
                        }
                    }
                });

                fcount = fcount + workstate.length;
            }
        });
        $("#vendorcount").text(vcount);
        $("#formcount").text(fcount);
        $("#worksheetcount").show();
      
    }


    

}

$(document).ready(function () {

    $("#lblComp").text(localStorage.CompanyName);
    $("#lblYear").text(localStorage.TY1099);
    
    $('#ddlSource').multiselect();
    oWorksheetConfig.GetCompanyDetail();
    oWorksheetConfig.BindTaxCode();

    $("#tabToolbar").click(function () {
        $("#divTool").slideToggle("slow");
    });

    
});

$(document).bind("keydown", function (e) {
    if (e.ctrlKey && e.keyCode == 80) {
        oWorksheetConfig.PrintIRS();
        e.preventDefault();
        return false;
    }
});
