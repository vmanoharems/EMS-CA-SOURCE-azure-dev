let getEpisoderes = [];

AtlasBudgetv2 = {
    URL_BUDGETLIST: '/api/Budgetv2/Budgetv2List'
    , URL_BUDGETHISTORY: '/api/Budgetv2/Budgetv2History'
    , URL_BUDGETSAVE: '/api/Budgetv2/Budgetv2Upsert'
    , URL_BUDGETNEWSAVE: '/api/Budgetv2/v2BudgetCRWOperation'
    , BudgetList: {}
    , BudgetSelected: undefined
    , SegmentList: {}
    , CSVasJSON: {}
    , ShowError: AtlasUtilities.ShowError
    , BudgetRender: function (label) {
        label = (label) ? label : 'Select Budget'
        AtlasUtilities.CallAjaxPost(this.URL_BUDGETLIST + '?ProdID=' + localStorage.ProdId, false, this.BudgetRender_Success, AtlasUtilities.ShowError
            , {
                async: false
                , context: AtlasBudgetv2
                , callParameters: {
                    ProdID: localStorage.ProdId
                }
                , HTMLlabel: label
            })
    }
    , BudgetRender_Success: function (response, objParams) {
        let BudgetWord = objParams.HTMLlabel;
        objParams.context.BudgetList = response;
        let ddlBudgetList = $('#ddlBudgetList');
        ddlBudgetList.empty();
        ddlBudgetList.append($("<option/>", { "value": "", "text": BudgetWord }));

        $.each(response, function (key, value) {
            ddlBudgetList.append($("<option/>", {
                "value": value.BudgetID
                , "text": value.BudgetName
            }));
        })
        ;

        if (response.length === 1) {
            if (AtlasCRWv2) {
                $('#ddlBudgetList').val(response[0].BudgetID);
                AtlasCRWv2.BudgetSelect(document.querySelector('#ddlBudgetList'));
            }
        }
    }
    , BudgetHistory: function (selector) {
        AtlasBudgetv2.BudgetHistoryRender(selector.value);
        this.BudgetSelected = this.BudgetList[(selector.selectedIndex - 1)];
        $('#spanBCSelectedBudget').html(this.BudgetSelected.BudgetName + ': ' + this.BudgetSelected.BudgetDescription);
        $('#spanBCSelectedBudget').show();

    }, BudgetHistoryRender: function (BudgetId) {
        AtlasUtilities.CallAjaxPost(this.URL_BUDGETHISTORY + '?ProdID=' + localStorage.ProdId + '&BudgetID=' + BudgetId, false, this.BudgetHistoryRender_Success, AtlasUtilities.ShowError
            , {
                async: false
                , context: AtlasBudgetv2
                , callParameters: {
                    ProdID: localStorage.ProdId
                }
            })
    }, BudgetHistoryRender_Success: function (response, objParams) {
        console.log(response);
        $('#tblBudget').dataTable().fnDestroy();
        $('#tblBudget').DataTable({
            data: response,
            "columns": [
                { "data": "createddate" },
                {
                    "data": "EFCTotal", fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(numeral(oData['EFCTotal']).format('$0,0'));
                    }
                },
                {
                    "data": "BudgetTotal", fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(numeral(oData['BudgetTotal']).format('$0,0'));
                    }
                },
            ]
        })
        console.log(this.URL_BUDGETHISTORY);
        if (response[0].islocked === true) {
            $('#liBudgetUnlock').attr('style', 'border-bottom: 30px solid #dd202a!important');
            $('#liBudgetUnlock a').text('Unlock');
            $('#liBudgetUnlock a').removeAttr('style', 'padding: 0px 8px 0px 8px');
        } else {
            $('#liBudgetUnlock').attr('style', 'border-bottom: 30px solid #327a01!important');
            $('#liBudgetUnlock a').text('Lock');
            $('#liBudgetUnlock a').css('padding-left', '20px');
        }
    }
    , BudgetOperations: function (pMode) {
        popUpMode = pMode;
        if (popUpMode === 'Clone' || popUpMode === 'Create') {
            AtlasUtilities.CheckCOA(AtlasBudgetv2.BO_CheckCOA_Success, AtlasUtilities.ShowError, { "pMode": pMode, context: AtlasUtilities });
            COAAccountString = '';
        } else if (popUpMode === 'Unlock') {
            var BudgetId = $('#ddlBudgetList').val();
            var vdata = {
                BudgetID: $('#ddlBudgetList').val(),
                BudgetName: $("#ddlBudgetList option:selected").text(),
                prodID: localStorage.ProdId,
                UserID: localStorage.UserId,
                Mode: $("#liBudgetUnlock").attr('style') == 'border-bottom: 30px solid #dd202a!important' ? 0 : 1, // Use mode to lock and unlock
                //segmentJSON: $("#liBudgetUnlock").attr('style') == 'border-bottom: 30px solid #dd202a!important' ? 'false' : 'true', // !!!!!!!THIS IS NOT WHAT segmentJSON is supposed to be used for!!!!!!
                isSave: 1,
            };

            AtlasUtilities.CallAjaxPost(
                this.URL_BUDGETNEWSAVE
                , false
                , this.BudgetSave_Success
                , AtlasUtilities.ShowError
                , {
                    async: false
                    , context: AtlasUtilities
                    , callParameters: JSON.stringify(vdata)
                }
            );

            this.BudgetHistoryRender(BudgetId);
            $('#ddlBudgetList').val(BudgetId);
        }
    }
    , BO_CheckCOA_Success: function (response, objParams) {
        if (response === 0) {
            ShowMsgBox('showMSG', 'Please create COA for this production, before building a budget file.', '', 'failuremsg');
            return;
        }
        AtlasUtilities.FetchSegments(AtlasBudgetv2.BO_FetchSegments_Success, AtlasUtilities.ShowError, objParams);
    }
    , BO_FetchSegments_Success: function (response, objParams) {
        let SegmentStrCode = '';
        let TLength = response.length;
        if (TLength > 0) {
            let EndLavel = 'YES';
            //let SegList = '';
            AtlasBudgetv2.SegmentList = response;

            console.log(response);
            $("#tblBudgetSetting thead tr").find("th").remove();
            $("#tblBudgetSetting tbody tr").find("td:gt(0)").remove();
            var tdText = "<td><input id='txtBudgetName' type='text' class='BudgetSetting form-control ' placeholder='Budget Name'/></td>";
            $('#tblBudgetSetting tbody tr').prepend(tdText);
            for (var i = 0; i < TLength; i++) {
                if (EndLavel === 'YES') {
                    if (response[i].Classification === "Company") {
                        var trText = "<th>" + response[i].SegmentCode + "</th>";
                        SegmentStrCode += response[i].SegmentCode + ',';
                        $('#tblBudgetSetting thead tr').append(trText);
                        $('#txtCO').data('segmentJSON_Name', response[i].SegmentCode);
                    } else if (response[i].Classification === "Detail" || response[i].Classification === 'Set') {
                        // Do not display these segments
                    } else {
                        var trText = "<th>" + response[i].SegmentCode + "</th>";
                        SegmentStrCode += response[i].SegmentCode + ',';
                        $('#tblBudgetSetting thead tr').append(trText);
                        var CodeLength = response[i].CodeLength.length;
                        var NameProperty = response[i].Classification + '|' + CodeLength;
                        var tdText = "<td><input id='txt" + response[i].SegmentCode + "' type='text' class='BudgetSetting BudgetSegment form-control width90 " + response[i].Classification + " '" + response[i].SegmentCode + " name='" + NameProperty + "'  onblur = 'javascript:checkSegment(\"" + response[i].Classification + "\" );'  placeholder='" + response[i].SegmentCode + "'/></td>";
                        $('#tblBudgetSetting tbody tr').append(tdText);

                        // Set the data value after it's appended to the DOM
                        $('#txt' + response[i].SegmentCode).data('segmentJSON_Name', response[i].SegmentCode);
                        //SegList += 'txt' + response[i].Classification + '|';
                        let SegmentCode = response[i].SegmentCode;
                        $('#txt' + SegmentCode).focus(function (responseobj, that) {
                            //var strValue = $(this).attr('name');
                            //var arr = strValue.split('|');
                            //var StrName = arr[0];
                            //SegmentClassNme = SegmentCode;
                            AutoFill(responseobj);
                        }.bind(this, response[i]));
                        if (response[i].Classification === "Set") {
                            EndLavel = 'NO';
                        }
                    }
                }
            }
            $(".liComDet").attr('style', 'border-bottom: 30px solid #fff;');
            if (objParams.pMode === 'Clone') {
                $("#fileCSV").hide();
                $("#hdrBudgetPopup").html('Clone Budget <br> <span style="font-size:12px;color:black;"> How should we clone this?</span>');
                $("#liBudgetClone").attr('style', 'border-bottom: 30px solid #5c8fbe;');
            } else if (objParams.pMode === 'Create') {
                $("#fileCSV").show();
                $("#hdrBudgetPopup").html('Create Budget');
                $("#liBudgetCreate").attr('style', 'border-bottom: 30px solid #5c8fbe;');
            }

            $('#tabAccounts').attr('style', 'display:none;');
            $('#tabDetails').attr('style', 'display:none;');
            $('#tabCategories').attr('style', 'display:none;');
            $('#tabSettings').attr('style', 'display:block;');
            $("#btnSaveCSV").html(objParams.pMode);
            showDiv('dvBudgetPopup');
        }
    }
    , BO_FetchSegmentsforSave_Success: function (response, objParams) {
        let segmentJSON = objParams.segmentJSON;
        $('.BudgetSegment').each(
            function (key, obj) {
                if ($(obj).data('segmentJSON') !== undefined) {
                    segmentJSON[$(obj).data('segmentJSON_Name')] = $(obj).data('segmentJSON');
                }
            }
        );
        //        console.log(segmentJSON);
    }
    , BudgetCancel: function () {
        $('#tabDetails').attr('style', 'display:none;');
        hideDiv('dvBudgetPopup');
    }
    , BudgetSave: function () {
        let segmentJSON = {};
        AtlasUtilities.FetchSegments(
            function (response, objParams) {
                AtlasBudgetv2.BO_FetchSegmentsforSave_Success(response, objParams);

                let vdata = {
                    BudgetID: null,
                    BudgetName: $('#txtBudgetName').val(),
                    BudgetDescription: $('#txtBudgetDescription').val(),
                    BudgetType: null, // BudgetType does not need to be passed (popUpMode === 'Clone' ? 'pattern' : 'segment'),//is it correct?
                    BudgetOrigin: (popUpMode === 'Clone' ? AtlasBudgetv2.BudgetSelected.BudgetID : null),
                    segmentJSON: JSON.stringify(segmentJSON),
                    UserID: localStorage.UserId,
                    prodID: localStorage.ProdId,
                    isSave: 0,// in clone or edit it should be 1
                    CRWJSON: JSON.stringify(AtlasBudgetv2.CSVasJSON)
                };

                AtlasUtilities.CallAjaxPost(
                    AtlasBudgetv2.URL_BUDGETNEWSAVE
                    , false
                    , AtlasBudgetv2.BudgetSave_Success
                    , AtlasUtilities.ShowError
                    , {
                        async: false
                        , context: AtlasUtilities
                        , callParameters: JSON.stringify(vdata)
                    }
                );

                //console.log(AtlasBudgetv2.CSVasJSON);
            }
            , AtlasUtilities.ShowError
            , { "segmentJSON": segmentJSON }
        );

    }
    , BudgetSave_Success: function (response, objParams) {
        console.log(response);
        $('#dvBudgetPopup').hide();
        $('#fade').hide();
        ShowMsgBox('showMSG', 'Budget processed successfully!', '', '');
        AtlasBudgetv2.BudgetRender();
    }
    , BudgetSave_CRWEdit: function (AtlasCRWv2_editor) {
        if (!this.BudgetSelected.BudgetID) {
            alert('There is an error with identifying your Budget. Please notify EMS Support');
            return;
        }
        let myE = Object.keys(AtlasCRWv2_editor.MyEdits).reduce(function (r, cv, ci, a) {
            r[cv] = {
                'AA': this[cv].AA
                 , 'ETC': this[cv].ETC
                 , 'EFC': this[cv].EFC
                 , 'B': this[cv].B
                 , 'Notes': (!this[cv].NewNote) ? '' : this[cv].NewNote
            }; return r;
        }.bind(AtlasCRWv2_editor.MyEdits), {});

        let vdata = {
            BudgetID: AtlasBudgetv2.BudgetSelected.BudgetID,
            BudgetName: AtlasBudgetv2.BudgetSelected.BudgetName,
            BudgetDescription: AtlasBudgetv2.BudgetSelected.BudgetDescription,
            BudgetType: null, // BudgetType does not need to be passed (popUpMode === 'Clone' ? 'pattern' : 'segment'),//is it correct?
            BudgetOrigin: null,
            segmentJSON: JSON.stringify(AtlasBudgetv2.BudgetSelected.segmentJSON),
            UserID: localStorage.UserId,
            prodID: localStorage.ProdId,
            isSave: 1,// in clone or edit it should be 1
            Mode: 2, // Set the Mode to 2 since this is a CRW edit
            CRWJSON: JSON.stringify(myE) // AtlasCRWv2.editor.MyEdits should be passed in
        };

        AtlasUtilities.CallAjaxPost(
            this.URL_BUDGETNEWSAVE
            , false
            , this.BudgetSave_CRWEdit_Success
            , function (error) {
                $('#ddlBudgetList').notify("CRW edits NOT saved for " + AtlasBudgetv2.BudgetSelected.BudgetName, 'error', { position: "left" });
                AtlasUtilities.ShowError();
            }
            , {
                async: false
                , context: AtlasUtilities
                , callParameters: JSON.stringify(vdata)
                , 'AtlasCRWv2_editor': AtlasCRWv2_editor
            }
        );
    }
    , BudgetSave_CRWEdit_Success: function (response, objParams) {
        $('#dvBudgetPopup').hide();
        $('#fade').hide();
        $('#ddlBudgetList').notify("CRW edits successfully saved for " + AtlasBudgetv2.BudgetSelected.BudgetName, { position: 'right', className: 'success'});
        $('#CRWv2Save').prop('disabled', true);
        objParams.AtlasCRWv2_editor.Reset({isSave: true});
    }
};


