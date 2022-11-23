"use strict";
var G_objDialogs = {};

$(function () {
    $("#CRWv2Buttons_TransactionsX").click(function () {
        let mytest = $("<div>This is content</div>")
          .dialog({ "title": "My Dialog" })
          .dialogExtend({
              "minimizable": true,
              "dblclick": "maximize",
              "icons": { "minimize": "ui-icon-arrow-4-diag" }
          });
        G_objDialogs[mytest[0].id] = mytest[0];
    });
});

AtlasUtilities.init();

var editor; // use a global for the submit and return data rendering in the examples
var tblID = '#tblCRWv2';
var tableCRW;
//var tableCRW;
$.fn.dataTable.ext.errMode = 'throw';
$.fn.dataTable.Api.register('column().title()', function () {
    var colheader = this.header();
    return $(colheader).text().trim();
});

let AtlasCRWv2 = {
    URL_CRWV2FROMBUDGET: '/API/CRWv2/CRWv2GetCRWData'
    , BudgetID: -1
    , tableCRW: undefined
    , objTable: undefined
    , _initComplete: false
    , _inRowUpdate: false
    , Reset: function () {
        this.tableCRW = undefined;
        this._initComplete = false;
    }
    , editor: {
        parentobject: {}
        , COLUMNS: {
            byTitle: {}
            , bydataSrc: {}
            , CalculatedColumns: {}
        }
        , Reset: function (objOptions) {
            objOptions = (objOptions === undefined) ? {} : objOptions;
            if (objOptions.isSave) { // This is being called from the BudgetSave_CRWEdit Success, so we need to save our cached note edits
                Object.keys(AtlasCRWv2.editor.MyEdits).forEach(function (AccountCode, i) {
                    AtlasCRWv2.Notes.UpdateNoteinArray(AccountCode, true);
                });
            }
            this.MyEdits = {};
            this.MyEdits_Originals = {};
            this.EditedNotesFor = {};
            $(this).each(function (index, element) {
                //console.log(index);
                //console.log(element);
            });
            $('#CRWv2Save').prop('disabled', true);
        }
        , table: {
            TOTALS: {
                children: {}
            }
        }
        , MyEdits: {}
        , MyEdits_Originals: {}
        , EditedNotesFor: {}
        , inedit: undefined
        , infocus: undefined
        , AddCalculatedColumn: function (nTd, sData, oData, iRow, iCol, continuous) {
            this.COLUMNS.CalculatedColumns[iCol] = true;
        }
        , AddRow: function (nTd, sData, oData, iRow, iCol) {
            if (sData === 'TOTALS') { // This means that we're adding the footer row
                $(nTd)
                    .addClass('TOTALS')
                ;
                this.table.TOTALS.rowdata = oData;
                this.table.TOTALS.tr = $(nTd.parentElement);

                //let thetableref = this.table[oData.PA].children; // pickup the parent editor item
                //thetableref[sData] = oData; // Set the editor.table row
            } else if (sData === oData.PA) { // Parent Account
                this.table[sData] = {
                    children: {}
                }; // Start the table hierarchy
                let sDatatable = this.table[sData];
                //sDatatable.children = {}; // Start the table hierarchy
                sDatatable.tr = $(nTd.parentElement); // Store the tr for the Header so that we can quickly reference it later
                sDatatable.rowdata = oData; // Store the tr for the Header so that we can quickly reference it later

                $(nTd.parentElement)
                    .addClass('HEADER')
                    .addClass(sData + '_HEADER')
                ;

                let thetableref = this.table.TOTALS.children; // pickup the parent editor item
                thetableref[sData] = oData; // Set the editor.table row
            } else { // Detail Account
                $(nTd.parentElement)
                    .addClass('DETAIL')
                    .addClass(oData.PA + '_DETAIL')
                    .data('HEADER', oData.PA);
                ;
                if (this.table[oData.PA]) {
                    let thetableref = this.table[oData.PA].children; // pickup the parent editor item
                    thetableref[sData] = oData; // Set the editor.table row
                }
            }

        }
        , SummaryCalculate: function (objScope) {
            let thescope = (objScope === undefined) ? this.table : objScope;
            this.parent.editor.summaryscope = thescope;
            this.parent._inRowUpdate = true;
            //console.log(thescope);

            //return;

            $.each(thescope, function (index, value) {
                //console.log(value);
                $.each(this.COLUMNS.CalculatedColumns, function (colindex, colvalue) {
                    if (colvalue && this.thescope[this.scopeindex].rowdata) {
                        this.thescope[this.scopeindex].rowdata[this.editor.COLUMNS[colindex].dataSrc] = 0; // Set the Header value to 0
                    }
                }.bind(
                    {
                        editor: this
                        , thescope: thescope
                        , scopeindex: index
                        , scopevalue: value
                    }
                ));

                $.each(value.children, function (trindex, trvalue) { // For each detail account under the header, add the value to the header value for the calculated columns
                    $.each(this.editor.COLUMNS.CalculatedColumns, function (colindex, colvalue) {
                        if (colvalue && this.thescope[this.scopeindex].rowdata) {
                            this.thescope[this.scopeindex].rowdata[this.editor.COLUMNS[colindex].dataSrc] += numeral(trvalue[this.editor.COLUMNS[colindex].dataSrc]).value(); // Set the Header value to 0
                        }
                    }.bind(
                        {
                            editor: this.editor
                            , thescope: thescope
                            , scopeindex: index
                            , scopevalue: value
                            , trindex: trindex
                            , trvalue: trvalue
                        }
                    ));
                }.bind(
                    {
                        editor: this
                        , thescope: thescope
                        , scopeindex: index
                        , scopevalue: value
                    }
                ));

                //setTimeout(function () {
                //    AtlasCRWv2.tableCRW.row('#' + this).invalidate().draw(); // redraw each Header Row
                //}.bind(index), 10);

            }.bind(this));

            if (Object.keys(thescope).length === 1) {
                AtlasCRWv2.tableCRW.rows().invalidate();
            }
        }
        , EditCell: function (e, datatable, key, cell, originalEvent) {
            let thecell = cell;
            //datatable.keys.disable();
            let therowdata = thecell.row(thecell.index().row).data(); //
            if (therowdata.AA === therowdata.PA) {
                cell.keys.enable();
                return; // Do nothing when it's a Header account
            }

            if (this.infocus !== cell) {
                this.inedit = this.infocus;
                thecell = this.infocus;
            } else {
                this.inedit = thecell.index();
            }

            let therow = thecell.index().row; //cell.index().row;
            let thecolumn = AtlasCRWv2.editor.COLUMNS[thecell.index().column];
            let MyEditsIndex = therowdata[AtlasCRWv2.tableCRW.settings()[0].rowId]; // Use the rowId from the datatables object

            let HTMLelementID = thecolumn.title + '_' + MyEditsIndex;
            this.inedit.HTMLelementID = HTMLelementID;
            this.inedit.datatable = datatable; // Place the whole datatable into the inedit sub object
            this.inedit.thecell = thecell;
            this.inedit.therowdata = therowdata;
            this.inedit.thecolumn = thecolumn;

            if (this.MyEdits[MyEditsIndex] === undefined) {
                this.MyEdits[MyEditsIndex] = {};
                this.MyEdits_Originals[MyEditsIndex] = Object.assign({}, thecell.row(thecell.index().row).data());
            }

            let myEdit = thecell.row(thecell.index().row).data(); //Object.assign({}, thecell.row(thecell.index().row).data());
            myEdit.NewNote = '';
            this.MyEdits[MyEditsIndex] = myEdit;

            $(tblID + ' tr#' + MyEditsIndex + ' td')[thecolumn.index].innerHTML = '<div class="DTE DTE_Inline">'
                + '<div class="DTE_Inline_Field">'
                + '<div class="DTE_Field DTE_Field_Type_text">'
                + '<input type="text" class="DTE_Field_InputControl" id="' + HTMLelementID + '" value="' + therowdata[thecolumn.dataSrc] + '" tabindex="-1">'
                + '</div></div></div>'
            ;
            $('#' + HTMLelementID).inputmask('numeric', {
                radixPoint: ".",
                groupSeparator: ",",
                digits: 0,
                autoGroup: true,
                prefix: '$',
                rightAlign: false,
                oncleared: function () { this.value = ''; }
            });
            $('#' + HTMLelementID).data('data_original', thecell.data());
            $('#' + HTMLelementID).data('MyEditsIndex', MyEditsIndex);
            $('#' + HTMLelementID).data('MyEditsOBJ', thecolumn);

            $('#' + HTMLelementID).data('CRWv2OBJ', {
                "data_original": thecell.data()
                , "MyEditsIndex": MyEditsIndex
                , "thecolumn": thecolumn
            });

            $('#' + HTMLelementID).on('blur', function (event) {
                AtlasCRWv2.editor.EditCell_Commit(this);
            });
            $('#' + HTMLelementID).on('keydown', function (event) {
                if (event.key === 'Tab' || event.key === 'Enter') {
                    AtlasCRWv2.editor.EditCell_Commit(this);
                }
            });

            if (key === 13 || key === 113) { // If it's a number, we're going to fill the value of the text element with the keypress. Otherwise, we just select the value
                $('#' + HTMLelementID).select();
            } else {
                $('#' + HTMLelementID).val('');
                $('#' + HTMLelementID).focus();
            }
            $('#CRWv2Save').prop('disabled', false);
        }
        , RowRecalculate: function () {
            let therowdata = AtlasCRWv2.editor.inedit.therowdata;
            let CbyT = AtlasCRWv2.editor.COLUMNS.byTitle;
            let rowref = $(tblID + ' tr#' + therowdata.AA + ' td');

            if (rowref[CbyT.ETC.index].innerHTML) {
                try {
                    rowref[CbyT.ETC.index].innerHTML = numeral(therowdata.ETC).format('$0,0');
                } catch (e) { /*console.log(e);*/ }
            }
            if (rowref[CbyT.EFC.index].innerHTML) {
                try {
                    rowref[CbyT.EFC.index].innerHTML = numeral(therowdata.EFC).format('$0,0');
                } catch (e) { /*console.log(e);*/ }
            }
            if (rowref[CbyT.Budget.index].innerHTML) {
                try {
                    rowref[CbyT.Budget.index].innerHTML = numeral(therowdata.B).format('$0,0');
                } catch (e) { /*console.log(e);*/ }
            }
            rowref[CbyT.Variance.index].innerHTML = numeral(therowdata.V).format('$0,0');
            let parentidverb = therowdata.PA
            //console.log(therowdata.V);
            this.SummaryCalculate({
                [parentidverb]: this.table[therowdata.PA]
            });
            this.parentobject.FooterCalculate();

        }
        , EditCell_Commit: function (that) {
            if (AtlasCRWv2.editor.inedit) {
                try {
                    if (numeral(that.value).value() < 0) {
                        $(that).closest('td').addClass('ETCnegative');
                    } else {
                        $(that).closest('td').removeClass('ETCnegative');
                    }
                } catch (e) { }

                that = (that === undefined) ? $('#' + AtlasCRWv2.editor.inedit.HTMLelementID)[0] : that;

                let thecolumn = $(that).data('CRWv2OBJ').thecolumn;
                let therowdata = AtlasCRWv2.editor.inedit.therowdata;
                let thatvalue = numeral(that.value).value(); // make a copy of the value because we're about to destory the dom element

                therowdata[thecolumn.dataSrc] = thatvalue;
                switch (thecolumn.dataSrc) {
                    case 'ETC':
                        //therowdata.ETC = thatvalue;
                        therowdata.EFC = numeral(therowdata.TC).value() + thatvalue;
                        //therowdata.V = numeral(therowdata.B).value() - therowdata.EFC;
                        break;
                    case 'EFC':
                        //therowdata.EFC = thatvalue;
                        therowdata.ETC = thatvalue - numeral(therowdata.TC).value();
                        //therowdata.V = numeral(therowdata.B).value() - therowdata.EFC;
                        break;
                    case 'Budget':
                        break;
                }
                therowdata.V = numeral(therowdata.B).value() - therowdata.EFC;
                AtlasCRWv2.editor.RowRecalculate();

                let CRWv2OBJ = $(that).data('CRWv2OBJ');

                let data_o = numeral(CRWv2OBJ.data_original).value(); //$(this).data('data_original');
                let data_this = numeral(that.value).value();
                let MyEditsIndex = CRWv2OBJ.MyEditsIndex; //$(this).data('MyEditsIndex');

                if (data_this !== data_o) {
                    //let MyEditsOBJ = CRWv2OBJ.thecolumn; // $(this).data('MyEditsOBJ').dataSrc;
                    AtlasCRWv2.editor.MyEdits[MyEditsIndex][CRWv2OBJ.thecolumn.dataSrc] = data_this;
                    //console.log($(tblID + ' tr#' + MyEditsIndex + ' td')[CRWv2OBJ.thecolumn.index].innerHTML);
                    //console.log(that.value);
                }

                // Reset the text entry to plain text and enable the keytable again
                if (AtlasCRWv2.editor.inedit) { // Yes, we've already checked this. Yes, there is a bug in datatables requiring us to checkit again
                    if (AtlasCRWv2.editor.inedit.datatable) {
                        AtlasCRWv2.editor.inedit.datatable.keys.enable();
                        //AtlasCRWv2.editor.inedit.cell.focus();
                        AtlasCRWv2.editor.inedit = undefined; // Reset the edit
                    }
                }
            }

        }
    }
    , initComplete: function () {
        this.editor.parentobject = this;
        this._initComplete = true;

        let that = this;
        this.editor.parent = that;

        setTimeout(function () {
            this.editor.SummaryCalculate();
            AtlasCRWv2.tableCRW.rows().invalidate();
            this._inRowUpdate = false;
            this.FooterCalculate();
        }.bind(this)
        , 500
        );

        this.objTable = $(tblID);
        $('#CRWv2Buttons_ExpandAll').prop('disabled', false);
        $('#CRWv2Buttons_CollapseAll').prop('disabled', false);
        AtlasUtilities.HideLoadingAnimation();

    }
    , FooterCalculate: function (row, data, start, end, display) {
        if (this._initComplete) { // && !this._inRowUpdate) { // We have initialized the table
            $.each(this.editor.COLUMNS.CalculatedColumns, function (index, value) {
                let thesum = $.map(
                    this.editor.table.TOTALS.children
                    , function (m) {
                        return m[AtlasCRWv2.editor.COLUMNS[index].dataSrc]
                    })
                    .reduce(function (a, b) {
                        return a + b;
                    })
                ;

                $(this.tableCRW.column(index).footer()).html(numeral(thesum).format('$0,0'));
            }.bind(this)
            );
        }
        //AtlasUtilities.HideLoadingAnimation();
    }
    , RenderCRWv2: function () {
        this.Reset();
        this.editor.Reset(); // Reset the editor
        setTimeout(
            AtlasUtilities.ShowLoadingAnimation()
        , 100);
        let keycolumns = [6, 7];
        if (AtlasBudgetv2.BudgetSelected) {
            keycolumns = (AtlasBudgetv2.BudgetSelected.islocked) ? [6, 7] : [6, 7, 8];
        }

        tableCRW = $(tblID).DataTable({
            dom: "Bfrtip",
            destroy: true,
            ServerMethod: "POST",
            sAjaxDataProp: "dtData",
            //lengthChange: true,
            //responsive: false,
            deferRender: true,
            pageResize: true
            , paging: false
            , scrollY: 580
            , scrollX: true

            , "autoWidth": false

            //fixedHeader: true,
            , rowId: 'AA'
            , ajax:
                {
                    "url": this.URL_CRWV2FROMBUDGET
                    , cache: false
                    , type: 'POST'
                    , data: this.getCallParameters()
                    , dataType: "json"
                    , beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                    }
                }
            , columns: [
                //{ data: "PA" },
                //{ data: "PN" },
                {
                    data: 'AA', fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddRow(nTd, sData, oData, iRow, iCol);
                    }.bind(AtlasCRWv2)
                }
                , { data: 'AN' }
                , {
                    data: 'AP'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, false);
                    }.bind(AtlasCRWv2)
                    , render: $.fn.dataTable.render.number(',', '.', 0, '$')
                }
                , {
                    data: 'AT'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, false);
                    }.bind(AtlasCRWv2)
                    , render: $.fn.dataTable.render.number(',', '.', 0, '$')
                }
                , {
                    data: 'APO'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, false);
                    }.bind(AtlasCRWv2)
                    , render: $.fn.dataTable.render.number(',', '.', 0, '$')
                }
                , {
                    data: 'TC'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, false);
                    }.bind(AtlasCRWv2)
                    , render: $.fn.dataTable.render.number(',', '.', 0, '$')
                }
                , {
                    data: 'ETC'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, true);
                    }.bind(AtlasCRWv2)
                    , render: $.fn.dataTable.render.number(',', '.', 0, '$')
                }
                , {
                    data: 'EFC'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, true);
                    }.bind(AtlasCRWv2)
                    , render: $.fn.dataTable.render.number(',', '.', 0, '$')
                }
                , {
                    data: 'B'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, true);
                    }.bind(AtlasCRWv2)
                    , render: $.fn.dataTable.render.number(',', '.', 0, '$')
                }
                , {
                    data: 'V'
                    , fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        this.editor.AddCalculatedColumn(nTd, sData, oData, iRow, iCol, true);
                    }.bind(AtlasCRWv2)
                    , render: function (data, type, row, meta) {
                        let iconcolor = (row.Notes) ? 'red' : '#5C8FBE';
                        let ret = `${numeral(data).format('$0,0')}`;
                        ret += (AtlasCRWv2.BudgetID === -1 || row.AA === row.PA) ? '': `<a style="float:right;" href="javascript:null" onclick="AtlasCRWv2.Notes.GetNotes('${row.AA}', ${meta.row});"><i id="notesicon_${meta.row}" class="fa fa-pencil-square-o" style="color:${iconcolor};"></i></a>`;
                        return ret;
                    }
                    //$.fn.dataTable.render.number(',', '.', 0, '$')
                }
            ],
            keys: {
                columns: keycolumns
                , focus: ':eq(7)'
                , blurable: true
            },
            select: {
                style: 'os',
                selector: 'td:first-child'
            },
            orderFixed: [[0, 'asc']]
            , "language": {
                "emptyTable": "Processing your data..."
            }
            , "initComplete": function (settings, json) {
                // Add the CRW Footer
                //var rowHtml = $("#tblCRWv2_FOOTER").find("tr")[0].outerHTML;
                //tableCRW.row.add($(rowHtml)).draw();
                this.initComplete();
            }.bind(AtlasCRWv2)
            , "footerCallback": function (row, data, start, end, display) {
                this.FooterCalculate(row, data, start, end, display);
            }.bind(AtlasCRWv2)
            , "createdRow": function (row, data, index) {
                if (data.ETC < 0) {
                    $('td', row).eq(6).addClass('ETCnegative');
                }
            }
        })
        ;

        this.tableCRW = tableCRW;
        $.each(this.tableCRW.columns()[0], function (key, value) {
            AtlasCRWv2.editor.COLUMNS[key] = {};
            let AC = AtlasCRWv2.editor.COLUMNS[key];
            let CV = AtlasCRWv2.tableCRW.column(value);
            AC.index = key;
            AC.title = CV.title();
            AC.dataSrc = CV.dataSrc();

            AtlasCRWv2.editor.COLUMNS.byTitle[AC.title] = AC; // Do the columns by title for easy reference later
            AtlasCRWv2.editor.COLUMNS.bydataSrc[AC.dataSrc] = AC; // Do the columns by title for easy reference later
        });

    }
    , Notes: {
        NotesDialog: undefined
        , RawNotestoArray: function (A_rawNotes, A_, theEdits) {
            A_rawNotes.forEach((e, i) => {
                let note = (typeof e === 'object') ? e : JSON.parse(e); //The raw notes will be strings. If it's an edit, we've modified the values previously and everything is an object
                let noteN = '';
                //(note.N === undefined) ? '' : note.N;
                if (note.D === 'NEW') {
                    noteN = theEdits.NewNote;
                } else {
                    noteN = note.N || ''; // In case this is an edit made prior to notes
                }
                AtlasCRWv2.Notes.AddNotetoArray(A_, note, noteN);
            });
        }
        , AddNotetoArray: function (A_, objNote, newNote) {
            A_.push({
                'UID': objNote.UID
                , 'UE': objNote.UE || '' // For notes proir to loging email
                , 'CP': (objNote.CP === undefined) ? '' : objNote.CP
                //, 'D': { 'display': dateFormat(new Date(note.D.display||note.D), 'yyyy-mm-dd HH:MM:ss'), 'sort': dateFormat(new Date(note.D.sort||note.D), 'yyyy-mm-dd HH:MM:ss') }
                , 'D': objNote.D
                , 'EC': objNote.EC
                , 'EU': objNote.EU
                , 'BC': objNote.BC
                , 'BU': objNote.BU
                , 'N': newNote || ''
            });
        }
        , UpdateNoteinArray: function (AccountCode, isSave) {
            let theEdits = AtlasCRWv2.editor.EditedNotesFor[AccountCode];
            let A_Notes = JSON.parse(theEdits.rowdata.Notes).Edits;
            A_Notes.forEach((e, i) => {
                if (e.D === 'NEW') {
                    e.N = theEdits.NewNote;
                    if (isSave) e.D = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                }
            })
            if (isSave) {
                theEdits.rowdata.Notes = AtlasCRWv2.Notes.ArraytoRawNotes(A_Notes);
                delete theEdits.NewNote;
                delete theEdits.rowdata;
            }
            return A_Notes;
        }
        , RenderNotesDataTable: function (A_Data, columns, AccountCode) {
            return $('#tblNotesList').DataTable({
                destroy: true,
                paging: false,
                info: false,
                searching: false,
                fixedHeader: true,
                "language": {
                    emptyTable: `There are no notes for ${AccountCode}`
                },
                data: A_Data
                , columns: columns
                , columnDefs: [
                    { orderable: false, targets: '_all' },
                    { width: 200, targets: 4 },
                    { width: 80, targets: [2, 3] }
                ]
                , createdRow: function (row, data, dataIndex) {
                    console.log(row, data, dataIndex);
                    if (data.D === 'NEW') $(row).addClass('CRWChangeNoteNew');
                }
                , order: [[1, 'desc']]
            });
        }
        , ArraytoRawNotes: function (A_) {
            return JSON.stringify({
                Edits: A_
            });
        }
        , GetNotes: function (AccountCode, row) {
            AtlasCRWv2.Notes.NotesDialog = {};
            let rowdata = tableCRW.row(row).data();
            let orgdata = AtlasCRWv2.editor.MyEdits_Originals[AccountCode] || {};
            AtlasCRWv2.editor.EditedNotesFor[AccountCode] = AtlasCRWv2.editor.MyEdits[AccountCode] || {}; // declare as var because it has to be used on button click
            let theEdits = AtlasCRWv2.editor.EditedNotesFor[AccountCode];
            theEdits.NewNote = (!theEdits.NewNote)? '': theEdits.NewNote;
            theEdits.rowdata = rowdata;
            let A_Edits = (rowdata.Notes) ? JSON.parse(rowdata.Notes).Edits : [];

            let A_Data = [];
            if (theEdits.AA === AccountCode) {
                if (!theEdits.NotesAddedtoCache) {
                    AtlasCRWv2.Notes.AddNotetoArray(A_Data, {
                        UID: localStorage.UserId
                        , UE: localStorage.Email
                        , CP: ''
                        //, D: dateFormat(new Date(), 'mm/dd/yyyy hh:mm TT')
                        //, D: { 'display': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'), 'sort': 'NEW' }
                        , D: 'NEW'
                        , EC: orgdata.EFC
                        , EU: theEdits.EFC
                        , BC: orgdata.B
                        , BU: theEdits.B
                        , N: theEdits.Notes
                    }, theEdits.NewNote)
                    ;
                theEdits.NotesAddedtoCache = true;
                }
            }

            this.RawNotestoArray(A_Edits, A_Data, theEdits);
            rowdata.Notes = AtlasCRWv2.Notes.ArraytoRawNotes(A_Data);

            let myA = [
                { data: 'UE', title: 'User' }
                //, { data: 'CP', title: 'Period' }
                //, { data: 'D', title: 'Date', render: { _: 'display', sort: 'sort' } }
                , { data: 'D', title: 'Date' }
                , { data: 'EC', title: 'Prior EFC', render: $.fn.dataTable.render.number(',', '.', 0, '$') }
                , { data: 'EU', title: 'Updated', render: $.fn.dataTable.render.number(',', '.', 0, '$') }
                , { data: 'N', title: 'Note' }
            ];


            let DOMDT = document.createElement('table');
            DOMDT.id = 'tblNotesList';
            $('#dialog-notes')[0].appendChild(DOMDT);

            $('#dialog-notes').dialog({
                width: 800
                , height: 400
                , modal: true
                , title: `Change Notes for ${AccountCode} (${rowdata.AN})`
                , close: function () {
                    // House cleaning
                    $('#dialog-notes-button-save').off('click');
                    $('#tblNotesList').remove();
                    $('#tblNotesList_wrapper').remove();

                    if (AtlasCRWv2.Notes.NotesDialog.CellFocus) AtlasCRWv2.Notes.NotesDialog.CellFocus.keys.enable();
                    AtlasCRWv2.Notes.NotesDialog = undefined;
                }
            });

            let myDT = AtlasCRWv2.Notes.RenderNotesDataTable(A_Data, myA, AccountCode);

            $('#dialog-notes-new-note').inputFilter(function (value) {
                return /^[ \d,a-z,A-Z\.\!\?\@\#\$\%\&\*\=\+\'\"]*$/.test(value);
            });

            if (theEdits.AA === AccountCode) {
                let buttoncaption = (theEdits.NewNote) ? 'Update Note' : 'Add Note';
                $('#dialog-notes-new-note')
                    .prop('placeholder', '')
                    .prop('disabled', false)
                    .val(theEdits.NewNote)
                    .focus()
                ;

                $('#dialog-notes-button-save')
                    .show()
                    .text(buttoncaption)
                    .prop('disabled', false)
                    .on('click', function () {
                        //console.log(myDT);
                        $('#dialog-notes-new-note').notify('This Note will only be saved when you save the CRW.\nIf you add this note without saving the CRW, this note will not be saved');
                        theEdits.NewNote = $('#dialog-notes-new-note').val();
                        myDT.cell(0, 4).data(theEdits.NewNote);
                        this.textContent = 'Update Note';
                        $(`#notesicon_${row}`).css('color', 'red');
                        let A_Edits = AtlasCRWv2.Notes.UpdateNoteinArray(AccountCode, false);
                        rowdata.Notes = AtlasCRWv2.Notes.ArraytoRawNotes(A_Edits);
                    });
            } else {
                $('#dialog-notes-button-save')
                    .prop('disabled', true)
                    .text('Add Note')
                    .hide();
                ;
                $('#dialog-notes-new-note')
                    .prop('placeholder', 'This account must be edited before you can add a note.')
                    .prop('disabled', true)
                    .val('')
                    .focus()
                ;
            }
        }
    }
    , BudgetSelect: function (theElement) {
        AtlasUtilities.ShowLoadingAnimation();
        this.BudgetID = theElement.value || -1;
        if (Object.keys(this.editor.MyEdits).length !== 0) {
            let confirmation = confirm('You have unsaved edits! Click Ok to save your changes or Cancel to ignore your changes. Either way, you will continue to your destination.');
            if (confirmation === true) {
                AtlasBudgetv2.BudgetSave_CRWEdit(this.editor);
            } else {
                //alert('not saving');
            }
        }

        if (this.BudgetID !== -1) {
            AtlasBudgetv2.BudgetSelected = AtlasBudgetv2.BudgetList[(theElement.selectedIndex - 1)]
        }
        this.RenderCRWv2();
        //this.editor.SummaryCalculate();
    }
    , BudgetSelect_Success: function (response, objParams) {
        console.log(response);
    }
    , getCallParameters: function () {
        return {
            callPayload:
                JSON.stringify({
                    "ProdID": localStorage.ProdId
                , "BudgetID": this.BudgetID // this.BudgetID defaults to -1 (consolidated CRW)
                })
        }
    }
    , ToggleChildren(objtr) {
        let tr = $(objtr).closest('tr');
        let childhidden = tr.hasClass('childhidden');
        let isHeader = tr.hasClass('HEADER');

        if (childhidden && isHeader) {
            tr.removeClass('childhidden');
            $(tblID + ' .' + tr.prop('id') + '_DETAIL').each(function (key, value) { $(value).removeClass('hidden'); });
        } else if (isHeader) {
            tr.addClass('childhidden');
            $(tblID + ' .' + tr.prop('id') + '_DETAIL').each(function (key, value) { $(value).addClass('hidden'); });
        }
    }
    , ToggleChildren_All(isExpand) {
        let list = undefined;
        let objCRW = this;
        if (isExpand) {
            list = $('#' + this.objTable.prop('id') + ' tr.childhidden');
        } else {
            list = $('#' + this.objTable.prop('id') + ' tr.HEADER:not(.childhidden)');
        }
        $.each(list, function (key, value) {
            objCRW.ToggleChildren(value);
        })
        ;
    }
}
;

