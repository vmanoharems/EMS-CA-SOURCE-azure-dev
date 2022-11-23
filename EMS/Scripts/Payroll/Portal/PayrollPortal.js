"use strict";
var G_PayrollPortal;
var G_PayrollDocument;

class PayrollPayment {
    constructor(theDIV, data, index) {
        this._DATA = data;
        this._theDIV = theDIV;
        this._index = index;
    }

    get FIELDS() {
        return {
            CheckNumber: { id: 'CheckNum', type: 'text', name: 'checknum', existingvalue: this._DATA.checknumber, fieldsetlabel: 'Check Number', disabled: true },
            LastName: { id: 'LastName', type: 'text', name: 'lastname', existingvalue: this._DATA.lastname, fieldsetlabel: 'Last Name', class: 'input-required track header paymentheader', track: true, required: true },
            FirstName: { id: 'FirstName', type: 'text', name: 'firstname', existingvalue: this._DATA.firstname, fieldsetlabel: 'First Name', class: 'input-required track header paymentheader', track: true, required: true },
            SSN4: { id: 'SSN', type: 'text', name: 'ssn4', existingvalue: this._DATA.ssn4, fieldsetlabel: 'SSN', disabled: true },
            LineAmountTotal: { id: 'LineAmountTotal', type: 'text', name: 'lineamounttotal', existingvalue: numeral(this._DATA.lineamounttotal).format('0,0.00'), fieldsetlabel: 'Check Amount', class: 'numeric', disabled: true }
        }
    }

    get PaymentLineColumns() {
        return [
            { data: 'companycode', title: 'CO' }
            , { data: 'locationcode', title: 'LO' }
            , {
                data: 'accountcode', title: 'DT',
                render: (data, type, line) => { return `<input required type="text" name="DT" id="DT" value="${data}" class="input-required track prline" data-original="${data}" data-expenselineid="${line.expenselineid}">` }
            }
            , {
                data: 'linedescription', title: 'Description',
                render: (data, type, line) => { return `<input required type="text" name="Desc" id="Desc" class="input-required track prline linedescription" value="${data}" data-original="${data}" data-expenselineid="${line.expenselineid}">`; }
            }
            , {
                data: 'lineamount', title: 'Amount'
                , render: $.fn.dataTable.render.number(',', '.', 2)
            }
            , {
                data: 'linerate', title: 'Rate'
                , render: $.fn.dataTable.render.number(',', '.', 2)
            }
            , { data: 'linehours', title: 'Hours/Qty' }
            , {
                data: 'taxcode', title: 'Tax Code',
                render: (data, type, line) => { return (type !== 'display') ? data : `<input type="text" name="TaxCode" id="TaxCode" value="${data}" class="track prline linetaxcode" data-original="${data}" data-expenselineid="${line.expenselineid}">` }
            }
            , {
                data: 'notes', 'title': 'Notes',
                render: (data, type, line) => { return (type !== 'display') ? data : `<input type="text" name="Notes" id="Notes" value="${data || ''}" class="track linenotes prline" data-original="${data || ''}" disabled data-expenselineid="${line.expenselineid}">`; }
            }
        ];
    }

    RenderPRDocumentPaymentID(func) {
        func = (!func) ? 'appendChild' : func;
        let theInput = AtlasInput.CreateInput({
            type: 'hidden'
            , id: 'payrolleditpaymentid'
            , name: 'payrolleditpaymentid'
            , class: 'numeric'
            , existingvalue: this._DATA.payrolleditpaymentid
        });

        this._theDIV[func](theInput);
        return this;
    }

    RenderPRDocumentPaymentField(objField, func) {
        func = (!func) ? 'appendChild' : func;
        let theInput = AtlasInput.CreateInput(objField);
        this._theDIV[func](theInput);
        return this;
    }
    RenderPRDocumentPaymentFieldset(objField, func) {
        func = (!func) ? 'appendChild' : func;
        let theInput = AtlasInput.CreateFieldset(objField);
        this._theDIV[func](theInput);
        return this;
    }

