SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CheckInvoiceNumberVendorId]
 -- Add the parameters for the stored procedure here
 @InvoiceNumber nvarchar(50),
 @InvoiceId int, 
 @VendorId int,
 @ProdId int
 
AS
BEGIN
 -- SET NOCOUNT ON added to prevent extra result sets from
 -- interfering with SELECT statements.
 SET NOCOUNT ON;

    -- Insert statements for procedure here
 if(@InvoiceId=0)
 begin

  if exists(select *  from Invoice where InvoiceNumber=@InvoiceNumber and ProdID=@ProdId and VendorID=@VendorId)
 begin
 select 0;
 end
 else
 begin
 select 1;
 end
 end
 else
 begin
 if exists(select *  from Invoice where InvoiceNumber=@InvoiceNumber and VendorID=@VendorId and Invoiceid=@InvoiceId and ProdID=@ProdId)
 begin
   select 1;
 end
 else
 begin
 if exists( select *  from Invoice where InvoiceNumber=@InvoiceNumber and VendorID=@VendorId  and ProdID=@ProdId)
 begin
  select 0;
 end
 else
 begin
  select 1;
 end
 end
 end
END


GO