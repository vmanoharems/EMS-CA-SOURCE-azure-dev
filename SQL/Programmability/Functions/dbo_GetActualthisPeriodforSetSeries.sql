SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[GetActualthisPeriodforSetSeries]
(@COAID int, @startdate datetime,@Enddate datetime,@SetID Int,@Seriesid Int)

RETURNS Decimal(18,2)
AS
BEGIN
	DECLARE @ActualthisPeriodAmount decimal(18,2)

	
    select @ActualthisPeriodAmount=isnull(sum(Amount),0.00)  from invoiceline  where InvoiceLineStatus='Paid' and 
 COAID=@COAID and Setid=@SetID and SeriesID=@Seriesid  and CreatedDate between @startdate and @Enddate

	RETURN (@ActualthisPeriodAmount)

END
GO