SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[Reconciliation_ClearedTransaction]
(
@ReconcilationID int,
@JEID int,
@Mode bit,
@UserID int
)
AS
BEGIN
SET NOCOUNT ON;
--declare @CheckStatus varchar(50) = '';
--declare @JEID int = null;
declare @Status varchar(50) = '';
declare @upsertresult as [ReconcilationAddon_UDT];

--select @JEID = JEID, @CheckStatus=Status from Payment where PaymentId=@PaymentID;

select
	@Status = 
		case @Mode
			when 0 then 'UNCLEARED' 
			else 'CLEARED' END
;

merge dbo.ReconcilationAddOn as target
	using (select @ReconcilationID, @Status, @UserID, @JEID) as source
		(ReconcilationID, Status, UserID, JEID)
	on (target.JEID = source.JEID)
	when not matched then
		Insert (ReconcilationID,SaveDate,Status,UserID,JEID)
			values (@ReconcilationID,getdate(),@Status,@UserID,@JEID)
	when matched then
		update set SaveDate = getdate()
			, Status = @Status
			, UserID = @UserID
	output $action, inserted.* into @upsertresult;

	select * from @upsertresult;


END



GO