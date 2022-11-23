SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[CheckJEReverseByInvoice]  -- CheckJEReverseByInvoice 1,1
	@InvoiceId int
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
  
	if exists(select * from PaymentLine where InvoiceId=@InvoiceId)
	 begin
	    select 1 as TransactionNumber;
	end
	else
	  begin
         select 0 as TransactionNumber;
      end

END




GO