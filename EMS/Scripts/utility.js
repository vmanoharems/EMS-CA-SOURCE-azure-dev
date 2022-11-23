var HOST = window.location.protocol + '://' + window.location.host;
if (window.location.hostname === 'localhost') {
    HOST = '';
}
else {
    HOST = '';
}

var indebug = false;
var GlbCOAList = [];

var APIUrlPassDBName = HOST + "/api/Utility/PassDBName";
//var APIUrlChangeBatchNumber = HOST + "/api/AdminLogin/UpdateBatchNumber";
var APIUrlGetTaxCodeList = HOST + "/api/CompanySettings/SettingsTaxCodeGet";
var APIUrlCheckCOA = HOST + "/api/BudgetOperation/CheckCOAForProduction";
var APIUrlFillSegment = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlFillAccount = HOST + "/api/BudgetOperation/GetAccountNameForBudget";


var ArrSegment = [];


if (!localStorage.UserId && !localStorage.ProdId && localStorage.UserId === undefined && localStorage.ProdId === undefined) {
    location.replace(HOST + "/Home/Login");
}

let timeoutcss = document.createElement('link');
timeoutcss.setAttribute('rel', 'stylesheet');
timeoutcss.setAttribute('type', 'text/css');
timeoutcss.setAttribute('href', '/Content/css/timeout-dialog.css');
document.getElementsByTagName('head')[0].appendChild(timeoutcss);

var CheckToggle;
$('.logout').click(function () {
    localStorage.removeItem("UserId");
    localStorage.removeItem("ProdId");
    localStorage.removeItem("Email");
    localStorage.removeItem("Password");
    localStorage.removeItem("pubUserId");
    localStorage.removeItem("strBankId");
    localStorage.removeItem("DBName");
    localStorage.removeItem("PayrollSession");
    localStorage.removeItem("EMSKeyToken");
    localStorage.removeItem("BatchNumber");
    localStorage.removeItem("ProductionName");
    localStorage.CheakDataToggle = '';
    localStorage.CheckToggleCount = 0;

    BatchManager.Clear();//.removeItem('BatchManager');

    location.replace(HOST + "/Home/Login");
});
var actoin = 0;

$('#NavigationToggle').click(function () {
    if (localStorage.CheakDataToggle !== '') {
        actoin = parseInt(localStorage.CheckToggleCount) + 1
    } else { actoin = parseInt(actoin) + 1 }

    if (actoin % 2 === 0) {
        CheckToggle = 'true'
    } else {
        CheckToggle = 'false'
    }
    localStorage.CheckToggleCount = actoin;
    localStorage.CheakDataToggle = CheckToggle;
})

$(document).ready(function () {
    $(".datepicker").datepicker({
        onSelect: function (dateText, inst) {
            this.focus();
        }
    });

    ArrSegment = $.parseJSON(localStorage.ArrSegment);

    if (localStorage.CheakDataToggle == 'true') {
        $('#ToggleNavigationbodyID').removeClass("skin-blue sidebar-mini sidebar-collapse")
        $('#ToggleNavigationbodyID').addClass('skin-blue sidebar-mini');
    } else if (localStorage.CheakDataToggle == 'false') {
        $('#ToggleNavigationbodyID').removeClass('skin-blue sidebar-mini');
        $('#ToggleNavigationbodyID').addClass("skin-blue sidebar-mini sidebar-collapse");
        $('#DvMasterBatch').hide();
    }

    $('body').click(function () {
        if ($("body").hasClass("sidebar-collapse")) {
            $("#DvMasterBatch").fadeOut();
        }
        else {
            $("#DvMasterBatch").fadeIn();
        }
    });

    $('#spnBatchNumber').text(BatchManager.BatchNumber);
    $('#productionname').text(localStorage.ProductionName);

    //state.siblings('.has-error').remove();

    $('#navMainUL li').removeClass('active');

    if (window.location.href.indexOf('AccountPayable') !== -1) {
        $('#hrefPayable').parent().addClass('active');
    }
    else if (window.location.href.indexOf('Payroll') !== -1) {
        $('#hrefPayroll').parent().addClass('active');
    }
    else if (window.location.href.indexOf('CRW') !== -1) {
        $('#hrefCRW').parent().addClass('active');
    }
    else if (window.location.href.indexOf('Ledger') !== -1) {
        $('#hrefLedger').parent().addClass('active');
    }
    else if (window.location.href.indexOf('Budget') !== -1) {
        $('#hrefBudget').parent().addClass('active');
    }
    else if (window.location.href.indexOf('Reports') !== -1) {
        $('#hrefReports').parent().addClass('active');
    }
    $(".datepicker").datepicker({
        onSelect: function (dateText, inst) {
            this.focus();
        }
    });
    //-------------------------------------------------------------- Setting Module Start

    if (window.location.href.indexOf('ManageUsers') > -1 || window.location.href.indexOf('Users') > -1 || window.location.href.indexOf('Groups') > -1) {
        $('#UlSetting li').removeClass('active');
        $('#LiUsers').addClass('active');
        // alert('ManageUsers')
    }
    if (window.location.href.indexOf('Banks') > -1 || window.location.href.indexOf('AddBanks ') > -1) {
        $('#UlSetting li').removeClass('active');
        $('#LiBanks').addClass('active');
    }
    if (window.location.href.indexOf('Codes') > -1) {
        $('#UlSetting li').removeClass('active');
        $('#LiCodes').addClass('active');
    }
    if (window.location.href.indexOf('ManageUsers') > -1 || window.location.href.indexOf('Users') > -1 || window.location.href.indexOf('Groups') > -1 || window.location.href.indexOf('Company') > -1 || window.location.href.indexOf('Banks') > -1 || window.location.href.indexOf('AddBanks') > -1 || window.location.href.indexOf('Codes') > -1) {
        //$('#UlSetting li').removeClass('active');
        $('#CompanyIconI').addClass('active');
        // alert('ManageUsers')
    }

    //-------------------------------------------------------------- Setting Module End

    //-------------------------------------------------------------- Payroll Module Start

    if (window.location.href.indexOf('LoadPayroll') > -1) {
        $('#UlPayroll li').removeClass('active');
        $('#LiPayrollLoad').addClass('active');
    }
    if (window.location.href.indexOf('PayrollAudit') > -1) {
        $('#UlPayroll li').removeClass('active');
        $('#LiPayrollAudit').addClass('active');
    }
    if (window.location.href.indexOf('PayrollRCP') > -1) {
        $('#UlPayroll li').removeClass('active');
        $('#LiPayrollRCP').addClass('active');
    }
    if (window.location.href.indexOf('PayrollSetup') > -1) {
        $('#UlPayroll li').removeClass('active');
        $('#LiPayrollSetup').addClass('active');
    }
    if (window.location.href.indexOf('RcpPrint') > -1) {
        $('#UlPayroll li').removeClass('active');
        $('#LiPayrollRCP').addClass('active');
    }
    if (window.location.href.indexOf('PayrollEdit') > -1) {
        $('#UlPayroll li').removeClass('active');
        $('#LiPayrollAudit').addClass('active');
    }
    //-------------------------------------------------------------- Payroll Module End

    //-------------------------------------------------------------- Ledger Module Start
    if (window.location.href.indexOf('TrailBalance') > -1) {
        $('#UlLedger li').removeClass('active');
        $('#LiTrialBalance').addClass('active');
    }
    else if (window.location.href.indexOf('JEDistributionChange') > -1 || window.location.href.indexOf('JEManualEntry') > -1 || window.location.href.indexOf('JEAudit') > -1 || window.location.href.indexOf('JEPostingHistory') > -1) {
        $('#UlLedger li').removeClass('active');
        $('#LiJournalEntries').addClass('active');
    }
    else if (window.location.href.indexOf('Adjustments') > -1) {
        $('#UlLedger li').removeClass('active');
        $('#LiAdjustments').addClass('active');
    }
    else if (window.location.href.indexOf('Segments') > -1) {
        $('#UlLedger li').removeClass('active');
        $('#LiLegerSegments').addClass('active');
    }
    else if (window.location.href.indexOf('COA') > -1) {
        $('#UlLedger li').removeClass('active');
        $('#LiLedgerCOA').addClass('active');
    }
    else if (window.location.href.indexOf('GLSetup') > -1) {
        $('#UlLedger li').removeClass('active');
        $('#LiGLSetup').addClass('active');
    }
    else if (window.location.href.indexOf('ClosePeriod') > -1) {
        $('#UlLedger li').removeClass('active');
        $('#ClosePeriod').addClass('active');
    }
    //-------------------------------------------------------------- Ledger Module End
    //=======================UserProfile=========Start==============//
    if (window.location.href.indexOf('MyDefaults') > -1) {
        $('#UlUserProfile li').removeClass('active');
        $('#LiMyDefaults').addClass('active');
    }
    else if (window.location.href.indexOf('AP') > -1) {
        $('#UlUserProfile li').removeClass('active');
        $('#LiAP').addClass('active');
    }
    else if (window.location.href.indexOf('MYLeddger') > -1) {
        $('#UlUserProfile li').removeClass('active');
        $('#LiMYLedger').addClass('active');
    }
    else if (window.location.href.indexOf('BUDGET') > -1) {
        $('#UlUserProfile li').removeClass('active');
        $('#LiBudget').addClass('active');
    }
    else if (window.location.href.indexOf('REPORTS') > -1) {
        $('#UlUserProfile li').removeClass('active');
        $('#LiReports').addClass('active');
    }
    //=======================UserProfile End=========================//
    //-------------------------------------------------------------- AccountPayable Module Start

    if (window.location.href.indexOf('AccountPayable') > -1) {
        $('#UlAccountPayable li').removeClass('active');
        $('#LiAPPayment').addClass('active');
    }
    else if (window.location.href.indexOf('Vendors') > -1) {
        $('#UlAccountPayable li').removeClass('active');
        $('#LiAPVendors').addClass('active');
    }
    else if (window.location.href.indexOf('PendingInvoice') > -1) {
        $('#UlAccountPayable li').removeClass('active');
        $('#LiInvoice').addClass('active');

    }
    //======================Reports===============================//
    if (window.location.href.indexOf('Reports') > -1) {
        $('#UlListReports li').removeClass('active');
        $('#LiLedgerListing').addClass('active');
    }
    else if (window.location.href.indexOf('Vendors') > -1) {
        $('#UlListReports li').removeClass('active');
        $('#LiVendorsReports').addClass('active');
    }
    else if (window.location.href.indexOf('Invoices') > -1) {
        $('#UlListReports li').removeClass('active');
        $('#LiAPInvoiceReports').addClass('active');

    }
    //------------------------------------------ AccountPayable Module End

    PassDBName();

});