    get PaymentTable() {
        let self = this;
        let response = this._DATA;
        let mytable = document.createElement('table');// $(`<table id="tblTransactions-${AccountCode}">`);
        mytable.id = `tblTransactions-${response.employeeid}`;
        $(mytable).css('width', '100%');

        let divPayee = $(`<div id="Transactions-${response.employeeid}" data-employeeid="${response.employeeid}"></div>`);
        $(divPayee).append(mytable);

        let A_Data = response.PREPL;
        let DTmytable = $(mytable).DataTable({
            dom: 't'
            , destroy: true
            , sorting: false
            , paging: false
            , language: {
                emptyTable: `There are no transactions for Payee ${response.employeeid}`
            }
            , info: false
            , data: A_Data
            , columns: self.PaymentLineColumns
            , columnDefs: [
                {
                    targets: [4,5,6], className: 'dt-body-right'
                }
            ]
            , createdRow: function(row, data, dataIndex) {
                $(row).attr('data-payrolleditpaymentlineid', data.payrolleditpaymentlineid)
                if (data.expensetype !== 'L') $(row).find('input.linedescription,input.linetaxcode').attr('disabled', 'disabled').addClass('inputlinedisabled');
            }
        });

        $(mytable).on('keydown', 'input', G_KeyNavigation);
        return divPayee;
    }

    ValidateHeader() {
        let hasedits = $(this._theDIV).find('input.edited').length;
        if (hasedits !== 0) {
            let theghostnote = $(this._theDIV).find('input#ghostnote');
            if (theghostnote.val() == '' || theghostnote.length === 0) {
                let theghostnoteicon = $(this._theDIV).find('.ghostnoteicon');
                $(theghostnoteicon).notify('Please enter a note for the edit you made.');
                return false;
            }
        }
        return true;
    }
}

class PayrollDocument extends AtlasDocument {
    constructor(objDocument, Config) {
        super('PayrollDocument', objDocument, Config);
        this._DATA = objDocument;
        this.Data = JSON.parse(JSON.stringify(objDocument)); // Clone the data to a local object
        this._Payments = [];
    }

    get DOM() {
        return {
            container: '#divPayrollPortalPayrollDetail'
            , title: '#PayrollPortalPayrollDetailHeader'
            , body: '#divPayrollPortalPayrollDetailBody'
        }
    }

    get URLs() {
        return {

        }
    }

    get DATA() {
        return this.Data;
    }

    get FIELDS() {
        return { 
            StartDate: { id: 'StartDate', type: 'text', name: 'startdate', existingvalue: moment(this.DATA.prstartdate).format('MM/DD/YYYY'), fieldsetlabel: 'Start Date', class: 'smartdate track header documentheader', track: true },
            EndDate: { id: 'EndDate', type: 'text', name: 'enddate', existingvalue: moment(this.DATA.prenddate).format('MM/DD/YYYY'), fieldsetlabel: 'End Date', class: 'smartdate track header documentheader', track: true },
            WorkState: { id: 'WorkState', type: 'text', name: 'workstate', existingvalue: this.DATA.workstate, fieldsetlabel: 'Work State', class: 'track header documentheader', track: true },
            WorkLocation: { id: 'WorkLocation', type: 'text', name: 'worklocation', existingvalue: this.DATA.worklocation, fieldsetlabel: 'Work Location', class: 'track header documentheader', track: true },
            UnionName: { id: 'UnionName', type: 'text', name: 'unionname', existingvalue: this.DATA.unionname, fieldsetlabel: 'Union', class: 'track header documentheader', track: true },
            PRTotal: { id: 'PRAmountTotal', type: 'text', name: 'payrollamounttotal', existingvalue: this.DATA.payrollamounttotal, fieldsetlabel: 'Total Amount', class: 'numeric', disabled: true },
        }
    }

    get theDIV() {
        return this._theDIV;
    }

    RegisterDIV(theDIV) {
        $(theDIV).find('fieldset').remove();

        this._theDIV = theDIV;
        return this;
    }
    RenderPRDocumentField(objField, func) {
        func = (!func) ? 'appendChild' : func;
        let theInput = AtlasInput.CreateInput(objField);
        this._theDIV[func](theInput);
        return this;
    }
    RenderPRDocumentFieldset(objField, func) {
        func = (!func) ? 'appendChild' : func;
        let theInput = AtlasInput.CreateFieldset(objField);
        this._theDIV[func](theInput);
        return this;
    }

