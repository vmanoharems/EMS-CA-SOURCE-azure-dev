SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[DeletePCEnvelopeById]
	-- Add the parameters for the stored procedure here
	@PCEnvelopeId int,
	@ProdId int,
	@Detail nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@Detail='PCEnvelope')
	begin

	delete from  PCEnvelopeLine where PCEnvelopeID=@PCEnvelopeId and Prodid=@ProdId
	delete from  PCEnvelope where PCEnvelopeID=@PCEnvelopeId and Prodid=@ProdId


	declare @JEId int

	set @JEId=(select JournalEntryId from JournalEntry where ReferenceNumber=@PCEnvelopeId and Source='PC' and SourceTable='PettyCash')

	delete from JournalEntryDetail where JournalEntryId=@JEId
	delete from JournalEntry where JournalEntryId=@JEId


	end
	else
	begin
	
	delete from  PCEnvelopeLine where EnvelopeLineID=@PCEnvelopeId and Prodid=@ProdId
	end
END



GO