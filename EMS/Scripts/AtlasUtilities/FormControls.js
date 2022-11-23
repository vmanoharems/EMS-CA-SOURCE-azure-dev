"use strict"

var AtlasForms = {
    Controls: {
        DropDown: {
            RenderData: (data, objParams) => {
                let domID = objParams.domID;
                let url = objParams.URL;
                let mapping = objParams.mapping;
                let errorFunction = objParams.errorFunction;
                let cache = objParams.cache;
                let existingValue = objParams.existingValue

                $('#' + domID).html('');
                if (typeof objParams.hasblank === 'function' && objParams.hasblank(data, objParams)) $('#' + domID).append('<option></option');
                let selected = '';
                for (var i = 0; i < data.length; i++) {
                    let thevalue = (typeof mapping.value === 'function') ? mapping.label(data[i]) : data[i][mapping.value];
                    let thedisplay = (typeof mapping.label === 'function') ? mapping.label(data[i]) : data[i][mapping.label];
                    selected = (thevalue === existingValue) ? 'selected' : '';
                    //console.log(selected);
                    $('#' + domID).append(`<option ${selected} value="${thevalue}">${thedisplay}</option>`);
                }

                if (typeof objParams.callback === 'function') { objParams.callback(objParams, data); }
            }
            ,
            RenderURL: (objParams) => {
                objParams.doneFunction = AtlasForms.Controls.DropDown.RenderData; // Set the doneFunction for the API call to the Generic RenderData function for a Dropdown control
                AtlasCache.CacheORajax(objParams);
            }
        }
    }
    , FormItems: {
        URLS: {
            COMPANYPERIODLIST: "/api/POInvoice/GetClosePeriodFortransaction"
            , COMPANYLIST: "/api/CompanySettings/GetCompanyList"

        }
        , ddlClosePeriod: (existingValue) => {
            return {
                domID: 'ddlClosePeriod'
                , URL: AtlasForms.FormItems.URLS.COMPANYPERIODLIST + '?CompanyId=' + $('#ddlCompany').val()
                , mapping: {
                    'value': 'ClosePeriodId'
                    , 'label': (data) => {
                        return `${data.PeriodStatus} (${data.CompanyPeriod})`;
                    }
                }
                , errorFunction: AtlasUtilities.LogError
                , cache: true
                , bustcache: true
                , options: {}
                , 'existingValue': existingValue
            }
        }
        , ddlCompanyList: (objP) => {
            return {
                domID: 'ddlCompany'
                , URL: AtlasForms.FormItems.URLS.COMPANYLIST + '?ProdId=' + localStorage.ProdId
                , mapping: {
                    'value': 'CompanyID'
                    , 'label': (data) => {
                        return `${data.CompanyCode} (${data.CompanyName})`;
                    }
                }
                , errorFunction: AtlasUtilities.LogError
                , cache: true
                , options: {}
                , 'existingValue': objP.existingValue
                , hasblank: function (datalist, objP) {
                    return (datalist.length > 1 /*|| objP.existingValue*/);
                }
                , callback: function (lP, data) { // Display the notification by the Company select so that the user knows they must select a company first
                    if (data.length > 1 && !lP.existingValue) {
                        $('#ddlCompany').notify('Please select a Company');
                        $('#ddlCompany').focus();
                    }
                    objP.callback(lP, data);
                }
            }
        }
    }
}

