SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


create PROCEDURE [dbo].[APInvoicesPostedList] 
	@ProdId int
AS
BEGIN

select * from vInvoiceswithPaymentInfo where ProdID = @ProdID

END





SET ANSI_NULLS ON



GO