//////////////////////
$(document).ready(function () {
    $("#dvMsgCategory").hide();
    $("#dvMsgAccount").hide();

    if (typeof AtlasCRWv2 === 'undefined') { // Allow the CRWv2 to Render the Budget dropdown itself
        AtlasBudgetv2.BudgetRender();
    }
    $('#txtCO').focus();
});


//-------------------------------Auto Fill Company Code --------------------------
$('#txtCO').focus(function () {
    AtlasUtilities.CallAjaxPost(
        APIUrlFillAccount + '?ProdId=' + localStorage.ProdId + '&Classification=Company'
        , false
        , function (response, objParams) {
            var array = response.error ? [] : $.map(response, function (m) {
                return {
                    value: m.AccountCode,
                    label: m.AccountCode,
                };
            });
            $(".CompanyCode").autocomplete({
                minLength: 0,
                source: array,
                autoFocus: true,
                focus: function (event, ui) {
                    //$("#hdnCO").val(ui.item.value);
                    //$('#txtCO').val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    $("#hdnCO").val(ui.item.value);
                    $('#txtCO').val(ui.item.label);
                    $('#txtCO').data('segmentJSON', ui.item.label);
                    return false;
                },
                change: function (event, ui) {
                    if (!ui.item) {
                        $("#hdnCO").val('');
                        $('#txtCO').val('');
                        $(this).removeData('segmentJSON');
                    }
                }
            })
            ;
        }
        , AtlasUtilities.ShowError
        , {
            async: false
            , context: AtlasBudgetv2
        }
    )
    ;
});
//--------------------------------------------------- CompanyCode   
//--------------------------------------------------- Location/Episode Code   
function AutoFill(objSegment/*SegmentClassification*/) {
    AtlasUtilities.CallAjaxPost(
        APIUrlFillAccount + '?ProdId=' + localStorage.ProdId + '&Classification=' + objSegment.Classification
        , false
        , FillEpiSucess
        , AtlasUtilities.ShowError
        , objSegment
    )
    ;
}

