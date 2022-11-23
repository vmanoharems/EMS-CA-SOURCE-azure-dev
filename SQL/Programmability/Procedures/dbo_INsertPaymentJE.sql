SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE Procedure [dbo].[INsertPaymentJE]
(@PaymentID int,@ProdID int,@UserID int,@BankID int,@CompanyCode varchar(50),@BatchNumber varchar(100))
AS
BEGIN

Declare @InvoiceID int,@CheckNo varchar(10),@JEID int,@AccountType varchar(15),@COAIDClearing int,@JEDID int,@CID int,@Credit decimal(18,2);

select @CheckNo=CheckNumber from Payment where PaymentId=@PaymentID;
select @CID=CompanyId from company  where CompanyCode=@CompanyCode;
 select @AccountType=ClearingType,@COAIDClearing=COAID from accountclearing where BankID=@BankID and ProdId=@ProdID and AccountName='CashAccount';

Declare PJE cursor  For

Select InvoiceID from PaymentLine  where Paymentid=@PaymentID
  OPEN PJE   
       FETCH NEXT FROM PJE INTO @InvoiceID

       WHILE @@FETCH_STATUS = 0   
       BEGIN  
	Declare @TransactionNo int ,@JEINVOICEID int,@JEDINVOICEID int
	select @TransactionNo=isnull(max(cast(transactionNumber as int)),0) from JournalEntry;
	select  @JEINVOICEID=JournalEntryID  from  [dbo].[JournalEntry] Where Source='AP' and Sourcetable='Invoice' and ReferenceNumber=@InvoiceID;

	INSERT into JournalEntry (TransactionNumber,Source,Description,EntryDate,DebitTotal,CreditTotal,TotalLines,ImbalanceAmount,AuditStatus,PostedDate
   ,ReferenceNumber,BatchNumber,ProdId,CreatedDate,createdBy,[ClosePeriod],CompanyId,SourceTable,DocumentNo)
   
   Select @TransactionNo+1,'AP',[Description],getdate(),[DebitTotal],[CreditTotal],[TotalLines],[ImbalanceAmount],[AuditStatus],getdate()
      ,@PaymentID,@BatchNumber,[ProdId],[CreatedDate],[createdBy],[ClosePeriod],[CompanyId],'Payment',@CheckNo   FROM [dbo].[JournalEntry]
	  Where Source='AP' and Sourcetable='Invoice' and ReferenceNumber=@InvoiceID;
 
 select @Credit=Credittotal  from JournalEntry  where Source='AP' and Sourcetable='Invoice' and ReferenceNumber=@InvoiceID;
  set @JEID=@@IDENTITY;


  Declare PJD cursor  For

Select JournalEntryDetailID from JournalEntryDetail  where JournalEntryID=@JEINVOICEID and CreditAmount<>0
  OPEN PJD   
       FETCH NEXT FROM PJD INTO @JEDINVOICEID

       WHILE @@FETCH_STATUS = 0   
       BEGIN  

	   Insert INto JournalEntryDetail ([JournalEntryId],[TransactionLineNumber],[COAId] ,[DebitAmount] ,[CreditAmount],[VendorId],[VendorName],[ThirdParty]
      ,[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],[SetId],[SeriesId],[TaxCode])

	   SELECT @JEID,@TransactionNo+1,[COAId],[CreditAmount],[DebitAmount],[VendorId],[VendorName],[ThirdParty]
      ,[Note],[CompanyId],[ProdId],getdate(),[CreatedBy],[COAString],[TransactionCodeString],[SetId],[SeriesId],[TaxCode]
       FROM [dbo].[JournalEntryDetail]  where JournalEntryDetailId=@JEDINVOICEID;

       FETCH NEXT FROM PJD INTO @JEDINVOICEID
       END   

CLOSE PJD   
DEALLOCATE PJD	


	   If (@Accounttype='COA')

Begin
 declare @COACODE nvarchar(200);
 Select COACODE  from COA  where COAID=@COAIDClearing;

	   Insert INto JournalEntryDetail ([JournalEntryId],[TransactionLineNumber],[COAId] ,[DebitAmount] ,[CreditAmount]
      ,[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString])

	  values( @JEID,@TransactionNo+1,@COAIDClearing,0.00,@Credit,@CID,@ProdID,getdate(),@UserID,@COACODE)

End

else 

begin

 declare @COACODEAccount nvarchar(200),@COAIDFORJEDetailOLD int,@NEWCOAID int;



-------------CASH___CURSOR----------------------
  Declare PaymentCASH cursor  For

Select JournalEntryDetailID,COAID from JournalEntryDetail  where JournalEntryID=@JEID and DebitAmount>0
  OPEN PaymentCASH   
       FETCH NEXT FROM PaymentCASH INTO @JEDID,@COAIDFORJEDetailOLD

       WHILE @@FETCH_STATUS = 0   
       BEGIN  

          Select @COACODEAccount=COACODE,@NEWCOAID=COAID  from COA  where Accountid=@COAIDClearing and Parentcode in (
		   Select ParentCode from COA where COAID=@COAIDFORJEDetailOLD);


	    Insert INto JournalEntryDetail ([JournalEntryId],[TransactionLineNumber],[COAId] ,[DebitAmount] ,[CreditAmount]
      ,[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString])

	   SELECT @JEID,@TransactionNo+1,@NEWCOAID,[CreditAmount],[DebitAmount],[CompanyId],[ProdId],getdate(),[CreatedBy],@COACODEAccount
       FROM [dbo].[JournalEntryDetail]  where JournalEntryDetailId=@JEDID;

       FETCH NEXT FROM PaymentCASH INTO @JEDID,@COAIDFORJEDetailOLD
       END   

CLOSE PaymentCASH   
DEALLOCATE PaymentCASH	



-------------CASH___CURSOR----------------------


end
       FETCH NEXT FROM PJE INTO @InvoiceID
       END  
	   

CLOSE PJE   
DEALLOCATE PJE	


Declare @Count int

select  @Count=Count(*)  from JournalEntrydetail  where JournalEntryid=@JEID;


Update JournalEntry set totalLines=@Count  where JournalEntryID=@JEID;


End






GO