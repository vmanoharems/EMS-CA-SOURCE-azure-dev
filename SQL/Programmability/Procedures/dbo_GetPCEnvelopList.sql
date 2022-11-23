SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetPCEnvelopList] -- GetPCEnvelopList 3,'Posted'
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@Status nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	if(@Status='Pending')
	begin
	select p.PcEnvelopeID,p.Status,p.Companyid,cc.CompanyCode,p.EnvelopeNumber,
	convert(varchar(10),p.CreatedDate,110) As CreatedDate,p.CustodianId,
	c.CustodianCode,p.RecipientId,v.VendorName,v.VendorID,
	isnull(p.AdvanceAmount,0)as AdvanceAmount,isnull(p.EnvelopeAmount,0) as EnvelopeAmount
	,j.TransactionNumber
	 from PCEnvelope  P

	inner join Custodian C on C.CustodianID=P.CustodianId
	inner join Recipient R on R.RecipientID=P.RecipientId
	left outer join tblVendor V on v.VendorID=r.VendorID
	inner join Company CC on cc.CompanyID=p.Companyid
    left outer join JournalEntry j on j.ReferenceNumber=p.PcEnvelopeID and 
	j.Source='PC' and j.SourceTable='PettyCash'
	where p.Prodid=@ProdId and p.Status=@Status
	end
	else
	begin
	select p.PcEnvelopeID,p.Status,p.Companyid,cc.CompanyCode,p.EnvelopeNumber,
	convert(varchar(10),p.CreatedDate,110) As CreatedDate,p.CustodianId,
	c.CustodianCode,p.RecipientId,v.VendorName,v.VendorID,
	isnull(p.AdvanceAmount,0)as AdvanceAmount,
	isnull(p.EnvelopeAmount,0) as EnvelopeAmount
	,j.TransactionNumber
	 from PCEnvelope  P

	inner join Custodian C on C.CustodianID=P.CustodianId
	inner join Recipient R on R.RecipientID=P.RecipientId
	left outer join tblVendor V on v.VendorID=r.VendorID
	inner join Company CC on cc.CompanyID=p.Companyid
	  left outer join JournalEntry j on j.ReferenceNumber=p.PcEnvelopeID and 
	j.Source='PC' and j.SourceTable='PettyCash'
	where p.Prodid=@ProdId and p.Status in('Posted','Reversed')
	end
END



GO