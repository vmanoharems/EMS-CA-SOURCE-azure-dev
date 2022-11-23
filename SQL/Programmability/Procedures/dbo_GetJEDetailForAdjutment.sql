SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetJEDetailForAdjutment] -- GetJEDetailForAdjutment 3
	-- Add the parameters for the stored procedure here
	@prodId int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select JournalEntryDetailId,JournalEntryId, COAString,VendorName,TransactionLineNumber,ThirdParty,CreditAmount,DebitAmount,TransactionCodeString,dbo.convertcodes(TransactionCodeString)as TransactionvalueString  from JournalEntryDetail where ProdId=@prodId
END


--select  *from JournalEntryDetail


GO