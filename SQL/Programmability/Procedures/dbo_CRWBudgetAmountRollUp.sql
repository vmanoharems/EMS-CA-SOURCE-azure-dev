SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CRWBudgetAmountRollUp]
(
@COAID int,
@BudgetID int,
@BudgetFileID int,
@Amount varchar(100)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


 update BudgetCategoryFinal set CategoryTotal=@Amount where COAID=@COAID and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID
 if exists(select * from EstimatedCost where COAID=@COAID and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID)
 begin
 update EstimatedCost set ExpandValue=9 where COAID=@COAID and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID
 end
 else
 begin
 insert into EstimatedCost (DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID,ExpandValue) values
 (1,@BudgetID,@BudgetFileID,@Amount,@Amount,@COAID,9)
 end


select CategoryTotal,COAID from BudgetCategoryFinal where COAID=@COAID and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID

END



GO