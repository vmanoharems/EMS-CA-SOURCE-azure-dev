SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[EditCheckNumber] -- EditCheckNumber  1002,3,'104,105'
(
@BankID int,
@ProdID int,
@CheckNumber varchar(500)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;



select CheckNo,PaymentID from CheckRunAddon where CheckRunID in
 (select CheckRunID from CheckRun where BankID=@BankID and ProdID=@ProdID)
  and CheckNo in (( SELECT * FROM dbo.SplitId(@CheckNumber,','))) and Status!='CANCELED'


END



GO