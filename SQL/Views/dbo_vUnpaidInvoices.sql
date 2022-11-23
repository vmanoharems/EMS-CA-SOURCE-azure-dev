SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE VIEW [dbo].[vUnpaidInvoices]
as

select 
I.*,case when P.status is null then 'UnPaid' else P.status end as PayStatus
from Invoice I
left join (select InvoiceID,Pay.status
	from Payment Pay
	join PaymentLine PL
	on Pay.PaymentID = PL.PaymentID
	where Pay.Status = 'Printed'
	group by InvoiceID,status) as P -- Our Invoices that have payments that have been printed
on I.InvoiceID = P.InvoiceID
where I.InvoiceStatus = 'Posted'
and (P.status is null )
and I.MirrorStatus = 0
GO