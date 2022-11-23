SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertupdateJournalEntry]
	-- Add the parameters for the stored procedure here
	@JournalEntryId int
	,@TransactionNumber nvarchar(20)
           ,@Source nvarchar(50)
           ,@Description nvarchar(200)
           ,@EntryDate datetime
           ,@DebitTotal decimal(18,2)
           ,@CreditTotal decimal(18,2)
           ,@TotalLines int
           ,@ImbalanceAmount decimal(18,2)
           ,@AuditStatus nvarchar(20)
           ,@PostedDate datetime
           ,@ReferenceNumber nvarchar(20)
           ,@BatchNumber nvarchar(50)
           ,@ProdId int
           ,@createdBy int,
		   @ClosePeriod int,
		   @CompanyId int
          ,@DocumentNo nvarchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select @Source = case when @Source is null then 'JE' else @Source end -- If we receive a null Source, then default to JE (encountered in some live productions)

	set @TransactionNumber=(select max(cast(TransactionNumber as int))+1 from JournalEntry where ProdId=@ProdId )


	IF(@JournalEntryId=0)
	begin

		INSERT INTO [dbo].[JournalEntry]([TransactionNumber],[Source],[Description],[EntryDate],[DebitTotal],[CreditTotal],[TotalLines]
			   ,[ImbalanceAmount],[AuditStatus],[PostedDate],[BatchNumber],[ProdId],[CreatedDate],[createdBy],ClosePeriod
			   ,CompanyId,DocumentNo)
		 VALUES
			   (@TransactionNumber,@Source,@Description,@EntryDate,0,0,0,0,@AuditStatus,@PostedDate
			   ,@BatchNumber,@ProdId,GETDATE(),@createdBy,@ClosePeriod,@CompanyId,@DocumentNo)
		
		set @JournalEntryId= SCOPE_IDENTITY()
	end

	ELSE

	begin

		if(@EntryDate is null)
		begin
			set @EntryDate=CURRENT_TIMESTAMP;
		end

		declare @CheckSource varchar(50);
		select @CheckSource=Source from JournalEntry where JournalEntryID=@JournalEntryId
		if(@CheckSource='AP')
		begin
			set @Source='AP'
		end

		update [dbo].[JournalEntry] set [Source]=@Source,[Description]=@Description,[EntryDate]=@EntryDate,[DebitTotal]=@DebitTotal,
		[CreditTotal]=@CreditTotal,[TotalLines]=@TotalLines,[ImbalanceAmount]=@ImbalanceAmount,[AuditStatus]=@AuditStatus,
		[PostedDate]=@PostedDate,[BatchNumber]=@BatchNumber,[ProdId]=@ProdId,[modifiedDate]=GETDATE(),[modifiedBy]=@createdBy
		,ClosePeriod=@ClosePeriod,CompanyId=@CompanyId,DocumentNo=@DocumentNo
		 where JournalEntryId=@JournalEntryId
	
	end

	select @JournalEntryId;
END
GO