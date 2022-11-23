SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetBankBalance]  -- GetBankBalance 1,3
(@BankID int, @ProdID int)
AS
BEGIN
SET NOCOUNT ON;
declare @CashAccountCOAID int;
declare @Payment float;
declare @Deposit float;

declare @ClearedCredit float;
declare @ClearedDebit float;

declare @StateMentDate datetime;
declare @AcType varchar(50);
declare @CID int;
declare @CCode varchar(10);

select @StateMentDate=StatementDate from BankReconcilation where BankID=@BankID and Status='OPEN'

select @CashAccountCOAID=COAId ,@AcType=ClearingType,@CID=CompanyId from AccountClearing where BankId=@BankID 
and ProdId=@ProdID and AccountName='CashAccount';

if(@AcType='COA')
begin
	select @Payment=isnull(sum(a.CreditAmount),0.00) from JournalEntryDetail
	as a inner join JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId=@CashAccountCOAID and a.ProdId=@ProdID and a.CreatedDate>@StateMentDate
	and b.ReferenceNumber not in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID
 
	select @ClearedCredit=isnull(sum(a.CreditAmount),0.00) from JournalEntryDetail as a
	inner join JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId=@CashAccountCOAID and a.ProdId=@ProdID and 
	a.CreatedDate>@StateMentDate and b.ReferenceNumber in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID

	select @Deposit=isnull(sum(a.DebitAmount),0.00) from JournalEntryDetail as a inner join 
	JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId=@CashAccountCOAID and a.ProdId=@ProdID and a.CreatedDate>@StateMentDate
	and b.ReferenceNumber not in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID

	select @ClearedDebit=isnull(sum(a.DebitAmount),0.00) from JournalEntryDetail 
	as a inner join JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId=@CashAccountCOAID and a.ProdId=@ProdID and a.CreatedDate>@StateMentDate and b.ReferenceNumber  in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID
end
else
begin
	select @CCode=CompanyCode from Company where CompanyID=@CID;

	select @Payment=isnull(sum(a.CreditAmount),0.00) from JournalEntryDetail
	as a inner join JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId in ( select COAID from COA where AccountId=@CashAccountCOAID and AccountTypeID=4 and SS1=@CCode)
	and a.ProdId=@ProdID 
	and b.ReferenceNumber not in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID
 
	select @ClearedCredit=isnull(sum(a.CreditAmount),0.00) from JournalEntryDetail as a
	inner join JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId in ( select COAID from COA where AccountId=@CashAccountCOAID and AccountTypeID=4 and SS1=@CCode)
	and a.ProdId=@ProdID and 
	b.ReferenceNumber in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID

	select @Deposit=isnull(sum(a.DebitAmount),0.00) from JournalEntryDetail as a inner join 
	JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId in ( select COAID from COA where AccountId=@CashAccountCOAID and AccountTypeID=4 and SS1=@CCode)
	and a.ProdId=@ProdID 
	and b.ReferenceNumber not in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID

	select @ClearedDebit=isnull(sum(a.DebitAmount),0.00) from JournalEntryDetail 
	as a inner join JournalEntry as b on a.JournalEntryId=b.JournalEntryId
	where a.COAId in ( select COAID from COA where AccountId=@CashAccountCOAID 
	and AccountTypeID=4 and SS1=@CCode)  and a.ProdId=@ProdID 
	and b.ReferenceNumber  in (select JEID from ReconcilationAddon  where Status='CLEARED')--PaymentID
end
select @Payment as Credit,@Deposit as Debit, @ClearedCredit
as CCredit,@ClearedDebit as CDebit
END
GO