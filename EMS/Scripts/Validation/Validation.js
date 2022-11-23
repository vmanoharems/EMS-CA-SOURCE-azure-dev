$(".valid-email-req").blur(function () {
    return ValidateEmail(this, true);
});

$(".valid-email").blur(function () {
    return ValidateEmail(this, true);
});

$(".input-required").blur(function () {
    isvalid = false;
    if (this.value == '' || this.value == undefined || this.value == null) {
        var IDD = this.id;
        $('#' + IDD).attr('style', 'border-color:red;');
        return false;
    }
    else {
        var IDD = this.id;
        $('#' + IDD).attr('style', 'border-color:#d2d6de;');
        return true;
    }
});

$(".requirednot").blur(function () {
    if (this.value == '' || this.value == undefined || this.value == null) {
        // ShowValidationMessage(this, "Field Required.");
        var IDD = this.id;
        $('#' + IDD).attr('style', 'border-color:#0a2463;');
        return false;
    }
    else {
        var IDD = this.id;
        $('#' + IDD).attr('style', 'border-color:#d2d6de;');
        return true;
    }
});

$(".validate-percentage").blur(function () {
    var parts = this.value.split(".");
    if (typeof parts[1] == "string" && (parts[1].length == 0 || parts[1].length > 2)) {
        return false;
    }
    var n = parseFloat(this.value);
    if (isNaN(n)) {
        return false;
    }
    if (n < 0 || n > 100) {
        ShowValidationMessage(this, "% can't be greater than 100."); return false;
    }
    HideValidationMessage(this);
});

$(".password-required").blur(function () {
    isvalid = false;
    if (this.value == '' || this.value == undefined || this.value == null) {
        ShowValidationMessage(this, "Password Required");
        return false;
    } HideValidationMessage(this);
});

$(".ddl-required").blur(function () {
    if (this.value == '' || this.value == undefined || this.value == null || this.value == -1 || this.value == 0) {
        // ShowValidationMessage(this, "Please select a value");
        var IDD = this.id;
        $('#' + IDD).attr('style', 'border-color:red;');
        return false;
    } //HideValidationMessage(this);
    else {
        var IDD = this.id;
        $('#' + IDD).attr('style', 'border-color:#d2d6de;');
        return true;
    }
});

$(".valid-zip-country").blur(function () {
    return ValidateZipByCountry(this, 'ddlCountry');
});

$('.phone').blur(function () {
    return ValidatePhoneNumber(this);
});
$('.phone-required').blur(function () {
    return ValidatePhoneNumberRequired(this);
});

$('.file-required').blur(function () {
    return ValidateFile(this);
});

$('.checkbox-checked').blur(function () {
    return CheckboxChecked(this);
});
$('.checkbox-checked-terms').blur(function () {
    return CheckboxCheckedterms(this);
});

$('.numeric').keypress(function (e) {
    return isNumberKey(e);
});

$('.numericZip').keypress(function (e) {
    if (valueLength != 5 && valueLength > 0) {
        ShowValidationMessage(control, "Zip code(US) should be 5 digit.");
        return false;
    }
    else {
        return true
    }
});


$(".valid-").blur(function () {
    return ValidateZipByCountry(this, 'ddlCountry');
});

$('.two-decimal').blur(function () {
    return ValidateDecimal(this, false);
});

$('.two-decimal-required').blur(function () {
    return ValidateDecimal(this, true);
});

$('.percentage').blur(function () {
    return ValidatePercentage(this, false);
});

$('.percentage-required').blur(function () {
    return ValidatePercentage(this, true);
});

//$(".ddl-country").blur(function () {
//    return ValidateZip(this);
//});


function UserAuthorisation() {
    alert();
    if (_USERID == '' || _USERID == null || _USERID == undefined || _USERID == 0) {
        window.location.href = HOST;
    }
}

