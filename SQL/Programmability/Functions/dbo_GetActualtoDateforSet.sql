SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE FUNCTION [dbo].[GetActualtoDateforSet]
(@COAID int ,@Setid int)

RETURNS Decimal(18,2)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ActualtoDateAmount decimal(18,2)

	-- Add the T-SQL statements to compute the return value here
 --   select @ActualtoDateAmount=isnull(sum(Amount),0.00)  from invoiceline  where InvoiceLineStatus='Paid' and 
 --COAID=@COAID and Setid=@Setid

 select  @ActualtoDateAmount=isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(a.creditamount),0),0)  from JOurnalEntrydetail a
	 Inner Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
	where  b.Auditstatus='Posted' and a.COAID=@COAID and a.Setid=@SetID and b.Posteddate is not null;

	-- Return the result of the function
	RETURN (@ActualtoDateAmount)

END


GO