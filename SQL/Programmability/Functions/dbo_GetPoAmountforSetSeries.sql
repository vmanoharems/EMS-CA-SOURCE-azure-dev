SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE FUNCTION [dbo].[GetPoAmountforSetSeries]
(@COAID int, @Setid int ,@SeriesID int )
RETURNS Decimal(18,2)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @PoAmount decimal(18,2)

	-- Add the T-SQL statements to compute the return value here
    select @PoAmount=isnull(sum(Amount),0.00)  from PurchaseOrderline  where PolineStatus<>'Paid' and 
    COAID=@COAID and Setid=@Setid and SeriesId=@SeriesID

	-- Return the result of the function
	RETURN (@PoAmount)

END

GO