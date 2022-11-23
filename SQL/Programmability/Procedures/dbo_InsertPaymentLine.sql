SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertPaymentLine]
	-- Add the parameters for the stored procedure here
@PaymentId int 
           ,@InvoiceId int 
           ,@InvoiceAmount decimal(18,2)
           ,@CreatedBy int
           
          
           ,@ProdId  int
		   AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO [dbo].[PaymentLine]([PaymentId]
           ,[InvoiceId],[InvoiceAmount],[CreatedBy],[CreatedDate],[ProdId])
     VALUES
           (@PaymentId,@InvoiceId,@InvoiceAmount,@CreatedBy,GETDATE(),@ProdId
		   )
END



GO