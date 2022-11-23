SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetTransCodeForPayrollAudit] --exec GetTransCodeForPayrollAudit 1
(
@PayrollFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  select top(1) isnull(TransactionString,'') as TransactionString, SegmentString from PayrollExpensePost where PayrollFileID=@PayrollFileID

END



GO