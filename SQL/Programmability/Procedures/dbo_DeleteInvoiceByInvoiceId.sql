SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[DeleteInvoiceByInvoiceId]
	-- Add the parameters for the stored procedure here
	@InvoiceId int
	,@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @InvoiceStatus nvarchar(50)
	set @InvoiceStatus=(select InvoiceStatus from Invoice where Invoiceid=@InvoiceId)


DECLARE @PolineId int
declare @Amount decimal(18,2)
DECLARE CurUpdatePOline CURSOR FOR  

select Polineid,Amount from InvoiceLine where InvoiceID=@InvoiceId and Polineid>0

OPEN CurUpdatePOline   
FETCH NEXT FROM CurUpdatePOline INTO @PolineId,@Amount

WHILE @@FETCH_STATUS = 0   
BEGIN  


if(@InvoiceStatus='Pending')
begin
 update PurchaseOrderLine  set 
		AvailToRelieve=AvailToRelieve+@Amount where 
		POlineID=@POLineId and ProdID=@ProdID;
end
else
begin


	  update PurchaseOrderLine  set 
		RelievedTotal=RelievedTotal+@Amount
		,Amount=Amount+@Amount
		 where 
		POlineID=@POLineId and ProdID=@ProdID;

end

 FETCH NEXT FROM CurUpdatePOline INTO @PolineId,@amount
     
END   

CLOSE CurUpdatePOline   
DEALLOCATE CurUpdatePOline
END
------------------------------------------------- Delete 

delete from InvoiceLine where InvoiceID=@InvoiceId
delete from Invoice where InvoiceID=@InvoiceId

--------------------------------------------------
declare @JEId int

set @JEId=(select  JournalEntryId from JournalEntry where ReferenceNumber=1 and Source='AP' and SourceTable='Invoice')
delete from JournalEntry where JournalEntryId=@JEId
delete from JournalEntryDetail where JournalEntryId=@JEId





GO