function GetCountryList() {
    return cntryList;
    //cntryList.push({ CountryID: 187, CountryCode: "192", CountryName: "United States", Capital: "Washington", Internet: "us", STDCode: "+1" });
    //cntryList.push({ CountryID: 1, CountryCode: "0", CountryName: "Andorra", Capital: "Andorra", Internet: "ad", STDCode: "+376" });
    //cntryList.push({ CountryID: 3, CountryCode: "2", CountryName: "Afghanistan", Capital: "Kabul", Internet: "af", STDCode: "+93" }); cntryList.push({ CountryID: 4, CountryCode: "3", CountryName: "Antigua and Barbuda", Capital: "St. Johns", Internet: "ag", STDCode: "+1-268" }); cntryList.push({ CountryID: 5, CountryCode: "4", CountryName: "Albania", Capital: "Tirana", Internet: "al", STDCode: "+355" }); cntryList.push({ CountryID: 6, CountryCode: "5", CountryName: "Armenia", Capital: "Yerevan", Internet: "am", STDCode: "+374" }); cntryList.push({ CountryID: 7, CountryCode: "6", CountryName: "Angola", Capital: "Luanda", Internet: "ao", STDCode: "+244" }); cntryList.push({ CountryID: 8, CountryCode: "7", CountryName: "Argentina", Capital: "Buenos Aires", Internet: "ar", STDCode: "+54" }); cntryList.push({ CountryID: 9, CountryCode: "8", CountryName: "Austria", Capital: "Vienna", Internet: "at", STDCode: "+43" }); cntryList.push({ CountryID: 10, CountryCode: "9", CountryName: "Australia", Capital: "Canberra", Internet: "au", STDCode: "+61" }); cntryList.push({ CountryID: 11, CountryCode: "10", CountryName: "Azerbaijan", Capital: "Baku", Internet: "az", STDCode: "+994" }); cntryList.push({ CountryID: 12, CountryCode: "11", CountryName: "Bosnia and Herzegovina", Capital: "Sarajevo", Internet: "ba", STDCode: "+387" }); cntryList.push({ CountryID: 13, CountryCode: "12", CountryName: "Barbados", Capital: "Bridgetown", Internet: "bb", STDCode: "+1-246" }); cntryList.push({ CountryID: 14, CountryCode: "13", CountryName: "Bangladesh", Capital: "Dhaka", Internet: "bd", STDCode: "+880" }); cntryList.push({ CountryID: 15, CountryCode: "14", CountryName: "Belgium", Capital: "Brussels", Internet: "be", STDCode: "+32" }); cntryList.push({ CountryID: 16, CountryCode: "15", CountryName: "Burkina Faso", Capital: "Ouagadougou", Internet: "bf", STDCode: "+226" }); cntryList.push({ CountryID: 17, CountryCode: "16", CountryName: "Bulgaria", Capital: "Sofia", Internet: "bg", STDCode: "+359" }); cntryList.push({ CountryID: 18, CountryCode: "17", CountryName: "Bahrain", Capital: "Al-Manamah", Internet: "bh", STDCode: "+973" }); cntryList.push({ CountryID: 19, CountryCode: "18", CountryName: "Burundi", Capital: "Bujumbura", Internet: "bi", STDCode: "+257" }); cntryList.push({ CountryID: 20, CountryCode: "19", CountryName: "Benin", Capital: "Porto-Novo", Internet: "bj", STDCode: "+229" }); cntryList.push({ CountryID: 21, CountryCode: "21", CountryName: "Brunei Darussalam", Capital: "Bandar Seri Begawan", Internet: "bn", STDCode: "+673" }); cntryList.push({ CountryID: 22, CountryCode: "22", CountryName: "Bolivia", Capital: "La Paz", Internet: "bo", STDCode: "+591" }); cntryList.push({ CountryID: 23, CountryCode: "23", CountryName: "Bonaire, Sint Eustatius and Saba", Capital: "", Internet: "", STDCode: "" }); cntryList.push({ CountryID: 24, CountryCode: "24", CountryName: "Brazil", Capital: "Brasilia", Internet: "br", STDCode: "+55" }); cntryList.push({ CountryID: 25, CountryCode: "25", CountryName: "Bahamas", Capital: "Nassau", Internet: "bs", STDCode: "+1-242" }); cntryList.push({ CountryID: 26, CountryCode: "26", CountryName: "Bhutan", Capital: "Thimphu", Internet: "bt", STDCode: "+975" }); cntryList.push({ CountryID: 27, CountryCode: "27", CountryName: "Botswana", Capital: "Gaborone", Internet: "bw", STDCode: "+267" }); cntryList.push({ CountryID: 28, CountryCode: "28", CountryName: "Belarus", Capital: "Minsk", Internet: "by", STDCode: "+375" }); cntryList.push({ CountryID: 29, CountryCode: "29", CountryName: "Belize", Capital: "Belmopan", Internet: "bz", STDCode: "+501" }); cntryList.push({ CountryID: 30, CountryCode: "30", CountryName: "Canada", Capital: "Ottawa", Internet: "ca", STDCode: "+1" }); cntryList.push({ CountryID: 31, CountryCode: "31", CountryName: "Congo, The Democratic Republic of the", Capital: "Kinshasa", Internet: "cd", STDCode: "+243" }); cntryList.push({ CountryID: 32, CountryCode: "32", CountryName: "Central African Republic", Capital: "Bangui", Internet: "cf", STDCode: "+236" }); cntryList.push({ CountryID: 33, CountryCode: "33", CountryName: "Congo", Capital: "Brazzaville", Internet: "cg", STDCode: "+242" }); cntryList.push({ CountryID: 34, CountryCode: "34", CountryName: "Switzerland", Capital: "Bern", Internet: "ch", STDCode: "+41" }); cntryList.push({ CountryID: 35, CountryCode: "35", CountryName: "C?te d'Ivoire", Capital: "", Internet: "", STDCode: "" }); cntryList.push({ CountryID: 36, CountryCode: "36", CountryName: "Chile", Capital: "Santiago", Internet: "cl", STDCode: "+56" }); cntryList.push({ CountryID: 37, CountryCode: "37", CountryName: "Cameroon", Capital: "Yaounde", Internet: "cm", STDCode: "+237" }); cntryList.push({ CountryID: 38, CountryCode: "38", CountryName: "China", Capital: "Beijing", Internet: "cn", STDCode: "+86" }); cntryList.push({ CountryID: 39, CountryCode: "39", CountryName: "Colombia", Capital: "Bogota", Internet: "co", STDCode: "+57" }); cntryList.push({ CountryID: 40, CountryCode: "40", CountryName: "Costa Rica", Capital: "San Jose", Internet: "cr", STDCode: "+506" }); cntryList.push({ CountryID: 41, CountryCode: "41", CountryName: "Cuba", Capital: "Havana", Internet: "cu", STDCode: "+53" }); cntryList.push({ CountryID: 42, CountryCode: "42", CountryName: "Cape Verde", Capital: "Praia", Internet: "cv", STDCode: "+238" }); cntryList.push({ CountryID: 43, CountryCode: "43", CountryName: "Cyprus", Capital: "Nicosia", Internet: "cy", STDCode: "+357" }); cntryList.push({ CountryID: 44, CountryCode: "44", CountryName: "Czech Republic", Capital: "Prague", Internet: "cz", STDCode: "+420" }); cntryList.push({ CountryID: 45, CountryCode: "45", CountryName: "Germany", Capital: "Berlin", Internet: "de", STDCode: "+49" }); cntryList.push({ CountryID: 46, CountryCode: "46", CountryName: "Djibouti", Capital: "Djibouti", Internet: "dj", STDCode: "+253" }); cntryList.push({ CountryID: 47, CountryCode: "47", CountryName: "Denmark", Capital: "Copenhagen", Internet: "dk", STDCode: "+45" }); cntryList.push({ CountryID: 48, CountryCode: "48", CountryName: "Dominica", Capital: "Roseau", Internet: "dm", STDCode: "+1-767" }); cntryList.push({ CountryID: 49, CountryCode: "49", CountryName: "Dominican Republic", Capital: "Santo Domingo", Internet: "do", STDCode: "+809" }); cntryList.push({ CountryID: 50, CountryCode: "50", CountryName: "Algeria", Capital: "Algiers", Internet: "dz", STDCode: "+213" }); cntryList.push({ CountryID: 51, CountryCode: "51", CountryName: "Ecuador", Capital: "Quito", Internet: "ec", STDCode: "+593" }); cntryList.push({ CountryID: 52, CountryCode: "52", CountryName: "Estonia", Capital: "Tallinn", Internet: "ee", STDCode: "+372" }); cntryList.push({ CountryID: 53, CountryCode: "53", CountryName: "Egypt", Capital: "Cairo", Internet: "eg", STDCode: "+20" }); cntryList.push({ CountryID: 54, CountryCode: "54", CountryName: "Eritrea", Capital: "Asmara", Internet: "er", STDCode: "+291" }); cntryList.push({ CountryID: 55, CountryCode: "55", CountryName: "Spain", Capital: "Madrid", Internet: "es", STDCode: "+34" }); cntryList.push({ CountryID: 56, CountryCode: "56", CountryName: "Ethiopia", Capital: "Addis Ababa", Internet: "et", STDCode: "+251" }); cntryList.push({ CountryID: 57, CountryCode: "57", CountryName: "Finland", Capital: "Helsinki", Internet: "fi", STDCode: "+358" }); cntryList.push({ CountryID: 58, CountryCode: "58", CountryName: "Fiji", Capital: "Suva", Internet: "fj", STDCode: "+679" }); cntryList.push({ CountryID: 59, CountryCode: "59", CountryName: "Micronesia, Federated States of", Capital: "Palikir", Internet: "fm", STDCode: "+691" }); cntryList.push({ CountryID: 60, CountryCode: "60", CountryName: "France", Capital: "Paris", Internet: "fr", STDCode: "+33" }); cntryList.push({ CountryID: 61, CountryCode: "61", CountryName: "Gabon", Capital: "Libreville", Internet: "ga", STDCode: "+241" }); cntryList.push({ CountryID: 62, CountryCode: "62", CountryName: "United Kingdom", Capital: "London", Internet: "uk", STDCode: "+44" }); cntryList.push({ CountryID: 63, CountryCode: "63", CountryName: "Grenada", Capital: "St. George's", Internet: "gd", STDCode: "+1-473" }); cntryList.push({ CountryID: 64, CountryCode: "64", CountryName: "Georgia", Capital: "Tbilisi", Internet: "ge", STDCode: "+995" }); cntryList.push({ CountryID: 65, CountryCode: "66", CountryName: "Ghana", Capital: "Accra", Internet: "gh", STDCode: "+233" }); cntryList.push({ CountryID: 66, CountryCode: "67", CountryName: "Greenland", Capital: "Godthab", Internet: "gl", STDCode: "+299" }); cntryList.push({ CountryID: 67, CountryCode: "68", CountryName: "Gambia", Capital: "Banjul", Internet: "gm", STDCode: "+220" }); cntryList.push({ CountryID: 68, CountryCode: "69", CountryName: "Guinea", Capital: "Conakry", Internet: "gn", STDCode: "+224" }); cntryList.push({ CountryID: 69, CountryCode: "70", CountryName: "Equatorial Guinea", Capital: "Malabo", Internet: "gq", STDCode: "+240" }); cntryList.push({ CountryID: 70, CountryCode: "71", CountryName: "Greece", Capital: "Athens", Internet: "gr", STDCode: "+30" }); cntryList.push({ CountryID: 71, CountryCode: "72", CountryName: "Guatemala", Capital: "Guatemala City", Internet: "gt", STDCode: "+502" }); cntryList.push({ CountryID: 72, CountryCode: "73", CountryName: "Guinea-Bissau", Capital: "Bissau", Internet: "gw", STDCode: "+245" }); cntryList.push({ CountryID: 73, CountryCode: "74", CountryName: "Guyana", Capital: "Georgetown", Internet: "gy", STDCode: "+592" }); cntryList.push({ CountryID: 74, CountryCode: "75", CountryName: "Honduras", Capital: "Tegucigalpa", Internet: "hn", STDCode: "+504" }); cntryList.push({ CountryID: 75, CountryCode: "76", CountryName: "Croatia", Capital: "Zagreb", Internet: "hr", STDCode: "+385" }); cntryList.push({ CountryID: 76, CountryCode: "77", CountryName: "Haiti", Capital: "Port-au-Prince", Internet: "ht", STDCode: "+509" }); cntryList.push({ CountryID: 77, CountryCode: "78", CountryName: "Hungary", Capital: "Budapest", Internet: "hu", STDCode: "+36" }); cntryList.push({ CountryID: 78, CountryCode: "79", CountryName: "Indonesia", Capital: "Jakarta", Internet: "id", STDCode: "+62" }); cntryList.push({ CountryID: 79, CountryCode: "80", CountryName: "Ireland", Capital: "Dublin", Internet: "ie", STDCode: "+353" }); cntryList.push({ CountryID: 80, CountryCode: "81", CountryName: "Israel", Capital: "Jerusalem", Internet: "il", STDCode: "+972" }); cntryList.push({ CountryID: 81, CountryCode: "83", CountryName: "India", Capital: "New Delhi", Internet: "in", STDCode: "+91" }); cntryList.push({ CountryID: 82, CountryCode: "84", CountryName: "Iraq", Capital: "Baghdad", Internet: "iq", STDCode: "+964" }); cntryList.push({ CountryID: 83, CountryCode: "85", CountryName: "Iran, Islamic Republic of", Capital: "Tehran", Internet: "ir", STDCode: "+98" }); cntryList.push({ CountryID: 84, CountryCode: "86", CountryName: "Iceland", Capital: "Reykjavik", Internet: "is", STDCode: "+354" }); cntryList.push({ CountryID: 85, CountryCode: "87", CountryName: "Italy", Capital: "Rome", Internet: "it", STDCode: "+39" }); cntryList.push({ CountryID: 86, CountryCode: "89", CountryName: "Jamaica", Capital: "Kingston", Internet: "jm", STDCode: "+1-876" }); cntryList.push({ CountryID: 87, CountryCode: "90", CountryName: "Jordan", Capital: "Amman", Internet: "jo", STDCode: "+962" }); cntryList.push({ CountryID: 88, CountryCode: "91", CountryName: "Japan", Capital: "Tokyo", Internet: "jp", STDCode: "+81" }); cntryList.push({ CountryID: 89, CountryCode: "92", CountryName: "Kenya", Capital: "Nairobi", Internet: "ke", STDCode: "+254" }); cntryList.push({ CountryID: 90, CountryCode: "93", CountryName: "Kyrgyzstan", Capital: "Bishkek", Internet: "kg", STDCode: "+996" }); cntryList.push({ CountryID: 91, CountryCode: "94", CountryName: "Cambodia", Capital: "Phnom Penh", Internet: "kh", STDCode: "+855" }); cntryList.push({ CountryID: 92, CountryCode: "95", CountryName: "Kiribati", Capital: "Tarawa", Internet: "ki", STDCode: "+686" }); cntryList.push({ CountryID: 93, CountryCode: "96", CountryName: "Saint Kitts and Nevis", Capital: "Basseterre", Internet: "kn", STDCode: "+1-869" }); cntryList.push({ CountryID: 94, CountryCode: "97", CountryName: "Comoros", Capital: "Moroni", Internet: "km", STDCode: "+269" }); cntryList.push({ CountryID: 95, CountryCode: "98", CountryName: "Korea-North", Capital: "Pyongyang", Internet: "kp", STDCode: "+850" }); cntryList.push({ CountryID: 96, CountryCode: "99", CountryName: "Korea-South", Capital: "Seoul", Internet: "kr", STDCode: "+82" }); cntryList.push({ CountryID: 97, CountryCode: "100", CountryName: "Kuwait", Capital: "Kuwait City", Internet: "kw", STDCode: "+965" }); cntryList.push({ CountryID: 98, CountryCode: "101", CountryName: "Kazakhstan", Capital: "Astana", Internet: "kz", STDCode: "+7" }); cntryList.push({ CountryID: 99, CountryCode: "102", CountryName: "Laos", Capital: "Vientiane", Internet: "la", STDCode: "+856" }); cntryList.push({ CountryID: 100, CountryCode: "103", CountryName: "Liechtenstein", Capital: "Vaduz", Internet: "li", STDCode: "+423" }); cntryList.push({ CountryID: 101, CountryCode: "104", CountryName: "Lebanon", Capital: "Beirut", Internet: "lb", STDCode: "+961" }); cntryList.push({ CountryID: 102, CountryCode: "105", CountryName: "Sri Lanka", Capital: "Colombo", Internet: "lk", STDCode: "+94" }); cntryList.push({ CountryID: 103, CountryCode: "106", CountryName: "Liberia", Capital: "Monrovia", Internet: "lr", STDCode: "+231" }); cntryList.push({ CountryID: 104, CountryCode: "107", CountryName: "Lesotho", Capital: "Maseru", Internet: "ls", STDCode: "+266" }); cntryList.push({ CountryID: 105, CountryCode: "108", CountryName: "Lithuania", Capital: "Vilnius", Internet: "lt", STDCode: "+370" }); cntryList.push({ CountryID: 106, CountryCode: "109", CountryName: "Luxembourg", Capital: "Luxembourg", Internet: "lu", STDCode: "+352" }); cntryList.push({ CountryID: 107, CountryCode: "110", CountryName: "Latvia", Capital: "Riga", Internet: "lv", STDCode: "+371" }); cntryList.push({ CountryID: 108, CountryCode: "111", CountryName: "Libya", Capital: "Tripoli", Internet: "ly", STDCode: "+218" }); cntryList.push({ CountryID: 109, CountryCode: "112", CountryName: "Morocco", Capital: "Rabat", Internet: "ma", STDCode: "+212" }); cntryList.push({ CountryID: 110, CountryCode: "113", CountryName: "Monaco", Capital: "Monaco", Internet: "mc", STDCode: "+377" }); cntryList.push({ CountryID: 111, CountryCode: "114", CountryName: "Moldova, Republic of", Capital: "Kishinev", Internet: "md", STDCode: "+373" }); cntryList.push({ CountryID: 112, CountryCode: "115", CountryName: "Montenegro", Capital: "Podgorica", Internet: "me", STDCode: "+382" }); cntryList.push({ CountryID: 113, CountryCode: "117", CountryName: "Madagascar", Capital: "Antananarivo", Internet: "mg", STDCode: "+261" }); cntryList.push({ CountryID: 114, CountryCode: "118", CountryName: "Marshall Islands", Capital: "Majuro", Internet: "mh", STDCode: "+692" }); cntryList.push({ CountryID: 115, CountryCode: "119", CountryName: "Macedonia, Republic of", Capital: "Skopje", Internet: "mk", STDCode: "+389" }); cntryList.push({ CountryID: 116, CountryCode: "120", CountryName: "Mali", Capital: "Bamako", Internet: "ml", STDCode: "+223" }); cntryList.push({ CountryID: 117, CountryCode: "121", CountryName: "Myanmar", Capital: "Naypyidaw", Internet: "mm", STDCode: "+95" }); cntryList.push({ CountryID: 118, CountryCode: "122", CountryName: "Mongolia", Capital: "Ulan Bator", Internet: "mn", STDCode: "+976" }); cntryList.push({ CountryID: 119, CountryCode: "124", CountryName: "Mauritania", Capital: "Nouakchott", Internet: "mr", STDCode: "+222" }); cntryList.push({ CountryID: 120, CountryCode: "125", CountryName: "Malta", Capital: "Valletta", Internet: "mt", STDCode: "+356" }); cntryList.push({ CountryID: 121, CountryCode: "126", CountryName: "Mauritius", Capital: "Port Louis", Internet: "mu", STDCode: "+230" }); cntryList.push({ CountryID: 122, CountryCode: "127", CountryName: "Maldives", Capital: "Male", Internet: "mv", STDCode: "+960" }); cntryList.push({ CountryID: 123, CountryCode: "128", CountryName: "Malawi", Capital: "Lilongwe", Internet: "mw", STDCode: "+265" }); cntryList.push({ CountryID: 124, CountryCode: "129", CountryName: "Mexico", Capital: "Mexico City", Internet: "mx", STDCode: "+52" }); cntryList.push({ CountryID: 125, CountryCode: "130", CountryName: "Malaysia", Capital: "Kuala Lumpur", Internet: "my", STDCode: "+60" }); cntryList.push({ CountryID: 126, CountryCode: "131", CountryName: "Mozambique", Capital: "Maputo", Internet: "mz", STDCode: "+258" }); cntryList.push({ CountryID: 127, CountryCode: "132", CountryName: "Namibia", Capital: "Windhoek", Internet: "na", STDCode: "+264" }); cntryList.push({ CountryID: 128, CountryCode: "133", CountryName: "Niger", Capital: "Niamey", Internet: "ne", STDCode: "+227" }); cntryList.push({ CountryID: 129, CountryCode: "134", CountryName: "Nigeria", Capital: "Lagos", Internet: "ng", STDCode: "+234" }); cntryList.push({ CountryID: 130, CountryCode: "135", CountryName: "Nicaragua", Capital: "Managua", Internet: "ni", STDCode: "+505" }); cntryList.push({ CountryID: 131, CountryCode: "136", CountryName: "Netherlands", Capital: "Amsterdam", Internet: "nl", STDCode: "+31" }); cntryList.push({ CountryID: 132, CountryCode: "137", CountryName: "Norway", Capital: "Oslo", Internet: "no", STDCode: "+47" }); cntryList.push({ CountryID: 133, CountryCode: "138", CountryName: "Nepal", Capital: "Kathmandu", Internet: "np", STDCode: "+977" }); cntryList.push({ CountryID: 134, CountryCode: "139", CountryName: "Nauru", Capital: "Yaren", Internet: "nr", STDCode: "+674" }); cntryList.push({ CountryID: 135, CountryCode: "140", CountryName: "New Zealand", Capital: "Wellington", Internet: "nz", STDCode: "+64" }); cntryList.push({ CountryID: 136, CountryCode: "141", CountryName: "Oman", Capital: "Muscat", Internet: "om", STDCode: "+968" }); cntryList.push({ CountryID: 137, CountryCode: "142", CountryName: "Panama", Capital: "Panama City", Internet: "pa", STDCode: "+507" }); cntryList.push({ CountryID: 138, CountryCode: "143", CountryName: "Peru", Capital: "Lima", Internet: "pe", STDCode: "+51" }); cntryList.push({ CountryID: 139, CountryCode: "144", CountryName: "Papua New Guinea", Capital: "Port Moresby", Internet: "pg", STDCode: "+675" }); cntryList.push({ CountryID: 140, CountryCode: "145", CountryName: "Philippines", Capital: "Manila", Internet: "ph", STDCode: "+63" }); cntryList.push({ CountryID: 141, CountryCode: "146", CountryName: "Pakistan", Capital: "Islamabad", Internet: "pk", STDCode: "+92" }); cntryList.push({ CountryID: 142, CountryCode: "147", CountryName: "Poland", Capital: "Warsaw", Internet: "pl", STDCode: "+48" }); cntryList.push({ CountryID: 143, CountryCode: "148", CountryName: "Palestine, State of", Capital: "", Internet: "", STDCode: "" }); cntryList.push({ CountryID: 144, CountryCode: "149", CountryName: "Portugal", Capital: "Lisbon", Internet: "pt", STDCode: "+351" }); cntryList.push({ CountryID: 145, CountryCode: "150", CountryName: "Palau", Capital: "Koror", Internet: "pw", STDCode: "+680" }); cntryList.push({ CountryID: 146, CountryCode: "151", CountryName: "Paraguay", Capital: "Asuncion", Internet: "py", STDCode: "+595" }); cntryList.push({ CountryID: 147, CountryCode: "152", CountryName: "Qatar", Capital: "Doha", Internet: "qa", STDCode: "+974" }); cntryList.push({ CountryID: 148, CountryCode: "153", CountryName: "Romania", Capital: "Bucharest", Internet: "ro", STDCode: "+40" }); cntryList.push({ CountryID: 149, CountryCode: "154", CountryName: "Serbia", Capital: "Belgrade", Internet: "rs", STDCode: "+381" }); cntryList.push({ CountryID: 150, CountryCode: "155", CountryName: "Russian Federation", Capital: "Moscow", Internet: "ru", STDCode: "+7" }); cntryList.push({ CountryID: 151, CountryCode: "156", CountryName: "Rwanda", Capital: "Kigali", Internet: "rw", STDCode: "+250" }); cntryList.push({ CountryID: 152, CountryCode: "157", CountryName: "Saudi Arabia", Capital: "Riyadh", Internet: "sa", STDCode: "+966" }); cntryList.push({ CountryID: 153, CountryCode: "158", CountryName: "Solomon Islands", Capital: "Honiara", Internet: "sb", STDCode: "+677" }); cntryList.push({ CountryID: 154, CountryCode: "159", CountryName: "Seychelles", Capital: "Victoria", Internet: "sc", STDCode: "+248" }); cntryList.push({ CountryID: 155, CountryCode: "160", CountryName: "Sudan", Capital: "Khartoum", Internet: "sd", STDCode: "+249" }); cntryList.push({ CountryID: 156, CountryCode: "161", CountryName: "Sweden", Capital: "Stockholm", Internet: "se", STDCode: "+46" }); cntryList.push({ CountryID: 157, CountryCode: "162", CountryName: "Singapore", Capital: "Singapore", Internet: "sg", STDCode: "+65" }); cntryList.push({ CountryID: 158, CountryCode: "163", CountryName: "Saint Helena, Ascension and Tristan da Cunha", Capital: "Jamestown", Internet: "sh", STDCode: "+290" }); cntryList.push({ CountryID: 159, CountryCode: "164", CountryName: "Slovenia", Capital: "Ljubljana", Internet: "si", STDCode: "+386" }); cntryList.push({ CountryID: 160, CountryCode: "165", CountryName: "Slovakia", Capital: "Bratislava", Internet: "sk", STDCode: "+421" }); cntryList.push({ CountryID: 161, CountryCode: "166", CountryName: "Sierra Leone", Capital: "Freetown", Internet: "sl", STDCode: "+232" }); cntryList.push({ CountryID: 162, CountryCode: "167", CountryName: "San Marino", Capital: "San Marino", Internet: "sm", STDCode: "+378" }); cntryList.push({ CountryID: 163, CountryCode: "168", CountryName: "Senegal", Capital: "Dakar", Internet: "sn", STDCode: "+221" }); cntryList.push({ CountryID: 164, CountryCode: "169", CountryName: "Somalia", Capital: "Mogadishu", Internet: "so", STDCode: "+252" }); cntryList.push({ CountryID: 165, CountryCode: "170", CountryName: "Suriname", Capital: "Paramaribo", Internet: "sr", STDCode: "+597" }); cntryList.push({ CountryID: 166, CountryCode: "171", CountryName: "South Sudan", Capital: "Ramciel", Internet: "ss", STDCode: "" }); cntryList.push({ CountryID: 167, CountryCode: "172", CountryName: "Sao Tome and Principe", Capital: "Sao Tome", Internet: "st", STDCode: "+239" }); cntryList.push({ CountryID: 168, CountryCode: "173", CountryName: "El Salvador", Capital: "San Salvador", Internet: "sv", STDCode: "+503" }); cntryList.push({ CountryID: 169, CountryCode: "174", CountryName: "Syrian Arab Republic", Capital: "Damascus", Internet: "sy", STDCode: "+963" }); cntryList.push({ CountryID: 170, CountryCode: "175", CountryName: "Swaziland", Capital: "Mbabane", Internet: "sz", STDCode: "+268" }); cntryList.push({ CountryID: 171, CountryCode: "176", CountryName: "Chad", Capital: "N'Djamena", Internet: "td", STDCode: "+235" }); cntryList.push({ CountryID: 172, CountryCode: "177", CountryName: "Togo", Capital: "Lome", Internet: "tg", STDCode: "+228" }); cntryList.push({ CountryID: 173, CountryCode: "178", CountryName: "Thailand", Capital: "Bangkok", Internet: "th", STDCode: "+66" }); cntryList.push({ CountryID: 174, CountryCode: "179", CountryName: "Tajikistan", Capital: "Dushanbe", Internet: "tj", STDCode: "+992" }); cntryList.push({ CountryID: 175, CountryCode: "180", CountryName: "Timor-Leste", Capital: "Dili", Internet: "TLS", STDCode: "+670" }); cntryList.push({ CountryID: 176, CountryCode: "181", CountryName: "Turkmenistan", Capital: "Ashgabat", Internet: "tm", STDCode: "+993" }); cntryList.push({ CountryID: 177, CountryCode: "182", CountryName: "Tunisia", Capital: "Tunis", Internet: "tn", STDCode: "+216" }); cntryList.push({ CountryID: 178, CountryCode: "183", CountryName: "Tonga", Capital: "Nuku'alofa", Internet: "to", STDCode: "+676" }); cntryList.push({ CountryID: 179, CountryCode: "184", CountryName: "Turkey", Capital: "Ankara", Internet: "tr", STDCode: "+90" }); cntryList.push({ CountryID: 180, CountryCode: "185", CountryName: "Trinidad and Tobago", Capital: "Port of Spain", Internet: "tt", STDCode: "+1-868" }); cntryList.push({ CountryID: 181, CountryCode: "186", CountryName: "Tuvalu", Capital: "Funafuti", Internet: "tv", STDCode: "+688" }); cntryList.push({ CountryID: 182, CountryCode: "187", CountryName: "Taiwan, Province of China", Capital: "Taipei", Internet: "tw", STDCode: "+886" }); cntryList.push({ CountryID: 183, CountryCode: "188", CountryName: "Tanzania, United Republic of", Capital: "Dodoma", Internet: "tz", STDCode: "+255" }); cntryList.push({ CountryID: 184, CountryCode: "189", CountryName: "Ukraine", Capital: "Kiev", Internet: "ua", STDCode: "+380" }); cntryList.push({ CountryID: 185, CountryCode: "190", CountryName: "Uganda", Capital: "Kampala", Internet: "ug", STDCode: "+256" }); cntryList.push({ CountryID: 2, CountryCode: "1", CountryName: "United Arab Emirates", Capital: "Abu Dhabi", Internet: "ae", STDCode: "+971" }); cntryList.push({ CountryID: 186, CountryCode: "191", CountryName: "United States Minor Outlying Islands", Capital: "None", Internet: "um", STDCode: "" }); cntryList.push({ CountryID: 187, CountryCode: "192", CountryName: "United States", Capital: "Washington", Internet: "us", STDCode: "+1" }); cntryList.push({ CountryID: 188, CountryCode: "193", CountryName: "Uruguay", Capital: "Montevideo", Internet: "uy", STDCode: "+598" }); cntryList.push({ CountryID: 189, CountryCode: "194", CountryName: "Uzbekistan", Capital: "Tashkent", Internet: "uz", STDCode: "+998" }); cntryList.push({ CountryID: 190, CountryCode: "195", CountryName: "Saint Vincent and the Grenadines", Capital: "Kingstown", Internet: "vc", STDCode: "+1-784" }); cntryList.push({ CountryID: 191, CountryCode: "196", CountryName: "Venezuela, Bolivarian Republic of", Capital: "Caracas", Internet: "ve", STDCode: "+58" }); cntryList.push({ CountryID: 192, CountryCode: "197", CountryName: "Viet Nam", Capital: "Hanoi", Internet: "vn", STDCode: "+84" }); cntryList.push({ CountryID: 193, CountryCode: "198", CountryName: "Vanuatu", Capital: "Port Vila", Internet: "vu", STDCode: "+678" }); cntryList.push({ CountryID: 194, CountryCode: "199", CountryName: "Samoa", Capital: "Apia", Internet: "ws", STDCode: "+684" }); cntryList.push({ CountryID: 195, CountryCode: "200", CountryName: "Yemen", Capital: "San'a", Internet: "ye", STDCode: "+967" }); cntryList.push({ CountryID: 196, CountryCode: "201", CountryName: "South Africa", Capital: "Pretoria", Internet: "za", STDCode: "+27" }); cntryList.push({ CountryID: 197, CountryCode: "202", CountryName: "Zambia", Capital: "Lusaka", Internet: "zm", STDCode: "+260" }); cntryList.push({ CountryID: 198, CountryCode: "203", CountryName: "Zimbabwe", Capital: "Harare", Internet: "zw", STDCode: "+263" }); cntryList.push({ CountryID: 199, CountryCode: "204", CountryName: "American Samoa", Capital: "Pago Pago", Internet: "as", STDCode: "+684" }); cntryList.push({ CountryID: 200, CountryCode: "205", CountryName: "Anguilla", Capital: "The Valley", Internet: "ai", STDCode: "+1-264" }); cntryList.push({ CountryID: 201, CountryCode: "206", CountryName: "Antarctica", Capital: "None", Internet: "aq", STDCode: "+672" }); cntryList.push({ CountryID: 202, CountryCode: "207", CountryName: "Aruba", Capital: "Oranjestad", Internet: "aw", STDCode: "+297" }); cntryList.push({ CountryID: 203, CountryCode: "208", CountryName: "Bermuda", Capital: "Hamilton", Internet: "bm", STDCode: "+1-441" }); cntryList.push({ CountryID: 204, CountryCode: "209", CountryName: "Bouvet Island", Capital: "None", Internet: "bv", STDCode: "" }); cntryList.push({ CountryID: 205, CountryCode: "210", CountryName: "British Indian Ocean Territory", Capital: "None", Internet: "io", STDCode: "" }); cntryList.push({ CountryID: 206, CountryCode: "211", CountryName: "Cayman Islands", Capital: "Georgetown", Internet: "ky", STDCode: "+1-345" }); cntryList.push({ CountryID: 207, CountryCode: "212", CountryName: "Christmas Island", Capital: "The Settlement", Internet: "cx", STDCode: "+61" }); cntryList.push({ CountryID: 208, CountryCode: "213", CountryName: "Cocos (Keeling) Islands", Capital: "West Island", Internet: "cc", STDCode: "+61" }); cntryList.push({ CountryID: 209, CountryCode: "214", CountryName: "Cook Islands", Capital: "Avarua", Internet: "ck", STDCode: "+682" }); cntryList.push({ CountryID: 210, CountryCode: "215", CountryName: "European Union", Capital: "Brussels", Internet: "eu.int", STDCode: "" }); cntryList.push({ CountryID: 211, CountryCode: "216", CountryName: "Falkland Islands (Malvinas)", Capital: "Stanley", Internet: "fk", STDCode: "+500" }); cntryList.push({ CountryID: 212, CountryCode: "217", CountryName: "Faroe Islands", Capital: "Torshavn", Internet: "fo", STDCode: "+298" }); cntryList.push({ CountryID: 213, CountryCode: "218", CountryName: "French Guiana", Capital: "Cayenne", Internet: "gf", STDCode: "+594" }); cntryList.push({ CountryID: 214, CountryCode: "219", CountryName: "French Southern Territories", Capital: "None", Internet: "tf", STDCode: "" }); cntryList.push({ CountryID: 215, CountryCode: "220", CountryName: "Gibraltar", Capital: "Gibraltar", Internet: "gi", STDCode: "+350" }); cntryList.push({ CountryID: 216, CountryCode: "221", CountryName: "Great Britain", Capital: "London", Internet: "gb", STDCode: "+44" }); cntryList.push({ CountryID: 217, CountryCode: "222", CountryName: "Guadeloupe (French)", Capital: "Basse-Terre", Internet: "gp", STDCode: "+590" }); cntryList.push({ CountryID: 218, CountryCode: "223", CountryName: "Guam (USA)", Capital: "Agana", Internet: "gu", STDCode: "+1-671" }); cntryList.push({ CountryID: 219, CountryCode: "224", CountryName: "Guernsey", Capital: "St. Peter Port", Internet: "gg", STDCode: "" }); cntryList.push({ CountryID: 220, CountryCode: "225", CountryName: "Heard Island and McDonald Islands", Capital: "None", Internet: "hm", STDCode: "" }); cntryList.push({ CountryID: 221, CountryCode: "226", CountryName: "Hong Kong", Capital: "Victoria", Internet: "hk", STDCode: "+852" }); cntryList.push({ CountryID: 222, CountryCode: "227", CountryName: "Isle of Man", Capital: "Douglas", Internet: "im", STDCode: "+" }); cntryList.push({ CountryID: 223, CountryCode: "228", CountryName: "Ivory Coast", Capital: "Abidjan", Internet: "ci", STDCode: "+225" }); cntryList.push({ CountryID: 224, CountryCode: "229", CountryName: "Jersey", Capital: "Saint Helier", Internet: "je", STDCode: "" }); cntryList.push({ CountryID: 225, CountryCode: "230", CountryName: "Korea-North", Capital: "Pyongyang", Internet: "kp", STDCode: "+850" }); cntryList.push({ CountryID: 226, CountryCode: "231", CountryName: "Korea-South", Capital: "Seoul", Internet: "kr", STDCode: "+82" }); cntryList.push({ CountryID: 227, CountryCode: "232", CountryName: "Laos", Capital: "Vientiane", Internet: "la", STDCode: "+856" }); cntryList.push({ CountryID: 228, CountryCode: "233", CountryName: "Macau", Capital: "Macau", Internet: "mo", STDCode: "+853" }); cntryList.push({ CountryID: 229, CountryCode: "234", CountryName: "Martinique (French)", Capital: "Fort-de-France", Internet: "mq", STDCode: "+596" }); cntryList.push({ CountryID: 230, CountryCode: "235", CountryName: "Mayotte", Capital: "Dzaoudzi", Internet: "yt", STDCode: "+269" }); cntryList.push({ CountryID: 231, CountryCode: "236", CountryName: "Montserrat", Capital: "Plymouth", Internet: "ms", STDCode: "+1-664" }); cntryList.push({ CountryID: 232, CountryCode: "237", CountryName: "Netherlands Antilles", Capital: "Willemstad", Internet: "an", STDCode: "+599" }); cntryList.push({ CountryID: 233, CountryCode: "238", CountryName: "New Caledonia (French)", Capital: "Noumea", Internet: "nc", STDCode: "+687" }); cntryList.push({ CountryID: 234, CountryCode: "239", CountryName: "Niue", Capital: "Alofi", Internet: "nu", STDCode: "+683" }); cntryList.push({ CountryID: 235, CountryCode: "240", CountryName: "Norfolk Island", Capital: "Kingston", Internet: "nf", STDCode: "+672" }); cntryList.push({ CountryID: 236, CountryCode: "241", CountryName: "Northern Mariana Islands", Capital: "Saipan", Internet: "mp", STDCode: "+670" }); cntryList.push({ CountryID: 237, CountryCode: "242", CountryName: "Pitcairn Island", Capital: "Adamstown", Internet: "pn", STDCode: "" }); cntryList.push({ CountryID: 238, CountryCode: "243", CountryName: "Polynesia (French)", Capital: "Papeete", Internet: "pf", STDCode: "+689" }); cntryList.push({ CountryID: 239, CountryCode: "244", CountryName: "Puerto Rico", Capital: "San Juan", Internet: "pr", STDCode: "+1-787" }); cntryList.push({ CountryID: 240, CountryCode: "245", CountryName: "Reunion (French)", Capital: "Saint-Denis", Internet: "re", STDCode: "+262" }); cntryList.push({ CountryID: 241, CountryCode: "246", CountryName: "Saint Lucia", Capital: "Castries", Internet: "lc", STDCode: "+1-758" }); cntryList.push({ CountryID: 242, CountryCode: "247", CountryName: "Saint Pierre and Miquelon", Capital: "St. Pierre", Internet: "pm", STDCode: "+508" }); cntryList.push({ CountryID: 243, CountryCode: "248", CountryName: "South Georgia & South Sandwich Islands", Capital: "None", Internet: "gs", STDCode: "" }); cntryList.push({ CountryID: 244, CountryCode: "249", CountryName: "Svalbard and Jan Mayen Islands", Capital: "Longyearbyen", Internet: "sj", STDCode: "" }); cntryList.push({ CountryID: 245, CountryCode: "250", CountryName: "Tokelau", Capital: "None", Internet: "tk", STDCode: "+690" }); cntryList.push({ CountryID: 246, CountryCode: "251", CountryName: "Turks and Caicos Islands", Capital: "Grand Turk", Internet: "tc", STDCode: "+1-649" }); cntryList.push({ CountryID: 247, CountryCode: "252", CountryName: "Vatican", Capital: "Vatican City", Internet: "va", STDCode: "+39" }); cntryList.push({ CountryID: 248, CountryCode: "253", CountryName: "Virgin Islands (British)", Capital: "Road Town", Internet: "vg", STDCode: "+1-284" }); cntryList.push({ CountryID: 249, CountryCode: "254", CountryName: "Virgin Islands (USA)", Capital: "Charlotte Amalie", Internet: "vi", STDCode: "+1-340" }); cntryList.push({ CountryID: 250, CountryCode: "255", CountryName: "Wallis and Futuna Islands", Capital: "Mata-Utu", Internet: "wf", STDCode: "+681" }); cntryList.push({ CountryID: 251, CountryCode: "256", CountryName: "Western Sahara", Capital: "El Aaiun", Internet: "eh", STDCode: "" });
}

