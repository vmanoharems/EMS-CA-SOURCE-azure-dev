
$(document).ready(function () {

    if (localStorage.PayrollSession === 'YES') {
        
    }
    else {
        window.location = HOST + "/Payroll/PayrollLogin";
        
    }
});

