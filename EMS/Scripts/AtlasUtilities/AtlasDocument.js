var thisDocument = undefined;
//var BoundDocument = undefined;
var PreData = {};
var PostInit = [];

const linenotuseheader = function () {
    $(this).removeClass('use-header');
}

const CDefaultConfig = {
    DOMDocument: '#frmAtlasDocument'
    , DOMHeader: '#AtlasDocumentHeader'
    , DOMLinesDIV: '#divAtlasDocumentLines'
    , DOMLinesTABLE: '#tblAtlasDocumentLines'
    , DOMLinesTABLETHEAD: '#tblAtlasDocumentLinesthead'
    , DOMLinesTABELTBODY: '#tblAtlasDocumentLinestbody'
    , FocusColumn: 3
    , stickyTableHeaders: 270
};

class AtlasDocument {
    constructor(type, objDocument, Config) {
        this._isRendered = false;
        this.Data = objDocument;
        this._transactioncodes = [];
        this._islocked = false;
        this.type = type;
        this.enableformfilter = '';
        this._deletedlines = [];
        //this._lineactions = AtlasInput.CreateSelect(
        //    ['', 'Delete']
        //    , {
        //        id: 'lineactions',
        //        'class': 'line-action atlas-edit-new atlas-edit-pending'
        //        , disabled: true
        //    }
        //);
        //this.TaxCodeRequired = '';

        this._isHeaderAmountLocked = false;

        if (!Config.stickyTableHeaders) Config.stickyTableHeaders = 300;
        if (Config.FocusColumn) this._FocusColumn = Config.FocusColumn;
        this._config = Config;

        this.URLS = {
            APIUrlFillVendor: '/api/POInvoice/GetVendorAddPO',
            APIURLDocumentGet: '',
            APIURLDocumentSet: ''
        };

        Object.freeze(this._config.LineDef);
        Object.freeze(this._config.ColumnDef);

        this.initDocument();
    }

    initDocument() {
        $('#txtDocumentDate').blur(function () {
            $(this).removeClass('input-required');
            let thedate = moment(this.value, 'MM/DD/YYYY').format('MM/DD/YYYY');
            if (thedate.toUpperCase() === 'INVALID DATE') { // moment.isValid doesn't work properly for a value like 33, which is invalid
                this.value = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
            } else {
                this.value = thedate;
            }
            if (thisDocument) thisDocument.Data.DocumentDate = thedate;
        });

        $('#txtDocumentDescription').blur(G_DocumentHeaderEmptyValue);
        $('#txtDocumentDescription').on('keydown', function (e) {
            if (e.keyCode === 9) { // alter tab order
                //if (e.type !== 'keydown') {
                $('.use-header.input-description-line').val(this.value);
                if (e.shiftKey) {
                    AtlasDocument.shiftFocus(this);
                } else {
                    if (thisDocument.PreviosDOM) {
                        $(thisDocument.PreviosDOM).focus().select();
                        thisDocument.PreviosDOM = undefined
                    } else {
                        thisDocument.DefaultLineFocus();
                    }
                }
                e.preventDefault();
            }
        });

        $('#tblAtlasDocumentLines').delegate('.line-action', 'change', function (e) {
            let thevalue = this.value;
            if (thevalue !== '') thisDocument[`LineAction_${thevalue}`].bind(this)();
            this.selectedIndex = 0;
        });

        $('#tblAtlasDocumentLines').delegate('th', 'click', function (e) {
            e.preventDefault();
        });

        this.TransactionCodes = PreData.TransactionCodes;
    }

    static NewDocument() {
        PostInit = [];
        $('#txtDocumentDate').val('');
        $('#txtDocumentNumber').val('');
        $('#txtDocumentDescription').val('');
    }

    static MakeConfig(objConfig) {
        return Object.assign({}, CDefaultConfig, objConfig);
    }

    static RegisterPostinitFunction(func, args) {
        if (typeof func === 'function') PostInit.push({
            f: func,
            args: args
        });
    }

    //static SelectCompany(newCompanyID) {
    //    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlCompanyList(
    //        {
    //            'existingValue': newCompanyID,
    //            'callback': function (obj, CompanyID) {
    //                thisDocument.BindCompany(CompanyID[0].CompanyID);
    //            }
    //        }));
    //    //$('#ddlCompany').val(newCompanyID).change();
    //}