    RenderPRDocument(PRDocument) {
        let self = this;
        let activeDOM = document.activeElement;

        let divHeight = window.innerHeight - 190;

        $(this.DOM.container)
            .innerHeight(divHeight)
            .css('max-height', `${divHeight}px`)
            .show()
        ;
        $(this.DOM.title).text(PRDocument.batch_source); //activeDOM.dataset['invoiceid']);

        let theDIV = document.createElement('div');
        theDIV.id = `Payroll_${PRDocument.invoicenumber_source}`;
        //theDIV.appendChild($('<i id="ghostnoteicon" class="fa fa-file-text-o"></i>')[0]);
        //theDIV.className = 'prcontent';
        let hDIV = document.createElement('div');
        this.RegisterDIV($('#divPayrollPortalPayrollDetailHeader')[0])
            .RenderPRDocumentFieldset(this.FIELDS.StartDate)
            .RenderPRDocumentFieldset(this.FIELDS.EndDate)
            .RenderPRDocumentFieldset(this.FIELDS.WorkState)
            .RenderPRDocumentFieldset(this.FIELDS.WorkLocation)
            .RenderPRDocumentFieldset(this.FIELDS.UnionName)
            .RenderPRDocumentFieldset(this.FIELDS.PRTotal)
        ;
        //.theDIV.appendChild($('<div class="clearfix"></div>')[0]); // Clear after each Check Header

        PRDocument.PREP.forEach(function (e, i) {
            let masterDIV = document.createElement('div');
            masterDIV.id = `Payment_${e.employeeid}_Master`;
            masterDIV.className = 'prcontent';
            masterDIV.setAttribute('data-id', e.employeeid);
            masterDIV.setAttribute('data-index', i);

            let phDIV = document.createElement('header');
            let phDIVID = `Payment_${e.employeeid}`;
            let plDIVID = `PaymentLines_${e.employeeid}`;
            phDIV.id = phDIVID;
            phDIV.setAttribute('data-prcontent', plDIVID);
            phDIV.appendChild($(`<i id="ghostnoteicon_${e.employeeid}" class="fa fa-file-text-o ghostnoteicon" data-ghostnotekeeper="ghostnotekeeper_${e.employeeid}"></i>`)[0]);
            phDIV.appendChild($(`<input type="hidden" id="ghostnotekeeper_${e.employeeid}" name="notes" class="ghostnotekeeper" />`)[0]);
            phDIV.className = 'prheader';
            $(phDIV).css('z-index', 1);
            let thePayment = new PayrollPayment(phDIV, e, i);
            thePayment
                .RenderPRDocumentPaymentID()
                .RenderPRDocumentPaymentFieldset(thePayment.FIELDS.CheckNumber)
                .RenderPRDocumentPaymentFieldset(thePayment.FIELDS.LastName)
                .RenderPRDocumentPaymentFieldset(thePayment.FIELDS.FirstName)
                .RenderPRDocumentPaymentFieldset(thePayment.FIELDS.SSN4)
                .RenderPRDocumentPaymentFieldset(thePayment.FIELDS.LineAmountTotal)
            ;

            phDIV.appendChild($('<div class="clearfix"></div>')[0]);

            let plDIV = document.createElement('div');
            plDIV.id = plDIVID;
            plDIV.className = 'prcontent-inner';
            $(plDIV).append(thePayment.PaymentTable);

            masterDIV.appendChild(phDIV);
            masterDIV.appendChild(plDIV);
            theDIV.appendChild(masterDIV);

            self._Payments.push(thePayment);
        });

        $(this.DOM.body)
            .empty()
            .append(theDIV)
        ;
        $('.ghostnoteicon').on('click', function () {
            G_GhostNote.SetGhostNote(this).DisplayGhostNote();
        })

        $('input[name=TaxCode]').autocomplete({
            source: $.map(AtlasUtilities.TaxCode1099, function (m) {
                return { label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(), };
            }),
            autoFocus: true,
            open: function (e, ui) {
                if (window.event) {
                    e.preventDefault();
                    $(this).autocomplete('close');
                    let te = $.Event('keydown');
                    te.which = window.event.keyCode;
                    G_KeyNavigation(e, true);
                }
            }
        }).on('focusout', function () {
            let thevalue = this.value;
            $(this).removeClass('input-invalid');

            if (thevalue !== '') {
                if (!AtlasUtilities.TaxCode1099.find(e => e.TaxCode === thevalue)) {
                    $(this)
                        .addClass('input-invalid')
                        .notify('Invalid Tax Code');
                }
            }
        });

        $('input[name=DT]')
            .autocomplete(AtlasDocument.RenderSegmentAutocomplete(AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex]))
            .on('focusout', function () {
                let thevalue = this.value;
                $(this).removeClass('input-invalid');
                if (thevalue === '' || !AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].Accounts.find(e => e.AccountCode === thevalue)) {
                    $(this)
                        .addClass('input-invalid')
                        .notify('Invalid Account Code');
                }
            }
        );

        $('input[name="DT"]').each((i, e) => {
            let isValid = AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].Accounts.find(a => a.AccountCode === e.value && a.Posting);
            if (!isValid) $(e).addClass('input-invalid');
        })

        $('input.linenotes').on('keydown', function() {
            $(this).notify();
        })
        //$(`${this.DOM.body} input`).on('focusout', function () {
        //    //$(window.prevFocus).notify();
        //})
    }

    ResetDocumentValues() {
        $('.edited').each(function () {
            $(this)
                .removeClass('edited')
                .val($(this).data('original') || '')
            ;
            //this.value = $(this).data('original') || '';
        });
        $('.linenotes')
            .removeClass('input-required')
            .val('')
            .prop('disabled', true)
            .notify()
        ; // Reset all the notes
    }

    Cancel() {
        G_PayrollPortal.CallAction('Close Payroll Document').PayrollDocument.CloseDocument('Cancel');
    }

    BuildJSONPayload() {
        let self = this;
        let o = {
            ProdID: self.Data.ProdID
            , PREditID: self.Data.payrolleditid
            , PREP: []
        };
        // Header
        $('#formPayrollPortalEdit #divPayrollPortalPayrollDetailHeader').find('input').each(function() {
            if (this.name !== '') {
                let theinputname = this.name.toLowerCase();
                let theinputvalue = ($(this).hasClass('numeric'))? numeral(this.value).value(): this.value;

                o[theinputname] = theinputvalue;
            }
        });
        // Each Payment, we'll pull it and determine if there are any edits.
        $('#formPayrollPortalEdit #divPayrollPortalPayrollDetailBody').find('div.prcontent').each(function() {
            let prcontent = this; // keep our thises separated
            //let objPayment = self.Data.PREP[$(prcontent).data('index')]; console.log(objPayment);
            let objPayment = {
                employeeid: $(prcontent).data('id')
                , PREPL: []
            }; // Seed the payment
            // Now, we'll get the header input fields
            $(prcontent).find('header input').each(function() {
                let headerinput = this; // keep our thises separated
                let headerinputname = headerinput.name.toLowerCase();
                let headerinputvalue = ($(this).hasClass('numeric'))? numeral(this.value).value(): this.value;
                if (headerinputname) objPayment[headerinputname] = headerinputvalue;
            });
            // We'll pull only the edited fields for each line
            $(prcontent).find('div table tr').each(function() {
                let prline = this; // keep out thises separated
                //objLine['expenselineid'] = $(prline).data('expenselineid');
                let payrolleditpaymentlineid = $(prline).data('payrolleditpaymentlineid');
                if (!payrolleditpaymentlineid) return;

                let objLine = {
                    'payrolleditpaymentlineid': payrolleditpaymentlineid
                    , 'edits': null
                };

                let prlinefields = $(this).find('input.edited');
                if (prlinefields.length !== 0) {
                    objLine.edits = {}; // change the edits from null to an object so we can store the values

                    prlinefields.each(function() {
                        let thevalue = ($(this).hasClass('numeric'))? numeral(this.value): this.value;
                        objLine.edits[this.name.toLowerCase()] = thevalue;
                    });
                    objPayment.PREPL.push(objLine); // ONLY send the lines that have edits
                }
            })

            o.PREP.push(objPayment);
        });
        self._JSONPayload = o;
    }

    Save(objAction) {
        let theAction = objAction.action;
        let theedits = $('.track.edited');

        if (theAction === 'save' || theAction === 'changes') {
            if (theedits.length === 0) {
                this.Notify(null, 'Nothing on the form was changed.');
                return;
            }

            if (theAction === 'save') {
                this.BuildJSONPayload();
                G_PayrollPortal.CallAction('SAVE').PayrollDocument.SaveDocument(this._JSONPayload);
            } else {
                let isValid = ($('#formPayrollPortalEdit .input-required').filter((i,e) => e.value === '').addClass('input-invalid').notify('Please enter a valid value')) ? false : true;
                if (!isValid) {
                    this.Notify(null, 'The changes to this Payroll cannot be submitted until all the missing required fields are entered.');
                    return;
                }
                let thePayments = this._Payments;
                //thePayments.forEach()
            }
        } else if (objAction.action === 'approve') {
            if (theedits.length !== 0) {
                let mydialog = $(`<div id="dialogPayrollPortalSave"></div>`)
                    .dialog({
                        "title": `Edits have been made!`,
                        'close': function (evt, dlg) {
                            $(this).remove();
                        }
                        , minWidth: 700
                        , maxWidth: 800
                        , minHeight: 300
                        , maxHeight: 300
                        , buttons: {
                            "Reset the form": function () {
                                $(this).dialog("close");
                                thisDocument.ResetDocumentValues();
                            },
                            Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    })
                $('#dialogPayrollPortalSave').append('<b>Edits have been made to this Payroll. You cannot approve a Payroll with edits. Would you like to reset the form?</b>')
                return;
            }
            let isValid = ($('#formPayrollPortalEdit .input-required').filter((i, e) => e.value === '').addClass('input-invalid').notify('Please enter a valid value')) ? false : true;
            if (!isValid) {
                this.Notify(null, 'This Payroll cannot be submitted for approval! Missing required fields must be entered and changes submitted.');
                return;
            }
        }
        //console.log(this._Payments);
    }

    Notify(DOM, message, options) {
        DOM = (DOM === null) ? '#breadcrumb' : DOM;
        $(DOM).notify().notify(message, {autoHide: false});
    }

    ChangeCompany() { // Must override AtlasDocument.ChangeCompany
    }
}

