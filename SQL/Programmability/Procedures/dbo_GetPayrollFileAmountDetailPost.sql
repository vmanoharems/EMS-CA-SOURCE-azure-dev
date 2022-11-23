SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollFileAmountDetailPost] ---exec GetPayrollFileAmountDetailPost 4
	(
	@PayrollFileID int
	)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select isnull(convert(varchar(10),TransactionDate,101),'') 
as TransactionDate ,convert(varchar(10),EndDate,101)as PeriodEnd,PayrollCount,TotalPayrollAmount,PayrollFileID,

(select isnull(sum(cast(a.PaymentAmount as float)),0)
 from PayrollExpensePost as a inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
where a.PayrollFileID=@PayrollFileID 
--and a.AccountNumber not like '%99'
and a.ExpenseType='L'
) as PRClearing,

(select isnull(sum(cast(a.PaymentAmount as float)),0) from PayrollExpensePost as a
 inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
where a.PayrollFileID=@PayrollFileID
 --and a.AccountNumber like '%99'
 and a.ExpenseType='F'
 ) as FringeClearing

 from PayrollFile where PayrollFileID=@PayrollFileID 

END






GO