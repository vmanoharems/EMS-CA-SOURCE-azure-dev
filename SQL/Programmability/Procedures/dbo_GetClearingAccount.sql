SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetClearingAccount]
	-- Add the parameters for the stored procedure here
	@Type nvarchar(50),
	@CompanyId int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@Type='Payroll')
	begin

select * from AccountClearing where type='Payroll' and companyId=@CompanyId

	end
	else
	begin
select * from AccountClearing where type='Bank' and BankId=@CompanyId
	end
END



GO