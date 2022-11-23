SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

Create FUNCTION [dbo].[GetActualtoDateWithOutSet]
(@COAID int )

RETURNS Decimal(18,2)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ActualtoDateAmount decimal(18,2)
 --   select @ActualtoDateAmount=isnull(sum(Amount),0.00)  from invoiceline  where InvoiceLineStatus='Paid' and 
 --COAID=@COAID 

   select  @ActualtoDateAmount=isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(creditamount),0),0)  from JOurnalEntrydetail a Inner Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
	where  b.Auditstatus='Posted' and COAID=@COAID and SetId is null


	-- Return the result of the function
	RETURN (@ActualtoDateAmount)

END

GO