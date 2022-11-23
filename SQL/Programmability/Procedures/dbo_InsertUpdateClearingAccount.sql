SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateClearingAccount]
	-- Add the parameters for the stored procedure here
	@AccountClearingId int,
	@Type nvarchar(50),@AccountName nvarchar(50),@COAId int ,@CompanyId int,@BankId int,@CreatedBy int,@ProdId int,
	@AccountCode nvarchar(50),@ClearingType nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@AccountClearingId=0)
	begin
	INSERT INTO [dbo].[AccountClearing](
	[Type],[AccountName],[COAId],[CompanyId],[BankId],[CreatedDate],[CreatedBy],ProdId,AccountCode,ClearingType)
     VALUES
           (@Type,@AccountName,@COAId,@CompanyId,@BankId,GETDATE(),@CreatedBy,@ProdId,@AccountCode,@ClearingType)

		   set @AccountClearingId= SCOPE_IDENTITY ()
		   end
		   else
		   begin

		   UPDATE [dbo].[AccountClearing]
   SET [Type] = @Type
      ,[AccountName] = @AccountName
      ,[COAId] = @COAId
      ,[CompanyId] = @CompanyId
      ,[BankId] = @BankId
      ,[ModifyDate] = GETDATE()
      ,[ModifyBy] = @CreatedBy
	  ,AccountCode=@AccountCode
	  ,ClearingType=@ClearingType
 WHERE AccountClearingId =@AccountClearingId

 
 end

 select @AccountClearingId
END



GO