SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[PayrollCheckPrint]
(
@PayrollFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	update PayrollFile set PrintStatus='Printed',PrintedFlag = 1 where PayrollFileID=@PayrollFileID

 --select * from PayrollChecks  where PayrollFileID=@PayrollFileID
	select a.CheckID,a.PdfCheckNum,a.PayrollUserID,a.CheckPDF,a.PayrollFileID,b.InvoiceNumber
		from PayrollChecks as a
		join PayrollFile as b on a.PayrollFileID=b.PayrollFileID
	where a.PayrollFileID=@PayrollFileID

END



GO