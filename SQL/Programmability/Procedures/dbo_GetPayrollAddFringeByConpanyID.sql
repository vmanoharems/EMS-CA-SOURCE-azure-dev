SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetPayrollAddFringeByConpanyID]
	@CompanyID int
AS
BEGIN
	
	SET NOCOUNT ON;

   
	SELECT * from PayrollFringetable  where CompanyID=@CompanyID
End



GO