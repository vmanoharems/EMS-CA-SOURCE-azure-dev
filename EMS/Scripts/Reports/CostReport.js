
var APIUrlPrintPDF = HOST + "/api/ReportP1/CostReport";
var APIUrlPrintPDFv1 = HOST + "/api/ReportP1/CostReportv1";
var APIUrlFillAccount = HOST + "/api/CRW/GetAccountForCRWFromBudget";
var APIUrlFillLocation = HOST + "/api/CRW/GetLocationForCRWFromBudget";
var APIUrlFillBudgetForCompany = HOST + "/api/CRW/GetBudgetByCompanyForCRW";
var APIUrlCheckSetSegment = HOST + "/api/CRW/CheckForSetSegment";

var heightt;
var GlobalFile;

var CheckLocationStatus = 'NO';
var REv2 = new ReportEngine();

AtlasUtilities.init();

$(document).ready(function () {
    $('#LiCostReport').addClass('active');
    //CheckLocationStatus1();
    heightt = $(window).height();
    heightt = heightt - 180;
    $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
    $('#divPDF').attr('style', 'width:100%;height:' + heightt + 'px;');

    let SegmentJSON = AtlasUtilities.SegmentJSON(
        {
            "Company": {
                fillElement: '#CRFilterCompany'
            }
            , "Location": {
                fillElement: '#CRFilterLocation'
                , ElementGroupID: '#CRFilterLocationGroup'
                , ElementGroupLabelID: '#CRFilterLocationLabel'
            }
            , "Episode": {
                fillElement: '#CRFilterEpisode'
                , ElementGroupID: '#CRFilterEpisodeGroup'
                , ElementGroupLabelID: '#CRFilterEpisodeLabel'
            }
            , "Set": {
                fillElement: '#CRFilterSet'
                , ElementGroupID: '#CRFilterSetGroup'
                , ElementGroupLabelID: '#CRFilterSetLabel'
            }
        }
    );

    REv2.FormRender(SegmentJSON);

    $('#CRFilterAccountFrom').focusin(function () {
        FillDTFrom();
    })
    $('#CRFilterAccountTo').focusin(function () {
        FillDTFrom();
    })

    FillBudgetForCompany('', '', 1);
});

function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}

function GetCRWExport() {
    APIName = '/api/CRWv2/CRWv2GetCRWData';
    let RE = new ReportEngine(APIName);
    RE.ReportTitle = 'Cost Report';
    RE.callingDocumentTitle = 'Reports > Cost Report > Cost Report';
    RE.FormCapture('#tabCostReport');

    let BudgetID = RE.FormJSON.Budget.split(',')[0];
    BudgetID = ((BudgetID === "0") ? -1 : parseInt(BudgetID));
    RE.FormJSON.BudgetID = BudgetID;

    let objExport = {
        "PA": "Header Account"
            , "PN": "Header Description"
            , "AA": "Account"
            , "AN": "Account Description"
            , "AP": "Period Activity"
            , "AT": "Actuals"
            , "APO": "PO Commitments"
            , "TC": "Total Cost"
            , "ETC": "ETC"
            , "EFC": "EFC"
            , "B": "Budget"
            , "V": "Variance"
    };
    if (RE.FormJSON.ShowChangeinVariance === "1") {
        objExport["PV"] = 'Prior Variance';
        objExport["VV"] = 'Variance Change';
    }

    if (RE.FormJSON.isSummary === "1") {
        delete objExport.AA;
        delete objExport.AN;
    }

    RE.setasExport(objExport);
    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });
    return;
}

