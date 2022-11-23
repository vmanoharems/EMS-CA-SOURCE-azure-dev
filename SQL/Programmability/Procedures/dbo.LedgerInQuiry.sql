SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[LedgerInQuiry] -- LedgerInQuiry 1,'',60,'','','','','','',null,null,'','','','',''
	--@Companyid int,	@PeriodStatus nvarchar(50),	@ProdId int,
	--@EFDateFrom date,@EFDateTo Date,@Batch nvarchar(200),@CreatedBy nvarchar(50),@TrStart int,@Trend int ,@UserID int
--declare 
@Companyid int = null,
@PeriodStatus nvarchar(50)='',
@ProdId int = null,
@EFDateFrom date = '',
@EFDateTo Date ='',
@Batch nvarchar(200)='',
@CreatedBy nvarchar(50)='',
@TrStart int = null,
@Trend int = null,

@DocumentNo varchar(100)='',
@TT varchar(50)='',
@VendorFrom varchar(50)='',
@VendorTo varchar(50)='',
@Location varchar(50)='',
@AccountFrom varchar(50)='',
@AccountTo varchar(50)=''

AS
BEGIN
	SET NOCOUNT ON;

--	declare @CompanyCode varchar(10),@fiscalDate date;
--	set @CompanyCode= (select CompanyCode from company where Companyid=@Companyid);
--	set @fiscalDate=  (select FiscalStartdate from company where Companyid=@Companyid);

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
		,@PSortExpr = 'Account'

	  end
GO