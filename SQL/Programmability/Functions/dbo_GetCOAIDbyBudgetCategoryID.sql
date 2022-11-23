SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE FUNCTION [dbo].[GetCOAIDbyBudgetCategoryID]
(@BudgetCategoryID int)

RETURNS int
AS
BEGIN
	
	DECLARE @returnCOAID int

	select  @returnCOAID=COAID from [BudgetCategoryFinal] where BudgetCategoryID = @BudgetCategoryID;
	RETURN (@returnCOAID)

END




GO