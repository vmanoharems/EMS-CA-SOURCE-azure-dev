SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateJEPCEnvelope] -- InsertUpdateJEPCEnvelope 1
	-- Add the parameters for the stored procedure here
	@PCEnvelopeId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare
@TransactionNumber int,@Source nvarchar(50),@Desciption nvarchar(200),@DebitTotal decimal(18,2),@CreditTotal decimal(18,2),@BalanceAmount decimal(18,2),@ReferenceNumber int, @BatchNumber nvarchar(12), @ProdId int,@ClosePeriodId int, @CompanyId int,@pcenevelopeId int,
@CreatedBy int,@jouralentryId int,@Status nvarchar(50),@DocumentNo nvarchar(100)

	if not exists(select TransactionNumber from JournalEntry)
	begin
	set @TransactionNumber=1;
	end
	else
	begin
	set @TransactionNumber=(SELECT TOP 1 (cast(TransactionNumber as int)+1) FROM JournalEntry ORDER BY JournalEntryId DESC);
	end


	select @pcenevelopeId=PCEnvelopeId,@source='PC',@Desciption=Description,
	@BatchNumber=BatchNumber,@ProdId=ProdId,@ClosePeriodId=ClosePeriodId,
	@CompanyId=Companyid,@CreatedBy=createdby,@Status=Status,@DocumentNo=EnvelopeNumber from PCEnvelope where PCEnvelopeid=@PCEnvelopeId;

set @CreditTotal=(select abs(sum(Amount)) from PCEnvelopeLine where Amount <0 and PCEnvelopeID=@pcenevelopeId);
set @DebitTotal=(select  abs(sum(Amount)) from PCEnvelopeLine where Amount >0 and PCEnvelopeID=@pcenevelopeId);
set @BalanceAmount=abs(@CreditTotal-@DebitTotal);



 -------------------------------------------------JE Header-----------------------------------------------------

 if not exists(select * from journalentry where ReferenceNumber=@PCEnvelopeId and Source='PC' and SourceTable='PettyCash')
 begin

	insert into JournalEntry (TransactionNumber,Source,Description,EntryDate,
	AuditStatus,ReferenceNumber,BatchNumber,ProdId,CreatedDate,createdBy,ClosePeriod,CompanyId,SourceTable,
	CreditTotal,DebitTotal,ImbalanceAmount,DocumentNo,CurrentStatus)
	values(@TransactionNumber,@source,@Desciption,GETDATE(),
	'Saved',@pcenevelopeId,@BatchNumber,@ProdId,GETDATE(),@CreatedBy,@ClosePeriodId,@CompanyId,'PettyCash',
	@CreditTotal,@DebitTotal,@BalanceAmount,@DocumentNo,'Current')

	set @jouralentryId=SCOPE_IDENTITY()

end
else
declare @JEStatus nvarchar(50)
begin
if(@Status='Pending')
begin
set @JEStatus='Saved';
end
else
begin
set @JEStatus='Posted';
end
	set @jouralentryId=(select JournalEntryId from journalentry where ReferenceNumber=@PCEnvelopeId 
	and Source='PC' and SourceTable='PettyCash')

update JournalEntry set Description=@Desciption, 
	AuditStatus=@JEStatus,modifiedDate=GETDATE(),modifiedBy=@CreatedBy,ClosePeriod=@ClosePeriodId,CompanyId=@CompanyId,
	CreditTotal=@CreditTotal,DebitTotal=@DebitTotal,ImbalanceAmount=0.00  where JournalEntryId=@jouralentryId


	delete from JournalEntryDetail where JournalEntryId=@jouralentryId

end
 -------------------------------------------------JE Line-----------------------------------------------------

 insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,TaxCode,Note,ProdId,CreatedDate,
	CreatedBy,COAString,TransactionCodeString,SetId,SeriesId,CompanyId)
	select @jouralentryId,@TransactionNumber,COAID,
	CASE WHEN Amount<0 THEN  0.00  else abs(Amount)end as DAmount ,
	CASE WHEN Amount>0 THEN 0.00 else  abs(Amount) end as CAmount ,
	
	VendorID,null,TaxCode,LineDescription,@ProdId,GETDATE(),
	@CreatedBy,CoaString,TransactionCodeString,Setid,SeriesID,@CompanyId
	 from PCEnvelopeLine where PCEnvelopeID=@pcenevelopeId

 ------------------------------------------------- Update -----------------------------------------------------
 update JournalEntry set TotalLines=(select COUNT(*) from JournalEntryDetail where JournalEntryId=@jouralentryId) where JournalEntryId=@jouralentryId


 select @TransactionNumber;

END


/****** Object:  StoredProcedure [dbo].[InsertUpdateJEByInvoice]    Script Date: 05/10/2016 8:30:43 PM ******/
SET ANSI_NULLS ON



GO