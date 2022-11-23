SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[GetActualthisPeriodforSet]
(@COAID int, @startdate datetime,@Enddate datetime,@SetID int)

RETURNS Decimal(18,2)
AS
BEGIN
	DECLARE @ActualthisPeriodAmount decimal(18,2)

		select  @ActualthisPeriodAmount=isnull(isnull(sum(a.debitAmount),0)-Isnull(sum(a.creditamount),0),0)  from JOurnalEntrydetail a
	 Inner Join JOurnalEntry b on a.JOurnalEntryID=b.JournalEntryID
	where  b.Auditstatus='Posted' and a.COAID=@COAID and a.Setid=@SetID and b.Posteddate is not null and b.Posteddate between @startdate and @Enddate;


	
 --   select @ActualthisPeriodAmount=isnull(sum(Amount),0.00)  from invoiceline  where InvoiceLineStatus='Paid' and 
 --COAID=@COAID and Setid=@SetID  and CreatedDate between @startdate and @Enddate

	RETURN (@ActualthisPeriodAmount)

END

GO