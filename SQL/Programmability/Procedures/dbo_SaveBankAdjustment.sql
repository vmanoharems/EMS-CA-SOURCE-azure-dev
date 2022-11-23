SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[SaveBankAdjustment]
(
@BankID int,
@ProdID  int,
@ReconcilationID int,
@AdjustmentNumber varchar(50),
@Date datetime,
@Amount float,
@Description  varchar(500),
@UserID int 
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  insert into BankAdjustment (BankID,ProdID,ReconcilationID,AdjustmentNumber,Date,Amount,Description,UserID,Status)
  values(@BankID,@ProdID,@ReconcilationID,@AdjustmentNumber,@Date,@Amount,@Description,@UserID,'UnCleared')


END



GO