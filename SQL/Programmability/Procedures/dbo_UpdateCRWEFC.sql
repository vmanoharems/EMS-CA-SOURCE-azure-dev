SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateCRWEFC]   --  exec InsertUpdateCRW 1,2,61,2942,'610-05','9','ETC'
(
@BudgetID int,
@BudgetFileID int,
@DetailLevel int,
@SaveValue varchar(50),
@Changes varchar(50),
@COAID int,
@ModeType varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	exec UpdateVarianceInfo @BudgetID,@BudgetFileID,@COAID,1,0,@Changes,@SaveValue;

	declare @OldValue int;
	declare @NewValue int;
	declare @ParentID int;
	declare @L1COA varchar(50);
	declare @L2COA varchar(50);
	declare @L3COA varchar(50);
	declare @L4COA varchar(50);
	declare @L5COA varchar(50);
	declare @BudgetValue varchar(100);
	declare @L1P int;
	declare @L2P int;
	declare @L3P int;
	declare @L4P int;
	declare @L5P int;
	Declare @Rtree TABLE (COAID Varchar(30), BAmount varchar(50),Status varchar(50))

	if(@DetailLevel=1)
	begin
	  update EstimatedCost Set EFC=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	  insert into @Rtree values(@COAID,@SaveValue,'OK');
	end
	    
	if(@DetailLevel=2)
	begin
	    select @OldValue=EFC from EstimatedCost  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    update EstimatedCost Set EFC=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
		select @L1P=CategoryId  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-cast(@OldValue as int);
		select @L1COA=COAID  from BudgetCategoryFinal where cid=@L1P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L1COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L1COA,@NewValue,'ADD');
	end

	if(@DetailLevel=3)
	begin
	    select @OldValue=EFC from EstimatedCost  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    update EstimatedCost Set EFC=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
	   	select @L5P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-cast(@OldValue as int);
		select @L5COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L5P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L5COA,@NewValue,'ADD');
		select @L1P=CategoryId  from BudgetAccountsFinal where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L1COA=COAID  from BudgetCategoryFinal where cid=@L1P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L1COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L1COA,@NewValue,'ADD');		
	end

	if(@DetailLevel=4)
	begin 
        select @OldValue=EFC from EstimatedCost  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    update EstimatedCost Set EFC=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
	   	select @L5P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-cast(@OldValue as int);
		select @L5COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L5P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L5COA,@NewValue,'ADD');
	   	select @L4P=ParentID  from BudgetAccountsFinal where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L4COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L4P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L4COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L4COA,@NewValue,'ADD');
		select @L1P=CategoryId  from BudgetAccountsFinal where COAID=@L4COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L1COA=COAID  from BudgetCategoryFinal where cid=@L1P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L1COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L1COA,@NewValue,'ADD');
	end

	if(@DetailLevel=5)
	begin
	    select @OldValue=EFC from EstimatedCost  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    update EstimatedCost Set EFC=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
	   	select @L5P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-cast(@OldValue as int);
		select @L5COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L5P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L5COA,@NewValue,'ADD');
	   	select @L4P=ParentID  from BudgetAccountsFinal where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L4COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L4P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L4COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L4COA,@NewValue,'ADD');
	   	select @L3P=ParentID  from BudgetAccountsFinal where COAID=@L4COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L3COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L3P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L3COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L3COA,@NewValue,'ADD');
		select @L1P=CategoryId  from BudgetAccountsFinal where COAID=@L3COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L1COA=COAID  from BudgetCategoryFinal where cid=@L1P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L1COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L1COA,@NewValue,'ADD');
	end

	if(@DetailLevel=6)
	begin
	    select @OldValue=EFC from EstimatedCost  where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	    update EstimatedCost Set EFC=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@COAID,@SaveValue,'OK');
	   	select @L5P=ParentID  from BudgetAccountsFinal where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		set @NewValue=cast(@SaveValue as int)-cast(@OldValue as int);
		select @L5COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L5P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L5COA,@NewValue,'ADD');
	   	select @L4P=ParentID  from BudgetAccountsFinal where COAID=@L5COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L4COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L4P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L4COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L4COA,@NewValue,'ADD');
	   	select @L3P=ParentID  from BudgetAccountsFinal where COAID=@L4COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L3COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L3P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L3COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L3COA,@NewValue,'ADD');
	   	select @L2P=ParentID  from BudgetAccountsFinal where COAID=@L3COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L2COA=COAID  from BudgetAccountsFinal where BudgetAccountID=@L2P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L2COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L2COA,@NewValue,'ADD');
	   	select @L1P=CategoryId  from BudgetAccountsFinal where COAID=@L2COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		select @L1COA=COAID  from BudgetCategoryFinal where cid=@L1P and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		update EstimatedCost Set EFC=(cast(EFC as int)+@NewValue) where COAID=@L1COA and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
		insert into @Rtree values(@L1COA,@NewValue,'ADD');
	end
	
	  -----------------------for ETC & EFC --------------------------------------------------------------

   select  COAID,  BAmount ,Status from @Rtree

end



GO