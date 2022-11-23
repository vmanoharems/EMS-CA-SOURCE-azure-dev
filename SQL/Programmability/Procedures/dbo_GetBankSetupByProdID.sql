SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetBankSetupByProdID]  -- GetBankSetupByProdID 2,3
( 
@CompanyID int,
@ProdID int

)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select isnull(b.VendorID,0) as VendorID,isnull(b.VendorName,'') as VendorName
	,c.BankId,isnull(c.Bankname,'') as Bankname from PayrollBankSetup as a 
	left join tblVendor as b on a.VendorID=b.VendorID
	left join BankInfo as c on a.DefaultBankId=c.BankId
	 where a.DefaultCompanyID=@CompanyID and a.ProdID= @ProdID

END



GO