SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[UpdateVarianceInfo]
(
@BudgetID int,
@BudgetFileID int,
@COAID int,
@UserID int,
@ProdID int,
@AmountOld decimal,
@AmountNew decimal
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;
	declare @PeriodID int;

	select @CID=CompanyID from BudgetFile where Budgetid=@BudgetID and BudgetFileID=@BudgetFileID;
	
	
   select @PeriodID=ClosePeriodId from ClosePeriod where CompanyId=@CID and Status='Open' and PeriodStatus='Current';


	insert into Variance (BudgetID,BudgetFileID,COAID,UserID,SaveDate,ProdID,EFCOLD,EFCNEW,Period) values
	(@BudgetID,@BudgetFileID,@COAID,@UserID,CURRENT_TIMESTAMP,@ProdID,@AmountOld,@AmountNew,@PeriodID)
	

END



GO