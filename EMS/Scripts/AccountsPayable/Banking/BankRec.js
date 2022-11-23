var G_BankReconciliation = undefined;

class BankReconciliation {
    get URLS() {
        return {
            APIUrlGetBankDetails: `/api/CompanySettings/GetBankInfoById?BankId=${this._BankID}`
        }
    }

    constructor(BankID) {
        this._BankID = BankID;
        $.ajax(
            AtlasDocument.MakeAJAXPOSTobject(
                this.URLS.APIUrlGetBankDetails
                , {
                    contentType: 'application/json; charset=utf-8'
                }
            )
        )
        .done(function (response) {
            G_BankReconciliation.ProcessConfig(response[0].configJSON);
        })
    }

    get CSVConfigName () {
        this._BankConfig.POSPay.Config["Settings.Banks.POSPay.List"].replace('POSPay', 'StatementCSV');
    }

    ProcessConfig(configJSON) {
        this._BankConfig = JSON.parse(configJSON);
        G_AtlasConfig.ConfigGet(G_BankReconciliation._BankConfig.POSPay.Config["Settings.Banks.POSPay.List"].replace('POSPay', 'StatementCSV'), (response) => {
            if (response) {
                this._CSVConfig = JSON.parse(response.ConfigJSON);
                G_BankReconciliation.ShowCSVUpload(true);
            } else {
                G_BankReconciliation.ShowCSVUpload(false)
            }
        })
    }

    ShowCSVUpload(shouldShow) {
        if (shouldShow) {
            $('#fileCSV').show();
            $('#fileCSV').removeClass('hidden');
            $('#spanSetupRequired').hide();

            $("#fileCSV").change(this.FileSelectEvent);
        } else {
            $('#fileCSV').hide();
            $('#fileCSV').addClass('hidden');
            $('#spanSetupRequired').show();
        }
    }

    ShowConfirmation(hide) {
        if (!hide) {
            $('#divBankRecCSVUpload #spanCSVConfirm').hide();
            $('#divBankRecCSVUpload #CSVConfirm').addClass('hidden');
            $('#divBankRecCSVUpload #CSVCancel').addClass('hidden');
        } else {
            $('#fileCSV').hide();
            $('#divBankRecCSVUpload #spanCSVConfirm').show();
            $('#divBankRecCSVUpload #CSVConfirm').removeClass('hidden');
            $('#divBankRecCSVUpload #CSVCancel').removeClass('hidden');
        }
    }

    FileSelectEvent(evt) {
        let myJsonString = '';
        let file = evt.target.files[0];
        Papa.parse(file, {
            header: false,
            dynamicTyping: false
            , skipEmptyLines: true
            , complete: function (results) {
                let CSVConfig = G_BankReconciliation._CSVConfig;

                G_BankReconciliation._PreviewData = results.data.reduce(function (a, c, i) {
                    let UseField = CSVConfig.map[CSVConfig.config.UseField];
                    let TransactionDetails = c[UseField];
                    let ExistsValue = TransactionDetails[CSVConfig.config.Exists.Function](...CSVConfig.config.Exists.Parameters);
                    if (ExistsValue === CSVConfig.config.Exists.Equals) {
                        let CheckNumber = TransactionDetails[CSVConfig.config.Parse.Function](...CSVConfig.config.Parse.Parameters).trim();
                        let myreturn = {
                            'CheckNumber': CheckNumber
                            , 'ClearedDate': c[CSVConfig.map.ClearedDate]
                            , 'Amount': c[CSVConfig.map.Amount]
                            , 'TransactionDescription': c[CSVConfig.map.TransactionDescription]
                        }
                        a.push(myreturn);
                    }
                    return a;
                }, [])
                ;

                G_BankReconciliation._PreviewData.forEach(function (e, i) {
                    $(`#tblTrans tr td input.Payment.${e.CheckNumber}`).closest('tr').addClass('bankreconciliation-auto-clear-highlight');
                })
                ;

                G_BankReconciliation.ShowConfirmation(true);
            }
        });
    }

    CSVApply(method) {
        if (method === 'CONFIRM') {
            G_ForceChecked = true;
            G_SuspendCalculationUpdate = true;

            $('.bankreconciliation-auto-clear-highlight').each(function (i, e) {
                $(e).find('input').click();//prop('checked', true);
                $(e).removeClass('bankreconciliation-auto-clear-highlight');
            })
            ;

            G_ForceChecked = false;
            G_SuspendCalculationUpdate = false;
        } else if (method = 'CANCEL') {
            $('.bankreconciliation-auto-clear-highlight').removeClass('bankreconciliation-auto-clear-highlight');
            this.ShowCSVUpload(true);
        }

        this.ShowCSVUpload(true);
        this.ShowConfirmation(false);
    }
}

$(document).ready(() => {
})