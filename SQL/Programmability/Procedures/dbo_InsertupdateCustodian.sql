SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertupdateCustodian]
	-- Add the parameters for the stored procedure here
	@CustodianID int,
	@CustodianCode nvarchar(50),
	@Currency nvarchar(50),
	@VendorID int,
	@COAID int,
	@COACode nvarchar(100),
	@Setid int,
	@SeriesID int,
	@Prodid int,
	@CompanyID int,
	@Createdy int,
	@Status bit
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@CustodianID=0)
	begin

	INSERT INTO [dbo].[Custodian]
           ([CustodianCode],[Currency],[VendorID],[COAID],[COACode],[Setid],[SeriesID],[Prodid],[CompanyID],[CreatedDate],[Createdy]
		   ,Status
           )
     VALUES
	 (
	 @CustodianCode,@Currency,@VendorID,@COAID,@COACode,@Setid,@SeriesID,@Prodid,@CompanyID,GETDATE(),@Createdy,@Status
	 )
	set @CustodianID=SCOPE_IDENTITY()
	 end
	 else
	 begin
	 update [dbo].[Custodian] set [CustodianCode]=@CustodianCode,[Currency]=@Currency,[VendorID]=@VendorID,[COAID]=@COAID,
	 [COACode]=@COACode,[Setid]=@Setid,[SeriesID]=@SeriesID,[Prodid]=@Prodid,[CompanyID]=@CompanyID,
	 [Modifieddate]=GETDATE(),[Modifiedby]=@Createdy,Status=@Status where CustodianID=@CustodianID
	 
	 end
	 select @CustodianID
END



GO