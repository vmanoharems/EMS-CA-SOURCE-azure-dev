SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetCustodianCode] -- GetCustodianCode 14
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select C.CustodianID,v.VendorName as CustodianCode	
	--,CASE(v.SetId) WHEN  null THEN c.Setid ELSE v.SetId END  as Setid
	--,CASE(v.SetId) WHEN  null THEN a.AccountCode ELSE AB.AccountCode END  as SetCode
	--,CASE(v.SeriesId) WHEN  null THEN c.SeriesID ELSE v.SeriesId END  as SeriesID
	--,CASE(v.SeriesId) WHEN  null THEN a.AccountCode ELSE AC.AccountCode END  as SeriesCode
	, C.SetID
	, AB.AccountCode as SetCode
	, C.SeriesID
	, AC.AccountCode as SeriesCode
	,C.COAID
	,COA.COACode as COACode
	
	 from Custodian C
	join COA on C.COAID = COA.COAID

	left outer join TblAccounts A on  A.AccountId=c.Setid
	left outer join TblAccounts AA on  AA.AccountId=c.SeriesID
	inner join tblvendor v on v.VendorID=c.VendorID 
	left outer join TblAccounts AB on  AB.AccountId=C.Setid
	left outer join TblAccounts AC on  AC.AccountId=C.SeriesID
	where
		c.Status=1
	and c.Prodid=@ProdId 	
END
GO