const CInvoiceNew = {
    InvoiceID: 0,
    InvoiceNumber: '',
    CompanyID: undefined,
    VendorID: undefined,
    VendorName: '',
    ThirdParty: undefined,
    WorkRegion: undefined,
    Description: '',
    OriginalAmount: 0.00,
    CurrentBalance: 0.00,
    NewItemamount: 0.00,
    Newbalance: 0.00,
    BatchNumber: BatchManager.BatchNumber,
    BankID: undefined,
    InvoiceDate: undefined,
    DueDate: undefined,
    CheckGroupNumber: 0,
    CheckNumber: '',
    Payby: 'Check',
    InvoiceStatus: 'NEW',
    DocumentStatus: 'NEW',
    CreatedDate: undefined,
    CreatedBy: localStorage.UserId,
    ModifiedDate: null,
    ModifiedBy: null,
    ProdID: localStorage.ProdId,
    Amount: 0.00,
    ClosePeriodID: undefined,
    RequiredTaxCode: false,
    MirrorStatus: 0,
    isPaid: 0,
    PO: null,
    POlineID: null,

    ClosePeriodId: undefined,
    CompanyPeriod: undefined,

    DocumentJSON: '',
    DocumentJSONEdit: '',
    DocumentLines: [],
    JE: {}
}

class AtlasInvoice extends AtlasDocument {
    constructor(objDocument, Config) {
        super('Invoice', objDocument, Config);

        this.URLS.APIURLGet = '/api/APInvoice/APInvoiceGet';
        this.URLS.APIURLSet = '/api/APInvoice/APInvoiceGet';

        this.URLS['APIUrlCheckInvoiceNumberVendorId'] = '/api/POInvoice/CheckInvoiceNumberVendorId';
        this.URLS['APIUrlFillBankDetails'] = '/api/POInvoice/GetBankInfoByCompanyId';
        this.URLS['APIUrlGetPONumber'] = '/api/POInvoice/GetPONumber';
        this.URLS['APIUrlAPAtlasPaymentMapGet'] = '/api/APInvoice/APAtlasPaymentMapGet';
        this.URLS['APIUrlAPAtlasPaymentInformationGet'] = '/api/APInvoice/APAtlasPaymentInformationGet';
        this.URLS['APIUrlSaveInvoice'] = '/api/POInvoice/SaveInvoice';
        this.URLS['APIUrlDeleteInvoiceLine'] = '/api/POInvoice/DeleteInvoiceLine';
        this.URLS['APIUrlFillPOLines'] = '/api/POInvoice/GetPOLinesNotInInvoice';
        this.URLS['APIUrlDeleteInvoiceByInvoiceId'] = '/api/POInvoice/DeleteInvoiceByInvoiceId';

        //---------------Filling Bank Details----------------//
        $('#txtBank').focus(function () {
            this.FillBankDetails($('#txtBank'), this);
        }.bind(this))

        this.AutoDisplayPODialog = true;
        this._vendor = {};
        this._vendordefaults = {};
    }

    NewDocument(DocumentID) {
        AtlasInvoice.NewDocument(DocumentID);
        localStorage.EditInvoiceId = DocumentID;
        BatchManager.ForceBatch(); // Restore the BatchManager
    }

    static NewDocument(InvoiceID) {
        AtlasUtilities.ShowLoadingAnimation();
        $('#hrefInvoices').focus();
        AtlasDocument.NewDocument();
        $('#txtBank').val('');
        $('#CurrencyDocument').text('Currency');

        let {LineDef, ColumnDef} = AtlasInvoice.makeLineObj();
        let InvoiceConfig = AtlasDocument.MakeConfig({
            'ColumnDef': ColumnDef
            , 'LineDef': LineDef
            , FocusColumn: 4
            , stickyTableHeaders: 270
        });


        AtlasDocument.PrepDocument()
        .then(function (docPreData) {
            return AtlasDocument.GetDocumentData(
                `/api/APInvoice/APInvoiceGet`
                , {
                    ProdID: localStorage.ProdId,
                    InvoiceID: InvoiceID,
                    UserID: localStorage.UserId
                }
                , {
                    'CompanyID': AtlasDocument.BindCompany,
                    'ClosePeriodID': AtlasDocument.BindPeriod,
                    'VendorID': AtlasInvoice.BindVendorbyID,
                    'VendorName': '#txtVendor',
                    'RequiredTaxCode': AtlasInvoice.BindTaxOverride,// '#TaxOverride',
                    'InvoiceNumber': '#txtDocumentNumber',
                    'InvoiceDate': AtlasDocument.SetDocumentDate,
                    'Amount': '#txtAmount',
                    'BankID': AtlasInvoice.BindBank,
                    'Payby': AtlasInvoice.BindPaymentType,
                    'CheckGroupNumber': '#txtInvoiceCheckGroupNumber',
                    'CheckNumber': '#txtInvoiceCheckNumber',
                    'Description': '#txtDocumentDescription',
                }
                , {}
                , {
                    'LineProcessor': AtlasInvoice.ExistingLineProcessor,
                    'LineDef': LineDef
                }
                , CInvoiceNew
            )
        })
        .then(function (documentasObj) {
            thisDocument = new AtlasInvoice(documentasObj, InvoiceConfig);
            //thisDocument.AddLine({}, 'new', 1);

            if (localStorage.LastInvoice !== '' && localStorage.LastInvoice !== undefined) {
                let jsonLastTrans = {};
                let strTransactionNumber = '';
                try {
                    jsonLastTrans = JSON.parse(localStorage.LastInvoice);
                    strTransactionNumber = jsonLastTrans['ProdID_' + localStorage.ProdId];
                } catch (e) {
                    strTransactionNumber = '';
                }

                if (strTransactionNumber !== '' & strTransactionNumber !== undefined) {
                    $('#spnLastTransactionNumber').html('Last Transaction #: ' + strTransactionNumber);
                }
            }

            $('#UlAccountPayable li').removeClass('active');
            $('#LiInvoice').addClass('active');

            $("#txtThirdParty").attr("disabled", "disabled");

            AtlasPaste.Config.StaticColumns(["AMOUNT", "VENDOR", "TAX CODE", "LINEDESCRIPTION"]);
            AtlasPaste.Config.PastetoTable(thisDocument.AddLine);
            AtlasPaste.Config.DestinationTable('tblAtlasDocumentLines');
            AtlasPaste.Config.DisplayOffset({ top: 140, left: -100 });
            AtlasPaste.Config.Clearcallback(thisDocument.ClearLines);
            AtlasPaste.Config.AfterPastecallback(thisDocument.SumAmounts);

            thisDocument.VendorList = PreData._vendorlist;
            thisDocument.TransactionCodes = PreData._transactioncodes;
            thisDocument.DefaultLineActions = PreData._lineactions;
            thisDocument.RenderLineData();
            thisDocument.RunPostInit();
            thisDocument.EnableForm();
            thisDocument.EnablePowerButtons();
            if (InvoiceID === 0) {
                thisDocument.AddLine({}, 'new', 1);
                $('#ddlCompany').focus();
            }
            thisDocument.VendorVerify($('#txtVendor'));
            thisDocument.ApplyStickyHeaders();
            AtlasUtilities.HideLoadingAnimation();

            let TransactionNumber = 'New';
            try {
                TransactionNumber = JSON.parse(thisDocument.Data.JE).TransactionNumber;
            } catch (e) {}
            $('#breadcrumbEditInvoice').text(`Transaction # ${TransactionNumber}`);

            if (thisDocument.Data.DocumentStatus.toUpperCase() === 'PENDING') {
                $('#txtDocumentNumber').focus();
                BatchManager.ForceBatch(thisDocument.Data.BatchNumber);
            } else if (thisDocument.Data.DocumentStatus.toUpperCase() === 'POSTED') {
                $('#txtDocumentDescription').focus();
                BatchManager.ForceBatch(thisDocument.Data.BatchNumber);
            } else if (thisDocument.Data.DocumentStatus.toUpperCase() === 'NEW') {
                if ($('#ddlCompany option').length === 1) {
                    $('#txtVendor').focus();
                } else {
                    $('#ddlCompany').focus();
                }
            }

            thisDocument.isRendered = true;
        });
    }