function showDiv(id) {
    $('#' + id).show();
    $('#fade').show();
    scroll(0, 0);
}

function hideDiv(id, focusID) {
    $('#' + id).hide();
    $('#fade').hide();
    if (focusID !== undefined) {
        $('#' + focusID).focus();
    }
}

function ShowMsgBox(divID, msg, url, typ) {
    var s = msg;
    if (typ === '')
    { typ = 'successmsg'; }
    var result = s.replace("\\n", "<br />");
    $('#fade2').fadeIn(2000).fadeOut(5000);
    $('#' + divID).removeClass().addClass("alrtbox ").addClass(typ).html(msg).fadeIn(2000).fadeOut(5000);
    if (url !== '')
    { setTimeout('delayer(\'' + HOST + '/' + url + '\')', 7000); }
}
function delayer(url) {
    window.location = url;
}


function PassDBName() {

    if (localStorage.DBName !== undefined && localStorage.DBName !== null) {

        $.ajax({
            url: APIUrlPassDBName + '?DBName=' + localStorage.DBName,
            cache: false,
            type: 'GET',
            // async: false,
            contentType: 'application/json; charset=utf-8',

        })
           .done(function (response)
           { PassDBNameSuccess(response); })

               .fail(function (error)
               { ShowErrorMSG(error); })
    }

}
function PassDBNameSuccess(response) {

}

