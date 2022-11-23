SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



create FUNCTION [dbo].[GetSetEFC]
(@COAID int ,@BudgetID int, @BudgetFileID int)

RETURNS Decimal(18,2)
AS
BEGIN
	
	DECLARE @EFC decimal(18,2)
 
   select  @EFC=isnull(sum(cast(EFC as float)),0)
     from EstimatedCostSet 	where BudgetID=@BudgetID and BudgetFileID=@BudgetFileID and COAID=@COAID ;


	-- Return the result of the function
	RETURN (@EFC)

END

 
GO