    static BindPeriod(newPeriodID) {
        if (thisDocument) {
            if (thisDocument.Data.DocumentStatus.toUpperCase() === 'POSTED') {
                // Since this is a posted transaction, we will use RenderData ONLY the period of the transaction
                AtlasForms.Controls.DropDown.RenderData(
                    [{
                        'ClosePeriodId': thisDocument.Data.ClosePeriodID
                        , 'CompanyPeriod': thisDocument.Data.CompanyPeriod
                        , 'PeriodStatus': 'Period: '
                        , 'CompanyPeriod': thisDocument.Data.CompanyPeriod
                    }]
                    , AtlasForms.FormItems.ddlClosePeriod()
                );
                return;
            } else {
                if (thisDocument.Data.ClosePeriodID) {
                    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(parseInt(thisDocument.Data.ClosePeriodID)));
                    thisDocument.Data._data.ClosePeriodID = parseInt($('#ddlClosePeriod').val());
                    return;
                }
            }
        } else {
            AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(parseInt(newPeriodID)));
        }
    }

    static ColumnDefaults(column) {
        return {
            rowID: {
                'data': 'rowID'
                , 'title': ''
                , 'orderable': false
                , render: function(data, type, row, meta) {
                    if (type === 'sort') return data;
                    return '';
                }
            },
            DOCUMENTLINEID: {
                'data': 'DocumentLineID'
                , 'title': 'DLID'
                , 'visible': false
                , createdCell: function (nTd, sData, oData, iRow, iCol) {
                    // DocumentLineID field
                    let desc = AtlasInput.CreateInput(
                        {
                            id: 'DocumentLineID'
                            , name: 'DocumentLineID'
                            , column: iCol
                            , placeholder: 'Description'
                            , type: 'input'
                            , 'class': ''
                            , existingvalue: sData
                            , inTable: false
                        }
                    );
                    $(nTd).append(desc);
                    //return desc.outerHTML;
                }
            },
            ACTION: {
                'data': 'ACTION'
                , 'title': 'Action'
                , render: function(data, type, row, meta) {
                    if (type === 'display') {
                        let ret = thisDocument.DefaultLineActions.outerHTML;
                        return ret;
                    }
                    return data;
                }
            },
            DESCRIPTION: {
                data: 'LINEDESCRIPTION'
                , title: 'Description'
                //, render: function (data, type, row, meta) {
                , createdCell: function (nTd, sData, oData, iRow, iCol) {
                    // Description field
                    let desc = AtlasInput.CreateInput(
                        {
                            id: 'linedescription'
                            , name: 'linedescription'
                            , column: iCol
                            , placeholder: 'Description'
                            , type: 'input'
                            , 'class': 'input-required input-description-line input-description use-header'
                            , existingvalue: sData
                            , change: function () { linenotuseheader(); AtlasDocument.StoreValuetoCell(this, iRow, iCol) }
                            //, change: linenotuseheader
                            , keydown: G_KeyNavigation
                            , blur: G_ValidateDescriptionValue
                            , inTable: false
                        }
                    );
                    $(nTd).append(desc);
                    //return desc.outerHTML;
                }
            },
            'TAX CODE': {
                data: 'TAX CODE'
                , title: 'Tax Code'
                , createdCell: function (nTd, sData, oData, iRow, iCol) {
                    let taxcode = AtlasInput.CreateInput(
                    {
                        id: 'taxcode'
                        , name: 'taxcode'
                        , placeholder: ''
                        , type: 'input'
                        , column: iCol
                        , 'class': `input-taxcode ${thisDocument.TaxCodeRequired}`
                        , existingvalue: sData
                        , blur: function () {
                            let thematch = AtlasUtilities.TaxCode1099.find((e) => { return e.TaxCode === this.value; })
                            if (this.value !== '' && !thematch) {
                                $(this).addClass('field-Req');
                            } else {
                                $(this).removeClass('field-Req');
                            }
                        }
                        , autocomplete: {
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
                        }
                        , keydown: G_KeyNavigation
                        , change: function () { AtlasDocument.StoreValuetoCell(this, iRow, iCol) }
                    });

                    $(nTd).append(taxcode);
                }
            },
        }[column]
    }

    // Utility functions
    static MakeAJAXPOSTobject(URL, objP, contentType, noCallPayload) {
        let contentTypeString = (contentType === undefined) ? 'application/x-www-form-urlencoded; charset=UTF-8' : contentType;
        let ret = {
            url: URL,
            data: { callPayload: objP },
            contentType: contentTypeString,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            //contentType: 'application/json; charset=utf-8',
        }

        if (noCallPayload) {
            ret.data = objP;
        }
        return ret;
    }

    static PrepDocument(objLineActions) { // This must be called first to pull all the data that will be used for the auto completes
        return new Promise(function (resolve, reject) {
            PreData._lineactions = (objLineActions) ? objLineActions : AtlasInput.CreateSelect(
                ['', 'Delete']
                , {
                    id: 'lineactions'
                    , 'class': 'line-action atlas-edit-new atlas-edit-pending'
                    , disabled: true
                }
            );

            let waitvar = [];
            let TCodes = AtlasCache.Cache.GetItembyName('Config.TransactionCodes');
            PreData._transactioncodes = (TCodes) ? TCodes.resultJSON : {};

            waitvar.push($.ajax(
                AtlasDocument.MakeAJAXPOSTobject(
                    `/api/POInvoice/GetVendorAddPO?ProdID=${localStorage.ProdId}`
                    , {
                        contentType: 'application/json; charset=utf-8'
                    }
                )
            ).done(function (response) {
                PreData._vendorlist = response;
                resolve(PreData);
            }).error(function (error) {
                AtlasUtilities.ShowError(error);
            }));
        });
    }

    static GetDocumentData(URL, objURLP, bindlist, donotbindlist, oLineProcessor, objData) {
        let ret = new Object();
        return new Promise(function (resolve, reject) {
            let waitvar = [];
            waitvar.push($.ajax(
                AtlasDocument.MakeAJAXPOSTobject(
                    URL,
                    JSON.stringify(objURLP)
                )
            ).done(function (data) {
                ret = AtlasDocument.BindDatatoObject(data, bindlist, donotbindlist, oLineProcessor, objData);
                resolve(ret);
            }).fail(function (error) {
                AtlasUtilities.ShowError(error);
                reject(error);
            })
            );
        });
    }

    static BindDatatoObject(data, bindlist, donotbindlist, oLineProcessor, objData) {
        if (data.length !== 1) {
            data[0] = objData;
            //return { error: 'Can only bind one Document' }
        }

        donotbindlist = donotbindlist || {};
        let ret = { _odata: {}, _data: {}, _keys: {} };
        let d = data[0];
        Object.keys(d).forEach(function (e) {
            if (!e) return;
            //e = e.toUpperCase(); // Convert everything to uppercase
            if (donotbindlist[e]) return;
            let thevalue = d[e]; // Set the data for the attribute
            let thekey = bindlist[e];
            ret._odata[e] = thevalue;
            ret._data[e] = thevalue; // store the data
            ret._keys[e] = thekey;

            if (e === 'DocumentLines') {
                if (thevalue.length === 0) { } else {
                    ret._data[e] = oLineProcessor.LineProcessor(thevalue, oLineProcessor.LineDef);
                }
            } else if (!thekey) {
                //ret._data[e] = d[e]; // Set the data for the attribute
            } else {
                if (typeof thekey === 'function') {
                    try {
                        AtlasDocument.RegisterPostinitFunction(thekey, thevalue);
                            //thekey(thevalue);
                    } catch(e) {}
                } else { // We'll assume it's a dom object
                    let dom = document.querySelector(`${bindlist[e]}`);
                    if (dom !== null) {
                        $(dom).change(function () {
                            ret[e] = this.value;
                        });
                        ret._data[e] = dom.value = d[e]; //val(d[e]);
                        ret._keys[e] = dom;
                        thekey = dom;
                    }
                }
            }

            Object.defineProperty(ret, e,
                {
                    name: e,
                    get: function() {
                        if (typeof thekey === 'undefined') {
                            return this._data[e];
                        } else if (typeof thekey === 'function') {
                            //return thekey(this._data[e]);
                            return this._data[e];
                        } else if (typeof thekey === 'object') {
                            return thekey.value;
                        }
                    },
                    set: function(newvalue) {
                        if (typeof thekey === 'undefined') {
                            this._data[e] = newvalue;
                        } else if (typeof thekey === 'function') {
                            this._data[e] = newvalue;
                            thekey(newvalue);
                        } else if (typeof thekey === 'object') {
                            thekey.value = newvalue;
                        }
                        //this._data[thefindname].value = newvalue;
                    }
                }
            );
        })
        return ret;
    }

    static SetDocumentDate(d) {
        d = (typeof d === 'undefined') ? new Date() : d;
        let theDate = new Date(d).format('mm/dd/yyyy');
        $('#txtDocumentDate').val(theDate);
        if (thisDocument) thisDocument.Data.DocumentDate = theDate;
    }

    static StoreValuetoCell(that, iRow, iCol) {
        //$(that.parentElement).data('value', that.value);
        if (thisDocument.Data.DocumentLines[iRow]) thisDocument.Data.DocumentLines[iRow][that.name] = that.value;
        //console.log([iRow, iCol]);
    }

    static shiftFocus(that) {
        let shiftfocus = $(that).data('shiftfocus');
        if (shiftfocus) {
            $(`#${shiftfocus}`).focus().select();
        } else {
            thisDocument.DefaultLineFocus();
        }
    }

    static isLastInputintr(that) {
        let nexttr = that.parentElement.nextElementSibling;
        if (nexttr === null || $(nexttr).find('input:visible')[0] === undefined) return true;
        return (nexttr.children.length === 0);
    }

    static isInLasttr(that) {
        return (that.parentElement.parentElement.nextElementSibling === null);
    }

    static setLineFocus(Row, Col) {
        if (Row === undefined && Col === undefined) {
            $($($('#tblAtlasDocumentLines')[0].rows[$('#tblAtlasDocumentLines tr').length - 1]).find('input:enabled')[0]).focus().select();
        } else if (Col === undefined) {
            $($($('#tblAtlasDocumentLines')[0].rows[Row]).find('input:enabled')[0]).focus().select();
        }  else if ($($($('#tblAtlasDocumentLines')[0].rows[Row]).find('td')[Col]).find('input:enabled').length === 0) { // This means where we're going is not enabled, so find the first thing that is enabled
            $($($('#tblAtlasDocumentLines')[0].rows[Row]).find('input:enabled')[0]).focus().select();
        } else {
            $($($('#tblAtlasDocumentLines')[0].rows[Row]).find('td')[Col]).find('input').focus().select();
        }
    }

    static RenderSegmentAutocomplete(segment, objDOM) {
        if (localStorage.dirtydata) AtlasCache.CacheCOA(true);
        let thesource = $.map(segment.Accounts, function (val, i) { return val.AccountCode; });
        let theautocomplete = {
            //source: $.map(segment.Accounts, function (val, i) { return val.AccountCode; })
            autoFocus: true
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
        if (segment.Classification.toUpperCase() === 'DETAIL') {
            //theautocomplete.source = function (request, response) {
            thesource = function (request, response) {
                //let A_ = $.map(segment.Accounts, function (val, i) { return val.AccountCode; });
                let A_ = $.map(segment.Accounts, function (val, i) { if (val.Posting === true) return { label: `${val.AccountCode} (${val.AccountName})`, value: val.AccountCode }; });
                let matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term.replace('-', '')), "i");
                response($.grep(A_, function (item) {
                    return matcher.test(item.value.replace('-', ''));
                }));
            }
        }
        theautocomplete.source = thesource;

        if (!objDOM) {
            return theautocomplete;
        } else {
            $(objDOM).autocomplete = theautocomplete;
            $(objDOM).autocomplete('option', 'source', thesource); // Reset the source just in case this is an onfocus()
        }

    }

    static makeLineObj(A, O, Display) {
        let DisplayInput = (Display === undefined) ? true : false;
        let A_Columns = A;
        let objLine = O;

        AtlasUtilities.SEGMENTS_CONFIG.sequence.forEach((segment, sIndex) => {
            A_Columns.push({
                'data': segment.SegmentCode.toUpperCase()
                , 'title': segment.SegmentCode.toUpperCase()
                , createdCell: function (nTd, sData, oData, iRow, iCol) {
                    //let theautocomplete = {
                    //    source: $.map(segment.Accounts, function (val, i) { return val.AccountCode; })
                    //    , autoFocus: true
                    //    , open: function (e, ui) {
                    //        if (window.event) {
                    //            $(this).autocomplete('close');
                    //            //let te = $.Event('keydown');
                    //            //te.which = window.event.keyCode;
                    //            G_KeyNavigation(e, true);
                    //            //e.preventDefault();
                    //        }
                    //    }
                    //};
                    let theautocomplete = AtlasDocument.RenderSegmentAutocomplete(segment);

                    //if (segment.Classification.toUpperCase() === 'DETAIL') {
                    //    theautocomplete.source = function (request, response) {
                    //        //let A_ = $.map(segment.Accounts, function (val, i) { return val.AccountCode; });
                    //        let A_ = $.map(segment.Accounts, function (val, i) { if (val.Posting === true) return { label: `${val.AccountCode} (${val.AccountName})`, value: val.AccountCode }; });
                    //        let matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term.replace('-','')), "i");
                    //        response($.grep(A_, function (item) {
                    //            return matcher.test(item.value.replace('-',''));
                    //        }));
                    //    }
                    //}
                    let inputvalue = sData; //objD[segment.SegmentCode];
                    if (segment.Accounts.length === 1 && segment.Classification.toUpperCase() !== 'SET') {
                        inputvalue = segment.Accounts[0].AccountCode
                    } else {
                        if (AtlasInput._FocusElement === -1) {
                            AtlasInput.FocusElement(sIndex);
                        }
                    }

                    let isRequired = (segment.Classification.toUpperCase() !== 'SET') ? 'input-required' : '';
                    let atlasedit = (segment.Classification.toUpperCase() === 'COMPANY') ? '' : 'atlas-edit-new atlas-edit-pending';
                    let input = AtlasInput.CreateInput(
                        {
                            id: `${segment.SegmentCode}`//x${iRow}x${iCol}`
                            , name: segment.SegmentCode
                            , placeholder: (segment.SegmentCode.toUpperCase() === 'SET') ? '' : segment.SegmentCode
                            , type: 'input'
                            , column: iCol
                            , 'class': `${isRequired} input-segment segment-${segment.SegmentCode} input-${segment.SegmentCode} clsPaste ${atlasedit} `
                            , autocomplete: theautocomplete
                            , existingvalue: inputvalue
                            , keydown: G_KeyNavigation
                            , focus: function () {
                                AtlasDocument.RenderSegmentAutocomplete(AtlasUtilities.SEGMENTS_CONFIG.sequence[sIndex], this);
                            }
                            , change: function () { AtlasDocument.StoreValuetoCell(this, iRow, iCol) }
                            , blur: G_ValidateSegmentValue
                            , disabled: true
                        }
                    );

                    if (DisplayInput) $(nTd).append(input);

                }
            });

            objLine[segment.SegmentCode.toUpperCase()] = ''
        });

        let TCodes = AtlasCache.Cache.GetItembyName('Config.TransactionCodes');
        if (TCodes) {
            TCodes.resultJSON.forEach((code, sIndex) => {
                A_Columns.push({
                    'data': code.TransCode.toUpperCase()
                    , 'title': code.TransCode
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        let theautocomplete = {
                            source: $.map(code.TV, function (val, i) { return val.TransValue; })
                            , autoFocus: true
                            , open: function (e, ui) {
                                if (window.event) {
                                    $(this).autocomplete('close');
                                    //let te = $.Event('keydown');
                                    //te.which = window.event.keyCode;
                                    G_KeyNavigation(e, true);
                                    e.preventDefault();
                                }
                            }
                        };

                        let inputvalue = sData; //objD[segment.SegmentCode];
                        let input = AtlasInput.CreateInput(
                            {
                                id: code.TransCode.toUpperCase()
                                , name: code.TransCode
                                , placeholder: ''//code.TransCode
                                , type: 'input'
                                , column: iCol
                                , 'class': `input-transcode transcode-${code.TransCode.toUpperCase()} input-${code.TransCode.toUpperCase()} clsPaste atlas-edit-posted`
                                , autocomplete: theautocomplete
                                , existingvalue: inputvalue
                                , blur: G_ValidateTransactionCode
                                , change: function () { AtlasDocument.StoreValuetoCell(this, iRow, iCol) }
                                , keydown: G_KeyNavigation
                            }
                        );

                        if (DisplayInput) $(nTd).append(input);
                    }
                });
                objLine[code.TransCode.toUpperCase()] = '';
            });
        }
    }

    static CloneLine(tr, starting, excludelist) {
        excludelist = (excludelist === undefined) ? {} : excludelist;
        let ret = (Object.keys(starting).length === 0) ? {} : starting;
        if (HTMLCollection.prototype.isPrototypeOf(tr.children)) {
            for (let td of tr.children) {
                let thefind = $(td).find('input')[0];
                if (thefind) {
                    if (!excludelist[thefind.name.toUpperCase()]) {
                        ret[thefind.name.toUpperCase()] = thefind.value;
                    }
                }
            }
        }

        return ret;
    }

    static BindLine(tr, excludelist) {
        excludelist = (excludelist === undefined) ? {} : excludelist;
        let ret = { _data: {} };

        if (HTMLCollection.prototype.isPrototypeOf(tr.children)) {
            for (let td of tr.children) {
                let thefind = $(td).find('input')[0];
                if (thefind) {
                    let thefindname = thefind.name.toUpperCase();
                    if (!excludelist[thefindname]) {
                        ret._data[thefindname] = thefind;

                        Object.defineProperty(ret, thefindname,
                            {
                                name: thefindname,
                                get: function() {
                                    return this._data[thefindname];
                                },
                                set: function(newvalue) {
                                    //this._data[thefindname].value = newvalue;
                                }
                            }
                        );

                    }
                }
            }
        }

        return ret;
    }

    static LineIDstoObj(line, LineDef) {
        let COA = AtlasUtilities.SEGMENTS_CONFIG._COA._COAID[line.COAID];
        COA[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode] = COA.AccountCode;
        let Tstring = line.TransactionString || ''
        let A_T = Tstring.split(',');
        let objT = {};
        if (Tstring !== '') {
            A_T.forEach(function (t) {
                let c = t.split(':');
                if (Object.keys(PreData._transactioncodes).length !== 0) {
                    let a = PreData._transactioncodes.find(function (TC) {
                        let TCF = (TC.Details.TCID == c[0])
                        if (TCF) {
                            let TVF = '';
                            if (TCF) {
                                TVF = TC.TV.find((TV) => { return TV.TVID == c[1] });
                            }
                            this[TC.TransCode] = TVF.TransValue;
                        }
                        return TCF;
                    }, this);
                }
                //objT = rT;
            }, objT);
        }

        return Object.assign({ 'ACTION': '' }, LineDef, line, objT, COA)
    }

    static TransformCodesinLines(A_, LineDef) {
        let ret = [];
        A_.forEach((e) => {
            ret.push(AtlasDocument.LineIDstoObj(e, LineDef));
        });
        return ret;
    }

    static FillVendorAutoComplete(objDOM) {
        let ret = new Object();
        return new Promise(function (resolve, reject) {
            let waitvar = [];
            waitvar.push($.ajax(
            AtlasDocument.MakeAJAXPOSTobject(
                `${AtlasUtilities.URLS.v1.APIUrlFillVendor}?ProdID=${localStorage.ProdId}`
                , {
                    contentType: 'application/json; charset=utf-8'
                }
            )
            ).done(function (data) {
                var array = data.error ? [] : $.map(data, function (m) {
                    return {
                        value: m.VendorName,
                        label: m.VendorName,
                    };
                });
                $(objDOM).autocomplete({
                    minLength: 1,
                    source: array,
                    autoFocus: true,
                });

                resolve(data);
            }).fail(function (error) {
                AtlasUtilities.ShowError(error);
                reject(error);
            })
            );
        });
    }

    ChangeCompany(CompanyID) {
        thisDocument.Data._data.CompanyID = CompanyID;
        //thisDocument.Data.CompanyID = CompanyID;
        //if (!thisDocument) return; // This means the document has not been initiated
        if (thisDocument.Data.DocumentStatus.toUpperCase() === 'POSTED') {
            // Since this is a posted transaction, we will use RenderData ONLY the period of the transaction
            AtlasForms.Controls.DropDown.RenderData(
                [{
                    'ClosePeriodId': thisDocument.Data.ClosePeriodID
                    , 'CompanyPeriod': thisDocument.Data.CompanyPeriod
                    , 'PeriodStatus': 'Period: '
                    , 'CompanyPeriod': thisDocument.Data.CompanyPeriod
                }]
                , AtlasForms.FormItems.ddlClosePeriod()
            );
        } else {
            AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(thisDocument.Data.ClosePeriodID));
            //thisDocument.Data._data.ClosePeriodID = $('#ddlClosePeriod').val();
        }
        $('#tblAtlasDocumentLines tr input.input-CO').val($('#ddlCompany :selected').text().split(' ')[0]);
    }

    ChangePeriod(that) {
        if (!thisDocument) return;
        if (thisDocument.Data.DocumentStatus.toUpperCase() === 'POSTED') {
        } else {
            thisDocument.Data.ClosePeriodID = that.value;
        }
    }

    get isRendered() {
        return this._isRendered;
    }

    set isRendered(isRendered) {
        this._isRendered = isRendered;
    }

    get Config() {
        return this._config;
    }

    set Config(newConfig) {
        return this._config; // Config can ONLY be set with the constructor
    }

    get FocusColumn() {
        return this._FocusColumn;
    }

    set FocusColumn(columnID) {
        this._FocusColumn = columnID;
    }

    get RowCount() {
        return (this.LinesTable) ? this.LinesTable.rows().count() : 0;
    }

    get RowIndex() {
        return this.LinesTable.rows().count() - 1;
    }

    get Lines() {
        return this._lines;
    }

    set Lines(tableDOM) {
        let obj = $(`#${tableDOM}`);
        if (obj.is('tbody')) {
            this._lines = obj;
        }
    }

    get TransactionCodes() {
        return this._transactioncodes;
    }

    set TransactionCodes(Codes) {
        this._transactioncodes = Codes;
    }

    get isLocked() {
        return this._islocked;
    }

    set DefaultLineActions(newlineactions) {
        this._lineactions = newlineactions;
    }

    get DefaultLineActions() {
        return this._lineactions;
    }

    RenderLineData() {
        let A_Columns = this._config.ColumnDef;
        let A_Data = (this.Data.DocumentLines.length === 0) ? this._config.LineDef : this.Data.DocumentLines;
        //A_Data = this.TransformCodesinLine(A_Data);

        //$('#btnAddNewLine').click(function () {
        //    this.AddLine();
        //}.bind(this));
        this.LinesTable = $(`${this._config.DOMLinesTABLE}`).DataTable({
            dom: "Bfrtip",
            destroy: true,
            lengthChange: true,
            responsive: true,
            scrollCollapse: true,
            //deferRender: true,
            pageResize: false,
            fixedHeader: false,
            rowReorder: { dataSrc: 'rowID' },
            scrollX: false,
            data: A_Data, // We're assuming the Data matches the table construct
            paging: false,
            columns: A_Columns
            , "language": {
                "emptyTable": "There are no lines for this document"
            },
            columnDefs: [
                { orderable: true, className: 'reorder', targets: 0 },
                { orderable: false, targets: '_all' },
                { width: 30, targets: 0 },
                { className: 'line-actions', targets: 2 }
            ],
            'order': [0, 'asc'],
            createdRow: function (row, data, index) {
                $(row).children().each(function (i, e) {
                    let input = $(e).find('input');
                    if (input) input.blur();
                });
                thisDocument.SumAmounts();
                thisDocument.createdRow(row, data, index);
            }
        })
        ;
        //$('#tblAtlasPastePreview').stickyTableHeaders({ scrollableArea: $('#pasteDiv') });
    }

    createdRow(row, data, index) {

    }

    AddLine(objD, action, rowID) {
        let ret = undefined;
        if (thisDocument.Data.DocumentStatus.toUpperCase() === 'POSTED') return;
        if (objD.LINEDESCRIPTION === undefined) {
            objD.LINEDESCRIPTION = {
                text: $('#txtDocumentDescription').val()
                , useheadervalue: true
                , headervalue: $('#txtDocumentDescription').val()
            }
        } else {
            objD.LINEDESCRIPTION = {
                text: objD.LINEDESCRIPTION
                , useheadervalue: false
            }
        }

        let clone = Object.assign({}, thisDocument.Config.LineDef, thisDocument.VendorDefaults, objD);
        if (typeof rowID === 'number') {
        } else { //if (thisDocument.RowCount > 0) {
            //let NewRodID = this.NewRowID()
            //clone.rowID = this.NewRowID();
            rowID = thisDocument.NewRowID();
        }
        clone.rowID = rowID;
        ret = thisDocument.LinesTable.row.add(clone).draw(false);
        //if (objD.FocusColumn) {
        //    $($($(`#${thisDocument.LinesTable.table().node().id} tr`)[thisDocument.RowCount]).children()[objD.FocusColumn]).find('input').focus().select();
        //} else {
        let theRowCount = thisDocument.RowCount;
        if ($('#divAtlasDocumentLines').prop('stickyTableHeaders')) theRowCount++;

        thisDocument.EnableLineForm(theRowCount);
        AtlasDocument.setLineFocus(theRowCount, thisDocument.FocusColumn);
        thisDocument.ApplyStickyHeaders();

        return ret.nodes()[0];
        //}
    }

    ApplyStickyHeaders() {
        if (!$('#divAtlasDocumentLines').prop('stickyTableHeaders') && $('#divAtlasDocumentLines').height() >= (window.innerHeight - thisDocument.Config.stickyTableHeaders)) {
            $(`#tblAtlasDocumentLines`).stickyTableHeaders('destroy'); // destroy the old sticky headers
            $('#divAtlasDocumentLines').height((window.innerHeight - thisDocument.Config.stickyTableHeaders)); // Space used by JE header
            $('#divAtlasDocumentLines').css('overflow', 'overlay'); // scroll
            $('#tblAtlasDocumentLines').stickyTableHeaders({ scrollableArea: $('#divAtlasDocumentLines') });
            $('#divAtlasDocumentLines').prop('stickyTableHeaders', true);
        }
    }

    CloneLastLinetoEnd(that) {
        if (AtlasDocument.isLastInputintr(that)) {
            if (AtlasDocument.isInLasttr(that)) {
                if (!thisDocument.isLocked) {
                    thisDocument.AddLine(
                        AtlasDocument.CloneLine(
                            that.parentElement.parentElement,
                            { FocusColumn: thisDocument.FocusColumn },
                            {
                                'AMOUNT': 'x'
                            }
                        )
                    , 'clone');
                }
            }
        } else {
            that.parentElement.nextElementSibling.children[0].focus();
        }
    }

    //NewDocument() {
    //    $('#frmAtlasDocument').find('input').val('');
    //    thisDocument.LinesTable.clear().draw();
    //}

    static BindCompany(CompanyID) {
        AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlCompanyList({
            'existingValue': CompanyID
            , 'callback': function (obj, objCompany) {
                if (this) {
                    thisDocument.ChangeCompany({ value: this });
                } else if (objCompany.length === 1 && thisDocument) {
                    thisDocument.ChangeCompany({ value: objCompany[0].CompanyID });
                }
            }.bind(CompanyID)
        }));
    }

    static BindCurrency(existingcurrency) {
        let objConfig = new AtlasConfig();
        objConfig.ConfigGet('Settings.Currencies.List', function (response) {
            AtlasForms.Controls.DropDown.RenderData(
                JSON.parse(response.ConfigJSON),
                {
                    domID: 'ddlCurrency',
                    mapping: { label: (l) => { return l; }, value: (v) => { return v; } },
                    existingValue: existingcurrency
                }
            );
        })

        if (existingcurrency !== '') {
            $('#ddlCurrency').prop('disabled', true);
            $('#ddlCurrency').removeClass('input-required');
        } else {
            $('#ddlCurrency').prop('disabled', false);
            $('#ddlCurrency').addClass('input-required');
        }

        return existingcurrency;
    }

    SumAmounts() {

    }

    NewRowID() {
        return (1 + thisDocument.LinesTable.data().reduce((max, i) => { return Math.max(max, i.rowID); }, 0));
        //return thisDocument.LinesTable.rows().count() + 1;
    }

    lock() {
        this._islocked = true;
    }

    unlock() {
        this._islocked = false;
    }

    ProcessLines() {
        this.Lines.children().each((i, e) => {
            this.LinetoObject(e);
        });
    }

    LinetoObject(row) {
        let ret = {};
        Array.prototype.forEach.call(row.children, (el, i) => {
            console.log(el);
        });
    }

    LineAction_Delete(tr, isConfirmed) {
        tr = (tr === undefined)? this.parentElement.parentElement: tr;
        let focustr = (tr.previousSibling) ? tr.previousSibling : tr.nextSibling;
        if (!focustr || tr.parentElement.rows.length === 1) { // << Need this just in case there is an element other than a table row
            $(this).notify('You cannot delete this line.', { position: 'right top', autoHideDelay: 1000});
            return;
        } else if (isConfirmed === true) {
            if (thisDocument.Data.InvoiceID !== 0) {
                let thedata = thisDocument.LinesTable.row(tr).data();
                thisDocument._deletedlines.push({
                    POLineID: thedata.POLineID
                    , InvoiceLineID: thedata.DocumentLineID
                    , InvoiceID: thisDocument.Data.InvoiceID
                });
            }
            thisDocument.LinesTable.row(tr).remove().draw(false);
            $($(focustr).children()[thisDocument.FocusColumn]).find('input')[0].select();
            thisDocument.SumAmounts();
        } else {
            $("#dialog-confirm-delete-line").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Delete this line": function () {
                        $(this).dialog("close");
                        thisDocument.LineAction_Delete(tr, true);
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
    }

    LineAction_Insert() {
        thisDocument.lock();
        thisDocument.AddLine({ 'FocusElement': 4, 'FocusColumn': 4 }, 'new', thisDocument.LinesTable.row(this.parentElement.parentElement).index());
        thisDocument.unlock();
    }

    LineAction_Clone() {
        console.log(this);
    }

    ClearLines() {
        thisDocument.LinesTable.clear().draw();
    }

    // Document Prep
    FillVendor(VendorDOM, obj) {
        //$.ajax({
        //    url: this.URLS.APIUrlFillVendor + '?ProdId=' + localStorage.ProdId,
        //    cache: false,
        //    beforeSend: function (request) {
        //        request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        //    },
        //    type: 'GET',
        //    contentType: 'application/json; charset=utf-8',
        //})
        //.done(function (response) {
        //    obj.VendorList = response; //GetVendorNamePO

            var array = !thisDocument.VendorList ? [] : $.map(thisDocument.VendorList, function (m) {
                m.value = m.VendorID;
                m.label = m.VendorName;
                return m;
                //{
                //    value: m.VendorID,
                //    label: m.VendorName,
                //    VendorID: m.VendorID,
                //    VendorName: m.VendorName,
                //    Add1W9: m.Addressw9,
                //    Add2W9: m.Address2w9,
                //    Add1Re: m.AddressRe,
                //    Add2Re: m.Address2Re,
                //    ssCOAId: m.COAId,
                //    ssCOAString: m.COAString,
                //    ssTransString: m.TransString,
                //    ssSetId: m.SetId,
                //    ssSetCode: m.SetCode,
                //    ssSeriesId: m.SeriesId,
                //    ssSeriesCode: m.SeriesCode,
                //    ssDefaultDropdown: m.DefaultDropdown,
                //    ssWarning: m.Warning,
                //    ssRequired: m.Required
                //};
            });
            $(VendorDOM).autocomplete({
                minLength: 0,
                source: array,
                autoFocus: true,
                focus: function (event, ui) {
                    //obj.Vendor = ui;
                    event.preventDefault();
                    thisDocument.VendorSelect(this, ui.item, false);
                    thisDocument.VendorFocus(this);
                },
                select: function (event, ui) {
                    //ui.isSelect = true;
                    //obj.Vendor = ui;
                    thisDocument.VendorSelect(this, ui.item, true);
                    //event.preventDefault();
                    return false;
                }
            }).bind(obj);
        //}.bind(obj))
        //.fail(function (error) {
        //    ShowMSG(error);
        //})
    }

    VendorFocus(that) {

    }

    VendorSelect(that) {

    }

    EnableLineForm(rownumber) {
        $(`#tblAtlasDocumentLines tr:eq(${rownumber}) :input`).filter(thisDocument.enableformfilter).attr('disabled', false);
    }

    EnableForm() {
        $('#AtlasDocument :input').filter(thisDocument.enableformfilter).attr('disabled', false);
        $('#fade').hide();
    }

    DisableDocument() {
        $(`${this.Config.DOMDocument} :input`).attr('disabled', true); // Disable the entire form
    }

    EnableCompany() {
        $('#ddlCompany').attr('disabled', false);
    }

    EnablePeriod() {
        $('#ddlClosePeriod').attr('disabled', false);
    }

    ChangeDocumentNumber() {

    }

    DefaultLineFocus() {
        AtlasDocument.setLineFocus(1, this.FocusColumn);
    }

    setFocusHeader(previousDOM) {
        this.PreviosDOM = previousDOM;
        $('#txtDocumentDescription').select();
    }

    RunPostInit() {
        PostInit.forEach((e) => {
            try{
                e.f(e.args);
            } catch (e) {
                console.log(e);
            }
        });

        return this;
    }

    Save() {

    }
}

/// Keyboard shortcuts
//========================= Alt+N
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true) {
        if (key === 78) {
            if (thisDocument) thisDocument.NewDocument(0);
        } else if (key === 83) { // S
            if (thisDocument) thisDocument.Save();
        } else if (key === 67) { // C
            if (thisDocument) thisDocument.Save({ isClone: true });
        }
    }
});