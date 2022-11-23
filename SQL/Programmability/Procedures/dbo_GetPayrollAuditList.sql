SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollAuditList]  --exec [GetPayrollAuditList] 1,1
(
@CompanyID int,
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @tz varchar(50);
	if exists(select * from TimeZone where UserID=@UserID)
	begin
	select @tz=TimeDifference from TimeZone where UserID=@UserID 	
	end
	else
	begin
	set @tz='00:00'
	end 

   select a.PayrollFileID, a.LoadNumber,Convert(varchar(10),(a.CreatedDate)-cast(@tz as datetime),101)as CreatedDate ,b.CompanyCode,isnull(Convert(varchar(10)
   ,a.TransactionDate,101) ,'')as TransactionDate
   ,isnull(Convert(varchar(10),a.EndDate,101),'') as EndDate,isnull(TotalPayrollAmount,0) as TotalPayrollAmount,a.PayrollCount,
   a.PostedFlag,a.InvoiceRef# as Reff,a.InvoicedFlag,a.PrintStatus,a.Status,a.InvoiceNumber as InvoiceNumber
   
    from PayrollFile as a inner join Company as b
   on a.CompanyID=b.CompanyID 
    where a.CompanyID=@CompanyID and a.Status not in ('Obtained','Post','VOIDED') 
	order by a.InvoiceNumber desc

END



GO