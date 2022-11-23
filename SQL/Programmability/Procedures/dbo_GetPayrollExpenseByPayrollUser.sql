SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollExpenseByPayrollUser] -- exec GetPayrollExpenseByPayrollUser 1,1
(
@PayrollFileID int,
@PayrollUserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 select a.PayrollExpenseID,b.CheckNumber,d.CompanyName,
a.PayDescription,a.PaymentAmount ,(Select PaymentAmount from PayrollExpense where PayrollFileID=@PayrollFileID and PayrollUserID=@PayrollUserID and PayDescription='Labor') 
as LaborAmt,
(Select sum(convert(decimal(18,2),PaymentAmount)) from PayrollExpense where PayrollFileID=@PayrollFileID and PayrollUserID=@PayrollUserID ) as TotalAmt
from PayrollExpense as a
inner join PayrollUser as b on a.PayrollUserID=b.PayrollUserID 
inner join PayrollFile as c on b.PayrollFileID=c.PayrollFileID
inner join Company as d on c.CompanyID=d.CompanyID
where a.PayrollFileID=@PayrollFileID and b.PayrollUserID=@PayrollUserID group by b.CheckNumber,b.FirstName,
b.LastName,a.PayrollExpenseID,a.PayDescription,a.PaymentAmount,d.CompanyName

END



GO