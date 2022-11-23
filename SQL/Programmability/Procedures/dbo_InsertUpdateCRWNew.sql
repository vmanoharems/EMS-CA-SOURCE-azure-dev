SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

  --  select * from EstimatedCost

CREATE PROCEDURE [dbo].[InsertUpdateCRWNew]  --  exec InsertUpdateCRW 1,2,61,2942,'610-05','9','ETC'
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

	
if exists (select ID from EstimatedCost where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID)
begin

    if(@ModeType='EFC')
	  begin

	  update EstimatedCost Set EFC=@SaveValue where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	  select @COAID as AccountID,@SaveValue as SaveType;
	  end
	else
	begin
	   declare @NewSave varchar(50);	 
	   declare @OLDEFCVALUE varchar(50);
	  

	   select @OLDEFCVALUE= isnull(EFC,0) from EstimatedCost where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	 
	   set @NewSave=cast(@OLDEFCVALUE as decimal)+cast(@Changes as decimal);

	    update EstimatedCost Set ETC=@SaveValue ,EFC=@NewSave where COAID=@COAID and BudgetId=@BudgetID and BudgetFileID=@BudgetFileID;
	  select @COAID as AccountID,@NewSave as SaveType;
	end
	
end
else
begin
     
	  insert into EstimatedCost (DetailLevel,BudgetId,BudgetFileID,ETC,EFC,COAID)
	   values (@DetailLevel,@BudgetID,@BudgetFileID,@SaveValue,@SaveValue,@COAID)
	 
	  select @COAID as AccountID,@SaveValue as SaveType;
end
END



GO