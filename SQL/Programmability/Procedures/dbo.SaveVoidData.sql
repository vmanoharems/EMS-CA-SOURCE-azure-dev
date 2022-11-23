
ALTER PROCEDURE [dbo].[SaveVoidData]   -- SaveVoidData 3,'YES','DEV_TEST',1,"cancelled'
(
@PaymentID int,
@IsReissueInv varchar(50),
@BatchNumber varchar(100),
@ProdID int,
@UserID int,
@Status varchar(50)  -- Voided
)
AS
BEGIN

-- Always rollback on error
set xact_abort on

BEGIN Transaction

SET NOCOUNT ON;

if exists(select PaidAmount from Payment where PaymentId=@PaymentID and Status='Printed')
begin

	declare @NewPaymentID int;
	declare @InvoiceIDRev int;

	-- Upate the existing Payment and set the Status to VOIDED
	update Payment set Status=@Status where PaymentId=@PaymentID and ProdId=@ProdID;

	-- Make a copy of the Payment as the new voided Payment
	insert into Payment 
		(GroupNumber,VendorId,PaidAmount,CheckDate,CheckNumber,BankId,Status,PaymentDate,Memo,BatchNumber,ProdId,CreatedBy,CreatedDate,PayBy)
		select 
		GroupNumber,VendorId,PaidAmount * -1,CURRENT_TIMESTAMP as CheckDate,CheckNumber,BankId,@Status,CURRENT_TIMESTAMP as PaymentDate,Memo,@BatchNumber,ProdId,@UserID,CURRENT_TIMESTAMP as CreatedDate,PayBy 
			from Payment 
			where PaymentId=@PaymentID
	;
	set @NewPaymentID=@@IDENTITY;

	-- Make a copy of the old payments lines to the new Payment transaction
	insert into PaymentLine 
		(PaymentId,InvoiceId,InvoiceAmount,CreatedBy,CreatedDate,ProdId,BankID,CheckNumber)
		select 
		@NewPaymentID,InvoiceId,InvoiceAmount*-1,@UserID,CURRENT_TIMESTAMP as CreatedDate,ProdId,BankID,CheckNumber
			from PaymentLine 
			where PaymentId = @PaymentID
	;

	-- Now, let's create the necessary Journal Entries for the Payments we just created
	Declare @TransactionNo int ,@JEID int,@JEDINVOICEID int;
	select @TransactionNo
		=isnull(max(cast(transactionNumber as int)),0)
	from JournalEntry
	;

	declare @PayJEID int;
	select @PayJEID
		=JournalEntryId 
	from JournalEntry
	where SourceTable = 'Payment'
	and ReferenceNumber = @PaymentID
	;

	-- Some module is inserting a null CompanyID into the JournalEntry 
	declare @CurrentOpenPeriodID int = null
	declare @CPCompanyID int = null
	select @CPCompanyID = CompanyID from JournalEntry
		Where Source = 'AP'
		and Sourcetable = 'Payment'
		and ReferenceNumber = @PaymentID
	;
	if @CPCompanyID is null 
		select @CPCompanyID = CompanyID from Company where Defaultflag is not null
	print @CPCompanyID

	select @CurrentOpenPeriodID = dbo.GetCurrentOpenPeriodID(@CPCompanyID,DEFAULT)

	-- Update the JE for the existing payment and set it to REVERSED
	update JournalEntry set CurrentStatus='Reversed' where JournalEntryID=@PayJEID;

	INSERT into JournalEntry 
		(TransactionNumber,Source,Description,EntryDate,DebitTotal,CreditTotal,TotalLines,ImbalanceAmount,AuditStatus,PostedDate
			,ReferenceNumber,BatchNumber,ProdId,CreatedDate,createdBy,[ClosePeriod],CompanyId,SourceTable,DocumentNo,modifiedDate)
		Select
		@TransactionNo+1,'AP',[Description],getdate() as EntryDate,[CreditTotal] as DebitTotal,[DebitTotal] as CreditTotal,[TotalLines],[ImbalanceAmount],[AuditStatus],getdate() as PostedDate
			,@NewPaymentID as ReferenceNumber,@BatchNumber,[ProdId],getdate() as createdDate,[createdBy], @CurrentOpenPeriodID as ClosePeriod,CompanyID,'Payment',DocumentNo,getdate() as modifiedDate
		FROM [dbo].[JournalEntry]
		Where Source = 'AP'
		and Sourcetable = 'Payment'
		and ReferenceNumber = @PaymentID
	;
    set @JEID=@@IDENTITY;

	Insert INto JournalEntryDetail 
		([JournalEntryId],[TransactionLineNumber],[COAId] ,[DebitAmount] ,[CreditAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId]
			,[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],[SetId],[SeriesId],[TaxCode])
		SELECT 
		@JEID,@TransactionNo+1,[COAId],[CreditAmount] as DebitAmount,[DebitAmount] as CreditAmount,[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId]
			,getdate() as createdDate,[CreatedBy],[COAString],[TransactionCodeString],[SetId],[SeriesId],[TaxCode]
		FROM [dbo].[JournalEntryDetail]
		where JournalEntryId = @PayJEID
		order by JournalEntryId desc
	;

    declare @InvIDNew int,@InvoiceIdNew int;
   
    DECLARE c2 CURSOR FOR  
		select InvoiceId from PaymentLine where PaymentId=@PaymentID;
    OPEN c2   
    FETCH NEXT FROM c2 INTO @InvoiceIDRev
    WHILE @@FETCH_STATUS = 0
		BEGIN
			-- Reverse each invoice and pass the new payment id @NewPaymentID in so that it will 
			exec JEReverseByInvoiceForPayment @InvoiceIDRev,@IsReissueInv, @NewPaymentID;
		FETCH NEXT FROM c2 INTO @InvoiceIDRev
		end
    CLOSE c2   
    DEALLOCATE c2

end

select 1;

COMMIT TRANSACTION

END
GO