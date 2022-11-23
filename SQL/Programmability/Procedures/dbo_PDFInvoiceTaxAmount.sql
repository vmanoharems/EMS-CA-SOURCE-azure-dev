SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[PDFInvoiceTaxAmount]  -- PDFInvoiceTaxAmount '1000',1
(
@PaymentID int,
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


select isnull(sum(cast(c.Amount as float)),0)  as Amount, @PaymentID as PaymentID from PaymentLine as a 
inner join Invoice as b on a.InvoiceId=b.Invoiceid
inner join InvoiceLine as c on b.InvoiceID=c.InvoiceID
 where a.BankID=@BankID and a.PaymentId=@PaymentID and c.TaxCode is not null and c.TaxCode!=''

 

END




GO