class PayrollPortal {
    constructor() {
        this._DATA = {};
        $(document).on('change', '.smartdate', function () {
            $(this).removeClass('input-required');
            let thedate = moment(this.value, 'MM/DD/YYYY').format('MM/DD/YYYY');
            if (thedate.toUpperCase() === 'INVALID DATE') { // moment.isValid doesn't work properly for a value like 33, which is invalid
                this.value = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
            } else {
                this.value = thedate;
            }
        });

        $(document).on('contextmenu', '.prheader', function () {
            let contentDIV = $(this).data('prcontent');
            $(`#${contentDIV}`).toggle();
            return false;
        });

        $(document).on('change', 'input.track', function () { // Use the same tracking code for all input fields and handle lines slightly differently
            let originalvalue = $(this).data('original');
            if (originalvalue === undefined) return;

            if (this.value !== originalvalue) {
                $(this).addClass('edited');
            } else {
                $(this).removeClass('edited');
            }

            let lineid = $(this).data('expenselineid');
            if (lineid) {
                let disabled = ($(this).closest('tr').find('.edited').length !== 0) ? false : true;
                let noteDOM = $(this).closest('tr').find('input[name="Notes"]');
                let isNote = this === noteDOM[0];
                let addorRemove = (disabled)? 'removeClass': 'addClass';

                noteDOM.prop('disabled', disabled)
                    .notify((!disabled && !isNote) ? 'Please enter a note' : '')
                    [addorRemove]('input-required')
                ;
            }
        });

    }

