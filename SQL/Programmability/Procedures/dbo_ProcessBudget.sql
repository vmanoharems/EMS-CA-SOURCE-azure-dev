SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[ProcessBudget]    --exec ProcessBudget 'Initial Upload',1,1,1
(
@ActionType varchar(50),
@BudgetFileID int,
@BudgetID int,
@createdby int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	 declare @cid varchar(50);
	 declare @CategoryNumber varchar(50);
	 declare @CategoryFringe decimal(18,2);
	 declare @CategoryOriginal decimal(18,2);
	 declare @CategoryTotal decimal(18,2);
     declare @CategoryVariance decimal(18,2);
	 declare @BudgetID1 int;

	   declare @CategoryFringe1 decimal(18,2);
	   declare @CategoryOriginal1 decimal(18,2);
	   declare @CategoryTotal1 decimal(18,2);
       declare @CategoryVariance1 decimal(18,2);

	 declare @CategoryId int;
	 declare @AccountID int;
	 declare @AccountNumber varchar(50);
	 declare @AccountFringe decimal(18,2);
	 declare @AccountOriginal decimal(18,2);
	 declare @AccountTotal decimal(18,2);
     declare @AccountVariance decimal(18,2);
	 declare @BudgetID2 int;

	 declare @AccountFringe1 decimal(18,2);
	 declare @AccountOriginal1 decimal(18,2);
	 declare @AccountTotal1 decimal(18,2);
     declare @AccountVariance1 decimal(18,2);


	update BudgetFile set Status='Processed' where BudgetFileID=@BudgetFileID

	if(@ActionType='Initial Upload')
	begin

	insert into BudgetCategoryFinal (cid,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal,CategoryTotal,CategoryVariance,Budgetfileid,Createddate,createdby,BudgetID)
	select cid,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal,CategoryTotal,CategoryVariance,Budgetfileid,CURRENT_TIMESTAMP,@createdby,BudgetID from BudgetCategory where BudgetID=@BudgetID;
	
	insert into BudgetAccountsFinal (CategoryId,AccountID,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,AccountVariance,BudgetFileID,BudgetID,CreatedDate,CreatedBy)
	select CategoryId,AccountID,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,AccountVariance,BudgetFileID,BudgetID,CURRENT_TIMESTAMP,@createdby from BudgetAccounts where BudgetID=@BudgetID;

	--insert into BudgetDetailFinal (AccountID,AggPercent,DLocation,DetailSet,Description,Amount,Unit,X,Unit2,Currency,Rate,Unit3,Unit4,SubTotal,HiddenDfourthMlt,BudgetFileID,BudgetID,Createddate,CreatedBy)	
	--select AccountID,AggPercent,DLocation,DetailSet,Description,Amount,Unit,X,Unit2,Currency,Rate,Unit3,Unit4,SubTotal,HiddenDfourthMlt,BudgetFileID,BudgetID,CURRENT_TIMESTAMP,@createdby from BudgetDetail where BudgetID=@BudgetID;


	end 

	else if(@ActionType='Add To')
	begin

	--Start cursor for Budget Category

	DECLARE Cus_Category CURSOR FOR 
   select cid,CategoryNumber,CategoryFringe,CategoryOriginal,CategoryTotal,CategoryVariance,BudgetID from BudgetCategory where BudgetID=@BudgetID;
    OPEN Cus_Category
    

    FETCH NEXT FROM Cus_Category  INTO @cid,@CategoryNumber,@CategoryFringe,@CategoryOriginal,@CategoryTotal,@CategoryVariance,@BudgetID1
    WHILE @@FETCH_STATUS = 0
       BEGIN
	   

	   if exists(select * from BudgetCategoryFinal where BudgetID=@BudgetID1 and cid=@cid and CategoryNumber=@CategoryNumber)
	   begin

	   select @CategoryFringe1=(convert(decimal(18,2), isnull(CategoryFringe,0))),@CategoryOriginal1=(convert(decimal(18,2),isnull(CategoryOriginal,0))),
	   @CategoryTotal1=(convert(decimal(18,2),isnull(CategoryTotal,0))) ,@CategoryVariance1=(convert(decimal(18,2),isnull(CategoryVariance,0)))
	     from BudgetCategoryFinal where BudgetID=@BudgetID1 and cid=@cid and CategoryNumber=@CategoryNumber;

		 update BudgetCategoryFinal set CategoryFringe=convert(varchar(50),@CategoryFringe+@CategoryFringe1) ,CategoryOriginal=convert(varchar(50),@CategoryOriginal+@CategoryOriginal1),
		 CategoryTotal=convert(varchar(50),@CategoryTotal+@CategoryTotal1),CategoryVariance=convert(varchar(50),@CategoryVariance+@CategoryVariance1),
		 modifieddate=CURRENT_TIMESTAMP,modifiedby=@createdby,Budgetfileid=@Budgetfileid
		 where BudgetID=@BudgetID1 and cid=@cid and CategoryNumber=@CategoryNumber;


         FETCH NEXT FROM Cus_Category    INTO  @cid,@CategoryNumber,@CategoryFringe,@CategoryOriginal,@CategoryTotal,@CategoryVariance,@BudgetID1

	   end
        end
       CLOSE Cus_Category
     DEALLOCATE Cus_Category


	 --End Cursor for Budget Category

	 --Start Cursor For Budget Accounts
	

	 DECLARE Cus_Accounts CURSOR FOR 
   select CategoryId,AccountID,AccountNumber,AccountFringe,AccountOriginal,AccountTotal,AccountVariance,BudgetID from BudgetAccounts where BudgetID=@BudgetID;
    OPEN Cus_Accounts
    

    FETCH NEXT FROM Cus_Accounts  INTO @CategoryId,@AccountID,@AccountNumber,@AccountFringe,@AccountOriginal,@AccountTotal,@AccountVariance,@BudgetID2 
    WHILE @@FETCH_STATUS = 0
       BEGIN
	    

	   if exists(select * from BudgetAccountsFinal where BudgetID=@BudgetID1 and CategoryId=@CategoryId and AccountID=@AccountID and AccountNumber=@AccountNumber)
	   begin

	   select @AccountFringe1=(convert(decimal(18,2), isnull(AccountFringe,0))),@AccountOriginal1=(convert(decimal(18,2),isnull(AccountOriginal,0))),
	   @AccountTotal1=(convert(decimal(18,2),isnull(AccountTotal,0))) ,@AccountVariance1=(convert(decimal(18,2),isnull(AccountVariance,0)))
	     from BudgetAccountsFinal where BudgetID=@BudgetID1 and CategoryId=@CategoryId and AccountID=@AccountID and AccountNumber=@AccountNumber;

		 update BudgetAccountsFinal set AccountFringe=convert(varchar(50),@AccountFringe+@AccountFringe1) ,AccountOriginal=convert(varchar(50),@AccountOriginal+@AccountOriginal1),
		 AccountTotal=convert(varchar(50),@AccountTotal+@AccountTotal1),AccountVariance=convert(varchar(50),@AccountVariance+@AccountVariance1),
		 modifieddate=CURRENT_TIMESTAMP,modifiedby=@createdby,Budgetfileid=@Budgetfileid
		 where BudgetID=@BudgetID1 and CategoryId=@CategoryId and AccountID=@AccountID and AccountNumber=@AccountNumber;


         FETCH NEXT FROM Cus_Accounts    INTO  @CategoryId,@AccountID,@AccountNumber,@AccountFringe,@AccountOriginal,@AccountTotal,@AccountVariance,@BudgetID2 

	   end
        end
       CLOSE Cus_Accounts
     DEALLOCATE Cus_Accounts

	 --End Cursor for Budget Accounts


	end

	else if(@ActionType='Replace')
	begin

	--Start cursor for Budget Category

	DECLARE Cus_Category CURSOR FOR 
   select cid,CategoryNumber,CategoryFringe,CategoryOriginal,CategoryTotal,CategoryVariance,BudgetID from BudgetCategory where BudgetID=@BudgetID;
    OPEN Cus_Category
    

    FETCH NEXT FROM Cus_Category  INTO @cid,@CategoryNumber,@CategoryFringe,@CategoryOriginal,@CategoryTotal,@CategoryVariance,@BudgetID1
    WHILE @@FETCH_STATUS = 0
       BEGIN
	   

	   if exists(select * from BudgetCategoryFinal where BudgetID=@BudgetID1 and cid=@cid and CategoryNumber=@CategoryNumber)
	   begin
	  
	   update BudgetCategoryFinal set CategoryFringe='0' ,CategoryOriginal='0',
		 CategoryTotal='0',CategoryVariance='0'  where BudgetID=@BudgetID1 and cid=@cid and CategoryNumber=@CategoryNumber;

	
		 update BudgetCategoryFinal set CategoryFringe=convert(varchar(50),@CategoryFringe) ,CategoryOriginal=convert(varchar(50),@CategoryOriginal),
		 CategoryTotal=convert(varchar(50),@CategoryTotal),CategoryVariance=convert(varchar(50),@CategoryVariance),
		 modifieddate=CURRENT_TIMESTAMP,modifiedby=@createdby,Budgetfileid=@Budgetfileid
		 where BudgetID=@BudgetID1 and cid=@cid and CategoryNumber=@CategoryNumber;


         FETCH NEXT FROM Cus_Category    INTO  @cid,@CategoryNumber,@CategoryFringe,@CategoryOriginal,@CategoryTotal,@CategoryVariance,@BudgetID1

	   end
        end
       CLOSE Cus_Category
     DEALLOCATE Cus_Category


	 --End Cursor for Budget Category

	 --Start Cursor For Budget Accounts
	

	 DECLARE Cus_Accounts CURSOR FOR 
   select CategoryId,AccountID,AccountNumber,AccountFringe,AccountOriginal,AccountTotal,AccountVariance,BudgetID from BudgetAccounts where BudgetID=@BudgetID;
    OPEN Cus_Accounts
    

    FETCH NEXT FROM Cus_Accounts  INTO @CategoryId,@AccountID,@AccountNumber,@AccountFringe,@AccountOriginal,@AccountTotal,@AccountVariance,@BudgetID2 
    WHILE @@FETCH_STATUS = 0
       BEGIN
	    

	   if exists(select * from BudgetAccountsFinal where BudgetID=@BudgetID1 and CategoryId=@CategoryId and AccountID=@AccountID and AccountNumber=@AccountNumber)
	   begin

	    update BudgetAccountsFinal set AccountFringe='0' ,AccountOriginal='0',
		 AccountTotal='0',AccountVariance='0'
		 where BudgetID=@BudgetID1 and CategoryId=@CategoryId and AccountID=@AccountID and AccountNumber=@AccountNumber;

	
		 update BudgetAccountsFinal set AccountFringe=convert(varchar(50),@AccountFringe) ,AccountOriginal=convert(varchar(50),@AccountOriginal),
		 AccountTotal=convert(varchar(50),@AccountTotal),AccountVariance=convert(varchar(50),@AccountVariance),
		 modifieddate=CURRENT_TIMESTAMP,modifiedby=@createdby,Budgetfileid=@Budgetfileid
		 where BudgetID=@BudgetID1 and CategoryId=@CategoryId and AccountID=@AccountID and AccountNumber=@AccountNumber;


         FETCH NEXT FROM Cus_Accounts    INTO  @CategoryId,@AccountID,@AccountNumber,@AccountFringe,@AccountOriginal,@AccountTotal,@AccountVariance,@BudgetID2 

	   end
        end
       CLOSE Cus_Accounts
     DEALLOCATE Cus_Accounts

	 --End Cursor for Budget Accounts


	end


	else if(@ActionType='Replace All')
	begin

	--Start cursor for Budget Category

	 update BudgetCategoryFinal set CategoryFringe='0' ,CategoryOriginal='0',
		 CategoryTotal='0',CategoryVariance='0'	
		 where BudgetID=@BudgetID1 ;


	DECLARE Cus_Category CURSOR FOR 
   select cid,CategoryNumber,CategoryFringe,CategoryOriginal,CategoryTotal,CategoryVariance,BudgetID from BudgetCategory where BudgetID=@BudgetID;
    OPEN Cus_Category
    

    FETCH NEXT FROM Cus_Category  INTO @cid,@CategoryNumber,@CategoryFringe,@CategoryOriginal,@CategoryTotal,@CategoryVariance,@BudgetID1
    WHILE @@FETCH_STATUS = 0
       BEGIN
	   	  

		 update BudgetCategoryFinal set CategoryFringe=convert(varchar(50),@CategoryFringe+@CategoryFringe1) ,CategoryOriginal=convert(varchar(50),@CategoryOriginal+@CategoryOriginal1),
		 CategoryTotal=convert(varchar(50),@CategoryTotal+@CategoryTotal1),CategoryVariance=convert(varchar(50),@CategoryVariance+@CategoryVariance1),
		 modifieddate=CURRENT_TIMESTAMP,modifiedby=@createdby,Budgetfileid=@Budgetfileid
		 where BudgetID=@BudgetID1 and cid=@cid and CategoryNumber=@CategoryNumber;


         FETCH NEXT FROM Cus_Category    INTO  @cid,@CategoryNumber,@CategoryFringe,@CategoryOriginal,@CategoryTotal,@CategoryVariance,@BudgetID1

	  
        end
       CLOSE Cus_Category
     DEALLOCATE Cus_Category


	 --End Cursor for Budget Category

	 --Start Cursor For Budget Accounts
	 update BudgetAccountsFinal set AccountFringe='0' ,AccountOriginal='0',
		 AccountTotal='0',AccountVariance='0' where BudgetID=@BudgetID1;


	 DECLARE Cus_Accounts CURSOR FOR 
   select CategoryId,AccountID,AccountNumber,AccountFringe,AccountOriginal,AccountTotal,AccountVariance,BudgetID from BudgetAccounts where BudgetID=@BudgetID;
    OPEN Cus_Accounts
    

    FETCH NEXT FROM Cus_Accounts  INTO @CategoryId,@AccountID,@AccountNumber,@AccountFringe,@AccountOriginal,@AccountTotal,@AccountVariance,@BudgetID2 
    WHILE @@FETCH_STATUS = 0
       BEGIN
	    
		 update BudgetAccountsFinal set AccountFringe=convert(varchar(50),@AccountFringe) ,AccountOriginal=convert(varchar(50),@AccountOriginal),
		 AccountTotal=convert(varchar(50),@AccountTotal),AccountVariance=convert(varchar(50),@AccountVariance),
		 modifieddate=CURRENT_TIMESTAMP,modifiedby=@createdby,Budgetfileid=@Budgetfileid
		 where BudgetID=@BudgetID1 and CategoryId=@CategoryId and AccountID=@AccountID and AccountNumber=@AccountNumber;


         FETCH NEXT FROM Cus_Accounts    INTO  @CategoryId,@AccountID,@AccountNumber,@AccountFringe,@AccountOriginal,@AccountTotal,@AccountVariance,@BudgetID2 

	 
        end
       CLOSE Cus_Accounts
     DEALLOCATE Cus_Accounts

	 --End Cursor for Budget Accounts


	end


END



GO