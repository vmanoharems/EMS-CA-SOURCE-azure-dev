SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[JournalEntryPayment1] 
(
@PaymentID int,
@ProdID int,
@UserID int,
@BankID int,
@CompanyCode varchar(50),
@BatchNumber varchar(100)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;
	declare @JEID int;

	select @CID=CompanyID from Company where ProdID=@ProdID and CompanyCode=@CompanyCode;

	declare @TransactionNo int;

	select @TransactionNo=isnull(max(cast(TransactionNumber as int)),0) from JournalEntry ;
	
    declare @InvoiceJEID int;

    declare @DD decimal(18,2);
    declare @CC decimal(18,2);
	declare @CheckNoo varchar(100);

	select @CheckNoo=CheckNumber from Payment where PaymentId=@PaymentID
	
declare @InVID int;
declare @ClosePID int;
select @InVID=InvoiceId from PaymentLine where PaymentId=@PaymentID

select @ClosePID=ClosePeriodId from Invoice where Invoiceid=@InVID


	

    select @DD=sum(DebitTotal),@CC=sum(CreditTotal) from JournalEntry where 
   ReferenceNumber in (select InvoiceId from PaymentLine where PaymentId=@PaymentID) and SourceTable='Invoice'

   insert into JournalEntry (TransactionNumber,Source,Description,EntryDate,DebitTotal,CreditTotal,TotalLines,
   ImbalanceAmount,AuditStatus,PostedDate
   ,ReferenceNumber,BatchNumber,ProdId,CreatedDate,createdBy,CompanyId,SourceTable,ClosePeriod,DocumentNo,CurrentStatus)
   values(@TransactionNo+1,'AP','',CURRENT_TIMESTAMP,@CC,@DD,0,0,'Posted',CURRENT_TIMESTAMP
  ,@PaymentID,@BatchNumber,@ProdID,CURRENT_TIMESTAMP,@UserID,@CID,'Payment',@ClosePID,@CheckNoo,'Current')

  set @JEID=@@IDENTITY;


  declare @AccType varchar(50);
  declare @COAID int;
  declare @DebitAmt decimal(18,2);
  declare @RowCnt int;

   
   select @RowCnt=count(*) from JournalEntryDetail
   where JournalEntryId in (
select JournalEntryId from Journalentry where ReferenceNumber in (select InvoiceId from PaymentLine where PaymentId=@PaymentID)
and SourceTable='Invoice') and CreditAmount>0


 declare @JEID1 int;
 

   DECLARE c2 CURSOR FOR  
	select JournalEntryId from JournalEntry
  where ReferenceNumber in (
select InvoiceId from PaymentLine where PaymentId=@PaymentID)
and SourceTable='Invoice'
	
   OPEN c2   
   FETCH NEXT FROM c2 INTO @JEID1

    WHILE @@FETCH_STATUS = 0   
    BEGIN  
    
	insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,
       ThirdParty,Note,CompanyId,ProdId,CreatedDate,CreatedBy,COAString)
       select @JEID,@TransactionNo+1,COAId,CreditAmount,DebitAmount,VendorId,VendorName,
       ThirdParty,Note,CompanyId,ProdId,CURRENT_TIMESTAMP,@UserID,COAString from JournalEntryDetail
       where JournalEntryId=@JEID1 and CreditAmount>0


       FETCH NEXT FROM c2 INTO @JEID1
END   

CLOSE c2   
DEALLOCATE c2

  select @AccType=ClearingType from accountclearing where BankID=@BankID and ProdId=@ProdID and AccountName='CashAccount'

 if(@AccType='COA')
  begin

      select @COAID=COAId from accountclearing where BankID=@BankID and ProdId=@ProdID and AccountName='CashAccount'



     declare @coaString varchar(100);
     set @coaString=(select COACode from COA where COAID=@COAID)

    insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,ProdId,CreatedDate,CreatedBy,COAString)values
    (@JEID,@TransactionNo+1,@COAID,0.00,@DD,@ProdID,CURRENT_TIMESTAMP,@UserID,@coaString)


     update JournalEntry set TotalLines=@RowCnt+1 where JournalEntryId=@JEID;


  end
  else
  begin

   declare @COAID1 int;
   declare @DebtAmt1 decimal(18,2);
   declare @CoaStr varchar(100);
   declare @ParentCode varchar(100);


   DECLARE c1 CURSOR FOR  
	select COAId,CreditAmount,COAString from JournalEntryDetail
  where JournalEntryId in (
select JournalEntryId from Journalentry where ReferenceNumber in (select InvoiceId from PaymentLine where PaymentId=@PaymentID)
and SourceTable='Invoice') 
and CreditAmount>0

	
   OPEN c1   
   FETCH NEXT FROM c1 INTO @COAID1 ,@DebtAmt1,@CoaStr

    WHILE @@FETCH_STATUS = 0   
    BEGIN  
       set @ParentCode=( select ParentCode from COA where COAID=@COAID1)


	  declare @AcCode varchar(100);
	  declare @CoaIdNew int;


      select @AcCode=AccountCode from accountclearing where BankID=@BankID and ProdId=@ProdID and AccountName='CashAccount'

       set @ParentCode=@ParentCode+'|'+@AcCode;

    set @CoaIdNew=(select COAID from coa where COACode=@ParentCode)

	insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,
	ProdId,CreatedDate,
	CreatedBy,COAString
	)values(@JEID,@TransactionNo+1,@CoaIdNew,0.00,@DebtAmt1,	@ProdId,GETDATE(),@UserID,@ParentCode)

	set @RowCnt=@RowCnt+1;

       FETCH NEXT FROM c1 INTO @COAID1 ,@DebtAmt1,@CoaStr
END   

CLOSE c1   
DEALLOCATE c1

  update JournalEntry set TotalLines=@RowCnt where JournalEntryId=@JEID;

  end

  update Payment set Status='Printed' where PaymentId=@PaymentID and ProdId=@ProdID;

END



/****** Object:  StoredProcedure [dbo].[INVOICEJETHROUGHPAYROLL]    Script Date: 05/10/2016 5:49:45 PM ******/
SET ANSI_NULLS ON



GO