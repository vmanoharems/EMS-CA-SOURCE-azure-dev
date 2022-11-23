SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

create view [dbo].[CRWEFCandBudget] as


select
RU.BudgetID
, RU.BudgetFileID
, RU.CategoryID
--, dbo.GetCOAIDbyBudgetCategoryID(CategoryID) as CategoryCOAID
, case when RU.EFCTotal = 0 then CF.EFC 
	when (RU.EFCTotal >CF.EFC) then CF.EFC
	else RU.EFCTotal end
--	+ isnull(ECS.SetEFC,0)
	as EFCTotal
, case when (RU.BudgetTotal = 0) then BCF.CategoryTotal
	when (RU.BudgetTotal>BCF.CategoryTotal) then BCF.CategoryTotal 
	else RU.BudgetTotal end
--	+ isnull(ECS.SetBudget,0)
as BudgetTotal
, CF.ETC
, CF.Budget as BlankBudget
, CF.BlankEFC
, CF.ExpandValue
, ECS.SetBudget
, ECS.SetEFC
, RU.COAID
, RU.BudgetTotal as RU_BudgetTotal
, BCF.CategoryTotal as BCF_CategoryTotal
, CF.ETC as CF_ETC
, CF.EFC as CF_EFC
, RU.EFCTotal as RU_EFCTotal
, CF.Budget as CF_Budget
, CF.BlankEFC as CF_BlankEFC
, ECS.SetBudget as ECS_SetBudget
, ECS.SetEFC as ECS_SetEFC
from
(
	select
	BAFF.BudgetID, BAFF.BudgetFileID, BAFF.CategoryID
	, sum(EFCD.EFC) as EFCTotal, sum(BAFF.AccountTotal) as BudgetTotal
	, case when EFCD.COAID is null then dbo.GetCOAIDbyBudgetCategoryID(CategoryID) else EFCD.COAID end as COAID
	from  CRWBudgetAccountsFinal_Fix BAFF
		 join (select * from CRWEstimatedCost_fix where ExpandValue in (0,9)
		) as EFCD
	on BAFF.COAID = EFCD.COAID and BAFF.BudgetID = EFCD.BudgetID and BAFF.BudgetFileID = EFCD.BudgetFileID
	group by BAFF.BudgetID, BAFF.BudgetFileID, BAFF.CategoryID,rollup(EFCD.COAID)
) as RU
left join BudgetCategoryFinal BCF on RU.COAID = BCF.COAID and RU.BudgetID = BCF.BudgetID and RU.BudgetFileID = BCF.BudgetFileID
left join CRWEstimatedCost_Fix CF on RU.COAID = CF.COAID and RU.BudgetID = CF.BUdgetID and RU.BudgetFileID = CF.BudgetFileID
left join (select COAID, BudgetID, BUDGETFILEID, isnull(sum(cast(ECS.Budget as float)),0) as SetBudget,isnull(sum(cast(EFC as float)),0) as SetEFC
			from EstimatedCostSet ECS
			group by BudgetID, BUDGETFILEID, COAID) as ECS
on RU.COAID = ECS.COAID and RU.BUDGETFILEID = ECS.BUDGETFILEID and RU.BudgetID = ECS.BudgetID

--where RU.BudgetID = 1 and RU.BudgetFileID = 5
GO