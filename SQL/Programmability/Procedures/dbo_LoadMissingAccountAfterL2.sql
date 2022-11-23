SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[LoadMissingAccountAfterL2]  -- LoadMissingAccount 1,54
(
@createdby int,
@ProdID int
)
AS
BEGIN
	
	SET NOCOUNT ON;

  
     declare @SegStr varchar(100);
	 declare @SegStrCheck varchar(100);
	 declare @CCount int;
	 declare @ACount int;

	 declare @BudgetFileID int;
	 declare @BudgetID int;

	 DECLARE Cus_Budget CURSOR FOR  
     select BudgetID,BudgetFileID from BudgetFile where Status='Processed';
   
     open Cus_Budget;
     fetch next from Cus_Budget into @BudgetID ,@BudgetFileID

     while @@FETCH_STATUS = 0
      begin

	        select @SegStr=SegStr1 from BudgetFile where Budgetfileid=@BudgetFileID and BudgetID=@BudgetID and prodid=@ProdID;

			declare @maxid int ; 
            select @maxid=max(cid) from BudgetCategoryFinal where Budgetfileid=@BudgetFileID

            declare @StrBeforeDT varchar(200);   			
	        declare @Categoryid int;
	        declare @CategoryNoo varchar(100);
	        declare @AccountID int;
	        declare @AccountNumber1 varchar(100);
	        declare @AccountDesc varchar(100);
	        declare @COACODE2 varchar(100);
	        declare @COAIDD int;
			declare @COAIDinput int;
            declare @COAIDparent int;
            Declare @AccountIdinput int;
            Declare @ParentIDAccount int;
            Declare @ParnetIDBA int;
			declare @COAString varchar(100);
			declare @AcID int;
            declare @CID int;
			declare @AcCode varchar(50);
            declare @AcName varchar(100);
			declare @COACODe varchar(100);
            declare @dl int;
   
declare c1 cursor for 
select  AccountCode,AccountName,c.Budgetfileid,c.Budgetid,a.COAID,a.COACODE,a.Detaillevel  from COA a 
inner Join tblAccounts b on a.Accountid=b.accountid
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
select @AcID=Accountid,@ParnetIDBA=Budgetaccountid,@CID=Categoryid  from BudgetAccountsFinal where Budgetfileid=@Budgetfileid
 and COAID=@COAIDparent


Insert into budgetaccountsfinal

select @CID,@AcID,@AcCode,@AcName,0,0,0,0,@Budgetfileid,@Budgetid,getdate(),getdate(),1,1,@COAIDinput,@COACODe,@dl,@ParnetIDBA
fetch next from c1 into @AcCode,@AcName,@Budgetfileid,@Budgetid,@COAIDinput,@COACODe,@dl;


 insert into EstimatedCost (DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID,ExpandValue,Budget,BlankETC,BlankEFC) 
 values (@dl,@BudgetID,@BudgetFileID,0,0,@COAIDinput,0,0,0,0)

end
close c1;
deallocate c1;

  
       fetch next from Cus_Budget into @BudgetID ,@BudgetFileID		
	     end
       CLOSE Cus_Budget
     DEALLOCATE Cus_Budget
	 

END


GO