SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
create PROCEDURE [dbo].[ReportsInvoiceTransactionJSON]
 @JSONParameters  nvarchar(max)
AS
BEGIN

 SET NOCOUNT ON;

   --declare @JSONParameters  nvarchar(max)='{"Transaction":"on","InvoiceFilterCompany":["1"],"InvoiceFilterLocation":null,"InvoiceFilterSet":null,"ApInvsBank":"","txtApInvshdnBank":"","txtApInvsPeriod":"Current","txtApInvsPeriodPost":null,"ApInvsCreatedFrom":"","ApInvsCreatedTo":"","InvoiceTransFrom":"","InvoiceTransTo":"","InvoiceVendor":null,"InvoiceBatch":"","InvoiceUserName":"","ApInvsDate":"","ApInvsProject":"","ApInvsCurrncy":"","ApInvsProjStatus":"","ModuleMyDefName":"","objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRDF":{"CId":1,"PeriodStatus":"Current","CreatedDateFrom":"01/01/2017","CreatedDateTo":"09/05/2017","TransactionNumberFrom":"","TransactionNumberTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","ProdId":"14","Status":"Saved"},"Invoice":{"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRDF":{"CId":1,"PeriodStatus":"Current","CreatedDateFrom":"01/01/2017","CreatedDateTo":"09/05/2017","TransactionNumberFrom":"","TransactionNumberTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","ProdId":"14","Status":"Saved"}},"ProdId":"14","UserId":"59"}';
   -- exec  ReportsInvoiceTransactionSON '{"Transaction":"on","InvoiceFilterCompany":["1"],"InvoiceFilterLocation":null,"InvoiceFilterSet":null,"ApInvsBank":"","txtApInvshdnBank":"","txtApInvsPeriod":"Current","txtApInvsPeriodPost":null,"ApInvsCreatedFrom":"","ApInvsCreatedTo":"","InvoiceTransFrom":"","InvoiceTransTo":"","InvoiceVendor":null,"InvoiceBatch":"","InvoiceUserName":"","ApInvsDate":"","ApInvsProject":"","ApInvsCurrncy":"","ApInvsProjStatus":"","ModuleMyDefName":"","objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRDF":{"CId":1,"PeriodStatus":"Current","CreatedDateFrom":"01/01/2017","CreatedDateTo":"09/05/2017","TransactionNumberFrom":"","TransactionNumberTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","ProdId":"14","Status":"Saved"},"Invoice":{"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170905","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRDF":{"CId":1,"PeriodStatus":"Current","CreatedDateFrom":"01/01/2017","CreatedDateTo":"09/05/2017","TransactionNumberFrom":"","TransactionNumberTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","ProdId":"14","Status":"Saved"}},"ProdId":"14","UserId":"59"}';
 declare @CID int= Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.InvoiceFilterCompany'),''),'[',''),']',''),'"','');
 declare @BankId int= isnull(JSON_value(@JSONparameters,'$.ApInvsBank'),-1);
 declare @PeriodStatus varchar(50) = isnull(JSON_value(@JSONparameters,'$.txtApInvsPeriod'),'');
 declare @CreatedDateFrom date= isnull(json_value(@JSONparameters,'$.VendorCreatedFrom'),'1900-01-01');
 declare @CreatedDateTo date= isnull(JSON_value(@JSONparameters,'$.VendorCreatedTo'),getdate());
 declare @TransactionNumberFrom varchar(50) = isnull(JSON_value(@JSONparameters,'$.InvoiceTransFrom'),-1);
 declare @TransactionNumberTo varchar(50) = isnull(JSON_value(@JSONparameters,'$.InvoiceTransTo'),-1);
 declare @Vendor varchar(500) = isnull(JSON_value(@JSONparameters,'$.InvoiceVendor'),'');
 declare @BatchNumber varchar(500) = isnull(JSON_value(@JSONparameters,'$.InvoiceBatch'),'');
 declare @User varchar(500)= isnull(JSON_value(@JSONparameters,'$.InvoiceUserName'),'');
 declare @ProdId int= isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
 declare @Status nvarchar(50)= isnull(JSON_value(@JSONparameters,'$.Invoice.objRDF.Status'),'');
 declare @CreatedBy varchar(500)= isnull(JSON_value(@JSONparameters,'$.Invoice.objRDF.CreatedBy'),'');
 declare @Location nvarchar(50) = Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.InvoiceFilterLocation'),''),'[',''),']',''),'"','');
 declare @Set nvarchar(50)= Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.InvoiceFilterSet'),''),'[',''),']',''),'"','');

if(@TransactionNumberFrom='')
 begin
   set @TransactionNumberFrom= (select Top 1 cast(TransactionNumber as int) from JournalEntry)
 end
 if(@TransactionNumberTo='')
 begin
set @TransactionNumberTo= (select Top 1 cast(TransactionNumber as int) from JournalEntry order by 1 desc )
 end

if(@CreatedDateFrom='')
 begin
    set @CreatedDateFrom= '01/01/1999';
 end

