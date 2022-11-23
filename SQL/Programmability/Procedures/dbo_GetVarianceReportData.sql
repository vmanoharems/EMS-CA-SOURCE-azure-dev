SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


-- =============================================
CREATE PROCEDURE [dbo].[GetVarianceReportData] --- exec GetVarianceReportData 1,1,1
(
@BudgetID int,
@BudgetFileID int,
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @tz varchar(50);
	if exists(select * from TimeZone)
	  begin
	    select @tz=TimeDifference from TimeZone	;
	 end
	else
	  begin
	   set @tz='07:00';
	 end 

 select c.AccountCode ,c.AccountName, convert(varchar(10),(a.SaveDate)-cast(@tz as datetime),101) as SaveDate,a.EFCOLD,a.EFCNEW,
 a.Period,(a.EFCNEW-a.EFCOLD) as Change ,a.ID
  from Variance as a inner join COA as b on a.COAID=b.COAID
 inner join TblAccounts as c on b.AccountId=c.AccountId
 where a.BudgetID=@BudgetID and a.BudgetFileID=@BudgetFileID
 group by c.AccountCode,c.AccountName, a.SaveDate,a.EFCOLD,a.EFCNEW,a.Period,a.ID 

END




GO