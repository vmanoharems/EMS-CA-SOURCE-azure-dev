CREATE PROCEDURE [dbo].[ReportsLedgerInQuiryAccountJSON]
@JSONparameters as varchar(8000)
AS
BEGIN
	SET NOCOUNT ON;
	if ISJSON(@JSONparameters) is null return;

	declare @reportParameters varchar(8000) = @JSONparameters; --JSON_QUERY(@JSONparameters,'$.reportparameters'); -- Start by pulling the reportparameters from the JSON

	declare	@Companyid int = isnull(JSON_VALUE(@reportParameters,'$.LIFilterCompany'),-1);
	declare	@PeriodStatusFrom nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.LET_Period_No_From'),'');
	declare	@PeriodStatusTo nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.LET_Period_No_To'),'');
	declare @PeriodStatus nvarchar(50) = '';
	declare	@ProdId int = isnull(JSON_VALUE(@reportParameters,'$.objLInquiry.ProdId'),-1);
	declare	@EFDateFrom date = isnull(JSON_VALUE(@reportParameters,'$.EFDateFrom'),'2017-01-01'); 
	declare	@EFDateTo date = isnull(JSON_VALUE(@reportParameters,'$.EFDateTo'), getdate()); 
	--declare	@Batch nvarchar(200) = Replace(Replace(Replace(isnull(JSON_QUERY(@@reportParameters,'$.Batchnumber'),''),'[',''),']',''),'"','''');
	--declare @CreatedBy nvarchar(50) = Replace(Replace(isnull(JSON_VALUE(@@reportParameters,'$.CreatedBy'),''),'[',''),']','');
	declare	@TrStart int = isnull(JSON_VALUE(@reportParameters,'$.TrStart'),-1);
	declare	@Trend int = isnull(JSON_VALUE(@reportParameters,'$.Trend'),-1);
	declare	@DocumentNo nvarchar(100) = Replace(Replace(isnull(JSON_QUERY(@reportParameters,'$.DocumentNo'),''),'[',''),']','');
	declare	@TT nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.TT'),'');
	declare	@VendorFrom nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.VendorFromL'),'');
	declare	@VendorTo nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.VendorToL'),'');
	declare	@Location nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.LIFilterLocation'),'');
	declare	@AccountFrom nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.AcNoFromL'),'');
	declare	@AccountTo nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.AcNoToL'),'');

	declare @LedgInqBatch varchar(max) = JSON_QUERY(@reportParameters,'$.LedgInqBatch');
	declare @LedgInqUserName varchar(max) = JSON_QUERY(@reportParameters,'$.LedgInqUserName');

	declare @SortExpr varchar(10) = isnull(JSON_VALUE(@reportParameters,'$.SortOrder'),'');

	declare @CompanyCode varchar(10),@fiscalDate date;
	set @CompanyCode= (select CompanyCode from company where Companyid=@Companyid);
	set @fiscalDate=  (select FiscalStartdate from company where Companyid=@Companyid);

EXEC [dbo].[LedgerSharedJSON] 
	@PCompanyid = @CompanyID,
	@PPeriodStatus = @PeriodStatus,
	@PProdId = @ProdID,
	@PEFDateFrom = @EFDateFrom,
	@PEFDateTo = @EFDateTo,
	@PBatch = @LedgInqBatch,
	@PCreatedBy = @LedgInqUserName,
	@PTrStart = @TRStart,
	@PTrend = @TREnd,
	@PDocumentNo = @DocumentNo,
	@PTT = @TT,
	@PVendorFrom = @VendorFrom,
	@PVendorTo = @VendorTo,
	@PLocation = @Location,
	@PAccountFrom = @AccountFrom,
	@PAccountTo = @AccountTo,
	@PSortExpr = @SortExpr--'Account',
	,@PJSON = @JSONparameters
end
GO