function FillEpiSucess(response, objParams) {
    getEpisoderes = response;

    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.AccountId,
            label: m.AccountCode,
        };
    });
    $('#txt' + objParams.SegmentCode).autocomplete({
        minLength: 0,
        source: array,
        autoFocus: true,
        focus: function (event, ui) {
            event.preventDefault();
            //$(this).val(ui.item.label);
            //return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).data('segmentJSON', ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $(this).removeData('segmentJSON');
            }
        }
    })
}
//--------------------------------------------------- Location/Episode Code
//===============checkEpisode==================
function checkSegment(value) {
    return;
    /*
        var StrCheckValue = $('#txt' + value).val();
        if (StrCheckValue !== '') {
            for (let i = 0; i < getEpisoderes.length; i++) {
                if (getEpisoderes[i].AccountCode === StrCheckValue) {
    
                    $('#txt' + value).val(getEpisoderes[i].AccountCode);
                    break;
                } else {
                    $('#txt' + value).val('');
                }
            }
            for (let i = 0; i < getEpisoderes.length; ++i) {
                if (getEpisoderes[i].AccountCode.substring(0, StrCheckValue.length) === StrCheckValue) {
                    $('#txt' + value).val(getEpisoderes[i].AccountCode);
                    break;
                }
            }
        } else {
            $('#txt' + value).val(getEpisoderes[0].AccountCode);
        }
    */
}


