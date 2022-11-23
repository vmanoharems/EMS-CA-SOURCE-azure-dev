SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- LedgerInQuiryTransaction 1,'',14,'09/01/2015','12/30/2017','','',0,0,'','','','','','',''

CREATE PROCEDURE [dbo].[LedgerInQuiryTransaction] 
(
@Companyid int,
@PeriodStatus nvarchar(50),
@ProdId int,
@EFDateFrom date,
@EFDateTo Date,
@Batch nvarchar(200),
@CreatedBy nvarchar(50),
@TrStart int,
@Trend int,

@DocumentNo varchar(100),
@TT varchar(50),
@VendorFrom varchar(50),
@VendorTo varchar(50),
@Location varchar(50),
@AccountFrom varchar(50),
@AccountTo varchar(50)
)

AS
BEGIN
	SET NOCOUNT ON;

	declare @CompanyCode varchar(10),@fiscalDate date;
	set @CompanyCode= (select CompanyCode from company where Companyid=@Companyid);
	set @fiscalDate=  (select FiscalStartdate from company where Companyid=@Companyid);


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

	   , TransactionNumber int
	   , [Source] varchar(10)
	   , ClosePeriod int
	   , DocumentNo varchar(100)
	   , DocDate varchar(100)
	   
	   , [Description] varchar(1000)
	   , CheckNumber varchar(100)
	   , Amount money

	   , BeginingBal decimal(18,2)

	   , Location varchar(100)
	   , TaxCode varchar(50)
);

Insert into @Return
EXEC	[dbo].[LedgerShared]
		@PCompanyid = @CompanyID,
		@PPeriodStatus = @PeriodStatus,
		@PProdId = @ProdID,
		@PEFDateFrom = @EFDateFrom,
		@PEFDateTo = @EFDateTo,
		@PBatch = @Batch,
		@PCreatedBy = @CreatedBy,
		@PTrStart = @TRStart,
		@PTrend = @TREnd,
		@PDocumentNo = @DocumentNo,
		@PTT = @TT,
		@PVendorFrom = @VendorFrom,
		@PVendorTo = @VendorTo,
		@PLocation = @Location,
		@PAccountFrom = @AccountFrom,
		@PAccountTo = @AccountTo
		,@PSortExpr = ''


SELECT	Accountid, COAID,AcctDescription,Acct
		,COAString,TransactionCode
		,LineDescription,ThirdParty
		,VendorName
		,RefVendor
		,VendorID
		,BatchNumber
		,TransactionNumber,[Source],ClosePeriod
		,DocumentNo,DocDate
		,[Description],Checknumber as CheckNumner
		,Amount
		,BeginingBal,CheckNumber
		,Location
		,TaxCode
 from @Return;



	  end










GO