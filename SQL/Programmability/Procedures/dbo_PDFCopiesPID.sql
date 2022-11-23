SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[PDFCopiesPID]
(
@CheckRunID int,
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select b.PaymentID,b.CheckNo from CheckRun as a 
inner join CheckRunAddon as b on a.CheckRunID=b.CheckRunID
where a.BankID=@BankID and a.CheckRunID=@CheckRunID



END



GO