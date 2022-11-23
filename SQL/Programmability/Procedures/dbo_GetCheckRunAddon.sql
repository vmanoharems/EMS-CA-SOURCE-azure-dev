SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetCheckRunAddon]
(
@CheckRunID int,
@PaymentID int,
@CheckNo varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 
 if exists(select CheckRunID from CheckRunAddon where CheckRunID=@CheckRunID and CheckNo=@CheckNo)
 begin
 select 'Exists' as Status
 end
 else
 begin

 insert into CheckRunAddon (CheckRunID,PaymentID,CheckNo,Status) values
 (@CheckRunID,@PaymentID,@CheckNo,'WORKING');

 select 'OK' as Status

 end

END



GO