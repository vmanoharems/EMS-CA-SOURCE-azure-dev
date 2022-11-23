SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE FUNCTION [dbo].[GetCheckAmount]
(@CheckNo varchar(100), @BankID int)

RETURNS Decimal(18,2)
AS
BEGIN
	
	DECLARE @Amount decimal(18,2)
 
   select  @Amount=isnull(sum(cast(PaidAmount as float)),0)
     from Payment where BankId=@BankID and CheckNumber=@CheckNo and PaidAmount>0


	-- Return the result of the function
	RETURN (@Amount)

END

 

GO