$(document).ready(function () {
    AtlasCRWv2.RenderCRWv2();
    AtlasCRWv2.tableCRW
        .on('key', function (e, datatable, key, cell, originalEvent) {
            if (AtlasCRWv2.Notes.NotesDialog) {
                AtlasCRWv2.Notes.NotesDialog.CellFocus = cell;
                cell.keys.disable();
                e.preventDefault();
                $('#dialog-notes-new-note').focus();
                return;
            };
            let thecellindexrow = cell.index().row;
            let thecellindexcolumn = cell.index().column;
            let thecelldata = cell.row(thecellindexrow).data()

            if (AtlasCRWv2.BudgetID !== -1) {
                if (AtlasBudgetv2.BudgetSelected.islocked && thecellindexcolumn === 8) { // Budget columnis index of 8 (base 0)
                    $('#ddlBudgetList').notify('This Budget is locked.')
                    e.preventDefault();
                    return;
                }

                if (thecelldata.AA === thecelldata.PA) {
                    $(tblID + ' tr#' + thecelldata.PA)
                        .notify('This is a header account. You cannot modify this data directly!');
                    e.preventDefault();
                    return;
                }

                if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 13 || key === 113) { // numeric or the enter key or F2. Either way, go into edit mode
                    if (!AtlasCRWv2.editor.inedit) {
                        if (key !== 13) {
                            cell.keys.disable();
                        }
                        AtlasCRWv2.editor.EditCell(e, datatable, key, cell, originalEvent);
                    }
                }
            } else {
                $('#ddlBudgetList').notify('You are currently viewing the consolidated CRW. \nYou must select a Budget before you can make any edits.')
            }
        })
        .on('key-blur', function (e, datatable, cell) {
            if (AtlasCRWv2.Notes.NotesDialog) {
                AtlasCRWv2.Notes.NotesDialog.CellFocus = cell;
                cell.keys.disable();
                e.preventDefault();
                $('#dialog-notes-new-note').focus();
                return;
            };
            if (AtlasCRWv2.editor.inedit) {
                //AtlasCRWv2.editor.inedit.cell.keys.disable();
                //AtlasCRWv2.editor.inedit.cell.focus();
                //cell.keys.disable();

                //AtlasCRWv2.editor.EditCell_Commit();
                //console.log(cell.index());
            }
        })
        .on('key-focus', function (e, datatable, cell, originalEvent) {
            if (AtlasCRWv2.Notes.NotesDialog) {
                AtlasCRWv2.Notes.NotesDialog.CellFocus = cell;
                cell.keys.disable();
                e.preventDefault();
                $('#dialog-notes-new-note').focus();
                return;
            };

            //if (AtlasCRWv2.BudgetID !== -1) {
            AtlasCRWv2.editor.infocus = cell;
            //console.log('focus');
            //console.log(AtlasCRWv2.editor.infocus);
            //}
        })
        .on('click', 'tr', function () {
            AtlasCRWv2.ToggleChildren(this);
        })
        //.on('select deselect', function (e, dt, type, indexes) {
        //    $('#trSummary').removeClass('hidden');
        //    let Summary = AtlasCRWv2.tableCRW.rows('.selected').data().reduce(function (e, i) {
        //        //console.log(i)
        //        e.AP = ((e.AP === undefined) ? 0 : e.AP) + i.AP;
        //        e.APO = ((e.APO === undefined) ? 0 : e.APO) + i.APO;
        //        e.AT = ((e.AT === undefined) ? 0 : e.AT) + i.AT;
        //        e.B = ((e.B === undefined) ? 0 : e.B) + i.B;
        //        e.EFC = ((e.EFC === undefined) ? 0 : e.EFC) + i.EFC;
        //        e.ETC = ((e.ETC === undefined) ? 0 : e.ETC) + i.ETC;
        //        e.TC = ((e.TC === undefined) ? 0 : e.TC) + i.TC;
        //        e.V = ((e.V === undefined) ? 0 : e.V) + i.V;
        //        return e;
        //    }, {});
        //    //console.log(Summary);
        //    $('tr:eq(1) th:eq(2)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.AP).format('$0,0'));
        //    $('tr:eq(1) th:eq(3)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.AT).format('$0,0'));
        //    $('tr:eq(1) th:eq(4)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.APO).format('$0,0'));
        //    $('tr:eq(1) th:eq(5)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.TC).format('$0,0'));
        //    $('tr:eq(1) th:eq(6)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.ETC).format('$0,0'));
        //    $('tr:eq(1) th:eq(7)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.EFC).format('$0,0'));
        //    $('tr:eq(1) th:eq(8)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.B).format('$0,0'));
        //    $('tr:eq(1) th:eq(9)', AtlasCRWv2.tableCRW.table().footer()).html(numeral(Summary.V).format('$0,0'));
    //})
    .on('dblclick', 'tr', function () {
        let AccountCode = $(this)[0].id;
        if (G_objDialogs[AccountCode]) {
            $(G_objDialogs[AccountCode]).dialogExtend('restore');
            return;
        }

        let waitvar = [];
        waitvar.push($.ajax(
            AtlasDocument.MakeAJAXPOSTobject(
                '/api/Ledger/TransactionListbyAccountCode',
                JSON.stringify(
                    {
                        ProdID: localStorage.ProdId,
                        AccountCodes: [AccountCode],
                    })
            )
        ).done(function (response) {
            console.log(response[0].Transactions);
            let mytable = document.createElement('table');// $(`<table id="tblTransactions-${AccountCode}">`);
            mytable.id = `tblTransactions-${AccountCode}`;

            let mydialog = $(`<div id="Transactions-${AccountCode}"></div>`)
            .dialog({
                "title": `${AccountCode}`,
                'close': function (evt, dlg) {
                    $(mytable).remove();
                    delete G_objDialogs[AccountCode];
                    $(this).remove();
                }
                , minWidth: 700
                , maxWidth: 800
                , minHeight: 300
                , maxHeight: 300
            })
            .dialogExtend({
                "closable": true,
                "minimizable": true,
                "collapsable": true,
                "dblclick": "collapse",
                "titlebar": false,
                "minimizeLocation": "left",
                //"icons": {
                    //"close": "ui-icon-circle-close",
                    //"maximize": "ui-icon-circle-plus",
                    //"minimize": "ui-icon-circle-minus",
                    //"collapse": "ui-icon-triangle-1-s",
                //    "restore": "ui-icon-bullet"
                //},
                //"load": function (evt, dlg) { alert(evt.type); },
                //"beforeCollapse": function (evt, dlg) { alert(evt.type); },
                //"beforeMaximize": function (evt, dlg) { alert(evt.type); },
                //"beforeMinimize": function (evt, dlg) { alert(evt.type); },
                //"beforeRestore": function (evt, dlg) { alert(evt.type); },
                //"collapse": function (evt, dlg) { alert(evt.type); },
                //"maximize": function (evt, dlg) { alert(evt.type); },
                //"minimize": function (evt, dlg) { alert(evt.type); },
                //"restore": function (evt, dlg) { alert(evt.type); }
            });
            $(`#Transactions-${AccountCode}`).append(mytable);
            let A_Data = response[0].Transactions;

            let DTmytable = $(mytable).DataTable({
                dom: 't'
                , paging: false
                , language: {
                    emptyTable: `There are no transactions for Account ${AccountCode}`
                }
                //, searching: false
                , info: false
                , data: A_Data
                //, order: [[2, 'desc']]
                , columns: [
                    { 'data': 'TNo', 'title': 'Transaction #' }
                    , { 'data': 'ST', 'title': 'Type' }
                    , {
                        'data': 'PDate', 'title': 'Posted Date'
                        , render: function (thedate, type) {
                            if (type === 'display') {
                                return new Date(thedate).format('mm/dd/yyyy')
                            } else {
                                return thedate;
                            }
                        }
                    }
                    , { 'data': 'VendorName', 'title': 'Vendor' }
                    , {
                        'data': null
                        , 'title': 'Amount'
                        , render: function (data, type, row) {
                            return numeral(parseFloat(data.Debit) - parseFloat(data.Credit)).format('$0,0.00').toString();
                        }
                    }
                ]
            });
            $(mytable).stickyTableHeaders({ scrollableArea: $(`#Transactions-${AccountCode}`) });
            $(mytable).addClass('CRWv2DrilldownTable');

            let mytabletFootRow = mytable.createTFoot().insertRow(0);
            for (let header of mytable.tHead.children[0].children) {
                let headertext = $(header.children).text();
                console.log(headertext, $(header).index());
                let fcell = mytabletFootRow.insertCell($(header).index());
                fcell.innerHTML = `<input type="text" style="width:100%;" placeholder="${headertext}" data-col="${$(header).index()}">`;
            }
            $('input', mytable.tFoot).on('keyup change', function () {
                DTmytable
                       .column($(this).data('col'))
                       .search(this.value)
                       .draw();
            });
            $(mytable).find('tfoot tr').insertAfter($(mytable).find('thead tr'));

            G_objDialogs[AccountCode] = mydialog[0];
        }).fail(function (error) { // jQuery versioning
            AtlasUtilities.ShowError(error);
        }));
    });
   
    AtlasBudgetv2.BudgetRender('Consolidated');

}(jQuery));


