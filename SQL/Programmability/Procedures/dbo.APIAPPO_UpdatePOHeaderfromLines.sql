SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[APIAPPO_UpdatePOHeaderfromLines]
(
@POID int = null
, @ProdID int = null
, @POLineID int = null
)
as
BEGIN

if @POLineID is not null
	select @POID = POID from PurchaseOrderLine where POLineID = @POLineID;

	; with POSum as -- Update the Purchase Order Header amounts
	(
		select POL.POID
			, POL.ProdID
			, sum(RelievedAmount) as RelievedTotal
			, SUM(ManualAdjustment) as AdjustmentTotal
			, SUM(AvailtoRelieve) as AvailabletoRelieve
			, sum(case when AvailtoRelieve > 0 and POLineStatus = 'Open' then 1 else 0 end) as OpenPOLineCount
		from PurchaseOrderLine POL
		where POL.POID = @POID and POL.ProdID = @ProdID
		group by POL.POID, POL.ProdID
	)
	Update PO set
		PO.RelievedTotal = POSum.RelievedTotal
		, PO.AdjustmentTotal = POSum.AdjustmentTotal
		, PO.BalanceAmount = case when POSum.OpenPOLineCount > 0 then AvailabletoRelieve ELSE 0 end
		, PO.Status = case when POSum.OpenPOLineCount > 0 then PO.Status else 'Closed' end
	from PurchaseOrder PO
	join POSum on POSum.POID = PO.POID and POSum.ProdID = PO.ProdID
	;

END
GO