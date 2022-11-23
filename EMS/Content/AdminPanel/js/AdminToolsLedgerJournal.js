$.getScript('/Content/AdminPanel/js/AdminShared.js', function () {

    let AdminDataTable = new AdminSharedDataTable($('#AdminToolsLedgerJournal'),
        {
            "AdminToolsLedgerJournal": {
                "ProdId": localStorage.AdminProdId
                ,"CompanyId": 1
            }
        }
        , {
            columnDefs: [
                {
                    width: "50px", targets: [0, 1, 5, 6, 7]
                }
            ]
        }
    );
    AdminDataTable.fixedfooternav = true

    let AdminURL = '/api/AdminTools/AdminAPIToolsLedgerJournal';
    var $AdminToolsLedgerJournalList = AdminDataTable.BuildDataTable(
        { ajaxdatasource: AdminURL }
        , [
        {
            data: "TransactionNumber"
            , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                AdminDataTable.BuildModal({
                    nTd, sData, oData, iRow, iCol
                    , callURL: AdminURL
                    , callParameters: {
                            "AdminToolsLedgerJournal": {
                                "ProdId": localStorage.AdminProdId
                                , "CompanyId": 1
                                , "TransactionNumber": sData
                            }
                        }
                    , ModalID: 'ATLJTransactionModal'
                    , ModalFunction: function (obj) {

                        console.log(obj.dtData[0].JED);
                        let ModalDataTable = new AdminSharedDataTable($('#ATLJTransactionModal-JED'), {}, { searchableheader: false });
                        let $ModalDataTableJED = ModalDataTable.BuildDataTable(
                            {
                                isjsondatasource: true
                                , jsondatasource: obj.dtData[0].JED
                                , subtable: true
                            }
                            , [
                                { data: "COAId" }
                                , { data: "VendorId" }
                                , { data: "VendorName" }
                                , { data: "ThirdParty" }
                                , { data: "Note" }
                                , { data: "TransactionCodeString" }
                                , { data: "SetId" }
                                , { data: "SeriesId" }
                                , { data: "TaxCode" }
                            ]
                        );
                    }
                    , ErrorModaID: 'ATLJTransactionModal-Error'
                });
            }.bind(AdminDataTable)
        },
        { data: "CompanyId" },
        { data: "DocumentNo" },
        { data: "EntryDate" },
        { data: "PostedDate" },
        { data: "ClosePeriod" },
        { data: "Source" },
        { data: "JELineCount" },
        {
            data: "DebitTotal",
            fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                $(nTd).html(numeral(oData['DebitTotal']).format('$0,0.00'));
            }
        },
        {
            data: "CreditTotal",
            fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                $(nTd).html(numeral(oData['CreditTotal']).format('$0,0.00'));
            }
        }
    ]);


}); // End AdminShared