function ValidateEmail(control, isRequired) {
    var value = control.value;
    var IDD = control.id;
    if (isRequired) {
        //email required
        if (value.length == '') {
            // ShowValidationMessage(control, "Email-Id required.");
            $('#' + IDD).attr('style', 'border-color:red;');
            return false;
        } else {
            var atpos = value.indexOf("@");
            var dotpos = value.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= value.length) {
                // ShowValidationMessage(control, "Invalid Email.");
                $('#' + IDD).attr('style', 'border-color:red;');
                return false;
            }
        }
    } else {
        if (value.length != '') {
            //not required but user entered some value
            var atpos = value.indexOf("@");
            var dotpos = value.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= value.length) {
                // ShowValidationMessage(control, "Invalid Email.");
                $('#' + IDD).attr('style', 'border-color:red;');
                return false;
            }
        }
    }
   
   
}

function ValidateZipByCountry(control, countryControlID) {
    var valueLength = control.value.length;
    var ddlCountryControl = $('#' + countryControlID);

    if (valueLength != 5 && valueLength > 0) {
        ShowValidationMessage(control, "Zip code(US) should be 5 digit.");
        return false;
    } else if (valueLength == 5) {
        getZip(control.value);
        //ddlCountryControl.val('254');
        //ddlCountryControl.text('United States');
    }
    HideValidationMessage(control);
}


function ShowValidationMessage(control, message) {
    HideValidationMessage(control);
    $(control).parent().append('<span id="' + control.id + '_msg_span" class="validation-error-msg" style="color:red;">' + message + '</span>');
    $('.errorMsgFlag').val('1');
}

function HideValidationMessage(control) {
    $(control).next().remove();
    $(control).next().remove();
    $('.errorMsgFlag').val('0');
}


function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        control.value = '';
        control.attr('style', 'border-color:red;');

        return "1";

    } else {
        control.attr('style', 'border-color:#d2d6de;');

        return "";
      
    }
}

function ValidatePhoneNumber(control) {
    var pLength = control.value.length;

    if (pLength != 10 && pLength > 0) {
        ShowValidationMessage(control, "Invalid Phone Number.");
        return false;
    } HideValidationMessage(control);
}
function ValidatePhoneNumberRequired(control) {
    var pLength = control.value.length;

    if (pLength != 10 && pLength > 0) {
        ShowValidationMessage(control, "Invalid Phone Number.");
        return false;
    } else if (pLength == 0) {
        ShowValidationMessage(control, "Phone Number Required.");
        return false;

    } HideValidationMessage(control);
}

function ValidateFile(control) {
    var pLength = control.value;

    if (pLength == '' || pLength == undefined || pLength == null) {
        ShowValidationMessage(control, "File Required.");
        return false;
    } HideValidationMessage(control);
}

function CheckboxChecked(control) {
    var chk = control.checked;

    if (!chk) {
        ShowValidationMessage(control, "CheckBox Should be Checked.");
        return false;
    } HideValidationMessage(control);
}

function CheckboxCheckedterms(control) {
    var chk = control.checked;

    if (!chk) {
        ShowValidationMessage(control, "Terms and Conditions Should Be Accepted.");
        return false;
    } HideValidationMessage(control);
}

function LowerTrim(string) {

    if (string == null || string == '' || string == undefined) {
        string = '';
    } else {
        string = string.trim();
        string = string.toLowerCase();
    }
    return string;
}

function UpperTrim(string) {

    if (string == null || string == '' || string == undefined) {
        string = '';
    } else {
        string = string.trim();
        string = string.toUpperCase();
    }
    return string;
}

function readURL(input, imageControlId) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + imageControlId).attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function GenerateDropDownBoxOptions(controlId, response, firstOption, selectedOption, isRequired) {

    var value;
    var text;
    var controlHTML = '<option value="-1">' + firstOption + '</option>';

    if (response.length > 0) {
        for (var responseCounter = 0; responseCounter < response.length; responseCounter++) {
            value = response[responseCounter][0]; text = response[responseCounter][1];
            controlHTML += '<option value="' + value + '">' + name + '</option>';
        }
        $('#' + controlId).append(controlHTML);
        $('#' + controlId).val(selectedOption.value).attr("selected", "selected");
    } else {
        // this is weird, but no options for this select!!
    }
}

function GetQueryStringParamByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function GetWebUrlFromImagePath(imagePath) {
    var webUrl = '';
    if (imagePath != null && imagePath != undefined && imagePath != '') {
        webUrl = HOST + imagePath.replace(/\\/g, "/");
    }
    return webUrl;
}

function GetClassNameForDocumentByFileName(fileName) {
    var className = 'class="doc"';
    var fileType = fileName.split(".")[1];
    switch (fileType) {
        case "docx":
            className = 'class="docx-icon"';
            break;
        case "pdf":
            className = 'class="pdf-icon"';
            break;
        case "ppt":
            className = 'class="ppt-icon"';
            break;
        case "xls":
            className = 'class="ppt-icon"';
            break;
        default:
            className = 'class="docx-icon"';
            break;
    }
    return className;
}

function GetFormattedDate(sqlDateString) {
    sqlDateString = sqlDateString.slice(0, 10);
    var dateArray = sqlDateString.split("-");
    var formattedDate = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];
    return formattedDate;
}

function DisableFormControls() {
    $(':input').prop("disabled", true);
    $('#inputEstimateSearch').removeAttr("disabled");
}

function SearchRecordsInTable(searchBoxId, tableId) {
    var searchText = document.getElementById(searchBoxId).value;
    searchText = searchText.toLowerCase();
    var targetTable = document.getElementById(tableId);
    var targetTableColCount;

    //Loop through table rows
    for (var rowIndex = 0; rowIndex < targetTable.rows.length; rowIndex++) {
        var rowData = '';

        //Get column count from header row
        if (rowIndex == 0) {
            targetTableColCount = targetTable.rows.item(rowIndex).cells.length;
            continue; //do not execute further code for header row.
        }

        //Process data rows. (rowIndex >= 1)
        for (var colIndex = 0; colIndex < targetTableColCount; colIndex++) {
            rowData += targetTable.rows.item(rowIndex).cells.item(colIndex).textContent;
            rowData = rowData.toLowerCase();
        }
        console.log(rowData);

        //If search term is not found in row data
        //then hide the row, else show
        if (rowData.indexOf(searchText) == -1)


            targetTable.rows.item(rowIndex).style.display = 'none';
        else
            targetTable.rows.item(rowIndex).style.display = '';
    }
}

function validateFileExtension(control, commaSeparatedFileTypes, message) {
    var ext = control.value.split('.').pop();
    var allowedFileTypeArray = new Array();

    if (commaSeparatedFileTypes.indexOf(",") > -1) {
        allowedFileTypeArray = commaSeparatedFileTypes.split(',');
    } else {
        allowedFileTypeArray = commaSeparatedFileTypes;
    }

    //for (extCounter = 0; extCounter < allowedFileTypeArray.length; extCounter++) {
    //    if (ext != allowedFileTypeArray[extCounter]) {
    //        ShowValidationMessage(control, message);
    //        control.value = null;
    //        return false;
    //    }
    //}

    var number = $.inArray(ext, allowedFileTypeArray);
    if (number < 0) {
        ShowValidationMessage(control, message);
        control.value = null;
        return false;
    }


    var fileSizeInMB = control.files[0].size / 1024 / 1024;
    console.log(fileSizeInMB);
    if (fileSizeInMB > 20) {
        ShowValidationMessage(control, 'File size should be less then 2MB.');
        control.value = null;
        return false;
    }
    else {
        HideValidationMessage(control);
    }
    return true;
}

function convertDate(str) {
    if (str == null || str == undefined || str == "") {
        mnth = "-";
        day = "-";
        year = "-";
    } else {
        var date = new Date(str),

            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        year = date.getFullYear();
    }

    return [mnth, day, year].join("-");
}

function convertDateWithNull(str) {
    if (str == null || str == undefined || str == "") {
        return null;
    } else {
        var date = new Date(str),

            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        year = date.getFullYear();
        return [day, mnth, year].join("-");
    }
}

function FormattedDateWithoutNull(str) {
    if (str == null || str == undefined || str == "") {
        return "-";
    } else {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        year = date.getFullYear();
        return [mnth, day, year].join("/");
    }

}

