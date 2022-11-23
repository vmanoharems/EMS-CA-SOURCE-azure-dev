SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[APInvoicesOpenInvoicesList]
	@ProdId int
AS
BEGIN

select * from vInvoiceswithPaymentInfo where PaymentTransactionNumber is null and ProdID = @ProdID

END


GO