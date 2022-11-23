"use strict";

var AtlasFormHandler = {
    FormClear: function (objForm) {
        $('#' + objForm.formName + ' *').filter(':input').each(function () {
            $(this).data('value_previous', this.value);
            this.value = '';
        });
    },
    FormPopulate: function (objForm) {
        let formfieldvalue = undefined;
        let formfieldtype = undefined;
        let undefinedasundefined = (objForm.undefinedasundefined) ? true : false;

        $('#' + objForm.formName + ' *').filter(':input').each(function () {
            if (objForm.ResetPreviousValues) {
                $(this).data('value_previous', this.value);
            }
            formfieldtype = typeof objForm.objJSON[this.id];
            formfieldvalue = objForm.objJSON[this.id];
            this.value = (formfieldvalue === undefined && undefinedasundefined === false) ? '' : formfieldvalue;

            $(this).data('value_populated', objForm.objJSON[this.id]);
        });
    }
};


function inheritPrototype(childObject, parentObject) {
    let copyofParent = Object.create(parentObject.$.prototype);
    copyofParent.constructor = childObject;
    childObject.prototype = copyofParent;
}

function AdminSharedDataTable(theDO, theCallParameters, theP) {
    let api = new $.fn.dataTable.Api();

    inheritPrototype(this, api);
    var calcDataTableHeight = function () {
        return parseInt($(window).height() * 0.65);
    };

    var calcNumberofRowsDisplay = function () {
        return parseInt(($(window).height() - 232) / 33); // Window height minus header/overhead and divide it by the row height with some padding 
    };

    this.DataTable = $.fn.dataTable;
    $.extend(true, this.DataTable.Buttons.defaults, {
        dom: {
            button: {
                className: 'btn btn-primary btn-sm'
                , id: 'test'
            }
        }
    });

    this.DomO = (theDO === undefined) ? $('#AdminSharedDataTable') : theDO;
    this.objP = (theP === undefined) ? Object : theP;
    this.CallParameters = (theCallParameters === undefined) ? Object : theCallParameters;
    this.myname = this.DomO.attr('id');
    this.ajaxdatasource = '';
    this.jsondatasource = '';
    this.isjsondatasource = false;
    this.mycolumns = [];
    this.mybuttons = ['copy', 'excel', 'colvis'];

    this.tableHeight = (this.objP.hasOwnProperty('tableHeight') ? this.objP.tableHeight : calcDataTableHeight());
    this.tableRowsperPage = (this.objP.hasOwnProperty('trperPage') ? this.objP.tableRowsperPage : calcNumberofRowsDisplay());
    this.searchableHeader = (theP.searchableheader !== false);// || true; // Default to true
    this.fixedfooternav = false;
    this.ModalDataSet = {};
};

