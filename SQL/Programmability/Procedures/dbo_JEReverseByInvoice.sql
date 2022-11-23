CREATE PROCEDURE [dbo].[JEReverseByInvoice]  -- JEReverseByInvoice 46,1
	-- Add the parameters for the stored procedure here
	@InvoiceId int,
	@ReIssue bit
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	if exists(select * from PaymentLine where InvoiceId=@InvoiceId)
		begin
			select -9 as TransactionNumber;
			return;
		end
-- Always rollback on error
set xact_abort on

BEGIN Transaction
	declare @CompanyID int, @CurrentOpenPeriodID int;
	declare @PostDate date , @ModifiedDate date, @JENEWId int, @InvoiceIdNew int;
	declare @JournalEntryId int,@TransactionNumber int,@JEIdnew int;
	declare @CreateInvoice int ,@CreateJE int;

--- Do not understand why PostedDate and ModifiedDate are even being used this way -JT
	select /*@PostDate = PostedDate
		, @ModifiedDate = modifiedDate
		, */@CompanyID = CompanyID 
	from JournalEntry 
	where Source='AP' 
		and SourceTable='Invoice' 
		and AuditStatus='Posted'
		and ReferenceNumber=@InvoiceId
	;
	set @CurrentOpenPeriodID = dbo.GetCurrentOpenPeriodID(@CompanyID,default);
	
	set @JournalEntryId 
		= (select top 1 journalentryid 
	from JournalEntry 
	where Source='AP' 
		and SourceTable='Invoice' 
		and ReferenceNumber=@InvoiceId 
	order by JournalEntryId desc
	);
	set @TransactionNumber=(SELECT TOP 1 (convert(int,TransactionNumber)+1) FROM JournalEntry ORDER BY JournalEntryId DESC)
---------------------------------------------------Replicate the Invoice ---------------------------------------------------------------
	INSERT INTO [dbo].[Invoice]
		([InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description],[OriginalAmount],[CurrentBalance],[NewItemamount],[Newbalance],[BatchNumber],[BankId]
		,[InvoiceDate],[Duedate],[CheckGroupnumber],[Payby],[InvoiceStatus],[CreatedDate],[CreatedBy],[ProdID],Amount,ClosePeriodId,RequiredTaxCode,MirrorStatus)
		select [InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description],[OriginalAmount] * -1 ,[CurrentBalance] * -1,[NewItemamount] * -1,[Newbalance] * -1,[BatchNumber],[BankId]
			,[InvoiceDate],[Duedate],[CheckGroupnumber],[Payby],[InvoiceStatus],getdate(),[CreatedBy],[ProdID],Amount,@CurrentOpenPeriodID,RequiredTaxCode,2 as MirrorStatus
		from Invoice 
		where Invoiceid=@InvoiceId
	;
	set @InvoiceIdNew=SCOPE_IDENTITY();

----------------------------------------------Replicate Invoice Line(s) ---------------------------------------------------------------
	INSERT INTO [dbo].[InvoiceLine]([InvoiceID],[COAID],[Amount],[LineDescription],[InvoiceLinestatus],[COAString],[Transactionstring]
		,[Polineid],[CreatedDate],[CreatedBy],[ProdID],[PaymentID],[SetId],[SeriesId],ClearedFlag,TaxCode)
		select @InvoiceIdNew,[COAID],[Amount]*-1,[LineDescription],[InvoiceLinestatus],[COAString],[Transactionstring]
			,[Polineid],GETDATE(),[CreatedBy],[ProdID],[PaymentID],[SetId],[SeriesId],ClearedFlag,TaxCode
		from InvoiceLine
		where InvoiceID=@InvoiceId
	;

