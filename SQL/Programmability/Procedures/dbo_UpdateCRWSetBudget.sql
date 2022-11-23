SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateCRWSetBudget]  -- UpdateCRWSetBudget 1,1,1,100,222,14
(
@BudgetID int,
@BudgetFileID int,
@DetailLevel int,
@SaveValue varchar(50),
@COAID int,
@SetID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @ParentID int;
	declare @L1COA varchar(50);
	declare @L2COA varchar(50);
	declare @L3COA varchar(50);
	declare @L4COA varchar(50);
	declare @L5COA varchar(50);
	declare @BudgetValue varchar(100);
	 declare @L2P int;
	 declare @L3P int;
	 declare @L4P int;
	 declare @L5P int;

	 declare @DIFF int;


	 if exists(select * from EstimatedCostSet where BudgetID=@BudgetID and BudgetFileID=@BudgetFileID and COAID=@COAID and SetID=@SetID)
	 begin
	  select @DIFF=cast(Budget as int) from  EstimatedCostSet where BudgetID=@BudgetID and BudgetFileID=@BudgetFileID and COAID=@COAID and SetID=@SetID
	 
	  set @DIFF=cast(@SaveValue as int)-@DIFF;
	 
	 end
	 else
	 begin
	  insert into EstimatedCostSet (BudgetID,BudgetFileID,DetailLevel,COAID,SetID,EFC,ETC,Budget) values
	  (@BudgetID,@BudgetFileID,@DetailLevel,@COAID,@SetID,'0','0','0');

	  set @DIFF=cast(@SaveValue as int);
	 end


	 declare @NewVolumn varchar(50);

	 set @NewVolumn=cast(@DIFF as varchar(50));

	  Declare @Rtree TABLE (COAID Varchar(30), BAmount varchar(50),Status varchar(50))

	if(@DetailLevel=1)
	begin


	  update EstimatedCostSet Set Budget=@SaveValue where COAID=@COAID and BudgetID=@BudgetID and SetID=@SetID and BudgetFileID=@BudgetFileID;
	  insert into @Rtree values(@COAID,@NewVolumn,'ADD');
	
	
	end
    else
    begin
	    
	if(@DetailLevel=2)
	begin
		select @ParentID=CategoryId from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

	   update EstimatedCostSet Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and SetID=@SetID and BudgetFileID=@BudgetFileID;
	   insert into @Rtree values(@COAID,@NewVolumn,'ADD');

	   select @L1COA=COAID from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		 insert into @Rtree values(@L1COA,@NewVolumn,'ADD');


		end

	if(@DetailLevel=3)
	begin
	   
	     update EstimatedCostSet Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and SetID=@SetID and BudgetFileID=@BudgetFileID;
		 insert into @Rtree values(@COAID,@NewVolumn,'ADD');

		select @L2P=ParentID ,@L2COA=COAID from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		
	    insert into @Rtree values(@L2COA,@NewVolumn,'ADD');

		select @ParentID=CategoryId from BudgetAccountsFinal where BudgetAccountID=@L2P;

		 select @L3COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		  insert into @Rtree values(@L3COA,@NewVolumn,'ADD');
		end

	if(@DetailLevel=4)
	begin
	   
	     update EstimatedCostSet Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and SetID=@SetID and BudgetFileID=@BudgetFileID;
		 insert into @Rtree values(@COAID,@NewVolumn,'ADD');

		

		select @L3P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		
	    
		select @L2COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L2COA,@NewVolumn,'ADD');


		select @L2P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L3P;
	    select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID

	      insert into @Rtree values(@L3COA,@NewVolumn,'ADD');


		select @ParentID=CategoryId  from BudgetAccountsFinal where BudgetAccountID=@L2P;

		    select @L4COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		    insert into @Rtree values(@L4COA,@NewVolumn,'ADD');


		end


		if(@DetailLevel=5)
	begin
	   
	    update EstimatedCostSet Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and SetID=@SetID and BudgetFileID=@BudgetFileID;
		 insert into @Rtree values(@COAID,@NewVolumn,'ADD');


		select @L4P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	
		
		select @L1COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L4P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L1COA,@NewVolumn,'ADD');



		select @L3P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L4P;
		
		select @L2COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L2COA,@NewVolumn,'ADD');



		select @L2P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L3P;
		
		select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		  insert into @Rtree values(@L3COA,@NewVolumn,'ADD');

		select @ParentID=CategoryId  from BudgetAccountsFinal where BudgetAccountID=@L2P;

	
		    select @L4COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		    insert into @Rtree values(@L4COA,@NewVolumn,'ADD');


		end


			if(@DetailLevel=6)
	begin
	   
	      update EstimatedCostSet Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and SetID=@SetID and BudgetFileID=@BudgetFileID;
		 insert into @Rtree values(@COAID,@NewVolumn,'ADD');


		select @L5P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		
		select @L1COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L5P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L1COA,@NewVolumn,'ADD');


		select @L4P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L5P;
		
		select @L2COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L4P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		  insert into @Rtree values(@L2COA,@NewVolumn,'ADD');

		select @L3P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L4P;
		
		select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L3COA,@NewVolumn,'ADD');

		select @L2P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L3P;
		
		
			select @L4COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		  insert into @Rtree values(@L4COA,@NewVolumn,'ADD');

		select @ParentID=CategoryId from BudgetAccountsFinal where BudgetAccountID=@L2P;


		    select @L5COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		    insert into @Rtree values(@L5COA,@NewVolumn,'ADD');

		end
	 
  end

	  -----------------------for ETC & EFC --------------------------------------------------------------

	   select  COAID, BAmount ,Status from @Rtree
END



GO