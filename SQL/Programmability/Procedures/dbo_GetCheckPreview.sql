SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetCheckPreview]  -- GetCheckPreview 1
(
@CheckRunID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


--select a.PaymentId, a.CheckNumber, CONVERT(varchar(10),a.CheckDate,103) as CheckDate,b.VendorName,count(c.PaymentId) as LineItems,
--a.PaidAmount,a.Status
-- from Payment as a inner join tblVendor as b on a.VendorId=b.VendorID 
-- left join PaymentLine as c on a.PaymentId=c.PaymentId
--where a.PaymentId in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRunID and Status='WORKING')
--group by a.PaymentId,a.CheckNumber ,CheckDate,b.VendorName,a.PaidAmount,a.Status


--select a.PaymentId, a.CheckNumber, CONVERT(varchar(10),a.CheckDate,103) as CheckDate,b.VendorName,count(c.ProdId) as LineItems,
--sum(c.InvoiceAmount) as PaidAmount
-- from PaymentLine as c 
-- inner join Payment as a on a.PaymentId=c.PaymentId
-- inner join tblVendor as b on b.VendorId=a.VendorID 
--where a.PaymentId in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRunID and Status='WORKING')
--group by a.CheckNumber ,a.CheckDate,b.VendorName


select a.PaymentId, a.CheckNumber, CONVERT(varchar(10),a.CheckDate,101) as CheckDate,b.VendorName,count(c.ProdId) as LineItems,
sum(c.InvoiceAmount) as PaidAmount,a.Status
 from PaymentLine as c 
 inner join Payment as a on a.PaymentId=c.PaymentId
 inner join tblVendor as b on b.VendorId=a.VendorID 
where a.PaymentId in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRunID
-- and Status='WORKING'
 )
group by a.PaymentId,a.CheckNumber ,a.CheckDate,b.VendorName,a.Status
order by b.VendorName

END




GO