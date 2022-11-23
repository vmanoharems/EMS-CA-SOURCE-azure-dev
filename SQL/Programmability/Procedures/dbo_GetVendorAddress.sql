SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetVendorAddress] -- GetVendorAddress 7
(
@VendorID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

-- This really needs a full rewrite! JT
select W9Address1,W9Address2,W9Address3,W9City
, V.StateCode W9State --(select case when W9Country='United States' then 'USA' else W9Country end) W9State
, W9Zip
, (select case when W9Country='United States' then 'USA' else W9Country end) W9Country -- SUBSTRING(CS.StateCode, CHARINDEX('US-', CS.StateCode) + 3, LEN(CS.StateCode)) else W9State end) W9Country
, RemitAddress1,RemitAddress2,RemitAddress3,RemitCity
, RemitState
, RemitZip
, (select case when RemitCountry='United States' then 'USA' else RemitCountry end) RemitCountry --SUBSTRING(CC.StateCode, CHARINDEX('US-', CC.StateCode) + 3, LEN(CC.StateCode))else RemitState end) RemitCountry
, isnull(COAId,0)as COAId,isnull(COAString,'')as COAString,TransactionCodeString,dbo.convertcodes(TransactionCodeString)as TransString
	,SetId,isnull(t.AccountCode,'') as SetCode,SeriesId,isnull(tt.AccountCode,'') as SeriesCode,
	 isnull(DefaultDropdown,'')as DefaultDropdown,isnull(Warning,'')as Warning,isnull(Required,'') as Required
from vVendor_FixState V
-- inner Join CountryState CS on tblvendor.W9State=CS.StateName
--  Inner Join  CountryState CC on tblvendor.RemitState=CC.StateName 
left join TblAccounts T on V.SetID =  t.AccountId
left join TblAccounts TT on V.SeriesId = tt.AccountId
where VendorID=@VendorID

END
GO