CREATE TABLE [dbo].[CountryState] (
  [ID_CS] [int] IDENTITY,
  [CountryID] [int] NULL,
  [StateID] [int] NULL,
  [StateType] [varchar](50) NULL,
  [StateName] [varchar](100) NULL,
  [StateCode] [varchar](20) NULL,
  CONSTRAINT [PK_CountryState] PRIMARY KEY CLUSTERED ([ID_CS])
)
GO