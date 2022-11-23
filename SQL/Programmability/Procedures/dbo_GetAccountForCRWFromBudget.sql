CREATE PROCEDURE [dbo].[GetAccountForCRWFromBudget]
(
@ProdID int 
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

--select distinct CompanCode as AccountCode,CompanyID from BudgetFile where Status='Processed' and Prodid=@ProdID
select CompanyCode as AccountCode, CompanyID from Company
order by CompanyCode

END
GO