var SESSION_TIMEOUT = 3600; // Seconds

var IDLE_TIMEOUTClient = SESSION_TIMEOUT;
var _idleSecondsCounter = 0;
var _idleSecondsCounterPayroll = 0;
var GSessionTimeOutDialogisOpen = false;

localStorage._idleSecondsCounter = 1;
localStorage.globalactivesession = true;
var KeepAlive = 0;

document.addEventListener("click", function (e) {
    _idleSecondsCounter = 0;
    _idleSecondsCounterPayroll = 0;

    try { //handle the case when theclick is undefined
        let theclick = e.path.find(function (p) { return p.id === 'timeout-keep-signin-btn'; }).id
        if (theclick === 'timeout-keep-signin-btn') KeepAlive = -1;
    } catch (e) {
        KeepAlive = 0;
    }
    localStorage._idleSecondsCounter = KeepAlive;
});

document.addEventListener("keypress", function () {
    _idleSecondsCounter = 0;
    _idleSecondsCounterPayroll = 0;
});

window.setInterval(CheckIdleTime, (IDLE_TIMEOUTClient / 6 * 1000));

function CheckIdleTime() {
    _idleSecondsCounter += (IDLE_TIMEOUTClient / 6); // Increment the tab's counter

    //document.title = _idleSecondsCounter;

    if (localStorage.globalactivesession !== 'true') Logout(); // If any other tabs have timed out, then immediately logout everywhere

    if (_idleSecondsCounter >= SESSION_TIMEOUT) { // if we have exceeded the session timeout with our local idle counter
        let l_idleSecondsCounter = parseInt(localStorage._idleSecondsCounter); // pull the global (localStorage) value for the idle counter

        if (l_idleSecondsCounter === -1) { // This means a session clicked on the stay logged in button
            localStorage._idleSecondsCounter = 0;
            return;
        } else if (l_idleSecondsCounter === 0) { // Check our copy of the global (localStorage) version of the idle counter
            _idleSecondsCounter = 0; // Reset our local to match the global
            localStorage._idleSecondsCounter = 1;
            //document.title = 'RESET';
            return;
        }

        if (!GSessionTimeOutDialogisOpen) {
            localStorage._idleSecondsCounter = SESSION_TIMEOUT;
            $.timeoutDialog({ timeout: 60, countdown: 60, logout_redirect_url: Logout, restart_on_yes: true, keep_alive_url: sessionKeepAlive });
            GSessionTimeOutDialogisOpen = true;
        }
    }
}

