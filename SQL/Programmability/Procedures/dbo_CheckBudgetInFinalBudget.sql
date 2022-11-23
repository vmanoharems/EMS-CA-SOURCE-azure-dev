SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[CheckBudgetInFinalBudget]  --- EXEC CheckBudgetInFinalBudget 1,2,1
(
@BudgetID int,
@BudgetFileID int,
@createdby int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	 declare @SegStr varchar(100);
	 declare @SegStrCheck varchar(100);
	 declare @CCount int;
	 declare @ACount int;

	 select @SegStr=SegStr1 from BudgetFile where Budgetfileid=@BudgetFileID and BudgetID=@BudgetID

	  select @SegStrCheck=SegStr1 from BudgetFile where  BudgetID=@BudgetID and Status='Processed'


 if (@SegStr=@SegStrCheck)
 begin
 select '1' as Result ,'' as ErrorCount;
 end
 else
 begin
  
   insert into BudgetCategoryFinal (cid,CategoryNumber,CategoryDescription ,CategoryFringe ,CategoryOriginal 
   ,CategoryTotal ,CategoryVariance
      ,Budgetfileid,Createddate,modifieddate,createdby,modifiedby,BudgetID ,S1 ,S2,S3,S4,S5,S6,S7,S8,COACODE,COAID)
	  select cid,CategoryNumber,CategoryDescription ,CategoryFringe ,CategoryOriginal ,CategoryTotal ,CategoryVariance
      ,Budgetfileid,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,@createdby,modifiedby,BudgetID ,S1 ,S2,S3,S4,S5,S6,S7,S8,COACODE,COAID
	   from BudgetCategory where BudgetID=@BudgetID and Budgetfileid=@BudgetFileID and COAID is not NULL

   insert into BudgetAccountsFinal (CategoryId,AccountID,AccountNumber ,AccountDesc,AccountFringe,AccountOriginal
	  ,AccountTotal,AccountVariance
      ,BudgetFileID,BudgetID,CreatedDate,ModifiedDate,CreatedBy,ModifiedBy,COACODE,DetailLevel,COAID,ParentID)
	  select CategoryId,AccountID,AccountNumber ,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,AccountVariance
      ,BudgetFileID,BudgetID,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,@createdby,ModifiedBy,COACODE,2,COAID,0 from BudgetAccounts
	   where BudgetID=@BudgetID and BudgetFileID=@BudgetFileID and  COAID is not null


	   ------------insert Green Rows Category----------------------------------
			
  declare @maxid int ; 
  select @maxid=max(cid) from BudgetCategoryFinal where Budgetfileid=@BudgetFileID

  declare @StrBeforeDT varchar(200);
  select @StrBeforeDT=SegStr1 from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@ProdID;


  insert into BudgetCategoryFinal (cid,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal,CategoryTotal,
  CategoryVariance,Budgetfileid,Createddate,createdby,BudgetID,S1,S2,S3,S4,S5,S6,S7,S8,COAID,COACODE)
 

   select (ROW_NUMBER() OVER (ORDER BY b.AccountCode))+@maxid,b.AccountCode,AccountName,
  '0','0','0','0' ,@BudgetFileID,CURRENT_TIMESTAMP,@createdby,@BudgetID,a.SS1,a.SS2,a.SS3,a.SS4,a.SS5,a.SS6,a.SS7,a.SS8,a.COAID, a.COACode
   from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
    where a.ProdId=@ProdID and a.COACode not in (select COACODE from BudgetCategory where
    Budgetfileid=@BudgetFileID and CategoryNumber  is not null  
	 )  and a.COACode like '%'+@StrBeforeDT+'|%' and a.DetailLevel=1 and isnull(a.AccountTypeid,0) not in (4,5)
    

	  ------------END Green Rows Category----------------------------------

	  -------------------------------Inseet Green ROW Accounts---------------------------------

	  declare @Categoryid int;
	  declare @CategoryNoo varchar(100);
	  declare @AccountID int;
	  declare @AccountNumber1 varchar(100);
	  declare @AccountDesc varchar(100);
	  declare @COACODE2 varchar(100);
	  declare @COAIDD int;


	   --declare @maxid int ; 
      

	   
    DECLARE Cus_Category1 CURSOR FOR 
   
  select distinct c.CategoryNumber,b.AccountCode,
b.AccountName ,a.COACode,a.COAID  from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
 inner join TblAccounts as d on b.ParentId=d.AccountId
inner join BudgetCategory as c on d.AccountCode=c.CategoryNumber
 where a.DetailLevel=2 and a.ProdId=@ProdID and c.Budgetfileid=@BudgetFileID and a.COACode like @SegStr+'|%'
 and a.COACode NOT in (select COACODE from BudgetAccounts where Budgetfileid=@BudgetFileID and COACode is not null) and isnull(a.AccountTypeid,0) not in (4,5)

	 
     open Cus_Category1;
     fetch next from Cus_Category1 into @CategoryNoo ,@AccountNumber1 ,@AccountDesc,@COACODE2,@COAIDD

     while @@FETCH_STATUS = 0
      begin

	   select @AccountID=max(AccountID) from BudgetAccounts where Budgetfileid=@BudgetFileID;
	   select @Categoryid=cid from BudgetCategoryFinal where CategoryNumber=@CategoryNoo and Budgetfileid=@BudgetFileID;
		
		insert into BudgetAccountsFinal(Categoryid,AccountID,AccountNumber,AccountDesc,AccountFringe,AccountOriginal,
		AccountTotal,AccountVariance,BudgetFileID,BudgetID,CreatedDate,CreatedBy,COAID,COACODE,DetailLevel,ParentID)
		values(@Categoryid,@AccountID,@AccountNumber1,@AccountDesc,0,0,0,0,@BudgetFileID,@BudgetID,CURRENT_TIMESTAMP,
		@createdby,@COAIDD,@COACODE2,2,0)

	 
	  
       fetch next from Cus_Category1 into @CategoryNoo ,@AccountNumber1 ,@AccountDesc,@COACODE2,@COAIDD		
	    end
       CLOSE Cus_Category1
     DEALLOCATE Cus_Category1
	 

	  --------------------------------END GREEN ROW ACCOUNTS-------------------------------------------

	  ------insert Next All Level after 2----

	   exec InsertRemBudgetdata @BudgetFileID
	  ------end------------------------

	  exec InsertDataETCEFC @BudgetID,@BudgetFileID


      update BudgetFile set Status='Processed' where Budgetid=@BudgetID and BudgetFileID=@BudgetFileID;
 
     select '0' as Result ,'' as ErrorCount;
 end

END



GO