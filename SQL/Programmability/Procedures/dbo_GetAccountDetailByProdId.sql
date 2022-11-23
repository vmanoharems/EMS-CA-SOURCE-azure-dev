SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetAccountDetailByProdId]  -- GetAccountDetailByProdId 14
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @Accounts table (
AccountID int, AccountCode varchar(50),AccountName nvarchar(50),BalanceSheet bit,
Status bit,Posting bit,SubLevel int,AccountTypeId int
,ParentID int,ParentCode nvarchar(50)
)
  insert into @Accounts 
select a.AccountID,a.AccountCode,a.AccountName,a.BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,
 ISNULL(a.AccountTypeId,6) AS AccountTypeId  ,0 as ParentId,b.Accountcode as ParentCode  from tblAccounts a inner Join LedgerAccounts b on a.ParentID=b.LedgerId
   where a.SegmentType in ('Detail') and b.segmenttype in ('Ledger')and a.ProdId=@ProdId
 and a.sublevel=1  
 union all
 select a.AccountID,a.AccountCode,a.AccountName,a.BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,
  ISNULL(a.AccountTypeId,6) AS AccountTypeId,isnull(a.ParentId,0)as ParentId,b.Accountcode as ParentCode   from tblAccounts a,tblaccounts b where a.SegmentType in ('Detail') and b.segmenttype in ('Detail') and b.ParentId<>0
and a.ParentID=b.AccountID and a.sublevel>1 and b.sublevel>0 and a.ProdId=@ProdId;

   
;with cte as
(
select
   AccountID,
   AccountCode,
   AccountName,
   BalanceSheet,
   a.Status,
   Posting,
   SubLevel,
   a.AccountTypeId,
   AT.Code,
   ParentId,
   ParentCode,
    cast(row_number()over(partition by parentid order by AccountCode) as varchar(max)) as [path],
    0 as level,
    (row_number()over(partition by parentid order by AccountCode) / power(100.0,0)) as x
 
from @Accounts  a Inner Join AccountType AT on a.AccountTypeID=AT.AccountTypeID
where SubLevel=1 
union all
select
    t.AccountID,
   t.AccountCode,
  t.AccountName,
  t.BalanceSheet,
  t.Status,
   t.Posting,
   t.SubLevel,
  t.AccountTypeId,
  AT.Code,
   t.ParentId,
  t.ParentCode,
    [path] +'-'+ cast(row_number()over(partition by t.parentid order by t.AccountCode) as varchar(max)),
    level+1,
    x + row_number()over(partition by t.parentid order by t.AccountCode) / power(100.0 ,level+1)
 
from
    cte
join @Accounts t on  cte.AccountID = t.ParentID Inner Join AccountType AT on  t.Accounttypeid=AT.AccountTypeID where t.Sublevel>1
)


   
select
     cte.AccountID,
   cte.AccountCode,
   cte.AccountName,
   cte.BalanceSheet,
   cte.Status,
   cte.Posting,
   cte.SubLevel,
   cte.AccountTypeId,
   cte.Code,
   L.LedgerID as ParentID,
   cte.ParentCode,
    cte.[path]
	,cte.x
from cte left outer Join LedgerAccounts L on cte.Parentcode=L.Accountcode where cte.Sublevel=1

Union all
select
     AccountID,
   AccountCode,
   AccountName,
   BalanceSheet,
   Status,
   Posting,
   SubLevel,
   AccountTypeId,
   Code,
   ParentID,
   ParentCode,
    [path]
	,x
from cte where Sublevel>1
order by x,AccountTypeId,ParentCode,AccountCode asc

END

GO