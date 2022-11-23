CREATE PROCEDURE [dbo].[GetReconcilationReportData]  --  GetReconcilationReportData 1,1
(
@ReconcilationID int,
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @tz int;
	set @tz = dbo.TZforProduction(DEFAULT);

	select JE.Source,RA.JEID,JE.JournalEntryId
	, dbo.TZfromUTC(JE.EntryDate,@tz) as Date
	--CONVERT(varchar(10),(b.EntryDate)-cast(@tz as datetime),101) as Date,
	,JE.Description,JE.TransactionNumber,JE.DebitTotal
	from ReconcilationAddon as RA
	join JournalEntry as JE 
		on RA.JEID=JE.JournalEntryID and JE.SourceTable='Payment'
	where RA.ReconcilationID=@ReconcilationID 
		and RA.Status='CLEARED'

END



GO