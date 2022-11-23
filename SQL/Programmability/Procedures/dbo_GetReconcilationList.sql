SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetReconcilationList]
(
@ProdID int,
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select ReconcilationID,Status from BankReconcilation where ProdID=@ProdID and BankID=@BankID and Status='Completed'

END



GO