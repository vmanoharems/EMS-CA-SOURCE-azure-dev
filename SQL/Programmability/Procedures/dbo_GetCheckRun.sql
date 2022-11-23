SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetCheckRun]   -- exec GetCheckRun 3,1002,1
(
@ProdID int,
@BankID int,
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
 
	if exists(select CheckRunID from CheckRun where ProdID=@ProdID and BankID=@BankID  and Status='WORKING')
	begin
		select cast(CheckRunID as varchar(50)) as CheckRunID from CheckRun where ProdID=@ProdID and BankID=@BankID  and Status='WORKING'
	end
	else
	begin
		declare @NewCheckRunID int;
		declare @UserCheckRunID int;

		insert into CheckRun (UserID,Status,StartDate,BankID,ProdID) values
		(@UserID,'WORKING',CURRENT_TIMESTAMP,@BankID,@ProdID);

		set @NewCheckRunID=@@IDENTITY;

		select @UserCheckRunID=CheckRunID from CheckRunStatus where UserID=@UserID and BankID=@BankID and Status in ('Pending','Working')
		update CheckRunStatus set Status='Working' , ActualCheckRunID=@NewCheckRunID where CheckRunID=@UserCheckRunID;

		select cast(@NewCheckRunID as varchar(50)) as CheckRunID
		return @NewCheckRunID;

	end

END
GO