    static makeLineObj() {
        let objLineDef = {
            'rowID': 1
            , 'DocumentLineID': 0
            , 'ACTION': ''
            , 'PO': null
            , 'LINEDESCRIPTION': ''
            , 'AMOUNT': '0.00'
            , 'TAX CODE': ''
            , 'CLOSE': false
        };

        let A_columns = [
            AtlasDocument.ColumnDefaults('rowID'),
            AtlasDocument.ColumnDefaults('DOCUMENTLINEID'),
            AtlasDocument.ColumnDefaults('ACTION'),
            {
                'data': 'PO'
                , title: 'PO'
                , width: '30px'
                , createdCell: function (nTd, sData, oData, iRow, iCol) {
                    // PO field
                    let APOD = [];
                    try {
                        var {PONumber, POID, POlineID} = JSON.parse(sData);
                        if (sData !== null) {
                            APOD[0] = {'id': 'poid', 'value': POID};
                            APOD[1] = {'id': 'polineid', 'value': POlineID};
                        }
                    } catch(e) {
                        var PONumber = '';
                    }
                    let theautocomplete = {
                        source: function (request, response) {
                            let A_ = $.map(thisDocument.Vendor.POList, function (val, i) { return val.PONumber; });
                            let matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                            response($.grep(A_, function (item) {
                                return matcher.test(item);
                            }));
                        }
                        , autoFocus: true
                        , open: function (e, ui) {
                            if (window.event) {
                                $(this).autocomplete('close');
                                //let te = $.Event('keydown');
                                //te.which = window.event.keyCode;
                                G_KeyNavigation(e, true);
                                //e.preventDefault();
                            }
                        }
                    };

                    let linepo = AtlasInput.CreateInput(
                        {
                            id: 'linepo'
                            , name: 'linepo'
                            , column: iCol
                            , placeholder: ''
                            , type: 'input'
                            , 'class': 'input-linepo '
                            , existingvalue: PONumber
                            , keydown: G_KeyNavigation
                            , blur: AtlasInvoice.DisplayPOLines
                            , autocomplete: theautocomplete
                            //, focus: thisDocument.FillPOListAutoComplete 
                            , dataattr: APOD
                            , disabled: (PONumber !== '')
                        }
                                    );
                    $(nTd).append(linepo);
                    if (thisDocument.Vendor.POList) thisDocument.FillPOListAutoComplete(linepo);
                }
                , render: function(data, type, row, meta) {
                    if (type === 'sort') return data;
                    return '';
                }
            }
        ];

        AtlasDocument.makeLineObj(A_columns, objLineDef);

        A_columns = [...A_columns, ...[
            AtlasDocument.ColumnDefaults('DESCRIPTION')
            , {
                data: 'AMOUNT'
                , title: 'Amount'
                //, render: function (data, type, row, meta) {
                , createdCell: function (nTd, sData, oData, iRow, iCol) {
                    let amount = AtlasInput.CreateInput(
                        {
                            id: 'amount'
                            , name: 'amount'
                            , placeholder: '(0.00)'
                            , type: 'input'
                            , column: iCol
                            //, class: 'AmountClass number w2ui-field w2field input-JE'
                            , 'class': 'input-amount-line input-required input-amount Amount atlas-edit-new atlas-edit-pending'
                            , existingvalue: sData
                            , blur: function() {
                                G_ValidateAmountValue(this);
                                setTimeout(function() {
                                   thisDocument.SumAmounts();
                                }, 100);
                            }
                            , change: function () { AtlasDocument.StoreValuetoCell(this, iRow, iCol) }
                            , keydown: G_KeyNavigation
                            , disabled: true
                        }
                    );
                    $(nTd).append(amount);
                    //return amount.outerHTML;
                }
            } ,
            AtlasDocument.ColumnDefaults('TAX CODE')
            , {
                data: 'CLOSE'
                , title: 'Close'
                , createdCell: function (nTd, sData, oData, iRow, iCol) {
                    let isVisible = false;
                    if (oData.PO !== null) {
                        isVisible = true;
                    }

                    let closepo = AtlasInput.CreateInput(
                        {
                            id: 'closepo'
                            , name: 'closepo'
                            , type: 'checkbox'
                            , 'class': 'input-closepo atlas-edit-new atlas-edit-pending'
                            , existingvalue: sData
                            , keydown: G_KeyNavigation
                            , change: function () { AtlasDocument.StoreValuetoCell(this, iRow, iCol) }
                            , disabled: true
                            , visible: isVisible
                        }
                    );
                    if (sData === true) {
                        $(closepo).prop('checked', true);
                    }
                    $(nTd).append(closepo);
                }
            }
        ]];

        return {
            'LineDef': objLineDef
            , 'ColumnDef': A_columns
        }
    }

    set Vendor(objVendor) {
        if (objVendor === undefined) return;
        this._vendor = objVendor || {};
        $('#txtVendor').val(objVendor.VendorName);

        if (thisDocument.RowCount === 1) {
            let FirstLine = AtlasDocument.BindLine(thisDocument.LinesTable.row(0).node(), {});
            if (objVendor.DefaultDropdown) {
                FirstLine['TAXCODE'].value = objVendor.DefaultDropdown;
            }
        }

            if (objVendor.Required) {
                thisDocument.TaxCodeRequired = 'input-required';
                $('.input-taxcode').addClass('input-required');
            } else {
                thisDocument.TaxCodeRequired = '';
                $('.input-taxcode').removeClass('input-required');
            }
        //}
    }

    get Vendor() {
        return this._vendor;
    }

    set VendorDefaults(obj) {
        this._vendordefaults = obj;
    }

    get VendorDefaults() {
        return this._vendordefaults;
    }

    VendorSelect(that, objVendor, isSelect) {
        if (isSelect) {
            this.Vendor = objVendor;
            //$("#hdnVendorID").val(ui.item.value);
            $('#txtVendor').val(objVendor.label);
            this.VendorVerify(that);
            this.VendorDefaults = {
                'TAX CODE': objVendor.DefaultDropdown
            };
            that.Vendor = objVendor;
        //} else {
        //    this.NotifyVendorAddress($('#txtVendor')[0], objVendor);
        }
        //ShowSegmentNotify("Vendor Default Company does not match the Document Company");

        thisDocument.NotifyVendorAddress(that, objVendor);
    }

    NotifyVendorAddress(objDOM, objV) {
        $('#LiAPVendors').notify(`${objV.VendorName}\n${objV.AddressRe}\n${objV.Address2Re}`,
             { 'elementPosition': 'right top', 'style': 'atlasinvoice', 'className': 'information', 'showDuration': 0, 'autoHideDelay': 1500, 'arrowShow': false }
        );
    }

