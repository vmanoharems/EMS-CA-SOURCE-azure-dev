SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO




CREATE VIEW [dbo].[CRWDetail]
AS

SELECT        B.BudgetCategoryID, D .AccountID, D .AccountTotal, B.CategoryNumber, D .AccountNumber, D .AccountDesc, A.Amount AS TotalCost, 0 AS PO, 
A.CreatedDate AS Date, B.CategoryDescription, B.BudgetID, 
                         B.Budgetfileid ,c.COAID,C.DetailLevel
FROM            InvoiceLine A INNER JOIN
                         COA C ON A.COAID = C.COAID INNER JOIN
                         BudgetAccounts D ON  D.COAID=C.COAID INNER JOIN
                         Budgetcategory AS B ON D.CategoryId = B.cid
WHERE        InvoiceLinestatus = 'PAID' 
UNION
SELECT        B.BudgetCategoryID, D .AccountID, D .AccountTotal, B.CategoryNumber, D .AccountNumber, D .AccountDesc, 0 AS TotalCost, Amount AS PO, A.CreatedDate AS Date, 
B.CategoryDescription, B.BudgetID, 
                         B.Budgetfileid,c.COAID,C.DetailLevel
FROM            PurchaseOrderLine A INNER JOIN
                         COA C ON A.COAID = C.COAID INNER JOIN
                         BudgetAccounts D ON  D.COAID=C.COAID INNER JOIN
                         Budgetcategory AS B ON D.CategoryId = B.cid
WHERE        POLinestatus <> 'PAID' 


GO