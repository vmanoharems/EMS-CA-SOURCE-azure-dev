SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE VIEW [dbo].[CRWHeader]
AS

SELECT       B.BudgetCategoryID, B.CategoryTotal, B.CategoryNumber, A.Amount AS TotalCost, 0 AS PO, A.CreatedDate AS Date, B.CategoryDescription, B.BudgetID, B.Budgetfileid,B.COAID,1 as DetailLevel
FROM            InvoiceLine A INNER JOIN
                         COA C ON A.COAID = c.COAID INNER JOIN
                         BudgetCategoryfinal B ON C.COAID=B.COAID
WHERE        InvoiceLinestatus = 'PAID'
UNION
SELECT        B.BudgetCategoryID, B.CategoryTotal, CategoryNumber, 0 AS TotalCost, Amount AS PO, A.CreatedDate AS Date, B.CategoryDescription, B.BudgetID, B.Budgetfileid,B.COAID,1 as DetailLevel
FROM            PurchaseOrderLine A INNER JOIN
                         COA C ON A.COAID = c.COAID INNER JOIN
                         BudgetCategoryfinal B ON C.COAID=B.COAID
WHERE        POLinestatus <> 'PAID'


GO