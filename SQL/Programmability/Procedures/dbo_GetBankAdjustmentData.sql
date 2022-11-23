SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetBankAdjustmentData]
	@ReconcilationID int,
	@BankID int,
	@ProdID int
AS
BEGIN
	SET NOCOUNT ON;
	select AdjustmentID,AdjustmentNumber,convert(varchar(10),Date,101) as Date,Amount,Description,Status
	from BankAdjustment where
	ReconcilationID =@ReconcilationID and ProdID=@ProdID and BankID=@BankID
	ORDER BY AdjustmentNumber;
END



GO