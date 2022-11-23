SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE VIEW [dbo].[CRWBudgetAccountsFinal_Fix] AS

SELECT BAF.[BudgetAccountID]
      ,BAF.[CategoryId]
      ,BAF.[AccountID]
      ,BAF.[AccountNumber]
      ,BAF.[AccountDesc]
      ,BAF.[AccountFringe]
      ,BAF.[AccountOriginal]
      ,cast(BAF.[AccountTotal] as decimal(10,2)) as AccountTotal
      ,BAF.[AccountVariance]
      ,BAF.[BudgetFileID]
      ,BAF.[BudgetID]
      ,BAF.[CreatedDate]
      ,BAF.[ModifiedDate]
      ,BAF.[CreatedBy]
      ,BAF.[ModifiedBy]
      ,BAF.[COAID]
      ,BAF.[COACODE]
      ,BAF.[DetailLevel]
      ,BAF.[ParentID]

from
	BudgetAccountsFinal BAF
join
	(select COAID,BudgetFileID,BudgetID,DetailLevel,max(BudgetAccountID) as ID from BudgetAccountsFinal group by COAID,BudgetFileID,BudgetID,DetailLevel) as ES
on BAF.BudgetAccountID = ES.ID



GO