function sessionKeepAlive() {
    _idleSecondsCounter = 0;
    _idleSecondsCounterPayroll = 0;
    GSessionTimeOutDialogisOpen = false;
    localStorage._idleSecondsCounter = 0;
    KeepAlive = -1;
}

function Logout() {
// Only logout if the global idle counter has exceeded the session timeout (i.e. we're ignoring the local session timeout)
    if (parseInt(localStorage._idleSecondsCounter) >= SESSION_TIMEOUT) { // Check to see if our global (localStorage) idle counter has exceeded the session timeout
        localStorage.removeItem("UserId");
        localStorage.removeItem("ProdId");
        localStorage.removeItem("Email");
        localStorage.removeItem("Password");
        localStorage.removeItem("pubUserId");
        localStorage.removeItem("strBankId");
        localStorage.removeItem("DBName");
        localStorage.removeItem("PayrollSession");
        localStorage.removeItem("EMSKeyToken");
        localStorage.removeItem("AtlasCache");
        localStorage.removeItem('globalactivesession'); // Remove globalsessiontimeout so that all other tabs timeout immediately 
        localStorage.CheakDataToggle = '';
        localStorage.CheckToggleCount = 0;
        location.replace(HOST + "/Home/Login");
    } else {
        // We have other active tabs
        localStorage.globalactivesession = true;
        GSessionTimeOutDialogisOpen = false;
        //document.title = 'RESET LOGOUT';
        _idleSecondsCounter = -1;
    }
}

