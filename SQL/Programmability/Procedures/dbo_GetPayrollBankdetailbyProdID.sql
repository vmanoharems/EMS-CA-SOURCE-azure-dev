SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetPayrollBankdetailbyProdID] --GetPayrollBankdetailbyProdID 1
@CompanyID int
AS
BEGIN
	
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	select DefaultBankId as BankID,b.Bankname as BankName
	 from PayrollBankSetup a,BankInfo b
	where a.DefaultCompanyID=@CompanyID and a.DefaultBankId=b.BankId 
	END

	


GO