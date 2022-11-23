SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollVendor] 
(
@CID int,
@ProdID int,
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CCCODE varchar(50);

	if(@Mode=1)
	begin

	select @CCCODE=CompanyCode from Company where CompanyID=@CID;


	select isnull(b.VendorID,0) as VendorID,isnull(b.VendorName,'') as VendorName
	,c.BankId,isnull(c.Bankname,'') as Bankname,@CCCODE as CCode from PayrollBankSetup as a 
	left join tblVendor as b on a.VendorID=b.VendorID
	left join BankInfo as c on a.DefaultBankId=c.BankId
	 where a.DefaultCompanyID=@CID and a.ProdID=@ProdID
	 end
	 else 

	 begin

	 declare @CompanyID int;

	 select @CompanyID=CompanyID from PayrollFile where PayrollFileID=@CID;

	 select @CCCODE=CompanyCode from Company where CompanyID=@CompanyID;

	 select isnull(b.VendorID,0) as VendorID,isnull(b.VendorName,'') as VendorName
	,c.BankId,isnull(c.Bankname,'') as Bankname,@CCCODE as CCode from PayrollBankSetup as a 
	left join tblVendor as b on a.VendorID=b.VendorID
	left join BankInfo as c on a.DefaultBankId=c.BankId
	 where a.DefaultCompanyID=@CompanyID and a.ProdID=@ProdID

	 end
END



GO