function handleFileSelect(evt) {
    let myJsonString = '';
    let file = evt.target.files[0];
    Papa.parse(file, {
        header: true,
        dynamicTyping: false
        , skipEmptyLines: true
        , complete: function (results) {
            let A_Validdata = [];
            var parsJ = {
                'JsonObj': results.data
            }
            //results.data.splice(results.data.length - 1, 1); <<<< This is what was causing the issue where the last line of a Budget load was not coming in. There is no reason for the splice to be here
            myJsonString = JSON.stringify(results.data).replace(/'/g, "''");
            //            console.log(myJsonString);

            $('#tabCategories').show();
            var strHtml = '';
            $('#tblBudgetCate').html('');

            for (var i = 0; i < results.data.length; i++) {
                let bgstyle = '';
                results.data[i].AccountCode = results.data[i].AccountCode.trim(); // cleanup any whitepace on the AccountCode that could come from a bad CSV file

                if (results.data[i].AccountCode === '' || results.data[i].AccountCode.match(' ')) { // papaparse skipEmptyLines is not working properly
                    bgstyle = 'style="background: orange; border: 1px solid red; color: white; font-weight: bold;"';
                    results.data[i].AccountCode = results.data[i].AccountCode.replace(/ /g, '*');
                } else if (!AtlasUtilities.SEGMENTS_CONFIG.DT[results.data[i].AccountCode]) {
                    bgstyle = 'style="background: red; border: 1px solid red; color: white; font-weight: bold;"';
                } else {
                    A_Validdata.push(results.data[i]);
                }
                strHtml += '<tr>';
                strHtml += '<td></td>';
                strHtml += `<td ${bgstyle}>${results.data[i].AccountCode}</td>`;
                strHtml += '<td>' + results.data[i].Description + '</td>';
                strHtml += '<td>' + numeral(results.data[i].Budget).format(0, 0) + '</td>';
                strHtml += '</tr>';
            }
            $('#tblBudgetCate').html(strHtml);

            AtlasBudgetv2.CSVasJSON = A_Validdata;
        }
    });
}

$("#fileCSV").change(handleFileSelect);

$('#btnSaveCSV').click(function () {
    if ($('#txtBudgetName').val() === '') {
        $('#txtBudgetName').notify('A Budget Name is Required');
    } else if ($('#txtBudgetDescription').val() === '') {
        $('#txtBudgetDescription').notify('A Budget Description is Required');
    } else {
        AtlasBudgetv2.BudgetSave();
    }
});

