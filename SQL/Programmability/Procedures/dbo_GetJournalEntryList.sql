SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetJournalEntryList]  -- GetJournalEntryList 3,'Audit'
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@AuditStatus nvarchar(50)

	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@AuditStatus='Audit')
	begin
		select  JournalEntryId,TransactionNumber,Company.CompanyCode as CO, isnull(DebitTotal,0) as DebitTotal,ISNULL(CreditTotal,0) as CreditTotal, isnull(TotalLines,0)as TotalLines  ,'-' as Vendor, '-' as ThridParty,Source,JournalEntry.CompanyId,JournalEntry.ClosePeriod,
		convert(varchar(10),EntryDate,110) as PostedDate,isnull(DocumentNo,'')as DocumentNo,cc.PeriodStatus,SourceTable
		 From JournalEntry
		left join Company  on Company.CompanyID= JournalEntry.CompanyId 
		left outer join ClosePeriod cc on cc.ClosePeriodId=JournalEntry.ClosePeriod
		 where JournalEntry.ProdId=@ProdId and AuditStatus<>'New' and AuditStatus<>'Posted' and AuditStatus<>'Cancelled' and Source in ('JE','PR')  
	end
	else if(@AuditStatus='Posted')
	begin

		select  JournalEntryId,TransactionNumber,Company.CompanyCode as CO, isnull(DebitTotal,0) as DebitTotal,ISNULL(CreditTotal,0) as CreditTotal, isnull(TotalLines,0)as TotalLines  ,'-' as Vendor, '-' as ThridParty,Source,JournalEntry.CompanyId,JournalEntry.ClosePeriod,
		convert(varchar(10),PostedDate,110) as PostedDate ,isnull(DocumentNo,'')as DocumentNo,cc.PeriodStatus, SourceTable
		 From JournalEntry
		left join Company  on Company.CompanyID= JournalEntry.CompanyId 
		left outer join ClosePeriod cc on cc.ClosePeriodId=JournalEntry.ClosePeriod
		 where JournalEntry.ProdId=@ProdId and AuditStatus='Posted'
	end
	else
	begin
		select  JournalEntryId,TransactionNumber,Company.CompanyCode as CO, isnull(DebitTotal,0) as DebitTotal,ISNULL(CreditTotal,0) as CreditTotal, isnull(TotalLines,0)as TotalLines  ,'-' as Vendor, '-' as ThridParty,Source,JournalEntry.CompanyId,JournalEntry.ClosePeriod,
		convert(varchar(10),PostedDate,110) as PostedDate ,isnull(DocumentNo,'')as DocumentNo,cc.PeriodStatus,SourceTable
		 From JournalEntry
		left join Company  on Company.CompanyID= JournalEntry.CompanyId 
		left outer join ClosePeriod cc on cc.ClosePeriodId=JournalEntry.ClosePeriod
		 where JournalEntry.ProdId=@ProdId and AuditStatus='Posted'

	end
--	select * from JournalEntry where ProdId=3
END




GO