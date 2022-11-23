SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetInvoiceLineDetailById]-- GetInvoiceLineDetailById 1,3
	-- Add the parameters for the stored procedure here
	@InvoiceId int,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select InvoiceID,InvoiceLineID,i.Amount,i.LineDescription,i.COAString,i.COAID,i.Transactionstring,dbo.convertcodes(i.TransactionString) as TransStr,i.Polineid,p.PONumber,
	i.SetId,t.AccountCode as SetCode,i.SeriesId,tt.AccountCode as SeriesCode,ClearedFlag,i.TaxCode,isnull(v.VendorName,'')as VendorName,isnull(p.Status,'')as Status
	
	 From InvoiceLine  I
	 left outer  join PurchaseOrderLine pL on pL.POlineID=i.Polineid
	 left outer join PurchaseOrder p on p.POID=pl.POID
	 left outer join TblAccounts T on  i.SetId=t.AccountId
	 left outer join TblAccounts TT on  i.SeriesId=tt.AccountId
	left outer join tblvendor V on v.vendorid=p.vendorid
	
	 where InvoiceID=@InvoiceId and i.ProdID=@ProdId
END



GO