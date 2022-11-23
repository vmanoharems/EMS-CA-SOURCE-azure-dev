SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetAccounts] 
(
@BudgetFileID int,
@ProdID int,
@CreateCOA varchar(500)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	if(LEN(@CreateCOA)>0)
	begin
	exec CreateCOAfromBudgetCategory @CreateCOA ,@ProdID
    end
--select BudgetAccountID,AccountID,AccountNumber,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,AccountVariance
-- from BudgetAccounts where BudgetFileID=@BudgetFileID


  
 --select  a.BudgetAccountID,a.AccountID,a.AccountNumber,a.AccountDesc,a.AccountFringe,a.AccountOriginal,a.AccountTotal,a.AccountVariance,b.CategoryNumber ,
 --'NO' as Available from BudgetAccounts as a inner join BudgetCategory as b on a.CategoryId=b.cid
 -- where a.BudgetFileID=@BudgetFileID and b.Budgetfileid=@BudgetFileID and a.AccountNumber not in
	-- (select AccountCode from TblAccounts where ProdId=@ProdID and SegmentType='Detail' and SubLevel=3)
	-- union all
	-- (
 --select a.BudgetAccountID,a.AccountID,a.AccountNumber,a.AccountDesc,a.AccountFringe,a.AccountOriginal,a.AccountTotal,a.AccountVariance,b.CategoryNumber ,
 --'YES' as Available from BudgetAccounts as a inner join BudgetCategory as b on a.CategoryId=b.cid
 -- where a.BudgetFileID=@BudgetFileID and b.Budgetfileid=@BudgetFileID and a.AccountNumber in 
	-- (select AccountCode from TblAccounts where ProdId=@ProdID and SegmentType='Detail' and SubLevel=3))
	-- order by AccountNumber

	declare @DetailLevel varchar(10);
	 
	 select @DetailLevel=SegmentLevel from Segment where Classification='Detail' and ProdId=@ProdID and SegmentStatus='Completed'

	 if(@DetailLevel=4)
	 begin

	 select distinct a.BudgetAccountID, a.AccountID, b.CategoryNumber,a.AccountNumber,a.AccountDesc,a.AccountFringe,a.AccountTotal ,isnull(c.COACode,'') as COACode ,'RED' as Status from
	  BudgetAccounts  as a inner join 
  BudgetCategory as b on a.CategoryId=b.cid 
  left join COA as c on b.S1=c.SS1 and  b.S2=c.SS2 and  b.S3=c.SS3 and  c.SS4=b.S4+'!'+a.AccountNumber and c.ProdId=@ProdID
  where b.CategoryNumber!='' and a.AccountNumber!='' and a.BudgetFileID=@BudgetFileID and b.Budgetfileid=@BudgetFileID  
  union all
  (
select '' as BudgetAccountID, '' as AccountID, AccountId as CategoryNumber , AccountCode as AccountNumber ,AccountName as  AccountDesc , '0' as AccountFringe ,'0' as AccountTotal ,'' as COACode ,'GREEN' as 
Status
 from TblAccounts where AccountCode not in(
  select AccountNumber from BudgetAccounts where AccountNumber not in (  select distinct substring(SS5,CHARINDEX('!',SS5)+1,LEN(SS5)-CHARINDEX('!',SS5)+1)
    from COA  where SS5<>'' and 
  substring(SS5,CHARINDEX('!',SS5)+1,LEN(SS5)-CHARINDEX('!',SS5)+1)  not like '%!%' and ProdId=@ProdID) and BudgetFileID=1) and SegmentType='Detail'
   and SubLevel=1 and ProdId=@ProdID
  ) order by AccountNumber




	 end
	 else if(@DetailLevel=5)
	 begin

	 select distinct a.BudgetAccountID, a.AccountID, b.CategoryNumber,a.AccountNumber,a.AccountDesc,a.AccountFringe,a.AccountTotal ,isnull(c.COACode,'') as COACode ,'RED' as Status from BudgetAccounts  as a inner join 
  BudgetCategory as b on a.CategoryId=b.cid 
  left join COA as c on b.S1=c.SS1 and  b.S2=c.SS2 and  b.S3=c.SS3 and  b.S4=c.SS4 and  c.SS5=b.S3+'!'+a.AccountNumber and c.ProdId=@ProdID
  where b.CategoryNumber!='' and a.AccountNumber!='' and a.BudgetFileID=@BudgetFileID and b.Budgetfileid=@BudgetFileID  
  union all
  (
select '' as BudgetAccountID, '' as AccountID ,AccountId as CategoryNumber , AccountCode as AccountNumber ,AccountName as  AccountDesc , '0' as AccountFringe ,'0' as AccountTotal ,'' as COACode ,'GREEN' as 
Status
 from TblAccounts where AccountCode not in(
  select AccountNumber from BudgetAccounts where AccountNumber not in (  select distinct substring(SS5,CHARINDEX('!',SS5)+1,LEN(SS5)-CHARINDEX('!',SS5)+1)
    from COA  where SS5<>'' and 
  substring(SS5,CHARINDEX('!',SS5)+1,LEN(SS5)-CHARINDEX('!',SS5)+1)  not like '%!%' and ProdId=@ProdID) and BudgetFileID=1) and SegmentType='Detail'
   and SubLevel=1 and ProdId=@ProdID
  ) order by AccountNumber




	 end
	  else if(@DetailLevel=6)
	 begin
	 select distinct a.BudgetAccountID, a.AccountID, b.CategoryNumber,a.AccountNumber,a.AccountDesc,a.AccountFringe,a.AccountTotal ,isnull(c.COACode,'') as COACode,'RED' as Status from BudgetAccounts  as a inner join 
  BudgetCategory as b on a.CategoryId=b.cid 
  left join COA as c on b.S1=c.SS1 and  b.S2=c.SS2 and  b.S3=c.SS3 and  b.S4=c.SS4 and c.SS5=b.S5 and c.SS6=b.S3+'!'+a.AccountNumber and c.ProdId=@ProdID
  where b.CategoryNumber!='' and a.AccountNumber!='' and a.BudgetFileID=@BudgetFileID and b.Budgetfileid=@BudgetFileID  
  union all
  (
select  '' as BudgetAccountID,'' as AccountID, AccountId as CategoryNumber , AccountCode as AccountNumber ,AccountName as  AccountDesc , '0' as AccountFringe ,'0' as AccountTotal ,'' as COACode ,'GREEN' as 
Status
 from TblAccounts where AccountCode not in(
  select AccountNumber from BudgetAccounts where AccountNumber not in (  select distinct substring(SS5,CHARINDEX('!',SS5)+1,LEN(SS5)-CHARINDEX('!',SS5)+1)
    from COA  where SS5<>'' and 
  substring(SS5,CHARINDEX('!',SS5)+1,LEN(SS5)-CHARINDEX('!',SS5)+1)  not like '%!%' and ProdId=@ProdID) and BudgetFileID=1) and SegmentType='Detail'
   and SubLevel=1 and ProdId=@ProdID
  ) order by AccountNumber


	 end
	 

END




GO