CREATE PROCEDURE [dbo].[InsertupdateInvoiceLine]
 @InvoiceLineID int,
 @InvoiceID int,
 @COAID int,
 @Amount decimal(18,2),
 @LineDescription nvarchar(100),
 @InvoiceLinestatus nvarchar(100),
 @COAString nvarchar(200),
 @Transactionstring nvarchar(200),
 @Polineid int,
 @CreatedBy int,
 @ProdID int,
 @PaymentID int,
 @SetId int,
 @SeriesId int,
 @ClearedFlag bit
 ,@TaxCode nvarchar(50)
AS
BEGIN

	declare @tblInvoiceResult as [UpsertResult_InvoiceLine];
	declare @POLineStatus varchar(50) = 'Partial'; -- Default to closing the PO Line
	declare @POID int;

	-- Upsert on the Invoice table based upon the InvoiceLineID
	Merge dbo.InvoiceLine as target
		using (select @InvoiceLineID,@InvoiceID,@COAID,@Amount,@LineDescription,@InvoiceLinestatus,@COAString,@Transactionstring,@Polineid,@CreatedBy,@ProdID,@PaymentID,@SetId,@SeriesId
			,@ClearedFlag,@TaxCode)
		as source
			(InvoiceLineID,InvoiceID,COAID,Amount,LineDescription,InvoiceLinestatus,COAString,Transactionstring,Polineid,CreatedBy,ProdID,PaymentID,SetId,SeriesId
			,ClearedFlag,TaxCode)
		on (target.InvoiceLineID = source.InvoiceLineID and target.ProdID = source.ProdID)
	when matched then
		Update  set COAID = source.COAID, Amount = source.Amount, LineDescription = source.LineDescription, InvoiceLinestatus = source.InvoiceLineStatus, COAString = source.COAString
			, Transactionstring = source.TransactionString, Polineid = source.POLineID, ModifiedDate = getdate(), ModifiedBy = source.CreatedBy, PaymentID = source.PaymentID
			, SetId = source.SetID, SeriesId = source.SeriesID, ClearedFlag = source.ClearedFlag, TaxCode = source.TaxCode
	when not matched then
		Insert (InvoiceID,COAID,Amount,LineDescription,InvoiceLinestatus,COAString,Transactionstring,Polineid,CreatedDate,CreatedBy,ProdID,
			PaymentID,SetId,SeriesId,ClearedFlag,TaxCode)
		values (source.InvoiceID,source.COAID,source.Amount,source.LineDescription,source.InvoiceLinestatus,source.COAString,source.Transactionstring,source.Polineid,getdate(),source.CreatedBy
			,source.ProdID,source.PaymentID,source.SetId,source.SeriesId,source.ClearedFlag,source.TaxCode)
	output $action, inserted.* into @tblInvoiceResult;

	select * from @tblInvoiceResult;

	if (@ClearedFlag = 1) set @POLineStatus = 'PendingClose';

	;with POLSum as -- Update the Purchase Order Line amounts
	(
		select POLineID
			, ProdID
			, sum(case when InvoiceLineStatus = 'Posted' then Amount else 0.00 end) as RelievedPosted
			, sum(case when InvoiceLineStatus <>'Posted' then Amount else 0.00 end) as RelievedNotPosted
			, sum(Amount)as RelievedTotal
			, count(POLineID) as RelievedInvoiceCount
		from InvoiceLine IL
		where IL.POLineID = @POLineID and IL.ProdID = @ProdID
		group by IL.POLineID, IL.ProdID
	) 
	UPDATE POL 
		set POL.POLineStatus = @POLineStatus
		, POL.RelievedAmount = POLSum.RelievedTotal
		, POL.AvailToRelieve = (case when @ClearedFlag = 1 then 0.00 else 
			case when POL.Amount < POLSum.RelievedTotal then 0 else POL.Amount - POLSum.RelievedTotal end end)
	from PurchaseOrderLine POL 
	join POLSum on POL.POLineID = POLSum.POLineID and POLSum.ProdID = POL.ProdID
	;

	exec APIAPPO_UpdatePOHeaderfromLines @POID, @ProdID, default

	--; with POSum as -- Update the Purchase Order Header amounts
	--(
	--	select POL.POID
	--		, POL.ProdID
	--		, sum(RelievedAmount) as RelievedTotal
	--	from PurchaseOrderLine POL
	--	where POL.POID = @POID and POL.ProdID = @ProdID
	--	group by POL.POID, POL.ProdID
	--)
	--Update PO
	--	set PO.RelievedTotal = POSum.RelievedTotal
	--	, PO.BalanceAmount = case when PO.OriginalAmount < POSum.RelievedTotal then 0 else PO.OriginalAmount - POSum.RelievedTotal end
	--	, PO.Status = case when PO.OriginalAmount < POSum.RelievedTotal then 'Closed' else PO.Status end
	--from PurchaseOrder PO
	--join POSum on POSum.POID = PO.POID and POSum.ProdID = PO.ProdID
	--;

END