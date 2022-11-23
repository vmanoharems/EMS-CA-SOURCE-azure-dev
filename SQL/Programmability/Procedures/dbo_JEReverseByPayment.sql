CREATE PROCEDURE [dbo].[JEReverseByPayment]  -- JEReverseByInvoice 1
(
	@PaymentID int	
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
-- Always rollback on error
set xact_abort on

BEGIN Transaction

	declare @JournalEntryId int,@TransactionNumber int,@JEIdnew int

	set @JournalEntryId=(select top 1 journalentryid from JournalEntry where Source='AP' and SourceTable='Payment' 
	and ReferenceNumber=@PaymentID order by JournalEntryId desc)

	set @TransactionNumber=(SELECT TOP 1 (convert(int,TransactionNumber)+1) FROM JournalEntry ORDER BY JournalEntryId DESC)

	----------------------------------------------Reversed-----------------------------------------------------------------
	insert into JournalEntry ([TransactionNumber],[Source],[Description],DocumentNo,[EntryDate],[DebitTotal],[CreditTotal]
        ,[TotalLines],[ImbalanceAmount],[AuditStatus],[PostedDate],[ReferenceNumber],[BatchNumber],[ProdId],[CreatedDate],[createdBy],SourceTable
        )
	select  @TransactionNumber,'AP',[Description],DocumentNo,GETDATE() AS EntryDate,[CreditTotal],[DebitTotal]
		,[TotalLines],[ImbalanceAmount],'POSTED',GETDATE(),@PaymentID,[BatchNumber],[ProdId],getdate() AS CREATEDDATE,[createdBy],'Payment' as SourceTable
	From JournalEntry 
	where JournalEntryId=@JournalEntryId
	
	insert into  JournalEntryDetail([JournalEntryId]
        ,[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VendorId],[VendorName],[ThirdParty]
        ,[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy],[COAString],[TransactionCodeString],SetId,SeriesId)
		   
		select @JEIdnew,@TransactionNumber,[COAId],[CreditAmount]
        ,[DebitAmount],[VendorId],[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId]
        ,GETDATE(),[CreatedBy],[COAString],[TransactionCodeString]
        ,SetId,SeriesId  from JournalEntryDetail where JournalEntryId=@JournalEntryId
		   
		----------------------------------------------Update old JE-----------------------------------------------------------------

	update JournalEntry set CurrentStatus='' where JournalEntryId=@JournalEntryId;

COMMIT TRANSACTION
END