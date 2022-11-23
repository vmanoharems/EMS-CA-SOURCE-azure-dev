SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetAllPurchaseOrder] -- GetAllPurchaseOrder 3
(
@ProdID int
)                                                                    
AS                      
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
   select convert(varchar(10),PO.PODate,110) As PODate,PO.PONumber,PO.COCode,PO.Payby,PO.VendorName,PO.VendorID
   ,v.VendorName as tblVendorName
   ,PO.ThirdParty
   ,PO.AdjustmentTotal
   ,PO.RelievedTotal
--   ,PO.BalanceAmount
	,POLS.DisplayAmountTotal as BalanceAmount
   ,PO.OriginalAmount
   ,PO.OriginalAmount as OriginalAmount1
   ,PO.BatchNumber,PO.POID,PO.status
   --,PO.OriginalAmount
   ,c.PeriodStatus
     from PurchaseOrder PO
	 join (select POID, sum(ManualAdjustment) as ManualAdjustmentTotal
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
	 left outer join tblVendor v on PO.VendorID = v.VendorID
	 left outer join ClosePeriod c on PO.ClosePeriodID = c.ClosePeriodId
	  where PO.ProdID=@ProdID

END

GO