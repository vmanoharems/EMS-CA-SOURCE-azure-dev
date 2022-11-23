SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetJEDetailByJEId] -- GetJEDetailByJEId2 7  
	@JournalEntryId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select JournalEntryDetailId,je.JournalEntryId,TransactionLineNumber,je.COAId,isnull(DebitAmount,0.00) as DebitAmount,isnull(CreditAmount,0.00)as CreditAmount,je.VendorId,
	
	isnull(V.VendorName,'')as VendorName ,CONVERT(VARCHAR(11),j.PostedDate,106) as PostedDate,
	ThirdParty,isnull(Note,'')as Note ,JE.TransactionCodeString,dbo.convertcodes(je.TransactionCodeString)as TransactionvalueString
	--,OptionalCodeString,dbo.convertOptionalcodes(OptionalCodeString)as OptionalCodeValueString
	,JE.SetId,je.SeriesId,isnull(T.AccountCode,'') as SetAC,isnull(TT.AccountCode,'') as SeriesAC
	,je.COAString 
	,isnull(je.TaxCode,'')as TaxCode , isnull(cOA.AccountTypeid,'') as AccountTypeId,j.SourceTable
	from JournalEntryDetail  JE
	INNER join JournalEntry j on j.JournalEntryId=jE.JournalEntryId
	left outer join TblAccounts  T on T.AccountId=JE.SetId
	left outer join TblAccounts  TT on TT.AccountId=JE.SeriesId
	inner join coa COA on je.COAId=COA.COAID
	Left Outer join tblVendor v on V.VendorID=JE.VendorId 
	where je.JournalEntryId=@JournalEntryId 
	Order By
	JE.JournalEntryDetailID -- Keeps the JE in the same line order as what was entered
	,JE.JournalEntryID
	,COA.COACode ASC
	, COA.Detaillevel asc

END



GO