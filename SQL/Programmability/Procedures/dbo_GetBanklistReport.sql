SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetBanklistReport]  -- GetBanklistReport 14
	
	@ProdID int 
AS
BEGIN
	
	SET NOCOUNT ON;

	 select  B.BankId,B.RoutingNumber,B.Bankname,B.AccountNumber,B.BranchNumber,B.Address1,isnull(C.StartNumber,0) as StartNumber,isnull(C.EndNumber,0) as EndNumber,
 isnull(C.Collated,0) as Collated,isnull(C.Copies,0) as Copies,
 case when AP.clearingType='COA'
 then Isnull((select isnull(AccountCode,'')  from TblAccounts  where accountid in (select isnull(AccountId,0) from COA where COAID=isnull(AP.COAId,0))),'')
 else 
 isnull((select isnull(AccountCode,'')  from TblAccounts  where accountid=isnull(AP.COAId,0)),'') end
  as APClearing,
   case when CASH.clearingType='COA'
 then isnull((select AccountCode  from TblAccounts  where accountid in (select isnull(AccountId,0) from COA where COAID=isnull(CASH.COAId,0))),'')
 else 
 isnull((select isnull(AccountCode,'')  from TblAccounts  where accountid=isnull(CASH.COAId,0)),'') end
  as CASHAccount,
 'USD' as CurrencyName,
 B.Address2,B.Address3,B.city,B.State,B.zip,B.Country
  from BankInfo B
   Inner Join CheckSetting C on C.BankID=B.BankId 
   Left join AccountClearing AP on AP.BankId=B.BankId and AP.CompanyId=B.CompanyId and AP.AccountName='APClearing'
   Left join AccountClearing CASH on CASH.BankId=B.BankId and CASH.CompanyId=B.CompanyId and Cash.AccountName='CashAccount'
   where B.Prodid= @ProdID Order by B.Bankid
	  
END




GO