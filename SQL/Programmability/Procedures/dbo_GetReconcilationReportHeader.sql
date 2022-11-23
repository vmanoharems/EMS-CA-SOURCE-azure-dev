SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetReconcilationReportHeader]
(
@ReconcilationID int,
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
	
select a.ReconcilationID,b.BranchNumber as BankCode,c.AccountCode as CashAccount,
a.StatementEndingAmount,CONVERT(varchar(10),a.StatementDate,103) as StatementDate
,CONVERT(varchar(10),(a.CompleteDatet)-cast(@tz as datetime),103) as FinilizedDate,isnull(d.Email,'') As Email,d.Name,e.CompanyName
 from BankReconcilation as a 
inner join BankInfo as b on a.BankID=b.BankId
inner join AccountClearing as c on a.BankID=c.BankId and c.AccountName='CashAccount'
inner join Company as e on b.CompanyId=e.CompanyID
left join CAUsers as d on a.CompleteBy=d.UserID
where a.ReconcilationID=@ReconcilationID


END


select * from BankReconcilation


GO