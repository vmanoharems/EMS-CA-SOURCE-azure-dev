SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetAccountsNew]  -- exec GetBudgetAccountsNew 1,3
(
@BudgetFileID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--declare @StrBeforeDT varchar(200);
 --select @StrBeforeDT=SegStr1 from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@ProdID;

 declare @Masking varchar(50);

 select @Masking=SubAccount1 from Segment where Classification='Detail' and ProdId=@ProdID;

 declare @StrSeg varchar(100);

 select @StrSeg=SegStr1 from BudgetFile where BudgetFileID=@BudgetFileID;
	
 select distinct a.BudgetAccountID, a.AccountID, b.CategoryNumber,a.AccountNumber,a.AccountDesc,a.AccountFringe
	 ,a.AccountTotal ,isnull(c.COACode,'') as COACodeOriginal,a.COACODE as COACODE ,'RED' as Status,@Masking as Masking from
	  BudgetAccounts  as a inner join 
  BudgetCategory as b on a.CategoryId=b.cid 
  left join COA as c on a.COACODE=c.COACode and c.ProdId=@ProdID 
  where b.CategoryNumber!='' and a.AccountNumber!='' and a.BudgetFileID=@BudgetFileID and b.Budgetfileid=@BudgetFileID  and isnull(c.AccountTypeid,0) not in (4,5)
  union all
  (
--select distinct '' as BudgetAccountID,b.AccountId,c.CategoryNumber,b.AccountCode as  AccountNumber,
--b.AccountName as AccountDesc,'0' as AccountFringe,'0' as AccountTotal,a.COACode as COACodeOriginal ,'' as COACODE
--,'GREEN' as Status,@Masking as Masking
-- from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
--inner join BudgetCategory as c on a.SS1=c.CategoryNumber or a.SS2=c.CategoryNumber or
--a.SS3=c.CategoryNumber or
--a.SS4=c.CategoryNumber or
--a.SS5=c.CategoryNumber or a.SS6=c.CategoryNumber or a.SS7=c.CategoryNumber or a.SS8=c.CategoryNumber 
-- where a.DetailLevel=2 and a.ProdId=@ProdID and c.Budgetfileid=@BudgetFileID


select distinct '' as BudgetAccountID,b.AccountId,c.CategoryNumber,b.AccountCode as  AccountNumber,
b.AccountName as AccountDesc,'0' as AccountFringe,'0' as AccountTotal,a.COACode as COACodeOriginal ,'' as COACODE
,'GREEN' as Status,@Masking as Masking
 from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
 inner join TblAccounts as d on b.ParentId=d.AccountId
inner join BudgetCategory as c on d.AccountCode=c.CategoryNumber
 where a.DetailLevel=2 and a.ProdId=@ProdID and c.Budgetfileid=@BudgetFileID and a.COACode like @StrSeg+'|%'
 and a.COACode NOT in (
 select COACODE from BudgetAccounts where Budgetfileid=@BudgetFileID and COACode is not null --and COACODE like '01|10|101|600%'

 ) and isnull(a.AccountTypeid,0) not in (4,5)



  ) order by AccountNumber


	 

END





GO