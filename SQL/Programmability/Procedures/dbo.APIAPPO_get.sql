SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
create procedure [dbo].[APIAPPO_get]
(@POID int)
as
begin
	SELECT PO.*
	,POL.*
	FROM PurchaseOrder PO
	join PurchaseOrderLine POL
	 on PO.POID = POL.POID  
	where PO.POID = @POID
	FOR JSON AUTO
end
GO