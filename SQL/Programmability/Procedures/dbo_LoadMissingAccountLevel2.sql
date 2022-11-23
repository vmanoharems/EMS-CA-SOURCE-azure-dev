SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[LoadMissingAccountLevel2]  -- LoadMissingAccount 1,54
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
		select
			@SegStr=SegStr1
			from BudgetFile
			where Budgetfileid=@BudgetFileID 
			and BudgetID=@BudgetID 
			and prodid=@ProdID
			;

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

			DECLARE Cus_Category1 CURSOR FOR 
			select distinct c.CategoryNumber,b.AccountCode,b.AccountName ,a.COACode,a.COAID
			from COA as a 
			join TblAccounts as b on a.AccountId=b.AccountId
			join TblAccounts as d on b.ParentId=d.AccountId
			join BudgetCategoryFinal as c on d.AccountCode=c.CategoryNumber
			where a.DetailLevel=2 
				and a.ProdId= @ProdID --60--@ProdID
				and c.Budgetfileid=@BudgetFileID --1--@BudgetFileID
				and a.COACode like @SegStr+'|%' --'01|00|%' --@SegStr+'|%'
				and a.COACode NOT in (
				select COACODE
					from BudgetAccounts 
					where Budgetfileid=@BudgetFileID --1--@BudgetFileID 
					and COACode is not null
					union
				select COACODE
					from BudgetAccountsFinal
					where Budgetfileid=@BudgetFileID --1--@BudgetFileID 
					and COACode is not null
					)
				and isnull(a.AccountTypeid,0) not in (4,5)

			open Cus_Category1;
			fetch next from Cus_Category1 into @CategoryNoo ,@AccountNumber1 ,@AccountDesc,@COACODE2,@COAIDD

			while @@FETCH_STATUS = 0
			begin
				select @AccountID=max(AccountID) from BudgetAccountsFinal where Budgetfileid=@BudgetFileID;
				select @Categoryid=cid from BudgetCategoryFinal where CategoryNumber=@CategoryNoo and Budgetfileid=@BudgetFileID;
		
				insert into BudgetAccountsFinal
					(Categoryid,AccountID,AccountNumber,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,AccountVariance
					,BudgetFileID,BudgetID,CreatedDate,CreatedBy,COAID,COACODE,DetailLevel,ParentID)
				values
					(@Categoryid,@AccountID,@AccountNumber1,@AccountDesc,0,0,0,0
					,@BudgetFileID,@BudgetID,CURRENT_TIMESTAMP,@createdby,@COAIDD,@COACODE2,2,0);

				insert into EstimatedCost 
					(DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID,ExpandValue,Budget,BlankETC,BlankEFC)
				values
					(2,@BudgetID,@BudgetFileID,0,0,@COAIDD,0,0,0,0)

			fetch next from Cus_Category1 into @CategoryNoo ,@AccountNumber1 ,@AccountDesc,@COACODE2,@COAIDD	
			end	
       CLOSE Cus_Category1
     DEALLOCATE Cus_Category1
  
       fetch next from Cus_Budget into @BudgetID ,@BudgetFileID		
	     end
       CLOSE Cus_Budget
     DEALLOCATE Cus_Budget

END
GO