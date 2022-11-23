CREATE PROCEDURE [dbo].[UpdatePO]
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

--@CurrentBalance varchar(50),
--@NewItemamount varchar(50),
--@Newbalance varchar(50),

@BatchNumber varchar(50),
@ClosePOuponPayment bit,
@Payby varchar(50),
@Status varchar(50),
@CreatedBy int,
@ProdID int,
@PODate date,
@ClosePeriodId int
--,@Amount decimal(18,2)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	declare @COCode varchar(50);
	select @COCode=CompanyCode from Company where ProdID=@ProdID and CompanyID=@CompanyID;

	update PurchaseOrder set 
		CompanyID=@CompanyID
		, VendorID=@VendorID
		, VendorName=@VendorName
		, ThirdParty=@ThirdParty
		, WorkRegion=@WorkRegion
		, Description=@Description
		-- There should be no updates to amounts directly again the PO header. The updates should all cascade from PO Lines
		--, AdjustmentTotal=@AdjustmentTotal
		--, RelievedTotal=@RelievedTotal
		--, BalanceAmount=@BalanceAmount
		, ClosePOuponPayment=@ClosePOuponPayment
		, Payby=@Payby
		, ModifiedDate=CURRENT_TIMESTAMP
		, ModifiedBy=@CreatedBy
		, PODate=@PODate
		, COCode=@COCode
		, ClosePeriodId=@ClosePeriodId
		, Status=@Status
	where POID=@POID;
		
	select @POID;

END

GO