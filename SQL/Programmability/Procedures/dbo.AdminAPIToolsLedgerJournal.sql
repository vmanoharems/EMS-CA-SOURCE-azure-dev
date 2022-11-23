CREATE procedure [dbo].[AdminAPIToolsLedgerJournal] 
(
@JSONparameters as varchar(8000)
--= EXEC AdminAPIToolsLedgerJournal '{ "AdminToolsLedgerJournal":{"ProdId":14,"CompanyId":1,"TransactionNumber":54}}'
)
as
Begin
	if ISJSON(@JSONparameters) is null return '-1'

	declare @AdminParameters as varchar(8000) = JSON_QUERY(@JSONparameters,'$.AdminToolsLedgerJournal');
	declare	@ProdId int = isnull(JSON_VALUE(@AdminParameters,'$.ProdId'),-1);
	declare	@CompanyId int = isnull(JSON_VALUE(@AdminParameters,'$.CompanyId'),-1);
	declare	@TransactionNumber int = isnull(JSON_VALUE(@AdminParameters,'$.TransactionNumber'),-1);
	declare	@PeriodNoFrom nvarchar(50) = isnull(JSON_VALUE(@AdminParameters,'$.PeriodNoFrom'),'');
	declare	@PeriodNoTo nvarchar(50) = isnull(JSON_VALUE(@AdminParameters,'$.PeriodNoTo'),'');
	declare	@CreateDateFrom date = isnull(JSON_VALUE(@AdminParameters,'$.CreateDateFrom'),'2017-01-01'); 
	declare	@CreateDateTo date = isnull(JSON_VALUE(@AdminParameters,'$.CreateDateTo'), getdate()); 
	declare	@PoNoFrom nvarchar(50) = isnull(JSON_VALUE(@AdminParameters,'$.PoNoFrom'),'');
	declare	@PoNoTo nvarchar(50) = isnull(JSON_VALUE(@AdminParameters,'$.PoNoTo'),'');
	declare	@VendorId nvarchar(50) = Replace(Replace(isnull(JSON_QUERY(@AdminParameters,'$.VendorID'),''),'[',''),']','');
	declare	@Batch nvarchar(50) = Replace(Replace(Replace(isnull(JSON_QUERY(@AdminParameters,'$.Batchnumber'),''),'[',''),']',''),'"','''');
	declare	@UserName nvarchar(50) = Replace(Replace(isnull(JSON_VALUE(@AdminParameters,'$.Username'),''),'[',''),']','');
	declare	@POStatus nvarchar(50) = isnull(JSON_VALUE(@AdminParameters,'$.POStatus'),'');

	if(@CreateDateTo ='1900-01-01') set @CreateDateTo = getdate();  -- Meaning, we didn't receive a CreateDateTo

	declare @tz int = [dbo].[TZforProduction](@ProdId);

	declare @tsql nvarchar(4000)='
	select --JE.*
		JE.JournalEntryId
		,JE.TransactionNumber
		,JE.Source
		,JE.Description
		,JE.EntryDate
		,JE.DebitTotal
		,JE.CreditTotal
		,JE.TotalLines
		,JE.ImbalanceAmount
		,JE.AuditStatus
		,cast(dbo.TZfromUTC(JE.PostedDate,@tz) as date) as PostedDate
		,JE.ReferenceNumber
		,JE.BatchNumber
		,JE.ProdId
		,JE.CreatedDate
		,JE.modifiedDate
		,JE.createdBy
		,JE.modifiedBy
		,JE.ClosePeriod
		,JE.CompanyId
		,JE.SourceTable
		,JE.DocumentNo
		,JE.CurrentStatus
		,JE.InvoiceIDPayment
		-- End JE.*
		'
		;
	if @TransactionNumber <> -1 
		set @tsql = @tsql + ', JED.*';

		set @tsql = @tsql + '
		,JEL.JELineCount
		from JournalEntry JE
		join (select JournalEntryID, count(*) AS JELineCount from JournalEntryDetail group by JournalEntryID) as JEL
		on JE.JournalEntryID = JEL.JournalEntryID
		';

	if @TransactionNumber <> -1 
		set @tsql = @tsql + ' join JournalEntryDetail JED on JE.JournalEntryID = JED.JournalEntryID';

		set @tsql = @tsql + ' where JE.ProdID = @ProdID
		and JE.CompanyID = @CompanyID
		and AuditStatus in (''Posted'', ''Saved'')
		'
		;
	if @TransactionNumber <> -1 
		begin
			set @tsql = @tsql + ' and JE.TransactionNumber = @TransactionNumber 
				for json auto, INCLUDE_NULL_VALUES
				';
		end
	else
		begin
			set @tsql = @tsql + ' for json path,INCLUDE_NULL_VALUES ';
		end

		declare @ParamDefinition nvarchar(4000) = '
			@ProdId int
			, @CompanyId int
			, @TransactionNumber int
			, @PeriodNoFrom int
			, @PeriodNoTo int
			, @CreateDateFrom date
			, @CreateDateTo date
			, @PoNoFrom varchar(100)
			, @PoNoTo varchar(100)
			, @VendorId int
			, @Batch varchar(100)
			, @UserName varchar(100)
			, @POStatus varchar(10)
			, @tz int
		'
		;

		exec sp_executesql @tsql,@ParamDefinition
			,@ProdID =@ProdID
			, @CompanyId = @CompanyId
			, @TransactionNumber =@TransactionNumber 
			, @PeriodNoFrom = @PeriodNoFrom
			, @PeriodNoTo = @PeriodNoTo
			, @CreateDateFrom = @CreateDateFrom 
			, @CreateDateTo = @CreateDateTo
			, @PoNoFrom = @PoNoFrom
			, @PoNoTo = @PoNoTo
			, @VendorId = @VendorId
			, @Batch = @Batch
			, @UserName = @UserName
			, @POStatus = @POStatus
			, @tz = @tz
		--AND (
		--	(@TransactionNumber = -1/* Default when there is no TransactionNumber parameter */) 
		--	or (TransactionNumber = @TransactionNumber) 
		--	or (@TransactionNumber is null)
		--)
End
GO