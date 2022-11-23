SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[INVOICEJETHROUGHPAYROLL]
(
@PayrollFileID int,
@UserID int,
@ProdId int,
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
	declare @JournalEntryID int;
	declare @InvoiceNumber varchar(100);
	declare @companyID int;
	declare @InvoiceID int;


	select @TransNo=isnull(max(cast(TransactionNumber as int)),0) from JournalEntry;

	select @InvoiceNumber=InvoiceNumber,@companyID=CompanyID from PayrollFile where PayrollFileID=@PayrollFileID
	
	select @DebitAmt=sum(cast(PaymentAmount as decimal(18,2))) from PayrollExpensePost where PayrollFileID=@PayrollFileID 

	select @DebitLines=count(*) from PayrollExpensePost where PayrollFileID=@PayrollFileID

	 select @LaborClearing= isnull(count(*),0)
     from PayrollExpensePost as a inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID and a.AccountNumber not like '%99'

     select @FringeClearing=isnull(count(*),0) from PayrollExpensePost as a
     inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID
     and a.AccountNumber like '%99'

	 select @LaborClearingAmt= isnull(sum(cast(a.PaymentAmount as float)),0)
     from PayrollExpensePost as a inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID and a.AccountNumber not like '%99'

     select @FringeClearingAmt= isnull(sum(cast(a.PaymentAmount as float)),0) from PayrollExpensePost as a
     inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID
     and a.AccountNumber like '%99'


	  SELECT @BatchNumber=BatchNumber FROM BatchNumbers  where ProdId=@ProdId and UserId=@UserID and Status=1

	 insert into JournalEntry (TransactionNumber,Source,Description,EntryDate,DebitTotal,CreditTotal,TotalLines,ImbalanceAmount,AuditStatus
	 ,PostedDate,BatchNumber,ProdId,CreatedDate,createdBy) values
 	 (@TransNo+1,'PR','EMS',CURRENT_TIMESTAMP,@DebitAmt,@DebitAmt,@DebitLines+@LaborClearing+@FringeClearing,0,'Saved',CURRENT_TIMESTAMP,
	  @BatchNumber,@ProdId,CURRENT_TIMESTAMP,@UserID
	 )

	set @JournalEntryID=@@IDENTITY;

	insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,ThirdParty,Note,
	CompanyId,ProdId,CreatedDate,CreatedBy,COAString,TransactionCodeString,SetId,SeriesId)
	select @JournalEntryID,@TransNo+1,b.COAID,a.PaymentAmount,0,@VendorID,'',0,'',@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,a.SegmentStr1,a.TransactionStr1,
	a.SetID,a.SeriesID
	 from PayrollExpensePost as a left join COA as b on a.SegmentStr1=b.COACode where PayrollfileID=@PayrollFileID and
	b.ProdId=@ProdId;

	-----------------------------Clearing Account-----------------------------------------------------------------------
	 declare @LaborClearingAccountCnt int;
	 declare @FringeClearingAccountCnt int;
	 declare @COAIDLabor int;
	 declare @COAIDFringe int;

	
   select @LaborClearingAccountCnt=count(*) from AccountClearing where Type='Payroll' and AccountName='Labor' and CompanyId=@companyID and ProdId=@ProdId;
   select @FringeClearingAccountCnt=count(*) from AccountClearing where Type='Payroll' and AccountName='Fringe' and CompanyId=@companyID and ProdId=@ProdId;

   select @COAIDLabor=COAId from AccountClearing where Type='Payroll' and AccountName='Labor' and CompanyId=@companyID and ProdId=@ProdId;
   select @COAIDFringe=COAId from AccountClearing where Type='Payroll' and AccountName='Fringe' and CompanyId=@companyID and ProdId=@ProdId;
   

   if(@LaborClearingAccountCnt>0)
   begin

   insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,ThirdParty,Note,
	CompanyId,ProdId,CreatedDate,CreatedBy,COAString,TransactionCodeString,SetId,SeriesId) values
	(@JournalEntryID,@TransNo+1,@COAIDLabor,0,@LaborClearingAmt,@VendorID,'',0,'',@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,'','',
	'','')
   end

   
    if(@FringeClearingAccountCnt>0)
   begin

   insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,ThirdParty,Note,
	CompanyId,ProdId,CreatedDate,CreatedBy,COAString,TransactionCodeString,SetId,SeriesId) values
	(@JournalEntryID,@TransNo+1,@COAIDFringe,0,@FringeClearingAmt,@VendorID,'',0,'',@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,'','',
	'','')
   end

	-------------------------we need to insert 2 credit line after clearation from Jared------------------------------


	insert into Invoice (InvoiceNumber,CompanyID,VendorID,VendorName,ThirdParty,WorkRegion,Description,OriginalAmount,CurrentBalance,
	NewItemamount,Newbalance,BatchNumber,InvoiceDate,Payby,InvoiceStatus,CreatedDate,CreatedBy,ProdID,Amount) values
	(
	@InvoiceNumber,@companyID,@VendorID,'',0,'','',@DebitAmt,@DebitAmt,0.00,0.00,@BatchNumber,CURRENT_TIMESTAMP,'Check','Saved',
	CURRENT_TIMESTAMP,@UserID,@ProdId,@DebitAmt
	)

	set @InvoiceID=@@IDENTITY;


	--insert into InvoiceLine(InvoiceID,COAID,Amount,LineDescription,InvoiceLinestatus,COAString,Transactionstring,CreatedDate,CreatedBy,ProdID,PaymentID,SetId,SeriesId)
	-- select @InvoiceID,b.COAID,a.PaymentAmount,'','Saved',a.SegmentStr1,a.TransactionStr1,CURRENT_TIMESTAMP,@UserID,@ProdId,0,	a.SetID,a.SeriesID
	-- from PayrollExpensePost as a left join COA as b on a.SegmentStr1=b.COACode where PayrollfileID=@PayrollFileID and
	--b.ProdId=@ProdId;

	-----------------------------Clearing Account-----------------------------------------------------------------------

   if(@LaborClearingAccountCnt>0)
   begin

  insert into InvoiceLine(InvoiceID,COAID,Amount,LineDescription,InvoiceLinestatus,COAString,Transactionstring,CreatedDate,CreatedBy
  ,ProdID,PaymentID,SetId,SeriesId) values
	(@InvoiceID,@COAIDLabor,@LaborClearingAmt,'','Saved','','',CURRENT_TIMESTAMP,@UserID,@ProdId,0,	'','')	 
   end

   
    if(@FringeClearingAccountCnt>0)
   begin

   insert into InvoiceLine(InvoiceID,COAID,Amount,LineDescription,InvoiceLinestatus,COAString,Transactionstring,CreatedDate,CreatedBy
  ,ProdID,PaymentID,SetId,SeriesId) values
	(@InvoiceID,@COAIDFringe,@FringeClearingAmt,'','Saved','','',CURRENT_TIMESTAMP,@UserID,@ProdId,0,	'','')	 
   end

	-------------------------we need to insert 2 credit line after clearation from Jared------------------------------



	

	select 1 as Result1,2 as result2

END



/****** Object:  StoredProcedure [dbo].[InsertUpdateJEPCEnvelope]    Script Date: 05/10/2016 5:45:20 PM ******/
SET ANSI_NULLS ON



GO