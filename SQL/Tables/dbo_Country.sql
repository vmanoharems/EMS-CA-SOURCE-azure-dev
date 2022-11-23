CREATE TABLE [dbo].[Country] (
  [CountryID] [int] NOT NULL,
  [CountryCode] [varchar](4) NULL,
  [CountryName] [varchar](100) NULL,
  [Capital] [nvarchar](50) NULL,
  [Internet] [nvarchar](10) NULL,
  [STDCode] [nvarchar](10) NULL,
  CONSTRAINT [PK_Country] PRIMARY KEY CLUSTERED ([CountryID])
)
GO