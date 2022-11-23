SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetPONumber] -- GetPONumber 3,7
(
@ProdID int,
@VendorId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
select POID,PONumber from PurchaseOrder where ProdID=@ProdID and VendorID=@VendorId
 and Status <>'Closed'



END


GO