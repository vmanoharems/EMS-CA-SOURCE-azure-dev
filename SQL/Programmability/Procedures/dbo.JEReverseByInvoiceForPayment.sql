ALTER PROCEDURE [dbo].[JEReverseByInvoiceForPayment]  -- JEReverseByInvoiceForPayment 1
(
	@InvoiceId int
	, @ReIssue varchar(50)
	, @NewPaymentID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
-- Always rollback on error
set xact_abort on

BEGIN Transaction
    -- Insert statements for procedure here
	declare @CompanyID int;--, @CurrentOpenPeriodID int;
	declare @PostDate date , @ModifiedDate date, @JENEWId int, @InvoiceIdNew int;

 --   select @CompanyID = CompanyID
	--from JournalEntry 
	--where Source='AP' 
	--and SourceTable='Invoice' 
	--and AuditStatus='Posted'
	--and ReferenceNumber=@InvoiceId
	--;
	--set @CurrentOpenPeriodID = dbo.GetCurrentOpenPeriodID(@CompanyID,default);

	declare @JournalEntryId int,@TransactionNumber int,@JEIdnew int;
	set @JournalEntryId=(select top 1 journalentryid 
	from JournalEntry 
	where Source='AP' and SourceTable='Invoice' 
	and ReferenceNumber=@InvoiceId
	order by JournalEntryId desc)
	;
	set @TransactionNumber
		=(SELECT TOP 1 (convert(int,TransactionNumber)+1)
	FROM JournalEntry 
	ORDER BY JournalEntryId DESC)
	;


	-- Some module is inserting a null CompanyID into the JournalEntry 
	declare @CurrentOpenPeriodID int = null
	declare @CPCompanyID int = null
	select @CPCompanyID = CompanyID from Invoice
			where Invoiceid = @InvoiceId	;
	if @CPCompanyID is null 
		select @CPCompanyID = CompanyID from Company where Defaultflag is not null
	print @CPCompanyID

	select @CurrentOpenPeriodID = dbo.GetCurrentOpenPeriodID(@CPCompanyID,DEFAULT)


--------------------------------------------------- Reverse the Invoice ---------------------------------------------------------------
	INSERT INTO [dbo].[Invoice]
        ([InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description],[OriginalAmount] ,[CurrentBalance],[NewItemamount],[Newbalance],[BatchNumber],[BankId]
			,[InvoiceDate],[Duedate],[CheckGroupnumber],[Payby],[InvoiceStatus],[CreatedDate],[CreatedBy],[ProdID],Amount,ClosePeriodId,RequiredTaxCode,MirrorStatus)
		select
		[InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description],[OriginalAmount] * -1 ,[CurrentBalance] * -1,[NewItemamount] * -1,[Newbalance] * -1,[BatchNumber],[BankId]
			,getdate() as InvoiceDate,[Duedate],[CheckGroupnumber],[Payby],[InvoiceStatus],getdate() as CreatedDate,[CreatedBy],[ProdID],Amount,@CurrentOpenPeriodID as ClosePeriodID,RequiredTaxCode,2 as MirrorStatus
		from Invoice 
		where Invoiceid = @InvoiceId
	;
	set @InvoiceIdNew=SCOPE_IDENTITY();

---------------------------------------------- Replicate Invoice Lines for reversal  ---------------------------------------------------------------
	INSERT INTO [dbo].[InvoiceLine]
		([InvoiceID],[COAID],[Amount],[LineDescription],[InvoiceLinestatus],[COAString],[Transactionstring],[Polineid],[CreatedDate],[CreatedBy],[ProdID],[PaymentID]
			,[SetId],[SeriesId],ClearedFlag,TaxCode)
		select
		@InvoiceIdNew,[COAID],[Amount]*-1,[LineDescription],[InvoiceLinestatus],[COAString],[Transactionstring],[Polineid],GETDATE() as CreatedDate,[CreatedBy],[ProdID],[PaymentID]
			,[SetId],[SeriesId],ClearedFlag,TaxCode 
	from InvoiceLine 
	where InvoiceID = @InvoiceId

	----------------------------------------------Reverse the JE -----------------------------------------------------------------
	insert into JournalEntry 
		([TransactionNumber],[Source],[Description], DocumentNo,[EntryDate],[DebitTotal],[CreditTotal],[TotalLines],[ImbalanceAmount],[AuditStatus],[PostedDate],[ReferenceNumber]
			,[BatchNumber],[ProdId],[CreatedDate],[createdBy],SourceTable,ClosePeriod,CompanyID,InvoiceIDPayment)
		select  
		@TransactionNumber,'AP',[Description], DocumentNo, GETDATE() AS EntryDate,[CreditTotal] as DebitTotal,[DebitTotal] as CreditTotal,[TotalLines],[ImbalanceAmount],'POSTED',GETDATE() AS PostedDate,@InvoiceIdNew as ReferenceNumber
			,[BatchNumber],[ProdId],getdate() as CreatedDate,[createdBy],'Invoice' as SourceTable,@CurrentOpenPeriodID as ClosePeriod,CompanyID,@InvoiceIdNew
		From JournalEntry
		where JournalEntryId=@JournalEntryId
	;
	set @JEIdnew=SCOPE_IDENTITY()
	
	insert into  JournalEntryDetail
		([JournalEntryId],[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId)		   
		select 
		@JEIdnew,@TransactionNumber,[COAId],[CreditAmount],[DebitAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId],GETDATE() as CreatedDate,[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId
	from JournalEntryDetail 
	where JournalEntryId = @JournalEntryId
	;

----------------------------------------------Update old JE-----------------------------------------------------------------
	update JournalEntry set CurrentStatus='Reversed' where JournalEntryId=@JournalEntryId;
	update Invoice set MirrorStatus=1 where Invoiceid=@InvoiceId;

	DECLARE @PolineId int;
	declare @Amount decimal(18,2);
	DECLARE c1 CURSOR FOR  
		select Polineid,amount from InvoiceLine where InvoiceID=@InvoiceId and Polineid>0;
	OPEN c1   
	FETCH NEXT FROM c1 INTO @PolineId ,@amount
	WHILE @@FETCH_STATUS = 0   
	BEGIN  
	    update PurchaseOrderLine set 
			RelievedTotal=RelievedTotal-@Amount,
			DisplayAmount=DisplayAmount+@Amount,
			ModifiedDate=GETDATE()
		where POlineID=@POLineId
		;
       FETCH NEXT FROM c1 INTO @PolineId,@amount
	END
	CLOSE c1   
	DEALLOCATE c1
---------------------------------------------- Update the @NewPaymentID with the new InvoiceID --------------------------
	update PaymentLine
		set InvoiceID = @InvoiceIdNew
	where PaymentID = @NewPaymentID
	;

----------------------------------------------Re - Issue Invoice-----------------------------------------------------------------
if(@ReIssue='YES')
begin
	declare @CreateInvoice int ,@CreateJE int;
	declare @CIDD int ,@CPI int;

	select @CIDD=CompanyID,@CPI=ClosePeriodId from Invoice where Invoiceid=@InvoiceId

	INSERT INTO [dbo].[Invoice]
		([InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description],[OriginalAmount],[CurrentBalance],[NewItemamount],[Newbalance],[BatchNumber],[BankId]
			,[InvoiceDate],[Duedate],[CheckGroupnumber],[Payby],[InvoiceStatus],[CreatedDate],[CreatedBy],[ProdID],Amount,ClosePeriodId,RequiredTaxCode,MirrorStatus)		  
		select 
		[InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description],[OriginalAmount],[CurrentBalance],[NewItemamount] ,[Newbalance],[BatchNumber],[BankId]
			,getdate() as InvoiceDate,[Duedate],[CheckGroupnumber],[Payby],'Pending',getdate() as createdDate,[CreatedBy],[ProdID],Amount,dbo.GetCurrentOpenPeriodID([CompanyId],DEFAULT) as ClosePeriodID,RequiredTaxCode,0 as MirrorStatus
	from Invoice 
	where Invoiceid = @InvoiceId
	;
	set @CreateInvoice=SCOPE_IDENTITY();

	INSERT INTO [dbo].[InvoiceLine]
		([InvoiceID],[COAID],[Amount],[LineDescription],[InvoiceLinestatus],[COAString],[Transactionstring],[Polineid],[CreatedDate],[CreatedBy],[ProdID],[PaymentID],[SetId],[SeriesId],ClearedFlag,TaxCode)     
		select
		@CreateInvoice,[COAID],[Amount],[LineDescription],'Pending',[COAString],[Transactionstring],[Polineid],GETDATE() as createdDate,[CreatedBy],[ProdID],[PaymentID],[SetId],[SeriesId],ClearedFlag,TaxCode
	from InvoiceLine
	where InvoiceID = @InvoiceId
	;

	insert into JournalEntry 
		([TransactionNumber],[Source],[Description],DocumentNo,[EntryDate],[DebitTotal],[CreditTotal],[TotalLines],[ImbalanceAmount],[AuditStatus]
			,[PostedDate],[ReferenceNumber],[BatchNumber],[ProdId],[CreatedDate],[createdBy],SourceTable,CompanyId,ClosePeriod)
		select  @TransactionNumber+1,'AP',[Description], DocumentNo ,getdate() as EntryDate,[DebitTotal],[CreditTotal],[TotalLines],[ImbalanceAmount],'Saved' as AuditStatus
			,NULL as PostedDate, @CreateInvoice as ReferenceNumber,[BatchNumber],[ProdId],getdate() as createdDate,[createdBy],'Invoice' as SourceTable,@CompanyID,@CurrentOpenPeriodID as ClosePeriod
	From JournalEntry
	where JournalEntryId = @JournalEntryId
	;	   
	set @CreateJE=SCOPE_IDENTITY();
	
	insert into JournalEntryDetail
		([JournalEntryId],[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId)	   
	select
		@CreateJE,@TransactionNumber+1,[COAId],[CreditAmount],[DebitAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId],GETDATE() as createdDate,[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId
	from JournalEntryDetail 
	where JournalEntryId = @JournalEntryId
	;

   end
----------------------------------------------Update old JE End-----------------------------------------------------------------
COMMIT TRANSACTION

END
GO