SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateVendorInfo]   -- InsertUpdateVendorInfo 1
(
 @vendorInfoId int,
 @VendorID int,
 @ContactInfoType nvarchar(50),
 @VendorContInfo nvarchar(50),
 @CreatedBy int,
 @ProdID int)

AS
BEGIN
 If (@vendorInfoId=0)
 begin
	SET NOCOUNT ON;
	INSERT INTO [dbo].[VendorInfo]
           (
		     [VendorID]
            ,[ContactInfoType]
		   ,[VendorContInfo]
           ,[CreatedDate]
           ,[CreatedBy]         
           ,[ProdID])
		       values
           (
		   @VendorID,
           @ContactInfoType,
           @VendorContInfo,
           Getdate(),
           @CreatedBy ,      
           @ProdID)

           End
		   End
		 --  Else
		 --  Begin

   --if not exists (select *  from VendorInfo where ContactInfoType = @ContactInfoType and VendorID=@VendorID)
   -- UPDATE [dbo].[VendorInfo]
   --   SET 
   --    [ContactInfoType] = @ContactInfoType
   --   ,[VendorContInfo] = @VendorContInfo 
   --   ,[ModifiedDate] = Getdate()
   --   ,[ModifiedBy] = @CreatedBy
   --   ,[ProdID] = @ProdID
	  --  Where VendorID=@VendorID 

		 --  End
		 --  End


GO