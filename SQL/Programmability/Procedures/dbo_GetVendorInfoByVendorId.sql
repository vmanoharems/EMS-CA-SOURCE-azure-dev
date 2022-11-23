SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetVendorInfoByVendorId] 
@VendorID int,
@ProdID int
AS
BEGIN

	SET NOCOUNT ON;
	SELECT [VendorID]
      ,[ContactInfoType]
      ,[VendorContInfo]
      ,[CreatedDate]
      ,[CreatedBy]
      ,[ModifiedDate]
      ,[ModifiedBy]
      ,[ProdID]
  FROM [dbo].[VendorInfo]
  where VendorID = @VendorID and ProdID = @ProdID
END



GO