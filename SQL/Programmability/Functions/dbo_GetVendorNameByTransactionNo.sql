SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[GetVendorNameByTransactionNo]
(@TransactionNo int )

RETURNS int
AS
BEGIN
	-- Declare the return variable here
	DECLARE @sourceTable varchar(50);
	declare @RefNo int;
 
    declare @VendorID int;

	set @VendorID=0;
   select @sourceTable=SourceTable,@RefNo=ReferenceNumber from JournalEntry where TransactionNumber=@TransactionNo

   if(@sourceTable='Payment')
   begin
    
	declare @Inv int;
    select @Inv=InvoiceId from PaymentLine where PaymentId=@RefNo; 
   select @VendorID=VendorID from Invoice where Invoiceid=@Inv;
 
   end
   else if(@sourceTable='Invoice')
   begin
    select @VendorID=VendorID from Invoice where Invoiceid=@RefNo;
   end
    else if(@sourceTable='PettyCash')  
   begin
     select @VendorID=VendorID from PCEnvelopeLine where PCEnvelopeID=@RefNo;
   end

	RETURN (@VendorID)

END



GO