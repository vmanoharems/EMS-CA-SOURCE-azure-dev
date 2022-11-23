SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetTransactionCode]
	-- Add the parameters for the stored procedure here
@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	Select TransactionCodeID,Description,Status from TransactionCode where ProdID=@ProdId and Status = 1
END


GO