SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetPayrollAddRange]
@CompanyID int
AS
BEGIN
	
	SET NOCOUNT ON;

   
	SELECT * from PayrollOffset  where CompanyID=@CompanyID
End


GO