SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
 CREATE PROCEDURE [dbo].[ReportsInvoiceAccountJSON]

 @JSONparameters nvarchar(max) --= '{"Account":"on","InvoiceFilterCompany":["1"],"InvoiceFilterLocation":null,"InvoiceFilterSet":null,"ApInvsBank":"","txtApInvshdnBank":"","txtApInvsPeriod":"Current","txtApInvsPeriodPost":null,"ApInvsCreatedFrom":"","ApInvsCreatedTo":"","InvoiceTransFrom":"","InvoiceTransTo":"","InvoiceVendor":null,"InvoiceBatch":"","InvoiceUserName":"","ApInvsDate":"","ApInvsProject":"","ApInvsCurrncy":"","ApInvsProjStatus":"","ModuleMyDefName":"","objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRDF":{"CId":1,"PeriodStatus":"Current","CreatedDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","TransactionNumberFrom":"","TransactionNumberTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","ProdId":"14","Status":"Saved"},"Invoice":{"objRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170904","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2"},"objRDF":{"CId":1,"PeriodStatus":"Current","CreatedDateFrom":"01/01/2017","CreatedDateTo":"09/03/2017","TransactionNumberFrom":"","TransactionNumberTo":"","VendorId":"","BatchNumber":"","CreatedBy":"","ProdId":"14","Status":"Saved"}}}'
   AS
   BEGIN
 if ISJSON(@JSONparameters) is null return;	
	
declare @CID int=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.InvoiceFilterCompany'),''),'[',''),']',''),'"','');
declare @BankId int=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.ApInvsBank'),''),'[',''),']',''),'"','');
declare @PeriodStatus varchar(50)=isnull(JSON_value(@JSONparameters,'$.txtApInvsPeriod'),-1);
declare @CreatedDateFrom date =isnull(JSON_value(@JSONparameters,'$.InvoiceTransFrom'),-1);
declare @CreatedDateTo date=isnull(JSON_value(@JSONparameters,'$.ApInvsCreatedTo'),-1);
declare @TransactionNumberFrom varchar(50)=isnull(JSON_value(@JSONparameters,'$.InvoiceTransFrom'),-1);
declare @TransactionNumberTo varchar(50)=isnull(JSON_value(@JSONparameters,'$.InvoiceTransFrom'),-1);
declare @Vendor varchar(500)=isnull(JSON_value(@JSONparameters,'$.InvoiceVendor'),-1);
declare @BatchNumber varchar(500)=isnull(JSON_value(@JSONparameters,'$.InvoiceBatch'),-1);
declare @User varchar(500)=isnull(JSON_value(@JSONparameters,'$.InvoiceUserName'),-1);
declare @ProdId int=Replace(Replace(Replace(isnull(JSON_query(@JSONparameters,'$.ProdId'),''),'[',''),']',''),'"','');
declare @Status nvarchar(50)=isnull(JSON_value(@JSONparameters,'$.ApInvsProjStatus'),-1);
declare @CreatedBy varchar(500)=isnull(JSON_value(@JSONparameters,'$.InvoiceUserName'),-1);

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
		   ,t.AccountCode as SetCode,tt.AccountCode as SeriesCode,f.AccountID ,f.AccountName,d.TaxCode
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
		   order by f.AccountCode,cast(a.TransactionNumber as int)  
		   end
   else
   begin
			select 
		   a.BatchNumber,a.TransactionNumber,a.ClosePeriod,b.InvoiceNumber,
		   c.VendorName,b.VendorName as ReferenceVendor,convert(varchar(10),b.InvoiceDate,101) as InvoiceDate,
		   dbo.GetPaymentDetailbyInvoiceID(b.InvoiceID,1) as PaymentID , dbo.GetPaymentDetailbyInvoiceID(b.InvoiceID,2) as PaymentDate,
		   dbo.BreakCOA(d.COAString,'Location') as Location,b.Description ,f.AccountCode,
		   dbo.convertcodes(d.TransactionString) as TransStr,d.LineDescription,b.OriginalAmount,d.Amount,
		   t.AccountCode as SetCode,tt.AccountCode as SeriesCode,f.AccountID,f.AccountName,d.TaxCode

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
		   order by f.AccountCode,cast(a.TransactionNumber as int)  
		   End
		   END
GO