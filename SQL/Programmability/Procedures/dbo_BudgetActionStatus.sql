SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[BudgetActionStatus]
(
@BudgetID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  select count(*) as BudgetCount from BudgetCategoryFinal where Budgetid=@BudgetID

END



GO