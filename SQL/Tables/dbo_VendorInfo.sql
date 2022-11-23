CREATE TABLE [dbo].[VendorInfo] (
  [VendorInfoID] [int] IDENTITY,
  [VendorID] [int] NULL,
  [ContactInfoType] [nvarchar](50) NULL,
  [VendorContInfo] [nvarchar](50) NULL,
  [CreatedDate] [datetime] NULL,
  [CreatedBy] [int] NULL,
  [ModifiedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ProdID] [int] NULL
)
GO