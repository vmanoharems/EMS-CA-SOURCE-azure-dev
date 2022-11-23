SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

Create FUNCTION [dbo].[CheckPOLineInInvoice] 
(@POLineID int)
RETURNS varchar(50)
AS
BEGIN 
Declare @TransString varchar(10)
declare @OutputString varchar(50)
       

set @OutputString='';


 select @OutputString=isnull(ClearedFlag,0) from InvoiceLine where Polineid=@POLineID

RETURN(@OutputString)
END
GO