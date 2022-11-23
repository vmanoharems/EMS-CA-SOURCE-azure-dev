SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[updatePCEnvelopeStatus]
	-- Add the parameters for the stored procedure here
	@PCEnvelopId nvarchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	update PCEnvelope set Status='Posted',PostedDate=GETDATE() where PcEnvelopeID in (( SELECT * FROM dbo.SplitId(@PCEnvelopId,',')))


	update JournalEntry set AuditStatus='Posted' ,PostedDate=GETDATE() where ReferenceNumber in(( SELECT * FROM dbo.SplitId(@PCEnvelopId,','))) 
	and Source='PC' and SourceTable='PettyCash';


	select  p.EnvelopeNumber,j.TransactionNumber from PCEnvelope  p 
left outer join JournalEntry j on j.ReferenceNumber=p.PcEnvelopeID and Source='PC' and SourceTable='PettyCash'
where p.PcEnvelopeID in (( SELECT * FROM dbo.SplitId(@PCEnvelopId,',')))
END





GO