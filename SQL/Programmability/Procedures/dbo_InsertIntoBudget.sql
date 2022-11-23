SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertIntoBudget]
@BudgetId int,
@Prodid int,
@BudgetName nvarchar(50),
@Createddate datetime,
@modifieddate datetime,
@createdby int,
@modifiedby int,
@Description nvarchar(100)
	
AS
BEGIN
	
	SET NOCOUNT ON;

  Insert Into Budget(BudgetId,Prodid,BudgetName,Createddate,modifieddate,createdby,modifiedby,Description)Values(@BudgetId,@Prodid,@BudgetName,@Createddate,@modifieddate,@createdby,@modifiedby,@Description)

END




GO