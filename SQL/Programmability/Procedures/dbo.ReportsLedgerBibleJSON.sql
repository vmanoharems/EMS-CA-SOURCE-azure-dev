CREATE PROCEDURE [dbo].[ReportsLedgerBibleJSON]
	-- Add the parameters for the stored procedure here
 @JSONparameters nvarchar(max)	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 --declare @JSONparameters nvarchar(max)='{"BiblePeportDate":"09/03/2017","BibleFilterCompany":["1"],"BibleFilterLocation":"","BibleFilterSet":null,"BibleFilterProject":"","BibleFilterCurrency":"USD","BibleFilterCreatedFrom":"","BibleFilterCreatedTo":"","Bible":{"objLBible":{"Companyid":1,"ProdId":"14","LO":""},"ObjRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170903","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2","SClassification":"Company,Location,Detail"}},"ProdId":"14"}';
-- exec ReportsLedgerBibleReportsJSON '{"BiblePeportDate":"09/03/2017","BibleFilterCompany":["1"],"BibleFilterLocation":"","BibleFilterSet":null,"BibleFilterProject":"","BibleFilterCurrency":"USD","BibleFilterCreatedFrom":"","BibleFilterCreatedTo":"","Bible":{"objLBible":{"Companyid":1,"ProdId":"14","LO":""},"ObjRD":{"ProductionName":"EMS-Feature","Company":"","Batch":"VV170903","UserName":"59","Segment":"CO,LO,DT","SegmentOptional":"Set","TransCode":"FF1,FF2","SClassification":"Company,Location,Detail"}},"ProdId":"14"}'
if ISJSON(@JSONparameters) is null return


declare @Companyid int =replace(replace(replace(isnull(JSON_query(@JSONparameters,'$.BibleFilterCompany'),-1),'[',''),']',''),'"','');
declare @PeriodIdfrom int=isnull(JSON_value(@JSONparameters,'$.BibleFilterCreatedFrom'),-1);
declare	@PeriodIdTo int=isnull(JSON_value(@JSONparameters,'$.BibleFilterCreatedTo'),-1);
declare @ProdId int	=isnull(JSON_value(@JSONparameters,'$.ProdId'),-1);
declare @LO nvarchar(100) =isnull(JSON_value(@JSONparameters,'$.BibleFilterLocation'),-1);




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
	EXEC [dbo].[LedgerSharedJSON] @PCompanyID = @CompanyID
		, @PPeriodStatus = @PeriodStatus
		, @PProdID = @ProdID
		, @PLocation = @LO
		, @PSortExpr = 'Account'
		, @PJSON = default
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
	
END
GO