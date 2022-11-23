SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetPaymentVoidData1] -- GetPaymentVoidData1 1   ,  GetPaymentVoidData 1
(
@BankID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	declare @PaymentId1 int;
	declare @PaidAmount1 decimal(18,2);
	declare @CheckNumber1 varchar(50);
    declare @CDate1 varchar(100);
    declare @VendorName1 varchar(200);
    declare @Status1 varchar(100);
    declare @TransactionNumber1 varchar(100);  
    --declare @InvoiceId1 int;
  
	declare @CheckStatus nvarchar(50);
  	set @CheckStatus='';

Declare @Mtree TABLE (PaymentId int,PaidAmount decimal(18,2),CheckNumber varchar(50),CDate varchar(100),
VendorName varchar(200),Status varchar(100),TransactionNumber varchar(100))



DECLARE Cus_Category CURSOR FOR 
  
select distinct a.PaymentId,a.PaidAmount,a.CheckNumber,convert(varchar(10),a.PaymentDate,101) as CDate,
c.VendorName,a.Status,d.TransactionNumber from Payment as a inner join PaymentLine as b on a.PaymentId=b.PaymentId
inner join tblVendor as c on a.VendorId=c.VendorID
inner join Journalentry as d on a.PaymentId=d.ReferenceNumber and d.SourceTable='Payment' and d.AuditStatus not in ('Reversed')
where a.Status in ('Printed','Voided','Cancelled') and b.BankID=@BankID order by a.CheckNumber
	
     open Cus_Category;
     fetch next from Cus_Category into @PaymentId1,@PaidAmount1,@CheckNumber1,@CDate1,
	 @VendorName1,@Status1,@TransactionNumber1

     while @@FETCH_STATUS = 0
     begin

	     if(@CheckNumber1=@CheckStatus)
	     begin

	        update @Mtree set TransactionNumber=TransactionNumber+','+@TransactionNumber1 where CheckNumber=@CheckNumber1;
	     end
	 else
	     begin

	     insert into @Mtree values(@PaymentId1,@PaidAmount1,@CheckNumber1,@CDate1,
	 @VendorName1,@Status1,@TransactionNumber1);

	 end


	 set @CheckStatus=@CheckNumber1;

	
 
        fetch next from Cus_Category into @PaymentId1,@PaidAmount1,@CheckNumber1,@CDate1,
	 @VendorName1,@Status1,@TransactionNumber1
	 end
     CLOSE Cus_Category
     DEALLOCATE Cus_Category


	 select * from @Mtree
	 end
GO