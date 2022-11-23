CREATE PROCEDURE [dbo].[ReportPettyCash]   -- ReportPettyCash 3,'','','','','','','','','','','','','','','','',''
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@ReportDate date,
	@Company int,
	@PCBank int,
	@CurrencyCode int,
	@ReportCurrencyCode int,
	@ClosePeriodStatus nvarchar(50),
	@CreateDateFrom date,
	@CreateDateTo date,
	@TransactionNoFrom nvarchar(50),
	@TransactionNoTo nvarchar(50),
	@VendorId nvarchar(100),
	@BatchNumber nvarchar(50),
	@CreatedBy nvarchar(50),
	@Location nvarchar(50),
	@LocationSubTotal bit,
	@EpisodeSubTotal bit,
	@Status nvarchar(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	if(@TransactionNoFrom='')
	begin
	set @TransactionNoFrom =(select top 1 cast(TransactionNumber as int) From JournalEntry where Source='PC' and SourceTable='PettyCash')
	end
	if(@TransactionNoTo='')
	begin
	set @TransactionNoTo =(select top 1 cast(TransactionNumber as int) From JournalEntry where Source='PC' and SourceTable='PettyCash' order by 1 desc)
	end
	if(@CreateDateTo='1/1/0001')
	begin
	set @CreateDateTo=GETDATE();
	end


	declare @tz  int;
set @tz = dbo.tzforproduction(0);

	select p.PcEnvelopeID,p.EnvelopeNumber From PCEnvelope  p
			
 left outer join ClosePeriod c on c.ClosePeriodId=p.ClosePeriodId
 left outer join JournalEntry J on j.ReferenceNumber=p.PcEnvelopeID and j.Source='PC' and j.SourceTable='PettyCash'
 left outer join Recipient R on r.RecipientID=p.RecipientId
 left outer join Custodian cc on cc.CustodianID=p.CustodianId
 left outer join tblVendor V on v.VendorID=r.VendorID

	where p.Prodid=@ProdId
 and (convert(date,dbo.TZfromUTC(p.CreatedDate,@tz)) between @CreateDateFrom and @CreateDateTo)
 and cast(j.TransactionNumber as int) between cast(@TransactionNoFrom as int) and cast(@TransactionNoTo as int)
-- and (r.VendorID='' or @vendorId='')
and (r.VendorID in (select * FROM dbo.SplitCSV(@VendorID,',')) OR @VendorID='')
-- and (p.BatchNumber='' or @BatchNumber='')
 and (p.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
-- and (p.CreatedBy=@CreatedBy or @CreatedBy='')
and (p.CreatedBy in (select * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')
 and (p.Companyid=@Company or @Company='')
 and (cc.CustodianID=@PCBank or @PCBank='')
 and p.Status=@Status
END


GO