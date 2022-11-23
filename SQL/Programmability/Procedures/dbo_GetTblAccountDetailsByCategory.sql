SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetTblAccountDetailsByCategory] -- GetTblAccountDetailsByCategory 3,'Detail'
 -- Add the parameters for the stored procedure here
 @ProdId int,
 @Category nvarchar(50)
AS
BEGIN
 -- SET NOCOUNT ON added to prevent extra result sets from
 -- interfering with SELECT statements.
 SET NOCOUNT ON;

    -- Insert statements for procedure here

 if(@Category='Detail')
 begin
 select a.AccountID,a.AccountCode,a.AccountName,isnull(a.BalanceSheet,0) as BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,c.Code,
 ISNULL(a.AccountTypeId,6) AS AccountTypeId,a.ParentId from TblAccounts a Inner Join AccountType c on a.AccountTypeId=c.AccountTypeID  where a.SegmentType='Detail' 
and a.SubLevel=1 and a.ProdId=@Prodid
union
select a.AccountID,b.AccountCode+'>'+a.AccountCode as AccountCode ,a.AccountName,isnull(a.BalanceSheet,0) as BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,c.Code,
 ISNULL(a.AccountTypeId,6) AS AccountTypeId,a.ParentId from TblAccounts a Inner Join
 TblAccounts b on a.ParentID=b.Accountid inner Join AccountType c on a.AccountTypeId=c.AccountTypeID
   where a.SegmentType='Detail' 
and a.SubLevel=2 and a.ProdId=@Prodid

union

select a.AccountID,d.AccountCode+'>'+b.AccountCode+'>'+a.AccountCode as AccountCode ,a.AccountName,isnull(a.BalanceSheet,0) as BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,c.Code,
 ISNULL(a.AccountTypeId,6) AS AccountTypeId,a.ParentId from TblAccounts a Inner Join
 TblAccounts b on a.ParentID=b.Accountid inner Join 
 TblAccounts d on b.ParentID=d.Accountid inner Join AccountType c on a.AccountTypeId=c.AccountTypeID
   where a.SegmentType='Detail' 
and a.SubLevel=3 and a.ProdId=@Prodid

union

select a.AccountID,e.AccountCode+'>'+d.AccountCode+'>'+b.AccountCode
+'>'+a.AccountCode as AccountCode ,a.AccountName,isnull(a.BalanceSheet,0) as BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,c.Code,
 ISNULL(a.AccountTypeId,6) AS AccountTypeId,a.ParentId from TblAccounts a Inner Join
 TblAccounts b on a.ParentID=b.Accountid inner Join 
 TblAccounts d on b.ParentID=d.Accountid inner Join tblaccounts e on  d.ParentID=e.Accountid
 inner Join AccountType c on a.AccountTypeId=c.AccountTypeID
   where a.SegmentType='Detail' 
and a.SubLevel=4 and a.ProdId=@Prodid

union

select a.AccountID,f.AccountCode+'>'+e.AccountCode+'>'+d.AccountCode+'>'+b.AccountCode
+'>'+a.AccountCode as AccountCode ,a.AccountName,isnull(a.BalanceSheet,0) as BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,c.Code,
 ISNULL(a.AccountTypeId,6) AS AccountTypeId,a.ParentId from TblAccounts a Inner Join
 TblAccounts b on a.ParentID=b.Accountid inner Join 
 TblAccounts d on b.ParentID=d.Accountid inner Join tblaccounts e on  d.ParentID=e.Accountid
 inner Join tblaccounts f on  e.ParentID=f.Accountid
 inner Join AccountType c on a.AccountTypeId=c.AccountTypeID
   where a.SegmentType='Detail' 
and a.SubLevel=5 and a.ProdId=@Prodid

union

select a.AccountID,g.AccountCode+'>'+f.AccountCode+'>'+e.AccountCode+'>'+d.AccountCode+'>'+b.AccountCode
+'>'+a.AccountCode as AccountCode ,a.AccountName,isnull(a.BalanceSheet,0) as BalanceSheet,a.Status,
a.Posting,isnull(a.SubLevel,'')as SubLevel,c.Code,
 ISNULL(a.AccountTypeId,6) AS AccountTypeId,a.ParentId from TblAccounts a Inner Join
 TblAccounts b on a.ParentID=b.Accountid inner Join 
 TblAccounts d on b.ParentID=d.Accountid inner Join tblaccounts e on  d.ParentID=e.Accountid
 inner Join tblaccounts f on  e.ParentID=f.Accountid
 inner Join tblaccounts g on  f.ParentID=g.Accountid
 inner Join AccountType c on a.AccountTypeId=c.AccountTypeID
   where a.SegmentType='Detail' 
and a.SubLevel=6 and a.ProdId=@Prodid

 Order by Accountcode Asc
 end
 
 else if(@Category='Ledger')
 begin
 select LedgerId as AccountID,AccountCode,AccountName,isnull(BalanceSheet,0) as BalanceSheet,LedgerAccounts.Status,Posting,isnull(SubLevel,0)as SubLevel, a.code  as Code,isnull(LedgerAccounts.AccountTypeId,6)as AccountTypeId,ParentId 
 from LedgerAccounts  left outer Join Accounttype a on LedgerAccounts.AccountTypeId=a.Accounttypeid  where LedgerAccounts.SegmentType=@Category and LedgerAccounts.ProdId=@ProdId
 Order by LedgerAccounts.AccountTypeId,Accountcode Asc
 end
 else
 begin
 select AccountID,AccountCode,AccountName,isnull(BalanceSheet,0) as BalanceSheet,Status,Posting,isnull(SubLevel,0)as SubLevel,''as Code,isnull(AccountTypeId,6)as AccountTypeId,ParentId 
 from TblAccounts where SegmentType=@Category and ProdId=@ProdId
 Order by Accountcode Asc
 end
 
END









GO