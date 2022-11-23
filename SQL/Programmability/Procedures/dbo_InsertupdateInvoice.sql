SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[InsertupdateInvoice]
	-- Add the parameters for the stored procedure here
	@Invoiceid int,
	@InvoiceNumber nvarchar(200),
	@CompanyID int,
	@VendorID int,
	@VendorName nvarchar(200),
	@ThirdParty bit,
	@WorkRegion nvarchar(50),
	@Description nvarchar(50),
	@OriginalAmount decimal(18, 2),
	@CurrentBalance decimal(18, 2),
	@NewItemamount decimal(18, 2) ,
	@Newbalance  decimal(18, 2),
	@BatchNumber nvarchar(50),
	@BankId int,
	@InvoiceDate datetime,
	@Duedate datetime,
	@CheckGroupnumber nvarchar(50),
	@Payby nvarchar(50),
	@InvoiceStatus nvarchar(50),
	@CreatedBy int,
	@ProdID int ,
	@Amount decimal(18,2)
	,@ClosePeriodId int
	,@RequiredTaxCode bit
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@Invoiceid=0)
	begin
	INSERT INTO [dbo].[Invoice]
           ([InvoiceNumber],[CompanyID],[VendorID],[VendorName],[ThirdParty],[WorkRegion],[Description]
           ,[OriginalAmount] ,[CurrentBalance],[NewItemamount],[Newbalance],[BatchNumber],[BankId]
           ,[InvoiceDate],[Duedate],[CheckGroupnumber],[Payby],[InvoiceStatus],[CreatedDate]
           ,[CreatedBy],[ProdID],Amount,ClosePeriodId,RequiredTaxCode,MirrorStatus)
     VALUES
           (@InvoiceNumber ,@CompanyID ,@VendorID,@VendorName,@ThirdParty,@WorkRegion,@Description,@OriginalAmount,@CurrentBalance
		   ,@NewItemamount,@Newbalance,@BatchNumber,@BankId,@InvoiceDate,@Duedate,@CheckGroupnumber,@Payby,@InvoiceStatus,
		   GETDATE(),@CreatedBy,@ProdID,@Amount,@ClosePeriodId,@RequiredTaxCode,0)

		   select @Invoiceid= SCOPE_IDENTITY()
		   end
		   else
		   begin
		   update Invoice set  [InvoiceNumber]=@InvoiceNumber--,[CompanyID]=@CompanyID
		   ,[VendorID]=@VendorID,
		   [VendorName]=@VendorName,
		  [ThirdParty]=@ThirdParty,
		  --[WorkRegion]=@WorkRegion,
		  [Description]=@Description
           ,[OriginalAmount]=@OriginalAmount ,
		   [CurrentBalance]=@CurrentBalance, --[NewItemamount]=@NewItemamount,[Newbalance]=@Newbalance,
		   [BatchNumber]=@BatchNumber,
		   [BankId]=@BankId,
           [InvoiceDate]=@InvoiceDate,[Duedate]=@Duedate,[CheckGroupnumber]=@CheckGroupnumber,
		   [Payby]=@Payby,[InvoiceStatus]=@InvoiceStatus,ModifiedDate=GETDATE()
           ,[ModifiedBy]=@CreatedBy,[ProdID]=@ProdID,Amount=@Amount,ClosePeriodId=@ClosePeriodId
		   ,RequiredTaxCode=@RequiredTaxCode
		    where Invoiceid=@Invoiceid
		   end

		   select @Invoiceid
END




GO