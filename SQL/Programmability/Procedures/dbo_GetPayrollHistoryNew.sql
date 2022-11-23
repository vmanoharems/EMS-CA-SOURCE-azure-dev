--v1.1.001
SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollHistoryNew]  --exec GetPayrollHistoryNew 1
(
@CompanyID int,
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @tz varchar(50);
	if exists(select * from TimeZone where UserID=@UserID)
	begin
	select @tz=TimeDifference from TimeZone where UserID=@UserID 	
	end
	else
	begin
	set @tz='00:00'
	end 


declare @CompanyCode varchar(100);
select @CompanyCode=CompanyCode from Company where CompanyID=@CompanyID
 
select p.PayrollFileID, p.LoadNumber,Convert(varchar(10),(p.CreatedDate)-cast(@tz as datetime),101)as CreatedDate,@CompanyCode as CompanyCode ,isnull(Convert(varchar(10)
	,p.TransactionDate,101) ,'')as TransactionDate
	,isnull(Convert(varchar(10),p.EndDate,101),'') as EndDate,isnull(TotalPayrollAmount,0) as TotalPayrollAmount,p.PayrollCount,
	p.PostedFlag,p.InvoicedFlag,p.PrintStatus,p.Status,p.InvoiceNumber as InvoiceNumber,
	(select isnull(sum(cast(PaymentAmount as float)),'0.00') from PayrollExpensePost where PayrollFileID=p.PayrollFileID
	and ExpenseType='F' --and PayrollExpensePost.AccountNumber like '%99'
	) as FringeAmount
	,(select isnull(sum(cast(PaymentAmount as float)),'0.00') from PayrollExpensePost where PayrollFileID=p.PayrollFileID
	and ExpenseType='L' --and PayrollExpensePost.AccountNumber not like '%99'
	) as LaborAmount
from PayrollFile p 
where p.CompanyID=@CompanyID
and p.Status in ('Load','Post')
order by p.InvoiceNumber DESC

END





GO