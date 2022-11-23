SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[DeleteJEandJEDetail]
	-- Add the parameters for the stored procedure here
	@JournalEntryId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	--///////////////////////////////////////////////////////////////////// Edit By Sanjay end - 24/11/2016

	delete from JournalEntryDetail where JournalEntryId=@JournalEntryId
	delete from JournalEntry where JournalEntryId=@JournalEntryId


	--update JournalEntry set AuditStatus='New',DebitTotal=null,CreditTotal=null,TotalLines=null,
	--ImbalanceAmount=null,PostedDate=null,BatchNumber=null
	-- where JournalEntryId=@JournalEntryId 
END

GO