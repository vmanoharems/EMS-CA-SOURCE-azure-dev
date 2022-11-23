SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[UpdateBudgetAccount]
(
@BudgetAccountID int,
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


	select @BudgetFileID=Budgetfileid,@BudgetID=BudgetID from BudgetAccounts where BudgetAccountID=@BudgetAccountID;

	select @CateCount=isnull(count(*),0) from BudgetAccounts where Budgetfileid =@BudgetFileID and BudgetID=@BudgetID and BudgetAccountID=@BudgetAccountID and AccountNumber=@Parameter;

	if(@CateCount=0)
	begin
	update BudgetAccounts set AccountNumber=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetAccountID=@BudgetAccountID;
	declare @Available varchar(50);
	
   select @Available=count(*)  from TblAccounts as a inner join BudgetAccounts as b on a.AccountCode=b.AccountNumber
 where a.ProdId=(select prodid from BudgetFile where BudgetFileID=(select Budgetfileid from BudgetAccounts where BudgetAccountID=@BudgetAccountID))
  and b.BudgetAccountID=@BudgetAccountID;

	set  @ReResult= 'Record Updated Sucessfully'+'/'+@Available+'/'+CONVERT(varchar(10), @BudgetAccountID);

	end
	else
	begin
	set  @ReResult= 'Account Number Already Exists'+'/0/'+CONVERT(varchar(10), @BudgetAccountID);
	end

	
	end

	else if(@Mode=2)
	begin
	update BudgetAccounts set AccountDesc=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetAccountID=@BudgetAccountID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end
	
	else if(@Mode=3)
	begin
	update BudgetAccounts set AccountFringe=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetAccountID=@BudgetAccountID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end

	else if(@Mode=4)
	begin
	update BudgetAccounts set AccountOriginal=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetAccountID=@BudgetAccountID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end

	else if(@Mode=5)
	begin
	update BudgetAccounts set AccountTotal=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetAccountID=@BudgetAccountID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end

	else if(@Mode=6)
	begin
	update BudgetAccounts set AccountVariance=@Parameter ,modifieddate=CURRENT_TIMESTAMP ,modifiedby=@ModifyBy where BudgetAccountID=@BudgetAccountID;
		set  @ReResult= 'Record Updated Sucessfully.';
	end
	
	select   @ReResult;
END



GO