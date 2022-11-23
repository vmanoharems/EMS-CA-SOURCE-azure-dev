SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE VIEW [dbo].[CRWEstimatedCost_Fix] AS
Select EC.*
from
	EstimatedCost EC
join
	(select COAID,BudgetFileID,BudgetID,DetailLevel,max(ID) as ID from EstimatedCost group by COAID,BudgetFileID,BudgetID,DetailLevel) as ES
on EC.ID = ES.ID
where  EC.ExpandValue = 0 -- Once a level has been expanded, then consider only the child elements
and EC.EFC>=0 -- EFC is never allowed to be less than 0





GO