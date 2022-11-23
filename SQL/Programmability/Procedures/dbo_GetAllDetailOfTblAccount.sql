SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetAllDetailOfTblAccount]
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here


	select * from  LedgerAccounts  where SegmentType='Ledger'  and ProdId=@ProdId
	order by LedgerId,AccountTypeId
END



GO