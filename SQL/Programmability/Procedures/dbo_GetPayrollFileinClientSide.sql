SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollFileinClientSide]  ---exec GetPayrollFileinClientSide 1
(
	@CompanyCode varchar(50),
	@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CompanyID int;

	select @CompanyID=CompanyID from Company where CompanyCode=@CompanyCode and ProdID=@ProdID;

select convert(varchar(10),CreatedDate,101) as FileDate ,convert(varchar(10),EndDate,101)as PeriodEnd,PayrollCount
,LoadNumber,TotalPayrollAmount,PayrollFileID
,InvoiceNumber 
 from PayrollFile where CompanyID=@CompanyID  and ProdID=@ProdID and Status='Obtained' order by LoadNumber desc

END



GO