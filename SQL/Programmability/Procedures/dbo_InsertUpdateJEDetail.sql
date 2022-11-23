SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertUpdateJEDetail]
	-- Add the parameters for the stored procedure here
			@JournalEntryId int
			,@JournalEntryDetailId int
           ,@TransactionLineNumber nvarchar(20)
           ,@COAId int
           ,@DebitAmount decimal(18,2)
           ,@CreditAmount decimal(18,2)
           ,@VendorId int
           ,@VendorName nvarchar(50)
           ,@ThirdParty bit
           ,@Note nvarchar(200)
           ,@CompanyId int
           ,@ProdId int
           ,@CreatedBy int
           ,@COAString nvarchar(400)
           ,@TransactionCodeString nvarchar(400)
		   ,@SetId int,@SeriesId int,
		   @TaxCode nvarchar(50)
AS
BEGIN
	SET NOCOUNT ON;	


if(@JournalEntryDetailId=0)
	begin

		INSERT INTO [dbo].[JournalEntryDetail]
				   ([JournalEntryId],[TransactionLineNumber],[COAId],[DebitAmount],[CreditAmount],[VendorId]
				   ,[VendorName],[ThirdParty],[Note],[CompanyId],[ProdId],[CreatedDate],[CreatedBy]
				   ,[COAString],[TransactionCodeString],SetId,SeriesId,TaxCode)
			 VALUES
				   (@JournalEntryId,@TransactionLineNumber,@COAId,@DebitAmount,@CreditAmount,@VendorId,@VendorName,
				   @ThirdParty,@Note,@CompanyId,@ProdId,GETDATE(),@CreatedBy,@COAString,@TransactionCodeString,@SetId,@SeriesId,@TaxCode)
	end
else
	begin
		update  [dbo].[JournalEntryDetail] set [COAId]=@COAId,[DebitAmount]=@DebitAmount,[CreditAmount]=@CreditAmount
			,[VendorId]=@VendorId,[VendorName]=@VendorName,[ThirdParty]=@ThirdParty,[Note]=@Note,[ModifiedBy]=@CreatedBy,[ModifiedDate]=GETDATE()
			,[COAString]=@COAString,[TransactionCodeString]=@TransactionCodeString,SetId=@SetId,SeriesId=@SeriesId,TaxCode=@TaxCode
		where JournalEntryDetailId=@JournalEntryDetailId
	end
END

select TransactionNumber from JournalEntry where JournalEntryId=@JournalEntryId
GO