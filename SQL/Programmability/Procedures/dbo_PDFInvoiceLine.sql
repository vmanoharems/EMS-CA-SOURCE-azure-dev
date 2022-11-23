SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[PDFInvoiceLine]
(
@PaymentID int,
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


select CONVERT(varchar(10),b.InvoiceDate,101) as InvoiceDate,b.InvoiceNumber,b.Description, a.InvoiceAmount from PaymentLine as a 
inner join Invoice as b on a.InvoiceId=b.Invoiceid
 where a.BankID=@BankID and a.PaymentId=@PaymentID

 

END



GO