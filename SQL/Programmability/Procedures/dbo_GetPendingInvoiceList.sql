SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetPendingInvoiceList] -- GetPendingInvoiceList 3
	-- Add the parameters for the stored procedure here
@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
select Invoiceid,convert(varchar(10),InvoiceDate,110) as InvoiceDate,InvoiceNumber,c.CompanyID,c.CompanyCode
,Payby,i.VendorID as VendorId,v.VendorName as tblVendorName ,
isnull(i.VendorName,'') as ThirdPartyVendor ,(select count(*)from InvoiceLine where InvoiceID=i.invoiceid)as InoviceLine,CurrentBalance,
i.BatchNumber,
(select case when AC.COAId is null then 'No' else 'Yes' end) as ClearringAccountFlag,
isnull(j.TransactionNumber,'')as TransactionNumber
 from Invoice i

left outer join AccountClearing AC on Ac.BankId=i.BankId  and ac.AccountName='APClearing'
inner join Company c on c.CompanyID=i.CompanyID
inner join tblVendor v on v.VendorID=i.VendorID
left outer join JournalEntry j on j.ReferenceNumber=i.Invoiceid and j.Source='AP' and j.SourceTable='Invoice' and AuditStatus='Saved'
 where i.ProdID=@ProdId and i.InvoiceStatus='Pending' 
END




GO