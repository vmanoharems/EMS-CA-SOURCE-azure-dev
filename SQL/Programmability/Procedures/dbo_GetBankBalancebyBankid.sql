SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE Procedure [dbo].[GetBankBalancebyBankid] 
(@Bankid int)
AS
BEGIN

  DECLARE @COAID int,@AuditStatus nvarchar(20),@ClearingType nvarchar(20),@balance decimal(18,2)


    set @balance=0;
  
    select @ClearingType=ClearingType,@COAID=COAId from AccountClearing  where  Type='Bank' and AccountName='CashAccount'and Bankid=@Bankid;
  
  IF @ClearingType='COA'

  BEGIN
     select @balance=isnull(isnull(Sum(a.CreditAmount),0)-isnull(sum(a.DebitAmount),0) ,0) 
     from JOurnalEntrydetail a inner Join JournalEntry b on a.JournalEntryId=b.JournalEntryId
     and Auditstatus='Posted' and  COAID is not Null and COAId=@COAID;
  END

  ELSE  IF @ClearingType='Account'
  BEGIN
    select @balance=isnull(isnull(Sum(a.CreditAmount),0)-isnull(sum(a.DebitAmount),0) ,0)
    from JOurnalEntrydetail a inner Join JournalEntry b on a.JournalEntryId=b.JournalEntryId
    and Auditstatus='Posted' and  COAID is not Null and COAId in (
    select COAID from COA  where AccountId=@COAID) ;

  END

    select @balance as Balance;
  End






GO