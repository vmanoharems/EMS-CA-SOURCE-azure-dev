SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetLedgerDetailByProdId]-- GetLedgerDetailByProdId 3 
 @ProdId int
AS
BEGIN

 SET NOCOUNT ON;

 
DECLARE @Data TABLE (
  Accountid int
  , Count int
)
INSERT INTO @Data

 select ParentId,Count(ParentId) as Count   from tblAccounts where ParentId   is not null and ProdId=@ProdId and SubLevel>1 group by ParentId

 declare @t table (
CHILD int, AccountCode varchar(50),AccountName nvarchar(50),BalanceSheet bit,
Status bit,Posting bit,SubLevel int,AccountTypeId int,ChildCount int
,PARENT int,ParentCode nvarchar(50),AccountId int)


insert into @t 
select  a.AccountID , AccountCode ,AccountName ,BalanceSheet ,
Status ,Posting ,isnull(SubLevel,0) as SubLevel ,iSNULL(AccountTypeId,6) AS AccountTypeId
,isnull(d.count,0) as Childcount, 
0 as PARENT,AccountCode,a.AccountId 
 from TblAccounts a Left Outer Join @Data d on a.AccountId=d.Accountid where SegmentType  in ('Detail')
 and sublevel=1 and ProdId=@ProdId

 union all
 select  a.AccountID , AccountCode ,AccountName ,BalanceSheet ,
Status ,Posting ,isnull(SubLevel,0) as SubLevel ,iSNULL(AccountTypeId,6) AS AccountTypeId
,isnull(d.count,0) as Childcount, 
isnull(ParentId,0) as PARENT,AccountCode,a.AccountId 
 from TblAccounts a Left Outer Join @Data d on a.AccountId=d.Accountid where SegmentType  in ('Detail')
 and sublevel>1  and ProdId=@ProdId

;with n(CHILD, AccountCode,AccountName,BalanceSheet,Status,Posting,SubLevel,AccountTypeId,PARENT, GENERATION, hierarchy,hierarchy2,ChildCount,AccountId) as (
select CHILD,AccountCode,AccountName,BalanceSheet,Status,Posting,SubLevel,AccountTypeId, PARENT,0, CAST(AccountCode as nvarchar(max)) as GENERATION,CAST(AccountCode as nvarchar(max)) as hierarchy2,ChildCount,AccountId  from @t 
where PARENT=0
union all
select nplus1.CHILD,nplus1.AccountCode,nplus1.AccountName,nplus1.BalanceSheet,nplus1.Status,nplus1.Posting,nplus1.SubLevel,nplus1.AccountTypeId,
 nplus1.PARENT, GENERATION+1, 
cast(n.hierarchy + '>' + CAST(nplus1.AccountCode as nvarchar(max)) as nvarchar(max)),
cast(n.hierarchy2 + ' ' + CAST(nplus1.AccountCode as nvarchar(max)) as nvarchar(max)),
nplus1.ChildCount,nplus1.AccountId
 from 
@t as nplus1 inner join n on nplus1.PARENT=n.CHILD   
)
select  CHILD , AccountCode ,AccountName ,BalanceSheet ,
Status ,Posting ,SubLevel ,AccountTypeId ,PARENT,hierarchy,hierarchy2,ChildCount,AccountId
from n 
order by hierarchy



END





GO