SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[DeleteJournalEntryDetailById]
	-- Add the parameters for the stored procedure here
	@JournalEntryDetailId int,
	@Type nvarchar(50)
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	declare @jeId int
	set @jeId=(select JournalEntryId from JournalEntryDetail where JournalEntryDetailId=@JournalEntryDetailId)
	
	delete from JournalEntryDetail where JournalEntryDetailId=@JournalEntryDetailId

	exec [UpdateJournalEntryForLines]  @jeId;
END



GO