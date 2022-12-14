CREATE TABLE [dbo].[BankInfo] (
  [BankId] [int] IDENTITY,
  [Bankname] [nvarchar](50) NOT NULL,
  [CompanyId] [int] NOT NULL,
  [Address1] [nvarchar](50) NOT NULL,
  [Address2] [nvarchar](50) NULL,
  [Address3] [nvarchar](50) NULL,
  [city] [nvarchar](50) NULL,
  [State] [nvarchar](50) NULL,
  [zip] [nvarchar](10) NULL,
  [Country] [nvarchar](50) NULL,
  [RoutingNumber] [nvarchar](50) NULL,
  [AccountNumber] [nvarchar](50) NULL,
  [BranchNumber] [nvarchar](50) NULL,
  [Branch] [nvarchar](50) NULL,
  [Clearing] [int] NULL,
  [Cash] [int] NULL,
  [Suspense] [int] NULL,
  [Bankfees] [int] NULL,
  [Deposits] [int] NULL,
  [SourceCodeID] [int] NULL,
  [CurrencyID] [int] NULL,
  [Status] [bit] NULL,
  [PostiivePay] [bit] NULL,
  [Prodid] [int] NOT NULL,
  [CreatedDate] [datetime] NOT NULL,
  [ModifiedDate] [datetime] NULL,
  [CreatedBy] [int] NOT NULL,
  [ModifiedBy] [int] NULL,
  CONSTRAINT [PK_Bankinfo] PRIMARY KEY CLUSTERED ([BankId])
)
GO