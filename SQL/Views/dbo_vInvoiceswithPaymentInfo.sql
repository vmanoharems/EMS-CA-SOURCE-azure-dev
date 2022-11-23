SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
create view [dbo].[vInvoiceswithPaymentInfo] 
as 
select JE.TransactionNumber as InvoiceTransactionNumber, C.CompanyCode as InvoiceCompanyCode, V.VendorName as InvoiceVendorName, ILC.InvoiceLines
, PJE.TransactionNumber as PaymentTransactionNumber,PJE.CheckNumber as PaymentCheckNumber,PJE.CheckDate as PaymentCheckDate,PJE.PayBy
,I.InvoiceID,I.InvoiceNumber,I.CompanyID,I.VendorID,I.VendorName,I.ThirdParty,I.WorkRegion,I.Description,I.OriginalAmount,I.CurrentBalance,I.NewItemAmount
,I.Newbalance,I.BatchNumber,I.BankID,I.InvoiceDate,I.Duedate,I.CheckGroupNumber,I.InvoiceStatus,I.CreatedDate,I.CreatedBy,I.ModifiedDate,I.ModifiedBy
,I.ProdID,I.Amount,I.ClosePeriodID,I.RequiredTaxCode,I.MirrorStatus
-- Give us everything related to the Invoice
from Invoice I
join Company C on I.CompanyID = C.CompanyID
join (select InvoiceID,count(*) as InvoiceLines from InvoiceLine group by InvoiceID) ILC on I.InvoiceID = ILC.InvoiceID
join JournalEntry JE on I.InvoiceID = JE.ReferenceNumber and JE.SourceTable = 'Invoice' --and JE.AuditStatus = 'Posted'
join tblVendor V on I.VendorID = V.VendorID
-- Give us everything related to the Payment
left join (select P.PaymentID,P.CheckNumber,P.Status,P.PayBy, P.PaymentDate, P.CheckDate, JE.InvoiceIDPayment, JE.TransactionNumber
			from Payment P 
			join JournalEntry JE on P.PaymentID = JE.ReferenceNumber 
			--where P.Status = 'Printed'
			--and JE.InvoiceIDPayment is not null
) as PJE on I.InvoiceID = PJE.InvoiceIDPayment
where I.InvoiceStatus = 'Posted'
GO