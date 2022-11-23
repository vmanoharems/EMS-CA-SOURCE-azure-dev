CREATE PROCEDURE [dbo].[GetLocationForCRWFromBudget]
(
@ProdID int ,
@CO varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
select  AccountCode, AccountCode as S2 from tblAccounts where SegmentType = 'Location'
--select distinct S2 as AccountCode,S2 from BudgetFile where Status='Processed' and 
and Prodid=@ProdID
--and S1=@CO
order by AccountCode

END



GO