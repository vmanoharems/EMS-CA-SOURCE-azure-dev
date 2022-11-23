SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetCategory]  --  exec GetBudgetCategory 1,3
(
@BudgetFileID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	

	--select BudgetCategoryID, cID,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal 
	--,CategoryTotal,CategoryVariance ,'NO' as Available from BudgetCategory where BudgetFileID=@BudgetFileID and CategoryNumber not in
	-- (select AccountCode from TblAccounts where ProdId=@ProdID and SegmentType='Ledger')

	-- union all
	-- (
	-- select BudgetCategoryID, cID,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal 
	--,CategoryTotal,CategoryVariance ,'YES' as Available from BudgetCategory where BudgetFileID=@BudgetFileID and CategoryNumber  in
	-- (select AccountCode from TblAccounts where ProdId=@ProdID and SegmentType='Ledger')
	-- ) order by CategoryNumber



	

--select a.BudgetCategoryID, a.cid,a.CategoryNumber,a.CategoryDescription,a.CategoryFringe,a.CategoryTotal,'RED' as Abailable ,b.SegStr1,b.SegStr2,isnull(c.COACode,'') as COACode
-- from BudgetCategory as a
--inner join BudgetFile as b on a.Budgetfileid=b.BudgetFileID 
--left join COA as c on b.prodid=c.ProdId and c.SS1=a.S1 and c.SS2=a.S2 and c.SS3=a.S3 and c.SS4=a.S4 and c.SS5=a.S5 and c.SS6=a.S6 and c.SS7=a.S7 and c.SS8=a.S8 
-- where a.Budgetfileid=@BudgetFileID and a.CategoryNumber!='' 

-- Union all
-- (
-- select '' as BudgetCategoryID,'' as cid ,AccountCode as CategoryNumber ,AccountName as CategoryDescription , '0'  as CategoryFringe,'0' as CategoryTotal,'GREEN' as Abailable
-- ,'' as SegStr1,'' as SegStr2 , '' as COACode
--   from TblAccounts where ProdId=@ProdID and AccountCode not in (select CategoryNumber from BudgetCategory where Budgetfileid=@BudgetFileID and CategoryNumber  is not null) 
--   and SegmentType='Ledger'
-- ) order by CategoryNumber

 declare @StrBeforeDT varchar(200);
 select @StrBeforeDT=SegStr1 from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@ProdID;

 declare @Masking varchar(50);

 select @Masking=CodeLength from Segment where Classification='Detail' and ProdId=@ProdID;


select a.BudgetCategoryID, a.cid,a.CategoryNumber,a.CategoryDescription,a.CategoryFringe,a.CategoryTotal,
'RED' as Abailable ,isnull(c.COACode,'') as COACodeOriginal,a.COACODE,@Masking as Masking
 from BudgetCategory as a
inner join BudgetFile as b on a.Budgetfileid=b.BudgetFileID 
left join COA as c on b.prodid=c.ProdId and a.COACODE=c.COACode --and c.AccountTypeid not in (4,5)
 where a.Budgetfileid=@BudgetFileID and a.CategoryNumber!=''  and isnull(c.AccountTypeid,0) not in (4,5)

 Union all
 (
 select '' as BudgetCategoryID,'' as cid ,b.AccountCode as CategoryNumber ,AccountName as CategoryDescription ,
  '0'  as CategoryFringe,'0' as CategoryTotal,'GREEN' as Abailable , a.COACode as COACodeOriginal ,'' as COACODE,@Masking as Masking
   from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
    where a.ProdId=@ProdID and a.COACode not in (select COACODE from BudgetCategory where
    Budgetfileid=@BudgetFileID and CategoryNumber  is not null  
	 )  and a.COACode like '%'+@StrBeforeDT+'|%' and a.DetailLevel=1  and isnull(a.AccountTypeid,0) not in (4,5)
 ) order by CategoryNumber



END




GO