CREATE PROCEDURE [dbo].[GetPCEnvelopeLineDetailById] -- GetPCEnvelopeLineDetailById1 8
	@PCEnvelopeId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select p.PCEnvelopeID,p.EnvelopeLineID,p.COAID,C.COACode as CoaString,Amount,p.VendorID,v.VendorName,
	isnull(p.TaxCode,'')as TaxCode,p.Setid,p.SeriesID,
	a.AccountCode as setAccountCode,
	aA.AccountCode as SeriesAccountCode,
	LineDescription	,p.TransactionCodeString,dbo.convertcodes(p.TransactionCodeString)as TransactionvalueString,
	isnull(p.Displayflag,'') as Displayflag,  isnull(c.AccountTypeid,'') as AccountTypeId
	, dbo.BreakCOA(p.CoaString,'Location') as Location,isnull(dbo.BreakCOA(p.CoaString,'Episode'),'') as Episode ,zz.AccountCode as Acct
	 from PCEnvelopeLine  p
	 left outer join TblAccounts A on a.AccountId=p.Setid
	 left outer join TblAccounts AA on aa.AccountId=p.SeriesID
	 left outer join tblVendor V on v.VendorID=p.VendorID
	 left outer join  COA c on c.COAID=p.COAID	
	 left outer join TblAccounts as zz on c.AccountId=zz.AccountId
	 where PCEnvelopeID=@PCEnvelopeId
END


GO