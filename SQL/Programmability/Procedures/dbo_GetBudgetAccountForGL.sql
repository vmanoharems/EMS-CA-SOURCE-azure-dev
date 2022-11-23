SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetAccountForGL]
(
@BudgetFileID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   
   select c.AccountID as ParentID, a.CategoryNumber,b.AccountNumber,b.AccountDesc ,'NO' as AccountAvailable from BudgetCategory a ,BudgetAccounts b,TblAccounts c
where b.CategoryId=a.cid and b.BudgetFileID=@BudgetFileID and a.Budgetfileid=@BudgetFileID and c.AccountCode=a.CategoryNumber and c.SegmentType='Ledger'
and b.AccountNumber 
 not in (select AccountCode from TblAccounts where SegmentType='Detail' and ProdId=@ProdID and SubLevel=1)

union all
(  
 select a.ParentId,b.CategoryNumber,a.AccountCode as AccountNumber,a.AccountName as AccountDesc,'YES' as AccountAvailable from TblAccounts a ,BudgetCategory b ,TblAccounts c
 where a.SegmentType='Detail' and a.ProdId=@ProdID and a.SubLevel=1 and c.SegmentType='Ledger' and b.CategoryNumber=c.AccountCode and b.Budgetfileid=@BudgetFileID and a.ParentId=c.AccountId
) order by CategoryNumber


END



GO