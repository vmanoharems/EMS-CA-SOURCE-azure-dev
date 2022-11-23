SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetStartEndRange]
	@CompanyId int
AS
BEGIN
	
	SET NOCOUNT ON;

   select StartRange,EndRange from PayrollFringeHeader a inner join TblAccounts b on a.TransactionCode=b.AccountId where SegmentType='Ledger' and CompanyId=@CompanyId
END



GO