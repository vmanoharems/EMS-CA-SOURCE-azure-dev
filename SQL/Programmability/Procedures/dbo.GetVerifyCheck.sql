-- =============================================
ALTER PROCEDURE [dbo].[GetVerifyCheck]  --  GetVerifyCheck 1,78
(
@BankID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CheckRun int;
	declare @CheckExitStatus int;

  select @CheckRun=CheckRunID from CheckRun where Status='WORKING' and BankID=@BankID and ProdID=@ProdID;

select @CheckExitStatus=count(a.ProdId) from Payment as a  left join PaymentLine as c on a.PaymentId=c.PaymentId
where a.PaymentId in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRun) and a.Status='Issued'

select a.PaymentId, a.CheckNumber, CONVERT(varchar(10),a.CheckDate,101) as CheckDate,b.VendorName,count(c.PaymentId) as LineItems,
a.PaidAmount,a.Status,@CheckExitStatus as ExitStatus
 from Payment as a inner join tblVendor as b on a.VendorId=b.VendorID 
 left join PaymentLine as c on a.PaymentId=c.PaymentId
where a.PaymentId in (select PaymentID from CheckRunAddon where CheckRunID=@CheckRun) --and a.Status='Issued'
group by a.PaymentId,a.CheckNumber ,CheckDate,b.VendorName,a.PaidAmount,a.Status

END