///////////Payroll
var IDLE_TIMEOUT_PR = SESSION_TIMEOUT / 2;

window.setInterval(CheckIdleTime1, (IDLE_TIMEOUT_PR / 6 * 1000));

function CheckIdleTime1() {
    _idleSecondsCounterPayroll += IDLE_TIMEOUT_PR / 6;
    var oPanel = document.getElementById("SecondsUntilExpire1");
    if (oPanel)
        oPanel.innerHTML = (IDLE_TIMEOUT_PR - _idleSecondsCounterPayroll) + "";
    if (_idleSecondsCounterPayroll >= IDLE_TIMEOUT_PR) {
        if (!GSessionTimeOutDialogisOpen) {
            $.timeoutDialog({ timeout: 1, countdown: 60, logout_redirect_url: LogOutPayroll, restart_on_yes: true, keep_alive_url: sessionKeepAlive });
            GSessionTimeOutDialogisOpen = true;
        }
    }
}

function LogOutPayroll() {
    // localStorage.removeItem("PayrollSession");
    localStorage.PayrollSession = 'NO';
    if (window.location.href.indexOf('Payroll') > -1) {
        location.replace(HOST + "/Payroll/PayrollLogin");
    }
}

/*
function funBatchNo() {
    if ($('#ChkBatch').is(':checked')) {
        var strspn = $('#spnBatchNumber').text();
        $('#spnBatchNumber').hide();
        $('#txtBatchNumber').show();
        $('#txtBatchNumber').val(strspn);
    }
    else {
        $('#spnBatchNumber').show();
        $('#txtBatchNumber').hide();
    }
}

function funChangeBatchNumber() {
    var txtBN = $('#txtBatchNumber').val().trim();
    if (txtBN !== localStorage.BatchNumber) {
        $.ajax({
            url: APIUrlChangeBatchNumber + '?BatchNumber=' + txtBN + '&UserId=' + localStorage.UserId + '&ProdId=' + localStorage.ProdId,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',

        })
         .done(function (response)
         { ChangeBatchNumberSuccess(response); })

             .fail(function (error)
             { ShowErrorMSG(error); })
    }
}
function ChangeBatchNumberSuccess(response) {
    localStorage.BatchNumber = response;
    $('#spnBatchNumber').text(response);
    $('#txtBatchNumber').hide();
    $('#spnBatchNumber').show();
    $('#ChkBatch').prop('checked', false);
}
*/

//// Wire up the events as soon as the DOM tree is ready
$(document).ready(function () {
    var str = '';
    try {
        str = AtlasUtilities.Titlejs;
    } catch (err) {}

    var res = str.replace("&gt;&gt;", ">>");
    //document.title = 'ATLAS-' + localStorage.ProductionName + '-' + res;
    if (sessionStorage.DBName === undefined) {
        // to restrict multi tab functionality
        //Logout();
    }
});

document.onmousedown = disableclick;
status = "Right Click Disabled";
function disableclick(event) {
    if (event.button === 2) {

        return false;
    }
    else if (event.button === 1) {
        return false;
    }
}

$('a').click(function (e) {
    if (e.ctrlKey) {
        return false;
    }
});

$(document).keydown(function (event) {
    if (event.keyCode === 123) {
        return false;
    }
    else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
        return false;  //Prevent from ctrl+shift+i
    }
});

