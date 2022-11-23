var oPOSPay = {
    GeneratePOSPayFile: function () {
        let theMAP = this.POSPayConfig.POSPayMap;
        theMAP.BankID = $('#hdnBank').val();
        let APOSPay = new AtlasPOSPay(theMAP);
        APOSPay.Bank.AccountNumber = this.Bank.AccountNumber;
        APOSPay.ExtraFields = this.POSPayConfig.ExtraFields;

        let A_Data_Checked = {};
        let tclass = (oPOSPay.isAdvanced) ? 'poschecksadv' : 'poschecks';
        $(`.${tclass}:checked`).each((e, i) => {
            A_Data_Checked[$(i).data('paymentid')] = $(i).data('paymentid');
        });

        let A_Data = this.Checks.filter(e => { return A_Data_Checked[e.PaymentID] });

        APOSPay.setData(A_Data);
        APOSPay.GeneratePOSPayFile();
        APOSPay.downloadPOSPayFile();
        this.ServerPOSPaySet(A_Data.map(A => { return A.PaymentID }));
    }
    , ServerPOSPaySet: function (A_Data) { // Expecting just an array of the PaymentIDs
        return AtlasUtilities.CallAjaxPost(
            oPOSPay.URL_POSPaySet + `?BankID=${$('#hdnBank').val()}&ProdID=${localStorage.ProdId}&isAdvanced=${oPOSPay.isAdvanced}&JSONPaymentIDList=[${A_Data.join(',')}]`
            , false
            , oPOSPay.POSPayGetSuccess
            , AtlasUtilities.LogError
            , {}
        );
    }
    /////////////////////////// DEMO ///////////////////////////
    , DemoPOSPay: function (thebankConfig) {
        let myConfig = new AtlasConfig();

        myConfig.ConfigGet(thebankConfig //'Settings.Banks.POSPay.List.CityNationalBank'
        , function (config, caller) {
            let objConfig = JSON.parse(config.ConfigJSON);
            let APOSPay = new AtlasPOSPay(objConfig);
            let A_Data = [
            {
                'Bank.AccountNumber': '98721'
            , 'Bank.POSPay.CompanyID': '12323'
            , 'Bank.POSPay.UserID': '123'
            , 'Check.PaidStatus': 'PRINTED'
            , 'Check.CheckNumber': '1000'
            , 'Check.PayeeName': 'Vendor Print on Check Value'
            , 'Check.PayeeName2': ''
            , 'Check.Date.MMDDYYYY': '11292018'
            , 'Check.Date.YYYYMMDD': '20181129'
            , 'Check.Amount.noFormat': '12000'
            , 'Check.Amount': '120.00'
            , 'Check.VoidStatus': ''
            , 'Check.VoidDate.MMDDYYYY': ''
            , 'Check.VoidDate.YYYYMMDD': ''
            }
            , {
                'Bank.AccountNumber': '98721'
            , 'Bank.POSPay.CompanyID': '12323'
            , 'Bank.POSPay.UserID': '123'
            , 'Check.PaidStatus': 'VOIDED'
            , 'Check.CheckNumber': '1234'
            , 'Check.PayeeName': 'Here is the Vendor Payee Name'
            , 'Check.PayeeName2': ''
            , 'Check.Date.MMDDYYYY': '11292018'
            , 'Check.Date.YYYYMMDD': '20181129'
            , 'Check.Amount.noFormat': '50000'
            , 'Check.Amount': '120.00'
            , 'Check.VoidStatus': 'VOIDED'
            , 'Check.VoidDate.MMDDYYYY': '11292018'
            , 'Check.VoidDate.YYYYMMDD': '20181129'
            }
            ];
            APOSPay.setData(A_Data);
            APOSPay.GeneratePOSPayFile();
            APOSPay.downloadPOSPayFile();
        })
    },
    ///////////////////////// END DEMO /////////////////////////
    URL_GETBANKDETAILS: "/api/CompanySettings/GetBankInfoDetails"
    , URL_POSPayGet: "/api/POSPay/POSPayGet"
    , sTable: "#tblPOSPay"
    , sTbody: "#tblPOSPayTBody"
    , sTbodyAdvance: "#tblPOSPayHistoryTBody"
    , sTableHistory: "#tblPOSPayHistory"
    , iListLength: 0
    , iTotalChekc: 0
    , iTotalCheckAmnt: 0
    , iTotalVoid: 0
    , iTotalVoidAmnt: 0
    , Bank: {}
    , Checks: {}
    , POSPayConfig: undefined
    , isAdvanced: false
    , isinitiated: false
    , URL_POSPaySet: '/api/POSPay/POSPaySet'
    , tableA: undefined
    , tableB: undefined
    , GetBank: function () {
        AtlasUtilities.CallAjaxPost(this.URL_GETBANKDETAILS + '?ProdID=' + localStorage.ProdId, false, this.GetBankSuccess, AtlasUtilities.LogError, []);
    }
    , GetBankSuccess: function (response) {
        if (response.length === 1) {
            $('#txtBankName').val(response[0].Bankname);
            $('#hdnBank').val(response[0].BankId);
            $('#spanBank').text(response[0].Bankname);
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
                $("#hdnBank").val(ui.item.value);
                $('#txtBankName').val(ui.item.label);
                $('#spanBank').text(ui.item.label);
                return false;
            },
            select: function (event, ui) {

                $("#hdnBank").val(ui.item.value);
                $('#txtBankName').val(ui.item.label);
                $('#spanBank').text(ui.item.label);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        });
    }
    , POSPayGet: function () {
        AtlasUtilities.CallAjaxPost(
            oPOSPay.URL_POSPayGet + `?BankID=${$('#hdnBank').val()}&ProdID=${localStorage.ProdId}&isAdvanced=${oPOSPay.isAdvanced}`
            , false
            , oPOSPay.POSPayGetSuccess
            , AtlasUtilities.LogError
            , {
                async: true
            }
        );
    }
    , POSPayGetSuccess: function (response) {
        // Handle the scenario when we have zero checks available to display
        if (!response.Checks) {
            oPOSPay.iListLength = 0;
            oPOSPay.Checks = []
        } else {
            oPOSPay.iListLength = response.Checks.length;
            oPOSPay.Checks = response.Checks;
        }
        oPOSPay.Bank.AccountNumber = response.AccountNumber;
        oPOSPay.POSPayConfig = response.Config;
        oPOSPay.POSPayConfig.POSPayMap = JSON.parse(response.Config.POSPayMap);

        if (oPOSPay.isAdvanced) {
            var sHTMLAdvance = oPOSPay.CreatePOSAdvancedView(oPOSPay.Checks);
            let dth = $(window).height() - 240;
            if (!oPOSPay.isinitiated) {
                $(oPOSPay.sTableHistory + ' thead tr').clone(true).appendTo(oPOSPay.sTableHistory + ' thead');
                $(oPOSPay.sTableHistory + ' thead tr:eq(1) th').each(function (i) {
                    if (i !== 0) {
                        var title = $(this).text();
                        $(this).html('<input type="text" class="POSAVFilter" style="width:100%;" placeholder=" ' + title + '"  />');

                        $('input', this).on('keyup change', function () {
                            if (oPOSPay.tableA.column(i).search() !== this.value) {
                                oPOSPay.tableA
                               .column(i)
                               .search(this.value)
                               .draw();
                            }
                        });
                    } else {
                        $(this).html('<span></span>');
                    }
                });
            } else {
                $('.POSAVFilter').val(''); // Reset the filter values
            }
            if ($.fn.DataTable.isDataTable(oPOSPay.sTableHistory)) {
                oPOSPay.tableA.clear().draw();
                $(oPOSPay.sTableHistory).DataTable().destroy();
            }
            $('#tblPOSPayHistoryTBody').html(sHTMLAdvance);
            oPOSPay.tableA = $(oPOSPay.sTableHistory).DataTable({
                destroy: true,
                scrollY: dth,
                paging: false,
                columnDefs: [{
                    className: 'no-sort',
                    orderable: true,
                    targets: [0],
                }],
                order: [1, 'asc'],
                info: false,
                orderCellsTop: true,
            });

            oPOSPay.GetFooterAdvanceViewSummury();
            oPOSPay.isinitiated = true;
            $("#dvPOSPayHistory").removeClass('displayNone');
            $("#dvPOSPayBasic").addClass('displayNone');
            $("#linkAndvanceView").addClass('displayNone');
            $("#linkBasicView").removeClass('displayNone');
            oPOSPay.tableA.columns.adjust(); // Adjust columns since the enclosing DOM has shifted
        } else {
            $("#dvPos").removeClass('displayNone');
            $("#tabWorksheet").removeClass('displayNone');
            $("#dvPOSPayBasic").removeClass('displayNone');
            $('#DvSearch').addClass('displayNone');

            if ($.fn.DataTable.isDataTable(oPOSPay.sTable)) {
                let thetable = $(oPOSPay.sTable).DataTable();
                thetable.clear();
                thetable.draw();

                var sHTMLBasic = oPOSPay.CreatePOSBasicView(oPOSPay.Checks);
                $(oPOSPay.sTbody).html(sHTMLBasic);
            } else {
                var sHTMLBasic = oPOSPay.CreatePOSBasicView(oPOSPay.Checks);
                $(oPOSPay.sTbody).html(sHTMLBasic);

                let dth = $(window).height() - 240;
                $(oPOSPay.sTable).DataTable({
                    //destroy: true,
                    scrollY: dth,
                    scrollCollapse: true,
                    fixedHeader: true,
                    paging: false,
                    columnDefs: [{
                        className: 'no-sort',
                        orderable: false,
                        targets: [0, 2, 3, 4, 5, 6],
                    }],
                    order: [1, 'asc'],
                    info: false
                });
            }

            oPOSPay.GetFooterBasicViewSummury();
            $("#dvPOSPayHistory").addClass('displayNone');
            $("#dvPOSPayBasic").removeClass('displayNone');
            $("#linkAndvanceView").removeClass('displayNone');
            $("#linkBasicView").addClass('displayNone');
        }
    }
    , CreatePOSBasicView: function (Checks) {
        var sHTMLTemplate = "";
        for (i = 0; i <= Checks.length - 1; i++) {

            var item = Checks[i];

            sHTMLTemplate += '<tr status="' + item.PaidStatus + '">';
            sHTMLTemplate += `<td><input tabindex="7" name="poschecks" class="poschecks" type="checkbox" checked onclick="oPOSPay.GetFooterBasicViewSummury();" id="chkInvoiceList_${item.CheckNumber + '_' + i}" data-paymentid="${item.PaymentID}" ></td>`;
            sHTMLTemplate += '<td>' + item.CheckNumber + '</td>';
            sHTMLTemplate += '<td>' + this.DateFormat(item.CheckDate.MMDDYYYY) + '</td>';
            sHTMLTemplate += '<td>' + item.PayeeName + '</td>';
            sHTMLTemplate += '<td  class="amount" amount="' + item.Amount.withFormat + '">$' + numeral(item.Amount.withFormat).format('#,###.##') + '</td>';
            if (item.Void !== undefined) {
                sHTMLTemplate += '<td class="void">' + item.Void.Status + '</td>';
                sHTMLTemplate += '<td>' + this.DateFormat(item.Void.VoidDate.MMDDYYYY) + '</td>';
            }
            else {
                sHTMLTemplate += '<td></td>';
                sHTMLTemplate += '<td></td>';
            }
            sHTMLTemplate += '</tr>';
        }

        return sHTMLTemplate;
    }
    , CreatePOSAdvancedView: function (Checks) {
        var sHTMLTemplate = "";
        for (i = 0; i <= Checks.length - 1; i++) {
            var item = Checks[i];

            sHTMLTemplate += '<tr status="' + item.PaidStatus + '">';
            sHTMLTemplate += `<td><input tabindex="7" name="poschecksadv" class="poschecksadv" type="checkbox" onclick="oPOSPay.GetFooterAdvanceViewSummury();" id="chkAdvInvoiceList_${item.CheckNumber + '_' + i}" data-paymentid="${item.PaymentID}" ></td>`;
            sHTMLTemplate += '<td>' + item.CheckNumber + '</td>';
            sHTMLTemplate += '<td>' + this.DateFormat(item.CheckDate.MMDDYYYY) + '</td>';
            sHTMLTemplate += '<td>' + item.PayeeName + '</td>';
            sHTMLTemplate += '<td  class="amount" amount="' + item.Amount.withFormat + '">$' + numeral(item.Amount.withFormat).format('#,###.##') + '</td>';
            if (item.Void !== undefined) {
                sHTMLTemplate += '<td class="void">' + item.Void.Status + '</td>';
                sHTMLTemplate += '<td>' + this.DateFormat(item.Void.VoidDate.MMDDYYYY) + '</td>';
            } else {
                sHTMLTemplate += '<td></td>';
                sHTMLTemplate += '<td></td>';
            }

            if (item.POSPayGroupID !== undefined) {
                sHTMLTemplate += '<td>' + item.POSPayGroupID + '</td>';
                sHTMLTemplate += '<td>' + dateFormat(item.POSPayDate, 'mm-dd-yyyy h:MM:ss TT'); + '</td>';
            } else {
                sHTMLTemplate += '<td></td>';
                sHTMLTemplate += '<td></td>';
            }
            sHTMLTemplate += '</tr>';
        }
        return sHTMLTemplate;
    }
    , GetPOSView: function (view) {
        if (view === 'basic') {
            this.isAdvanced = false;
            this.POSPayGet();
            //$("#dvPOSPayHistory").addClass('displayNone');
            //$("#dvPOSPayBasic").removeClass('displayNone');
            //$("#linkAndvanceView").removeClass('displayNone');
            //$("#linkBasicView").addClass('displayNone');
        } else {
            this.isAdvanced = true;
            this.POSPayGet();
            //$("#dvPOSPayHistory").removeClass('displayNone');
            //$("#dvPOSPayBasic").addClass('displayNone');
            //$("#linkAndvanceView").addClass('displayNone');
            //$("#linkBasicView").removeClass('displayNone');
        }
    },
    GetFooterBasicViewSummury: function () {
        $("#lblCheckCount").text($('[name="poschecks"]:checked').length);
        var checkamount = $('[name="poschecks"]:checked').parent().parent().find(".amount");
        var iTotal = 0;
        $.each(checkamount, function (i, ele) {
            var amount = $(ele).attr("amount");
            iTotal = iTotal + (parseFloat(amount));
        });
        $("#lblTotalAmount").text(numeral(iTotal).format('#,###.##'));
        $("#lblVoidCount").text($(oPOSPay.sTable).find(".void").length);
        var voidamount = $(oPOSPay.sTable + " tr").filter(':has(:checkbox:checked)').filter('[status="Voided"]').find(".amount");
        var iTotalVoid = 0;
        $.each(voidamount, function (i, ele) {
            var amount = $(ele).attr("amount");
            iTotalVoid = parseFloat(iTotalVoid) + parseFloat(amount);
        });
        $("#lblVoidAmount").text(numeral(iTotalVoid).format('#,###.##'));

    }
    , GetFooterAdvanceViewSummury: function () {
        var countCheck = 0; var amntCheck = 0; var countVoid = 0; var amntVoid = 0;
        var table = $(oPOSPay.sTableHistory).DataTable();
        table.rows().every(function (rowIdx, tableLoop, rowLoop) {
            var data = this.node();
            if ($(data).find('input').prop('checked') === true) {

                var colAmnt = $(data).find('.amount');
                var amount = $(colAmnt).attr("amount");
                amntCheck = amntCheck + (parseFloat(amount));
                countCheck++;

                if ($(data).attr("status") == "Voided") {
                    var colAmntVoid = $(data).find('.amount');
                    amount = $(colAmntVoid).attr("amount");
                    amntVoid = amntVoid + (parseFloat(amount));
                    countVoid++;
                }
            }
        });

        $("#lblCheckCountAdvance").text(countCheck);
        $("#lblTotalAmountAdvance").text(numeral(amntCheck).format('#,###.##'));
        $("#lblVoidCountAdvance").text(countVoid);
        $("#lblVoidAmountAdvance").text(numeral(amntVoid).format('#,###.##'));

    }
    , DateFormat: function (date) {
        var newdate = [date.slice(0, 2), "-", date.slice(2)].join('');

        newdate = [newdate.slice(0, 5), "-", newdate.slice(5)].join('');

        return newdate;
    },
    CheckAll: function (ele, eletocheck) {
        var chkRows = $(eletocheck);
        chkRows.each(function () {
            if (!$(ele).is(":checked")) {
                $(this).prop('checked', false);
            }
            else {
                $(this).prop('checked', true);
            }
        });
        if (eletocheck == '.poschecks') { this.GetFooterBasicViewSummury(); }
        else if (eletocheck == '.poschecksadv') { this.GetFooterAdvanceViewSummury(); }
    }
};

$(document).ready(function () {

    $("#linkBasicView").addClass('displayNone');
    oPOSPay.GetBank();

});