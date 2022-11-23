SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InsertDetailNumberInBudgetDetail]       --  exec InsertDetailNumberInBudgetDetail 3
(
@BudgetFileID int
)
AS
BEGIN
 -- SET NOCOUNT ON added to prevent extra result sets from
 -- interfering with SELECT statements.
 SET NOCOUNT ON;

 declare @BudgetDetailID int;
 declare @AccountNumber varchar(50);
 declare @OldValue varchar(50);
 declare @GlobalValue int;

 set @OldValue='';
 set @GlobalValue=1;


  declare ABC cursor for 

 select BudgetDetailID,b.AccountNumber from BudgetDetail as a inner join BudgetAccounts as b on a.AccountID=b.AccountID
  where a.BudgetFileID=@BudgetFileID and b.BudgetFileID=@BudgetFileID

  
 open ABC;
fetch next from ABC into @BudgetDetailID,@AccountNumber

while @@FETCH_STATUS = 0
begin

if(@OldValue='')
begin

set @OldValue=@AccountNumber;

update BudgetDetail set DetailNumber=@GlobalValue where BudgetDetailID=@BudgetDetailID;

set @GlobalValue=@GlobalValue+1;

end

else if(@OldValue=@AccountNumber)
begin

set @OldValue=@AccountNumber;

update BudgetDetail set DetailNumber=@GlobalValue where BudgetDetailID=@BudgetDetailID;

set @GlobalValue=@GlobalValue+1;

end

else 
begin

set @OldValue=@AccountNumber;
set @GlobalValue=1;

update BudgetDetail set DetailNumber=@GlobalValue where BudgetDetailID=@BudgetDetailID;

set @GlobalValue=@GlobalValue+1;

end


fetch next from ABC into @BudgetDetailID,@AccountNumber
end
close ABC;
deallocate ABC;

END


GO