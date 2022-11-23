SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetTransactionValueByCodeId]
	-- Add the parameters for the stored procedure here
	@TransactionCodeID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
select * From TransactionValue where TransactionCodeID=@TransactionCodeID
END




GO