function GetTaxCodeList() {

    if (typeof AtlasUtilities !== undefined) {
        AtlasUtilities.GetTaxCodeList();
    } else {
        $.ajax({
            url: APIUrlGetTaxCodeList + '?ProdId=' + localStorage.ProdId + '&TaxCodeId=' + 0,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            GetTaxCodeList_Success(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function GetTaxCodeList_Success(response) {
    AllTaxCode1099 = response;
    TaxCode1099 = [];
    $.each(response, function (index, value) {
        if (value.Active == true)
            TaxCode1099.push({ TaxCode: value.TaxCode, TaxDescription: value.TaxDescription, });
    });
    //console.log(TaxCode1099);
}

//var myEvent = window.attachEvent || window.addEventListener;
//var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

//myEvent(chkevent, function (e) { // For >=IE7, Chrome, Firefox

//    if (validNavigation == false) {
//        Logout();

//    }
//});



/*! @preserve
 * numeral.js
 * version : 2.0.6
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.numeral = factory();
    }
}(this, function () {
    /************************************
        Variables
    ************************************/

    var numeral,
        _,
        VERSION = '2.0.6',
        formats = {},
        locales = {},
        defaults = {
            currentLocale: 'en',
            zeroFormat: null,
            nullFormat: null,
            defaultFormat: '0,0',
            scalePercentBy100: true
        },
        options = {
            currentLocale: defaults.currentLocale,
            zeroFormat: defaults.zeroFormat,
            nullFormat: defaults.nullFormat,
            defaultFormat: defaults.defaultFormat,
            scalePercentBy100: defaults.scalePercentBy100
        };


    /************************************
        Constructors
    ************************************/

    // Numeral prototype object
    function Numeral(input, number) {
        this._input = input;

        this._value = number;
    }

    numeral = function (input) {
        var value,
            kind,
            unformatFunction,
            regexp;

        if (numeral.isNumeral(input)) {
            value = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            value = 0;
        } else if (input === null || _.isNaN(input)) {
            value = null;
        } else if (typeof input === 'string') {
            if (options.zeroFormat && input === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                for (kind in formats) {
                    regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                    if (regexp && input.match(regexp)) {
                        unformatFunction = formats[kind].unformat;

                        break;
                    }
                }

                unformatFunction = unformatFunction || numeral._.stringToNumber;

                value = unformatFunction(input);
            }
        } else {
            value = Number(input) || null;
        }

        return new Numeral(input, value);
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // helper functions
    numeral._ = _ = {
        // formats numbers separators, decimals places, signs, abbreviations
        numberToFormat: function (value, format, roundingFunction) {
            var locale = locales[numeral.options.currentLocale],
                negP = false,
                optDec = false,
                leadingCount = 0,
                abbr = '',
                trillion = 1000000000000,
                billion = 1000000000,
                million = 1000000,
                thousand = 1000,
                decimal = '',
                neg = false,
                abbrForce, // force abbreviation
                abs,
                min,
                max,
                power,
                int,
                precision,
                signed,
                thousands,
                output;

            // make sure we never format a null value
            value = value || 0;

            abs = Math.abs(value);

            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (numeral._.includes(format, '(')) {
                negP = true;
                format = format.replace(/[\(|\)]/g, '');
            } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                format = format.replace(/[\+|\-]/g, '');
            }

            // see if abbreviation is wanted
            if (numeral._.includes(format, 'a')) {
                abbrForce = format.match(/a(k|m|b|t)?/);

                abbrForce = abbrForce ? abbrForce[1] : false;

                // check for space before abbreviation
                if (numeral._.includes(format, ' a')) {
                    abbr = ' ';
                }

                format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                if (abs >= trillion && !abbrForce || abbrForce === 't') {
                    // trillion
                    abbr += locale.abbreviations.trillion;
                    value = value / trillion;
                } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                    // billion
                    abbr += locale.abbreviations.billion;
                    value = value / billion;
                } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                    // million
                    abbr += locale.abbreviations.million;
                    value = value / million;
                } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                    // thousand
                    abbr += locale.abbreviations.thousand;
                    value = value / thousand;
                }
            }

            // check for optional decimals
            if (numeral._.includes(format, '[.]')) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            // break number and format
            int = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');
            leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

            if (precision) {
                if (numeral._.includes(precision, '[')) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                }

                int = decimal.split('.')[0];

                if (numeral._.includes(decimal, '.')) {
                    decimal = locale.delimiters.decimal + decimal.split('.')[1];
                } else {
                    decimal = '';
                }

                if (optDec && Number(decimal.slice(1)) === 0) {
                    decimal = '';
                }
            } else {
                int = numeral._.toFixed(value, 0, roundingFunction);
            }

            // check abbreviation again after rounding
            if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                int = String(Number(int) / 1000);

                switch (abbr) {
                    case locale.abbreviations.thousand:
                        abbr = locale.abbreviations.million;
                        break;
                    case locale.abbreviations.million:
                        abbr = locale.abbreviations.billion;
                        break;
                    case locale.abbreviations.billion:
                        abbr = locale.abbreviations.trillion;
                        break;
                }
            }


            // format number
            if (numeral._.includes(int, '-')) {
                int = int.slice(1);
                neg = true;
            }

            if (int.length < leadingCount) {
                for (var i = leadingCount - int.length; i > 0; i--) {
                    int = '0' + int;
                }
            }

            if (thousands > -1) {
                int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                int = '';
            }

            output = int + decimal + (abbr ? abbr : '');

            if (negP) {
                output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
            } else {
                if (signed >= 0) {
                    output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                } else if (neg) {
                    output = '-' + output;
                }
            }

            return output;
        },
        // unformats numbers separators, decimals places, signs, abbreviations
        stringToNumber: function (string) {
            var locale = locales[options.currentLocale],
                stringOriginal = string,
                abbreviations = {
                    thousand: 3,
                    million: 6,
                    billion: 9,
                    trillion: 12
                },
                abbreviation,
                value,
                i,
                regexp;

            if (options.zeroFormat && string === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                value = 1;

                if (locale.delimiters.decimal !== '.') {
                    string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                }

                for (abbreviation in abbreviations) {
                    regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                    if (stringOriginal.match(regexp)) {
                        value *= Math.pow(10, abbreviations[abbreviation]);
                        break;
                    }
                }

                // check for negative number
                value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                // remove non numbers
                string = string.replace(/[^0-9\.]+/g, '');

                value *= Number(string);
            }

            return value;
        },
        isNaN: function (value) {
            return typeof value === 'number' && isNaN(value);
        },
        includes: function (string, search) {
            return string.indexOf(search) !== -1;
        },
        insert: function (string, subString, start) {
            return string.slice(0, start) + subString + string.slice(start);
        },
        reduce: function (array, callback /*, initialValue*/) {
            if (this === null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(array),
                len = t.length >>> 0,
                k = 0,
                value;

            if (arguments.length === 3) {
                value = arguments[2];
            } else {
                while (k < len && !(k in t)) {
                    k++;
                }

                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        },
        /**
         * Computes the multiplier necessary to make x >= 1,
         * effectively eliminating miscalculations caused by
         * finite precision.
         */
        multiplier: function (x) {
            var parts = x.toString().split('.');

            return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
        },
        /**
         * Given a variable number of arguments, returns the maximum
         * multiplier that must be used to normalize an operation involving
         * all of them.
         */
        correctionFactor: function () {
            var args = Array.prototype.slice.call(arguments);

            return args.reduce(function (accum, next) {
                var mn = _.multiplier(next);
                return accum > mn ? accum : mn;
            }, 1);
        },
        /**
         * Implementation of toFixed() that treats floats more like decimals
         *
         * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
         * problems for accounting- and finance-related software.
         */
        toFixed: function (value, maxDecimals, roundingFunction, optionals) {
            var splitValue = value.toString().split('.'),
                minDecimals = maxDecimals - (optionals || 0),
                boundedPrecision,
                optionalsRegExp,
                power,
                output;

            // Use the smallest precision value possible to avoid errors from floating point representation
            if (splitValue.length === 2) {
                boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
            } else {
                boundedPrecision = minDecimals;
            }

            power = Math.pow(10, boundedPrecision);

            // Multiply up by precision, round accurately, then divide and use native toFixed():
            output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

            if (optionals > maxDecimals - boundedPrecision) {
                optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                output = output.replace(optionalsRegExp, '');
            }

            return output;
        }
    };

    // avaliable options
    numeral.options = options;

    // avaliable formats
    numeral.formats = formats;

    // avaliable formats
    numeral.locales = locales;

    // This function sets the current locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    numeral.locale = function (key) {
        if (key) {
            options.currentLocale = key.toLowerCase();
        }

        return options.currentLocale;
    };

    // This function provides access to the loaded locale data.  If
    // no arguments are passed in, it will simply return the current
    // global locale object.
    numeral.localeData = function (key) {
        if (!key) {
            return locales[options.currentLocale];
        }

        key = key.toLowerCase();

        if (!locales[key]) {
            throw new Error('Unknown locale : ' + key);
        }

        return locales[key];
    };

    numeral.reset = function () {
        for (var property in defaults) {
            options[property] = defaults[property];
        }
    };

    numeral.zeroFormat = function (format) {
        options.zeroFormat = typeof (format) === 'string' ? format : null;
    };

    numeral.nullFormat = function (format) {
        options.nullFormat = typeof (format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        options.defaultFormat = typeof (format) === 'string' ? format : '0.0';
    };

    numeral.register = function (type, name, format) {
        name = name.toLowerCase();

        if (this[type + 's'][name]) {
            throw new TypeError(name + ' ' + type + ' already registered.');
        }

        this[type + 's'][name] = format;

        return format;
    };


    numeral.validate = function (val, culture) {
        var _decimalSep,
            _thousandSep,
            _currSymbol,
            _valArray,
            _abbrObj,
            _thousandRegEx,
            localeData,
            temp;

        //coerce val to string
        if (typeof val !== 'string') {
            val += '';

            if (console.warn) {
                console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
            }
        }

        //trim whitespaces from either sides
        val = val.trim();

        //if val is just digits return true
        if (!!val.match(/^\d+$/)) {
            return true;
        }

        //if val is empty return false
        if (val === '') {
            return false;
        }

        //get the decimal and thousands separator from numeral.localeData
        try {
            //check if the culture is understood by numeral. if not, default it to current locale
            localeData = numeral.localeData(culture);
        } catch (e) {
            localeData = numeral.localeData(numeral.locale());
        }

        //setup the delimiters and currency symbol based on culture/locale
        _currSymbol = localeData.currency.symbol;
        _abbrObj = localeData.abbreviations;
        _decimalSep = localeData.delimiters.decimal;
        if (localeData.delimiters.thousands === '.') {
            _thousandSep = '\\.';
        } else {
            _thousandSep = localeData.delimiters.thousands;
        }

        // validating currency symbol
        temp = val.match(/^[^\d]+/);
        if (temp !== null) {
            val = val.substr(1);
            if (temp[0] !== _currSymbol) {
                return false;
            }
        }

        //validating abbreviation symbol
        temp = val.match(/[^\d]+$/);
        if (temp !== null) {
            val = val.slice(0, -1);
            if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                return false;
            }
        }

        _thousandRegEx = new RegExp(_thousandSep + '{2}');

        if (!val.match(/[^\d.,]/g)) {
            _valArray = val.split(_decimalSep);
            if (_valArray.length > 2) {
                return false;
            } else {
                if (_valArray.length < 2) {
                    return (!!_valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                } else {
                    if (_valArray[0].length === 1) {
                        return (!!_valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !!_valArray[1].match(/^\d+$/));
                    } else {
                        return (!!_valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !!_valArray[1].match(/^\d+$/));
                    }
                }
            }
        }

        return false;
    };


    /************************************
        Numeral Prototype
    ************************************/

    numeral.fn = Numeral.prototype = {
        clone: function () {
            return numeral(this);
        },
        format: function (inputString, roundingFunction) {
            var value = this._value,
                format = inputString || options.defaultFormat,
                kind,
                output,
                formatFunction;

            // make sure we have a roundingFunction
            roundingFunction = roundingFunction || Math.round;

            // format based on value
            if (value === 0 && options.zeroFormat !== null) {
                output = options.zeroFormat;
            } else if (value === null && options.nullFormat !== null) {
                output = options.nullFormat;
            } else {
                for (kind in formats) {
                    if (format.match(formats[kind].regexps.format)) {
                        formatFunction = formats[kind].format;

                        break;
                    }
                }

                formatFunction = formatFunction || numeral._.numberToFormat;

                output = formatFunction(value, format, roundingFunction);
            }

            return output;
        },
        value: function () {
            return this._value;
        },
        input: function () {
            return this._input;
        },
        set: function (value) {
            this._value = Number(value);

            return this;
        },
        add: function (value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum + Math.round(corrFactor * curr);
            }

            this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

            return this;
        },
        subtract: function (value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum - Math.round(corrFactor * curr);
            }

            this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

            return this;
        },
        multiply: function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback, 1);

            return this;
        },
        divide: function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback);

            return this;
        },
        difference: function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }
    };

    /************************************
        Default Locale && Format
    ************************************/

    numeral.register('locale', 'en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });



    (function () {
        numeral.register('format', 'bps', {
            regexps: {
                format: /(BPS)/,
                unformat: /(BPS)/
            },
            format: function (value, format, roundingFunction) {
                var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                    output;

                value = value * 10000;

                // check for space before BPS
                format = format.replace(/\s?BPS/, '');

                output = numeral._.numberToFormat(value, format, roundingFunction);

                if (numeral._.includes(output, ')')) {
                    output = output.split('');

                    output.splice(-1, 0, space + 'BPS');

                    output = output.join('');
                } else {
                    output = output + space + 'BPS';
                }

                return output;
            },
            unformat: function (string) {
                return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
            }
        });
    })();


    (function () {
        var decimal = {
            base: 1000,
            suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        },
        binary = {
            base: 1024,
            suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        };

        var allSuffixes = decimal.suffixes.concat(binary.suffixes.filter(function (item) {
            return decimal.suffixes.indexOf(item) < 0;
        }));
        var unformatRegex = allSuffixes.join('|');
        // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
        unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

        numeral.register('format', 'bytes', {
            regexps: {
                format: /([0\s]i?b)/,
                unformat: new RegExp(unformatRegex)
            },
            format: function (value, format, roundingFunction) {
                var output,
                    bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                    suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                    power,
                    min,
                    max;

                // check for space before
                format = format.replace(/\s?i?b/, '');

                for (power = 0; power <= bytes.suffixes.length; power++) {
                    min = Math.pow(bytes.base, power);
                    max = Math.pow(bytes.base, power + 1);

                    if (value === null || value === 0 || value >= min && value < max) {
                        suffix += bytes.suffixes[power];

                        if (min > 0) {
                            value = value / min;
                        }

                        break;
                    }
                }

                output = numeral._.numberToFormat(value, format, roundingFunction);

                return output + suffix;
            },
            unformat: function (string) {
                var value = numeral._.stringToNumber(string),
                    power,
                    bytesMultiplier;

                if (value) {
                    for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                        if (numeral._.includes(string, decimal.suffixes[power])) {
                            bytesMultiplier = Math.pow(decimal.base, power);

                            break;
                        }

                        if (numeral._.includes(string, binary.suffixes[power])) {
                            bytesMultiplier = Math.pow(binary.base, power);

                            break;
                        }
                    }

                    value *= (bytesMultiplier || 1);
                }

                return value;
            }
        });
    })();


    (function () {
        numeral.register('format', 'currency', {
            regexps: {
                format: /(\$)/
            },
            format: function (value, format, roundingFunction) {
                var locale = numeral.locales[numeral.options.currentLocale],
                    symbols = {
                        before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                        after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                    },
                    output,
                    symbol,
                    i;

                // strip format of spaces and $
                format = format.replace(/\s?\$\s?/, '');

                // format the number
                output = numeral._.numberToFormat(value, format, roundingFunction);

                // update the before and after based on value
                if (value >= 0) {
                    symbols.before = symbols.before.replace(/[\-\(]/, '');
                    symbols.after = symbols.after.replace(/[\-\)]/, '');
                } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                    symbols.before = '-' + symbols.before;
                }

                // loop through each before symbol
                for (i = 0; i < symbols.before.length; i++) {
                    symbol = symbols.before[i];

                    switch (symbol) {
                        case '$':
                            output = numeral._.insert(output, locale.currency.symbol, i);
                            break;
                        case ' ':
                            output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                            break;
                    }
                }

                // loop through each after symbol
                for (i = symbols.after.length - 1; i >= 0; i--) {
                    symbol = symbols.after[i];

                    switch (symbol) {
                        case '$':
                            output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                            break;
                        case ' ':
                            output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                            break;
                    }
                }


                return output;
            }
        });
    })();


    (function () {
        numeral.register('format', 'exponential', {
            regexps: {
                format: /(e\+|e-)/,
                unformat: /(e\+|e-)/
            },
            format: function (value, format, roundingFunction) {
                var output,
                    exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                    parts = exponential.split('e');

                format = format.replace(/e[\+|\-]{1}0/, '');

                output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

                return output + 'e' + parts[1];
            },
            unformat: function (string) {
                var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                    value = Number(parts[0]),
                    power = Number(parts[1]);

                power = numeral._.includes(string, 'e-') ? power *= -1 : power;

                function cback(accum, curr, currI, O) {
                    var corrFactor = numeral._.correctionFactor(accum, curr),
                        num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                    return num;
                }

                return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
            }
        });
    })();


    (function () {
        numeral.register('format', 'ordinal', {
            regexps: {
                format: /(o)/
            },
            format: function (value, format, roundingFunction) {
                var locale = numeral.locales[numeral.options.currentLocale],
                    output,
                    ordinal = numeral._.includes(format, ' o') ? ' ' : '';

                // check for space before
                format = format.replace(/\s?o/, '');

                ordinal += locale.ordinal(value);

                output = numeral._.numberToFormat(value, format, roundingFunction);

                return output + ordinal;
            }
        });
    })();


    (function () {
        numeral.register('format', 'percentage', {
            regexps: {
                format: /(%)/,
                unformat: /(%)/
            },
            format: function (value, format, roundingFunction) {
                var space = numeral._.includes(format, ' %') ? ' ' : '',
                    output;

                if (numeral.options.scalePercentBy100) {
                    value = value * 100;
                }

                // check for space before %
                format = format.replace(/\s?\%/, '');

                output = numeral._.numberToFormat(value, format, roundingFunction);

                if (numeral._.includes(output, ')')) {
                    output = output.split('');

                    output.splice(-1, 0, space + '%');

                    output = output.join('');
                } else {
                    output = output + space + '%';
                }

                return output;
            },
            unformat: function (string) {
                var number = numeral._.stringToNumber(string);
                if (numeral.options.scalePercentBy100) {
                    return number * 0.01;
                }
                return number;
            }
        });
    })();


    (function () {
        numeral.register('format', 'time', {
            regexps: {
                format: /(:)/,
                unformat: /(:)/
            },
            format: function (value, format, roundingFunction) {
                var hours = Math.floor(value / 60 / 60),
                    minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                    seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

                return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
            },
            unformat: function (string) {
                var timeArray = string.split(':'),
                    seconds = 0;

                // turn hours and minutes into seconds and add them all up
                if (timeArray.length === 3) {
                    // hours
                    seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                    // minutes
                    seconds = seconds + (Number(timeArray[1]) * 60);
                    // seconds
                    seconds = seconds + Number(timeArray[2]);
                } else if (timeArray.length === 2) {
                    // minutes
                    seconds = seconds + (Number(timeArray[0]) * 60);
                    // seconds
                    seconds = seconds + Number(timeArray[1]);
                }
                return Number(seconds);
            }
        });
    })();

    return numeral;
}));


