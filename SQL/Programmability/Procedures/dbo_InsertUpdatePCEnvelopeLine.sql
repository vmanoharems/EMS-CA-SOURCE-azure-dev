SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdatePCEnvelopeLine]
	-- Add the parameters for the stored procedure here
	@EnvelopeLineID int,
	@PCEnvelopeID int,
	@TransactionLineNumber int,
	@COAID int,
	@Amount decimal(18,2),
	@VendorID int,
	--@ThirdParty bit,
	--@Iscontractor bit,
	@LineDescription nvarchar(100),
	@TransactionCodeString nvarchar(200),
	@Setid int,
	@SeriesID int,
	@Prodid int,
	@CreatedBy int,
	@CoaString nvarchar(200)
	,@TaxCode nvarchar(10)
	,@Displayflag nvarchar(20)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@VendorID=0)
	begin
	if(@Displayflag=1)
		begin
			if(@Amount>0)
				begin 
				set @VendorID=(select VendorID from Recipient where RecipientID =(select RecipientId from PCEnvelope where PcEnvelopeID=@PCEnvelopeID))
				end 
				else
				begin 
				set @VendorID=(select VendorID from Custodian where CustodianID =(select CustodianId from PCEnvelope where PcEnvelopeID=@PCEnvelopeID))
				end
		end
		else if(@Displayflag=2)
		begin
			   set @VendorID=(select VendorID from Recipient where RecipientID =(select RecipientId from PCEnvelope where PcEnvelopeID=@PCEnvelopeID))
		end
	end
	if(@EnvelopeLineID=0)
	begin
	INSERT INTO [dbo].[PCEnvelopeLine]
           ([PCEnvelopeID],[TransactionLineNumber],[COAID],[Amount],[VendorID],[LineDescription],[TransactionCodeString],[Setid],[SeriesID],[Prodid],[CreatedDate],[CreatedBy],CoaString,TaxCode,Displayflag)
		   values
		   (
		   @PCEnvelopeID,@TransactionLineNumber,@COAID,@Amount,@VendorID,@LineDescription,
		   @TransactionCodeString,@Setid,@SeriesID,@Prodid,GETDATE(),@CreatedBy,@CoaString,@TaxCode,@Displayflag
		   )

		   set @EnvelopeLineID=SCOPE_IDENTITY()
	end
	else
	begin
		   update  [dbo].[PCEnvelopeLine] set [TransactionLineNumber]=@TransactionLineNumber,[COAID]=@COAID,
		   [Amount]=@Amount,[VendorID]=@VendorID,TaxCode=@TaxCode,[LineDescription]=@LineDescription,
		   [TransactionCodeString]=@TransactionCodeString,[Setid]=@Setid,
		   [SeriesID]=@SeriesID,ModifiedBy=@CreatedBy,Modifieddate=GETDATE(),CoaString=@CoaString,[Displayflag]=@Displayflag
		   where EnvelopeLineID=@EnvelopeLineID
	end
	select @EnvelopeLineID
END
GO