SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetJournalEntryDetailTransValue] -- GetJournalEntryDetailTransValue 2 
	-- Add the parameters for the stored procedure here
	@journalEntryId int
AS
BEGIN
declare @TransString nvarchar(50)
	SET NOCOUNT ON;

    -- Insert statements for procedure here
select TransactionCodeString,dbo.convertcodes(TransactionCodeString)as TransactionvalueString from JournalEntryDetail where JournalEntryId=@journalEntryId 






END



GO