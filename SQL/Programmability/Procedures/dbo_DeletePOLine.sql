SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[DeletePOLine]
	-- Add the parameters for the stored procedure here
	@POLineId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete from PurchaseOrderLine where POlineID=@POLineId
END



GO