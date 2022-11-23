SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetUserProfileInfoByProdid]
@ProdId int,
@APType nvarchar(50),
@UserID int
AS
BEGIN

	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT [UserProfileAPID]
      ,[Company]
      ,[Currency]
      ,[BankInfo]
      ,[PaymentType]
     , convert(varchar(10), [FromDate],101) as FromDate
     , convert(varchar(10) , [ToDate] ,101) as ToDate
      ,[Vendor]
      ,[BatchNumber]
      ,[UserID]
      ,[ProdId]
      ,[APType]
      ,[CreatedBy]
      ,[CreatedDate]
      ,[ModifiedBy]
      ,[ModifiedDate]
  FROM [dbo].[UserProfileAP]
  where ProdId = @ProdId and APType = @APType and UserID =@UserID
END



GO