SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[CancelCheckRunByUser]  -- exec InsertCheckRunByUser 71,1
(
@UserID int,
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


   if exists(select * from CheckRunStatus where UserID=@UserID and BankID=@BankID and Status in ('Pending','Working'))
 begin

  update CheckRunStatus set Status='CANCELED' where UserID=@UserID and BankID=@BankID and Status in ('Pending','Working');

  select 'OK' as ReturnStatus ,@UserID as UserID
  
 end
 else
 begin
 select 'Error' as ReturnStatus ,@UserID as UserID
 end
   


END

GO