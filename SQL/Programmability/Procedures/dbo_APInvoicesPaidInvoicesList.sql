SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[APInvoicesPaidInvoicesList] 
	@ProdId int
AS
BEGIN

select * from vInvoiceswithPaymentInfo where PaymentTransactionNumber is not null and ProdID = @ProdID

END


GO