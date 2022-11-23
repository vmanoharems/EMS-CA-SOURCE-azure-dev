SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InsertCOAIDForBudget]
(
@BudgetID int,
@BudgetFileID int,
@prodid int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  
	declare @COACODE varchar(100);
	declare @COAID int;
	declare @BudgetCategoryID int;
	declare @COACODE1 varchar(100);
	declare @COAID1 int;
	
	declare @BudgetAccountID int;

	
    DECLARE Cus_Category CURSOR FOR 
    select b.COAID, a.COACODE,a.BudgetCategoryID from BudgetCategory as a inner join COA as b on a.COACODE=b.COACode
	 where a.Budgetfileid=@BudgetFileID and a.COACODE is not null and b.ProdId=@prodid
	
     open Cus_Category;
     fetch next from Cus_Category into @COAID, @COACODE,@BudgetCategoryID
	 -- select @COAID=isnull(COAID,0) from COA where ProdId=@prodid and COACode=@COACODE;
    while @@FETCH_STATUS = 0
      begin

	
	 update BudgetCategory set COAID=@COAID where BudgetCategoryID=@BudgetCategoryID;

      fetch next from Cus_Category into @COAID,@COACODE,@BudgetCategoryID
       end      
       CLOSE Cus_Category
     DEALLOCATE Cus_Category

	 -----------------------------------------------------------------------

	  DECLARE Cus_Category1 CURSOR FOR 
    select b.COAID, a.COACODE,a.BudgetAccountID from BudgetAccounts as a  inner join COA as b on a.COACODE=b.COACode
	 where a.BudgetFileID=@BudgetFileID and a.COACODE is not null and b.ProdId=@prodid
	
     open Cus_Category1;
     fetch next from Cus_Category1 into @COAID1,@COACODE1,@BudgetAccountID
	 -- select @COAID=isnull(COAID,0) from COA where ProdId=@prodid and COACode=@COACODE1;
    while @@FETCH_STATUS = 0
      begin

	
	 update BudgetAccounts set COAID=@COAID1 where BudgetAccountID=@BudgetAccountID;

      fetch next from Cus_Category1 into @COAID1,@COACODE1,@BudgetAccountID
       end      
       CLOSE Cus_Category1
     DEALLOCATE Cus_Category1

END



GO