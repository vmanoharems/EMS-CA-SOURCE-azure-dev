CREATE PROCEDURE [dbo].[GetPODetail] --- GetPODetail 58
(
@POID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select PO.POID, PONumber, CompanyID, PO.VendorID, isnull(v.VendorName,'') as tblVendorName, PO.VendorName, ThirdParty, PO.WorkRegion, PO.Description
		, OriginalAmount
		, AdjustmentTotal
--		, RelievedTotal
		, POLS.RelievedTotalTotal as RelievedTotal
		, case when PO.Status = 'Closed' then 0 
			else POLS.DisplayAmountTotal --BalanceAmount end 
			END as BalanceAmount
		, BatchNumber, ClosePOuponPayment, Payby, PO.Status, PO.CreatedDate, PO.ProdID, convert(varchar(10), PODate,101) as PODate, ClosePeriodId, RequiredTaxCode
		, PO.COCode from PurchaseOrder PO
	 join (select POID
		, sum(Amount) as OriginalAmountTotal
		, sum(ManualAdjustment) as ManualAdjustmentTotal
		, sum(ClearedAmount) as ClearedAmountTotal
		, sum(AdjustMentTotal) as AdjustmentAmountTotal
		, sum(RelievedAmount) as RelievedAmountTotal
		, sum(AvailToRelieve) as AvailtoRelieveTotal
		, sum(DisplayAmount) as DisplayAmountTotal
		, sum(RelievedTotal) as RelievedTotalTotal
		from PurchaseOrderLine POLS
		group by POID
	) as POLS
		on PO.POID = POLS.POID
	left outer join tblVendor V 
		on PO.VendorID = v.VendorID
	where PO.POID=@POID

END
GO