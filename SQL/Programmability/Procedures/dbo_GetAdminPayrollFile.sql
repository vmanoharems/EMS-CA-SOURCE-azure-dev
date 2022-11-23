SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetAdminPayrollFile]  ---   exec GetAdminPayrollFile 60
(
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select a.PayrollFileID, a.LoadNumber,Convert(varchar(10),a.CreatedDate,101)as CreatedDate
	,a.InvoiceNumber as InvoiceNumber,PrintStatus,b.CompanyCode,isnull(Convert(varchar(10),a.TransactionDate,101) ,'')as TransactionDate
	,isnull(Convert(varchar(10),a.EndDate,101),'') as EndDate,isnull(TotalPayrollAmount,0) as TotalPayrollAmount
	,cast(case when I.InvoiceID is null then 0 else 1 end as bit) as InvoicedFlag
	from PayrollFile as a 
	join Company as b on a.CompanyID=b.CompanyID
	left join Invoice I on a.InvoiceNumber = I.InvoiceNumber
	where a.ProdID=@ProdID
	--and a.Status='Obtained' 
	order by a.PayrollFileID desc

END





GO