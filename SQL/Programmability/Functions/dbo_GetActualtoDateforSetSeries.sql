SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE FUNCTION [dbo].[GetActualtoDateforSetSeries]
(@COAID int,@SetId int,@SeriesId int )

RETURNS Decimal(18,2)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ActualtoDateAmount decimal(18,2)

	-- Add the T-SQL statements to compute the return value here
    select @ActualtoDateAmount=isnull(sum(Amount),0.00)  from invoiceline  where InvoiceLineStatus='Paid' and 
 COAID=@COAID  and Setid=@Setid and SeriesID=@SeriesId

	-- Return the result of the function
	RETURN (@ActualtoDateAmount)

END

GO