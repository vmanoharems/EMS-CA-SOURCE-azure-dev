SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetBankReconcilation] --2
@BankID int
AS
SET NOCOUNT ON;
if exists(select Status from BankReconcilation where BankID=@BankID and Status='OPEN')
BEGIN
	declare @PriorBalance varchar(50);
	declare @PriorReconcilID int;
	declare @OutStandingAdjustment float;
	declare @ClearedAdjustment float;
	declare @RecIDD int;
	select @RecIDD=ReconcilationID from BankReconcilation where BankID=@BankID and Status='OPEN'
	select @OutStandingAdjustment=isnull(sum(Amount),0) from BankAdjustment where BankID=@BankID and ReconcilationID=@RecIDD and Status='UnCleared'
	select @ClearedAdjustment=isnull(sum(Amount),0) from BankAdjustment where BankID=@BankID and ReconcilationID=@RecIDD and Status='Cleared'
	select @PriorReconcilID=isnull(Max(ReconcilationID),0) from BankReconcilation where ReconcilationID not in
	(select Max(ReconcilationID) from BankReconcilation where BankID=@BankID) and BankID=@BankID
	if(@PriorReconcilID=0)
	begin
		set @PriorBalance='0.00';
	end
	else
	begin
		select @PriorBalance=StatementEndingAmount from BankReconcilation where ReconcilationID=@PriorReconcilID;
	end

	select 'OK' as Status, ReconcilationID ,Convert(varchar(10),StatementDate,101) as StatementDate,StatementEndingAmount 
	,@PriorBalance as PriorBalance,@OutStandingAdjustment as OutStandingAdjustment,@ClearedAdjustment
	as ClearedAdjustment,DisplayAll,MarkVoided,'' as DD
	from BankReconcilation where BankID=@BankID and Status='OPEN'
end
else
begin
	declare @dd varchar(50);
	select @dd=isnull(convert(varchar(10),DATEADD(day,1,OpenDate),101),'') from BankReconcilation where BankID=@BankID and Status='Completed'
	select 'NOTFOUND' as Status,1 as ReconcilationID,'' as StatementDate,0.00  as StatementEndingAmount,'0.00' as PriorBalance,cast('0.00' as float)
	as OutStandingAdjustment,cast('0.00' as float) as ClearedAdjustment,cast(0 as bit) as DisplayAll,cast(0 as bit) as MarkVoided,ISNULL(@dd,'') as DD
END
GO