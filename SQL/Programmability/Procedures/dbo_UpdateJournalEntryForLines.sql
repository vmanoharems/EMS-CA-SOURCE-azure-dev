SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[UpdateJournalEntryForLines]
	-- Add the parameters for the stored procedure here
	@JournalEntryId int
AS
BEGIN

declare @Count int, @TotalCredit decimal(18,2),@TotalDebit decimal(18,2),@Balance decimal(18,2)
	SET NOCOUNT ON;

	select @Count=count(*), @TotalCredit=sum(CreditAmount), @TotalDebit=sum(DebitAmount), @Balance=sum(DebitAmount)-sum(CreditAmount)
	from JournalEntryDetail 
	where COAID is not null
	AND JournalEntryId=@JournalEntryId

	update JournalEntry set TotalLines=@Count,CreditTotal=@TotalCredit,DebitTotal=@TotalDebit
	,ImbalanceAmount=ABS(@Balance)
	 where  JournalEntryId=@JournalEntryId
END
GO