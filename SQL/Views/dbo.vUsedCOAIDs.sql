drop view vusedcoaids
go
SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
create view [dbo].[vUsedCOAIDs]
as
select COAID 
from AccountClearing AC 
where AccountName = 'CashAccount'
union all 
select COAID from Recipient
union all 
select COAID from Custodian
union all
select COA.COAID from COA
, (
	select len(AccountCode) as ACClen, *
		from AccountClearing 
		where BankId=1 and ProdId=14 and AccountName='CashAccount' and ClearingType='Account'
	) as USED
where right(COA.COACode, USED.ACClen) = USED.AccountCode
GO