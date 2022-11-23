SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[CancelCheckRun]
(
@ProdID int,
@CheckRunID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	begin transaction
		update CheckRun set Status='CANCELED' ,EndDate=CURRENT_TIMESTAMP where CheckRunID=@CheckRunID and ProdID=@ProdID;
		update CheckRunAddon set Status='CANCELED'  where CheckRunID=@CheckRunID;

		Update Payment set isdeleted = 1 where PaymentID in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRunID);
		Update PaymentLine set isdeleted = 1 where PaymentID in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRunID);
	-- Should never delete!!!
	--	delete from Payment where PaymentId in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRunID);
	--	delete from PaymentLine where PaymentId in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRunID);
	   update CheckRunStatus set Status='CANCELED'  where ActualCheckRunID=@CheckRunID;
	if @@error <> 0 
	begin
		rollback transaction
		return
	end
	commit transaction
END
GO