SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetDetails] 
(
@BudgetFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 
--select a.BudgetDetailID,a.AccountID,a.AggPercent,a.DLocation,a.DetailSet,a.Description,a.Amount,a.Unit,a.X,a.Unit2,a.Currency,a.Rate,a.Unit3,a.Unit4,a.SubTotal,
--a.HiddenDfourthMlt,b.AccountNumber,c.CategoryNumber ,a.DetailNumber
--from BudgetDetail as a inner join BudgetAccounts as b on a.AccountID=b.AccountID 
--inner join BudgetCategory as c on b.CategoryId=c.cid
--where a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID and c.Budgetfileid=@BudgetFileID

 
select a.BudgetDetailID,a.AccountID,a.Description,a.SubTotal,b.AccountNumber,c.CategoryNumber ,a.DetailNumber
from BudgetDetail as a inner join BudgetAccounts as b on a.AccountID=b.AccountID 
inner join BudgetCategory as c on b.CategoryId=c.cid
where a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID and c.Budgetfileid=@BudgetFileID




END



GO