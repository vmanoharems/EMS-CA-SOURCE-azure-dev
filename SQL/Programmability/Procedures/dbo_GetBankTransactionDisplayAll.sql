CREATE PROCEDURE [dbo].[GetBankTransactionDisplayAll]  --  exec GetBankTransactionDisplayAll 1,1,3
(
@BankID int,
@ReconcilationID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	declare @BankCOAID int;
	declare @CID int;
	declare @CCode varchar(10);
	declare @AcType varchar(50);
	--declare @Date datetime;
	declare @BankAccountCode varchar(50);
	declare @BankCOAIDTable as table ( COAID int not null);

	select @BankCOAID=COAId ,@AcType=ClearingType,@CID=CompanyId , @BankAccountCode = AccountCode
		from AccountClearing 
		where BankId=@BankID and ProdId=@ProdID and AccountName='CashAccount';

-- If the bank is setup as an account type, we could have multiple COAID values to match to
	if @AcType = 'Account'
		begin
			insert into @BankCOAIDTable
				select COA.COAID from COA where COA.COACode like '%' + @BankAccountCode
		end
	else
		begin
			insert into @BankCOAIDTable
				select @BankCOAID;
		end

	select @CCode=CompanyCode from Company where CompanyID=@CID;

	select @CCode=CompanyCode 
		from Company 
		where CompanyID=@CID;

	select 
		JE.JournalEntryId
		,JE.ReferenceNumber
		,JE.Source
		,JE.SourceTable
		,JE.EntryDate
		,sum(JED.DebitAmount) as DebitAmount
		,sum(JED.CreditAmount) as CreditAmount
		,P.CheckNumber
		,convert(varchar(10),P.CheckDate,101) as CDate
		,P.Memo
		,V.VendorName
		,P.PayBy
		,P.PaymentId
		,P.Status
		,isnull(RA.Status,'UNCLEARED') as ReconcilationStatus
	from JournalEntry JE
	join JournalEntryDetail JED
		on JE.JournalEntryId=JED.JournalEntryId
	join @BankCOAIDTable BCOA on JED.COAID = BCOA.COAID
	left join Payment as P on JE.ReferenceNumber=P.PaymentId
	left join tblVendor as V on P.VendorId=V.VendorID
	left join ReconcilationAddon as RA on JE.JournalEntryID=RA.JEID
	where JE.ProdID = @ProdID
--	and JE.EntryDate <= @Date
	and ((RA.ID is null) or RA.ReconcilationID = @ReconcilationID)
	group by JE.JournalEntryId,P.CheckNumber,JE.ReferenceNumber,JE.Source,JE.SourceTable,JE.EntryDate
		,convert(varchar(10),P.CheckDate,101),P.Memo,V.VendorName,P.PayBy,P.PaymentId,P.Status,RA.Status
	order by JE.EntryDate
END



GO