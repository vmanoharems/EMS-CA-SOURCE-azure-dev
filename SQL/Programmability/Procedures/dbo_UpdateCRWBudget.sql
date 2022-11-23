SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[InsertUpdateCRWNew]    Script Date: 29/04/2016 11:09:16 PM ******/


CREATE PROCEDURE [dbo].[UpdateCRWBudget]  --  exec UpdateCRWBudget 1,1,2,'5000',94
(
@BudgetID int,
@BudgetFileID int,
@DetailLevel int,
@SaveValue varchar(50),
@COAID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @OldValue int;
	declare @NewValue int;
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

	  Declare @Rtree TABLE (COAID Varchar(30), BAmount varchar(50),Status varchar(50))

	if(@DetailLevel=1)
	begin

	  update BudgetCategoryFinal Set CategoryTotal=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	  insert into @Rtree values(@COAID,@SaveValue,'OK');
	end
    else
    begin
	    
	if(@DetailLevel=2)
	begin
		select @OldValue=isnull(AccountTotal,0),@ParentID=CategoryId from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		set @NewValue=cast(@SaveValue as int)-(@OldValue);

		set @BudgetValue=cast(@OldValue as int)+cast(@NewValue as int);

		update BudgetAccountsFinal Set AccountTotal=@BudgetValue  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		insert into @Rtree values(@COAID,@BudgetValue,'OK');

	    update BudgetCategoryFinal set CategoryTotal=(cast(CategoryTotal as int)+@NewValue)
		  where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		  select @L1COA=COAID from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		 insert into @Rtree values(@L1COA,@NewValue,'ADD');


		end

	if(@DetailLevel=3)
	begin
	   

		select @OldValue=isnull(AccountTotal,0),@L2P=ParentID ,@L2COA= COAID from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-(@OldValue);
		set @BudgetValue=cast(@OldValue as int)+cast(@NewValue as int);

		update BudgetAccountsFinal Set AccountTotal=@BudgetValue  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		 insert into @Rtree values(@COAID,@BudgetValue,'OK');

	   
		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L2P;
		select @L2COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID


	    insert into @Rtree values(@L2COA,@NewValue,'ADD');

		select @ParentID=CategoryId from BudgetAccountsFinal where BudgetAccountID=@L2P;

		update BudgetCategoryFinal set CategoryTotal=(cast(CategoryTotal as int)+@NewValue)
		  where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		  select @L3COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		   insert into @Rtree values(@L3COA,@NewValue,'ADD');
		end

	if(@DetailLevel=4)
	begin
	   

		select @OldValue=isnull(AccountTotal,0),@L3P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-(@OldValue);
		set @BudgetValue=cast(@OldValue as int)+cast(@NewValue as int);

		update BudgetAccountsFinal Set AccountTotal=@BudgetValue  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	      insert into @Rtree values(@COAID,@BudgetValue,'OK');


		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L3P;
			select @L2COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L2COA,@NewValue,'ADD');


		select @L2P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L3P;
		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L2P;
			select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID

	      insert into @Rtree values(@L3COA,@NewValue,'ADD');


		select @ParentID=CategoryId  from BudgetAccountsFinal where BudgetAccountID=@L2P;

		update BudgetCategoryFinal set CategoryTotal=(cast(CategoryTotal as int)+@NewValue)
		  where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;


		    select @L4COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		    insert into @Rtree values(@L4COA,@NewValue,'ADD');


		end


		if(@DetailLevel=5)
	begin
	   

		select @OldValue=isnull(AccountTotal,0),@L4P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-(@OldValue);
		set @BudgetValue=cast(@OldValue as int)+cast(@NewValue as int);

		update BudgetAccountsFinal Set AccountTotal=@BudgetValue  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	      insert into @Rtree values(@COAID,@BudgetValue,'OK');


		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L4P;
		select @L1COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L4P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L1COA,@NewValue,'ADD');



		select @L3P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L4P;
		
		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L3P;
		select @L2COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L2COA,@NewValue,'ADD');



		select @L2P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L3P;
		
		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L2P;
		select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		  insert into @Rtree values(@L3COA,@NewValue,'ADD');

		select @ParentID=CategoryId  from BudgetAccountsFinal where BudgetAccountID=@L2P;

		update BudgetCategoryFinal set CategoryTotal=(cast(CategoryTotal as int)+@NewValue)
		  where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		    select @L4COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		    insert into @Rtree values(@L4COA,@NewValue,'ADD');


		end


			if(@DetailLevel=6)
	begin
	   

		select @OldValue=isnull(AccountTotal,0),@L5P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-(@OldValue);
		set @BudgetValue=cast(@OldValue as int)+cast(@NewValue as int);

		update BudgetAccountsFinal Set AccountTotal=@BudgetValue  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	      insert into @Rtree values(@COAID,@BudgetValue,'OK');


		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L5P;
		select @L1COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L5P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L1COA,@NewValue,'ADD');


		select @L4P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L5P;
		
		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L4P;
		select @L2COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L4P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		  insert into @Rtree values(@L2COA,@NewValue,'ADD');

		select @L3P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L4P;
		
		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L3P;
		select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	      insert into @Rtree values(@L3COA,@NewValue,'ADD');

		select @L2P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L3P;
		
		update BudgetAccountsFinal Set AccountTotal=(cast(AccountTotal as int)+@NewValue)  where BudgetAccountID=@L2P;
			select @L4COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		  insert into @Rtree values(@L4COA,@NewValue,'ADD');

		select @ParentID=CategoryId from BudgetAccountsFinal where BudgetAccountID=@L2P;

		update BudgetCategoryFinal set CategoryTotal=(cast(CategoryTotal as int)+@NewValue)
		  where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		    select @L5COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;

		    insert into @Rtree values(@L5COA,@NewValue,'ADD');

		end
	 
  end

	  -----------------------for ETC & EFC --------------------------------------------------------------

	  declare @EFC varchar(50);

	  if exists(select * from EstimatedCost where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID)
	    begin
	       select @EFC=EFC from EstimatedCost where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		   if(@EFC='0')
		   begin
		   set @EFC=@SaveValue;
		   end	  
	    end
	  else
        begin
	       set @EFC=@SaveValue;
	    end

	  --select @COAID as AccountID,@EFC as EFC,@SaveValue as Budget;

	   select  COAID,  BAmount ,Status from @Rtree
END



GO