    OverrideTax(SetorEvent) {
        let thetarget = undefined;
        if (typeof SetorEvent === 'boolean'){
            thetarget = $('#TaxOverride');
            $(thetarget).prop('checked', !SetorEvent);
        } else {
            thetarget = event.target;
        }

        if ($(thetarget).prop('checked') === true) {
            $('.input-taxcode').removeClass('input-required');
            $('.input-taxcode').removeClass('field-Req');
            thisDocument.Data._data.RequiredTaxCode = false;
        } else {
            $('.input-taxcode').addClass('input-required');
            thisDocument.Data._data.RequiredTaxCode = true;
        }            
    }

    VendorVerify(objDOM) {
        if (thisDocument.Vendor.Warning) {
            $('#txtVendor').notify('This Vendor may require a Tax Code field for all line items');
        } else if (thisDocument.Vendor.Required) {
            $('#DvVendorTax').show();
            $('#lblOverrideTax').addClass('RedFont');
            $('#TaxOverride').notify('A Tax Code is required on all Invoice lines for this Vendor', { 'elementPosition': 'right' });
        } else {
            $('#TaxOverride').prop('checked', false);
            $('#lblOverrideTax').removeClass('RedFont');
            $('#DvVendorTax').hide();
        }

        this.GetVendorPOs();
    }

    clearVendor() {
        this._vendor = {};
        return this._vendor;
    }

    GetVendorPOs() {
        if (this.Vendor.VendorID){
            $.ajax(AtlasDocument.MakeAJAXPOSTobject(`${this.URLS.APIUrlGetPONumber}?ProdID=${localStorage.ProdId}&VendorId=${this.Vendor.VendorID}`
            , {}
            ))
            .done(function (response) {
                this.Vendor.POList = response;
                this.FillPOListAutoComplete($('.input-linepo'));
            }.bind(this))
            .fail(function (error) {
                ShowMSG(error);
            })
        }
    }

