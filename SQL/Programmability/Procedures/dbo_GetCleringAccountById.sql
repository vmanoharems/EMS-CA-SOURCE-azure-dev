SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCleringAccountById]
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
	
	select COAId,AccountCode,AccountName,AccountClearingId,ClearingType from AccountClearing 
	
	where Type=@Type and CompanyId=@CompanyId
	end
	else
	begin
	
select COAId,AccountCode,AccountName,AccountClearingId,ClearingType from AccountClearing 
	
	where Type=@Type and BankId=@CompanyId

	end
END



GO