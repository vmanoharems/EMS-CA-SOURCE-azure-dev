"use strict";
var G_AtlasConfig;

function AtlasConfig(isReportConfig) {
    if (isReportConfig) {
        let divRD = document.createElement('div');
        divRD.id = 'AtlasConfigDialog'
        divRD.title = 'Report Configuration';
        divRD.className = 'AtlasConfig-Dialog';

        let divSO = document.createElement('div');
        divSO.id = 'AtlasConfig_Segments';
        divSO.className = 'AtlasConfig-Dialog';

        //<input type="button" value="Save" class="btn btn-success pull-right SegmentModel" onclick="AtlasConfig.ConfigSet()" />
        this._ReportDialog = divRD;
        this._ReportSegmentOrder = divSO;
        document.getElementById('app-body').appendChild(divRD);
        document.getElementById('AtlasConfigDialog').appendChild(divSO);
        $("#AtlasConfig_Segments").sortable();
        $("#AtlasConfig_Segments").disableSelection();

        let GI = document.createElement('div')
        GI.id = "AtlasConfig_Icon"
        GI.className = 'AtlasConfig-gear-icon';
        GI.innerHTML = '<i class="fa fa-cog user02"></i>';
        GI.addEventListener('click', this.ConfigReport.bind(this), false);
        this._GearIcon = GI;
    }
}

AtlasConfig.prototype = {
    constructor: AtlasConfig
    , URL_CONFIG_GET: "/api/AtlasUtilities/APIAtlasUtilities_Config"
    , URL_SEGMENT_CONFIG: "/api/AtlasUtilities/AtlasUtilities_SegmentsConfig"
    , URL_CONFIG_SET: "/api/AtlasUtilities/APIAtlasUtilities_Config_Upsert"
    , ContentType: 'application/x-www-form-urlencoded; charset=UTF-8'
    , CURRENT_CONFIG: []
    , _ConfigName: ''
    , _ReportDialog: undefined
    , _ReportSegmentOrder: undefined
    , _GearIcon: undefined
    , _GearIconElement: undefined
    , DisplayGearIcon: function (htmlElement) {
        AtlasConfig._GearIconElement = htmlElement;
        document.getElementById(htmlElement).appendChild(this._GearIcon);
    }
    , ConfigReport: function () {
        this.ConfigGet(this.ConfigName(), this.RenderSegments);
    }
    , ConfigGet: function (theconfig, callback) {
        let objCall = {
            ProdID: localStorage.ProdId
            , UserID: localStorage.UserId
        }
        let IDorName = 'ConfigID'; // Default to using ConfigID

        if (typeof theconfig === 'string') {
            IDorName = 'ConfigName'
        }
        objCall[IDorName] = theconfig;

        let theCall = JSON.stringify(objCall);

        return AtlasUtilities.CallAjaxPost(
            this.URL_CONFIG_GET
            , false
            , this.ConfigGet_Success
            , this.failFunction
            , {
                 contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                 ,callParameters: {
                    callPayload: theCall
                }
                , AtlasConfig_callback: callback
                , AtlasConfigInstance: this
            }
        );
    }
    , Segment_Config_Get: function () {
        let theCall = JSON.stringify(
               {
                   ProdID: localStorage.ProdId
               });
        let objFunctionParameters = {
            contentType: this.ContentType,
            callParameters: {
                callPayload: theCall
            }
        };
        AtlasUtilities.CallAjaxPost(this.URL_SEGMENT_CONFIG, false, this.ConfigGet_Success, this.failFunction, objFunctionParameters);
    }
    , ConfigJSON: function () {
        return JSON.stringify(this.CURRENT_CONFIG);
    }
    , ConfigSet: function () {
        let theUpsertCall = this.ConfigJSON();
        let objFunctionParameters = {
            contentType: this.ContentType,
            callParameters: {
                callPayload: theUpsertCall
            }
            , AtlasConfigInstance: this
        }
        AtlasUtilities.CallAjaxPost(this.URL_CONFIG_SET, false, this.ConfigSet_Success, this.failFunction, objFunctionParameters);
    }
    , ReportConfigSet: function () {
        var segmentArr = [];
        $.each($('#AtlasConfig_Segments li'), function (i, v) {
            var segCodeObj = {
                "SegmentCode": $(v).text(),
                "SegmentOrder": (i + 1)
            };
            segmentArr.push(segCodeObj);
        });
        var segments = JSON.parse(this.CURRENT_CONFIG.ConfigJSON);
        segments.ReportConfig.SegmentOrder = segmentArr;
        this.CURRENT_CONFIG.ConfigJSON = segments;
        this.ConfigSet();
    }
    , ConfigName: function (configName) {
        if (configName) this._ConfigName = configName;
        return this._ConfigName;
    }
    , ConfigSetSuccess: function (func) {
        if (typeof func === 'function') this._ConfigSetSuccess = func;
        return this._ConfigSetSuccess;
    }
    , ConfigGet_Success(response, objP) {
        AtlasConfig.CURRENT_CONFIG = response;
        //console.log(response);
        if (typeof objP.AtlasConfig_callback === 'function') objP.AtlasConfig_callback(response, objP);
    }
    , failFunction(err) {
        AtlasUtilities.HideLoadingAnimation();
        //console.log(err);
        $('#AtlasConfigDialog').dialog('close');
        $(`#${AtlasConfig._GearIconElement}`).notify("Something went wrong please try again.", "error");
    }
    , ConfigSet_Success(response, objFP) {
        AtlasUtilities.HideLoadingAnimation();
        let AtlasConfigInstance = objFP.AtlasConfigInstance;
        console.log(response);
        $(`#${AtlasConfig._GearIconElement}`).notify("Segment order saved successfullly", "success"); // TODO tie to AtlasConfig_Icon
        if (typeof AtlasConfigInstance._ConfigSetSuccess === 'function') AtlasConfigInstance._ConfigSetSuccess(response);
        $('#AtlasConfigDialog').dialog('close');
    }
    , RenderSegments: function (theConfigJSON, objP) {
        $("#AtlasConfigDialog").dialog({
            modal: true
            , buttons: [
                {
                    text: 'Save'
                    , click: function (event) {
                        //AtlasUtilities.ShowLoadingAnimation();
                        objP.AtlasConfigInstance.ReportConfigSet();
                        //AtlasConfig.ConfigSet();
                        $(this).dialog('close');
                    }
                }
            ]
        });

        objP.AtlasConfigInstance.CURRENT_CONFIG = theConfigJSON;
        if (theConfigJSON.length === 0) {
            AtlasUtilities.SEGMENTS_CONFIG.sequence.map(function (element) { }); //TODO
        }
        let SO_LIST = JSON.parse(theConfigJSON.ConfigJSON).ReportConfig.SegmentOrder; //AtlasConfig.CURRENT_CONFIG;
        let bindSegments = '';
        $('#AtlasConfig_Segments').html(bindSegments);
        if (SO_LIST.length > 0) {
            SO_LIST.forEach(function (element) {
                if (element.SegmentCode.toUpperCase() !== 'SET') bindSegments += `<li class="ui-state-default" style="cursor:pointer;"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>${element.SegmentCode}</li>`;
            })
            ;
            $('#AtlasConfig_Segments').html(bindSegments);
        } else {
            console.log(this.DefaultSegmenSequenceArr);
        }
    }
};

$(document).ready(function () {
    G_AtlasConfig = new AtlasConfig();
});
