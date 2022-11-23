SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCRWHead]   -- GetCRWHead 1,2,61
(
@CID int,
@BudgetID int,
@BudgetFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @ClosePeriodCheck int;
	declare @OpenPeriodCheck int;
	declare @Start date;
	declare @End date;


	select @ClosePeriodCheck=count(*) from ClosePeriod where CompanyId=@CID;
    
	if(@ClosePeriodCheck>0)
	begin
     	select @OpenPeriodCheck=count(*) from ClosePeriod where CompanyId=@CID and Status!='Close';
		if(@OpenPeriodCheck>0)
		begin
           select top(1) @Start=StartPeriod,@End=EndPeriod from ClosePeriod where CompanyId=@CID and Status!='Close' order by StartPeriod desc 
		end
		else
		begin

               declare @Defaultvalue varchar(50);

		       select @Defaultvalue= DefaultValue from Company where companyid=@CID;

			   select top(1) @Start=StartPeriod,@End=EndPeriod from ClosePeriod where CompanyId=@CID and Status='Close' order by StartPeriod desc ;

			   if(@Defaultvalue='Weekly')
			   begin
			   set @Start=DATEADD(day,7,@End)
			   set @End=DATEADD(day,7,@Start)
			   end
			   else
			   begin
			    set @Start=DATEADD(day,1,@End)
			    set @End= DATEADD(day,1,@Start)
			   end

		end
		

	end
	else
	begin
	
	 
	 declare @Period date;
	 declare @PeriodStartType varchar(50);
		       select @Defaultvalue= DefaultValue ,@Period=PeriodStart ,@PeriodStartType=PeriodStartType from Company where companyid=@CID;

			   if(@Defaultvalue='Weekly')
			   begin
			         if(@PeriodStartType='Period Start')
					 begin
			           set @Start=@Period;
			           set @End= DATEADD(day,7,@Start)  
					end
					else
					begin
					   set @Start=DATEADD(day,7,@Period) 
			           set @End=DATEADD(day,7,@Start)
					end
			   
			   end
			   else
			   begin

			   if(@PeriodStartType='Period Start')
					 begin
			           set @Start=@Period;
			           set @End=DATEADD(day,1,@Start) 
					end
					else
					begin
					   set @Start=DATEADD(day,1,@Period) 
			           set @End=DATEADD(day,1,@Start)
					end
			   
			   end

	end 


	 --sql query for
	 
	 
	 
--select BudgetCategoryID, CategoryTotal, CategoryNumber,sum(InvoiceAmount) as InvoiceAmount,sum(POAmount) as POAmount, 
-- CategoryDescription, BudgetID,
-- Budgetfileid, AvailableData,sum(ddd) as BwAmt
-- from (
--select a.BudgetCategoryID, a.CategoryTotal, a.CategoryNumber, Sum(a.TotalCost) as InvoiceAmount,  sum(a.PO) as POAmount, 
-- a.CategoryDescription, a.BudgetID,
-- a.Budgetfileid,'YES' as AvailableData , CASE WHEN a.Date between @Start and  @End THEN  sum(a.TotalCost) ELSE '0' END as
--  ddd 
--  from CRWHeader as a 
--    where a.Budgetid=@BudgetID and a.Budgetfileid=@BudgetFileID
--group by a.BudgetCategoryID, a.CategoryTotal, a.CategoryNumber, a.CategoryDescription, a.BudgetID, a.Budgetfileid,a.Date) as CRW

--group by  BudgetCategoryID, CategoryTotal, CategoryNumber,
-- CategoryDescription, BudgetID,
-- Budgetfileid, AvailableData

--union all 

--select BudgetCategoryID, CategoryTotal, CategoryNumber, 0 as InvoiceAmount,  0 as POAmount, CategoryDescription,
-- BudgetID, Budgetfileid,'NO' as AvailableData, '0' as BwAmt
--  from BudgetCategory  where Budgetid=@BudgetID and Budgetfileid=@BudgetFileID and CategoryNumber !='' and BudgetCategoryID not in (
--  select BudgetCategoryID
--  from CRWHeader  where Budgetid=@BudgetID and Budgetfileid=@BudgetFileID
--  ) 
--group by BudgetCategoryID, CategoryTotal, CategoryNumber, CategoryDescription, BudgetID, Budgetfileid 


select CRWData.BudgetCategoryID, CRWData.CategoryTotal, CRWData.CategoryNumber,sum(CRWData.InvoiceAmount) as InvoiceAmount,
sum(CRWData.POAmount) as POAmount, 
 CRWData.CategoryDescription, CRWData.BudgetID,
 CRWData.Budgetfileid, CRWData.AvailableData,sum(CRWData.ddd) as BwAmt ,isnull(sum(cast(Q.ETC as decimal))/2,0) as ETC,
 isnull(sum(cast(Q.EFC as decimal))/2,0) as EFC ,count(Q.EFC)as EFCCnt,count(Q.ETC)as ETCCnt
 from (
select a.BudgetCategoryID, a.CategoryTotal, a.CategoryNumber, Sum(a.TotalCost) as InvoiceAmount,  sum(a.PO) as POAmount, 
 a.CategoryDescription, a.BudgetID,
 a.Budgetfileid,'YES' as AvailableData , CASE WHEN a.Date between @Start and  @End THEN  sum(a.TotalCost) ELSE '0' END as
  ddd 
  from CRWHeader as a 
    where a.Budgetid=@BudgetID and a.Budgetfileid=@BudgetFileID
group by a.BudgetCategoryID, a.CategoryTotal, a.CategoryNumber, a.CategoryDescription, a.BudgetID, a.Budgetfileid,a.Date) as CRWData
left join CRW as Q on CRWData.BudgetCategoryID=Q.budgetCategoryID

group by  CRWData.BudgetCategoryID, CRWData.CategoryTotal, CRWData.CategoryNumber,
 CRWData.CategoryDescription, CRWData.BudgetID,
 CRWData.Budgetfileid, CRWData.AvailableData

 
union all 

select a.BudgetCategoryID, a.CategoryTotal, a.CategoryNumber, 0 as InvoiceAmount,  0 as POAmount, a.CategoryDescription,
 a.BudgetID, a.Budgetfileid,'NO' as AvailableData, '0' as BwAmt, isnull(sum(cast(b.ETC as decimal)),0) as ETC,
 isnull(sum(cast(b.EFC as decimal)),0) as EFC,count(b.EFC)as EFCCnt,count(b.ETC)as ETCCnt
  from BudgetCategoryFinal as a
  left join CRW as b on a.BudgetCategoryID=b.BudgetCategoryID
   where a.Budgetid=@BudgetID and a.Budgetfileid=@BudgetFileID and a.CategoryNumber !='' and a.BudgetCategoryID not in (
  select BudgetCategoryID
  from CRWHeader  where Budgetid=@BudgetID and Budgetfileid=@BudgetFileID
  ) 
group by a.BudgetCategoryID, a.CategoryTotal,a.CategoryNumber, a.CategoryDescription, a.BudgetID, a.Budgetfileid

END



GO