function BindDropDown(ddl, response) {
    var option = document.createElement("option");
    //option.value = 0;
    //option.text = "Select Pricing";
    //ddl.appendChild(option); // add header value and text of dropdown 
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            var option = document.createElement("option");
            option.value = response[i].Key;
            option.text = response[i].Value;
            ddl.appendChild(option);
        }
    }
}

function CheckRequired(control, options) {
    options = (options === undefined) ? { 'blur': true, 'focus': true } : options; // Default to blur: true, focus: true

    if (control.val() == '' || control.val() == null || control.val() == undefined || control.val() == -1 || control.val() == '-1') {
        if (options.blur) control.blur();
        if (options.focus) control.focus();
        control.attr('style', 'border-color:red;');

        return "1";
    } else {
        if (options.blur) control.blur();
        control.attr('style', 'border-color:#d2d6de;');

        return "";
    }
}

function CheckRequired1(control) {
    if (control.val() == '' || control.val() == null || control.val() == undefined || control.val() == -1 || control.val() == '-1') {
        control.blur();
        //control.focus();   
        control.attr('style', 'border-color:red;');

        return "1";
    }
    else {
        control.blur();
        control.attr('style', 'border-color:#d2d6de;');

        return "";
    }
}


function dateToWcf(input) {
    var d = new Date(input);
    if (isNaN(d)) return null;
    return '\/Date(' + d.getTime() + '-0000)\/';
}


function ValidateDecimal(control, isRequired) {
    var value = control.value;
    value = value.trim();
    var regEx = /^[-+]?\d+(\.\d{0,2})?$/;

    if (isRequired && value.length == 0) {
        // ShowValidationMessage(control, "Required field.");
        control.attr('style', 'border-color:#d2d6de;');

        return "";
        return false;
    } else {
        if (value.length > 0 && !regEx.test(value)) {
            control.value = '';
            control.attr('style', 'border-color:red;');

            return "1";
            // $(control).focus();
            // ShowValidationMessage(control, "Only 2 digits after decimal.");
            return false;
        }
    }
    HideValidationMessage(control);
}


function ValidatePercentage(control, isRequired) {
    var value = control.value;
    var regEx = /^(?:100(?:.0(?:0)?)?|\d{1,2}(?:.\d{1,2})?)$/;

    if (isRequired && value.length == 0) {

        ShowValidationMessage(control, "Required field.");
        return false;
    } else {
        if (value.length > 0 && !regEx.test(value)) {
            ShowValidationMessage(control, "allows value between 0-100.");
            return false;
        }
    }
    HideValidationMessage(control);

}


function alertSuccess(ctrlid, msg, url) {
    var s = String(msg);
    var result = s.replace("\\n", "<br />");
    $(ctrlid).removeClass().addClass("Successmessage").html(msg).fadeIn(2000).fadeOut(3000);
    if (url != '')
    { setTimeout('delayer(\'' + url + '\')', 3000); }
}

function delayer(url) {
    window.location = url;
}
function countChar(textbox, show) {

    var charleft = 'Characters left: ';
    var max = 299;
    var charcnt = document.getElementById(textbox).value.length;

    charleft = charleft + ' ' + eval(max - charcnt);
    if (charcnt >= max) {
        document.getElementById(textbox).value = document.getElementById(textbox).value.substring(0, max);
    }
    if (charcnt >= 0) {
        document.getElementById(show).innerHTML = charleft;
    }
    else {
        charleft = charleft + ' ' + 0;
        document.getElementById(show).innerHTML = charleft;
    }
}

function alertError(ctrlid, msg, url) {
    var s = String(msg);
    var result = s.replace("\\n", "<br />");
    $(ctrlid).removeClass().addClass("Successmessage").html(msg).fadeIn(2000).fadeOut(8000);
    if (url != '')
    { setTimeout('delayer(\'' + url + '\')', 3000); }
}

function letternumber(e) {
    var key;
    var keychar;

    if (window.event)
        key = window.event.keyCode;
    else if (e)
        key = e.which;
    else
        return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();

    // control keys
    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27))
        return true;

        // alphas and numbers
    else if ((("abcdefghijklmnopqrstuvwxyz0123456789 ").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

