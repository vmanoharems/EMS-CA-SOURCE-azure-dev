SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- APInvoiceReportbyTransaction 1,1,'both','01/01/1999','2017-12-31','','','','','',53,'Saved',''
CREATE PROCEDURE [dbo].[APInvoiceReportbyTransaction] 
(
 @CID int,
 @BankId int,
 @PeriodStatus varchar(50),
 @CreatedDateFrom date,
 @CreatedDateTo date,
 @TransactionNumberFrom varchar(50),
 @TransactionNumberTo varchar(50),
 @Vendor varchar(500),
 @BatchNumber varchar(500),
 @User varchar(500),
 @ProdId int,
 @Status nvarchar(50),
 @CreatedBy varchar(500)
)
AS
BEGIN

	
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