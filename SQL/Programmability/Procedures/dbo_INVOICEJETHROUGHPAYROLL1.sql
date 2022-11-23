SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[INVOICEJETHROUGHPAYROLL1]
(
@PayrollFileID int,
@UserID int,
@ProdId int,
@JournalEntryID int,
@VendorID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	
	declare @TransNo int;
	declare @DebitAmt decimal(18,2);
	declare @DebitLines int;
	declare @CreditLines int;
	declare @LaborClearing int;
	declare @FringeClearing int;
    declare @LaborClearingAmt decimal(18,2);
	declare @FringeClearingAmt decimal(18,2);
	declare @BatchNumber varchar(100);
	declare @InvoiceNumber varchar(100);
	declare @companyID int;
	declare @InvoiceID int;
	declare @LoadNo varchar(50);
    Declare @INvoiceHeaderDescription varchar(50);
	Declare @InvoiceLinedescription varchar(50);

	select @LoadNo=LoadNumber from PayrollFile where PayrollFileID=@PayrollFileID;
	select @InvoiceLinedescription=CONVERT(char(10), Enddate,126)+' | ' from PayrollFile where PayrollFileID=@PayrollFileID;

	select @TransNo=TransactionNumber from JournalEntry where JournalEntryId=@JournalEntryID;

	select @InvoiceNumber=InvoiceNumber,@companyID=CompanyID from PayrollFile where PayrollFileID=@PayrollFileID
	
	select @DebitAmt=sum(cast(PaymentAmount as decimal(18,2))) from PayrollExpensePost where PayrollFileID=@PayrollFileID 

    SELECT @BatchNumber=BatchNumber FROM PayrollFile  where ProdId=@ProdId and PayrollFileID=@PayrollFileID

	 declare @PayrollFilePeriod varchar(10);
	 select @PayrollFilePeriod = PeriodStatus, @companyID=CompanyID from PayrollFile where PayrollFileID=@PayrollFileID

	 Declare @ClosePID int;
	 set @ClosePID=dbo.GetCurrentOpenPeriodID(@companyID,default);
	 if @PayrollFilePeriod = 'Future'
	 begin
		set @ClosePID = @ClosePID + 1
	 end

-----------------------------------------
	declare @BankID int;
	select @BankID= DefaultBankId from PayrollBankSetup where DefaultCompanyID=@companyID;

	set @INvoiceHeaderDescription=(select  'Payroll For '+Projectcode+' - '+CONVERT(char(10), Enddate,126)  from Payrollfile  where payrollfileid=@PayrollFileID);

	insert into Invoice (InvoiceNumber,VendorID,CompanyID,OriginalAmount,CurrentBalance,
	NewItemamount,Newbalance,BatchNumber,InvoiceDate,Payby,InvoiceStatus,CreatedDate,CreatedBy,ProdID,Amount,ThirdParty,BankId,Description,ClosePeriodid) values
	(
	@InvoiceNumber,@VendorID,@companyID,@DebitAmt,@DebitAmt,0.00,0.00,@BatchNumber,CURRENT_TIMESTAMP,'Check','Pending',
	CURRENT_TIMESTAMP,@UserID,@ProdId,@DebitAmt,0,@BankID,@INvoiceHeaderDescription,@ClosePID);
	set @InvoiceID=@@IDENTITY;


   insert into InvoiceLine(InvoiceID,COAID,Amount,InvoiceLinestatus,COAString,CreatedDate,CreatedBy,ProdID,PaymentID,ClearedFlag,LineDescription) 

   select @InvoiceID,COAId,CreditAmount,'Pending',COAString,CURRENT_TIMESTAMP,@UserID,@ProdId,0,0,@InvoiceLinedescription+Note
    from JournalentryDetail where JournalEntryID=@JournalEntryID and ProdId=@ProdId 
   and CreditAmount>0

   ------------JE CreATION

 
   exec InsertUpdateJEByInvoice2 @InvoiceID;
   -------eND je cREATION

	-------------------------we need to insert 2 credit line after clearation from Jared------------------------------

	declare @TransNo1 varchar(100);

	select @TransNo1=TransactionNumber from JournalEntry where JournalEntryId=@JournalEntryID;

	select @InvoiceID as InvoiceID, @InvoiceNumber as Result1,@TransNo1 as Result2

END
GO