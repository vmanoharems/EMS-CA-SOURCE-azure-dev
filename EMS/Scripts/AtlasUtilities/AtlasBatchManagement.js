const C_BatchKey = function (e) {
    let thekey = e.keyCode;
    if (thekey === 27) {
        $('#NewBatchNumber').hide();
        $('#G_BatchNumber').show().val(BatchManager.BatchNumber);
    } else if (!/[a-zA-Z0-9]/g.test(e.key)) {
        e.preventDefault();
        return;
    } else {
        if (e.keyCode === 13 || e.keyCode === 9) {
            $(this).notify();
            //BatchManager.AddBatch(this.value);
            //alert('enter');
            //console.log(this);
            if (this.value !== '') {
                BatchManager._Batchsetby = 'USER';
                BatchManager._PreviousBatchNumber = (BatchManager.BatchNumber === 'INIT' ? undefined : BatchManager.BatchNumber);
                BatchManager.BatchNumber = this.value;
            }
            $('#NewBatchNumber').hide();
            $('#G_BatchNumber').show();
            BatchManager.RenderBatchList();
            return;
        }
    }
}

class AtlasBatch {
    constructor() {
        this._Batchsetby = 'SESSION';

        this.theExisting = document.createElement('span');
        let theexisting = this.theExisting;
        theexisting.id = 'ExistingBatchNumber';
        theexisting.hidden = true;

        this.theInput = document.createElement('input');
        let theinput = this.theInput;
        theinput.id = 'NewBatchNumber';
        theinput.hidden = true;
        theinput.maxLength = 20;

        this.theSelect = document.createElement('select');
        let theselect = this.theSelect;
        theselect.id = 'G_BatchNumber';
        $('#G_BatchManagement').append(theexisting);
        $('#G_BatchManagement').append(theselect);
        $('#G_BatchManagement').append(theinput);

        $('#G_BatchNumber').on('change', this.ChangeBatchEvent);
        //$('#G_BatchNumber').on('focus', function () { this.selectedIndex = -1; })
        $('#NewBatchNumber').on('keydown', C_BatchKey);
        this.RenderBatchList(true);
    }

    get Storage() {
        return sessionStorage;
    }

    get URLS() {
        return {
            APIURLUpdateBatchNumber: `/api/AdminLogin/UpdateBatchNumber?UserID=${localStorage.UserId}&ProdID=${localStorage.ProdId}&BatchNumber=${this.BatchNumber}`
        }
    }

    get PreviousBatchNumber() {
        return this._PreviousBatchNumber;
    }

    set BatchNumber(NewBatchNumber) {
        this._BatchNumber = NewBatchNumber;
        return this._BatchNumber;
    }

    get BatchNumber() {
        return this._BatchNumber || 'INIT';
    }

    get BatchList() {
        return this._BatchList;
    }

    get Batchsetby() {
        return this._Batchsetby;
    }

    set SystemBatch(NewBatch) {
        if (!localStorage.SystemBatch) localStorage.SystemBatch = NewBatch;
    }

    get SystemBatch() {
        return localStorage.SystemBatch;
    }

    RenderBatchList(isInit) {
        $('#G_BatchNumber').empty();

        let newoption = document.createElement('option');
        newoption.value = 'NEW';
        newoption.text = 'New Batch';
        this.theSelect.appendChild(newoption);

        let objBatch = this.DeserializeBatch();
        //if (isInit || objBatch.BatchNumber !== this.BatchNumber || objBatch.BatchNumber === null) {
            //if (objBatch.BatchNumber !== this.BatchNumber && !isInit) this.BatchNumber = objBatch.BatchNumber;
        if (objBatch.BatchState && this.Batchsetby !== 'USER') {
            this.BatchNumber = objBatch.BatchNumber;
        }

        $.ajax(
            AtlasDocument.MakeAJAXPOSTobject(
            this.URLS.APIURLUpdateBatchNumber
        ))
        .done((response) => {
            let objR = JSON.parse(response);
            if (!objR) {
                BatchManager.ChangeBatchEvent();
                //BatchManager.Storage.removeItem('BatchManager');
                BatchManager.Clear();
            } else {
                if (isInit) {
                    BatchManager.SystemBatch = objR.BatchNumber;
                }
                BatchManager.SerializeBatch(objR);
                BatchManager._BatchList = objR.BatchList;

                if (objR.BatchList.length > 0) {
                    BatchManager.RenderBatchOptions(objR);
                }
            }
        });
        //} else {
        //    this.RenderBatchOptions(objBatch)
        //}
    }

