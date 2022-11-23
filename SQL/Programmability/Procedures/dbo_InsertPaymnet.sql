SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InsertPaymnet]
(
@InvoiceId int,
@BatchNumber varchar(50),
@GroupNumber varchar(50),
@CheckDate datetime,
@CheckNumber varchar(50),
@BankId int,
@PayBy varchar(50),
@PaymentDate datetime,
@CreatedBy int,
@ProdId int,
@CheckRunID int
)
AS
BEGIN
begin transaction
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	       declare @PaymentID int; 

		   if exists(select * from Payment where CheckNumber=@CheckNumber and BankId=@BankID and ProdId=@ProdID and isdeleted = 0)
			   begin
					DECLARE @previouscheckrunID INT;
					-- Let's first check to make sure the CheckRun is the same. If it's not, this means a duplicate check number has been given and this should be rejected.
					SELECT @previouscheckrunID = CheckRunID FROM CheckRunAddon WHERE CheckNo = @CheckNumber
					IF @previouscheckrunID <> @CheckRunID
					BEGIN
						SELECT -1 AS PaymentID;
						RETURN;
					END

					declare @Amt decimal(18,2);		
					select @PaymentID=PaymentId from Payment where CheckNumber=@CheckNumber and BankId=@BankId and ProdId=@ProdId
					select @Amt=OriginalAmount from Invoice where Invoiceid=@InvoiceId and ProdID=@ProdId;
					update Payment set PaidAmount=PaidAmount+@Amt where CheckNumber=@CheckNumber and BankId=@BankId and ProdId=@ProdId
			   end
		   else
				begin
					INSERT INTO Payment (GroupNumber,VendorId,PaidAmount,CheckDate,CheckNumber,BankId,Status,PayBy,PaymentDate,Memo,BatchNumber
						,ProdId,CreatedBy,CreatedDate) 
						select @GroupNumber,VendorID,OriginalAmount,@CheckDate,@CheckNumber,@BankId,'Issued'
						,@PayBy,@PaymentDate,Description,@BatchNumber,@ProdId,@CreatedBy,CURRENT_TIMESTAMP from Invoice where Invoiceid=@InvoiceId 
						and ProdID=@ProdId;
         
					set @PaymentID=@@IDENTITY;

					insert into CheckRunAddon (CheckRunID,PaymentID,CheckNo,Status) values
						(@CheckRunID,@PaymentID,@CheckNumber,'WORKING');
				end

	INSERT INTO PaymentLine(PaymentId,InvoiceId,InvoiceAmount,CreatedBy,CreatedDate,ProdId,BankID,CheckNumber)
		select @PaymentID,@InvoiceId,OriginalAmount,@CreatedBy,CURRENT_TIMESTAMP,@ProdId,@BankId,@CheckNumber  from Invoice
		where InvoiceID=@InvoiceId and ProdID=@ProdId;

	select @PaymentID as PaymentID;
commit transaction

END
GO