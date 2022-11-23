SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CheckWTNo]
(
@WTList varchar(500),
@BankID int,
@ProdID int,
@CheckType varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select PaymentId,CheckNumber from Payment where PayBy=@CheckType and BankId=@BankID and ProdId=@ProdID
	and CheckNumber in (SELECT items as S1 FROM dbo.SplitId(@WTList,','))

END

GO