----------------------------------------------Create the JE Reversal -----------------------------------------------------------------
	insert into JournalEntry ([TransactionNumber],[Source],[Description],[DocumentNo],[EntryDate],[DebitTotal],[CreditTotal]
		,[TotalLines],[ImbalanceAmount],[AuditStatus],[PostedDate],[ReferenceNumber],[BatchNumber],[ProdId],[CreatedDate],[createdBy],SourceTable,ClosePeriod)
		select  @TransactionNumber,'AP',[Description],[DocumentNo],[EntryDate],[CreditTotal],[DebitTotal]
			,[TotalLines],[ImbalanceAmount],'POSTED' AS AUDITSTATUS,getdate() as PostedDate,@InvoiceIdNew,[BatchNumber],[ProdId],getdate(),[createdBy] /*THIS SP NEEDS TO ACCEPT THIS field as a PARAMETER */,'Invoice', @CurrentOpenPeriodID
		From JournalEntry 
		where JournalEntryId=@JournalEntryId
	;
	set @JEIdnew=SCOPE_IDENTITY();

	insert into  JournalEntryDetail([JournalEntryId],[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VendorId],[VendorName],[ThirdParty]
		,[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId)
		select @JEIdnew,@TransactionNumber,[COAId],[CreditAmount],[DebitAmount],[VendorId],[VendorName],[ThirdParty]
			,[Note],[CompanyId],[ProdId],GETDATE(),[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId
		from JournalEntryDetail 
		where JournalEntryId=@JournalEntryId
	;

----------------------------------------------Update old RECORDS-----------------------------------------------------------------
	update JournalEntry set CurrentStatus='Reversed' where JournalEntryId=@JournalEntryId;
	update Invoice set MirrorStatus=1 where Invoiceid=@InvoiceId;

	DECLARE @PolineId int
	declare @Amount decimal(18,2)
	DECLARE c1 CURSOR FOR 
		select Polineid,amount from InvoiceLine where InvoiceID=@InvoiceId and Polineid>0
	OPEN c1   
	FETCH NEXT FROM c1 INTO @PolineId ,@amount
	WHILE @@FETCH_STATUS = 0   
		BEGIN  
			update PurchaseOrderLine  set 
			RelievedTotal=RelievedTotal-@Amount,
			DisplayAmount=DisplayAmount+@Amount,
			ModifiedDate=GETDATE() where POlineID=@POLineId;
		FETCH NEXT FROM c1 INTO @PolineId, @amount
		END
	CLOSE c1   
	DEALLOCATE c1

----------------------------------------------Re - Issue Invoice-----------------------------------------------------------------
	if(@ReIssue=1)
	begin
		INSERT INTO [dbo].[Invoice]
			([InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description]
			,[OriginalAmount] ,[CurrentBalance],[NewItemamount],[Newbalance],[BatchNumber],[BankId]
			,[InvoiceDate],[Duedate],[CheckGroupnumber],[Payby],[InvoiceStatus],[CreatedDate]
			,[CreatedBy],[ProdID],Amount,ClosePeriodId,RequiredTaxCode,MirrorStatus)
			select [InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description]
				,[OriginalAmount]  ,[CurrentBalance],[NewItemamount] ,[Newbalance] ,[BatchNumber],[BankId]
				,[InvoiceDate],[Duedate],[CheckGroupnumber],[Payby],'Pending',getdate()
				,[CreatedBy],[ProdID],Amount,@CurrentOpenPeriodID,RequiredTaxCode,0 AS MirrorStatus
			from Invoice 
			where Invoiceid=@InvoiceId
		;
		set @CreateInvoice=SCOPE_IDENTITY();

		INSERT INTO [dbo].[InvoiceLine]
			([InvoiceID],[COAID],[Amount],[LineDescription],[InvoiceLinestatus],
			[COAString],[Transactionstring]
			,[Polineid],[CreatedDate],[CreatedBy],[ProdID],[PaymentID],[SetId],[SeriesId],ClearedFlag,TaxCode)
			select @CreateInvoice,[COAID],[Amount],[LineDescription],'Pending',[COAString],[Transactionstring]
				,[Polineid],GETDATE(),[CreatedBy],[ProdID],[PaymentID],[SetId],[SeriesId],ClearedFlag,TaxCode
			from InvoiceLine
			where InvoiceID=@InvoiceId
		;

		insert into JournalEntry ([TransactionNumber],[Source],[Description],[DocumentNo],[EntryDate],[DebitTotal],[CreditTotal]
			,[TotalLines],[ImbalanceAmount],[AuditStatus],[PostedDate],[ReferenceNumber],[BatchNumber],[ProdId]
			,[CreatedDate],[createdBy],SourceTable,ClosePeriod)
			select  (@TransactionNumber+1),'AP',[Description],[DocumentNo],GETDATE(),[CreditTotal],[DebitTotal]
				,[TotalLines],[ImbalanceAmount],'Saved',NULL AS PostedDate,@CreateInvoice as ReferenceNumber,[BatchNumber],[ProdId]
				,getdate() as CreatedDate,[createdBy],'Invoice' as SourceTable,@CurrentOpenPeriodID
			From JournalEntry 
			where JournalEntryId=@JournalEntryId
		;
		set @CreateJE=SCOPE_IDENTITY();
	
		insert into  JournalEntryDetail([JournalEntryId]
			,[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VendorId],[VendorName],[ThirdParty]
			,[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId)
			select @CreateJE,@TransactionNumber,[COAId],[CreditAmount]
				,[DebitAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId]
				,GETDATE(),[CreatedBy],[COAString],[TransactionCodeString]
				,SetId,SeriesId
			from JournalEntryDetail 
			where JournalEntryId=@JournalEntryId
		;
	end -- Reissue

----------------------------------------------Update old JE End-----------------------------------------------------------------
	declare @TrnasNumber int=0;
	if(@ReIssue=1)
		begin
			select @TrnasNumber = convert(int,TransactionNumber) 
			from JournalEntry 
			where JournalEntryId = @CreateJE
			;
			select @TrnasNumber as TransactionNumber
		end
	else
		begin
			select @TrnasNumber = convert(int,TransactionNumber)
			from JournalEntry 
			where JournalEntryId = @JEIdnew
			;
			select @TrnasNumber as TransactionNumber
		end
	end -- End Second @Reissue=1 check
COMMIT Transaction