    get URLS() {
        return {
            PRList: '/api/PRPortal/PRList'
            , PRGet: '/api/PRPortal/PRGet'
            , PRSave: '/api/PRPortal/PRSave'
        }
    }

    get DOM() {
        return {
            DIVList: '#divPayrollPortalPayrollList',
            List: '#tblPRPortalList',
            Detail: '#divPayrollPortalPayrollDetail'
        };
    }

    get DATA() {
        return this._DATA;
    }

    CallAction(theaction) {
        let self = this;
        AtlasUtilities.ShowLoadingAnimation();
        //history.pushState({ action: theaction }, 'test');
        //alert(JSON.stringify(history.state));

        return {
            PayrollList: {
                ClickInvoice: function (theDOM, e) {
                    let PREditID = $(theDOM).data('preditid');
                    let waitvar = [];
                    waitvar.push($.ajax(
                        AtlasDocument.MakeAJAXPOSTobject(
                            self.URLS.PRGet,
                            JSON.stringify(
                                {
                                    PREditID: PREditID,
                                    ProdID: localStorage.ProdId,
                                    UserID: localStorage.UserId
                                })
                        )
                    ).done(function (response) {
                        //console.log(self);
                        $(self.DOM.DIVList).hide();
                        thisDocument = new PayrollDocument(response, {});
                        thisDocument.RenderPRDocument(response);

                        AtlasUtilities.HideLoadingAnimation();
                    }));
                }
            }
            , PayrollDocument: {
                SaveDocument: function (objDocument) {
                    objDocument.UserID = localStorage.UserId;
                    let waitvar = [];
                    waitvar.push($.ajax(
                        AtlasDocument.MakeAJAXPOSTobject(
                            self.URLS.PRSave,
                            JSON.stringify(objDocument)
                        )
                    ).done(function (response) {
                        //console.log(self);
                        $(self.DOM.DIVList).hide();
                        thisDocument = new PayrollDocument(response, {});
                        thisDocument.RenderPRDocument(response);

                        AtlasUtilities.HideLoadingAnimation();
                    }));
                }
                , CloseDocument: function (closeAction) {
                    $(self.DOM.DIVList).show();
                    self.RenderPortal();
                    AtlasUtilities.HideLoadingAnimation();
                }
            }
        }
    }

