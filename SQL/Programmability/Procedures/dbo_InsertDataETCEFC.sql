SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertDataETCEFC]
(
@BudgetID int,
@BudgetFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

       declare @COAIDN int;
	   declare @DetailL int;
	   declare @Amt varchar(100);

    DECLARE Cus_Category1 CURSOR FOR 
   
   select COAID  as COAID, 1 as DL,CategoryTotal as Amount from BudgetCategoryFinal where BudgetID=@BudgetID and Budgetfileid=@BudgetFileID
union all
select COAID,DetailLevel as DL, AccountTotal as Amount from BudgetAccountsFinal where BudgetID=@BudgetID and Budgetfileid=@BudgetFileID

	 
     open Cus_Category1;
     fetch next from Cus_Category1 into @COAIDN ,@DetailL ,@Amt

     while @@FETCH_STATUS = 0 
      begin

	  insert into EstimatedCost (DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID,ExpandValue,Budget,BlankETC,BlankEFC) values
	  (@DetailL,@BudgetID,@BudgetFileID,0,@Amt,@COAIDN,0,0,0,0)
	  
       fetch next from Cus_Category1 into @COAIDN ,@DetailL ,@Amt
	    end
       CLOSE Cus_Category1
     DEALLOCATE Cus_Category1
	 

END


GO