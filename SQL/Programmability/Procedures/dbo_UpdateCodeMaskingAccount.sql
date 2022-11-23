SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateCodeMaskingAccount]
(
@BudgetFileID int,
@AccountNumber varchar(50),
@BudgetAccountID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if exists(select AccountNumber from BudgetAccounts where Budgetfileid=@BudgetFileID and AccountNumber=@AccountNumber)
	begin
	select 'Account Number Already Exists' as Status,'0' as ReturnVal
	end
	else
	begin

	declare @StrVal varchar(100);
	declare @CateNum varchar(100);

	SELECT @StrVal=SegStr1 FROM BudgetFile where BudgetFileID=@BudgetFileID;

	select @CateNum=b.CategoryNumber from BudgetAccounts as a inner join BudgetCategory as b on a.CategoryId=b.cid
	where a.BudgetAccountID=@BudgetAccountID and a.Budgetfileid=@BudgetFileID and b.Budgetfileid=@BudgetFileID


	update BudgetAccounts set AccountNumber=@AccountNumber , COACODE=@StrVal+'|'+@CateNum+'>'+@AccountNumber
	 where BudgetAccountID=@BudgetAccountID and Budgetfileid=@BudgetFileID;

	 select 'Account Number Updated Sucessfully.' as Status,'1' as ReturnVal
	end

	

END



GO