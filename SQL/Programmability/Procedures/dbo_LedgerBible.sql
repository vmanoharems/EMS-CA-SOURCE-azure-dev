CREATE PROCEDURE [dbo].[LedgerBible] -- LedgerBible 1,1,1008,66,''
	@Companyid int,	@PeriodIdfrom int,	@PeriodIdTo int,@ProdId int
	,@LO nvarchar(100)
AS
BEGIN
	SET NOCOUNT ON;


	declare @CompanyCode varchar(10),@fiscalDate date;
	set @CompanyCode= (select CompanyCode from company where Companyid=@Companyid);
	set @fiscalDate=  (select FiscalStartdate from company where Companyid=@Companyid);
	If (@PeriodIdfrom < 1 or @PeriodIDFrom is null)
		begin
			set @PeriodIdfrom=(select ClosePeriodID from ClosePeriod  where CompanyId=@Companyid and CompanyPeriod=1)
		end

	If (@PeriodIdTo < 1 or @PeriodIDTo is null)
		begin
			set @PeriodIdTo=dbo.GetCurrentOpenPeriodID(@CompanyID,default);
		end

declare @PeriodStatus nvarchar(1000) = [dbo].[RangetoWhereInString](@PeriodIDFrom,@PeriodIDTo);

declare @Return table (
	Accountid int
	, COAID int
	, AcctDescription varchar(1000)
	, Acct varchar(100)
	, COAString varchar(1000)
	, TransactionCode varchar(100)
	, LineDescription varchar(100)
	, ThirdParty bit
	   , VendorName varchar(1000)
	   , RefVendor varchar(1000)
	   , VendorID int
	   , batchnumber varchar(100)
	   , TransactionNumber varchar(100)
	   , [Source] varchar(10)
	   , ClosePeriod int
	   , DocumentNo varchar(100)
	   , DocDate datetime
	   , [Description] varchar(1000)
	   , CheckNumber varchar(100)
	   , Amount money
	   , BeginingBal int
	   , Location varchar(100)
	   , TaxCode varchar(50)
);

Insert into @Return
	EXEC [dbo].[LedgerShared] @PCompanyID = @CompanyID
		, @PPeriodStatus = @PeriodStatus
		, @PProdID = @ProdID
		, @PLocation = @LO
		, @PSortExpr = 'Account'
		;

SELECT	Accountid, COAID,AcctDescription,Acct
		,COAString,TransactionCode
		,LineDescription,ThirdParty
		,VendorName,TransactionNumber,[Source],ClosePeriod
		,DocumentNo,DocDate
		,Amount
		,BeginingBal,CheckNumber,null as PoNumber
 from @Return
 order by acct, COAString

	  end
GO