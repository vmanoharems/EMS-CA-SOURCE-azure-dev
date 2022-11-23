SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GeteverseJEDetail] -- GeteverseJEDetail 11
@JournalEntryId int
AS
BEGIN
	
	SET NOCOUNT ON;

begin transaction
	--if exists(select * from JournalEntry where CurrentStatus='Reversed' and JournalEntryID = @JournalEntryID)
	--BEGIN
	--	select TransactionNumber from JournalEntry where JournalEntryId=@JournalEntryId;
	--END
	--else
	BEGIN
		declare @TransactionNumber int,@jEid int;
		set @TransactionNumber=(select (max(cast(TransactionNumber as int))+1) from JournalEntry);
		------------------------------------ReInsert JournalEntry------------------------------------------------------------------------
		insert into JournalEntry ([TransactionNumber],[Source],[Description],[EntryDate],[DebitTotal],[CreditTotal]
		,[TotalLines],[ImbalanceAmount],[AuditStatus],[PostedDate]
		,[ReferenceNumber],[BatchNumber],[ProdId],[CreatedDate],[createdBy],ClosePeriod,CompanyId
		,SourceTable,DocumentNo,CurrentStatus)
		select  @TransactionNumber,[Source],[Description],[EntryDate],[CreditTotal],[DebitTotal]
		,[TotalLines],[ImbalanceAmount],'Saved'	,Getdate()			--[AuditStatus]           
		,[ReferenceNumber],[BatchNumber],[ProdId],getdate(),[createdBy],ClosePeriod,CompanyId
		,SourceTable,DocumentNo,CurrentStatus
		From JournalEntry where JournalEntryId=@JournalEntryId;
		set @jEid=SCOPE_IDENTITY();
		------------------------------------ReInsert JournalEntry------------------------------------------------------------------------
		------------------------------------ReInsert JournalEntryDetail------------------------------------------------------------------------
		insert into JournalEntryDetail([JournalEntryId]
		,[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VENDorId],[VENDorName],[ThirdParty]
		,[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId,TaxCode)
		select @jEid
		,@TransactionNumber,[COAId],[CreditAmount],[DebitAmount],[VENDorId],[VENDorName],[ThirdParty]
		,[Note],[CompanyId],[ProdId],GETDATE(),[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId,TaxCode
		from JournalEntryDetail where JournalEntryId=@JournalEntryId;
		------------------------------------ReInsert JournalEntryDetail------------------------------------------------------------------------
		update JournalEntry set CurrentStatus='Reversed' where JournalEntryId=@JournalEntryId;
		select TransactionNumber from JournalEntry where JournalEntryId=@jEid;
	END

commit transaction
		  
END

GO