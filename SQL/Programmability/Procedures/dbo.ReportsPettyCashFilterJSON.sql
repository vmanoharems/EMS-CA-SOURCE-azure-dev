SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
----Note: SP Used for Both Audit and Posted
CREATE PROCEDURE [dbo].[ReportsPettyCashFilterJSON] -- ReportsPettyCashFilterJSON '{"ReportDate":"09/05/2017","Company":["1"],"PCFilterLocation":null,"PCFilterSet":null,"PCBankPettyCash":"","hdnPCBankPettyCash":"","txtPettyCashPeriod":"1","ApInvsCreatedFrom":"","ApInvsCreatedTo":"","PettyCashFrom":"","PettyCashTransTo":"","PettyCashVendor":null,"PettyCashBatch":null,"PettyCashUserName":null,"objRD":{"ProductionName":"EMS-Feature","Company":0,"Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRPC":{"ProdId":14,"ReportDate":"09/05/2017","Company":1,"Project":"","PCBank":"0","CurrencyCode":0,"ReportCurrencyCode":0,"ClosePeriodStatus":"1","CreateDateFrom":"1/1/0001","CreateDateTo":"09/05/2017","TransactionNoFrom":"","TransactionNoTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","Location":"","Status":"Pending","UserName":""},"ProdId":"14","UserId":"59","PC":{"objRD":{"ProductionName":"EMS-Feature","Company":0,"Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRPC":{"ProdId":14,"ReportDate":"09/05/2017","Company":1,"Project":"","PCBank":"0","CurrencyCode":0,"ReportCurrencyCode":0,"ClosePeriodStatus":"1","CreateDateFrom":"1/1/0001","CreateDateTo":"09/05/2017","TransactionNoFrom":"","TransactionNoTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","Location":"","Status":"Pending","UserName":""}}}'
@JSONparameters nvarchar(max)
--declare @JSONparameters nvarchar(max)='{"ReportDate":"09/05/2017","Company":["1"],"PCFilterLocation":null,"PCFilterSet":null,"PCBankPettyCash":"","hdnPCBankPettyCash":"","txtPettyCashPeriod":"1","ApInvsCreatedFrom":"","ApInvsCreatedTo":"","PettyCashFrom":"","PettyCashTransTo":"","PettyCashVendor":null,"PettyCashBatch":null,"PettyCashUserName":null,"objRD":{"ProductionName":"EMS-Feature","Company":0,"Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRPC":{"ProdId":14,"ReportDate":"09/05/2017","Company":1,"Project":"","PCBank":"0","CurrencyCode":0,"ReportCurrencyCode":0,"ClosePeriodStatus":"1","CreateDateFrom":"1/1/0001","CreateDateTo":"09/05/2017","TransactionNoFrom":"","TransactionNoTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","Location":"","Status":"Pending","UserName":""},"ProdId":"14","UserId":"59","PC":{"objRD":{"ProductionName":"EMS-Feature","Company":0,"Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRPC":{"ProdId":14,"ReportDate":"09/05/2017","Company":1,"Project":"","PCBank":"0","CurrencyCode":0,"ReportCurrencyCode":0,"ClosePeriodStatus":"1","CreateDateFrom":"1/1/0001","CreateDateTo":"09/05/2017","TransactionNoFrom":"","TransactionNoTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","Location":"","Status":"Pending","UserName":""}}}';
AS
if ISJSON(@JSONparameters) is null return

declare @ProdId int = isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @ReportDate date = isnull(json_value(@JSONparameters,'$.ReportDate'),'1900-01-01');
declare @Company int = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.Company'),''),'[',''),']',''),'"','');
declare @PCBank int = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.PCBank'),-1);
declare @CurrencyCode int = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.CurrencyCode'),-1);
declare @ReportCurrencyCode int = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.ReportCurrencyCode'),-1);
declare @ClosePeriodStatus nvarchar(50) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.ClosePeriodStatus'),'');
declare @CreateDateFrom date = isnull(json_value(@JSONparameters,'$.PC.objRPC.CreateDateFrom'),'1900-01-01');
declare @CreateDateTo date = isnull(json_value(@JSONparameters,'$.PC.objRPC.CreateDateTo'),'1900-01-01');
declare @TransactionNoFrom nvarchar(50) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.TransactionNoFrom'),'');
declare @TransactionNoTo nvarchar(50) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.TransactionNoTo'),'');
declare @VendorId nvarchar(100) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.VendorId'),'');
declare @BatchNumber nvarchar(50) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.BatchNumber'),'');
declare @CreatedBy nvarchar(50) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.CreatedBy'),'');
declare @Location nvarchar(50) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.Location'),'');
declare @Status nvarchar(10) = isnull(JSON_value(@JSONparameters,'$.PC.objRPC.Status'),'');

--select @Status;
BEGIN
	SET NOCOUNT ON;
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
	and (r.VendorID in (select * FROM dbo.SplitCSV(@VendorID,',')) OR @VendorID='')
	and (p.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
	and (p.CreatedBy in (select * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')
	and (p.Companyid=@Company or @Company='')
	and (cc.CustodianID=@PCBank or @PCBank='')
	and p.Status=@Status
END
 
GO