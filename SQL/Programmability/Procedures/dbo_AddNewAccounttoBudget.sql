SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[AddNewAccounttoBudget]
(
@Budgetfileid int,
@AccountNumber varchar(50),
@AccountDescription varchar(100),
@AccountFringe varchar(50),
@AccountTotal varchar(50),
@ProdID int,
@createdby int,
@CategoryNumber varchar(100)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	
	declare @MaxAid int;
	declare @cid int;

	select @cid=cid  from BudgetCategory where CategoryNumber =@CategoryNumber and Budgetfileid=@Budgetfileid;
	
	declare @BudgetIDD int;

	select  @BudgetIDD=BudgetID from BudgetFile where BudgetFileID=@Budgetfileid;


	 select @MaxAid=max(AccountID) from BudgetAccounts where Budgetfileid=@Budgetfileid;


    declare @StrVal varchar(100);

	SELECT @StrVal=SegStr1 FROM BudgetFile where BudgetFileID=@BudgetFileID;

	

	insert into BudgetAccounts (CategoryId,AccountID,AccountNumber,AccountDesc
	,AccountFringe,AccountTotal,BudgetFileID,BudgetID,CreatedDate,CreatedBy,COACODE)values
	(@cid,@MaxAid+1,@AccountNumber,@AccountDescription,@AccountFringe,@AccountTotal,@Budgetfileid
	,@BudgetIDD,CURRENT_TIMESTAMP,@createdby,@StrVal+'|'+@CategoryNumber+'>'+@AccountNumber)

	select 1;
  
  
END



GO