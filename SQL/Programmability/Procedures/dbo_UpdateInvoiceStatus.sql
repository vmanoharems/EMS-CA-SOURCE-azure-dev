SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[UpdateInvoiceStatus] --UpdateInvoiceStatus 7,1,3
	@InvoiceId int,
	@CreatedBy int,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	begin transaction
		update Invoice set InvoiceStatus='Posted' where Invoiceid = @InvoiceId
		update InvoiceLine set InvoiceLinestatus='Posted' where Invoiceid = @InvoiceId

		declare @JEId int;
		select @JEId=JournalEntryId 
			From JournalEntry
		where Source='AP' 
			and SourceTable='Invoice'
			and AuditStatus='Saved'
			and ReferenceNumber = @InvoiceId

		update JournalEntry set AuditStatus='Posted', PostedDate=getdate(),modifiedDate=GETDATE() where JournalEntryId=@JEId;

		;with POLSum as -- Update the Purchase Order Line amounts
		(
			select POLineID
				, ProdID
				, sum(case when InvoiceLineStatus = 'Posted' then Amount else 0.00 end) as RelievedPosted
				, sum(case when InvoiceLineStatus <>'Posted' then Amount else 0.00 end) as RelievedNotPosted
				, sum(Amount)as RelievedTotal
				, count(POLineID) as RelievedInvoiceCount
			from InvoiceLine IL
			where IL.InvoiceID = @InvoiceID and IL.ProdID = @ProdID
			group by IL.POLineID, IL.ProdID
		) 
		UPDATE POL 
			set POL.POLineStatus = 
				case when POL.Amount <= POLSum.RelievedTotal then 'Closed' else POL.POLineStatus end
			, POL.RelievedTotal = POLSum.RelievedTotal
			, POL.DisplayAmount = POL.AvailToRelieve 
		from PurchaseOrderLine POL 
		join POLSum on POL.POLineID = POLSum.POLineID and POLSum.ProdID = POL.ProdID
		;

	commit transaction

declare @InvoiceNo nvarchar(100),@TransactionNo nvarchar(100)
set @InvoiceNo=(select InvoiceNumber from Invoice where Invoiceid=@InvoiceId)
set @TransactionNo=(select TransactionNumber from JournalEntry where JournalEntryId=@JEId)

select @InvoiceNo as InvoiceNo,@TransactionNo as TransactionNo
END

GO