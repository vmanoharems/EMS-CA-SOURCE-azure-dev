SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



Create FUNCTION [dbo].[GetSetAmount]
(@COAID int ,@BudgetID int, @BudgetFileID int)

RETURNS Decimal(18,2)
AS
BEGIN
	
	DECLARE @ActualtoDateAmount decimal(18,2)
 
   select  @ActualtoDateAmount=isnull(sum(cast(Budget as float)),0)
     from EstimatedCostSet 	where BudgetID=@BudgetID and BudgetFileID=@BudgetFileID and COAID=@COAID ;


	-- Return the result of the function
	RETURN (@ActualtoDateAmount)

END

 
GO