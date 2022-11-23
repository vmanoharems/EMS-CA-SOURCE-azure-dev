CREATE PROCEDURE [dbo].[GetBudgetByCompanyForCRW] 
(
@CompanCode varchar(50),
@ProdID int,
@LO varchar(50),
@EP varchar(50),
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 if(@Mode=1)
 begin
 -- CRWv2
 select '' as S1, '' as S2, '' as S3, '' as S4, '' as S5, '' as S6
 , 1 as CompanyID -- <<< POTENTIAL SERIOUS ISSUE WITH HARDCODING THIS VALUE
 , V.version as BudgetFileID
 , B.BudgetID, B.BudgetName, segmentJSON as SegmentName
 from Budgetv2 B
 join (select BudgetID, max(version) as version from CRWv2 group by BudgetID) as V
 on B.BudgetID = V.BudgetID
 where B.Active = 1
 and B.ProdID = @ProdID
--select distinct a.S1,a.S2,a.S3,a.S4,a.S5,a.S6,a.CompanyID, a.BudgetFileID,a.Budgetid ,b.BudgetName,a.SegmentName from BudgetFile as a
--inner join Budget as b on a.Budgetid=b.BudgetId
--where a.S1!='' and a.Status='Processed' 
--and a.prodid=@ProdID and a.CompanCode=@CompanCode
--group by a.S1,a.S2,a.S3,a.S4,a.S5,a.S6,a.CompanyID, a.BudgetFileID,a.Budgetid ,b.BudgetName,a.SegmentName
 end
 else  if(@Mode=2)
 begin
 select distinct a.S1,a.S2,a.S3,a.S4,a.S5,a.S6,a.CompanyID, a.BudgetFileID,a.Budgetid ,b.BudgetName,a.SegmentName from BudgetFile as a
inner join Budget as b on a.Budgetid=b.BudgetId
 where a.S1!='' and a.Status='Processed' 
and a.prodid=@ProdID and a.CompanCode=@CompanCode and S2=@LO
group by a.S1,a.S2,a.S3,a.S4,a.S5,a.S6,a.CompanyID, a.BudgetFileID,a.Budgetid ,b.BudgetName,a.SegmentName
 end
 else  if(@Mode=3)
 begin
 select distinct a.S1,a.S2,a.S3,a.S4,a.S5,a.S6,a.CompanyID, a.BudgetFileID,a.Budgetid ,b.BudgetName,a.SegmentName from BudgetFile as a
inner join Budget as b on a.Budgetid=b.BudgetId
 where a.S1!='' and a.Status='Processed' 
and a.prodid=@ProdID and a.CompanCode=@CompanCode and S2=@LO and S3=@EP
group by a.S1,a.S2,a.S3,a.S4,a.S5,a.S6,a.CompanyID, a.BudgetFileID,a.Budgetid ,b.BudgetName,a.SegmentName
 end




END



GO