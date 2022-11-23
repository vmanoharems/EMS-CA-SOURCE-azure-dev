SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
create view [dbo].[vVendor_FixState]
as
select  V.* ,vCS.StateName, vCS.StateCode
from tblVendor V
join vCountryStates vCS
on V.RemitState = vCS.Statecode
union
select  V.* ,vCS.StateName, vCS.StateCode
from tblVendor V
join vCountryStates vCS
on V.W9State = vCS.Statecode
union
select  V.* ,vCS.StateName, vCS.StateCode
from tblVendor V
join vCountryStates vCS
on V.RemitState = vCS.StateName
union
select  V.* ,vCS.StateName, vCS.StateCode
from tblVendor V
join vCountryStates vCS
on V.W9State = vCS.StateName
GO