    RenderPortal() {
        let self = this;

        AtlasDocument.BindCompany();

        self.GetPRList()
            //.then(PRList => this.RenderPRList(PRList))
            .then(self => self.RenderPRList())
        //.then(self => self.alert('test'))
        ;

        $('body').on('click', '.hrefPayroll', function (e) {
            let invoiceid = $(this).data('invoiceid');
            self.CallAction(invoiceid).PayrollList.ClickInvoice(this, e);
        });

        $('#btnPayrollCancel,#btnPayrollCancelX').on('click', function (e) {
            $(self.DOM.DIV).show();
            $(self.DOM.Detail).hide();
        });

        //window.onpopstate = function (event) {
        //    alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        //};
    }

    GetPRList() { // Returns this (i.e. PayrollPortal)
        let self = this;
        return new Promise(function (resolve, reject) {
            $.ajax(
            AtlasDocument.MakeAJAXPOSTobject(
                self.URLS.PRList,
                JSON.stringify(
                    {
                        ProdID: localStorage.ProdId,
                        UserID: localStorage.UserId,
                        AtlasStatus: 'PRLOADED'
                    })
            )).done(function (response) {
                self.DATA.PRList = response;
                resolve(self);
            }).fail(function (error) {
                console.log(error);
            });
        });
    }

    RenderPRList() { // Returns this (i.e. PayrollPortal)
        let self = this;
        let PRList = self._DATA.PRList;

        return new Promise((resolve, reject) => {
            $(self.DOM.List).DataTable({
                info: false,
                destroy: true,
                data: PRList,
                columns: [
                    {
                        data: 'batch_source',
                        render: function (data, type, line) {
                            return (type !== 'display') ? data : `<a href="#" class="hrefPayroll" data-invoiceid="${data}" data-preditid="${line.payrolleditid}">${data}</a>`;
                        }
                    },
                    { data: 'prenddate' },
                    {
                        data: 'status_edit',
                        render: function (data, type, line) {
                            let theCSS = '';
                            let theDisplay = '';
                            if ((data || '') === '') {
                                theCSS = 'warning';
                                theDisplay = 'PENDING';
                            }
                            return (type !== 'display') ? data : `<span class="label label-${theCSS}">${theDisplay}</span>`;
                        }
                    }
                    , { data: 'paymentcount' }
                    , { 
                        data: 'payrollamounttotal',
                        render: function(data, type, line) {
                            return (type !== 'display')? data: numeral(data).format('$0,0.00');
                        }
                    }
                ]
            });

            resolve(self);
        });
    }
}

