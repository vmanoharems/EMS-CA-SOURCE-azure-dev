SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[InsertUpdateJEByInvoice2]  -- InsertUpdateJEByInvoice2 1
	-- Add the parameters for the stored procedure here
	@InvoiceId int
	
AS
BEGIN
	
	SET NOCOUNT ON;

    -- Insert statements for procedure here

declare @BankId int ,@CompanyId int,@COA int,@coaString nvarchar(max)
	
	,@TransactionNumber int,@Description nvarchar(200),@BatchNumber nvarchar(12),
	@ProdId int,@CreatedBy int,@closePeriod int,@jouralentryId int,@vendorId int,@ThirdParty bit,@VendorName nvarchar(50)
	,@CurrentBalance decimal(18,2),@TotalLineCount int,@status nvarchar(50),@AccountClearingType nvarchar(50),@DocumentNo nvarchar(100)
	
	

	select  @VendorName= VendorName,@vendorId=VendorID,@ThirdParty=ThirdParty,@closePeriod=ClosePeriodId,@CreatedBy=CreatedBy,
	@BatchNumber=BatchNumber,@ProdId=ProdId,
	@Description=Description,@CompanyId=CompanyId,@BankId=BankId
	,@CurrentBalance=CurrentBalance 
	,@status=InvoiceStatus,@DocumentNo=InvoiceNumber
	 from Invoice where Invoiceid=@InvoiceId;


	
	if not exists( select * from JournalEntry where ReferenceNumber=@InvoiceId and Source='AP' and SourceTable='Invoice')
	begin
	
	if  exists(select * from JournalEntry )
	begin
	set @TransactionNumber=(SELECT isnull(max(cast(transactionNumber as int)),0) from JournalEntry);
	end
	else 
	begin
	set @TransactionNumber=1;
	end
	insert into JournalEntry (TransactionNumber,Source,Description,EntryDate,DebitTotal,CreditTotal,TotalLines,
	ImbalanceAmount,AuditStatus,ReferenceNumber,BatchNumber,ProdId,CreatedDate,createdBy,ClosePeriod,CompanyId,SourceTable,DocumentNo )
	values(@TransactionNumber+1,'AP',@Description,GETDATE(),@CurrentBalance,@CurrentBalance,@TotalLineCount,0.00,
	'Saved',@InvoiceId,@BatchNumber,@ProdId,GETDATE(),@CreatedBy,@closePeriod,@CompanyId,'Invoice',@DocumentNo )

	set @jouralentryId=SCOPE_IDENTITY()
	end
	else
	begin
	set @jouralentryId=(select top 1 JournalEntryId From JournalEntry where ReferenceNumber=@InvoiceId and Source='AP' and SourceTable='Invoice' order by JournalEntryId desc)
	declare @JEStatus nvarchar(50),@postedDate datetime 
	if(@status='Pending')
	begin
	set @JEStatus='Saved'
	set @postedDate=null
	end
	else
	begin
	set @JEStatus='Posted'
	set @postedDate=GETDATE()
	end
	update JournalEntry set  [Description]=@Description,[DebitTotal]=@CurrentBalance,[CreditTotal]=@CurrentBalance
	,[TotalLines]=@TotalLineCount,[ImbalanceAmount]=0.00,[AuditStatus]=@JEStatus,[PostedDate]= @postedDate,[modifiedDate]=GETDATE(),
	[modifiedBy]=@CreatedBy,[ClosePeriod]=@closePeriod
    ,[CompanyId]=@CompanyId where JournalEntryId=@jouralentryId

	delete from JournalEntryDetail where JournalEntryId=@jouralentryId
	end

	-------------------------------------------------JE Line-----------------------------------------------------

	insert into JournalEntryDetail (JournalEntryId,
	TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,ThirdParty,Note,ProdId,CreatedDate,
	CreatedBy,COAString,TransactionCodeString,SetId,SeriesId,CompanyId)
	select @jouralentryId,@TransactionNumber+1,COAID,Amount,0.00,@vendorId,@VendorName,@ThirdParty,LineDescription,@ProdId,GETDATE(),
	@CreatedBy,COAString,Transactionstring,SetId,SeriesId,@CompanyId
	 from InvoiceLine where InvoiceID=@InvoiceId
	
	-------------------------------------------------JE Line Bank-----------------------------------------------------

	declare @DAmount decimal(18,2),@ACCoAString nvarchar(300)
	set @DAmount=(select sum(DebitAmount) from JournalEntryDetail where JournalEntryId=@jouralentryId)

	select @coa=COAId,@AccountClearingType=ClearingType,@ACCoAString=accountcode from AccountClearing where BankId=@BankId and CompanyId=@CompanyId and AccountName='APClearing' ;
	set @coaString=(select AccountCode from TblAccounts where AccountId=@coa)

	if(@AccountClearingType='COA')
	begin
		insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,
		Note,CompanyID,	ProdId,CreatedDate,CreatedBy,COAString
	)
	values(@jouralentryId,@TransactionNumber+1,@COA,0.00,@DAmount,'CashAccount',@CompanyID,@ProdId,GETDATE(),@CreatedBy,@ACCoAString)
	end
	else
	begin
	                    --------------------Cursor for Bank Detail Account ------------------------
	DECLARE @InvoiceLineId int
	declare @CoaId int
	declare @CoaIdNew int
	declare @ParentCode nvarchar(200)
	DECLARE c1 CURSOR FOR  
	select InvoiceLineID,COAID from InvoiceLine where InvoiceID=@InvoiceId
	
OPEN c1   
FETCH NEXT FROM c1 INTO @InvoiceLineId ,@CoaId

WHILE @@FETCH_STATUS = 0   
BEGIN  


set @ParentCode=( select ParentCode from COA where COAID=@CoaId);

set @CoaIdNew=(select COAID  from COA  where Accountid=@coa  and Parentcode=@ParentCode);

set @ParentCode=( select COACOde  from COA  where Accountid=@coa  and Parentcode=@ParentCode);

	insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,
	
	Note,CompanyID,ProdId,CreatedDate,CreatedBy,COAString
	)
	select @jouralentryId,@TransactionNumber+1,@CoaIdNew,0.00,Amount,'CashAccount',

	@CompanyID,@ProdId,GETDATE(),@CreatedBy,@ParentCode
	 from InvoiceLine where InvoiceLineID=@InvoiceLineId

       FETCH NEXT FROM c1 INTO @InvoiceLineId ,@CoaId
END   

CLOSE c1   
DEALLOCATE c1
	end
-------------------------------------------------Update Record-----------------------------------------------------

	update JournalEntry set TotalLines=(select count (*) from JournalEntryDetail where JournalEntryId=@jouralentryId) where JournalEntryId=@jouralentryId;

END








GO