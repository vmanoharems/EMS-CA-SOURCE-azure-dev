SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

 
 CREATE Procedure [dbo].[InsertRemBudgetdata]
  @Budgetfileid int
 As 
 Begin
declare @AcCode varchar(50)
declare @AcName varchar(100)
declare @COAIDinput int
declare @COAIDparent int
Declare @AccountIdinput int
Declare @ParentIDAccount int
Declare @ParnetIDBA int
declare @COAString varchar(100)
declare @AcID int
declare @CID int
declare @Budgetid int 
declare @COACODe varchar(100)
declare @dl int

declare c1 cursor for 
select  AccountCode,AccountName,c.Budgetfileid,c.Budgetid,a.COAID,a.COACODE,a.Detaillevel  from COA a inner Join tblAccounts b on a.Accountid=b.accountid
 inner Join Budgetfile c on a.Prodid=c.Prodid  where COACOde Like c.Segstr1+'|%' and COAID not in 
 (select COAID  from  Budgetaccountsfinal where Budgetfileid=@Budgetfileid) and a.DetailLevel>2
 and c.Budgetfileid=@Budgetfileid Order by detailLevel asc
open c1;
fetch next from c1 into @AcCode,@AcName,@Budgetfileid,@Budgetid,@COAIDinput,@COACODe,@dl

while @@FETCH_STATUS = 0
begin

select @AccountIdinput=Accountid from COA where COAID=@COAIDinput
select @ParentIDAccount=ParentId  from tblaccounts where Accountid=@AccountIdinput
select @COAString=Segstr1  from Budgetfile where Budgetfileid=@Budgetfileid
select @COAIDparent=COAID from COA where Accountid=@ParentIDAccount and COACOde like @COAString+ '|%'
select @AcID=Accountid,@ParnetIDBA=Budgetaccountid,@CID=Categoryid  from BudgetAccountsFinal where Budgetfileid=@Budgetfileid and COAID=@COAIDparent


Insert into budgetaccountsfinal

select @CID,@AcID,@AcCode,@AcName,0,0,0,0,@Budgetfileid,@Budgetid,getdate(),getdate(),1,1,@COAIDinput,@COACODe,@dl,@ParnetIDBA
fetch next from c1 into @AcCode,@AcName,@Budgetfileid,@Budgetid,@COAIDinput,@COACODe,@dl
end
close c1;
deallocate c1;

End



GO