function GetSegmentValue(values, SegmentName, SegmentP, objDOM) {
    if (SegmentName === 'DT') { SegmentName = 'DETAILS'; }
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');
    var strval = $('#txt_' + values + '_' + SegmentP).val();
    var strStatus = 1;
    // There appears to be some bug within jQuery or Chrome where the #hdnCode value is not set during selection, but by using another name, the element works just fine
    var strhidden = $('#hdnCode_' + values).val();
    if (strhidden === undefined) {
        strhidden = $('#hdnCOACode_' + values).val();
    }
    if (strhidden === undefined) {
        strhidden = AtlasUtilities.SEGMENTS[SegmentName][0].COACode;
    }
    if (strhidden === undefined) {
        strhidden = $('body').data('hdnCOACode');
    }
    let strsplit = strhidden.split('|');

    for (var i = 0; i <= SegmentP; i++) { if (i == SegmentP) { if (strval == strsplit[i]) { strStatus = 0; } } }
    if (strStatus != 0 && GlbCOAList.length > 0) {
        var strstatus = false;
        var strval = $('#txt_' + values + '_' + SegmentP).val();
        if (strval !== '') {
            if (strval.indexOf('(') !== -1) {
                strval = strval.split('(')[0].trim();
            }
            for (var i = 0; i < GlbCOAList.length; i++) {
                if (GlbCOAList[i].COANo.replace('-', '').match(RegExp('^' + strval, 'i')) || strval == GlbCOAList[i].COANo) {
                    $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[i].COANo);
                    $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[i].COANo);
                    $('#txt_' + values + '_' + SegmentP).attr('COACode', GlbCOAList[i].COACode);
                    $('#txt_' + values + '_' + SegmentP).attr('COAId', GlbCOAList[i].COAID);
                    $('#hdnCoaCode_' + values).val(GlbCOAList[i].COACode);
                    $('#hdnCoaId_' + values).val(GlbCOAList[i].COAID);

                    $('#hdnCode_' + values).val(GlbCOAList[i].COACode);
                    $('#hdnCOAId_' + values).val(GlbCOAList[i].COAID);
                    strstatus = true;
                    break;
                } else {
                    $('#txt_' + values + '_' + SegmentP).val('');
                    $('#txt_' + values + '_' + SegmentP).removeAttr('COACode');
                    $('#txt_' + values + '_' + SegmentP).removeAttr('COAId');
                    $('#hdnCOACode_' + values).val('');
                    $('#hdnCOAId_' + values).val('');
                    $('#hdnCode_' + values).val('');
                }
            }
        }
        if (!strstatus) {
            $('#txt_' + values + '_' + SegmentP).val('');
            $('#txt_' + values + '_' + SegmentP).removeAttr('COACode');
            $('#txt_' + values + '_' + SegmentP).removeAttr('COAId');
            $('#hdnCoaCode_' + values).val('');
            $('#hdnCoaId_' + values).val('');
            $('#hdnCode_' + values).val('');
            $('#hdnCOAId_' + values).val('');
        }
        //for (var i = SegmentP + 1; i < ArrSegment.length; i++) {
        //    $('#txt_' + values + '_' + i).val('');
        //}
        $('#txt_' + values + '_' + SegmentP).removeAttr('style');
        $('#txt_' + values + '_' + SegmentP).attr('style', 'border-color:#d2d6de;');
        $('#txt_' + values + '_' + SegmentP).removeClass('field-Req');
    }

    if (objDOM) {
        strval = $('#txt_' + values + '_' + SegmentP).val();
        let matching = AtlasUtilities.SEGMENTS_CONFIG.sequence[SegmentP].Accounts.find(function (i) { return i.AccountCode === strval; })
        if (!matching) {
            $('#txt_' + values + '_' + SegmentP).addClass('field-Req');
            $('#txt_' + values + '_' + SegmentP).notify('Invalid Value');
            return;
        } else {
            $('#txt_' + values + '_' + SegmentP).removeClass('field-Req');
        }

        if (matching.Posting === false) {
            $('#txt_' + values + '_' + SegmentP).addClass('field-Req');
            $('#txt_' + values + '_' + SegmentP).notify('Invalid Value');
        } else {
            $('#txt_' + values + '_' + SegmentP).removeClass('field-Req');
        }
    }
}

function IsExistItem(oItemColl, sItem) {
    var isExist = false;
    for (var i = 0; i < oItemColl.length; i++) {
        if (oItemColl[i].TransValue == sItem) {
            isExist = true;
        }
    }

    return isExist
}