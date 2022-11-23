SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetRecipientList] -- GetRecipientList 14
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select r.RecipientID,r.VendorID,v.VendorName,(W9Address1+' '+ W9Address2+' '+W9Address3) as Addressw9 ,
  (W9City+' '+( select case when W9Country='United States' then SUBSTRING(CS.StateCode, CHARINDEX('US-', CS.StateCode) + 3,
   LEN(CS.StateCode)) else W9State end)+' '+W9Zip+' '+ (select case when W9Country='United States' then 'USA' else
  W9Country end)) as Address2w9,
  (RemitAddress1+' '+RemitAddress2+' '+RemitAddress3)as AddressRe,
  (RemitCity+' '+(select case when RemitCountry='United States' then SUBSTRING(CC.StateCode, CHARINDEX('US-', CC.StateCode) + 3, LEN(CC.StateCode))else RemitState end )+' '+RemitZip+' '+(select case when RemitCountry='United States' then 'USA' else
  RemitCountry end))as Address2Re,
	r.CoaID,r.CoaString,
	r.SetId,r.SeriesId,isnull(a.AccountCode,'') as  SetAccountCode, isnull(AA.AccountCode,'') as  SeriesAccountCode
	 from Recipient r
	 inner join tblVendor v on v.VendorID=r.VendorID
	 inner Join CountryState CS on v.W9State=CS.StateName
     Inner Join  CountryState CC on v.RemitState=CC.StateName 
	 left outer join TblAccounts a on a.AccountId=r.SetId
	 left outer join TblAccounts aa on aa.AccountId=r.SeriesId
	where r.Prodid=@ProdId and r.Status=1
END


GO