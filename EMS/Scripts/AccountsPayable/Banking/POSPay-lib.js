"use strict";

/*
Lib for generating POS Pay Files
Usage:
    1. Get config using API for AtlasConfig to pull the POS Pay config setup for the selected bank
        {
	    "DisplayName": "First American Bank"
	    , "ConfigAdditionalFields": null
	    , "ConfigHeader": {"includeheader": false}
	    , "ConfigFields":{ 
		    "F1": {"field":"Bank.AccountNumber", "func": "padStart", "map": [11, "0"], "maxlength": 1}
		    , "F2": {"field":"Check.CheckNumber", "func": "padStart", "map": [10, "0"], "maxlength": 18}
		    , "F3": {"field":"Check.Date.MMDDYYYY", "func": "padStart", "map": [8," "], "maxlength": 8}
		    , "F4": {"field":"Check.Amount.noDecimals", "func": "padStart", "map": [10, "0"], "maxlength": 10}
		    , "F5": {"field":"Check.PayeeName", "func": "padEnd", "map": [30, " "], "maxlength": 30}
		    , "F6": {"field":"D"}
		    , "F7": {"field":"Check.VoidStatus", "func": {}, "map": {"VOIDED": "V"} }
		    , "F8": {"field":"Check.VoidDate.MMDDYYYY", "func": "padStart", "map": [8," "], "maxlength": 8}
	    }
	    , "ConfigFooter":""
	    }
    2. var/let APOSPay = new AtlasPOSPay(JSON from AtlasConfig);

    3. Get the POSPay Check data the user has selected. Required Format is all VALUES must be strings (including numbers; undefined and null values are not supported):
        [
            {
                'Bank.AccountNumber': '98721'
                , 'Bank.POSPay.CompanyID': '12323'
                , 'Bank.POSPay.UserID': '123'
                , 'Check.PaidStatus': 'PRINTED'
                , 'Check.CheckNumber': '1000'
                , 'Check.PayeeName': 'Vendor Print on Check Value'
                , 'Check.PayeeName2': ''
                , 'Check.Date.MMDDYYYY': '11292018'
                , 'Check.Date.YYYYMMDD': '20181129'
                , 'Check.Amount.noFormat': '12000'
                , 'Check.Amount': '120.00'
                , 'Check.VoidStatus': ''
                , 'Check.VoidDate.MMDDYYYY': ''
                , 'Check.VoidDate.YYYYMMDD': ''
            }
            , {
                'Bank.AccountNumber': '98721'
                , 'Bank.POSPay.CompanyID': '12323'
                , 'Bank.POSPay.UserID': '123'
                , 'Check.PaidStatus': 'VOIDED'
                , 'Check.CheckNumber': '1234'
                , 'Check.PayeeName': 'Here is the Vendor Payee Name'
                , 'Check.PayeeName2': null
                , 'Check.Date.MMDDYYYY': '11292018'
                , 'Check.Date.YYYYMMDD': '20181129'
                , 'Check.Amount.noFormat': '50000'
                , 'Check.Amount': '120.00'
                , 'Check.VoidStatus': 'VOIDED'
                , 'Check.VoidDate.MMDDYYYY': '11292018'
                , 'Check.VoidDate.YYYYMMDD': '20181129'
            }
        ]

    4. APOSPay.setData(POSPayData);
    5. APOSPay.GeneratePOSPayFile();
    6. APOSPay.DownloadPOSPayFile();
*/

class AtlasPOSPay {
    constructor(objPOS) {
        this.BankID = objPOS.BankID;
        this.POSPayFileFormat = objPOS.POSPayFileFormat;
        this.DisplayName = objPOS.DisplayName;
        this.ConfigAdditionalFields = objPOS.ConfigAdditionalFields;
        this.ConfigHeader = objPOS.ConfigHeader;
        this.ConfigFields = objPOS.ConfigFields;
        this.ConfigFooter = objPOS.ConfigFooter;
        this.Bank = {
            AccountNumber: undefined
        }
        this.ExtraFields = objPOS.ExtraFields;

        this.RawData = null;
        this.POSPayFileData = null;
    }

    setData(A_Data) {
        this.RawData = A_Data;
    }

    GeneratePOSPayFile() {
        // We're going to assume that the object has been initialized properly and the setData has been called to include the data
        let A_Data = this.RawData;
        let ret = '';

        A_Data.forEach((e, i) => {
            ret += this.processLine(e, i) + '\r\n';
        });

        this.POSPayFileData = ret;

        return ret;
    }

    downloadPOSPayFile() {
        let down = document.createElement('a');
        let thedate = new Date().format('yyyymmdd');

        down.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.POSPayFileData));
        down.setAttribute('download', `${this.DisplayName}_POSPayFile_${thedate}.txt`);
        down.click();
    }

    processLine(objLine, index) {
        let objCF = this.ConfigFields;
        let ret = '';

        for (let obj in objCF) {
            let theobj = objCF[obj];

            let map = theobj.map; 
            let func = theobj.func;

            let thefield = theobj.field;
            let thevalue = objLine[thefield];
            let thefield_A = thefield.split('.');

            try {
                if (thefield_A.length === 2) { // This means we're using the Bank or a field that has object values (e.g. Amount.noFormat)
                    if (thefield_A[0].toUpperCase() === 'BANK') {
                        thevalue = this.Bank[thefield_A[1]];
                    } else {
                        thevalue = objLine[thefield_A[0]][thefield_A[1]];
                    }
                } else if (thefield_A.length === 3) { // This means we have POS Pay Extra Fields
                    if (thefield_A[0] === 'POSPay') {
                        thevalue = this.ExtraFields[thefield_A[2]];
                    } else {
                        thevalue = objLine[thefield_A[0]][thefield_A[1]][thefield_A[2]];
                    }
                }
            } catch (e) {
                thevalue = '';
            }
            if (typeof thevalue !== 'undefined') thevalue = thevalue.toString();

            let fieldvalue = this.processField(thefield, thevalue, func, map, theobj.maxlength);
            //console.log('The field: ' + theobj.field + ' = ' + fieldvalue);

            ret += fieldvalue;
        };

        return ret;
    }

    processField(fieldname, fieldvalue, func, map, maxlength) {
        if (func === undefined && map === undefined) return (fieldvalue)? fieldvalue: fieldname; // Good for spacers

        if (typeof func === 'string' && typeof fieldvalue === 'string') { // This means we should expect a js string function that has the correct parameters set in map as function call; e.g. padStart
            fieldvalue = fieldvalue[func](...map);
        } else if (typeof func === 'object' && func !== null && typeof map === 'object') { // This means we have an object that will house a mapping, all in uppercase
            if (fieldvalue) fieldvalue = map[fieldvalue.toUpperCase()];
        } else { // Run a custom function
            return 'unknown';
        }

        if (func === 'padStart') {
            return fieldvalue.slice(-maxlength);
        } else {
            return fieldvalue.slice(0, maxlength);
        }
    }
}