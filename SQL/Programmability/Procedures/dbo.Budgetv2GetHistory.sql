SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

create procedure [dbo].[Budgetv2GetHistory]
(
@BudgetID int
, @ProdID int
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
	, CRW.AccountCount
	, CRW.EFCTotal
	, CRW.BudgetTotal
from Budgetv2 B
join Budgetv2_Types BT 
on B.BudgetType = BT.BudgetType
join (
	select CRW.BudgetID
		, CRW.version
		, count(1) as AccountCount
		, sum(EFC) as EFCTotal
		, sum(Budget) as BudgetTotal
	from CRWv2 CRW
	group by CRW.BudgetID, CRW.version
) CRW
on B.BudgetID = CRW.BudgetID
where B.BudgetID = @BudgetID
and B.ProdID = @ProdID
GO