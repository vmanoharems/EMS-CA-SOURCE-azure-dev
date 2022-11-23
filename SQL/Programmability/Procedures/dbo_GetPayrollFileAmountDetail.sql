SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollFileAmountDetail] ---exec GetPayrollFileAmountDetail 5
	(
	@PayrollFileID int
	)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select isnull(convert(varchar(10),TransactionDate,101),'') as TransactionDate ,convert(varchar(10),EndDate,101)as PeriodEnd,PayrollCount,TotalPayrollAmount,PayrollFileID,

(select isnull(sum(cast(a.PaymentAmount as float)),0) from PayrollExpense as a inner join TblAccounts as b on a.PaymentAccount=b.AccountCode 
where a.PayrollFileID=@PayrollFileID 
--and a.PaymentAccount not like '%99'
and a.ExpenseType='L'
) as PRClearing,

(select isnull(sum(cast(a.PaymentAmount as float)),0) from PayrollExpense as a inner join TblAccounts as b on a.PaymentAccount=b.AccountCode 
where a.PayrollFileID=@PayrollFileID
--and a.PaymentAccount like '%99'
and a.ExpenseType='F'
) as FringeClearing

 from PayrollFile where PayrollFileID=@PayrollFileID 

END






GO