SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


create FUNCTION [dbo].[GetBlankEFC]
(@COAID int,@BudgetID int, @BudgetFileID int )

RETURNS Decimal(18,2)
AS
BEGIN
	
	DECLARE @ReturnValue decimal(18,2)
 
   select  @ReturnValue=isnull(BlankEFC,0) 
    from EstimatedCost
	where  COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID


	-- Return the result of the function
	RETURN (@ReturnValue)

END

GO