//document.onkeydown = G_checkKey;
var G_SegmentOrder = '';

const arrowkeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

function G_addremovefieldRequired(objDOM, remove) {
    let ret = true;
    if (remove) {
        $(objDOM).removeClass('field-Req');
    } else {
        $(objDOM).addClass('field-Req');
        ret = false;
    }
    return ret;
}

function G_legacy_CheckRequired(control, options) {
    options = (options === undefined) ? { 'blur': true, 'focus': true } : options; // Default to blur: true, focus: true

    if (control.val() == '' || control.val() == null || control.val() == undefined || control.val() == -1 || control.val() == '-1') {
        if (options.blur) control.blur();
        if (options.focus) control.focus();
        control.attr('style', 'border-color:red;');
        $(control).addClass('field-Req');

        return 1;
    } else {
        if (options.blur) control.blur();
        control.attr('style', 'border-color:#d2d6de;');

        return 0;
    }
}

function G_DocumentHeaderEmptyValue() {
    if (this.value === '') {
        $(this).notify(`Please enter a ${$(this).data('colloquial')}`).select();
        return false;
    }

    return true;
}

function G_ValidateSegmentValue() {
    if (this.value === '' && !$(this).hasClass('input-required')) return;

    let thefind = AtlasUtilities.SEGMENTS_CONFIG[this.name][this.value] || false; // Object.keys(AtlasUtilities.SEGMENTS_CONFIG[this.name]).find((e) => { return e == this.value; })
    if (thefind.hasOwnProperty('Posting')) thefind = thefind.Posting;  // This means it's a Detail

    return G_addremovefieldRequired(this, thefind);
}

function G_ValidateTransactionCode() {
    if (this.value === '') {
        $(this).removeClass('field-Req');// && !$(this).hasClass('input-required')) return;
        return;
    }

    let thecode = thisDocument.TransactionCodes.find((e) => { return e.TransCode === this.name; })
    let ret = G_addremovefieldRequired(this, thecode);

    let thefind = thecode.TV.find((e) => { return e.TransValue === this.value; });
    return G_addremovefieldRequired(this, thefind);
}

function G_ValidateDescriptionValue() {
    return G_addremovefieldRequired(this, (this.value !== ''));
}

function G_ValidateAmountValue(that) {
    that.value = numeral(that.value).format('0,0.00')
}

function G_ValidateTaxCode(that) {
    if (that.value === '' && !$(that).hasClass('input-required')) return;
    let thefind = AtlasUtilities.AllTaxCode1099.find(function (e) { return e.Active === true && e.TaxCode === that.value; });
    return G_addremovefieldRequired(that, thefind);
}

function G_KeyNavigation(e, force) {
    if (!arrowkeys[e.keyCode]) return; // This global function only applies to arrow keys!

    //e = e || window.event;
    let activeE = document.activeElement;
    //let autoc = $(e.srcElement).autocomplete('instance');
    //if (autoc && !force) {
    //    if (e.currentTarget.value === '') {
    //    } else if ($(e.currentTarget).hasClass('input-amount')) {
    //    } else if ($(e.currentTarget).hasClass('input-description-line')) {
    //    } else if (autoc.requestIndex !== 0 && e.currentTarget.value !== '') {
    //        return; // Don't perform up/down when autocomplete is active
    //    }
    //}
    let isautocomplete = $(this).autocomplete('instance');
    if (e.type === 'autocompleteopen') {
        debugger;
        return;
    } else if (!isautocomplete){ // Ignore for non-auto complete fields
    } else if (isautocomplete.term !== this.value && isautocomplete.term !== undefined) {
        //debugger;
        return;
    }

    // Handle arrow key field navigation
    if (e.keyCode == '38') {
        // up arrow
        //if (iRow !== undefined) {
        //    if ($('#tblAtlasDocumentLines tbody').children()[iRow - 1]) {
        //        $($($('#tblAtlasDocumentLines tbody').children()[iRow - 1]).children()[iCol]).find('input').select();
        //    }
        //    return;
        //}

        if (activeE.parentElement.parentElement.previousElementSibling !== null) {
            e.preventDefault();
            //$(activeE.parentElement.parentElement.previousElementSibling.children).filter(`td`).find('input').filter(`.input-${activeE.id}`).focus().select();
            $(activeE.parentElement.parentElement.previousElementSibling.children).filter(`td`).find('input').filter(`#${activeE.id}`).focus().select();
            //$(activeE.parentElement.parentElement.previousElementSibling.children).filter(`td.input-td-${activeE.id}`).find('input').select();
        } else {
            thisDocument.setFocusHeader(activeE);
        }

    } else if (e.keyCode == '40') {
        // down arrow
        if (activeE.parentElement.parentElement.nextElementSibling !== null) {
            //if (iRow !== undefined) {
            //    if ($('#tblAtlasDocumentLines tbody').children()[iRow + 1]) {
            //        $($($('#tblAtlasDocumentLines tbody').children()[iRow + 1]).children()[iCol]).find('input').select();
            //    }
            //    return;
            //} else {
                e.preventDefault();
                //$(activeE.parentElement.parentElement.nextElementSibling.children).filter(`td`).find('input').filter(`.input-${activeE.id}`).focus().select();
                $(activeE.parentElement.parentElement.nextElementSibling.children).filter(`td`).find('input').filter(`#${activeE.id}`).focus().select();
            //$(activeE.parentElement.parentElement.nextElementSibling.children).filter(`td.input-td-${activeE.id}`).find('input').select();
            //}
        } else {
            e.preventDefault();
            thisDocument.lock();
            thisDocument.AddLine({ 'FocusElement': activeE.id, 'FocusColumn': $(activeE).data('column') }, 'new');
            //$(activeE.parentElement.parentElement.nextElementSibling.children).filter(`td`).find('input').filter(`.input-${activeE.id}`).focus().select();
            $(activeE.parentElement.parentElement.nextElementSibling.children).filter(`td`).find('input').filter(`#${activeE.id}`).focus().select();
            thisDocument.unlock();
        }

    } else if (e.keyCode == '37') {
        // left arrow
    } else if (e.keyCode == '39') {
        // right arrow
    }
}

function Functify(func) {
    let ret = (typeof func === 'function') ? func : function (func) { };
    return ret;
}

function DataTablestrtoobj(tr) {

}

// Restricts input for each element in the set of matched elements to the given inputFilter.
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            //if (!this.value) return;
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    };
}(jQuery));

function G_BuildSegmentOrder() {
    REConfig.ConfigGet('Reports.Ledger.Bible', function (response) {
        let theConfig = JSON.parse(response.ConfigJSON || '{}');
        let SegmentOrder = theConfig.ReportConfig.SegmentOrder;
        let A_ = [];

        SegmentOrder.reduce(function (A_, e) {
            A_.push(e.SegmentCode);
            return A_;
        }, A_);
        G_SegmentOrder = A_.join(',');
    })
}

//=================Period  Autofill=====================//
function G_MakePeriodAutoComplete() {
    $.ajax({
        url: `${AtlasUtilities.URLS.v1.APIUrlGetPeriodAll}?CompanyId=-1`,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.CompanyPeriod,
                label: m.ClosePeriodId,
            };
        });

        $(".SearchPeriod").autocomplete({
            minLength: 1,
            source: array,
            autoFocus: true,
        });
    })
    .fail(function (error) {
        ShowMSG(error);
    });
}
