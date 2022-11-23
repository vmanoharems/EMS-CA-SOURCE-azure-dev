SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetPayrollFringeByCompanyID]
	@CompanyID int
AS
BEGIN
	
	SET NOCOUNT ON;

   
	SELECT a.PayrollFringeHeaderID,a.LOId,b.AccountCode as LOCode ,a.EpiId,c.AccountCode as EpiCode,a.SetId,d.AccountCode as SetCode,a.StartRange,e.AccountCode as StartRangeCode,
	a.EndRange,f.AccountCode as EndRangeCode,a.FringeAccount,g.AccountCode as FringCode,a.BananasId,h.AccountCode as BanasCode,a.TransactionCode from PayrollFringeHeader a Left Outer Join 
	TblAccounts b on a.LOId=b.AccountId Left Outer Join
	TblAccounts c on a.EpiId=c.AccountId Left Outer Join
	TblAccounts d on a.SetId=d.AccountId Left Outer Join
	TblAccounts e on a.StartRange=e.AccountId  Left Outer Join
	TblAccounts f on a.EndRange=f.AccountId  Left Outer Join
    TblAccounts g on a.FringeAccount=g.AccountId Left Outer Join
	TblAccounts h on a.BananasId=h.AccountId   
	 where a.companyId=@CompanyID

End



GO