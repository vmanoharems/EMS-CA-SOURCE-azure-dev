SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE FUNCTION [dbo].[GetPoAmount]
(@COAID int )
RETURNS Decimal(18,2)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @PoAmount decimal(18,2)

	-- Add the T-SQL statements to compute the return value here
    select @PoAmount=isnull(sum(DisplayAmount),0.00)  from PurchaseOrderline  where PolineStatus<>'Paid' and 
    COAID=@COAID

	-- Return the result of the function
	RETURN (@PoAmount)

END
GO