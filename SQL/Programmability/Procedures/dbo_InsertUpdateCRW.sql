SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateCRW]  --  exec InsertUpdateCRW 1,2,61,2942,'610-05','9','ETC'
(
@CID int,
@BudgetID int,
@BudgetFileID int,
@BudgetCategoryID int,
@AccountNumber varchar(50),
@SaveValue varchar(50),
@ModeType varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @BudgetAccountID varchar(50);

	select @BudgetAccountID=a.BudgetAccountID from BudgetAccounts as a inner join BudgetCategory as b on a.CategoryId=b.cid
inner join BudgetFile as c on a.BudgetFileID=c.BudgetFileID
where b.BudgetCategoryID=@BudgetCategoryID and a.BudgetID=@BudgetID and a.BudgetFileID=@BudgetFileID and a.AccountNumber=@AccountNumber
and c.CompanyID=@CID;



if exists (select * from CRW where BudgetAccountID=@BudgetAccountID)
begin

    if(@ModeType='EFC')
	begin
	update CRW Set EFC=@SaveValue where BudgetaccountID=@BudgetAccountID;
	end
	else
	begin
	declare @NewSave decimal;
	declare @OLDEFCVALUE varchar(50);
	select @OLDEFCVALUE= isnull(EFC,0) from CRW where BudgetAccountID=@BudgetAccountID;

	set @NewSave=cast(@OLDEFCVALUE as decimal)+cast(@SaveValue as decimal);

	update CRW Set ETC=@SaveValue ,EFC=@NewSave where BudgetaccountID=@BudgetAccountID;
	end
	select @BudgetAccountID as AccountID,@ModeType as SaveType;
end
else
begin
      if(@ModeType='EFC')
	  begin
	  insert into CRW (BudgetAccountID,ETC,EFC,BudgetCategoryID) values (@BudgetAccountID,@SaveValue,@SaveValue,@BudgetCategoryID)
	  end
	  else
	  begin
	   insert into CRW (BudgetAccountID,ETC,EFC,BudgetCategoryID) values (@BudgetAccountID,@SaveValue,@SaveValue,@BudgetCategoryID)
	  end

	  select @BudgetAccountID as AccountID,@ModeType as SaveType;
end
END



GO