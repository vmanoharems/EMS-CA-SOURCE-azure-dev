SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateCodeMaskingCategory]
(
@BudgetFileID int,
@CategoryNumber varchar(50),
@BudgetCategoryID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if exists(select CategoryNumber from BudgetCategory where Budgetfileid=@BudgetFileID and CategoryNumber=@CategoryNumber)
	begin
	select 'Category Number Already Exists' as Status,'0' as ReturnVal
	end
	else
	begin

	declare @StrVal varchar(100);

	SELECT @StrVal=SegStr1 FROM BudgetFile where BudgetFileID=@BudgetFileID;

	update BudgetCategory set CategoryNumber=@CategoryNumber , COACODE=@StrVal+'|'+@CategoryNumber
	 where BudgetCategoryID=@BudgetCategoryID and Budgetfileid=@BudgetFileID;

	 select 'Category Number Updated Sucessfully.' as Status,'1' as ReturnVal
	end

	

END



GO