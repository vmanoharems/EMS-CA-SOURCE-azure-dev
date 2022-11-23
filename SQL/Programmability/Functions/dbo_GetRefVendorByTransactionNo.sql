SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE FUNCTION [dbo].[GetRefVendorByTransactionNo]
(@TransactionNo int )

RETURNS varchar(100)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @sourceTable varchar(50);
	declare @RefNo int;
 
	declare @VendorName varchar(100);

    select @sourceTable=SourceTable,@RefNo=ReferenceNumber from JournalEntry where TransactionNumber=@TransactionNo

    if(@sourceTable='Payment')
    begin
    
	declare @Inv int;
    select @Inv=InvoiceId from PaymentLine where PaymentId=@RefNo; 
   select @VendorName=VendorName from Invoice where Invoiceid=@Inv;
 
   end
   else if(@sourceTable='Invoice')
   begin
    select @VendorName=VendorName from Invoice where Invoiceid=@RefNo;
   end
    else if(@sourceTable='PettyCash')  
   begin
   declare @VendorID int;
     select @VendorID=VendorID from PCEnvelopeLine where PCEnvelopeID=@RefNo;
	 select @VendorName=VendorName from Invoice where Invoiceid=@Inv;
   end

	RETURN (@VendorName)

END



GO