SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[APInvoiceFilter] -- APInvoiceFilter '1','4','01/01/1999 ','2016-12-31 ','','','','','','','','','',53,'Posted'

 @BankId int, @PeriodStatus nvarchar(50),
 @CreatedDateFrom date, @CreatedDateTo datetime,
 @TransactionNumberFrom nvarchar(50),
 @TransactionNumberTo nvarchar(50),
 @VendorId nvarchar(100),
 @BatchNumber nvarchar(50),
 @CreatedBy int,
 @LocationSubTotal bit,
 @EpisodeSubTotal bit,
 @ExculdeOffSet bit,
 @CompressOffSet bit,
 @ProdId int,
 @Status nvarchar(50)
	
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
-- else
-- begin
--  set @CreatedDateTo = dateadd(DD, 1, @CreatedDateTo);
-- end
--print @CreatedDateTo;

declare @tz  int;
set @tz = dbo.tzforproduction(0);


 if(@PeriodStatus='')
 begin

  select 
 i.Invoiceid,i.InvoiceNumber,i.Amount
  from Invoice I
  left outer join BankInfo B on B.BankId=i.BankId
 left outer join ClosePeriod c on c.ClosePeriodId=i.ClosePeriodId
 left outer join JournalEntry J on j.ReferenceNumber=i.Invoiceid and j.Source='AP' and j.SourceTable='Invoice'
 left outer join tblVendor V on v.VendorID=i.VendorID
 left outer join CAUsers U on v.CreatedBy= U.UserID
 where i.ProdID=@ProdId
 and dbo.TZfromUTC(i.InvoiceDate,@tz)  between @CreatedDateFrom and @CreatedDateTo
 and cast (j.TransactionNumber as int) between cast (@TransactionNumberFrom as int) and cast(@TransactionNumberTo as int )
and (i.VendorID in (select * FROM dbo.SplitCSV(@VendorID,',')) OR @VendorID='')
 and (i.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
 and (i.CreatedBy in (select * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')
 and i.InvoiceStatus =@Status
 end
 else 
 begin
 
  select 
 i.Invoiceid,i.InvoiceNumber,i.Amount
  from Invoice I
  left outer join BankInfo B on B.BankId=i.BankId
 left outer join ClosePeriod c on c.ClosePeriodId=i.ClosePeriodId
 left outer join JournalEntry J on j.ReferenceNumber=i.Invoiceid and j.Source='AP' and j.SourceTable='Invoice'
 left outer join tblVendor V on v.VendorID=i.VendorID
 left outer join CAUsers U on v.CreatedBy= U.UserID

 where i.ProdID=@ProdId
 and i.ClosePeriodId in (select * FROM dbo.SplitCSV(@PeriodStatus,','))
 and dbo.TZfromUTC(i.InvoiceDate,@tz)  between @CreatedDateFrom and @CreatedDateTo
 and cast (j.TransactionNumber as int) between cast (@TransactionNumberFrom as int) and cast(@TransactionNumberTo as int )
and (i.VendorID in (select * FROM dbo.SplitCSV(@VendorID,',')) OR @VendorID='')
 and (i.BatchNumber in (select * FROM dbo.SplitCSV(@BatchNumber,',')) OR @BatchNumber='')
 and (i.CreatedBy in (select * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')
 and i.InvoiceStatus =@Status
 end




END



GO