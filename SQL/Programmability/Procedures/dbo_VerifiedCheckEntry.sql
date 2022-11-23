SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[VerifiedCheckEntry]
(
@PaymentID int,
@Mode int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CheckRun int;
	select @CheckRun=CheckRunID from CheckRun where Status='WORKING' and ProdID=@ProdID;
	
	if(@Mode=1)
	begin
	update Payment set Status='Printed'  where PaymentId=@PaymentID and ProdId=@ProdID;

	update CheckRunAddon set Status='Completed' where CheckRunID=@CheckRun and PaymentID=@PaymentID;

	end

	else if(@Mode=2)
	begin
	update Payment set Status='Cancelled' where PaymentId=@PaymentID and ProdId=@ProdID;
	update CheckRunAddon set Status='Cancelled' where CheckRunID=@CheckRun and PaymentID=@PaymentID;

	end

	else if(@Mode=3)
	begin
	update Payment set Status='Issued'  where PaymentId=@PaymentID and ProdId=@ProdID;
	update CheckRunAddon set Status='Working' where CheckRunID=@CheckRun and PaymentID=@PaymentID;
	end

	else if(@Mode=4)
	begin

	update Payment set Status='Cancelled'  where PaymentId=@PaymentID and ProdId=@ProdID;
	update CheckRunAddon set Status='Cancelled' where CheckRunID=@CheckRun and PaymentID=@PaymentID;

    end

	select 1;

END



GO