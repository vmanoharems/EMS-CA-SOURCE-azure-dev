SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
--EXEC v2CRW_Save 3,1,0,14,'[{ "AccountCode": "20-01", "Budget": 0 } ,{ "AccountCode" : "20-02", "Budget": 0 } ,{ "AccountCode" : "20-03", "Budget": 0 }
--			,{ "AccountCode" : "20-99", "Budget": 0 } ,{ "AccountCode" : "23-99", "Budget": 0 } ,{ "AccountCode" : "24-01", "Budget": 87500, "Notes":"Budget Increase!" } ]'
--			;

CREATE PROCEDURE [dbo].[v2CRW_Save]
(
--beging sp parameters
--declare 
@BudgetID int
, @UserID int
, @isSave bit = 0
, @ProdID int
, @CRWJSON nvarchar(max)
-- end sp parameters
)
--set @BudgetID = 3;
--set @ProdID = 14;
--set @UserID = 1;
as
BEGIN

declare @segmentJSON nvarchar(max);
declare @BudgetType int;
declare @CompanyCode varchar(10);
declare @CompanyID int;
declare @version int;
declare @EditStatusUserID int;

	if @isSave=1
	begin
		set @EditStatusUserID = @UserID;
	end

	select @segmentJSON = segmentJSON from Budgetv2 where BUdgetID = @BudgetID and ProdID = @ProdID;
	if ISJSON(@segmentJSON) = 1
	begin
		print 'We have a segment budget';
		select @CompanyID = CompanyID 
		from Company C
		join (
			select CO from OPENJSON(@segmentJSON) 
			with (CO nvarchar(10))
		) as CJSON
		on C.CompanyCode = CJSON.CO;
	end

	declare @PeriodID int;
	if @CompanyID is null 
	begin 
		select @PeriodID = dbo.getcurrentopenPeriodID(1,default)
	end
	ELSE
	begin
		select @PeriodID = dbo.getcurrentopenPeriodID(@CompanyID,default)
	end

	begin transaction
		select @version = isnull(max(version),0)+1 from CRWv2 where BudgetID = @BudgetID

		insert into CRWv2 
			(
				BudgetID
				, PeriodID
				, AccountCode
				, EditStatusUserID
				, version
				, EFC
				, Budget
				, Notes,
				createdby
			)
		SELECT 
			@BudgetID as BudgetID
			, @PeriodID as PeriodID
			, AccountCode 
			, @EditStatusUserID as EditStatusUserID
			, @version as version
			, isnull(EFC,Budget) -- if EFC is not in the JSON, then let's assume it's a Budget Load, and use the Budget for the EFC
			, Budget
			, Notes
			, @UserID as createdby
		FROM OPENJSON(@CRWJSON)
		WITH (
			AccountCode nvarchar(50)
			, EFC money
			, Budget money
			, Notes varchar(200)
		)
	commit transaction

	select
		BudgetID, PeriodID, version
		, sum(EFC) as EFCTotal, sum(Budget) as BudgetTotal
		, count(1) as RecordCount
	from CRWv2
	where BudgetID = @BudgetID 
	AND version = @version
	group by
		BudgetID, PeriodID, version
;
END
GO