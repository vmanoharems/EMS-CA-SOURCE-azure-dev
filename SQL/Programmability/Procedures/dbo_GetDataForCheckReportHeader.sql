SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetDataForCheckReportHeader]  -- GetDataForCheckReport 2
(
@CheckRunID int
)
as
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @TotalAmt decimal(18,2);
	declare @Period int;


	select @TotalAmt=sum(b.PaidAmount),@Period=e.CompanyPeriod
  from CheckRunAddon as a 
 inner join Payment as b on a.PaymentID=b.PaymentId
 inner join tblVendor as c on b.VendorId=c.VendorID
 inner join JournalEntry as d on b.PaymentId=d.ReferenceNumber and d.SourceTable='Payment'
 inner join ClosePeriod as e on d.ClosePeriod=e.ClosePeriodId and  d.SourceTable='Payment'
 where a.CheckRunID=@CheckRunID --and a.Status='COMPLETED'
 group by b.PaidAmount,e.CompanyPeriod
   
   select b.Bankname,c.CompanyName ,@TotalAmt as Amount,@Period as Period from CheckRun as a 
   inner join BankInfo as b on a.BankID=b.BankId
   inner join Company as c on b.CompanyId=c.CompanyID
    where a.CheckRunID=@CheckRunID --and a.Status='COMPLETED'

	

END



GO