//Borrowed from global.js
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

/*! jQuery Migrate v3.0.0 | (c) jQuery Foundation and other contributors | jquery.org/license */
//"undefined" == typeof jQuery.migrateMute && (jQuery.migrateMute = !0), function (a, b) { "use strict"; function c(c) { var d = b.console; e[c] || (e[c] = !0, a.migrateWarnings.push(c), d && d.warn && !a.migrateMute && (d.warn("JQMIGRATE: " + c), a.migrateTrace && d.trace && d.trace())) } function d(a, b, d, e) { Object.defineProperty(a, b, { configurable: !0, enumerable: !0, get: function () { return c(e), d } }) } a.migrateVersion = "3.0.0", function () { var c = b.console && b.console.log && function () { b.console.log.apply(b.console, arguments) }, d = /^[12]\./; c && (a && !d.test(a.fn.jquery) || c("JQMIGRATE: jQuery 3.0.0+ REQUIRED"), a.migrateWarnings && c("JQMIGRATE: Migrate plugin loaded multiple times"), c("JQMIGRATE: Migrate is installed" + (a.migrateMute ? "" : " with logging active") + ", version " + a.migrateVersion)) }(); var e = {}; a.migrateWarnings = [], void 0 === a.migrateTrace && (a.migrateTrace = !0), a.migrateReset = function () { e = {}, a.migrateWarnings.length = 0 }, "BackCompat" === document.compatMode && c("jQuery is not compatible with Quirks Mode"); var f = a.fn.init, g = a.isNumeric, h = a.find, i = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/, j = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g; a.fn.init = function (a) { var b = Array.prototype.slice.call(arguments); return "string" == typeof a && "#" === a && (c("jQuery( '#' ) is not a valid selector"), b[0] = []), f.apply(this, b) }, a.fn.init.prototype = a.fn, a.find = function (a) { var b = Array.prototype.slice.call(arguments); if ("string" == typeof a && i.test(a)) try { document.querySelector(a) } catch (d) { a = a.replace(j, function (a, b, c, d) { return "[" + b + c + '"' + d + '"]' }); try { document.querySelector(a), c("Attribute selector with '#' must be quoted: " + b[0]), b[0] = a } catch (e) { c("Attribute selector with '#' was not fixed: " + b[0]) } } return h.apply(this, b) }; var k; for (k in h) Object.prototype.hasOwnProperty.call(h, k) && (a.find[k] = h[k]); a.fn.size = function () { return c("jQuery.fn.size() is deprecated; use the .length property"), this.length }, a.parseJSON = function () { return c("jQuery.parseJSON is deprecated; use JSON.parse"), JSON.parse.apply(null, arguments) }, a.isNumeric = function (b) { function d(b) { var c = b && b.toString(); return !a.isArray(b) && c - parseFloat(c) + 1 >= 0 } var e = g(b), f = d(b); return e !== f && c("jQuery.isNumeric() should not be called on constructed objects"), f }, d(a, "unique", a.uniqueSort, "jQuery.unique is deprecated, use jQuery.uniqueSort"), d(a.expr, "filters", a.expr.pseudos, "jQuery.expr.filters is now jQuery.expr.pseudos"), d(a.expr, ":", a.expr.pseudos, 'jQuery.expr[":"] is now jQuery.expr.pseudos'); var l = a.ajax; a.ajax = function () { var a = l.apply(this, arguments); return a.promise && (d(a, "success", a.done, "jQXHR.success is deprecated and removed"), d(a, "error", a.fail, "jQXHR.error is deprecated and removed"), d(a, "complete", a.always, "jQXHR.complete is deprecated and removed")), a }; var m = a.fn.removeAttr, n = a.fn.toggleClass, o = /\S+/g; a.fn.removeAttr = function (b) { var d = this; return a.each(b.match(o), function (b, e) { a.expr.match.bool.test(e) && (c("jQuery.fn.removeAttr no longer sets boolean properties: " + e), d.prop(e, !1)) }), m.apply(this, arguments) }, a.fn.toggleClass = function (b) { return void 0 !== b && "boolean" != typeof b ? n.apply(this, arguments) : (c("jQuery.fn.toggleClass( boolean ) is deprecated"), this.each(function () { var c = this.getAttribute && this.getAttribute("class") || ""; c && a.data(this, "__className__", c), this.setAttribute && this.setAttribute("class", c || b === !1 ? "" : a.data(this, "__className__") || "") })) }; var p = !1; a.swap && a.each(["height", "width", "reliableMarginRight"], function (b, c) { var d = a.cssHooks[c] && a.cssHooks[c].get; d && (a.cssHooks[c].get = function () { var a; return p = !0, a = d.apply(this, arguments), p = !1, a }) }), a.swap = function (a, b, d, e) { var f, g, h = {}; p || c("jQuery.swap() is undocumented and deprecated"); for (g in b) h[g] = a.style[g], a.style[g] = b[g]; f = d.apply(a, e || []); for (g in b) a.style[g] = h[g]; return f }; var q = a.data; a.data = function (b, d, e) { var f; return d && d !== a.camelCase(d) && (f = a.hasData(b) && q.call(this, b), f && d in f) ? (c("jQuery.data() always sets/gets camelCased names: " + d), arguments.length > 2 && (f[d] = e), f[d]) : q.apply(this, arguments) }; var r = a.Tween.prototype.run; a.Tween.prototype.run = function (b) { a.easing[this.easing].length > 1 && (c('easing function "jQuery.easing.' + this.easing.toString() + '" should use only first argument'), a.easing[this.easing] = a.easing[this.easing].bind(a.easing, b, this.options.duration * b, 0, 1, this.options.duration)), r.apply(this, arguments) }; var s = a.fn.load, t = a.event.fix; a.event.props = [], a.event.fixHooks = {}, a.event.fix = function (b) { var d, e = b.type, f = this.fixHooks[e], g = a.event.props; if (g.length) for (c("jQuery.event.props are deprecated and removed: " + g.join()) ; g.length;) a.event.addProp(g.pop()); if (f && !f._migrated_ && (f._migrated_ = !0, c("jQuery.event.fixHooks are deprecated and removed: " + e), (g = f.props) && g.length)) for (; g.length;) a.event.addProp(g.pop()); return d = t.call(this, b), f && f.filter ? f.filter(d, b) : d }, a.each(["load", "unload", "error"], function (b, d) { a.fn[d] = function () { var a = Array.prototype.slice.call(arguments, 0); return "load" === d && "string" == typeof a[0] ? s.apply(this, a) : (c("jQuery.fn." + d + "() is deprecated"), a.splice(0, 0, d), arguments.length ? this.on.apply(this, a) : (this.triggerHandler.apply(this, a), this)) } }), a(function () { a(document).triggerHandler("ready") }), a.event.special.ready = { setup: function () { this === document && c("'ready' event is deprecated") } }, a.fn.extend({ bind: function (a, b, d) { return c("jQuery.fn.bind() is deprecated"), this.on(a, null, b, d) }, unbind: function (a, b) { return c("jQuery.fn.unbind() is deprecated"), this.off(a, null, b) }, delegate: function (a, b, d, e) { return c("jQuery.fn.delegate() is deprecated"), this.on(b, a, d, e) }, undelegate: function (a, b, d) { return c("jQuery.fn.undelegate() is deprecated"), 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", d) } }); var u = a.fn.offset; a.fn.offset = function () { var b, d = this[0], e = { top: 0, left: 0 }; return d && d.nodeType ? (b = (d.ownerDocument || document).documentElement, a.contains(b, d) ? u.apply(this, arguments) : (c("jQuery.fn.offset() requires an element connected to a document"), e)) : (c("jQuery.fn.offset() requires a valid DOM element"), e) }; var v = a.param; a.param = function (b, d) { var e = a.ajaxSettings && a.ajaxSettings.traditional; return void 0 === d && e && (c("jQuery.param() no longer uses jQuery.ajaxSettings.traditional"), d = e), v.call(this, b, d) }; var w = a.fn.andSelf || a.fn.addBack; a.fn.andSelf = function () { return c("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"), w.apply(this, arguments) }; var x = a.Deferred, y = [["resolve", "done", a.Callbacks("once memory"), a.Callbacks("once memory"), "resolved"], ["reject", "fail", a.Callbacks("once memory"), a.Callbacks("once memory"), "rejected"], ["notify", "progress", a.Callbacks("memory"), a.Callbacks("memory")]]; a.Deferred = function (b) { var d = x(), e = d.promise(); return d.pipe = e.pipe = function () { var b = arguments; return c("deferred.pipe() is deprecated"), a.Deferred(function (c) { a.each(y, function (f, g) { var h = a.isFunction(b[f]) && b[f]; d[g[1]](function () { var b = h && h.apply(this, arguments); b && a.isFunction(b.promise) ? b.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[g[0] + "With"](this === e ? c.promise() : this, h ? [b] : arguments) }) }), b = null }).promise() }, b && b.call(d, d), d } }(jQuery, window);
