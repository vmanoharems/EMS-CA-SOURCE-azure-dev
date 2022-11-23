SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetBankInfoPayroll]
	-- Add the parameters for the stored procedure here
	@CompanyId int,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select * from BankInfo where CompanyId=@CompanyId and ProdId=@ProdId
END



GO