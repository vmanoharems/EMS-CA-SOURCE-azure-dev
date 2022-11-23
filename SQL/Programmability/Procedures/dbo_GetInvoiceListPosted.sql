SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetInvoiceListPosted] 
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
select Invoiceid,convert(varchar(10),InvoiceDate,110) as InvoiceDate,InvoiceNumber,c.CompanyID,c.CompanyCode
,Payby,i.VendorID as VendorId,v.VendorName as tblVendorName,
i.VendorName as ThirdPartyVendor ,(select count(*)from InvoiceLine where InvoiceID=i.invoiceid)as InoviceLine,CurrentBalance
,i.BatchNumber,isnull(j.TransactionNumber,'')as TransactionNumber
 from Invoice i
inner join Company c on c.CompanyID=i.CompanyID
inner join tblVendor v on v.VendorID=i.VendorID
left outer join JournalEntry j on j.ReferenceNumber=i.Invoiceid and j.Source='AP' and j.SourceTable='Invoice' and
 j.AuditStatus='Posted' --and CurrentStatus='Current'
 where i.InvoiceStatus ='Posted'
 and i.ProdID=@ProdId 
END





/****** Object:  StoredProcedure [dbo].[InsertupdateJournalEntry]    Script Date: 07/10/2016 5:26:56 PM ******/
SET ANSI_NULLS ON
GO