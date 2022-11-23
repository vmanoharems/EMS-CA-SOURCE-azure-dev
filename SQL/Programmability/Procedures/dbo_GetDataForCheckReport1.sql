SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetDataForCheckReport1]  -- GetDataForCheckReport1 25
(
@CheckRunID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CheckNo1 int;
	declare @VendorNumber1 varchar(100);
	declare @PrintOncheckAS1 varchar(100);
    declare @TransactionNumber1 varchar(100);
    declare @PayBy1 varchar(100);
    declare @CheckRunID1 int;
    declare @PaidAmount1 decimal(18,2);
    declare @CompanyPeriod1 int;
    declare @Status1 varchar(100);
	declare @CheckStatus int;
  		set @CheckStatus=0;
Declare @Mtree TABLE (CheckNo int,VendorNumber int,PrintOncheckAS varchar(100),
TransactionNumber varchar(100), PayBy varchar(100),CheckRunID int,PaidAmount decimal(18,2),CompanyPeriod int,Status varchar(100)
)

DECLARE Cus_Category CURSOR FOR 
   select a.CheckNo,c.VendorNumber,c.PrintOncheckAS,d.TransactionNumber,b.PayBy,a.CheckRunID,b.PaidAmount,e.CompanyPeriod,b.Status
  from CheckRunAddon as a 
 inner join Payment as b on a.PaymentID=b.PaymentId
 inner join tblVendor as c on b.VendorId=c.VendorID
 inner join JournalEntry as d on b.PaymentId=d.ReferenceNumber and d.SourceTable='Payment'
 inner join ClosePeriod as e on d.ClosePeriod=e.ClosePeriodId and  d.SourceTable='Payment'
 where a.CheckRunID=@CheckRunID ;
	
     open Cus_Category;
     fetch next from Cus_Category into @CheckNo1,@VendorNumber1,@PrintOncheckAS1,@TransactionNumber1,
	 @PayBy1,@CheckRunID1,@PaidAmount1,@CompanyPeriod1,@Status1

     while @@FETCH_STATUS = 0
     begin

	     if(@CheckNo1=@CheckStatus)
	     begin

	        update @Mtree set TransactionNumber=TransactionNumber+','+@TransactionNumber1 where CheckNo=@CheckNo1;
	     end
	 else
	     begin

	     insert into @Mtree values(@CheckNo1,@VendorNumber1,@PrintOncheckAS1,@TransactionNumber1,
	     @PayBy1,@CheckRunID1,@PaidAmount1,@CompanyPeriod1,@Status1);

	 end


	 set @CheckStatus=@CheckNo1;

	
 
        fetch next from Cus_Category into @CheckNo1,@VendorNumber1,@PrintOncheckAS1,@TransactionNumber1,
	 @PayBy1,@CheckRunID1,@PaidAmount1,@CompanyPeriod1,@Status1
	 end
     CLOSE Cus_Category
     DEALLOCATE Cus_Category


	 select * from @Mtree
	 end
GO