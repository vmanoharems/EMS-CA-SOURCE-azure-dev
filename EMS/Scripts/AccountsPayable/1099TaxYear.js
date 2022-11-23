var oModuleConfig = {
    URL_GETCOMPANYLIST: "/api/CompanySettings/GetCompanyList"
    , URL_GETTAXYEARS: "/api/ModuleTen/GetTaxYear"
    , URL_GETTAXYEARSDETAILS: "/api/ModuleTen/GetTaxYearDetails"
    , URL_FIllTAXYEARSDETAILS: "/api/ModuleTen/CreateTaxFilling"
    , oTaxYear: []
    , GetCompany: function () {
        AtlasUtilities.CallAjaxGet(this.URL_GETCOMPANYLIST + '?ProdID=' + localStorage.ProdId, false, this.GetCompanySuccess, AtlasUtilities.LogError);
    }
    , GetCompanySuccess: function (response) {
        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.CompanyID,
                label: m.CompanyCode
            };
        })

        if (array.length == 1) {
            $('#txtCompany').val(array[0].label);
            $('#hdnCompany').val(array[0].value);
        }

        $(".SearchCompany").autocomplete({
            minLength: 1,
            source: array,
            autoFocus: true,
            focus: function (event, ui) {
                if (event.which !== 9) {
                    event.preventDefault();
                }
                return false;
            },
            select: function (event, ui) {
                $('#txtCompany').val(ui.item.label);
                $('#hdnCompany').val(ui.item.value);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        });
    }
    , GetTaxYear: function () {
        AtlasUtilities.CallAjaxPost(this.URL_GETTAXYEARS + '?ProdID=' + localStorage.ProdId, false, this.GetTaxYearSuccess, AtlasUtilities.LogError,[]);
    }
    , GetTaxYearSuccess: function (response) {
        var dtYears = [];

        if (response.length > 0) {
            $.each(response, function (key, value) {
                var taxyear = value.dtTaxYear;
                if (jQuery.inArray(taxyear, dtYears) == -1) {
                    $('#txtTaxYear').append($("<option></option>").attr("value", value.iHasFilling).text(taxyear));
                    dtYears.push(taxyear);
                    oModuleConfig.oTaxYear.push(taxyear);
                }
            });
        }
        oModuleConfig.SetTaxYear();
    }
     , GetTaxYearDetails: function () {
         AtlasUtilities.CallAjaxPost(this.URL_GETTAXYEARSDETAILS + '?ProdID=' + localStorage.ProdId, false, this.GetTaxYearDetailsSuccess, AtlasUtilities.LogError, []);
     }
     , GetTaxYearDetailsSuccess: function (response) {
         if (response.length > 0) {
             var strhtml = '';
             var Tcount = response.length;
             for (var i = 0; i < Tcount; i++) {
                 if (response[i].hasFiling == 1) {
                     strhtml += '<tr id=' + response[i].TaxFilingID + '>';
                     strhtml += '<td>' + response[i].TransactionYear + '</td>';
                     strhtml += '<td>' + response[i].CompanyID + '</td>';
                     //strhtml += '<td></td>';
                     strhtml += '<td>' + response[i].hasFiling + '</td>';
                     strhtml += '<td><span class="edit-link" onclick="oModuleConfig.EditSheet(' + response[i].TransactionYear + ',' + response[i].CompanyID + ',' + response[i].TaxFilingID + ')">Edit</span></td>';
                     strhtml += '</tr>';
                 }
             }
             $('#tblTaxyearBody').html(strhtml);
             $('#example').DataTable();
         }
     }
    ,CreateTaxFilling: function () {
        var oTaxFilling = {
            ProdID: localStorage.ProdId,
            TaxYear: $("#txtTaxYear").find("option:selected").text(),
            CompanyID: $('#hdnCompany').val(),
            Createdby: localStorage.UserId
        };

        $.ajax({
            url: this.URL_FIllTAXYEARSDETAILS
       , cache: false
       , beforeSend: function (request) {
           request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
       }
       , type: 'POST'
       , data: JSON.stringify(oTaxFilling)
       , contentType: 'application/json; charset=utf-8'
       })
       .done(function (response) {
           localStorage.TaxFillingId = response[0].TaxFilingID;
           localStorage.TY1099 = response[0].TaxYear;
           localStorage.CompanyID = response[0].CompanyID;
           window.location.href = HOST + "/Vendor/Worksheet";
       })
       .fail(function (error) {
       });
    }
    , SetTaxYear: function () {
        localStorage.TY1099 = $("#txtTaxYear").find("option:selected").text();
        localStorage.isProcessStart = $("#txtTaxYear").val();
        localStorage.TaxYears = JSON.stringify(oModuleConfig.oTaxYear);
    }
    , EditSheet: function (sYear, sCompanyId, iTaxFillingId) {
        localStorage.TaxFillingId = iTaxFillingId;
        localStorage.TY1099 = sYear;
        localStorage.CompanyID = sCompanyId;
        localStorage.CompanyName = $('#txtCompany').val();
        window.location.href = HOST + "/Vendor/Worksheet";
    }
};

$(document).ready(function () {
    AtlasUtilities.init();
    oModuleConfig.GetCompany();
    oModuleConfig.GetTaxYear();
    oModuleConfig.GetTaxYearDetails();
    localStorage.CompanyID = $('#hdnCompany').val();
    localStorage.CompanyName = $('#txtCompany').val();
});

$("#txtTaxYear").change(function () {
    oModuleConfig.SetTaxYear();
});

$("#btnProcess").click(function () {

    if (localStorage.isProcessStart == 1) {
        $("#spnProcessMsg").text("The Tax Year " + localStorage.TY1099 + " for Company  " + localStorage.CompanyID + " has already been started")
    }
    else {

       oModuleConfig.CreateTaxFilling();       
    }
});