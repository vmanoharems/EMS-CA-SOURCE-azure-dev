SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateBudgetCategory]  --exec UpdateBudgetCategory 1,'6204111',1,1
(
@BudgetCategoryID int,
@Parameter varchar(50),
@ModifyBy int,
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	if(@Mode=1)
	begin
	declare @BudgetID int;
	declare @BudgetFileID int;
	declare @CateCount int;
	declare @ReResult nvarchar(50)


	select @BudgetFileID=Budgetfileid,@BudgetID=BudgetID from BudgetCategory where BudgetCategoryID=@BudgetCategoryID;

	select @CateCount=isnull(count(*),0) from BudgetCategory where Budgetfileid =@BudgetFileID and BudgetID=@BudgetID and BudgetCategoryID=@BudgetCategoryID and CategoryNumber=@Parameter;

	if(@CateCount=0)
	begin
	update BudgetCategory set CategoryNumber=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetCategoryID=@BudgetCategoryID;

	declare @Available varchar(50);
	
   select @Available=count(*)  from TblAccounts as a inner join BudgetCategory as b on a.AccountCode=b.CategoryNumber
 where a.ProdId=(select prodid from BudgetFile where BudgetFileID=(select Budgetfileid from BudgetCategory where BudgetCategoryID=@BudgetCategoryID)) and b.BudgetCategoryID=@BudgetCategoryID

	set  @ReResult= 'Record Updated Sucessfully'+'/'+@Available+'/'+CONVERT(varchar(10), @BudgetCategoryID);
	end
	else
	begin
	set  @ReResult= 'Category Number Already Exists'+'/0/'+CONVERT(varchar(10), @BudgetCategoryID);
	end

	
	end

	else if(@Mode=2)
	begin
	update BudgetCategory set CategoryDescription=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetCategoryID=@BudgetCategoryID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end
	
	else if(@Mode=3)
	begin
	update BudgetCategory set CategoryFringe=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetCategoryID=@BudgetCategoryID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end

	else if(@Mode=4)
	begin
	update BudgetCategory set CategoryOriginal=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetCategoryID=@BudgetCategoryID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end

	else if(@Mode=5)
	begin
	update BudgetCategory set CategoryTotal=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetCategoryID=@BudgetCategoryID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end

	else if(@Mode=6)
	begin
	update BudgetCategory set CategoryVariance=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetCategoryID=@BudgetCategoryID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end
	
	select   @ReResult;
END



GO