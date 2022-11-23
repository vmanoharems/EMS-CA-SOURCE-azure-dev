CREATE PROCEDURE [dbo].[SaveUpdatePO]
(
@POID int,
@PONumber varchar(50),
@CompanyID int,
@VendorID int,
@VendorName varchar(100),
@ThirdParty bit,
@WorkRegion varchar(50),
@Description varchar(50),
@OriginalAmount decimal(18,2),
@AdjustmentTotal decimal(18,2),
@RelievedTotal decimal(18,2),
@BalanceAmount decimal(18,2),
@BatchNumber varchar(50),
@ClosePOuponPayment bit,
@Payby varchar(50),
@Status varchar(50),
@CreatedBy int,
@ProdID int,
@PODate date,
--@Amount decimal(18,2),
@ClosePeriodId int
,@RequiredTaxCode bit
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	declare @COCode varchar(50);
	select @COCode=CompanyCode from Company where ProdID=@ProdID and CompanyID=@CompanyID;
	
	insert into PurchaseOrder (PONumber,CompanyID,VendorID,VendorName,ThirdParty,WorkRegion,Description,OriginalAmount,AdjustmentTotal
	,RelievedTotal,BalanceAmount,BatchNumber,ClosePOuponPayment,Payby,Status,CreatedDate,CreatedBy,ProdID,PODate,COCode,
	ClosePeriodId,RequiredTaxCode) values
	(
	@PONumber,@CompanyID,@VendorID,@VendorName,@ThirdParty,@WorkRegion,@Description,@OriginalAmount,@AdjustmentTotal
	,@RelievedTotal
	,@OriginalAmount--@BalanceAmount
	,@BatchNumber,@ClosePOuponPayment,@Payby,@Status,CURRENT_TIMESTAMP,@CreatedBy,@ProdID,@PODate,@COCode
	,@ClosePeriodId,@RequiredTaxCode
	)
	
	select @@IDENTITY;

END

GO