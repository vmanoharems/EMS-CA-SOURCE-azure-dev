SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertPayment]
	-- Add the parameters for the stored procedure here
	
	@GroupNumber nvarchar(2)
           ,@VendorId int ,
           @PaidAmount decimal(18,2),
           @CheckDate datetime,
           @CheckNumber nvarchar(50),
           @BankId int,
           @Status nvarchar(50),
           @PayBy nvarchar(50),
           @PaymentDate datetime,
           @Memo nvarchar(200),
           @BatchNumber nvarchar(12),
           @ProdId int ,
           @CreatedBy int
           
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO [dbo].[Payment]
           ([GroupNumber]
           ,[VendorId]
           ,[PaidAmount]
           ,[CheckDate]
           ,[CheckNumber]
           ,[BankId]
           ,[Status]
           ,[PayBy]
           ,[PaymentDate]
           ,[Memo]
           ,[BatchNumber]
           ,[ProdId]
           ,[CreatedBy]
           ,[CreatedDate]
         )
     VALUES
           (@GroupNumber   ,@VendorId  ,
           @PaidAmount ,
           @CheckDate ,
           @CheckNumber ,
           @BankId ,
           @Status ,
           @PayBy ,
           @PaymentDate ,
           @Memo ,
           @BatchNumber ,
           @ProdId  ,
           @CreatedBy,getdate() )

		   select SCOPE_IDENTITY ()
END



GO