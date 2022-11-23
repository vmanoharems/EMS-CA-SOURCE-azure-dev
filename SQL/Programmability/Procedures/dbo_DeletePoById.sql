SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[DeletePoById]
	-- Add the parameters for the stored procedure here
	@POId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	delete from PurchaseOrderLine where POID=@POId
	delete from PurchaseOrder where POID=@POId

--DELETE w
--FROM PurchaseOrderLine w
--INNER JOIN  PurchaseOrder  e
--  ON w.POID=e.POID
--Where e.POID = @POId
END



GO