SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[DeleteInvoiceLine]
	-- Add the parameters for the stored procedure here
	
	@poLineId int,
	@InvoiceLineId int ,
	@InvoiceId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	declare @Status nvarchar(50),@Amount decimal(18,2)

	if exists(select * from PaymentLine where InvoiceId=@InvoiceId)
	begin
	select -1;
	end
	else
	begin
	
	select @Status=InvoiceLinestatus,@Amount=Amount from InvoiceLine where InvoiceLineID=@InvoiceLineId


	if(@Status='Pending')
	begin
	 update PurchaseOrderLine  set AvailToRelieve=AvailToRelieve+@Amount where POlineID=@POLineId ;
	end
	else
	begin
	update PurchaseOrderLine  set  RelievedTotal=RelievedTotal+@Amount,Amount=Amount+@Amount where POlineID=@POLineId
	end
	

	delete from InvoiceLine where InvoiceLineID=@InvoiceLineId


	select @InvoiceLineId;

	end
END



GO