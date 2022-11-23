SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[UpdateCRWBudgetBlank]  --  exec UpdateCRWBudgetBlank 1,1,2,'5000',94
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

	  update EstimatedCost Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	  insert into @Rtree values(@COAID,@SaveValue,'OK');
	  insert into @Rtree values(@COAID,@SaveValue,'ADD');
	
	end
	    
	if(@DetailLevel=2)
	begin
		select @ParentID=CategoryId from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;			
		update EstimatedCost Set Budget=@SaveValue  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
		insert into @Rtree values(@COAID,@SaveValue,'ADD'); 	
	    select @L1COA=COAID from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L1COA,@SaveValue,'ADD');
	end

	if(@DetailLevel=3)
	begin 
		select @L2P=ParentID ,@L2COA= COAID from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;		
		update EstimatedCost Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
		insert into @Rtree values(@COAID,@SaveValue,'ADD');   
		select @L2COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	    insert into @Rtree values(@L2COA,@SaveValue,'ADD');
		select @ParentID=CategoryId from BudgetAccountsFinal where BudgetAccountID=@L2P;
	    select @L3COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    insert into @Rtree values(@L3COA,@SaveValue,'ADD');
	end

	if(@DetailLevel=4)
	begin	   
		select @L3P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;	
	    update EstimatedCost Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
		insert into @Rtree values(@COAID,@SaveValue,'ADD');
		select @L2COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	    insert into @Rtree values(@L2COA,@SaveValue,'ADD');
		select @L2P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L3P;	
		select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	    insert into @Rtree values(@L3COA,@SaveValue,'ADD');
		select @ParentID=CategoryId  from BudgetAccountsFinal where BudgetAccountID=@L2P;
	    select @L4COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
        insert into @Rtree values(@L4COA,@SaveValue,'ADD');
	end

	if(@DetailLevel=5)
	begin
		select @L4P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
		insert into @Rtree values(@COAID,@SaveValue,'ADD');
		select @L1COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L4P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	    insert into @Rtree values(@L1COA,@SaveValue,'ADD');
		select @L3P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L4P;	
	   	select @L2COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	    insert into @Rtree values(@L2COA,@SaveValue,'ADD');
		select @L2P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L3P;
		select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		insert into @Rtree values(@L3COA,@SaveValue,'ADD');
		select @ParentID=CategoryId  from BudgetAccountsFinal where BudgetAccountID=@L2P;
	    select @L4COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    insert into @Rtree values(@L4COA,@SaveValue,'ADD');
	end

	if(@DetailLevel=6)
	begin
		select @L5P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set Budget=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    insert into @Rtree values(@COAID,@SaveValue,'OK');
		insert into @Rtree values(@COAID,@SaveValue,'ADD');
		select @L1COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L5P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	    insert into @Rtree values(@L1COA,@SaveValue,'ADD');
		select @L4P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L5P;
		select @L2COA= COAID from BudgetAccountsFinal where BudgetAccountID=@L4P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		insert into @Rtree values(@L2COA,@SaveValue,'ADD');
		select @L3P=ParentID  from BudgetAccountsFinal where BudgetAccountID=@L4P;
		select @L3COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L3P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
	    insert into @Rtree values(@L3COA,@SaveValue,'ADD');
		select @L2P=ParentID from BudgetAccountsFinal where BudgetAccountID=@L3P;
		select @L4COA=COAID from BudgetAccountsFinal where BudgetAccountID=@L2P and  BudgetId=@BudgetID and BudgetFileID=@BudgetFileID
		insert into @Rtree values(@L4COA,@SaveValue,'ADD');
		select @ParentID=CategoryId from BudgetAccountsFinal where BudgetAccountID=@L2P;
	    select @L5COA=COAID  from BudgetCategoryFinal where cid=@ParentID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    insert into @Rtree values(@L5COA,@SaveValue,'ADD');
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


		declare @ChildCount int;
		

         
		select @ChildCount=Count(*) from TblAccounts where ParentId=(select AccountId from COA where COAID=@COAID)
		--select @ChildCount=Count(*) from COA where ParentCode=(select COACode from COA where COAID=@COAID)
		if(@ChildCount=0)
		 begin
		 if(@DetailLevel=1)
	       begin
		update BudgetCategoryFinal set CategoryTotal=@SaveValue where COAID=@COAID and BudgetID=@BudgetID and BudgetFileID=@BudgetFileID;
	    	end
		else
		   begin
		update BudgetAccountsFinal set AccountTotal=@SaveValue where COAID=@COAID and BudgetID=@BudgetID and BudgetFileID=@BudgetFileID;
		   end
		end
	  --select @COAID as AccountID,@EFC as EFC,@SaveValue as Budget;

	   select  COAID,  BAmount ,Status from @Rtree
END



GO