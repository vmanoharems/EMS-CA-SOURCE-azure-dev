SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetJEntryByJEId] -- GetJEntryByJEId 1007
	-- Add the parameters for the stored procedure here
	@JournalEntryId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select JournalEntryId,TransactionNumber,CreditTotal,DebitTotal,ImbalanceAmount,
	convert(varchar(10),EntryDate,101) As EntryDate,BatchNumber,CompanyId,Description,ReferenceNumber,Source,ClosePeriod,
	isnull(DocumentNo,'')as DocumentNo from JournalEntry where JournalEntryId=@JournalEntryId
END


GO