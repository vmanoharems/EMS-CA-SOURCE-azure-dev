SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetTransactionCodeFill]
	-- Add the parameters for the stored procedure here
@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	Select * from TransactionCode where ProdID=@ProdId  order by TransactionCodeID desc
END






GO