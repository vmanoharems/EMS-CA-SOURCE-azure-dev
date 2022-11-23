SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[GetDetailAccountNoParent]
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
 ISNULL(a.AccountTypeId,6) AS AccountTypeId  ,isnull(a.ParentId,0)as ParentId,'' as ParentCode  from tblAccounts  a
   where a.SegmentType in ('Detail') and  a.ProdId=@Prodid and a.sublevel=1  and (a.parentid is null or a.ParentId=0) 

 union all
 select a.AccountID,a.AccountCode,a.AccountName,a.BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,
  ISNULL(a.AccountTypeId,6) AS AccountTypeId,isnull(a.ParentId,0)as ParentId,b.Accountcode as ParentCode   from tblAccounts a,tblaccounts b where a.SegmentType in ('Detail') and b.segmenttype in ('Detail')
and a.ParentID=b.AccountID and a.sublevel>1 and b.sublevel>=1 and a.ProdId=@ProdId;

;with cte as
(
select
   AccountID,
   AccountCode,
   AccountName,
   BalanceSheet,
   Status,
   Posting,
   SubLevel,
   AccountTypeId,
   ParentId,
   ParentCode,
    cast(row_number()over(partition by parentid order by AccountCode) as varchar(max)) as [path],
    0 as level,
    row_number()over(partition by parentid order by AccountCode) / power(10.0,0) as x
 
from @Accounts
where parentid = 0 
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
   t.ParentId,
  t.ParentCode,
    [path] +'-'+ cast(row_number()over(partition by t.parentid order by t.AccountCode) as varchar(max)),
    level+1,
    x + row_number()over(partition by t.parentid order by t.AccountCode) / power(10.0,level+1)
 
from
    cte 
  Join @Accounts t on cte.AccountID = t.ParentID 
)
   
select
     AccountID,
   AccountCode,
   AccountName,
   BalanceSheet,
   Status,
   Posting,
   SubLevel,
   AccountTypeId,
   ParentId,
   ParentCode,
    [path],
    x
from cte 
order by [path],AccountTypeId
END




GO