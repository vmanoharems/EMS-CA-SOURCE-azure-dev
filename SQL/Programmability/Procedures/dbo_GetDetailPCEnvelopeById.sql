SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetDetailPCEnvelopeById]  -- GetDetailPCEnvelopeById 1
	-- Add the parameters for the stored procedure here
	@PcEnvelopeId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
select p.PcEnvelopeID,p.Status,p.Companyid,cc.CompanyCode,p.EnvelopeNumber,p.BatchNumber,
	convert(varchar(10),p.CreatedDate,110) As CreatedDate,p.CustodianId,
	vv.vendorname as CustodianCode,
	p.RecipientId,v.VendorName,v.VendorID,(v.W9Address1+' '+ v.W9Address2+' '+v.W9Address3) as Addressw9 ,
  (v.W9City+' '+( select case when v.W9Country='United States' then SUBSTRING(CS.StateCode, CHARINDEX('US-', CS.StateCode) + 3,
   LEN(CS.StateCode)) else v. W9State end)+' '+v.W9Zip+' '+ (select case when v.W9Country='United States' then 'USA' else
  v.W9Country end)) as Address2w9,
  (v.RemitAddress1+' '+v.RemitAddress2+' '+v.RemitAddress3)as AddressRe,
  (v.RemitCity+' '+(select case when v.RemitCountry='United States' then SUBSTRING(CountryCore.StateCode, CHARINDEX('US-', CountryCore.StateCode) + 3, LEN(CountryCore.StateCode))else v.RemitState end )+' '+v.RemitZip+' '+(select case when v.RemitCountry='United States' then 'USA' else
  v.RemitCountry end))as Address2Re,
	p.Description,
	isnull(p.AdvanceAmount,0)as AdvanceAmount,isnull(p.EnvelopeAmount,0) as EnvelopeAmount,
	isnull(p.LineItemAmount,0)as LineItemAmount,isnull(p.Difference,0)as Difference,p.ClosePeriodId ,CL.PeriodStatus,p.MirrorStatus,
	isnull(j.TransactionNumber,'')as TransactionNumber, p.PostedDate
	,r.COAID as RecipientCoaId ,r.CoaString as  RecipientCoaString
	,c.COAID as 	CustodianCoaId ,c.COACode as  	CustodianCoaString
	 from PCEnvelope  P

	inner join Custodian C on C.CustodianID=P.CustodianId
	inner join Recipient R on R.RecipientID=P.RecipientId
	left outer join tblVendor V on v.VendorID=r.VendorID
	left outer join tblVendor Vv on vv.VendorID=c.VendorID
	inner join Company CC on cc.CompanyID=p.Companyid
	inner join ClosePeriod CL on p.ClosePeriodId =CL.ClosePeriodId
	left outer join JournalEntry j on j.ReferenceNumber=p.PcEnvelopeID and j.Source='PC' and j.SourceTable='PettyCash'
	 inner Join CountryState CS on V.W9State=CS.StateName
     Inner Join  CountryState CountryCore on V.RemitState=CountryCore.StateName 

	where p.PcEnvelopeID=@PcEnvelopeId
END



GO