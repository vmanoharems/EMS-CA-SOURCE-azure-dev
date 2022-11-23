SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetPayrollOffsets] 
	@CompanyID int
AS
BEGIN
	
	SET NOCOUNT ON;

   
	SELECT a.*,b.AccountCode from PayrollOffset  a inner Join TblAccounts  b
	on a.OffsetAccount=b.AccountId 
	where CompanyID=@CompanyID 
End



GO