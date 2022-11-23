SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[SaveTrabsactionDate]
(
@PayrollFileID int,
@TransactionDate Datetime,
@Status varchar(50),
@BatchNumber varchar(100),
@PeriodStatus varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	if(@Status='Post')
	begin
		Update PayrollFile set Status=@Status,BatchNumber=@BatchNumber ,PostedFlag=1,TransactionDate=CURRENT_TIMESTAMP ,ModifiedDate=CURRENT_TIMESTAMP,PeriodStatus=@PeriodStatus where PayrollFileID=@PayrollFileID;
	end
	else
	begin
	Update PayrollFile set Status=@Status,PrintStatus='Print',BatchNumber=@BatchNumber ,TransactionDate=CURRENT_TIMESTAMP,ModifiedDate=CURRENT_TIMESTAMP,PeriodStatus=@PeriodStatus where PayrollFileID=@PayrollFileID;
	end

   delete from PayrollExpensePost where PayrollFileID=@PayrollFileID


END



GO