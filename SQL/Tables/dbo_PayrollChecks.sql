CREATE TABLE [dbo].[PayrollChecks] (
  [CheckID] [int] IDENTITY,
  [PdfCheckNum] [varchar](100) NULL,
  [PayrollUserID] [int] NULL,
  [CheckPDF] [nvarchar](max) NULL,
  [PayrollFileID] [int] NULL
)
GO