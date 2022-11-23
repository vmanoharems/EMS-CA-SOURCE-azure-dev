SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[GetVendorByTransactionNo]
(@TransactionNo int )

RETURNS varchar(100)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @sourceTable varchar(50);
	declare @RefNo int;
 
    declare @VendorID int;
	 declare @VendorName varchar(100);

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

   select @VendorName=VendorName from tblVendor where VendorID=@VendorID;

	RETURN (@VendorName)

END



GO