SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[BudgetRollUpAfterL1]
(
@COAID int,
@BudgetID int,
@BudgetFileID int,
@Amount varchar(100),
@ProdID int,
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 declare @AccountCode varchar(100);
 declare @AccountID int;
 declare @ChildNo int;
 declare @CategoryID int;

 select @AccountID=AccountId from COA where ProdId=@ProdID and COAID=@COAID
 select @AccountCode=AccountCode from TblAccounts where AccountId=@AccountID


 if (@Mode=1)
 begin

 select @CategoryID=cid from BudgetCategoryFinal where CategoryNumber=@AccountCode and BudgetID=@BudgetID and Budgetfileid=@BudgetFileID;

 select @ChildNo=count(*) from TblAccounts where ParentId=@AccountID

  select * from TblAccounts where AccountId=23
  select AccountCode,AccountName from TblAccounts where ParentId=23

  --insert into BudgetAccountsFinal(Categoryid,AccountID,AccountID,AccountNumber,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,
  --AccountVariance,BudgetFileID,BudgetID,CraetedDate,CreatedBy,COAID,COACODE,DetailLevel,ParentID) values
  --()
  end


END



GO