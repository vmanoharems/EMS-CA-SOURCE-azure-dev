SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateJEDDetailByType] 
	-- Add the parameters for the stored procedure here
	@Type nvarchar(50),
	@JEDId int,
	@TransactionString nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	update JournalEntryDetail set TransactionCodeString=@TransactionString where JournalEntryDetailId=@JEDId
END



GO