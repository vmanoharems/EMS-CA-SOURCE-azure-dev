SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetListOfCustodian] -- GetListOfCustodian 3
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select c.Status,c.CustodianID,c.CustodianCode,c.Currency,v.VendorName,c.VendorID
	--,c.COACode
	,COA.COACode
	,c.COAID,
	c.Setid ,isnull( t.AccountCode,'') as SetCode,
	c.SeriesID,isnull( tt.AccountCode,'') as SeriesCode
	from Custodian C
	join COA on C.COAID = COA.COAID
	left outer join TblAccounts T on c.Setid=T.AccountId
	left outer join TblAccounts TT on c.SeriesID=TT.AccountId
	inner join tblVendor V on V.VendorID=c.VendorID

END



GO