AdminSharedDataTable.prototype = {
    constructor: AdminSharedDataTable,
    setdomObject: function (theDO) { this.theDO = theDO; },
    setParameters: function (theobjParameters) { this.objParameters = theobjParameters; },
    setColumnDefs: function (theColumnJSON) { this.objP.columnDefs = theColumnJSON; },
    setColumnOrder: function (theColumnOrder) { this.objP.columnOrder = theColumnOrder; },
    setCallParameters: function (theJSONParameters) { this.CallParameters; },
    getCallParameters: function () {
        return JSON.stringify(this.CallParameters);
    },
    BuildLink: function (obj/*nTd, sData, oData, iRow, iCol*/) {
        $(obj.nTd)
            .addClass('btn-outline-primary pointer')
            .click(function () {
                $('#exampleModal').modal('show');
                //                alert(obj.URL + '/' + obj.sData);
            }
            );
    },
    RenderModal: function (obj, JSONresponse) {
        AtlasFormHandler.FormClear({ formName: obj.ModalID });
        AtlasFormHandler.FormPopulate({
            formName: obj.ModalID
            , objJSON: JSONresponse.dtData[0]
        })
        ;

        $('#' + obj.ModalID).modal('show');
        this.ModalDataSet = JSONresponse;
        console.log(typeof obj.ModalFunction);
        if (typeof obj.ModalFunction === 'function') {
            console.log(typeof obj.ModalFunction);
            obj.ModalFunction(this.ModalDataSet);
        }
        //console.log(JSONresponse);
        //alert(JSONresponse.dtData[0].JED.length);
    },
    BuildModal: function (obj /* should contain: nTd, sData, oData, iRow, iCol, ModalID, callURL (URL to make ajax call to retrieve data and then render the modal), callParameters*/) {
        $(obj.nTd)
            .addClass('btn-outline-primary pointer')
            .click(function () {
//                console.log(obj.callURL + "?callPayload=" + JSON.stringify(obj.callParameters));

                $.ajax({
                    cache: false,
                    context: this
                    , type: 'POST'
                    , async: false
                    , "url": obj.callURL //+ '?JSONParameters=' + JSON.stringify(obj.callParameters)
                    , data: { callPayload: JSON.stringify( obj.callParameters) }
                    , beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
                    }
                })
                .done(function (response) {
                    this.RenderModal(obj, response);
                })
                .fail(function (error) {
                    this.RenderModal(obj, error);
                    console.log(error);
                    console.log(obj);
                })
                ;
            }.bind(this)
            );
    },
    //    setDomDataTable: function () { this.DomDataTable = this.DomO;},
    BuildDataTable: function (objParams, columnarray) {
        console.log("building Table");
        console.log(objParams);
        console.log(this.DomO);

        if (this.DomO.length) {
            $.extend(true, this.DataTable.ext.classes, {
                sWrapper: "dataTables_wrapper dt-bootstrap",
            });
            if (this.searchableHeader) {
                $('#' + this.myname + ' tfoot th').each(function () {
                    var title = $(this).text();
                    $(this).html('<input class="form-control input-sm" type="text" placeholder="Search ' + title + '" />');
                });
            }

            let ajaxdatasource = '';
            let datasourceverb = "ajax";
            let pagethetable = true;
            let hidefooter = false;
            let fakescrolly = 'fakescrolly'
            let thetabledom = "<'row'<'col-sm-12'><'col-sm-12'>>" +
                    '<"top">rt' +
                    '<"bottom"><"clear">';

            let tableinitcomplete = function (parent) { // filter under the header
                var r = $('#' + parent.nTable.id + ' tfoot tr');
                r.find('th').each(function () {
                    $(this).css('padding', 3);
                });
                $('#' + parent.nTable.id + ' thead').append(r);
                $('#search_0').css('text-align', 'center');
            };

            this.mycolumns = (columnarray === undefined) ? this.mycolumns : columnarray;

            if (objParams.isjsondatasource === true) {
                datasourceverb = "data";
                ajaxdatasource = objParams.jsondatasource;
                pagethetable = false;
                fakescrolly = 'scrollY';
                tableinitcomplete = function (parent) { return false; };
                hidefooter = true;
            } else {
                thetabledom += 'pi';    
                ajaxdatasource = {
                    "url": objParams.ajaxdatasource //+ "?JSONParameters=" + this.getCallParameters()
                    , cache: false
                    , type: 'POST'
                    , data: { "callPayload": this.getCallParameters() }
                    //, contentType: 'application/json'
                    , dataType: "json"
                    , beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
                    }
                }
            }
//            this.ajaxdatasource = (ajaxdatasource === undefined) ? this.ajaxdatasource : ajaxdatasource;

            this.DomODataTable = this.DomO.DataTable({
                dom:thetabledom,
                ServerMethod: "POST",
                sAjaxDataProp: "dtData",
                destroy: true, // Destroy the table for reuse
                lengthChange: true,
                responsive: false,
                deferRender: true,
                //                bFilter: true, not needed. Set to true by default
                pageResize: false,
                fixedHeader: true,
                //                "ajax": ajaxdatasource,
                [datasourceverb]: ajaxdatasource,
                "columns": this.mycolumns,
                columnDefs: this.objP.columnDefs,
                order: this.objP.columnOrder,
                buttons: this.mybuttons,

                paging: pagethetable,
                scrollCollapse: false,
                [fakescrolly]: '50vh',
                iDisplayLength: this.tableRowsperPage,

                initComplete: tableinitcomplete.bind(this)
                //}.bind(this)

            });

            let table = this.DomODataTable;
            // Apply the search
            table.columns().every(function () {
                var that = this;
                $('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });
            });

            var adjustFixedHeaderTimeoutId;
            var adjustFixedHeader = function () {
                if (adjustFixedHeaderTimeoutId) {
                    clearTimeout(adjustFixedHeaderTimeoutId);
                }

                adjustFixedHeaderTimeoutId = setTimeout(function () {
                    table.columns.adjust()
                      .responsive.recalc().fixedHeader.adjust();
                }, 300);
            };

            $('button.sidenav-toggler').on('click', adjustFixedHeader);

            adjustFixedHeader();

            $(window).resize(function () {
                adjustFixedHeader();
            });

            if (this.fixedfooternav && $('#fixedfooter')) {
                //var table = $('#'+this.myname).dataTable();
                //table.buttons().container().detach().prependTo("#title-bar-actions");
                $("#" + this.myname + "_paginate").detach().appendTo('#fixedfooter');
                $("#" + this.myname + "_info").detach().appendTo('#fixedfooter');
            }

            if (hidefooter) {
                $('#' + this.myname + '_wrapper .dataTables_scrollFoot').hide();
            }
        }
    }
};

