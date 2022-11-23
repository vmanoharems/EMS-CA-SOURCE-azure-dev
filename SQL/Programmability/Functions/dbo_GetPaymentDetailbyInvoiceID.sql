SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

Create FUNCTION [dbo].[GetPaymentDetailbyInvoiceID]
(@InvoiceID int,@Mode int )

RETURNS varchar(50)
AS
BEGIN
	-- Declare the return variable here
	
    declare @Payment varchar(50);
	if(@Mode=1)
	begin
	select @Payment=isnull(CheckNumber,'') from PaymentLine where InvoiceId=@InvoiceID
	END
	else 
	begin
	select @Payment=isnull(CONVERT(varchar(10),CreatedDate,101),'') from PaymentLine where InvoiceId=@InvoiceID
	END

	RETURN (@Payment)

END


GO