CREATE PROCEDURE [dbo].[GetTransactionNumber] -- GetTransactionNumber 53,1
	@ProdId int,
	@CreatedBy int
AS
BEGIN
declare @JournalEntryId int
declare @TransactionNumber nvarchar(50);
declare @CurrentPeriod int = dbo.GetCurrentOpenPeriodID(1,default);

	SET NOCOUNT ON;

    DECLARE @transNum nvarchar(20)
  if not exists (select 1 from JournalEntry where ProdId=@ProdId)
    begin
       insert into JournalEntry (TransactionNumber,AuditStatus,CreatedDate,createdBy,ProdId,Source,Description,EntryDate,BatchNumber,ClosePeriod,DocumentNo)
		values('1','New',GETDATE(),@CreatedBy,@ProdId,'Manual','',getdate(),'',1,'RESERVED');

	    select TransactionNumber,JournalEntryId from JournalEntry where JournalEntryId=SCOPE_IDENTITY();	
    end
   else
    begin
	  set @transNum=(select max(cast(TransactionNumber as int))+1 from JournalEntry where ProdId=@ProdId)
	   insert into JournalEntry (TransactionNumber,AuditStatus,CreatedDate,createdBy,ProdId,Source,Description,EntryDate,BatchNumber,ClosePeriod,DocumentNo)
		values(@transNum,'New',GETDATE(),@CreatedBy,@ProdId,'Manual','',getdate(),'',@CurrentPeriod,'RESERVED')
      set @JournalEntryId=SCOPE_IDENTITY()

     select TransactionNumber,JournalEntryId from JournalEntry where JournalEntryId=@JournalEntryId	;
	end 
END







GO