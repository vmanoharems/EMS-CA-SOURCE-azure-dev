SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE procedure [dbo].[Budgetv2List]
(
@ProdID int
)
as
select
	B.BudgetID
	, B.BudgetName
	, B.BudgetDescription
	, B.BudgetType
	, B.BudgetOrigin
	, B.segmentJSON
	, B.createdby
	, B.createddate
	, B.modifiedby
	, B.modifieddate
	, B.islocked
	, BT.BudgetTypeDescription
from Budgetv2 B
join Budgetv2_Types BT 
on B.BudgetType = BT.BudgetType
where B.ProdID = @ProdID
GO