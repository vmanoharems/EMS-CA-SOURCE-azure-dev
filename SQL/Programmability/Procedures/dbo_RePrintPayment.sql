SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


-- =============================================
CREATE PROCEDURE [dbo].[RePrintPayment] -- RePrintPayment 2,'YES','AA160614',3,1
(
@PaymentID int,
@BatchNumber varchar(100),
@ProdID int,
@UserID int
)
AS
BEGIN

	SET NOCOUNT ON;

	declare @NewCheckNumber int;
	declare @BankID int;
	declare @NewPaymentID int;


	select @BankID=BankId from Payment where PaymentId=@PaymentID;

	select @NewCheckNumber=max(cast(CheckNumber as int)+1) from Payment where BankId=@BankID;

   insert into Payment (GroupNumber,VendorId,PaidAmount,CheckDate,CheckNumber,BankId,Status,PaymentDate,Memo,BatchNumber,
   ProdId,CreatedBy,CreatedDate)
   select GroupNumber,VendorId,PaidAmount,CheckDate,@NewCheckNumber,BankId,'Issued',CURRENT_TIMESTAMP,Memo,@BatchNumber,
   ProdId,@UserID,CURRENT_TIMESTAMP from Payment where PaymentId=@PaymentID;

   set @NewPaymentID=@@IDENTITY;

   insert into PaymentLine (PaymentId,InvoiceId,InvoiceAmount,CreatedBy,CreatedDate,ProdId,BankID,CheckNumber)
   select @NewPaymentID,InvoiceId,InvoiceAmount,@UserID,CURRENT_TIMESTAMP,ProdId,BankID,@NewCheckNumber
    from PaymentLine where PaymentId=@PaymentID;

	declare @CheckRun int;

		select @CheckRun=CheckRunID from CheckRun where Status='WORKING' and ProdID=@ProdID
		insert into CheckRunAddon (CheckRunID,PaymentID,CheckNo,Status) values
		(@CheckRun,@NewPaymentID,@NewCheckNumber,'WORKING')

		select 1;

END



GO