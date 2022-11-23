function hasZeroValues(htmlIDobj) {
    let returncount = 0;
    htmlIDobj.each(function (i, val) {
        var strvalue = $('#txtAmt_' + $('.clsTr')[i].id).val();
        if (parseFloat(strvalue) == 0) returncount++;
        }
    );
    return returncount;
}

function RemoveZeroLines(htmlIDobj, deleterowfunction,additionalcallback)
{
    htmlIDobj.each(function (i, val) {
        var CheckClearingType = $('#checkRelAmt_' + i).text();
        if (CheckClearingType != 1) {
            var strvalue = $('#txtAmt_' + $(this).attr('id')).val();
            if (parseFloat(strvalue) == 0) {
                deleterowfunction($(this).attr('id'));
                if (additionalcallback !== undefined) {
                    additionalcallback();
                }
            }
        }

});
}