$(document).ready(function () {

    G_PayrollPortal = new PayrollPortal();
    G_PayrollPortal.RenderPortal();

})

// prime with empty jQuery object
window.prevFocus = $();

// Catch any bubbling focusin events (focus does not bubble)
$(document).on('focusin', ':input', function () {
    // Test: Show the previous value/text so we know it works!
    $("#prev").html(prevFocus.val() || prevFocus.text());
    // Save the previously clicked value for later
    window.prevFocus = $(this);
});

$(document).on('focusout', '.input-required,.track', function () {
    let {addorRemove, theclass, notifymsg} = (this.value === '' && $(this).hasClass('input-required')) 
        ? {
            addorRemove: 'addClass'
            , theclass: 'input-invalid'
            , notifymsg: `${this.name} is required`
        }
        : {
            addorRemove: 'removeClass'
            , theclass: 'input-invalid'
            , notifymsg: ''
        };
    $(this)[addorRemove](theclass).notify(notifymsg);


    if ($(this).hasClass('edited') && $(this).hasClass('header')) {
        let headertype = ($(this).hasClass('paymentheader'))? 'header': 'div'; // paymentheader uses a <header>; documentheader uses <div>
        let theghostnote = $(this).closest('header').find('input#ghostnote')
        if (theghostnote.val() === '' || theghostnote.length === 0) {
            let theghostnoteicon = $(this).closest(headertype).find('.ghostnoteicon')
            $(theghostnoteicon).notify('Please enter a note for the edit you made.');
            return false;
        }
    }
});

class GhostNote {
    constructor() {
        //listen for click events from this style
        $(document).on('click', '.notifyjs-ghostnote-base .no', function (e) {
            //programmatically trigger propogating hide event
            $(this).trigger('notify-hide');
            e.preventDefault(); // We don't want to trigger the HTML5 required field form notification checking
        });

        $(document).on('click', '.notifyjs-ghostnote-base .yes', function (e) {
            G_GhostNote.SaveNote();

            //hide notification
            $(this).trigger('notify-hide');
            e.preventDefault(); // We don't want to trigger the HTML5 required field form notification checking
        });
    }

    SetGhostNote(callingElement) {
        let that = this;
        this._callingElement = callingElement;
        this._hiddenElement = $(`#${$(callingElement).data('ghostnotekeeper')}`)[0];
        return that;
    }

    DisplayGhostNote() {
        $('.ghostnoteicon').notify(); // Close any other ghostnotes

        $(this._callingElement).notify({
            title: 'Notes',
            button: 'Save Note'
        }, {
            style: 'ghostnote',
            autoHide: false,
            clickToHide: false,
            position: 'right middle'
        });

        let ghostnotekeeper = this._hiddenElement;
        let ghostnotekeepervalue = $(ghostnotekeeper).val();
        $('#ghostnote').val(ghostnotekeepervalue).focus();
    }

    SaveNote() {
        let ghostnotekeeper = this._hiddenElement;
        $(ghostnotekeeper).val($('#ghostnote').val());

        let ghostnoteicon = this._callingElement;
        let ghostnoteiconcolor = 'black';
        if ($('#ghostnote').val() !== '') ghostnoteiconcolor = 'red'
        $(ghostnoteicon).css('color', ghostnoteiconcolor);
    }
}


$.notify.addStyle('ghostnote', {
    html:
      "<div>" +
        "<div class='clearfix'>" +
          "<div class='title' data-notify-html='title'/>" +
          "<div class='buttons'>" +
            "<input type=text id=ghostnote class='text' maxlength='255'>" +
            "<button class='no'>Cancel</button>" +
            "<button class='yes' data-notify-text='button'></button>" +
          "</div>" +
        "</div>" +
      "</div>"
});

$(document).on('keyup', '#divPayrollPortalPayrollDetail', function (e) {
    //console.log(e)
})


var G_GhostNote = new GhostNote();