    RenderBatchOptions(objBatch) {
        let BatchList = objBatch.BatchList;
        let BatchListCount = 0;
        if (BatchList) {
            BatchList.forEach((e) => {
                if (e.BN === null) return;

                let existingoption = document.createElement('option');
                existingoption.value = e.BN;
                existingoption.text = e.BN;
                this.theSelect.appendChild(existingoption);
                BatchListCount++;
            });

            if (!objBatch.BatchState) {
                let Batchmsg = objBatch.BatchStatus;
                if (this.PreviousBatchNumber !== 'INIT' && this.PreviousBatchNumber !== undefined && this.PreviousBatchNumber !== null) Batchmsg += `\nBatch set to Previous Batch: ${this.PreviousBatchNumber}`;
                if (BatchListCount === 0) {
                    this.ChangeBatchEvent(objBatch.BatchStatus);
                    return;
                }
                $('#G_BatchNumber').notify(Batchmsg);
                //$('#G_BatchNumber').val(this.BatchNumber);
                this.BatchNumber = this.PreviousBatchNumber;
            } else {
                this.BatchNumber = objBatch.BatchNumber;
            }
            $('#G_BatchNumber').val(this.BatchNumber);
        }
    }

    ForceBatch(ExistingBatch) { // Call this from an existing transaction so that the user will see the Batch Number of the existing/posted transaction and NOT Batch Manager
        if (!ExistingBatch) {
            this.BatchNumber = this._PreviousBatchNumber;
            $('#NewBatchNumber').hide();
            $('#G_BatchNumber').show();
            $('#ExistingBatchNumber').hide();
        } else {
            this._PreviousBatchNumber = this.BatchNumber;
            this.BatchNumber = ExistingBatch;
            $('#NewBatchNumber').hide();
            $('#G_BatchNumber').hide();
            $('#ExistingBatchNumber').text(ExistingBatch).show();
        }
    }

    ChangeBatchEvent(msg) {
        if (this instanceof AtlasBatch) {
            // This means we're forcing the user to set a Batch Number
            msg = 'You do not have any open batches. Please create one or you cannot enter data!' + ((msg) ? `\n${msg}` : '');
            $('#G_BatchNumber').hide();
            $('#NewBatchNumber').val('').show().focus().notify(msg, { position: 'right top', autoHide: false });
        } else if (this.value === 'NEW') {
            $('#NewBatchNumber').val('').show().focus();
            $('#G_BatchNumber').hide();
        } else {
            let objBatch = BatchManager.DeserializeBatch();
            objBatch.BatchNumber = this.value;
            BatchManager.SerializeBatch(objBatch);

            BatchManager.Storage.BatchNumber = this.value;
            BatchManager.BatchNumber = this.value;
        }
    }

    SerializeBatch(objBatch) {
        if (typeof objBatch !== 'object') return;
        this.Storage.BatchManager = JSON.stringify(objBatch);
    }

    DeserializeBatch() {
        let ret = {};
        try {
            ret = JSON.parse(this.Storage.BatchManager);
        } catch (e) {
            ret = {};
        }
        //this._BatchList = ret.BatchList;
        //this._BatchNumber = ret.BatchNumber;
        return ret;
    }

    Clear() {
        this.Storage.removeItem('BatchManager');
        localStorage.removeItem('SystemBatch');
    }
}

//$(document).ready(() => {
//    BatchManager = new AtlasBatch();
//})

var BatchManager = new AtlasBatch();;
