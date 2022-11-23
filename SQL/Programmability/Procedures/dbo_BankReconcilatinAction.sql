SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[BankReconcilatinAction]
@ReconcilationID int,
@Mode int,
@UserID int
AS
BEGIN
	SET NOCOUNT ON;
	if(@Mode=1) -- Delete
	begin
		update BankReconcilation set Status='Deleted'
		where ReconcilationID=@ReconcilationID

		--delete from BankAdjustment where ReconcilationID=@ReconcilationID;
		--delete from  BankReconcilation where ReconcilationID=@ReconcilationID;
		--delete from  ReconcilationAddon where ReconcilationID=@ReconcilationID;
	end
	else if(@Mode=2)  -- Cancel
	begin
		delete from BankAdjustment where ReconcilationID=@ReconcilationID;
		delete from  BankReconcilation where ReconcilationID=@ReconcilationID;
		delete from  ReconcilationAddon where ReconcilationID=@ReconcilationID;
	end
	else if(@Mode=3)  -- Complete
	begin
		update BankReconcilation set Status='Completed' ,CompleteDatet=CURRENT_TIMESTAMP ,CompleteBy=@UserID
		where ReconcilationID=@ReconcilationID
	end
	select 'OK' as Status ,@Mode as ReturnValue
END



GO