function PrintCostReport() {
    var Error = '';
    var CO = $('#CRFilterCompany').val();
    var LO = $('#CRFilterLocation').val();
    var Budget = $('#ddlBudget').val() === '-1' ? '0' : $('#ddlBudget').val();

    if (Error === '') {
        var FinalFilter = CO + '|' + LO + '|' + Budget;

        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify({
            ProdID: localStorage.ProdId,
            Filter: FinalFilter,
            ProName: localStorage.ProductionName,
            UserID: localStorage.UserId,
            BudgetID: $('#ddlBudget').val().split(',')[0],
            isSummary: $('#isSummary').prop('checked'),
            noJSON: 0,
            supressZero:0
        });

        APIName = 'APIUrlPrintPDF';
        let RE = new ReportEngine((localStorage.ProdId === '60')? APIUrlPrintPDFv1: APIUrlPrintPDF);
        RE.ReportTitle = 'Cost Report';
        RE.callingDocumentTitle = 'Reports > Cost Report > Cost Report';
        RE.FormCapture('#CostReportdiv');
        RE.FormJSON.ProName = localStorage.ProductionName
        RE.FormJSON.BudgetID = $('#ddlBudget').val().split(',')[0]
        RE.FormJSON.BudgetFileID = $('#ddlBudget').val().split(',')[1]
        RE.FormJSON.CR = JSONParameters.callPayload;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ReportSelection = $('#ReportSelection .active')[0].id
        //RE.FormJSON.ProdId = localStorage.ProdId;
        //RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        return;
    } else {
        alert(Error);
    }
}

function FillBudgetForCompany(LO, EP, Mode) {
    var CompanyCode = $('select#CRFilterCompany option:selected').val();
    if (CompanyCode !== '0') {
        $.ajax({
            url: APIUrlFillBudgetForCompany + '?CompanCode=' + CompanyCode + '&ProdID=' + localStorage.ProdId + '&LO=' + LO + '&EP=' + EP + '&Mode=' + Mode,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            FillBudgetForCompanySucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        });
    } else {
        $('#ddlLocation').empty();
    }
}

function ShowMSG(error) {
    console.log(error);
}

function FillBudgetForCompanySucess(response) {
    if (localStorage.ProdId === '60') {
        let TLength = response.length;
        let str = '';
        if (TLength === 1) {
            $('#ddlBudget').empty();
            for (let i = 0; i < TLength; i++) {
                let Value = response[i].Budgetid + "," + response[i].BudgetFileID;
                $('#ddlBudget').append('<option value=' + Value + '>' + response[i].BudgetName + '</option>');
            }
        } else {
            $('#ddlBudget').empty();
            $('#ddlBudget').append('<option value=0>Select Budget</option>');
            for (let i = 0; i < TLength; i++) {
                let Value = response[i].Budgetid + "," + response[i].BudgetFileID;
                $('#ddlBudget').append('<option value=' + Value + '>' + response[i].BudgetName + '</option>');
            }
        }
    } else {
        let TLength = response.length;
        let str = '';
        if (TLength === 1) {
            $('#ddlBudget').empty();
            for (let i = 0; i < TLength; i++) {
                let Value = response[i].Budgetid;
                $('#ddlBudget').append('<option value=' + Value + '>' + response[i].BudgetName + '</option>');
            }
        } else {
            $('#ddlBudget').empty();
            $('#ddlBudget').append('<option value="-1">Select Budget</option>');
            for (let i = 0; i < TLength; i++) {
                let Value = response[i].Budgetid + "," + response[i].BudgetFileID;
                $('#ddlBudget').append('<option value=' + Value + '>' + response[i].BudgetName + '</option>');
            }
        }
    }
}

$('#ShowChangeNotes').on('click', function () {
    $('#isSummary').prop('disabled', ($(this).prop('checked')));
})

$('#isSummary').on('click', function () {
    $('#ShowChangeNotes').prop('disabled', ($(this).prop('checked')));
})

function ReportSelection(objDOM) {
    let parentli = objDOM.parentElement;
    $(objDOM.parentElement.parentElement).children().each(function () {
        $(this).removeClass('active');

        let filterShow = this.dataset.filterSuppress;
        if (filterShow) $(filterShow).show();
    })

    let filterSuppress = parentli.dataset.filterSuppress;
    $(filterSuppress).hide();

    $(parentli).addClass('active');
}