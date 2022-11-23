SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetCRWDetail]   -- GetCRWDetail 1,2,61,2942
(
@CID int,
@BudgetID int,
@BudgetFileID int,
@BudgetCategoryID int
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
	 
	 
--	select BudgetCategoryID,AccountTotal,categorynumber,accountnumber,accountdesc,sum(InvAmt) as InvAmt
--,sum(PoAmt) as PoAmt,
--BudgetID,Budgetfileid , Available,  sum(ddd)  as bwamt from(

--select a.BudgetCategoryID,a.AccountTotal,a.categorynumber,a.accountnumber,a.accountdesc,sum(a.Totalcost) as InvAmt
--,sum(a.po) as PoAmt,
--a.BudgetID,a.Budgetfileid ,'YES' as Available, CASE WHEN a.Date between @Start and  @End THEN  sum(a.TotalCost)
-- ELSE '0' END as  ddd 
-- from CRWDetail as a where a.BudgetCategoryID=@BudgetCategoryID and a.BudgetID=@BudgetID and a.BudgetFileid=@BudgetFileID
-- group by  a.BudgetCategoryID,a.AccountTotal,a.categorynumber,a.accountnumber,a.accountdesc
--,a.Date,a.BudgetID,a.Budgetfileid
--) as Crw
--group by BudgetCategoryID,AccountTotal,categorynumber,accountnumber,accountdesc
--,BudgetID,Budgetfileid,Available

--union  all

--select b.BudgetCategoryID, a.AccountTotal, b.CategoryNumber,a.accountnumber,a.accountdesc, 0 as InvAmt,  0 as PoAmt
-- ,a.BudgetID, a.BudgetFileID,'NO' as Available, '0' as BwAmt
--  from BudgetAccounts as a
--  inner join BudgetCategory as b on a.CategoryId=b.cid
--   where a.BudgetID=@BudgetID and a.BudgetFileID=@BudgetFileID  and b.BudgetID=@BudgetID and b.BudgetCategoryID=@BudgetCategoryID
--    and b.BudgetFileID=@BudgetFileID and a.AccountNumber !='' and a.AccountID not in (
--  select distinct AccountID
--  from CRWDetail  where Budgetid=@BudgetID and Budgetfileid=@BudgetFileID and BudgetCategoryID=@BudgetCategoryID
--  )
--group by b.BudgetCategoryID, a.AccountTotal, b.CategoryNumber,a.accountnumber,a.accountdesc
-- ,a.BudgetID, a.BudgetFileID 

	 

	 
select Crw.BudgetCategoryID,Crw.AccountTotal,Crw.categorynumber,Crw.accountnumber,Crw.accountdesc,sum(Crw.InvAmt) as InvAmt
,sum(Crw.PoAmt) as PoAmt,
Crw.BudgetID,Crw.Budgetfileid , Crw.Available,  sum(Crw.ddd)  as bwamt,isnull(z.ETC,'') as ETC, isnull(z.EFC,'')as EFC ,isnull(z.CRWN,'0')as CRWN from(

select a.BudgetCategoryID,a.AccountTotal,a.categorynumber,a.accountnumber,a.accountdesc,sum(a.Totalcost) as InvAmt
,sum(a.po) as PoAmt,
a.BudgetID,a.Budgetfileid ,'YES' as Available, CASE WHEN a.Date between @Start and @End THEN  sum(a.TotalCost)
 ELSE '0' END as  ddd 
 from CRWDetail as a where a.BudgetCategoryID=@BudgetCategoryID and a.BudgetID=@BudgetID and a.BudgetFileid=@BudgetFileID
 group by  a.BudgetCategoryID,a.AccountTotal,a.categorynumber,a.accountnumber,a.accountdesc
,a.Date,a.BudgetID,a.Budgetfileid
) as Crw left join CRWGet as z on Crw.BudgetCategoryID=z.BudgetCategoryID and Crw.AccountNumber=z.AccountNumber
group by Crw.BudgetCategoryID,Crw.AccountTotal,Crw.categorynumber,Crw.accountnumber,Crw.accountdesc
,Crw.BudgetID,Crw.Budgetfileid,Crw.Available,z.ETC,z.EFC,z.CRWN


union  all
(
select b.BudgetCategoryID, a.AccountTotal, b.CategoryNumber,a.accountnumber,a.accountdesc, 0 as InvAmt,  0 as PoAmt
 ,a.BudgetID, a.BudgetFileID,'NO' as Available, '0' as BwAmt,isnull(z.ETC,'') as ETC, isnull(z.EFC,'')as EFC, isnull(z.CRWN,'')as CRWN
  from BudgetAccounts as a
  inner join BudgetCategory as b on a.CategoryId=b.cid
  left join CRWGet as z on b.BudgetCategoryID=z.BudgetCategoryID and a.AccountNumber=z.AccountNumber
   where a.BudgetID=@BudgetID and a.BudgetFileID=@BudgetFileID  and b.BudgetID=@BudgetID and b.BudgetCategoryID=@BudgetCategoryID
    and b.BudgetFileID=@BudgetFileID and a.AccountNumber !='' and a.AccountID not in (
  select distinct AccountID
  from CRWDetail  where Budgetid=@BudgetID and Budgetfileid=@BudgetFileID and BudgetCategoryID=@BudgetCategoryID
  )
group by b.BudgetCategoryID, a.AccountTotal, b.CategoryNumber,a.accountnumber,a.accountdesc
 ,a.BudgetID, a.BudgetFileID ,z.ETC,z.EFC,z.CRWN)
 order by accountnumber desc





END
GO