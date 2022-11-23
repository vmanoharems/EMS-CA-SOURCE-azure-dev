SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetAllBudgetById] 
(
 @Budgetid int 
 )
AS
BEGIN

 SET NOCOUNT ON;

 SELECT * from Budget where BudgetId =@Budgetid
END



GO