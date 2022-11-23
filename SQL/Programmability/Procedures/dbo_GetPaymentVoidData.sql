SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetPaymentVoidData] -- GetPaymentVoidData 1
(
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 --declare @COAID int

 --select @COAID=COAId from AccountClearing where BankId=@BankID and AccountName='CashAccount' 

 --select b.JournalEntryDetailid, CONVERT(varchar(10),b.CreatedDate,101)as CheckDate,c.CheckNumber,b.VendorName,
 --a.TransactionNumber,b.DebitAmount,b.CreditAmount
 --,c.Status
 --from JournalEntry as a inner join JournalEntryDetail as b on a.JournalEntryId=b.JournalEntryId
 --inner join Payment as c on a.ReferenceNumber=c.PaymentId
 --where a.Source='AP' and b.COAId=@COAID  order by b.JournalEntryDetailId 

 
--select distinct a.PaymentId,a.PaidAmount,a.CheckNumber,convert(varchar(10),a.PaymentDate,101) as CDate,
--c.VendorName,a.Status from Payment as a inner join PaymentLine as b on a.PaymentId=b.PaymentId
--inner join tblVendor as c on a.VendorId=c.VendorID
--where a.Status in ('Printed','Voided') and b.BankID=@BankID 


select distinct a.PaymentId,a.PaidAmount,a.CheckNumber,convert(varchar(10),a.PaymentDate,101) as CDate,
c.VendorName,a.Status,d.TransactionNumber,b.InvoiceId from Payment as a inner join PaymentLine as b on a.PaymentId=b.PaymentId
inner join tblVendor as c on a.VendorId=c.VendorID
inner join Journalentry as d on a.PaymentId=d.ReferenceNumber and d.SourceTable='Payment' and d.AuditStatus not in ('Reversed')
where a.Status in ('Printed','Voided','Cancelled') and b.BankID=@BankID order by a.CheckNumber

END




GO