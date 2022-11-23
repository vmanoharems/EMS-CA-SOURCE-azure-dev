SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollHistory]  --exec GetPayrollHistory 1
(
@CompanyID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   select a.PayrollFileID, a.LoadNumber,Convert(varchar(10),a.CreatedDate,101)as CreatedDate ,b.CompanyCode,isnull(Convert(varchar(10)
   ,a.TransactionDate,101) ,'')as TransactionDate
   ,isnull(Convert(varchar(10),a.EndDate,101),'') as EndDate,isnull(TotalPayrollAmount,0) as TotalPayrollAmount,a.PayrollCount,
   a.PostedFlag,a.InvoiceRef# as Reff,a.InvoicedFlag,a.PrintStatus,a.Status,a.InvoiceNumber as InvoiceNumber
   
    from PayrollFile as a inner join Company as b
   on a.CompanyID=b.CompanyID 
    where a.CompanyID=@CompanyID and a.Status not in ('Obtained') order by a.LoadNumber desc

END





GO