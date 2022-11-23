SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetInvoiceListForPayment] -- GetInvoiceListForPayment 3,1
	-- Add the parameters for the stored procedure here
	@prodId int,
	@BankId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select I.Invoiceid,i.InvoiceNumber,convert(varchar(10),i.InvoiceDate,110) As InvoiceDate,i.OriginalAmount,v.VendorName,i.VendorID from Invoice I
	inner join tblVendor V on v.VendorID=I.VendorID
	
	where I. ProdID=@prodId and i.BankId=@BankId and i.InvoiceStatus='Posted' 
	and i.Invoiceid not in(select Invoiceid from PaymentLine) order by i.VendorID   
END 





GO