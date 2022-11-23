SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetVendorAddPO] -- GetVendorAddPO 3
(
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  select VendorID,VendorName,(W9Address1+' '+ W9Address2+' '+W9Address3) as Addressw9 ,
  (W9City+' '+V.StateCode --( select case when W9Country='United States' then SUBSTRING(CS.StateCode, CHARINDEX('US-', CS.StateCode) + 3, LEN(CS.StateCode))else W9State end)
	+' '+W9Zip+' '
	+ (select case when W9Country='United States' then 'USA' else W9Country end)) as Address2w9,
  (RemitAddress1+' '+RemitAddress2+' '+RemitAddress3)as AddressRe,
  (RemitCity+' '+V.StateCode --(select case when RemitCountry='United States' then SUBSTRING(CC.StateCode, CHARINDEX('US-', CC.StateCode) + 3, LEN(CC.StateCode))else RemitState end )
	+' '+RemitZip+' '
	+(select case when RemitCountry='United States' then 'USA' else RemitCountry end))as Address2Re,
    isnull(COAId,0)as COAId,isnull(V.COAString,'')as COAString,TransactionCodeString,dbo.convertcodes(TransactionCodeString)as TransString
	,SetId,t.AccountCode as SetCode,SeriesId,tt.AccountCode as SeriesCode, isnull(DefaultDropdown,'')as DefaultDropdown,isnull(Warning,'')as Warning,isnull(Required,'') as Required
  from vVendor_FixState V 
  left  join TblAccounts T on t.AccountId=V.SetId
  left  join TblAccounts TT on tt.AccountId=V.SeriesId

  where V.ProdID=@ProdID and V.status=1
  order by VendorName


END







GO