    FillPOListAutoComplete(that) {
        let response = thisDocument.Vendor.POList;
        that = (that)? that: this;
        var array = [];
        array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.POID,
                label: m.PONumber,
            };
        });

        let theautocomplete = {
            source: function (request, response) {
                let A_ = $.map(thisDocument.Vendor.POList.filter(e => e.CurrencyDocument === thisDocument.Bank.currencycode), function (val, i) { return { label: val.PONumber, value: val.PONumber, POID: val.POID }; });
                let matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                response($.grep(A_, function (item) {
                    return matcher.test(item.label);
                }));
            }
            , autoFocus: true
            , open: function (e, ui) {
                if (window.event) {
                    $(this).autocomplete('close');
                    //let te = $.Event('keydown');
                    //te.which = window.event.keyCode;
                    G_KeyNavigation(e, true);
                    //e.preventDefault();
                }
            }
            //, focus: function(e, ui) {
            //    this.value = ui.item.label;
            //    return false;
            //}
            , select: function(e, ui) {
                if (ui.item === null) {
                    $(this).removeData('POID');
                } else {
                    $(this).data('POID', ui.item.POID);
                    thisDocument.GetPOLines(this, 0);
                }
                return false;
            }
            //, change: function(e, ui) {
            //}
        };

        $(that).autocomplete(theautocomplete);
        return;
    }

    GetPOLines(objDOM, VendorID) {
        $.ajax(AtlasDocument.MakeAJAXPOSTobject(
            `${thisDocument.URLS.APIUrlFillPOLines}?POID=${$(objDOM).data('POID')}&ProdId=${localStorage.ProdId}&VendorId=${VendorID}`
            , {}
            ))
            .done(function (response) {
                if (response.length === 0) {
                    $(objDOM.parentElement.parentElement).notify('This PO has been fully relieved but not closed. There are no lines for relief', { elementPosition: 'top left' });
                    $(objDOM).removeData('POID');
                    $(objDOM).addClass('field-Req');
                } else {
                    $('#tblAtlasDocumentLines tr:eq(1)').find('.field-Req').removeClass('field-Req');
                    $(objDOM).removeData('POID');
                    $(objDOM).removeClass('field-Req');
                    thisDocument.ReturnFocusElement = objDOM;

                    let myA = [
                        { data: null }
                        , { data: 'POlineID', title: 'Select', 'visible': false }
                        , { data: 'PONumber', title: 'PO #' }
                        , { data: 'POLinestatus', title: 'Status' }
                    ];
                    let myO = {
                        POlineID: undefined
                        , PONumber: ''
                        , Amount: 0.00
                        , LineDescription: ''
                    };
                    AtlasDocument.makeLineObj(myA, myO, { DisplayInput: false })
                    myA.push({ data: 'AMOUNT', title: 'Balance', render: function(data) { return numeral(data).format('0,0.00'); } });
                    myA.push({ data: 'LINEDESCRIPTION', title: 'PO Line Description'} );

                    let A_Data = [];
                    response.forEach((e, i) => {
                        let transformedline = e;
                        e.TransactionString = e.Transactionstring;
                        e.AMOUNT = e.Amount;
                        e.LINEDESCRIPTION = e.LineDescription;
                        e['TAXCODE'] = e.TaxCode;
                        e.SET = e.SetCode;
                        let line = AtlasDocument.LineIDstoObj(e, myO);
                        A_Data.push(line);
                    });
                    let DOMPOLL = document.createElement('table');
                    DOMPOLL.id = 'tblPOLineList';
                    $('#dialog-polinelist')[0].appendChild(DOMPOLL);

                    let PODT = $('#tblPOLineList').DataTable({
                        //dom: 'Bfrtip',
                        destroy: true,
                        //responsive: true,
                        //scrollCollapse: true,
                        //fixedHeader: true,
                        //scrollX: false,
                        paging: false,
                        info: false,

                        data: A_Data
                        , columns: myA
                        , columnDefs: [ 
                            { orderable: false, targets: '_all' },
                            {
                                targets: 0,
                                data: null,
                                defaultContent: '',
                                orderable: false,
                                className: 'select-checkbox'
                            }
                        ]
                        , select: {
                            style:    'multi'
                        }
                        , keys: {
                            columns: 0
                            , blurable: true
                        }
                    });
                    PODT.on( 'key', function ( e, datatable, key, cell, originalEvent ) {
                        if ( key === 13 ) {
                            $($(`#tblPOLineList tbody tr:eq(${cell.index().row})`).find('td')[0]).click();
                            //this.redraw();
                        }
                    } );

                    $('#dialog-polinelist').dialog({
                        resizable: true,
                        height: "auto",
                        width: 1000,
                        modal: true,
                        close: function(event, ui) {
                            $('#tblPOLineList').remove();
                            $('#tblPOLineList_wrapper').remove() // DataTables bug
                            thisDocument.ReturnFocusElement.focus();
                        },
                        buttons: {
                            "Use Selected": function () {
                                let thePOrows = PODT.rows( { selected: true } ).data();
                                if (thePOrows.length === 0) {
                                    $(this).notify('No rows have been selected');
                                    return;
                                }
                                let startrow = $(objDOM).closest('tr');
                                let fillrow = startrow;
                                let lastrow = fillrow;
                                let chromebugfix = [];

                                thePOrows.each((POe, POi) => {
                                    if (fillrow.length === 0) {
                                        POe.PO = JSON.stringify({
                                            PONumber: POe.PONumber
                                            , POID: POe.POID
                                            , POlineID: POe.POlineID
                                        });
                                        POe.CLOSE = true;
                                        chromebugfix.push(thisDocument.AddLine(POe, 'po'));
                                    } else {
                                        $(fillrow).find('input').each((Ri, Re) => {
                                            if (Re.name === 'linepo') {
                                                Re.value = POe.PONumber;
                                                $(Re).data('polineid', POe.POlineID);
                                                $(Re).data('poid', POe.POID);
                                                $(Re).prop('disabled', true);
                                            } else if (Re.name === 'closepo') {
                                                $(Re).show();
                                                $(Re).prop('checked', true);
                                            } else if (Re.name === 'amount') {
                                                Re.value = numeral(POe.Amount).format('0,0.00');
                                            } else if (POe[Re.name]) {
                                                Re.value = POe[Re.name];
                                            } else if (POe[Re.name.toUpperCase()]) {
                                                Re.value = POe[Re.name.toUpperCase()];
                                            } else {
                                                console.log(Re.name, POe);
                                            }
                                        });

                                        //setTimeout(() => {
                                            if (fillrow.length === 0) {
                                                thisDocument.ReturnFocusElement = $(lastrow).find('input:enabled')[0];
                                                //$(lastrow).find('input:enabled')[0].focus();
                                            } else {
                                                thisDocument.ReturnFocusElement = $(fillrow).find('input:enabled')[0];
                                                $(fillrow).find('input:enabled')[0].focus();
                                            }
                                        //}, 300);
                                    }
                                    lastrow = fillrow;
                                    fillrow = fillrow.next();
                                });

                                thisDocument.SumAmounts();
                                $(this).dialog("close");
                                // Odd bug in Chrome where the input element for the linepo field is not becoming disabled even though the CO field is becoming disabled.
                                chromebugfix.forEach((e, i) => {
                                    $(e).find('input[name=linepo]')[0].disabled = true;
                                    $(e).find('input:enabled')[0].focus();
                                });
                            }
                            , "Select All": function() {
                                PODT.rows().select();
                            }
                            , "Unselect All": function() {
                                PODT.rows().deselect();
                            }
                            , Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    }).bind(PODT)
                    ;
                }
            }.bind(objDOM))
            .fail(function (error) {
                AtlasUtilities.LogError(error);
            })
        ;
    }

    createdRow(row, data, index) {
        if (data.PO !== '' && data.PO !== null) {
            $($(row).find('input[name=linepo]')[0]).attr('disabled', 'disabled');
        }
    }

    ChangeDocumentNumber() {
        if (thisDocument.Vendor) {
            $.ajax(AtlasDocument.MakeAJAXPOSTobject(
                `${thisDocument.URLS.APIUrlCheckInvoiceNumberVendorId}?InvoiceNumber=${this.value.trim()}&InvoiceId=${thisDocument.Data.InvoiceID}&VendorId=${thisDocument.Vendor.VendorID}&ProdId=${localStorage.ProdId}`
                , {}
                ))
                .done(function (response) {
                    if (response == 0) {
                        //if (!this.Data.InvoiceStatus) {
                        $(this).notify('This Invoice Number is already \nin use for this Vendor!', { autoHideDelay: 3000 });
                        $(this).addClass('font-red');
                        //}
                    } else {
                        $(this).removeClass('font-red');
                    }
                }.bind(this))
                .fail(function (error) {
                    ShowMSG(error);
                })
            ;
        } else {
            $('#txtVendor').focus();
        }
    }

    set Bank(ui) {
        if (ui.isSelect) {
            this._bank = ui.item;
            $('#txtBank').val(ui.item.label);
            $('#CurrencyDocument').text(ui.item.currencycode);
        }
    }

    get Bank() {
        return this._bank;
    }

    ChangeCompany(ddlCompany) {
        if (ddlCompany.value) {
            super.ChangeCompany(ddlCompany.value);
            this.FillBankDetails($('#txtBank'), thisDocument);
        } else {
            $(ddlCompany).notify('Please select a Company');
        }
    }

    FillBankDetails(BankDOM, obj, BankID) {
        if ($('#ddlCompany').val()) {
            $.ajax(AtlasDocument.MakeAJAXPOSTobject(
                `${this.URLS.APIUrlFillBankDetails}?CompanyId=${$('#ddlCompany').val()}&ProdId=${localStorage.ProdId}`
                , {}
                ))
                .done(function (response) {
                    obj.BankList = response; //legacy: CheckBankID

                    if (BankID) { // We need to check this first, otherwise we end up with an infinite loop
                        let thebank = response.find((e) => { return e.BankId === BankID; });
                        thisDocument.Bank = {
                            item: {
                                value: thebank.BankId,
                                label: thebank.Bankname,
                                currencycode: thebank.CurrencyCode
                            },
                            isSelect: true
                        };
                    } else if (response.length === 1) {
                        //$("#hdnBank").val(response[0].BankId);
                        $('#txtBank').val(response[0].Bankname);
                        thisDocument.Bank = {
                            item: {
                                value: response[0].BankId,
                                label: response[0].Bankname,
                                currencycode: response[0].CurrencyCode
                            },
                            isSelect: true
                        };
                        thisDocument.Data.BankID = response[0].BankId;
                    }

                    var array = response.error ? [] : $.map(response, function (m) {
                        return {
                            value: m.BankId,
                            label: m.Bankname,
                            currencycode: m.CurrencyCode
                        };
                    });
                    $(BankDOM).autocomplete({
                        minLength: 0,
                        source: array,
                        autoFocus: true,
                        focus: function (event, ui) {
                            obj.Bank = ui;
                            event.preventDefault();
                        },
                        select: function (event, ui) {
                            ui.isSelect = true;
                            obj.Bank = ui;
                            obj.Data.BankID = ui.item.value;
                            return false;
                        }
                    })
                }.bind(obj))
                .fail(function (error) {
                    $(BankDOM).notify('We cannot pull your list of banks at this time.');
                })
            ;
        } else {
            $(BankDOM).notify('You must select a company before you can select a bank.');
            $('#ddlCompany').focus();
        }
    }

    initDocument() {
        super.initDocument();

        $('#txtVendor').change = this.VendorVerify;
        $('#txtVendor').focus(function() {
            thisDocument.clearVendor();;
        });
        $('#txtVendor').blur(function() {
            if (this.value === '') thisDocument.clearVendor();
            thisDocument.Vendor = thisDocument.VendorList.find((e) => {return e.VendorName === this.value;});
            if (!thisDocument.Vendor.VendorID) {
                $(this).notify('Please specify/select a valid Vendor').select();
            }
        });
        $('#TaxOverride').change(this.OverrideTax);

        $('#txtDocumentNumber').blur(G_DocumentHeaderEmptyValue);
        $('#txtDocumentNumber').change(this.ChangeDocumentNumber);
        $('#txtAmount').blur(function() {
            G_ValidateAmountValue(this);
            if (thisDocument) thisDocument.SumAmounts();
        });
        $('#txtAmount').blur();

        $(document).delegate('#txtAmount', 'dblclick', function (e) {
            if (thisDocument.Data.DocumentStatus.toUpperCase() === 'POSTED') return;
            if (thisDocument.isHeaderAmountLocked) {
                if (this.ManualValue) this.value = this.ManualValue;
            } else {
                this.ManualValue = this.value;
            }

            thisDocument.isHeaderAmountLocked = !thisDocument.isHeaderAmountLocked;
            thisDocument.SumAmounts();
            $(this).select();
        });
        $('#txtAmount').on('keydown', function(e) {
            if (e.keyCode === 9) { /// user is tabbing
                if (this.value === '') {
                    this.value = '0.00';
                }
                if (!e.shiftKey){
                    if ($('#txtBank').val() === '') {
                        $('#txtBank').select();
                    } else {
                        $('#txtDocumentDescription').select();
                    }
                    e.preventDefault();
                }
                return;
            }

            thisDocument.isHeaderAmountLocked = false;
        });

        $('#txtBank').blur(function() {
            if (G_DocumentHeaderEmptyValue.bind(this)) {
                if (!thisDocument.Bank) {
                    $(this).notify('Please select a valid Bank').select();
                }
            }
        });

        $('#txtInvoiceCheckGroupNumber').change(function() {
            thisDocument.ConfirmPaymentInformation('PAYBY');
        })

        $('#txtInvoiceCheckNumber').blur(function() {
            thisDocument.ConfirmPaymentInformation('PAYMENTNUMBER');
        })
    }

    DeleteLine(objD, action, rowID) {
    }

    DefaultLineFocus() {
        AtlasDocument.setLineFocus(1, 4);
    }

    ChangePaymentType(newpaymenttype) {
        thisDocument.Data.Payby = newpaymenttype;
        if (newpaymenttype.toUpperCase() !== 'MANUAL CHECK') {
            $('#txtInvoiceCheckNumber').val('');
            $('#txtDocumentDescription').data('shiftfocus', 'txtInvoiceCheckGroupNumber');
        } else {
            $('#txtDocumentDescription').data('shiftfocus', 'txtInvoiceCheckNumber');
            $('#txtInvoiceCheckGroupNumber').val('0');
        }
        thisDocument.ConfirmPaymentInformation('PAYBY');
    }

    ConfirmPaymentInformation(checkwhat) {
        $('#txtInvoiceCheckNumber').addClass('input-loading');
        let callP = {
            //contentType: 'application/json; charset=utf-8'
            BankID: thisDocument.Data.BankID
            , ProdID: localStorage.ProdId
            , VendorID: thisDocument.Vendor.VendorID
            , PaymentType: thisDocument.Data.Payby
            , PaymentNumber: $('#txtInvoiceCheckNumber').val()
            , PaymentGroup: $('#txtInvoiceCheckGroupNumber').val()
        }

        //if (checkwhat === 'PAYMENTNUMBER') {
        //    callP.PaymentNumber =  $('#txtInvoiceCheckNumber').val();
        //}// else if (checkwhat === 'PAYBY') {
        //    callP.PaymentGroup = $('#txtInvoiceCheckGroupNumber').val();
        ////}
        
        $.ajax(AtlasDocument.MakeAJAXPOSTobject(thisDocument.URLS.APIUrlAPAtlasPaymentInformationGet, JSON.stringify(callP)))
        .done(function(response) {
            $('#txtInvoiceCheckNumber').removeClass('input-loading');
            let {JSON_Payment, JSON_VendorGroup, JSON_InvoicePayment, JSON_NextCheck} = response[0];
            let theNextCheckNumber = JSON.parse(JSON_NextCheck)[0].CheckNumber;
            let A_CheckNumberAssignments = JSON.parse(JSON_InvoicePayment);
            let isInvalid = false;
            if (checkwhat === 'PAYMENTNUMBER'){
                if (JSON_Payment !== null) {
                    $('#txtInvoiceCheckNumber').notify(`Check #${callP.PaymentNumber} has already been issued. You must provide a different #\n${theNextCheckNumber} is available.`);
                    $('#txtInvoiceCheckNumber').addClass('field-Fatal');
                    isInvalid = true;
                }
                if (JSON_InvoicePayment !== null) {
                    if (A_CheckNumberAssignments[0].VendorID != thisDocument.Vendor.VendorID) {
                        $('#txtInvoiceCheckNumber').notify(`Check #${A_CheckNumberAssignments[0].InvoicePaymentNumber} has already been assigned\nVendor: ${A_CheckNumberAssignments[0].VendorName}\nInvoice: ${A_CheckNumberAssignments[0].InvoiceNumber}\nYou must provide a different Check #`);
                        isInvalid = true;
                    } else if (A_CheckNumberAssignments[0].InvoicePaymentGroup === '#' && A_CheckNumberAssignments[0].InvoiceID != thisDocument.Data.InvoiceID){
                        $('#txtInvoiceCheckNumber').notify(`Check #${callP.PaymentNumber} has already been uniquely assigned to Invoice ${A_CheckNumberAssignments[0].InvoiceNumber}\nYou must provide a different Check #`);
                        isInvalid = true;
                    } else if (A_CheckNumberAssignments[0].InvoicePaymentGroup !== $('#txtInvoiceCheckGroupNumber').val()) {
                        $('#txtInvoiceCheckNumber').notify(`Check #${callP.PaymentNumber} has already been assigned to Group ${A_CheckNumberAssignments[0].InvoicePaymentGroup}\nYou must provide a different Check #`);
                        isInvalid = true;
                    //} else  {
                    //    $('#txtInvoiceCheckNumber').val(A_CheckNumberAssignments[0].InvoicePaymentNumber);
                    }
                }
                if (JSON_Payment === null && JSON_VendorGroup === null && JSON_InvoicePayment === null) {
                    let A_NextCheckNumber = JSON.parse(JSON_NextCheck);
                    if (!A_NextCheckNumber.find((e) => { return e.CheckNumber === $('#txtInvoiceCheckNumber').val(); })) { // This means they entered a check number that's invalid
                        $('#txtInvoiceCheckNumber').notify(`Check #${callP.PaymentNumber} is an invalid Check Number\nThe Next Check Number is ${theNextCheckNumber}.`);
                        isInvalid = true;                        
                    } else if (theNextCheckNumber !== $('#txtInvoiceCheckNumber').val()) {
                        $('#txtInvoiceCheckNumber').notify(`Check #${callP.PaymentNumber} is a valid Check Number but not the next Check Number.\nThe Next Check Number is ${theNextCheckNumber}.`, 'warning');
                    }
                }
                if (JSON_VendorGroup !== null) {
                    let A_VendorGroup = JSON.parse(JSON_VendorGroup);
                    if (A_VendorGroup[0].InvoicePaymentGroup === $('#txtInvoiceCheckGroupNumber').val() && A_VendorGroup[0].InvoicePaymentNumber === $('#txtInvoiceCheckNumber').val()) {
                    } else {
                        if (A_VendorGroup.length !== 1) {
                            $('#txtInvoiceCheckNumber').notify(`Check #${A_VendorGroup[0].InvoicePaymentNumber} is already assigned to Group ${A_VendorGroup[0].InvoicePaymentGroup}.\nThere is more than one Invoice assigned to this group.\nYou must use Check Number ${A_VendorGroup[0].InvoicePaymentNumber}`);
                            isInvalid = true;
                        }
                    }
                }
                if (isInvalid) {
                    $('#txtInvoiceCheckNumber').addClass('field-Req');
                    return;
                } else {
                    $('#txtInvoiceCheckNumber').removeClass('field-Req');
                }
            } else {
                let theCheckNumber = '';
                if (JSON_VendorGroup === null) {
                    theCheckNumber = theNextCheckNumber;
                } else {
                    theCheckNumber = JSON.parse(JSON_VendorGroup)[0].InvoicePaymentNumber;
                }
                $('#txtInvoiceCheckNumber').val(theCheckNumber);
            }

            $('#txtInvoiceCheckNumber').removeClass('field-Req');
            $('#txtInvoiceCheckNumber').removeClass('field-Fatal');
        }.bind({
            'checkwhat': checkwhat, 
            'callP': callP 
        }))
        .error(function(error) {
            AtlasUtilities.LogError(error);
        })
    }

    SumAmounts() {
        let thesum = 0.00;
        $('.input-amount-line').each(function (i, dom) {
            thesum += parseFloat(numeral(dom.value).value());
        });

        thesum = thesum.toFixed(4);
        $('#DocumentAmountTotal').text(numeral(thesum).format('0,0.00'));
        if (thisDocument.isHeaderAmountLocked) $('#txtAmount').val(numeral(thesum).format('0,0.00'));
        if (numeral($('#txtAmount').val()).value() !== numeral($('#DocumentAmountTotal').text()).value()) {
            $('#txtAmount').addClass('field-Req');
        } else {
            $('#txtAmount').removeClass('field-Req');
        }
    }

    EnablePowerButtons() {
        let docS = thisDocument.Data.DocumentStatus.toUpperCase();
        let paymentJSON = thisDocument.Data.PaymentStatusJSON;

        if (docS === 'NEW') {
            $('#btnInvoiceClone').hide();
            $('#btnInvoiceDelete').hide();
            $('#btnReverse').hide();
        } else if (docS === 'PENDING') {
            $('#btnInvoiceClone').show();
            $('#btnInvoiceDelete').show();
            $('#btnReverse').hide();
        } else if (docS === 'POSTED') {
            $('#btnInvoiceClone').show();
            $('#btnInvoiceDelete').hide();
            if (paymentJSON) {
                $('#btnReverse').hide();
            } else {
                $('#btnReverse').show();
            }
        }
    }

    EnableForm() {
        thisDocument.enableformfilter = '';
        let docS = this.Data.DocumentStatus.toUpperCase();

        if (docS === 'NEW') {
            thisDocument.enableformfilter += ' .atlas-edit-new';
            this.EnableCompany();
            this.EnablePeriod();
        } else if (docS === 'PENDING') {
            thisDocument.enableformfilter += ' .atlas-edit-pending';
            this.EnablePeriod();
        } else  if (docS === 'POSTED' )  {
            thisDocument.enableformfilter += ' .atlas-edit-unpaid';
            thisDocument.LinesTable.rowReorder.disable();
        }
        if (this.Data.isPaid) thisDocument.enableformfilter += ' .atlas-edit-paid';

        super.EnableForm();
    }

    EnableLineForm(rownumber) {
        $(`#tblAtlasDocumentLines tr:eq(${rownumber}) :input`).filter('.input-linepo').attr('disabled', false);
        super.EnableLineForm(rownumber);
    }

    Save(objP) {
        objP = (objP === undefined)? {}: objP;
        let SaveInvoiceID = (objP.isClone)? 0: thisDocument.Data.InvoiceID;

        $('#frmAtlasDocument').find('.input-required').each(function(i, e){
            if (e.value === '') {
                $(e).addClass('field-Req');
            } else {
                $(e).removeClass('field-Req');
            }
        })
        ;
        if ($('#frmAtlasDocument').find('.field-Req').notify('Please correct').length !==0) {
            $('#AtlasInvoiceNavigation').notify('This Invoice was not saved!\nPlease correct the fields below in red.');
            return;
        }

        //thisDocument.Data.Amount = $('#txtAmount').val();
        let A_DocumentLines = [];
        let invaliddata = 0;
        let InvoiceNumber = thisDocument.Data.InvoiceNumber;
        if (objP.isClone) {
            InvoiceNumber = prompt(`Please supply a new Invoice Number.\nYour new Invoice will have Batch Number ${BatchManager.SystemBatch}`, InvoiceNumber);
            if (InvoiceNumber === '' || InvoiceNumber === null) {
                alert('You must supply a valid Invoice Number for the Clone');
                thisDocument.Notify(null, 'This Invoice was NOT cloned. You must supply a valid Invoice Number.');
                return;
            }
            thisDocument.Data.DocumentStatus = 'NEW';
            localStorage.ActiveInvoiceTab = '/AccountPayable/PendingInvoice';
            AtlasInvoice.SetActiveTab();
        }
        let isNew = thisDocument.Data.DocumentStatus.toUpperCase() === 'NEW';
        let theClosePeriodID = (!thisDocument.Data.ClosePeriodID)? $('#ddlClosePeriod').val(): thisDocument.Data.ClosePeriodID;
        let theBatchNumber = thisDocument.Data.BatchNumber;
        if (objP.isClone) {
            theBatchNumber = localStorage.SystemBatch;
        } else if (isNew) {
            theBatchNumber = BatchManager.BatchNumber;
        }

        let objDocumentHeader = {
            InvoiceID: SaveInvoiceID,
            InvoiceNumber: InvoiceNumber,
            CompanyID: thisDocument.Data.CompanyID,
            VendorID: thisDocument.Vendor.VendorID,
            VendorName: thisDocument.Vendor.VendorName,
            ThirdParty: thisDocument.Data.ThirdParty,
            WorkRegion: thisDocument.Data.WorkRegion,
            Description: thisDocument.Data.Description,
            OriginalAmount: (isNew)? thisDocument.Data.Amount: thisDocument.Data.OriginalAmount,
            CurrentBalance: thisDocument.Data.Amount,
            NewItemamount: (thisDocument.Data.Amount - thisDocument.Data.OriginalAmount),
            Newbalance: thisDocument.Data.Newbalance,
            BatchNumber: theBatchNumber,
            BankId: thisDocument.Data.BankID,
            InvoiceDate: thisDocument.Data.DocumentDate,
            DueDate: thisDocument.Data.DueDate,
            Payby: thisDocument.Data.Payby,
            CheckGroupNumber: thisDocument.Data.CheckGroupNumber,
            CheckNumber: thisDocument.Data.CheckNumber,
            InvoiceStatus: (isNew)? 'PENDING': thisDocument.Data.DocumentStatus,
            CreatedBy: localStorage.UserId,
            ProdID: localStorage.ProdId,
            Amount: thisDocument.Data.Amount,
            ClosePeriodID: theClosePeriodID,
            RequiredTaxCode: thisDocument.Data.RequiredTaxCode,
        }

        debugger
        $('#tblAtlasDocumentLines tr').each((i, e) => {
            let trinput = $(e).find('input');
            if (trinput.length === 0) return;

            let objLine = thisDocument.LinesTable.row(e).data();
            let objLineInput = {};
            //thisDocument.LinesTable.data().each((Te, Ti) => { if (Te.rowID == i) objLine = Te; })

            trinput.each((ii, ie) => {
                //let propername = (objLine[ie.name.toUpperCase()] != '')? ie.name.toUpperCase(): ie.name;
                objLine[ie.name] = ie.value;
                objLineInput[ie.name] = ie;
            })

            let POLineID = (objLine.linepo)? $(objLineInput.linepo).data('polineid'): null;
            objLine.closepo = objLineInput.closepo.checked;

            let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objLine);
            if (COAID === undefined || COACode === undefined) {
                Object.keys(SegCheck).forEach((seg) => {
                    //if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) {
                    //    //$(e).find(`td.input-segment [name=${seg}]`).notify('Invalid Account');
                    //}
                    //$(e).find(`td.input-segment [name=${seg}]`).addClass('field-Req');
                    $(e).find(`input[name=${seg}]`).addClass('field-Req');
                });
                invaliddata++;
            }
            let SetID;
            if (AtlasUtilities.SEGMENTS_CONFIG.Set && objLine.Set !== '') {
                let objSet = AtlasUtilities.SEGMENTS_CONFIG.Set[objLine.Set];
                if (!objSet) {
                    $(e).find('td[id=tdSet]').addClass('field-Req');
                    $(e).find('input[name=Set]').notify('Invalid Set');
                    invaliddata++;
                } else {
                    SetID = objSet.AccountID;
                }
            }
            let TransString = '';
            if (thisDocument.TransactionCodes) {
                if (thisDocument.TransactionCodes.length) {
                    thisDocument.TransactionCodes.forEach(T => {
                        let thevalue = objLine[T.TransCode];

                        //let theobj = $(e).find(`input[name=${T.TransCode}]`)[0];
                        //let thevalue = theobj.value ;//+ ' test';
                        //let thename = theobj.name;
                        let isvalid = (thevalue === '')? true: T.TV.find(V => { return V.TransValue === thevalue; });
                        if (!isvalid) {
                            $(theobj).notify('Invalid Code');
                            $(theobj).addClass('field-Req');
                            invaliddata++
                        } else if (isvalid !== true) {
                            TransString += T.Details.TCID;
                            TransString += ':' + isvalid.TVID + ',';
                        }
                    });
                    TransString = TransString.slice(0, -1);
                }
            }

            let SaveLineID = (objP.isClone)? 0: objLine.DocumentLineID;
            let theline = {
                InvoiceLineID: SaveLineID,
                InvoiceID: SaveInvoiceID,
                COAID: COAID,
                Amount: numeral(objLine.amount).format('0.00'),
                LineDescription: objLine.linedescription,
                InvoiceLinestatus: (thisDocument.Data.DocumentStatus.toUpperCase() === 'NEW')? 'PENDING': thisDocument.Data.DocumentStatus,
                COAString: COACode,
                Transactionstring: TransString,
                POlineID: POLineID,
                CreatedBy: localStorage.UserId,
                ProdID: localStorage.ProdId,
                PaymentID: null,
                SetID: SetID,
                SeriesID: null,
                ClearedFlag: objLine.closepo,
                TaxCode: objLine.taxcode,
                rowID: objLine.rowID
            }
            A_DocumentLines.push(theline);

        }) // End tbl Loop

        if (invaliddata > 0) {
            $('#AtlasInvoiceNavigation').notify('This Invoice was not saved\nPlease correct the fields in red!');
            return;
        }


        let FinalObj = {
            objIn: objDocumentHeader,
            objInLine: A_DocumentLines
        }

        //console.log(FinalObj);
        //return;

        let APISave = new Promise(function (resolve, reject) {
            let waitvar = [];
            waitvar.push($.ajax(
                AtlasDocument.MakeAJAXPOSTobject(
                    thisDocument.URLS.APIUrlSaveInvoice,
                    JSON.stringify(FinalObj),
                    'application/json; charset=utf-8'
                    , true
                )
            ).done(function (data) {
                let A_data = data.toString().split('.');
                let TransactionNumber = A_data[0];
                let InvoiceID = A_data[1];
                let thebuttons = {
                    'Stay on this Invoice': function () {
                        AtlasInvoice.NewDocument((objP.isClone)? thisDocument.Data.InvoiceID: InvoiceID);
                        $(this).dialog("close");
                    }
                    , 'Start New Invoice': function () {
                        AtlasInvoice.NewDocument(0);
                        $(this).dialog("close");
                    }
                    , 'Return to Invoice List': function() {
                        window.location = localStorage.ActiveInvoiceTab;
                    }
                };

                let msgTransactionNumber = `Transaction Number is: ${TransactionNumber}`;
                if (objP.isClone) {
                    thebuttons['Edit the Clone Invoice'] = function() {
                        localStorage.EditInvoiceId = InvoiceID;
                        AtlasInvoice.NewDocument(InvoiceID);
                        $(this).dialog("close");
                    }
                    msgTransactionNumber = 'CLONE ' + msgTransactionNumber;
                }
                $('#breadcrumbEditInvoice').notify('Invoice Saved', 'success');
                $('#spanAtlasInvoiceTransactionNumber').text(msgTransactionNumber);
                $('#spanTRNumber').text(data);

                $("#dialog-confirm-save-success").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: thebuttons
                });

                //$('#SaveInvoiceSuccess').show();
                //$('#btnSaveOK').focus();

                resolve(data);
            }).fail(function (error) {
                $('#breadcrumbEditInvoice').notify('We encountered an error. This Invoice was not saved.');

                AtlasUtilities.ShowError(error);
                reject(error);
            })
            );
        });

        APISave.then(function(InvoiceID) {
            let waitvar = [];
            if (!objP.isClone) {
                waitvar.push($.ajax(
                    AtlasDocument.MakeAJAXPOSTobject(
                        thisDocument.URLS.APIUrlDeleteInvoiceLine,
                        JSON.stringify(thisDocument._deletedlines),
                        'application/json; charset=utf-8'
                        , true
                    )
                    ).done(function (data) {
                        thisDocument._deletedlines = [];
                    })
                );
            }
        });

        //if (objP.isClone) {
        //    $('#breadcrumbEditInvoice').notify('This will prompt the user for a new Invoice # and then perform the Clone function');
        //}
    }

    DeleteConfirmed(func) {
        if (typeof func === 'function') {
            $.ajax(AtlasDocument.MakeAJAXPOSTobject(`${thisDocument.URLS.APIUrlDeleteInvoiceByInvoiceId}?InvoiceId=${thisDocument.Data.InvoiceID}&ProdId=${localStorage.ProdId}`
                , {}
            )
            ).done(function(response) {
                func(response);
            });
        }
    }

    Delete() {
        $('#dialog-confirm-delete-invoice').dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Cancel & DO NOT Delete": function () {
                    $(this).dialog("close");
                }
                , "Delete & Start New Invoice": function (response) {
                    thisDocument.DeleteConfirmed(function() {
                        thisDocument.Notify(null, `Invoice ${thisDocument.Data.InvoiceNumber} deleted!`);
                        AtlasInvoice.NewDocument(0);
                    });
                    $(this).dialog("close");
                }
                , "Delete & Return to Invoice List": function (response) {
                    thisDocument.DeleteConfirmed(function() {
                        window.location = localStorage.ActiveInvoiceTab;
                    })
                    $(this).dialog("close");
                }
            }
        });
    }

    Notify(DOM, message, options) {
        DOM = (DOM === null)? '#breadcrumbEditInvoice': DOM;
        $(DOM).notify(message);
    }

    Reverse() {
        thisDocument.Notify('This will prompt the user to confirm and then perofrm the Reverse function');
    }

    Cancel() {
        $('#dialog-confirm-cancel-invoice').dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Do Not Cancel": function () {
                    $(this).dialog("close");
                }
                , "Cancel & Start New Invoice": function() {
                    $(this).dialog('close');
                    AtlasInvoice.NewDocument(0);
                }
                , "Cancel & Return to Invoice List": function() {
                    $(this).dialog('close');
                    window.location = localStorage.ActiveInvoiceTab;
                }
            }
        });
        //$('#breadcrumbEditInvoice').notify('This will prompt the user to confirm and then send the user back to their selected Invoice tab');
    }

    AddLine(objD, action, rowID) {
        return super.AddLine(objD, action, rowID);
    }

    get isHeaderAmountLocked() {
        return this._isHeaderAmountLocked;
    }

    set isHeaderAmountLocked(bool) {
        if (bool) {
            $('#lbltxtAmount').addClass('fas fa-lock');
        } else {
            $('#lbltxtAmount').removeClass('fas fa-lock');
        }

        this._isHeaderAmountLocked = bool;
    }

    static BindVendorbyID(VendorID) {
        //AtlasDocument.RegisterPostinitFunction(function() {
        thisDocument.FillVendor($('#txtVendor'), thisDocument);
        if (VendorID) {
            thisDocument.Vendor = thisDocument.VendorList.find((e) => {return e.VendorID === VendorID;});
            thisDocument.GetVendorPOs();
        }
        //});
    }

    static BindVendorbyName(VendorName) {
        //AtlasDocument.RegisterPostinitFunction(function() {
        thisDocument.FillVendor($('#txtVendor'), thisDocument);
        thisDocument.Vendor = thisDocument.VendorList.find((e) => {return e.VendorName === VendorName;});
        //});
    }

    static BindTaxOverride(TaxOverride) {
        thisDocument.OverrideTax(TaxOverride);
        thisDocument.Data._data.RequiredTaxCode = TaxOverride;
    }

    static BindAmount(Amount) {
        $('#txtAmount').val(Amount);
        G_ValidateAmountValue(document.querySelector('#txtAmount'));
    }

    static BindBank(BankID){
        if (BankID) {
            if (thisDocument.isRendered) {
                thisDocument.Data._data.BankID = BankID;
                return;
            }
        }

        thisDocument.FillBankDetails($('#txtBank'), thisDocument, BankID);
    }

    static ExistingLineProcessor(data, LineDef) {
        let A_ = AtlasDocument.TransformCodesinLines(JSON.parse(data), LineDef);
        return A_;        
    }

    //static TransformCodesinLines(A_, LineDef) {
    //    let ret = [];
    //    A_.forEach((e) => {
    //        let line = AtlasDocument.LineIDstoObj(e, LineDef);
    //        if (!line.PO) line.PO = {};
    //        ret.push(line);
    //    });
    //    return ret;
    //}

    static BindPaymentType(paymenttype) {
        let objConfig = new AtlasConfig();
        objConfig.ConfigGet('Settings.Banks.PaymentTypes.List', function(response) {
            AtlasForms.Controls.DropDown.RenderData(
                JSON.parse(response.ConfigJSON),
                {
                    domID: 'ddlPaymentType', 
                    mapping: {label: (l) => {return l;}, value: (v) => {return v;} },
                    existingValue: paymenttype
                }
            );
        })

        if (paymenttype.toUpperCase() === 'MANUAL CHECK') {
            $('#divCheckNumber').removeClass('hidden');
            $('#txtInvoiceCheckNumber').addClass('input-required');
            $('#txtDocumentDescription').data('shiftfocus', 'txtInvoiceCheckNumber');
        } else {
            $('#divCheckNumber').addClass('hidden');
            $('#txtInvoiceCheckNumber').removeClass('input-required');
            $('#txtDocumentDescription').data('shiftfocus', 'txtInvoiceCheckGroupNumber');
        }

        return paymenttype;
    }

    static SetActiveTab() {
        switch (localStorage.ActiveInvoiceTab) {
            case '/AccountPayable/PostInvoice':
                $('#liAPInvoicesPaidTab a').addClass('activesub');
                $('#liAPInvoicesPostedUnpaidTab a').removeClass('activesub');
                $('#liAPInvoicesUnpostedTab a').removeClass('activesub');
                break;
            case '/AccountPayable/PostedUnpaidInvoices':
                $('#liAPInvoicesPostedUnpaidTab a').addClass('activesub');
                $('#liAPInvoicesPaidTab a').removeClass('activesub');
                $('#liAPInvoicesUnpostedTab a').removeClass('activesub');
                break;
            case '/AccountPayable/PendingInvoice':
                $('#liAPInvoicesUnpostedTab a').addClass('activesub');
                $('#liAPInvoicesPaidTab a').removeClass('activesub');
                $('#liAPInvoicesPostedUnpaidTab a').removeClass('activesub');
                break;
        };
    }
}

