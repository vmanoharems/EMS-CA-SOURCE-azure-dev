SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetCategoryForGL]
(
@Budgetfileid int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


--select BudgetCategoryID,CategoryNumber,CategoryDescription from BudgetCategory where Budgetfileid=@Budgetfileid

select BudgetCategoryID,isnull(CategoryNumber,0) as CategoryNumber,CategoryDescription,'NO' as AccountAbail from BudgetCategory where Budgetfileid=@Budgetfileid and  CategoryNumber
 not in
 (select AccountCode from TblAccounts where SegmentType='Ledger' and ProdId=@ProdID)

 union all
 
select BudgetCategoryID,isnull(CategoryNumber,0) as CategoryNumber,CategoryDescription,'YES' as AccountAbail from BudgetCategory where Budgetfileid=@Budgetfileid and  CategoryNumber
 in
 (select AccountCode from TblAccounts where SegmentType='Ledger' and ProdId=@ProdID) order by CategoryNumber

END



GO