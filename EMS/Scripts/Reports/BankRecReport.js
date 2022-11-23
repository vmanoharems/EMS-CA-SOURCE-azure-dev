var BankRecReport = {

    UrlFillBankDetails: "/api/CompanySettings/GetBankInfoDetails",
    UrlGetRoncilation: "/api/ReportP1/GetReconcilationList",
    UrlReportsBankRecDetail: "/api/ReportAPI/ReportsBankRecDetail",
    UrlReportsBankRecSummary: "/api/ReportAPI/ReportsBankRecSummary",
    FillBankDetails: function () {
        $.ajax({

            url: this.UrlFillBankDetails + '?ProdId=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8'
        })
        .done(function (response)
        { BankRecReport.FillBankDetailsSucess(response); })
        .fail(function (error)
        { })
    },
    FillBankDetailsSucess: function (response) {

        if (response.length == 1) {
            $('#txtBankName').val(response[0].Bankname);
            $('#hdnBank').val(response[0].BankId);
            BankRecReport.GetEndingDate();
        }

        CheckBankID = [];
        CheckBankID = response;
        var ProductListjson = response;
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

                $("#hdnBank").val(ui.item.value);
                $('#txtBankName').val(ui.item.label);
                
                return false;
            },
            select: function (event, ui) {

                $("#hdnBank").val(ui.item.value);
                $('#txtBankName').val(ui.item.label);
                BankRecReport.GetEndingDate();
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        });
    },
    GetEndingDate: function () {
        var BankID = $('#hdnBank').val();
        $.ajax({
            url: this.UrlGetRoncilation + '?ProdID='+localStorage.ProdId+'&BankID=' + BankID,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            async: false,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            $.each(response, function (key, value) {
                $('#ddlStatmentEndingDate').append($("<option></option>").attr("value", value.ReconcilationID).text(value.StatementDate.split('T')[0]));
            });
        })
        .fail(function (error) {
            console.log(error.responseText);
        })
    },
    PrintReports: function () {
        var Printdetail = $("#chkDetail").is(':checked');
        var PrintdetailUncleared = $("#chkDetailUncleared").is(':checked');
        var Printsummary = $("#chkSummary").is(':checked');
        var PrintsummaryUncleared = $("#chkSummaryUncleared").is(':checked');

        if (Printdetail == false &&  Printsummary == false)
        {
            $.notify("Please select Detail or Summary", "warn");
        }
        else
        {
            if ($("#txtBankName").val() != "") {
                if (Printdetail == true) {
                    this.PrintReportCleared(PrintdetailUncleared);
                }
                if (Printsummary == true) {
                    this.PrintReportSummury(PrintsummaryUncleared);
                }
            }
            else {
                $.notify("Please select Bank", "warn");
            }
        }
    
    },
    PrintReportCleared: function (isPrintUncleared) {

        var oBankReconcile = {
            "BankReconciliationID": $('#ddlStatmentEndingDate').val()
                , "isSummary": false
                , "includeuncleared": isPrintUncleared
        }

        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify(oBankReconcile);
        APIName = 'UrlReportsBankRecDetail';
        let RE = new ReportEngine(this.UrlReportsBankRecDetail);
        RE.ReportTitle = 'Bank Reconciliation Report';
        RE.callingDocumentTitle = 'Bank Reconciliation Report';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckRun = JSONParameters;
        RE.FormJSON.BankReconcile = oBankReconcile;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.BankId = $('#hdnBank').val();
        RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        G_RE = RE;
    },
    PrintReportSummury: function (isPrintUncleared) {

        var oBankReconcile = {
            "BankReconciliationID": $('#ddlStatmentEndingDate').val()
                , "isSummary": false
                , "includeuncleared": isPrintUncleared
        }

        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify(oBankReconcile);
        APIName = 'UrlReportsBankRecSummary';
        let RE = new ReportEngine(this.UrlReportsBankRecSummary);
        RE.ReportTitle = 'Bank Reconciliation Report';
        RE.callingDocumentTitle = 'Bank Reconciliation Report';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckRun = JSONParameters;
        RE.FormJSON.BankReconcile = oBankReconcile;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.BankId = $('#hdnBank').val();
        RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        G_RE = RE;
    },
};
$(document).ready(function () {
    AtlasUtilities.init();
    BankRecReport.FillBankDetails();

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;

    var curr_year = d.getFullYear();
    if (curr_date.toString().length === 1) {
        curr_date = '0' + curr_date;
    }

    if (curr_month.toString().length === 1) {
        curr_month = '0' + curr_month;
    }

    var ReportDate = curr_month + '/' + curr_date + '/' + curr_year;

    $('#txtReportDate').val(ReportDate);
});
