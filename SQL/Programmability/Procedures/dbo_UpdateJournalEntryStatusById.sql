SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[UpdateJournalEntryStatusById] -- UpdateJournalEntryStatusById '1,3'
	-- Add the parameters for the stored procedure here
	@JEId nvarchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	update JournalEntry set AuditStatus='Posted', PostedDate=GETDATE() where JournalEntryId in (( SELECT * FROM dbo.SplitId(@JEId,',')))


	select JournalEntryId , TransactionNumber From JournalEntry where JournalEntryId in (( SELECT * FROM dbo.SplitId(@JEId,',')))
END




GO