//var TCodes = undefined; //AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON;
//var TaxCodes = undefined; //AtlasCache.Cache.GetItembyName('Tax Codes');

$(function () {
    //let InvoiceID = 118;// 253;
    //let InvoiceID = 252;
    let InvoiceID = parseInt(localStorage.EditInvoiceId);
    AtlasInvoice.NewDocument(InvoiceID);
    $('#liAPInvoicesAddInvoiceTab').addClass('active');
    if (InvoiceID === 0) {
        $('#hrefInvoices').text('Add Invoice');
    } else {
        $('#hrefInvoices').text('Edit Invoice')
    }

    AtlasInvoice.SetActiveTab();

});


/* OBSOLETE
function SelectCompany() {
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());
    $('#tblAtlasDocumentLinestbody').html('');
}
*/

// GLOBAL

//$(document).keydown(function (e) {
//    // ESCAPE key pressed
//    if (e.keyCode == 27) {
//        hideDiv('dvPOLines', 'hrfAddJE');
//        ReturnFocus(this);
//    }
//});


//$('#tblAtlasDocumentLines').delegate('.input-taxcode.input-closepo', 'keydown', function(e) {
$('#tblAtlasDocumentLines').on('keydown', '.input-taxcode,.input-closepo', function(e) {
    if (e.shiftKey) return;

    let key = e.which || e.keyCode;
    if (key === 9) { // tab key
        let isLastInput = AtlasDocument.isLastInputintr(this);
        if (!isLastInput) return;
        if (AtlasDocument.isInLasttr(this)) { // only perform cloning if it's the last row
            if (thisDocument.Data.DocumentStatus.toUpperCase() === 'POSTED') {
                AtlasDocument.setLineFocus(1, $('#tblAtlasDocumentLines tr:eq(1) td').find('input:enabled')[0].closest('td').cellIndex);
            } else {
                thisDocument.CloneLastLinetoEnd(this);
            }
        } else {
            //$(this.parentElement.parentElement.nextElementSibling.children[thisDocument.FocusColumn]).find('input').focus().select();
            AtlasDocument.setLineFocus(this.parentElement.parentElement.nextElementSibling.rowIndex, thisDocument.FocusColumn);
        }
        e.preventDefault();
}
});


$("#txtInvoiceCheckGroupNumber").inputFilter(function(value) {
    return /^#*\d*$/.test(value) && (value === '#' || value === '' || parseInt(value) <= 99);
});

$("#txtInvoiceCheckNumber").inputFilter(function(value) {
    return /^\d*$/.test(value);// && (value === '');
});


$("#txtAmount").inputFilter(function(value) {
    return /^-?[\d{1,3}]*,?[\d{1,3}]*.?\d{0,2}/.test(value);
});

$.notify.addStyle('atlasinvoice', {
    html: '<div><span data-notify-text/></div>',
    classes: {
        base: {
            'white-space':'nowrap',
            'background-color': 'lightblue',
            'padding': '5px',
            'font-size': '10pt'
        }
    }
});


//HINT Object.keys(thisDocument.LinesTable.data()) + Object.keys(thisDocument.LinesTable.rows()[0]) gives you the limit of the rows inside the datatable.