SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[UpdatePCEnvelopeClosePeriod]
	-- Add the parameters for the stored procedure here
	@PCEnvelopeId int,
	@ClosePeriodId int,@Prodid int
AS
BEGIN
declare @TransactionNumber nvarchar(50);

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	update PCEnvelope set ClosePeriodId=@ClosePeriodId, Status='Posted',PostedDate=GETDATE() where PcEnvelopeID=@PCEnvelopeId and Prodid=@Prodid 

	declare @JEId int;
	set @JEId=(select JournalEntryId From JournalEntry where ReferenceNumber =@PCEnvelopeId and Source='PC' and SourceTable='PettyCash')
	update JournalEntry set AuditStatus='Posted',PostedDate=GETDATE() where JournalEntryId=@JEId;

	if not exists(select * from JournalEntry where ProdId=@ProdId)
	begin
set @TransactionNumber =1;

	end
	else
	begin
	set @TransactionNumber=(select TOP 1 (TransactionNumber) FROM JournalEntry where ProdId=@Prodid ORDER BY JournalEntryId DESC)
	end
	select @TransactionNumber;
	
END



GO