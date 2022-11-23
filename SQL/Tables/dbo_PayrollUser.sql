CREATE TABLE [dbo].[PayrollUser] (
  [PayrollUserID] [int] IDENTITY,
  [Expensecount] [int] NULL,
  [UnionName] [varchar](100) NULL,
  [UnionCode] [varchar](100) NULL,
  [JobTitle] [varchar](100) NULL,
  [FirstName] [varchar](100) NULL,
  [LastName] [varchar](100) NULL,
  [SSN] [varchar](100) NULL,
  [TotalPaymentAmount] [decimal](18, 2) NULL,
  [CheckNumber] [varchar](100) NULL,
  [EmployeeId] [varchar](50) NULL,
  [PayrollFileID] [int] NULL,
  [CreatedDate] [datetime] NULL,
  [ModifiedDate] [datetime] NULL,
  [Createdby] [int] NULL,
  [Modifiedby] [int] NULL,
  CONSTRAINT [PK_PayrollUser] PRIMARY KEY CLUSTERED ([PayrollUserID])
)
GO