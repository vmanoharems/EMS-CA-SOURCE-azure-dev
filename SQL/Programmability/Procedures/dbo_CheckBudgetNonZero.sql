SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CheckBudgetNonZero]
(
@COAID int,
@BudgetID int,
@BudgetFileID int,
@DetailLevel int

)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;

	select @CID=cid from BudgetCategoryFinal where COAID=@COAID and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID;


   select * from BudgetAccountsFinal where CategoryId=@CID and BudgetFileID=@BudgetFileID and 
   BudgetID=@BudgetID and DetailLevel=@DetailLevel+1



END



GO