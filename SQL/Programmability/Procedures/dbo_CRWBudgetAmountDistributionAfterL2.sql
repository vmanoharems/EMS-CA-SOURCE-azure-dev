SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[CRWBudgetAmountDistributionAfterL2]   ---  exec CRWBudgetAmountDistributionAfterL2 5479,1,1,'600'
(
@COAID int,
@BudgetID int,
@BudgetFileID int,
@Amount varchar(100)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	 
	 select @Amount=AccountTotal from BudgetAccountsFinal where COAID=@COAID and BudgetID=@BudgetID and BudgetFileID=@BudgetFileID;

	declare @cid int;
	declare @childNo int;
	declare @L2B int;
	declare @L2DB int;
	declare @Adjust int;
	declare @BudgetAccountID int;
	declare @loopCnt int;
	set @loopCnt=0;
	declare @COAID2 int;
	declare @L2DBN varchar(50);
	declare @Dlevel int;
    Declare @Rtree TABLE (COAID Varchar(30), Amount varchar(50),EFCC varchar(50))
	
    update EstimatedCost set ExpandValue=9 where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

	 select @BudgetAccountID=BudgetAccountID ,@Dlevel=DetailLevel from BudgetAccountsFinal where BudgetID=@BudgetID and Budgetfileid=@BudgetFileID and COAID=@COAID;
	 select @childNo=count(*) from BudgetAccountsFinal where BudgetID=@BudgetID and Budgetfileid=@BudgetFileID and ParentID=@BudgetAccountID;

	   set @L2B=cast(@Amount as int);

	  if(cast(@Amount as int)>0)
				 begin
				   set @L2DB= floor(@L2B/@childNo);
				 end
				 else
				 begin
				   set @L2DB= floor(0);
				 end
			 
	 -- set @L2DB= floor(@L2B/@childNo);

	  set @L2DBN=cast(@L2DB as varchar(100));
						 
	  set @Adjust=cast(@L2B as int)-(@L2DB*@childNo);

	  DECLARE Cus_Category1 CURSOR FOR 
      select BudgetAccountID,COAID from BudgetAccountsFinal where BudgetID=@BudgetID and Budgetfileid=@BudgetFileID
	   and ParentID=@BudgetAccountID order by COACODE asc
	
     open Cus_Category1;
     fetch next from Cus_Category1 into @BudgetAccountID,@COAID2

     while @@FETCH_STATUS = 0
      begin


	      Declare @PEFC int;
	   Declare @CEFC int;
	    Declare @Adj1 int;

	  select @PEFC=EFC from EstimatedCost where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;	
				 if(cast(@PEFC as int)>0)
				 begin
				   set @CEFC= floor(@PEFC/@childNo);
				 end
				 else
				 begin
				   set @CEFC= floor(0);
				 end
						 
	  set @Adj1=cast(@PEFC as int)-(@CEFC*@childNo);





	 if(@loopCnt=0)
	 begin

	  update BudgetAccountsFinal set AccountTotal=@L2DB+@Adjust where BudgetAccountID=@BudgetAccountID;
	  -- insert into @Rtree values(@COAID2,@L2DB+@Adjust);

	   -- update EstimatedCost set EFC=@L2DB+@Adjust where COAID=@COAID2 and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;


		 update EstimatedCost set EFC=@CEFC+@Adj1 where COAID=@COAID2 and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	  insert into @Rtree values(@COAID2,@L2DB+@Adjust,@CEFC+@Adj1);

	  --if exists(select * from EstimatedCost where COAID=@COAID2 and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID)
   --    begin
   --        update EstimatedCost set ExpandValue=0 where COAID=@COAID2 and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID
   --   end
   --    else
   --   begin
   --      insert into EstimatedCost (DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID,ExpandValue) values
   --       (2,@BudgetID,@BudgetFileID,@L2DB+@Adjust,@L2DB+@Adjust,@COAID2,0)        
   --   end

	   set @loopCnt=1;
	 end
	 else
	  begin
	    update BudgetAccountsFinal set AccountTotal=@L2DBN  where BudgetAccountID=@BudgetAccountID;
		-- insert into @Rtree values(@COAID2,@L2DBN);

		 -- update EstimatedCost set EFC=@L2DBN where COAID=@COAID2 and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		  update EstimatedCost set EFC=@CEFC where COAID=@COAID2 and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	     insert into @Rtree values(@COAID2,@L2DB,@CEFC);

	    --if exists(select * from EstimatedCost where COAID=@COAID2 and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID)
     --    begin
     --   update EstimatedCost set ExpandValue=0 where COAID=@COAID2 and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID
     -- end
     --else
     -- begin
     --  insert into EstimatedCost (DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID,ExpandValue) values
     --  (@Dlevel+1,@BudgetID,@BudgetFileID,@L2DBN,@L2DBN,@COAID2,0)
	    --end
	  end
       fetch next from Cus_Category1 into @BudgetAccountID,@COAID2
	  		end

       CLOSE Cus_Category1
     DEALLOCATE Cus_Category1
				 
			
--select AccountTotal,@childNo as childNo from BudgetAccountsFinal where COAID=@COAID and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID

select COAID,Amount,EFCC from @Rtree;

end


GO