Alter PROCEDURE [dbo].[CheckPayrollFileBeforePost]
(
@ExpenseID int,
@ModifyBy int,
@TransValueStr varchar(500),
@COAString varchar(500),
@SegmentString varchar(500),
@SegmentString1 varchar(500),
@SegmentString2 varchar(500),
@PayDescription varchar(100)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @PayrollFileID int;
	declare @CompanyID int;
	declare @ProdID int;
	declare @CompanyCode varchar(50);
	declare @COA varchar(500);
	declare @Check varchar(50);


	select @PayrollFileID=PayrollFileID from PayrollExpense where PayrollExpenseID=@ExpenseID

    select @CompanyID=CompanyID,@ProdID=ProdID from PayrollFile where PayrollFileID=@PayrollFileID
 
    select @CompanyCode=CompanyCode from Company where CompanyID=@CompanyID

	declare @AccountID int;

	if right(@SegmentString1,1) = '|'
		set @SegmentString1 = left(@SegmentString1, (len(@SegmentString1)-1))

select @AccountID=AccountId from TblAccounts where AccountCode=@SegmentString2 and SegmentType='Detail'

select @COA=COAID from COA where AccountId=@AccountID and ParentCode=@SegmentString1

    if exists(select * from COA where COAID=@COA and ProdId=@ProdID)
	begin
	
	select 0 as ExpenseID;
	end

	else
	begin
	select @ExpenseID as ExpenseID;

	end
END





GO