if(@CreatedDateTo='')
 begin
  set @CreatedDateTo= dateadd(DD, 1, getdate());
 end
 else
 begin
  set @CreatedDateTo= dateadd(DD, 1, @CreatedDateTo);
 end



 
    declare @PrId1 int,@PrId2 int
	set @PrId1=0;set @PrId2=0;
	if(@PeriodStatus='Current')
	begin
		set @PrId1=dbo.GetCurrentOpenPeriodID(@CID,default); 
	end
	else if(@PeriodStatus='Future')
	begin
		set @PrId2=(select ClosePeriodId  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Future')
	end
	else if(@PeriodStatus='Both')
	begin
		set @PrId1=(select isnull(ClosePeriodId,0)  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Current')
		set @PrId2=(select isnull(ClosePeriodId,0)  from ClosePeriod  where CompanyId=@CID and Status='Open' and PeriodStatus='Future')
	end

 
 if(@Status='Saved')
 begin

		select 
		a.BatchNumber,a.TransactionNumber,a.ClosePeriod,b.InvoiceNumber,
		c.VendorName,b.VendorName as ReferenceVendor,convert(varchar(10),b.InvoiceDate,101) as InvoiceDate,
		dbo.GetPaymentDetailbyInvoiceID(b.InvoiceID,1) as PaymentID , dbo.GetPaymentDetailbyInvoiceID(b.InvoiceID,2) as PaymentDate,
		dbo.BreakCOA(d.COAString,'Location') as Location,b.Description ,f.AccountCode,
		dbo.convertcodes(d.TransactionString) as TransStr,d.LineDescription,b.OriginalAmount,d.Amount
		,t.AccountCode as SetCode,tt.AccountCode as SeriesCode
		,d.TaxCode
		from JournalEntry as a 
		inner join Invoice as b on a.ReferenceNumber=b.InvoiceID and a.SourceTable='Invoice'
		inner join InvoiceLine as d on b.InvoiceID=d.InvoiceID
		left Join tblVendor as c on b.VendorID=c.VendorID
		inner join COA as e on d.COAID=e.COAID
		inner Join tblAccounts as f on e.AccountID=f.AccountID
   
		left outer join TblAccounts T on  d.SetId=t.AccountId
			left outer join TblAccounts TT on  d.SeriesId=tt.AccountId
		where a.AuditStatus=@Status and a.SourceTable='Invoice' and
		a.ProdID=@ProdId and b.CompanyID=@CID and (b.BankId=@BankId or @BankID = 0)
		and (cast( b.InvoiceDate  as Date) between @CreatedDateFrom and @CreatedDateTo)
		and cast (a.TransactionNumber as int) between cast (@TransactionNumberFrom as int) and cast(@TransactionNumberTo as int )
		and (b.VendorID in (select * FROM dbo.SplitCSV(@Vendor,',')) OR @Vendor='')
		and (a.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
		and (a.CreatedBy in (select * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')
		and (a.ClosePeriod <=@PrId1 or a.ClosePeriod=@PrId2)
		order by cast(a.TransactionNumber as int) 
   end
   else
   begin
			select 
		   a.BatchNumber,a.TransactionNumber,a.ClosePeriod,b.InvoiceNumber,
		   c.VendorName,b.VendorName as ReferenceVendor,convert(varchar(10),b.InvoiceDate,101) as InvoiceDate,
		   dbo.GetPaymentDetailbyInvoiceID(b.InvoiceID,1) as PaymentID , dbo.GetPaymentDetailbyInvoiceID(b.InvoiceID,2) as PaymentDate,
		   dbo.BreakCOA(d.COAString,'Location') as Location,b.Description ,f.AccountCode,
		   dbo.convertcodes(d.TransactionString) as TransStr,d.LineDescription,b.OriginalAmount,d.Amount,
		   t.AccountCode as SetCode,tt.AccountCode as SeriesCode
			,d.TaxCode
		   from JournalEntry as a 
		   inner join Invoice as b on a.ReferenceNumber=b.InvoiceID and a.SourceTable='Invoice'
		   inner join InvoiceLine as d on b.InvoiceID=d.InvoiceID
		   left Join tblVendor as c on b.VendorID=c.VendorID
		   inner join COA as e on d.COAID=e.COAID
		   inner Join tblAccounts as f on e.AccountID=f.AccountID

			left outer join TblAccounts T on  d.SetId=t.AccountId
			 left outer join TblAccounts TT on  d.SeriesId=tt.AccountId

		   where a.AuditStatus=@Status and a.SourceTable='Invoice' and
		   a.ProdID=@ProdId and b.CompanyID=@CID and (b.BankId=@BankId or @BankID = 0)
		 and (cast( b.InvoiceDate  as Date) between @CreatedDateFrom and @CreatedDateTo)
		 and cast (a.TransactionNumber as int) between cast (@TransactionNumberFrom as int) and cast(@TransactionNumberTo as int )
		and (b.VendorID in (select * FROM dbo.SplitCSV(@Vendor,',')) OR @Vendor='')
		 and (a.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
		 and (a.CreatedBy in (select * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')
		 and (a.ClosePeriod in (select * FROM dbo.SplitCSV(@PeriodStatus,',')) OR @PeriodStatus='')
		   order by cast(a.TransactionNumber as int) 

  end


 
END
GO