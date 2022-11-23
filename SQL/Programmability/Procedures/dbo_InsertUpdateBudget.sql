SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Procedure [dbo].[InsertUpdateBudget]
(
@BudgetId int,
@Prodid int,
@BudgetName nvarchar(50),
@createdby int,
@Description nvarchar(100)
)
As

begin

if exists (select * from Budget where BudgetName=@BudgetName and Prodid=@Prodid)
begin
select 0;
END
else
begin
Insert into Budget(Prodid,BudgetName,Createddate,createdby,Description) values(@Prodid,@BudgetName,CURRENT_TIMESTAMP,@createdby,@Description)

select cast(@@IDENTITY as int);
end
end


GO