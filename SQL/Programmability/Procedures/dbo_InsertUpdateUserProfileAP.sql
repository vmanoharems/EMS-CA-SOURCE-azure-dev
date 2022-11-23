SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateUserProfileAP] --  InsertUpdateUserProfileAP 1 ,01
	       @UserProfileAPID int,
           @Company nvarchar(50),
           @Currency nvarchar(50),
           @BankInfo nvarchar(50),
		   @PaymentType nvarchar(50),
           @FromDate datetime,
           @ToDate datetime,
           @Vendor nvarchar(50),
           @BatchNumber nvarchar(50),
           @UserID nvarchar(50),
           @ProdId int,
		   @APType nvarchar(50), 
           @CreatedBy nvarchar(50),
           @CreatedDate datetime

        --   @ModifiedBy int,
         --  @ModifiedDate datetime
AS
BEGIN

  declare @Cnt int;
  select @Cnt=count(*) from UserProfileAP where APType=@APType and UserID =@UserID;

IF (@Cnt=0)
BEGIN

INSERT INTO [dbo].[UserProfileAP]
           ( --[UserProfileAPID]
            [Company]  
           ,[Currency]
           ,[BankInfo]
		   ,[PaymentType]
           ,[FromDate]
           ,[ToDate]
           ,[Vendor]
           ,[BatchNumber]
           ,[UserID]
           ,[ProdId]
		   ,[APType]
           ,[CreatedBy]
           ,[CreatedDate]
                          )
     VALUES(@Company,@Currency,@BankInfo,@PaymentType,@FromDate,@ToDate,@Vendor,@BatchNumber,@UserID,@ProdId,@APType,@CreatedBy,getdate())
	 end   
	 else 
	 BEGIN
	 Update UserProfileAP 
		Set 
	
		Company = @Company,
		Currency = @Currency,
		BankInfo = @BankInfo,
		PaymentType = @PaymentType,
		FromDate = @FromDate,
		ToDate = @ToDate,
		Vendor =@Vendor,
		BatchNumber = @BatchNumber,
		UserID = @UserID,
		ProdId = @ProdId,
		APType = @APType,
		ModifiedBy = @CreatedBy ,
		ModifiedDate = getdate()

		where   ProdId = @ProdId and APType=@APType and UserID =@UserID;

END
END



GO