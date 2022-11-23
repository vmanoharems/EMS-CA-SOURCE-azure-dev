SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
--drop view [dbo].[vCountryStates] 
create view [dbo].[vCountryStates] 
WITH SCHEMABINDING 
as
select
ID_CS, CountryID, StateID, StateType,StateName, StateCode as CombinedStateCode
,right(CS.StateCode,len(CS.StateCode)-charindex('-',CS.StateCode)) as StateCode
from dbo.CountryState CS where (CS.StateCode like 'US-%' or CS.StateCode like 'CA-%')
GO


SET QUOTED_IDENTIFIER ON
GO

CREATE UNIQUE CLUSTERED INDEX [IDX_UCS]
  ON [dbo].[vCountryStates] ([ID_CS])
GO

CREATE INDEX [IDX_CS]
  ON [dbo].[vCountryStates] ([StateCode])
GO