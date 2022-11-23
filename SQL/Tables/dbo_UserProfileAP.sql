CREATE TABLE [dbo].[UserProfileAP] (
  [UserProfileAPID] [int] IDENTITY,
  [Company] [nvarchar](50) NULL,
  [Currency] [nvarchar](50) NULL,
  [BankInfo] [nvarchar](50) NULL,
  [PaymentType] [nvarchar](50) NULL,
  [FromDate] [datetime] NULL,
  [ToDate] [datetime] NULL,
  [Vendor] [nvarchar](50) NULL,
  [BatchNumber] [nvarchar](50) NULL,
  [UserID] [nvarchar](50) NULL,
  [ProdId] [int] NULL,
  [APType] [nvarchar](50) NULL,
  [CreatedBy] [nvarchar](50) NULL,
  [CreatedDate] [datetime] NULL,
  [ModifiedBy] [int] NULL,
  [ModifiedDate] [datetime] NULL,
  CONSTRAINT [PK_UserProfileAP] PRIMARY KEY CLUSTERED ([UserProfileAPID])
)
GO