var AtlasInput = {
    _FocusElement: -1
    , FocusElement: function (ElementIndex) {
        if (ElementIndex !== undefined) this._FocusElement = ElementIndex;
        return (this._FocusElement === -1 ? 0 : this._FocusElement)
    }
    , CreateSelect: (data, objP) => {
        if (!Array.isArray(data)) return null;

        let input = document.createElement('select');
        input.id = objP.id;
        input.setAttribute('class', (objP.class === undefined ? '' : objP.class));

        data.forEach(function (e) {
            let opt = document.createElement('option');
            let namevalue = (typeof e === 'string')? { 'value': e, 'text': e }: e;
            opt.value = namevalue.value;
            opt.text = namevalue.text;
            input.appendChild(opt);
        });
        if (typeof objP.change === 'function') {
            $(input).change(objP.change);
        }

        if (objP.disabled) $(input).attr('disabled', 'true');

        return input;
    }
    , CreateInput: (objP) => {
        let theReturn = undefined;
        let input = document.createElement('input');
        input.setAttribute('type', objP.type);
        input.setAttribute('placeholder', objP.placeholder || '');
        input.setAttribute('name', objP.name);
        input.setAttribute('id', objP.id)
        input.setAttribute('class', (objP.class === undefined ? '' : objP.class));

        let thevalue = (typeof objP.existingvalue === 'object' && objP.existingvalue !== null) ? objP.existingvalue.text : objP.existingvalue;
            //if (!objP.existingvalue.useheadervalue)
        $(input).val(thevalue);
        $(input).attr('value', thevalue);

        if (objP.autocomplete) $(input).autocomplete(objP.autocomplete);
        if (objP.column) $(input).data('column', objP.column);

        if (objP.inTable) {
            let td = document.createElement('td');
            let tdclass = `input-td-${objP.id} `; // Used for up/down arrow navigation

            tdclass += (objP.class === undefined ? '' : objP.class); // Set the td class equal to the input's class
            td.appendChild(input);
            td.setAttribute('class', tdclass);
            theReturn = td;
        } else {
            theReturn = input
        }

        if (objP.visible === false && objP.visible !== undefined) $(input).hide();

        if (objP.existingvalue) {
            if (!objP.existingvalue.useheadervalue) {
                $(input).removeClass('use-header');
            }
        }

        if (typeof objP.change === 'function') {
            $(input).change(objP.change);
        }

        if (typeof objP.blur === 'function') {
            $(input).blur(objP.blur);
        }

        if (typeof objP.focusout === 'function') {
            $(input).focusout(objP.focusout);
        }

        if (typeof objP.keydown === 'function') {
            $(input).keydown(objP.keydown);
        }

        if (typeof objP.focus === 'function') {
            $(input).focus(objP.focus);
        }

        if (Array.isArray(objP.dataattr)) {
            objP.dataattr.forEach(function (e) {
                $(this).data(e.id, e.value);
            }, theReturn)
        }

        if (objP.disabled) $(input).attr('disabled', true);
        if (objP.track) $(input).data('original', objP.existingvalue || '');
        if (objP.required) input.required = true;

        return theReturn;
    }
    , AppendSegments: (HTMLelement, objConfig, objData) => {
        // Segments
        AtlasUtilities.SEGMENTS_CONFIG.sequence.forEach((segment, sIndex) => {
            let theautocomplete = {
                source: $.map(segment.Accounts, function (val, i) { return val.AccountCode; })
                , autoFocus: true
            };

            if (segment.Classification === 'Detail') {
                theautocomplete = {
                    source: function (request, response) {
                        let A_ = $.map(segment.Accounts, function (val, i) { return val.AccountCode; });
                        let matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                        response($.grep(A_, function (item) {
                            return matcher.test(item);
                        }));
                    }
                    , autoFocus: true
                }
            }
            let inputvalue = objData[segment.SegmentCode];
            if (segment.Accounts.length === 1 && segment.Classification !== 'Set') {
                inputvalue = segment.Accounts[0].AccountCode
            } else {
                if (AtlasInput._FocusElement === -1) {
                    AtlasInput.FocusElement(sIndex);
                }
            }

            let input = AtlasInput.CreateInput(
                {
                    id: segment.SegmentCode
                    , name: segment.SegmentCode
                    , placeholder: segment.SegmentCode
                    , type: 'input'
                    , 'class': `input-segment input-JE segment-${segment.SegmentCode}`
                    , autocomplete: theautocomplete
                    , existingvalue: inputvalue
                    , inTable: objConfig.inTable
                }
            );
            HTMLelement.appendChild(input);
        });
    }
    , AppendDescription: (HTMLElement, objConfig, objData) => {
        // Description field
        let desc = AtlasInput.CreateInput(
            {
                id: 'linedescription'
                , name: 'linedescription'
                , placeholder: 'Description'
                , type: 'input'
                , 'class': 'input-description-line input-JE'
                , existingvalue: objData.linedescription
                , inTable: objConfig.inTable
            }
        );
        HTMLElement.appendChild(desc);
    }
    , AppendAmount: (HTMLElement, objConfig, objData) => {
        // Amount field
        let amount = AtlasInput.CreateInput(
            {
                id: 'amount'
                , name: 'amount'
                , placeholder: 'Amount (0.00)'
                , type: 'input'
                //, class: 'AmountClass number w2ui-field w2field input-JE'
                , 'class': 'input-amount-line input-JE'
                , existingvalue: objData.amount
                , inTable: objConfig.inTable
            }
         );
        HTMLElement.appendChild(amount);
    }
    , AppendDebitCredit: (HTMLElement, objConfig, objData) => {
        // DR/CR fields
        let debit = AtlasInput.CreateInput(
            {
                id: 'amount'
                , name: 'amount'
                , placeholder: 'Debit (0.00)'
                , type: 'input'
                , class: 'AmountClass number w2ui-field w2field input-JE'
                , 'class': 'input-amount-line'
                , existingvalue: objData.debit
                , inTable: objConfig.inTable
            }
         );
        HTMLElement.appendChild(debit);

        let credit = AtlasInput.CreateInput(
            {
                id: 'amount'
                , name: 'amount'
                , placeholder: 'Credit (0.00)'
                , type: 'input'
                , class: 'AmountClass number w2ui-field w2field input-JE'
                , 'class': 'input-amount-line'
                , existingvalue: objData.credit
                , inTable: objConfig.inTable
            }
         );
        HTMLElement.appendChild(credit);
    }
    , AppendTaxCode: (HTMLElement, objConfig, objData) => {
        // Tax Code field
        let taxcode = AtlasInput.CreateInput(
            {
                id: 'taxcode'
                , name: 'taxcode'
                , placeholder: 'TaxCode'
                , type: 'input'
                , 'class': 'input-segment input-JE'
                , inTable: objConfig.inTable
                , autocomplete: {
                    autoFocus: true
                    , source: $.map(AtlasUtilities.TaxCode1099, function (m) {
                        return { label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(), };
                    })
                    , focus: function (event, ui) {
                        $(this).val(ui.item.value);
                        return false;
                    },
                    select: function (event, ui) {
                        $(this).val(ui.item.value);
                        return false;
                    },
                    change: function (event, ui) {
                        if (!ui.item) {
                            try {
                                var findVal = $(this).val();
                                findVal = findVal.toUpperCase();
                                var GetElm = $.grep(array, function (v) {
                                    return v.value == findVal;
                                });
                                if (GetElm.length > 0)
                                    $(this).val(findVal);
                                else
                                    $(this).val('');
                            }
                            catch (er) {
                                $(this).val('');
                                console.log(er);
                            }
                        }
                    }
                }
            }
        );
        HTMLElement.appendChild(taxcode);
    }
    , LineCOA: function (objSegments) {
        let DetailIndex = AtlasUtilities.SEGMENTS_CONFIG.DetailIndex
        let DetailCode = AtlasUtilities.SEGMENTS_CONFIG.sequence[DetailIndex].SegmentCode
        if (Object.keys(objSegments).length === 0 || objSegments[DetailCode] === '') return { 'COAID': '' }; // Return no COAID if there is nothing passed or the Detail field is empty
        let ret = undefined;
        let BadSeg = {};
        let objDetail = AtlasUtilities.SEGMENTS_CONFIG[DetailCode][objSegments[DetailCode]];

        if (objDetail) {
            if (objDetail.Posting) { // Only perform further validation on an account that allows posting
                ret = objDetail.COA.find(
                    (element) => {
                        let eret = AtlasUtilities.SEGMENTS_CONFIG.sequence.reduce((acc, cur, index) => {
                            let eret = true;
                            if (cur.SegmentCode !== 'Set' && index !== DetailIndex) {
                                eret = element[cur.SegmentCode] === objSegments[cur.SegmentCode];
                                if (!eret) BadSeg[cur.SegmentCode] = [index, objSegments[cur.SegmentCode]];
                            }
                            return acc && eret;
                        }, true);
                        return eret;
                    }
                );
            } else {
                BadSeg[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode] = AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex];
            }
        } else {
            BadSeg[DetailCode] = [DetailIndex, objSegments[DetailCode]];
        }
        return (ret === undefined)? { COAID: undefined, COACode: undefined, SegCheck: BadSeg }: ret;
    }
    , CreateFieldset: function (objP) {
        let master = this;

        let fieldset = document.createElement('fieldset');
        fieldset.style.cssText = 'display: inline-grid';
        fieldset.setAttribute('id', `fieldset_${objP.id}`);
        fieldset.setAttribute('class', (objP.fieldsetclass === undefined ? '' : objP.fieldsetclass));

        let label = document.createElement('label');
        label.innerHTML = objP.fieldsetlabel;
        label.setAttribute('for', objP.id);
        fieldset.appendChild(label);

        fieldset.appendChild(master.CreateInput(objP));
        return fieldset;
    }
}
