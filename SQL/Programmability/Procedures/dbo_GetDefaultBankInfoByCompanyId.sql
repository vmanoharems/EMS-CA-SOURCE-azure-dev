SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetDefaultBankInfoByCompanyId]
	-- Add the parameters for the stored procedure here
	@prodId int,
	@CompanyId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if  exists ( select b.BankId,b.Bankname from PayrollBankSetup p 
 left outer join bankinfo b on b.bankid=p.defaultbankId
  where p.DefaultCompanyID=@CompanyId and p.ProdID=@prodId)
  begin
   select b.BankId,b.Bankname from PayrollBankSetup p 
 left outer join bankinfo b on b.bankid=p.defaultbankId
  where p.DefaultCompanyID=@CompanyId and p.ProdID=@prodId
  end
  else
  begin
  select  BankId,Bankname from BankInfo where Prodid=@prodId

  end
END



GO