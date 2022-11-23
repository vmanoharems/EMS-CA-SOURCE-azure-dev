CREATE PROCEDURE [dbo].[Budgetv2Upsert] -- [Budgetv2Upsert] null,'Jared testing','clone budget',1,null,1,14,0,1
@BudgetID int,
@BudgetName varchar(50),
@BudgetDescription varchar(200),
@BudgetOrigin int = NULL ,
@segmentJSON nvarchar(200) = NULL,
@UserID int,
@prodID int,
@islocked bit = 0,
@Active bit = 1
AS
BEGIN
SET NOCOUNT ON;
declare @BudgetType tinyint;

declare @tblReturn as Budgetv2_UDT;

	select @BudgetType = BudgetType from Budgetv2_Types B 
	where (
		(
			(@segmentJSON is null or @segmentJSON = '' or @segmentJSON = '{}') 
			and B.BudgetType=1
		)
		or 
		(
			(@segmentJSON is not null and @segmentJSON <> '' and @segmentJSON <> '{}')
			and B.BudgetType=2
		)
	);

	Merge dbo.Budgetv2 as target
		using (select 
				@BudgetID
				, @BudgetName
				, @BudgetDescription
				, @BudgetType
				, @BudgetOrigin
				, @segmentJSON
				, @UserID
				, getdate()
				, @UserID
				, getdate()
				, @prodID
				, @islocked
				, @Active
			) as source
			(
				BudgetID
				, BudgetName
				, BudgetDescription
				, BudgetType
				, BudgetOrigin
				, segmentJSON
				, createdby
				, createddate
				, modifiedby
				, modifieddate
				, prodID
				, islocked
				, Active
			)

		on (target.BudgetID = source.BudgetID and target.ProdID = source.ProdID)
	when matched then
		UPDATE
		SET [BudgetName]= source.BudgetName
			, [BudgetDescription] = source.BudgetDescription
			, [modifiedby] = @UserID
			, [modifieddate] = getdate()
			, [islocked] = source.islocked
			, [Active] = source.Active

	when not matched then
		INSERT (
			[BudgetName]
			, [BudgetDescription]
			, [BudgetType]
			, [BudgetOrigin]
			, [segmentJSON]
			, [createdby]
			, [createddate]
			, [prodID]
			, [islocked]
			, [Active]
		) VALUES (
			source.BudgetName
			, source.BudgetDescription
			, @BudgetType
			, source.BudgetOrigin
			, source.segmentJSON
			, source.createdby
			, getdate()
			, source.prodID
			, source.islocked
			, source.Active
		)

	output $action, inserted.* into @tblReturn;

	if (@BudgetID is null or @BudgetID = 0) and @BudgetOrigin is not null -- This means that we are cloning another Budget
	begin
		declare @newBudgetID int;
		select @newBudgetID = BudgetID from @tblReturn;

		insert into CRWv2 
			(BudgetID, PeriodID, AccountCode, EditStatusUserID, version, EFC, Budget, Notes, createdby)
		select @newBudgetID, PeriodID, AccountCode, null as EditStatusUserID, 1 as version, EFC, Budget, null as Notes, @UserID as createdby
		from CRWv2
		join (select BudgetID, max(version) as currentversion from CRWv2 where BudgetID = @BudgetOrigin group by BudgetID) as CRWL
		on CRWv2.BudgetID = CRWL.BudgetID and CRWv2.version = CRWL.currentversion
		where CRWv2.BudgetID = @BudgetOrigin
		;
	end

select * from @tblReturn;
END
GO