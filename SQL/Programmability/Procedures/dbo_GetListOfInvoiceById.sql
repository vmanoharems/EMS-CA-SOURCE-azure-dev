SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetListOfInvoiceById] -- GetListOfInvoiceById 1	-- Add the parameters for the stored procedure here
@InvoiceId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
		declare @PostDate date , @ModifiedDate date,@InvoiceReversed nvarchar(20)

select @PostDate=PostedDate,@ModifiedDate=modifiedDate from JournalEntry where Source='AP' and SourceTable='Invoice' 
	and ReferenceNumber=@InvoiceId

	if(@PostDate=@ModifiedDate)
	begin
	set @InvoiceReversed='Yes'
	end
	else
	begin
	set @InvoiceReversed='No'
	end

	select  i.Invoiceid,i.CompanyID,c.CompanyCode,i.VendorID,v.VendorName,convert(varchar(10), i.InvoiceDate,101)InvoiceDate,i.ThirdParty,i.VendorName as ThirdPartyName,
	i.BankId,b.Bankname,Amount,i.OriginalAmount,i.CurrentBalance,i.InvoiceNumber,i.InvoiceStatus,i.Description,isnull(ClosePeriodId,0)as ClosePeriodId,
	(select case when AC.COAId is null then 'No' else 'Yes' end) as ClearringAccountFlag,
	v.Required as VendorRquired,
	i.RequiredTaxCode,DefaultDropdown,

	isnull(pp.Status,'NotPaid') as PaymentStatus,@InvoiceReversed as InvoiceReversed,i.MirrorStatus  
	,isnull(j.TransactionNumber,'')as TransactionNumber
	
	
	 from Invoice I
	 left outer join AccountClearing AC on Ac.BankId=i.BankId  and ac.AccountName='APClearing'
	 inner join Company C on C.CompanyID=i.CompanyID
	 inner join tblVendor V on v.VendorID=i.VendorID
	 inner join BankInfo B on b.BankId=i.BankId
	 left outer join PaymentLine p on p.InvoiceId=i.Invoiceid 
	 left outer join Payment pp on pp.PaymentId=p.PaymentId and pp.Status <> 'Void'
	left outer join JournalEntry j on j.ReferenceNumber=i.Invoiceid and j.Source='AP' and j.SourceTable='Invoice'
	 where i.Invoiceid=@InvoiceId
END



GO