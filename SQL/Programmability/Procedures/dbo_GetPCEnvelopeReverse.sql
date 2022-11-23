CREATE PROCEDURE [dbo].[GetPCEnvelopeReverse]
	@PCEnvelopeId int
	, @batchNumber varchar(50) = ''
	, @CreatedBy int = null
	, @ProdID int = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	BEGIN TRY
		IF EXISTS(Select PCEnvelopeID from PCEnvelope where PCEnvelopeID = @PCEnvelopeID and MirrorStatus = 1)
		BEGIN
			THROW 50000 ,N'PC Envelope Already Reversed!', 1;
		END
	END TRY
	BEGIN CATCH
		THROW;
	END CATCH

begin transaction
	declare @JournalEntryId int,@TransactionNumber int,@JEIdnew int
	;

	declare @newPCEnvelope PCEnvelope_UDT;
	declare @companyID int;
	declare @currentopenperiodID int;

	set @JournalEntryId
		=(select top 1 journalentryid 
	from JournalEntry 
	where Source='PC' 
	and SourceTable='Pettycash' 
	and ReferenceNumber=@PCEnvelopeId 
	order by JournalEntryId desc)
	;

	set @TransactionNumber
		=(SELECT TOP 1 (cast(TransactionNumber as int)+1) 
	FROM JournalEntry 
	ORDER BY JournalEntryId DESC)
	;

	/* get a copy of the existing envelope */
	insert into @newPCEnvelope
		select * from PCEnvelope where PCEnvelopeID = @PCEnvelopeID
	;
	-- Get the Company from the envelope and the current open period for that company
	select @companyID = CompanyID from @newPCEnvelope; 
	select @currentopenperiodID = dbo.getcurrentopenperiodID(@CompanyID,default); 
	-- Update the copy of the envelope so that we can easily insert a new reversal PCEnvelope record with proper data
	update @newPCEnvelope set
		Batchnumber = @BatchNumber
		, AdvanceAmount = -(AdvanceAmount)
		, EnvelopeAmount = -(EnvelopeAmount)
		, LineItemAmount = -(LineItemAmount)
		, [Difference] = -([Difference])
		, PostedDate = null
		, [Status] = 'PENDING'
		, CreatedDate = getdate()
		, Createdby = @CreatedBY
		, PostedBy = NULL
		, ClosePeriodID = @CurrentOpenPeriodID
		, MirrorStatus = 2 -- This is a reversal
	;
	/* Insert the new reversal PCEnvelope */
	----------------------------------------------------Petty Cash------------------------------------------------------------------------
	declare @PCNew int
	INSERT INTO [dbo].[PCEnvelope]
		([Companyid],[BatchNumber],[CustodianId],[RecipientId],[EnvelopeNumber],[Description],[AdvanceAmount],[EnvelopeAmount],[LineItemAmount],[Difference]
			,[PostedDate],[Status],[CreatedDate],[CreatedBy],[Prodid],[PostedBy],ClosePeriodId,MirrorStatus )
	select 
		Companyid, BatchNumber, CustodianId, RecipientId, EnvelopeNumber, Description, AdvanceAmount, EnvelopeAmount,LineItemAmount,[Difference]
			,PostedDate ,status,CreatedDate,CreatedBy,@ProdID, PostedBy, ClosePeriodId,MirrorStatus
	from @newPCEnvelope where PCEnvelopeID=@PCEnvelopeId
	set @PCNew=SCOPE_IDENTITY();
	-- Insert a copy of the PC Lines
	INSERT INTO [dbo].[PCEnvelopeLine]
		([PCEnvelopeID],[TransactionLineNumber],[COAID],[Amount],[VendorID],[LineDescription],[TransactionCodeString],[Setid],[SeriesID],[Prodid]
			,[CreatedDate],[CreatedBy],CoaString,TaxCode)
	select 
		@PCNew,TransactionLineNumber,COAID,-(Amount),VendorID,LineDescription,TransactionCodeString,Setid,SeriesID,Prodid
			,GETDATE(),@CreatedBy,CoaString,TaxCode
	from PCEnvelopeLine where PCEnvelopeID=@PCEnvelopeId

	--------------------------------------------------JE Header---------------------------------------------------------------------------
	insert into JournalEntry
		([TransactionNumber],[Source],[Description],[EntryDate],[DebitTotal],[CreditTotal],[TotalLines],[ImbalanceAmount],[AuditStatus],[PostedDate],DocumentNo
			,[ReferenceNumber],[BatchNumber],[ProdId],[CreatedDate],[createdBy],SourceTable,CurrentStatus,CompanyId,ClosePeriod)
	select 
		@TransactionNumber,[Source],[Description],getdate(),[CreditTotal],[DebitTotal],[TotalLines],[ImbalanceAmount],[AuditStatus],NULL,DocumentNo
			,@PCNew,@BatchNumber,[ProdId],getdate(),@createdBy,'PettyCash',NULL,CompanyId,@CurrentOpenPeriodID 
	From JournalEntry
	where JournalEntryId=@JournalEntryId
	;
	set @JEIdnew=SCOPE_IDENTITY()

	--------------------------------------------------JE Detail---------------------------------------------------------------------------
	insert into JournalEntryDetail 
		([JournalEntryId],[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId]
			,[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId)
	select 
		@JEIdnew,@TransactionNumber,[COAId],[CreditAmount],[DebitAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId]
			,GETDATE(),@CreatedBy,[COAString],[TransactionCodeString],SetId,SeriesId
	from JournalEntryDetail where JournalEntryId=@JournalEntryId

	update JournalEntry set CurrentStatus='' where JournalEntryId=@JournalEntryId
	update PCEnvelope set MirrorStatus = 1 where PcEnvelopeID=@PCEnvelopeId
	
	select @TransactionNumber as TransactionNumber, @JEIdnew as JournalEntryID,@PCNew as PCEnvelopeID;

commit transaction

END
