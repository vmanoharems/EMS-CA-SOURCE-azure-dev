SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetJEListForDistribution] -- GetJEListForDistribution 3
	-- Add the parameters for the stored procedure here
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select j.TransactionNumber,JE.COAString,
CASE 
    WHEN 
JE.CreditAmount=0 then je.DebitAmount else JE.CreditAmount end as Amount,JE.VendorName,JE.ThirdParty,

	JE.VendorId,isnull(je.Note,'') as Note,j.Source,isnull(j.ReferenceNumber,'-')as ReferenceNumber,dbo.convertcodes(TransactionCodeString)as TransactionvalueString   from JournalEntryDetail JE
left outer join  JournalEntry J on j.JournalEntryId=je.JournalEntryId

where j.ProdId=@ProdId and  J.AuditStatus<>'Posted' and  J.AuditStatus<>'New'
END




GO