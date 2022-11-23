SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE VIEW [dbo].[vwPayrollPostAmount]
AS
SELECT        a.PayrollFileID, a.PaymentAmount, a.AccountNumber, ISNULL(b.AccountId, 0) AS AccountID, ISNULL(b.ProdId, 0) AS ProdID
FROM            dbo.PayrollExpensePost AS a LEFT OUTER JOIN
                         dbo.TblAccounts AS b ON a.AccountNumber = b.AccountCode
WHERE        (b.AccountId <> 0)

GO