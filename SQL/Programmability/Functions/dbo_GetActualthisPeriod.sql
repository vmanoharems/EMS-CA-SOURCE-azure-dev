SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE FUNCTION [dbo].[GetActualthisPeriod]
(@COAID int, @startdate datetime,@Enddate datetime)

RETURNS Decimal(18,2)
AS
BEGIN
	
	DECLARE @ActualthisPeriodAmount decimal(18,2)

  --select @ActualthisPeriodAmount=isnull(sum(a.Amount),0.00)  from invoiceline as a
  --inner join PaymentLine as b on a.InvoiceID=b.InvoiceId
  --inner join Payment as c on b.PaymentId=c.PaymentID and c.Status='Printed'
  --  where 
  -- a.COAID=@COAID and a.CreatedDate between @startdate and @Enddate

	select  @ActualthisPeriodAmount=isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(a.creditamount),0),0)  from JOurnalEntrydetail a
	 Inner Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
	where  b.Auditstatus='Posted' and a.COAID=@COAID and b.Posteddate is not null and b.Posteddate between @startdate and @Enddate;
	RETURN (@ActualthisPeriodAmount)

END


GO