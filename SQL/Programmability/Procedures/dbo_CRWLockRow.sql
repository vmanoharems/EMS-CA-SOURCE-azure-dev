SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CRWLockRow]   ---  exec CRWBudgetAmountDistribution 1393,2,2,'10665'
(
@COAID int,
@BudgetID int,
@BudgetFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	 update EstimatedCost set ExpandValue=9 where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

	 select @COAID as COAID , @BudgetID as BudgetID
end


GO