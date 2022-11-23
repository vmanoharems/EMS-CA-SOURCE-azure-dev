SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[LoadMissingAccountLevel1]  -- LoadMissingAccount 1,54
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

	        select @SegStr=SegStr1 from BudgetFile where Budgetfileid=@BudgetFileID and BudgetID=@BudgetID

			declare @maxid int ; 
            select @maxid=max(cid) from BudgetCategoryFinal where Budgetfileid=@BudgetFileID

            declare @StrBeforeDT varchar(200);
            select @StrBeforeDT=SegStr1 from BudgetFile where BudgetFileID=@BudgetFileID and prodid=@ProdID;


			 insert into EstimatedCost (DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID,ExpandValue,Budget,BlankETC,BlankEFC) 	 
         select 1,@BudgetID,@BudgetFileID,0,0,a.COAID, 0,0,0,0
         from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
         where a.ProdId=@ProdID and a.COACode not in (select COACODE from BudgetCategoryFinal where
         Budgetfileid=@BudgetFileID and CategoryNumber  is not null  
	     )  and a.COACode like '%'+@StrBeforeDT+'|%' and a.DetailLevel=1 and isnull(a.AccountTypeid,0) not in (4,5)


           insert into BudgetCategoryFinal (cid,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal,CategoryTotal,
           CategoryVariance,Budgetfileid,Createddate,createdby,BudgetID,S1,S2,S3,S4,S5,S6,S7,S8,COAID,COACODE)
 
         select (ROW_NUMBER() OVER (ORDER BY b.AccountCode))+@maxid,b.AccountCode,AccountName,
         '0','0','0','0' ,@BudgetFileID,CURRENT_TIMESTAMP,@createdby,@BudgetID,a.SS1,a.SS2,a.SS3,a.SS4,a.SS5,a.SS6,a.SS7,a.SS8,a.COAID, a.COACode
         from COA as a inner join TblAccounts as b on a.AccountId=b.AccountId
          where a.ProdId=@ProdID and a.COACode not in (select COACODE from BudgetCategoryFinal where
         Budgetfileid=@BudgetFileID and CategoryNumber  is not null  
     	 )  and a.COACode like '%'+@StrBeforeDT+'|%' and a.DetailLevel=1 and isnull(a.AccountTypeid,0) not in (4,5)
    
  
       fetch next from Cus_Budget into @BudgetID ,@BudgetFileID		
	     end
       CLOSE Cus_Budget
     DEALLOCATE Cus_Budget
	 
END


GO