SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetRecipientVendorList] -- GetRecipientVendorList 3
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
--	select  *from tblVendor

select v.VendorID,VendorName,v.VendorNumber,v.RemitCountry,RemitAddress1,RemitCity,c.StateCode as RemitState,Type,
isnull(r.RecipientID,0) as RecipientID,isnull(r.CoaId,'')as  CoaId,
isnull(r.CoaString,'') as CoaString,r.Status,
r.SetId,r.SeriesId,isnull(a.AccountCode,'') as  SetAccountCode, isnull(AA.AccountCode,'') as  SeriesAccountCode
 from tblVendor v
left outer join Recipient R on r.VendorID=v.VendorID
left outer join CountryState C on v.RemitState=c.StateName
left outer join TblAccounts A on a.AccountId=r.SetId
left outer join TblAccounts AA on aa.AccountId=r.SeriesId

where v.ProdID=@ProdId and v.Type='Petty Cash'
END



GO